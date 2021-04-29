/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Location = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _zepto = __webpack_require__(8);

var _point = __webpack_require__(2);

var point = _interopRequireWildcard(_point);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

var _util2 = __webpack_require__(1);

var _util = _interopRequireWildcard(_util2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//“鼠标经纬度提示”控件
var Location = exports.Location = function () {
    //========== 构造方法 ========== 
    function Location(viewer, options) {
        var _this = this;

        _classCallCheck(this, Location);

        this.viewer = viewer;
        this.options = options;

        this.format = options.format || '<div>经度:{x}</div> <div>纬度:{y}</div> <div>海拔：{z}米</div> <div>方向：{heading}度</div> <div>俯仰角：{pitch}度</div>  <div>视高：{height}米</div>';

        var containerid = viewer._container.id + "-dc-location";
        var inhtml = '<div id="' + containerid + '"  class="dc-locationbar animation-slide-bottom no-print" ><div class="dc-locationbar-content"></div></div>';
        (0, _zepto.zepto)("#" + viewer._container.id).append(inhtml);

        this._dom = (0, _zepto.zepto)('#' + containerid);
        this._domContent = (0, _zepto.zepto)('#' + containerid + " .dc-locationbar-content");

        if (options.style) this._dom.css(options.style);else {
            this._dom.css({
                "left": viewer.animation ? "170px" : "0",
                "right": "0",
                "bottom": viewer.timeline ? "25px" : "0"
            });
        }
        this._visible = true;

        this.locationData = {};
        this.locationData.height = viewer.camera.positionCartographic.height.toFixed(1);
        this.locationData.heading = Cesium.Math.toDegrees(viewer.camera.heading).toFixed(0);
        this.locationData.pitch = Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(0);

        this.options.cacheTime = Cesium.defaultValue(this.options.cacheTime, 100);
        this.viewer.mars.on(_MarsClass.eventType.mouseMove, this.mouseMoveHandler, this);

        //帧率
        if (options.fps) {
            // 帧率的计算借助了Cesium中的东西，需要开启debugShowFramesPerSecond
            viewer.scene.debugShowFramesPerSecond = true;

            var timeTik = setInterval(function () {
                if (!viewer || !viewer.scene._performanceDisplay) return;
                clearInterval(timeTik);
                _this.timeTik = null;

                var domFPS = (0, _zepto.zepto)(".cesium-performanceDisplay");

                //修改样式
                domFPS.addClass("dc-locationbar-content").removeClass("cesium-performanceDisplay");

                //移除空节点
                domFPS.children(".cesium-performanceDisplay-throttled").remove();

                //添加到状态栏
                _this._dom.prepend(domFPS);
            }, 500);
            this.timeTik = timeTik;
        }

        //相机移动结束事件
        viewer.scene.camera.moveEnd.addEventListener(this.updaeCamera, this);
    }

    //========== 对外属性 ==========  
    //是否显示


    _createClass(Location, [{
        key: 'mouseMoveHandler',


        //========== 方法 ==========  
        //鼠标移动事件，setTimeout是为了优化效率
        value: function mouseMoveHandler(event) {
            var _this2 = this;

            if (this.moveTimer) {
                clearTimeout(this.moveTimer);
                delete this.moveTimer;
            }
            this.moveTimer = setTimeout(function () {
                delete _this2.moveTimer;
                _this2.updateData(event);
            }, this.options.cacheTime);
        }
    }, {
        key: 'updateData',
        value: function updateData(movement) {
            if (!this._visible) return;

            var cartesian = point.getCurrentMousePosition(this.viewer.scene, movement.endPosition);
            if (!cartesian) return;

            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);

            this.locationData.z = (cartographic.height / this.viewer.scene.terrainExaggeration).toFixed(1);
            this.locationData.height = this.viewer.camera.positionCartographic.height.toFixed(1);
            this.locationData.heading = Cesium.Math.toDegrees(this.viewer.camera.heading).toFixed(0);
            this.locationData.pitch = Cesium.Math.toDegrees(this.viewer.camera.pitch).toFixed(0);
            this.locationData.level = this.viewer.mars.level;

            var jd = Cesium.Math.toDegrees(cartographic.longitude);
            var wd = Cesium.Math.toDegrees(cartographic.latitude);

            switch (this.options.crs) {
                default:
                    //和地图一致的原坐标
                    var fixedLen = this.options.hasOwnProperty('toFixed') ? this.options.toFixed : 6;
                    this.locationData.x = jd.toFixed(fixedLen);
                    this.locationData.y = wd.toFixed(fixedLen);
                    break;
                case "degree":
                    //度分秒形式
                    this.locationData.x = _util.formatDegree(jd);
                    this.locationData.y = _util.formatDegree(wd);
                    break;
                case "project":
                    //投影坐标
                    var fixedLen = this.options.hasOwnProperty('toFixed') ? this.options.toFixed : 0;
                    var mkt = pointconvert.cartesian2mercator([cartesian.x, cartesian.y]);
                    this.locationData.x = mkt[0].toFixed(fixedLen);
                    this.locationData.y = mkt[1].toFixed(fixedLen);
                    break;

                case "wgs":
                    //标准wgs84格式坐标
                    var fixedLen = this.options.hasOwnProperty('toFixed') ? this.options.toFixed : 6;
                    var wgsPoint = point2wgs({ x: jd, y: wd }); //坐标转换为wgs 
                    this.locationData.x = wgsPoint.x.toFixed(fixedLen);
                    this.locationData.y = wgsPoint.y.toFixed(fixedLen);
                    break;
                case "wgs-degree":
                    //标准wgs84格式坐标
                    var wgsPoint = point2wgs({ x: jd, y: wd }); //坐标转换为wgs 
                    this.locationData.x = _util.formatDegree(wgsPoint.x);
                    this.locationData.y = _util.formatDegree(wgsPoint.y);
                    break;
            }

            var inhtml;
            if (typeof this.format === 'function') {
                //回调方法 
                inhtml = this.format(this.locationData);
            } else {
                inhtml = _util.template(this.format, this.locationData);
            }
            this._domContent.html(inhtml);
        }
    }, {
        key: 'updaeCamera',
        value: function updaeCamera() {
            if (!this._visible) return;

            this.locationData.height = this.viewer.camera.positionCartographic.height.toFixed(1);
            this.locationData.heading = Cesium.Math.toDegrees(this.viewer.camera.heading).toFixed(0);
            this.locationData.pitch = Cesium.Math.toDegrees(this.viewer.camera.pitch).toFixed(0);
            this.locationData.level = this.viewer.mars.level;

            if (this.locationData.x == null) return;

            var inhtml;
            if (typeof this.format === 'function') {
                //回调方法 
                inhtml = this.format(this.locationData);
            } else {
                inhtml = _util.template(this.format, this.locationData);
            }

            this._domContent.html(inhtml);
        }
    }, {
        key: 'css',
        value: function css(style) {
            this._dom.css(style);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            //相机移动结束事件
            this.viewer.scene.camera.moveEnd.removeEventListener(this.updaeCamera, this);
            this.viewer.mars.off(_MarsClass.eventType.mouseMove, this.mouseMoveHandler, this);

            if (this.options.fps) {
                this.viewer.scene.debugShowFramesPerSecond = false;
            }

            if (this.timeTik) {
                clearInterval(this.timeTik);
                this.timeTik = null;
            }

            this._dom.remove();

            //删除所有绑定的数据
            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: 'show',
        get: function get() {
            return this._visible;
        },
        set: function set(value) {
            this._visible = value;

            if (value) this._dom.show();else this._dom.hide();
        }
    }]);

    return Location;
}();

/***/ }),
