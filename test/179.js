/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Lune = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _PlotUtil = __webpack_require__(9);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//弓形面
var Lune = exports.Lune = function () {
    function Lune(opt) {
        _classCallCheck(this, Lune);

        if (!opt) opt = {};
        //影响因素
        this.positions = null;
        this.plotUtil = _PlotUtil.plotUtil;
    }

    _createClass(Lune, [{
        key: 'startCompute',
        value: function startCompute(positions) {

            var pnts = pointconvert.cartesians2mercators(positions);
            var _ref = [pnts[0], pnts[1], pnts[2], undefined, undefined],
                pnt1 = _ref[0],
                pnt2 = _ref[1],
                pnt3 = _ref[2],
                startAngle = _ref[3],
                endAngle = _ref[4];

            var center = this.plotUtil.getCircleCenterOfThreePoints(pnt1, pnt2, pnt3);
            var radius = this.plotUtil.MathDistance(pnt1, center);
            var angle1 = this.plotUtil.getAzimuth(pnt1, center);
            var angle2 = this.plotUtil.getAzimuth(pnt2, center);
            if (this.plotUtil.isClockWise(pnt1, pnt2, pnt3)) {
                startAngle = angle2;
                endAngle = angle1;
            } else {
                startAngle = angle1;
                endAngle = angle2;
            }
            pnts = this.plotUtil.getArcPoints(center, radius, startAngle, endAngle);
            pnts.push(pnts[0]);

            var returnArr = pointconvert.mercators2cartesians(pnts);
            return returnArr;
        }
    }]);

    return Lune;
}();

/***/ }),
