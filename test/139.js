/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Measure = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

var _util = __webpack_require__(1);

var util = _interopRequireWildcard(_util);

var _Draw = __webpack_require__(6);

var _MeasureBase = __webpack_require__(26);

var _MeasureAngle = __webpack_require__(74);

var _MeasureArea = __webpack_require__(36);

var _MeasureAreaSurface = __webpack_require__(76);

var _MeasureHeight = __webpack_require__(77);

var _MeasureHeightTriangle = __webpack_require__(78);

var _MeasureLength = __webpack_require__(37);

var _MeasureLengthSection = __webpack_require__(79);

var _MeasureLengthSurface = __webpack_require__(80);

var _MeasurePoint = __webpack_require__(81);

var _MeasureVolume = __webpack_require__(82);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //提供测量长度、面积等 [绘制基于draw]

//量算类(统一入口)
var Measure = exports.Measure = function (_MarsClass) {
    _inherits(Measure, _MarsClass);

    function Measure(options, oldparam) {
        _classCallCheck(this, Measure);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (Measure.__proto__ || Object.getPrototypeOf(Measure)).call(this));

        if (oldparam) {
            oldparam.viewer = options;
            options = oldparam;
        }
        _this.clearMeasure = _this.clear; //别名, 但不建议使用。
        _this.measureLength = _this.length;
        _this.measuerLength = _this.length;
        _this.measureSection = _this.section;
        _this.measureArea = _this.area;
        _this.measureHeight = _this.height;
        _this.measureAngle = _this.angle;
        _this.measurePoint = _this.point;
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

        _this.options = options;

        // 标绘对象
        _this.drawControl = new _Draw.Draw(options.viewer, _extends({
            hasEdit: false
        }, options));
        _this.options.draw = _this.drawControl;

        return _this;
    }

    _createClass(Measure, [{
        key: 'length',


        /*长度测量*/
        value: function length(opts) {
            this.stopDraw();
            if (opts && opts.terrain) {
                //兼容v2.2之前旧版本处理,贴地 
                return this.surfaceLength(opts);
            } else {
                if (!this._measureLength) {
                    this._measureLength = new _MeasureLength.MeasureLength(this.options, this);
                }
                this._measureLength.startDraw(opts);
                return this._measureLength;
            }
        }

        /*贴地 长度测量*/

    }, {
        key: 'surfaceLength',
        value: function surfaceLength(opts) {
            this.stopDraw();
            if (!this._measureLengthSurface) {
                this._measureLengthSurface = new _MeasureLengthSurface.MeasureLengthSurface(this.options, this);
            }
            this._measureLengthSurface.startDraw(opts);
            return this._measureLengthSurface;
        }

        /*剖面分析*/

    }, {
        key: 'section',
        value: function section(opts) {
            this.stopDraw();
            if (!this._measureLengthSection) {
                this._measureLengthSection = new _MeasureLengthSection.MeasureLengthSection(this.options, this);
            }
            this._measureLengthSection.startDraw(opts);
            return this._measureLengthSection;
        }

        /*面积测量*/

    }, {
        key: 'area',
        value: function area(opts) {
            this.stopDraw();
            if (opts && opts.terrain) {
                //兼容v2.2之前旧版本处理,贴地
                return this.surfaceeArea(opts);
            } else {
                if (!this._measureArea) {
                    this._measureArea = new _MeasureArea.MeasureArea(this.options, this);
                }
                this._measureArea.startDraw(opts);
                return this._measureArea;
            }
        }
    }, {
        key: 'surfaceeArea',


        /*贴地 面积测量*/
        value: function surfaceeArea(opts) {
            this.stopDraw();
            if (!this._measureAreaSurface) {
                this._measureAreaSurface = new _MeasureAreaSurface.MeasureAreaSurface(this.options, this);
            }
            this._measureAreaSurface.startDraw(opts);
            return this._measureAreaSurface;
        }

        /*体积测量（方量分析）*/

    }, {
        key: 'volume',
        value: function volume(opts) {
            this.stopDraw();
            if (!this._measureVolume) {
                this._measureVolume = new _MeasureVolume.MeasureVolume(this.options, this);
            }
            this._measureVolume.startDraw(opts);
            return this._measureVolume;
        }

        /*高度测量*/

    }, {
        key: 'height',
        value: function height(opts) {
            this.stopDraw();
            if (opts && opts.isSuper) {
                //兼容v2.2之前旧版本处理,三角测量
                return this.triangleHeight(opts);
            } else {
                if (!this._measureHeight) {
                    this._measureHeight = new _MeasureHeight.MeasureHeight(this.options, this);
                }
                this._measureHeight.startDraw(opts);
                return this._measureHeight;
            }
        }
    }, {
        key: 'triangleHeight',


        /*三角高度测量*/
        value: function triangleHeight(opts) {
            this.stopDraw();
            if (!this._measureHeightTriangle) {
                this._measureHeightTriangle = new _MeasureHeightTriangle.MeasureHeightTriangle(this.options, this);
            }
            this._measureHeightTriangle.startDraw(opts);
            return this._measureHeightTriangle;
        }
    }, {
        key: 'angle',


        /*角度测量*/
        value: function angle(opts) {
            this.stopDraw();
            if (!this._measureAngle) {
                this._measureAngle = new _MeasureAngle.MeasureAngle(this.options, this);
            }
            this._measureAngle.startDraw(opts);
            return this._measureAngle;
        }
    }, {
        key: 'point',


        /*坐标测量*/
        value: function point(opts) {
            this.stopDraw();
            if (!this._measurePoint) {
                this._measurePoint = new _MeasurePoint.MeasurePoint(this.options, this);
            }
            this._measurePoint.startDraw(opts);
            return this._measurePoint;
        }
    }, {
        key: 'stopDraw',


        //取消并停止绘制
        //如果上次未完成绘制就单击了新的，清除之前未完成的。
        value: function stopDraw() {
            if (this._measureAngle) this._measureAngle.stopDraw();
            if (this._measureArea) this._measureArea.stopDraw();
            if (this._measureAreaSurface) this._measureAreaSurface.stopDraw();
            if (this._measureHeight) this._measureHeight.stopDraw();
            if (this._measureHeightTriangle) this._measureHeightTriangle.stopDraw();
            if (this._measureLength) this._measureLength.stopDraw();
            if (this._measureLengthSection) this._measureLengthSection.stopDraw();
            if (this._measureLengthSurface) this._measureLengthSurface.stopDraw();
            if (this._measurePoint) this._measurePoint.stopDraw();
            if (this._measureVolume) this._measureVolume.stopDraw();
        }

        //外部控制，完成绘制，比如手机端无法双击结束 

    }, {
        key: 'endDraw',
        value: function endDraw() {
            if (this._measureAngle) this._measureAngle.endDraw();
            if (this._measureArea) this._measureArea.endDraw();
            if (this._measureAreaSurface) this._measureAreaSurface.endDraw();
            if (this._measureHeight) this._measureHeight.endDraw();
            if (this._measureHeightTriangle) this._measureHeightTriangle.endDraw();
            if (this._measureLength) this._measureLength.endDraw();
            if (this._measureLengthSection) this._measureLengthSection.endDraw();
            if (this._measureLengthSurface) this._measureLengthSurface.endDraw();
            if (this._measurePoint) this._measurePoint.endDraw();
            if (this._measureVolume) this._measureVolume.endDraw();
        }

        /*清除测量*/

    }, {
        key: 'clear',
        value: function clear() {
            if (this._measureAngle) this._measureAngle.clear();
            if (this._measureArea) this._measureArea.clear();
            if (this._measureAreaSurface) this._measureAreaSurface.clear();
            if (this._measureHeight) this._measureHeight.clear();
            if (this._measureHeightTriangle) this._measureHeightTriangle.clear();
            if (this._measureLength) this._measureLength.clear();
            if (this._measureLengthSection) this._measureLengthSection.clear();
            if (this._measureLengthSurface) this._measureLengthSurface.clear();
            if (this._measurePoint) this._measurePoint.clear();
            if (this._measureVolume) this._measureVolume.clear();
        }
    }, {
        key: 'updateUnit',


        /** 更新量测结果的单位 */
        value: function updateUnit(unit, oldparam) {
            //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
            if (oldparam) {
                unit = oldparam;
            }
            //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

            var arr = this.dataSource.entities.values;
            for (var i = 0, len = arr.length; i < len; i++) {
                var entity = arr[i];
                if (entity.label && entity.attribute && entity.showText) {
                    entity.showText(unit);
                }
            }
        }
    }, {
        key: 'formatArea',
        value: function formatArea(val, unit) {
            return util.formatArea(val, unit);
        }
    }, {
        key: 'formatLength',
        value: function formatLength(val, unit) {
            return util.formatLength(val, unit);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.stopDraw();
            this.clear();

            this.drawControl.destroy();
            _get(Measure.prototype.__proto__ || Object.getPrototypeOf(Measure.prototype), 'destroy', this).call(this);
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

    return Measure;
}(_MarsClass2.MarsClass);

//[静态属性]本类中支持的事件类型常量


Measure.event = _MeasureBase.MeasureBase.event;

/***/ }),
