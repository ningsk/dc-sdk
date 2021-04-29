/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditCircle = undefined;

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

var EditCircle = exports.EditCircle = function (_EditPolygon) {
    _inherits(EditCircle, _EditPolygon);

    function EditCircle() {
        _classCallCheck(this, EditCircle);

        return _possibleConstructorReturn(this, (EditCircle.__proto__ || Object.getPrototypeOf(EditCircle)).apply(this, arguments));
    }

    _createClass(EditCircle, [{
        key: 'getGraphic',

        //取enity对象的对应矢量数据
        value: function getGraphic() {
            return this.entity.ellipse;
        }
        //修改坐标会回调，提高显示的效率

    }, {
        key: 'changePositionsToCallback',
        value: function changePositionsToCallback() {
            this._positions_draw = this.entity._positions_draw;
            this.finish();
        }
        //图形编辑结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            this.entity._positions_draw = this._positions_draw;
        }
    }, {
        key: 'isClampToGround',
        value: function isClampToGround() {
            return this.entity.attribute.style.clampToGround;
        }
    }, {
        key: 'getPosition',
        value: function getPosition() {
            //加上高度
            if (this.getGraphic().height != undefined) {
                var newHeight = this.getGraphic().height.getValue(this.viewer.clock.currentTime);
                for (var i = 0, len = this._positions_draw.length; i < len; i++) {
                    this._positions_draw[i] = (0, _point.setPositionsHeight)(this._positions_draw[i], newHeight);
                }
            }
            return this._positions_draw;
        }
    }, {
        key: 'bindDraggers',
        value: function bindDraggers() {
            var that = this;

            var clampToGround = this.isClampToGround();
            var positions = this.getPosition();

            var style = this.entity.attribute.style;

            //中心点
            var position = positions[0];
            if (clampToGround) {
                //贴地时求贴模型和贴地的高度
                position = (0, _point.setPositionSurfaceHeight)(this.viewer, position);
                positions[0] = position;
            }

            var dragger = draggerCtl.createDragger(this.entityCollection, {
                position: position,
                onDrag: function onDrag(dragger, position) {
                    //记录差值
                    var diff = Cesium.Cartesian3.subtract(position, positions[dragger.index], new Cesium.Cartesian3());

                    positions[dragger.index] = position;

                    //============高度处理=============
                    if (!style.clampToGround) {
                        var height = that.formatNum(Cesium.Cartographic.fromCartesian(position).height, 2);
                        that.getGraphic().height = height;
                        style.height = height;
                    }

                    var time = that.viewer.clock.currentTime;

                    //============半径同步处理=============
                    var newPos = Cesium.Cartesian3.add((0, _point.getPositionValue)(dragger.majorDragger.position, time), diff, new Cesium.Cartesian3());
                    dragger.majorDragger.position = newPos;

                    if (dragger.minorDragger) {
                        var newPos = Cesium.Cartesian3.add((0, _point.getPositionValue)(dragger.minorDragger.position, time), diff, new Cesium.Cartesian3());
                        dragger.minorDragger.position = newPos;
                    }

                    //============高度调整拖拽点处理=============
                    if (that.entity.attribute.style.extrudedHeight != undefined) that.updateDraggers();
                }
            });
            dragger.index = 0;
            this.draggers.push(dragger);

            var time = this.viewer.clock.currentTime;

            //获取圆（或椭圆）边线上的坐标点数组
            var outerPositions = (0, _polygon.getEllipseOuterPositions)({
                position: position,
                semiMajorAxis: this.getGraphic().semiMajorAxis.getValue(time), //长半轴
                semiMinorAxis: this.getGraphic().semiMinorAxis.getValue(time), //短半轴
                rotation: Cesium.Math.toRadians(Number(style.rotation || 0))
            });

            //长半轴上的坐标点
            var majorPos = outerPositions[1];
            if (clampToGround) {
                //贴地时求贴模型和贴地的高度
                majorPos = (0, _point.setPositionSurfaceHeight)(this.viewer, majorPos);
            }
            positions[1] = majorPos;
            var majorDragger = draggerCtl.createDragger(this.entityCollection, {
                position: majorPos,
                type: draggerCtl.PointType.EditAttr,
                tooltip: _Tooltip.message.dragger.editRadius,
                //clampToGround: clampToGround,
                onDrag: function onDrag(dragger, position) {
                    if (that.getGraphic().height != undefined) {
                        var newHeight = that.getGraphic().height.getValue(time);
                        position = (0, _point.setPositionsHeight)(position, newHeight);
                        dragger.position = position;
                    }
                    positions[dragger.index] = position;

                    var radius = that.formatNum(Cesium.Cartesian3.distance(positions[0], position), 2);
                    that.getGraphic().semiMajorAxis = radius;

                    if (that._maxPointNum == 3 || !Cesium.defined(style.radius)) {
                        //椭圆
                        style.semiMajorAxis = radius;
                    } else {
                        //圆
                        that.getGraphic().semiMinorAxis = radius;
                        style.radius = radius;
                    }

                    // if (that.entity.attribute.style.extrudedHeight != undefined)
                    that.updateDraggers();
                }
            });
            majorDragger.index = 1;
            dragger.majorDragger = majorDragger;
            this.draggers.push(majorDragger);

            //短半轴上的坐标点
            if (this._maxPointNum == 3) {
                //椭圆
                //短半轴上的坐标点 
                var minorPos = outerPositions[0];
                if (clampToGround) {
                    //贴地时求贴模型和贴地的高度
                    minorPos = (0, _point.setPositionSurfaceHeight)(this.viewer, minorPos);
                }
                positions[2] = minorPos;
                var minorDragger = draggerCtl.createDragger(this.entityCollection, {
                    position: minorPos,
                    type: draggerCtl.PointType.EditAttr,
                    tooltip: _Tooltip.message.dragger.editRadius,
                    //clampToGround: clampToGround,
                    onDrag: function onDrag(dragger, position) {
                        if (that.getGraphic().height != undefined) {
                            var newHeight = that.getGraphic().height.getValue(time);
                            position = (0, _point.setPositionsHeight)(position, newHeight);
                            dragger.position = position;
                        }
                        positions[dragger.index] = position;

                        var radius = that.formatNum(Cesium.Cartesian3.distance(positions[0], position), 2);
                        that.getGraphic().semiMinorAxis = radius;

                        if (that._maxPointNum == 3 || !Cesium.defined(style.radius)) {
                            //椭圆
                            style.semiMinorAxis = radius;
                        } else {
                            //圆
                            that.getGraphic().semiMajorAxis = radius;
                            style.radius = radius;
                        }

                        // if (that.entity.attribute.style.extrudedHeight != undefined)
                        that.updateDraggers();
                    }
                });
                minorDragger.index = 2;
                dragger.minorDragger = minorDragger;
                this.draggers.push(minorDragger);
            }

            //创建高度拖拽点
            if (this.getGraphic().extrudedHeight) {
                var _pos = this._maxPointNum == 3 ? [positions[1], positions[2]] : [positions[1]];
                this.bindHeightDraggers(_pos);
            }
        }
    }]);

    return EditCircle;
}(_Edit.EditPolygon);

/***/ }),
