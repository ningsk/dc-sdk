/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ScrollWallGlow = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _point = __webpack_require__(2);

var _ScrollWallGlowVS = __webpack_require__(221);

var _ScrollWallGlowVS2 = _interopRequireDefault(_ScrollWallGlowVS);

var _ScrollWallGlowFS = __webpack_require__(222);

var _ScrollWallGlowFS2 = _interopRequireDefault(_ScrollWallGlowFS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//走马灯围墙效果
var ScrollWallGlow = exports.ScrollWallGlow = function () {
    function ScrollWallGlow(viewer, options) {
        _classCallCheck(this, ScrollWallGlow);

        this.viewer = viewer;
        this.options = options;

        this.positions = options.positions;

        this.color = Cesium.defaultValue(options.color, Cesium.Color.YELLOW);
        this.u_tcolor = Cesium.defaultValue(options.u_tcolor, Cesium.Color.YELLOW); //设置不透明的时候，alpha小于的颜色值
        this.height = Cesium.defaultValue(options.height, 500);
        this.speed = Cesium.defaultValue(options.speed, 600);
        this.direction = Cesium.defaultValue(options.direction, -1); //方向：1往上、-1往下
        this.translucent = Cesium.defaultValue(options.translucent, true); //添加透明参数,true为透明
        this.style = Cesium.defaultValue(options.style, 1);
        this._show = Cesium.defaultValue(options.show, true);

        this.draw();
    }
    //========== 对外属性 ==========  


    _createClass(ScrollWallGlow, [{
        key: "draw",


        //========== 方法 ========== 
        value: function draw() {
            var cps = this.positions;
            var up = (0, _point.addPositionsHeight)(cps, this.height);

            //计算位置
            var pos = []; //坐标
            var sts = []; //纹理
            var indices = []; //索引
            var normal = []; //法向量

            for (var i = 0, len = cps.length; i < len; i++) {
                var ni = i + 1;
                if (ni == len) ni = 0;

                pos.push.apply(pos, [cps[i].x, cps[i].y, cps[i].z]);
                pos.push.apply(pos, [cps[ni].x, cps[ni].y, cps[ni].z]);
                pos.push.apply(pos, [up[ni].x, up[ni].y, up[ni].z]);
                pos.push.apply(pos, [up[i].x, up[i].y, up[i].z]);

                normal.push.apply(normal, [0, 0, 1]);
                normal.push.apply(normal, [0, 0, 1]);
                normal.push.apply(normal, [0, 0, 1]);
                normal.push.apply(normal, [0, 0, 1]);

                sts.push.apply(sts, [0, 0, 1, 0, 1, 1, 0, 1]); //四个点的纹理一次存入

                var ii = i * 4;
                var i1 = ii + 1;
                var i2 = ii + 2;
                var i3 = ii + 3;
                indices.push.apply(indices, [ii, i1, i2, i2, i3, ii]);
            }

            var positions = new Float64Array(pos);
            var gi = new Cesium.GeometryInstance({
                geometry: new Cesium.Geometry({
                    attributes: {
                        position: new Cesium.GeometryAttribute({
                            // 使用double类型的position进行计算
                            componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                            //componentDatatype: Cesium.ComponentDatatype.FLOAT,
                            componentsPerAttribute: 3,
                            values: positions
                        }),
                        normal: new Cesium.GeometryAttribute({
                            componentDatatype: Cesium.ComponentDatatype.FLOAT,
                            componentsPerAttribute: 3,
                            values: new Float32Array(normal)
                        }),
                        st: new Cesium.GeometryAttribute({
                            componentDatatype: Cesium.ComponentDatatype.FLOAT,
                            componentsPerAttribute: 2,
                            values: new Float32Array(sts)
                        })
                    },
                    indices: new Uint16Array(indices),
                    primitiveType: Cesium.PrimitiveType.TRIANGLES,
                    boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
                })
            });

            this.primitive = new Cesium.Primitive({
                geometryInstances: gi,
                appearance: new Cesium.MaterialAppearance({
                    material: new Cesium.Material({
                        translucent: this.translucent,
                        fabric: {
                            uniforms: {
                                u_color: this.color,
                                speed: this.speed,
                                direction: this.direction,
                                u_tcolor: this.u_tcolor
                            },
                            source: this.createShader(this.translucent)
                        }
                    }),
                    vertexShaderSource: _ScrollWallGlowVS2.default,
                    fragmentShaderSource: _ScrollWallGlowFS2.default
                }),
                asynchronous: false
            });
            this.primitive.show = this._show;
            this.viewer.scene.primitives.add(this.primitive);
        }
    }, {
        key: "destroy",
        value: function destroy() {
            if (this.primitive) {
                this.viewer.scene.primitives.remove(this.primitive);
                delete this.primitive;
            }

            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: "createShader",
        value: function createShader(t) {
            //修改了shader
            var fs = '';
            if (this.style === 1) {
                fs += 'czm_material czm_getMaterial( czm_materialInput cmi )\n' + '{\n' + '    czm_material material = czm_getDefaultMaterial(cmi);\n' + '    vec2 st = cmi.st;' + '    float t = fract(czm_frameNumber/speed) * direction;\n' + '    vec2 st1 = vec2(st.s,fract(st.t - t));\n' + '    vec4 color = vec4(0.,0.,0.,0.);\n' + '    float tt = 0.5 - abs(0.5 - st1.t);\n' + '    float ss = st1.s ;\n';
                if (t) {
                    fs += '   float alpha = tt * 2.;\n' + '   color = vec4(u_color.rgb * u_color.a, alpha * 1.2);\n' + '   material.diffuse = color.rgb;\n' + '   material.alpha = color.a;\n' + '   return material;\n' + '}\n';
                } else {
                    fs += '   color = vec4(u_color.rgb * u_color.a * pow(tt,0.25),1.0);' + '   material.diffuse = color.rgb;\n' + '   material.alpha = color.a;\n' + '   return material;\n' + '}\n';
                }
            } else {
                fs += 'czm_material czm_getMaterial( czm_materialInput cmi )\n' + '{\n' + '    czm_material material = czm_getDefaultMaterial(cmi);\n' + '    vec2 st = cmi.st;\n' + '    float t = fract(czm_frameNumber/speed) * direction;\n' + '    vec2 st1 = vec2(fract(st.s - t),st.t);\n' + '    vec4 color = vec4(0.,0.,0.,0.);\n' + '    float alpha = 1.-st.t;\n' + '    float value = fract(st1.s/0.25);\n' + '    alpha *= sin(value * 3.1415926);\n';
                if (t) {
                    fs += ' color = vec4(u_color.rgb * u_color.a, alpha * 1.2);' + '   material.diffuse = color.rgb;\n' + '   material.alpha = color.a;\n' + '   return material;\n' + '}\n';
                } else {
                    fs += ' color = vec4(u_color.rgb * u_color.a,alpha);\n' + '   material.diffuse = color.rgb;\n' + '   material.alpha = color.a;\n' + '   return material;\n' + '}\n';
                }
            }
            return fs;
        }
    }, {
        key: "show",
        get: function get() {
            return this._show;
        },
        set: function set(value) {
            this._show = value;

            if (this.primitive) {
                this.primitive.show = value;
            }
        }
    }]);

    return ScrollWallGlow;
}();

/***/ }),
