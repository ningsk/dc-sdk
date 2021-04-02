/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-10 11:24:07
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 13:17:34
 */

import { GeoJsonLayer } from "./GeoJsonLayer";
import * as Util from "../core/Util";
import * as Cesium from "cesium";

export var ArcFeatureLayer = GeoJsonLayer.extend({
  queryData: function () {
    var that = this;
    var url = this.config.url;

    if (this.config.layers && this.config.layers.length > 0)
      url += "/" + this.config.layers[0];

    var query = L.esri.query({
      url: url,
    });
    if (this.config.where) query.where(this.config.where);

    query.run(function (error, featureCollection, response) {
      if (error != null && error.code > 0) {
        Util.alert(error.message, "服务访问出错");
        return;
      }

      if (
        featureCollection == undefined ||
        featureCollection == null ||
        featureCollection.features.length == 0
      ) {
        Util.msg("未找到符合查询条件的要素！");
        return;
      } else {
        //剔除有问题数据
        var featuresOK = [];
        for (var i = 0; i < featureCollection.features.length; i++) {
          var feature = featureCollection.features[i];
          if (feature == null || feature.geometry == null) continue;
          if (
            feature.geometry.coordinates &&
            feature.geometry.coordinates.length == 0
          )
            continue;
          featuresOK.push(feature);
        }
        featureCollection.features = featuresOK;

        var dataSource = Cesium.GeoJsonDataSource.load(featureCollection, {
          clampToGround: true,
        });
        dataSource
          .then(function (dataSource) {
            that.showResult(dataSource);
          })
          .otherwise(function (error) {
            that.showError("服务出错", error);
          });
      }
    });
  },
});
