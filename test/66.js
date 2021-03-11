/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditEllipsoid = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Dragger = __webpack_require__(14);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(7);

var _Edit = __webpack_require__(28);

var _point = __webpack_require__(2);

var _polygon = __webpack_require__(13);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditEllipsoid = exports.EditEllipsoid = function (_EditBase) {
    _inherits(EditEllipsoid, _EditBase);

    function EditEllipsoid() {
        _classCallCheck(this, EditEllipsoid);

        return _possibleConstructorReturn(this, (EditEllipsoid.__proto__ || Object.getPrototypeOf(EditEllipsoid)).apply(this, arguments));
    }

    _createClass(EditEllipsoid, [{
        key: 'setPositions',


        //外部更新位置
        value: function setPositions(position) {
            this.entity._positions_draw[0] = position[0];
        }
        //图形编辑结束后调用

    }, {
        key: 'finish',
        value: function finish() {}
    }, {
        key: 'updateRadii',
        value: function updateRadii(style) {
            var radii = new Cesium.Cartesian3(Number(style.extentRadii), Number(style.widthRadii), Number(style.heightRadii));
            this.entity.ellipsoid.radii.setValue(radii);
        }
    }, {
        key: 'bindDraggers',
        value: function bindDraggers() {
            var that = this;

            var style = this.entity.attribute.style;

            //位置中心点
            var position = this.entity._positions_draw[0];
            var dragger = draggerCtl.createDragger(this.entityCollection, {
                position: position,
                onDrag: function onDrag(dragger, position) {
                    that.entity._positions_draw[0] = position;

                    that.updateDraggers();
                }
            });
            this.draggers.push(dragger);

            //顶部的 高半径 编辑点
            var position = (0, _point.getPositionValue)(this.entity.position, this.viewer.clock.currentTime);
            var dragger = draggerCtl.createDragger(this.entityCollection, {
                position: (0, _point.addPositionsHeight)(position, style.heightRadii),
                type: draggerCtl.PointType.MoveHeight,
                tooltip: _Tooltip.message.dragger.editRadius,
                onDrag: function onDrag(dragger, position) {
                    var positionZXD = that.entity._positions_draw[0];
                    var length = that.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
                    style.heightRadii = length; //高半径

                    that.updateRadii(style);
                    that.updateDraggers();
                }
            });
            this.draggers.push(dragger);

            //获取圆（或椭圆）边线上的坐标点数组
            var outerPositions = (0, _polygon.getEllipseOuterPositions)({
                position: position,
                semiMajorAxis: Number(style.extentRadii),
                semiMinorAxis: Number(style.widthRadii),
                rotation: Cesium.Math.toRadians(Number(style.rotation || 0))
            });

            //长半轴上的坐标点
            var majorPos = outerPositions[0];
            var majorDragger = draggerCtl.createDragger(this.entityCollection, {
                position: majorPos,
                type: draggerCtl.PointType.EditAttr,
                tooltip: _Tooltip.message.dragger.editRadius,
                onDrag: function onDrag(dragger, position) {
                    var positionZXD = that.entity._positions_draw[0];
                    var newHeight = Cesium.Cartographic.fromCartesian(positionZXD).height;
                    position = (0, _point.setPositionsHeight)(position, newHeight);
                    dragger.position = position;

                    var radius = that.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
                    style.widthRadii = radius; //长半轴

                    that.updateRadii(style);
                    that.updateDraggers();
                }
            });
            dragger.majorDragger = majorDragger;
            this.draggers.push(majorDragger);

            //短半轴上的坐标点  
            var minorPos = outerPositions[1];
            var minorDragger = draggerCtl.createDragger(this.entityCollection, {
                position: minorPos,
                type: draggerCtl.PointType.EditAttr,
                tooltip: _Tooltip.message.dragger.editRadius,
                onDrag: function onDrag(dragger, position) {
                    var positionZXD = that.entity._positions_draw[0];
                    var newHeight = Cesium.Cartographic.fromCartesian(positionZXD).height;
                    position = (0, _point.setPositionsHeight)(position, newHeight);
                    dragger.position = position;

                    var radius = that.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
                    style.extentRadii = radius; //短半轴

                    that.updateRadii(style);
                    that.updateDraggers();
                }
            });
            dragger.minorDragger = minorDragger;
            this.draggers.push(minorDragger);
        }
    }]);

    return EditEllipsoid;
}(_Edit.EditBase);

/***/ }),
