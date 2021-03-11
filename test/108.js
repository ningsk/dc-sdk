/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.KmlLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _GeoJsonLayer2 = __webpack_require__(43);

var _util = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KmlLayer = exports.KmlLayer = function (_GeoJsonLayer) {
    _inherits(KmlLayer, _GeoJsonLayer);

    function KmlLayer() {
        _classCallCheck(this, KmlLayer);

        return _possibleConstructorReturn(this, (KmlLayer.__proto__ || Object.getPrototypeOf(KmlLayer)).apply(this, arguments));
    }

    _createClass(KmlLayer, [{
        key: 'queryData',
        value: function queryData() {
            var that = this;

            var config = (0, _util.getProxyUrl)(this.options);

            if (config.symbol && config.symbol.styleOptions) {
                var style = config.symbol.styleOptions;
                if (Cesium.defined(style.clampToGround)) {
                    config.clampToGround = style.clampToGround;
                }
            }

            var dataSource = Cesium.KmlDataSource.load(config.url, {
                camera: this.viewer.scene.camera,
                canvas: this.viewer.scene.canvas,
                clampToGround: config.clampToGround
            });
            dataSource.then(function (dataSource) {
                that.showResult(dataSource);
            }).otherwise(function (error) {
                that.showError("服务出错", error);
            });
        }
    }, {
        key: 'getEntityAttr',
        value: function getEntityAttr(entity) {
            var attr = { name: entity.name, description: entity.description };
            var extendedData = entity._kml.extendedData;
            for (var key in extendedData) {
                attr[key] = extendedData[key].value;
            }
            attr = (0, _util.getAttrVal)(attr);

            if (attr.description) {
                attr.description = attr.description.replace(/<div[^>]+>/g, ""); //剔除div html标签
            }

            return attr;
        }
    }]);

    return KmlLayer;
}(_GeoJsonLayer2.GeoJsonLayer);

/***/ }),
