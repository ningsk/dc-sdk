/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Popup = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _zepto = __webpack_require__(8);

var _point = __webpack_require__(2);

var _util = __webpack_require__(1);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

var _index = __webpack_require__(20);

var attrUtil = _interopRequireWildcard(_index);

var _config2Entity = __webpack_require__(32);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//该类不仅仅是popup处理，是所有一些有关单击事件的统一处理入口（从效率考虑）。

var Popup = exports.Popup = function () {
    //========== 构造方法 ========== 
    function Popup(viewer, options) {
        _classCallCheck(this, Popup);

        this.viewer = viewer;
        this.options = options || {};

        this._isOnly = true;
        this._enable = true;
        this._depthTest = true;
        this.viewerid = viewer._container.id;
        this.objPopup = {};

        this.highlighted = {
            feature: undefined,
            originalColor: new Cesium.Color()
        };
        this.defaultHighlightedClr = Cesium.Color.fromCssColorString("#95e40c");

        //兼容历史接口
        this.getPopupForConfig = _util.getPopupForConfig;
        this.getPopup = _util.getPopup;

        //添加弹出框 
        var infoDiv = '<div id="' + this.viewerid + '-dc-pupup-all" ></div>';
        (0, _zepto.zepto)("#" + this.viewerid).append(infoDiv);

        //单击事件
        this.viewer.mars.on(_MarsClass.eventType.click, this.mousePickingClick, this);
        //移动事件
        this.viewer.scene.postRender.addEventListener(this.bind2scene, this);
    }

    //========== 对外属性 ==========  
    //显示单个模式


    _createClass(Popup, [{
        key: 'mousePickingClick',


        //========== 方法 ========== 

        //鼠标点击事件
        value: function mousePickingClick(event) {
            this.removeFeatureForImageryLayer();
            this.removeFeatureFor3dtiles();

            if (this._isOnly) this.close();
            if (!this._enable) return;

            var position = event.position;
            var pickedObject;
            try {
                pickedObject = this.viewer.scene.pick(position);
            } catch (e) {}

            var isFindPopup = false;
            var isFindClick = false;

            //存在单击的对象
            if (Cesium.defined(pickedObject)) {
                //普通entity对象 && viewer.scene.pickPositionSupported
                if (Cesium.defined(pickedObject.id) && pickedObject.id instanceof Cesium.Entity) {
                    var entity = pickedObject.id;

                    //popup
                    if (Cesium.defined(entity.popup)) {
                        var cartesian;
                        if (entity.billboard || entity.label || entity.point || entity.model) {
                            //对点状数据做特殊处理，
                            cartesian = entity.position;
                        } else {
                            cartesian = (0, _point.getCurrentMousePosition)(this.viewer.scene, position);
                        }
                        this.show(entity, cartesian, position);
                        isFindPopup = true;
                    }

                    //单击对象所关联的管理类(基于MarsClass)，进行click事件抛出。
                    if (entity.eventTarget && entity.eventTarget.fire) {
                        entity.eventTarget.fire(_MarsClass.eventType.click, {
                            sourceTarget: entity,
                            position: position
                        });
                        isFindClick = true;
                    }
                    //加统一的click处理
                    else if (entity.click && typeof entity.click === 'function') {
                            entity.click(entity, position);
                            isFindClick = true;
                        }
                }
                //单体化3dtiles数据的处理(如：BIM的构件，城市白膜建筑)
                else if (Cesium.defined(pickedObject.tileset) && Cesium.defined(pickedObject.getProperty)) {
                        //取属性
                        var attr = {};
                        var names = pickedObject.getPropertyNames();
                        for (var i = 0; i < names.length; i++) {
                            var name = names[i];
                            if (!pickedObject.hasProperty(name)) continue;

                            var val = pickedObject.getProperty(name);
                            if (val == null) continue;
                            attr[name] = val;
                        }

                        var cfg = pickedObject.tileset._config || pickedObject.tileset;
                        if (cfg) {
                            //popup
                            if (Cesium.defined(cfg.popup)) {
                                var cartesian = (0, _point.getCurrentMousePosition)(this.viewer.scene, position);
                                var item = {
                                    id: pickedObject._batchId,
                                    popup: (0, _util.bindLayerPopup)(cfg.popup, function (entity) {
                                        return (0, _util.getPopupForConfig)(cfg, attr);
                                    }),
                                    popupPosition: cfg.popupPosition,
                                    data: attr
                                };
                                this.show(item, cartesian, position);
                                isFindPopup = true;
                            }

                            //高亮显示单体对象
                            if (cfg.showClickFeature) {
                                if (cfg.clickFeatureColor) {
                                    //兼容历史写法
                                    cfg.pickFeatureStyle = cfg.pickFeatureStyle || {};
                                    cfg.pickFeatureStyle.color = cfg.clickFeatureColor;
                                }
                                this.showFeatureFor3dtiles(pickedObject, cfg.pickFeatureStyle);
                            }

                            //单击对象所关联的管理类(基于MarsClass)，进行click事件抛出。
                            if (pickedObject.tileset.eventTarget && pickedObject.tileset.eventTarget.fire) {
                                pickedObject.tileset.eventTarget.fire(_MarsClass.eventType.click, {
                                    sourceTarget: pickedObject,
                                    tileset: pickedObject.tileset,
                                    data: attr,
                                    position: position
                                });
                                isFindClick = true;
                            }
                            //加统一的click处理
                            else if (cfg.click && typeof cfg.click === 'function') {
                                    cfg.click({ attr: attr, feature: pickedObject, tileset: pickedObject.tileset }, position);
                                    isFindClick = true;
                                }
                        }
                    }
                    //primitive对象 
                    else if (Cesium.defined(pickedObject.primitive)) {
                            var primitive = pickedObject.primitive;

                            //popup
                            if (Cesium.defined(primitive.popup)) {
                                var cartesian = (0, _point.getCurrentMousePosition)(this.viewer.scene, position);
                                this.show(primitive, cartesian, position);
                                isFindPopup = true;
                            }

                            //单击对象所关联的管理类(基于MarsClass)，进行click事件抛出。
                            if (primitive.eventTarget && primitive.eventTarget.fire) {
                                primitive.eventTarget.fire(_MarsClass.eventType.click, {
                                    sourceTarget: primitive,
                                    position: position
                                });
                                isFindClick = true;
                            }
                            //加统一的click处理
                            else if (primitive.click && typeof primitive.click === 'function') {
                                    primitive.click(primitive, position);
                                    isFindClick = true;
                                }
                        } else {
                            //未单击到矢量或模型数据时  
                            marslog.log(pickedObject);
                        }
            }

            if (!isFindPopup) {
                this.pickImageryLayerFeatures(position);
            }

            //单击地图空白（未单击到矢量或模型数据）时
            if (!isFindClick) {
                this.viewer.mars.fire(_MarsClass.eventType.clickMap, {
                    position: position
                });
            }
        }

        //瓦片图层上的矢量对象，动态获取

    }, {
        key: 'pickImageryLayerFeatures',
        value: function pickImageryLayerFeatures(position) {
            var scene = this.viewer.scene;
            var pickRay = scene.camera.getPickRay(position); //position : Cesium.Cartesian2
            var imageryLayerFeaturePromise = scene.imageryLayers.pickImageryLayerFeatures(pickRay, scene);
            if (!Cesium.defined(imageryLayerFeaturePromise)) {
                return;
            }

            var that = this;
            Cesium.when(imageryLayerFeaturePromise, function (features) {
                if (!Cesium.defined(features) || features.length === 0) {
                    return;
                }

                //单击选中的要素对象
                var feature = features[0];
                if (feature.imageryLayer == null || feature.imageryLayer.config == null) return;
                var cfg = feature.imageryLayer.config;

                that.pickFeatures(feature, position, cfg);

                //单击对象所关联的管理类(基于MarsClass)，进行click事件抛出。
                if (feature.imageryLayer.eventTarget && feature.imageryLayer.eventTarget.fire) {
                    feature.imageryLayer.eventTarget.fire(_MarsClass.eventType.click, {
                        sourceTarget: feature.imageryLayer,
                        features: features,
                        position: position
                    });
                } else if (cfg.click && typeof cfg.click === 'function') {
                    cfg.click(features, position); //返回所有的features
                }
            }, function (e) {
                marslog.warn(e);
            });
        }
    }, {
        key: 'pickFeatures',
        value: function pickFeatures(feature, viewerPoint, cfg) {
            //属性
            var attr = feature.properties;
            if (!Cesium.defined(attr) && feature.data) {
                attr = feature.data.properties || feature.data.attributes;
            }

            //显示popup
            var result = (0, _util.getPopupForConfig)(cfg, attr);
            if (result) {
                var position = (0, _point.getCurrentMousePosition)(this.viewer.scene, viewerPoint);
                this.show({
                    id: 'imageryLayerFeaturePromise',
                    popup: {
                        html: result,
                        anchor: cfg.popupAnchor || [0, -12]
                    },
                    popupPosition: cfg.popupPosition
                }, position, viewerPoint);
            }

            //显示要素
            if (cfg.showClickFeature && feature.data) {
                if (feature.data.geometry && JSON.stringify(feature.data.geometry).length > Cesium.defaultValue(cfg.pickFeatureMax, 9000)) {
                    //配置有maxLength时，屏蔽大数据下的页面卡顿 
                    marslog.log(feature.data.geometry);
                    return;
                }

                this.showFeatureForImageryLayer(feature.data, cfg.pickFeatureStyle);
            }
        }

        //popup处理

    }, {
        key: 'show',
        value: function show(entity, cartesian, viewPoint) {
            if (entity == null || entity.popup == null) return;

            if (!cartesian) {
                //外部直接传入entity调用show时，可以不传入坐标，自动取值
                cartesian = attrUtil.getCenterPosition(entity);
            }

            //对点状贴地数据做特殊处理，
            var graphic = entity.billboard || entity.label || entity.point || entity.model;
            if (graphic && graphic.heightReference) {
                cartesian = (0, _point.getPositionValue)(cartesian);

                var tempCarto = Cesium.Cartographic.fromCartesian(cartesian);
                if (tempCarto) {
                    // && tempCarto.height == 0
                    var that = this;
                    if (graphic.heightReference._value == Cesium.HeightReference.CLAMP_TO_GROUND) {
                        //贴地点，重新计算高度
                        cartesian = (0, _point.setPositionSurfaceHeight)(this.viewer, cartesian, {
                            asyn: true,
                            callback: function callback(newHeight, cartOld) {
                                //marslog.log("原始高度为：" + cartOld.height.toFixed(2) + ",贴地高度：" + newHeight.toFixed(2))

                                var cartesianNew = Cesium.Cartesian3.fromRadians(cartOld.longitude, cartOld.latitude, newHeight);
                                that._showView(entity, cartesianNew, viewPoint);
                            }
                        });
                        return;
                    } else if (graphic.heightReference._value == Cesium.HeightReference.RELATIVE_TO_GROUND) {
                        cartesian = (0, _point.setPositionSurfaceHeight)(this.viewer, cartesian, {
                            relativeHeight: true,
                            asyn: true,
                            callback: function callback(newHeight, cartOld) {
                                //marslog.log("原始高度为：" + cartOld.height.toFixed(2) + ",贴地高度：" + newHeight.toFixed(2))

                                var cartesianNew = Cesium.Cartesian3.fromRadians(cartOld.longitude, cartOld.latitude, newHeight);
                                that._showView(entity, cartesianNew, viewPoint);
                            }
                        });
                        return;
                    }
                }
            }

            this._showView(entity, cartesian, viewPoint);
        }
    }, {
        key: '_showView',
        value: function _showView(entity, cartesian, viewPoint) {
            var eleId = this.getPopupId(entity);
            this.close(eleId);

            this.objPopup[eleId] = {
                id: entity.id,
                popup: entity.popup,
                popupPosition: entity.popupPosition, //配置的固定位置 类似弹窗
                entity: entity,
                cartesian: cartesian,
                viewPoint: viewPoint
            };

            //显示内容
            var inhtml;
            if (_typeof(entity.popup) === 'object') {
                inhtml = entity.popup.html;
                this.objPopup[eleId].onAdd = entity.popup.onAdd;
                this.objPopup[eleId].onRemove = entity.popup.onRemove;

                if (typeof entity.popup.visible === 'function') {
                    if (!entity.popup.visible(entity)) {
                        return;
                    }
                }
            } else {
                inhtml = entity.popup;
            }
            if (!inhtml) return;

            var that = this;
            if (typeof inhtml === 'function') {
                //回调方法 
                inhtml = inhtml(entity, cartesian, function (inhtml) {
                    that._camera_cache = null;
                    (0, _zepto.zepto)("#" + eleId).remove();
                    that._showHtml(inhtml, eleId, entity, cartesian, viewPoint);
                });
            }

            if (!inhtml) return;

            this._showHtml(inhtml, eleId, entity, cartesian, viewPoint);
        }
    }, {
        key: 'getItem',
        value: function getItem(eleId) {
            return this.objPopup[eleId];
        }
    }, {
        key: '_showHtml',
        value: function _showHtml(inhtml, eleId, entity, cartesian, viewPoint) {
            (0, _zepto.zepto)('#' + this.viewerid + '-dc-pupup-all').append('<div id="' + eleId + '" class="dc-popup">' + '            <a id="' + eleId + '-popup-close" data-id="' + eleId + '" class="dc-popup-close-button dc-popup-color" >×</a>' + '            <div class="dc-popup-content-wrapper dc-popup-background">' + '                <div class="dc-popup-content dc-popup-color">' + inhtml + '</div>' + '            </div>' + '            <div id="' + eleId + '-popup-btmtip" class="dc-popup-tip-container"><div class="dc-popup-tip dc-popup-background"></div></div>' + '        </div>');

            var that = this;
            (0, _zepto.zepto)('#' + eleId + '-popup-close').click(function () {
                var eleId = (0, _zepto.zepto)(this).attr("data-id");
                that.close(eleId, true);
            });

            //计算显示位置
            if (entity.popupPosition) {
                //固定显示，类似弹窗
                this.showFixViewPoint(eleId, entity.popup, entity.popupPosition);
                (0, _zepto.zepto)('#' + eleId + '-popup-btmtip').remove(); //去掉小箭头
            } else {
                this._camera_cache = null;

                var result = this.updateViewPoint(eleId, cartesian, entity.popup, viewPoint);
                if (!result && this._depthTest) {
                    this.close(eleId);
                    return;
                }
            }

            //popup的DOM添加到页面的回调方法
            if (this.objPopup[eleId] && this.objPopup[eleId].onAdd) {
                this.objPopup[eleId].onAdd(eleId, entity);
            }
        }
    }, {
        key: 'updateViewPoint',
        value: function updateViewPoint(eleId, position, popup, point) {
            var _position = (0, _point.getPositionValue)(position);
            if (!Cesium.defined(_position)) {
                return false;
            }

            //如果视角和位置都没有变化，直接返回
            var camera = this.viewer.camera;
            var _thiscache = _position.x + '=' + _position.y + '-' + _position.z + '-' + camera.positionWC.x + '=' + camera.positionWC.y + '-' + camera.positionWC.z + '-' + camera.heading + '-' + camera.pitch + '-' + camera.roll;
            if (_thiscache == this._camera_cache) {
                return true;
            }
            this._camera_cache = _thiscache;
            //如果视角和位置都没有变化，直接返回

            var newpoint = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, _position);
            if (Cesium.defined(newpoint)) {
                point = newpoint;
                if (this.objPopup[eleId]) this.objPopup[eleId].viewPoint = newpoint;
            }

            var _dom = (0, _zepto.zepto)("#" + eleId);
            if (!Cesium.defined(point)) {
                marslog.log('wgs84ToWindowCoordinates无法转换为屏幕坐标');
                _dom.hide();
                return true;
            }

            //判断是否在球的背面
            var scene = this.viewer.scene;
            if (this._depthTest && scene.mode === Cesium.SceneMode.SCENE3D) {
                //三维模式下  
                var occluder = new Cesium.EllipsoidalOccluder(scene.globe.ellipsoid, scene.camera.positionWC);
                var visible = occluder.isPointVisible(_position);
                //visible为true说明点在球的正面，否则点在球的背面。 
                //需要注意的是不能用这种方法判断点的可见性，如果球放的比较大，点跑到屏幕外面，它返回的依然为true
                if (!visible) {
                    _dom.hide();
                    return true;
                }
            }
            //判断是否在球的背面

            _dom.show();

            //更新html ，实时更新
            if ((typeof popup === 'undefined' ? 'undefined' : _typeof(popup)) === 'object' && popup.timeRender && popup.html && typeof popup.html === 'function') {
                var inhtml = popup.html(this.objPopup[eleId] && this.objPopup[eleId].entity, _position);
                (0, _zepto.zepto)("#" + eleId + " .dc-popup-content").html(inhtml);
            }

            var x = point.x - _dom.width() / 2;
            var y = point.y - _dom.height();

            if (popup && (typeof popup === 'undefined' ? 'undefined' : _typeof(popup)) === 'object' && popup.anchor) {
                x += popup.anchor[0];
                y += popup.anchor[1];
            }
            _dom.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');

            return true;
        }

        //固定显示再一个配置的popupPosition位置（类似弹窗）

    }, {
        key: 'showFixViewPoint',
        value: function showFixViewPoint(eleId, popup, popupPosition) {
            //更新html ，实时更新
            if ((typeof popup === 'undefined' ? 'undefined' : _typeof(popup)) === 'object' && popup.timeRender && popup.html && typeof popup.html === 'function') {
                var inhtml = popup.html(this.objPopup[eleId] && this.objPopup[eleId].entity, _position);
                (0, _zepto.zepto)("#" + eleId + " .dc-popup-content").html(inhtml);
            }

            var _dom = (0, _zepto.zepto)("#" + eleId);

            var x = 0;
            if (Cesium.defined(popupPosition.left)) x = popupPosition.left;
            if (Cesium.defined(popupPosition.right)) {
                x = document.documentElement.clientWidth - _dom.width() - popupPosition.right;
            }

            var y = 0;
            if (Cesium.defined(popupPosition.top)) y = popupPosition.top;
            if (Cesium.defined(popupPosition.bottom)) {
                y = document.documentElement.clientHeight - _dom.height() - popupPosition.bottom;
            }

            _dom.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');

            return true;
        }
    }, {
        key: 'bind2scene',
        value: function bind2scene() {
            for (var i in this.objPopup) {
                var item = this.objPopup[i];
                if (item.popupPosition) continue;

                var result = this.updateViewPoint(i, item.cartesian, item.popup, item.viewPoint);
                if (!result && this._depthTest) {
                    this.close(i);
                }
            }
        }
    }, {
        key: 'getPopupId',
        value: function getPopupId(entity) {
            var eleId = this.viewerid + 'popup_' + ((entity.id || "") + "").replace(new RegExp("[^0-9a-zA-Z\_]", "gm"), "_");
            return eleId;
        }
    }, {
        key: 'close',
        value: function close(eleId, removFea) {
            if (!this._isOnly && eleId) {
                if ((typeof eleId === 'undefined' ? 'undefined' : _typeof(eleId)) === 'object') {
                    //传入参数是eneity对象                
                    eleId = this.getPopupId(eleId);
                }

                for (var i in this.objPopup) {
                    if (eleId == this.objPopup[i].id || eleId == i) {

                        //popup的DOM从页面移除的回调方法
                        if (this.objPopup[i] && this.objPopup[i].onRemove) {
                            this.objPopup[i].onRemove(i, this.objPopup[i].entity);
                        }

                        (0, _zepto.zepto)("#" + i).remove();
                        delete this.objPopup[i];
                        break;
                    }
                }
            } else {
                for (var i in this.objPopup) {
                    //popup的DOM从页面移除的回调方法
                    if (this.objPopup[i] && this.objPopup[i].onRemove) {
                        this.objPopup[i].onRemove(i, this.objPopup[i].entity);
                    }
                }

                (0, _zepto.zepto)('#' + this.viewerid + '-dc-pupup-all').empty();
                this.objPopup = {};
            }
            this._camera_cache = null;

            if (removFea) {
                this.removeFeatureForImageryLayer();
                this.removeFeatureFor3dtiles();
            }
        }

        //=====================单击高亮对象处理========================
        //单击Tile瓦片时同步，高亮显示要素处理

    }, {
        key: 'removeFeatureForImageryLayer',
        value: function removeFeatureForImageryLayer() {
            if (this.lastShowFeature == null) return;
            this.viewer.dataSources.remove(this.lastShowFeature);
            this.lastShowFeature = null;
        }
    }, {
        key: 'showFeatureForImageryLayer',
        value: function showFeatureForImageryLayer(item, style) {
            var that = this;
            this.removeFeatureForImageryLayer();

            var feature = item;
            if (item.geometryType && item.geometryType.indexOf('esri') != -1) {
                //arcgis图层时 
                var L = window.dc.L || window.L;
                if (L && L.esri) {
                    feature = L.esri.Util.arcgisToGeoJSON(item.geometry);
                } else {
                    marslog.warn('需要引入 mars-esri 插件解析arcgis标准的json数据！');
                    return;
                }
            } else if (item.geometry && item.geometry.type) {
                var L = window.dc.L || window.L;
                if (L) {
                    //处理数据里面的坐标为4326
                    var geojson = L.geoJSON(item.geometry, {
                        coordsToLatLng: function coordsToLatLng(coords) {
                            if (coords[0] > 180 || coords[0] < -180) {
                                return L.CRS.EPSG3857.unproject(L.point(coords[0], coords[1]));
                            }
                            return new L.LatLng(coords[1], coords[0], coords[2]);
                        }
                    });
                    feature = geojson.toGeoJSON();
                }
            }

            if (feature == null) return;

            var loadOpts;
            if (style) {
                loadOpts = {
                    clampToGround: Cesium.defaultValue(style.clampToGround, false),
                    fill: Cesium.Color.fromCssColorString(Cesium.defaultValue(style.color, "#FFFF00")).withAlpha(Number(Cesium.defaultValue(style.opacity, 0.5))),
                    stroke: Cesium.Color.fromCssColorString(style.outlineColor || style.color || "#FFFFFF").withAlpha(Cesium.defaultValue(style.outlineOpacity, Cesium.defaultValue(style.opacity, 1.0))),
                    strokeWidth: Cesium.defaultValue(style.outlineWidth, 1)
                };
            }

            var dataSource = Cesium.GeoJsonDataSource.load(feature, loadOpts);
            dataSource.then(function (dataSource) {
                that.viewer.dataSources.add(dataSource);
                that.lastShowFeature = dataSource;

                if (style) {
                    var entities = dataSource.entities.values;
                    (0, _config2Entity.style2Entity)(entities, style);

                    if (Cesium.defined(style.showTime)) {
                        //定时自动关闭
                        setTimeout(function () {
                            that.removeFeatureForImageryLayer();
                        }, style.showTime);
                    }
                }
            }).otherwise(function (error) {
                marslog.warn(error);
            });
        }

        //单击3dtiles单体化，高亮显示构件处理

    }, {
        key: 'removeFeatureFor3dtiles',
        value: function removeFeatureFor3dtiles() {
            if (Cesium.defined(this.highlighted.feature)) {
                try {
                    this.highlighted.feature.color = this.highlighted.originalColor;
                } catch (ex) {}
                this.highlighted.feature = undefined;
            }
        }
    }, {
        key: 'showFeatureFor3dtiles',
        value: function showFeatureFor3dtiles(pickedFeature, style) {
            this.removeFeatureFor3dtiles();
            this.highlighted.feature = pickedFeature;

            Cesium.Color.clone(pickedFeature.color, this.highlighted.originalColor);

            if (style) {
                pickedFeature.color = Cesium.Color.fromCssColorString(Cesium.defaultValue(style.color, "#FFFF00")).withAlpha(Number(Cesium.defaultValue(style.opacity, 1.0)));
            } else {
                pickedFeature.color = this.defaultHighlightedClr;
            }
        }

        //=================================================


    }, {
        key: 'destroy',
        value: function destroy() {
            this.close();
            this.viewer.scene.postRender.removeEventListener(this.bind2scene, this);
            this.viewer.mars.off(_MarsClass.eventType.click, this.mousePickingClick, this);

            (0, _zepto.zepto)('#' + this.viewerid + '-dc-pupup-all').remove();

            //删除所有绑定的数据
            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: 'isOnly',
        get: function get() {
            return this._isOnly;
        },
        set: function set(val) {
            this._isOnly = val;
        }

        //是否禁用

    }, {
        key: 'enable',
        get: function get() {
            return this._enable;
        },
        set: function set(value) {
            this._enable = value;
            if (!value) {
                this.close();
            }
        }

        //是否打开深度判断（true时判断是否在球背面）

    }, {
        key: 'depthTest',
        get: function get() {
            return this._depthTest;
        },
        set: function set(value) {
            this._depthTest = value;
        }
    }]);

    return Popup;
}();

/***/ }),
