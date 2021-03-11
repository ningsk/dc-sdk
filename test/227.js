/* 227 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SnowCover = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _SnowCover = __webpack_require__(228);

var _SnowCover2 = _interopRequireDefault(_SnowCover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 雪覆盖 效果 
//原理：法线越垂直与地面越白 
var SnowCover = exports.SnowCover = function () {
    //========== 构造方法 ========== 

    function SnowCover(options) {
        _classCallCheck(this, SnowCover);

        this.viewer = options.viewer;

        this.alpha = Cesium.defaultValue(options.alpha, 1.0); //覆盖强度  0-1
        this._show = Cesium.defaultValue(options.show, true);
        this._maxHeight = Cesium.defaultValue(options.maxHeight, 9000);

        this.init();
    }

    //========== 对外属性 ==========  
    //是否开启效果


    _createClass(SnowCover, [{
        key: "init",


        //========== 方法 ========== 

        value: function init() {
            var that = this;
            this.postStage = new Cesium.PostProcessStage({
                name: "SnowCover",
                fragmentShader: _SnowCover2.default,
                uniforms: {
                    alpha: function alpha() {
                        return that.alpha;
                    }
                }
            });
            this.postStage.enabled = this._show;
            this.viewer.scene.postProcessStages.add(this.postStage);

            //加控制，只在相机高度低于一定高度时才开启本效果
            this.viewer.scene.camera.changed.addEventListener(this.camera_changedHandler, this);
        }
    }, {
        key: "camera_changedHandler",
        value: function camera_changedHandler(event) {
            if (viewer.camera.positionCartographic.height < this._maxHeight) {
                this.postStage.enabled = this._show;
            } else {
                this.postStage.enabled = false;
            }
        }

        //销毁

    }, {
        key: "destroy",
        value: function destroy() {
            this.viewer.scene.camera.changed.removeEventListener(this.camera_changedHandler, this);
            this.viewer.scene.postProcessStages.remove(this.postStage);

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
            this.postStage.enabled = this._show;
        }
    }]);

    return SnowCover;
}();

/***/ }),
