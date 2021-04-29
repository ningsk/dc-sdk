/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FirstPersonRoam = exports.RoamType = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var scratchCurrentDirection = new Cesium.Cartesian3();
var scratchDeltaPosition = new Cesium.Cartesian3();
var scratchNextPosition = new Cesium.Cartesian3();
var scratchTerrainConsideredNextPosition = new Cesium.Cartesian3();
var scratchNextCartographic = new Cesium.Cartographic();

var RoamType = exports.RoamType = {
    DIRECTION_NONE: 0,
    DIRECTION_FORWARD: 1,
    DIRECTION_BACKWARD: 2,
    DIRECTION_LEFT: 3,
    DIRECTION_RIGHT: 4

    //第一人称贴地漫游 
};
var FirstPersonRoam = exports.FirstPersonRoam = function () {
    function FirstPersonRoam(options) {
        _classCallCheck(this, FirstPersonRoam);

        this.options = options;
        this.viewer = options.viewer;

        this._canvas = this.viewer.canvas;
        this._camera = this.viewer.camera;

        this.speed = Cesium.defaultValue(this.options.speed, 1.5); //速度
        this.rotateSpeed = Cesium.defaultValue(this.options.rotateSpeed, -5);
        this.height = Cesium.defaultValue(this.options.height, 10); //高度
        this.maxPitch = Cesium.defaultValue(this.options.maxPitch, 88); //最大pitch角度

        this.initEvent();
        this.enabled = Cesium.defaultValue(this.options.enabled, false);
    }
    //========== 对外属性 ==========  


    _createClass(FirstPersonRoam, [{
        key: "initEvent",


        //========== 方法 ==========  
        value: function initEvent() {
            this.handler = new Cesium.ScreenSpaceEventHandler(this._canvas);
            this.handler.setInputAction(this._onMouseLButtonClicked.bind(this), Cesium.ScreenSpaceEventType.LEFT_DOWN);
            this.handler.setInputAction(this._onMouseUp.bind(this), Cesium.ScreenSpaceEventType.LEFT_UP);
            this.handler.setInputAction(this._onMouseMove.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.handler.setInputAction(this._onMouseLButtonDoubleClicked.bind(this), Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

            var canvas = this.viewer.canvas;
            canvas.setAttribute("tabindex", "0");
            canvas.onclick = function () {
                canvas.focus();
            };
            canvas.addEventListener("keydown", this._onKeyDown.bind(this));
            canvas.addEventListener("keyup", this._onKeyUp.bind(this));

            this.viewer.clock.onTick.addEventListener(this._onClockTick, this);
        }
    }, {
        key: "_onMouseLButtonClicked",
        value: function _onMouseLButtonClicked(movement) {
            if (!this._enabled) return;
            this._looking = true;
            this._mousePosition = this._startMousePosition = Cesium.Cartesian3.clone(movement.position);
        }
    }, {
        key: "_onMouseLButtonDoubleClicked",
        value: function _onMouseLButtonDoubleClicked(movement) {
            if (!this._enabled) return;
            this._looking = true;
            this._mousePosition = this._startMousePosition = Cesium.Cartesian3.clone(movement.position);
        }
    }, {
        key: "_onMouseUp",
        value: function _onMouseUp(position) {
            if (!this._enabled) return;
            this._looking = false;
        }
    }, {
        key: "_onMouseMove",
        value: function _onMouseMove(movement) {
            if (!this._enabled) return;
            this._mousePosition = movement.endPosition;
        }
    }, {
        key: "_onKeyDown",
        value: function _onKeyDown(event) {
            if (!this._enabled) return;

            var keyCode = event.keyCode;
            this._direction = RoamType.DIRECTION_NONE;

            switch (keyCode) {
                case "W".charCodeAt(0):
                    this._direction = RoamType.DIRECTION_FORWARD;
                    return;
                case "S".charCodeAt(0):
                    this._direction = RoamType.DIRECTION_BACKWARD;
                    return;
                case "D".charCodeAt(0):
                    this._direction = RoamType.DIRECTION_RIGHT;
                    return;
                case "A".charCodeAt(0):
                    this._direction = RoamType.DIRECTION_LEFT;
                    return;
                default:
                    return;
            }
        }

        //开始自动漫游

    }, {
        key: "startMoveForward",
        value: function startMoveForward() {
            if (!this._enabled) this.start();
            this._direction = RoamType.DIRECTION_FORWARD;
        }
    }, {
        key: "stopMoveForward",
        value: function stopMoveForward() {
            this._direction = RoamType.DIRECTION_NONE;
        }
    }, {
        key: "_onKeyUp",
        value: function _onKeyUp() {
            this._direction = RoamType.DIRECTION_NONE;
        }
    }, {
        key: "_onClockTick",
        value: function _onClockTick(clock) {
            if (!this._enabled) return;

            var dt = clock._clockStep;

            if (this._looking) this._changeHeadingPitch(dt);

            if (this._direction === RoamType.DIRECTION_NONE) return;

            var distance = this.speed * dt;

            if (this._direction === RoamType.DIRECTION_FORWARD) Cesium.Cartesian3.multiplyByScalar(this._camera.direction, 1, scratchCurrentDirection);else if (this._direction === RoamType.DIRECTION_BACKWARD) Cesium.Cartesian3.multiplyByScalar(this._camera.direction, -1, scratchCurrentDirection);else if (this._direction === RoamType.DIRECTION_LEFT) Cesium.Cartesian3.multiplyByScalar(this._camera.right, -1, scratchCurrentDirection);else if (this._direction === RoamType.DIRECTION_RIGHT) Cesium.Cartesian3.multiplyByScalar(this._camera.right, 1, scratchCurrentDirection);

            Cesium.Cartesian3.multiplyByScalar(scratchCurrentDirection, distance, scratchDeltaPosition);

            var currentCameraPosition = this._camera.position;

            Cesium.Cartesian3.add(currentCameraPosition, scratchDeltaPosition, scratchNextPosition);

            // consider terrain height

            var globe = this.viewer.scene.globe;
            var ellipsoid = globe.ellipsoid;

            // get height for next update position
            ellipsoid.cartesianToCartographic(scratchNextPosition, scratchNextCartographic);

            var height = globe.getHeight(scratchNextCartographic);

            if (height === undefined) {
                // console.warn('height is undefined!');
                return;
            }

            if (height < 0) {
                // console.warn(`height is negative!`);
            }

            scratchNextCartographic.height = height + this.height;

            ellipsoid.cartographicToCartesian(scratchNextCartographic, scratchTerrainConsideredNextPosition);

            this._camera.setView({
                destination: scratchTerrainConsideredNextPosition,
                orientation: new Cesium.HeadingPitchRoll(this._camera.heading, this._camera.pitch, this._camera.roll),
                endTransform: Cesium.Matrix4.IDENTITY
            });
        }
    }, {
        key: "_changeHeadingPitch",
        value: function _changeHeadingPitch(dt) {
            var width = this._canvas.clientWidth;
            var height = this._canvas.clientHeight;

            // Coordinate (0.0, 0.0) will be where the mouse was clicked.
            var deltaX = (this._mousePosition.x - this._startMousePosition.x) / width;
            var deltaY = -(this._mousePosition.y - this._startMousePosition.y) / height;

            var currentHeadingInDegree = Cesium.Math.toDegrees(this._camera.heading);
            var deltaHeadingInDegree = deltaX * this.rotateSpeed;
            var newHeadingInDegree = currentHeadingInDegree + deltaHeadingInDegree;

            var currentPitchInDegree = Cesium.Math.toDegrees(this._camera.pitch);
            var deltaPitchInDegree = deltaY * this.rotateSpeed;
            var newPitchInDegree = currentPitchInDegree + deltaPitchInDegree;

            // console.log("rotationSpeed: " + this.rotateSpeed + " deltaY: " + deltaY + " deltaPitchInDegree" + deltaPitchInDegree);

            if (newPitchInDegree > this.maxPitch * 2 && newPitchInDegree < 360 - this.maxPitch) {
                newPitchInDegree = 360 - this.maxPitch;
            } else {
                if (newPitchInDegree > this.maxPitch && newPitchInDegree < 360 - this.maxPitch) {
                    newPitchInDegree = this.maxPitch;
                }
            }

            this._camera.setView({
                orientation: {
                    heading: Cesium.Math.toRadians(newHeadingInDegree),
                    pitch: Cesium.Math.toRadians(newPitchInDegree),
                    roll: this._camera.roll
                }
            });
        }
    }, {
        key: "enableScreenSpaceCameraController",
        value: function enableScreenSpaceCameraController(enabled) {
            var scene = this.viewer.scene;
            scene.screenSpaceCameraController.enableRotate = enabled;
            scene.screenSpaceCameraController.enableTranslate = enabled;
            scene.screenSpaceCameraController.enableZoom = enabled;
            scene.screenSpaceCameraController.enableTilt = enabled;
            scene.screenSpaceCameraController.enableLook = enabled;
        }
    }, {
        key: "start",
        value: function start() {
            this._enabled = true;
            this.enableScreenSpaceCameraController(false);

            var currentCameraPosition = this._camera.position;
            var cartographic = new Cesium.Cartographic();
            var globe = this.viewer.scene.globe;

            globe.ellipsoid.cartesianToCartographic(currentCameraPosition, cartographic);

            var height = globe.getHeight(cartographic);

            if (height === undefined) return false;

            if (height < 0) {
                // console.warn(`height is negative`);
            }

            cartographic.height = height + this.height;

            var newCameraPosition = new Cesium.Cartesian3();

            globe.ellipsoid.cartographicToCartesian(cartographic, newCameraPosition);

            var currentCameraHeading = this._camera.heading;
            this._heading = currentCameraHeading;
            this._camera.flyTo({
                destination: newCameraPosition,
                orientation: {
                    heading: currentCameraHeading,
                    pitch: Cesium.Math.toRadians(0),
                    roll: 0.0
                }
            });

            return true;
        }
    }, {
        key: "stop",
        value: function stop() {
            this._enabled = false;
            this.enableScreenSpaceCameraController(true);
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.stop();

            if (this.handler) {
                this.handler.destroy();
                delete this.handler;
            }

            var canvas = this.viewer.canvas;
            canvas.removeEventListener("keydown", this._onKeyDown, this);
            canvas.removeEventListener("keyup", this._onKeyUp, this);
            this.viewer.clock.onTick.removeEventListener(this._onClockTick, this);

            //删除所有绑定的数据
            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: "enable",
        get: function get() {
            return this._enabled;
        },
        set: function set(value) {
            this._enabled = value;

            if (this._enabled) {
                this.start();
            } else {
                this.stop();
            }
        }
    }]);

    return FirstPersonRoam;
}();

/***/ }),
