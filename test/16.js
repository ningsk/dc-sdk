/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawPolyline = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _point = __webpack_require__(2);

var _Tooltip = __webpack_require__(7);

var _Attr = __webpack_require__(19);

var attr = _interopRequireWildcard(_Attr);

var _Edit = __webpack_require__(25);

var _Draw = __webpack_require__(44);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawPolyline = exports.DrawPolyline = function (_DrawBase) {
    _inherits(DrawPolyline, _DrawBase);

    //========== 构造方法 ========== 
    function DrawPolyline(opts) {
        _classCallCheck(this, DrawPolyline);

        var _this = _possibleConstructorReturn(this, (DrawPolyline.__proto__ || Object.getPrototypeOf(DrawPolyline)).call(this, opts));

        _this.type = 'polyline';
        _this.attrClass = attr; //对应的属性控制静态类 
        _this.editClass = _Edit.EditPolyline; //获取编辑对象

        _this._minPointNum = 2; //至少需要点的个数 
        _this._maxPointNum = 9999; //最多允许点的个数 
        return _this;
    }

    //根据attribute参数创建Entity


    _createClass(DrawPolyline, [{
        key: 'createFeature',
        value: function createFeature(attribute, dataSource) {
            dataSource = dataSource || this.dataSource;
            this._positions_draw = [];

            if (!this._minPointNum_def) this._minPointNum_def = this._minPointNum;
            if (!this._maxPointNum_def) this._maxPointNum_def = this._maxPointNum;

            if (attribute.config) {
                //允许外部传入
                this._minPointNum = attribute.config.minPointNum || this._minPointNum_def;
                this._maxPointNum = attribute.config.maxPointNum || this._maxPointNum_def;
            } else {
                this._minPointNum = this._minPointNum_def;
                this._maxPointNum = this._maxPointNum_def;
            }

            var that = this;
            var addattr = {
                polyline: attr.style2Entity(attribute.style),
                attribute: attribute
            };
            addattr.polyline.positions = new Cesium.CallbackProperty(function (time) {
                return that.getDrawPosition();
            }, false);

            this.entity = dataSource.entities.add(addattr); //创建要素对象
            this.entity._positions_draw = this._positions_draw;
            return this.entity;
        }
        //重新激活绘制

    }, {
        key: 'reCreateFeature',
        value: function reCreateFeature(entity) {
            if (!this._minPointNum_def) this._minPointNum_def = this._minPointNum;
            if (!this._maxPointNum_def) this._maxPointNum_def = this._maxPointNum;

            var attribute = entity.attribute;
            if (attribute.config) {
                //允许外部传入
                this._minPointNum = attribute.config.minPointNum || this._minPointNum_def;
                this._maxPointNum = attribute.config.maxPointNum || this._maxPointNum_def;
            } else {
                this._minPointNum = this._minPointNum_def;
                this._maxPointNum = this._maxPointNum_def;
            }

            this.entity = entity;
            this._positions_draw = entity._positions_draw || entity.polyline.positions.getValue(this.viewer.clock.currentTime);;
            return this.entity;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            return attr.style2Entity(style, entity.polyline);
        }
        //绑定鼠标事件

    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var _this2 = this;

            var lastPointTemporary = false;
            this.getHandler().setInputAction(function (event) {
                //单击添加点
                var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.position, _this2.entity);
                if (!point && lastPointTemporary) {
                    //如果未拾取到点，并且存在MOUSE_MOVE时，取最后一个move的点
                    point = _this2._positions_draw[_this2._positions_draw.length - 1];
                }

                if (point) {
                    if (lastPointTemporary) {
                        _this2._positions_draw.pop();
                    }
                    lastPointTemporary = false;

                    //消除双击带来的多余经纬度 
                    if (_this2._positions_draw.length > 1) {
                        var mpt1 = _this2._positions_draw[_this2._positions_draw.length - 1];
                        if (Math.abs(mpt1.x - point.x) < 0.01 && Math.abs(mpt1.y - point.y) < 0.01 && Math.abs(mpt1.z - point.z) < 0.01) _this2._positions_draw.pop();
                    }

                    //在绘制点基础自动增加高度
                    if (_this2.entity.attribute && _this2.entity.attribute.config && _this2.entity.attribute.config.addHeight) point = (0, _point.addPositionsHeight)(point, _this2.entity.attribute.config.addHeight);

                    _this2._positions_draw.push(point);
                    _this2.updateAttrForDrawing();

                    _this2.fire(_MarsClass.eventType.drawAddPoint, { drawtype: _this2.type, entity: _this2.entity, position: point, positions: _this2._positions_draw });

                    if (_this2._positions_draw.length >= _this2._maxPointNum) {
                        //点数满足最大数量，自动结束
                        _this2.disable();
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            this.getHandler().setInputAction(function (event) {
                //右击删除上一个点
                _this2._positions_draw.pop(); //删除最后标的一个点

                var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.position, _this2.entity);
                if (point) {
                    if (lastPointTemporary) {
                        _this2._positions_draw.pop();
                    }
                    lastPointTemporary = true;

                    _this2.fire(_MarsClass.eventType.drawRemovePoint, { drawtype: _this2.type, entity: _this2.entity, position: point, positions: _this2._positions_draw });

                    _this2._positions_draw.push(point);
                    _this2.updateAttrForDrawing();
                }
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

            this.getHandler().setInputAction(function (event) {
                //鼠标移动

                if (_this2._positions_draw.length <= 1) _this2.tooltip.showAt(event.endPosition, _Tooltip.message.draw.polyline.start);else if (_this2._positions_draw.length < _this2._minPointNum) //点数不满足最少数量
                    _this2.tooltip.showAt(event.endPosition, _Tooltip.message.draw.polyline.cont);else if (_this2._positions_draw.length >= _this2._maxPointNum) //点数满足最大数量
                    _this2.tooltip.showAt(event.endPosition, _Tooltip.message.draw.polyline.end2);else _this2.tooltip.showAt(event.endPosition, _Tooltip.message.draw.polyline.end);

                var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.endPosition, _this2.entity);
                if (point) {
                    if (lastPointTemporary) {
                        _this2._positions_draw.pop();
                    }
                    lastPointTemporary = true;

                    _this2._positions_draw.push(point);
                    _this2.updateAttrForDrawing();

                    _this2.fire(_MarsClass.eventType.drawMouseMove, { drawtype: _this2.type, entity: _this2.entity, position: point, positions: _this2._positions_draw });
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            this.getHandler().setInputAction(function (event) {
                //双击结束标绘 
                //消除双击带来的多余经纬度 
                if (_this2._positions_draw.length > 1) {
                    var mpt1 = _this2._positions_draw[_this2._positions_draw.length - 1];
                    var mpt2 = _this2._positions_draw[_this2._positions_draw.length - 2];
                    if (Math.abs(mpt1.x - mpt2.x) < 0.01 && Math.abs(mpt1.y - mpt2.y) < 0.01 && Math.abs(mpt1.z - mpt2.z) < 0.01) _this2._positions_draw.pop();
                }

                _this2.endDraw();
            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        }
        //外部控制，完成绘制，比如手机端无法双击结束

    }, {
        key: 'endDraw',
        value: function endDraw() {
            if (!this._enabled) {
                return this;
            }

            if (this._positions_draw.length < this._minPointNum) return; //点数不够
            this.updateAttrForDrawing();
            this.disable();
        }
    }, {
        key: 'updateAttrForDrawing',
        value: function updateAttrForDrawing(isLoad) {}
        //图形绘制结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            var entity = this.entity;

            entity.editing = this.getEditClass(entity); //绑定编辑对象   

            entity._positions_draw = this.getDrawPosition();
            // entity.polyline.positions = new Cesium.CallbackProperty((time)=> {
            //     return entity._positions_draw;
            // }, false);

            //显示depthFailMaterial时，不能使用CallbackProperty属性，否则depthFailMaterial不显示
            if (Cesium.defined(entity.polyline.depthFailMaterial)) {
                entity.polyline.positions = entity._positions_draw;
            } else {
                entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
                    return entity._positions_draw;
                }, false);
            }
        }
    }]);

    return DrawPolyline;
}(_Draw.DrawBase);

/***/ }),
