/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FlatImage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _FlatImageMaterial = __webpack_require__(211);

var _FlatImageMaterial2 = _interopRequireDefault(_FlatImageMaterial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//平放的图片（图片随地图缩放） 
var FlatImage = exports.FlatImage = function () {
    //========== 构造方法 ========== 
    function FlatImage(viewer, options) {
        _classCallCheck(this, FlatImage);

        this.viewer = viewer;
        this.options = options || {};

        this.size = Cesium.defaultValue(options.size, 50);
        this._show = Cesium.defaultValue(options.show, true);

        //
        var primitiveCollection = new Cesium.PrimitiveCollection();
        primitiveCollection.show = this._show;
        this.viewer.scene.primitives.add(primitiveCollection);

        this.primitiveCollection = primitiveCollection;

        if (options.data) this.init(options.data);
    }

    //========== 对外属性 ==========  
    //数据


    _createClass(FlatImage, [{
        key: "init",


        //========== 方法 ========== 
        value: function init(arrdata) {
            this.clear();

            for (var i = 0, len = arrdata.length; i < len; i++) {
                var item = arrdata[i];
                var primitive = this.createPrimitive(item, item.size || this.size);
                this.primitiveCollection.add(primitive);
            }
        }
    }, {
        key: "createPrimitive",
        value: function createPrimitive(item, size) {
            var mat4 = Cesium.Transforms.eastNorthUpToFixedFrame(item.position);

            var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(item.angle));
            var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
            Cesium.Matrix4.multiply(mat4, rotationZ, mat4);

            var vertices = new Float64Array([//顶点坐标
            -size, -size, 0, size, -size, 0, size, size, 0, -size, size, 0]);
            var st = new Float32Array([//纹理坐标
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]);
            //let positions=new Float64Array;
            var attributes = new Cesium.GeometryAttributes();
            var indices = new Uint16Array(6); //顶点索引
            indices[0] = 0;
            indices[1] = 1;
            indices[2] = 2;
            indices[3] = 0;
            indices[4] = 2;
            indices[5] = 3;
            attributes.position = new Cesium.GeometryAttribute({ //顶点attributes
                componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: vertices
            });
            attributes.st = new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 2,
                values: st
            });
            //自定义几何图形时，使用图片纹理，需要自己设置st,normal属性
            var rect = new Cesium.Geometry({
                attributes: attributes,
                primitiveType: Cesium.PrimitiveType.TRIANGLES,
                indices: indices,
                boundingSphere: Cesium.BoundingSphere.fromVertices(vertices)
            });
            Cesium.GeometryPipeline.computeNormal(rect);
            var instance = new Cesium.GeometryInstance({
                geometry: rect,
                modelMatrix: mat4,
                id: 'flatImage'
            });

            var primitive = new Cesium.Primitive({
                geometryInstances: [instance],
                appearance: new Cesium.MaterialAppearance({
                    flat: true,
                    material: new Cesium.Material({
                        fabric: {
                            uniforms: {
                                image: item.image,
                                speed: 0.0
                            },
                            source: _FlatImageMaterial2.default
                        }
                    }),
                    materialSupport: Cesium.MaterialAppearance.MaterialSupport.TEXTURED
                }),
                compressVertices: false,
                asynchronous: false
            });

            primitive.tooltip = item.tooltip;
            primitive.popup = item.popup;

            // let speed = 0.0;
            // const setIntervalID = setInterval(function () {//如果使用scene.preUpdate等帧刷新，则图片不显示
            //     if (speed <= 1.0) {
            //         speed += 0.05;
            //     } else {
            //         clearInterval(setIntervalID);
            //         speed = 0.0
            //     }
            //     primitive.appearance.material.uniforms.speed = speed;
            // }, 500)

            return primitive;
        }
    }, {
        key: "clear",
        value: function clear() {
            this.primitiveCollection.removeAll();
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.clear();
            this.viewer.scene.primitives.remove(this.primitiveCollection);

            //删除所有绑定的数据
            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: "data",
        get: function get() {
            return this.options.data;
        },
        set: function set(val) {
            this.options.data = val;
            this.init(val);
        }

        //数据

    }, {
        key: "show",
        get: function get() {
            return this._show;
        },
        set: function set(val) {
            this._show = val;
            if (this.primitiveCollection) this.primitiveCollection.show = this._show;
        }
    }]);

    return FlatImage;
}();

/***/ }),
