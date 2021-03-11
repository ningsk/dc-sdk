/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GltfLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _BaseLayer2 = __webpack_require__(15);

var _Attr = __webpack_require__(31);

var _util = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GltfLayer = exports.GltfLayer = function (_BaseLayer) {
    _inherits(GltfLayer, _BaseLayer);

    //========== 构造方法 ========== 
    function GltfLayer(viewer, options) {
        _classCallCheck(this, GltfLayer);

        var _this = _possibleConstructorReturn(this, (GltfLayer.__proto__ || Object.getPrototypeOf(GltfLayer)).call(this, viewer, options));

        _this.hasOpacity = true;
        return _this;
    }

    _createClass(GltfLayer, [{
        key: 'add',

        //添加 
        value: function add() {
            if (this.entity) {
                this.viewer.entities.add(this.entity);
            } else {
                this.initData();
            }
            _get(GltfLayer.prototype.__proto__ || Object.getPrototypeOf(GltfLayer.prototype), 'add', this).call(this);
        }
        //移除

    }, {
        key: 'remove',
        value: function remove() {
            this.viewer.entities.remove(this.entity);
            _get(GltfLayer.prototype.__proto__ || Object.getPrototypeOf(GltfLayer.prototype), 'remove', this).call(this);
        }
        //定位至数据区域

    }, {
        key: 'centerAt',
        value: function centerAt(duration) {
            if (this.entity == null) return;

            if (this.options.extent || this.options.center) {
                this.viewer.mars.centerAt(this.options.extent || this.options.center, { duration: duration, isWgs84: true });
            } else {
                var cfg = this.options.position;
                this.viewer.mars.centerPoint(cfg, { duration: duration, isWgs84: true });
            }
        }
    }, {
        key: 'initData',
        value: function initData() {
            var _this2 = this;

            //位置信息
            var cfg = this.options.position;
            cfg = this.viewer.mars.point2map(cfg); //转换坐标系
            var position = Cesium.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);

            //样式信息
            var style = this.options.style || {};
            if (Cesium.defined(this._opacity) && this._opacity != 1) style.opacity = this._opacity;

            //方向
            var heading = Cesium.Math.toRadians(style.heading || cfg.heading || 0);
            var pitch = Cesium.Math.toRadians(style.pitch || cfg.pitch || 0);
            var roll = Cesium.Math.toRadians(style.roll || cfg.roll || 0);
            var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            var converter = this.options.converter || Cesium.Transforms.eastNorthUpToFixedFrame;
            var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr, this.viewer.scene.globe.ellipsoid, converter);

            var modelattr = (0, _Attr.style2Entity)(style);
            modelattr.uri = this.options.url;

            this.entity = this.viewer.entities.add({
                name: this.options.name,
                position: position,
                orientation: orientation,
                model: modelattr,
                //dc扩展的属性
                _config: this.options,
                eventTarget: this
            });

            //readyPromise为修改cesium内部源码来实现的回调
            this.entity.readyPromise = function (entity, model) {
                _this2.fire(_MarsClass.eventType.load, { entity: entity, model: model });
            };

            var config = this.options;
            if (this.options.popup) {
                this.entity.popup = {
                    html: function html(entity) {
                        var attr = entity.properties || entity.data || {};

                        if ((0, _util.isString)(attr)) return attr;else return (0, _util.getPopupForConfig)(config, attr);
                    },
                    anchor: config.popupAnchor || [0, -15]
                };
            }
            if (this.options.tooltip) {
                this.entity.tooltip = {
                    html: function html(entity) {
                        var attr = entity.properties || entity.data || {};

                        if ((0, _util.isString)(attr)) return attr;else return (0, _util.getPopupForConfig)({ popup: config.tooltip }, attr);
                    },
                    anchor: config.tooltipAnchor || [0, -15]
                };
            }

            this.fire(_MarsClass.eventType.loadBefore, { entity: this.entity });
        }
        //设置透明度

    }, {
        key: 'setOpacity',
        value: function setOpacity(value) {
            if (this.entity == null) return;
            this.entity.model.color = Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(value);
        }
    }, {
        key: 'layer',
        get: function get() {
            return this.entity;
        }
    }, {
        key: 'model',
        get: function get() {
            return this.entity;
        }
    }]);

    return GltfLayer;
}(_BaseLayer2.BaseLayer);

//[静态属性]本类中支持的事件类型常量


GltfLayer.event = {
    load: _MarsClass.eventType.load,
    loadBefore: _MarsClass.eventType.loadBefore,
    click: _MarsClass.eventType.click,
    mouseOver: _MarsClass.eventType.mouseOver,
    mouseOut: _MarsClass.eventType.mouseOut
};

/***/ }),
