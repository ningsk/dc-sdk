import Cesium from "cesium";
import { TileLayer } from "./TileLayer";
/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-20 15:48:16
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-08 11:08:01
 */
export var FeatureGridLayer = TileLayer.extend({
  dataSource: null,
  hasOpacity: false,
  create: function () {
    this.dataSource = new Cesium.CustomDataSource(); // 用于entity
    this.primitives = new Cesium.PrimitiveCollection(); // 用于primitive
    var that = this;
    this.config.type_new = "custom_featuregrid";
    this.config.addImageryCache = function (opts) {
      return that._addImageryCache(opts);
    };
    this.config.removeImageryCache = function (opts) {
      return that._removeImageryCache(opts);
    };
    this.config.removeAllImageryCache = function (opts) {
      return that._removeAllImageryCache(opts);
    };
  },

  getLength: function () {
    return this.primitives.length + this.dataSource.entities.values.length;
  },

  addEx: function () {
    this.viewer.dataSources.add(this.dataSource);
    this.viewer.scene.primitives.add(this.primitives);
  },

  removeEx: function () {
    this.viewer.dataSources.remove(this.dataSource);
    this.viewer.scene.primitives.remove(this.primitives);
  },

  _addImageryCache: function (opts) {},

  _removeImageryCache: function (opts) {},

  _removeAllImageryCache: function (opts) {},
});
