/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CircleWaveMaterial = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _CircleWaveMaterial = __webpack_require__(97);

var _CircleWaveMaterial2 = _interopRequireDefault(_CircleWaveMaterial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultColor = new Cesium.Color(0, 0, 0, 0);
var count = 2;
var gradient = 0.1;

//圆形 单个扩散效果 材质 

var CircleWaveMaterial = exports.CircleWaveMaterial = function () {
    //========== 构造方法 ========== 
    function CircleWaveMaterial(options) {
        _classCallCheck(this, CircleWaveMaterial);

        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;

        this.color = Cesium.defaultValue(options.color, defaultColor); //颜色
        this._duration = Cesium.defaultValue(options.duration, 1000); //时长
        this._count = Cesium.defaultValue(options.count, count); //圆圈个数
        if (this._count <= 0) this._count = 1;

        this._gradient = Cesium.defaultValue(options.gradient, gradient); //透明度的幂方（0-1）,0表示无虚化效果，1表示虚化成均匀渐变
        if (this._gradient < 0) this._gradient = 0;
        if (this._gradient > 1) this._gradient = 1;

        this._time = undefined;
    }

    //========== 对外属性 ==========  


    _createClass(CircleWaveMaterial, [{
        key: "getType",


        //========== 方法 ========== 
        /**
         * Gets the {@link Cesium.Material} type at the provided time.
         *
         * @param {JulianDate} time The time for which to retrieve the type.
         * @returns {String} The type of material.
         */
        value: function getType(time) {
            return Cesium.Material.CircleWaveMaterialType;
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
            result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);

            if (this._time === undefined) {
                this._time = new Date().getTime();
            }
            result.time = (new Date().getTime() - this._time) / this._duration;
            result.count = this._count;
            result.gradient = 1 + 10 * (1 - this._gradient);
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
            other instanceof CircleWaveMaterial && Cesium.Property.equals(this._color, other._color);
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

    return CircleWaveMaterial;
}();

Object.defineProperties(CircleWaveMaterial.prototype, {
    /**
     * Gets or sets the  Cesium.Property specifying the {@link Cesium.Color} of the line.
     * @memberof PolylineGlowMaterialProperty.prototype
     * @type { Cesium.Property}
     */
    color: Cesium.createPropertyDescriptor('color')
});

//静态方法，处理材质
Cesium.Material.CircleWaveMaterialType = 'CircleWaveMaterial'; /**  渐变的气泡 */
Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleWaveMaterialType, {
    fabric: {
        type: Cesium.Material.CircleWaveMaterialType,
        uniforms: {
            color: new Cesium.Color(1, 0, 0, 1.0),
            time: 1,
            count: count,
            gradient: gradient
        },
        source: _CircleWaveMaterial2.default
    },
    translucent: function translucent() {
        return true;
    }
});

/***/ }),
