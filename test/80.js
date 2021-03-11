/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MeasureLengthSurface = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _util = __webpack_require__(1);

var util = _interopRequireWildcard(_util);

var _measure = __webpack_require__(30);

var measureUtil = _interopRequireWildcard(_measure);

var _MeasureLength2 = __webpack_require__(37);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//贴地线
var MeasureLengthSurface = exports.MeasureLengthSurface = function (_MeasureLength) {
    _inherits(MeasureLengthSurface, _MeasureLength);

    function MeasureLengthSurface() {
        _classCallCheck(this, MeasureLengthSurface);

        return _possibleConstructorReturn(this, (MeasureLengthSurface.__proto__ || Object.getPrototypeOf(MeasureLengthSurface)).apply(this, arguments));
    }

    _createClass(MeasureLengthSurface, [{
        key: '_startDraw',

        //开始绘制
        value: function _startDraw(options) {
            options.style.clampToGround = true;

            return _get(MeasureLengthSurface.prototype.__proto__ || Object.getPrototypeOf(MeasureLengthSurface.prototype), '_startDraw', this).call(this, options);
        }

        //绘制完成后

    }, {
        key: 'showDrawEnd',
        value: function showDrawEnd(entity) {
            _get(MeasureLengthSurface.prototype.__proto__ || Object.getPrototypeOf(MeasureLengthSurface.prototype), 'showDrawEnd', this).call(this, entity);
            this.updateLengthForTerrain(entity);
        }

        //计算贴地线

    }, {
        key: 'updateLengthForTerrain',
        value: function updateLengthForTerrain(entity) {
            var that = this;
            var positions = entity.polyline.positions.getValue(viewer.clock.currentTime);
            var arrLables = entity.arrEntityEx;
            var totalLable = entity._totalLable;
            var unit = totalLable && totalLable.attribute && totalLable.attribute.unit;

            this.target.fire(_MarsClass.eventType.start, {
                mtype: this.type
            });

            //求贴地线长度
            measureUtil.getClampLength(positions, {
                scene: viewer.scene,
                splitNum: that.options.splitNum,
                has3dtiles: that.options.has3dtiles,
                disTerrainScale: that.disTerrainScale, //求高度失败，概略估算值
                //计算每个分段后的回调方法
                endItem: function endItem(result) {
                    var index = result.index;
                    var all_distance = result.all_distance;
                    var distance = result.distance;

                    index++;
                    var thisLabel = arrLables[index];
                    if (thisLabel) {
                        thisLabel.attribute.value = all_distance;
                        thisLabel.attribute.valueFD = distance;
                        thisLabel.showText(unit);
                    } else if (index == positions.length - 1 && totalLable) {
                        //最后一个 
                        totalLable.attribute.value = all_distance;
                        totalLable.attribute.valueFD = distance;
                        totalLable.showText(unit);
                    }
                },
                //计算全部完成的回调方法
                callback: function callback(all_distance) {
                    var distancestr = util.formatLength(all_distance, unit);

                    that.target.fire(_MarsClass.eventType.change, {
                        mtype: that.type,
                        value: all_distance,
                        label: distancestr
                    });
                    that.target.fire(_MarsClass.eventType.end, {
                        mtype: that.type,
                        entity: entity,
                        value: all_distance
                    });
                }
            });
        }
    }, {
        key: 'type',
        get: function get() {
            return "lengthSurface";
        }
    }]);

    return MeasureLengthSurface;
}(_MeasureLength2.MeasureLength);

/***/ }),
