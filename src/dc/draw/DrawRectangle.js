/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:33:08
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-07 10:11:18
 */
import Cesium from "cesium";
import DrawPolyline from "./DrawPolyline";
import { EditRectangle } from "../edit";

class DrawRectangle extends DrawPolyline {
  constructor(opts) {
    super(opts);
    this.type = "polyline";
    // 坐标位置相关
    this._minPointNum = 2; // 至少需要点的个数
    this._maxPointNum = 2; // 最多允许点的个数
  }

  getRectangle() {
    let positions = this.getDrawPosition();
    if (positions.length < 2) return null;
    return Cesium.Rectangle.fromCartesianArray(positions);
  }
  //根据attribute参数创建Entity
  createFeature(attribute) {
    this._positions_draw = [];

    let that = this;
    let addAttr = {
      rectangle: Rectangle.style2Entity(attribute.style),
      attribute: attribute,
    };
    addAttr.rectangle.coordinates = new Cesium.CallbackProperty(function (
      time
    ) {
      return that.getRectangle();
    },
    false);

    //线：边线宽度大于1时
    addAttr.polyline = {
      clampToGround: attribute.style.clampToGround,
      show: false,
    };

    this.entity = this.dataSource.entities.add(addAttr); //创建要素对象
    this.bindOutline(this.entity); //边线

    return this.entity;
  }
  style2Entity(style, entity) {
    return Rectangle.style2Entity(style, entity.rectangle);
  }
  bindOutline(entity) {
    //是否显示：边线宽度大于1时
    entity.polyline.show = new Cesium.CallbackProperty(function (time) {
      return (
        entity.rectangle.outline &&
        entity.rectangle.outline.getValue() &&
        entity.rectangle.outlineWidth &&
        entity.rectangle.outlineWidth.getValue() > 1
      );
    }, false);
    entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
      if (!entity.polyline.show.getValue()) return null;

      var positions = entity._draw_positions;
      var height = entity.rectangle.height
        ? entity.rectangle.height.getValue()
        : 0;

      var re = Cesium.Rectangle.fromCartesianArray(positions);
      var pt1 = Cesium.Cartesian3.fromRadians(re.west, re.south, height);
      var pt2 = Cesium.Cartesian3.fromRadians(re.east, re.south, height);
      var pt3 = Cesium.Cartesian3.fromRadians(re.east, re.north, height);
      var pt4 = Cesium.Cartesian3.fromRadians(re.west, re.north, height);

      return [pt1, pt2, pt3, pt4, pt1];
    }, false);
    entity.polyline.width = new Cesium.CallbackProperty(function (time) {
      return entity.rectangle.outlineWidth;
    }, false);
    entity.polyline.material = new Cesium.ColorMaterialProperty(
      new Cesium.CallbackProperty(function (time) {
        return entity.rectangle.outlineColor.getValue();
      }, false)
    );
  }
  updateAttrForDrawing() {
    var style = this.entity.attribute.style;
    if (!style.clampToGround) {
      var maxHight = point.getMaxHeight(this.getDrawPosition());

      this.entity.rectangle.height = maxHight;
      style.height = maxHight;

      if (style.extrudedHeight)
        this.entity.rectangle.extrudedHeight =
          maxHight + Number(style.extrudedHeight);
    }
  }
  //获取编辑对象
  getEditClass(entity) {
    var _edit = new EditRectangle(entity, this.viewer, this.dataSource);
    _edit._minPointNum = this._minPointNum;
    _edit._maxPointNum = this._maxPointNum;
    return this._bindEdit(_edit);
  }
  //获取属性处理类
  getAttrClass() {
    return Rectangle;
  }
  //图形绘制结束后调用
  finish() {
    let entity = this.entity;

    entity.editing = this.getEditClass(entity); //绑定编辑对象

    entity._positions_draw = this._positions_draw;
    //entity.rectangle.coordinates = this.getRectangle();
    entity.rectangle.coordinates = new Cesium.CallbackProperty(function (time) {
      if (entity._positions_draw.length < 2) return null;
      return Cesium.Rectangle.fromCartesianArray(entity._positions_draw);
    }, false);
  }
}

export default DrawRectangle;
