
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TileLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _BaseLayer2 = __webpack_require__(15);

var _layer = __webpack_require__(23);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileLayer = exports.TileLayer = function (_BaseLayer) {
    _inherits(TileLayer, _BaseLayer);

    //========== 构造方法 ========== 
    function TileLayer(viewer, options) {
        _classCallCheck(this, TileLayer);

        var _this = _possibleConstructorReturn(this, (TileLayer.__proto__ || Object.getPrototypeOf(TileLayer)).call(this, viewer, options));

        _this.hasOpacity = true;
        _this.hasZIndex = true;
        return _this;
    }

    _createClass(TileLayer, [{
        key: 'add',


        //添加 
        value: function add() {
            if (this.imageryLayer != null) {
                this.remove();
            }

            this.addEx();
            var imageryProvider = this.createImageryProvider(this.options);
            if (!Cesium.defined(imageryProvider)) return;

            var options = this.options;

            var imageryOpt = {
                show: true, alpha: this._opacity
            };
            if (Cesium.defined(options.rectangle) && Cesium.defined(options.rectangle.xmin) && Cesium.defined(options.rectangle.xmax) && Cesium.defined(options.rectangle.ymin) && Cesium.defined(options.rectangle.ymax)) {
                var xmin = options.rectangle.xmin;
                var xmax = options.rectangle.xmax;
                var ymin = options.rectangle.ymin;
                var ymax = options.rectangle.ymax;
                var rectangle = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
                this.rectangle = rectangle;
                imageryOpt.rectangle = rectangle;
            }
            if (Cesium.defined(options.bbox) && options.bbox.length && options.bbox.length == 4) {
                var rectangle = Cesium.Rectangle.fromDegrees(options.bbox[0], options.bbox[1], options.bbox[2], options.bbox[3]); //[xmin,ymin,xmax,ymax]
                this.rectangle = rectangle;
                imageryOpt.rectangle = rectangle;
            }

            if (Cesium.defined(options.brightness)) imageryOpt.brightness = options.brightness;
            if (Cesium.defined(options.contrast)) imageryOpt.contrast = options.contrast;
            if (Cesium.defined(options.hue)) imageryOpt.hue = options.hue;
            if (Cesium.defined(options.saturation)) imageryOpt.saturation = options.saturation;
            if (Cesium.defined(options.gamma)) imageryOpt.gamma = options.gamma;
            if (Cesium.defined(options.maximumAnisotropy)) imageryOpt.maximumAnisotropy = options.maximumAnisotropy;
            if (Cesium.defined(options.minimumTerrainLevel)) imageryOpt.minimumTerrainLevel = options.minimumTerrainLevel;
            if (Cesium.defined(options.maximumTerrainLevel)) imageryOpt.maximumTerrainLevel = options.maximumTerrainLevel;

            this.imageryLayer = new Cesium.ImageryLayer(imageryProvider, imageryOpt);
            this.imageryLayer.eventTarget = this;
            this.imageryLayer.config = this.options;

            var that = this;
            this.imageryLayer.onLoadTileStart = function (imagery) {
                that.fire(_MarsClass.eventType.loadTileStart, { imagery: imagery });
            };
            this.imageryLayer.onLoadTileEnd = function (imagery) {
                that.fire(_MarsClass.eventType.loadTileEnd, { imagery: imagery });
            };
            this.imageryLayer.onLoadTileError = function (imagery) {
                that.fire(_MarsClass.eventType.loadTileError, { imagery: imagery });
            };

            this.viewer.imageryLayers.add(this.imageryLayer);

            this.setZIndex(this.options.order);

            _get(TileLayer.prototype.__proto__ || Object.getPrototypeOf(TileLayer.prototype), 'add', this).call(this);

            this.fire(_MarsClass.eventType.load, {
                imageryLayer: this.imageryLayer
            });
        }
        //方便外部继承覆盖该方法

    }, {
        key: 'createImageryProvider',
        value: function createImageryProvider(config) {
            return (0, _layer.createImageryProvider)(config); //调用layer.js
        }
    }, {
        key: 'addEx',
        value: function addEx() {}
        //子类使用

        //移除

    }, {
        key: 'remove',
        value: function remove() {
            if (this.imageryLayer == null) return;

            this.removeEx();
            this.viewer.imageryLayers.remove(this.imageryLayer, true);
            this.imageryLayer = null;
            _get(TileLayer.prototype.__proto__ || Object.getPrototypeOf(TileLayer.prototype), 'remove', this).call(this);
        }
    }, {
        key: 'removeEx',
        value: function removeEx() {}
        //子类使用

        //定位至数据区域

    }, {
        key: 'centerAt',
        value: function centerAt(duration) {
            if (this.imageryLayer == null) return;

            if (this.options.extent || this.options.center) {
                this.viewer.mars.centerAt(this.options.extent || this.options.center, { duration: duration, isWgs84: true });
            } else if (Cesium.defined(this.rectangle)) {
                this.viewer.camera.flyTo({
                    destination: this.rectangle,
                    duration: duration
                });
            } else {
                var rectangle = this.imageryLayer.imageryProvider.rectangle; //arcgis图层等，读取配置信息
                if (Cesium.defined(rectangle) && rectangle != Cesium.Rectangle.MAX_VALUE && rectangle.west > 0 && rectangle.south > 0 && rectangle.east > 0 && rectangle.north > 0) {
                    this.viewer.camera.flyTo({
                        destination: rectangle,
                        duration: duration
                    });
                }
            }
        }
        //设置透明度

    }, {
        key: 'setOpacity',
        value: function setOpacity(value) {
            this._opacity = value;
            if (this.imageryLayer == null) return;

            this.imageryLayer.alpha = value;
        }
        //设置叠加顺序

    }, {
        key: 'setZIndex',
        value: function setZIndex(order) {
            if (this.imageryLayer == null || order == null) return;

            //先移动到最顶层
            this.viewer.imageryLayers.raiseToTop(this.imageryLayer);

            var layers = this.viewer.imageryLayers._layers;
            for (var i = layers.length - 1; i >= 0; i--) {
                if (layers[i] == this.imageryLayer) continue;
                var _temp = layers[i].config;
                if (_temp && _temp.order) {
                    if (order < _temp.order) {
                        this.viewer.imageryLayers.lower(this.imageryLayer); //下移一个位置
                    }
                }
            }
        }
    }, {
        key: 'layer',
        get: function get() {
            return this.imageryLayer;
        }
    }]);

    return TileLayer;
}(_BaseLayer2.BaseLayer);
//[静态属性]本类中支持的事件类型常量


TileLayer.event = {
    loadTileStart: _MarsClass.eventType.loadTileStart,
    loadTileEnd: _MarsClass.eventType.loadTileEnd,
    loadTileError: _MarsClass.eventType.loadTileError,
    load: _MarsClass.eventType.load,
    click: _MarsClass.eventType.click,
    mouseOver: _MarsClass.eventType.mouseOver,
    mouseOut: _MarsClass.eventType.mouseOut
};

/***/ }),
