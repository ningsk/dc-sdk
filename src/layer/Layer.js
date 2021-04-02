/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 14:23:35
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 17:01:26
 */
import * as Cesium from "cesium";
import { BaseLayer } from "./BaseLayer.js";
import { GroupLayer } from "./GroupLayer.js";
import { TileLayer } from "./TileLayer.js";
import { GraticuleLayer } from "./GraticuleLayer.js";
import { FeatureGridLayer } from "./FeatureGridLayer";
import { CustomFeatureGridLayer } from "./CustomFeatureGridLayer.js";
import { POILayer } from "./POILayer.js";
import { GeoJsonLayer } from "./GeoJsonLayer.js";
import { ArcFeatureLayer } from "./ArcFeatureLayer.js";
import { GltfLayer } from "./GltfLayer.js";
import { Tiles3dLayer } from "./Tiles3dLayer.js";
import { KmlLayer } from "./KmlLayer.js";
import { CzmlLayer } from "./CzmlLayer.js";
import { TerrainLayer } from "./TerrainLayer.js";
import { DrawLayer } from "./DrawLayer.js";
import {
  BaiduImageryProvider,
  FeatureGridImageryProvider,
} from "../imageprovider/index";

function getOneKey(arr) {
  var n = Math.floor(Math.random() * arr.length + 1) - 1;
  return arr[n];
}

//创建图层
function createLayer(item, viewer, serverURL, layerToMap) {
  var layer;

  if (item.url) {
    if (serverURL) {
      item.url = item.url.replace("$serverURL$", serverURL);
    }
    item.url = item.url
      .replace("$hostname$", location.hostname)
      .replace("$host$", location.host);
  }

  switch (item.type) {
    //===============地图数组====================
    case "group":
      //示例：{ "name": "电子地图", "type": "group","layers": [    ]}
      if (item.layers && item.layers.length > 0) {
        var arrVec = [];
        for (var index = 0; index < item.layers.length; index++) {
          var temp = createLayer(
            item.layers[index],
            viewer,
            serverURL,
            layerToMap
          );
          if (temp == null) continue;
          arrVec.push(temp);
        }
        item._layers = arrVec;
        layer = new GroupLayer(item, viewer);
      }
      break;
    case "www_bing": //bing地图
    case "www_osm": //OSM开源地图
    case "www_google": //谷歌国内
    case "www_gaode": //高德
    case "www_baidu": //百度
    case "www_tdt": //天地图
    case "arcgis_cache":
    case "arcgis":
    case "arcgis_tile":
    case "arcgis_dynamic":
    case "wmts":
    case "tms":
    case "wms":
    case "xyz":
    case "tile":
    case "single":
    case "image":
    case "gee":
    case "custom_tilecoord": //瓦片信息
    case "custom_grid":
      //网格线
      //瓦片图层
      layer = new TileLayer(item, viewer);
      layer.isTile = true;
      break;
    case "www_poi":
      //在线poi数据
      layer = new POILayer(item, viewer);
      break;
    case "custom_featuregrid":
      //自定义矢量网格图层
      layer = new CustomFeatureGridLayer(item, viewer);
      break;
    case "custom_graticule":
      layer = new GraticuleLayer(item, viewer);
      break;

    case "3dtiles":
      layer = new Tiles3dLayer(item, viewer);
      break;
    case "gltf":
      layer = new GltfLayer(item, viewer);
      break;
    case "arcgis_feature":
      //分网格加载
      layer = new ArcFeatureLayer(item, viewer);
      break;
    case "arcgis_feature2":
      //一次加载，不分网格
      layer = new ArcFeatureLayer(item, viewer);
      break;
    case "geojson":
      layer = new GeoJsonLayer(item, viewer);
      break;
    case "geojson-draw":
      //基于框架内部draw绘制保存的geojson数据的加载
      layer = new DrawLayer(item, viewer);
      break;
    case "kml":
      layer = new KmlLayer(item, viewer);
      break;
    case "czml":
      layer = new CzmlLayer(item, viewer);
      break;
    case "terrain":
      layer = new TerrainLayer(item, viewer);
      break;

    default:
      break;
  }

  if (layerToMap) {
    var _temp = layerToMap(item, viewer, layer);
    if (_temp) layer = _temp;
  }

  if (layer == null) {
    if (item.type != "group")
      console.log("配置中的图层未处理：" + JSON.stringify(item));
  } else {
    //这句话，vue或部分架构中要注释，会造成内存溢出。
    item._layer = layer;
  }

  return layer;
}

//创建地图底图
function createImageryProvider(item, serverURL) {
  if (item.url) {
    if (serverURL) {
      item.url = item.url.replace("$serverURL$", serverURL);
    }
    item.url = item.url
      .replace("$hostname$", location.hostname)
      .replace("$host$", location.host);
  }

  var opts = {};
  for (var key in item) {
    var value = item[key];
    if (value == null) continue;

    switch (key) {
      default:
        //直接赋值
        opts[key] = value;
        break;
      case "crs":
        if (value == "4326" || value.toUpperCase() == "EPSG4326")
          opts.tilingScheme = new Cesium.GeographicTilingScheme({
            numberOfLevelZeroTilesX: item.numberOfLevelZeroTilesX || 2,
            numberOfLevelZeroTilesY: item.numberOfLevelZeroTilesY || 1,
          });
        else
          opts.tilingScheme = new Cesium.WebMercatorTilingScheme({
            numberOfLevelZeroTilesX: item.numberOfLevelZeroTilesX || 1,
            numberOfLevelZeroTilesY: item.numberOfLevelZeroTilesY || 1,
          });
        break;
      case "proxy":
        opts.proxy = new Cesium.DefaultProxy(value);
        break;
      case "rectangle":
        opts.rectangle = Cesium.Rectangle.fromDegrees(
          value.xmin,
          value.ymin,
          value.xmax,
          value.ymax
        );
        break;
    }
  }

  if (opts.proxy) {
    opts.url = new Cesium.Resource({
      url: opts.url,
      proxy: opts.proxy,
    });
  }

  var layer;
  switch (opts.type_new || opts.type) {
    //===============地图底图====================
    case "single":
    case "image":
      layer = new Cesium.SingleTileImageryProvider(opts);
      break;
    case "xyz":
    case "tile":
      opts.customTags = {
        "z&1": function z1(imageryProvider, x, y, level) {
          return level + 1;
        },
      };
      layer = new Cesium.UrlTemplateImageryProvider(opts);
      break;
    case "wms":
      layer = new Cesium.WebMapServiceImageryProvider(opts);
      break;
    case "tms":
      if (!opts.url)
        opts.url = Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII");
      layer = new Cesium.createTileMapServiceImageryProvider(opts);
      break;
    case "wmts":
      layer = new Cesium.WebMapTileServiceImageryProvider(opts);
      break;
    case "gee":
      //谷歌地球
      layer = new Cesium.GoogleEarthEnterpriseImageryProvider({
        metadata: new Cesium.GoogleEarthEnterpriseMetadata(opts),
      });
      break;
    case "arcgis":
    case "arcgis_tile":
    case "arcgis_dynamic":
      layer = new Cesium.ArcGisMapServerImageryProvider(opts);
      break;
    case "arcgis_cache":
      //layer = new _ArcTileImageryProvider(opts);
      if (!Cesium.UrlTemplateImageryProvider.prototype.padLeft0) {
        Cesium.UrlTemplateImageryProvider.prototype.padLeft0 = function (
          numStr,
          n
        ) {
          numStr = String(numStr);
          var len = numStr.length;
          while (len < n) {
            numStr = "0" + numStr;
            len++;
          }
          return numStr;
        };
      }
      opts.customTags = {
        //小写
        arc_x: function arc_x(imageryProvider, x, y, level) {
          return imageryProvider.padLeft0(x.toString(16), 8);
        },
        arc_y: function arc_y(imageryProvider, x, y, level) {
          return imageryProvider.padLeft0(y.toString(16), 8);
        },
        arc_z: function arc_z(imageryProvider, x, y, level) {
          return imageryProvider.padLeft0(level.toString(), 2);
        },
        //大写
        arc_X: function arc_X(imageryProvider, x, y, level) {
          return imageryProvider.padLeft0(x.toString(16), 8).toUpperCase();
        },
        arc_Y: function arc_Y(imageryProvider, x, y, level) {
          return imageryProvider.padLeft0(y.toString(16), 8).toUpperCase();
        },
        arc_Z: function arc_Z(imageryProvider, x, y, level) {
          return imageryProvider.padLeft0(level.toString(), 2).toUpperCase();
        },
      };
      layer = new Cesium.UrlTemplateImageryProvider(opts);
      break;

    //===============互联网常用地图====================

    case "www_tdt":
      //天地图
      var _layer;
      switch (opts.layer) {
        default:
        case "vec_d":
          _layer = "vec";
          break;
        case "vec_z":
          _layer = "cva";
          break;
        case "img_d":
          _layer = "img";
          break;
        case "img_z":
          _layer = "cia";
          break;
        case "ter_d":
          _layer = "ter";
          break;
        case "ter_z":
          _layer = "cta";
          break;
      }

      var _key;
      if (opts.key == null || opts.key.length == 0)
        _key = "87949882c75775b5069a0076357b7530";
      //默认
      else _key = getOneKey(opts.key);

      var maxLevel = 18;
      if (item.crs == "4326") {
        //wgs84
        var matrixIds = new Array(maxLevel);
        for (var z = 0; z <= maxLevel; z++) {
          matrixIds[z] = (z + 1).toString();
        }
        var _url =
          "http://t{s}.tianditu.gov.cn/" +
          _layer +
          "_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=" +
          _layer +
          "&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=" +
          _key;

        layer = new Cesium.WebMapTileServiceImageryProvider({
          url: opts.proxy
            ? new Cesium.Resource({
                url: _url,
                proxy: opts.proxy,
              })
            : _url,
          layer: _layer,
          style: "default",
          format: "tiles",
          tileMatrixSetID: "c",
          subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
          tileMatrixLabels: matrixIds,
          tilingScheme: new Cesium.GeographicTilingScheme(), //WebMercatorTilingScheme、GeographicTilingScheme
          maximumLevel: maxLevel,
        });
      } else {
        //墨卡托
        var matrixIds = new Array(maxLevel);
        for (var z = 0; z <= maxLevel; z++) {
          matrixIds[z] = z.toString();
        }
        var _url =
          "http://t{s}.tianditu.gov.cn/" +
          _layer +
          "_w/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=" +
          _layer +
          "&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=" +
          _key;

        layer = new Cesium.WebMapTileServiceImageryProvider({
          url: opts.proxy
            ? new Cesium.Resource({
                url: _url.replace("{s}", "0"),
                proxy: opts.proxy,
              })
            : _url,
          layer: _layer,
          style: "default",
          format: "tiles",
          tileMatrixSetID: "w",
          subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
          tileMatrixLabels: matrixIds,
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: maxLevel,
        });
      }
      break;
    case "www_gaode":
      //高德
      var _url;
      switch (opts.layer) {
        case "vec":
        default:
          //style=7是立体的，style=8是灰色平面的
          _url =
            "http://" +
            (opts.bigfont ? "wprd" : "webrd") +
            "0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}";
          break;
        case "img_d":
          _url =
            "http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
          break;
        case "img_z":
          _url =
            "http://webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8";
          break;
        case "time":
          var time = new Date().getTime();
          _url = context.font = "bold 25px Arial";
          context.textAlign = "center";
          context.fillStyle = "black";
          context.fillText(label, 127, 127);
          context.fillStyle = "#ffff00";
          context.fillText(label, 124, 124);
          "http://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t=" +
            time;
          break;
      }

      layer = new Cesium.UrlTemplateImageryProvider({
        url: opts.proxy
          ? new Cesium.Resource({
              url: _url,
              proxy: opts.proxy,
            })
          : _url,
        subdomains: ["1", "2", "3", "4"],
        maximumLevel: 18,
      });
      break;
    case "www_baidu":
      //百度
      layer = new BaiduImageryProvider(opts);
      break;
    case "www_google":
      //谷歌国内
      var _url;

      if (item.crs == "4326" || item.crs == "wgs84") {
        //wgs84   无偏移
        switch (opts.layer) {
          default:
          case "img_d":
            _url = "http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}";
            break;
        }
      } else {
        //有偏移
        switch (opts.layer) {
          case "vec":
          default:
            _url =
              "http://mt{s}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile";
            break;
          case "img_d":
            _url =
              "http://mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali";
            break;
          case "img_z":
            _url =
              "http://mt{s}.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil";
            break;
          case "ter":
            _url =
              "http://mt{s}.google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galile";
            break;
        }
      }

      layer = new Cesium.UrlTemplateImageryProvider({
        url: opts.proxy
          ? new Cesium.Resource({
              url: _url,
              proxy: opts.proxy,
            })
          : _url,
        subdomains: ["1", "2", "3"],
        maximumLevel: 20,
      });
      break;

    case "www_osm":
      //OSM开源地图
      var _url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      layer = new Cesium.UrlTemplateImageryProvider({
        url: opts.proxy
          ? new Cesium.Resource({
              url: _url,
              proxy: opts.proxy,
            })
          : _url,
        subdomains: "abc",
        maximumLevel: 18,
      });
      break;
    case "www_bing":
      //bing地图

      var _url = "https://dev.virtualearth.net";
      //无标记影像 Aerial,
      //有英文标记影像   AerialWithLabels,
      //矢量道路  Road
      //OrdnanceSurvey,
      //CollinsBart
      var style = opts.layer || Cesium.BingMapsStyle.Aerial;
      layer = new Cesium.BingMapsImageryProvider({
        url: opts.proxy
          ? new Cesium.Resource({
              url: _url,
              proxy: opts.proxy,
            })
          : _url,
        key:
          opts.key ||
          "AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc",
        mapStyle: style,
      });
      break;

    //===============内部定义的图层====================
    case "custom_grid":
      //网格线
      layer = new Cesium.GridImageryProvider();
      break;
    case "custom_tilecoord":
      //瓦片信息
      layer = new Cesium.TileCoordinatesImageryProvider();
      break;
    case "custom_featuregrid":
      //自定义矢量网格图层
      layer = new FeatureGridImageryProvider(opts);
      break;
    default:
      console.log("config配置图层未处理:" + item);
      break;
  }
  layer.config = opts;

  return layer;
}

export {
  createLayer,
  createImageryProvider,
  BaseLayer,
  GroupLayer,
  TileLayer,
  GltfLayer,
  Tiles3dLayer,
  GeoJsonLayer,
  FeatureGridLayer,
  KmlLayer,
  CzmlLayer,
  TerrainLayer,
  DrawLayer,
  CustomFeatureGridLayer,
  ArcFeatureLayer,
  POILayer,
};
