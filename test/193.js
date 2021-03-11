/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GroundLineFlowMaterial = undefined;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _GroundLineFlowMaterial = __webpack_require__(194);

var _GroundLineFlowMaterial2 = _interopRequireDefault(_GroundLineFlowMaterial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//贴地线线 流动效果 材质
var GroundLineFlowMaterial = exports.GroundLineFlowMaterial = function GroundLineFlowMaterial(options) {
    _classCallCheck(this, GroundLineFlowMaterial);

    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

    var color = Cesium.defaultValue(options.color, new Cesium.Color(1, 0, 0, 1.0));
    var image = options.url || options.image; //必须是png
    var repeat = Cesium.defaultValue(options.repeat, {
        x: 10,
        y: 1
    });
    var axisY = Cesium.defaultValue(options.axisY, false);
    var speed = Cesium.defaultValue(options.speed, 1); //速度建议1-10
    return new Cesium.Material({
        fabric: {
            uniforms: {
                color: color,
                image: image,
                repeat: repeat,
                axisY: axisY,
                speed: speed
            },
            source: _GroundLineFlowMaterial2.default
        }
    });
};

/***/ }),
