/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TencentImageryProvider = undefined;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //腾讯地图


var TencentImageryProvider = exports.TencentImageryProvider = function (_Cesium$UrlTemplateIm) {
    _inherits(TencentImageryProvider, _Cesium$UrlTemplateIm);

    function TencentImageryProvider() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, TencentImageryProvider);

        var url = options.url;
        if (Cesium.defined(options.layer)) {
            switch (options.layer) {
                case "vec":
                    url = 'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=1&scene=0';
                    break;
                case "img_d":
                    url = 'https://p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=400';
                    options['customTags'] = {
                        sx: function sx(imageryProvider, x, y, level) {
                            return x >> 4;
                        },
                        sy: function sy(imageryProvider, x, y, level) {
                            return (1 << level) - y >> 4;
                        }
                    };
                    break;
                case "img_z":
                    url = 'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=2&scene=0';
                    break;
                case "custom":
                    //Custom 各种自定义样式
                    //可选值：灰白地图:3,暗色地图:4
                    options.customid = options.customid || '4';
                    url = 'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=' + options.customid + '&scene=0';
                    break;
            }
        }
        options.url = url;
        options.subdomains = Cesium.defaultValue(options.subdomains, ['0', '1', '2']);

        return _possibleConstructorReturn(this, (TencentImageryProvider.__proto__ || Object.getPrototypeOf(TencentImageryProvider)).call(this, options));
    }

    return TencentImageryProvider;
}(Cesium.UrlTemplateImageryProvider);

/***/ }),
