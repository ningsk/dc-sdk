/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FineArrow = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _PlotUtil = __webpack_require__(9);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//计算粗单尖直箭头坐标
var FineArrow = exports.FineArrow = function () {
    function FineArrow(opt) {
        _classCallCheck(this, FineArrow);

        if (!opt) opt = {};
        //影响因素
        this.headAngle = opt.headAngle || Math.PI / 8.5;
        this.neckAngle = opt.neckAngle || Math.PI / 13;
        this.tailWidthFactor = opt.tailWidthFactor || 0.1;
        this.neckWidthFactor = opt.neckWidthFactor || 0.2;
        this.headWidthFactor = opt.headWidthFactor || 0.25;
        this.neckHeightFactor = opt.neckHeightFactor || 0.85;
        this.positions = null;
        this.plotUtil = _PlotUtil.plotUtil;
    }

    _createClass(FineArrow, [{
        key: 'startCompute',
        value: function startCompute(positions) {
            if (!positions) return;
            this.positions = positions;

            var pnts = pointconvert.cartesians2mercators(positions);

            var _ref = [pnts[0], pnts[1]],
                pnt1 = _ref[0],
                pnt2 = _ref[1];
            var len = this.plotUtil.getBaseLength(pnts);
            var tailWidth = len * this.tailWidthFactor;
            var neckWidth = len * this.neckWidthFactor;
            var headWidth = len * this.headWidthFactor;
            var tailLeft = this.plotUtil.getThirdPoint(pnt2, pnt1, Math.PI / 2, tailWidth, true);
            var tailRight = this.plotUtil.getThirdPoint(pnt2, pnt1, Math.PI / 2, tailWidth, false);
            var headLeft = this.plotUtil.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, false);
            var headRight = this.plotUtil.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, true);
            var neckLeft = this.plotUtil.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, false);
            var neckRight = this.plotUtil.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, true);
            var pList = [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight];

            var returnArr = pointconvert.mercators2cartesians(pList);
            return returnArr;
        }
    }]);

    return FineArrow;
}();

/***/ }),
