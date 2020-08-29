import Cesium from "cesium";
import { AttrPoint, AttrBillboard } from "../attr";
import DrawPoint from "./DrawPoint";

/*
 * @Description: 绘制广告牌
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:31:39
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-25 17:55:08
 */

class DrawBillboard extends DrawPoint {
  type = "billboard";

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
      billboard: AttrBillboard.style2Entity(attribute.style),
      attribute: attribute,
    };

    this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
    return this.entity;
  }

  style2Entity(style, entity) {
    return AttrBillboard.style2Entity(style, entity.billboard);
  }

  getAttrClass() {
    return AttrBillboard;
  }
}

export default DrawBillboard;
