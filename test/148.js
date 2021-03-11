/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ContourLine = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//等高线分析 类
var ContourLine = exports.ContourLine = function (_MarsClass) {
    _inherits(ContourLine, _MarsClass);

    //========== 构造方法 ========== 
    function ContourLine(options, oldparam) {
        _classCallCheck(this, ContourLine);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (ContourLine.__proto__ || Object.getPrototypeOf(ContourLine)).call(this, options));

        if (oldparam) {
            oldparam.viewer = options;
            options = oldparam;
        }
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

        _this.viewer = options.viewer;

        //地球材质相关 
        _this._contourShow = Cesium.defaultValue(options.show, true); //是否显示等高线
        _this._contourSpacing = Cesium.defaultValue(options.spacing, 100.0);
        _this._contourWidth = Cesium.defaultValue(options.width, 1.5);
        _this._contourColor = Cesium.defaultValue(options.color, Cesium.Color.RED.clone());

        //地表渲染效果类型:无nono, 高程 elevation, 坡度slope, 坡向aspect
        _this._shadingType = Cesium.defaultValue(options.shadingType, "none");
        _this.elevationRamp = [0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0];
        _this.slopeRamp = [0.0, 0.29, 0.5, Math.sqrt(2) / 2, 0.87, 0.91, 1.0];
        _this.aspectRamp = [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0];
        _this.minHeight = -414.0; // approximate dead sea elevation
        _this.maxHeight = 8777.0; // approximate everest elevation


        //裁剪区域相关
        _this.floodVar = Cesium.defaultValue(options.floodVar, [0, 0, 0, 500]); //[基础淹没高度，当前淹没高度，最大淹没高度,默认高度差(最大淹没高度 - 基础淹没高度)]
        _this.ym_pos_x = Cesium.defaultValue(options.ym_pos_x, [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
        _this.ym_pos_y = Cesium.defaultValue(options.ym_pos_y, [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
        _this.ym_pos_z = Cesium.defaultValue(options.ym_pos_z, [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
        _this.rect_flood = Cesium.defaultValue(options.rect_flood, [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]); //包围盒[minx,miny,minz,maxx,maxy,maxz,0.0,0.0,0.0] 
        _this._boundingSwell = Cesium.defaultValue(options.boundingSwell, 20); //点集合的包围盒膨胀数值
        _this._show = Cesium.defaultValue(options.show, true);

        if (options.positions && options.positions.length > 0) _this.setPositions(options.positions);
        return _this;
    }

    //========== 对外属性 ==========  
    //分析参数


    _createClass(ContourLine, [{
        key: "setPositions",

        //========== 方法 ========== 

        //初始化没传顶点，后面设置顶点
        value: function setPositions(positions) {
            this._positions = positions;

            if (!positions || positions.length == 0) return;

            this._prepareFlood(positions);
            this._setFloodVar();
            this._startFlood();

            this.updateMaterial();
        }

        //与处理顶点数组

    }, {
        key: "_prepareFlood",
        value: function _prepareFlood(arr) {
            this.ym_pos_arr = arr;
            var len = arr.length;
            if (len == 0) return;

            this.ym_max_index = len;
            var minX = arr[0].x;
            var minY = arr[0].y;
            var minZ = arr[0].z;
            var maxX = arr[0].x;
            var maxY = arr[0].y;
            var maxZ = arr[0].z;
            for (var i = 0; i < len; i++) {
                if (arr[i]) {
                    this.ym_pos_x[i] = arr[i].x;
                    this.ym_pos_y[i] = arr[i].y;
                    this.ym_pos_z[i] = arr[i].z;

                    if (arr[i].x > maxX) {
                        maxX = arr[i].x;
                    }
                    if (arr[i].x < minX) {
                        minX = arr[i].x;
                    }

                    if (arr[i].y > maxY) {
                        maxY = arr[i].y;
                    }
                    if (arr[i].y < minY) {
                        minY = arr[i].y;
                    }

                    if (arr[i].z > maxZ) {
                        maxZ = arr[i].z;
                    }
                    if (arr[i].z < minZ) {
                        minZ = arr[i].z;
                    }
                } else {
                    this.ym_pos_x[i] = 0.0;
                    this.ym_pos_y[i] = 0.0;
                    this.ym_pos_z[i] = 0.0;
                }
            }
            var chaNum = this._boundingSwell;
            this._base_rect = this.rect_flood = [minX - chaNum, minY - chaNum, minZ - chaNum, maxX + chaNum, maxY + chaNum, maxZ + chaNum, 0.0, 0.0, 0.0];
        }
        //设置高度

    }, {
        key: "_setFloodVar",
        value: function _setFloodVar() {
            this.floodVar = [this.minHeight, this.minHeight, this.maxHeight, this.maxHeight - this.minHeight];
        }
        //开始

    }, {
        key: "_startFlood",
        value: function _startFlood() {
            this.globeAnalysis.floodVar[0] = this.floodVar[0];
            this.globeAnalysis.floodVar[1] = this.floodVar[1];
            this.globeAnalysis.ym_pos_x = this.ym_pos_x;
            this.globeAnalysis.ym_pos_y = this.ym_pos_y;
            this.globeAnalysis.ym_pos_z = this.ym_pos_z;
            this.globeAnalysis.rect_flood = this.rect_flood;
            this.globeAnalysis.ym_pos_arr = this.ym_pos_arr;
            this.globeAnalysis.ym_max_index = this.ym_max_index;
            this.globeAnalysis.globe = false;
            this.globeAnalysis.showElseArea = true;
            this.viewer.scene.globe.material = Cesium.Material.fromType('ElevationContour');
        }

        //===================

    }, {
        key: "updateMaterial",
        value: function updateMaterial() {
            if (!this.positions || this.positions.length == 0) return;

            var material;
            var contourUniforms;
            var shadingUniforms;

            var _shadingType = this._shadingType;
            if (this._contourShow) {
                if (_shadingType === "elevation") {
                    material = this.getElevationContourMaterial();
                    shadingUniforms = material.materials.elevationRampMaterial.uniforms;
                    shadingUniforms.minimumHeight = this.minHeight;
                    shadingUniforms.maximumHeight = this.maxHeight;
                    contourUniforms = material.materials.contourMaterial.uniforms;
                } else if (_shadingType === "slope") {
                    material = this.getSlopeContourMaterial();
                    shadingUniforms = material.materials.slopeRampMaterial.uniforms;
                    contourUniforms = material.materials.contourMaterial.uniforms;
                } else if (_shadingType === "aspect") {
                    material = this.getAspectContourMaterial();
                    shadingUniforms = material.materials.aspectRampMaterial.uniforms;
                    contourUniforms = material.materials.contourMaterial.uniforms;
                } else {
                    material = Cesium.Material.fromType("ElevationContour");
                    contourUniforms = material.uniforms;
                }
                contourUniforms.width = this._contourWidth;
                contourUniforms.spacing = this._contourSpacing;
                contourUniforms.color = this._contourColor;
            } else if (_shadingType === "elevation") {
                material = Cesium.Material.fromType("ElevationRamp");
                shadingUniforms = material.uniforms;
                shadingUniforms.minimumHeight = this.minHeight;
                shadingUniforms.maximumHeight = this.maxHeight;
            } else if (_shadingType === "slope") {
                material = Cesium.Material.fromType("SlopeRamp");
                shadingUniforms = material.uniforms;
            } else if (_shadingType === "aspect") {
                material = Cesium.Material.fromType("AspectRamp");
                shadingUniforms = material.uniforms;
            }
            if (_shadingType !== "none") {
                shadingUniforms.image = this.getColorRamp(_shadingType);

                if (!this.viewer.scene.globe.enableLighting) {
                    this.viewer.scene.globe.enableLighting = true;
                    var now = new Date();
                    now.setHours(10);
                    this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(now));
                    this.hasResetEnableLighting = true;
                }
            }
            this.contourUniforms = contourUniforms;
            this.viewer.scene.globe.material = material;
        }
    }, {
        key: "getColorRamp",
        value: function getColorRamp(_shadingType) {
            var ramp = document.createElement("canvas");
            ramp.width = 100;
            ramp.height = 1;
            var ctx = ramp.getContext("2d");

            var values;
            if (_shadingType === "elevation") {
                values = this.elevationRamp;
            } else if (_shadingType === "slope") {
                values = this.slopeRamp;
            } else if (_shadingType === "aspect") {
                values = this.aspectRamp;
            }

            var grd = ctx.createLinearGradient(0, 0, 100, 0);
            grd.addColorStop(values[0], "#000000"); //black
            grd.addColorStop(values[1], "#2747E0"); //blue
            grd.addColorStop(values[2], "#D33B7D"); //pink
            grd.addColorStop(values[3], "#D33038"); //red
            grd.addColorStop(values[4], "#FF9742"); //orange
            grd.addColorStop(values[5], "#ffd700"); //yellow
            grd.addColorStop(values[6], "#ffffff"); //white

            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, 100, 1);

            return ramp;
        }
    }, {
        key: "getElevationContourMaterial",
        value: function getElevationContourMaterial() {
            // Creates a composite material with both elevation shading and contour lines
            return new Cesium.Material({
                fabric: {
                    type: "ElevationColorContour",
                    materials: {
                        contourMaterial: {
                            type: "ElevationContour"
                        },
                        elevationRampMaterial: {
                            type: "ElevationRamp"
                        }
                    },
                    components: {
                        diffuse: "contourMaterial.alpha == 0.0 ? elevationRampMaterial.diffuse : contourMaterial.diffuse",
                        alpha: "max(contourMaterial.alpha, elevationRampMaterial.alpha)"
                    }
                },
                translucent: false
            });
        }
    }, {
        key: "getSlopeContourMaterial",
        value: function getSlopeContourMaterial() {
            // Creates a composite material with both slope shading and contour lines
            return new Cesium.Material({
                fabric: {
                    type: "SlopeColorContour",
                    materials: {
                        contourMaterial: {
                            type: "ElevationContour"
                        },
                        slopeRampMaterial: {
                            type: "SlopeRamp"
                        }
                    },
                    components: {
                        diffuse: "contourMaterial.alpha == 0.0 ? slopeRampMaterial.diffuse : contourMaterial.diffuse",
                        alpha: "max(contourMaterial.alpha, slopeRampMaterial.alpha)"
                    }
                },
                translucent: false
            });
        }
    }, {
        key: "getAspectContourMaterial",
        value: function getAspectContourMaterial() {
            // Creates a composite material with both aspect shading and contour lines
            return new Cesium.Material({
                fabric: {
                    type: "AspectColorContour",
                    materials: {
                        contourMaterial: {
                            type: "ElevationContour"
                        },
                        aspectRampMaterial: {
                            type: "AspectRamp"
                        }
                    },
                    components: {
                        diffuse: "contourMaterial.alpha == 0.0 ? aspectRampMaterial.diffuse : contourMaterial.diffuse",
                        alpha: "max(contourMaterial.alpha, aspectRampMaterial.alpha)"
                    }
                },
                translucent: false
            });
        }
    }, {
        key: "clear",
        value: function clear() {
            this.positions = null;
            this.contourUniforms = null;
            this.viewer.scene.globe.material = null;
            this.viewer.scene.globe._surface.tileProvider.resetFloodAnalysis();

            if (this.hasResetEnableLighting) {
                this.viewer.scene.globe.enableLighting = false;
                this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date());
                delete this.hasResetEnableLighting;
            }
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.clear();
            _get(ContourLine.prototype.__proto__ || Object.getPrototypeOf(ContourLine.prototype), "destroy", this).call(this);
        }
    }, {
        key: "globeAnalysis",
        get: function get() {
            return this.viewer.scene.globe._surface.tileProvider.floodAnalysis;
        }
    }, {
        key: "positions",
        get: function get() {
            return this._positions;
        },
        set: function set(val) {
            this._positions = val;
            this.setPositions(val);
        }

        //地表渲染效果类型:无nono, 高程 elevation, 坡度slope, 坡向aspect

    }, {
        key: "shadingType",
        get: function get() {
            return this._shadingType;
        },
        set: function set(val) {
            this._shadingType = val;
            this.updateMaterial();
        }

        //是否显示等高线  

    }, {
        key: "show",
        get: function get() {
            return this._contourShow;
        },
        set: function set(val) {
            this._contourShow = val;
            this.updateMaterial();
        }

        //等高线 线宽

    }, {
        key: "width",
        get: function get() {
            return this._contourWidth;
        },
        set: function set(val) {
            this._contourWidth = val;
            if (this.contourUniforms) this.contourUniforms.width = val;
        }
        //等高线 间隔

    }, {
        key: "spacing",
        get: function get() {
            return this._contourSpacing;
        },
        set: function set(val) {
            this._contourSpacing = val;
            if (this.contourUniforms) this.contourUniforms.spacing = val;
        }
        //等高线 颜色

    }, {
        key: "color",
        get: function get() {
            return this._contourColor;
        },
        set: function set(val) {
            this._contourColor = val;
            if (this.contourUniforms) this.contourUniforms.color = val;
        }
    }]);

    return ContourLine;
}(_MarsClass2.MarsClass);

/***/ }),
