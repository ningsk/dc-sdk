/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawPolygonEx = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(63);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//用于外部扩展使用，绘制的点与显示的点不一致的标号

var DrawPolygonEx = exports.DrawPolygonEx = function (_DrawPolygon) {
    _inherits(DrawPolygonEx, _DrawPolygon);

    function DrawPolygonEx() {
        _classCallCheck(this, DrawPolygonEx);

        return _possibleConstructorReturn(this, (DrawPolygonEx.__proto__ || Object.getPrototypeOf(DrawPolygonEx)).apply(this, arguments));
    }

    _createClass(DrawPolygonEx, [{
        key: "getDrawPosition",
        value: function getDrawPosition() {
            return this._positions_show;
        }
    }, {
        key: "updateAttrForDrawing",
        value: function updateAttrForDrawing() {
            if (this._positions_draw == null || this._positions_draw.length < this._minPointNum) {
                this._positions_show = this._positions_draw;
                return;
            }

            this._positions_show = this.getShowPositions(this._positions_draw, this.entity.attribute);
            _Draw.DrawPolygon.prototype.updateAttrForDrawing.call(this);
        }
        //子类中重写 ，根据标绘绘制的点，生成显示的边界点

    }, {
        key: "getShowPositions",
        value: function getShowPositions(positions, attribute) {
            return positions;
        }
        //图形绘制结束后调用

    }, {
        key: "finish",
        value: function finish() {
            var entity = this.entity;

            entity.editing = this.getEditClass(entity); //绑定编辑对象   

            //抛弃多余的无效绘制点
            if (this._positions_draw.length > this._maxPointNum) this._positions_draw.splice(this._maxPointNum, this._positions_draw.length - this._maxPointNum);

            this.entity._positions_draw = this._positions_draw;
            this.entity._positions_show = this._positions_show;

            entity.polygon.hierarchy = new Cesium.CallbackProperty(function (time) {
                var positions = entity._positions_show;
                return new Cesium.PolygonHierarchy(positions);
            }, false);

            this._positions_draw = null;
            this._positions_show = null;
        }
    }, {
        key: "toGeoJSON",
        value: function toGeoJSON(entity) {
            return this.attrClass.toGeoJSON(entity, true); //不用闭合最后一个点
        }
    }]);

    return DrawPolygonEx;
}(_Draw.DrawPolygon);

/***/ }),
