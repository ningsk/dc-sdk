/*
 * @Description: 图层封装基类
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 08:41:02
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 13:58:22
 */
import Cesium from "cesium";
import { Util, Class } from "../core/index";

export var BaseLayer = Class.extend({
  config: {}, // 配置的config信息
  viewer: null,
  initialize(cfg, viewer) {
    this.viewer = viewer;
    this.config = cfg;
    this.name = cfg.name;
    if (this.config.hasOwnProperty("alpha")) {
      this._opacity = Number(this.config.alpha);
    } else if (this.config.hasOwnProperty("opacity")) {
      // 兼容opacity参数配置
      this.hasOpacity = this.config.opacity;
    }
    if (this.config.hasOwnProperty("hasOpacity")) {
      this.hasOpacity = this.config.hasOpacity;
    }
    this.create();
    if (cfg.visible) {
      this.setVisible(true);
    } else {
      this._visible = false;
    }
    if (cfg.visible && cfg.flyTo) {
      this.centerAt(0);
    }
  },

  create: function () {},
  showError: function (title, error) {
    if (!error) error = "未知错误";
    if (this.viewer)
      this.viewer.cesiumWidget.showErrorPanel(title, undefined, error);
    console.log("layer错误:" + title + error);
  },
  _visible: null,
  getVisible: function () {
    return this._visible;
  },

  setVisible: function (val) {
    if (this._visible != null && this._visible == val) return;
    this._visible = val;
    if (val) {
      if (this.config.msg) {
        // 弹出信息
        Util.msg(this.config.msg);
      }
      this.add();
    } else {
      this.remove();
    }
  },

  // 添加
  add: function () {
    this._visible = true;
    if (this.config.onAdd) {
      this.config.onAdd();
    }
  },

  remove: function () {
    this._visible = false;
    if (this.config.onRemove) {
      this.config.onRemove();
    }
  },

  // 定位到数据区域
  centerAt: function (duration) {
    if (this.config.extent || this.config.center) {
      this.viewer.card.centerAt(this.config.extent || this.config.center, {
        duration: duration,
        isWgs84: true,
      });
    }
  },
  hasOpacity: false,
  _opacity: 1,
  // 设置透明度
  setOpacity: function (value) {
    if (this.config.onSetOpacity) {
      this.config.onSetOpacity(value);
    }
  },
  hasZIndex: false,
  // 设置叠加顺序
  setZIndex: function (value) {
    if (this.config.onSetZIndex) {
      this.config.onSetZIndex(value);
    }
  },

  destroy: function () {
    this.setVisible(false);
  },
});
