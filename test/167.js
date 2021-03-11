/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CloseCurve = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _PlotUtil = __webpack_require__(9);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//闭合曲面
var CloseCurve = exports.CloseCurve = function () {
    function CloseCurve(opt) {
        _classCallCheck(this, CloseCurve);

        if (!opt) opt = {};
        //影响因素
        this.positions = null;
        this.plotUtil = _PlotUtil.plotUtil;
    }

    _createClass(CloseCurve, [{
        key: 'startCompute',
        value: function startCompute(positions) {
            var pnts = pointconvert.cartesians2mercators(positions);
            pnts.push(pnts[0], pnts[1]);

            var normals = [];
            var pList = [];
            for (var i = 0; i < pnts.length - 2; i++) {
                var normalPoints = this.plotUtil.getBisectorNormals(0.3, pnts[i], pnts[i + 1], pnts[i + 2]);
                normals = normals.concat(normalPoints);
            }
            var count = normals.length;
            normals = [normals[count - 1]].concat(normals.slice(0, count - 1));
            for (var _i = 0; _i < pnts.length - 2; _i++) {
                var pnt1 = pnts[_i];
                var pnt2 = pnts[_i + 1];
                pList.push(pnt1);
                for (var t = 0; t <= 100; t++) {
                    var pnt = this.plotUtil.getCubicValue(t / 100, pnt1, normals[_i * 2], normals[_i * 2 + 1], pnt2);
                    pList.push(pnt);
                }
                pList.push(pnt2);
            }

            var returnArr = pointconvert.mercators2cartesians(pList);
            return returnArr;
        }
    }]);

    return CloseCurve;
}();

/***/ }),
