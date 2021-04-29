/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FeatureGridLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _TileLayer2 = __webpack_require__(41);

var _config2Entity = __webpack_require__(32);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FeatureGridLayer = exports.FeatureGridLayer = function (_TileLayer) {
    _inherits(FeatureGridLayer, _TileLayer);

    //========== 构造方法 ========== 
    function FeatureGridLayer(viewer, options) {
        _classCallCheck(this, FeatureGridLayer);

        var _this = _possibleConstructorReturn(this, (FeatureGridLayer.__proto__ || Object.getPrototypeOf(FeatureGridLayer)).call(this, viewer, options));

        _this.hasOpacity = false;
        return _this;
    }
    //========== 对外属性 ========== 


    _createClass(FeatureGridLayer, [{
        key: "create",
        value: function create() {
            var _this2 = this;

            this.dataSource = new Cesium.CustomDataSource(); //用于entity
            this._bindClustering(this.options.clustering);

            this.primitives = new Cesium.PrimitiveCollection(); //用于primitive

            this.options.id = Cesium.defaultValue(this.options.id, new Date().getTime());

            var that = this;
            this.options.type_new = "custom_featuregrid";
            this.options.addImageryCache = function (opts) {
                return that._addImageryCache(opts);
            };
            this.options.removeImageryCache = function (opts) {
                return that._removeImageryCache(opts);
            };
            this.options.removeAllImageryCache = function (opts) {
                return that._removeAllImageryCache(opts);
            };

            if (Cesium.defined(this.options.minimumLevel)) this.options.minimumTerrainLevel = this.options.minimumLevel;
            if (Cesium.defined(this.options.maximumLevel)) this.options.maximumTerrainLevel = this.options.maximumLevel;

            //是建筑物单体化时
            if (this.options.dth) {
                var dthEvent = (0, _config2Entity.createDthEntity)(this.viewer, this.options.dth);

                if (this.options.dth.type == "click") {
                    this.on(_MarsClass.eventType.click, function (e) {
                        dthEvent.mouseover(e.sourceTarget);
                    });
                    this.viewer.mars.on(_MarsClass.eventType.clickMap, function (e) {
                        if (!_this2._visible) return;
                        dthEvent.mouseout();
                    });
                } else {
                    this.on(_MarsClass.eventType.mouseOver, function (e) {
                        dthEvent.mouseover(e.sourceTarget);
                    });
                    this.on(_MarsClass.eventType.mouseOut, function (e) {
                        dthEvent.mouseout();
                    });
                }
                this.dthEvent = dthEvent;
            }

            var config = this.options;
            if (config.symbol && config.symbol.styleOptions) {
                var style = config.symbol.styleOptions;
                if (Cesium.defined(style.clampToGround)) {
                    config.clampToGround = style.clampToGround;
                }
                if (Cesium.defined(style.color)) {
                    var color = Cesium.Color.fromCssColorString(Cesium.defaultValue(style.color, "#FFFF00")).withAlpha(Number(Cesium.defaultValue(style.opacity, 0.5)));
                    config.fill = color;
                }
                if (Cesium.defined(style.outlineColor)) {
                    var outlineColor = Cesium.Color.fromCssColorString(style.outlineColor || "#FFFFFF").withAlpha(Cesium.defaultValue(style.outlineOpacity, Cesium.defaultValue(style.opacity, 1.0)));
                    config.stroke = outlineColor;
                }
                if (Cesium.defined(style.outlineWidth)) {
                    config.strokeWidth = style.outlineWidth;
                }
                this.options = config;
            }
        }
    }, {
        key: "getLength",
        value: function getLength() {
            return this.primitives.length + this.dataSource.entities.values.length;
        }
    }, {
        key: "addEx",
        value: function addEx() {
            this.viewer.dataSources.add(this.dataSource);
            this.viewer.scene.primitives.add(this.primitives);
        }
    }, {
        key: "removeEx",
        value: function removeEx() {
            //是建筑物单体化时
            if (this.dthEvent) {
                this.dthEvent.mouseout();
            }
            this.viewer.dataSources.remove(this.dataSource);
            this.viewer.scene.primitives.remove(this.primitives);
        }
    }, {
        key: "_addImageryCache",
        value: function _addImageryCache(opts) {}
    }, {
        key: "_removeImageryCache",
        value: function _removeImageryCache(opts) {}
    }, {
        key: "_removeAllImageryCache",
        value: function _removeAllImageryCache() {}
        //聚合处理

    }, {
        key: "_bindClustering",
        value: function _bindClustering(options) {
            options = options || { enabled: false };

            this.dataSource.clustering.enabled = Cesium.defaultValue(options.enabled, false);
            this.dataSource.clustering.pixelRange = Cesium.defaultValue(options.pixelRange, 20); //多少像素矩形范围内聚合

            //一些属性      
            var color = Cesium.Color.fromCssColorString(Cesium.defaultValue(options.color, "#00ff00")).withAlpha(Cesium.defaultValue(options.opacity, 1.0));
            var size = Cesium.defaultValue(options.pixelSize, 48);
            var heightReference = Cesium.defaultValue(options.heightReference, Cesium.HeightReference.CLAMP_TO_GROUND);
            if (options.clampToGround) heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;

            var singleDigitPins = {};
            var pinBuilder = new Cesium.PinBuilder();
            this.dataSource.clustering.clusterEvent.addEventListener(function (clusteredEntities, cluster) {
                var count = clusteredEntities.length;

                cluster.label.show = false;
                cluster.billboard.show = true;
                cluster.billboard.id = cluster.label.id;
                cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                cluster.billboard.heightReference = heightReference; //贴地

                if (!singleDigitPins[count]) {
                    singleDigitPins[count] = pinBuilder.fromText(count, color, size).toDataURL();
                }
                cluster.billboard.image = singleDigitPins[count];
            });
        }
    }, {
        key: "layer",
        get: function get() {
            return this.dataSource;
        }
    }]);

    return FeatureGridLayer;
}(_TileLayer2.TileLayer);

/***/ }),
