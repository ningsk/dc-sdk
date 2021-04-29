/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawCurve = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(16);

var _Attr = __webpack_require__(19);

var _Edit = __webpack_require__(60);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawCurve = exports.DrawCurve = function (_DrawPolyline) {
    _inherits(DrawCurve, _DrawPolyline);

    //========== 构造方法 ========== 
    function DrawCurve(opts) {
        _classCallCheck(this, DrawCurve);

        var _this = _possibleConstructorReturn(this, (DrawCurve.__proto__ || Object.getPrototypeOf(DrawCurve)).call(this, opts));

        _this.type = 'curve';
        _this.editClass = _Edit.EditCurve; //获取编辑对象

        return _this;
    }

    _createClass(DrawCurve, [{
        key: 'getDrawPosition',
        value: function getDrawPosition() {
            return this._positions_show;
        }
    }, {
        key: 'updateAttrForDrawing',
        value: function updateAttrForDrawing() {
            if (this._positions_draw == null || this._positions_draw.length < 3) {
                this._positions_show = this._positions_draw;
                return;
            }

            this._positions_show = (0, _Attr.line2curve)(this._positions_draw, this.entity.attribute.style.closure);
        }
        //图形绘制结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            var entity = this.entity;

            entity.editing = this.getEditClass(entity); //绑定编辑对象   


            this.entity._positions_draw = this._positions_draw;
            this.entity._positions_show = this._positions_show;

            entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
                return entity._positions_show;
            }, false);

            this._positions_show = null;
        }
    }]);

    return DrawCurve;
}(_Draw.DrawPolyline);

/***/ }),
