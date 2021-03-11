
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rotate = undefined;
exports.move = move;
exports.getHeadingPitchRoll = getHeadingPitchRoll;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _matrix = __webpack_require__(17);

var _util = __webpack_require__(1);

var _point = __webpack_require__(2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//自旋转效果
//gltf模型
var rotate = exports.rotate = {
    isStart: false,
    viewer: null,
    start: function start(entity, opts) {
        this.entity = entity;
        this.viewer = opts.viewer || window.viewer;

        this.time = this.viewer.clock.currentTime.clone();

        this.hpr = (0, _matrix.getHeadingPitchRollByOrientation)(this.entity.position._value, this.entity.orientation && this.entity.orientation._value);
        this.angle = opts.step || 10; //步长

        this.viewer.clock.shouldAnimate = true;
        this.viewer.clock.onTick.addEventListener(this.clock_onTickHandler, this);
        this.isStart = true;
    },
    clock_onTickHandler: function clock_onTickHandler(e) {
        var delTime = Cesium.JulianDate.secondsDifference(this.viewer.clock.currentTime, this.time); // 当前已经过去的时间，单位 秒
        var heading = Cesium.Math.toRadians(delTime * this.angle) + this.hpr.heading;

        //角度控制  
        var hpr = new Cesium.HeadingPitchRoll(heading, this.hpr.pitch, this.hpr.roll);
        this.entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(this.entity.position._value, hpr);
    },
    stop: function stop() {
        if (!this.isStart) return;

        if (this.viewer) this.viewer.clock.onTick.removeEventListener(this.clock_onTickHandler, this);
        this.isStart = false;
    }
};

//移动模型
function move(entity, options) {
    var viewer = options.viewer || window.viewer;

    var property = new Cesium.SampledPositionProperty();
    var startTime = viewer.clock.currentTime; //飞行开始时间
    var stopTime; //飞行结束时间 

    var pointStart = (0, _point.getPositionValue)(entity.position, startTime);
    property.addSample(startTime, pointStart);

    var pointEnd = options.position;
    var time = options.time || 3; //速度 秒
    stopTime = Cesium.JulianDate.addSeconds(startTime, time, new Cesium.JulianDate());
    property.addSample(stopTime, pointEnd);

    //为了保证到结束时间了，一直停留在那，所以加个很远的时间
    stopTime = Cesium.JulianDate.addDays(stopTime, 365, new Cesium.JulianDate());
    property.addSample(stopTime, pointEnd);

    entity.position = property;

    viewer.clock.shouldAnimate = true;
    var _bak_multiplier = viewer.clock.multiplier;
    viewer.clock.multiplier = options.speed || 1; //飞行速度  
    // viewer.clock.currentTime = startTime.clone();

    setTimeout(function () {
        entity.position = pointEnd;

        viewer.clock.multiplier = _bak_multiplier;

        if (options.onEnd) options.onEnd();
    }, time * 1000);
}

//获取动态模型的当前hpr角度
function getHeadingPitchRoll(entity, time) {
    time = time || (0, _util.currentTime)();
    var position = Cesium.Property.getValueOrUndefined(entity.position, time, new Cesium.Cartesian3());
    var orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, new Cesium.Quaternion());
    var hpr = (0, _matrix.getHeadingPitchRollByOrientation)(position, orientation);
    return hpr;
}

/***/ }),
