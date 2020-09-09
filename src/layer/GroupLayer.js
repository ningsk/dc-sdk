/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-21 13:59:42
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-08 11:27:03
 */
import Cesium from "cesium";
import { BaseLayer } from './BaseLayer';
export var GroupLayer = BaseLayer.extend({
  create: function() {
    var arr = this.config._layers;
    for (var i = 0, len = arr.length; i < len; i++) {
      this.hasOpacity = arr[i].hasOpacity;
      this.hasZIndex = arr[i].hasZIndex;
    }
  },

  setVisible: function(val) {
    var arr = this.config._layers;
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i].setVisible(val);
    }
  },

  // 添加
  add: function() {
    var arr = this.config._layers;
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i].setVisible(true);
    }
  },

  // 移除
  remove: function() {
    var arr = this.config._layers;
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i].setVisible(false);
    }
  },

  // 定位至数据区域
  centerAt: function(duration) {
    var arr = this.config._layers;
    for (var i = 0， len = arr.length; i < len; i++) {
      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i].centerAt(duration);
      }
    }
  },

  // 设置透明度
  setOpacity: function(value) {
    var arr = this.config._layers;
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i].setOpacity(value);
    }
  },

  // 设置叠加顺序
  setZIndex: function(value) {
    var arr = this.config._layers;
    for (var i = 0; i < arr.length; i++) {
      arr[i].setZIndex(value);
    }
  }
})