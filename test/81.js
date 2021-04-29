/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MeasurePoint = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _util = __webpack_require__(1);

var util = _interopRequireWildcard(_util);

var _point = __webpack_require__(2);

var _MeasureBase2 = __webpack_require__(26);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MeasurePoint = exports.MeasurePoint = function (_MeasureBase) {
    _inherits(MeasurePoint, _MeasureBase);

    //========== 构造方法 ========== 
    function MeasurePoint(opts, target) {
        _classCallCheck(this, MeasurePoint);

        var _this = _possibleConstructorReturn(this, (MeasurePoint.__proto__ || Object.getPrototypeOf(MeasurePoint)).call(this, opts, target));

        _this.totalLable = null; //角度label   
        return _this;
    }

    _createClass(MeasurePoint, [{
        key: 'clearLastNoEnd',

        //清除未完成的数据
        value: function clearLastNoEnd() {
            viewer.mars.popup.close();
        }
        //开始绘制

    }, {
        key: '_startDraw',
        value: function _startDraw(options) {
            return this.drawControl.startDraw({
                type: "point",
                style: _extends({
                    "visibleDepth": false
                }, options.style)
            });
        }
        //绘制完成后

    }, {
        key: 'showDrawEnd',
        value: function showDrawEnd(entity) {
            var position = this.drawControl.getPositions(entity)[0];

            var point = (0, _point.formatPosition)(position);
            var x2 = util.formatDegree(point.x);
            var y2 = util.formatDegree(point.y);

            var html = '<div class="mars-popup-titile">\u5750\u6807\u6D4B\u91CF</div>\n                    <div class="mars-popup-content">\n                        <div><label>\u7ECF\u5EA6</label>' + point.x + '&nbsp;&nbsp;' + x2 + '</div>\n                        <div><label>\u7EAC\u5EA6</label>' + point.y + '&nbsp;&nbsp;&nbsp;&nbsp;' + y2 + '</div>\n                        <div><label>\u6D77\u62D4</label>' + point.z + '\u7C73</div>\n                    </div>';

            entity.popup = {
                html: html,
                anchor: [0, -15]
            };
            viewer.mars.popup.show(entity);

            this.target.fire(_MarsClass.eventType.end, {
                mtype: this.type,
                entity: entity,
                position: position,
                point: point
            });
        }
    }, {
        key: 'type',
        get: function get() {
            return "point";
        }
    }]);

    return MeasurePoint;
}(_MeasureBase2.MeasureBase);

/***/ }),
