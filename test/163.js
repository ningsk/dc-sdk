/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AttackArrowPW = undefined;

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
var AttackArrowPW = exports.AttackArrowPW = function (_ArrowParent) {
    _inherits(AttackArrowPW, _ArrowParent);

    function AttackArrowPW(opt) {
        _classCallCheck(this, AttackArrowPW);

        var _this = _possibleConstructorReturn(this, (AttackArrowPW.__proto__ || Object.getPrototypeOf(AttackArrowPW)).call(this));

        if (!opt) opt = {};
        //影响因素
        _this.headHeightFactor = opt.headHeightFactor || 0.18;
        _this.headWidthFactor = opt.headWidthFactor || 0.3;
        _this.neckHeightFactor = opt.neckHeightFactor || 0.85;
        _this.neckWidthFactor = opt.neckWidthFactor || 0.15;
        _this.tailWidthFactor = opt.tailWidthFactor || 0.1;

        _this.positions = null;
        _this.plotUtil = _PlotUtil.plotUtil;
        return _this;
    }

    _createClass(AttackArrowPW, [{
        key: 'startCompute',
        value: function startCompute(positions) {
            if (!positions) return;
            this.positions = positions;

            var pnts = pointconvert.cartesians2mercators(positions);

            var tailPnts = this.getTailPoints(pnts);
            var headPnts = this.getArrowHeadPoints(pnts, tailPnts[0], tailPnts[1]);
            var neckLeft = headPnts[0];
            var neckRight = headPnts[4];
            var bodyPnts = this.getArrowBodyPoints(pnts, neckLeft, neckRight, this.tailWidthFactor);
            var _count = bodyPnts.length;
            var leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, _count / 2));
            leftPnts.push(neckLeft);
            var rightPnts = [tailPnts[1]].concat(bodyPnts.slice(_count / 2, _count));
            rightPnts.push(neckRight);
            leftPnts = this.plotUtil.getQBSplinePoints(leftPnts);
            rightPnts = this.plotUtil.getQBSplinePoints(rightPnts);
            var pList = leftPnts.concat(headPnts, rightPnts.reverse());

            var returnArr = pointconvert.mercators2cartesians(pList);
            return returnArr;
        }
    }, {
        key: 'getTailPoints',
        value: function getTailPoints(points) {
            var allLen = this.plotUtil.getBaseLength(points);
            var tailWidth = allLen * this.tailWidthFactor;
            var tailLeft = this.plotUtil.getThirdPoint(points[1], points[0], Math.PI / 2, tailWidth, false);
            var tailRight = this.plotUtil.getThirdPoint(points[1], points[0], Math.PI / 2, tailWidth, true);
            return [tailLeft, tailRight];
        }
    }]);

    return AttackArrowPW;
}(_ArrowParent2.ArrowParent);

/***/ }),
