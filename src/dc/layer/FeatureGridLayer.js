import Cesium from "cesium";
import TileLayer from "./TileLayer";
/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-20 15:48:16
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-07 10:16:46
 */
class FeatureGridLayer extends TileLayer {
  constructor(cfg, viewer) {
    super(cfg, viewer);
    this.dataSource = null;
    this.hasOpacity = false;
  }

  create() {
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
  }

  getLength() {
    return this.primitives.length + this.dataSource.entities.values.length;
  }

  addEx() {
    this.viewer.dataSources.add(this.dataSource);
    this.viewer.scene.primitives.add(this.primitives);
  }

  removeEx() {
    this.viewer.dataSources.remove(this.dataSource);
    this.viewer.scene.primitives.remove(this.primitives);
  }

  _addImageryCache(opts) {}

  _removeImageryCache(opts) {}

  _removeAllImageryCache(opts) {}
}

export default FeatureGridLayer;
