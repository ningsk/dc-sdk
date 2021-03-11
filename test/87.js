/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DivPoint = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.style2Entity = style2Entity;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _zepto = __webpack_require__(8);

var _point = __webpack_require__(2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//div点 类
var DivPoint = exports.DivPoint = function () {
    //========== 构造方法 ========== 
    function DivPoint(viewer, options) {
        _classCallCheck(this, DivPoint);

        this.viewer = viewer;
        this.options = options;

        this.position = options.position;

        //兼容历史写法
        if (options.visibleDistanceMin || options.visibleDistanceMax) {
            options.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(options.visibleDistanceMin || 0, options.visibleDistanceMax || 100000);
        }

        this.heightReference = Cesium.defaultValue(options.heightReference, Cesium.HeightReference.NONE);
        if (options.clampToGround) {
            this.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
        }

        this.distanceDisplayCondition = options.distanceDisplayCondition; //按视距距离显示
        this.scaleByDistance = this.options.scaleByDistance;
        this.horizontalOrigin = this.options.horizontalOrigin;
        this.verticalOrigin = this.options.verticalOrigin;

        this._depthTest = Cesium.defaultValue(options.depthTest, true);
        this.css_transform_origin = Cesium.defaultValue(this.options.css_transform_origin, 'left bottom 0');

        //添加html 
        if (options.html) {
            this._dom = (0, _zepto.zepto)('<div>' + options.html + '</div>');

            if (Cesium.defaultValue(options.oldver, false)) {
                //兼容老版本,但不支持html动态修改
                this._dom = (0, _zepto.zepto)(options.html);
            }

            this._dom.css({
                position: 'absolute',
                left: '0',
                top: '0'
            });
            this._dom.appendTo("#" + viewer._container.id);
        } else if (options.dom) {
            this._dom = (0, _zepto.zepto)(options.dom);
        }

        this.visible = Cesium.defaultValue(options.visible, true);

        var stopPropagation = Cesium.defaultValue(options.stopPropagation, true);

        var that = this;
        var hasEvent = false;
        if (options.click || options.popup) {
            hasEvent = true;
            this._dom.click(function (e) {
                if (stopPropagation) {
                    if (e.stopPropagation) e.stopPropagation();else e.cancelBubble = true;
                }

                if (options.popup) viewer.mars.popup.show(options, that.position);else viewer.mars.popup.close();

                if (options.click) options.click(options, that, e);
            });
        }
        if (options.tooltip) {
            hasEvent = true;
            this._dom.mousemove(function (e) {
                //移入
                if (stopPropagation) {
                    if (e.stopPropagation) e.stopPropagation();else e.cancelBubble = true;
                }

                viewer.mars.tooltip.show(options, that.position);
            });
            this._dom.mouseout(function (e) {
                //移出
                if (stopPropagation) {
                    if (e.stopPropagation) e.stopPropagation();else e.cancelBubble = true;
                }
                viewer.mars.tooltip.close();
            });
        }

        if (!hasEvent) {
            /*加上这个css后鼠标可以穿透，但是无法触发单击等鼠标事件*/
            this._dom.css({
                'pointer-events': 'none'
            });
        }

        //移动事件
        viewer.scene.postRender.addEventListener(this.updateViewPoint, this);
    }

    //========== 对外属性 ==========  


    _createClass(DivPoint, [{
        key: 'updateViewPoint',


        //========== 方法 ========== 
        value: function updateViewPoint() {
            if (!this._visible) return false;

            var scene = this.viewer.scene;
            var camera = this.viewer.camera;

            var _position;
            if (this.heightReference == Cesium.HeightReference.CLAMP_TO_GROUND) {
                _position = (0, _point.setPositionSurfaceHeight)(this.viewer, (0, _point.getPositionValue)(this.position));
            } else if (this.heightReference == Cesium.HeightReference.RELATIVE_TO_GROUND) {
                _position = (0, _point.setPositionSurfaceHeight)(this.viewer, (0, _point.getPositionValue)(this.position), { relativeHeight: true });
            } else {
                _position = (0, _point.getPositionValue)(this.position);
            }

            if (!Cesium.defined(_position)) {
                this.close();
                return false;
            }

            //如果视角和位置都没有变化，直接返回
            var _thiscache = _position.x + '=' + _position.y + '-' + _position.z + '-' + camera.positionWC.x + '=' + camera.positionWC.y + '-' + camera.positionWC.z + '-' + camera.heading + '-' + camera.pitch + '-' + camera.roll;
            if (_thiscache == this._camera_cache) {
                return true;
            }
            this._camera_cache = _thiscache;
            //如果视角和位置都没有变化，直接返回


            var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, _position);

            var camera_distance;
            if (scene.mode === Cesium.SceneMode.SCENE3D) camera_distance = Cesium.Cartesian3.distance(_position, camera.positionWC);else camera_distance = camera.positionCartographic.height;

            if (point == null || this.distanceDisplayCondition && (this.distanceDisplayCondition.near > camera_distance || this.distanceDisplayCondition.far < camera_distance)) {
                if (this._dom.css("display") == "block") {
                    //如果node是显示则隐藏 
                    this.close();
                }
                return false;
            }

            //判断是否在球的背面
            if (this._depthTest && scene.mode === Cesium.SceneMode.SCENE3D) {
                //三维模式下
                var occluder = new Cesium.EllipsoidalOccluder(scene.globe.ellipsoid, scene.camera.positionWC);
                var visible = occluder.isPointVisible(_position); //地球椭球体背面判断处理
                //visible为true说明点在球的正面，否则点在球的背面。 
                //需要注意的是不能用这种方法判断点的可见性，如果球放的比较大，点跑到屏幕外面，它返回的依然为true
                if (!visible) {
                    if (this._dom.css("display") == "block") {
                        //如果node是显示则隐藏 
                        this.close();
                    }
                    return false;
                }

                //地形和模型遮挡时的检测处理
                // if (scene.globe.depthTestAgainstTerrain) {
                //     var testPosition = scene.pickPosition(point) 
                //     if (testPosition && Math.abs(_position.x - testPosition.x) > 10
                //         && Math.abs(_position.y - testPosition.y) > 10
                //         && Math.abs(_position.z - testPosition.z) > 10) {
                //         if (this._dom.css("display") == "block") {//如果node是显示则隐藏 
                //             this.close();
                //         }
                //         return false;
                //     }
                // }
            }
            //判断是否在球的背面

            if (this._dom.css("display") != "block") {
                //如果node是隐藏的则显示node元素 
                this._camera_cache = null;
                this._dom.show();
            }

            //求xy位置
            var height = this._dom.height(); //需要是显示状态，才有值
            var width = this._dom.width();

            var x;
            var y;
            if (this.options.anchor) {
                x = point.x + this.options.anchor[0];
                y = point.y - height + this.options.anchor[1];
            } else {
                switch (this.horizontalOrigin) {
                    default:
                    case "LEFT":
                    case Cesium.HorizontalOrigin.LEFT:
                        x = point.x;
                        break;
                    case "CENTER":
                    case Cesium.HorizontalOrigin.CENTER:
                        x = point.x - width / 2;
                        break;
                    case "RIGHT":
                    case Cesium.HorizontalOrigin.RIGHT:
                        x = point.x - width;
                        break;
                }
                switch (this.verticalOrigin) {
                    case "TOP":
                    case Cesium.VerticalOrigin.TOP:
                        y = point.y;
                        break;
                    case "CENTER":
                    case Cesium.VerticalOrigin.CENTER:
                        y = point.y - height / 2;
                        break;
                    default:
                    case "BOTTOM":
                    case Cesium.VerticalOrigin.BOTTOM:
                        y = point.y - height;
                        break;
                }
            }

            //求缩放比例
            var scale = 1;
            if (this.scaleByDistance) {
                var sc = this.scaleByDistance; //Cesium.NearFarScalar
                if (camera_distance <= sc.near) {
                    scale = sc.nearValue;
                } else if (camera_distance > sc.near && camera_distance < sc.far) {
                    // near 10000, nearValue  1.0,, far 100000, farValue  0.1 
                    scale = sc.nearValue + (sc.farValue - sc.nearValue) * (camera_distance - sc.near) / (sc.far - sc.near);
                } else {
                    scale = sc.farValue;
                }
            }

            var css_transform = 'matrix(' + scale + ',0,0,' + scale + ',' + x + ',' + y + ')';

            this._dom.css({
                'transform': css_transform,
                'transform-origin': this.css_transform_origin,
                '-ms-transform': css_transform, /* IE 9 */
                '-ms-transform-origin': this.css_transform_origin,
                '-webkit-transform': css_transform, /* Safari 和 Chrome */
                '-webkit-transform-origin': this.css_transform_origin,
                '-moz-transform': css_transform, /* Firefox */
                '-moz-transform-origin': this.css_transform_origin,
                '-o-transform': css_transform, /* Opera */
                '-o-transform-origin': this.css_transform_origin
            });

            if (this.options.postRender) {
                //回调方法
                this.options.postRender({
                    x: x,
                    y: y,
                    height: height,
                    width: width,
                    distance: camera_distance
                });
            }
        }
    }, {
        key: 'setVisible',
        value: function setVisible(val) {
            this._visible = val;
            if (!this._dom) return;
            if (val) this._dom.show();else this.close();
        }
    }, {
        key: 'showPopup',
        value: function showPopup() {
            if (this.options.popup) this.viewer.mars.popup.show(this.options, this.position);
        }
    }, {
        key: 'closePopup',
        value: function closePopup() {
            this.viewer.mars.popup.close();
        }
    }, {
        key: 'close',
        value: function close() {
            this._dom.hide();
            this._camera_cache = null;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.viewer.scene.postRender.removeEventListener(this.updateViewPoint, this);
            this._dom.remove();

            //删除所有绑定的数据
            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: 'dom',
        get: function get() {
            return this._dom;
        }

        //是否显示

    }, {
        key: 'visible',
        get: function get() {
            return this._visible;
        },
        set: function set(val) {
            this._camera_cache = null;
            this._visible = val;
            this.setVisible(val);
        }
    }, {
        key: 'enable',
        set: function set(value) {
            if (value) {
                this._dom.css({
                    'pointer-events': 'all'
                });
            } else {
                this._dom.css({
                    'pointer-events': 'none'
                });
            }
        }

        //是否打开深度判断（true时判断是否在球背面）

    }, {
        key: 'depthTest',
        get: function get() {
            return this._depthTest;
        },
        set: function set(value) {
            this._camera_cache = null;
            this._depthTest = value;
        }
    }, {
        key: 'clampToGround',
        get: function get() {
            return this.options.clampToGround;
        },
        set: function set(value) {
            this.options.clampToGround = value;
            if (value) this.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;else this.heightReference = Cesium.HeightReference.NONE;
        }
    }, {
        key: 'html',
        get: function get() {
            return this._dom.html();
        },
        set: function set(value) {
            this._camera_cache = null;
            this._dom.html(value);
        }
    }, {
        key: 'popup',
        get: function get() {
            return this.options.popup;
        },
        set: function set(value) {
            this._dom.css({
                'pointer-events': 'all'
            });

            var that = this;
            var options = this.options;

            options.popup = value;

            this._dom.click(function (e) {
                if (options.popup) that.viewer.mars.popup.show(options, that.position);
                if (options.click) options.click(options, that, e);
            });
        }
    }, {
        key: 'tooltip',
        get: function get() {
            return this.options.tooltip;
        },
        set: function set(value) {
            this._dom.css({
                'pointer-events': 'all'
            });

            var that = this;
            var options = this.options;

            options.tooltip = value;

            this._dom.mousemove(function (e) {
                //移入
                that.viewer.mars.tooltip.show(options, that.position);
            });
            this._dom.mouseout(function (e) {
                //移出
                that.viewer.mars.tooltip.close();
            });
        }
    }]);

    return DivPoint;
}();

//属性赋值到entity


function style2Entity(style) {
    style = style || {};

    var entityattr = {};

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "scaleByDistance_near": //跳过扩展其他属性的参数
            case "scaleByDistance_nearValue":
            case "scaleByDistance_far":
            case "scaleByDistance_farValue":
            case "distanceDisplayCondition_far":
            case "distanceDisplayCondition_near":
                break;
            case "scaleByDistance":
                //是否按视距缩放
                if (value) {
                    entityattr.scaleByDistance = new Cesium.NearFarScalar(Number(Cesium.defaultValue(style.scaleByDistance_near, 1000)), Number(Cesium.defaultValue(style.scaleByDistance_nearValue, 1.0)), Number(Cesium.defaultValue(style.scaleByDistance_far, 1000000)), Number(Cesium.defaultValue(style.scaleByDistance_farValue, 0.1)));
                } else {
                    entityattr.scaleByDistance = undefined;
                }
                break;
            case "distanceDisplayCondition":
                //是否按视距显示
                if (value) {
                    if (value instanceof Cesium.DistanceDisplayCondition) {
                        entityattr.distanceDisplayCondition = value;
                    } else {
                        entityattr.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(Number(Cesium.defaultValue(style.distanceDisplayCondition_near, 0)), Number(Cesium.defaultValue(style.distanceDisplayCondition_far, 100000)));
                    }
                } else {
                    entityattr.distanceDisplayCondition = undefined;
                }
                break;
            case "clampToGround":
                //贴地
                if (value) entityattr.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;else entityattr.heightReference = Cesium.HeightReference.NONE;
                break;
            case "heightReference":
                switch (value) {
                    case "NONE":
                        entityattr.heightReference = Cesium.HeightReference.NONE;
                        break;
                    case "CLAMP_TO_GROUND":
                        entityattr.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
                        break;
                    case "RELATIVE_TO_GROUND":
                        entityattr.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
                        break;
                    default:
                        entityattr.heightReference = value;
                        break;
                }
                break;
            case "horizontalOrigin":
                switch (value) {
                    case "CENTER":
                        entityattr.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
                        break;
                    case "LEFT":
                        entityattr.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
                        break;
                    case "RIGHT":
                        entityattr.horizontalOrigin = Cesium.HorizontalOrigin.RIGHT;
                        break;
                    default:
                        entityattr.horizontalOrigin = value;
                        break;
                }
                break;
            case "verticalOrigin":
                switch (value) {
                    case "CENTER":
                        entityattr.verticalOrigin = Cesium.VerticalOrigin.CENTER;
                        break;
                    case "TOP":
                        entityattr.verticalOrigin = Cesium.VerticalOrigin.TOP;
                        break;
                    case "BOTTOM":
                        entityattr.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                        break;
                    default:
                        entityattr.verticalOrigin = value;
                        break;
                }
                break;
        }
    }

    return entityattr;
}

/***/ }),
