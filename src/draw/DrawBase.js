/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-14 13:01:47
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-10-06 15:03:24
 */
import * as Cesium from "cesium";
import { Util, Tooltip, Class } from "../core/index";

import { DrawEventType, EditEventType } from "../event/index";

export var DrawBase = Class.extend({
  type: null,
  dataSource: null,
  initialize: function (opts) {
    this.viewer = opts.viewer;
    this.dataSource = opts.dataSource;
    this.primitives = opts.primitives;

    if (!this.dataSource) {
      // 没有单独指定Cesium.CustomDataSource时
      this.dataSource = new Cesium.CustomDataSource();
      this.viewer.dataSources.add(this.dataSource);
    }

    this.tooltip = opts.tooltip || new Tooltip(this.viewer.container);
  },

  fire: function (type, data, propagate) {
    if (this._fire) this._fire(type, data, propagate);
  },

  formatNum: function (num, digits) {
    return Util.formatNum(num, digits);
  },

  // 激活绘制
  activate: function (attribute, drawOkCallback) {
    if (this._enabled) {
      return this;
    }

    this._enabled = true;
    this.drawOkCallback = drawOkCallback;

    this.createFeature(attribute);
    this.entity.inProgress = true;

    this.setCursor(true);
    this.bindEvent();

    this.fire(DrawEventType.DRAW_START, {
      drawtype: this.type,
      entity: this.entity,
    });

    return this.entity;
  },

  // 释放绘制
  disable: function (hasWB) {
    if (!this._enabled) {
      return this;
    }

    this._enabled = false;
    this.setCursor(false);

    if (hasWB && this.entity.inProgress) {
      // 外部释放时，尚未结束的标绘移除。
      if (this.dataSource && this.dataSource.entities.contains(this.entity)) {
        this.data.entities.remove(this.entity);
      }

      if (this.primitives && this.primitives.contains(this.entity)) {
        this.primitives.remove(this.entity);
      }
    } else {
      this.entity.inProgress = false;
      this.finish();

      if (this.drawOkCallback) {
        this.drawOkCallback(this.entity);
        delete this.drawOkCallback;
      }

      this.fire(DrawEventType.DrawCreated, {
        drawtype: this.type,
        entity: this.entity,
      });
    }

    this.destroyHandler();
    this._positions_draw = null;
    this.entity = null;
    this.tooltip.setVisible(false);

    return this;
  },

  createFeature: function (attribute) {},

  // ============ 事件相关 ===================
  getHandler: function () {
    if (!this.handler || this.handler.isDestroyed()) {
      this.handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
    }
    return this.handler;
  },

  destroyHandler: function () {
    this.handler && this.handler.destroy();
    this.handler = undefined;
  },

  setCursor: function (val) {
    this.viewer._container.style.cursor = val ? "crosshair" : "";
  },

  // 绑定鼠标事件
  bindEvent: function () {},

  // 坐标位置相关
  _positions_draw: null,

  getDrawPosition: function () {
    return this._positions_draw;
  },

  // 绑定属性到编辑对象
  _bindEdit: function (_edit) {
    _edit._fire = this._fire;
    _edit.tooltip = this.tooltip;
    return _edit;
  },

  // 更新坐标后调用下，更新相关属性，子类使用
  updateAttrForDrawing: function () {},

  // 图形绘制结束后调用
  finish: function () {},

  // 通用方法
  getCoordinates: function (entity) {
    return this.getAttrClass().getCoordinates(entity);
  },

  getPositions: function (entity) {
    return this.getAttrClass().getPositions(entity);
  },

  toGeoJson: function (entity) {
    return this.getAttrClass().toGeoJson(entity);
  },

  // 属性转entity
  attributeToEntity: function (attribute, positions) {
    var entity = this.createFeature(attribute);
    this._positions_draw = positions;
    this.updateAttrForDrawing(true);
    this.finish();
    return entity;
  },

  // geojson转entity
  jsonToEntity: function (geojson) {
    var attribute = geojson.properties;
    var positions = Util.getPositionByGeoJSON(geojson);
    return this.attributeToEntity(attribute, positions);
  },

  // 绑定外部entity到标绘
  bindExtraEntity: function (entity, attribute) {
    if (attribute && attribute.style)
      this.style2Entity(attribute.style, entity);

    this._positions_draw = this.getPositions(entity);
    this.updateAttrForDrawing(true);
    this.finish();
    return entity;
  },
});
