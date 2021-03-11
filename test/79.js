/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MeasureLengthSection = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _util = __webpack_require__(1);

var util = _interopRequireWildcard(_util);

var _point = __webpack_require__(2);

var _polyline = __webpack_require__(22);

var _MeasureLength2 = __webpack_require__(37);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MeasureLengthSection = exports.MeasureLengthSection = function (_MeasureLength) {
    _inherits(MeasureLengthSection, _MeasureLength);

    function MeasureLengthSection() {
        _classCallCheck(this, MeasureLengthSection);

        return _possibleConstructorReturn(this, (MeasureLengthSection.__proto__ || Object.getPrototypeOf(MeasureLengthSection)).apply(this, arguments));
    }

    _createClass(MeasureLengthSection, [{
        key: '_startDraw',

        //开始绘制
        value: function _startDraw(options) {
            options.style.clampToGround = true;
            options.splitNum = Cesium.defaultValue(options.splitNum, 200);

            return _get(MeasureLengthSection.prototype.__proto__ || Object.getPrototypeOf(MeasureLengthSection.prototype), '_startDraw', this).call(this, options);
        }

        //绘制完成后

    }, {
        key: 'showDrawEnd',
        value: function showDrawEnd(entity) {
            _get(MeasureLengthSection.prototype.__proto__ || Object.getPrototypeOf(MeasureLengthSection.prototype), 'showDrawEnd', this).call(this, entity);
            this.updateSectionForTerrain(entity);
        }

        //计算剖面

    }, {
        key: 'updateSectionForTerrain',
        value: function updateSectionForTerrain(entity) {
            var _this2 = this;

            var positions = entity.polyline.positions.getValue(viewer.clock.currentTime);
            if (positions.length < 2) return;

            var arrLables = entity.arrEntityEx;
            var totalLable = entity._totalLable;
            var unit = totalLable && totalLable.attribute && totalLable.attribute.unit;

            this.target.fire(_MarsClass.eventType.start, {
                mtype: this.type
            });

            var all_distance = 0;
            var arrLen = [];
            var arrHB = [];
            var arrLX = [];
            var arrPoint = [];
            // var positionsNew = [];

            var that = this;
            (0, _polyline.computeStepSurfaceLine)({
                viewer: viewer,
                positions: positions,
                splitNum: that.options.splitNum,
                has3dtiles: that.options.has3dtiles,
                //计算每个分段后的回调方法
                endItem: function endItem(raisedPositions, noHeight, index) {
                    var h1 = Cesium.Cartographic.fromCartesian(positions[index]).height;
                    var h2 = Cesium.Cartographic.fromCartesian(positions[index + 1]).height;
                    var hstep = (h2 - h1) / raisedPositions.length;

                    var this_distance = 0;
                    for (var i = 0; i < raisedPositions.length; i++) {
                        //长度
                        if (i != 0) {
                            var templen = Cesium.Cartesian3.distance(raisedPositions[i], raisedPositions[i - 1]);
                            all_distance += templen;
                            this_distance += templen;
                        }
                        arrLen.push(Number(all_distance.toFixed(1)));

                        //海拔高度
                        var point = (0, _point.formatPosition)(raisedPositions[i]);
                        arrHB.push(point.z);
                        arrPoint.push(point);

                        //路线高度
                        var fxgd = Number((h1 + hstep * i).toFixed(1));
                        arrLX.push(fxgd);
                    }

                    index++;
                    var thisLabel = arrLables[index];
                    if (thisLabel) {
                        thisLabel.attribute.value = all_distance;
                        thisLabel.attribute.valueFD = this_distance;
                        thisLabel.showText(unit);
                    } else if (index == positions.length - 1 && totalLable) {
                        //最后一个 
                        totalLable.attribute.value = all_distance;
                        totalLable.attribute.valueFD = this_distance;
                        totalLable.showText(unit);
                    }
                },
                //计算全部完成的回调方法
                end: function end() {
                    var distancestr = util.formatLength(all_distance, unit);

                    _this2.target.fire(_MarsClass.eventType.end, {
                        mtype: _this2.type,
                        entity: entity,

                        distancestr: distancestr,
                        distance: all_distance,
                        arrLen: arrLen,
                        arrLX: arrLX,
                        arrHB: arrHB,
                        arrPoint: arrPoint
                    });
                }
            });
        }
    }, {
        key: 'type',
        get: function get() {
            return "section";
        }
    }]);

    return MeasureLengthSection;
}(_MeasureLength2.MeasureLength);

/***/ }),
