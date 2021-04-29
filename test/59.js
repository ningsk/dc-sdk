/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditPoint = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Dragger = __webpack_require__(14);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(7);

var _Edit = __webpack_require__(28);

var _util = __webpack_require__(1);

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditPoint = exports.EditPoint = function (_EditBase) {
    _inherits(EditPoint, _EditBase);

    function EditPoint() {
        _classCallCheck(this, EditPoint);

        return _possibleConstructorReturn(this, (EditPoint.__proto__ || Object.getPrototypeOf(EditPoint)).apply(this, arguments));
    }

    _createClass(EditPoint, [{
        key: 'setPositions',

        //外部更新位置
        value: function setPositions(position) {
            if (util.isArray(position) && position.length == 1) {
                position = position[0];
            }
            this.entity.position.setValue(position);
            if (this.entity.featureEx) {
                this.entity.featureEx.position = position;
            }
        }
    }, {
        key: 'bindDraggers',
        value: function bindDraggers() {
            var that = this;

            this.entity.draw_tooltip = _Tooltip.message.dragger.def;
            var dragger = draggerCtl.createDragger(this.entityCollection, {
                dragger: this.entity,
                onDrag: function onDrag(dragger, newPosition) {
                    that.entity.position.setValue(newPosition);

                    if (that.entity.featureEx) {
                        that.entity.featureEx.position = newPosition;
                    }
                }
            });
        }
        //图形编辑结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            delete this.entity.draw_tooltip;
            delete this.entity._isDragger;
            delete this.entity._noMousePosition;
            delete this.entity._pointType;
            delete this.entity.onDrag;
        }
    }]);

    return EditPoint;
}(_Edit.EditBase);

/***/ }),
