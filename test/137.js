/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FloodByEntity = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

var _point = __webpack_require__(2);

var _Attr = __webpack_require__(21);

var polygonAttr = _interopRequireWildcard(_Attr);

var _tileset = __webpack_require__(27);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//淹没分析(平面)类
var FloodByEntity = exports.FloodByEntity = function (_MarsClass) {
    _inherits(FloodByEntity, _MarsClass);

    //========== 构造方法 ========== 
    function FloodByEntity(options, oldparam) {
        _classCallCheck(this, FloodByEntity);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (FloodByEntity.__proto__ || Object.getPrototypeOf(FloodByEntity)).call(this, options));

        if (oldparam) {
            oldparam.viewer = options;
            options = oldparam;
        }
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

        _this.viewer = options.viewer;
        return _this;
    }

    //========== 对外属性 ==========  
    //高度


    _createClass(FloodByEntity, [{
        key: 'start',


        //========== 方法 ========== 


        //开发分析
        value: function start(entity, options) {
            var _this2 = this;

            this.stop();

            this.entity = entity;
            this.options = options;

            //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
            if (this.options.onChange) {
                this.off(_MarsClass2.eventType.change);
                this.on(_MarsClass2.eventType.change, function (e) {
                    _this2.options.onChange(e.height);
                });
            }
            if (this.options.onStop) {
                this.off(_MarsClass2.eventType.end);
                this.on(_MarsClass2.eventType.end, this.options.onStop);
            }
            //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

            this.extrudedHeight = options.height;
            this.entity.polygon.extrudedHeight = new Cesium.CallbackProperty(function (time) {
                return _this2.extrudedHeight;
            }, false);

            this.fire(_MarsClass2.eventType.start);

            //修改高度值
            var positions = polygonAttr.getPositions(this.entity);
            var _has3dtiles = Cesium.defaultValue(options.has3dtiles, Cesium.defined((0, _tileset.pick3DTileset)(this.viewer.scene, positions))); //是否在3ditiles上面
            if (!_has3dtiles) {
                this._last_depthTestAgainstTerrain = this.viewer.scene.globe.depthTestAgainstTerrain;
                this.viewer.scene.globe.depthTestAgainstTerrain = true;
            }

            positions = (0, _point.setPositionsHeight)(positions, options.height);
            this.entity.polygon.hierarchy = new Cesium.PolygonHierarchy(positions);

            this.timeIdx = setInterval(function () {
                if (_this2.extrudedHeight >= _this2.options.maxHeight) {
                    _this2.stop();
                    return;
                }
                var newHeight = _this2.extrudedHeight + _this2.options.speed;
                if (newHeight > _this2.options.maxHeight) {
                    _this2.extrudedHeight = _this2.options.maxHeight;
                } else {
                    _this2.extrudedHeight = newHeight;
                }

                _this2.fire(_MarsClass2.eventType.change, {
                    height: _this2.extrudedHeight
                });
            }, 100);
        }
        //停止分析

    }, {
        key: 'stop',
        value: function stop() {
            clearInterval(this.timeIdx);
            this.fire(_MarsClass2.eventType.end);
        }

        //清除分析

    }, {
        key: 'clear',
        value: function clear() {
            this.stop();
            if (this._last_depthTestAgainstTerrain !== null) this.viewer.scene.globe.depthTestAgainstTerrain = this._last_depthTestAgainstTerrain;
            this.entity = null;
        }

        //更新高度

    }, {
        key: 'updateHeight',
        value: function updateHeight(height) {
            this.extrudedHeight = height;

            this.fire(_MarsClass2.eventType.change, {
                height: this.extrudedHeight
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.clear();
            _get(FloodByEntity.prototype.__proto__ || Object.getPrototypeOf(FloodByEntity.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'height',
        get: function get() {
            return this.extrudedHeight;
        },
        set: function set(val) {
            this.extrudedHeight = val;
        }
    }]);

    return FloodByEntity;
}(_MarsClass2.MarsClass);

//[静态属性]本类中支持的事件类型常量


FloodByEntity.event = {
    start: _MarsClass2.eventType.start,
    change: _MarsClass2.eventType.change,
    end: _MarsClass2.eventType.end
};

/***/ }),
