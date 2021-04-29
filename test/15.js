/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

var _util = __webpack_require__(1);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseLayer = exports.BaseLayer = function (_MarsClass) {
    _inherits(BaseLayer, _MarsClass);

    //========== 构造方法 ========== 
    function BaseLayer(viewer, options) {
        _classCallCheck(this, BaseLayer);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (BaseLayer.__proto__ || Object.getPrototypeOf(BaseLayer)).call(this, options));

        if (options instanceof Cesium.Viewer) {
            var temppar = options;
            options = viewer;
            viewer = temppar;
        }
        if (options.calback) {
            _this.on(_MarsClass2.eventType.load, function (event) {
                options.calback(event.tileset);
            });
        }
        if (options.click) {
            _this.on(_MarsClass2.eventType.click, function (event) {
                options.click(event.sourceTarget, event);
            });
        }
        if (options.mouseover) {
            _this.on(_MarsClass2.eventType.mouseOver, function (event) {
                options.mouseover(event.sourceTarget, event);
            });
        }
        if (options.mouseout) {
            _this.on(_MarsClass2.eventType.mouseOut, function (event) {
                options.mouseout(event.sourceTarget, event);
            });
        }
        _this.config = options;
        _this.getVisible = function () {
            return _this.visible;
        };
        _this.setVisible = function (val) {
            _this.visible = val;
        };
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码


        _this.viewer = viewer;
        _this.options = options; //配置的config信息 

        _this.name = options.name;
        _this.hasZIndex = Cesium.defaultValue(options.hasZIndex, false);
        _this.hasOpacity = Cesium.defaultValue(options.hasOpacity, false);
        _this._opacity = Cesium.defaultValue(options.opacity, 1);
        if (options.hasOwnProperty("alpha")) _this._opacity = Number(options.alpha);

        //单体化时，不可调整透明度 
        if (options.dth) {
            _this.hasOpacity = false;

            options.symbol = options.symbol || {};
            options.symbol.styleOptions = options.symbol.styleOptions || {};
            options.symbol.styleOptions.clampToGround = true;
        }

        _this.create();

        _this._visible = false;
        if (options.visible) {
            if (_this.options.visibleTimeout) {
                setTimeout(function () {
                    _this.visible = true;
                }, _this.options.visibleTimeout);
            } else {
                _this.visible = true;
            }

            if (options.flyTo) {
                _this.centerAt(_this.options.flyToDuration || 0);
            }
        }
        return _this;
    }
    //========== 对外属性 ==========  


    _createClass(BaseLayer, [{
        key: 'create',


        //========== 方法========== 
        value: function create() {
            if (this.options.onCreate) {
                this.options.onCreate(this.viewer);
            }
        }
    }, {
        key: 'showError',
        value: function showError(title, error) {
            if (!error) error = '未知错误';

            if (this.viewer) this.viewer.cesiumWidget.showErrorPanel(title, undefined, error);

            marslog.warn('layer错误:' + title + error);
        }

        //添加 

    }, {
        key: 'add',
        value: function add() {
            this._visible = true;
            this.options.visible = this._visible;

            if (this.options.onAdd) {
                this.options.onAdd(this.viewer);
            }
            this.fire(_MarsClass2.eventType.add);
        }
        //移除

    }, {
        key: 'remove',
        value: function remove() {
            this._visible = false;
            this.options.visible = this._visible;

            if (this.options.onRemove) {
                this.options.onRemove(this.viewer);
            }
            this.fire(_MarsClass2.eventType.remove);
        }
        //定位至数据区域

    }, {
        key: 'centerAt',
        value: function centerAt(duration) {
            if (this.options.extent || this.options.center) {
                this.viewer.mars.centerAt(this.options.extent || this.options.center, { duration: duration, isWgs84: true });
            } else if (this.options.onCenterAt) {
                this.options.onCenterAt(duration, this.viewer);
            }
        }
        //设置透明度

    }, {
        key: 'setOpacity',
        value: function setOpacity(value) {
            if (this.options.onSetOpacity) {
                this.options.onSetOpacity(value, this.viewer);
            }
        }
        //设置叠加顺序

    }, {
        key: 'setZIndex',
        value: function setZIndex(value) {
            if (this.options.onSetZIndex) {
                this.options.onSetZIndex(value, this.viewer);
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.visible = false;
            _get(BaseLayer.prototype.__proto__ || Object.getPrototypeOf(BaseLayer.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'visible',
        get: function get() {
            return this._visible;
        },
        set: function set(val) {
            if (this._visible == val) return;

            this._visible = val;
            this.options.visible = val;

            if (val) {
                if (this.options.msg) (0, _util.msg)(this.options.msg);
                this.add();
            } else {
                this.remove();
            }
        }
    }, {
        key: 'opacity',
        get: function get() {
            return this._opacity;
        },
        set: function set(val) {
            this.setOpacity(val);
        }
    }]);

    return BaseLayer;
}(_MarsClass2.MarsClass);

//[静态属性]本类中支持的事件类型常量


BaseLayer.event = {
    add: _MarsClass2.eventType.add,
    remove: _MarsClass2.eventType.remove,
    load: _MarsClass2.eventType.load,
    click: _MarsClass2.eventType.click,
    mouseOver: _MarsClass2.eventType.mouseOver,
    mouseOut: _MarsClass2.eventType.mouseOut
};

/***/ }),
