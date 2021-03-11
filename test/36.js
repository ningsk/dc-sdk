/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MeasureArea = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _util = __webpack_require__(1);

var util = _interopRequireWildcard(_util);

var _measure = __webpack_require__(30);

var measureUtil = _interopRequireWildcard(_measure);

var _point = __webpack_require__(2);

var _Attr = __webpack_require__(12);

var _MeasureBase2 = __webpack_require__(26);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MeasureArea = exports.MeasureArea = function (_MeasureBase) {
    _inherits(MeasureArea, _MeasureBase);

    //========== 构造方法 ========== 
    function MeasureArea(opts, target) {
        _classCallCheck(this, MeasureArea);

        var _this = _possibleConstructorReturn(this, (MeasureArea.__proto__ || Object.getPrototypeOf(MeasureArea)).call(this, opts, target));

        _this.totalLable = null; //面积label
        return _this;
    }

    _createClass(MeasureArea, [{
        key: 'clearLastNoEnd',


        //清除未完成的数据
        value: function clearLastNoEnd() {
            if (this.totalLable != null) this.dataSource.entities.remove(this.totalLable);
            this.totalLable = null;
        }
        //开始绘制

    }, {
        key: '_startDraw',
        value: function _startDraw(options) {
            var entityattr = (0, _Attr.style2Entity)(this.labelStyle, {
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
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
                type: "polygon",
                style: _extends({
                    color: "#00fff2",
                    outline: true,
                    outlineColor: "#fafa5a",
                    outlineWidth: 1,
                    opacity: 0.4,
                    clampToGround: false }, options.style)
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
            var positions = this.drawControl.getPositions(e.entity);
            if (positions.length < 3) {
                this.totalLable.label.show = false;
            }
        }
        //绘制过程移动中，动态显示长度信息

    }, {
        key: 'showMoveDrawing',
        value: function showMoveDrawing(entity) {
            var positions = this.drawControl.getPositions(entity);
            if (positions.length < 3) {
                this.totalLable.label.show = false;
                return;
            }

            var area = measureUtil.getArea(positions);
            this.totalLable.attribute.value = area;
            this.totalLable.showText = function (unit) {
                var areastr = util.formatArea(this.attribute.value, unit);
                this.label.text = "面积:" + areastr;
                return areastr;
            };
            var areastr = this.totalLable.showText(this.options.unit);

            //求中心点  
            var ptcenter = (0, _point.centerOfMass)(positions);
            this.totalLable.position = ptcenter;
            this.totalLable.label.show = true;

            this.target.fire(_MarsClass.eventType.change, {
                mtype: this.type,
                value: area,
                label: areastr
            });
        }
        //绘制完成后

    }, {
        key: 'showDrawEnd',
        value: function showDrawEnd(entity) {
            if (entity.polygon == null) return;

            entity._totalLable = this.totalLable;
            this.totalLable = null;

            this.target.fire(_MarsClass.eventType.end, {
                mtype: this.type,
                entity: entity,
                value: entity._totalLable.attribute.value
            });
        }
    }, {
        key: 'type',
        get: function get() {
            return "area";
        }
    }]);

    return MeasureArea;
}(_MeasureBase2.MeasureBase);

/***/ }),
