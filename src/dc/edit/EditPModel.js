import EditBase from "./EditBase";
import Cesium from "cesium";
import { Dragger, Tooltip } from "../utils";
import { Circle } from "../attr";
import { Point } from "../point";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-26 13:57:57
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 09:05:50
 */
class EditPModel extends EditBase {
  constructor(entity, viewer, dataSource) {
    super(entity, viewer, dataSource);
  }
  setPositions(position) {
    this.entity.position = position;
    this.entity.modelMatrix = this.getModelMatrix();
  }
  getModelMatrix(position) {
    var cfg = this.entity.attribute.style;

    var hpRoll = new Cesium.HeadingPitchRoll(
      Cesium.Math.toRadians(cfg.heading || 0),
      Cesium.Math.toRadians(cfg.pitch || 0),
      Cesium.Math.toRadians(cfg.roll || 0)
    );
    var fixedFrameTransform = Cesium.Transforms.eastNorthUpToFixedFrame;

    var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
      position || this.entity.position,
      hpRoll,
      this.viewer.scene.globe.ellipsoid,
      fixedFrameTransform
    );
    if (cfg.scale)
      Cesium.Matrix4.multiplyByUniformScale(
        modelMatrix,
        cfg.scale,
        modelMatrix
      );
    return modelMatrix;
  }
  bindDraggers() {
    if (!this.entity.ready) {
      let that = this;
      this.entity.readyPromise.then(function (model) {
        that.bindDraggers();
      });
      return;
    }

    var that = this;

    this.entity.draw_tooltip = Tooltip.message.dragger.def;

    var dragger = Dragger.createDragger(this.dataSource, {
      dragger: this.entity,
      onDrag: function onDrag(dragger, newPosition) {
        that.entity.position = newPosition;
        that.entity.modelMatrix = that.getModelMatrix(newPosition);

        that.updateDraggers();
      },
    });

    let style = this.entity.attribute.style;

    let position = this.entity.position;
    let height = Cesium.Cartographic.fromCartesian(position).height;
    let radius = this.entity.boundingSphere.radius;

    //辅助显示：创建角度调整底部圆
    this.entityAngle = this.dataSource.entities.add({
      name: "角度调整底部圆",
      position: new Cesium.CallbackProperty(function (time) {
        return that.entity.position;
      }, false),
      ellipse: Circle.style2Entity({
        fill: false,
        outline: true,
        outlineColor: "#ffff00",
        outlineOpacity: 0.8,
        radius: radius,
        height: height,
      }),
    });

    //创建角度调整 拖拽点
    let majorPos = this.getHeadingPosition();
    let majorDragger = Dragger.createDragger(this.dataSource, {
      position: majorPos,
      type: Dragger.PointType.EditAttr,
      tooltip: Tooltip.message.dragger.editHeading,
      onDrag: function onDrag(dragger, position) {
        let heading = that.getHeading(that.entity.position, position);
        style.heading = that.formatNum(heading, 1);
        //console.log(heading);

        that.entity.modelMatrix = that.getModelMatrix();
        dragger.position = that.getHeadingPosition();
      },
    });
    this.draggers.push(majorDragger);

    //辅助显示：外接包围盒子
    //this.entityBox = this.dataSource.entities.add({
    //    name: '外接包围盒子',
    //    position: new Cesium.CallbackProperty(time => {
    //        return that.entity.position;
    //    }, false),
    //    box: {
    //        dimensions: new Cesium.Cartesian3(radius, radius, radius),
    //        fill: false,
    //        outline: true,
    //        outlineColor: Cesium.Color.YELLOW
    //    }
    //});

    //缩放控制点
    var position_scale = Point.addPositionsHeight(position, radius);
    var dragger = Dragger.createDragger(this.dataSource, {
      position: position_scale,
      type: Dragger.PointType.MoveHeight,
      tooltip: Tooltip.message.dragger.editScale,
      onDrag: function onDrag(dragger, positionNew) {
        let radiusNew = Cesium.Cartesian3.distance(positionNew, position);

        let radiusOld = dragger.radius / style.scale;
        let scaleNew = radiusNew / radiusOld;

        dragger.radius = radiusNew;
        style.scale = that.formatNum(scaleNew, 2);

        that.entity.modelMatrix = that.getModelMatrix();
        that.updateDraggers();
      },
    });
    dragger.radius = radius;
    this.draggers.push(dragger);

    //this.entityBox = this.dataSource.entities.add({
    //    name: '缩放控制点连接线',
    //    polyline: {
    //        positions: [
    //            position,
    //            position_scale
    //        ],
    //        width: 1,
    //        material: Cesium.Color.YELLOW
    //    }
    //});
  }
  destroyDraggers() {
    super.destroyDraggers();

    if (this.entityAngle) {
      this.dataSource.entities.remove(this.entityAngle);
      delete this.entityAngle;
    }
    if (this.entityBox) {
      this.dataSource.entities.remove(this.entityBox);
      delete this.entityBox;
    }
  }
  finish() {
    this.entity.draw_tooltip = null;
  }
  getHeadingPosition() {
    //创建角度调整底部圆
    var position = this.entity.position;
    var radius = this.entity.boundingSphere.radius;
    var angle = -Number(this.entity.attribute.style.heading || 0);

    var rotpos = new Cesium.Cartesian3(radius, 0.0, 0.0);

    var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    var rotationX = Cesium.Matrix4.fromRotationTranslation(
      Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(angle))
    );
    Cesium.Matrix4.multiply(mat, rotationX, mat);

    mat = Cesium.Matrix4.getRotation(mat, new Cesium.Matrix3());
    rotpos = Cesium.Matrix3.multiplyByVector(mat, rotpos, rotpos);
    rotpos = Cesium.Cartesian3.add(position, rotpos, rotpos);
    return rotpos;
  }
  getHeading(positionCenter, positionNew) {
    //获取该位置的默认矩阵
    var mat = Cesium.Transforms.eastNorthUpToFixedFrame(positionCenter);
    mat = Cesium.Matrix4.getRotation(mat, new Cesium.Matrix3());

    var xaxis = Cesium.Matrix3.getColumn(mat, 0, new Cesium.Cartesian3());
    var yaxis = Cesium.Matrix3.getColumn(mat, 1, new Cesium.Cartesian3());
    var zaxis = Cesium.Matrix3.getColumn(mat, 2, new Cesium.Cartesian3());

    //计算该位置 和  positionCenter 的 角度值
    var dir = Cesium.Cartesian3.subtract(
      positionNew,
      positionCenter,
      new Cesium.Cartesian3()
    );
    //z crosss (dirx cross z) 得到在 xy平面的向量
    dir = Cesium.Cartesian3.cross(dir, zaxis, dir);
    dir = Cesium.Cartesian3.cross(zaxis, dir, dir);
    dir = Cesium.Cartesian3.normalize(dir, dir);

    var heading = Cesium.Cartesian3.angleBetween(xaxis, dir);

    var ay = Cesium.Cartesian3.angleBetween(yaxis, dir);
    if (ay > Math.PI * 0.5) {
      heading = 2 * Math.PI - heading;
    }

    return -Cesium.Math.toDegrees(heading);
  }
}

export default EditPModel;
