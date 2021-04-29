/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FloodByTerrain = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//地形淹没（材质）分析 类
var FloodByTerrain = exports.FloodByTerrain = function (_MarsClass) {
    _inherits(FloodByTerrain, _MarsClass);

    //========== 构造方法 ========== 
    function FloodByTerrain(options, oldparam) {
        _classCallCheck(this, FloodByTerrain);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (FloodByTerrain.__proto__ || Object.getPrototypeOf(FloodByTerrain)).call(this, options));

        if (oldparam) {
            oldparam.viewer = options;
            options = oldparam;
        }
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

        _this.viewer = options.viewer;
        _this.minHeight = options.minHeight;
        _this.maxHeight = options.maxHeight;

        //检查参数
        if (!Cesium.defined(_this.minHeight)) {
            marslog.warn("minHeight请传入有效数值！");
            return _possibleConstructorReturn(_this);
        }
        if (!Cesium.defined(_this.maxHeight)) {
            marslog.warn("maxHeight请传入有效数值！");
            return _possibleConstructorReturn(_this);
        }
        if (_this.minHeight > _this.maxHeight) {
            //互相交换数据
            var temp = _this.minHeight;
            _this.minHeight = _this.maxHeight;
            _this.maxHeight = temp;
        }

        _this.height = options.height;
        _this.floodVar = Cesium.defaultValue(options.floodVar, [0, 0, 0, 500]); //[基础淹没高度，当前淹没高度，最大淹没高度,默认高度差(最大淹没高度 - 基础淹没高度)]
        _this.ym_pos_x = Cesium.defaultValue(options.ym_pos_x, [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
        _this.ym_pos_y = Cesium.defaultValue(options.ym_pos_y, [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
        _this.ym_pos_z = Cesium.defaultValue(options.ym_pos_z, [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
        _this.rect_flood = Cesium.defaultValue(options.rect_flood, [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]); //包围盒[minx,miny,minz,maxx,maxy,maxz,0.0,0.0,0.0]
        _this.ym_max_index = Cesium.defaultValue(options.ym_max_index, 0); //点选点的个数
        _this._globe = Cesium.defaultValue(options.globe, true); //是否全球淹没
        _this._speed = Cesium.defaultValue(options.speed, 1); //淹没速度
        _this._visibleOutArea = Cesium.defaultValue(options.visibleOutArea, true); //是否显示非淹没区域
        _this._boundingSwell = Cesium.defaultValue(options.boundingSwell, 20); //点集合的包围盒膨胀数值
        _this._show = Cesium.defaultValue(options.show, true);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        if (options.onChange) {
            _this.on(_MarsClass2.eventType.change, function (e) {
                options.onChange(e.height);
            });
        }
        if (options.onStop) {
            _this.on(_MarsClass2.eventType.end, options.onStop);
        }
        _this.cancelFloodSpeed = _this.stop; //别名
        _this.reFlood = _this.restart;
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码


        if (options.positions && options.positions.length > 0) _this.start(options.positions);
        return _this;
    }

    //========== 对外属性 ==========  
    //分析参数


    _createClass(FloodByTerrain, [{
        key: 'start',

        //========== 方法 ========== 


        //初始化
        value: function start(positions) {
            this._positions = positions || this._positions;
            if (!positions || positions.length == 0) return;

            this._prepareFlood(positions);
            this._setFloodVar();
            this._startFlood();
            this._activeFloodSpeed();
        }

        //激活淹没动画

    }, {
        key: '_activeFloodSpeed',
        value: function _activeFloodSpeed() {
            var that = this;
            if (!this.activeFlooding) {
                this.fire(_MarsClass2.eventType.start);
                this.activeFlooding = function () {
                    if (that.height) {
                        that.floodVar[1] = that.height();
                    } else {
                        that.floodVar[1] += that.speed / 50; //50帧每秒
                    }
                    if (that.floodVar[1] > that.floodVar[2]) {
                        that.floodVar[1] = that.floodVar[2];
                        that.stop();
                        // that.onStop&&that.onStop();
                        return;
                    }
                    if (that.floodVar[1] < that.floodVar[0]) {
                        that.floodVar[1] = that.floodVar[0];
                        that.stop();
                        // that.onStop&&that.onStop();
                        return;
                    }
                    that.floodAnalysis.floodVar[1] = that.floodVar[1];
                    that.fire(_MarsClass2.eventType.change, {
                        height: that.floodVar[1]
                    });
                };
                this.viewer.clock.onTick.addEventListener(this.activeFlooding);
            }
        }

        //暂停淹没动画

    }, {
        key: 'stop',
        value: function stop() {
            this.viewer.clock.onTick.removeEventListener(this.activeFlooding);
            this.activeFlooding = null;
            this.fire(_MarsClass2.eventType.end);
        }
        //重新淹没

    }, {
        key: 'restart',
        value: function restart() {
            this.floodVar[1] = this.floodVar[0];
            this._activeFloodSpeed();
        }

        //与处理顶点数组

    }, {
        key: '_prepareFlood',
        value: function _prepareFlood(arr) {
            this.ym_pos_arr = arr;
            var len = arr.length;
            if (len == 0) return;
            this.ym_max_index = len;
            var minX = 99999999;
            var minY = 99999999;
            var minZ = 99999999;
            var maxX = -99999999;
            var maxY = -99999999;
            var maxZ = -99999999;
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
            var chaNum = this.boundingSwell;
            this._base_rect = this.rect_flood = [minX - chaNum, minY - chaNum, minZ - chaNum, maxX + chaNum, maxY + chaNum, maxZ + chaNum, 0.0, 0.0, 0.0];
        }
        //设置淹没高度

    }, {
        key: '_setFloodVar',
        value: function _setFloodVar() {
            this.floodVar = [this.minHeight, this.minHeight, this.maxHeight, this.maxHeight - this.minHeight];
        }
        //开始淹没

    }, {
        key: '_startFlood',
        value: function _startFlood() {
            this.floodAnalysis.floodVar[0] = this.floodVar[0];
            this.floodAnalysis.floodVar[1] = this.floodVar[1];
            this.floodAnalysis.ym_pos_x = this.ym_pos_x;
            this.floodAnalysis.ym_pos_y = this.ym_pos_y;
            this.floodAnalysis.ym_pos_z = this.ym_pos_z;
            this.floodAnalysis.rect_flood = this.rect_flood;
            this.floodAnalysis.ym_pos_arr = this.ym_pos_arr;
            this.floodAnalysis.floodSpeed = this.speed;
            this.floodAnalysis.ym_max_index = this.ym_max_index;
            this.floodAnalysis.globe = this.globe = false;
            this.floodAnalysis.showElseArea = this.visibleOutArea;
            this.viewer.scene.globe.material = Cesium.Material.fromType('YanMo');
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.stop();
            this.viewer.scene.globe.material = null;
            this.viewer.scene.globe._surface.tileProvider.resetFloodAnalysis();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.clear();
            _get(FloodByTerrain.prototype.__proto__ || Object.getPrototypeOf(FloodByTerrain.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'floodAnalysis',
        get: function get() {
            return this.viewer.scene.globe._surface.tileProvider.floodAnalysis;
        }
    }, {
        key: 'positions',
        get: function get() {
            return this._positions;
        },
        set: function set(val) {
            this._positions = val;
            this.start(val);
        }

        //显示非淹没区域

    }, {
        key: 'visibleOutArea',
        get: function get() {
            return this._visibleOutArea;
        },
        set: function set(val) {
            this._visibleOutArea = val;
            this.floodAnalysis.showElseArea = val;
        }

        //全球淹没

    }, {
        key: 'globe',
        get: function get() {
            return this._globe;
        },
        set: function set(val) {
            this._globe = val;
            this.floodAnalysis.globe = val;
        }

        //淹没速度

    }, {
        key: 'speed',
        get: function get() {
            return this._speed;
        },
        set: function set(val) {
            this._speed = Number(val);
        }
        //点集合的包围盒膨胀数值

    }, {
        key: 'boundingSwell',
        get: function get() {
            return this._boundingSwell;
        },
        set: function set(num) {
            var rect = this._base_rect;
            this._boundingSwell = Number(num);
            this.rect_flood = [rect[0] - this.boundingSwell, rect[1] - this.boundingSwell, rect[2] - this.boundingSwell, rect[3] - this.boundingSwell, rect[4] - this.boundingSwell, rect[5] - this.boundingSwell, 0, 0, 0];
            this.floodAnalysis.rect_flood = this.rect_flood;
        }

        //显示和隐藏

    }, {
        key: 'show',
        get: function get() {
            return this._show;
        },
        set: function set(val) {
            this._show = val;
            if (val) {
                this.viewer.scene.globe.material = Cesium.Material.fromType('YanMo');
            } else {
                this.viewer.scene.globe.material = null;
            }
        }
    }]);

    return FloodByTerrain;
}(_MarsClass2.MarsClass);
//[静态属性]本类中支持的事件类型常量


FloodByTerrain.event = {
    start: _MarsClass2.eventType.start,
    change: _MarsClass2.eventType.change,
    end: _MarsClass2.eventType.end
};

/***/ }),
