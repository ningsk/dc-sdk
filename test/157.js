/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GltfClipPlan = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _util = __webpack_require__(1);

var _TilesClipPlan2 = __webpack_require__(86);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//模型剖切(平面)类
var GltfClipPlan = exports.GltfClipPlan = function (_TilesClipPlan) {
    _inherits(GltfClipPlan, _TilesClipPlan);

    function GltfClipPlan() {
        _classCallCheck(this, GltfClipPlan);

        return _possibleConstructorReturn(this, (GltfClipPlan.__proto__ || Object.getPrototypeOf(GltfClipPlan)).apply(this, arguments));
    }

    _createClass(GltfClipPlan, [{
        key: "getInverseTransform",


        //========== 方法 ========== 

        value: function getInverseTransform() {
            if (!this._inverseTransform) {
                var transform = Cesium.Transforms.eastNorthUpToFixedFrame(this._tileset.position.getValue((0, _util.currentTime)()));
                this._inverseTransform = Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4());
            }
            return this._inverseTransform;
        }
    }, {
        key: "setPlanes",
        value: function setPlanes(planes, opts) {
            opts = opts || {};

            this.clear();
            if (!planes) return;

            var clippingPlanes = new Cesium.ClippingPlaneCollection({
                planes: planes,
                edgeWidth: Cesium.defaultValue(opts.edgeWidth, 0.0),
                edgeColor: Cesium.defaultValue(opts.edgeColor, Cesium.Color.WHITE),
                unionClippingRegions: Cesium.defaultValue(opts.unionClippingRegions, false)
            });
            this.clippingPlanes = clippingPlanes;
            this._tileset.model.clippingPlanes = clippingPlanes;
        }

        //清除裁剪面

    }, {
        key: "clear",
        value: function clear() {
            if (this._tileset.model.clippingPlanes) {
                this._tileset.model.clippingPlanes.enabled = false;
                this._tileset.model.clippingPlanes = undefined;
            }

            if (this.clippingPlanes) {
                delete this.clippingPlanes;
            }
        }
    }, {
        key: "entity",

        //========== 对外属性 ========== 
        get: function get() {
            return this._tileset;
        },
        set: function set(val) {
            this._tileset = val;
            this._inverseTransform = null;
        }
    }]);

    return GltfClipPlan;
}(_TilesClipPlan2.TilesClipPlan);

/**
* 裁剪模型 类型 枚举
*@enum {Number}
*/


_TilesClipPlan2.TilesClipPlan.Type = {
    /** z水平面,水平切底部 */
    Z: 1,
    /** z水平面，水平切顶部 */
    ZR: 2,
    /** x垂直面,水平切底部 */
    X: 3,
    /** x垂直面,东西方向切 */
    XR: 4,
    /** y垂直面, 南北方向切 */
    Y: 5,
    /** y垂直面，南北方向切*/
    YR: 6
};

/***/ }),
