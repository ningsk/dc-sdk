/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawRectangle = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(16);

var _point = __webpack_require__(2);

var _util = __webpack_require__(1);

var _Attr = __webpack_require__(57);

var attr = _interopRequireWildcard(_Attr);

var _Attr2 = __webpack_require__(19);

var _Edit = __webpack_require__(64);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawRectangle = exports.DrawRectangle = function (_DrawPolyline) {
    _inherits(DrawRectangle, _DrawPolyline);

    //========== 构造方法 ========== 
    function DrawRectangle(opts) {
        _classCallCheck(this, DrawRectangle);

        var _this = _possibleConstructorReturn(this, (DrawRectangle.__proto__ || Object.getPrototypeOf(DrawRectangle)).call(this, opts));

        _this.type = 'rectangle';
        _this.attrClass = attr; //对应的属性控制静态类 
        _this.editClass = _Edit.EditRectangle; //获取编辑对象

        _this._minPointNum = 2; //至少需要点的个数 
        _this._maxPointNum = 2; //最多允许点的个数 
        return _this;
    }

    _createClass(DrawRectangle, [{
        key: 'getRectangle',
        value: function getRectangle() {
            var positions = this.getDrawPosition();
            if (positions.length < 2) return null;
            return Cesium.Rectangle.fromCartesianArray(positions);
        }
        //根据attribute参数创建Entity

    }, {
        key: 'createFeature',
        value: function createFeature(attribute, dataSource) {
            dataSource = dataSource || this.dataSource;
            this._positions_draw = [];

            var that = this;
            var addattr = {
                rectangle: attr.style2Entity(attribute.style),
                attribute: attribute
            };
            addattr.rectangle.coordinates = new Cesium.CallbackProperty(function (time) {
                return that.getRectangle();
            }, false);

            //线：边线宽度大于1时用polyline 
            var lineStyle = _extends({
                "color": attribute.style.outlineColor,
                "width": attribute.style.outlineWidth,
                "opacity": attribute.style.outlineOpacity
            }, attribute.style.outlineStyle || {});
            addattr.polyline = (0, _Attr2.style2Entity)(lineStyle, {
                clampToGround: attribute.style.clampToGround,
                arcType: Cesium.ArcType.RHUMB,
                outline: false,
                show: false
            });

            this.entity = dataSource.entities.add(addattr); //创建要素对象
            this.entity._positions_draw = this._positions_draw;
            this.bindOutline(this.entity, lineStyle); //边线

            return this.entity;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            return attr.style2Entity(style, entity.rectangle);
        }
    }, {
        key: 'bindOutline',
        value: function bindOutline(entity, lineStyle) {
            var attribute = entity.attribute;

            //本身的outline需要隐藏
            entity.rectangle.outline = new Cesium.CallbackProperty(function (time) {
                return attribute.style.outline && attribute.style.outlineWidth == 1;
            }, false);

            //是否显示：边线宽度大于1时
            entity.polyline.show = new Cesium.CallbackProperty(function (time) {
                return attribute.style.outline && attribute.style.outlineWidth > 1;
            }, false);
            entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
                if (!entity.polyline.show.getValue(time)) return null;
                if (!entity._positions_draw) return null;

                return attr.getOutlinePositions(entity);
            }, false);
            entity.polyline.width = new Cesium.CallbackProperty(function (time) {
                return entity.rectangle.outlineWidth;
            }, false);
            //虚线等情况下不支持动态修改颜色,只有实线可以动态改颜色。
            if (!lineStyle.lineType || lineStyle.lineType == "solid") {
                entity.polyline.material = new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function (time) {
                    return entity.rectangle.outlineColor.getValue(time);
                }, false));
            }
        }
    }, {
        key: 'updateAttrForDrawing',
        value: function updateAttrForDrawing() {
            var style = this.entity.attribute.style;
            if (!style.clampToGround) {
                var maxHight = (0, _point.getMaxHeight)(this.getDrawPosition());
                if (maxHight != 0) {
                    this.entity.rectangle.height = maxHight;
                    style.height = maxHight;

                    if (style.extrudedHeight && (0, _util.isNumber)(style.extrudedHeight)) this.entity.rectangle.extrudedHeight = maxHight + Number(style.extrudedHeight);
                }
            }
        }
        //图形绘制结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            var entity = this.entity;

            entity.editing = this.getEditClass(entity); //绑定编辑对象   

            entity._positions_draw = this._positions_draw;
            //entity.rectangle.coordinates = this.getRectangle(); 
            entity.rectangle.coordinates = new Cesium.CallbackProperty(function (time) {
                if (entity._positions_draw.length < 2) return null;
                return Cesium.Rectangle.fromCartesianArray(entity._positions_draw);
            }, false);
        }
    }]);

    return DrawRectangle;
}(_Draw.DrawPolyline);

/***/ }),
