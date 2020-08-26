import DrawPolyline from "./DrawPolyline";
import Cesium from "cesium";
import { AttrEllipsoid } from "../attr";
import { EditEllipsoid } from "../edit";
/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:33:25
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-26 11:02:26
 */
class DrawEllipsoid extends DrawPolyline {
  type = "ellipsoid";
  _minPointNum = 2; // 至少需要点的个数
  _maxPointNum = 3; // 最多允许点的个数

  constructor(opts) {
    super(opts);
  }

  getShowPosition() {
    if (this._positions_draw && this._positions_draw.length > 0) {
      return this._positions_draw[0];
    }
    return null;
  }

  createFeature(attribute) {
    this._positions_draw = [];
    var that = this;
    var addAttr = {
      position: new Cesium.CallbackProperty((time) => {
        return that.getShowPosition();
      }),
      ellipsoid: AttrEllipsoid.style2Entity(attribute.style),
      attribute: attribute,
    };
  }

  style2Entity(style, entity) {
    return AttrEllipsoid.style2Entity(style, entity.ellipsoid);
  }

  updateAttrForDrawing(isLoad) {
    if (!this._positions_draw) return;

    if (isLoad) {
      this.addPositionsForRadius(this._positions_draw);
      return;
    }

    if (this._positions_draw.length < 2) return;

    var style = this.entity.attribute.style;

    //半径处理
    var radius = this.formatNum(
      Cesium.Cartesian3.distance(
        this._positions_draw[0],
        this._positions_draw[1]
      ),
      2
    );
    style.extentRadii = radius; //短半轴
    style.heightRadii = radius;

    //长半轴
    var semiMajorAxis;
    if (this._positions_draw.length == 3) {
      semiMajorAxis = this.formatNum(
        Cesium.Cartesian3.distance(
          this._positions_draw[0],
          this._positions_draw[2]
        ),
        2
      );
    } else {
      semiMajorAxis = radius;
    }
    style.widthRadii = semiMajorAxis;

    this.updateRadii(style);
  }

  updateRadii(style) {
    this.entity.ellipsoid.radii.setValue(
      new Cesium.Cartesian3(
        style.extentRadii,
        style.widthRadii,
        style.heightRadii
      )
    );
  }

  addPositionsForRadius(position) {
    this._positions_draw = [position];

    var style = this.entity.attribute.style;

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
    this._positions_draw.push(majorPos);

    //短半轴上的坐标点
    var minorPos = new Cesium.Cartesian3(
      cep.positions[3],
      cep.positions[4],
      cep.positions[5]
    );
    this._positions_draw.push(minorPos);
  }

  getEditClass(entity) {
    var _edit = new EditEllipsoid(entity, this.viewer, this.dataSource);
    _edit._minPointNum = this._minPointNum;
    _edit._maxPointNum = this._maxPointNum;
    return this._bindEdit(_edit);
  }

  // 获取属性处理类
  getAttrClass() {
    return AttrEllipsoid;
  }

  // 图形绘制结束后调用
  finish() {
    this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象
    this.entity._positions_draw = this._positions_draw;
    this.entity.position = this.getShowPosition();
  }
}

export default DrawEllipsoid;
