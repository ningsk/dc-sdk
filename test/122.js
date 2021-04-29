/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawCylinder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(16);

var _point = __webpack_require__(2);

var _Attr = __webpack_require__(56);

var attr = _interopRequireWildcard(_Attr);

var _Edit = __webpack_require__(123);

var _polygon = __webpack_require__(13);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawCylinder = exports.DrawCylinder = function (_DrawPolyline) {
    _inherits(DrawCylinder, _DrawPolyline);

    //========== 构造方法 ========== 
    function DrawCylinder(opts) {
        _classCallCheck(this, DrawCylinder);

        var _this = _possibleConstructorReturn(this, (DrawCylinder.__proto__ || Object.getPrototypeOf(DrawCylinder)).call(this, opts));

        _this.type = 'cylinder';
        _this.attrClass = attr; //对应的属性控制静态类 
        _this.editClass = _Edit.EditCylinder; //获取编辑对象

        _this._minPointNum = 2; //至少需要点的个数 
        _this._maxPointNum = 2; //最多允许点的个数 
        return _this;
    }

    _createClass(DrawCylinder, [{
        key: 'getShowPosition',
        value: function getShowPosition(time) {
            if (this._positions_draw && this._positions_draw.length > 1) return (0, _point.addPositionsHeight)(this._positions_draw[0], this.entity.cylinder.length.getValue(time) / 2);
            return null;
        }
        //根据attribute参数创建Entity

    }, {
        key: 'createFeature',
        value: function createFeature(attribute, dataSource) {
            dataSource = dataSource || this.dataSource;
            this._positions_draw = [];

            var that = this;
            var addattr = {
                position: new Cesium.CallbackProperty(function (time) {
                    return that.getShowPosition(time);
                }, false),
                cylinder: attr.style2Entity(attribute.style),
                attribute: attribute
            };

            this.entity = dataSource.entities.add(addattr); //创建要素对象 
            return this.entity;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            return attr.style2Entity(style, entity.cylinder);
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

            //半径处理
            var radius = this.formatNum(Cesium.Cartesian3.distance(this._positions_draw[0], this._positions_draw[1]), 2);
            this.entity.cylinder.bottomRadius = radius;

            style.topRadius = this.entity.cylinder.topRadius.getValue(this.viewer.clock.currentTime);
            style.bottomRadius = radius;
        }
    }, {
        key: 'addPositionsForRadius',
        value: function addPositionsForRadius(position) {
            var style = this.entity.attribute.style;

            //获取圆（或椭圆）边线上的坐标点数组
            var outerPositions = (0, _polygon.getEllipseOuterPositions)({
                position: position,
                semiMajorAxis: style.bottomRadius, //长半轴
                semiMinorAxis: style.bottomRadius //短半轴 
            });

            //长半轴上的坐标点 
            this._positions_draw.push(outerPositions[0]);
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
                if (entity._positions_draw && entity._positions_draw.length > 0) return (0, _point.addPositionsHeight)(entity._positions_draw[0], entity.cylinder.length.getValue(time) / 2);
                return null;
            }, false);
        }
    }]);

    return DrawCylinder;
}(_Draw.DrawPolyline);

/***/ }),
