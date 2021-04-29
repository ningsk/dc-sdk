/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _point = __webpack_require__(2);

var _Draw = __webpack_require__(24);

var _Attr = __webpack_require__(31);

var attr = _interopRequireWildcard(_Attr);

var _Attr2 = __webpack_require__(12);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawModel = exports.DrawModel = function (_DrawPoint) {
    _inherits(DrawModel, _DrawPoint);

    //========== 构造方法 ========== 
    function DrawModel(opts) {
        _classCallCheck(this, DrawModel);

        var _this = _possibleConstructorReturn(this, (DrawModel.__proto__ || Object.getPrototypeOf(DrawModel)).call(this, opts));

        _this.type = 'model';
        _this.attrClass = attr; //对应的属性控制静态类   
        return _this;
    }

    //根据attribute参数创建Entity


    _createClass(DrawModel, [{
        key: 'createFeature',
        value: function createFeature(attribute, dataSource) {
            var _this2 = this;

            dataSource = dataSource || this.dataSource;
            this._positions_draw = null;

            //绘制时，是否自动隐藏模型，可避免拾取坐标存在问题。
            var _drawShow = Cesium.defaultValue(attribute.drawShow, false);

            var that = this;
            var addattr = {
                show: _drawShow,
                _drawShow: _drawShow, //edit编辑时使用
                position: new Cesium.CallbackProperty(function (time) {
                    return that.getDrawPosition();
                }, false),
                model: attr.style2Entity(attribute.style),
                attribute: attribute
            };

            if (attribute.style && attribute.style.label) {
                //同时加文字
                addattr.label = (0, _Attr2.style2Entity)(attribute.style.label);
            }

            this.entity = dataSource.entities.add(addattr); //创建要素对象 
            this.entity.loadOk = false;
            this.entity.readyPromise = function (entity, model) {
                entity.loadOk = true;
                _this2.fire(_MarsClass.eventType.load, { drawtype: _this2.type, entity: entity, model: model });
            };
            return this.entity;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            this.updateOrientation(style, entity);
            if (style && style.label) {
                //同时加文字
                (0, _Attr2.style2Entity)(style.label, entity.label);
            }
            return attr.style2Entity(style, entity.model);
        }
    }, {
        key: 'updateAttrForDrawing',
        value: function updateAttrForDrawing() {
            this.updateOrientation(this.entity.attribute.style, this.entity);
        }
        //角度更新

    }, {
        key: 'updateOrientation',
        value: function updateOrientation(style, entity) {
            var position = (0, _point.getPositionValue)(entity.position);
            if (position == null) return;

            var heading = Cesium.Math.toRadians(Number(style.heading || 0.0));
            var pitch = Cesium.Math.toRadians(Number(style.pitch || 0.0));
            var roll = Cesium.Math.toRadians(Number(style.roll || 0.0));

            var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
        }
    }]);

    return DrawModel;
}(_Draw.DrawPoint);

/***/ }),
