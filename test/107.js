/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tiles3dLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _BaseLayer2 = __webpack_require__(15);

var _util = __webpack_require__(1);

var _tileset = __webpack_require__(27);

var _point = __webpack_require__(2);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tiles3dLayer = exports.Tiles3dLayer = function (_BaseLayer) {
    _inherits(Tiles3dLayer, _BaseLayer);

    //========== 构造方法 ========== 
    function Tiles3dLayer(viewer, options) {
        _classCallCheck(this, Tiles3dLayer);

        var _this = _possibleConstructorReturn(this, (Tiles3dLayer.__proto__ || Object.getPrototypeOf(Tiles3dLayer)).call(this, viewer, options));

        _this.hasOpacity = true;

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        if (_this.options.readyPromise) {
            _this.on(_MarsClass.eventType.loadBefore, function (event) {
                _this.options.readyPromise(event.tileset);
            });
        }
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

        return _this;
    }

    _createClass(Tiles3dLayer, [{
        key: 'add',

        //添加 
        value: function add() {
            if (this.tileset) {
                if (!this.viewer.scene.primitives.contains(this.tileset)) this.viewer.scene.primitives.add(this.tileset);
            } else {
                this.initData();
            }
            _get(Tiles3dLayer.prototype.__proto__ || Object.getPrototypeOf(Tiles3dLayer.prototype), 'add', this).call(this);
        }
        //移除

    }, {
        key: 'remove',
        value: function remove() {
            if (Cesium.defined(this.options.visibleDistanceMax)) this.viewer.scene.camera.changed.removeEventListener(this.updateVisibleDistance, this);

            //解除绑定的事件 
            if (this.tileset) {
                this.tileset.initialTilesLoaded.removeEventListener(this.onInitialTilesLoaded, this);
                this.tileset.allTilesLoaded.removeEventListener(this.onAllTilesLoaded, this);

                if (this.viewer.scene.primitives.contains(this.tileset)) this.viewer.scene.primitives.remove(this.tileset);

                delete this.tileset;
            }
            if (this.boundingSphere) delete this.boundingSphere;
            _get(Tiles3dLayer.prototype.__proto__ || Object.getPrototypeOf(Tiles3dLayer.prototype), 'remove', this).call(this);
        }
        //定位至数据区域

    }, {
        key: 'centerAt',
        value: function centerAt(duration) {
            if (this.options.extent || this.options.center) {
                this.viewer.mars.centerAt(this.options.extent || this.options.center, { duration: duration, isWgs84: true });
            } else if (this.boundingSphere) {
                this.viewer.camera.flyToBoundingSphere(this.boundingSphere, {
                    offset: new Cesium.HeadingPitchRange(0.0, -0.5, this.boundingSphere.radius * 2),
                    duration: duration
                });
            }
        }
    }, {
        key: 'initData',
        value: function initData() {
            var _this2 = this;

            this.tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset((0, _util.getProxyUrl)(this.options)));
            this.tileset.eventTarget = this;
            this.tileset._config = this.options;

            for (var key in this.options) {
                if (key == "url" || key == "type" || key == "style" || key == "classificationType") continue;
                try {
                    this.tileset[key] = this.options[key];
                } catch (e) {}
            }
            if (this.options.style) {
                //设置style
                this.tileset.style = new Cesium.Cesium3DTileStyle(this.options.style);
            }

            //绑定一些事件 
            this.tileset.initialTilesLoaded.addEventListener(this.onInitialTilesLoaded, this);
            this.tileset.allTilesLoaded.addEventListener(this.onAllTilesLoaded, this);

            this.tileset.readyPromise.then(function (tileset) {
                _this2.fire(_MarsClass.eventType.loadBefore, { tileset: tileset });

                if (_this2.hasOpacity && _this2._opacity != 1) {
                    //透明度
                    _this2.setOpacity(_this2._opacity);
                }

                //记录模型原始的中心点
                var boundingSphere = tileset.boundingSphere;
                _this2.boundingSphere = boundingSphere;

                if (tileset._root && tileset._root.transform) {
                    _this2.orginMatrixInverse = Cesium.Matrix4.inverse(Cesium.Matrix4.fromArray(tileset._root.transform), new Cesium.Matrix4());

                    //缩放
                    if (_this2.options.scale > 0 && _this2.options.scale != 1) {
                        tileset._root.transform = Cesium.Matrix4.multiplyByUniformScale(tileset._root.transform, _this2.options.scale, tileset._root.transform);
                    }
                }

                var position = boundingSphere.center; //模型原始的中心点
                _this2.positionCenter = position;
                var catographic = Cesium.Cartographic.fromCartesian(position);

                var height = Number(catographic.height.toFixed(2));
                var longitude = Number(Cesium.Math.toDegrees(catographic.longitude).toFixed(6));
                var latitude = Number(Cesium.Math.toDegrees(catographic.latitude).toFixed(6));
                _this2.originalCenter = { x: longitude, y: latitude, z: height };
                marslog.log((_this2.options.name || "") + " 模型原始位置:" + JSON.stringify(_this2.originalCenter));

                //转换坐标系【如果是高德谷歌国测局坐标系时转换坐标进行加偏，其它的原样返回】
                var rawCenter = _this2.viewer.mars.point2map(_this2.originalCenter);
                if (rawCenter.x != _this2.originalCenter.x || rawCenter.y != _this2.originalCenter.y || _this2.options.offset != null) {

                    _this2.options.offset = _this2.options.offset || {}; //配置信息中指定的坐标信息或高度信息
                    _this2.options.rotation = _this2.options.rotation || {};

                    if (_this2.options.offset.x && _this2.options.offset.y) {
                        _this2.options.offset = _this2.viewer.mars.point2map(_this2.options.offset); //转换坐标系【如果是高德谷歌国测局坐标系时转换坐标进行加偏，其它的原样返回】
                    }

                    var offsetopt = {
                        x: _this2.options.offset.x || rawCenter.x,
                        y: _this2.options.offset.y || rawCenter.y,
                        z: _this2.options.offset.z || 0,
                        rotation_z: _this2.options.rotation.z || _this2.options.offset.heading,
                        rotation_x: _this2.options.rotation.x,
                        rotation_y: _this2.options.rotation.y,
                        axis: _this2.options.axis,
                        scale: _this2.options.scale,
                        transform: _this2.options.offset.hasOwnProperty("transform") ? _this2.options.offset.transform : _this2.options.offset.heading != null || _this2.options.rotation.z != null
                    };

                    if (_this2.options.offset.z == "-height") {
                        offsetopt.z = -height + 5;
                        _this2.updateMatrix(offsetopt);
                    } else if (_this2.options.offset.z == "auto") {
                        _this2.autoHeight(position, offsetopt);
                    } else {
                        _this2.updateMatrix(offsetopt);
                    }
                }

                if (_this2.options.flyTo) {
                    if (_this2.viewer.mars.isFlyAnimation()) {
                        _this2.viewer.mars.openFlyAnimationEndFun = function () {
                            _this2.centerAt(0);
                        };
                    } else {
                        _this2.centerAt(0);
                    }
                }

                if (Cesium.defined(_this2.options.visibleDistanceMax)) _this2.bindVisibleDistance();

                _this2.fire(_MarsClass.eventType.load, { tileset: tileset });
            });
        }
        //刷新事件

    }, {
        key: 'refreshEvent',
        value: function refreshEvent() {
            if (this.tileset == null) return false;

            this.tileset.eventTarget = this;
            this.tileset.contextmenuItems = this.options.contextmenuItems;
            return true;
        }
        //该回调只执行一次

    }, {
        key: 'onInitialTilesLoaded',
        value: function onInitialTilesLoaded(e) {
            this.fire(_MarsClass.eventType.initialTilesLoaded, { tile: e });
        }
        //该回调会执行多次，视角变化后重新加载一次完成后都会回调

    }, {
        key: 'onAllTilesLoaded',
        value: function onAllTilesLoaded(e) {
            this.fire(_MarsClass.eventType.allTilesLoaded, { tile: e });
        }
    }, {
        key: 'autoHeight',
        value: function autoHeight(position, offsetopt) {
            var that = this;
            //求地面海拔
            (0, _point.getSurfaceTerrainHeight)(this.viewer.scene, position, {
                asyn: true, //是否异步求准确高度 
                callback: function callback(newHeight, cartOld) {
                    if (newHeight == null) return;

                    var offsetZ = newHeight - that.originalCenter.z + 1;
                    offsetopt.z = offsetZ;

                    that.updateMatrix(offsetopt);
                }
            });
        }
        //变换原点坐标

    }, {
        key: 'updateMatrix',
        value: function updateMatrix(offsetopt) {
            if (this.tileset == null) return;

            marslog.log((this.options.name || "") + " 模型修改后位置:" + JSON.stringify(offsetopt));

            this.positionCenter = Cesium.Cartesian3.fromDegrees(offsetopt.x, offsetopt.y, offsetopt.z);

            (0, _tileset.updateMatrix)(this.tileset, offsetopt);
        }

        //设置透明度

    }, {
        key: 'setOpacity',
        value: function setOpacity(value) {
            this._opacity = value;

            if (this.options.onSetOpacity) {
                this.options.onSetOpacity(value); //外部自定义处理
            } else {
                if (this.tileset) {
                    this.tileset.style = new Cesium.Cesium3DTileStyle({
                        color: "color() *vec4(1,1,1," + value + ")"
                    });
                }
            }
        }
    }, {
        key: 'showClickFeature',
        value: function showClickFeature(value) {
            if (this.tileset) {
                this.tileset._config.showClickFeature = value;
            } else {
                this.options.showClickFeature = value;
            }
        }
        //绑定

    }, {
        key: 'bindVisibleDistance',
        value: function bindVisibleDistance() {
            this.viewer.scene.camera.changed.addEventListener(this.updateVisibleDistance, this);
        }
    }, {
        key: 'updateVisibleDistance',
        value: function updateVisibleDistance() {
            if (!this._visible) return;
            if (this.viewer.scene.mode !== Cesium.SceneMode.SCENE3D) return;
            if (!this.tileset || !this.boundingSphere || !this.positionCenter) return;

            var camera_distance = Cesium.Cartesian3.distance(this.positionCenter, this.viewer.camera.positionWC);
            if (camera_distance > this.options.visibleDistanceMax + 100000) {
                //在模型的外包围外
                this.tileset.show = false;
            } else {
                var target = (0, _point.pickCenterPoint)(this.viewer.scene); //取屏幕中心点坐标
                if (Cesium.defined(target)) {
                    var camera_distance = Cesium.Cartesian3.distance(target, this.viewer.camera.positionWC);
                    this.tileset.show = camera_distance < this.options.visibleDistanceMax;
                } else {
                    this.tileset.show = true;
                }
            }
        }
    }, {
        key: 'layer',
        get: function get() {
            return this.tileset;
        }
    }, {
        key: 'model',
        get: function get() {
            return this.tileset;
        }
    }]);

    return Tiles3dLayer;
}(_BaseLayer2.BaseLayer);

//[静态属性]本类中支持的事件类型常量


Tiles3dLayer.event = {
    load: _MarsClass.eventType.load,
    loadBefore: _MarsClass.eventType.loadBefore,
    initialTilesLoaded: _MarsClass.eventType.initialTilesLoaded,
    allTilesLoaded: _MarsClass.eventType.allTilesLoaded,
    click: _MarsClass.eventType.click,
    mouseOver: _MarsClass.eventType.mouseOver,
    mouseOut: _MarsClass.eventType.mouseOut
};

/***/ }),
