/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AttackArrowYW = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _PlotUtil = __webpack_require__(9);

var _ArrowParent2 = __webpack_require__(38);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//攻击箭头（燕尾）
var AttackArrowYW = exports.AttackArrowYW = function (_ArrowParent) {
    _inherits(AttackArrowYW, _ArrowParent);

    function AttackArrowYW(opt) {
        _classCallCheck(this, AttackArrowYW);

        var _this = _possibleConstructorReturn(this, (AttackArrowYW.__proto__ || Object.getPrototypeOf(AttackArrowYW)).call(this));

        if (!opt) opt = {};
        //影响因素
        _this.headHeightFactor = opt.headHeightFactor || 0.18;
        _this.headWidthFactor = opt.headWidthFactor || 0.3;
        _this.neckHeightFactor = opt.neckHeightFactor || 0.85;
        _this.neckWidthFactor = opt.neckWidthFactor || 0.15;
        _this.tailWidthFactor = opt.tailWidthFactor || 0.1;
        _this.headTailFactor = opt.headTailFactor || 0.8;
        _this.swallowTailFactor = opt.swallowTailFactor || 1;
        _this.positions = null;
        _this.plotUtil = _PlotUtil.plotUtil;
        return _this;
    }

    _createClass(AttackArrowYW, [{
        key: 'startCompute',
        value: function startCompute(positions) {
            if (!positions) return;
            this.positions = positions;

            var pnts = pointconvert.cartesians2mercators(positions);

            var _ref = [pnts[0], pnts[1]],
                tailLeft = _ref[0],
                tailRight = _ref[1];

            if (this.plotUtil.isClockWise(pnts[0], pnts[1], pnts[2])) {
                tailLeft = pnts[1];
                tailRight = pnts[0];
            }
            var midTail = this.plotUtil.Mid(tailLeft, tailRight);
            var bonePnts = [midTail].concat(pnts.slice(2));
            var headPnts = this.getArrowHeadPoints(bonePnts, tailLeft, tailRight);
            var _ref2 = [headPnts[0], headPnts[4]],
                neckLeft = _ref2[0],
                neckRight = _ref2[1];

            var tailWidth = this.plotUtil.MathDistance(tailLeft, tailRight);
            var allLen = this.plotUtil.getBaseLength(bonePnts);
            var len = allLen * this.tailWidthFactor * this.swallowTailFactor;
            var swallowTailPnt = this.plotUtil.getThirdPoint(bonePnts[1], bonePnts[0], 0, len, true);
            var factor = tailWidth / allLen;
            var bodyPnts = this.getArrowBodyPoints(bonePnts, neckLeft, neckRight, factor);
            var count = bodyPnts.length;
            var leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2));
            leftPnts.push(neckLeft);
            var rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count));
            rightPnts.push(neckRight);
            leftPnts = this.plotUtil.getQBSplinePoints(leftPnts);
            rightPnts = this.plotUtil.getQBSplinePoints(rightPnts);
            var pList = leftPnts.concat(headPnts, rightPnts.reverse(), [swallowTailPnt, leftPnts[0]]);

            var returnArr = pointconvert.mercators2cartesians(pList);
            return returnArr;
        }
    }]);

    return AttackArrowYW;
}(_ArrowParent2.ArrowParent);

/***/ }),
