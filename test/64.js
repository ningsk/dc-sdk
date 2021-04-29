/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditRectangle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Dragger = __webpack_require__(14);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(7);

var _Edit = __webpack_require__(29);

var _point = __webpack_require__(2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditRectangle = exports.EditRectangle = function (_EditPolygon) {
    _inherits(EditRectangle, _EditPolygon);

    function EditRectangle() {
        _classCallCheck(this, EditRectangle);

        return _possibleConstructorReturn(this, (EditRectangle.__proto__ || Object.getPrototypeOf(EditRectangle)).apply(this, arguments));
    }

    _createClass(EditRectangle, [{
        key: 'getGraphic',

        //取enity对象的对应矢量数据
        value: function getGraphic() {
            return this.entity.rectangle;
        }
        //修改坐标会回调，提高显示的效率

    }, {
        key: 'changePositionsToCallback',
        value: function changePositionsToCallback() {
            this._positions_draw = this.entity._positions_draw;
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
        key: 'bindDraggers',
        value: function bindDraggers() {
            var that = this;

            var clampToGround = this.isClampToGround();
            var positions = this.getPosition();

            for (var i = 0, len = positions.length; i < len; i++) {
                var position = positions[i];

                if (this.getGraphic().height != undefined) {
                    var newHeight = this.getGraphic().height.getValue(this.viewer.clock.currentTime);
                    position = (0, _point.setPositionsHeight)(position, newHeight);
                }

                if (clampToGround) {
                    //贴地时求贴模型和贴地的高度
                    position = (0, _point.setPositionSurfaceHeight)(this.viewer, position);
                }

                //各顶点
                var dragger = draggerCtl.createDragger(this.entityCollection, {
                    position: position,
                    //clampToGround: clampToGround,
                    onDrag: function onDrag(dragger, position) {
                        var time = that.viewer.clock.currentTime;
                        if (that.getGraphic().height != undefined) {
                            var newHeight = that.getGraphic().height.getValue(time);
                            position = (0, _point.setPositionsHeight)(position, newHeight);
                            dragger.position = position;
                        }

                        positions[dragger.index] = position;

                        //============高度调整拖拽点处理=============
                        if (that.heightDraggers && that.heightDraggers.length > 0) {
                            var extrudedHeight = that.getGraphic().extrudedHeight.getValue(time);
                            that.heightDraggers[dragger.index].position = (0, _point.setPositionsHeight)(position, extrudedHeight);
                        }

                        //============整体平移移动点处理============= 
                        positionMove = (0, _point.centerOfMass)(positions);
                        if (that.getGraphic().height != undefined) {
                            var newHeight = that.getGraphic().height.getValue(time);
                            positionMove = (0, _point.setPositionsHeight)(positionMove, newHeight);
                        }
                        if (clampToGround) {
                            //贴地时求贴模型和贴地的高度
                            positionMove = (0, _point.setPositionSurfaceHeight)(that.viewer, positionMove);
                        }
                        draggerMove.position = positionMove;
                    }
                });
                dragger.index = i;
                this.draggers.push(dragger);
            }

            //整体平移移动点 
            var positionMove = (0, _point.centerOfMass)(positions);
            if (this.getGraphic().height != undefined) {
                var newHeight = this.getGraphic().height.getValue(this.viewer.clock.currentTime);
                positionMove = (0, _point.setPositionsHeight)(positionMove, newHeight);
            }
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
    }]);

    return EditRectangle;
}(_Edit.EditPolygon);

/***/ }),
