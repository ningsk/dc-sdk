/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.EditCylinder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Dragger = __webpack_require__(14);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(7);

var _Edit = __webpack_require__(29);

var _point = __webpack_require__(2);

var _polygon = __webpack_require__(13);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditCylinder = exports.EditCylinder = function (_EditPolygon) {
        _inherits(EditCylinder, _EditPolygon);

        function EditCylinder() {
                _classCallCheck(this, EditCylinder);

                return _possibleConstructorReturn(this, (EditCylinder.__proto__ || Object.getPrototypeOf(EditCylinder)).apply(this, arguments));
        }

        _createClass(EditCylinder, [{
                key: 'getGraphic',

                //取enity对象的对应矢量数据
                value: function getGraphic() {
                        return this.entity.cylinder;
                }
                //修改坐标会回调，提高显示的效率

        }, {
                key: 'changePositionsToCallback',
                value: function changePositionsToCallback() {
                        this._positions_draw = this.entity._positions_draw;

                        var time = this.viewer.clock.currentTime;
                        var style = this.entity.attribute.style;

                        style.topRadius = this.getGraphic().topRadius.getValue(time);
                        this.getGraphic().topRadius = new Cesium.CallbackProperty(function (time) {
                                return style.topRadius;
                        }, false);

                        style.bottomRadius = this.getGraphic().bottomRadius.getValue(time);
                        this.getGraphic().bottomRadius = new Cesium.CallbackProperty(function (time) {
                                return style.bottomRadius;
                        }, false);

                        style.length = this.getGraphic().length.getValue(time);
                        this.getGraphic().length = new Cesium.CallbackProperty(function (time) {
                                return style.length;
                        }, false);
                }
                //图形编辑结束后调用

        }, {
                key: 'finish',
                value: function finish() {
                        this.entity._positions_draw = this._positions_draw;

                        var style = this.entity.attribute.style;
                        this.getGraphic().topRadius = style.topRadius;
                        this.getGraphic().bottomRadius = style.bottomRadius;
                        this.getGraphic().length = style.length;
                }
        }, {
                key: 'bindDraggers',
                value: function bindDraggers() {
                        var that = this;

                        var positions = this.getPosition();
                        var style = this.entity.attribute.style;
                        var time = this.viewer.clock.currentTime;

                        //中心点
                        var index = 0;
                        var position = positions[index];
                        var dragger = draggerCtl.createDragger(this.entityCollection, {
                                position: position,
                                onDrag: function onDrag(dragger, position) {
                                        positions[dragger.index] = position;

                                        //=====全部更新========== 
                                        that.updateDraggers();
                                }
                        });
                        dragger.index = index;
                        this.draggers.push(dragger);

                        //获取圆（或椭圆）边线上的坐标点数组
                        var outerPositions = (0, _polygon.getEllipseOuterPositions)({
                                position: position,
                                semiMajorAxis: style.bottomRadius, //长半轴
                                semiMinorAxis: style.bottomRadius, //短半轴
                                rotation: Cesium.Math.toRadians(Number(style.rotation || 0))
                        });

                        //长半轴上的坐标点
                        index = 1;
                        var majorPos = outerPositions[0];
                        positions[index] = majorPos;
                        var bottomRadiusDragger = draggerCtl.createDragger(this.entityCollection, {
                                position: majorPos,
                                type: draggerCtl.PointType.EditAttr,
                                tooltip: _Tooltip.message.dragger.editRadius,
                                onDrag: function onDrag(dragger, position) {
                                        positions[dragger.index] = position;

                                        var radius = that.formatNum(Cesium.Cartesian3.distance(positions[0], position), 2);
                                        style.bottomRadius = radius;

                                        that.updateDraggers();
                                }
                        });
                        bottomRadiusDragger.index = index;
                        this.draggers.push(bottomRadiusDragger);

                        //创建高度拖拽点  
                        index = 2;
                        var position = (0, _point.addPositionsHeight)(positions[0], style.length);
                        positions[index] = position;
                        var draggerTop = draggerCtl.createDragger(this.entityCollection, {
                                position: position,
                                type: draggerCtl.PointType.MoveHeight,
                                tooltip: _Tooltip.message.dragger.moveHeight,
                                onDrag: function onDrag(dragger, position) {
                                        positions[dragger.index] = position;
                                        var length = that.formatNum(Cesium.Cartesian3.distance(positions[0], position), 2);
                                        style.length = length;

                                        that.updateDraggers();
                                }
                        });
                        draggerTop.index = index;
                        this.draggers.push(draggerTop);

                        // if (style.topRadius > 0) {
                        //     //获取圆（或椭圆）边线上的坐标点数组
                        //     var outerPositionsTop = getEllipseOuterPositions({
                        //         position: position,
                        //         semiMajorAxis: style.topRadius, //长半轴
                        //         semiMinorAxis: style.topRadius, //短半轴
                        //         rotation: Cesium.Math.toRadians(Number(style.rotation || 0)),
                        //     }); 
                        //     //长半轴上的坐标点
                        //     index = 3
                        //     var majorPos = outerPositionsTop[0];
                        //     positions[index] = majorPos;
                        //     var topRadiusDragger = draggerCtl.createDragger(this.entityCollection, {
                        //         position: majorPos,
                        //         type: draggerCtl.PointType.EditAttr,
                        //         tooltip: message.dragger.editRadius,
                        //         onDrag: function (dragger, position) {
                        //             var center = positions[2]

                        //             //高度改为圆锥高度
                        //             var height = Cesium.Cartographic.fromCartesian(center).height;
                        //             var car = Cesium.Cartographic.fromCartesian(position)
                        //             position = Cesium.Cartesian3.fromRadians(car.longitude, car.latitude, height);
                        //             dragger.position.setValue(position)

                        //             position = position
                        //             positions[dragger.index] = position;

                        //             var radius = that.formatNum(Cesium.Cartesian3.distance(center, position), 2);
                        //             style.topRadius = radius;

                        //             that.updateDraggers();
                        //         }
                        //     });
                        //     topRadiusDragger.index = index;
                        //     this.draggers.push(topRadiusDragger);
                        // }

                }
        }]);

        return EditCylinder;
}(_Edit.EditPolygon);

/***/ }),
