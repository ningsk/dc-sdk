/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDefaultContextMenu = getDefaultContextMenu;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _point = __webpack_require__(2);

var point = _interopRequireWildcard(_point);

var _tileset = __webpack_require__(27);

var tileset = _interopRequireWildcard(_tileset);

var _util2 = __webpack_require__(1);

var _util = _interopRequireWildcard(_util2);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//默认右键菜单
function getDefaultContextMenu(viewer) {
    var stages = viewer.scene.postProcessStages;
    var that = {};

    return [{
        text: '查看此处坐标',
        iconCls: 'fa fa-info-circle',
        visible: function visible(e) {
            return Cesium.defined(e.position);
        },
        callback: function callback(e) {
            //经纬度
            var mpt = point.formatPosition(e.position);
            var inhtml = '\u7ECF\u5EA6\uFF1A' + mpt.x + ', \u7EAC\u5EA6\uFF1A' + mpt.y + ', \u9AD8\u7A0B\uFF1A' + mpt.z;
            _util.alert(inhtml, '位置信息');

            //打印方便测试  
            var ptX = point.formatNum(e.position.x, 1); //笛卡尔
            var ptY = point.formatNum(e.position.y, 1);
            var ptZ = point.formatNum(e.position.z, 1);
            marslog.log('\u7ECF\u7EAC\u5EA6\uFF1A' + mpt.x + ',' + mpt.y + ',' + mpt.z + ', \u7B1B\u5361\u5C14\uFF1A' + ptX + ',' + ptY + ',' + ptZ);
        }
    }, {
        text: '查看当前视角',
        iconCls: 'fa fa-camera-retro',
        callback: function callback(e) {
            var mpt = JSON.stringify(point.getCameraView(viewer));

            //打印方便测试， 说明：可配置到config.json中center参数使用，或调用viewer.mars.centerAt(参数)方法
            marslog.log(mpt);

            _util.alert(mpt, '当前视角信息');
        }
    }, {
        text: '视角切换',
        iconCls: 'fa fa-street-view',
        children: [{
            text: '绕此处环绕飞行',
            iconCls: 'fa fa-retweet',
            visible: function visible(e) {
                return e.position && !point.windingPoint.isStart;
            },
            callback: function callback(e) {
                point.windingPoint.start(viewer, e.position);
            }
        }, {
            text: '关闭环绕飞行',
            iconCls: 'fa fa-remove',
            visible: function visible(e) {
                return point.windingPoint.isStart;
            },
            callback: function callback(e) {
                point.windingPoint.stop();
            }
        }, {
            text: '移动到此处',
            iconCls: 'fa fa-send-o',
            visible: function visible(e) {
                return Cesium.defined(e.position);
            },
            callback: function callback(e) {
                var range = viewer.scene.camera.positionCartographic.height;
                if (range > 5000) range = 5000;

                viewer.camera.lookAt(e.position, new Cesium.HeadingPitchRange(viewer.camera.heading, viewer.camera.pitch, range));
                viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
            }
        }, {
            text: '第一视角站到此处',
            iconCls: 'fa fa-male',
            visible: function visible(e) {
                return Cesium.defined(e.position);
            },
            callback: function callback(e) {
                viewer.camera.flyTo({
                    destination: point.addPositionsHeight(e.position, 10), //升高10米
                    orientation: {
                        heading: Cesium.Math.toRadians(0), //绕垂直于地心的轴旋转
                        pitch: Cesium.Math.toRadians(10), //绕纬度线旋转
                        roll: Cesium.Math.toRadians(0) //绕经度线旋转
                    }
                });
            }
        }, {
            text: '开启键盘漫游',
            iconCls: 'fa fa-keyboard-o',
            visible: function visible(e) {
                return !viewer.mars.keyboardRoam.enable;
            },
            callback: function callback(e) {
                viewer.mars.keyboardRoam.enable = true;
            }
        }, {
            text: '关闭键盘漫游',
            iconCls: 'fa fa-keyboard-o',
            visible: function visible(e) {
                return viewer.mars.keyboardRoam.enable;
            },
            callback: function callback(e) {
                viewer.mars.keyboardRoam.enable = false;
            }
        }, {
            text: '取消锁定',
            iconCls: 'fa fa-unlock-alt',
            visible: function visible(e) {
                return viewer.trackedEntity != undefined;
            },
            callback: function callback(e) {
                viewer.trackedEntity = undefined;
            }
        }]
    }, {
        text: '三维模型',
        iconCls: 'fa fa-building-o',
        visible: function visible(e) {
            var model = tileset.pick3DTileset(viewer, e.position); //拾取绘制返回的模型
            return Cesium.defined(model);
        },
        children: [{
            text: '显示三角网',
            iconCls: 'fa fa-connectdevelop',
            visible: function visible(e) {
                var model = tileset.pick3DTileset(viewer, e.position); //拾取绘制返回的模型
                return !model.debugWireframe;
            },
            callback: function callback(e) {
                var model = tileset.pick3DTileset(viewer, e.position); //拾取绘制返回的模型
                model.debugWireframe = true;
            }
        }, {
            text: '关闭三角网',
            iconCls: 'fa fa-connectdevelop',
            visible: function visible(e) {
                var model = tileset.pick3DTileset(viewer, e.position); //拾取绘制返回的模型
                return model.debugWireframe;
            },
            callback: function callback(e) {
                var model = tileset.pick3DTileset(viewer, e.position); //拾取绘制返回的模型
                model.debugWireframe = false;
            }
        }, {
            text: '显示包围盒',
            iconCls: 'fa fa-codepen',
            visible: function visible(e) {
                var model = tileset.pick3DTileset(viewer, e.position); //拾取绘制返回的模型
                return !model.debugShowBoundingVolume;
            },
            callback: function callback(e) {
                var model = tileset.pick3DTileset(viewer, e.position); //拾取绘制返回的模型
                model.debugShowBoundingVolume = true;
            }
        }, {
            text: '关闭包围盒',
            iconCls: 'fa fa-codepen',
            visible: function visible(e) {
                var model = tileset.pick3DTileset(viewer, e.position); //拾取绘制返回的模型
                return model.debugShowBoundingVolume;
            },
            callback: function callback(e) {
                var model = tileset.pick3DTileset(viewer, e.position); //拾取绘制返回的模型
                model.debugShowBoundingVolume = false;
            }
        }]
    }, {
        text: '地形服务',
        iconCls: 'fa fa-globe',
        visible: function visible(e) {
            return !Cesium.defined(e.target);
        },
        children: [{
            text: '开启地形',
            iconCls: 'fa fa-medium',
            visible: function visible(e) {
                return !viewer.mars.hasTerrain();
            },
            callback: function callback(e) {
                viewer.mars.updateTerrainProvider(true);
            }
        }, {
            text: '关闭地形',
            iconCls: 'fa fa-medium',
            visible: function visible(e) {
                return viewer.mars.hasTerrain();
            },
            callback: function callback(e) {
                viewer.mars.updateTerrainProvider(false);
            }
        }, {
            text: '显示三角网',
            iconCls: 'fa fa-connectdevelop',
            visible: function visible(e) {
                return !viewer.scene.globe._surface.tileProvider._debug.wireframe;
            },
            callback: function callback(e) {
                viewer.scene.globe._surface.tileProvider._debug.wireframe = true;
            }
        }, {
            text: '关闭三角网',
            iconCls: 'fa fa-connectdevelop',
            visible: function visible(e) {
                return viewer.scene.globe._surface.tileProvider._debug.wireframe;
            },
            callback: function callback(e) {
                viewer.scene.globe._surface.tileProvider._debug.wireframe = false;
            }
        }]
    }, {
        text: '图上标记',
        iconCls: 'fa fa-eyedropper',
        children: [{
            text: '标记点',
            iconCls: 'fa fa-map-marker',
            callback: function callback(e) {
                viewer.mars.draw.startDraw({
                    "type": "point",
                    "style": {
                        pixelSize: 12,
                        color: '#3388ff'
                    },
                    success: function success(entity) {
                        var positions = viewer.mars.draw.getCoordinates(entity);
                        console.log(JSON.stringify(positions));
                    }
                });
            }
        }, {
            text: '标记线',
            iconCls: 'fa fa-reorder',
            callback: function callback(e) {
                viewer.mars.draw.startDraw({
                    "type": "polyline",
                    "style": {
                        color: "#55ff33",
                        width: 3
                    },
                    success: function success(entity) {
                        var positions = viewer.mars.draw.getCoordinates(entity);
                        console.log(JSON.stringify(positions));
                    }
                });
            }
        }, {
            text: '标记面',
            iconCls: 'fa fa-medium',
            callback: function callback(e) {
                viewer.mars.draw.startDraw({
                    "type": "polygon",
                    "style": {
                        color: "#29cf34",
                        opacity: 0.5,
                        outline: true,
                        outlineWidth: 2.0
                    },
                    success: function success(entity) {
                        var positions = viewer.mars.draw.getCoordinates(entity);
                        console.log(JSON.stringify(positions));
                    }
                });
            }
        }, {
            text: '标记圆',
            iconCls: 'fa fa-genderless',
            callback: function callback(e) {
                viewer.mars.draw.startDraw({
                    "type": "circle",
                    "style": {
                        color: "#ffff00",
                        opacity: 0.6
                    },
                    success: function success(entity) {
                        var positions = viewer.mars.draw.getCoordinates(entity);
                        console.log(JSON.stringify(positions));
                    }
                });
            }
        }, {
            text: '标记矩形',
            iconCls: 'fa fa-retweet',
            callback: function callback(e) {
                viewer.mars.draw.startDraw({
                    type: "rectangle",
                    style: {
                        color: "#ffff00",
                        opacity: 0.6
                    },
                    success: function success(entity) {
                        var positions = viewer.mars.draw.getCoordinates(entity);
                        console.log(JSON.stringify(positions));
                    }
                });
            }
        }, {
            text: '允许编辑',
            iconCls: 'fa fa-pencil',
            visible: function visible(e) {
                return !viewer.mars.draw._hasEdit;
            },
            callback: function callback(e) {
                viewer.mars.draw.hasEdit(true);
            }
        }, {
            text: '禁止编辑',
            iconCls: 'fa fa-pencil-square',
            visible: function visible(e) {
                return viewer.mars.draw._hasEdit;
            },
            callback: function callback(e) {
                viewer.mars.draw.hasEdit(false);
            }
        }, {
            text: '导出GeoJSON',
            iconCls: 'fa fa-file-text-o',
            visible: function visible(e) {
                return viewer.mars.draw.hasDraw();
            },
            callback: function callback(e) {
                _util.downloadFile("图上标记.json", JSON.stringify(viewer.mars.draw.toGeoJSON()));
            }
        }, {
            text: '清除所有标记',
            iconCls: 'fa fa-trash-o',
            visible: function visible(e) {
                return viewer.mars.draw.hasDraw();
            },
            callback: function callback(e) {
                viewer.mars.draw.clearDraw();
            }
        }]
    }, {
        text: '特效效果',
        iconCls: 'fa fa-rss',
        children: [{
            text: '开启泛光',
            iconCls: 'fa fa-ticket',
            visible: function visible(e) {
                return !viewer.scene.postProcessStages.bloom.enabled;
            },
            callback: function callback(e) {
                //加泛光  （参考官方示例: bloom）
                var bloom = viewer.scene.postProcessStages.bloom;
                if (!that.bloom) {
                    bloom.enabled = false;
                    bloom.uniforms.glowOnly = false;
                    bloom.uniforms.contrast = 128;
                    bloom.uniforms.brightness = -0.3;
                    bloom.uniforms.delta = 1.0;
                    bloom.uniforms.sigma = 3.78;
                    bloom.uniforms.stepSize = 5.0;

                    that.bloom = true;
                }
                bloom.enabled = true;
            }
        }, {
            text: '关闭泛光',
            iconCls: 'fa fa-ticket',
            visible: function visible(e) {
                return viewer.scene.postProcessStages.bloom.enabled;
            },
            callback: function callback(e) {
                viewer.scene.postProcessStages.bloom.enabled = false;
            }
        }, {
            text: '开启亮度',
            iconCls: 'fa fa-trello',
            visible: function visible(e) {
                return !that.BrightnessStage;
            },
            callback: function callback(e) {
                if (!that.BrightnessStage) {
                    that.BrightnessStage = Cesium.PostProcessStageLibrary.createBrightnessStage();
                    stages.add(that.BrightnessStage);

                    that.BrightnessStage.uniforms.brightness = 2.0;
                }
                that.BrightnessStage.enabled = true;
            }
        }, {
            text: '关闭亮度',
            iconCls: 'fa fa-trello',
            visible: function visible(e) {
                return that.BrightnessStage;
            },
            callback: function callback(e) {
                if (that.BrightnessStage) {
                    stages.remove(that.BrightnessStage);
                    that.BrightnessStage = undefined;
                }
            }
        }, {
            text: '开启夜视',
            iconCls: 'fa fa-dashboard',
            visible: function visible(e) {
                return !that.NightVisionStage;
            },
            callback: function callback(e) {
                if (!that.NightVisionStage) {
                    that.NightVisionStage = Cesium.PostProcessStageLibrary.createNightVisionStage();
                    stages.add(that.NightVisionStage);
                }
                that.NightVisionStage.enabled = true;
            }
        }, {
            text: '关闭夜视',
            iconCls: 'fa fa-dashboard',
            visible: function visible(e) {
                return that.NightVisionStage;
            },
            callback: function callback(e) {
                if (that.NightVisionStage) {
                    stages.remove(that.NightVisionStage);
                    that.NightVisionStage = undefined;
                }
            }
        }, {
            text: '开启黑白',
            iconCls: 'fa fa-star-half-full',
            visible: function visible(e) {
                return !that.BlackAndWhiteStage;
            },
            callback: function callback(e) {
                if (!that.BlackAndWhiteStage) {
                    that.BlackAndWhiteStage = Cesium.PostProcessStageLibrary.createBlackAndWhiteStage();
                    stages.add(that.BlackAndWhiteStage);
                }
                that.BlackAndWhiteStage.enabled = true;
            }
        }, {
            text: '关闭黑白',
            iconCls: 'fa fa-star-half-full',
            visible: function visible(e) {
                return that.BlackAndWhiteStage;
            },
            callback: function callback(e) {
                if (that.BlackAndWhiteStage) {
                    stages.remove(that.BlackAndWhiteStage);
                    that.BlackAndWhiteStage = undefined;
                }
            }
        }, {
            text: '开启马赛克',
            iconCls: 'fa fa-delicious',
            visible: function visible(e) {
                return !that.MosaicStage;
            },
            callback: function callback(e) {
                if (!that.MosaicStage) {
                    that.MosaicStage = new Cesium.PostProcessStage({
                        fragmentShader: 'uniform sampler2D colorTexture; \n                                varying vec2 v_textureCoordinates; \n                                const int KERNEL_WIDTH=16; \n                                void main(void) \n                                { \n                                    vec2 step = 1.0 / czm_viewport.zw; \n                                    vec2 integralPos = v_textureCoordinates - mod(v_textureCoordinates, 8.0 * step); \n                                    vec3 averageValue = vec3(0.0); \n                                    for (int i = 0; i < KERNEL_WIDTH; i++) \n                                    { \n                                        for (int j = 0; j < KERNEL_WIDTH; j++) \n                                        { \n                                            averageValue += texture2D(colorTexture, integralPos + step * vec2(i, j)).rgb; \n                                        } \n                                    } \n                                    averageValue /= float(KERNEL_WIDTH * KERNEL_WIDTH); \n                                    gl_FragColor = vec4(averageValue, 1.0); \n                                } '
                    });
                    stages.add(that.MosaicStage);
                }
                that.MosaicStage.enabled = true;
            }
        }, {
            text: '关闭马赛克',
            iconCls: 'fa fa-delicious',
            visible: function visible(e) {
                return that.MosaicStage;
            },
            callback: function callback(e) {
                if (that.MosaicStage) {
                    stages.remove(that.MosaicStage);
                    that.MosaicStage = undefined;
                }
            }
        }, {
            text: '开启景深',
            iconCls: 'fa fa-simplybuilt',
            visible: function visible(e) {
                return !that.DepthOfFieldStage;
            },
            callback: function callback(e) {
                if (!that.DepthOfFieldStage) {
                    that.DepthOfFieldStage = Cesium.PostProcessStageLibrary.createDepthOfFieldStage();
                    stages.add(that.DepthOfFieldStage);

                    var uniforms = that.DepthOfFieldStage.uniforms;
                    uniforms.focalDistance = 87; //焦距
                    uniforms.delta = 1;
                    uniforms.sigma = 3.78;
                    uniforms.stepSize = 2.46; //步长
                }
                that.DepthOfFieldStage.enabled = true;
            }
        }, {
            text: '关闭景深',
            iconCls: 'fa fa-simplybuilt',
            visible: function visible(e) {
                return that.DepthOfFieldStage;
            },
            callback: function callback(e) {
                if (that.DepthOfFieldStage) {
                    stages.remove(that.DepthOfFieldStage);
                    that.DepthOfFieldStage = undefined;
                }
            }
        }]
    }, {
        text: '场景设置',
        iconCls: 'fa fa-gear',
        children: [{
            text: '开启深度监测',
            iconCls: 'fa fa-eye-slash',
            visible: function visible(e) {
                return !viewer.scene.globe.depthTestAgainstTerrain;
            },
            callback: function callback(e) {
                viewer.scene.globe.depthTestAgainstTerrain = true;
            }
        }, {
            text: '关闭深度监测',
            iconCls: 'fa fa-eye',
            visible: function visible(e) {
                return viewer.scene.globe.depthTestAgainstTerrain;
            },
            callback: function callback(e) {
                viewer.scene.globe.depthTestAgainstTerrain = false;
            }
        }, {
            text: '显示星空背景',
            iconCls: 'fa fa-moon-o',
            visible: function visible(e) {
                return !viewer.scene.skyBox.show;
            },
            callback: function callback(e) {
                viewer.scene.skyBox.show = true; //天空盒
                viewer.scene.moon.show = true; //太阳
                viewer.scene.sun.show = true; //月亮                
            }
        }, {
            text: '关闭星空背景',
            iconCls: 'fa fa-moon-o',
            visible: function visible(e) {
                return viewer.scene.skyBox.show;
            },
            callback: function callback(e) {
                viewer.scene.skyBox.show = false; //天空盒
                viewer.scene.moon.show = false; //太阳
                viewer.scene.sun.show = false; //月亮        
            }
        }, {
            text: '开启日照阴影',
            iconCls: 'fa fa-sun-o',
            visible: function visible(e) {
                return !viewer.shadows;
            },
            callback: function callback(e) {
                viewer.shadows = true;
                viewer.terrainShadows = Cesium.ShadowMode.ENABLED;
                viewer.scene.globe.enableLighting = true;
            }
        }, {
            text: '关闭日照阴影',
            iconCls: 'fa fa-sun-o',
            visible: function visible(e) {
                return viewer.shadows;
            },
            callback: function callback(e) {
                viewer.shadows = false;
                viewer.terrainShadows = Cesium.ShadowMode.RECEIVE_ONLY;
                viewer.scene.globe.enableLighting = false;
            }
        }, {
            text: '开启大气渲染',
            iconCls: 'fa fa-soundcloud',
            visible: function visible(e) {
                return !viewer.scene.skyAtmosphere.show;
            },
            callback: function callback(e) {

                viewer.scene.skyAtmosphere.show = true;
                viewer.scene.globe.showGroundAtmosphere = true;
            }
        }, {
            text: '关闭大气渲染',
            iconCls: 'fa fa-soundcloud',
            visible: function visible(e) {
                return viewer.scene.skyAtmosphere.show;
            },
            callback: function callback(e) {
                viewer.scene.skyAtmosphere.show = false;
                viewer.scene.globe.showGroundAtmosphere = false;
            }
        }, {
            text: '场景截图',
            iconCls: 'fa fa-download',
            callback: function callback(e) {
                viewer.mars.expImage();
            }
        }]
    }];
}

/***/ }),
