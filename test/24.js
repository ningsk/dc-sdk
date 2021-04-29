/************************************************************************/
/******/ ([
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawPoint = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _point = __webpack_require__(2);

var _Attr = __webpack_require__(35);

var attr = _interopRequireWildcard(_Attr);

var _Attr2 = __webpack_require__(12);

var _Tooltip = __webpack_require__(7);

var _Edit = __webpack_require__(59);

var _Draw = __webpack_require__(44);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawPoint = exports.DrawPoint = function (_DrawBase) {
    _inherits(DrawPoint, _DrawBase);

    //========== 构造方法 ========== 
    function DrawPoint(opts) {
        _classCallCheck(this, DrawPoint);

        var _this = _possibleConstructorReturn(this, (DrawPoint.__proto__ || Object.getPrototypeOf(DrawPoint)).call(this, opts));

        _this.type = 'point';
        _this.attrClass = attr; //对应的属性控制静态类 
        _this.editClass = _Edit.EditPoint; //获取编辑对象

        return _this;
    }

    //根据attribute参数创建Entity


    _createClass(DrawPoint, [{
        key: 'createFeature',
        value: function createFeature(attribute, dataSource) {
            dataSource = dataSource || this.dataSource;
            this._positions_draw = null;

            //绘制时，是否自动隐藏entity，可避免拾取坐标存在问题。
            var _drawShow = Cesium.defaultValue(attribute.drawShow, false);

            var that = this;
            var addattr = {
                show: _drawShow,
                _drawShow: _drawShow, //edit编辑时使用
                position: new Cesium.CallbackProperty(function (time) {
                    return that.getDrawPosition();
                }, false),
                point: attr.style2Entity(attribute.style),
                attribute: attribute
            };

            if (attribute.style && attribute.style.label) {
                //同时加文字
                addattr.label = (0, _Attr2.style2Entity)(attribute.style.label);
            }

            this.entity = dataSource.entities.add(addattr); //创建要素对象
            //子类使用
            if (this.createFeatureEx) this.createFeatureEx(attribute.style, this.entity);
            return this.entity;
        }
        //重新激活绘制

    }, {
        key: 'reCreateFeature',
        value: function reCreateFeature(entity) {
            this.entity = entity;
            this._positions_draw = entity.position;
            return this.entity;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            if (style && style.label) {
                //同时加文字
                (0, _Attr2.style2Entity)(style.label, entity.label);
            }
            if (entity.featureEx) {
                entity.featureEx.updateStyle(style);
            }
            return attr.style2Entity(style, entity.point);
        }
        //绑定鼠标事件

    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var _this2 = this;

            this.getHandler().setInputAction(function (event) {
                var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.endPosition, _this2.entity);
                if (point) {
                    _this2._positions_draw = point;
                    if (_this2.entity.featureEx) {
                        _this2.entity.featureEx.position = point;
                    }
                }
                _this2.tooltip.showAt(event.endPosition, _this2.entity.draw_tooltip || _Tooltip.message.draw.point.start);

                _this2.fire(_MarsClass.eventType.drawMouseMove, { drawtype: _this2.type, entity: _this2.entity, position: point });
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            this.getHandler().setInputAction(function (event) {
                var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.position, _this2.entity);
                if (point) {
                    _this2._positions_draw = point;
                }

                if (_this2._positions_draw) _this2.disable();
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
        //获取外部entity的坐标到_positions_draw

    }, {
        key: 'setDrawPositionByEntity',
        value: function setDrawPositionByEntity(entity) {
            var positions = this.getPositions(entity);
            this._positions_draw = positions[0];
        }
        //图形绘制结束,更新属性

    }, {
        key: 'finish',
        value: function finish() {
            this.entity.show = true;

            this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象     
            this.entity.position = this.getDrawPosition();
            if (this.entity.featureEx) {
                this.entity.featureEx.position = this.getDrawPosition();
                this.entity.featureEx.finish();
            }
        }
    }]);

    return DrawPoint;
}(_Draw.DrawBase);

/***/ }),
