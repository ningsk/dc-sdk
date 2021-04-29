/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LineFlowMaterial = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _LineFlowMaterial = __webpack_require__(95);

var _LineFlowMaterial2 = _interopRequireDefault(_LineFlowMaterial);

var _LineFlowMaterial3 = __webpack_require__(96);

var _LineFlowMaterial4 = _interopRequireDefault(_LineFlowMaterial3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultColor = new Cesium.Color(0, 0, 0, 0);
var defaultBgColor = new Cesium.Color(1, 1, 1);

//线状 流动效果 材质

var LineFlowMaterial = exports.LineFlowMaterial = function () {
    //========== 构造方法 ========== 
    function LineFlowMaterial(options) {
        _classCallCheck(this, LineFlowMaterial);

        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;

        this.color = Cesium.defaultValue(options.color, defaultColor); //颜色
        this.url = Cesium.defaultValue(options.url, undefined); //背景图片颜色
        if (!this.url) return;

        this.axisY = Boolean(options.axisY);
        this.bgUrl = Cesium.defaultValue(options.bgUrl, undefined); //背景图片颜色
        this.bgColor = Cesium.defaultValue(options.bgColor, defaultBgColor); //背景图片颜色
        this._duration = options.duration || 1000; //时长

        var _material = getImageMaterial(this.url, this.bgUrl, options.repeat, Boolean(options.axisY), this.bgColor);

        this._materialType = _material.type; //材质类型
        this._materialImage = _material.image; //材质图片
        this._time = undefined;
    }

    //========== 对外属性 ==========   


    _createClass(LineFlowMaterial, [{
        key: "getType",


        //========== 方法 ==========
        /**
         * Gets the {@link Cesium.Material} type at the provided time.
         *
         * @param {JulianDate} time The time for which to retrieve the type.
         * @returns {String} The type of material.
         */
        value: function getType(time) {
            return this._materialType;
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
            result.image = this._materialImage;
            if (this._time === undefined) {
                this._time = new Date().getTime();
            }
            result.time = (new Date().getTime() - this._time) / this._duration;
            return result;
        }

        /**
         * Compares this property to the provided property and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Cesium.Property} [other] The other property.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */

    }, {
        key: "equals",
        value: function equals(other) {
            return this === other || //
            other instanceof LineFlowMaterial && Cesium.Property.equals(this._color, other._color);
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

    return LineFlowMaterial;
}();

Object.defineProperties(LineFlowMaterial.prototype, {
    /**
     * Gets or sets the Cesium.Property specifying the {@link Cesium.Color} of the line.
     * @memberof PolylineGlowMaterialProperty.prototype
     * @type {Cesium.Property}
     */
    color: Cesium.createPropertyDescriptor('color')
});

//静态方法，处理材质
var cacheIdx = 0;
var nameEx = "AnimationLine";
function getImageMaterial(imgurl, bgUrl, repeat, axisY, bgColor) {
    cacheIdx++;
    var typeName = nameEx + cacheIdx + "Type";
    var imageName = nameEx + cacheIdx + "Image";

    Cesium.Material[typeName] = typeName;
    Cesium.Material[imageName] = imgurl;

    if (bgUrl) {
        //存在2张url的，用叠加融合的效果
        Cesium.Material._materialCache.addMaterial(Cesium.Material[typeName], {
            fabric: {
                type: Cesium.Material.PolylineArrowLinkType,
                uniforms: {
                    color: new Cesium.Color(1, 0, 0, 1.0),
                    image: Cesium.Material[imageName],
                    time: 0,
                    repeat: repeat || new Cesium.Cartesian2(1.0, 1.0),
                    axisY: axisY,
                    image2: bgUrl,
                    bgColor: bgColor
                },
                source: _LineFlowMaterial4.default
            },
            translucent: function translucent() {
                return true;
            }
        });
    } else {
        Cesium.Material._materialCache.addMaterial(Cesium.Material[typeName], {
            fabric: {
                type: typeName,
                uniforms: {
                    color: new Cesium.Color(1, 0, 0, 1.0),
                    image: Cesium.Material[imageName],
                    time: 0,
                    repeat: repeat || new Cesium.Cartesian2(1.0, 1.0),
                    axisY: axisY
                },
                source: _LineFlowMaterial2.default
            },
            translucent: function translucent() {
                return true;
            }
        });
    }

    return {
        type: Cesium.Material[typeName],
        image: Cesium.Material[imageName]
    };
}

/***/ }),
