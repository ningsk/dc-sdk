/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawLabel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(24);

var _Attr = __webpack_require__(12);

var attr = _interopRequireWildcard(_Attr);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawLabel = exports.DrawLabel = function (_DrawPoint) {
    _inherits(DrawLabel, _DrawPoint);

    //========== 构造方法 ========== 
    function DrawLabel(opts) {
        _classCallCheck(this, DrawLabel);

        var _this = _possibleConstructorReturn(this, (DrawLabel.__proto__ || Object.getPrototypeOf(DrawLabel)).call(this, opts));

        _this.type = 'label';
        _this.attrClass = attr; //对应的属性控制静态类   
        return _this;
    }

    //根据attribute参数创建Entity


    _createClass(DrawLabel, [{
        key: 'createFeature',
        value: function createFeature(attribute, dataSource) {
            dataSource = dataSource || this.dataSource;
            this._positions_draw = null;

            //绘制时，是否自动隐藏entity，可避免拾取坐标存在问题。
            var _drawShow = Cesium.defaultValue(attribute.drawShow, false);

            var that = this;
            var addattr = {
                show: _drawShow,
                _drawShow: _drawShow, //edit编辑时使用
                position: new Cesium.CallbackProperty(function (time) {
                    return that.getDrawPosition();
                }, false),
                label: attr.style2Entity(attribute.style),
                attribute: attribute
            };
            this.entity = dataSource.entities.add(addattr); //创建要素对象
            return this.entity;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            return attr.style2Entity(style, entity.label);
        }
    }]);

    return DrawLabel;
}(_Draw.DrawPoint);

/***/ }),
