/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditWall = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Dragger = __webpack_require__(14);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(7);

var _Edit = __webpack_require__(25);

var _point = __webpack_require__(2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditWall = exports.EditWall = function (_EditPolyline) {
    _inherits(EditWall, _EditPolyline);

    function EditWall() {
        _classCallCheck(this, EditWall);

        return _possibleConstructorReturn(this, (EditWall.__proto__ || Object.getPrototypeOf(EditWall)).apply(this, arguments));
    }

    _createClass(EditWall, [{
        key: 'getGraphic',

        //取enity对象的对应矢量数据
        value: function getGraphic() {
            return this.entity.wall;
        }
        //修改坐标会回调，提高显示的效率

    }, {
        key: 'changePositionsToCallback',
        value: function changePositionsToCallback() {
            var that = this;

            var time = this.viewer.clock.currentTime;

            this._positions_draw = this.entity._positions_draw || this.getGraphic().positions.getValue(time);
            this._minimumHeights = this.entity._minimumHeights || this.getGraphic().minimumHeights.getValue(time);
            this._maximumHeights = this.entity._maximumHeights || this.getGraphic().maximumHeights.getValue(time);
        }
        //坐标位置相关  

    }, {
        key: 'updateAttrForEditing',
        value: function updateAttrForEditing() {
            var style = this.entity.attribute.style;
            var position = this.getPosition();
            var len = position.length;

            this._maximumHeights = new Array(len);
            this._minimumHeights = new Array(len);

            for (var i = 0; i < len; i++) {
                var height = Cesium.Cartographic.fromCartesian(position[i]).height;
                this._minimumHeights[i] = height;
                this._maximumHeights[i] = height + Number(style.extrudedHeight);
            }

            //同步更新
            this.entity._maximumHeights = this._maximumHeights;
            this.entity._minimumHeights = this._minimumHeights;
        }
        //图形编辑结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            this.entity._positions_draw = this._positions_draw;
            this.entity._maximumHeights = this._maximumHeights;
            this.entity._minimumHeights = this._minimumHeights;
        }
    }, {
        key: 'bindDraggers',
        value: function bindDraggers() {
            var that = this;

            var clampToGround = this.isClampToGround();

            var positions = this.getPosition();
            var style = this.entity.attribute.style;
            var hasMidPoint = positions.length < this._maxPointNum; //是否有新增点

            for (var i = 0, len = positions.length; i < len; i++) {
                var loc = positions[i];

                //各顶点
                var dragger = draggerCtl.createDragger(this.entityCollection, {
                    position: loc,
                    clampToGround: clampToGround,
                    onDrag: function onDrag(dragger, position) {
                        positions[dragger.index] = position;

                        //============高度调整拖拽点处理=============
                        if (that.heightDraggers && that.heightDraggers.length > 0) {
                            that.heightDraggers[dragger.index].position = (0, _point.addPositionsHeight)(position, style.extrudedHeight);
                        }

                        //============新增点拖拽点处理=============
                        if (hasMidPoint) {
                            if (dragger.index > 0) {
                                //与前一个点之间的中点 
                                that.draggers[dragger.index * 2 - 1].position = Cesium.Cartesian3.midpoint(position, positions[dragger.index - 1], new Cesium.Cartesian3());
                            }
                            if (dragger.index < positions.length - 1) {
                                //与后一个点之间的中点 
                                that.draggers[dragger.index * 2 + 1].position = Cesium.Cartesian3.midpoint(position, positions[dragger.index + 1], new Cesium.Cartesian3());
                            }
                        }

                        //============整体平移移动点处理============= 
                        positionMove = (0, _point.centerOfMass)(positions);
                        draggerMove.position = positionMove;
                    }
                });
                dragger.index = i;
                this.draggers.push(dragger);

                //中间点，拖动后新增点
                if (hasMidPoint) {
                    var nextIndex = i + 1;
                    if (nextIndex < len) {
                        var midpoint = Cesium.Cartesian3.midpoint(loc, positions[nextIndex], new Cesium.Cartesian3());
                        var draggerMid = draggerCtl.createDragger(this.entityCollection, {
                            position: midpoint,
                            type: draggerCtl.PointType.AddMidPoint,
                            tooltip: _Tooltip.message.dragger.addMidPoint,
                            clampToGround: clampToGround,
                            onDragStart: function onDragStart(dragger, position) {
                                positions.splice(dragger.index, 0, position); //插入点 
                                that.updateAttrForEditing();
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
            }

            //整体平移移动点 
            var positionMove = (0, _point.centerOfMass)(positions);
            var draggerMove = draggerCtl.createDragger(this.entityCollection, {
                position: positionMove,
                type: draggerCtl.PointType.MoveAll,
                tooltip: _Tooltip.message.dragger.moveAll,
                clampToGround: clampToGround,
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
            this.bindHeightDraggers();
        }
        //高度调整拖拽点

    }, {
        key: 'bindHeightDraggers',
        value: function bindHeightDraggers() {
            var that = this;

            this.heightDraggers = [];

            var positions = this.getPosition();
            var style = this.entity.attribute.style;
            var extrudedHeight = Number(style.extrudedHeight);

            for (var i = 0, len = positions.length; i < len; i++) {
                var loc = (0, _point.addPositionsHeight)(positions[i], extrudedHeight);

                var dragger = draggerCtl.createDragger(this.entityCollection, {
                    position: loc,
                    type: draggerCtl.PointType.MoveHeight,
                    tooltip: _Tooltip.message.dragger.moveHeight,
                    onDrag: function onDrag(dragger, position) {
                        var thisHeight = Cesium.Cartographic.fromCartesian(position).height;
                        style.extrudedHeight = that.formatNum(thisHeight - that._minimumHeights[dragger.index], 2);

                        for (var i = 0; i < positions.length; i++) {
                            if (i == dragger.index) continue;
                            that.heightDraggers[i].position = (0, _point.addPositionsHeight)(positions[i], style.extrudedHeight);
                        }
                        that.updateAttrForEditing();
                    }
                });
                dragger.index = i;

                this.draggers.push(dragger);
                this.heightDraggers.push(dragger);
            }
        }
    }]);

    return EditWall;
}(_Edit.EditPolyline);

/***/ }),
