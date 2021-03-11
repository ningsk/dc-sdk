/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MeasureAngle = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _util = __webpack_require__(1);

var util = _interopRequireWildcard(_util);

var _measure = __webpack_require__(30);

var measureUtil = _interopRequireWildcard(_measure);

var _matrix = __webpack_require__(17);

var _Attr = __webpack_require__(12);

var _Attr2 = __webpack_require__(19);

var _MeasureBase2 = __webpack_require__(26);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MeasureAngle = exports.MeasureAngle = function (_MeasureBase) {
    _inherits(MeasureAngle, _MeasureBase);

    //========== 构造方法 ========== 
    function MeasureAngle(opts, target) {
        _classCallCheck(this, MeasureAngle);

        var _this = _possibleConstructorReturn(this, (MeasureAngle.__proto__ || Object.getPrototypeOf(MeasureAngle)).call(this, opts, target));

        _this.totalLable = null; //角度label  
        _this.exLine = null; //辅助线
        return _this;
    }

    _createClass(MeasureAngle, [{
        key: 'clearLastNoEnd',


        //清除未完成的数据
        value: function clearLastNoEnd() {
            if (this.totalLable != null) this.dataSource.entities.remove(this.totalLable);
            this.totalLable = null;

            if (this.exLine != null) this.dataSource.entities.remove(this.exLine);
            this.exLine = null;
        }
        //开始绘制

    }, {
        key: '_startDraw',
        value: function _startDraw(options) {
            var entityattr = (0, _Attr.style2Entity)(this.labelStyle, {
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                show: false
            });

            this.totalLable = this.dataSource.entities.add({
                label: entityattr,
                _noMousePosition: true,
                attribute: {
                    unit: options.unit,
                    type: options.type
                }
            });

            return this.drawControl.startDraw({
                type: "polyline",
                config: { maxPointNum: 2 },
                style: _extends({
                    "lineType": "arrow",
                    "color": "#ebe967",
                    "width": 9,
                    "clampToGround": true,
                    "depthFail": true,
                    "depthFailColor": "#ebe967"
                }, options.style)
            });
        }
        //绘制增加一个点后，显示该分段的长度

    }, {
        key: 'showAddPointLength',
        value: function showAddPointLength(entity) {
            this.showMoveDrawing(entity); //兼容手机端
        }
        //绘制中删除了最后一个点

    }, {
        key: 'showRemoveLastPointLength',
        value: function showRemoveLastPointLength(e) {
            if (this.exLine) {
                this.dataSource.entities.remove(this.exLine);
                this.exLine = null;
            }
            if (this.totalLable) this.totalLable.label.show = false;
        }
        //绘制过程移动中，动态显示长度信息

    }, {
        key: 'showMoveDrawing',
        value: function showMoveDrawing(entity) {
            var positions = this.drawControl.getPositions(entity);
            if (positions.length < 2) {
                this.totalLable.label.show = false;
                return;
            }

            //求长度
            var len = Cesium.Cartesian3.distance(positions[0], positions[1]);

            //求方位角
            var bearing = measureUtil.getAngle(positions[0], positions[1]);;

            //求参考点  
            var new_position = (0, _matrix.getRotateCenterPoint)(positions[0], positions[1], -bearing);
            this.updateExLine([positions[0], new_position]); //参考线

            //显示文本
            this.totalLable.attribute.value = bearing;
            this.totalLable.attribute.valueLen = len;
            this.totalLable.showText = function (unit) {
                var lenstr = util.formatLength(this.attribute.valueLen, unit);
                this.label.text = "角度:" + this.attribute.value + "°\n距离:" + lenstr;
                return lenstr;
            };
            var lenstr = this.totalLable.showText(this.options.unit);

            this.totalLable.position = positions[1];
            this.totalLable.label.show = true;

            this.target.fire(_MarsClass.eventType.change, {
                mtype: this.type,
                value: bearing,
                label: lenstr,
                length: len
            });
        }
    }, {
        key: 'updateExLine',
        value: function updateExLine(positions) {
            if (this.exLine) {
                this.exLine._positions = positions;
            } else {
                var entityattr = (0, _Attr2.style2Entity)(this.options.styleEx, {
                    positions: new Cesium.CallbackProperty(function (time) {
                        return exLine._positions;
                    }, false),
                    width: 3,
                    clampToGround: true,
                    material: new Cesium.PolylineDashMaterialProperty({
                        color: Cesium.Color.RED
                    })
                });

                var exLine = this.dataSource.entities.add({
                    polyline: entityattr
                });
                exLine._positions = positions;
                this.exLine = exLine;
            }
        }
        //绘制完成后

    }, {
        key: 'showDrawEnd',
        value: function showDrawEnd(entity) {
            entity._totalLable = this.totalLable;
            this.totalLable = null;

            entity._exLine = this.exLine;
            this.exLine = null;

            this.target.fire(_MarsClass.eventType.end, {
                mtype: this.type,
                entity: entity,
                value: entity._totalLable.attribute.value
            });
        }
    }, {
        key: 'type',
        get: function get() {
            return "angle";
        }
    }]);

    return MeasureAngle;
}(_MeasureBase2.MeasureBase);

/***/ }),
