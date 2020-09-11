import { FeatureGridLayer } from "./FeatureGridLayer";
import Cesium from "cesium";
import { Polygon, Polyline, Billboard, Label } from "../overlay/index";
import { Util } from "../utils/index";
import $ from "jquery";
/*
 * @Description: 分块加载图层基类
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-20 16:54:59
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-11 08:51:05
 */
export var CustomFeatureGridLayer = FeatureGridLayer.extend({
  _cacheGrid: {}, // 网络缓存，存放矢量对象id集合
  _cacheFeature: {}, // 矢量对象缓存，存放矢量对象和其所对应的网格集合
  _addImageryCache: function (opts) {
    this._cacheGrid[opts.key] = {
      opts: opts,
      isLoading: true,
    };

    let that = this;
    this.getDataForGrid(opts, (arrData) => {
      if (that._visible) that._showData(opts, arrData);
    });
  },

  getDataForGrid: function (opts, callback) {
    // 子类可继承，callback为回调方法, callback参数传数据数组
    // 直接使用本类，传参方式
    if (this.config.getDataForGrid) {
      this.config.getDataForGrid(opts, callback);
    }
  },

  checkHasBreak: function (cacheKey) {
    if (!this._visible || !this._cacheGrid[cacheKey]) {
      return true;
    }
    return false;
  },

  _showData: function (opts, arrdata) {
    var cacheKey = opts.key;
    if (this.checkHasBreak[cacheKey]) {
      return; //异步请求结束时,如果已经卸载了网格就直接跳出。
    }

    var that = this;

    var arrIds = [];
    for (var i = 0, len = arrdata.length; i < len; i++) {
      var attributes = arrdata[i];
      var id = attributes[this.config.IdName || "id"];

      var layer = this._cacheFeature[id];
      if (layer) {
        //已存在
        layer.grid.push(cacheKey);
        this.updateEntity(layer.entity, attributes);
      } else {
        var entity = this.createEntity(opts, attributes, function (entity) {
          if (that.config.debuggerTileInfo) {
            //测试用
            entity._temp_id = id;
            entity.popup = function (entity) {
              return JSON.stringify(that._cacheFeature[entity._temp_id].grid);
            };
          }
          that._cacheFeature[id] = {
            grid: [cacheKey],
            entity: entity,
          };
        });
        if (entity != null) {
          if (that.config.debuggerTileInfo) {
            //测试用
            entity._temp_id = id;
            entity.popup = function (entity) {
              return JSON.stringify(that._cacheFeature[entity._temp_id].grid);
            };
          }
          that._cacheFeature[id] = {
            grid: [cacheKey],
            entity: entity,
          };
        }
      }
      arrIds.push(id);
    }

    this._cacheGrid[cacheKey] = this._cacheGrid[cacheKey] || {};
    this._cacheGrid[cacheKey].ids = arrIds;
    this._cacheGrid[cacheKey].isLoading = false;
  },

  createEntity: function (opts, attributes, callback) {
    //子类可以继承,根据数据创造entity

    //直接使用本类,传参方式
    if (this.config.createEntity) {
      return this.config.createEntity(opts, attributes, callback);
    }
    return null;
  },

  updateEntity: function (entity, attributes) {
    //子类可以继承,更新entity（动态数据时有用）
    //直接使用本类,传参方式
    if (this.config.updateEntity) {
      this.config.updateEntity(entity, attributes);
    }
  },

  removeEntity: function (entity) {
    //子类可以继承,移除entity
    //直接使用本类,传参方式
    if (this.config.removeEntity) {
      this.config.removeEntity(entity);
    } else {
      this.dataSource.entities.remove(entity);
    }
  },

  _removeImageryCache: function (opts) {
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
  },

  _removeAllImageryCache: function () {
    if (this.config.removeAllEntity) {
      this.config.removeAllEntity();
    } else {
      this.dataSource.entities.removeAll();
      this.primitives.removeAll();
    }

    this._cacheFeature = {};
    this._cacheGrid = {};
  },

  removeEx: function () {
    if (this.config.removeAllEntity) {
      this.config.removeAllEntity();
    } else {
      this.dataSource.entities.removeAll();
      this.primitives.removeAll();
    }

    this._cacheFeature = {};
    this._cacheGrid = {};

    this.viewer.dataSources.remove(this.dataSource);
    this.viewer.scene.primitives.remove(this.primitives);
  },

  // 重新加载数据
  reload: function () {
    var that = this;
    for (var i in this._cacheGrid) {
      var item = this._cacheGrid[i];
      if (item == null || item.opts == null || item.isLoading) continue;

      var opts = item.opts;
      this.getDataForGrid(opts, function (arrData) {
        that._showData(opts, arrData);
      });
    }
  },
  // 设置透明度
  hasOpacity: true,
  _opacity: 1,
  setOpacity: function (value) {
    this._opacity = value;

    for (var i in this._cacheFeature) {
      var entity = this._cacheFeature[i].entity;

      if (
        entity.polygon &&
        entity.polygon.material &&
        entity.polygon.material.color
      ) {
        this._updateEntityAlpha(entity.polygon.material.color, this._opacity);
        if (entity.polygon.outlineColor) {
          this._updateEntityAlpha(entity.polygon.outlineColor, this._opacity);
        }
      } else if (
        entity.polyline &&
        entity.polyline.material &&
        entity.polyline.material.color
      ) {
        this._updateEntityAlpha(entity.polyline.material.color, this._opacity);
      } else if (entity.billboard) {
        entity.billboard.color = new _Cesium2.default.Color.fromCssColorString(
          "#FFFFFF"
        ).withAlpha(this._opacity);

        if (entity.label) {
          if (entity.label.fillColor)
            this._updateEntityAlpha(entity.label.fillColor, this._opacity);
          if (entity.label.outlineColor)
            this._updateEntityAlpha(entity.label.outlineColor, this._opacity);
          if (entity.label.backgroundColor)
            this._updateEntityAlpha(
              entity.label.backgroundColor,
              this._opacity
            );
        }
      }
    }
  },
  _updateEntityAlpha: function (color, opacity) {
    var newColor = color.getValue().withAlpha(opacity);
    color.setValue(newColor);
  },
  colorHash: {},
  setDefSymbol: function (entity) {
    if (entity.polygon) {
      var name = entity.properties.OBJECTID;
      var color = this.colorHash[name];
      if (!color) {
        color = Cesium.Color.fromRandom({
          minimumGreen: 0.75,
          maximumBlue: 0.75,
          alpha: this._opacity,
        });
        this.colorHash[name] = color;
      }
      entity.polygon.material = color;
      entity.polygon.outline = true;
      entity.polygon.outlineColor = Cesium.Color.WHITE;
    } else if (entity.polyline) {
      var name = entity.properties.OBJECTID;
      var color = this.colorHash[name];
      if (!color) {
        color = Cesium.Color.fromRandom({
          minimumGreen: 0.75,
          maximumBlue: 0.75,
          alpha: this._opacity,
        });
        this.colorHash[name] = color;
      }
      entity.polyline.material = color;
      entity.polyline.width = 2;
    } else if (entity.billboard) {
      entity.billboard.scale = 0.5;
      entity.billboard.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
      entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
    }
  },

  // 外部配置的symbol
  setConfigSymbol: function (entity, symbol) {
    if (entity.polygon) {
      var name = entity.properties.OBJECTID;
      var color = this.colorHash[name];
      if (!color) {
        color = Cesium.Color.fromRandom({
          minimumGreen: 0.75,
          maximumBlue: 0.75,
          alpha: this._opacity,
        });
        this.colorHash[name] = color;
      }
      entity.polygon.material = color;
      entity.polygon.outline = true;
      entity.polygon.outlineColor = Cesium.Color.WHITE;
    } else if (entity.polyline) {
      var name = entity.properties.OBJECTID;
      var color = this.colorHash[name];
      if (!color) {
        color = Cesium.Color.fromRandom({
          minimumGreen: 0.75,
          maximumBlue: 0.75,
          alpha: this._opacity,
        });
        this.colorHash[name] = color;
      }
      entity.polyline.material = color;
      entity.polyline.width = 2;
    } else if (entity.billboard) {
      entity.billboard.scale = 0.5;
      entity.billboard.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
      entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
    }
  },
  //外部配置的symbol
  setConfigSymbol: function (entity, symbol) {
    var attr = entity.properties;
    var styleOpt = symbol.styleOptions;

    if (symbol.styleField) {
      //存在多个symbol,按styleField进行分类
      var styleFieldVal = attr[symbol.styleField];
      var styleOptField = symbol.styleFieldOptions[styleFieldVal];
      if (styleOptField != null) {
        styleOpt = Util.clone(styleOpt);
        styleOpt = $.extend(styleOpt, styleOptField);
      }
    }
    styleOpt = styleOpt || {};

    this._opacity = styleOpt.opacity || 1; //透明度

    if (entity.polygon) {
      Polygon.style2Entity(styleOpt, entity.polygon);
      //加上线宽
      if (styleOpt.outlineWidth && styleOpt.outlineWidth > 1) {
        entity.polygon.outline = false;

        var newopt = {
          color: styleOpt.outlineColor,
          width: styleOpt.outlineWidth,
          opacity: styleOpt.outlineOpacity,
          lineType: "solid",
          outline: false,
        };
        var polyline = Polyline.style2Entity(newopt);
        polyline.positions = entity.polygon.hierarchy._value.positions;
        this.dataSource.entities.add({
          polyline: polyline,
        });
      }

      //是建筑物时
      if (this.config.buildings) {
        var floor = Number(attr[this.config.buildings.cloumn] || 1); //层数
        var height = Number(this.config.buildings.height || 5); //层高

        entity.polygon.extrudedHeight = floor * height;
      }
    } else if (entity.polyline) {
      Polyline.style2Entity(styleOpt, entity.polyline);
    } else if (entity.billboard) {
      entity.billboard.heightReference =
        Cesium.HeightReference.RELATIVE_TO_GROUND;
      Billboard.style2Entity(styleOpt, entity.billboard);

      //加上文字标签
      if (styleOpt.label && styleOpt.label.field) {
        styleOpt.label.heightReference =
          Cesium.HeightReference.RELATIVE_TO_GROUND;

        entity.label = Label.style2Entity(styleOpt.label);
        entity.label.text = attr[styleOpt.label.field];
      }
    }
  },
});
