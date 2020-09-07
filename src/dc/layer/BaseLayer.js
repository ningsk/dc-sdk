/*
 * @Description: 图层封装基类
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-15 08:41:02
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-21 08:56:39
 */
import Cesium from "cesium";
import {Util as util} from '../utils'

class BaseLayer {
  constructor(cfg, viewer) {
    this.viewer = viewer;
    this.config = cfg;
    this.name = cfg.name;
    this.hasOpacity = false;
    this._opacity = 1;
    this.visible = null;
    this.hasZIndex = false;
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
  }

  create() {
    
  },
  showError(title, error) {
    if (!error) error = '未知错误';
    if (this.viewer) this.viewer.cesiumWidget.showErrorPanel(title, undefined, error);
    console.log('layer错误:' + title + error);
  }

  getVisible() {
    return this._visible;
  }

  setVisible(val) {
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
  }

  // 添加
  add() {
    this._visible = true;
    if (this.config.onAdd) {
      this.config.onAdd();
    }
  }

  remove() {
    this._visible = false;
    if (this.config.onRemove) {
      this.config.onRemove();
    }
  }

  // 定位到数据区域
  centerAt(duration) {
    if (this.config.extent || this.config.center) {
      this.viewer.mars.centerAt(this.config.extent || this.config.center, {
        duration: duration,
        isWgs84: true
      });
    }
  }

  // 设置透明度
  setOpacity(value) {
    if (this.config.onSetOpacity) {
      this.config.onSetOpacity(value);
    }
  }

  // 设置叠加顺序
  setZIndex(value) {
    if (this.config.onSetZIndex) {
      this.config.onSetZIndex(value);
    }
  }
  
  destroy() {
    this.setVisible(false);
  }
}

export default BaseLayer;