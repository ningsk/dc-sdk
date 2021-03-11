/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Skyline = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

var _Skyline = __webpack_require__(141);

var _Skyline2 = _interopRequireDefault(_Skyline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//天际线 类
var Skyline = exports.Skyline = function (_MarsClass) {
    _inherits(Skyline, _MarsClass);

    function Skyline(options, oldparam) {
        _classCallCheck(this, Skyline);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (Skyline.__proto__ || Object.getPrototypeOf(Skyline)).call(this, options));

        if (oldparam) {
            oldparam.viewer = options;
            options = oldparam;
        }
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

        _this.viewer = options.viewer;
        _this.tjxWidth = Cesium.defaultValue(options.tjxWidth, 2); //天际线宽度
        _this.strokeType = Cesium.defaultValue(options.strokeType, new Cesium.Cartesian3(true, false, false)); //天际线，物体描边，全描边
        _this.tjxColor = Cesium.defaultValue(options.tjxColor, new Cesium.Color(1.0, 0.0, 0.0)); //边际线颜色
        _this.bjColor = Cesium.defaultValue(options.bjColor, new Cesium.Color(0.0, 0.0, 1.0)); //物体描边颜色
        _this.mbDis = Cesium.defaultValue(options.mbDis, 500); //物体描边距离

        var that = _this;
        _this.postProcess = new Cesium.PostProcessStage({
            fragmentShader: _Skyline2.default,
            uniforms: {
                height: function height() {
                    return that.viewer.camera.positionCartographic.height;
                },
                lineWidth: function lineWidth() {
                    return that.tjxWidth;
                },
                strokeType: function strokeType() {
                    return that.strokeType;
                },
                tjxColor: function tjxColor() {
                    return that.tjxColor;
                },
                bjColor: function bjColor() {
                    return that.bjColor;
                },
                cameraPos: function cameraPos() {
                    return that.viewer.scene.camera.position;
                },
                mbDis: function mbDis() {
                    return that.mbDis;
                }
            }
        });
        _this.postProcess.enabled = Cesium.defaultValue(options.enabled, true);
        _this.viewer.scene.postProcessStages.add(_this.postProcess);
        return _this;
    }

    //显示和隐藏


    _createClass(Skyline, [{
        key: "destroy",
        value: function destroy() {
            this.viewer.scene.postProcessStages.remove(this.postProcess);
            this.postProcess.destroy();
            delete this.postProcess;

            _get(Skyline.prototype.__proto__ || Object.getPrototypeOf(Skyline.prototype), "destroy", this).call(this);
        }
    }, {
        key: "enabled",
        get: function get() {
            return this.postProcess.enabled;
        },
        set: function set(val) {
            this.postProcess.enabled = val;
        }
    }]);

    return Skyline;
}(_MarsClass2.MarsClass);

/***/ }),
