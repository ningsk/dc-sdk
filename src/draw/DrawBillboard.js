import Cesium from "cesium";
import { AttrBillboard } from "../attr/index";
import { DrawPoint } from "./DrawPoint";

/*
 * @Description: 绘制广告牌
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:31:39
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 11:26:03
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
      billboard: AttrBillboard.style2Entity(attribute.style),
      attribute: attribute,
    };

    this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
    return this.entity;
  },

  style2Entity: function (style, entity) {
    return AttrBillboard.style2Entity(style, entity.billboard);
  },

  // 获取属性处理类
  getAttrClass: function () {
    return AttrBillboard;
  },
});
