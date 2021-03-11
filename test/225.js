/* 225 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InvertedScene = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _InvertedScene = __webpack_require__(226);

var _InvertedScene2 = _interopRequireDefault(_InvertedScene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//后处理实现倒影
//原理：利用空间镜面反射技术，计算倒影射线的UV进行采样
var InvertedScene = exports.InvertedScene = function () {
    //========== 构造方法 ========== 

    function InvertedScene(options) {
        _classCallCheck(this, InvertedScene);

        this.viewer = options.viewer;
        this._show = Cesium.defaultValue(options.show, true);

        this.init();
    }

    //========== 对外属性 ========== 

    //是否开启效果


    _createClass(InvertedScene, [{
        key: "init",


        //========== 方法 ========== 

        value: function init() {
            this.postStage = new Cesium.PostProcessStage({
                "name": "InvertedScene",
                fragmentShader: _InvertedScene2.default
            });
            this.postStage.enabled = this._show;
            this.viewer.scene.postProcessStages.add(this.postStage);
        }

        //销毁

    }, {
        key: "destroy",
        value: function destroy() {
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

    return InvertedScene;
}();

/***/ }),
