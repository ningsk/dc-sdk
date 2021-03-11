/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditPolyline = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Dragger = __webpack_require__(14);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(7);

var _Edit = __webpack_require__(28);

var _point = __webpack_require__(2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditPolyline = exports.EditPolyline = function (_EditBase) {
    _inherits(EditPolyline, _EditBase);

    //========== 构造方法 ========== 
    function EditPolyline(entity, viewer) {
        _classCallCheck(this, EditPolyline);

        var _this = _possibleConstructorReturn(this, (EditPolyline.__proto__ || Object.getPrototypeOf(EditPolyline)).call(this, entity, viewer));

        _this._positions_draw = [];
        _this._hasMidPoint = true;
        _this.hasClosure = false; //是否首尾相连闭合（线不闭合，面闭合），用于处理中间点  
        return _this;
    }

    //取enity对象的对应矢量数据


    _createClass(EditPolyline, [{
        key: 'getGraphic',
        value: function getGraphic() {
            return this.entity.polyline;
        }
        //坐标位置相关

    }, {
        key: 'getPosition',
        value: function getPosition() {
            return this._positions_draw;
        }
        //外部更新位置

    }, {
        key: 'setPositions',
        value: function setPositions(positions) {
            this._positions_draw = positions;
            this.updateAttrForEditing();
            this.finish();
        }
        //修改坐标会回调，提高显示的效率

    }, {
        key: 'changePositionsToCallback',
        value: function changePositionsToCallback() {
            this._positions_draw = this.entity._positions_draw || this.getGraphic().positions.getValue(this.viewer.clock.currentTime);
        }
    }, {
        key: 'updateAttrForEditing',
        value: function updateAttrForEditing() {
            //显示depthFailMaterial时，不能使用CallbackProperty属性，否则depthFailMaterial不显示
            if (this.entity.attribute.type == "polyline" && Cesium.defined(this.entity.polyline.depthFailMaterial)) {
                this.entity.polyline.positions = this.getPosition();
            }
        }
        //图形编辑结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            this.entity._positions_draw = this.getPosition();

            var entity = this.entity;
            if (this.entity.attribute.type == "polyline") {
                //显示depthFailMaterial时，不能使用CallbackProperty属性，否则depthFailMaterial不显示
                if (Cesium.defined(entity.polyline.depthFailMaterial)) {
                    entity.polyline.positions = entity._positions_draw;
                } else {
                    entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
                        return entity._positions_draw;
                    }, false);
                }
            }
        }
    }, {
        key: 'isClampToGround',
        value: function isClampToGround() {
            return this.entity.attribute.style.clampToGround;
        }
        //是否可在中间新增点 

    }, {
        key: 'hasMidPoint',
        value: function hasMidPoint() {
            return this._hasMidPoint && this.getPosition().length < this._maxPointNum;
        }
        //子类用，根据属性更新坐标

    }, {
        key: 'updatePositionsHeightByAttr',
        value: function updatePositionsHeightByAttr(position) {
            return position;
        }
    }, {
        key: 'bindDraggers',
        value: function bindDraggers() {
            var that = this;

            var positions = this.getPosition();

            var clampToGround = this.isClampToGround();
            var hasMidPoint = this.hasMidPoint();

            for (var i = 0, len = positions.length; i < len; i++) {
                var loc = positions[i];

                loc = this.updatePositionsHeightByAttr(loc);
                if (clampToGround) {
                    //贴地时求贴模型和贴地的高度
                    loc = (0, _point.setPositionSurfaceHeight)(this.viewer, loc);
                    positions[i] = loc;
                }

                //各顶点
                var dragger = draggerCtl.createDragger(this.entityCollection, {
                    position: loc,
                    //clampToGround: clampToGround,
                    onDrag: function onDrag(dragger, position) {
                        position = that.updatePositionsHeightByAttr(position);
                        dragger.position = position;
                        positions[dragger.index] = position;

                        if (that.heightDraggers && that.heightDraggers.length > 0) {
                            that.updateDraggers();
                        } else {
                            //============新增点拖拽点处理=============
                            if (hasMidPoint) {
                                var draggersIdx;
                                var nextPositionIdx;
                                //与前一个点之间的中点 
                                if (that.hasClosure || !that.hasClosure && dragger.index != 0) {
                                    if (dragger.index == 0) {
                                        draggersIdx = len * 2 - 1;
                                        nextPositionIdx = len - 1;
                                    } else {
                                        draggersIdx = dragger.index * 2 - 1;
                                        nextPositionIdx = dragger.index - 1;
                                    }
                                    var nextPosition = positions[nextPositionIdx];
                                    var midpoint = Cesium.Cartesian3.midpoint(position, nextPosition, new Cesium.Cartesian3());
                                    midpoint = that.updatePositionsHeightByAttr(midpoint);
                                    if (clampToGround) {
                                        //贴地时求贴模型和贴地的高度 
                                        midpoint = (0, _point.setPositionSurfaceHeight)(that.viewer, midpoint);
                                    }
                                    that.draggers[draggersIdx].position = midpoint;
                                }

                                //与后一个点之间的中点
                                if (that.hasClosure || !that.hasClosure && dragger.index != len - 1) {
                                    if (dragger.index == len - 1) {
                                        draggersIdx = dragger.index * 2 + 1;
                                        nextPositionIdx = 0;
                                    } else {
                                        draggersIdx = dragger.index * 2 + 1;
                                        nextPositionIdx = dragger.index + 1;
                                    }
                                    var midpoint = Cesium.Cartesian3.midpoint(position, positions[nextPositionIdx], new Cesium.Cartesian3());
                                    midpoint = that.updatePositionsHeightByAttr(midpoint);
                                    if (clampToGround) {
                                        //贴地时求贴模型和贴地的高度 
                                        midpoint = (0, _point.setPositionSurfaceHeight)(that.viewer, midpoint);
                                    }
                                    that.draggers[draggersIdx].position = midpoint;
                                }
                            }

                            //============整体平移移动点处理============= 
                            positionMove = (0, _point.centerOfMass)(positions);
                            positionMove = that.updatePositionsHeightByAttr(positionMove);
                            if (clampToGround) {
                                //贴地时求贴模型和贴地的高度
                                positionMove = (0, _point.setPositionSurfaceHeight)(that.viewer, positionMove);
                            }
                            draggerMove.position = positionMove;
                        }
                    }
                });
                dragger.index = i;
                this.draggers.push(dragger);

                //中间点，拖动后新增点
                if (hasMidPoint && (this.hasClosure || !this.hasClosure && i < len - 1)) {
                    var nextIndex = (i + 1) % len;
                    var midpoint = Cesium.Cartesian3.midpoint(loc, positions[nextIndex], new Cesium.Cartesian3());
                    midpoint = that.updatePositionsHeightByAttr(midpoint);
                    if (clampToGround) {
                        //贴地时求贴模型和贴地的高度 
                        midpoint = (0, _point.setPositionSurfaceHeight)(this.viewer, midpoint);
                    }

                    var draggerMid = draggerCtl.createDragger(this.entityCollection, {
                        position: midpoint,
                        type: draggerCtl.PointType.AddMidPoint,
                        tooltip: _Tooltip.message.dragger.addMidPoint,
                        //clampToGround: clampToGround,
                        onDragStart: function onDragStart(dragger, position) {
                            positions.splice(dragger.index, 0, position); //插入点 
                        },
                        onDrag: function onDrag(dragger, position) {
                            positions[dragger.index] = position;
                        },
                        onDragEnd: function onDragEnd(dragger, position) {
                            that.updateDraggers();
                        }
                    });
                    draggerMid.index = nextIndex;
                    this.draggers.push(draggerMid);
                }
            }

            //整体平移移动点 
            var positionMove = (0, _point.centerOfMass)(positions);
            positionMove = this.updatePositionsHeightByAttr(positionMove);
            if (clampToGround) {
                //贴地时求贴模型和贴地的高度
                positionMove = (0, _point.setPositionSurfaceHeight)(this.viewer, positionMove);
            }

            var draggerMove = draggerCtl.createDragger(this.entityCollection, {
                position: positionMove,
                type: draggerCtl.PointType.MoveAll,
                tooltip: _Tooltip.message.dragger.moveAll,
                onDrag: function onDrag(dragger, position) {
                    // dragger.position = position;

                    //记录差值 
                    var diff = Cesium.Cartesian3.subtract(position, positionMove, new Cesium.Cartesian3());
                    positionMove = position;

                    positions.forEach(function (pos, index, arr) {
                        var newPos = Cesium.Cartesian3.add(pos, diff, new Cesium.Cartesian3());
                        positions[index] = newPos;
                    });

                    //=====全部更新========== 
                    that.updateDraggers();
                }
            });
            this.draggers.push(draggerMove);

            //创建高程拖拽点
            if (this.getGraphic().extrudedHeight) this.bindHeightDraggers();
        }
        //子类用，高度调整拖拽点  

    }, {
        key: 'bindHeightDraggers',
        value: function bindHeightDraggers(positions) {
            var that = this;

            this.heightDraggers = [];

            positions = positions || this.getPosition();
            var extrudedHeight = that.getGraphic().extrudedHeight.getValue(this.viewer.clock.currentTime);

            for (var i = 0, len = positions.length; i < len; i++) {
                var loc = positions[i];
                loc = (0, _point.setPositionsHeight)(loc, extrudedHeight);

                var dragger = draggerCtl.createDragger(this.entityCollection, {
                    position: loc,
                    type: draggerCtl.PointType.MoveHeight,
                    tooltip: _Tooltip.message.dragger.moveHeight,
                    onDrag: function onDrag(dragger, position) {
                        var thisHeight = Cesium.Cartographic.fromCartesian(position).height;
                        that.getGraphic().extrudedHeight = thisHeight;

                        var maxHeight = (0, _point.getMaxHeight)(that.getPosition());
                        that.entity.attribute.style.extrudedHeight = that.formatNum(thisHeight - maxHeight, 2);

                        that.updateHeightDraggers(thisHeight);
                    }
                });

                this.draggers.push(dragger);
                this.heightDraggers.push(dragger);
            }
        }
    }, {
        key: 'updateHeightDraggers',
        value: function updateHeightDraggers(extrudedHeight) {
            for (var i = 0; i < this.heightDraggers.length; i++) {
                var heightDragger = this.heightDraggers[i];

                var position = (0, _point.setPositionsHeight)((0, _point.getPositionValue)(heightDragger.position, this.viewer.clock.currentTime), extrudedHeight);
                heightDragger.position.setValue(position);
            }
        }
    }]);

    return EditPolyline;
}(_Edit.EditBase);

/***/ }),
