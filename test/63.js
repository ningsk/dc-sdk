/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawPolygon = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(16);

var _point = __webpack_require__(2);

var _util = __webpack_require__(1);

var _Attr = __webpack_require__(21);

var attr = _interopRequireWildcard(_Attr);

var _Edit = __webpack_require__(29);

var _Attr2 = __webpack_require__(19);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawPolygon = exports.DrawPolygon = function (_DrawPolyline) {
    _inherits(DrawPolygon, _DrawPolyline);

    //========== 构造方法 ========== 
    function DrawPolygon(opts) {
        _classCallCheck(this, DrawPolygon);

        var _this = _possibleConstructorReturn(this, (DrawPolygon.__proto__ || Object.getPrototypeOf(DrawPolygon)).call(this, opts));

        _this.type = 'polygon';
        _this.attrClass = attr; //对应的属性控制静态类 
        _this.editClass = _Edit.EditPolygon; //获取编辑对象

        _this._minPointNum = 3; //至少需要点的个数 
        _this._maxPointNum = 9999; //最多允许点的个数 
        return _this;
    }

    //根据attribute参数创建Entity


    _createClass(DrawPolygon, [{
        key: 'createFeature',
        value: function createFeature(attribute, dataSource) {
            dataSource = dataSource || this.dataSource;
            this._positions_draw = [];

            if (!this._minPointNum_def) this._minPointNum_def = this._minPointNum;
            if (!this._maxPointNum_def) this._maxPointNum_def = this._maxPointNum;

            if (attribute.config) {
                //允许外部传入
                this._minPointNum = attribute.config.minPointNum || this._minPointNum_def;
                this._maxPointNum = attribute.config.maxPointNum || this._maxPointNum_def;
            } else {
                this._minPointNum = this._minPointNum_def;
                this._maxPointNum = this._maxPointNum_def;
            }

            var that = this;
            var addattr = {
                polygon: attr.style2Entity(attribute.style),
                attribute: attribute
            };

            addattr.polygon.hierarchy = new Cesium.CallbackProperty(function (time) {
                var positions = that.getDrawPosition();
                return new Cesium.PolygonHierarchy(positions);
            }, false);

            //线：边线宽度大于1时用polyline 
            var lineStyle = _extends({
                "color": attribute.style.outlineColor,
                "width": attribute.style.outlineWidth,
                "opacity": attribute.style.outlineOpacity
            }, attribute.style.outlineStyle || {});
            addattr.polyline = (0, _Attr2.style2Entity)(lineStyle, {
                clampToGround: attribute.style.clampToGround,
                // arcType: Cesium.ArcType.RHUMB,
                outline: false,
                show: false
            });

            this.entity = dataSource.entities.add(addattr); //创建要素对象

            this.bindOutline(this.entity, lineStyle); //边线


            return this.entity;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            return attr.style2Entity(style, entity.polygon);
        }
    }, {
        key: 'bindOutline',
        value: function bindOutline(entity, lineStyle) {
            var attribute = entity.attribute;

            //本身的outline需要隐藏
            entity.polygon.outline = new Cesium.CallbackProperty(function (time) {
                return attribute.style.outline && attribute.style.outlineWidth == 1;
            }, false);

            //是否显示：绘制时前2点时 或 边线宽度大于1时
            entity.polyline.show = new Cesium.CallbackProperty(function (time) {
                var arr = attr.getPositions(entity, true);
                if (arr && arr.length < 3) return true;

                return attribute.style.outline && attribute.style.outlineWidth > 1;
            }, false);

            entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
                if (!entity.polyline.show.getValue(time)) return null;

                var arr = attr.getPositions(entity, true);
                if (arr && arr.length < 3) return arr;

                return arr.concat([arr[0]]);
            }, false);
            entity.polyline.width = new Cesium.CallbackProperty(function (time) {
                var arr = attr.getPositions(entity, true);
                if (arr && arr.length < 3) return 2;

                return entity.polygon.outlineWidth;
            }, false);

            //虚线等情况下不支持动态修改颜色,只有实线可以动态改颜色。
            if (!lineStyle.lineType || lineStyle.lineType == "solid") {
                entity.polyline.material = new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function (time) {
                    var arr = attr.getPositions(entity, true);
                    if (arr && arr.length < 3) {
                        if (entity.polygon.material.color) return entity.polygon.material.color.getValue(time);else return Cesium.Color.YELLOW;
                    }
                    return entity.polygon.outlineColor.getValue(time);
                }, false));
            }
        }
    }, {
        key: 'updateAttrForDrawing',
        value: function updateAttrForDrawing() {

            var style = this.entity.attribute.style;
            if (style.extrudedHeight && (0, _util.isNumber)(style.extrudedHeight)) {
                //存在extrudedHeight高度设置时
                var maxHight = (0, _point.getMaxHeight)(this.getDrawPosition());
                this.entity.polygon.extrudedHeight = maxHight + Number(style.extrudedHeight);
            }
        }
        //图形绘制结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            var entity = this.entity;

            entity.editing = this.getEditClass(entity); //绑定编辑对象   

            entity._positions_draw = this.getDrawPosition();
            entity.polygon.hierarchy = new Cesium.CallbackProperty(function (time) {
                var positions = entity._positions_draw;
                return new Cesium.PolygonHierarchy(positions);
            }, false);
        }
    }]);

    return DrawPolygon;
}(_Draw.DrawPolyline);

/***/ }),
