/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-13 08:40:24
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-13 09:09:25
 */
import  {Class, Util} from 'leaflet'
export var BaseLayer = Class.extend({
  config: {}, //  配置的config信息
  viewer: null,
  initialize: function initialize(cfg, viewer) {
    this.viewer = viewer;
    this.config = cfg;
    this.name = cfg.name;
    if (this.config.hasOwnProperty('alpha')) {
      this._opacity = Number(this.config.alpha);
    } else if (this.config.hasOwnProperty('opacity')) {
      // 兼容opacity参数配置
      this.hasOpacity = this.config.opacity;
    }
    if (this.config.hasOwnProperty('hasOpacity')) {
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
  create: function() {
    
  },
  showError: function(title, error) {
    if (!error) error = '未知错误';
    if (this.viewer) this.viewer.cesiumWidget.showErrorPanel(title, undefined, error);
    console.log('layer错误:' + title + error);
  },
  // 显示隐藏控制
  _visible: null,
  getVisible: function() {
    return this._visible;
  },
  setVisible: function(val) {
    if (this._visible != null && this._visible == val) return;
    this._visible = val;
    if (val) {
      if (this.config.msg) {
        // 弹出信息
      }
    }
  },
})