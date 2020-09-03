/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-20 10:18:10
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-03 09:45:43
 */

import moduleName from "module";
import WidgetManager from "./WidgetManager";
import { Loader } from "../utils";

class BaseWidget {
  constructor(cfg, map) {
    this.viewer = map;
    this.options = {};
    this.config = cfg; // 配置的config信息
    this.path = cfg.path || ""; // 当前widget目录相对路径
    this.isActivate = false; // 是否激活状态
    this.isCreate = false;
    this._resource_cache = [];
    this.init();
  }

  init() {}

  addCacheVersion(_resource) {
    if (_resource == null) {
      return _resource;
    }

    let cacheVersion = WidgetManager.getCacheVersion();
    if (cacheVersion) {
      if (_resource.indexOf("?") == -1) _resource += "?time=" + cacheVersion;
      else if (_resource.indexOf("time=" + cacheVersion) == -1)
        _resource += "&time=" + cacheVersion;
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
          $("layui-layer").each(() => {
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
        Loader.async(resources, () => {
          var result = that.isCreate(() => {
            that._createWidgetView();
            that.isCreate = true;
          });
          if (result) return;
          if (that.config.createAtStart) {
            that.config.createAtStart = false;
            that.isActivate = false;
            that.isCreate = true;
            return;
          }
          that._createWidgetView();
          that.isCreate = true;
        });
        return;
      } else {
        var result = this.create(() => {
          that._createWidgetView();
          this.isCreate = true;
        });
        if (result) return;
        if (that.config.createAtStart) {
          that.config.createAtStart = false;
          that.isActivate = false;
          that.isCreate = true;
          return;
        }
      }
      this.isCreate = true;
    }
    this._createWidgetView();
    return this;
  }

  // 创建插件的view
  _createWidgetView() {
    var viewopts = this.options.view;
    if (viewopts === undefined || viewopts === null) {
      this._startActivate();
    } else if (L.Util.isArray(viewopts)) {
      this._viewCreateAllCount = viewopts.length;
      this._viewCreateOkCount = 0;
      for (var i = 0; i < viewopts.length; i++) {
        this.createItemView(viewopts[i]);
      }
    } else {
      this._viewCreateAllCount = 1;
      this._viewCreateOkCount = 0;
      this.createItemView(viewopts);
    }
  }

  changeWidgetView(callback) {
    var viewopts = this.options.view;
    if (viewopts === undefined || viewopts === null) {
      return false;
    } else if (L.Util.isArray(viewopts)) {
      var hasCal = false;
      for (var i = 0; i < viewopts.length; i++) {
        hasCal = hasCal || callback(viewopts[i]);
      }
      return hasCal;
    } else {
      return callback(viewopts);
    }
  }

  createItemView(viewopt) {
    switch (viewopt.type) {
      default:
      case "window":
        this._openWindow(viewopt);
        break;
      case "divwindow":
        this._openDivWindow(viewopt);
        break;
      case "append":
        this._appendView(viewopt);
        break;
      case "custom":
        // 自定义
        var view_url = this._getUrl(viewopt.url);
        var that = this;
        viewopt.open(
          view_url,
          (html) => {
            that.winCreateOK(viewopt, html);
            that._viewCreateOkCount++;
            if (that._viewCreateOkCount >= that._viewCreateAllCount) {
              that._startActivate(html);
            }
          },
          this
        );
        break;
    }
  }

  _viewCreateAllCount = 0;
  _viewCreateOkCount = 0;

  // ======= layer弹窗  ===================

  _openWindow(viewopt) {}
}

export default BaseWidget;
