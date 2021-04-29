/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WaterLayer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _util = __webpack_require__(1);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

var _point = __webpack_require__(2);

var _BaseLayer2 = __webpack_require__(15);

var _zepto = __webpack_require__(8);

var _Attr = __webpack_require__(21);

var _water = __webpack_require__(55);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WaterLayer = exports.WaterLayer = function (_BaseLayer) {
    _inherits(WaterLayer, _BaseLayer);

    function WaterLayer() {
        _classCallCheck(this, WaterLayer);

        return _possibleConstructorReturn(this, (WaterLayer.__proto__ || Object.getPrototypeOf(WaterLayer)).apply(this, arguments));
    }

    _createClass(WaterLayer, [{
        key: 'create',
        value: function create() {}
        //添加 

    }, {
        key: 'add',
        value: function add() {
            this.primitives = new Cesium.PrimitiveCollection();
            this.viewer.scene.primitives.add(this.primitives);

            if (this.arrData) {
                this.createWater();
            } else {
                this.queryData();
            }
            _get(WaterLayer.prototype.__proto__ || Object.getPrototypeOf(WaterLayer.prototype), 'add', this).call(this);
        }
        //移除

    }, {
        key: 'remove',
        value: function remove() {
            this.viewer.scene.primitives.remove(this.primitives);
            _get(WaterLayer.prototype.__proto__ || Object.getPrototypeOf(WaterLayer.prototype), 'remove', this).call(this);
        }
        //定位至数据区域

    }, {
        key: 'centerAt',
        value: function centerAt(duration) {
            if (this.options.extent || this.options.center) {
                this.viewer.mars.centerAt(this.options.extent || this.options.center, { duration: duration, isWgs84: true });
            } else {
                if (this.rectangle) this.viewer.mars.centerAt(this.rectangle, { duration: duration });
            }
        }
    }, {
        key: 'clearData',
        value: function clearData() {
            if (this.primitives) this.primitives.removeAll();
            this.arrData = null;
        }
    }, {
        key: 'setData',
        value: function setData(geojson) {
            //兼容不同命名
            this.clearData();
            return this.queryData(geojson);
        }
    }, {
        key: 'queryData',
        value: function queryData(geojson) {
            var that = this;

            var config = (0, _util.getProxyUrl)(this.options);
            geojson = geojson || config.url || config.data;
            if (!geojson) return; //没有需要加载的对象

            if (config.url) {
                _zepto.zepto.ajax({
                    type: "get",
                    dataType: "json",
                    url: config.url,
                    timeout: Cesium.defaultValue(config.timeout, 0), //永不超时
                    success: function success(geojson) {
                        var dataSource = Cesium.GeoJsonDataSource.load(geojson);
                        dataSource.then(function (dataSource) {
                            var entities = dataSource.entities.values;
                            that.showResult(entities);
                        }).otherwise(function (error) {
                            that.showError("服务出错", error);
                        });
                    },
                    error: function error(XMLHttpRequest, textStatus, errorThrown) {
                        marslog.warn(config.url + "文件加载失败！");
                    }
                });
            } else {
                var dataSource = Cesium.GeoJsonDataSource.load(geojson, config);
                dataSource.then(function (dataSource) {
                    var entities = dataSource.entities.values;
                    that.showResult(entities);
                }).otherwise(function (error) {
                    that.showError("服务出错", error);
                });
            }
        }
    }, {
        key: 'showResult',
        value: function showResult(entities) {
            var positionsALL = [];
            var arrData = [];

            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];

                var positions = (0, _Attr.getPositions)(entity);
                positionsALL = positionsALL.concat(positions);

                positions = (0, _point.setPositionsHeight)(positions, 0);

                var watercfg = this.getWaterCfg(entity);
                var height = Cesium.defaultValue(watercfg.height, 0);

                arrData.push({
                    positions: positions,
                    height: height,
                    config: watercfg
                });
            }

            this.rectangle = (0, _point.getRectangle)(positionsALL, true);

            this.arrData = arrData;
            this.createWater();

            this.fire(_MarsClass.eventType.load, {
                primitives: this.primitives,
                data: arrData
            });
        }
    }, {
        key: 'createWater',
        value: function createWater() {
            if (!this._visible) return;

            for (var i = 0; i < this.arrData.length; i++) {
                var item = this.arrData[i];

                // 水效果
                var polygon = new Cesium.PolygonGeometry({
                    height: item.height, //水面高度
                    extrudedHeight: item.height, //底部高 
                    polygonHierarchy: new Cesium.PolygonHierarchy(item.positions)
                });
                var primitive = (0, _water.createWaterPrimitive)(polygon, item.config);
                primitive.height_bak = item.height;
                this.primitives.add(primitive);
            }

            if (this.options.flyTo) this.centerAt(this.options.flyToDuration);
        }
    }, {
        key: 'getWaterCfg',
        value: function getWaterCfg(entity) {
            var attr = (0, _util.getAttrVal)(entity.properties);

            var symbol = this.options.symbol;
            var styleOpt = symbol.styleOptions;

            if (symbol.styleField) {
                //存在多个symbol，按styleField进行分类
                var styleFieldVal = attr[symbol.styleField];
                var styleOptField = symbol.styleFieldOptions[styleFieldVal];
                if (styleOptField != null) {
                    styleOpt = clone(styleOpt);
                    styleOpt = _extends({}, styleOpt, styleOptField);
                }
            }

            if (typeof symbol.callback === 'function') {
                //只是动态返回symbol的自定义的回调方法，返回style
                var styleOptField = symbol.callback(attr, entity, symbol);
                if (!styleOptField) return;

                styleOpt = clone(styleOpt);
                styleOpt = _extends({}, styleOpt, styleOptField);
            }
            styleOpt = styleOpt || {};

            return styleOpt;
        }

        //更新 闸门内 水域

    }, {
        key: 'updateHeight',
        value: function updateHeight(height) {
            var eRadis = 6378137;
            for (var i = 0; i < this.primitives.length; i++) {
                var primitive = this.primitives.get(i);

                var n = (eRadis + height) / (eRadis + primitive.height_bak);
                var modelMatrix = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(n, n, n));
                primitive.modelMatrix = modelMatrix;
            }
        }
    }, {
        key: 'layer',
        get: function get() {
            return this.primitives;
        }
    }]);

    return WaterLayer;
}(_BaseLayer2.BaseLayer);

/***/ }),
