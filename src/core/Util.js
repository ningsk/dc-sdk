/*
 * @namespace Util
 *
 * Various utility functions, used by Leaflet internally.
 */

import * as Cesium from "cesium";

// @function extend(dest: Object, src?: Object): Object
// Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
export function extend(dest) {
  var i, j, len, src;

  for (j = 1, len = arguments.length; j < len; j++) {
    src = arguments[j];
    for (i in src) {
      dest[i] = src[i];
    }
  }
  return dest;
}

// @function create(proto: Object, properties?: Object): Object
// Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
export var create =
  Object.create ||
  (function () {
    function F() {}
    return function (proto) {
      F.prototype = proto;
      return new F();
    };
  })();

// @function bind(fn: Function, …): Function
// Returns a new function bound to the arguments passed, like [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
// Has a `L.bind()` shortcut.
export function bind(fn, obj) {
  var slice = Array.prototype.slice;

  if (fn.bind) {
    return fn.bind.apply(fn, slice.call(arguments, 1));
  }

  var args = slice.call(arguments, 2);

  return function () {
    return fn.apply(
      obj,
      args.length ? args.concat(slice.call(arguments)) : arguments
    );
  };
}

// @property lastId: Number
// Last unique ID used by [`stamp()`](#util-stamp)
export var lastId = 0;

// @function stamp(obj: Object): Number
// Returns the unique ID of an object, assigning it one if it doesn't have it.
export function stamp(obj) {
  /*eslint-disable */
  obj._leaflet_id = obj._leaflet_id || ++lastId;
  return obj._leaflet_id;
  /* eslint-enable */
}

// @function throttle(fn: Function, time: Number, context: Object): Function
// Returns a function which executes function `fn` with the given scope `context`
// (so that the `this` keyword refers to `context` inside `fn`'s code). The function
// `fn` will be called no more than one time per given amount of `time`. The arguments
// received by the bound function will be any arguments passed when binding the
// function, followed by any arguments passed when invoking the bound function.
// Has an `L.throttle` shortcut.
export function throttle(fn, time, context) {
  var lock, args, wrapperFn, later;

  later = function () {
    // reset lock and call if queued
    lock = false;
    if (args) {
      wrapperFn.apply(context, args);
      args = false;
    }
  };

  wrapperFn = function () {
    if (lock) {
      // called too soon, queue to call later
      args = arguments;
    } else {
      // call and lock until later
      fn.apply(context, arguments);
      setTimeout(later, time);
      lock = true;
    }
  };

  return wrapperFn;
}

// @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number
// Returns the number `num` modulo `range` in such a way so it lies within
// `range[0]` and `range[1]`. The returned value will be always smaller than
// `range[1]` unless `includeMax` is set to `true`.
export function wrapNum(x, range, includeMax) {
  var max = range[1],
    min = range[0],
    d = max - min;
  return x === max && includeMax ? x : ((((x - min) % d) + d) % d) + min;
}

// @function falseFn(): Function
// Returns a function which always returns `false`.
export function falseFn() {
  return false;
}

// @function formatNum(num: Number, digits?: Number): Number
// Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
export function formatNum(num, digits) {
  var pow = Math.pow(10, digits === undefined ? 6 : digits);
  return Math.round(num * pow) / pow;
}

// @function trim(str: String): String
// Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
export function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
}

// @function splitWords(str: String): String[]
// Trims and splits the string on whitespace and returns the array of parts.
export function splitWords(str) {
  return trim(str).split(/\s+/);
}

// @function setOptions(obj: Object, options: Object): Object
// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
export function setOptions(obj, options) {
  if (!Object.prototype.hasOwnProperty.call(obj, "options")) {
    obj.options = obj.options ? create(obj.options) : {};
  }
  for (var i in options) {
    obj.options[i] = options[i];
  }
  return obj.options;
}

// @function getParamString(obj: Object, existingUrl?: String, uppercase?: Boolean): String
// Converts an object into a parameter URL string, e.g. `{a: "foo", b: "bar"}`
// translates to `'?a=foo&b=bar'`. If `existingUrl` is set, the parameters will
// be appended at the end. If `uppercase` is `true`, the parameter names will
// be uppercased (e.g. `'?A=foo&B=bar'`)
export function getParamString(obj, existingUrl, uppercase) {
  var params = [];
  for (var i in obj) {
    params.push(
      encodeURIComponent(uppercase ? i.toUpperCase() : i) +
        "=" +
        encodeURIComponent(obj[i])
    );
  }
  return (
    (!existingUrl || existingUrl.indexOf("?") === -1 ? "?" : "&") +
    params.join("&")
  );
}

// @function indexOf(array: Array, el: Object): Number
// Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
export function indexOf(array, el) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === el) {
      return i;
    }
  }
  return -1;
}

// @property emptyImageUrl: String
// Data URI string containing a base64-encoded empty GIF image.
// Used as a hack to free memory from unused images on WebKit-powered
// mobile devices (by setting image `src` to this string).
export var emptyImageUrl =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

function getPrefixed(name) {
  return window["webkit" + name] || window["moz" + name] || window["ms" + name];
}

var lastTime = 0;

// fallback for IE 7-8
function timeoutDefer(fn) {
  var time = +new Date(),
    timeToCall = Math.max(0, 16 - (time - lastTime));

  lastTime = time + timeToCall;
  return window.setTimeout(fn, timeToCall);
}

export var requestFn =
  window.requestAnimationFrame ||
  getPrefixed("RequestAnimationFrame") ||
  timeoutDefer;
export var cancelFn =
  window.cancelAnimationFrame ||
  getPrefixed("CancelAnimationFrame") ||
  getPrefixed("CancelRequestAnimationFrame") ||
  function (id) {
    window.clearTimeout(id);
  };

// @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
// Schedules `fn` to be executed when the browser repaints. `fn` is bound to
// `context` if given. When `immediate` is set, `fn` is called immediately if
// the browser doesn't have native support for
// [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
// otherwise it's delayed. Returns a request ID that can be used to cancel the request.
export function requestAnimFrame(fn, context, immediate) {
  if (immediate && requestFn === timeoutDefer) {
    fn.call(context);
  } else {
    return requestFn.call(window, bind(fn, context));
  }
}

// @function cancelAnimFrame(id: Number): undefined
// Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
export function cancelAnimFrame(id) {
  if (id) {
    cancelFn.call(window, id);
  }
}

export function isNumber(obj) {
  return typeof obj == "number" && obj.constructor == Number;
}

export function isString(str) {
  return typeof str == "string" && str.constructor == String;
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function alert(msg, title) {
  if (window.haoutil && window.haoutil.alert)
    // 此方法需要引用haoutil
    window.haoutil.alert(msg);
  else if (window.layer)
    // 此方法需要引用layer.js
    layer.alert(msg, {
      title: title || "提示",
      skin: "layui-layer-lan layer-card-dialog",
      closeBtn: 0,
      anim: 0,
    });
  else alert(msg);
}

export function msg(msg) {
  if (window.haoutil && window.haoutil.msg) {
    // 此方法需要引用haoutil
    window.haoutil.msg(msg);
  } else if (window.toastr) {
    // 此方法需要引用toastr
    toastr.info(msg);
  } else if (window.layer) {
    layer.msg(msg); // 此方法需要引用layer.js
  } else {
    alert(msg);
  }
}

// url参数获取
export function getRequest() {
  var url = location.search; // 获取url中"?"符后的字符串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

export function getRequestByName(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

export function clone(obj) {
  if (
    null == obj ||
    "object" != (typeof obj === "undefined" ? "undefined" : typeof obj)
  )
    return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0, len = obj.length; i < len; ++i) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if ((typeof obj === "undefined" ? "undefined" : typeof obj) === "object") {
    var copy = {};
    for (var attr in obj) {
      if (attr == "_layer" || attr == "_layers" || attr == "_parent") continue;

      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }
  return obj;
}

export function template(str, data) {
  if (str == null) return str;
  for (var col in data) {
    var showVal = data[col];
    if (showVal == null || showVal == "Null" || showVal == "Unknown")
      showVal = "";
    str = str.replace(new RegExp("{" + col + "}", "gm"), showVal);
  }
  return str;
}

export function isPCBrowser() {
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone/i) == "iphone";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  if (
    bIsIpad ||
    bIsIphoneOs ||
    bIsMidp ||
    bIsUc7 ||
    bIsUc ||
    bIsAndroid ||
    bIsCE ||
    bIsWM
  ) {
    return false;
  } else {
    return true;
  }
}

// 获取浏览器类型及版本
export function getExplorerInfo() {
  var explorer = window.navigator.userAgent.toLowerCase();
  //ie
  if (explorer.indexOf("msie") >= 0) {
    var ver = Number(explorer.match(/msie ([\d]+)/)[1]);
    return {
      type: "IE",
      version: ver,
    };
  }
  //firefox
  else if (explorer.indexOf("firefox") >= 0) {
    var ver = Number(explorer.match(/firefox\/([\d]+)/)[1]);
    return {
      type: "Firefox",
      version: ver,
    };
  }
  //Chrome
  else if (explorer.indexOf("chrome") >= 0) {
    var ver = Number(explorer.match(/chrome\/([\d]+)/)[1]);
    return {
      type: "Chrome",
      version: ver,
    };
  }
  //Opera
  else if (explorer.indexOf("opera") >= 0) {
    var ver = Number(explorer.match(/opera.([\d]+)/)[1]);
    return {
      type: "Opera",
      version: ver,
    };
  }
  //Safari
  else if (explorer.indexOf("Safari") >= 0) {
    var ver = Number(explorer.match(/version\/([\d]+)/)[1]);
    return {
      type: "Safari",
      version: ver,
    };
  }
  return {
    type: explorer,
    version: -1,
  };
}

// 检测浏览器webgl支持
export function webglReport() {
  var exInfo = getExplorerInfo();
  if (exInfo.type == "IE" && exInfo.version < 11) {
    return false;
  }
  try {
    var glContext;
    var canvas = document.createElement("canvas");
    var requestWebgl2 = typeof WebGL2RenderingContext !== "undefined";
    if (requestWebgl2) {
      glContext =
        canvas.getContext("webgl2") ||
        canvas.getContext("experimental-webgl2") ||
        undefined;
    }
    if (glContext == null) {
      glContext =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl") ||
        undefined;
    }
    if (glContext == null) {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
}

// 从plot的标号默认值 F12打印 拷贝，方便读取
const configDefVal = {
  label: {
    edittype: "label",
    name: "文字",
    style: {
      text: "文字",
      color: "#ffffff",
      opacity: 1,
      font_family: "楷体",
      font_size: 30,
      border: true,
      border_color: "#000000",
      border_width: 3,
      background: false,
      background_color: "#000000",
      background_opacity: 0.5,
      font_weight: "normal",
      font_style: "normal",
      scaleByDistance: false,
      scaleByDistance_far: 1000000,
      scaleByDistance_farValue: 0.1,
      scaleByDistance_near: 1000,
      scaleByDistance_nearValue: 1,
      distanceDisplayCondition: false,
      distanceDisplayCondition_far: 10000,
      distanceDisplayCondition_near: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  point: {
    edittype: "point",
    name: "点标记",
    style: {
      pixelSize: 10,
      color: "#3388ff",
      opacity: 1,
      outline: true,
      outlineColor: "#ffffff",
      outlineOpacity: 0.6,
      outlineWidth: 2,
      scaleByDistance: false,
      scaleByDistance_far: 1000000,
      scaleByDistance_farValue: 0.1,
      scaleByDistance_near: 1000,
      scaleByDistance_nearValue: 1,
      distanceDisplayCondition: false,
      distanceDisplayCondition_far: 10000,
      distanceDisplayCondition_near: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  imagepoint: {
    edittype: "imagepoint",
    name: "图标点标记",
    style: {
      image: "",
      opacity: 1,
      scale: 1,
      rotation: 0,
      scaleByDistance: false,
      scaleByDistance_far: 1000000,
      scaleByDistance_farValue: 0.1,
      scaleByDistance_near: 1000,
      scaleByDistance_nearValue: 1,
      distanceDisplayCondition: false,
      distanceDisplayCondition_far: 10000,
      distanceDisplayCondition_near: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  model: {
    edittype: "model",
    name: "模型",
    style: {
      modelUrl: "",
      scale: 1,
      heading: 0,
      pitch: 0,
      roll: 0,
      fill: false,
      color: "#3388ff",
      opacity: 1,
      silhouette: false,
      silhouetteColor: "#ffffff",
      silhouetteSize: 2,
      silhouetteAlpha: 0.8,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  polyline: {
    edittype: "polyline",
    name: "线",
    position: {
      minCount: 2,
    },
    style: {
      lineType: "solid",
      color: "#3388ff",
      width: 4,
      clampToGround: false,
      outline: false,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      opacity: 1,
      zIndex: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  polylineVolume: {
    edittype: "polylineVolume",
    name: "管道线",
    position: {
      height: true,
      minCount: 2,
    },
    style: {
      color: "#00FF00",
      radius: 10,
      shape: "pipeline",
      outline: false,
      outlineColor: "#ffffff",
      opacity: 1,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  polygon: {
    edittype: "polygon",
    name: "面",
    position: {
      height: true,
      minCount: 3,
    },
    style: {
      fill: true,
      color: "#3388ff",
      opacity: 0.6,
      outline: true,
      outlineWidth: 1,
      outlineColor: "#ffffff",
      outlineOpacity: 0.6,
      clampToGround: false,
      zIndex: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  polygon_clampToGround: {
    edittype: "polygon_clampToGround",
    name: "贴地面",
    position: {
      height: false,
      minCount: 3,
    },
    style: {
      color: "#ffff00",
      opacity: 0.6,
      clampToGround: true,
      zIndex: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  extrudedPolygon: {
    edittype: "extrudedPolygon",
    name: "拉伸面",
    position: {
      height: true,
      minCount: 3,
    },
    style: {
      fill: true,
      color: "#00FF00",
      opacity: 0.6,
      outline: true,
      outlineWidth: 1,
      outlineColor: "#ffffff",
      outlineOpacity: 0.6,
      extrudedHeight: 100,
      perPositionHeight: true,
      zIndex: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  rectangle: {
    edittype: "rectangle",
    name: "矩形",
    position: {
      height: false,
      minCount: 2,
      maxCount: 2,
    },
    style: {
      height: 0,
      fill: true,
      color: "#3388ff",
      opacity: 0.6,
      outline: true,
      outlineWidth: 1,
      outlineColor: "#ffffff",
      outlineOpacity: 0.6,
      rotation: 0,
      clampToGround: false,
      zIndex: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  rectangle_clampToGround: {
    edittype: "rectangle_clampToGround",
    name: "贴地矩形",
    position: {
      height: false,
      minCount: 2,
      maxCount: 2,
    },
    style: {
      color: "#ffff00",
      opacity: 0.6,
      rotation: 0,
      clampToGround: true,
      zIndex: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  rectangleImg: {
    edittype: "rectangleImg",
    name: "贴地图片",
    position: {
      height: false,
      minCount: 2,
      maxCount: 2,
    },
    style: {
      image: "",
      opacity: 1,
      rotation: 0,
      clampToGround: true,
      zIndex: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  extrudedRectangle: {
    edittype: "extrudedRectangle",
    name: "拉伸矩形",
    position: {
      height: false,
      minCount: 2,
      maxCount: 2,
    },
    style: {
      extrudedHeight: 40,
      height: 0,
      fill: true,
      color: "#00FF00",
      opacity: 0.6,
      outline: true,
      outlineWidth: 1,
      outlineColor: "#ffffff",
      outlineOpacity: 0.6,
      rotation: 0,
      zIndex: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  ellipse: {
    edittype: "ellipse",
    name: "椭圆",
    position: {
      height: false,
    },
    style: {
      semiMinorAxis: 200,
      semiMajorAxis: 200,
      height: 0,
      fill: true,
      color: "#3388ff",
      opacity: 0.6,
      outline: true,
      outlineWidth: 1,
      outlineColor: "#ffffff",
      outlineOpacity: 0.6,
      rotation: 0,
      clampToGround: false,
      zIndex: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  ellipse_clampToGround: {
    edittype: "ellipse_clampToGround",
    name: "椭圆",
    position: {
      height: false,
    },
    style: {
      semiMinorAxis: 200,
      semiMajorAxis: 200,
      color: "#ffff00",
      opacity: 0.6,
      rotation: 0,
      clampToGround: true,
      zIndex: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  extrudedEllipse: {
    edittype: "extrudedEllipse",
    name: "圆柱体",
    position: {
      height: false,
    },
    style: {
      semiMinorAxis: 200,
      semiMajorAxis: 200,
      extrudedHeight: 200,
      height: 0,
      fill: true,
      color: "#00FF00",
      opacity: 0.6,
      outline: true,
      outlineWidth: 1,
      outlineColor: "#ffffff",
      outlineOpacity: 0.6,
      rotation: 0,
      zIndex: 0,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  ellipsoid: {
    edittype: "ellipsoid",
    name: "球体",
    style: {
      extentRadii: 200,
      widthRadii: 200,
      heightRadii: 200,
      fill: true,
      color: "#00FF00",
      opacity: 0.6,
      outline: true,
      outlineWidth: 1,
      outlineColor: "#ffffff",
      outlineOpacity: 0.6,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
  wall: {
    edittype: "wall",
    name: "墙体",
    position: {
      height: true,
      minCount: 2,
    },
    style: {
      extrudedHeight: 40,
      fill: true,
      color: "#00FF00",
      opacity: 0.6,
      outline: true,
      outlineWidth: 1,
      outlineColor: "#ffffff",
      outlineOpacity: 0.6,
    },
    attr: {
      id: "",
      name: "",
      remark: "",
    },
  },
};

// 地形构造
const _ellipsoid = new Cesium.EllipsoidTerrainProvider({
  ellipsoid: Cesium.Ellipsoid.WGS84,
});

// 计算贴地路线
export function terrainPolyline(params) {
  var viewer = params.viewer;
  var positions = params.positions;
  if (positions == null || positions.length == 0) {
    if (params.callback) params.callback(positions);
    return;
  }
  //TODO 待定
  var flatPositions = Cesium.PolylinePipeline.generateArc({
    position: positions,
    granularity: params.generateArc || 0.00001,
  });
  var cartographicArray = [];
  var ellipsoid = viewer.scene.globe.ellipsoid;
  for (var i = 0; i < flatPositions.length; i += 3) {
    var cartesian = Cesium.Cartesian3.unpack(flatPositions, i);
    cartographicArray.push(ellipsoid.cartesianToCartographic(cartesian));
  }

  // 用于缺少地形数据时，赋值的高度
  var tempHeight = Cesium.Cartographic.fromCartesian(positions[0]).height;

  Cesium2.when(
    Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, cartographicArray),
    function (samples) {
      var noHeight = false;
      var offset = params.offset || 2; //增高高度，便于可视

      for (var i = 0; i < samples.length; ++i) {
        if (samples[i].height == null) {
          noHeight = true;
          samples[i].height = tempHeight;
        } else {
          samples[i].height =
            offset + samples[i].height * viewer.scene._terrainExaggeration;
        }
      }

      var raisedPositions = ellipsoid.cartographicArrayToCartesianArray(
        samples
      );
      if (params.callback) params.callback(raisedPositions, noHeight);
      else if (positions.setValue) positions.setValue(raisedPositions);
    }
  );
}

export function getEllipsoidTerrain() {
  return _ellipsoid;
}

export function getTerrainProvider(cfg) {
  if (!cfg.hasOwnProperty("requestWaterMask")) {
    cfg.requestWaterMask = true;
  }
  if (!cfg.hasOwnProperty("requestVertexNormals")) {
    cfg.requestVertexNormals = true;
  }
  var terrainProvider;
  if (
    cfg.type == "icon" ||
    cfg.url == "ion" ||
    cfg.url == "" ||
    cfg.url == null
  ) {
    terrainProvider = new Cesium.CesiumTerrainProvider({
      url: Cesium.IonResource.fromAssetId(1),
    });
  } else if (cfg.type == "ellipsoid" || cfg.url == "ellipsoid") {
    terrainProvider = _ellipsoid;
  } else if (cfg.type == "gee") {
    // 谷歌地球地形服务
    terrainProvider = new Cesium.GoogleEarthEnterpriseImageryProvider({
      metadata: new Cesium.GoogleEarthEnterpriseMetadata(cfg),
    });
  } else {
    terrainProvider = new Cesium.CesiumTerrainProvider(cfg);
  }
  return terrainProvider;
}

// 创建模型
export function createModel(cfg, viewer) {
  cfg = viewer.card.point2map(cfg); // 转换坐标系
  var position = Cesium.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);
  var heading = Cesium.Math.toRadians(cfg.heading || 0);
  var pitch = Cesium.Math.toRadians(cfg.pitch || 0);
  var roll = Cesium.Math.toRadians(cfg.roll || 0);
  var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

  var converter = cfg.converter || Cesium.Transforms.eastNorthUpToFixedFrame;
  var orientation = Cesium.Transforms.headingPitchRollQuaternion(
    position,
    hpr,
    viewer.scene.globe.ellipsoid,
    converter
  );
  var model = viewer.entities.add({
    name: cfg.name || "",
    position: position,
    orientation: orientation,
    model: cfg,
    tooltip: cfg.tooltip,
    v,
    popup: cfg.popup,
  });
  return model;
}

export function formatDegree(value) {
  value = Math.abs(value);
  var v1 = Math.floor(value); // 度
  var v2 = Math.floor((value - v1) * 60); // 分
  var v3 = Math.round(((value - v1) * 3600) % 60); // 秒
  return v1 + "° " + v2 + "'  " + v3 + '"';
}

// 许可验证
export function checkToken(token) {
  var nowTime = new Date().getTime();
  var lastTime = Number(
    window.localStorage.getItem("tokenTime1987") || nowTime
  );
  var startTime = new Date(token.start).getTime();
  var endTime = new Date(token.end).getTime();
  if (
    (token.hostname &&
      window.location.hostname.indexOf(token.hostname) === -1) ||
    nowTime <= startTime ||
    nowTime >= endTime ||
    lastTime <= startTime ||
    lastTime >= endTime
  ) {
    if (window.layer)
      layer.open({
        type: 1,
        title: unescape("%u8BB8%u53EF%u5230%u671F%u63D0%u793A"), //"许可到期提示",
        skin: "layer-card-dialog",
        shade: [1, "#000"],
        closeBtn: 0,
        resize: false,
        area: ["400px", "150px"], //宽高
        content: '<div style="margin: 20px;">' + token.msg + "</div>",
      });
    else alert(token.msg);
    return false;
  } else {
    window.localStorage.setItem("tokenTime1987", nowTime);
    setTimeout(function () {
      checkToken(token);
    }, 600000 + Math.random() * 600000); //随机10分钟-20分钟内再次校验
    return true;
  }
}

/**
 * 计算曲线链路的点集（a点到b点的，空中曲线）
 * @param {*} startPoint  开始节点
 * @param {*} endPoint   结束节点
 * @param {*} angularityFactor  曲率
 * @param {*} numOfSingleLine  点集数量
 */
export function getLinkedPointList(
  startPoint,
  endPoint,
  angularityFactor,
  numOfSingleLine
) {
  var result = [];
  var startPosition = Cesium.Cartographic.fromCartesian(startPoint);
  var endPosition = Cesium.Cartographic.fromCartesian(endPoint);
  var startLon = (startPosition.longitude * 180) / Math.PI;
  var startLat = (startPosition.latitude * 180) / Math.PI;
  var endLon = (endPosition.longitude * 180) / Math.PI;
  var endLat = (endPosition.latitude * 180) / Math.PI;

  var dist = Math.sqrt(
    (startLon - endLon) * (startLon - endLon) +
      (startLat - endLat) * (startLat - endLat)
  );
  // var dist = Cesium.Cartesian3.distance(startPoint, endPoint);
  var angularity = dist * angularityFactor;

  var startVec = Cesium.Cartesian3.clone(startPoint);
  var endVec = Cesium.Cartesian3.clone(endPoint);
  var startLength = Cesium.Cartesian3.distance(
    startVec,
    Cesium.Cartesian3.ZERO
  );
  var endLength = Cesium.Cartesian3.distance(endVec, Cesium.Cartesian3.ZERO);
  Cesium.Cartesian3.normalize(startVec, startVec);
  Cesium.Cartesian3.normalize(endVec, endVec);
  if (Cesium.Cartesian3.distance(startVec, endVec) == 0) {
    return result;
  }
  // var cosOmega = Cesium.Cartesian3.dot(startVec, endVec);
  // var omega = Math.acos(cosOmega);
  var omega = Cesium.Cartesian3.angleBetween(startVec, endVec);

  result.push(startPoint);
  for (var i = 1; i < numOfSingleLine - 1; i++) {
    var t = (i * 1.0) / (numOfSingleLine - 1);
    var invT = 1 - t;

    var startScalar = Math.sin(invT * omega) / Math.sin(omega);
    var endScalar = Math.sin(t * omega) / Math.sin(omega);

    var startScalarVec = Cesium.Cartesian3.multiplyByScalar(
      startVec,
      startScalar,
      new Cesium.Cartesian3()
    );
    var endScalarVec = Cesium.Cartesian3.multiplyByScalar(
      endVec,
      endScalar,
      new Cesium.Cartesian3()
    );

    var centerVec = Cesium.Cartesian3.add(
      startScalarVec,
      endScalarVec,
      new Cesium.Cartesian3()
    );

    var ht = t * Math.PI;
    var centerLength =
      startLength * invT + endLength * t + Math.sin(ht) * angularity;
    centerVec = Cesium.Cartesian3.multiplyByScalar(
      centerVec,
      centerLength,
      centerVec
    );

    result.push(centerVec);
  }

  result.push(endPoint);

  return result;
}

/**
 * 剔除与默认值相同的值
 */
export function removeGeoJsonDefVal(geojson) {
  if (!geojson.properties || !geojson.properties.type) return geojson;
  var type = geojson.properties.edittype || geojson.properties.type;
  var def = configDefVal[type];
  if (!def) return geojson;
  var newGeoJson = clone(geojson);
  if (geojson.properties.style) {
    var newStyle = {};
    for (var i in geojson.properties.style) {
      var val = geojson.properties.style[i];
      if (val == null) {
        continue;
      }
      var valDef = def.style[i];
      if (valDef === val) continue;
      newStyle[i] = val;
    }
    newGeoJson.properties.style = newStyle;
  }

  if (geojson.properties.attr) {
    var newAttr = {};
    for (var i in geojson.properties.attr) {
      var val = geojson.properties.attr[i];
      if (val == null) continue;
      var valDef = def.attr[i];
      if (valDef === val) continue;
      newAttr[i] = val;
    }
    newGeoJson.properties.attr = newAttr;
  }
  return newGeoJson;
}

export function addGeoJsonDefVal(properties) {
  // 赋默认值
  var def = configDefVal[properties.edittype || properties.type];
  if (def) {
    properties.style = properties.style || {};
    for (var key in def.style) {
      var val = properties.style[key];
      if (val != null) continue;
      properties.style[key] = def.style[key];
    }
    properties.attr = properties.attr || {};
    for (var key in def.attr) {
      var val = properties.attr[key];
      if (val != null) continue;
      properties.attr[key] = def.attr[key];
    }
  }
  return properties;
}

/**
 * cesium坐标 转经纬度坐标[用于转geojson]
 * @param {Array} 数组
 */
export function cartesians2lonlats(positions) {
  var coordinates = [];
  for (var i = 0, len = positions.length; i < len; i++) {
    var point = this.cartesian2lonlat(positions[i]);
    coordinates.push(point);
  }
  return coordinates;
}

/**
 * 经纬度坐标转cesium坐标
 */
export function lonlat2cartesian(coord, defHeight) {
  return Cesium.Cartesian3.fromDegrees(
    coords[0],
    coords[1],
    coords[2] || defHeight || 0
  );
}

/**
 * 经纬度坐标转cesium坐标
 */
export function lonlats2cartesians(coords, defHeight) {
  var arr = [];
  for (var i = 0, len = coords.length; i < len; i++) {
    var item = coords[i];
    if (isArray(item[0])) arr.push(this.lonlats2cartesians(item, defHeight));
    else arr.push(this.lonlat2cartesian(item, defHeight));
  }
  return arr;
}

/**
 * Cesium坐标 转 经纬度坐标 [用于geojson]
 */
export function cartesian2lonlat(cartesian) {
  var carto = Cesium.Cartographic.fromCartesian(cartesian);
  if (carto == null) return {};
  var x = formatNum(Cesium.Math.toDegrees(carto.longitude), 6);
  var y = formatNum(Cesium.Math.toDegrees(carto.latitude), 6);
  var z = formatNum(Cesium.Math.toDegrees(carto.latitude), 6);
  return [x, y, z];
}

/**
 * geojson 转 entity
 */
export function getPositionByGeoJSON(geojson, defHeight) {
  var geometry = geojson.type === "Feature" ? geojson.geometry : geojson;
  var coords = geometry ? geometry.coordinates : null;
  if (!coords && !geometry) {
    return null;
  }
  switch (geometry.type) {
    case "Point":
      return lonlat2cartesian(coords, defHeight);
    case "MultiPoint":
      return lonlats2cartesians(coords, defHeight);
    case "LineString":
      return lonlats2cartesians(coords, defHeight);
    case "MultiLineString":
    case "Polygon":
      return lonlats2cartesians(coords[0], defHeight);
    case "MultiPolygon":
      return lonlats2cartesians(coords[0][0], defHeight);
    default:
      throw new Error("Invalid GeoJson object.");
  }
}
export function isPCBroswer() {
  var sUserAgent = navigator.userAgent.toLowerCase();

  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone/i) == "iphone";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  if (
    bIsIpad ||
    bIsIphoneOs ||
    bIsMidp ||
    bIsUc7 ||
    bIsUc ||
    bIsAndroid ||
    bIsCE ||
    bIsWM
  ) {
    return false;
  } else {
    return true;
  }
}
