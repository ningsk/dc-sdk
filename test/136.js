/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GaodePOIGeocoder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

var _util = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//高德POI查询 类
var GaodePOIGeocoder = exports.GaodePOIGeocoder = function () {
    //========== 构造方法 ========== 
    function GaodePOIGeocoder(options) {
        _classCallCheck(this, GaodePOIGeocoder);

        options = options || {};
        this.citycode = options.citycode || '';
        //内置高德地图服务key，建议后期传入自己申请的
        this.gaodekey = options.key || ["ae29a37307840c7ae4a785ac905927e0", //2020-6-18
        "888a52a74c55ca47abe6c55ab3661d11", "0bc2903efcb3b67ebf1452d2f664a238", "0df8f6f984adc49fca5b7b1108664da2", "72f75689dff38a781055e68843474751"];
    }

    //========== 对外属性 ==========  
    // //裁剪距离 
    // get distance() {
    //     return this._distance || 0;
    // }
    // set distance(val) {
    //     this._distance = val; 
    // }

    //========== 方法 ========== 

    _createClass(GaodePOIGeocoder, [{
        key: 'getOneKey',
        value: function getOneKey() {
            var arr = this.gaodekey;
            var n = Math.floor(Math.random() * arr.length + 1) - 1;
            return arr[n];
        }
    }, {
        key: 'geocode',
        value: function geocode(query, geocodeType) {
            var that = this;

            var key = this.getOneKey();

            var resource = new Cesium.Resource({
                url: 'https://restapi.amap.com/v3/place/text',
                queryParameters: {
                    key: key,
                    city: this.citycode,
                    //citylimit: true,
                    keywords: query
                }
            });

            return resource.fetchJson().then(function (results) {
                if (results.status == 0) {
                    (0, _util.msg)("请求失败(" + results.infocode + ")：" + results.info);
                    return;
                }
                if (results.pois.length === 0) {
                    (0, _util.msg)("未查询到“" + query + "”相关数据！");
                    return;
                }

                var height = 3000;
                if (that.viewer.camera.positionCartographic.height < height) height = that.viewer.camera.positionCartographic.height;

                return results.pois.map(function (resultObject) {
                    var arrjwd = resultObject.location.split(",");
                    arrjwd = pointconvert.gcj2wgs(arrjwd); //纠偏
                    var lnglat = that.viewer.mars.point2map({ x: arrjwd[0], y: arrjwd[1] });

                    return {
                        displayName: resultObject.name,
                        destination: Cesium.Cartesian3.fromDegrees(lnglat.x, lnglat.y, height)
                    };
                });
            });
        }
    }]);

    return GaodePOIGeocoder;
}();

/***/ }),
