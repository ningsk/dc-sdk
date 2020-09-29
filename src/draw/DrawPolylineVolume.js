import { DrawPolyline } from "./DrawPolyline";

import { EditPolylineVolume } from "../edit/index";
import { AttrPolylineVolume } from "../attr/index";
import * as Cesium from "cesium";
/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:32:36
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 11:34:10
 */

const def_minPointNum = 2;
const def_maxPointNum = 9999;

export var DrawPolylineVolume = DrawPolyline.extend({
  type: "polylineVolume",
  // 坐标位置相关
  _minPointNum: def_minPointNum, // 至少需要点的个数
  _maxPointNum: def_maxPointNum, // 最多允许点的个数
  // 根据attribute参数创建Entity
  createFeature: function (attribute) {
    this._positions_draw = [];

    if (attribute.config) {
      this._minPointNum = attribute.config.minPointNum || def_minPointNum;
      this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum;
    } else {
      this._minPointNum = def_minPointNum;
      this._maxPointNum = def_maxPointNum;
    }

    var that = this;
    var addAttr = {
      polylineVolume: AttrPolylineVolume.style2Entity(attribute.style),
      attribute: attribute,
    };
    addAttr.polylineVolume.positions = new Cesium.CallbackProperty(function (
      time
    ) {
      return that.getDrawPosition();
    },
    false);

    this.entity = this.dataSource.entities.add(addAttr); //创建要素对象
    this.entity._positions_draw = this._positions_draw;

    return this.entity;
  },

  style2Entity: function (style, entity) {
    return AttrPolylineVolume.style2Entity(style, entity.polylineVolume);
  },
  updateAttrForDrawing: function () {},
  //获取编辑对象
  getEditClass: function (entity) {
    let _edit = new EditPolylineVolume(entity, this.viewer, this.dataSource);
    _edit._minPointNum = this._minPointNum;
    _edit._maxPointNum = this._maxPointNum;
    return this._bindEdit(_edit);
  },
  //获取属性处理类
  getAttrClass: function () {
    return AttrPolylineVolume;
  },
  //图形绘制结束后调用
  finish: function () {
    this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象
    this.entity.polylineVolume.positions = this.getDrawPosition();
  },
});
