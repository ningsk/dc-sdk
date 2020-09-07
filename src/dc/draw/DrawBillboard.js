import Cesium from "cesium";
import { Point, Billboard } from "../attr";
import DrawPoint from "./DrawPoint";

/*
 * @Description: 绘制广告牌
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:31:39
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-07 10:07:42
 */

class DrawBillboard extends DrawPoint {
  constructor(opts) {
    super(opts);
    this.type = "billboard";
  }

  createFeature(attribute) {
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
  }

  style2Entity(style, entity) {
    return Billboard.style2Entity(style, entity.billboard);
  }

  getAttrClass() {
    return Billboard;
  }
}

export default DrawBillboard;
