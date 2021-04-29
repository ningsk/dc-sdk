/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditPolygonEx = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Edit = __webpack_require__(29);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//用于外部扩展使用，绘制的点与显示的点不一致的标号

var EditPolygonEx = exports.EditPolygonEx = function (_EditPolygon) {
    _inherits(EditPolygonEx, _EditPolygon);

    //========== 构造方法 ========== 
    function EditPolygonEx(entity, viewer) {
        _classCallCheck(this, EditPolygonEx);

        var _this = _possibleConstructorReturn(this, (EditPolygonEx.__proto__ || Object.getPrototypeOf(EditPolygonEx)).call(this, entity, viewer));

        _this._hasMidPoint = false;
        return _this;
    }

    //修改坐标会回调，提高显示的效率


    _createClass(EditPolygonEx, [{
        key: "changePositionsToCallback",
        value: function changePositionsToCallback() {
            this._positions_draw = this.entity._positions_draw;
            this._positions_show = this.entity._positions_show;
        }
        //坐标位置相关  

    }, {
        key: "updateAttrForEditing",
        value: function updateAttrForEditing() {
            if (this._positions_draw == null || this._positions_draw.length < this._minPointNum) {
                this._positions_show = this._positions_draw;
                return;
            }
            this._positions_show = this.getShowPositions(this._positions_draw, this.entity.attribute);

            this.entity._positions_show = this._positions_show;
            _Edit.EditPolygon.prototype.updateAttrForEditing.call(this);
        }
        //子类中重写 ，根据标绘绘制的点，生成显示的边界点

    }, {
        key: "getShowPositions",
        value: function getShowPositions(positions, attribute) {
            return positions;
        }
        //图形编辑结束后调用

    }, {
        key: "finish",
        value: function finish() {
            this.entity._positions_show = this._positions_show;
            this.entity._positions_draw = this._positions_draw;
        }
    }]);

    return EditPolygonEx;
}(_Edit.EditPolygon);

/***/ }),
