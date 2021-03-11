/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawCorridor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(16);

var _point = __webpack_require__(2);

var _util = __webpack_require__(1);

var _Attr = __webpack_require__(54);

var attr = _interopRequireWildcard(_Attr);

var _Edit = __webpack_require__(62);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawCorridor = exports.DrawCorridor = function (_DrawPolyline) {
    _inherits(DrawCorridor, _DrawPolyline);

    //========== 构造方法 ========== 
    function DrawCorridor(opts) {
        _classCallCheck(this, DrawCorridor);

        var _this = _possibleConstructorReturn(this, (DrawCorridor.__proto__ || Object.getPrototypeOf(DrawCorridor)).call(this, opts));

        _this.type = 'corridor';
        _this.attrClass = attr; //对应的属性控制静态类 
        _this.editClass = _Edit.EditCorridor; //获取编辑对象

        _this._minPointNum = 2; //至少需要点的个数 
        _this._maxPointNum = 9999; //最多允许点的个数 
        return _this;
    }

    //根据attribute参数创建Entity


    _createClass(DrawCorridor, [{
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
                corridor: attr.style2Entity(attribute.style),
                attribute: attribute
            };
            addattr.corridor.positions = new Cesium.CallbackProperty(function (time) {
                return that.getDrawPosition();
            }, false);

            this.entity = dataSource.entities.add(addattr); //创建要素对象
            this.entity._positions_draw = this._positions_draw;

            return this.entity;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            return attr.style2Entity(style, entity.corridor);
        }
    }, {
        key: 'updateAttrForDrawing',
        value: function updateAttrForDrawing() {
            var style = this.entity.attribute.style;
            if (!style.clampToGround) {
                var maxHight = (0, _point.getMaxHeight)(this.getDrawPosition());
                if (maxHight != 0) {
                    this.entity.corridor.height = maxHight;
                    style.height = maxHight;

                    if (style.extrudedHeight && (0, _util.isNumber)(style.extrudedHeight)) this.entity.corridor.extrudedHeight = maxHight + Number(style.extrudedHeight);
                }
            }
        }
        //图形绘制结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            var entity = this.entity;

            entity.editing = this.getEditClass(entity); //绑定编辑对象   

            entity._positions_draw = this.getDrawPosition();
            entity.corridor.positions = new Cesium.CallbackProperty(function (time) {
                return entity._positions_draw;
            }, false);
        }
    }]);

    return DrawCorridor;
}(_Draw.DrawPolyline);

/***/ }),
