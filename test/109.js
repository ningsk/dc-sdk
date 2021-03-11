/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CzmlLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _GeoJsonLayer2 = __webpack_require__(43);

var _util = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CzmlLayer = exports.CzmlLayer = function (_GeoJsonLayer) {
    _inherits(CzmlLayer, _GeoJsonLayer);

    function CzmlLayer() {
        _classCallCheck(this, CzmlLayer);

        return _possibleConstructorReturn(this, (CzmlLayer.__proto__ || Object.getPrototypeOf(CzmlLayer)).apply(this, arguments));
    }

    _createClass(CzmlLayer, [{
        key: "queryData",
        value: function queryData() {
            var that = this;

            var config = (0, _util.getProxyUrl)(this.options);

            var dataSource = Cesium.CzmlDataSource.load(config.url, config);
            dataSource.then(function (dataSource) {
                that.showResult(dataSource);
            }).otherwise(function (error) {
                that.showError("服务出错", error);
            });
        }
    }, {
        key: "getEntityAttr",
        value: function getEntityAttr(entity) {
            if (entity.description && entity.description.getValue) return entity.description.getValue(this.viewer.clock.currentTime);
        }
    }]);

    return CzmlLayer;
}(_GeoJsonLayer2.GeoJsonLayer);

/***/ }),
