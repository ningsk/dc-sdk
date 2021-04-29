/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MeasureAreaSurface = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _measure = __webpack_require__(30);

var measureUtil = _interopRequireWildcard(_measure);

var _point = __webpack_require__(2);

var _MeasureArea2 = __webpack_require__(36);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//贴地线
var MeasureAreaSurface = exports.MeasureAreaSurface = function (_MeasureArea) {
    _inherits(MeasureAreaSurface, _MeasureArea);

    function MeasureAreaSurface() {
        _classCallCheck(this, MeasureAreaSurface);

        return _possibleConstructorReturn(this, (MeasureAreaSurface.__proto__ || Object.getPrototypeOf(MeasureAreaSurface)).apply(this, arguments));
    }

    _createClass(MeasureAreaSurface, [{
        key: '_startDraw',

        //开始绘制
        value: function _startDraw(options) {
            options.style.clampToGround = true;

            return _get(MeasureAreaSurface.prototype.__proto__ || Object.getPrototypeOf(MeasureAreaSurface.prototype), '_startDraw', this).call(this, options);
        }
        //绘制完成后

    }, {
        key: 'showDrawEnd',
        value: function showDrawEnd(entity) {
            // super.showDrawEnd(entity); 
            if (entity.polygon == null) return;

            entity._totalLable = this.totalLable;
            this.totalLable = null;

            this.updateAreaForTerrain(entity);
        }

        //计算贴地面

    }, {
        key: 'updateAreaForTerrain',
        value: function updateAreaForTerrain(entity) {
            var _this2 = this;

            var that = this;

            //更新lable等
            var totalLable = entity._totalLable;
            var unit = totalLable && totalLable.attribute && totalLable.attribute.unit;
            var thisCenter = (0, _point.getPositionValue)(totalLable.position);

            var positions = this.drawControl.getPositions(entity);

            this.target.fire(_MarsClass.eventType.start, {
                mtype: this.type
            });

            //贴地总面积
            measureUtil.getClampArea(positions, {
                scene: viewer.scene,
                splitNum: this.options.splitNum,
                has3dtiles: this.options.has3dtiles,
                asyn: true, //异步求准确的
                callback: function callback(area, resultInter) {
                    // if (that.options.onInterEnd)
                    //     that.options.onInterEnd(resultInter);

                    totalLable.position = (0, _point.setPositionsHeight)(thisCenter, resultInter.maxHeight); //更新lable高度

                    totalLable.attribute.value = area;
                    var areastr = totalLable.showText(unit);

                    _this2.target.fire(_MarsClass.eventType.change, {
                        mtype: _this2.type,
                        value: area,
                        label: areastr
                    });
                    _this2.target.fire(_MarsClass.eventType.end, _extends({}, resultInter, {
                        mtype: _this2.type,
                        entity: entity,
                        value: area
                    }));
                }
            });
        }
    }, {
        key: 'type',
        get: function get() {
            return "areaSurface";
        }
    }]);

    return MeasureAreaSurface;
}(_MeasureArea2.MeasureArea);

/***/ }),
