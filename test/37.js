/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MeasureLength = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _util = __webpack_require__(1);

var util = _interopRequireWildcard(_util);

var _measure = __webpack_require__(30);

var measureUtil = _interopRequireWildcard(_measure);

var _Attr = __webpack_require__(12);

var _MeasureBase2 = __webpack_require__(26);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MeasureLength = exports.MeasureLength = function (_MeasureBase) {
    _inherits(MeasureLength, _MeasureBase);

    //========== 构造方法 ========== 
    function MeasureLength(opts, target) {
        _classCallCheck(this, MeasureLength);

        var _this = _possibleConstructorReturn(this, (MeasureLength.__proto__ || Object.getPrototypeOf(MeasureLength)).call(this, opts, target));

        _this.arrLables = []; //各线段label
        _this.totalLable = null; //总长label 
        _this.disTerrainScale = 1.2; //贴地时的概略比例
        return _this;
    }

    _createClass(MeasureLength, [{
        key: 'clearLastNoEnd',

        //清除未完成的数据
        value: function clearLastNoEnd() {
            if (Cesium.defined(this.totalLable)) this.dataSource.entities.remove(this.totalLable);
            if (Cesium.defined(this.arrLables) && this.arrLables.length > 0) {
                var arrLables = this.arrLables;
                if (arrLables && arrLables.length > 0) {
                    for (var i = 0, len = arrLables.length; i < len; i++) {
                        this.dataSource.entities.remove(arrLables[i]);
                    }
                }
            }
            this.totalLable = null;
            this.arrLables = [];
        }

        //开始绘制

    }, {
        key: '_startDraw',
        value: function _startDraw(options) {
            this.stopDraw();

            //总长label 
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
            this.arrLables = [];

            return this.drawControl.startDraw({
                type: "polyline",
                config: {
                    addHeight: options.addHeight,
                    maxPointNum: options.maxPointNum
                },
                style: _extends({
                    "lineType": "glow",
                    "color": "#ebe12c",
                    "width": 9,
                    "glowPower": 0.1,
                    "clampToGround": false, //是否贴地 
                    "depthFail": true,
                    "depthFailColor": "#ebe12c"
                }, options.style)
            });
        }

        //绘制增加一个点后，显示该分段的长度

    }, {
        key: 'showAddPointLength',
        value: function showAddPointLength(entity) {
            var positions = this.drawControl.getPositions(entity);

            var entityattr = (0, _Attr.style2Entity)(this.labelStyle, {
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                show: true
            });

            var tempSingleLabel = this.dataSource.entities.add({
                position: positions[positions.length - 1],
                label: entityattr,
                _noMousePosition: true,
                attribute: {
                    unit: this.options.unit,
                    type: this.options.type
                }
            });

            if (positions.length == 1) {
                tempSingleLabel.label.text = "起点";
                //tempSingleLabel.attribute.value = 0;
            } else {
                var distance = measureUtil.getLength(positions);
                var lastLen = measureUtil.getLength([positions[positions.length - 2], positions[positions.length - 1]]); //最后2点间距离
                //屏蔽比较小的数值
                // if (lastLen < 5)
                //     tempSingleLabel.show = false;

                tempSingleLabel.attribute.value = distance;
                tempSingleLabel.attribute.valueFD = lastLen;
                tempSingleLabel.showText = function (unit) {
                    var distancestr = util.formatLength(this.attribute.value, unit);
                    if (this.attribute.value != this.attribute.valueFD) {
                        var lastLenStr = util.formatLength(this.attribute.valueFD, unit);
                        this.label.text = distancestr + "\n(+" + lastLenStr + ")";
                    } else {
                        this.label.text = distancestr;
                    }
                };
                tempSingleLabel.showText(this.options.unit);
            }
            this.arrLables.push(tempSingleLabel);
        }
    }, {
        key: 'showRemoveLastPointLength',
        value: function showRemoveLastPointLength(e) {
            var label = this.arrLables.pop();
            this.dataSource.entities.remove(label);

            this.showMoveDrawing(e.entity);
            this.totalLable.position = e.position;
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

            var distance = measureUtil.getLength(positions);
            var distancestr = util.formatLength(distance, this.options.unit);

            //最后2点间距离
            var lastLen = measureUtil.getLength([positions[positions.length - 2], positions[positions.length - 1]]);
            if (lastLen == 0 && positions.length > 2) {
                lastLen = measureUtil.getLength([positions[positions.length - 3], positions[positions.length - 2]]);
            }
            this.totalLable.attribute.value = distance;
            this.totalLable.attribute.valueFD = lastLen;
            this.totalLable.showText = function (unit) {
                var distancestr = util.formatLength(this.attribute.value, unit);
                if (this.attribute.value != this.attribute.valueFD) {
                    var lastLenStr = util.formatLength(this.attribute.valueFD, unit);
                    this.label.text = "总长:" + distancestr + "\n(+" + lastLenStr + ")";
                } else {
                    this.label.text = "总长:" + distancestr;
                }
            };
            this.totalLable.showText(this.options.unit);
            this.totalLable.position = positions[positions.length - 1];
            this.totalLable.label.show = true;

            this.target.fire(_MarsClass.eventType.change, {
                mtype: this.type,
                value: distance,
                label: distancestr
            });
        }
        //绘制完成后

    }, {
        key: 'showDrawEnd',
        value: function showDrawEnd(entity) {
            var positions = this.drawControl.getPositions(entity);
            var count = this.arrLables.length - positions.length;
            if (count >= 0) {
                for (var i = this.arrLables.length - 1; i >= positions.length - 1; i--) {
                    this.dataSource.entities.remove(this.arrLables[i]);
                }
                this.arrLables.splice(positions.length - 1, count + 1);
            }
            entity._totalLable = this.totalLable;
            entity.arrEntityEx = this.arrLables;

            this.totalLable = null;
            this.arrLables = [];

            if (this.type == "length") {
                this.target.fire(_MarsClass.eventType.end, {
                    mtype: this.type,
                    entity: entity,
                    value: entity._totalLable.attribute.value
                });
            }
        }
    }, {
        key: 'type',
        get: function get() {
            return "length";
        }
    }]);

    return MeasureLength;
}(_MeasureBase2.MeasureBase);

/***/ }),
