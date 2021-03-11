/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawBillboard = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(24);

var _Attr = __webpack_require__(34);

var attr = _interopRequireWildcard(_Attr);

var _Attr2 = __webpack_require__(12);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawBillboard = exports.DrawBillboard = function (_DrawPoint) {
    _inherits(DrawBillboard, _DrawPoint);

    //========== 构造方法 ========== 
    function DrawBillboard(opts) {
        _classCallCheck(this, DrawBillboard);

        var _this = _possibleConstructorReturn(this, (DrawBillboard.__proto__ || Object.getPrototypeOf(DrawBillboard)).call(this, opts));

        _this.type = 'billboard';
        //对应的属性控制静态类
        _this.attrClass = attr;
        return _this;
    }

    //根据attribute参数创建Entity


    _createClass(DrawBillboard, [{
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
                billboard: attr.style2Entity(attribute.style),
                attribute: attribute
            };

            if (attribute.style && attribute.style.label) {
                //同时加文字
                addattr.label = (0, _Attr2.style2Entity)(attribute.style.label);
            }

            this.entity = dataSource.entities.add(addattr); //创建要素对象
            this.updateAttrForDrawing();
            return this.entity;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            var _this2 = this;

            if (this.updateFeatureEx) {
                //setTimeout是为了优化效率
                if (this.updateTimer) {
                    clearTimeout(this.updateTimer);
                }
                this.updateTimer = setTimeout(function () {
                    delete _this2.updateTimer;
                    _this2.updateFeatureEx(style, entity);
                }, 300);
            }

            if (style && style.label) {
                //同时加文字
                (0, _Attr2.style2Entity)(style.label, entity.label);
            }
            return attr.style2Entity(style, entity.billboard);
        }
    }, {
        key: 'updateAttrForDrawing',
        value: function updateAttrForDrawing() {
            var _this3 = this;

            var entity = this.entity;

            if (this.updateFeatureEx) {
                //setTimeout是为了优化效率
                if (this.updateTimer) {
                    clearTimeout(this.updateTimer);
                }
                this.updateTimer = setTimeout(function () {
                    delete _this3.updateTimer;
                    if (!entity) return;
                    _this3.updateFeatureEx(entity.attribute.style, entity);
                }, 300);
            }
        }
        //图形绘制结束,更新属性

    }, {
        key: 'finish',
        value: function finish() {
            if (this.updateFeatureEx && this.updateTimer) {
                clearTimeout(this.updateTimer);
                delete this.updateTimer;
                this.updateFeatureEx(this.entity.attribute.style, this.entity);
            }
            this.entity.show = true;

            this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象     
            this.entity.position = this.getDrawPosition();
        }
    }]);

    return DrawBillboard;
}(_Draw.DrawPoint);

/***/ }),
