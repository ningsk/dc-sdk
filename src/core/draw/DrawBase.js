/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-14 13:01:47
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-14 13:20:36
 */
import { Class } from "leaflet/src/core/Class";
import { Tooltip } from "leaflet";

export var DrawBase = Class.extend({
  type: null,
  dataSource: null,
  initialize: function(opts) {
    this.viewer = opts.viewer;
    this.dataSource = opts.dataSource;
    this.primitives = opts.primitives;
    if (!this.dataSource) {
      // 没有单独指定Cesium.CustomDataSource时
      this.dataSource = new Cesium.CustomDataSource();
      viewer.dataSources.add(this.dataSource);
    }
    this.tooltip = opts.tooltip || new Tooltip(this.viewer.container);
  },
  fire: function(type, data, propagate) {
    if (this._fire) this._fire(type, data, propagate);
  },
  // 激活配置
  activate: function(attribute, drawOkCallback) {
    if (this._enabled) {
      return this;
    }
    this._enabled true;
    this.drawOkCallback = drawOkCallback;
    this.createFeature(attribute);
    this.entity.inProgress = true;
    this.setCursor(true);
    this.bindEvent();
  }
});