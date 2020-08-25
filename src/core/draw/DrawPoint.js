
import Cesium from 'cesium';
import { AttrPoint } from '../attr';
import DrawBase from './DrawBase';
import {Point} from '../point';
import { EditPoint } from '../edit';

/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:31:39
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-25 15:37:47
 */
class DrawPoint extends DrawBase{

  type = 'point';
  
  constructor(opts) {
    super(opts)
  }

  // 根据attribute参数创建Entity
  createFeature(attribute) {
    this._position_draw = null;
    var that = this;
    var addAttr = {
      position: new Cesium.CallbackProperty((time) => {
        return that.getDrawPosition();
      }, false),
      point: AttrPoint.style2Entity(attribute.style),
      attribute: attribute
    };

    this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
    return this.entity;
  }

  style2Entity(style, entity) {
    return AttrPoint.style2Entity(style, entity.point);
  }

  bindEvent() {
    var _this = this;
    this.getHandler().setInputAction((event) => {
      var point = Point.getCurrentMousePosition(_this.viewer.scene, event.position, _this.entity);
      if (point) {
        _this._position_draw = point;
        _this.disable();
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  // 获取编辑对象类
  getEditClass(entity) {
    var _edit = EditPoint(entity, this.viewer, this.dataSource);
    return this._bindEdit(_edit);
  }

  // 获取属性处理类
  getAttrClass() {
    return attr;
  }

  finish() {
    this.entity.editing = this.getEditClass(this.entity); // 绑定编辑对象
    this.entity.position = this.getDrawPosition();
  }

}

export DrawPoint;