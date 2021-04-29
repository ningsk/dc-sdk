/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditCorridor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Edit = __webpack_require__(25);

var _point = __webpack_require__(2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditCorridor = exports.EditCorridor = function (_EditPolyline) {
    _inherits(EditCorridor, _EditPolyline);

    function EditCorridor() {
        _classCallCheck(this, EditCorridor);

        return _possibleConstructorReturn(this, (EditCorridor.__proto__ || Object.getPrototypeOf(EditCorridor)).apply(this, arguments));
    }

    _createClass(EditCorridor, [{
        key: 'getGraphic',

        //取enity对象的对应矢量数据
        value: function getGraphic() {
            return this.entity.corridor;
        }
        //继承父类，根据属性更新坐标

    }, {
        key: 'updatePositionsHeightByAttr',
        value: function updatePositionsHeightByAttr(position) {
            if (this.getGraphic().height != undefined) {
                var newHeight = this.getGraphic().height.getValue(this.viewer.clock.currentTime);
                position = (0, _point.setPositionsHeight)(position, newHeight);
            }
            return position;
        }
    }]);

    return EditCorridor;
}(_Edit.EditPolyline);

/***/ }),
