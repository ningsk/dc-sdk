/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GatheringPlace = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _PlotUtil = __webpack_require__(9);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//集结地
var GatheringPlace = exports.GatheringPlace = function () {
  function GatheringPlace(opt) {
    _classCallCheck(this, GatheringPlace);

    if (!opt) opt = {};
    //影响因素
    this.positions = null;
    this.plotUtil = _PlotUtil.plotUtil;
  }

  _createClass(GatheringPlace, [{
    key: 'startCompute',
    value: function startCompute(positions) {
      var pnts = pointconvert.cartesians2mercators(positions);

      var mid = this.plotUtil.Mid(pnts[0], pnts[2]);
      pnts.push(mid, pnts[0], pnts[1]);
      var normals = [],
          pnt1 = undefined,
          pnt2 = undefined,
          pnt3 = undefined,
          pList = [];
      for (var i = 0; i < pnts.length - 2; i++) {
        pnt1 = pnts[i];
        pnt2 = pnts[i + 1];
        pnt3 = pnts[i + 2];
        var normalPoints = this.plotUtil.getBisectorNormals(0.4, pnt1, pnt2, pnt3);
        normals = normals.concat(normalPoints);
      }
      var count = normals.length;
      normals = [normals[count - 1]].concat(normals.slice(0, count - 1));
      for (var _i = 0; _i < pnts.length - 2; _i++) {
        pnt1 = pnts[_i];
        pnt2 = pnts[_i + 1];
        pList.push(pnt1);
        for (var t = 0; t <= 100; t++) {
          var _pnt = this.plotUtil.getCubicValue(t / 100, pnt1, normals[_i * 2], normals[_i * 2 + 1], pnt2);
          pList.push(_pnt);
        }
        pList.push(pnt2);
      }

      var returnArr = pointconvert.mercators2cartesians(pList);
      return returnArr;
    }
  }]);

  return GatheringPlace;
}();

/***/ }),
