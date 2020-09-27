/*
 * @Description: CZML格式数据图层
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 11:22:38
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-27 14:44:57
 */
import Cesium from "cesium";
import { GeoJsonLayer } from "./GeoJsonLayer";

export var CzmlLayer = GeoJsonLayer.extend({
  queryData: function () {
    var that = this;
    var dataSource = Cesium.CzmlDataSource.load(this.config.url);
    dataSource
      .then(function (dataSource) {
        that.showResult(dataSource);
      })
      .otherwise(function (error) {
        that.showError("服务出错", error);
      });
  },
  getEntityAttr: function (entity) {
    if (entity.description && entity.description.getValue) {
      return entity.description.getValue();
    }
  },
});
