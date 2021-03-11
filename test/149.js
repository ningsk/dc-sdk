/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MixedOcclusion = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MixedOcclusion = __webpack_require__(150);

var _MixedOcclusion2 = _interopRequireDefault(_MixedOcclusion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 建筑物混合遮挡 
// 原理：自己创建FBO，把收集到的所有瓦片绘制指令，都绘制到这个FBO里，开启深度检测，然后再贴屏
// 1.楼块不能遮挡道路、水系、绿地和标注等地图元素；
// 2.楼快之间，需要实现不透明的实际遮挡效果。
var MixedOcclusion = exports.MixedOcclusion = function () {
    //========== 构造方法 ==========     
    function MixedOcclusion(options, oldparam) {
        _classCallCheck(this, MixedOcclusion);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        if (oldparam) {
            oldparam.viewer = options;
            options = oldparam;
        }
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

        this.viewer = options.viewer;

        this._enabled = Cesium.defaultValue(options.enabled, true);
        this._alpha = Cesium.defaultValue(options.alpha, 0.5);

        this.init();
    }

    //========== 对外属性 ==========  
    //透明度


    _createClass(MixedOcclusion, [{
        key: "init",


        //========== 方法 ========== 

        value: function init() {
            var context = this.viewer.scene.context;
            var width = this.viewer.scene.drawingBufferWidth;
            var height = this.viewer.scene.drawingBufferHeight;

            this.width = width;
            this.height = height;

            this.colorTexture = new Cesium.Texture({
                context: context,
                width: width,
                height: height,
                pixelFormat: Cesium.PixelFormat.RGBA,
                pixelDatatype: Cesium.PixelDatatype.FLOAT,
                sampler: new Cesium.Sampler({
                    wrapS: Cesium.TextureWrap.CLAMP_TO_EDGE,
                    wrapT: Cesium.TextureWrap.CLAMP_TO_EDGE,
                    minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
                    magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
                })
            });

            this.depthStencilTexture = new Cesium.Texture({
                context: context,
                width: width,
                height: height,
                pixelFormat: Cesium.PixelFormat.DEPTH_STENCIL,
                pixelDatatype: Cesium.PixelDatatype.UNSIGNED_INT_24_8
            });

            Cesium.ExpandByMars.mixedOcclusion.tilesFbo = new Cesium.Framebuffer({
                context: context,
                colorTextures: [this.colorTexture],
                depthStencilTexture: this.depthStencilTexture,
                destroyAttachments: false
            });

            Cesium.ExpandByMars.mixedOcclusion.tilesFboClear = new Cesium.ClearCommand({
                color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
                framebuffer: Cesium.ExpandByMars.mixedOcclusion.tilesFbo,
                depth: 2.0,
                stencil: 2.0
            });

            this.viewer.scene._preUpdate.addEventListener(this._preUpdateHandler, this);
            this.setEnabled(this._enabled);
        }
    }, {
        key: "_preUpdateHandler",
        value: function _preUpdateHandler(e) {
            Cesium.ExpandByMars.mixedOcclusion.newFrame = true;

            var newWidth = this.viewer.scene.drawingBufferWidth;
            var newHeight = this.viewer.scene.drawingBufferHeight;
            if (newWidth != this.width || newHeight != this.height) {
                var context = this.viewer.scene.context;
                var width = newWidth;
                var height = newHeight;

                this.width = width;
                this.height = height;

                this.depthTexture && this.depthTexture.destroy();
                this.depthStencilTexture && this.depthStencilTexture.destroy();
                this.colorTexture && this.colorTexture.destroy();
                Cesium.ExpandByMars.mixedOcclusion.tilesFbo && Cesium.ExpandByMars.mixedOcclusion.tilesFbo.destroy();

                this.colorTexture = new Cesium.Texture({
                    context: context,
                    width: width,
                    height: height,
                    pixelFormat: Cesium.PixelFormat.RGBA,
                    pixelDatatype: Cesium.PixelDatatype.FLOAT,
                    sampler: new Cesium.Sampler({
                        wrapS: Cesium.TextureWrap.CLAMP_TO_EDGE,
                        wrapT: Cesium.TextureWrap.CLAMP_TO_EDGE,
                        minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
                        magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
                    })
                });

                this.depthStencilTexture = new Cesium.Texture({
                    context: context,
                    width: width,
                    height: height,
                    pixelFormat: Cesium.PixelFormat.DEPTH_STENCIL,
                    pixelDatatype: Cesium.PixelDatatype.UNSIGNED_INT_24_8
                });

                this.depthTexture = new Cesium.Texture({
                    context: context,
                    width: width,
                    height: height,
                    pixelFormat: Cesium.PixelFormat.RGBA,
                    pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
                    sampler: new Cesium.Sampler({
                        wrapS: Cesium.TextureWrap.CLAMP_TO_EDGE,
                        wrapT: Cesium.TextureWrap.CLAMP_TO_EDGE,
                        minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
                        magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
                    })
                });

                Cesium.ExpandByMars.mixedOcclusion.tilesFbo = new Cesium.Framebuffer({
                    context: context,
                    colorTextures: [this.colorTexture],
                    depthStencilTexture: this.depthStencilTexture,
                    destroyAttachments: false
                });
                Cesium.ExpandByMars.mixedOcclusion.tilesFboClear = new Cesium.ClearCommand({
                    color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
                    framebuffer: Cesium.ExpandByMars.mixedOcclusion.tilesFbo,
                    depth: 2.0,
                    stencil: 2.0
                });
            }
        }
    }, {
        key: "setEnabled",
        value: function setEnabled(val) {
            var that = this;

            Cesium.ExpandByMars.mixedOcclusion.enable = val;

            if (val) {
                this.postProcess = new Cesium.PostProcessStage({
                    fragmentShader: _MixedOcclusion2.default,
                    uniforms: {
                        mergeTexture: function mergeTexture() {
                            return Cesium.ExpandByMars.mixedOcclusion.tilesFbo._colorTextures[0];
                        },
                        alpha: function alpha() {
                            return that._alpha;
                        }
                    }
                });
                this.viewer.scene.postProcessStages.add(this.postProcess);
            } else {
                Cesium.ExpandByMars.mixedOcclusion.tilesFboClear.execute(this.viewer.scene.context);
                if (this.postProcess) this.viewer.scene.postProcessStages.remove(this.postProcess);
            }
        }

        //销毁

    }, {
        key: "destroy",
        value: function destroy() {
            this.setEnabled(false);
            this.viewer.scene._preUpdate.removeEventListener(this._preUpdateHandler, this);

            if (this.depthTexture) {
                this.depthTexture.destroy();
                delete this.depthTexture;
            }
            if (this.depthStencilTexture) {
                this.depthStencilTexture.destroy();
                delete this.depthStencilTexture;
            }
            if (this.colorTexture) {
                this.colorTexture.destroy();
                delete this.colorTexture;
            }

            //删除所有绑定的数据
            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: "alpha",
        get: function get() {
            return this._alpha;
        },
        set: function set(val) {
            this._alpha = val;
        }

        //开启关闭

    }, {
        key: "enabled",
        get: function get() {
            return this._enabled;
        },
        set: function set(val) {
            this._enabled = val;
            this.setEnabled(val);
        }
    }]);

    return MixedOcclusion;
}();

/***/ }),
