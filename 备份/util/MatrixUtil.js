/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getHeadingPitchRollByOrientation = getHeadingPitchRollByOrientation;
exports.getHeadingPitchRollByMatrix = getHeadingPitchRollByMatrix;
exports.getHeadingPitchRollByMatrixOld = getHeadingPitchRollByMatrixOld;
exports.getHeadingPitchRollForLine = getHeadingPitchRollForLine;
exports.getRotateCenterPoint = getRotateCenterPoint;
exports.getOnLinePointByLen = getOnLinePointByLen;
exports.getPositionTranslation = getPositionTranslation;
exports.getOffsetLine = getOffsetLine;
exports.getPositionByDirectionAndLen = getPositionByDirectionAndLen;
exports.getPositionByHprAndLen = getPositionByHprAndLen;
exports.getRayEarthPosition = getRayEarthPosition;
exports.getRayEarthPositionByMatrix = getRayEarthPositionByMatrix;
exports.extend2Earth = extend2Earth;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var matrix3Scratch = new Cesium.Matrix3(); //一些涉及矩阵计算的方法

var matrix4Scratch = new Cesium.Matrix4();


/***/ }),
