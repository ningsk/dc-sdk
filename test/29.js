/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditPolygon = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Attr = __webpack_require__(21);

var attr = _interopRequireWildcard(_Attr);

var _Edit = __webpack_require__(25);

var _point = __webpack_require__(2);

var _util = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditPolygon = exports.EditPolygon = function (_EditPolyline) {
    _inherits(EditPolygon, _EditPolyline);

    //========== 构造方法 ========== 
    function EditPolygon(entity, viewer) {
        _classCallCheck(this, EditPolygon);

        //是否首尾相连闭合（线不闭合，面闭合），用于处理中间点
        var _this = _possibleConstructorReturn(this, (EditPolygon.__proto__ || Object.getPrototypeOf(EditPolygon)).call(this, entity, viewer));

        _this.hasClosure = true;
        return _this;
    }

    //取enity对象的对应矢量数据


    _createClass(EditPolygon, [{
        key: 'getGraphic',
        value: function getGraphic() {
            return this.entity.polygon;
        }
        //修改坐标会回调，提高显示的效率

    }, {
        key: 'changePositionsToCallback',
        value: function changePositionsToCallback() {
            this._positions_draw = this.entity._positions_draw || attr.getPositions(this.entity);
        }
    }, {
        key: 'isClampToGround',
        value: function isClampToGround() {
            return this.entity.attribute.style.hasOwnProperty('clampToGround') ? this.entity.attribute.style.clampToGround : !this.entity.attribute.style.perPositionHeight;
        }
    }, {
        key: 'updateAttrForEditing',
        value: function updateAttrForEditing() {
            var style = this.entity.attribute.style;
            if (style.extrudedHeight && (0, _util.isNumber)(style.extrudedHeight)) {
                //存在extrudedHeight高度设置时
                var maxHight = (0, _point.getMaxHeight)(this.getPosition());
                this.getGraphic().extrudedHeight = maxHight + Number(style.extrudedHeight);
            }
        }
        //图形编辑结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            this.entity._positions_draw = this.getPosition();
        }
    }]);

    return EditPolygon;
}(_Edit.EditPolyline);

/***/ }),
