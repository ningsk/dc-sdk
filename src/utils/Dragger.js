/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-25 16:17:18
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-09 10:07:47
 */

import { Tooltip } from "./index";
import Cesium from 'cesium';

const PixelSize = 12; // 编辑点的像素大小

// 拖拽点分类
const PointType = {
  Control: 1, // 位置控制
  AddMidPoint: 2, // 辅助增加新点
  MoveHeight: 3, // 上下移动高度
  EditAttr: 4, // 辅助修改属性（如半径）
  EditRotation: 5 // 旋转角度修改
}
// 拖拽点颜色
const PointColor = {
  Control: new Cesium.Color.fromCssColorString('#2c197d'), // 位置控制拖拽点
  MoveHeight: new Cesium.Color.fromCssColorString('#9500eb'), // 上下移动高度的拖拽点
  EditAttr: new Cesium.Color.fromCssColorString('#f73163'), // 辅助修改属性（如半径）的拖拽点
  AddMidPoint: new Cesium.Color.fromCssColorString('#04c2c9').withAlpha(0.3) // 增加新点，辅助拖拽点
}

function getAttrForType(type, attr) {
  switch(type) {
    case PointType.AddMidPoint:
      attr.color = PointColor.AddMidPoint;
      attr.outlineColor = new Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.4);
      break;
    case PointType.MoveHeight:
      attr.color = PointColor.MoveHeight;
      break;
    case PointType.EditAttr:
      attr.color = PointColor.EditAttr;
      break;
    case PointType.Control:
      attr.color = PointColor.Control;
      break;      
  }
  return attr;
}

/**
 * 创建Dragger拖动点的公共方法
 * @param {*} dataSource 
 * @param {*} options 
 */
export var  createDragger  = function (dataSource, options) {
  var dragger;
  if (options.dragger) {
    dragger = options.dragger;
  } else {
    var attr = {
      scale: 1,
      pixelSize: this.PixelSize,
      outlineColor: new Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.5),
      outlineWidth: 2,
      scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.5),
      heightReference: options.clamToGround ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE
    };
    attr = this.getAttrForType(options.type, attr);

    dragger = data.entities.add({
      position: Cesium.defaultValue(options.position, Cesium.Cartesian3.ZERO),
      point: attr,
      draw_tooltip: options.tooltip || Tooltip.message.dragger.def;
    });
  }

  dragger._isDragger = true;
  dragger._pointType = options.type || this.PointType.Control; // 默认是位置控制拖拽点
  dragger.onDragStart = Cesium.defaultValue(options.onDragStart, null);
  dragger.onDrag = Cesium.defaultValue(options.onDrag, null);
  dragger.onDragEnd = Cesium.defaultValue(options.onDragEnd, null);
  return dragger;

}
