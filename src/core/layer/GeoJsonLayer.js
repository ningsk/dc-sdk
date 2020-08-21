import BaseLayer from "./BaseLayer";
import { Util } from "../utils";
import $ from 'jquery';
import { AttrPolyline, AttrPolygon, AttrLabel, AttrBillboard } from "../attr";

/*
 * @Description: GeoJson格式数据图层
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-15 11:22:51
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-21 09:06:06
 */
export default class GeoJsonLayer extends BaseLayer{
  constructor(cfg, viewer) {
    super(cfg, viewer);
    this.dataSource = null;
    this.hasOpacity = true;
    this._opacity = 0.9;
    // 默认symbol
    this.colorHash = {};
  }

  // 添加
  add() {
    if (this.dataSource) {
      this.viewer.dataSources.add(this.dataSource); 
    } else {
      this.queryData();
    }
  }

  // 移除
  remove() {
    this.viewer.dataSources.remove(this.dataSource);
  }

  // 定位至数据区域
  centerAt(duration) {
    if (this.config.extent || this.config.center) {
      this.viewer.mars.centerAt(this.config.extent || this.config.center, {
        duration: duration,
        isWgs84: true
      });
    } else {
      if (this.dataSource == null) {
        return;
      }
      // this.viewer.zoomTo(this.dataSource.entities.values);
      this.viewer.flyTo(this.dataSource.entities.values, {
        duration: duration
      });
    }
  }

  // 设置透明度
  setOpacity(value) {
    this._opacity = value;
    if (this.dataSource == null) return;
    let entities = this.dataSource.entities.values;
    for (let i = 0, len = entities.length; i < len; i++) {
      let entity = entities[i];
      if (entity.polygon && entity.polygon.material && entity.polygon.material.color) {
        this._updateEntityAlpha(entity.polygon.material.color, this._opacity);
        if (entity.polygon.outlineColor) {
          this._updateEntityAlpha(entity.polygon.outlineColor, this._opacity);
        }
      }

      if (entity.polyline && entity.polyline.material && entity.polyline.material.color) {
        this._updateEntityAlpha(entity.polyline.material.color, this._opacity);
      }

      if (entity.billboard) {
        entity.billboard.color = new Cesium.Color.fromCssColorString('#FFFFFF').withAlpha(this._opacity);
      }

      if (entity.model) {
        entity.model.color = new Cesium.Color.fromCssColorString('#FFFFFF').withAlpha(this._opacity);
      }

      if (entity.label) {
        if (entity.label.fillColor) {
          this._updateEntityAlpha(entity.label.fillColor, this._opacity);
        }
        if (entity.label.outlineColor) {
          this._updateEntityAlpha(entity.label.outlineColor, this._opacity);
        }
        if (entity.label.backgroundColor) {
          this._updateEntityAlpha(entity.label.backgroundColor, this._opacity);
        }
      }
    }

  }

  _updateEntityAlpha(color, opacity) {
    let newColor = color.getValue().withAlpha(opacity)
    color.setValue(newColor);
  }

  queryData() {
    let that = this;
    let dataSource = Cesium.GeoJsonDataSource.load(this.config.url, {
      clampToGround: this.config.clampToGround
    });
    dataSource.then((dataSource) => {
      that.showResult(dataSource);
    }).otherwise((error) => {
      that.showError("服务出错", error);
    });
  }

  showResult(dataSource) {
    let that = this;
    this.dataSource = this.dataSource;
    this.viewer.dataSources.add(this.dataSource);
    if (this.config.flyTo) {
      this.centerAt();
    }
    // ================= 设置样式 ================
    let entities = this.dataSource.entities.values;
    for (let i = 0, len = entities.length; i <len; i++) {
      let entity = entities[i];
      // 样式
      if (this.config.symbol) {
        if (this.config.symbol == 'default') this.setDefSymbol(entity);
        else this.setConfigSymbol(entity, this.config.symbol);
      }
      // popup弹窗
      if (this.config.columns || this.config.popup) {
        entity.popup = {
          html: (entity)=> {
            let attr = that.getEntityAttr(entity);
            if (Util.isString(attr)) return attr;
            else return that.viewer.mars.popup.getPopupForConfig(that.config, attr);
          },
          anchor: that.config.popupAnchor || [0, 15]
        };
      }

      if (that.config.tooltip) {
        entity.tooltip = {
          html: (entity) => {
            let attr = that.getEntityAttr(entity);
            if (Util.isString(attr)) return attr;
            else return that.viewer.mars.popup.getPopupForConfig({
              popup: that.config.tooltip
            }, attr);
          },
          anchor: that.config.tooltipAnchor || [0, -15]
        };
      }

      if (that.config.click) {
        entity.click = that.config.click;
      }

    }
  }

  getEntityAttr(entity) {
    return entity.properties;
  }

  setDefSymbol(entity) {
    let attr = that.getEntityAttr(entity) || {};
    if (entity.polygon) {
      let name = attr.id || attr.OBJECTID || 0;
      let color = this.colorHash[name];
      if (!color) {
        color = Cesium.Color.fromRandom({
          minimumGreen: 0.75,
          maximumBlue: 0.75,
          alpha: this._opacity
        });
        this.colorHash[name] = color;
      }

      entity.polygon.material = color;
      entity.polygon.outline = true;
      entity.polygon.outlineColor = Cesium.Color.WHITE;
    } else if (entity.polyline) {
      let name = attr.id || attr.OBJECTID || 0;
      let color = this.colorHash[name];
      if (!color) {
        color = Cesium.Color.fromRandom({
          minimumGreen: 0.75,
          maximumBlue: 0.75,
          alpha: this._opacity
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
  }

  setConfigSymbol(entity, symbol) {
    let attr = symbol.styleOptions;
    let styleOpt = symbol.styleOptions;
    if (symbol.styleField) {
      // 存在多个symbol，按styleField进行分类
      let styleFieldVal = attr[symbol.styleField];
      let styleOptField = symbol.styleFieldOptions[styleFieldVal];
      if (styleOptField != null) {
        styleOpt = Util.clone(styleOpt);
        styleOpt = $.extend(styleOpt, styleOptField);
      }
    }
    styleOpt = styleOpt || {};

    this._opacity = styleOpt.opacity || 1; // 透明度
    if (entity.polyline) {
      AttrPolyline.style2Entity(styleOpt, entity.polyline);
    }
    if (entity.polygon) {
      AttrPolygon.style2entity(styleOpt, entity.polygon);
      // 加上线宽
      if (styleOpt.outlineWidth && styleOpt.outlineWidth > 1) {
        entity.polygon.outline = false;
        let newOpt = {
          "color": styleOpt.outlineColor,
          "width": styleOpt.outlineWidth,
          "opacity": styleOpt.outlineOpacity,
          "lineType": "solid",
          "clampToGround": true,
          "outliine": false
        };
        let polyline = AttrPolyline.style2Entity(newOpt);
        polyline.positions = entity.polygon.hierarchy._value.positions;
        this.dataSource._entityCollection.add({
          polyline: polyline
        });
      }

      // 是建筑物时
      if (this.config.buildings) {
        let floor = Number(attr[this.config.buildings.column] || 1); // 层数
        let height = Number(attr[this.config.buildings.height] || 5); // 层高
        entity.polygon.extrudeHeight = floor * height;
      }
    }

    if (entity.label) {
      styleOpt.heightReference = styleOpt.heightReference || Cesium.HeightReference.RELATIVE_TO_GROUND;
      AttrLabel.style2Entity(styleOpt, entity.label);
    }

    if (entity.billboard) {
      styleOpt.heightReference = styleOpt.heightReference || Cesium.HeightReference.RELATIVE_TO_GROUND;
      AttrBillboard.style2entity(styleOpt, entity.billboard);
      // 加上文字标签
      if (styleOpt.label && styleOpt.label.field) {
        styleOpt.label.heightReference = styleOpt.label.heightReference || Cesium.HeightReference.RELATIVE_TO_GROUND;
        entity.label = AttrLabel.style2Entity(styleOpt.label);
        entity.label.text = attr[styleOpt.label.field] || "";
      }
    }

    entity.attribute = styleOpt;

  }

  


}