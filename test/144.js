/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Underground = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//地下模式类
var Underground = exports.Underground = function (_MarsClass) {
    _inherits(Underground, _MarsClass);

    //========== 构造方法 ========== 
    function Underground(options, oldparam) {
        _classCallCheck(this, Underground);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (Underground.__proto__ || Object.getPrototypeOf(Underground)).call(this, options));

        if (oldparam) {
            oldparam.viewer = options;
            options = oldparam;
        }
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

        _this.viewer = options.viewer;
        _this.depthTestOld = Cesium.clone(_this.viewer.scene.globe.depthTestAgainstTerrain);

        _this.viewer.scene.globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(100.0, 0.0, 900.0, 1.0);
        _this.viewer.scene.globe.translucency.backFaceAlpha = 0;

        _this.alpha = Cesium.defaultValue(options.alpha, 0.5);
        _this.enable = Cesium.defaultValue(options.enable, false);
        return _this;
    }

    //========== 对外属性 ==========  
    //显示和隐藏


    _createClass(Underground, [{
        key: "clear",
        value: function clear() {
            this.enable = false;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.clear();
            _get(Underground.prototype.__proto__ || Object.getPrototypeOf(Underground.prototype), "destroy", this).call(this);
        }
    }, {
        key: "alpha",
        get: function get() {
            return this._alpha;
        },
        set: function set(val) {
            this._alpha = Number(val);

            this.viewer.scene.globe.translucency.frontFaceAlphaByDistance.nearValue = this._alpha;
            this.viewer.scene.globe.translucency.frontFaceAlphaByDistance.farValue = this._alpha;
        }
    }, {
        key: "enable",
        get: function get() {
            return this.viewer.scene.globe.translucency.enabled;
        },
        set: function set(value) {
            this.viewer.scene.globe.depthTestAgainstTerrain = value ? true : this.depthTestOld;
            this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = !value; //相机对地形的碰撞检测状态

            this.viewer.scene.globe.translucency.enabled = value;
        }
    }]);

    return Underground;
}(_MarsClass2.MarsClass);

/***/ }),
