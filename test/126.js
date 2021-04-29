/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawPlane = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(24);

var _Attr = __webpack_require__(49);

var attr = _interopRequireWildcard(_Attr);

var _Edit = __webpack_require__(68);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawPlane = exports.DrawPlane = function (_DrawPoint) {
    _inherits(DrawPlane, _DrawPoint);

    //========== 构造方法 ========== 
    function DrawPlane(opts) {
        _classCallCheck(this, DrawPlane);

        var _this = _possibleConstructorReturn(this, (DrawPlane.__proto__ || Object.getPrototypeOf(DrawPlane)).call(this, opts));

        _this.type = 'plane';
        _this.attrClass = attr; //对应的属性控制静态类 
        _this.editClass = _Edit.EditPlane; //获取编辑对象 
        return _this;
    }
    //根据attribute参数创建Entity


    _createClass(DrawPlane, [{
        key: 'createFeature',
        value: function createFeature(attribute, dataSource) {
            dataSource = dataSource || this.dataSource;
            this._positions_draw = null;

            var that = this;
            var addattr = {
                position: new Cesium.CallbackProperty(function (time) {
                    return that.getDrawPosition();
                }, false),
                plane: attr.style2Entity(attribute.style),
                attribute: attribute
            };
            this.entity = dataSource.entities.add(addattr); //创建要素对象
            return this.entity;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            return attr.style2Entity(style, entity.plane);
        }
        //图形绘制结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            var entity = this.entity;

            entity.editing = this.getEditClass(entity); //绑定编辑对象   

            entity._positions_draw = this.getDrawPosition();
            entity.position = new Cesium.CallbackProperty(function (time) {
                return entity._positions_draw;
            }, false);
        }
    }]);

    return DrawPlane;
}(_Draw.DrawPoint);

/***/ }),
