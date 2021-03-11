/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditPlane = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Dragger = __webpack_require__(14);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(7);

var _Edit = __webpack_require__(28);

var _point = __webpack_require__(2);

var _matrix = __webpack_require__(17);

var _util = __webpack_require__(1);

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditPlane = exports.EditPlane = function (_EditBase) {
    _inherits(EditPlane, _EditBase);

    function EditPlane() {
        _classCallCheck(this, EditPlane);

        return _possibleConstructorReturn(this, (EditPlane.__proto__ || Object.getPrototypeOf(EditPlane)).apply(this, arguments));
    }

    _createClass(EditPlane, [{
        key: 'setPositions',

        //外部更新位置
        value: function setPositions(position) {
            if (util.isArray(position) && position.length == 1) {
                position = position[0];
            }
            this.entity._positions_draw = position;
        }
        //图形编辑结束后调用

    }, {
        key: 'finish',
        value: function finish() {}
    }, {
        key: 'updatePlane',
        value: function updatePlane(style) {
            var dimensionsX = Cesium.defaultValue(style.dimensionsX, 100.0);
            var dimensionsY = Cesium.defaultValue(style.dimensionsY, 100.0);
            var dimensions = new Cesium.Cartesian2(dimensionsX, dimensionsY);
            this.entity.plane.dimensions.setValue(dimensions);
        }
    }, {
        key: 'bindDraggers',
        value: function bindDraggers() {
            var _this2 = this;

            var style = this.entity.attribute.style;

            //位置中心点
            var positionZXD = this.entity._positions_draw;
            var dragger = draggerCtl.createDragger(this.entityCollection, {
                position: positionZXD,
                onDrag: function onDrag(dragger, position) {
                    _this2.entity._positions_draw = position;
                    _this2.updateDraggers();
                }
            });
            this.draggers.push(dragger);

            //平面的x长度调整
            var offest = { x: 0, y: 0, z: 0 };
            switch (style.plane_normal) {
                case "x":
                    offest.y = style.dimensionsX / 2;
                    break;
                default:
                    offest.x = style.dimensionsX / 2;
                    break;
            }
            var position1 = (0, _matrix.getPositionTranslation)(positionZXD, offest);
            var dragger = draggerCtl.createDragger(this.entityCollection, {
                position: position1,
                type: draggerCtl.PointType.EditAttr,
                tooltip: _Tooltip.message.dragger.editRadius.replace('半径', '长度(X方向)'),
                onDrag: function onDrag(dragger, position) {
                    var newHeight = Cesium.Cartographic.fromCartesian(positionZXD).height;
                    position = (0, _point.setPositionsHeight)(position, newHeight);
                    dragger.position = position;

                    var radius = _this2.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
                    style.dimensionsX = radius * 2;

                    _this2.updatePlane(style);
                    _this2.updateDraggers();
                }
            });
            this.draggers.push(dragger);

            //平面的y宽度调整
            if (style.plane_normal == "z") {
                var offest = { x: 0, y: style.dimensionsY / 2, z: 0 };
                var position2 = (0, _matrix.getPositionTranslation)(positionZXD, offest);

                var dragger = draggerCtl.createDragger(this.entityCollection, {
                    position: position2,
                    type: draggerCtl.PointType.EditAttr,
                    tooltip: _Tooltip.message.dragger.editRadius.replace('半径', '宽度(Y方向)'),
                    onDrag: function onDrag(dragger, position) {
                        var newHeight = Cesium.Cartographic.fromCartesian(positionZXD).height;
                        position = (0, _point.setPositionsHeight)(position, newHeight);
                        dragger.position = position;

                        var radius = _this2.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
                        style.dimensionsY = radius * 2;

                        _this2.updatePlane(style);
                        _this2.updateDraggers();
                    }
                });
                this.draggers.push(dragger);
            } else {
                var offest = { x: 0, y: 0, z: 0 };
                switch (style.plane_normal) {
                    case "x":
                    case "y":
                        offest.z = style.dimensionsY / 2;
                        break;
                    default:
                        offest.y = style.dimensionsY / 2;
                        break;
                }
                //顶部的 高半径 编辑点
                var position2 = (0, _matrix.getPositionTranslation)(positionZXD, offest);

                var dragger = draggerCtl.createDragger(this.entityCollection, {
                    position: position2,
                    type: draggerCtl.PointType.MoveHeight,
                    tooltip: _Tooltip.message.dragger.editRadius.replace('半径', '宽度(Y方向)'),
                    onDrag: function onDrag(dragger, position) {
                        var radius = _this2.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
                        style.dimensionsY = radius * 2;

                        _this2.updatePlane(style);
                        _this2.updateDraggers();
                    }
                });
                this.draggers.push(dragger);
            }
        }
    }]);

    return EditPlane;
}(_Edit.EditBase);

/***/ }),
