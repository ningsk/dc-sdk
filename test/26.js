/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MeasureBase = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

var _index = __webpack_require__(20);

var _Draw = __webpack_require__(6);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//显示测量结果文本的字体
var defaultLabelStyle = (0, _index.getDefStyle)("label", {
    "color": "#ffffff",
    "font_size": 20,
    "border": true,
    "border_color": "#000000",
    "border_width": 3,
    "background": true,
    "background_color": "#000000",
    "background_opacity": 0.5,
    "scaleByDistance": true,
    "scaleByDistance_far": 800000,
    "scaleByDistance_farValue": 0.5,
    "scaleByDistance_near": 1000,
    "scaleByDistance_nearValue": 1,
    "pixelOffset": [0, -15],
    "visibleDepth": false //一直显示，不被地形等遮挡
});

var MeasureBase = exports.MeasureBase = function (_MarsClass) {
    _inherits(MeasureBase, _MarsClass);

    //========== 构造方法 ========== 
    function MeasureBase(options, target) {
        _classCallCheck(this, MeasureBase);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (MeasureBase.__proto__ || Object.getPrototypeOf(MeasureBase)).call(this, options));

        if (options instanceof Cesium.Viewer) {
            target.viewer = options;
            options = target;
            target = null;
        }
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

        _this.viewer = options.viewer;
        _this.config = options;
        _this.target = target || _this; //用于抛出的事件对象

        //文本样式
        if (Cesium.defined(options.label)) {
            _this.labelStyle = _extends({}, defaultLabelStyle, options.label);
        } else {
            _this.labelStyle = _extends({}, defaultLabelStyle);
        }

        //标绘对象
        _this.drawControl = options.draw;
        if (!_this.drawControl) {
            _this.drawControl = new _Draw.Draw(viewer, _extends({
                hasEdit: false
            }, options));
            _this.hasDelDraw = true;
        }

        _this._bindEvent();
        return _this;
    }

    _createClass(MeasureBase, [{
        key: '_bindEvent',
        value: function _bindEvent() {
            var _this2 = this;

            //事件监听
            this.drawControl.on(_Draw.Draw.event.drawAddPoint, function (e) {
                var entity = e.entity;
                if (entity.type != _this2.type) return;
                _this2.entity = entity;
                _this2.showAddPointLength(entity);

                _this2.target.fire(_Draw.Draw.event.drawAddPoint, e);
            });
            this.drawControl.on(_Draw.Draw.event.drawRemovePoint, function (e) {
                if (e.entity.type != _this2.type) return;
                _this2.showRemoveLastPointLength(e);
                _this2.target.fire(_Draw.Draw.event.drawRemovePoint, e);
            });
            this.drawControl.on(_Draw.Draw.event.drawMouseMove, function (e) {
                var entity = e.entity;
                if (entity.type != _this2.type) return;
                _this2.entity = entity;
                _this2.showMoveDrawing(entity);
                _this2.target.fire(_Draw.Draw.event.drawMouseMove, e);
            });

            this.drawControl.on(_Draw.Draw.event.drawCreated, function (e) {
                var entity = e.entity;
                if (entity.type != _this2.type) return;

                _this2.entity = entity;
                _this2.showDrawEnd(entity);
                _this2.bindDeleteContextmenu(entity);
                _this2.entity = null;
                _this2.target.fire(_Draw.Draw.event.drawCreated, e);
            });
        }
    }, {
        key: 'showAddPointLength',
        value: function showAddPointLength(entity) {}
    }, {
        key: 'showRemoveLastPointLength',
        value: function showRemoveLastPointLength(e) {}
    }, {
        key: 'showMoveDrawing',
        value: function showMoveDrawing(entity) {}
    }, {
        key: 'showDrawEnd',
        value: function showDrawEnd(entity) {}
    }, {
        key: 'startDraw',
        value: function startDraw(options) {
            var _this3 = this;

            this.options = options || {};
            this.options.style = this.options.style || {};

            //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
            if (this.options.calback) {
                this.target.off(_MarsClass2.eventType.change);
                this.target.on(_MarsClass2.eventType.change, function (e) {
                    _this3.options.calback(e.value, e.label, e);
                });
            }
            if (this.options.onStart) {
                this.target.off(_MarsClass2.eventType.start);
                this.target.on(_MarsClass2.eventType.start, this.options.onStart);
            }
            if (this.options.onEnd) {
                this.target.off(_MarsClass2.eventType.end);
                this.target.on(_MarsClass2.eventType.end, this.options.onEnd);
            }
            //兼容v2.2之前旧版本处理,非升级用户可删除上面代码


            var entity = this._startDraw(this.options);
            entity.type = this.type;
        }
    }, {
        key: '_startDraw',
        value: function _startDraw() {}

        //取消并停止绘制
        //如果上次未完成绘制就单击了新的，清除之前未完成的。

    }, {
        key: 'stopDraw',
        value: function stopDraw() {
            this.clearLastNoEnd();
            this.drawControl.stopDraw();
        }

        //外部控制，完成绘制，比如手机端无法双击结束 

    }, {
        key: 'endDraw',
        value: function endDraw() {
            if (this.entity) {
                this.showMoveDrawing(this.entity);
                this.entity = null;
            }
            this.drawControl.endDraw();
        }

        /*清除测量*/

    }, {
        key: 'clear',
        value: function clear() {
            this.stopDraw();
            this.drawControl.deleteAll();

            this.target.fire(_MarsClass2.eventType.delete, {
                mtype: this.type
            });
        }
    }, {
        key: 'bindDeleteContextmenu',


        //右键菜单
        value: function bindDeleteContextmenu(entity) {
            var that = this;
            entity.contextmenuItems = entity.contextmenuItems || [];
            entity.contextmenuItems.push({
                text: '删除测量',
                iconCls: 'fa fa-trash-o',
                visible: function visible(e) {
                    that.drawControl.closeTooltip();

                    var entity = e.target;
                    if (entity.inProgress && !entity.editing) return false;else return true;
                },
                callback: function callback(e) {
                    var entity = e.target;

                    if (Cesium.defined(entity._totalLable)) {
                        that.dataSource.entities.remove(entity._totalLable);
                        delete entity._totalLable;
                    }
                    if (Cesium.defined(entity.arrEntityEx) && entity.arrEntityEx.length > 0) {
                        var arrLables = entity.arrEntityEx;
                        if (arrLables && arrLables.length > 0) {
                            for (var i = 0, len = arrLables.length; i < len; i++) {
                                that.dataSource.entities.remove(arrLables[i]);
                            }
                        }
                        delete entity.arrEntityEx;
                    }
                    if (entity._exLine) {
                        that.dataSource.entities.remove(entity._exLine);
                        delete entity._exLine;
                    }

                    that.drawControl.deleteEntity(entity);

                    that.drawControl.closeTooltip();
                    that.viewer.mars.popup.close();

                    that.target.fire(_MarsClass2.eventType.delete, {
                        mtype: that.type,
                        entity: entity
                    });
                }
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.clear();

            if (this.hasDelDraw) {
                this.drawControl.destroy();
                delete this.drawControl;
            }
            _get(MeasureBase.prototype.__proto__ || Object.getPrototypeOf(MeasureBase.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'draw',
        get: function get() {
            return this.drawControl;
        }
    }, {
        key: 'dataSource',
        get: function get() {
            return this.drawControl.dataSource;
        }
    }]);

    return MeasureBase;
}(_MarsClass2.MarsClass);
//[静态属性]本类中支持的事件类型常量


MeasureBase.event = {
    start: _MarsClass2.eventType.start,
    change: _MarsClass2.eventType.change,
    end: _MarsClass2.eventType.end,
    delete: _MarsClass2.eventType.delete
};

/***/ }),
