/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:33:33
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-27 10:20:32
 */

import DrawPolyline from "./DrawPolyline.js";
import { Wall } from "../attr/index.js";
import { EditWall } from "../edit/index.js";
import Cesium from "cesium";

const def_minPointNum = 2;
const def_maxPointNum = 9999;

class DrawWall extends DrawPolyline {
  type = "wall";
  // 坐标位置相关
  _minPointNum = def_minPointNum; //至少需要点的个数
  _maxPointNum = def_maxPointNum; //最多允许点的个数
  maximumHeights = null;
  minimumHeights = null;

  constructor(opts) {
    super(opts);
  }

  createFeature(attribute) {
    this._positions_draw = [];

    if (attribute.config) {
      this._minPointNum = attribute.config.minPointNum || def_minPointNum;
      this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum;
    } else {
      this._minPointNum = def_minPointNum;
      this._maxPointNum = def_maxPointNum;
    }

    this.maximumHeights = [];
    this.minimumHeights = [];

    var that = this;
    var addAttr = {
      wall: Wall.style2Entity(attribute.style),
      attribute: attribute,
    };
    addAttr.wall.positions = new Cesium.CallbackProperty(function (time) {
      return that.getDrawPosition();
    }, false);
    addAttr.wall.minimumHeights = new Cesium.CallbackProperty(function (time) {
      return that.getMinimumHeights();
    }, false);
    addAttr.wall.maximumHeights = new Cesium.CallbackProperty(function (time) {
      return that.getMaximumHeights();
    }, false);

    this.entity = this.dataSource.entities.add(addAttr); //创建要素对象
    return this.entity;
  }

  style2Entity(style, entity) {
    return Wall.style2Entity(style, entity.wall);
  }
  getMaximumHeights(entity) {
    return this.maximumHeights;
  }
  getMinimumHeights(entity) {
    return this.minimumHeights;
  }
  updateAttrForDrawing() {
    var style = this.entity.attribute.style;
    var position = this.getDrawPosition();
    var len = position.length;

    this.maximumHeights = new Array(len);
    this.minimumHeights = new Array(len);

    for (let i = 0; i < len; i++) {
      let height = Cesium.Cartographic.fromCartesian(position[i]).height;
      this.minimumHeights[i] = height;
      this.maximumHeights[i] = height + Number(style.extrudedHeight);
    }
  }
  //获取编辑对象
  getEditClass(entity) {
    let _edit = new EditWall(entity, this.viewer, this.dataSource);
    _edit._minPointNum = this._minPointNum;
    _edit._maxPointNum = this._maxPointNum;
    return this._bindEdit(_edit);
  }
  //获取属性处理类
  getAttrClass() {
    return Wall;
  }
  //图形绘制结束后调用
  finish() {
    this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象
    this.entity.wall.positions = this.getDrawPosition();
    this.entity.wall.minimumHeights = this.getMinimumHeights();
    this.entity.wall.maximumHeights = this.getMaximumHeights();
  }
}

export default DrawWall;
