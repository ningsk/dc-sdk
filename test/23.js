/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.hasTerrain = hasTerrain;
exports.getEllipsoidTerrain = getEllipsoidTerrain;
exports.getTerrainProvider = getTerrainProvider;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

var _util = __webpack_require__(1);

var _BaseLayer = __webpack_require__(15);

var _GroupLayer = __webpack_require__(98);

var _TileLayer = __webpack_require__(41);

var _SuperMapImgLayer = __webpack_require__(99);

var _GraticuleLayer = __webpack_require__(100);

var _CustomFeatureGridLayer = __webpack_require__(42);

var _POILayer = __webpack_require__(103);

var _WFSLayer = __webpack_require__(104);

var _GeoJsonLayer = __webpack_require__(43);

var _WaterLayer = __webpack_require__(105);

var _GltfLayer = __webpack_require__(106);

var _Tiles3dLayer = __webpack_require__(107);

var _KmlLayer = __webpack_require__(108);

var _CzmlLayer = __webpack_require__(109);

var _TerrainLayer = __webpack_require__(110);

var _DrawLayer = __webpack_require__(111);

var _BaiduImageryProvider = __webpack_require__(112);

var _TencentImageryProvider = __webpack_require__(113);

var _FeatureGridImageryProvider = __webpack_require__(114);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.BaseLayer = _BaseLayer.BaseLayer;

exports.GroupLayer = _GroupLayer.GroupLayer;

exports.TileLayer = _TileLayer.TileLayer;

exports.SuperMapImgLayer = _SuperMapImgLayer.SuperMapImgLayer;

exports.GraticuleLayer = _GraticuleLayer.GraticuleLayer;

exports.CustomFeatureGridLayer = _CustomFeatureGridLayer.CustomFeatureGridLayer;

exports.POILayer = _POILayer.POILayer;

exports.WFSLayer = _WFSLayer.WFSLayer;

exports.GeoJsonLayer = _GeoJsonLayer.GeoJsonLayer;

exports.WaterLayer = _WaterLayer.WaterLayer;

exports.GltfLayer = _GltfLayer.GltfLayer;

exports.Tiles3dLayer = _Tiles3dLayer.Tiles3dLayer;

exports.KmlLayer = _KmlLayer.KmlLayer;

exports.CzmlLayer = _CzmlLayer.CzmlLayer;

exports.TerrainLayer = _TerrainLayer.TerrainLayer;

exports.DrawLayer = _DrawLayer.DrawLayer;

exports.BaiduImageryProvider = _BaiduImageryProvider.BaiduImageryProvider;

exports.TencentImageryProvider = _TencentImageryProvider.TencentImageryProvider;

exports.FeatureGridImageryProvider = _FeatureGridImageryProvider.FeatureGridImageryProvider;

//类库外部的类
var exLayer = {};
exports.regLayerForConfig = function (type, layerClass) {
    exLayer[type] = layerClass;
};

//创建图层
exports.createLayer = function createLayer(viewer, item, serverURL) {

    //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
    if (item instanceof Cesium.Viewer) {
        var temppar = item;
        item = viewer;
        viewer = temppar;
    }
    //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

    var layer;

    if (item.url) {
        if (serverURL) {
            item.url = item.url.replace('$serverURL$', serverURL);
        }
        item.url = item.url.replace('$hostname$', location.hostname).replace('$host$', location.host);
    }

    switch (item.type) {
        //===============地图数组====================
        case "group":
            //示例：{ "name": "电子地图", "type": "group","layers": [    ]}
            if (item.layers && item.layers.length > 0) {
                var arrVec = [];
                for (var index = 0; index < item.layers.length; index++) {
                    var temp = createLayer(viewer, item.layers[index], serverURL);
                    if (temp == null) continue;
                    arrVec.push(temp);
                }
                var newItem = {};
                for (var key in item) {
                    newItem[key] = item[key];
                }
                newItem._layers = arrVec;
                layer = new _GroupLayer.GroupLayer(viewer, newItem);
            }
            break;
        case "base":
            layer = new _BaseLayer.BaseLayer(viewer, item);
            break;
        case "www_bing": //bing地图 
        case "www_osm": //OSM开源地图 
        case "www_google": //谷歌国内
        case "www_gaode": //高德
        case "www_baidu": //百度 
        case "www_tencent": //腾讯
        case "www_tdt": //天地图
        case "mapbox":
        case "www_mapbox":
        case "mapboxstyle":
        case "www_mapboxstyle":
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
            layer = new _TileLayer.TileLayer(viewer, item);
            layer.isTile = true;
            break;
        case "sm_img": //超图底图支持
        case "supermap_img":
            //瓦片图层
            layer = new _SuperMapImgLayer.SuperMapImgLayer(viewer, item);
            layer.isTile = true;
            break;
        case "www_poi":
            //在线poi数据
            layer = new _POILayer.POILayer(viewer, item);
            break;
        case "custom_featuregrid":
            //自定义矢量网格图层 
            layer = new _CustomFeatureGridLayer.CustomFeatureGridLayer(viewer, item);
            break;
        case "custom_graticule":
            layer = new _GraticuleLayer.GraticuleLayer(viewer, item);
            break;

        case "3dtiles":
            layer = new _Tiles3dLayer.Tiles3dLayer(viewer, item);
            break;
        case "gltf":
            layer = new _GltfLayer.GltfLayer(viewer, item);
            break;
        case "geojson":
            layer = new _GeoJsonLayer.GeoJsonLayer(viewer, item);
            break;
        case "geojson-draw":
            //基于框架内部draw绘制保存的geojson数据的加载
            layer = new _DrawLayer.DrawLayer(viewer, item);
            break;
        case "water":
        case "geojson-water":
            layer = new _WaterLayer.WaterLayer(viewer, item);
            break;
        case "kml":
            layer = new _KmlLayer.KmlLayer(viewer, item);
            break;
        case "czml":
            layer = new _CzmlLayer.CzmlLayer(viewer, item);
            break;
        case "wfs":
            layer = new _WFSLayer.WFSLayer(viewer, item);
            break;
        case "terrain":
            if (serverURL && item.terrain && item.terrain.url) {
                item.terrain.url = item.terrain.url.replace('$serverURL$', serverURL);
            }
            layer = new _TerrainLayer.TerrainLayer(viewer, item);
            break;
        default:
            if (exLayer[item.type]) {
                layer = new exLayer[item.type](viewer, item);
            }
            if (layer == null) {
                try {
                    marslog.warn("配置中的图层未处理：" + JSON.stringify(item));
                } catch (e) {}
            }
            break;
    }

    return layer;
};

//创建地图底图
exports.createImageryProvider = function (item, serverURL) {
    if (item.url) {
        if (serverURL) {
            item.url = item.url.replace('$serverURL$', serverURL);
        }
        item.url = item.url.replace('$hostname$', location.hostname).replace('$host$', location.host);
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
                value = (value + "").toUpperCase();
                if (value == "4326" || value == "EPSG4326" || value == "EPSG:4326") {
                    opts.tilingScheme = new Cesium.GeographicTilingScheme({
                        numberOfLevelZeroTilesX: item.numberOfLevelZeroTilesX || 2,
                        numberOfLevelZeroTilesY: item.numberOfLevelZeroTilesY || 1
                    });
                } else if (value == "4490" || value == "EPSG4490" || value == "EPSG:4490") {
                    opts.tilingScheme = new Cesium.GeographicTilingScheme({
                        numberOfLevelZeroTilesX: item.numberOfLevelZeroTilesX || 2,
                        numberOfLevelZeroTilesY: item.numberOfLevelZeroTilesY || 1
                    });
                    opts.is4490 = true;
                } else {
                    opts.tilingScheme = new Cesium.WebMercatorTilingScheme({
                        numberOfLevelZeroTilesX: item.numberOfLevelZeroTilesX || 1,
                        numberOfLevelZeroTilesY: item.numberOfLevelZeroTilesY || 1
                    });
                }
                break;
            case "rectangle":
                opts.rectangle = Cesium.Rectangle.fromDegrees(value.xmin, value.ymin, value.xmax, value.ymax);
                break;
            case "bbox":
                //[xmin,ymin,xmax,ymax]
                opts.rectangle = Cesium.Rectangle.fromDegrees(value[0], value[1], value[2], value[3]);
                break;
        }
    }

    //4490坐标系z值是+1的
    if (opts.is4490 && opts.url) {
        opts.url = opts.url.replace('{z}', '{z4490}');
        opts.url = opts.url.replace('{arc_z}', '{arc_z4490}');
        opts.url = opts.url.replace('{arc_Z}', '{arc_Z4490}');
    }

    if (opts.url && (opts.proxy || opts.headers || opts.queryParameters)) {
        opts = (0, _util.getProxyUrl)(opts);
    }

    var layer;
    switch (opts.type) {
        //===============地图底图==================== 
        case "single":
        case "image":
            layer = new Cesium.SingleTileImageryProvider(opts);
            break;
        case "xyz":
        case "tile":
            opts.customTags = opts.customTags || {};
            opts.customTags["z4490"] = function (imageryProvider, x, y, level) {
                return level + 1;
            };
            layer = new Cesium.UrlTemplateImageryProvider(opts);
            break;
        case "wms":
            layer = new Cesium.WebMapServiceImageryProvider(opts);
            break;
        case "tms":
            if (!opts.url) opts.url = Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII');
            layer = new Cesium.TileMapServiceImageryProvider(opts);
            break;
        case "wmts":
            if (opts.is4490) {
                opts.tileMatrixLabels = [].concat(_toConsumableArray(Array(20).keys())).map(function (item) {
                    return (item + 1).toString();
                });
            }
            layer = new Cesium.WebMapTileServiceImageryProvider(opts);
            break;
        case "gee":
            //谷歌地球
            layer = new Cesium.GoogleEarthEnterpriseImageryProvider({
                metadata: new Cesium.GoogleEarthEnterpriseMetadata(opts)
            });
            break;
        case "mapbox": //mapbox
        case "www_mapbox":
            opts.accessToken = Cesium.defaultValue(opts.accessToken, 'pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A');
            layer = new Cesium.MapboxImageryProvider(opts);
            break;
        case "mapboxstyle":
        case "www_mapboxstyle":
            opts.accessToken = Cesium.defaultValue(opts.accessToken, 'pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A');
            layer = new Cesium.MapboxStyleImageryProvider(opts);
            break;
        case "arcgis":
        case "arcgis_tile":
        case "arcgis_dynamic":
            layer = new Cesium.ArcGisMapServerImageryProvider(opts);
            break;
        case "sm_img": //超图底图支持
        case "supermap_img":
            layer = new Cesium.SuperMapImageryProvider(opts);
            break;
        case "arcgis_cache":
            // 示例 /google/_alllayers/L{arc_z}/R{arc_y}/C{arc_x}.jpg
            if (!Cesium.UrlTemplateImageryProvider.prototype.padLeft0) {
                Cesium.UrlTemplateImageryProvider.prototype.padLeft0 = function (numStr, n) {
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
                "arc_x": function arc_x(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0(x.toString(16), 8);
                },
                "arc_y": function arc_y(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0(y.toString(16), 8);
                },
                "arc_z": function arc_z(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0(level.toString(), 2);
                },
                "arc_z4490": function arc_z4490(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0((level + 1).toString(), 2);
                },
                //大写
                "arc_X": function arc_X(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0(x.toString(16), 8).toUpperCase();
                },
                "arc_Y": function arc_Y(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0(y.toString(16), 8).toUpperCase();
                },
                "arc_Z": function arc_Z(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0(level.toString(), 2).toUpperCase();
                },
                "arc_Z4490": function arc_Z4490(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0((level + 1).toString(), 2).toUpperCase();
                }
            };

            layer = new Cesium.UrlTemplateImageryProvider(opts);
            break;

        //===============互联网常用地图==================== 

        case "www_tdt":
            //天地图
            var _layer;
            var maxLevel = 18;
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
                    maxLevel = 14;
                    break;
                case "ter_z":
                    _layer = "cta";
                    maxLevel = 14;
                    break;
            }

            var _key;
            if (opts.key == null || opts.key.length == 0) _key = '2a0e637a8772d92b123ee8866dee4a82'; //默认
            else _key = getOneKey(opts.key);

            if (item.crs == '4326') {
                //wgs84                  
                var _url = 'https://t{s}.tianditu.gov.cn/' + _layer + '_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=' + _layer + '&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=' + _key;

                if (opts.proxy || opts.headers || opts.queryParameters) {
                    //存在代理等参数时
                    _url = (0, _util.getProxyUrl)({
                        url: _url.replace('{s}', '0'),
                        proxy: opts.proxy,
                        headers: opts.headers,
                        queryParameters: opts.queryParameters
                    }).url;
                }

                layer = new Cesium.WebMapTileServiceImageryProvider(_extends({
                    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                    maximumLevel: maxLevel
                }, opts, {

                    url: _url,
                    layer: _layer,
                    style: 'default',
                    format: 'tiles',
                    tileMatrixSetID: 'c',
                    tileMatrixLabels: [].concat(_toConsumableArray(Array(18).keys())).map(function (item) {
                        return (item + 1).toString();
                    }),
                    tilingScheme: new Cesium.GeographicTilingScheme() //WebMercatorTilingScheme、GeographicTilingScheme
                }));
            } else {
                //墨卡托 
                var _url = 'https://t{s}.tianditu.gov.cn/' + _layer + '_w/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=' + _layer + '&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=' + _key;

                if (opts.proxy || opts.headers || opts.queryParameters) {
                    //存在代理等参数时
                    _url = (0, _util.getProxyUrl)({
                        url: _url.replace('{s}', '0'),
                        proxy: opts.proxy,
                        headers: opts.headers,
                        queryParameters: opts.queryParameters
                    }).url;
                }

                layer = new Cesium.WebMapTileServiceImageryProvider(_extends({
                    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                    maximumLevel: maxLevel
                }, opts, {

                    url: _url,
                    layer: _layer,
                    style: 'default',
                    format: 'tiles',
                    tileMatrixSetID: 'w',
                    tileMatrixLabels: [].concat(_toConsumableArray(Array(18).keys())).map(function (item) {
                        return item.toString();
                    }),
                    tilingScheme: new Cesium.WebMercatorTilingScheme()
                }));
            }
            break;
        case "www_gaode":
            //高德
            var _url;
            switch (opts.layer) {
                case "vec":
                default:
                    //style=7是立体的，style=8是灰色平面的
                    _url = 'https://' + (opts.bigfont ? 'wprd' : 'webrd') + '0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}';
                    break;
                case "img_d":
                    _url = 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
                    break;
                case "img_z":
                    _url = 'https://webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8';
                    break;
                case "time":
                    var time = new Date().getTime();
                    _url = 'https://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t=' + time;
                    break;
            }

            if (opts.proxy || opts.headers || opts.queryParameters) {
                //存在代理等参数时
                _url = (0, _util.getProxyUrl)({
                    url: _url.replace('{s}', '1'),
                    proxy: opts.proxy,
                    headers: opts.headers,
                    queryParameters: opts.queryParameters
                }).url;
            }
            layer = new Cesium.UrlTemplateImageryProvider(_extends({
                subdomains: ['1', '2', '3', '4'],
                maximumLevel: 18
            }, opts, {
                url: _url
            }));
            break;
        case "www_baidu":
            //百度
            layer = new _BaiduImageryProvider.BaiduImageryProvider(opts);
            break;
        case "www_tencent":
            //腾讯
            layer = new _TencentImageryProvider.TencentImageryProvider(opts);
            break;

        case "www_google":
            //谷歌国内   
            var _url;

            if (item.crs == '4326' || item.crs == 'wgs84') {
                //无偏移
                switch (opts.layer) {
                    default:
                    case "img_d":
                        // _url = 'http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}';
                        // _url = 'http://mt{s}.google.cn/vt/lyrs=s&x={x}&y={y}&z={z}';
                        _url = "http://mt3.google.cn/vt?lyrs=s@187&hl=us&gl=us&x={x}&y={y}&z={z}";
                        break;
                }
            } else {
                //有偏移  
                switch (opts.layer) {
                    case "vec":
                    default:
                        _url = 'http://mt{s}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile';
                        break;
                    case "img_d":
                        _url = 'http://mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali';
                        break;
                    case "img_z":
                        _url = 'http://mt{s}.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil';
                        break;
                    case "ter":
                        _url = 'http://mt{s}.google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galile';
                        break;
                }
            }

            if (opts.proxy || opts.headers || opts.queryParameters) {
                //存在代理等参数时
                _url = (0, _util.getProxyUrl)({
                    url: _url.replace('{s}', '1'),
                    proxy: opts.proxy,
                    headers: opts.headers,
                    queryParameters: opts.queryParameters
                }).url;
            }
            layer = new Cesium.UrlTemplateImageryProvider(_extends({
                subdomains: ['1', '2', '3'],
                maximumLevel: 20
            }, opts, {
                url: _url
            }));
            break;

        case "www_osm":
            //OSM开源地图 
            var _url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

            if (opts.proxy || opts.headers || opts.queryParameters) {
                //存在代理等参数时
                _url = (0, _util.getProxyUrl)({
                    url: _url.replace('{s}', 'a'),
                    proxy: opts.proxy,
                    headers: opts.headers,
                    queryParameters: opts.queryParameters
                }).url;
            }
            layer = new Cesium.UrlTemplateImageryProvider(_extends({
                subdomains: "abc",
                maximumLevel: 18
            }, opts, {
                url: _url
            }));
            break;
        case "www_bing":
            //bing地图 

            var _url = 'https://dev.virtualearth.net';

            if (opts.proxy || opts.headers || opts.queryParameters) {
                //存在代理等参数时
                _url = (0, _util.getProxyUrl)({
                    url: _url,
                    proxy: opts.proxy,
                    headers: opts.headers,
                    queryParameters: opts.queryParameters
                }).url;
            }
            opts.key = opts.key || 'AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc';

            //无标记影像 Aerial,
            //有英文标记影像   AerialWithLabels,
            //矢量道路  Road 
            //OrdnanceSurvey,
            //CollinsBart
            var style = opts.layer || Cesium.BingMapsStyle.Aerial;
            layer = new Cesium.BingMapsImageryProvider(_extends({
                mapStyle: style
            }, opts, {
                url: _url
            }));
            break;

        //===============内部定义的图层====================
        case "custom_grid":
            //网格线  
            opts.cells = opts.cells || 2;
            opts.color = Cesium.Color.fromCssColorString(opts.color || 'rgba(255,255,255,1)');
            opts.glowWidth = opts.glowWidth || 3;
            if (opts.glowColor) opts.glowColor = Cesium.Color.fromCssColorString(opts.glowColor);else opts.glowColor = opts.color.withAlpha(0.3);
            opts.backgroundColor = Cesium.Color.fromCssColorString(opts.backgroundColor || 'rgba(0,0,0,0)');

            layer = new Cesium.GridImageryProvider(opts);
            break;
        case "custom_tilecoord":
            //瓦片信息
            layer = new Cesium.TileCoordinatesImageryProvider(opts);
            break;
        case "custom_featuregrid":
            //自定义矢量网格图层
            layer = new _FeatureGridImageryProvider.FeatureGridImageryProvider(opts);
            break;
        default:
            try {
                marslog.warn("配置中的图层未处理：" + JSON.stringify(item));
            } catch (e) {}
            break;
    }
    layer.config = opts;

    return layer;
};

function getOneKey(arr) {
    var n = Math.floor(Math.random() * arr.length + 1) - 1;
    return arr[n];
}

//===================================== 地形相关 ================================= 

var _ellipsoid = new Cesium.EllipsoidTerrainProvider({
    ellipsoid: Cesium.Ellipsoid.WGS84
});

//是否无地形
function hasTerrain(viewer) {
    return !(viewer.terrainProvider == _ellipsoid || viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider);
}
function getEllipsoidTerrain() {
    return _ellipsoid;
}
function getTerrainProvider(cfg) {
    cfg = cfg || { type: "ion" };
    cfg.requestWaterMask = Cesium.defaultValue(cfg.requestWaterMask, true);
    cfg.requestVertexNormals = Cesium.defaultValue(cfg.requestVertexNormals, true);

    var terrainProvider;
    switch (cfg.type) {
        default:
            //默认是自定义的 
            terrainProvider = new Cesium.CesiumTerrainProvider((0, _util.getProxyUrl)(cfg));
            break;
        case "ion":
        case "cesium":
            //cesium官方在线的
            terrainProvider = new Cesium.CesiumTerrainProvider({
                url: Cesium.IonResource.fromAssetId(1),
                requestWaterMask: cfg.requestWaterMask,
                requestVertexNormals: cfg.requestVertexNormals
            });
            break;
        case "gee":
        case "google":
            //谷歌地球地形服务
            terrainProvider = new Cesium.GoogleEarthEnterpriseTerrainProvider({
                metadata: new Cesium.GoogleEarthEnterpriseMetadata((0, _util.getProxyUrl)(cfg))
            });
            break;
        case "arcgis":
            //ArcGIS地形服务 
            terrainProvider = new Cesium.ArcGISTiledElevationTerrainProvider((0, _util.getProxyUrl)(cfg));
            break;
        case "ellipsoid":
            terrainProvider = _ellipsoid;
            break;
    }

    return terrainProvider;
}

/***/ }),
