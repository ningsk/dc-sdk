/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawPModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _point = __webpack_require__(2);

var _Attr = __webpack_require__(31);

var attr = _interopRequireWildcard(_Attr);

var _Tooltip = __webpack_require__(7);

var _DrawP = __webpack_require__(88);

var _EditP = __webpack_require__(89);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawPModel = exports.DrawPModel = function (_DrawPBase) {
    _inherits(DrawPModel, _DrawPBase);

    //========== 构造方法 ========== 
    function DrawPModel(opts) {
        _classCallCheck(this, DrawPModel);

        var _this = _possibleConstructorReturn(this, (DrawPModel.__proto__ || Object.getPrototypeOf(DrawPModel)).call(this, opts));

        _this.type = 'point';
        _this.attrClass = attr; //对应的属性控制静态类 
        _this.editClass = _EditP.EditPModel; //获取编辑对象 
        return _this;
    }

    //根据attribute参数创建Entity


    _createClass(DrawPModel, [{
        key: 'createFeature',
        value: function createFeature(attribute) {
            var _this2 = this;

            this._positions_draw = Cesium.Cartesian3.ZERO;

            //绘制时，是否自动隐藏模型，可避免拾取坐标存在问题。
            var _drawShow = Cesium.defaultValue(attribute.drawShow, false);

            var style = attribute.style;

            var modelPrimitive = this.primitives.add(Cesium.Model.fromGltf({
                url: style.modelUrl,
                modelMatrix: this.getModelMatrix(style),
                minimumPixelSize: Cesium.defaultValue(style.minimumPixelSize, 0.0),
                scale: Cesium.defaultValue(style.scale, 1.0),
                show: _drawShow
            }));
            modelPrimitive.loadOk = false;
            modelPrimitive.readyPromise.then(function (model) {
                model.loadOk = true;

                //播放动画
                // model.activeAnimations.addAll({
                //     loop : Cesium.ModelAnimationLoop.REPEAT, 
                // }); 

                _this2.style2Entity(style, model);
                _this2.fire(_MarsClass.eventType.load, { drawtype: _this2.type, entity: model, model: model });
            });
            modelPrimitive.attribute = attribute;
            modelPrimitive._drawShow = _drawShow;
            this.entity = modelPrimitive;

            return this.entity;
        }
    }, {
        key: 'getModelMatrix',
        value: function getModelMatrix(cfg, position) {
            var hpRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(cfg.heading || 0), Cesium.Math.toRadians(cfg.pitch || 0), Cesium.Math.toRadians(cfg.roll || 0));
            var fixedFrameTransform = Cesium.Transforms.eastNorthUpToFixedFrame;

            var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position || this._positions_draw, hpRoll, this.viewer.scene.globe.ellipsoid, fixedFrameTransform);
            // Cesium.Matrix4.multiplyByUniformScale(modelMatrix, Cesium.defaultValue(cfg.scale, 1), modelMatrix);
            return modelMatrix;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            entity.modelMatrix = this.getModelMatrix(style, entity.position);
            return attr.style2Entity(style, entity);
        }
        //绑定鼠标事件

    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var _this3 = this;

            this.getHandler().setInputAction(function (event) {
                var point = (0, _point.getCurrentMousePosition)(_this3.viewer.scene, event.endPosition, _this3.entity);
                if (point) {
                    _this3._positions_draw = point;
                    _this3.entity.modelMatrix = _this3.getModelMatrix(_this3.entity.attribute.style);
                }
                _this3.tooltip.showAt(event.endPosition, _Tooltip.message.draw.point.start);
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            this.getHandler().setInputAction(function (event) {
                var point = (0, _point.getCurrentMousePosition)(_this3.viewer.scene, event.position, _this3.entity);
                if (point) {
                    _this3._positions_draw = point;
                    _this3.disable();
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
        //图形绘制结束,更新属性

    }, {
        key: 'finish',
        value: function finish() {
            this.entity.modelMatrix = this.getModelMatrix(this.entity.attribute.style);
            this.entity.show = true;
            this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象     
            this.entity.position = this.getDrawPosition();
        }
    }]);

    return DrawPModel;
}(_DrawP.DrawPBase);

/***/ }),
