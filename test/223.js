/* 223 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FogEffect = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Fog = __webpack_require__(224);

var _Fog2 = _interopRequireDefault(_Fog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 场景雾效果
//原理：根据深度图的深度值，对片元进行不同程度的模糊
var FogEffect = exports.FogEffect = function () {
    //========== 构造方法 ========== 
    function FogEffect(options) {
        _classCallCheck(this, FogEffect);

        this.viewer = options.viewer;

        this.fogByDistance = Cesium.defaultValue(options.fogByDistance, new Cesium.Cartesian4(10, 0.0, 1000, 0.9)); //雾强度 
        this.color = Cesium.defaultValue(options.color, Cesium.Color.WHITE); //雾颜色

        this._show = Cesium.defaultValue(options.show, true);
        this._maxHeight = Cesium.defaultValue(options.maxHeight, 9000);

        this.init();
    }

    //========== 对外属性 ==========  
    //是否开启效果


    _createClass(FogEffect, [{
        key: "init",


        //========== 方法 ========== 

        value: function init() {
            var that = this;

            this.FogStage = new Cesium.PostProcessStage({
                fragmentShader: _Fog2.default,
                uniforms: {
                    fogByDistance: function fogByDistance() {
                        return that.fogByDistance;
                    },
                    fogColor: function fogColor() {
                        return that.color;
                    }
                },
                enabled: this._show
            });
            this.viewer.scene.postProcessStages.add(this.FogStage);

            //加控制，只在相机高度低于一定高度时才开启本效果
            this.viewer.scene.camera.changed.addEventListener(this.camera_changedHandler, this);
        }
    }, {
        key: "camera_changedHandler",
        value: function camera_changedHandler(event) {
            if (this.viewer.camera.positionCartographic.height < this._maxHeight) {
                this.FogStage.enabled = this._show;
            } else {
                this.FogStage.enabled = false;
            }
        }

        //销毁

    }, {
        key: "destroy",
        value: function destroy() {
            this.viewer.scene.camera.changed.removeEventListener(this.camera_changedHandler, this);
            this.viewer.scene.postProcessStages.remove(this.FogStage);

            //删除所有绑定的数据
            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: "show",
        get: function get() {
            return this._show;
        },
        set: function set(val) {
            this._show = Boolean(val);
            this.FogStage.enabled = this._show;
        }
    }]);

    return FogEffect;
}();

/***/ }),
