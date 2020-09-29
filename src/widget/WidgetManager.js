/*
 * @Description: widget模块公共处理类，勿轻易修改
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-20 10:36:52
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 16:05:58
 */

import { Loader } from "../dom/index";
import { Class } from "../core/index";

var basePath = ""; //widgets目录统一前缀，如果widgets目录不在当前页面的同级目录，在其他处时可以传入basePath参数，参数值为：widgets目录相对于当前页面的路径
var defoptions;
var cacheVersion;
var isDebug;

var thisMap;
var widgetsData = [];

//初始化插件
export function init(map, widgetCfg, _basePath) {
  thisMap = map;
  widgetCfg = widgetCfg || {};
  basePath = _basePath || "";

  widgetsData = [];
  defoptions = widgetCfg.defaultOptions || {
    windowOptions: {
      position: "rt",
      maxmin: false,
      resize: true,
    },
    autoDisable: true,
    disableOhter: true,
  };

  cacheVersion = widgetCfg.version;
  if (cacheVersion == "time") cacheVersion = new Date().getTime();

  //将自启动的加入
  var arrtemp = widgetCfg.widgetsAtStart;
  if (arrtemp && arrtemp.length > 0) {
    for (var i = 0; i < arrtemp.length; i++) {
      var item = arrtemp[i];
      if (!item.hasOwnProperty("uri") || item.uri == "") {
        console.log("widget未配置uri：" + JSON.stringify(item));
        continue;
      }
      if (item.hasOwnProperty("visible") && !item.visible) continue;

      item.autoDisable = false;
      item.openAtStart = true;
      item._nodebug = true;

      bindDefOptions(item);
      widgetsData.push(item);
    }
  }

  //显示测试栏
  //为了方便测试，所有widget会在页面下侧生成一排按钮，每个按钮对应一个widget，单击后激活对应widget
  isDebug = widgetCfg["debugger"];
  if (isDebug) {
    var inhtml =
      '<div id="widget-testbar" class="widgetbar animation-slide-bottom no-print-view" > ' +
      '     <div style="height: 30px; line-height:30px;"><b style="color: #4db3ff;">widget测试栏</b>&nbsp;&nbsp;<button  id="widget-testbar-remove"  type="button" class="btn btn-link btn-xs">关闭</button> </div>' +
      '     <button id="widget-testbar-disableAll" type="button" class="btn btn-info" ><i class="fa fa-globe"></i>漫游</button>' +
      "</div>";
    $("body").append(inhtml);

    $("#widget-testbar-remove").click(function (e) {
      removeDebugeBar();
    });
    $("#widget-testbar-disableAll").click(function (e) {
      disableAll();
    });
  }

  //将配置的加入
  arrtemp = widgetCfg.widgets;
  if (arrtemp && arrtemp.length > 0) {
    for (var i = 0; i < arrtemp.length; i++) {
      var item = arrtemp[i];
      if (item.type == "group") {
        var inhtml =
          ' <div class="btn-group dropup">  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-align-justify"></i>' +
          item.name +
          ' <span class="caret"></span></button> <ul class="dropdown-menu">';
        for (var j = 0; j < item.children.length; j++) {
          var childItem = item.children[j];
          if (!childItem.hasOwnProperty("uri") || childItem.uri == "") {
            console.log("widget未配置uri：" + JSON.stringify(childItem));
            continue;
          }

          inhtml +=
            ' <li data-widget="' +
            childItem.uri +
            '" class="widget-btn" ><a href="#"><i class="fa fa-star"></i>' +
            childItem.name +
            "</a></li>";

          bindDefOptions(childItem);
          widgetsData.push(childItem); //将配置的加入
        }
        inhtml += "</ul></div>";

        if (isDebug && !item._nodebug) {
          $("#widget-testbar").append(inhtml);
        }
      } else {
        if (!item.hasOwnProperty("uri") || item.uri == "") {
          console.log("widget未配置uri：" + JSON.stringify(item));
          continue;
        }

        //显示测试栏
        if (isDebug && !item._nodebug) {
          var inhtml =
            '<button type="button" class="btn btn-primary widget-btn" data-widget="' +
            item.uri +
            '"  > <i class="fa fa-globe"></i>' +
            item.name +
            " </button>";
          $("#widget-testbar").append(inhtml);
        }

        bindDefOptions(item);
        widgetsData.push(item); //将配置的加入
      }
    }

    if (isDebug) {
      $("#widget-testbar .widget-btn").each(function () {
        $(this).click(function (e) {
          var uri = $(this).attr("data-widget");
          if (uri == null || uri == "") return;

          if (isActivate(uri)) {
            disable(uri);
          } else {
            activate(uri);
          }
        });
      });
    }
  }

  for (var i = 0; i < widgetsData.length; i++) {
    var item = widgetsData[i];

    if (item.openAtStart || item.createAtStart) {
      _arrLoadWidget.push(item);
    }
  }

  $(window).resize(function () {
    for (var i = 0; i < widgetsData.length; i++) {
      var item = widgetsData[i];
      if (item._class) {
        item._class.indexResize(); //BaseWidget: indexResize
      }
    }
  });

  loadWidgetJs();
}

export function getDefWindowOptions() {
  return clone(defoptions.windowOptions);
}

export function clone(from, to) {
  if (
    from == null ||
    (typeof from === "undefined" ? "undefined" : typeof from) != "object"
  )
    return from;
  if (from.constructor != Object && from.constructor != Array) return from;
  if (
    from.constructor == Date ||
    from.constructor == RegExp ||
    from.constructor == Function ||
    from.constructor == String ||
    from.constructor == Number ||
    from.constructor == Boolean
  )
    return new from.constructor(from);

  to = to || new from.constructor();

  for (var name in from) {
    to[name] =
      typeof to[name] == "undefined" ? clone(from[name], null) : to[name];
  }

  return to;
}

export function bindDefOptions(item) {
  //赋默认值至options（跳过已存在设置值）
  if (defoptions) {
    for (var aa in defoptions) {
      if (aa == "windowOptions") {
        //for (var jj in defOptions['windowOptions']) {
        //    if (!item['windowOptions'].hasOwnProperty(jj)) {
        //        item['windowOptions'][jj] = defOptions['windowOptions'][jj];
        //    }
        //}
      } else if (!item.hasOwnProperty(aa)) {
        item[aa] = defoptions[aa];
      }
    }
  }

  //赋值内部使用属性
  item.path = getFilePath(basePath + item.uri);
  item.name = item.name || item.label; //兼容name和label命名
}

//激活指定模块
export function activate(item, noDisableOther) {
  if (thisMap == null && item.viewer) {
    init(item.viewer);
  }

  //参数是字符串id或uri时
  if (typeof item === "string") {
    item = {
      uri: item,
    };

    if (noDisableOther != null) item.disableOhter = !noDisableOther; //是否释放其他已激活的插件
  } else {
    if (item.uri == null) {
      console.error("activate激活widget时需要uri参数！");
    }
  }

  var thisItem;
  for (var i = 0; i < widgetsData.length; i++) {
    var othitem = widgetsData[i];
    if (item.uri == othitem.uri || (othitem.id && item.uri == othitem.id)) {
      thisItem = othitem;
      if (thisItem.isloading) return thisItem; //激活了正在loading的widget 防止快速双击了菜单

      //赋值
      for (var aa in item) {
        if (aa == "uri") continue;
        thisItem[aa] = item[aa];
      }
      break;
    }
  }
  if (thisItem == null) {
    bindDefOptions(item);
    thisItem = item;
    //非config中配置的，外部传入，首次激活
    widgetsData.push(item);
  }

  if (isDebug) console.log("开始激活widget：" + thisItem.uri);

  //释放其他已激活的插件
  if (thisItem.disableOhter) {
    disableAll(thisItem.uri, thisItem.group);
  } else {
    disableGroup(thisItem.group, thisItem.uri);
  }

  //激活本插件
  if (thisItem._class) {
    if (thisItem._class.isActivate) {
      //已激活时
      if (thisItem._class.update) {
        //刷新
        thisItem._class.update();
      } else {
        //重启
        thisItem._class.disableBase();
        var timetemp = setInterval(function () {
          if (thisItem._class.isActivate) return;
          thisItem._class.activateBase();
          clearInterval(timetemp);
        }, 200);
      }
    } else {
      thisItem._class.activateBase(); // BaseWidget: activateBase
    }
  } else {
    for (var i = 0; i < _arrLoadWidget.length; i++) {
      if (_arrLoadWidget[i].uri == thisItem.uri)
        //如果已在加载列表中的直接跳出
        return _arrLoadWidget[i];
    }
    _arrLoadWidget.push(thisItem);

    if (_arrLoadWidget.length == 1) {
      loadWidgetJs();
    }
  }
  return thisItem;
}

export default function getWidget(id) {
  for (var i = 0; i < widgetsData.length; i++) {
    var item = widgetsData[i];

    if (id == item.uri || id == item.id) {
      return item;
    }
  }
}

export function getClass(id) {
  var item = getWidget(id);
  if (item) return item._class;
  else return null;
}

export function isActivate(id) {
  var _class = getClass(id);
  if (_class == null) return false;
  return _class.isActivate;
}

export function disable(id) {
  if (id == null) return;
  for (var i = 0; i < widgetsData.length; i++) {
    var item = widgetsData[i];

    if (item._class && (id == item.uri || id == item.id)) {
      item._class.disableBase();
      break;
    }
  }
}

//释放所有widget
export function disableAll(nodisable, group) {
  for (var i = 0; i < widgetsData.length; i++) {
    var item = widgetsData[i];

    if (group && item.group == group) {
      //同组别的全部释放
    } else {
      if (!item.autoDisable) continue;
    }

    //指定不释放的跳过
    if (nodisable && (nodisable == item.uri || nodisable == item.id)) continue;

    if (item._class) {
      item._class.disableBase(); ////BaseWidget: disableBase
    }
  }
}

//释放同组widget
export function disableGroup(group, nodisable) {
  if (group == null) return;

  for (var i = 0; i < widgetsData.length; i++) {
    var item = widgetsData[i];
    if (item.group == group) {
      //指定不释放的跳过
      if (nodisable && (nodisable == item.uri || nodisable == item.id))
        continue;
      if (item._class) {
        item._class.disableBase(); ////BaseWidget: disableBase
      }
    }
  }
}

export function eachWidget(callback) {
  for (var i = 0; i < widgetsData.length; i++) {
    var item = widgetsData[i];
    callback(item);
  }
}

var _arrLoadWidget = [];
var loadItem;
var isloading;

function loadWidgetJs() {
  if (_arrLoadWidget.length == 0) return;

  if (isloading) {
    setTimeout(loadWidgetJs, 500);
    return;
  }
  isloading = true;

  loadItem = _arrLoadWidget[0];
  loadItem.isloading = true;
  var _uri = loadItem.uri;
  if (cacheVersion) {
    if (_uri.indexOf("?") == -1) _uri += "?time=" + cacheVersion;
    else _uri += "&time=" + cacheVersion;
  }

  if (window.NProgress) {
    NProgress.start();
  }

  if (isDebug) console.log("开始加载js：" + basePath + _uri);

  Loader.async([basePath + _uri], function () {
    isloading = false;
    loadItem.isloading = false;
    if (isDebug) console.log("完成js加载：" + basePath + _uri);

    if (window.NProgress) {
      NProgress.done(true);
    }

    _arrLoadWidget.shift();
    loadWidgetJs();
  });
}

export function bindClass(_class) {
  if (loadItem == null) {
    var _jspath = getThisJSPath();
    for (var i = 0; i < widgetsData.length; i++) {
      var item = widgetsData[i];
      if (_jspath.endsWith(item.uri)) {
        item.isloading = false;
        item._class = new _class(item, thisMap);
        item._class.activateBase(); // BaseWidget: activateBase
        return item._class;
      }
    }
  } else {
    loadItem.isloading = false;
    loadItem._class = new _class(loadItem, thisMap);
    loadItem._class.activateBase(); // BaseWidget: activateBase
    return loadItem._class;
  }
}

export function getThisJSPath() {
  var jsPath;
  var js = document.scripts;
  for (var i = js.length - 1; i >= 0; i--) {
    jsPath = js[i].src;
    if (jsPath == null || jsPath == "") continue;
    if (jsPath.indexOf("widgets") == -1) continue;
    //jsPath = jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
    return jsPath;
  }
  return "";
}

//获取路径
export function getFilePath(file) {
  var pos = file.lastIndexOf("/");
  return file.substring(0, pos + 1);
}

export function removeDebugeBar() {
  $("#widget-testbar").remove();
}

export function getCacheVersion() {
  return cacheVersion;
}

export function getBasePath() {
  return basePath;
}

var _resources_cache = [];

export var BaseWidget = Class.extend({
  viewer: null,
  options: {},
  config: {}, // 配置的config信息
  path: "", // 当前widget目录相对路径
  isActivate: false, // 是否激活状态
  isCreate: false,
  initialize: function (cfg, map) {
    this.viewer = map;
    this.config = cfg;
    this.path = cfg.path || "";
    this.init();
  },
  addCacheVersion: function (_resource) {
    if (_resource == null) {
      return _resource;
    }

    let cacheVersion = getCacheVersion();
    if (cacheVersion) {
      if (_resource.indexOf("?") == -1) _resource += "?time=" + cacheVersion;
      else if (_resource.indexOf("time=" + cacheVersion) == -1)
        _resource += "&time=" + cacheVersion;
    }
    return _resource;
  },
  // 激活插件
  activateBase: function () {
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
          let _resource = this.options.resources;
          _resource = this._getUrl(_resource);
          if (_resources_cache.indexOf(_resource) != -1) continue; // 不加重复资源
          resources.push(_resource);
        }

        _resources_cache = _resources_cache.concat(resources); // 不加重复资源
        Loader.async(resources, () => {
          var result = that.create(() => {
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
  },

  // 创建插件的view
  _createWidgetView: function () {
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
  },

  changeWidgetView: function (callback) {
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
  },

  createItemView: function (viewopt) {
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
  },

  _viewCreateAllCount: 0,
  _viewCreateOkCount: 0,

  // ======= layer弹窗  ===================

  _openWindow: function (viewopt) {
    var that = this;
    var viewUrl = this._getUrl(viewopt.url);
    var opts = {
      type: 2,
      content: [viewUrl, "no"],
      success: (layero) => {
        viewopt._layerOpening = false;
        viewopt._dom = layero;
        // 得到iframe页的窗口对象，执行iframe页的方法，如viewWindow.method();
        var viewWindow = window[layero.find("iframe")[0]["name"]];
        // 隐藏弹窗
        if (that.config.hasOwnProperty("visible") && !that.config.visible) {
          $(layero).hide();
          layero.setTop(layero);
          that.winCreateOK(viewopt, viewWindow);
          that._viewCreateOkCount++;
          if (that._viewCreateOkCount >= that._viewCreateAllCount) {
            that._startActivate(layero);
          }
          // 通知页面，页面需要定义initWidgetView方法
          if (viewWindow && viewWindow.initWidgetView) {
            viewWindow.initWidgetView(that);
          } else {
            console.error(
              "" +
                viewUrl +
                "页面没有定义function initWidgetView(widget)方法，无法初始化widget页面！"
            );
          }
        }
      },
    };
    if (viewopt._layerIdx > 0) {
      //debugger
    }
    viewopt._layerOpening = true;
    viewopt._layerIdx = layer.open(this._getWinOpt(viewopt, opts));
  },

  _openDivWindow: function (viewopt) {
    var viewUrl = this._getUrl(viewopt.url);
    // div弹窗
    var that = this;
    this.getHtml(viewUrl, (data) => {
      var opts = {
        type: 1,
        content: data,
        success: (layero) => {
          viewopt._layerOpening = false;
          viewopt._dom = layero;
          // 隐藏弹窗
          if (that.config.hasOwnProperty("visible") && !that.config.visible) {
            $(layero).hide();
          }
          layer.setTop(layero);
          that.winCreateOK(viewopt, layero);
          that._viewCreateOkCount++;
          if (that._viewCreateOkCount >= that._viewCreateAllCount) {
            that._startActivate(layero);
          }
        },
      };
      viewopt._layerOpening = true;
      viewopt._layerIdx = layer.open(that._getWinOpt(viewopt, opts));
    });
  },

  _getUrl: function (url) {
    url = this.addCacheVersion(url);
    if (url.startsWith("/") || url.startsWith(".") || url.startsWith("http")) {
      return url;
    } else {
      return this.path + url;
    }
  },

  _getWinOpt: function (viewopt, opts) {
    // 优先使用config中配置，覆盖js中的定义
    var def = getDefWindowOptions();
    var windowOptions = $.extend(def, viewopt.windowOptions);
    windowOptions = $.extend(windowOptions, this.config.windowOptions);
    viewopt.windowOptions = windowOptions; // 赋值
    var that = this;
    var _size = this._getWinSize(windowOptions);

    // 默认值
    var defOpts = {
      title: windowOptions.noTitle ? false : this.config.name || " ",
      area: _size.area,
      offset: _size.offset,
      shade: 0,
      maxmin: false,
      zIndex: layer.zIndex,
      end: () => {
        // 销毁后，触发的回调
        viewopt._layerIdx = -1;
        viewopt._dom = null;
        that.disableBase();
      },
      full: () => {
        // 最大化后触发的回调
        that.winFull(dom);
      },
      min: (dom) => {
        // 最小化后触发的回调
        that.winRestore(dom);
      },
      restore: (dom) => {
        // 还原后触发的回调
        that.winRestore(dom);
      },
    };
    var cfgOpts = $.extend(defOpts, windowOptions);
    return $.extend(cfgOpts, opts || {});
  },

  // 计算弹窗大小和位置
  _getWinSize: function (windowOptions) {
    // 获取高宽
    var _width = this.bfb2Number(
      windowOptions.width,
      document.documentElement.clientWidth,
      windowOptions
    );
    var _height = this.bfb2Number(
      windowOptions.height,
      document.documentElement.clientHeight,
      windowOptions
    );

    // 计算位置offset
    var offset = "";
    var position = windowOptions.position;
    if (position) {
      if (typeof position == "string") {
        //t顶部,b底部,r右边缘,l左边缘,lt左上角,lb左下角,rt右上角,rb右下角
        offset = position;
      } else if (
        typeof position === "undefined"
          ? "undefined"
          : typeof position == "object"
      ) {
        var _top;
        var _left;

        if (position.hasOwnProperty("top") && position.top != null) {
          _top = this.bfb2Number(
            position.top,
            document.documentElement.clientHeight,
            windowOptions
          );
        }
        if (position.hasOwnProperty("bottom") && position.bottom != null) {
          windowOptions._hasresize = true;

          var _bottom = this.bfb2Number(
            position.bottom,
            document.documentElement.clientHeight,
            windowOptions
          );

          if (_top != null) {
            _height = document.documentElement.clientHeight - _top - _bottom;
          } else {
            _top = document.documentElement.clientHeight - _height - _bottom;
          }
        }

        if (position.hasOwnProperty("left") && position.left != null) {
          _left = this.bfb2Number(
            position.left,
            document.documentElement.clientWidth,
            windowOptions
          );
        }
        if (position.hasOwnProperty("right") && position.right != null) {
          windowOptions._hasresize = true;
          var _right = this.bfb2Number(
            position.right,
            document.documentElement.clientWidth,
            windowOptions
          );

          if (_left != null) {
            _width = document.documentElement.clientWidth - _left - _right;
          } else {
            _left = document.documentElement.clientWidth - _width - _right;
          }
        }

        if (_top == null)
          _top = (document.documentElement.clientHeight - _height) / 2;
        if (_left == null)
          _left = (document.documentElement.clientWidth - _width) / 2;

        offset = [_top + "px", _left + "px"];
      }
    }

    //最大最小高度判断
    if (
      windowOptions.hasOwnProperty("minHeight") &&
      _height < windowOptions.minHeight
    ) {
      windowOptions._hasresize = true;
      _height = windowOptions.minHeight;
    }
    if (
      windowOptions.hasOwnProperty("maxHeight") &&
      _height > windowOptions.maxHeight
    ) {
      windowOptions._hasresize = true;
      _height = windowOptions.maxHeight;
    }

    //最大最小宽度判断
    if (
      windowOptions.hasOwnProperty("minHeight") &&
      _width < windowOptions.minWidth
    ) {
      windowOptions._hasresize = true;
      _width = windowOptions.minWidth;
    }
    if (
      windowOptions.hasOwnProperty("maxWidth") &&
      _width > windowOptions.maxWidth
    ) {
      windowOptions._hasresize = true;
      _width = windowOptions.maxWidth;
    }

    var area;
    if (_width && _height) area = [_width + "px", _height + "px"];
    else area = _width + "px";

    return {
      area: area,
      offset: offset,
    };
  },

  bfb2Number: function (str, allnum, windowOptions) {
    if (typeof str == "string" && str.indexOf("%") != -1) {
      windowOptions._hasresize = true;

      return (allnum * Number(str.replace("%", ""))) / 100;
    }
    return str;
  },
  //==============直接添加到index上=================
  _appendView: function (viewopt) {
    if (this.isCreate && viewopt._dom) {
      $(viewopt._dom).show({
        duration: 500,
      });
      this._startActivate(viewopt._dom);
    } else {
      var view_url = this._getUrl(viewopt.url);
      var that = this;
      that.getHtml(view_url, function (html) {
        viewopt._dom = $(html).appendTo(viewopt.parent || "body");

        that.winCreateOK(viewopt, html);

        that._viewcreate_okcount++;
        if (that._viewcreate_okcount >= that._viewcreate_allcount)
          that._startActivate(html);
      });
    }
  },

  //释放插件
  disableBase: function () {
    if (!this.isActivate) return;
    this.beforeDisable();

    var has = this.changeWidgetView(function (viewopts) {
      if (viewopts._layerIdx != null && viewopts._layerIdx != -1) {
        if (viewopts._layerOpening) {
          //窗口还在加载中
          //console.log('释放widget窗口还在加载中:' + viewopts._layerIdx);
        }
        layer.close(viewopts._layerIdx);
        return true;
      } else {
        if (viewopts.type == "append" && viewopts._dom)
          $(viewopts._dom).hide({
            duration: 1000,
          });
        if (viewopts.type == "custom" && viewopts.close) viewopts.close();
        return false;
      }
    });
    if (has) return;

    this.disable();
    this.isActivate = false;
    //console.log('释放widget:' + this.config.uri);
  },
  //设置view弹窗的显示和隐藏
  setViewVisible: function (visible) {
    this.changeWidgetView(function (viewopts) {
      if (viewopts._layerIdx != null && viewopts._layerIdx != -1) {
        if (visible) {
          $("#layui-layer" + viewopts._layerIdx).show();
        } else {
          $("#layui-layer" + viewopts._layerIdx).hide();
        }
      } else if (viewopts.type == "append" && viewopts._dom) {
        if (visible) $(viewopts._dom).show();
        else $(viewopts._dom).hide();
      }
    });
  },
  //设置view弹窗的css
  setViewCss: function (style) {
    this.changeWidgetView(function (viewopts) {
      if (viewopts._layerIdx != null && viewopts._layerIdx != -1) {
        $("#layui-layer" + viewopts._layerIdx).css(style);
      } else if (viewopts.type == "append" && viewopts._dom) {
        $(viewopts._dom).css(style);
      }
    });
  },
  //主窗体改变大小后触发
  indexResize: function () {
    if (!this.isActivate) return;

    var that = this;
    this.changeWidgetView(function (viewopts) {
      if (
        viewopts._layerIdx == null ||
        viewopts._layerIdx == -1 ||
        viewopts.windowOptions == null ||
        !viewopts.windowOptions._hasresize
      )
        return;

      var _size = that._getWinSize(viewopts.windowOptions);
      var _style = {
        width: _size.area[0],
        height: _size.area[1],
        top: _size.offset[0],
        left: _size.offset[1],
      };
      $(viewopts._dom).attr("myTopLeft", true);

      layer.style(viewopts._layerIdx, _style);

      if (viewopts.type == "divwindow") layer.iframeAuto(viewopts._layerIdx);
    });
  },
  _startActivate: function (layero) {
    this.activate(layero);
    if (this.config.success) {
      this.config.success(this);
    }
    if (!this.isActivate) {
      //窗口打开中没加载完成时，被释放
      this.disableBase();
    }
  },
  //子类继承后覆盖
  init: function () {},
  //子类继承后覆盖
  create: function (endfun) {},
  //子类继承后覆盖
  beforeActivate: function () {},
  activate: function (layero) {},

  //子类继承后覆盖
  beforeDisable: function () {},
  disable: function () {},

  //子类继承后覆盖
  winCreateOK: function (opt, result) {},
  //窗口最大化后触发
  winFull: function () {},
  //窗口最小化后触发
  winMin: function () {},
  //窗口还原 后触发
  winRestore: function () {},

  //公共方法
  getHtml: function (url, callback) {
    $.ajax({
      url: url,
      type: "GET",
      dataType: "html",
      timeout: 0, //永不超时
      success: function (data) {
        callback(data);
      },
    });
  },
});
