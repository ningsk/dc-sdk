/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FlyLine = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

var _util = __webpack_require__(1);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

var _point = __webpack_require__(2);

var _pointconvert = __webpack_require__(4);

var _polyline = __webpack_require__(22);

var _matrix = __webpack_require__(17);

var _index = __webpack_require__(20);

var drawAttr = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var matrix4 = new Cesium.Matrix4();

var matrix3Scratch = new Cesium.Matrix3();
var positionScratch = new Cesium.Cartesian3();
var orientationScratch = new Cesium.Quaternion();

//参数默认值
var defVal = {
    "model": { "show": false, "scale": 1, "minimumPixelSize": 50 },
    "label": { "show": false, "color": "#ffffff", "opacity": 1, "font_family": "楷体", "font_size": 20, "border": true, "border_color": "#000000", "border_width": 3, "background": false, "hasPixelOffset": true, "pixelOffsetX": 30, "pixelOffsetY": -30, "scaleByDistance": true, "scaleByDistance_far": 10000000, "scaleByDistance_farValue": 0.4, "scaleByDistance_near": 5000, "scaleByDistance_nearValue": 1 },
    "path": { "show": false, "lineType": "solid", "color": "#3388ff", "opacity": 0.5, "width": 1, "outline": false, "outlineColor": "#ffffff", "outlineWidth": 2 },
    "camera": { "type": "", "followedX": 50, "followedZ": 10 },
    "showGroundHeight": false
};

//飞行路线管理类

var FlyLine = exports.FlyLine = function (_MarsClass) {
    _inherits(FlyLine, _MarsClass);

    //========== 构造方法 ========== 
    function FlyLine(viewer, options) {
        _classCallCheck(this, FlyLine);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (FlyLine.__proto__ || Object.getPrototypeOf(FlyLine)).call(this, options));

        if (options.onStep) {
            _this.on(_MarsClass2.eventType.endItem, function (e) {
                options.onStep(e.index, e.counts);
            });
        }
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

        _this.viewer = viewer;

        _this.id = options.id || 0;
        _this.name = options.name || "";
        _this.points = options.points; //坐标
        _this.positions = (0, _pointconvert.lonlats2cartesians)(options.points);
        _this.speeds = options.speed;

        //未传入时的属性取默认值的
        for (var key in defVal) {
            var val = defVal[key];

            if (options.hasOwnProperty(key) && _typeof(options[key]) === 'object') {
                for (var key2 in val) {
                    if (!options[key].hasOwnProperty(key2)) options[key][key2] = val[key2];
                }
            } else {
                if (!Cesium.defined(options[key])) options[key] = val;
            }
        }
        _this.options = options; //属性

        //兼容v1版本shadow
        if ((0, _util.isObject)(_this.options.shadow) && _this.options.shadow.show) {
            _this.options.shadow = [_this.options.shadow];
        }

        _this._popup = options.popup;
        _this.offsetHeight = Cesium.defaultValue(_this.options.offsetHeight, 0);

        //参考系
        _this._fixedFrameTransform = Cesium.defaultValue(_this.options.fixedFrameTransform, Cesium.Transforms.eastNorthUpToFixedFrame);

        _this._isStart = false;

        _this._createLine();
        return _this;
    }

    //========== 对外属性 ==========  
    //提示框


    _createClass(FlyLine, [{
        key: "_createLine",


        //========== 方法 ==========  
        value: function _createLine() {
            var startTime; //飞行开始时间 
            if (this.options.startTime) startTime = Cesium.JulianDate.fromDate(new Date(this.options.startTime));else startTime = this.viewer.clock.currentTime;

            //=====================计算飞行时间及坐标====================
            var property = new Cesium.SampledPositionProperty();
            var stopTime; //飞行结束时间 

            var lonlats = this.points;
            if (lonlats.length < 2) {
                marslog.warn('路线无坐标数据，无法漫游！');
                return;
            }

            var speeds = this.speeds;
            var isSpeedArray = !(0, _util.isNumber)(speeds);
            if (lonlats.length == 2) {
                //2个点时，需要插值，否则穿地  
                var centerPt = [(lonlats[0][0] + lonlats[1][0]) / 2, (lonlats[0][1] + lonlats[1][1]) / 2, lonlats[0][2]];
                lonlats.splice(1, 0, centerPt);
                if (speeds && isSpeedArray) speeds.splice(1, 0, speeds[0]);
            }
            var defSpeed = 100; //无速度值时的 默认速度  单位：千米/小时
            var speedsNew = [];

            var alltimes = 0; //总时长,单位：秒
            var alllen = 0; //总长度,单位：米
            var stepLen = {}; //每一步的距离长度
            var stepTime = {}; //每一步的时长

            var lastPoint;
            var arrLinePoint = [];
            for (var i = 0, length = lonlats.length; i < length; i++) {
                var lonlat = lonlats[i];
                var item = Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1], (lonlat[2] || 0) + this.offsetHeight);
                item.lonlat = lonlat;

                if (i == 0) {
                    //起点
                    var sTime = Cesium.JulianDate.addSeconds(startTime, alltimes, new Cesium.JulianDate());
                    item.time = sTime;
                    item.second = alltimes;
                    property.addSample(sTime, item);
                } else {
                    var speed = isSpeedArray ? speeds ? speeds[i - 1] : defSpeed : speeds || defSpeed;
                    speedsNew.push(speed);

                    speed = speed / 3.6; //速度：km/h换算m/s 

                    var len = Cesium.Cartesian3.distance(item, lastPoint);
                    var stime = len / speed;
                    if (stime < 0.01) stime = 0.01; //限定为最小值，防止速度值设置太大时，为0的错误

                    alltimes += stime;
                    alllen += len;

                    var sTime = Cesium.JulianDate.addSeconds(startTime, alltimes, new Cesium.JulianDate());
                    item.time = sTime;
                    item.second = alltimes;
                    property.addSample(sTime, item);

                    if (this.options.pauseTime) {
                        if (typeof this.options.pauseTime === 'function') {
                            alltimes += this.options.pauseTime(i, item);
                        } else {
                            alltimes += this.options.pauseTime;
                        }
                        var sTime = Cesium.JulianDate.addSeconds(startTime, alltimes, new Cesium.JulianDate());
                        property.addSample(sTime, (0, _matrix.getOnLinePointByLen)(lastPoint, item, 0.01, true));
                    }
                }
                lastPoint = item;
                arrLinePoint.push(item);

                stepLen[i] = alllen;
                stepTime[i] = alltimes;
            }
            this.speeds = speedsNew;

            this.arrLinePoint = arrLinePoint;
            stopTime = Cesium.JulianDate.addSeconds(startTime, alltimes, new Cesium.JulianDate());

            this.alltimes = alltimes;
            this.alllen = alllen;
            this.stepLen = stepLen;
            this.stepTime = stepTime;

            this.startTime = startTime;
            this.stopTime = stopTime;
            this.property = property;

            //插值，使折线边平滑 ,并且长距离下不穿地
            if (this.options.interpolation) {
                this.property.setInterpolationOptions({
                    interpolationDegree: this.options.interpolationDegree || 2,
                    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation //HermitePolynomialApproximation
                });
            }
        }
    }, {
        key: "_createEntity",
        value: function _createEntity() {
            var that = this;
            if (this.entity) {
                this.viewer.entities.remove(this.entity);
                delete this.entity;
            }

            var velocityOrientation = new Cesium.VelocityOrientationProperty(this.property); //基于移动位置自动计算方位
            this.velocityOrientation = velocityOrientation;

            var entityAttr = {
                name: this.name,
                // availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                //     start: this.startTime,
                //     stop: this.stopTime
                // })]),
                position: this.property,
                // position: new Cesium.CallbackProperty(function(time) {
                //     return that.position
                //   }, false),
                orientation: velocityOrientation,
                point: { //必须有对象，否则viewer.trackedEntity无法跟随(无model时使用)
                    show: !(this.options.model && this.options.model.show),
                    color: Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.01),
                    pixelSize: 1
                }
            };

            if (this.options.label && this.options.label.show) {
                this.options.label.text = this.name;
                entityAttr.label = drawAttr.label.style2Entity(this.options.label);
            }
            if (this.options.billboard && this.options.billboard.show) {
                entityAttr.billboard = drawAttr.billboard.style2Entity(this.options.billboard);
            }
            if (this.options.point && this.options.point.show) {
                entityAttr.point = drawAttr.point.style2Entity(this.options.point);
            }
            if (this.options.model && this.options.model.show) {
                entityAttr.model = drawAttr.model.style2Entity(this.options.model);
            }
            if (this.options.path && this.options.path.show) {
                var pathAttr = drawAttr.polyline.style2Entity(this.options.path);
                if (!pathAttr.isAll) {
                    pathAttr.leadTime = 0; //只显示飞过的路线 
                    pathAttr.trailTime = this.alltimes * 10;
                }
                entityAttr.path = pathAttr;
            }
            if (this.options.circle && this.options.circle.show) {
                entityAttr.ellipse = drawAttr.circle.style2Entity(this.options.circle);
            }

            if (this._popup) entityAttr.popup = this._popup;

            this.entity = this.viewer.entities.add(entityAttr);
        }

        //计算贴地线

    }, {
        key: "clampToGround",
        value: function clampToGround(onEnd, opts) {
            opts = opts || {};

            //贴地线
            var lonlats = this.points;
            var speeds = this.speeds;
            var lonlatsNew = [];
            var speedsNew = [];

            //剖面的数据
            var alllen = 0;
            var arrLength = [];
            var arrHbgd = [];
            var arrFxgd = [];
            var arrPoint = [];

            var that = this;
            (0, _polyline.computeStepSurfaceLine)({
                viewer: this.viewer,
                positions: this.positions,
                has3dtiles: opts.has3dtiles,
                splitNum: opts.splitNum,
                offset: opts.offset,
                //计算每个分段后的回调方法
                endItem: function endItem(raisedPositions, noHeight, index) {
                    var speed = speeds[index];

                    if (noHeight) {
                        lonlatsNew.push(lonlats[index]);
                        speedsNew.push(speed);
                    } else {
                        for (var i = 0; i < raisedPositions.length; i++) {
                            var position = raisedPositions[i];
                            var carto = Cesium.Cartographic.fromCartesian(position);

                            lonlatsNew.push([Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude), carto.height]);
                            speedsNew.push(speed);
                        }
                    }

                    //剖面的数据 
                    var h1 = lonlats[index][2] || 0;
                    var h2 = lonlats[index + 1][2] || 0;
                    var hstep = (h2 - h1) / raisedPositions.length;

                    for (var i = 0; i < raisedPositions.length; i++) {
                        //已飞行长度
                        if (i != 0) {
                            alllen += Cesium.Cartesian3.distance(raisedPositions[i], raisedPositions[i - 1]);
                        }
                        arrLength.push(Number(alllen.toFixed(1)));

                        //坐标
                        var point = (0, _point.formatPosition)(raisedPositions[i]);
                        arrPoint.push(point);

                        //海拔高度
                        var hbgd = noHeight ? 0 : point.z;
                        arrHbgd.push(hbgd);

                        //飞行高度
                        var fxgd = Number((h1 + hstep * i).toFixed(1));
                        arrFxgd.push(fxgd);
                    }
                },
                //计算全部完成的回调方法
                end: function end() {
                    that.points = lonlatsNew;
                    that.speeds = speedsNew;

                    //剖面的数据(记录下，提高效率，避免多次计算)
                    that.terrainHeight = {
                        arrLength: arrLength,
                        arrFxgd: arrFxgd,
                        arrHbgd: arrHbgd,
                        arrPoint: arrPoint
                    };

                    that._createLine();

                    if (onEnd) {
                        onEnd({
                            lonlats: lonlatsNew,
                            speeds: speedsNew
                        });
                    }
                }
            });
        }
    }, {
        key: "updateConfig",
        value: function updateConfig(params) {
            return this.updateStyle(params);
        }
    }, {
        key: "updateStyle",
        value: function updateStyle(params) {
            for (var i in params) {
                if (_typeof(params[i]) === 'object' && this.options[i]) {
                    for (var key2 in params[i]) {
                        this.options[i][key2] = params[i][key2];
                    }
                } else {
                    this.options[i] = params[i];
                }
            }
        }
    }, {
        key: "updateAngle",
        value: function updateAngle(isAuto, opts) {
            if (isAuto) {
                this.entity.orientation = this.velocityOrientation; //基于移动位置自动计算方位

                this._heading = null;
                this._pitch = null;
                this._roll = null;
            } else {
                opts = opts || {};

                var position = this.position; //当前点 
                var _orientation = this.orientation; //获取当前角度  
                if (!position || !_orientation) return null;

                var autoHpr = (0, _matrix.getHeadingPitchRollByOrientation)(position, _orientation, this.viewer.scene.globe.ellipsoid, this._fixedFrameTransform);

                //重新赋值新角度
                var heading = autoHpr.heading;
                var pitch = Cesium.Math.toRadians(Number(opts.pitch || 0.0));
                var roll = Cesium.Math.toRadians(Number(opts.roll || 0.0));

                this._heading = heading;
                this._pitch = pitch;
                this._roll = roll;

                this.entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(heading, pitch, roll), this.viewer.scene.globe.ellipsoid, this._fixedFrameTransform);
            }
        }
    }, {
        key: "start",
        value: function start(opts) {
            if (!Cesium.defined(this.arrLinePoint) || this.arrLinePoint.length == 0) {
                marslog.warn("没有坐标数据，飞行路线启动失败");
                return;
            }

            if (this._isStart) this.stop();
            this._isStart = true;

            this._createEntity();

            //=====================绑定clock timeline====================  
            if (Cesium.defined(this.options.multiplier)) {
                //飞行速度 
                this._bak_multiplier = this.viewer.clock.multiplier;
                this.viewer.clock.multiplier = this.options.multiplier;
            }

            this.viewer.clock.shouldAnimate = true;
            this.viewer.clock.currentTime = this.startTime.clone();

            if (this.options.clockRange || this.options.clockLoop) {
                //循环播放
                this._bak_clockRange = this.viewer.clock.clockRange;
                this._bak_startTime = this.viewer.clock.startTime;
                this._bak_stopTime = this.viewer.clock.stopTime;

                //Cesium.ClockRange.CLAMPED 到达终点后停止，Cesium.ClockRange.LOOP_STOP 到达终止时间后 循环从头播放    
                this.viewer.clock.clockRange = Cesium.defaultValue(this.options.clockRange, Cesium.ClockRange.LOOP_STOP);
                this.viewer.clock.startTime = this.startTime.clone();
                this.viewer.clock.stopTime = this.stopTime.clone();
            }

            if (this.viewer.timeline) this.viewer.timeline.zoomTo(this.startTime, this.stopTime);

            //加投影
            if (this.options.shadow && this.options.shadow.length > 0) {
                this.addArrShading();
            }

            this._flyok_point_index = 0; //优化查询效率，飞行过的点id      
            this.fire(_MarsClass2.eventType.endItem, {
                index: this._flyok_point_index,
                counts: this.arrLinePoint.length
            });
            this.fire(_MarsClass2.eventType.start);
            this.viewer.scene.preRender.addEventListener(this.preRender_eventHandler, this);
        }

        //实时监控事件

    }, {
        key: "preRender_eventHandler",
        value: function preRender_eventHandler(e) {
            if (!this._isStart || !this.viewer.clock.shouldAnimate || this.entity == null) return;

            if (Cesium.JulianDate.greaterThanOrEquals(this.viewer.clock.currentTime, this.stopTime)) {
                this._flyok_point_index = this.arrLinePoint.length - 1;

                //Cesium.ClockRange.CLAMPED 到达终点后停止，Cesium.ClockRange.LOOP_STOP 到达终止时间后 循环从头播放    

                if (!this._onStepTempBS) {
                    this.fire(_MarsClass2.eventType.endItem, {
                        index: this._flyok_point_index,
                        counts: this.arrLinePoint.length
                    });
                    this.fire(_MarsClass2.eventType.end);
                    this._onStepTempBS = true; //为了标识只回调一次
                }

                if (this.options.autoStop || this.viewer.clock.clockRange == Cesium.ClockRange.UNBOUNDED) this.stop();

                return;
            }

            //当前点
            var _position = this.position;
            if (Cesium.defined(_position)) {
                switch (this.options.camera.type) {//视角处理
                    default:
                        //无 
                        if (this.viewer.trackedEntity != undefined) {
                            this.viewer.trackedEntity = undefined;
                            this.flyTo(this.options.camera);
                        }
                        break;
                    case "gs":
                        //跟随视角
                        if (this.viewer.trackedEntity != this.entity) {
                            this.viewer.trackedEntity = this.entity;
                            this.flyTo(this.options.camera);
                        }
                        break;
                    case "dy":
                        //锁定第一视角
                        if (this.viewer.trackedEntity != this.entity) this.viewer.trackedEntity = this.entity;

                        var matrix = this.getModelMatrix();

                        var transformX = this.options.camera.followedX; //距离运动点的距离（后方） 
                        var transformZ = this.options.camera.followedZ; //距离运动点的高度（上方）
                        this.viewer.scene.camera.lookAtTransform(matrix, new Cesium.Cartesian3(-transformX, 0, transformZ));

                        break;
                    case "sd":
                        //锁定上帝视角 
                        if (this.viewer.trackedEntity != this.entity) this.viewer.trackedEntity = this.entity;

                        var matrix = this.getModelMatrix();

                        var transformZ = this.options.camera.followedZ; //距离运动点的高度（上方）
                        this.viewer.scene.camera.lookAtTransform(matrix, new Cesium.Cartesian3(-1, 0, transformZ));
                        break;
                }

                //实时监控
                this.realTime(_position);
            }
        }
        //获取已飞行完成的点的位置
        //JulianDate.compare(left, right), 如果left小于right，则为负值；如果left大于right，则为正值；如果left和right相等，则为零。

    }, {
        key: "getCurrIndex",
        value: function getCurrIndex() {
            var lineLength = this.arrLinePoint.length - 1;
            if (Cesium.JulianDate.compare(this.viewer.clock.currentTime, this.arrLinePoint[0].time) <= 0) {
                this._flyok_point_index = 0;
            }
            if (this._flyok_point_index < 0 || this._flyok_point_index >= lineLength) this._flyok_point_index = 0;

            for (var i = this._flyok_point_index; i <= lineLength; i++) {
                var item = this.arrLinePoint[i];
                if (Cesium.JulianDate.compare(this.viewer.clock.currentTime, item.time) <= 0) {
                    return i - 1;
                }
            }
            for (var i = 0; i <= lineLength; i++) {
                var item = this.arrLinePoint[i];
                if (Cesium.JulianDate.compare(this.viewer.clock.currentTime, item.time) <= 0) {
                    return i - 1;
                }
            }
            return lineLength;
        }
    }, {
        key: "realTime",
        value: function realTime(position) {
            var time = Cesium.JulianDate.secondsDifference(this.viewer.clock.currentTime, this.startTime); //已飞行时间
            var point = (0, _point.formatPosition)(position);

            var currIndex = this.getCurrIndex();

            var lineLength = this.arrLinePoint.length;
            if (currIndex < 0) currIndex = 0;
            if (currIndex >= lineLength) currIndex = lineLength - 1;

            var thislen = this.stepLen[currIndex];

            var lastPosition = this.arrLinePoint[currIndex];
            if (Cesium.defined(lastPosition)) thislen += Cesium.Cartesian3.distance(position, lastPosition);

            if (thislen >= this.alllen) {
                currIndex = lineLength - 1;
                thislen = this.alllen;
            }

            if (currIndex != this._flyok_point_index) {
                // marslog.log('已飞行过点：' + currIndex); 
                this.fire(_MarsClass2.eventType.endItem, {
                    index: currIndex,
                    counts: lineLength
                });
            }
            this._flyok_point_index = currIndex;

            this.timeinfo = {
                time: time, //已飞行时间
                len: thislen, //已飞行距离
                x: point.x,
                y: point.y,
                z: point.z
            };

            if (this.options.shadow && this.options.shadow.length > 0) {
                //投影 
                this.updateArrShading(position);
            }

            //求概略的 地面海拔 和 离地高度
            var carto = Cesium.Cartographic.fromCartesian(position);
            var heightTerrain = this.viewer.scene.globe.getHeight(carto); //地形高度
            if (heightTerrain != null && heightTerrain > 0) {
                this.timeinfo.hbgd = heightTerrain;
                this.timeinfo.ldgd = point.z - heightTerrain;
            }

            //求准确的 地面海拔 和 离地高度 (没有此需求时可以关闭，提高效率)
            if (this.options.showGroundHeight) {
                var that = this;
                (0, _polyline.computeSurfaceLine)({
                    viewer: that.viewer,
                    positions: [position, position],
                    callback: function callback(raisedPositions, noHeight) {
                        if (raisedPositions == null || raisedPositions.length == 0 || noHeight) {
                            return;
                        }

                        var hbgd = (0, _point.formatPosition)(raisedPositions[0]).z; //地面高程      
                        var ldgd = point.z - hbgd; //离地高度

                        that.timeinfo.hbgd = hbgd;
                        that.timeinfo.ldgd = ldgd;

                        if (that.entity.label) {
                            var fxgd_str = (0, _util.formatLength)(that.timeinfo.z);
                            var ldgd_str = (0, _util.formatLength)(that.timeinfo.ldgd);
                            that.entity.label.text = that.name + "\n" + "漫游高程：" + fxgd_str + "\n离地距离：" + ldgd_str;
                        }
                    }
                });
            }
        }

        //锁定视角计算

    }, {
        key: "getModelMatrix",
        value: function getModelMatrix() {
            var position = this.position;
            if (!Cesium.defined(position)) {
                return undefined;
            }
            var result;
            var orientation = this.orientation;
            if (!Cesium.defined(orientation)) {
                result = this._fixedFrameTransform(position, undefined, matrix4);
            } else {
                result = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch), position, matrix4);
            }
            return result;
        }

        //获取剖面数据

    }, {
        key: "getTerrainHeight",
        value: function getTerrainHeight(callback, opts) {
            if (this.terrainHeight) {
                callback(this.terrainHeight);
                return this.terrainHeight;
            } else {
                opts = opts || {};

                var lonlats = this.points;

                //剖面的数据
                var alllen = 0;
                var arrLength = [];
                var arrHbgd = [];
                var arrFxgd = [];
                var arrPoint = [];

                var that = this;
                (0, _polyline.computeStepSurfaceLine)({
                    viewer: this.viewer,
                    positions: this.positions,
                    has3dtiles: opts.has3dtiles,
                    splitNum: opts.splitNum,
                    offset: opts.offset,
                    //计算每个分段后的回调方法
                    endItem: function endItem(raisedPositions, noHeight, index) {
                        //剖面的数据 
                        var h1 = lonlats[index][2] || 0;
                        var h2 = lonlats[index + 1][2] || 0;
                        var hstep = (h2 - h1) / raisedPositions.length;

                        for (var i = 0; i < raisedPositions.length; i++) {
                            //已飞行长度
                            if (i != 0) {
                                alllen += Cesium.Cartesian3.distance(raisedPositions[i], raisedPositions[i - 1]);
                            }
                            arrLength.push(Number(alllen.toFixed(1)));

                            //坐标
                            var point = (0, _point.formatPosition)(raisedPositions[i]);
                            arrPoint.push(point);

                            //海拔高度
                            var hbgd = noHeight ? 0 : point.z;
                            arrHbgd.push(hbgd);

                            //飞行高度
                            var fxgd = Number((h1 + hstep * i).toFixed(1));
                            arrFxgd.push(fxgd);
                        }
                    },
                    //计算全部完成的回调方法
                    end: function end() {
                        //剖面的数据(记录下，提高效率，避免多次计算)
                        that.terrainHeight = {
                            arrLength: arrLength,
                            arrFxgd: arrFxgd,
                            arrHbgd: arrHbgd,
                            arrPoint: arrPoint
                        };
                        callback(that.terrainHeight);
                    }
                });
            }
        }
    }, {
        key: "toGeoJSON",
        value: function toGeoJSON() {
            return this.options;
        }
    }, {
        key: "toCZML",
        value: function toCZML() {
            var attr = this.options;

            //时间
            var currentTime = this.startTime.toString();
            var stopTime = this.stopTime.toString();

            //路径位置点
            var cartographicDegrees = [];
            var arrLinePoint = this.arrLinePoint;
            for (var i = 0, length = arrLinePoint.length; i < length; i++) {
                var item = arrLinePoint[i];

                cartographicDegrees.push(item.second);
                cartographicDegrees = cartographicDegrees.concat(item.lonlat);
            }

            var czmlLine = {
                "id": this.name,
                "description": this.options.remark,
                "availability": currentTime + "/" + stopTime,
                "orientation": { //方向
                    "velocityReference": "#position"
                },
                "position": { //位置 
                    "epoch": currentTime,
                    "cartographicDegrees": cartographicDegrees,
                    "interpolationAlgorithm": "LAGRANGE", //插值时使用的插值算法,有效值为“LINEAR”，“LAGRANGE”和“HERMITE”。
                    "interpolationDegree": 2 //插值时使用的插值程度。
                }
            };

            if (this.options.label.show) {
                //是否显示注记
                czmlLine.label = {
                    "show": true,
                    "outlineWidth": 2,
                    "text": this.name,
                    "font": "12pt 微软雅黑 Console",
                    "outlineColor": { "rgba": [0, 0, 0, 255] },
                    "horizontalOrigin": "LEFT",
                    "fillColor": { "rgba": [213, 255, 0, 255] }
                };
            }
            if (this.options.path.show) {
                //是否显示路线
                czmlLine.path = { //路线
                    "show": true,
                    "material": { "solidColor": { "color": { "rgba": [255, 0, 0, 255] } } },
                    "width": 5,
                    "resolution": 1,
                    "leadTime": 0,
                    "trailTime": this.alltimes
                };
            }
            //漫游对象(模型)
            if (this.options.model.show) {
                //是否显示模型
                czmlLine.model = this.options.model;
            }

            var czml = [{
                "version": "1.0",
                "id": "document",
                "clock": {
                    "interval": currentTime + "/" + stopTime,
                    "currentTime": currentTime,
                    "multiplier": 1
                }
            }, czmlLine];
            return czml;
        }

        //视角定位[路线范围]

    }, {
        key: "centerAt",
        value: function centerAt(opts) {
            opts = opts || {};

            var rectangle = (0, _point.getRectangle)(this.positions);
            this.viewer.camera.flyTo({
                duration: Cesium.defaultValue(opts.duration, 0),
                destination: rectangle
            });
            return rectangle;
        }

        //视角定位[目标点] 

    }, {
        key: "flyTo",
        value: function flyTo(opts) {
            var _this2 = this;

            opts = opts || {};

            var viewer = this.viewer;
            var position = this.position;
            if (!position) return;

            if (this.viewer.scene.mode == Cesium.SceneMode.SCENE3D) {
                this.viewer.clock.shouldAnimate = false;
                setTimeout(function () {
                    var heading = Cesium.Math.toDegrees(_this2.hdr.heading) + Cesium.defaultValue(opts.heading, 0);

                    viewer.mars.centerPoint(position, {
                        radius: Cesium.defaultValue(opts.radius, Cesium.defaultValue(opts.distance, 500)), //距离目标点的距离
                        heading: heading,
                        pitch: Cesium.defaultValue(opts.pitch, -50),
                        duration: 0.1,
                        complete: function complete() {
                            viewer.clock.shouldAnimate = true;
                        }
                    });
                }, 500);
            } else {}
        }

        //暂停

    }, {
        key: "pause",
        value: function pause() {
            this.viewer.clock.shouldAnimate = false;
        }
        //继续

    }, {
        key: "proceed",
        value: function proceed() {
            this.viewer.clock.shouldAnimate = true;
        }

        //加投影等额外的entity对象  

    }, {
        key: "addArrShading",
        value: function addArrShading() {
            var arrEntity = [];

            var entity;
            for (var i = 0, len = this.options.shadow.length; i < len; i++) {
                var item = this.options.shadow[i];
                if (!item.show) continue;

                switch (item.type) {
                    case "wall":
                        entity = this.addWallShading(item);
                        break;
                    case "cylinder":
                        entity = this.addCylinderShading(item);
                        break;
                    case "circle":
                        entity = this.addCircleShading(item);
                        break;
                    case "polyline":
                    case "polyline-going":
                        entity = this.addPolylineShading(item);
                        break;
                    default:
                        marslog.warn("存在未标识type的无效shadow配置");
                        break;
                }
                if (entity) arrEntity.push(entity);
            }

            this.arrShowingEntity = arrEntity;
        }
    }, {
        key: "updateArrShading",
        value: function updateArrShading(position) {
            for (var i = 0, len = this.options.shadow.length; i < len; i++) {
                var item = this.options.shadow[i];
                if (!item.show) continue;
                // var entity = this.arrShowingEntity[i];

                switch (item.type) {
                    case "wall":
                        var flyOkPoints = this.arrLinePoint.slice(0, this._flyok_point_index + 1);
                        flyOkPoints.push(position);
                        this.updateWallShading(flyOkPoints);
                        break;
                    case "polyline":
                        var flyOkPoints = this.arrLinePoint.slice(0, this._flyok_point_index + 1);
                        flyOkPoints.push(position);
                        this._passed_positions = flyOkPoints;
                        break;
                    case "polyline-going":
                        var goingPoints = [position].concat(this.arrLinePoint.slice(this._flyok_point_index + 1));
                        this._going_positions = goingPoints;
                        break;

                }
            }
        }

        //垂直线立体投影

    }, {
        key: "addWallShading",
        value: function addWallShading(options) {
            this._wall_positions = [];
            this._wall_minimumHeights = [];
            this._wall_maximumHeights = [];

            options = _extends({ "color": "#00ff00", "outline": false, "opacity": 0.3 }, options);

            var that = this;
            var wallattr = drawAttr.wall.style2Entity(options);
            wallattr.minimumHeights = new Cesium.CallbackProperty(function (time) {
                return that._wall_minimumHeights;
            }, false);
            wallattr.maximumHeights = new Cesium.CallbackProperty(function (time) {
                return that._wall_maximumHeights;
            }, false);
            wallattr.positions = new Cesium.CallbackProperty(function (time) {
                return that._wall_positions;
            }, false);

            var wallEntity = this.viewer.entities.add({
                wall: wallattr
            });
            return wallEntity;
        }
    }, {
        key: "updateWallShading",
        value: function updateWallShading(positions) {
            var newposition = [];
            var minimumHeights = [];
            var maximumHeights = [];
            for (var i = 0; i < positions.length; i++) {
                var point = positions[i].clone();
                if (!point) continue;

                newposition.push(point);
                var carto = Cesium.Cartographic.fromCartesian(point);
                minimumHeights.push(0);
                maximumHeights.push(carto.height);
            }
            this._wall_positions = newposition;
            this._wall_minimumHeights = minimumHeights;
            this._wall_maximumHeights = maximumHeights;
        }

        //圆锥立体 投影

    }, {
        key: "addCylinderShading",
        value: function addCylinderShading(options) {
            var bottomRadiusNow = 100;
            var lengthNow = 100;

            var that = this;

            options = _extends({ "color": "#00ff00", "outline": false, "opacity": 0.3 }, options);

            var wallattr = drawAttr.wall.style2Entity(options); //主要是颜色值等属性
            wallattr.length = new Cesium.CallbackProperty(function (time) {
                return lengthNow;
            }, false);
            wallattr.topRadius = 0;
            wallattr.bottomRadius = new Cesium.CallbackProperty(function (time) {
                return bottomRadiusNow;
            }, false);
            wallattr.numberOfVerticalLines = 0;

            var cylinderEntity = this.viewer.entities.add({
                position: new Cesium.CallbackProperty(function (time) {
                    var position = that.position;
                    if (!position) return null;
                    var car = Cesium.Cartographic.fromCartesian(position);
                    var newPoint = Cesium.Cartesian3.fromRadians(car.longitude, car.latitude, car.height / 2);

                    lengthNow = car.height;
                    bottomRadiusNow = lengthNow * 0.3; //地面圆半径

                    return newPoint;
                }, false),
                cylinder: wallattr
            });
            return cylinderEntity;
        }

        //扩散圆 投影

    }, {
        key: "addCircleShading",
        value: function addCircleShading(options) {
            var attr = drawAttr.circle.style2Entity(options);

            var entity = this.viewer.entities.add({
                // availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                //     start: this.startTime,
                //     stop: this.stopTime
                // })]),
                position: this.property,
                ellipse: attr
            });
            return entity;
        }

        //polyline路线 投影

    }, {
        key: "addPolylineShading",
        value: function addPolylineShading(options) {
            var that = this;
            var attr = drawAttr.polyline.style2Entity(options);
            attr.positions = new Cesium.CallbackProperty(function (time) {
                if (options.type == "polyline-going") return that._going_positions;else return that._passed_positions;
            }, false);

            var entity = this.viewer.entities.add({
                polyline: attr
            });
            return entity;
        }

        //停止，结束漫游

    }, {
        key: "stop",
        value: function stop() {
            this.viewer.trackedEntity = undefined;
            this.viewer.scene.preRender.removeEventListener(this.preRender_eventHandler, this);

            if (this.entity) {
                this.viewer.entities.remove(this.entity);
                delete this.entity;
            }
            if (this.arrShowingEntity) {
                for (var i = 0, len = this.arrShowingEntity.length; i < len; i++) {
                    this.viewer.entities.remove(this.arrShowingEntity[i]);
                }
                delete this.arrShowingEntity;
            }

            if (this._bak_startTime) {
                this.viewer.clock.startTime = this._bak_startTime;
                delete this._bak_startTime;
            }
            if (this._bak_stopTime) {
                this.viewer.clock.stopTime = this._bak_stopTime;
                delete this._bak_stopTime;
            }
            if (this._bak_multiplier) {
                this.viewer.clock.multiplier = this._bak_multiplier;
                delete this._bak_multiplier;
            }
            if (this._bak_clockRange) {
                this.viewer.clock.clockRange = this._bak_clockRange;
                delete this._bak_clockRange;
            }

            this._flyok_point_index = 0;
            this._isStart = false;
            this.fire(_MarsClass2.eventType.end);
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.stop();
            _get(FlyLine.prototype.__proto__ || Object.getPrototypeOf(FlyLine.prototype), "destroy", this).call(this);
        }
    }, {
        key: "popup",
        get: function get() {
            return this._popup;
        },
        set: function set(value) {
            this._popup = value;

            if (this.entity) this.entity.popup = value;
        }
        //当前信息

    }, {
        key: "info",
        get: function get() {
            return this.timeinfo;
        }

        //已经飞行过的点index

    }, {
        key: "indexForFlyOK",
        get: function get() {
            return this._flyok_point_index;
        }

        // 当前点

    }, {
        key: "position",
        get: function get() {
            var position = Cesium.Property.getValueOrUndefined(this.property, this.viewer.clock.currentTime, positionScratch);
            // if (!position) {
            //     return this.position_last
            // }
            // this.position_last = position;
            return position;
        }

        // 获取当前角度 

    }, {
        key: "orientation",
        get: function get() {
            var _orientation = Cesium.Property.getValueOrUndefined(this.velocityOrientation, this.viewer.clock.currentTime, orientationScratch);
            return _orientation;
        }

        // 获取当前hdr角度 

    }, {
        key: "hdr",
        get: function get() {
            var position = this.position; //当前点 
            var _orientation = this.orientation; //获取当前角度 
            if (!position || !_orientation) return null;

            var autoHpr = (0, _matrix.getHeadingPitchRollByOrientation)(position, _orientation, this.viewer.scene.globe.ellipsoid, this._fixedFrameTransform);
            return autoHpr;
        }

        // 获取当前矩阵

    }, {
        key: "matrix",
        get: function get() {
            return this.getModelMatrix();
        }
    }, {
        key: "heading",
        get: function get() {
            if (!Cesium.defined(this._heading)) {
                var hdr = this.hdr;
                if (hdr) return hdr.heading;else return null;
            }
            return this._heading;
        }
    }, {
        key: "pitch",
        get: function get() {
            if (!Cesium.defined(this._pitch)) {
                var hdr = this.hdr;
                if (hdr) return hdr.pitch;else return null;
            }
            return this._pitch;
        },
        set: function set(val) {
            this._pitch = val;
            this.updateAngle(false, { pitch: this._pitch, roll: this._roll });
        }
    }, {
        key: "roll",
        get: function get() {
            if (!Cesium.defined(this._roll)) {
                var hdr = this.hdr;
                if (hdr) return hdr.roll;else return null;
            }
            return this._roll;
        },
        set: function set(val) {
            this._roll = val;
            this.updateAngle(false, { pitch: this._pitch, roll: this._roll });
        }

        //求与卫星中心射线与地球相交点

    }, {
        key: "groundPosition",
        get: function get() {
            return (0, _matrix.getRayEarthPositionByMatrix)(this.matrix, true, this.viewer.scene.globe.ellipsoid);
        }
    }]);

    return FlyLine;
}(_MarsClass2.MarsClass);

//[静态属性]本类中支持的事件类型常量


FlyLine.event = {
    start: _MarsClass2.eventType.start,
    endItem: _MarsClass2.eventType.endItem,
    end: _MarsClass2.eventType.end
};

/***/ }),
