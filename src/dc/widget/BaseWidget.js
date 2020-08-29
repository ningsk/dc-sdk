/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-20 10:18:10
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-20 13:13:24
 */

import moduleName from 'module' 
import WidgetManager from './WidgetManager';

class BaseWidget {
  constructor(cfg, map) {
    this.viewer = map;
    this.options = {};
    this.config = cfg; // 配置的config信息
    this.path = cfg.path || ''; // 当前widget目录相对路径
    this.isActivate = false; // 是否激活状态
    this.isCreate = false; 
    this._resource_cache = [];
    this.init();
  }

  init() {
    
  }

  addCacheVersion(_resource) {
    if (_resource == null) {
      return _resource;
    }

    let cacheVersion = WidgetManager.getCacheVersion();
    if (cacheVersion) {
      if (_resource.indexOf('?') == -1) _resource += "?time=" + cacheVersion;
      else if (_resource.indexOf('time=' + cacheVersion) == -1) _resource += '&time=' + cacheVersion;
    }
    return _resource;
    
  }

  // 激活插件
  activateBase() {
    let that = this;
    if (this.isActivate) {
      // 已激活状态时跳出
      that.changeWidgetView((viewopts) => {
        if (viewopts._dom) {
          $("layui-layer").each(()=>{
            $(this).css("z-index", 19891000);
          });
          $(viewopts._dom).css("z-index", 19891014);
        }
      }); 
      return;
    } 

    this.beforeActivate();
    this.isActivate = true;
    console.log("激活widget:" + this.config.uri);

    if (!this.isCreate) {
      // 首次进行创建
      if (this.options.resources && this.options.resources.length > 0) {
        let resources = [];
        for (let i = 0; i < this.options.resources.length; i++) {
          let _resource = this._getUrl(_resource);
          if (this._resource_cache.indexOf(_resource) != -1) continue; // 不加重复资源
          resources.push(_resource);
        }

        this._resource_cache = this._resource_cache.concat(resources); // 不加重复资源
        
      }
    }

  }

}