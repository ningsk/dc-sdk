/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Video2D = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

var _util = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ratateDirection = {
    'LEFT': 'Z',
    'RIGHT': '-Z',
    'TOP': 'Y',
    'BOTTOM': '-Y',
    'ALONG': 'X',
    'INVERSE': '-X'

    //视频融合（投射2D平面）
    //原理：根据相机位置，方向等参数，在相机前面生成一个平面，然后贴视频纹理
};
var Video2D = exports.Video2D = function (_MarsClass) {
    _inherits(Video2D, _MarsClass);

    //========== 构造方法 ========== 
    function Video2D(viewer, options, oldparam) {
        _classCallCheck(this, Video2D);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (Video2D.__proto__ || Object.getPrototypeOf(Video2D)).call(this, options));

        if (oldparam) {
            oldparam.dom = options;
            options = oldparam;
        }
        if (Cesium.defined(options.frustumShow)) options.showFrustum = options.frustumShow;
        _this.frustumShow = _this.showFrustum;
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码


        _this.viewer = viewer;
        _this.options = options;

        _this._play = true;
        if (options.aspectRatio) {
            _this._aspectRatio = options.aspectRatio;
        } else {
            _this._aspectRatio = _this.viewer.scene.context.drawingBufferWidth / _this.viewer.scene.context.drawingBufferHeight;
        }

        _this._fov = Cesium.defaultValue(options.fov, _this.viewer.scene.camera.frustum.fov);
        _this._dis = Cesium.defaultValue(options.dis, 10);
        _this._stRotation = Cesium.defaultValue(options.stRotation, 0);
        _this._rotateCam = Cesium.defaultValue(options.rotateCam, 0.05);
        _this._frustumShow = Cesium.defaultValue(options.showFrustum, true);

        _this._camera = options.camera;

        //传入了DOM
        if (options.dom) {
            if (options.dom instanceof Object && options.dom.length) {
                _this.dom = options.dom[0];
            } else {
                _this.dom = options.dom;
            }
        }

        //兼容直接传入单击回调方法，适合简单场景下使用。
        if (options.click) {
            _this.on(_MarsClass2.eventType.click, options.click);
        }

        _this.init();
        return _this;
    }

    //视频播放暂停


    _createClass(Video2D, [{
        key: 'init',
        value: function init() {
            this.recordObj = this.record();
            this.rectPos = this.computedPos(this.dis, this.fov, this.aspectRatio, this.recordObj);
            var sys = this.getOrientation(this.recordObj);
            var frustum = this.createFrustum(this.fov, this.aspectRatio, this.dis);
            var frustumGeo = this.createFrustumGeo(frustum, sys, this.recordObj.position);
            this.frustumPri = this.createFrustumPri(frustumGeo);
            this.addToScene();
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.viewer.scene.primitives.remove(this.frustumPri);
            this.viewer.entities.remove(this.entity);

            this.rectPos = this.computedPos(this.dis, this.fov, this.aspectRatio, this.recordObj);
            var sys = this.getOrientation(this.recordObj);
            var frustum = this.createFrustum(this.fov, this.aspectRatio, this.dis);
            var frustumGeo = this.createFrustumGeo(frustum, sys, this.recordObj.position);
            this.frustumPri = this.createFrustumPri(frustumGeo);
            this.addToScene();
        }
    }, {
        key: 'record',
        value: function record() {
            var obj = {};
            var camera = this._camera || this.viewer.scene.camera;
            obj.direction = Cesium.clone(camera.direction);
            obj.up = Cesium.clone(camera.up);
            obj.right = Cesium.clone(camera.right);
            obj.position = Cesium.clone(camera.position);
            return obj;
        }
    }, {
        key: 'addToScene',
        value: function addToScene() {
            this.viewer.scene.primitives.add(this.frustumPri);
            this.entity = this.viewer.entities.add({
                polygon: {
                    hierarchy: this.rectPos,
                    perPositionHeight: true,
                    material: this.dom || this.options.material,
                    stRotation: this.stRotation
                },
                data: this.options,
                eventTarget: this,
                popup: this.options.popup,
                tooltip: this.options.tooltip
            });
        }
    }, {
        key: 'computedPos',
        value: function computedPos(dis, fov, kgb, camera) {
            var vpos = camera.position;
            var vdir = camera.direction;
            var vright = camera.right;
            var vup = camera.up;

            var vray = new Cesium.Ray(vpos, vdir);
            var vmbpos = Cesium.Ray.getPoint(vray, dis, new Cesium.Cartesian3());
            var halfFov = fov / 2.0;
            var tanres = Math.tan(halfFov);
            var horiDis = dis * tanres;
            var vertDis = horiDis / kgb;
            var xbDis = Math.sqrt(horiDis * horiDis + vertDis * vertDis);

            var ysj = new Cesium.Cartesian3();
            var rightRay = new Cesium.Ray(vmbpos, vright);
            var rightPos = Cesium.Ray.getPoint(rightRay, horiDis, new Cesium.Cartesian3());
            var upRay = new Cesium.Ray(rightPos, vup);
            Cesium.Ray.getPoint(upRay, vertDis, ysj);

            var yxj = new Cesium.Cartesian3();
            var fvup = Cesium.Cartesian3.negate(vup, new Cesium.Cartesian3());
            var fupRay = new Cesium.Ray(rightPos, fvup);
            Cesium.Ray.getPoint(fupRay, vertDis, yxj);

            var zxj = new Cesium.Cartesian3();
            var djdir1 = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(vmbpos, ysj, new Cesium.Cartesian3()), new Cesium.Cartesian3());
            var djRay1 = new Cesium.Ray(vmbpos, djdir1);
            Cesium.Ray.getPoint(djRay1, xbDis, zxj);

            var zsj = new Cesium.Cartesian3();
            var djdir2 = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(vmbpos, yxj, new Cesium.Cartesian3()), new Cesium.Cartesian3());
            var djRay2 = new Cesium.Ray(vmbpos, djdir2);
            Cesium.Ray.getPoint(djRay2, xbDis, zsj);

            if (this.options.reverse) {
                return [zxj, zsj, ysj, yxj].reverse();
            }
            return [zxj, zsj, ysj, yxj];
        }
    }, {
        key: 'createFrustum',
        value: function createFrustum(fov, kgb, dis) {
            return new Cesium.PerspectiveFrustum({
                fov: fov,
                aspectRatio: kgb,
                near: 0.1,
                far: dis
            });
        }
    }, {
        key: 'getOrientation',
        value: function getOrientation(camera) {
            if (!camera) return;
            var direction = camera.direction;
            var up = camera.up;
            var right = camera.right;
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
    }, {
        key: 'createFrustumGeo',
        value: function createFrustumGeo(frustum, sys, origin) {
            return new Cesium.FrustumOutlineGeometry({
                frustum: frustum,
                orientation: sys,
                origin: origin
            });
        }
    }, {
        key: 'createFrustumPri',
        value: function createFrustumPri(geo) {
            return new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: geo,
                    attributes: {
                        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AZURE)
                    }
                }),
                appearance: new Cesium.PerInstanceColorAppearance({
                    flat: true
                }),
                show: this.showFrustum
            });
        }
        /**
         * 呈现投影相机的第一视角
         */

    }, {
        key: 'locate',
        value: function locate() {
            this.viewer.camera.direction = Cesium.clone(this.recordObj.direction);
            this.viewer.camera.right = Cesium.clone(this.recordObj.right);
            this.viewer.camera.up = Cesium.clone(this.recordObj.up);
            this.viewer.camera.position = Cesium.clone(this.recordObj.position);
        }

        //旋转相机

    }, {
        key: 'rotateCamera',
        value: function rotateCamera(axis, deg) {
            var rotateDegree = Cesium.defaultValue(deg, this._rotateCam);
            switch (axis) {
                case ratateDirection.LEFT:
                    break;
                case ratateDirection.RIGHT:
                    rotateDegree *= -1;
                    break;
                case ratateDirection.TOP:
                    break;
                case ratateDirection.BOTTOM:
                    rotateDegree *= -1;
                    break;
                case ratateDirection.ALONG:
                    break;
                case ratateDirection.INVERSE:
                    rotateDegree *= -1;
                    break;
            }
            var newObj = this._computedNewViewDir(axis, rotateDegree);
            this.recordObj.direction = newObj.direction;
            this.recordObj.up = newObj.up;
            this.recordObj.right = newObj.right;
            this.reset();
        }

        //计算新视点

    }, {
        key: '_computedNewViewDir',
        value: function _computedNewViewDir(axis, deg) {
            deg = Cesium.Math.toRadians(deg);
            var camera = this.recordObj;
            var oldDir = Cesium.clone(camera.direction);
            var oldRight = Cesium.clone(camera.right);
            var oldTop = Cesium.clone(camera.up);
            var mat3 = new Cesium.Matrix3();

            switch (axis) {
                case ratateDirection.LEFT:
                    Cesium.Matrix3.fromRotationZ(deg, mat3);
                    break;
                case ratateDirection.RIGHT:
                    Cesium.Matrix3.fromRotationZ(deg, mat3);
                    break;
                case ratateDirection.TOP:
                    Cesium.Matrix3.fromRotationY(deg, mat3);
                    break;
                case ratateDirection.BOTTOM:
                    Cesium.Matrix3.fromRotationY(deg, mat3);
                    break;
                case ratateDirection.ALONG:
                    Cesium.Matrix3.fromRotationX(deg, mat3);
                    break;
                case ratateDirection.INVERSE:
                    Cesium.Matrix3.fromRotationX(deg, mat3);
                    break;
            }
            var localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(camera.position);
            // var hpr = new Cesium.HeadingPitchRoll(viewer.camera.heading,viewer.camera.pitch,viewer.camera.roll);
            // localToWorld_Matrix = Cesium.Transforms.headingPitchRollToFixedFrame(viewer.camera.position,hpr,Cesium.Ellipsoid.WGS84,Cesium.Transforms.eastNorthUpToFixedFrame);
            var worldToLocal_Matrix = Cesium.Matrix4.inverse(localToWorld_Matrix, new Cesium.Matrix4());

            var localDir = Cesium.Matrix4.multiplyByPointAsVector(worldToLocal_Matrix, oldDir, new Cesium.Cartesian3());
            var localNewDir = Cesium.Matrix3.multiplyByVector(mat3, localDir, new Cesium.Cartesian3());
            var newDir = Cesium.Matrix4.multiplyByPointAsVector(localToWorld_Matrix, localNewDir, new Cesium.Cartesian3());

            var localRight = Cesium.Matrix4.multiplyByPointAsVector(worldToLocal_Matrix, oldRight, new Cesium.Cartesian3());
            var localNewRight = Cesium.Matrix3.multiplyByVector(mat3, localRight, new Cesium.Cartesian3());
            var newRight = Cesium.Matrix4.multiplyByPointAsVector(localToWorld_Matrix, localNewRight, new Cesium.Cartesian3());

            var localTop = Cesium.Matrix4.multiplyByPointAsVector(worldToLocal_Matrix, oldTop, new Cesium.Cartesian3());
            var localNewTop = Cesium.Matrix3.multiplyByVector(mat3, localTop, new Cesium.Cartesian3());
            var newTop = Cesium.Matrix4.multiplyByPointAsVector(localToWorld_Matrix, localNewTop, new Cesium.Cartesian3());
            return {
                direction: newDir,
                right: newRight,
                up: newTop
            };
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.viewer.scene.primitives.remove(this.frustumPri);
            this.viewer.entities.remove(this.entity);

            //删除所有绑定的数据
            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: 'play',
        get: function get() {
            return this._play;
        },
        set: function set(val) {
            this._play = val;
            if (!this.dom) return;

            if (this._play) {
                this.dom.play();
            } else {
                this.dom.pause();
            }
        }
        //宽高比

    }, {
        key: 'aspectRatio',
        get: function get() {
            return this._aspectRatio;
        },
        set: function set(val) {
            val = Number(val);
            if (!val || val < 0) return;
            if (val < 1.0) val = 1.0;
            this._aspectRatio = val;
            this.reset();
        }
        //张角

    }, {
        key: 'fov',
        get: function get() {
            return this._fov;
        },
        set: function set(val) {
            val = Number(val);
            if (!val || val < 0) return;
            this._fov = val;
            this.reset();
        }
        //投射距离

    }, {
        key: 'dis',
        get: function get() {
            return this._dis;
        },
        set: function set(val) {
            val = Number(val);
            if (!val || val < 0) return;
            this._dis = val;
            this.reset();
        }

        //UV旋转

    }, {
        key: 'stRotation',
        get: function get() {
            return this._stRotation;
        },
        set: function set(val) {
            val = Number(val);
            if (!val || val < 0) return;
            this._stRotation = val;
            this.entity.polygon.stRotation = val;
        }

        //视椎体显示

    }, {
        key: 'showFrustum',
        get: function get() {
            return this._frustumShow;
        },
        set: function set(val) {
            this._frustumShow = val;
            this.frustumPri.show = val;
        }

        /** 所有相机的参数  */

    }, {
        key: 'params',
        get: function get() {
            var viewJson = {
                fov: this.fov,
                dis: this.dis,
                stRotation: this.stRotation,
                showFrustum: this.showFrustum,
                aspectRatio: this.aspectRatio,
                camera: {
                    position: this.recordObj.position,
                    direction: this.recordObj.direction,
                    up: this.recordObj.up,
                    right: this.recordObj.right
                }
            };
            return viewJson;
        }
    }]);

    return Video2D;
}(_MarsClass2.MarsClass);

//[静态属性]本类中支持的事件类型常量


Video2D.event = {
    click: _MarsClass2.eventType.click,
    mouseOver: _MarsClass2.eventType.mouseOver,
    mouseOut: _MarsClass2.eventType.mouseOut
};

/***/ })
/******/ ]);
});