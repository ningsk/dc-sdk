/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:31:48
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 11:29:26
 */

import { DrawPoint } from "./DrawPoint";
import { AttrLabel } from "../attr/index";
import * as Cesium from "cesium";

export var DrawLabel = DrawPoint.extend({
  type: "label",

  createFeature: function (attribute) {
    this._positions_draw = null;
    var that = this;
    var addAttr = {
      position: new Cesium.CallbackProperty((time) => {
        return that.getDrawPosition();
      }, false),
      label: AttrLabel.style2Entity(attribute.style),
      attribute: attribute,
    };
    this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
    return this.entity;
  },

  style2Entity: function (style, entity) {
    return AttrLabel.style2Entity(style, entity.label);
  },

  getAttrClass: function () {
    return AttrLabel;
  },
});
