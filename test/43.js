/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GeoJsonLayer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _util = __webpack_require__(1);

var _point = __webpack_require__(2);

var _config2Entity = __webpack_require__(32);

var _BaseLayer2 = __webpack_require__(15);

var _zepto = __webpack_require__(8);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GeoJsonLayer = exports.GeoJsonLayer = function (_BaseLayer) {
    _inherits(GeoJsonLayer, _BaseLayer);

    //========== 构造方法 ========== 
    function GeoJsonLayer(viewer, options) {
        _classCallCheck(this, GeoJsonLayer);

        var _this = _possibleConstructorReturn(this, (GeoJsonLayer.__proto__ || Object.getPrototypeOf(GeoJsonLayer)).call(this, viewer, options));

        _this.hasOpacity = true;
        _this.hasZIndex = true;
        return _this;
    }

    _createClass(GeoJsonLayer, [{
        key: 'create',
        value: function create() {
            var _this2 = this;

            //是建筑物单体化时
            if (this.options.dth) {
                var dthEvent = (0, _config2Entity.createDthEntity)(this.viewer, this.options.dth);

                if (this.options.dth.type == "click") {
                    this.on(_MarsClass.eventType.click, function (e) {
                        dthEvent.mouseover(e.sourceTarget);
                    });
                    this.viewer.mars.on(_MarsClass.eventType.clickMap, function (e) {
                        if (!_this2._visible) return;
                        dthEvent.mouseout();
                    });
                } else {
                    this.on(_MarsClass.eventType.mouseOver, function (e) {
                        dthEvent.mouseover(e.sourceTarget);
                    });
                    this.on(_MarsClass.eventType.mouseOut, function (e) {
                        dthEvent.mouseout();
                    });
                }
                this.dthEvent = dthEvent;
            }
        }
        //添加 

    }, {
        key: 'add',
        value: function add() {
            if (this.labelCollection && !this.viewer.scene.primitives.contains(this.labelCollection)) {
                this.viewer.scene.primitives.add(this.labelCollection);
            }

            if (!this.options.reload && this.dataSource) {
                //this.options.reload可以外部控制每次都重新请求数据
                this.viewer.dataSources.add(this.dataSource);
            } else {
                this.queryData();
            }
            _get(GeoJsonLayer.prototype.__proto__ || Object.getPrototypeOf(GeoJsonLayer.prototype), 'add', this).call(this);
        }
        //移除

    }, {
        key: 'remove',
        value: function remove() {
            //是建筑物单体化时
            if (this.dthEvent) {
                this.dthEvent.mouseout();
            }
            if (this.dataSource) {
                this.viewer.dataSources.remove(this.dataSource);
                delete this.dataSource;
            }
            if (this.labelCollection && this.viewer.scene.primitives.contains(this.labelCollection)) {
                this.viewer.scene.primitives.destroyPrimitives = false;
                this.viewer.scene.primitives.remove(this.labelCollection);
            }
            _get(GeoJsonLayer.prototype.__proto__ || Object.getPrototypeOf(GeoJsonLayer.prototype), 'remove', this).call(this);
        }
        //定位至数据区域

    }, {
        key: 'centerAt',
        value: function centerAt(duration) {
            if (this.options.extent || this.options.center) {
                this.viewer.mars.centerAt(this.options.extent || this.options.center, { duration: duration, isWgs84: true });
            } else {
                if (this.dataSource == null) return;
                this.viewer.mars.flyTo(this.dataSource.entities.values, { duration: duration });
            }
        }
    }, {
        key: 'clearData',
        value: function clearData() {
            if (this.dataSource) this.dataSource.entities.removeAll();

            if (this.labelCollection) this.labelCollection.removeAll();

            this.options.data = null;
        }
    }, {
        key: 'setData',
        value: function setData(geojson) {
            //兼容不同命名
            this.clearData();
            return this.queryData(geojson);
        }
        //是否贴地

    }, {
        key: 'hasClampToGround',
        value: function hasClampToGround() {
            if (this.options.clampToGround) return true;
            if (this.options.symbol && this.options.symbol.styleOptions && this.options.symbol.styleOptions.clampToGround) return true;
            return false;
        }
    }, {
        key: 'getLoadConfig',
        value: function getLoadConfig() {
            var config = (0, _util.getProxyUrl)(this.options);
            if (config.symbol && config.symbol.styleOptions) {
                var style = config.symbol.styleOptions;
                if (Cesium.defined(style.clampToGround)) {
                    config.clampToGround = style.clampToGround;
                }
                if (Cesium.defined(style.color)) {
                    var color = Cesium.Color.fromCssColorString(Cesium.defaultValue(style.color, "#FFFF00")).withAlpha(Number(Cesium.defaultValue(style.opacity, 0.5)));
                    config.fill = color;
                }
                if (Cesium.defined(style.outlineColor)) {
                    var outlineColor = Cesium.Color.fromCssColorString(style.outlineColor || style.color || "#FFFFFF").withAlpha(Cesium.defaultValue(style.outlineOpacity, Cesium.defaultValue(style.opacity, 1.0)));
                    config.stroke = outlineColor;
                }
                if (Cesium.defined(style.outlineWidth)) {
                    config.strokeWidth = style.outlineWidth;
                }
            }
            return config;
        }
    }, {
        key: 'queryData',
        value: function queryData(geojson) {
            var that = this;

            var config = this.getLoadConfig();
            geojson = geojson || config.url || config.data;
            if (!geojson) return; //没有需要加载的对象

            if (config.url) {
                _zepto.zepto.ajax({
                    type: "get",
                    dataType: "json",
                    url: config.url,
                    timeout: Cesium.defaultValue(config.timeout, 0), //永不超时
                    success: function success(geojson) {
                        var dataSource = Cesium.GeoJsonDataSource.load(geojson, config);
                        dataSource.then(function (dataSource) {
                            that.showResult(dataSource);
                        }).otherwise(function (error) {
                            that.showError("服务出错", error);
                        });
                    },
                    error: function error(XMLHttpRequest, textStatus, errorThrown) {
                        marslog.warn(config.url + "文件加载失败！");
                    }
                });
            } else {
                this.options.data = geojson;
                var dataSource = Cesium.GeoJsonDataSource.load(geojson, config);
                dataSource.then(function (dataSource) {
                    that.showResult(dataSource);
                }).otherwise(function (error) {
                    that.showError("服务出错", error);
                });
            }
        }
    }, {
        key: 'showResult',
        value: function showResult(dataSource) {
            var _this3 = this;

            if (this.dataSource) {
                this.viewer.dataSources.remove(this.dataSource);
                delete this.dataSource;
            }
            if (this.labelCollection) {
                this.labelCollection.removeAll();
            }

            if (!this._visible) return;

            this.dataSource = dataSource;
            this.dataSource.order = this.options.order;
            this.viewer.dataSources.add(dataSource);

            if (this.hasZIndex) this.setZIndex(this.options.order);

            if (this.options.flyTo) this.centerAt(this.options.flyToDuration);

            //根据config配置，更新entitys 
            this.options.getAttrVal = function (entity) {
                return _this3.getEntityAttr(entity);
            };
            this.options.eventTarget = this;

            var entities = dataSource.entities.values;
            (0, _config2Entity.config2Entity)(entities, this.options, function (position, labelattr, attr) {
                return _this3.lblAddFun(position, labelattr, attr);
            });

            if (this._opacity != 1) this.setOpacity(this._opacity);

            this.fire(_MarsClass.eventType.load, {
                dataSource: dataSource,
                entities: entities
            });
        }
    }, {
        key: 'updateStyle',
        value: function updateStyle(symbol) {
            var _this4 = this;

            if (!this.dataSource) return;

            if (symbol) {
                this.options.symbol = _extends({}, this.options.symbol, symbol);
            }

            var entities = this.dataSource.entities.values;
            (0, _config2Entity.config2Entity)(entities, this.options, function (position, labelattr, attr) {
                return _this4.lblAddFun(position, labelattr, attr);
            });
        }
    }, {
        key: 'lblAddFun',
        value: function lblAddFun(position, labelattr, attr) {
            if (labelattr.text == "") return null;

            if (Cesium.defined(labelattr.height)) {
                position = (0, _point.setPositionsHeight)(position, labelattr.height);
            }

            //entity方式
            var lblEx = this.dataSource.entities.add({
                position: position,
                label: labelattr,
                properties: attr
            });

            //LabelCollection方式
            // if (!this.labelCollection) {
            //     this.labelCollection = new Cesium.LabelCollection({ scene: this.viewer.scene });
            //     this.viewer.scene.primitives.add(this.labelCollection);
            // }
            // labelattr.position = position;
            // var lblEx = this.labelCollection.add(labelattr);
            // lblEx.properties = attr;

            return lblEx;
        }
        //刷新事件

    }, {
        key: 'refreshEvent',
        value: function refreshEvent() {
            if (this.dataSource == null) return false;

            var entities = this.dataSource.entities.values;
            for (var i = 0, len = entities.length; i < len; i++) {
                var entity = entities[i];

                entity.eventTarget = this;
                entity.contextmenuItems = this.options.contextmenuItems;
            }
            return true;
        }
        //设置透明度

    }, {
        key: 'setOpacity',
        value: function setOpacity(value) {
            this._opacity = value;
            if (this.dataSource == null) return;

            var entities = this.dataSource.entities.values;

            for (var i = 0, len = entities.length; i < len; i++) {
                var entity = entities[i];

                if (entity.polygon && entity.polygon.material && entity.polygon.material.color) {
                    this._updatEntityAlpha(entity.polygon.material.color, this._opacity);
                    if (entity.polygon.outlineColor) {
                        this._updatEntityAlpha(entity.polygon.outlineColor, this._opacity);
                    }
                }

                if (entity.polyline && entity.polyline.material && entity.polyline.material.color) {
                    this._updatEntityAlpha(entity.polyline.material.color, this._opacity);
                }

                if (entity.billboard) {
                    entity.billboard.color = Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(this._opacity);
                }

                if (entity.model) {
                    entity.model.color = Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(this._opacity);
                }

                if (entity.label) {
                    var _opacity = this._opacity;
                    if (entity.styleOpt && entity.styleOpt.label && entity.styleOpt.label.opacity) _opacity = entity.styleOpt.label.opacity;

                    if (entity.label.fillColor) this._updatEntityAlpha(entity.label.fillColor, _opacity);
                    if (entity.label.outlineColor) this._updatEntityAlpha(entity.label.outlineColor, _opacity);
                    if (entity.label.backgroundColor) this._updatEntityAlpha(entity.label.backgroundColor, _opacity);
                }
            }
        }
    }, {
        key: '_updatEntityAlpha',
        value: function _updatEntityAlpha(color, opacity) {
            if (!color) return;
            var newclr = color.getValue(this.viewer.clock.currentTime);
            if (!newclr || !newclr.withAlpha) return color;

            newclr = newclr.withAlpha(opacity);
            color.setValue(newclr);
        }

        //设置叠加顺序

    }, {
        key: 'setZIndex',
        value: function setZIndex(order) {
            if (this.dataSource == null || order == null) return;
            if (!this.viewer.dataSources.contains(this.dataSource)) return;

            //先移动到最顶层
            this.viewer.dataSources.raiseToTop(this.dataSource);

            var layers = this.viewer.dataSources;
            for (var i = layers.length - 1; i >= 0; i--) {
                var layer = layers.get(i);
                if (layer == this.dataSource) continue;
                if (Cesium.defined(layer.order) && order < layer.order) {
                    this.viewer.dataSources.lower(this.dataSource); //下移一个位置
                }
            }
        }

        //获取属性

    }, {
        key: 'getEntityAttr',
        value: function getEntityAttr(entity) {
            return (0, _util.getAttrVal)(entity.properties);
        }

        //外部自定义添加entity

    }, {
        key: 'addEntity',
        value: function addEntity(entitys) {
            var _this5 = this;

            if (!this.dataSource) {
                this.dataSource = new Cesium.CustomDataSource();
                this.viewer.dataSources.add(this.dataSource);
            }

            if (!(0, _util.isArray)(entitys)) entitys = [entitys];

            for (var i = 0, len = entitys.length; i < len; i++) {
                var entity = entitys[i];

                if (entity.entityCollection) entity.entityCollection.remove(entity); //从原有的集合中删除  
                this.dataSource.entities.add(entity); //加入到当前图层集合图层中
            }

            (0, _config2Entity.config2Entity)(entitys, this.options, function (position, labelattr, attr) {
                return _this5.lblAddFun(position, labelattr, attr);
            });
        }
    }, {
        key: 'removeEntity',
        value: function removeEntity(entity) {
            this.dataSource.entities.remove(entity); //加入到当前图层集合图层中 
        }
    }, {
        key: 'getEntitys',
        value: function getEntitys() {
            if (this.dataSource) return this.dataSource.entities.values;else return null;
        }
    }, {
        key: 'layer',
        get: function get() {
            return this.dataSource;
        }
    }]);

    return GeoJsonLayer;
}(_BaseLayer2.BaseLayer);

/***/ }),
