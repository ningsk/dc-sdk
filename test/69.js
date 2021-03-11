/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditBox = undefined;

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

var EditBox = exports.EditBox = function (_EditBase) {
    _inherits(EditBox, _EditBase);

    function EditBox() {
        _classCallCheck(this, EditBox);

        return _possibleConstructorReturn(this, (EditBox.__proto__ || Object.getPrototypeOf(EditBox)).apply(this, arguments));
    }

    _createClass(EditBox, [{
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
        key: 'updateBox',
        value: function updateBox(style) {
            var dimensionsX = Cesium.defaultValue(style.dimensionsX, 100.0);
            var dimensionsY = Cesium.defaultValue(style.dimensionsY, 100.0);
            var dimensionsZ = Cesium.defaultValue(style.dimensionsZ, 100.0);
            var dimensions = new Cesium.Cartesian3(dimensionsX, dimensionsY, dimensionsZ);

            this.entity.box.dimensions.setValue(dimensions);
        }
    }, {
        key: 'bindDraggers',
        value: function bindDraggers() {
            var _this2 = this;

            var that = this;

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

            //x长度调整
            var offest = { x: style.dimensionsX / 2, y: 0, z: 0 };
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

                    _this2.updateBox(style);
                    _this2.updateDraggers();
                }
            });
            this.draggers.push(dragger);

            //y宽度调整
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

                    _this2.updateBox(style);
                    _this2.updateDraggers();
                }
            });
            this.draggers.push(dragger);

            //z高度调整
            var offest = { x: 0, y: 0, z: style.dimensionsZ / 2 };
            var position2 = (0, _matrix.getPositionTranslation)(positionZXD, offest);
            var dragger = draggerCtl.createDragger(this.entityCollection, {
                position: position2,
                type: draggerCtl.PointType.MoveHeight,
                tooltip: _Tooltip.message.dragger.editRadius.replace('半径', '高度(Z方向)'),
                onDrag: function onDrag(dragger, position) {
                    var radius = _this2.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
                    style.dimensionsZ = radius * 2;

                    _this2.updateBox(style);
                    _this2.updateDraggers();
                }
            });
            this.draggers.push(dragger);
        }
    }]);

    return EditBox;
}(_Edit.EditBase);

/***/ }),
