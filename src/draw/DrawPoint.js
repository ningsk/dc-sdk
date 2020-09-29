import { AttrPoint } from "../attr/index";
import { DrawBase } from "./DrawBase";
import { PointUtil } from "../core/index";
import { EditPoint } from "../edit/index";
import * as Cesium from "cesium";

/*
 * @Description: 绘制点
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:31:39
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 11:32:50
 */
export var DrawPoint = DrawBase.extend({
  type: "point",
  // 根据attribute参数创建Entity
  createFeature: function (attribute) {
    this._positions_draw = null;
    var that = this;
    var addAttr = {
      position: new Cesium.CallbackProperty((time) => {
        return that.getDrawPosition();
      }, false),
      point: AttrPoint.style2Entity(attribute.style),
      attribute: attribute,
    };

    this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
    return this.entity;
  },

  style2Entity: function (style, entity) {
    return AttrPoint.style2Entity(style, entity.point);
  },
  // 绑定鼠标事件
  bindEvent: function () {
    var _this = this;
    this.getHandler().setInputAction((event) => {
      var point = PointUtil.getCurrentMousePosition(
        _this.viewer.scene,
        event.position,
        _this.entity
      );
      if (point) {
        _this._positions_draw = point;
        _this.disable();
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  },

  // 获取编辑对象类
  getEditClass: function (entity) {
    var _edit = EditPoint(entity, this.viewer, this.dataSource);
    return this._bindEdit(_edit);
  },

  // 获取属性处理类
  getAttrClass: function () {
    return AttrPoint;
  },

  finish: function () {
    this.entity.editing = this.getEditClass(this.entity); // 绑定编辑对象
    this.entity.position = this.getDrawPosition();
  },
});
