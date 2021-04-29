/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TextMaterial = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _TextMaterial = __webpack_require__(196);

var _TextMaterial2 = _interopRequireDefault(_TextMaterial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultColor = new Cesium.Color(0, 0, 0, 0);

//文字贴图 材质

var TextMaterial = exports.TextMaterial = function () {
    //========== 构造方法 ========== 
    function TextMaterial(options) {
        _classCallCheck(this, TextMaterial);

        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
        if (!options.text) return;
        this._text = options.text;
        this._textStyles = Cesium.defaultValue(options.textStyles, {
            font: '50px 楷体',
            fill: true,
            fillColor: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
            stroke: true,
            strokeWidth: 2,
            strokeColor: new Cesium.Color(1.0, 1.0, 1.0, 0.8),
            backgroundColor: new Cesium.Color(1.0, 1.0, 1.0, 0.1),
            textBaseline: 'top',
            padding: 40
        });
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = Cesium.defaultValue(options.color, defaultColor); //颜色
        this.repeat = Cesium.defaultValue(options.repeat, new Cesium.Cartesian2(1.0, 1.0));
        this._img = this._text2Img(this._text, this._textStyles);
        var _material = getImageMaterial(this._img.src, this.repeat);
        this._materialType = Cesium.clone(_material.type); //材质类型
        this._materialImage = Cesium.clone(_material.image); //材质图片
    }

    //========== 对外属性 ==========   


    _createClass(TextMaterial, [{
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
            result.repeat = this.repeat;
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
            other instanceof TextMaterial && Cesium.Property.equals(this._color, other._color);
        }
    }, {
        key: "_text2Img",
        value: function _text2Img(text, styles) {
            //opts.type   img/png
            var canvas = Cesium.writeTextToCanvas(text, styles);
            if (!canvas) return;
            this.canvas = canvas;
            var img = new Image();
            img.src = canvas.toDataURL("image/png");
            return img;
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
    }, {
        key: "text",
        get: function get() {
            return this._text;
        },
        set: function set(val) {
            if (!val) return;
            this._text = val;
            delete this._img;
            this._img = this._text2Img(this._text, this._textStyles);
            var _material = getImageMaterial(this._img.src, this.repeat);
            this._materialType = Cesium.clone(_material.type); //材质类型
            this._materialImage = Cesium.clone(_material.image); //材质图片
        }
    }, {
        key: "textStyles",
        get: function get() {
            return this._textStyles;
        },
        set: function set(val) {
            if (!val) return;
            delete this._img;
            this._textStyles = val;
            this._img = this._text2Img(this._text, this._textStyles);
            var _material = getImageMaterial(this._img.src, this.repeat);
            this._materialType = Cesium.clone(_material.type); //材质类型
            this._materialImage = Cesium.clone(_material.image); //材质图片
        }
    }]);

    return TextMaterial;
}();

Object.defineProperties(TextMaterial.prototype, {
    /**
     * Gets or sets the Cesium.Property specifying the {@link Cesium.Color} of the line.
     * @memberof PolylineGlowMaterialProperty.prototype
     * @type {Cesium.Property}
     */
    color: Cesium.createPropertyDescriptor('color')
});

//静态方法，处理材质
var cacheIdx = 0;
var nameEx = "Text";
function getImageMaterial(imgurl, repeat) {
    cacheIdx++;
    var typeName = nameEx + cacheIdx + "Type";
    var imageName = nameEx + cacheIdx + "Image";

    Cesium.Material[typeName] = typeName;
    Cesium.Material[imageName] = imgurl;

    Cesium.Material._materialCache.addMaterial(Cesium.Material[typeName], {
        fabric: {
            type: typeName,
            uniforms: {
                color: new Cesium.Color(1, 0, 0, 1.0),
                image: Cesium.Material[imageName],
                time: 0,
                repeat: repeat || new Cesium.Cartesian2(1.0, 1.0)
            },
            source: _TextMaterial2.default
        },
        translucent: function translucent() {
            return true;
        }
    });

    return {
        type: Cesium.Material[typeName],
        image: Cesium.Material[imageName]
    };
}

/***/ }),
