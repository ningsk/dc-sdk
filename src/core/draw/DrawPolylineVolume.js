import DrawPolyline from "./DrawPolyline";
import Cesium from "cesium";
import { EditPolylineVolume } from "../edit";
import { AttrPolylineVolume } from "../attr";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:32:36
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-26 15:01:38
 */

const def_minPointNum = 2;
const def_maxPointNum = 9999;

class DrawPolylineVolume extends DrawPolyline {
  type = "polylineVolume";
  // 坐标位置相关
  _minPointNum = def_minPointNum; // 至少需要点的个数
  _maxPointNum = def_maxPointNum; // 最多允许点的个数

  constructor(opts) {
    super(opts);
  }

  // 根据attribute参数创建Entity
  createFeature(attribute) {
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
      polylineVolume: attr.style2Entity(attribute.style),
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
  }

  style2Entity(style, entity) {
    return AttrPolylineVolume.style2Entity(style, entity.polylineVolume);
  }
  updateAttrForDrawing() {}
  //获取编辑对象
  getEditClass(entity) {
    let _edit = new EditPolylineVolume(entity, this.viewer, this.dataSource);
    _edit._minPointNum = this._minPointNum;
    _edit._maxPointNum = this._maxPointNum;
    return this._bindEdit(_edit);
  }
  //获取属性处理类
  getAttrClass() {
    return AttrPolylineVolume;
  }
  //图形绘制结束后调用
  finish() {
    this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象
    this.entity.polylineVolume.positions = this.getDrawPosition();
  }
}

export default DrawPolylineVolume;
