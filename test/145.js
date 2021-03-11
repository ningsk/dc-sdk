/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ViewShed3D = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

var _ViewShed3D = __webpack_require__(146);

var _ViewShed3D2 = _interopRequireDefault(_ViewShed3D);

var _RectangularSensorGraphics = __webpack_require__(85);

var _point = __webpack_require__(2);

var _matrix = __webpack_require__(17);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//   可视分析 类
var ViewShed3D = exports.ViewShed3D = function (_MarsClass) {
    _inherits(ViewShed3D, _MarsClass);

    //========== 构造方法 ========== 
    function ViewShed3D(options, oldparam) {
        _classCallCheck(this, ViewShed3D);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (ViewShed3D.__proto__ || Object.getPrototypeOf(ViewShed3D)).call(this, options));

        if (oldparam) {
            oldparam.viewer = options;
            options = oldparam;
        }
        if (Cesium.defined(options.debugFrustum)) options.showFrustum = options.debugFrustum;
        _this.debugFrustum = _this.showFrustum;
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

        _this.viewer = options.viewer;
        _this.viewer.terrainShadows = Cesium.ShadowMode.ENABLED;

        _this.cameraPosition = options.cameraPosition; //相机位置
        _this.viewPosition = options.viewPosition; //视点位置

        _this._horizontalAngle = Cesium.defaultValue(options.horizontalAngle, 120); //水平张角
        _this._verticalAngle = Cesium.defaultValue(options.verticalAngle, 90); //垂直张角
        _this._visibleAreaColor = Cesium.defaultValue(options.visibleAreaColor, new Cesium.Color(0, 1, 0)); //可视颜色
        _this._hiddenAreaColor = Cesium.defaultValue(options.hiddenAreaColor, new Cesium.Color(1, 0, 0)); //不可视颜色
        _this._alpha = Cesium.defaultValue(options.alpha, 0.5); //混合度
        _this._distance = Cesium.defaultValue(options.distance, 100); //距离  
        _this._maximumDistance = Cesium.defaultValue(options.maximumDistance, 5000.0);
        _this._offsetHeight = Cesium.defaultValue(options.offsetHeight, 1.5);
        _this._debugFrustum = Cesium.defaultValue(options.showFrustum, true); //视椎体显示
        _this._show = Cesium.defaultValue(options.show, true); //可视域显示


        _this._defaultColorTexture = new Cesium.Texture({ //默认材质
            context: _this.viewer.scene.context,
            source: {
                width: 1,
                height: 1,
                arrayBufferView: new Uint8Array([0, 0, 0, 0])
            },
            flipY: false
        });

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码  
        if (options.calback) {
            _this.on(_MarsClass2.eventType.end, function (e) {
                options.calback(e.distance, _this);
            });
        }
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码  


        if (_this.cameraPosition && _this.viewPosition) {
            _this._addToScene();
        } else {
            _this._bindMourseEvent();
        }
        return _this;
    }

    //========== 对外属性 ========== 
    //水平张角


    _createClass(ViewShed3D, [{
        key: "setCursor",


        //========== 方法 ==========  
        value: function setCursor(val) {
            this.viewer._container.style.cursor = val ? 'crosshair' : '';
        }
        //激活绑定事件

    }, {
        key: "_bindMourseEvent",
        value: function _bindMourseEvent() {
            var that = this;
            var viewer = this.viewer;
            var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
            handler.setInputAction(function (movement) {
                var cartesian = (0, _point.getCurrentMousePosition)(viewer.scene, movement.position);
                if (!cartesian) return;

                if (!that.cameraPosition) {
                    //相机位置 
                    cartesian = (0, _point.addPositionsHeight)(cartesian, that._offsetHeight); //加人的身高等因素，略微抬高一些

                    that.cameraPosition = cartesian;
                } else if (that.cameraPosition && !that.viewPosition) {
                    var len = Cesium.Cartesian3.distance(that.cameraPosition, cartesian);
                    if (len > 5000) {
                        cartesian = (0, _matrix.getOnLinePointByLen)(that.cameraPosition, cartesian, 5000);
                    }
                    that.viewPosition = cartesian;

                    that._unbindMourseEvent();
                    that.setCursor(false);
                    that._addToScene();
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            handler.setInputAction(function (movement) {
                var cartesian = (0, _point.getCurrentMousePosition)(viewer.scene, movement.endPosition);
                if (!cartesian) return;
                var cp = that.cameraPosition;
                if (cp) {
                    var len = Cesium.Cartesian3.distance(cp, cartesian);
                    if (len > 5000) {
                        cartesian = (0, _matrix.getOnLinePointByLen)(cp, cartesian, 5000);
                        that.frustumQuaternion = that.getFrustumQuaternion(cp, cartesian);
                        that.distance = 5000;
                    } else {
                        that.frustumQuaternion = that.getFrustumQuaternion(cp, cartesian);
                        that.distance = Number(len.toFixed(1));
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this._handler = handler;

            this.setCursor(true);
        }

        //解绑事件

    }, {
        key: "_unbindMourseEvent",
        value: function _unbindMourseEvent() {
            if (this._handler) {
                this._handler.destroy();
                delete this._handler;
            }
            this.setCursor(false);
        }

        //添加到场景里

    }, {
        key: "_addToScene",
        value: function _addToScene() {
            this.frustumQuaternion = this.getFrustumQuaternion(this.cameraPosition, this.viewPosition);
            this._createShadowMap(this.cameraPosition, this.viewPosition);
            this._addPostProcess();
            if (!this.radar) this.addRadar(this.cameraPosition, this.frustumQuaternion);
            this.viewer.scene.primitives.add(this);

            this.fire(_MarsClass2.eventType.end, {
                distance: this.distance,
                cameraPosition: this.cameraPosition,
                viewPosition: this.viewPosition
            });
        }

        //创建ShadowMap

    }, {
        key: "_createShadowMap",
        value: function _createShadowMap(cpos, viewPosition, fq) {
            var camera_pos = cpos;
            var lookat_pos = viewPosition;
            var scene = this.viewer.scene;
            var camera1 = new Cesium.Camera(scene);
            camera1.position = camera_pos;
            camera1.direction = Cesium.Cartesian3.subtract(lookat_pos, camera_pos, new Cesium.Cartesian3(0, 0, 0));
            camera1.up = Cesium.Cartesian3.normalize(camera_pos, new Cesium.Cartesian3(0, 0, 0));

            var far = Number(Cesium.Cartesian3.distance(lookat_pos, camera_pos).toFixed(1));
            this.distance = far;

            camera1.frustum = new Cesium.PerspectiveFrustum({
                fov: Cesium.Math.toRadians(120),
                aspectRatio: scene.canvas.clientWidth / scene.canvas.clientHeight,
                near: 0.1,
                far: 5000
            });

            var isSpotLight = true;
            this.viewShadowMap = new Cesium.ShadowMap({
                lightCamera: camera1,
                enable: false,
                isPointLight: !isSpotLight,
                isSpotLight: isSpotLight,
                cascadesEnabled: false,
                context: scene.context,
                pointLightRadius: far,
                maximumDistance: this._maximumDistance
            });
        }

        //获取四元数

    }, {
        key: "getFrustumQuaternion",
        value: function getFrustumQuaternion(cpos, viewPosition) {
            //获取相机四元数，用来调整视椎体摆放
            var direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(viewPosition, cpos, new Cesium.Cartesian3()), new Cesium.Cartesian3());
            var up = Cesium.Cartesian3.normalize(cpos, new Cesium.Cartesian3());
            var camera = new Cesium.Camera(this.viewer.scene);
            camera.position = cpos;
            camera.direction = direction;
            camera.up = up;
            direction = camera.directionWC;
            up = camera.upWC;
            var right = camera.rightWC;
            var scratchRight = new Cesium.Cartesian3();
            var scratchRotation = new Cesium.Matrix3();
            var scratchOrientation = new Cesium.Quaternion();

            // var right = Cesium.Cartesian3.cross(direction,up,new Cesium.Cartesian3());
            right = Cesium.Cartesian3.negate(right, scratchRight);
            var rotation = scratchRotation;
            Cesium.Matrix3.setColumn(rotation, 0, right, rotation);
            Cesium.Matrix3.setColumn(rotation, 1, up, rotation);
            Cesium.Matrix3.setColumn(rotation, 2, direction, rotation);
            //计算视锥姿态
            var orientation = Cesium.Quaternion.fromRotationMatrix(rotation, scratchOrientation);
            return orientation;
        }

        //添加后处理

    }, {
        key: "_addPostProcess",
        value: function _addPostProcess() {
            var that = this;
            var bias = that.viewShadowMap._isPointLight ? that.viewShadowMap._pointBias : that.viewShadowMap._primitiveBias;
            this.postProcess = new Cesium.PostProcessStage({
                fragmentShader: _ViewShed3D2.default,
                uniforms: {
                    czzj: function czzj() {
                        return that.verticalAngle;
                    },
                    dis: function dis() {
                        return that.distance;
                    },
                    spzj: function spzj() {
                        return that.horizontalAngle;
                    },
                    visibleColor: function visibleColor() {
                        return that.visibleAreaColor;
                    },
                    disVisibleColor: function disVisibleColor() {
                        return that.hiddenAreaColor;
                    },
                    mixNum: function mixNum() {
                        return that.alpha;
                    },
                    marsShadow: function marsShadow() {
                        return that.viewShadowMap._shadowMapTexture || that._defaultColorTexture;
                    },
                    _shadowMap_matrix: function _shadowMap_matrix() {
                        return that.viewShadowMap._shadowMapMatrix;
                    },
                    shadowMap_lightPositionEC: function shadowMap_lightPositionEC() {
                        return that.viewShadowMap._lightPositionEC;
                    },
                    shadowMap_lightPositionWC: function shadowMap_lightPositionWC() {
                        return that.viewShadowMap._lightCamera.position;
                    },
                    shadowMap_lightDirectionEC: function shadowMap_lightDirectionEC() {
                        return that.viewShadowMap._lightDirectionEC;
                    },
                    shadowMap_lightUp: function shadowMap_lightUp() {
                        return that.viewShadowMap._lightCamera.up;
                    },
                    shadowMap_lightDir: function shadowMap_lightDir() {
                        return that.viewShadowMap._lightCamera.direction;
                    },
                    shadowMap_lightRight: function shadowMap_lightRight() {
                        return that.viewShadowMap._lightCamera.right;
                    },
                    shadowMap_texelSizeDepthBiasAndNormalShadingSmooth: function shadowMap_texelSizeDepthBiasAndNormalShadingSmooth() {
                        var texelStepSize = new Cesium.Cartesian2();
                        texelStepSize.x = 1.0 / that.viewShadowMap._textureSize.x;
                        texelStepSize.y = 1.0 / that.viewShadowMap._textureSize.y;
                        return Cesium.Cartesian4.fromElements(texelStepSize.x, texelStepSize.y, bias.depthBias, bias.normalShadingSmooth, this.combinedUniforms1);
                    },
                    shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness: function shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness() {
                        return Cesium.Cartesian4.fromElements(bias.normalOffsetScale, that.viewShadowMap._distance, that.viewShadowMap.maximumDistance, that.viewShadowMap._darkness, this.combinedUniforms2);
                    },
                    depthTexture1: function depthTexture1() {
                        return that.getSceneDepthTexture(that.viewer);
                        // return that._defaultDepth;
                    }
                }
            });
            this.show && this.viewer.scene.postProcessStages.add(this.postProcess);
        }
    }, {
        key: "getSceneDepthTexture",
        value: function getSceneDepthTexture(viewer) {
            var scene = viewer.scene;
            var environmentState = scene._environmentState;
            var view = scene._view;
            var useGlobeDepthFramebuffer = environmentState.useGlobeDepthFramebuffer;
            var globeFramebuffer = useGlobeDepthFramebuffer ? view.globeDepth.framebuffer : undefined;
            var sceneFramebuffer = view.sceneFramebuffer.getFramebuffer();
            var depthTexture = Cesium.defaultValue(globeFramebuffer, sceneFramebuffer).depthStencilTexture; //对的

            // var depthTexture = scene._view.pickDepths[0]._depthTexture;
            // var depthTexture = scene._view.pickDepths[0]._textureToCopy;
            // var depthTexture = scene._view.pickDepths[0]._copyDepthCommand._framebuffer._colorTextures[0];
            // var depthTexture = this.wyypost&&this.wyypost._depthTexture?this.wyypost._depthTexture:scene.context.uniformState.globeDepthTexture;
            // var depthTexture = scene.context.uniformState.globeDepthTexture;//对的
            return depthTexture;
        }

        //添加雷达

    }, {
        key: "addRadar",
        value: function addRadar(cpos, frustumQuaternion) {
            var position = cpos;
            var that = this;
            this.radar = this.viewer.entities.add({
                position: position,
                orientation: frustumQuaternion,
                show: this._debugFrustum && this.show,
                rectangularSensor: new _RectangularSensorGraphics.RectangularSensorGraphics({
                    radius: that.distance, //传感器的半径
                    xHalfAngle: Cesium.Math.toRadians(that.horizontalAngle / 2), //传感器水平半角
                    yHalfAngle: Cesium.Math.toRadians(that.verticalAngle / 2), //传感器垂直半角 
                    material: new Cesium.Color(0.0, 1.0, 1.0, 0.4), //目前用的统一材质
                    lineColor: new Cesium.Color(1.0, 1.0, 1.0, 1.0), //线的颜色
                    slice: 8,
                    showScanPlane: false, //是否显示扫描面 
                    showThroughEllipsoid: false, //此参数控制深度检测，为false启用深度检测，可以解决雷达一半在地球背面时显示的问题
                    showLateralSurfaces: false,
                    showDomeSurfaces: false
                })
            });
        }
        //重置雷达

    }, {
        key: "resetRadar",
        value: function resetRadar() {
            this.removeRadar();
            this.addRadar(this.cameraPosition, this.frustumQuaternion);
        }
        //删除雷达

    }, {
        key: "removeRadar",
        value: function removeRadar() {
            if (this.radar) {
                this.viewer.entities.remove(this.radar);
                delete this.radar;
            }
        }

        //更新

    }, {
        key: "update",
        value: function update(frameState) {
            this.viewShadowMap && frameState.shadowMaps.push(this.viewShadowMap);
        }

        //销毁

    }, {
        key: "destroy",
        value: function destroy() {
            this.viewer.terrainShadows = Cesium.ShadowMode.DISABLED;
            this._unbindMourseEvent();

            if (this.postProcess) {
                this.viewer.scene.postProcessStages.remove(this.postProcess);
                delete this.postProcess;
            }
            this.removeRadar();

            _get(ViewShed3D.prototype.__proto__ || Object.getPrototypeOf(ViewShed3D.prototype), "destroy", this).call(this);
        }
    }, {
        key: "horizontalAngle",
        get: function get() {
            return this._horizontalAngle;
        },
        set: function set(val) {
            this._horizontalAngle = val;
            this.resetRadar();
        }
        //垂直张角

    }, {
        key: "verticalAngle",
        get: function get() {
            return this._verticalAngle;
        },
        set: function set(val) {
            this._verticalAngle = val;
            this.resetRadar();
        }
        //可视距离

    }, {
        key: "distance",
        get: function get() {
            return this._distance;
        },
        set: function set(val) {
            this._distance = val;
            this.resetRadar();
        }
        //可视区域颜色

    }, {
        key: "visibleAreaColor",
        get: function get() {
            return this._visibleAreaColor;
        },
        set: function set(val) {
            this._visibleAreaColor = val;
        }
        //不可视区域颜色

    }, {
        key: "hiddenAreaColor",
        get: function get() {
            return this._hiddenAreaColor;
        },
        set: function set(val) {
            this._hiddenAreaColor = val;
        }
        //混合系数0-1

    }, {
        key: "alpha",
        get: function get() {
            return this._alpha;
        },
        set: function set(val) {
            this._alpha = val;
        }
        //显示和隐藏

    }, {
        key: "show",
        get: function get() {
            return this._show;
        },
        set: function set(val) {
            this._show = val;
            if (val) {
                if (!this.postProcess) this._addPostProcess();
            } else {
                if (this.postProcess) {
                    this.viewer.scene.postProcessStages.remove(this.postProcess);
                    delete this.postProcess;
                }
            }
            if (this.radar) this.radar.show = this._debugFrustum && this.show;
        }
    }, {
        key: "showFrustum",
        get: function get() {
            return this._debugFrustum;
        },
        set: function set(val) {
            this._debugFrustum = val;
            if (this.radar) this.radar.show = val;
        }
    }]);

    return ViewShed3D;
}(_MarsClass2.MarsClass);

/***/ }),
