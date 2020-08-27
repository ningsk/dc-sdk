import EditBase from "./EditBase";
import Cesium from "cesium";
import { Dragger } from "../utils";
import { Point } from "../point";
import { Tooltip } from "leaflet";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-26 11:00:14
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-27 10:19:52
 */
class EditEllipsoid extends EditBase {
  constructor(entity, viewer, dataSource) {
    super(entity, viewer, dataSource);
  }
  _positions_draw = null;
  //修改坐标会回调，提高显示的效率
  changePositionsToCallback() {
    this._positions_draw = this.entity.position.getValue();
  }
  //图形编辑结束后调用
  finish() {
    this._positions_draw = null;
  }
  //更新半径
  updateRadii(style) {
    var radii = new Cesium.Cartesian3(
      Number(style.extentRadii),
      Number(style.widthRadii),
      Number(style.heightRadii)
    );
    this.entity.ellipsoid.radii.setValue(radii);
  }
  bindDraggers() {
    var that = this;

    var style = this.entity.attribute.style;

    //位置中心点
    var position = this.entity.position.getValue();
    var dragger = Dragger.createDragger(this.dataSource, {
      position: Point.addPositionsHeight(position, style.heightRadii),
      onDrag: function (dragger, position) {
        this._positions_draw = position;
        that.entity.position.setValue(position);

        that.updateDraggers();
      },
    });
    this.draggers.push(dragger);

    //获取椭圆上的坐标点数组
    var cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions(
      {
        center: position,
        semiMajorAxis: Number(style.extentRadii), //长半轴
        semiMinorAxis: Number(style.widthRadii), //短半轴
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
    var majorDragger = Dragger.createDragger(this.dataSource, {
      position: majorPos,
      type: Dragger.PointType.EditAttr,
      tooltip: Tooltip.message.dragger.editRadius,
      onDrag: function onDrag(dragger, position) {
        var newHeight = Cesium.Cartographic.fromCartesian(that._positions_draw)
          .height;
        position = Point.setPositionsHeight(position, newHeight);
        dragger.position = position;

        var radius = that.formatNum(
          Cesium.Cartesian3.distance(that._positions_draw, position),
          2
        );
        style.extentRadii = radius; //短半轴

        that.updateRadii(style);
        that.updateDraggers();
      },
    });
    dragger.majorDragger = majorDragger;
    this.draggers.push(majorDragger);

    //短半轴上的坐标点
    var minorPos = new Cesium.Cartesian3(
      cep.positions[3],
      cep.positions[4],
      cep.positions[5]
    );
    var minorDragger = Dragger.createDragger(this.dataSource, {
      position: minorPos,
      type: Dragger.PointType.EditAttr,
      tooltip: Tooltip.message.dragger.editRadius,
      onDrag: function (dragger, position) {
        var newHeight = Cesium.Cartographic.fromCartesian(that._positions_draw)
          .height;
        position = Point.setPositionsHeight(position, newHeight);
        dragger.position = position;

        var radius = that.formatNum(
          Cesium.Cartesian3.distance(that._positions_draw, position),
          2
        );
        style.widthRadii = radius; //长半轴

        that.updateRadii(style);
        that.updateDraggers();
      },
    });
    dragger.minorDragger = minorDragger;
    this.draggers.push(minorDragger);
  }
}

export default EditEllipsoid;
