import Cesium from "cesium";
import { Point, Billboard } from "../overlay";
import { DrawPoint } from "./DrawPoint";

/*
 * @Description: 绘制广告牌
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:31:39
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-08 09:27:21
 */

export var DrawBillboard = DrawPoint.extend({
  type: "billboard",
  //根据attribute参数创建Entity
  createFeature: function (attribute) {
    this._positions_draw = null;
    var that = this;
    var addAttr = {
      position: new Cesium.CallbackProperty((time) => {
        return that.getDrawPosition();
      }, false),
      billboard: Billboard.style2Entity(attribute.style),
      attribute: attribute,
    };

    this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
    return this.entity;
  },

  style2Entity: function (style, entity) {
    return Billboard.style2Entity(style, entity.billboard);
  },

  // 获取属性处理类
  getAttrClass: function () {
    return Billboard;
  },
});
