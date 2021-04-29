/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TerrainClipPlan = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

var _CustomPlaneGeometry = __webpack_require__(83);

var _WellNoBottom = __webpack_require__(84);

var _util = __webpack_require__(1);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//地形开挖 类（平面 Plan原生）
var TerrainClipPlan = exports.TerrainClipPlan = function (_MarsClass) {
    _inherits(TerrainClipPlan, _MarsClass);

    //========== 构造方法 ========== 
    function TerrainClipPlan(options, oldparam) {
        _classCallCheck(this, TerrainClipPlan);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (TerrainClipPlan.__proto__ || Object.getPrototypeOf(TerrainClipPlan)).call(this, options));

        if (oldparam) {
            oldparam.viewer = options;
            options = oldparam;
        }
        _this.updateData = _this.setPositions;
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

        _this.options = options;
        _this.viewer = options.viewer;

        _this._height = _this.options.height || 0;
        _this._showWall = Cesium.defaultValue(options.wall, true); //是否显示挖掘的底部和wall
        _this.bottomImg = options.bottomImg;
        _this.wallImg = options.wallImg;
        _this.opacityImg = Cesium.defaultValue(options.opacity, 1.0);
        _this.splitNum = Cesium.defaultValue(options.splitNum, 50);

        if (options.positions && options.positions.length > 0) {
            _this.setPositions(options.positions);
        }
        return _this;
    }

    //========== 对外属性 ==========  
    //挖掘深度


    _createClass(TerrainClipPlan, [{
        key: "setPositions",

        //========== 方法 ========== 

        // 创建裁剪面
        value: function setPositions(points) {
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this.clear();

            if (!points || points.length < 3) {
                marslog.warn("挖地坐标数据存在问题！");
                return;
            }
            this._positions = points;

            var clippingPlanes = [];
            var pointsLength = points.length;

            var unionClippingRegions = Cesium.defaultValue(opts.unionClippingRegions, false); //true时外切

            //是否顺时针 
            var startAngle = (0, _util.getAngle)(points[0], points[1]);
            var endAngle = (0, _util.getAngle)(points[0], points[2]);
            var direction = startAngle < endAngle;
            if (unionClippingRegions) direction = !direction;

            this.excavateMinHeight = 9999;

            for (var i = 0; i < pointsLength; ++i) {
                var nextIndex = (i + 1) % pointsLength;
                var midpoint = Cesium.Cartesian3.midpoint(points[i], points[nextIndex], new Cesium.Cartesian3());

                var tempCarto = Cesium.Cartographic.fromCartesian(points[i]);
                var heightTerrain = this.viewer.scene.globe.getHeight(tempCarto) || tempCarto.height; //地形高度 
                if (heightTerrain < this.excavateMinHeight) {
                    this.excavateMinHeight = heightTerrain;
                }

                var up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
                var right;
                if (direction) {
                    //顺时针
                    right = Cesium.Cartesian3.subtract(points[i], midpoint, new Cesium.Cartesian3());
                } else {
                    right = Cesium.Cartesian3.subtract(points[nextIndex], midpoint, new Cesium.Cartesian3());
                }
                right = Cesium.Cartesian3.normalize(right, right);
                var normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
                normal = Cesium.Cartesian3.normalize(normal, normal);
                var originCenteredPlane = new Cesium.Plane(normal, 0.0);
                var distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint);
                clippingPlanes.push(new Cesium.ClippingPlane(normal, distance));
            }

            this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
                planes: clippingPlanes,
                edgeWidth: Cesium.defaultValue(opts.edgeWidth, 1.0),
                edgeColor: Cesium.defaultValue(opts.edgeColor, Cesium.Color.WHITE),
                enabled: true,
                unionClippingRegions: unionClippingRegions
            });

            if (this._showWall) {
                this._prepareWell(points);
                this._createWell(this.wellData);
            }
        }

        //准备井数据

    }, {
        key: "_prepareWell",
        value: function _prepareWell(arr) {
            var splitNum = this.splitNum;
            var len = arr.length;
            if (len == 0) return;
            var targetHeight = this.excavateMinHeight - this.height;
            this.targetHeight = targetHeight;
            var no_height_top = [];
            var bottom_pos = [];
            var lerp_pos = [];
            for (var i = 0; i < len; i++) {
                var static_i = i == len - 1 ? 0 : i + 1;
                var currRad = Cesium.Cartographic.fromCartesian(arr[i]);
                var nextRad = Cesium.Cartographic.fromCartesian(arr[static_i]);
                var pos1 = [currRad.longitude, currRad.latitude];
                var pos2 = [nextRad.longitude, nextRad.latitude];
                // if (i == 0) {
                //     lerp_pos.push(new Cesium.Cartographic(pos1[0], pos1[1]));
                //     bottom_pos.push(Cesium.Cartesian3.fromRadians(pos1[0], pos1[1], targetHeight));
                //     no_height_top.push(Cesium.Cartesian3.fromRadians(pos1[0], pos1[1], 0));
                // }
                for (var j = 0; j < splitNum; j++) {
                    var curr_pos_lon = Cesium.Math.lerp(pos1[0], pos2[0], j / splitNum);
                    var curr_pos_lat = Cesium.Math.lerp(pos1[1], pos2[1], j / splitNum);
                    // if (!(i == len - 1 && j == splitNum)) {
                    lerp_pos.push(new Cesium.Cartographic(curr_pos_lon, curr_pos_lat));
                    bottom_pos.push(Cesium.Cartesian3.fromRadians(curr_pos_lon, curr_pos_lat, targetHeight));
                    no_height_top.push(Cesium.Cartesian3.fromRadians(curr_pos_lon, curr_pos_lat, 0));
                    // }
                }
            }
            this.wellData = {
                lerp_pos: lerp_pos,
                bottom_pos: bottom_pos,
                no_height_top: no_height_top
            };
        }
        //创建井

    }, {
        key: "_createWell",
        value: function _createWell(options) {
            var hasTerrain = Boolean(this.viewer.terrainProvider._layers);
            if (hasTerrain) {
                var self = this;
                this._createBottomSurface(options.bottom_pos);
                var promise = Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider, options.lerp_pos);
                var maxHeight = -9999;
                Cesium.when(promise, function (updatedPositions) {
                    var len = updatedPositions.length;
                    var top_pos = [];
                    var top_heights = [];
                    for (var k = 0; k < len; k++) {
                        top_heights.push(updatedPositions[k].height);
                        if (updatedPositions[k].height > maxHeight) maxHeight = updatedPositions[k].height;
                        var top_car = Cesium.Cartesian3.fromRadians(updatedPositions[k].longitude, updatedPositions[k].latitude, updatedPositions[k].height);
                        top_pos.push(top_car);
                    }
                    self.maxHeight = maxHeight;
                    self.top_heights = top_heights;
                    self._createWellWall(options.bottom_pos, top_pos);
                    self.viewer.scene.primitives.add(self.wellWall);
                });
            } else {
                this._createBottomSurface(options.bottom_pos);
                this._createWellWall(options.bottom_pos, options.no_height_top);
                this.viewer.scene.primitives.add(this.wellWall);
            }
        }
        //创建井壁

    }, {
        key: "_createWellWall",
        value: function _createWellWall(bottom, top) {
            var geo = new _WellNoBottom.WellNoBottom({
                minimumArr: bottom,
                maximumArr: top
            });
            geo = geo.createGeometry(geo, this);
            var _material = new Cesium.Material({
                fabric: {
                    type: 'Image',
                    uniforms: {
                        image: this.wallImg,
                        color: Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(this.opacityImg)
                    }
                }
            });
            var _appearance = new Cesium.MaterialAppearance({
                translucent: false,
                flat: true,
                material: _material
            });
            this.wellWall = new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: geo,
                    attributes: {
                        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREY)
                    },
                    id: 'PitWall'
                }),
                appearance: _appearance,
                asynchronous: false
            });
            this.viewer.scene.primitives.add(this.wellWall);
        }
        //创建井底

    }, {
        key: "_createBottomSurface",
        value: function _createBottomSurface(bottom_pos) {
            if (!bottom_pos.length) {
                return;
            }
            var geo = new _CustomPlaneGeometry.CustomPlaneGeometry({
                pos_arr: bottom_pos
            });
            geo = geo.createGeometry(geo);
            var _material = new Cesium.Material({
                fabric: {
                    type: 'Image',
                    uniforms: {
                        image: this.bottomImg,
                        color: Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(this.opacityImg)
                    }
                }
            });
            var _appearance = new Cesium.MaterialAppearance({
                translucent: false,
                flat: true,
                material: _material
            });
            this.bottomSurface = new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: geo
                }),
                appearance: _appearance,
                asynchronous: false
            });
            this.viewer.scene.primitives.add(this.bottomSurface);
        }

        //切换挖掘显隐

    }, {
        key: "_switchExcavate",
        value: function _switchExcavate(val) {
            if (val) {
                if (this.wellWall) this.wellWall.show = true;
                if (this.bottomSurface) this.bottomSurface.show = true;
            } else {
                if (this.wellWall) this.wellWall.show = false;
                if (this.bottomSurface) this.bottomSurface.show = false;
            }
        }

        //更新挖掘深度

    }, {
        key: "_updateExcavateDepth",
        value: function _updateExcavateDepth(depth) {
            if (!this.wellData) return;

            this.bottomSurface && this.viewer.scene.primitives.remove(this.bottomSurface);
            this.wellWall && this.viewer.scene.primitives.remove(this.wellWall);

            var lerp_pos = this.wellData.lerp_pos;
            var bottom_pos = [];
            var len = lerp_pos.length;
            for (var i = 0; i < len; i++) {
                bottom_pos.push(Cesium.Cartesian3.fromRadians(lerp_pos[i].longitude, lerp_pos[i].latitude, this.excavateMinHeight - depth));
            }
            this.wellData.bottom_pos = bottom_pos;
            this._createWell(this.wellData);

            this.viewer.scene.primitives.add(this.bottomSurface);
            this.viewer.scene.primitives.add(this.wellWall);
        }

        //清除裁剪面

    }, {
        key: "clear",
        value: function clear() {
            if (this.viewer.scene.globe.clippingPlanes) {
                this.viewer.scene.globe.clippingPlanes.enabled = false;
                this.viewer.scene.globe.clippingPlanes.removeAll();
                if (!this.viewer.scene.globe.clippingPlanes.isDestroyed()) this.viewer.scene.globe.clippingPlanes.destroy();
            }
            this.viewer.scene.globe.clippingPlanes = undefined;

            if (this.bottomSurface) {
                this.viewer.scene.primitives.remove(this.bottomSurface);
                delete this.bottomSurface;
            }

            if (this.wellWall) {
                this.viewer.scene.primitives.remove(this.wellWall);
                delete this.wellWall;
            }
            delete this.wellData;
            this.viewer.scene.render();
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.clear();
            _get(TerrainClipPlan.prototype.__proto__ || Object.getPrototypeOf(TerrainClipPlan.prototype), "destroy", this).call(this);
        }
    }, {
        key: "show",
        get: function get() {
            return this._show;
        },
        set: function set(val) {
            this._show = val;

            if (this.viewer.scene.globe.clippingPlanes) this.viewer.scene.globe.clippingPlanes.enabled = val;

            if (this._showWall) {
                this._switchExcavate(val);
            }
        }

        //裁剪距离 

    }, {
        key: "height",
        get: function get() {
            return this._height;
        },
        set: function set(val) {
            this._height = val;

            if (this._showWall) {
                this._updateExcavateDepth(val);
            }
        }
    }, {
        key: "positions",
        get: function get() {
            return this._positions;
        },
        set: function set(val) {
            this._positions = val;
            this.setPositions(val);
        }
    }]);

    return TerrainClipPlan;
}(_MarsClass2.MarsClass);

/***/ }),
