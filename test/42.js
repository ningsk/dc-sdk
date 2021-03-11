/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CustomFeatureGridLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _util = __webpack_require__(1);

var _FeatureGridLayer2 = __webpack_require__(102);

var _config2Entity2 = __webpack_require__(32);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //分块加载矢量数据公共类


var CustomFeatureGridLayer = exports.CustomFeatureGridLayer = function (_FeatureGridLayer) {
    _inherits(CustomFeatureGridLayer, _FeatureGridLayer);

    //========== 构造方法 ========== 
    function CustomFeatureGridLayer(viewer, options) {
        _classCallCheck(this, CustomFeatureGridLayer);

        var _this = _possibleConstructorReturn(this, (CustomFeatureGridLayer.__proto__ || Object.getPrototypeOf(CustomFeatureGridLayer)).call(this, viewer, options));

        _this._cacheGrid = {}; //网格缓存,存放矢量对象id集合
        _this._cacheFeature = {}; //矢量对象缓存,存放矢量对象和其所对应的网格集合  
        _this.hasOpacity = true;
        return _this;
    }

    //========== 方法==========


    _createClass(CustomFeatureGridLayer, [{
        key: '_addImageryCache',
        value: function _addImageryCache(opts) {
            this._cacheGrid[opts.key] = { opts: opts, isLoading: true };

            var that = this;

            this.getDataForGrid(opts, function (arrdata) {
                if (that._visible) that._showData(opts, arrdata);
            });
        }
    }, {
        key: 'getDataForGrid',
        value: function getDataForGrid(opts, callback) {
            //子类可继承, callback为回调方法,callback参数传数据数组

            //直接使用本类,传参方式
            if (this.options.getDataForGrid) {
                this.options.getDataForGrid(opts, callback);
            }
        }
    }, {
        key: 'checkHasBreak',
        value: function checkHasBreak(cacheKey) {
            if (!this._visible || !this._cacheGrid[cacheKey]) {
                return true;
            }
            return false;
        }
    }, {
        key: '_showData',
        value: function _showData(opts, arrdata) {
            var cacheKey = opts.key;
            if (this.checkHasBreak[cacheKey]) {
                return; //异步请求结束时,如果已经卸载了网格就直接跳出。
            }

            var that = this;

            var arrIds = [];
            for (var i = 0, len = arrdata.length; i < len; i++) {
                var attributes = arrdata[i];
                var id = attributes[this.options.IdName || 'id'];

                var layer = this._cacheFeature[id];
                if (layer) {
                    //已存在
                    layer.grid.push(cacheKey);
                    this.updateEntity(layer.entity, attributes);
                } else {
                    var entity = this.createEntity(opts, attributes, function (entity) {
                        if (that.options.debuggerTileInfo) {
                            //测试用
                            entity._temp_id = id;
                            entity.popup = function (entity) {
                                return JSON.stringify(that._cacheFeature[entity._temp_id].grid);
                            };
                        }
                        that._cacheFeature[id] = {
                            grid: [cacheKey],
                            entity: entity
                        };
                        if (that.options.onEachEntity) //添加到地图后回调方法
                            that.options.onEachEntity(entity, that);
                    });
                    if (entity != null) {
                        if (that.options.debuggerTileInfo) {
                            //测试用
                            entity._temp_id = id;
                            entity.popup = function (entity) {
                                return JSON.stringify(that._cacheFeature[entity._temp_id].grid);
                            };
                        }
                        that._cacheFeature[id] = {
                            grid: [cacheKey],
                            entity: entity
                        };
                        if (that.options.onEachEntity) //添加到地图后回调方法
                            that.options.onEachEntity(entity, that);
                    }
                }
                arrIds.push(id);
            }

            this._cacheGrid[cacheKey] = this._cacheGrid[cacheKey] || {};
            this._cacheGrid[cacheKey].ids = arrIds;
            this._cacheGrid[cacheKey].isLoading = false;
        }
    }, {
        key: 'createEntity',
        value: function createEntity(opts, attributes, callback) {
            //子类可以继承,根据数据创造entity

            //直接使用本类,传参方式
            if (this.options.createEntity) {
                return this.options.createEntity(opts, attributes, callback);
            }
            return null;
        }
    }, {
        key: 'updateEntity',
        value: function updateEntity(enetity, attributes) {
            //子类可以继承,更新entity（动态数据时有用）

            //直接使用本类,传参方式
            if (this.options.updateEntity) {
                this.options.updateEntity(enetity, attributes);
            }
        }
    }, {
        key: 'removeEntity',
        value: function removeEntity(enetity) {
            //子类可以继承,移除entity

            //直接使用本类,传参方式
            if (this.options.removeEntity) {
                this.options.removeEntity(enetity);
            } else {
                this.dataSource.entities.remove(enetity);
            }
        }
    }, {
        key: '_removeImageryCache',
        value: function _removeImageryCache(opts) {
            var cacheKey = opts.key;
            var layers = this._cacheGrid[cacheKey];
            if (layers) {
                if (layers.ids) {
                    for (var i = 0; i < layers.ids.length; i++) {
                        var id = layers.ids[i];
                        var layer = this._cacheFeature[id];
                        if (layer) {
                            layer.grid.remove(cacheKey);
                            if (layer.grid.length == 0) {
                                delete this._cacheFeature[id];
                                this.removeEntity(layer.entity);
                            }
                        }
                    }
                }
                delete this._cacheGrid[cacheKey];
            }
        }
    }, {
        key: '_removeAllImageryCache',
        value: function _removeAllImageryCache() {

            if (this.options.removeAllEntity) {
                this.options.removeAllEntity();
            } else {
                this.dataSource.entities.removeAll();
                this.primitives.removeAll();
            }

            this._cacheFeature = {};
            this._cacheGrid = {};
        }
        //移除 

    }, {
        key: 'removeEx',
        value: function removeEx() {
            if (this.options.removeAllEntity) {
                this.options.removeAllEntity();
            } else {
                this.dataSource.entities.removeAll();
                this.primitives.removeAll();
            }

            this._cacheFeature = {};
            this._cacheGrid = {};

            this.viewer.dataSources.remove(this.dataSource);
            this.viewer.scene.primitives.remove(this.primitives);
        }
        //重新加载数据

    }, {
        key: 'reload',
        value: function reload() {
            var that = this;
            for (var i in this._cacheGrid) {
                var item = this._cacheGrid[i];
                if (item == null || item.opts == null || item.isLoading) continue;

                var opts = item.opts;
                this.getDataForGrid(opts, function (arrdata) {
                    that._showData(opts, arrdata);
                });
            }
        }

        //设置透明度

    }, {
        key: 'setOpacity',
        value: function setOpacity(value) {
            this._opacity = value;

            for (var i in this._cacheFeature) {
                var entity = this._cacheFeature[i].entity;

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

        //获取属性

    }, {
        key: 'getEntityAttr',
        value: function getEntityAttr(entity) {
            return (0, _util.getAttrVal)(entity.properties);
        }
        //根据config配置，更新entitys 

    }, {
        key: 'config2Entity',
        value: function config2Entity(entity) {
            return (0, _config2Entity2.config2Entity)([entity], this.options);
        }
    }]);

    return CustomFeatureGridLayer;
}(_FeatureGridLayer2.FeatureGridLayer);

/***/ }),
