import { DrawPoint } from "./DrawPoint";
import { Model } from "../overlay/index";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:32:03
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-11 08:45:15
 */
export var DrawModel = DrawPoint.extend({
  type: "model",

  // 根据attribute参数创建Entity
  createFeature: function (attribute) {
    this._positions_draw = null;
    var that = this;
    var addAttr = {
      position: new Cesium.CallbackProperty((time) => {
        return that.getDrawPosition();
      }, false),
      model: Model.style2Entity(attribute.style),
      attribute: attribute,
    };
    this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
    return this.entity;
  },

  style2Entity: function (style, entity) {
    this.updateOrientation(style, entity);
    return Model.style2Entity(style, entity.model);
  },

  updateAttrForDrawing: function () {
    this.updateOrientation(this.entity.attribute.style, this.entity);
  },

  updateOrientation: function (style, entity) {
    var position = entity.position.getValue();
    if (position == null) return;
    var heading = Cesium.Math.toRadians(Number(style.heading || 0.0));
    var pitch = Cesium.Math.toRadians(Number(style.pitch || 0.0));
    var roll = Cesium.Math.toRadians(Number(style.roll || 0.0));

    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    );
  },

  getAttrClass: function () {
    return Model;
  },
});
