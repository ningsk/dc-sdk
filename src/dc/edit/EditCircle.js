import EditPolyline from "./EditPolyline";
import { Point } from "../point";
import { Dragger, Tooltip } from "../utils";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-25 18:02:18
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 09:21:01
 */
class EditCircle extends EditPolyline {
  constructor(entity, viewer, dataSource) {
    super(entity, viewer, dataSource);
  }

  //修改坐标会回调，提高显示的效率
  changePositionsToCallback() {
    let that = this;
    this._positions_draw = this.entity._positions_draw;
    //this.entity.position = new Cesium.CallbackProperty(time => {
    //    return that.getShowPosition();
    //}, false);
  }
  //图形编辑结束后调用
  finish() {
    this.entity._positions_draw = this._positions_draw;
    //this.entity.position = this.getShowPosition();
  }
  isClampToGround() {
    return this.entity.attribute.style.clampToGround;
  }
  getPosition() {
    //加上高度
    if (this.entity.ellipse.height != undefined) {
      let newHeight = this.entity.ellipse.height.getValue();
      for (let i = 0, len = this._positions_draw.length; i < len; i++) {
        this._positions_draw[i] = Point.setPositionsHeight(
          this._positions_draw[i],
          newHeight
        );
      }
    }
    return this._positions_draw;
  }
  bindDraggers() {
    var that = this;

    var clampToGround = this.isClampToGround();
    var positions = this.getPosition();

    var diff = new Cesium.Cartesian3();
    var newPos = new Cesium.Cartesian3();
    var style = this.entity.attribute.style;

    //中心点
    var position = positions[0];
    if (clampToGround) {
      //贴地时求贴模型和贴地的高度
      position = Point.updateHeightForClampToGround(position);
      positions[0] = position;
    }

    var dragger = Dragger.createDragger(this.dataSource, {
      position: position,
      //clampToGround: clampToGround,
      onDrag: function (dragger, position) {
        Cesium.Cartesian3.subtract(position, positions[dragger.index], diff); //记录差值

        positions[dragger.index] = position;

        //============高度处理=============
        if (!style.clampToGround) {
          let height = that.formatNum(
            Cesium.Cartographic.fromCartesian(position).height,
            2
          );
          that.entity.ellipse.height = height;
          style.height = height;
        }

        //============半径同步处理=============
        Cesium.Cartesian3.add(
          dragger.majorDragger.position.getValue(),
          diff,
          newPos
        );
        dragger.majorDragger.position = newPos;

        if (dragger.minorDragger) {
          Cesium.Cartesian3.add(
            dragger.minorDragger.position.getValue(),
            diff,
            newPos
          );
          dragger.minorDragger.position = newPos;
        }

        //============高度调整拖拽点处理=============
        if (that.entity.attribute.style.extrudedHeight != undefined)
          that.updateDraggers();
      },
    });
    dragger.index = 0;
    this.draggers.push(dragger);

    //获取椭圆上的坐标点数组
    var cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions(
      {
        center: position,
        semiMajorAxis: this.entity.ellipse.semiMajorAxis.getValue(), //长半轴
        semiMinorAxis: this.entity.ellipse.semiMinorAxis.getValue(), //短半轴
        rotation: Cesium.Math.toRadians(Number(style.rotation || 0)),
        granularity: 2.0,
      },
      true,
      false
    );

    //长半轴上的坐标点
    var majorPos = new Cesium.Cartesian3(
      cep.positions[0],
      cep.positions[1],
      cep.positions[2]
    );
    if (clampToGround) {
      //贴地时求贴模型和贴地的高度
      majorPos = point.updateHeightForClampToGround(majorPos);
    }
    positions[1] = majorPos;
    var majorDragger = Dragger.createDragger(this.dataSource, {
      position: majorPos,
      type: Dragger.PointType.EditAttr,
      tooltip: Tooltip.message.dragger.editRadius,
      //clampToGround: clampToGround,
      onDrag: function (dragger, position) {
        if (that.entity.ellipse.height != undefined) {
          let newHeight = that.entity.ellipse.height.getValue();
          position = point.setPositionsHeight(position, newHeight);
          dragger.position = position;
        }
        positions[dragger.index] = position;

        var radius = that.formatNum(
          Cesium.Cartesian3.distance(positions[0], position),
          2
        );
        that.entity.ellipse.semiMajorAxis = radius;

        if (style.radius) {
          //圆
          that.entity.ellipse.semiMinorAxis = radius;
          style.radius = radius;
        } else {
          style.semiMajorAxis = radius;
        }

        if (that.entity.attribute.style.extrudedHeight != undefined)
          that.updateDraggers();
      },
    });
    majorDragger.index = 1;
    dragger.majorDragger = majorDragger;
    this.draggers.push(majorDragger);

    //短半轴上的坐标点
    if (this._maxPointNum == 3) {
      //椭圆
      //短半轴上的坐标点
      var minorPos = new Cesium.Cartesian3(
        cep.positions[3],
        cep.positions[4],
        cep.positions[5]
      );
      if (clampToGround) {
        //贴地时求贴模型和贴地的高度
        minorPos = point.updateHeightForClampToGround(minorPos);
      }
      positions[2] = minorPos;
      var minorDragger = Dragger.createDragger(this.dataSource, {
        position: minorPos,
        type: Dragger.PointType.EditAttr,
        tooltip: Tooltip.message.dragger.editRadius,
        //clampToGround: clampToGround,
        onDrag: function (dragger, position) {
          if (that.entity.ellipse.height != undefined) {
            let newHeight = that.entity.ellipse.height.getValue();
            position = Point.setPositionsHeight(position, newHeight);
            dragger.position = position;
          }
          positions[dragger.index] = position;

          var radius = that.formatNum(
            Cesium.Cartesian3.distance(positions[0], position),
            2
          );
          that.entity.ellipse.semiMinorAxis = radius;

          if (style.radius) {
            //圆
            that.entity.ellipse.semiMajorAxis = radius;
            style.radius = radius;
          } else {
            style.semiMinorAxis = radius;
          }

          if (that.entity.attribute.style.extrudedHeight != undefined)
            that.updateDraggers();
        },
      });
      minorDragger.index = 2;
      dragger.minorDragger = minorDragger;
      this.draggers.push(minorDragger);
    }

    //创建高度拖拽点
    if (this.entity.ellipse.extrudedHeight) {
      let extrudedHeight = this.entity.ellipse.extrudedHeight.getValue();

      //顶部 中心点
      let position = Point.setPositionsHeight(positions[0], extrudedHeight);
      let draggerTop = Dragger.createDragger(this.dataSource, {
        position: position,
        onDrag: function (dragger, position) {
          position = Point.setPositionsHeight(
            position,
            that.entity.ellipse.height
          );
          positions[0] = position;

          that.updateDraggers();
        },
      });
      this.draggers.push(draggerTop);

      let _pos =
        this._maxPointNum == 3 ? [positions[1], positions[2]] : [positions[1]];
      this.bindHeightDraggers(this.entity.ellipse, _pos);

      this.heightDraggers.push(draggerTop); //拖动高度时联动修改此点高
    }
  }
}

export default EditCircle;
