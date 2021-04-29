/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TilesEditor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//  移动位置、旋转 3dtiles
var TilesEditor = exports.TilesEditor = function (_MarsClass) {
    _inherits(TilesEditor, _MarsClass);

    //========== 构造方法 ========== 
    function TilesEditor(options) {
        _classCallCheck(this, TilesEditor);

        var _this = _possibleConstructorReturn(this, (TilesEditor.__proto__ || Object.getPrototypeOf(TilesEditor)).call(this, options));

        _this.options = options;

        _this.viewer = options.viewer;
        _this.scene = _this.viewer.scene;
        _this.position = options.position;

        _this.rotation_x = options.rotation_x || 0;
        _this.rotation_y = options.rotation_y || 0;
        _this.rotation_z = options.rotation_z || options.heading || 0;
        _this.range = options.range || 100;

        _this.dragging = false;
        _this.rotating = false;
        _this._enable = false;

        _this.billboards = _this.viewer.scene.primitives.add(new Cesium.BillboardCollection());
        _this.handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.canvas);

        //用来平移位置的指示器
        _this.movep = _this.billboards.add({
            position: _this.position,
            color: Cesium.Color.fromCssColorString("#FFFF00"),
            image: options.moveImg,
            show: false,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        });
        //用来旋转的指示器
        _this.rotatep = _this.billboards.add({
            position: _this.position ? _this.rotationPos() : null,
            color: Cesium.Color.fromCssColorString("#FFFF00"),
            image: options.rotateImg,
            show: false,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        });

        return _this;
    }

    //========== 对外属性 ==========  
    //启用状态


    _createClass(TilesEditor, [{
        key: "update",


        //========== 方法 ========== 

        value: function update(opts) {
            for (var key in opts) {
                this[key] = opts[key];
            }

            this.movep.position = this.position;
            this.rotatep.position = this.rotationPos();
        }

        //获取当前矩阵

    }, {
        key: "modelMatrix",
        value: function modelMatrix(position) {
            var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position || this.position);

            //旋转 
            var mx = Cesium.Matrix3.fromRotationX(this.rotation_x || 0);
            var my = Cesium.Matrix3.fromRotationY(this.rotation_y || 0);
            var mz = Cesium.Matrix3.fromRotationZ(this.rotation_z || this.heading || 0);
            var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
            var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
            var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);

            //旋转、平移矩阵相乘
            Cesium.Matrix4.multiply(mat, rotationX, mat);
            Cesium.Matrix4.multiply(mat, rotationY, mat);
            Cesium.Matrix4.multiply(mat, rotationZ, mat);

            //比例变换
            if (this.scale > 0 && this.scale != 1) Cesium.Matrix4.multiplyByUniformScale(mat, this.scale, mat);

            //垂直轴变换
            if (this.axis && this.axis != "") {
                var rightaxis;
                switch (this.axis.toUpperCase()) {
                    case "Y_UP_TO_Z_UP":
                        rightaxis = Cesium.Axis.Y_UP_TO_Z_UP;
                        break;
                    case "Z_UP_TO_Y_UP":
                        rightaxis = Cesium.Axis.Z_UP_TO_Y_UP;
                        break;
                    case "X_UP_TO_Z_UP":
                        rightaxis = Cesium.Axis.X_UP_TO_Z_UP;
                        break;
                    case "Z_UP_TO_X_UP":
                        rightaxis = Cesium.Axis.Z_UP_TO_X_UP;
                        break;
                    case "X_UP_TO_Y_UP":
                        rightaxis = Cesium.Axis.X_UP_TO_Y_UP;
                        break;
                    case "Y_UP_TO_X_UP":
                        rightaxis = Cesium.Axis.Y_UP_TO_X_UP;
                        break;
                }
                if (rightaxis) mat = Cesium.Matrix4.multiplyTransformation(mat, rightaxis, mat);
            }
            return mat;
        }

        //依据位置和朝向计算 旋转的位置

    }, {
        key: "rotationPos",
        value: function rotationPos() {
            var rotpos = new Cesium.Cartesian3(this.range, 0.0, 0.0);
            //依据位置和朝向计算 旋转矩阵  
            var mat = Cesium.Matrix4.getMatrix3(this.modelMatrix(), new Cesium.Matrix3());

            rotpos = Cesium.Matrix3.multiplyByVector(mat, rotpos, rotpos);
            rotpos = Cesium.Cartesian3.add(this.position, rotpos, rotpos);
            return rotpos;
        }
    }, {
        key: "pickTerrain",
        value: function pickTerrain(wndpos) {
            var ray = this.viewer.camera.getPickRay(wndpos);
            var pos = this.viewer.scene.globe.pick(ray, this.viewer.scene);
            return pos;
        }
    }, {
        key: "handler_onLeafDown",
        value: function handler_onLeafDown(event) {
            var pickedObjects = this.scene.drillPick(event.position, 2);

            for (var i = 0; i < pickedObjects.length; i++) {
                var pickedObject = pickedObjects[i];

                if (Cesium.defined(pickedObject) && pickedObject.primitive === this.movep) {
                    this.dragging = true;
                    this.scene.screenSpaceCameraController.enableRotate = false;
                    break;
                } else if (Cesium.defined(pickedObject) && pickedObject.primitive === this.rotatep) {
                    this.rotating = true;
                    this.scene.screenSpaceCameraController.enableRotate = false;
                    break;
                }
            }
        }
    }, {
        key: "handler_onMouseMove",
        value: function handler_onMouseMove(event) {
            var position = this.pickTerrain(event.endPosition);
            if (!position) return;

            if (this.dragging) {
                this.position = position;
                this.movep.position = this.position;
                this.rotatep.position = this.rotationPos();

                this.fire(_MarsClass2.eventType.change, {
                    position: this.position
                });
            } else if (this.rotating) {
                this.rotatep.position = position;
                this.range = Cesium.Cartesian3.distance(this.position, position);

                //获取该位置的默认矩阵 
                var mat = Cesium.Transforms.eastNorthUpToFixedFrame(this.position);
                mat = Cesium.Matrix4.getMatrix3(mat, new Cesium.Matrix3());

                var xaxis = Cesium.Matrix3.getColumn(mat, 0, new Cesium.Cartesian3());
                var yaxis = Cesium.Matrix3.getColumn(mat, 1, new Cesium.Cartesian3());
                var zaxis = Cesium.Matrix3.getColumn(mat, 2, new Cesium.Cartesian3());
                //计算该位置 和  position 的 角度值
                var dir = Cesium.Cartesian3.subtract(position, this.position, new Cesium.Cartesian3());
                //z crosss (dirx cross z) 得到在 xy平面的向量
                dir = Cesium.Cartesian3.cross(dir, zaxis, dir);
                dir = Cesium.Cartesian3.cross(zaxis, dir, dir);
                dir = Cesium.Cartesian3.normalize(dir, dir);

                this.rotation_z = Cesium.Cartesian3.angleBetween(xaxis, dir);
                var ay = Cesium.Cartesian3.angleBetween(yaxis, dir);
                if (ay > Math.PI * 0.5) {
                    this.rotation_z = 2 * Math.PI - this.rotation_z;
                }

                this.fire(_MarsClass2.eventType.change, {
                    rotation_z: this.rotation_z
                });
            }
        }
    }, {
        key: "handler_onLeftUp",
        value: function handler_onLeftUp(event) {
            if (this.dragging || this.rotating) {
                this.rotating = this.dragging = false;
                this.scene.screenSpaceCameraController.enableRotate = true;
                //如果没有这句话 会导致billboards的某些没有刷新，无法再次点击
                this.billboards._createVertexArray = true;
            }
        }
    }, {
        key: "remove",
        value: function remove() {
            //从场景中移除
            if (this.billboards) {
                this.scene.primitives.remove(this.billboards);
                this.billboards = undefined;
            }
            this.enable = false;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.remove();
            this.handler.destroy();

            //删除所有绑定的数据
            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: "enable",
        get: function get() {
            return this._enable;
        },
        set: function set(val) {
            this._enable = val;
            if (val) {
                var self = this;
                this.handler.setInputAction(function (p) {
                    self.handler_onLeafDown(p);
                }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
                this.handler.setInputAction(function (p) {
                    self.handler_onMouseMove(p);
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                this.handler.setInputAction(function (p) {
                    self.handler_onLeftUp(p);
                }, Cesium.ScreenSpaceEventType.LEFT_UP);

                this.rotatep.show = true;
                this.movep.show = true;
            } else {
                this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
                this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);

                this.rotatep.show = false;
                this.movep.show = false;
            }
        }
    }, {
        key: "matrix",
        get: function get() {
            return this.modelMatrix();
        }
    }]);

    return TilesEditor;
}(_MarsClass2.MarsClass);

//[静态属性]本类中支持的事件类型常量


TilesEditor.event = {
    change: _MarsClass2.eventType.change
};

/***/ }),
