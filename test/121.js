/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawCircle = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(16);

var _Attr = __webpack_require__(40);

var attr = _interopRequireWildcard(_Attr);

var _Attr2 = __webpack_require__(19);

var _Edit = __webpack_require__(65);

var _polygon = __webpack_require__(13);

var _util = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawCircle = exports.DrawCircle = function (_DrawPolyline) {
    _inherits(DrawCircle, _DrawPolyline);

    //========== 构造方法 ========== 
    function DrawCircle(opts) {
        _classCallCheck(this, DrawCircle);

        var _this = _possibleConstructorReturn(this, (DrawCircle.__proto__ || Object.getPrototypeOf(DrawCircle)).call(this, opts));

        _this.type = 'ellipse';
        _this.attrClass = attr; //对应的属性控制静态类 
        _this.editClass = _Edit.EditCircle; //获取编辑对象 

        _this._minPointNum = 2; //至少需要点的个数 
        _this._maxPointNum = 2; //最多允许点的个数
        return _this;
    }

    _createClass(DrawCircle, [{
        key: 'getShowPosition',
        value: function getShowPosition(time) {
            if (this._positions_draw && this._positions_draw.length > 0) return this._positions_draw[0];
            return null;
        }
        //根据attribute参数创建Entity

    }, {
        key: 'createFeature',
        value: function createFeature(attribute, dataSource) {
            dataSource = dataSource || this.dataSource;
            this._positions_draw = [];

            if (attribute.type == "ellipse") //椭圆
                this._maxPointNum = 3;else //圆
                this._maxPointNum = 2;

            var that = this;
            var addattr = {
                position: new Cesium.CallbackProperty(function (time) {
                    return that.getShowPosition(time);
                }, false),
                ellipse: attr.style2Entity(attribute.style),
                attribute: attribute
            };

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
            this.bindOutline(this.entity, lineStyle); //边线
            return this.entity;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            return attr.style2Entity(style, entity.ellipse);
        }
    }, {
        key: 'bindOutline',
        value: function bindOutline(entity, lineStyle) {
            var attribute = entity.attribute;

            //本身的outline需要隐藏
            entity.ellipse.outline = new Cesium.CallbackProperty(function (time) {
                return attribute.style.outline && attribute.style.outlineWidth == 1;
            }, false);

            //是否显示：边线宽度大于1时
            entity.polyline.show = new Cesium.CallbackProperty(function (time) {
                return attribute.style.outline && attribute.style.outlineWidth > 1;
            }, false);
            entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
                if (!entity.polyline.show.getValue(time)) return null;

                return attr.getOutlinePositions(entity);
            }, false);
            entity.polyline.width = new Cesium.CallbackProperty(function (time) {
                return entity.ellipse.outlineWidth;
            }, false);

            //虚线等情况下不支持动态修改颜色,只有实线可以动态改颜色。
            if (!lineStyle.lineType || lineStyle.lineType == "solid") {
                entity.polyline.material = new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function (time) {
                    return entity.ellipse.outlineColor.getValue(time);
                }, false));
            }
        }
    }, {
        key: 'updateAttrForDrawing',
        value: function updateAttrForDrawing(isLoad) {
            if (!this._positions_draw) return;

            if (isLoad) {
                if (this._positions_draw instanceof Cesium.Cartesian3) {
                    this._positions_draw = [this._positions_draw];
                }
                this.addPositionsForRadius(this._positions_draw[0]);
                return;
            }

            if (this._positions_draw.length < 2) return;

            var style = this.entity.attribute.style;

            //高度处理
            if (!style.clampToGround) {
                var height = this.formatNum(Cesium.Cartographic.fromCartesian(this._positions_draw[0]).height, 2);
                this.entity.ellipse.height = height;
                style.height = height;

                if (style.extrudedHeight && (0, _util.isNumber)(style.extrudedHeight)) {
                    var extrudedHeight = height + Number(style.extrudedHeight);
                    this.entity.ellipse.extrudedHeight = extrudedHeight;
                }
            }

            //半径处理
            var radius = this.formatNum(Cesium.Cartesian3.distance(this._positions_draw[0], this._positions_draw[1]), 2);
            this.entity.ellipse.semiMinorAxis = radius; //短半轴

            if (this._maxPointNum == 3) {
                //长半轴
                var semiMajorAxis;
                if (this._positions_draw.length == 3) {
                    semiMajorAxis = this.formatNum(Cesium.Cartesian3.distance(this._positions_draw[0], this._positions_draw[2]), 2);
                } else {
                    semiMajorAxis = radius;
                }
                this.entity.ellipse.semiMajorAxis = semiMajorAxis;

                style.semiMinorAxis = radius;
                style.semiMajorAxis = semiMajorAxis;
            } else {
                this.entity.ellipse.semiMajorAxis = radius;

                style.radius = radius;
            }
        }
    }, {
        key: 'addPositionsForRadius',
        value: function addPositionsForRadius(position) {
            var style = this.entity.attribute.style;

            //获取圆（或椭圆）边线上的坐标点数组
            var outerPositions = (0, _polygon.getEllipseOuterPositions)({
                position: position,
                semiMajorAxis: this.entity.ellipse.semiMajorAxis.getValue(this.viewer.clock.currentTime), //长半轴
                semiMinorAxis: this.entity.ellipse.semiMinorAxis.getValue(this.viewer.clock.currentTime), //短半轴
                rotation: Cesium.Math.toRadians(Number(style.rotation || 0))
            });

            //长半轴上的坐标点
            var majorPos = outerPositions[1];
            this._positions_draw.push(majorPos);

            if (this._maxPointNum == 3) {
                //椭圆
                //短半轴上的坐标点 
                var minorPos = outerPositions[0];
                this._positions_draw.push(minorPos);
            }
        }
        //图形绘制结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            var entity = this.entity;

            entity.editing = this.getEditClass(entity); //绑定编辑对象   

            entity._positions_draw = this._positions_draw;
            //this.entity.position = this.getShowPosition();
            entity.position = new Cesium.CallbackProperty(function (time) {
                if (entity._positions_draw && entity._positions_draw.length > 0) return entity._positions_draw[0];
                return null;
            }, false);
        }
    }]);

    return DrawCircle;
}(_Draw.DrawPolyline);

/***/ }),
