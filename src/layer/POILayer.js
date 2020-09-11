import { CustomFeatureGridLayer } from "./CustomFeatureGridLayer";
import { Billboard, Point } from "../overlay/index";
import $ from "jquery";
import Cesium from "cesium";
import { PointConvert } from "../utils/index";
/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-21 14:00:31
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-11 08:52:16
 */
export var POILayer = CustomFeatureGridLayer.extend({
  _keys: null,
  _key_index: 0,
  getKey: function () {
    if (!this._keys) {
      this._keys = this.config.key || [
        "c95467d0ed2a3755836e37dc27369f97",
        "4320dda936d909d73ab438b4e29cf2a2",
        "e64a96ed7e361cbdc0ebaeaf3818c564",
        "df3247b7df64434adecb876da94755d7",
        "d4375ec477cb0a473c448fb1f83be781",
        "13fdd7b2b90a9d326ae96867ebcc34ce",
        "c34502450ae556f42b21760faf6695a0",
        "57f8ebe12797a73fc5b87f5d4ef859b1",
      ];
      var thisidx = this._key_index++ % this._keys.length;
      return this._keys[thisidx];
    }
  },

  getDataForGrid: function (opts, callback) {
    var jwd1 = PointConvert.wgs2gcj([opts.rectangle.xmin, opts.rectangle.ymax]); // 加偏
    var jwd2 = PointConvert.wgs2gcj([opts.rectangle.xmax, opts.rectangle.ymin]); // 加偏
    var polygon = jwd1[0] + "," + jwd1[1] + "|" + jwd2[0] + "," + jwd2[1];

    var filter = this.config.filter || {};
    filter.output = "json";
    filter.key = this.getKey();
    filter.polygon = polygon;
    if (!filter.offset) filter.offset = 25;
    if (!filter.types) filter.types = "120000|130000|190000";

    var that = this;
    $.ajax({
      url: "http://restapi.amap.com/v3/place/polygon",
      type: "get",
      dataType: "json",
      timeout: "5000",
      data: filter,
      success: function (data) {
        if (data.infocode !== "10000") {
          console.log("POI 请求失败(" + data.infocode + "):" + data.info);
          return;
        }

        var arrData = data.pois;
        callback(arrData);
      },
      error: function (data) {
        console.log("POI 请求出错(" + data.status + "):" + data.statusText);
      },
    });
  },

  // 根据数据创造entity
  createEntity: function (opts, attributes) {
    var inHtml =
      "<div>名称：" +
      attributes.name +
      "</div>" +
      "<div>地址：" +
      attributes.address +
      "</div>" +
      "<div>区域：" +
      attributes.pname +
      attributes.cityname +
      attributes.adname +
      "</div>" +
      "<div>类别：" +
      attributes.type +
      "</div>";

    var arrJwd = attributes.location.split(",");
    arrJwd = Transform.transformGcjToWGS(arrJwd); // 纠偏
    var lnglat = this.viewer.mars.point2map({
      x: arrJwd[0],
      y: arrJwd[1],
    });

    var entityOptions = {
      name: attributes.name,
      position: Cesium.Cartesian3.fromDegrees(
        lnglat.x,
        lnglat.y,
        this.config.height || 3
      ),
      popup: {
        html: inHtml,
        anchor: [0, -15],
      },
      properties: attributes,
    };

    var symbol = this.config.symbol;
    if (symbol) {
      var styleOpt = symbol.styleOptions;
      if (symbol.styleField) {
        //存在多个symbol，按styleField进行分类
        var styleFieldVal = attr[symbol.styleField];
        var styleOptField = symbol.styleFieldOptions[styleFieldVal];
        if (styleOptField != null) {
          styleOpt = $.extend({}, styleOpt);
          styleOpt = $.extend(styleOpt, styleOptField);
        }
      }
      styleOpt = styleOpt || {};

      if (styleOpt.image) {
        entityOptions.billboard = Billboard.style2Entity(styleOpt);
        entityOptions.billboard.heightReference =
          Cesium.HeightReference.RELATIVE_TO_GROUND;
      } else {
        entityOptions.point = Point.style2Entity(styleOpt);
      }

      //加上文字标签
      if (styleOpt.label) {
        entityOptions.label = Label.style2Entity(styleOpt.label);
        entityOptions.label.heightReference =
          Cesium.HeightReference.RELATIVE_TO_GROUND;
        entityOptions.label.text = attributes.name;
      }
    } else {
      //无配置时的默认值
      entityOptions.point = {
        color: new Cesium.Color.fromCssColorString("#3388ff"),
        pixelSize: 10,
        outlineColor: new Cesium.Color.fromCssColorString("#ffffff"),
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 20000, 0.5),
      };
      entityOptions.label = {
        text: attributes.name,
        font: "normal small-caps normal 16px 楷体",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: Cesium.Color.AZURE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -15), //偏移量
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, //是地形上方的高度
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 5000, 0.8),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0.0,
          5000
        ),
      };
    }

    var entity = this.dataSource.entities.add(entityOptions);
    return entity;
  },
});
