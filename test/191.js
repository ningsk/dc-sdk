/* 191 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CircleScanMaterial = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _CircleScanMaterial = __webpack_require__(192);

var _CircleScanMaterial2 = _interopRequireDefault(_CircleScanMaterial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//圆形 扫描效果 材质 
var CircleScanMaterial = exports.CircleScanMaterial = function () {
    //========== 构造方法 ========== 
    function CircleScanMaterial(options) {
        _classCallCheck(this, CircleScanMaterial);

        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

        this._definitionChanged = new Cesium.Event();
        this._colorSubscription = undefined;

        this._color = Cesium.defaultValue(options.color, new Cesium.Color(1, 0, 0, 1.0)); //颜色
        this._scanImg = Cesium.defaultValue(options.url);
    }

    //========== 对外属性 ==========  


    _createClass(CircleScanMaterial, [{
        key: "getType",


        //========== 方法 ========== 
        /**
         * Gets the {@link Cesium.Material} type at the provided time.
         *
         * @param {JulianDate} time The time for which to retrieve the type.
         * @returns {String} The type of material.
         */
        value: function getType(time) {
            return Cesium.Material.EntityScanMaterialType;
        }

        /**
         * Gets the value of the property at the provided time.
         *
         * @param {JulianDate} time The time for which to retrieve the value.
         * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
         * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
         */

    }, {
        key: "getValue",
        value: function getValue(time, result) {
            if (!Cesium.defined(result)) {
                result = {};
            }
            result.color = this._color;
            result.scanImg = this._scanImg;
            return result;
        }

        /**
         * Compares this property to the provided property and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param { Cesium.Property} [other] The other property.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */

    }, {
        key: "equals",
        value: function equals(other) {
            return this === other || //
            other instanceof CircleScanMaterial && Cesium.Property.equals(this._color, other._color);
        }
    }, {
        key: "isConstant",
        get: function get() {
            return false;
        }
    }, {
        key: "definitionChanged",
        get: function get() {
            return this._definitionChanged;
        }
    }]);

    return CircleScanMaterial;
}();

Object.defineProperties(CircleScanMaterial.prototype, {
    /**
     * Gets or sets the  Cesium.Property specifying the {@link Cesium.Color} of the line.
     * @memberof PolylineGlowMaterialProperty.prototype
     * @type { Cesium.Property}
     */
    color: Cesium.createPropertyDescriptor('color'),

    scanImg: Cesium.createPropertyDescriptor('scanImg')
});

//静态方法，处理材质
Cesium.Material.EntityScanMaterialType = 'CircleScanMaterial'; /**  渐变的气泡 */
Cesium.Material._materialCache.addMaterial(Cesium.Material.EntityScanMaterialType, {
    fabric: {
        type: Cesium.Material.EntityScanMaterialType,
        uniforms: {
            color: new Cesium.Color(1, 0, 0, 1.0),
            scanImg: ""
        },
        source: _CircleScanMaterial2.default
    },
    translucent: function translucent() {
        return true;
    }
});

/***/ }),
