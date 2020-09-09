/*
 * @Description: Kml格式数据图层
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-21 09:06:20
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-08 11:28:12
 */

import Cesium from "cesium";
import { GeoJsonLayer } from "./GeoJsonLayer";
export var KmlLayer = GeoJsonLayer.extend({
  queryData: function () {
    var that = this;
    var dataSource = Cesium.KmlDataSource.load(this.config.url, {
      camera: this.viewer.scene.camera,
      canvas: this.viewer.scene.canvas,
      clampToGround: this.config.clampToGround,
    });
    dataSource
      .then((dataSource) => {
        that.showResult(dataSource);
      })
      .otherwise((error) => {
        that.showError("服务出错", error);
      });
  },

  getEntityAttr: function (entity) {
    var attr = {
      name: entity._name,
    };
    var extendedData = entity._kml.extendedData;
    for (var key in extendedData) {
      attr[key] = extendedData[key].value;
    }
    return attr;
  },
});
