import DrawPoint from "./DrawPoint";
import { Model } from "../attr";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:32:03
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-26 13:25:53
 */
class DrawModel extends DrawPoint {
  type = "model";

  constructor(opts) {
    super(opts);
  }

  // 根据attribute参数创建Entity
  createFeature(attribute) {
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
  }

  style2Entity(style, entity) {
    this.updateOrientation(style, entity);
    return Model.style2Entity(style, entity.model);
  }

  updateAttrForDrawing() {
    this.updateOrientation(this.entity.attribute.style, this.entity);
  }

  updateOrientation(style, entity) {
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
  }

  getAttrClass() {
    return Model;
  }
}

export default DrawModel;
