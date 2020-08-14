/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-13 09:14:12
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-13 14:30:44
 */

import * as Cesium from 'cesium';
import { win } from 'leaflet/src/core/Browser';

class Util {
  static isNumber(obj) {
    return typeof obj == "number" && obj.constructor == Number;
  }
  
  static isString(str) {
    return typeof str == "string" && str.constructor == String;
  }
  
  static alert(msg, title) {
    if (window.haoutil && window.haoutil.alert)
      // 此方法需要引用haoutil
      window.haoutil.alert(msg);
    else if (window.layer)
      // 此方法需要引用layer.js
      layer.alert(msg, {
        title: title || "提示",
        skin: "layui-layer-lan layer-mars-dialog",
        closeBtn: 0,
        anim: 0,
      });
    else alert(msg);
  }
  
  static msg(msg) {
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
  static getRequest() {
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
  
  static getRequestByName(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  }
  
  static clone(obj) {
    if (
      null == obj ||
      "object" != (typeof obj === "undefined" ? "undefined" : _typeof(obj))
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
    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object") {
      var copy = {};
      for (var attr in obj) {
        if (attr == "_layer" || attr == "_layers" || attr == "_parent") continue;
  
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
      }
      return copy;
    }
    return obj;
  }
  
  static template(str, data) {
    if (str == null) return str;
    for (val col in data) {
      var showVal = data[col];
      if (showVal == null || showVal == "Null" || showVal == "Unknown") showVal = "";
      str = str.replace(new RegExp('{' + col + '}', "gm"), showVal);
    } 
    return str;
  }
  
  static isPCBrowser() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone/i) == "iphone";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
      return false;
    } else {
      return true;
    }
  }
  
  // 获取浏览器类型及版本
  static getExplorerInfo() {
    var explorer = window.navigator.userAgent.toLowerCase();
    //ie 
    if (explorer.indexOf("msie") >= 0) {
      var ver = Number(explorer.match(/msie ([\d]+)/)[1]);
      return {
        type: "IE",
        version: ver
      };
    }
    //firefox 
    else if (explorer.indexOf("firefox") >= 0) {
      var ver = Number(explorer.match(/firefox\/([\d]+)/)[1]);
      return {
        type: "Firefox",
        version: ver
      };
    }
    //Chrome
    else if (explorer.indexOf("chrome") >= 0) {
      var ver = Number(explorer.match(/chrome\/([\d]+)/)[1]);
      return {
        type: "Chrome",
        version: ver
      };
    }
    //Opera
    else if (explorer.indexOf("opera") >= 0) {
      var ver = Number(explorer.match(/opera.([\d]+)/)[1]);
      return {
        type: "Opera",
        version: ver
      };
    }
    //Safari
    else if (explorer.indexOf("Safari") >= 0) {
      var ver = Number(explorer.match(/version\/([\d]+)/)[1]);
      return {
        type: "Safari",
        version: ver
      };
    }
    return {
      type: explorer,
      version: -1
    };
  }
  
  // 检测浏览器webgl支持
  static webglReport() {
    var exInfo = getExplorerInfo();
    if (exInfo.type == 'IE' && exInfo.version < 11) {
      return false;
    }
    try {
      val glContext;
      var canvas = document.createElement('canvas');
      var requestWebgl2 = typeof WebGL2RenderingContext !== 'undefined';
      if (requestWebgl2) {
        glContext = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2') || undefined;
      }
      if (glContext == null) {
        glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || undefined
      }
      if (glContext == null) {
        return false;
      } 
    } catch (e) {
      return false;
    }
    return true;
  }
  

  
  // 计算贴地路线
  static terrainPolyline(params) {
    var viewer = params.viewer;
    var positions = params.positions;
    if (positions == null || positions.length == 0) {
      if (params.callback) params.callback(positions);
      return;
    }
    //TODO 待定
  }
  
  // 地形构造
  var _ellipsoid = new Cesium.EllipsoidTerrainProvider({
    ellipsoid: Cesium.Ellipsoid.WGS84
  });
  
  static getEllipsoidTerrain() {
    return _ellipsoid;
  }
  
  static getTerrainProvider(cfg) {
    if (!cfg.hasOwnProperty("requestWaterMask")) {
      cfg.requestWaterMask = true;
    }
    if (!cfg.hasOwnProperty("requestVertexNormals")) {
      cfg.requestVertexNormals = true;
    }
    var terrainProvider;
    if (cfg.type == "icon" || cfg.url == "ion" ||cfg.url == "" || cfg.url == null) {
      terrainProvider = new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(1)
      })
    } else if (cfg.type == "ellipsoid" || cfg.url == "ellipsoid") {
      terrainProvider = _ellipsoid;
    } else if (cfg.type == "gee") {
      // 谷歌地球地形服务
      terrainProvider = new Cesium.GoogleEarthEnterpriseImageryProvider({
        metadata: new Cesium.GoogleEarthEnterpriseMetadata(cfg)
      })
    } else {
      terrainProvider = new Cesium.CesiumTerrainProvider(cfg);
    }
    return terrainProvider;
  }
  
  // 创建模型
  static createModel(cfg, viewer) {
    cfg = viewer.mars.point2map(cfg); // 转换坐标系
    var position = Cesium.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);
    var heading = Cesium.Math.toRadians(cfg.heading || 0);
    var pitch = Cesium.Math.toRadians(cfg.pitch || 0);
    var roll = Cesium.Math.toRadians(cfg.roll || 0);
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    
    var converter = cfg.converter || Cesium.Transforms.eastNorthUpToFixedFrame;
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position, hpr, viewer.scene.globe.ellipsoid,converter
    );
    var model = viewer.entities.add({
      name: cfg.name || "",
      position: position,
      orientation: orientation,
      model: cfg,
      tooltip: cfg.tooltip,v,
      popup: cfg.popup
    });
    return model;
  }
  
  static formatDegree(value) {
    value = Math.abs(value);
    val v1 = Math.floor(value); // 度
    var v2 = Math.floor((value - v1) * 60); // 分
    var v3 = Math.round((value - v1) * 3600 % 60); // 秒
    return v1 + '° ' + v2 + '\'  ' + v3 + '"';
  }
  
  // 许可验证
  static checkToken(token) {
    var nowTime = new Date().getTime();
    var lastTime = Number(window.localStorage.getItem('tokenTime1987') || nowTime);
    var startTime = new Date(token.start).getTime();
    var endTime = new Date(token.end).getTime();
    if (token.hostname && window.location.hostname.indexOf(token.hostname) === -1 || nowTime <= startTime || nowTime >=
            endTime || lastTime <= startTime || lastTime >= endTime) {
            if (window.layer) layer.open({
              type: 1,
              title: unescape('%u8BB8%u53EF%u5230%u671F%u63D0%u793A'), //"许可到期提示",
              skin: "layer-mars-dialog",
              shade: [1, '#000'],
              closeBtn: 0,
              resize: false,
              area: ['400px', '150px'], //宽高
              content: '<div style="margin: 20px;">' + token.msg + '</div>'
            });
            else alert(token.msg);
            return false;
          } else {
            window.localStorage.setItem('tokenTime1987', nowTime);
            setTimeout(function() {
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
  static getLinkedPointList(startPoint, endPoint, angularityFactor,numOfSingleLine) {
    var result = [];
    var startPosition = Cesium.Cartographic.fromCartesian(startPoint);
    var endPosition = Cesium.Cartographic.fromCartesian(endPoint);
    var startLon = startPosition.longitude * 180 / Math.PI;
    var startLat = startPosition.latitude * 180 / Math.PI;
    var endLon = endPosition.longitude * 180 / Math.PI;
    var endLat = endPosition.latitude * 180 / Math.PI;
  
    var dist = Math.sqrt((startLon - endLon) * (startLon - endLon) + (startLat - endLat) * (startLat - endLat))
    // var dist = Cesium.Cartesian3.distance(startPoint, endPoint);
    var angularity = dist * angularityFactor;
  
    var startVec = Cesium.Cartesian3.clone(startPoint);
    var endVec = Cesium.Cartesian3.clone(endPoint);
    var startLength = Cesium.Cartesian3.distance(startVec, Cesium.Cartesian3.ZERO);
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
        var t = i * 1.0 / (numOfSingleLine - 1);
        var invT = 1 - t;
  
        var startScalar = Math.sin(invT * omega) / Math.sin(omega);
        var endScalar = Math.sin(t * omega) / Math.sin(omega);
  
        var startScalarVec = Cesium.Cartesian3.multiplyByScalar(startVec, startScalar, new Cesium.Cartesian3());
        var endScalarVec = Cesium.Cartesian3.multiplyByScalar(endVec, endScalar, new Cesium.Cartesian3());
  
        var centerVec = Cesium.Cartesian3.add(startScalarVec, endScalarVec, new Cesium.Cartesian3());
  
        var ht = t * Math.PI;
        var centerLength = startLength * invT + endLength * t + Math.sin(ht) * angularity;
        centerVec = Cesium.Cartesian3.multiplyByScalar(centerVec, centerLength, centerVec);
  
        result.push(centerVec);
    }
  
    result.push(endPoint);
  
    return result;
  }
} 

export default Util

