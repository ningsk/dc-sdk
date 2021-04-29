
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DiffuseWallGlow = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _point = __webpack_require__(2);

var _polygon = __webpack_require__(13);

var _DiffuseWallGlowVS = __webpack_require__(218);

var _DiffuseWallGlowVS2 = _interopRequireDefault(_DiffuseWallGlowVS);

var _DiffuseWallGlowFS = __webpack_require__(219);

var _DiffuseWallGlowFS2 = _interopRequireDefault(_DiffuseWallGlowFS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//立体面(或圆)散射效果
var DiffuseWallGlow = exports.DiffuseWallGlow = function () {
    function DiffuseWallGlow(viewer, options) {
        _classCallCheck(this, DiffuseWallGlow);

        this.viewer = viewer;
        this.options = options;

        if (options.positions) {
            //多边形时
            this.center = (0, _point.centerOfMass)(options.positions);
            this.positions = options.positions;
        } else {
            //圆形时 
            this.center = options.position;
            this.positions = (0, _polygon.getEllipseOuterPositions)({
                position: options.position,
                radius: Cesium.defaultValue(options.radius, 100), //半径
                count: Cesium.defaultValue(options.count, 50) //共返回(count*4)个点
            });
        }

        this.translucent = Cesium.defaultValue(options.translucent, true);
        this.height = Cesium.defaultValue(options.height, 1000);
        this.direction = Cesium.defaultValue(options.direction, -1);
        this.color = Cesium.defaultValue(options.color, new Cesium.Color(0.5, 0.8, 1));
        this._show = Cesium.defaultValue(options.show, true);

        //缩放参数
        this.speed = Cesium.defaultValue(options.speed, 1000);
        this.mScale = Cesium.Matrix4.fromUniformScale(1.0);
        this.xyScale = 2.;
        // this.modelMatrix = Cesium.Matrix4.fromUniformScale(1.0); 

        this.draw();
    }

    //========== 对外属性 ==========  


    _createClass(DiffuseWallGlow, [{
        key: "draw",


        //========== 方法 ========== 
        value: function draw() {
            var cps = this.positions;
            var up = (0, _point.addPositionsHeight)(this.positions, this.height);

            //计算位置
            var pos = []; //坐标
            var sts = []; //纹理
            var indices = []; //索引
            var normal = []; //法向量
            for (var i = 0, count = cps.length; i < count; i++) {
                var ni = (i + 1) % count;
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
                indices.push.apply(indices, [i2, i3, ii, ii, i1, i2]);
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
                                u_color: this.color
                            },
                            source: this.getShader(this.translucent)
                        }
                    }),
                    vertexShaderSource: _DiffuseWallGlowVS2.default,
                    fragmentShaderSource: _DiffuseWallGlowFS2.default
                }),
                asynchronous: false
            });
            this.primitive.show = this._show;
            this.viewer.scene.primitives.add(this.primitive);

            this.viewer.scene.primitives.add(this);
        }
    }, {
        key: "update",
        value: function update(fs) {
            if (this.primitive && this._show) {
                var time = fs.frameNumber / this.speed;
                var tt = time - Math.floor(time);

                tt = tt < 0.01 ? 0.01 : tt;
                this.mScale[0] = this.mScale[5] = tt * this.xyScale;
                this.mScale[10] = 1.1 - tt;
                this.primitive.modelMatrix = scaleXYZ(this.center, this.mScale);
            }
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.viewer.scene.primitives.remove(this);
            if (!this.viewer) return;

            if (this.primitive) {
                this.viewer.scene.primitives.remove(this.primitive);
                delete this.primitive;
            }

            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: "getShader",


        //片源着色器
        value: function getShader(t) {
            var fs = 'uniform vec4 u_color;\n' + "    vec4 xh_getMaterial(vec2 st){" + '    float alpha = pow(1. - st.t, 4.);\n';
            if (t) {
                fs += '    vec4 color = vec4(u_color.rgb * u_color.a, alpha);';
            } else {
                fs += '    vec4 color = vec4(u_color.rgb * u_color.a, 1.);';
            }
            fs += '    return color;\n' + '}\n';
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

    return DiffuseWallGlow;
}();

function scaleXYZ(point, mScale) {
    var m = Cesium.Transforms.eastNorthUpToFixedFrame(point);
    var inverse = Cesium.Matrix4.inverse(m, new Cesium.Matrix4());

    var tt = Cesium.Matrix4.multiply(mScale, inverse, new Cesium.Matrix4());
    return Cesium.Matrix4.multiply(m, tt, new Cesium.Matrix4());
}

/***/ }),
