/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:31:48
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-26 13:17:46
 */

import Cesium from "cesium";
import DrawPoint from "./DrawPoint";
import { Label } from "../attr";

class DrawLabel extends DrawPoint {
  type = "label";

  constructor(opts) {
    super(opts);
  }

  createFeature(attribute) {
    this._positions_draw = null;
    var that = this;
    var addAttr = {
      position: new Cesium.CallbackProperty((time) => {
        return that.getDrawPosition();
      }, false),
      label: Label.style2Entity(attribute.style),
      attribute: attribute,
    };
    this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
    return this.entity;
  }

  style2Entity(style, entity) {
    return Label.style2Entity(style, entity.label);
  }

  getAttrClass() {
    return Label;
  }
}

export default DrawLabel;
