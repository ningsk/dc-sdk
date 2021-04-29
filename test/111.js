/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _zepto = __webpack_require__(8);

var _BaseLayer2 = __webpack_require__(15);

var _Draw = __webpack_require__(6);

var _util = __webpack_require__(1);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawLayer = exports.DrawLayer = function (_BaseLayer) {
    _inherits(DrawLayer, _BaseLayer);

    function DrawLayer() {
        _classCallCheck(this, DrawLayer);

        return _possibleConstructorReturn(this, (DrawLayer.__proto__ || Object.getPrototypeOf(DrawLayer)).apply(this, arguments));
    }

    _createClass(DrawLayer, [{
        key: 'create',
        value: function create() {
            this.drawControl = new _Draw.Draw(this.viewer, {
                hasEdit: false,
                nameTooltip: false,
                removeScreenSpaceEvent: false
            });
        }
        //添加 

    }, {
        key: 'add',
        value: function add() {
            if (this._isload) this.drawControl.setVisible(true);else this._loadData();
            _get(DrawLayer.prototype.__proto__ || Object.getPrototypeOf(DrawLayer.prototype), 'add', this).call(this);
        }
        //移除

    }, {
        key: 'remove',
        value: function remove() {
            this.drawControl.setVisible(false);
            _get(DrawLayer.prototype.__proto__ || Object.getPrototypeOf(DrawLayer.prototype), 'remove', this).call(this);
        }
        //定位至数据区域

    }, {
        key: 'centerAt',
        value: function centerAt(duration) {
            var arr = this.drawControl.getEntitys();
            this.viewer.mars.flyTo(arr, { duration: duration });
        }
    }, {
        key: '_loadData',
        value: function _loadData() {
            var that = this;
            _zepto.zepto.ajax({
                type: "get",
                dataType: "json",
                url: this.options.url,
                timeout: 10000,
                success: function success(data) {
                    that._isload = true;
                    var arr = that.drawControl.jsonToEntity(data, true, that.options.flyTo);
                    that._bindEntityConfig(arr);

                    that.fire(_MarsClass.eventType.load, {
                        draw: that.drawControl,
                        entities: arr
                    });
                },
                error: function error(XMLHttpRequest, textStatus, errorThrown) {
                    marslog.warn("json文件" + that.options.url + "加载失败！");
                }
            });
        }
    }, {
        key: '_bindEntityConfig',
        value: function _bindEntityConfig(arrEntity) {
            var that = this;

            for (var i = 0, len = arrEntity.length; i < len; i++) {
                var entity = arrEntity[i];

                //popup弹窗
                if (this.options.columns || this.options.popup) {
                    entity.popup = (0, _util.bindLayerPopup)(this.options.popup, function (entity) {
                        var attr = entity.attribute.attr;
                        attr.layer_name = that.options.name;
                        attr.draw_type = entity.attribute.type;
                        attr.draw_typename = entity.attribute.name;
                        return (0, _util.getPopupForConfig)(that.options, attr);
                    });
                }
                if (this.options.tooltip) {
                    entity.tooltip = (0, _util.bindLayerPopup)(this.options.tooltip, function (entity) {
                        var attr = entity.attribute.attr;
                        attr.layer_name = that.options.name;
                        attr.draw_type = entity.attribute.type;
                        attr.draw_typename = entity.attribute.name;
                        return (0, _util.getPopupForConfig)({ popup: that.options.tooltip }, attr);
                    });
                }
                entity.eventTarget = this;

                if (this.options.contextmenuItems) {
                    entity.contextmenuItems = this.options.contextmenuItems;
                }
            }
        }

        //刷新事件

    }, {
        key: 'refreshEvent',
        value: function refreshEvent() {
            var arrEntity = this.drawControl.getEntitys();
            for (var i = 0, len = arrEntity.length; i < len; i++) {
                var entity = arrEntity[i];

                entity.eventTarget = this;
                entity.contextmenuItems = this.options.contextmenuItems;
            }
            return true;
        }
    }, {
        key: 'updateStyle',
        value: function updateStyle(style) {
            var arrEntity = this.drawControl.getEntitys();
            for (var i = 0, len = arrEntity.length; i < len; i++) {
                var entity = arrEntity[i];
                this.drawControl.updateStyle(style, entity);
            }
            return arrEntity;
        }
    }, {
        key: 'layer',
        get: function get() {
            if (this.drawControl) return this.drawControl.dataSource;else return null;
        }
    }]);

    return DrawLayer;
}(_BaseLayer2.BaseLayer);

/***/ }),
