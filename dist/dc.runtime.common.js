(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cesium'), require('jquery'), require('leaflet'), require('turf'), require('Cesium'), require('esri-leaflet/src/Util'), require('echarts')) :
  typeof define === 'function' && define.amd ? define(['exports', 'cesium', 'jquery', 'leaflet', 'turf', 'Cesium', 'esri-leaflet/src/Util', 'echarts'], factory) :
  (factory((global.DC = {}),global.Cesium$1,global.$$1,global.leaflet,global.turf,global.Cesium$2,global.EsriUtil,global.echarts));
}(this, (function (exports,Cesium$1,$$1,leaflet,turf,Cesium$2,EsriUtil,echarts) { 'use strict';

  var Cesium$1__default = 'default' in Cesium$1 ? Cesium$1['default'] : Cesium$1;
  $$1 = $$1 && $$1.hasOwnProperty('default') ? $$1['default'] : $$1;
  Cesium$2 = Cesium$2 && Cesium$2.hasOwnProperty('default') ? Cesium$2['default'] : Cesium$2;
  EsriUtil = EsriUtil && EsriUtil.hasOwnProperty('default') ? EsriUtil['default'] : EsriUtil;
  echarts = echarts && echarts.hasOwnProperty('default') ? echarts['default'] : echarts;

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-24 13:19:53
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-07 10:04:01
   */

  var cameraFunc; //键盘漫游  第一人称漫游

  function bind(viewer) {
    var scene = viewer.scene;
    var canvas = viewer.canvas;
    canvas.setAttribute("tabindex", "0"); // needed to put focus on the canvas
    canvas.onclick = function () {
      canvas.focus();
    };
    var ellipsoid = scene.globe.ellipsoid;

    // disable the default event handlers
    scene.screenSpaceCameraController.enableRotate = false;
    scene.screenSpaceCameraController.enableTranslate = false;
    scene.screenSpaceCameraController.enableZoom = false;
    scene.screenSpaceCameraController.enableTilt = false;
    scene.screenSpaceCameraController.enableLook = false;

    var startMousePosition;
    var mousePosition;
    var flags = {
      looking: false,
      moveForward: false,
      moveBackward: false,
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false,
    };

    var speedRatio = 100;

    var handler = new Cesium$1__default.ScreenSpaceEventHandler(canvas);

    handler.setInputAction(function (movement) {
      flags.looking = true;
      mousePosition = startMousePosition = _Cesium2.default.Cartesian3.clone(
        movement.position
      );
    }, Cesium$1__default.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction(function (movement) {
      mousePosition = movement.endPosition;
    }, Cesium$1__default.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function (position) {
      flags.looking = false;
    }, Cesium$1__default.ScreenSpaceEventType.LEFT_UP);

    handler.setInputAction(function (delta) {
      if (delta > 0) {
        speedRatio = speedRatio * 0.8;
      } else {
        speedRatio = speedRatio * 1.2;
      }
      console.log(delta);
    }, Cesium$1__default.ScreenSpaceEventType.WHEEL);

    function getFlagForKeyCode(keyCode) {
      switch (keyCode) {
        case 38: //镜头前进
        case "W".charCodeAt(0):
          return "moveForward";
        case "S".charCodeAt(0):
        case 40:
          //镜头后退
          return "moveBackward";
        case "D".charCodeAt(0):
        case 39:
          //向右平移镜头
          return "moveRight";
        case "A".charCodeAt(0):
        case 37:
          //向左平移镜头
          return "moveLeft";
        case "Q".charCodeAt(0):
          return "moveUp";
        case "E".charCodeAt(0):
          return "moveDown";
        default:
          return undefined;
      }
    }

    document.addEventListener(
      "keydown",
      function (e) {
        var flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== "undefined") {
          flags[flagName] = true;
        }
      },
      false
    );

    document.addEventListener(
      "keyup",
      function (e) {
        var flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== "undefined") {
          flags[flagName] = false;
        }
      },
      false
    );

    function moveForward(distance) {
      //和模型的相机移动不太一样  不是沿着相机目标方向，而是默认向上方向 和 向右 方向的插值方向
      var camera = viewer.camera;
      var direction = camera.direction;
      //获得此位置默认的向上方向
      var up = Cesium$1__default.Cartesian3.normalize(
        camera.position,
        new Cesium$1__default.Cartesian3()
      );

      // right = direction * up
      var right = Cesium$1__default.Cartesian3.cross(direction, up, new Cesium$1__default.Cartesian3());

      direction = Cesium$1__default.Cartesian3.cross(up, right, new Cesium$1__default.Cartesian3());

      direction = Cesium$1__default.Cartesian3.normalize(direction, direction);
      direction = Cesium$1__default.Cartesian3.multiplyByScalar(
        direction,
        distance,
        direction
      );

      camera.position = Cesium$1__default.Cartesian3.add(
        camera.position,
        direction,
        camera.position
      );
    }

    cameraFunc = function cameraFunc(clock) {
      var camera = viewer.camera;

      if (flags.looking) {
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;

        // Coordinate (0.0, 0.0) will be where the mouse was clicked.
        var x = (mousePosition.x - startMousePosition.x) / width;
        var y = -(mousePosition.y - startMousePosition.y) / height;

        //这计算了，分别向右 和 向上移动的
        var lookFactor = 0.05;
        camera.lookRight(x * lookFactor);
        camera.lookUp(y * lookFactor);

        //获得direction 方向
        var direction = camera.direction;
        //获得此位置默认的向上方向
        var up = Cesium$1__default.Cartesian3.normalize(
          camera.position,
          new Cesium$1__default.Cartesian3()
        );

        // right = direction * up
        var right = Cesium$1__default.Cartesian3.cross(
          direction,
          up,
          new Cesium$1__default.Cartesian3()
        );
        // up = right * direction
        up = Cesium$1__default.Cartesian3.cross(right, direction, new Cesium$1__default.Cartesian3());

        camera.up = up;
        camera.right = right;
      }

      // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
      var cameraHeight = ellipsoid.cartesianToCartographic(camera.position)
        .height;
      var moveRate = cameraHeight / speedRatio;

      if (flags.moveForward) {
        moveForward(moveRate);
      }
      if (flags.moveBackward) {
        moveForward(-moveRate);
      }
      if (flags.moveUp) {
        camera.moveUp(moveRate);
      }
      if (flags.moveDown) {
        camera.moveDown(moveRate);
      }
      if (flags.moveLeft) {
        camera.moveLeft(moveRate);
      }
      if (flags.moveRight) {
        camera.moveRight(moveRate);
      }
    };

    viewer.clock.onTick.addEventListener(cameraFunc);
  }

  function unbind(viewer) {
    var scene = viewer.scene;
    var canvas = viewer.canvas;
    scene.screenSpaceCameraController.enableRotate = true;
    scene.screenSpaceCameraController.enableTranslate = true;
    scene.screenSpaceCameraController.enableZoom = true;
    scene.screenSpaceCameraController.enableTilt = true;
    scene.screenSpaceCameraController.enableLook = true;

    if (cameraFunc) {
      viewer.clock.onTick.removeEventListener(cameraFunc);
      cameraFunc = undefined;
    }
  }

  var FirstPerson$1 = ({
    bind: bind,
    unbind: unbind
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-03 09:47:51
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-09 10:36:13
   */

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-25 16:17:18
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-10 11:15:11
   */

  // 拖拽点分类
  var PointType$$1 = {
    Control: 1, // 位置控制
    AddMidPoint: 2, // 辅助增加新点
    MoveHeight: 3, // 上下移动高度
    EditAttr: 4, // 辅助修改属性（如半径）
    EditRotation: 5, // 旋转角度修改
  };
  // 拖拽点颜色
  var PointColor$$1 = {
    Control: new Cesium$1__default.Color.fromCssColorString("#2c197d"), // 位置控制拖拽点
    MoveHeight: new Cesium$1__default.Color.fromCssColorString("#9500eb"), // 上下移动高度的拖拽点
    EditAttr: new Cesium$1__default.Color.fromCssColorString("#f73163"), // 辅助修改属性（如半径）的拖拽点
    AddMidPoint: new Cesium$1__default.Color.fromCssColorString("#04c2c9").withAlpha(0.3), // 增加新点，辅助拖拽点
  };

  /**
   * 创建Dragger拖动点的公共方法
   * @param {*} dataSource
   * @param {*} options
   */
  var createDragger$$1 = function (dataSource, options) {
    var dragger;
    if (options.dragger) {
      dragger = options.dragger;
    } else {
      var attr = {
        scale: 1,
        pixelSize: this.PixelSize,
        outlineColor: new Cesium$1__default.Color.fromCssColorString("#ffffff").withAlpha(
          0.5
        ),
        outlineWidth: 2,
        scaleByDistance: new Cesium$1__default.NearFarScalar(1000, 1, 1000000, 0.5),
        heightReference: options.clamToGround
          ? Cesium$1__default.HeightReference.CLAMP_TO_GROUND
          : Cesium$1__default.HeightReference.NONE,
      };
      attr = this.getAttrForType(options.type, attr);

      dragger = data.entities.add({
        position: Cesium$1__default.defaultValue(options.position, Cesium$1__default.Cartesian3.ZERO),
        point: attr,
        draw_tooltip: options.tooltip || message.dragger.def,
      });
    }

    dragger._isDragger = true;
    dragger._pointType = options.type || this.PointType.Control; // 默认是位置控制拖拽点
    dragger.onDragStart = Cesium$1__default.defaultValue(options.onDragStart, null);
    dragger.onDrag = Cesium$1__default.defaultValue(options.onDrag, null);
    dragger.onDragEnd = Cesium$1__default.defaultValue(options.onDragEnd, null);
    return dragger;
  };

  var Dragger$1 = ({
    PointType: PointType$$1,
    PointColor: PointColor$$1,
    createDragger: createDragger$$1
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-13 09:14:12
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:37:00
   */

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
  const _ellipsoid = new Cesium$1.EllipsoidTerrainProvider({
    ellipsoid: Cesium$1.Ellipsoid.WGS84,
  });

  function isNumber(obj) {
    return typeof obj == "number" && obj.constructor == Number;
  }

  function isString(str) {
    return typeof str == "string" && str.constructor == String;
  }

  function isArray(arr) {
    return Array.isArray(arr);
  }

  function alert(msg, title) {
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

  function msg(msg) {
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
  function getRequest() {
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

  function getRequestByName(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  }

  function clone(obj) {
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

  function template(str, data) {
    if (str == null) return str;
    for (var col in data) {
      var showVal = data[col];
      if (showVal == null || showVal == "Null" || showVal == "Unknown")
        showVal = "";
      str = str.replace(new RegExp("{" + col + "}", "gm"), showVal);
    }
    return str;
  }

  function isPCBrowser() {
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
  function getExplorerInfo() {
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
  function webglReport() {
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

  // 计算贴地路线
  function terrainPolyline(params) {
    var viewer = params.viewer;
    var positions = params.positions;
    if (positions == null || positions.length == 0) {
      if (params.callback) params.callback(positions);
      return;
    }
    //TODO 待定
  }

  function getEllipsoidTerrain() {
    return _ellipsoid;
  }

  function getTerrainProvider(cfg) {
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
      terrainProvider = new Cesium$1.CesiumTerrainProvider({
        url: Cesium$1.IonResource.fromAssetId(1),
      });
    } else if (cfg.type == "ellipsoid" || cfg.url == "ellipsoid") {
      terrainProvider = _ellipsoid;
    } else if (cfg.type == "gee") {
      // 谷歌地球地形服务
      terrainProvider = new Cesium$1.GoogleEarthEnterpriseImageryProvider({
        metadata: new Cesium$1.GoogleEarthEnterpriseMetadata(cfg),
      });
    } else {
      terrainProvider = new Cesium$1.CesiumTerrainProvider(cfg);
    }
    return terrainProvider;
  }

  // 创建模型
  function createModel(cfg, viewer) {
    cfg = viewer.mars.point2map(cfg); // 转换坐标系
    var position = Cesium$1.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);
    var heading = Cesium$1.Math.toRadians(cfg.heading || 0);
    var pitch = Cesium$1.Math.toRadians(cfg.pitch || 0);
    var roll = Cesium$1.Math.toRadians(cfg.roll || 0);
    var hpr = new Cesium$1.HeadingPitchRoll(heading, pitch, roll);

    var converter = cfg.converter || Cesium$1.Transforms.eastNorthUpToFixedFrame;
    var orientation = Cesium$1.Transforms.headingPitchRollQuaternion(
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

  function formatDegree(value) {
    value = Math.abs(value);
    var v1 = Math.floor(value); // 度
    var v2 = Math.floor((value - v1) * 60); // 分
    var v3 = Math.round(((value - v1) * 3600) % 60); // 秒
    return v1 + "° " + v2 + "'  " + v3 + '"';
  }

  // 许可验证
  function checkToken(token) {
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
          skin: "layer-mars-dialog",
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
  function getLinkedPointList(
    startPoint,
    endPoint,
    angularityFactor,
    numOfSingleLine
  ) {
    var result = [];
    var startPosition = Cesium$1.Cartographic.fromCartesian(startPoint);
    var endPosition = Cesium$1.Cartographic.fromCartesian(endPoint);
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

    var startVec = Cesium$1.Cartesian3.clone(startPoint);
    var endVec = Cesium$1.Cartesian3.clone(endPoint);
    var startLength = Cesium$1.Cartesian3.distance(
      startVec,
      Cesium$1.Cartesian3.ZERO
    );
    var endLength = Cesium$1.Cartesian3.distance(endVec, Cesium$1.Cartesian3.ZERO);
    Cesium$1.Cartesian3.normalize(startVec, startVec);
    Cesium$1.Cartesian3.normalize(endVec, endVec);
    if (Cesium$1.Cartesian3.distance(startVec, endVec) == 0) {
      return result;
    }
    // var cosOmega = Cesium.Cartesian3.dot(startVec, endVec);
    // var omega = Math.acos(cosOmega);
    var omega = Cesium$1.Cartesian3.angleBetween(startVec, endVec);

    result.push(startPoint);
    for (var i = 1; i < numOfSingleLine - 1; i++) {
      var t = (i * 1.0) / (numOfSingleLine - 1);
      var invT = 1 - t;

      var startScalar = Math.sin(invT * omega) / Math.sin(omega);
      var endScalar = Math.sin(t * omega) / Math.sin(omega);

      var startScalarVec = Cesium$1.Cartesian3.multiplyByScalar(
        startVec,
        startScalar,
        new Cesium$1.Cartesian3()
      );
      var endScalarVec = Cesium$1.Cartesian3.multiplyByScalar(
        endVec,
        endScalar,
        new Cesium$1.Cartesian3()
      );

      var centerVec = Cesium$1.Cartesian3.add(
        startScalarVec,
        endScalarVec,
        new Cesium$1.Cartesian3()
      );

      var ht = t * Math.PI;
      var centerLength =
        startLength * invT + endLength * t + Math.sin(ht) * angularity;
      centerVec = Cesium$1.Cartesian3.multiplyByScalar(
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
  function removeGeoJsonDefVal(geojson) {
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

  function addGeoJsonDefVal(properties) {
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
  function cartesians2lonlats(positions) {
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
  function lonlat2cartesian(coord, defHeight) {
    return Cesium$1.Cartesian3.fromDegrees(
      coords[0],
      coords[1],
      coords[2] || defHeight || 0
    );
  }

  /**
   * 经纬度坐标转cesium坐标
   */
  function lonlats2cartesians(coords, defHeight) {
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
  function cartesian2lonlat(cartesian) {
    var carto = Cesium$1.Cartographic.fromCartesian(cartesian);
    if (carto == null) return {};
    var x = formatNum(Cesium$1.Math.toDegrees(carto.longitude), 6);
    var y = formatNum(Cesium$1.Math.toDegrees(carto.latitude), 6);
    var z = formatNum(Cesium$1.Math.toDegrees(carto.latitude), 6);
    return [x, y, z];
  }

  // @function formatNum(num: Number, digits?: Number): Number
  // Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
  function formatNum(num, digits) {
    var pow = Math.pow(10, digits === undefined ? 6 : digits);
    return Math.round(num * pow) / pow;
  }

  /**
   * geojson 转 entity
   */
  function getPositionByGeoJSON(geojson, defHeight) {
    var geometry = geojson.type === "Feature" ? geojson.geometry : geojson;
    var coords = geometry ? geometry.coordinates : null;
    if (!coords && !geometry) {
      return null;
    }
    switch (geometry.type) {
      case "Point":
        return this.lonlat2cartesian(coords, defHeight);
      case "MultiPoint":
        return this.lonlats2cartesians(coords, defHeight);
      case "LineString":
        return this.lonlats2cartesians(coords, defHeight);
      case "MultiLineString":
      case "Polygon":
        return this.lonlats2cartesians(coords[0], defHeight);
      case "MultiPolygon":
        return this.lonlats2cartesians(coords[0][0], defHeight);
      default:
        throw new Error("Invalid GeoJson object.");
    }
  }

  var Util$1 = ({
    isNumber: isNumber,
    isString: isString,
    isArray: isArray,
    alert: alert,
    msg: msg,
    getRequest: getRequest,
    getRequestByName: getRequestByName,
    clone: clone,
    template: template,
    isPCBrowser: isPCBrowser,
    getExplorerInfo: getExplorerInfo,
    webglReport: webglReport,
    terrainPolyline: terrainPolyline,
    getEllipsoidTerrain: getEllipsoidTerrain,
    getTerrainProvider: getTerrainProvider,
    createModel: createModel,
    formatDegree: formatDegree,
    checkToken: checkToken,
    getLinkedPointList: getLinkedPointList,
    removeGeoJsonDefVal: removeGeoJsonDefVal,
    addGeoJsonDefVal: addGeoJsonDefVal,
    cartesians2lonlats: cartesians2lonlats,
    lonlat2cartesian: lonlat2cartesian,
    lonlats2cartesians: lonlats2cartesians,
    cartesian2lonlat: cartesian2lonlat,
    formatNum: formatNum,
    getPositionByGeoJSON: getPositionByGeoJSON
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-28 09:45:03
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 13:18:30
   */

  //定义一些常量
  const x_PI = (3.14159265358979324 * 3000.0) / 180.0;
  const PI = 3.1415926535897932384626;
  const a = 6378245.0;
  const ee = 0.00669342162296594323;

  /**
   * 判断是否在国内，不在国内则不做偏移
   * @param lng
   * @param lat
   * @returns {boolean}
   */
  function out_of_china(lng, lat) {
    return (
      lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
    );
  }

  function transformlat(lng, lat) {
    var ret =
      -100.0 +
      2.0 * lng +
      3.0 * lat +
      0.2 * lat * lat +
      0.1 * lng * lat +
      0.2 * Math.sqrt(Math.abs(lng));
    ret +=
      ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
      3.0;
    ret +=
      ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
        2.0) /
      3.0;
    return ret;
  }

  function transformlng(lng, lat) {
    var ret =
      300.0 +
      lng +
      2.0 * lat +
      0.1 * lng * lng +
      0.1 * lng * lat +
      0.1 * Math.sqrt(Math.abs(lng));
    ret +=
      ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
      3.0;
    ret +=
      ((150.0 * Math.sin((lng / 12.0) * PI) +
        300.0 * Math.sin((lng / 30.0) * PI)) *
        2.0) /
      3.0;
    return ret;
  }

  /**
   * 百度坐标系 (BD-09) 与 国测局坐标系 (GCJ-02)的转换
   * 即 百度 转 谷歌、高德
   * @param bd_lon
   * @param bd_lat
   * @returns {*[]}
   */
  function bd2gcj(arrdata) {
    var bd_lon = Number(arrdata[0]);
    var bd_lat = Number(arrdata[1]);

    var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);

    gg_lng = Number(gg_lng.toFixed(6));
    gg_lat = Number(gg_lat.toFixed(6));
    return [gg_lng, gg_lat];
  }

  /**
   * 国测局坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即谷歌、高德 转 百度
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  function gcj2bd(arrdata) {
    var lng = Number(arrdata[0]);
    var lat = Number(arrdata[1]);

    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;

    bd_lng = Number(bd_lng.toFixed(6));
    bd_lat = Number(bd_lat.toFixed(6));
    return [bd_lng, bd_lat];
  }

  /**
   * WGS84转GCj02
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  function wgs2gcj(arrdata) {
    var lng = Number(arrdata[0]);
    var lat = Number(arrdata[1]);

    if (out_of_china(lng, lat)) {
      return [lng, lat];
    } else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = (lat / 180.0) * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
      dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;

      mglng = Number(mglng.toFixed(6));
      mglat = Number(mglat.toFixed(6));
      return [mglng, mglat];
    }
  }

  /**
   * GCJ02 转换为 WGS84
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  function gcj2wgs$1(arrdata) {
    var lng = Number(arrdata[0]);
    var lat = Number(arrdata[1]);

    if (out_of_china(lng, lat)) {
      return [lng, lat];
    } else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = (lat / 180.0) * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
      dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);

      var mglat = lat + dlat;
      var mglng = lng + dlng;

      var jd = lng * 2 - mglng;
      var wd = lat * 2 - mglat;

      jd = Number(jd.toFixed(6));
      wd = Number(wd.toFixed(6));
      return [jd, wd];
    }
  }

  //百度经纬度坐标 转 标准WGS84坐标
  function bd2wgs(arrdata) {
    return gcj2wgs$1(bd2gcj(arrdata));
  }

  //标准WGS84坐标  转 百度经纬度坐标
  function wgs2bd(arrdata) {
    return gcj2bd(wgs2gcj(arrdata));
  }

  //经纬度转Web墨卡托
  function jwd2mct(arrdata) {
    var lng = Number(arrdata[0]);
    var lat = Number(arrdata[1]);

    var x = (lng * 20037508.34) / 180;
    var y = Math.log(Math.tan(((90 + lat) * PI) / 360)) / (PI / 180);
    y = (y * 20037508.34) / 180;

    x = Number(x.toFixed(2));
    y = Number(y.toFixed(2));
    return [x, y];
  }

  //Web墨卡托转经纬度
  function mct2jwd(arrdata) {
    var lng = Number(arrdata[0]);
    var lat = Number(arrdata[1]);

    var x = (lng / 20037508.34) * 180;
    var y = (lat / 20037508.34) * 180;
    y = (180 / PI) * (2 * Math.atan(Math.exp((y * PI) / 180)) - PI / 2);

    x = Number(x.toFixed(6));
    y = Number(y.toFixed(6));
    return [x, y];
  }

  var PointConvert = ({
    bd2gcj: bd2gcj,
    gcj2bd: gcj2bd,
    wgs2gcj: wgs2gcj,
    gcj2wgs: gcj2wgs$1,
    bd2wgs: bd2wgs,
    wgs2bd: wgs2bd,
    jwd2mct: jwd2mct,
    mct2jwd: mct2jwd
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-20 14:08:08
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:15:57
   */
  function GaodePOIGeocoder$1(options) {
    options = options || {};
    this.citycode = options.citycode || "";
    //内置高德地图服务key，建议后期修改为自己申请的
    this.gaodekey = options.key || [
      "f2fedb9b08ae13d22f1692cd472d345e",
      "81825d9f2bafbb14f235d2779be90c0f",
      "b185732970a4487de104fa71ef575f29",
      "2e6ca4aeb6867fb637a5bee8333e5d3a",
      "027187040fa924e56048468aaa77b62c",
    ];
  }

  GaodePOIGeocoder$1.prototype.getOneKey = function () {
    var arr = this.gaodekey;
    var n = Math.floor(Math.random() * arr.length + 1) - 1;
    return arr[n];
  };

  GaodePOIGeocoder$1.prototype.geocode = function (query, geocodeType) {
    var that = this;
    var key = this.getOneKey();
    var resource = new Cesium$1__default.Resource({
      url: "http://restapi.amap.com/v3/place/text",
      queryParameters: {
        key: key,
        city: this.citycode,
        keywords: query,
      },
    });

    return resource.fetchJson().then((results) => {
      if (results.status == 0) {
        msg("请求失败(" + results.infocode + "):" + results.info);
        return;
      }

      if (results.pois.length === 0) {
        msg("未查询到“" + query + "”相关数据！");
        return;
      }

      var height = 3000;
      if (that.viewer.camera.positionCartographic.height < height) {
        height = that.viewer.camera.positionCartographic.height;
      }

      return results.pois.map((resultObject) => {
        var arrjwd = resultObject.location.split(",");
        arrjwd = gcj2wgs$1(arrjwd); // 纠偏
        var lnglat = that.viewer.mars.point2map({
          x: arrjwd[0],
          y: arrjwd[1],
        });

        return {
          displayName: resultObject.name,
          destination: Cesium$1__default.Cartesian3.fromDegrees(lnglat.x, lnglat.y, height),
        };
      });
    });
  };

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-20 13:13:58
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-10 10:33:06
   */

  // cssExpr用来判断资源是否是css
  var cssExpr = new RegExp("\\.css");
  var nHead = document.head || document.getElementsByTagName("head")[0];
  // `onload` 在webkit < 535.23, Firefox < 9.0 不被支持
  var isOldWebKit =
    +navigator.userAgent.replace(
      /.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i,
      "$1"
    ) < 536;
  // 判断对应的node节点是否已经载入完成
  function isReady(node) {
    return node.readyState === "complete" || node.readyState === "loaded";
  }

  // loadCss用于载入css资源
  function loadCss(url, setting, callback) {
    var node = document.createElement("link");
    node.rel = "stylesheet";
    addOnload(node, callback, "css");
    node.async = true;
    node.href = url;
    nHead.appendChild(node);
  }

  function loadJs(url, setting, callback) {
    var node = document.createElement("script");
    node.charset = "utf-8";
    addOnload(node, callback, "js");
    node.async = !setting.sync;
    node.src = url;
    nHead.appendChild(node);
  }

  // 在老的webkit中，因为不支持load事件，这里用轮询sheet来保证
  function pollCss(node, callback) {
    var isLoaded;
    if (node.sheet) {
      isLoaded = true;
    }

    setTimeout(() => {
      // 这里callback是为了让样式有足够的时间渲染
      if (isLoaded) {
        callback();
      } else {
        pollCss(node, callback);
      }
    }, 20);
  }

  // 用于给指定的节点绑定onload回调
  // 监听元素载入完成事件
  function addOnload(node, callback, type) {
    var supportOnload = "onload" in node;
    var isCss = type === "css";

    // 对老的webkit和老的firefox的兼容
    if (isCss && (isOldWebKit || !supportOnload)) {
      setTimeout(() => {
        pollCss(node, callback);
      }, 1);
      return;
    }

    if (supportOnload) {
      node.onload = onload;
      node.onerror = () => {
        node.onerror = null;
        if (type == "css") console.error("该css文件不存在", +node.href);
        else console.error("该js文件不存在：" + node.src);
        onload();
      };
    } else {
      node.onreadystatechange = () => {
        if (isReady(node)) {
          onload();
        }
      };
    }
  }

  function onload() {
    // 执行一次后清除，防止重复执行
    node.onload = node.onreadystatechange = null;
    node = null;
    callback();
  }

  // 资源下载入口，根绝文件类型的不同，调用loadCss或者loadJs
  function loadItem(url, list, setting, callback) {
    // 如果加载的url为空，就直接成功返回
    if (!url) {
      setTimeout(() => {
        onFinishLoading(list, callback);
      });
      return;
    }

    if (cssExpr.test(url)) {
      loadCss(url, setting, onFinishLoading);
    } else {
      loadJs(url, setting, onFinishLoading);
    }
  }

  // 每次资源下载完成后，检验是否结束整个list下载过程
  // 若已经完成所有下载，执行回调函数
  function onFinishLoading(list, callback) {
    var urlIndex = list.indexOf(url);
    if (urlIndex > -1) {
      list.splice(urlIndex, 1);
    }
    if (list.length === 0) {
      callback();
    }
  }

  function doInit(list, setting, callback) {
    var cb = function cb() {
      callback && callback();
    };

    list = Array.prototype.slice.call(list || []);

    if (list.length === 0) {
      cb();
      return;
    }

    for (var i = 0, len = list.length; i < len; i++) {
      loadItem(list[i], list, setting, cb);
    }
  }

  // 判断当前页面是否加载完
  // 加载完，立即执行下载
  // 未加载完，等待页面load时间以后，再进行下载
  function ready(node, callback) {
    if (isReady(node)) {
      callback();
    } else {
      // 1500ms以后，直接开始下载资源文件，不再等待load事件
      var timeLeft = 1500;
      var isExecute = false;
      window.addEventListener("load", () => {
        if (!isExecute) {
          callback();
          isExecute = true;
        }
      });

      setTimeout(() => {
        if (!isExecute) {
          callback();
          isExecute = true;
        }
      }, timeLeft);
    }
  }

  // 暴露出去的Loader
  // 提供async， sync两个函数
  // async 用作异步下载执行用，不阻塞页面渲染
  // sync  用作异步下载，顺序执行，保证下载的js按照数组顺序执行
  var Loader = {
    async: function (list, callback) {
      ready(document, () => {
        doInit(list, {}, callback);
      });
    },

    sync: function (list, callback) {
      ready(document, () => {
        doInit(list, { sync: true }, callback);
      });
    },
  };

  var Loader$1 = ({
    Loader: Loader
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-13 14:23:37
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-10 10:46:40
   */

  /**
   * 格式化
   * @param {*} num 数字
   * @param {*} digits 小数位数
   */
  function formatNum$1(num, digits) {
    //  var pow = Math.pow(10, (digits === undefined ? 6 : digits));
    //  return Math.round(num * pow) / pow;
    return Number(num.toFixed(digits || 0));
  }

  /**
   * 格式化坐标点未可理解的格式（如：经度x：123.345345、纬度y：31.324343、高度：123.1）
   * @param {*} position
   */
  function formatPosition(position) {
    var carto = Cesium$1__default.Cartographic.fromCartesian(position);
    var result = {};
    result.y = this.formatNum(Cesium$1__default.Math.toDegrees(carto.latitude), 6);
    result.x = this.formatNum(Cesium$1__default.Math.toDegrees(carto.longitude), 6);
    result.z = this.formatNum(carto.height, 2);
    return result;
  }

  /**
   * 获取坐标数组中最高高程值
   * @param {Array} positions Array<Cartesian3> 笛卡尔空间坐标数组
   * @param {Number} defaultVal 默认高程值
   */
  function getMaxHeight(positions, defaultVal) {
    if (defaultVal == null) {
      defaultVal = 0;
    }
    var maxHeight = defaultVal;
    if (positions == null || positions.length == 0) {
      return maxHeight;
    }

    for (var i = 0; i < positions.length; i++) {
      var tempCarto = Cesium$1__default.Cartographic.fromCartesian(positions[i]);
      if (tempCarto.height > maxHeight) {
        maxHeight = tempCarto.height;
      }
    }
    return this.formatNum(maxHeight, 2);
  }

  /**
   * 在坐标基础海拔上增加指定的海拔高度值
   * @param {Array} positions Cartesian3类型的数组
   * @param {Number} height 高度值
   * @return {Array} Cartesian3类型的数组
   */
  function addPositionsHeight(positions, addHeight) {
    addHeight = Number(addHeight) || 0;
    if (positions instanceof Array) {
      var arr = [];
      for (var i = 0, len = positions.length; i < len; i++) {
        var car = Cesium$1__default.Cartographic.fromCartesian(positions[i]);
        var point = Cesium$1__default.Cartesian3.fromRadians(
          car.longitude,
          car.latitude,
          car.height + addHeight
        );
        arr.push(point);
      }
      return arr;
    } else {
      var car = Cesium$1__default.Cartographic.fromCartesian(positions);
      return Cesium$1__default.Cartesian3.fromRadians(
        car.longitude,
        car.latitude,
        car.height + addHeight
      );
    }
  }

  /**
   * 设置坐标中海拔高度为指定的高度值
   * @param {Array} positions Cartesian3类型的数组
   * @param {Number} height 高度值
   * @return {Array} Cartesian3类型的数组
   */
  function setPositionsHeight(positions, height) {
    height = Number(height) || 0;
    if (positions instanceof Array) {
      var arr = [];
      for (var i = 0, len = positions.length; i < len; i++) {
        var car = Cesium$1__default.Cartographic.fromCartesian(positions[i]);
        var point = Cesium$1__default.Cartesian3.fromRadians(
          car.longitude,
          car.latitude,
          height
        );
        arr.push(point);
      }
      return arr;
    } else {
      var car = Cesium$1__default.Cartographic.fromCartesian(positions);
      return Cesium$1__default.Cartesian3.fromRadians(car.longitude, car.latitude, height);
    }
  }

  /**
   * 设置坐标中海拔高度为贴地或贴模型的高度（sampleHeight需要数据在视域范围内）
   * @param {*} viewer
   * @param {*} position
   */
  function updateHeightForClampToGround(viewer, position) {
    //TODO viewer?
    var carto = Cesium$1__default.Cartographic.fromCartesian(position);
    var _heightNew = viewer.scene.sampleHeight(carto);
    if (_heightNew != null && _heightNew > 0) {
      var positionNew = Cesium$1__default.Cartesian3.fromRadians(
        carto.longitude,
        carto.latitude,
        _heightNew + 1
      );
      return positionNew;
    }
    return position;
  }

  /**
   * 获取鼠标当前的屏幕坐标位置的三维Cesium坐标
   * @param {*} scene
   * @param {*} position 二维屏幕坐标位置
   * @param {*} noPickEntity 排除的对象（主要用于绘制中，排除对自己本身的拾取）
   */
  function getCurrentMousePosition(scene, position, noPickEntity) {
    var cartesian;
    // 模型上提取坐标
    var pickedObject = scene.pick(position);
    if (scene.pickPositionSupported && Cesium$1__default.defined(pickedObject)) {
      // pickPositionSupported: 判断是否支持深度拾取
      if (
        noPickEntity == null ||
        (noPickEntity &&
          pickedObject.id !== noPickEntity &&
          pickedObject.primitive !== noPickEntity)
      ) {
        var cartesian = scene.pickPosition(position);
        if (Cesium$1__default.defined(cartesian)) {
          var cartographic = Cesium$1__default.Cartographic.fromCartesian(cartesian);
          var height = cartographic.height; // 模型高度
          if (height >= 0) {
            return cartesian;
          }
          // 不是entity时，支持3dtitles地下
          if (!Cesium$1__default.defined(pickedObject.id) && height >= -500) {
            return cartesian;
          }
        }
      }
    }
    //测试scene.pickPosition和globe.pick的适用场景 https://zhuanlan.zhihu.com/p/44767866
    //1. globe.pick的结果相对稳定准确，不论地形深度检测开启与否，不论加载的是默认地形还是别的地形数据；
    //2. scene.pickPosition只有在开启地形深度检测，且不使用默认地形时是准确的。
    //注意点： 1. globe.pick只能求交地形； 2. scene.pickPosition不仅可以求交地形，还可以求交除地形以外其他所有写深度的物体。
    //提取鼠标点的地理坐标
    if (scene.mode === Cesium$1__default.SceneMode.SCENE3D) {
      // 三维模式下
      var pickRay = scene.camera.getPickRay(position);
      cartesian = scene.globe.pick(pickRay, scene);
    } else {
      // 二维模式下
      cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid);
    }
    return cartesian;
  }

  /**
   * 获取地球中心点坐标
   * @param {*} viewer
   * @param {*} isToWgs
   */
  function getCenter(viewer, isToWgs) {
    var scene = viewer.scene;
    var target = pickCenterPoint(scene);
    var bestTarget = target;
    if (!target) {
      var globe = scene.globe;
      var carto = scene.camera.positionCartographic.clone();
      var height = globe.getHeight(carto);
      carto.height = height || 0;
      bestTarget = Cesium$1__default.Ellipsoid.WGS84.cartographicToCartesian(carto);
    }

    var result = this.formatPosition(bestTarget);
    if (isToWgs) {
      result = viewer.mars.point2wgs(result); // 坐标转换为wgs
    }
    // 获取地球中心点世界位置与摄像机的世界位置之间的距离
    var distance = Cesium$1__default.Cartesian3.distance(
      bestTarget,
      viewer.scene.camera.positionWC
    );
    result.cameraZ = distance;
    return result;
  }

  function pickCenterPoint(scene) {
    var canvas = scene.canvas;
    var center = new Cesium$1__default.Cartesian2(
      canvas.clientWidth / 2,
      canvas.clientHeight / 2
    );
    var ray = scene.camera.getPickRay(center);
    var target = scene.globe.pick(ray, scene);
    return target || scene.camera.pickEllipsoid(center);
  }

  /**
   * 提取地球视域边界
   */
  function getExtent(viewer, isToWgs) {
    // 范围对象
    var extent = {
      xmin: 70,
      xmax: 140,
      ymin: 0,
      ymax: 55,
    }; // 默认值：中国区域

    // 得到当前三维场景
    var scene = viewer.scene;

    // 得到当前三维场景的椭球体
    var ellipsoid = scene.globe.ellipsoid;
    var canvas = scene.canvas;

    // canvas 左上角
    var car3_lt = viewer.camera.pickEllipsoid(
      new Cesium$1__default.Cartesian2(0, 0),
      ellipsoid
    );
    if (car3_lt) {
      // 在椭球体上
      var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
      extent.xmin = Cesium$1__default.Math.toDegrees(carto_lt.longitude);
      extent.ymax = Cesium$1__default.Math.toDegrees(carto_lt.latitude);
    } else {
      // 不在椭球体上
      var xMax = canvas.width / 2;
      var yMax = canvas.height / 2;
      var car3_lt2;
      // 这里每次10像素递加， 一是10像素相差不大，二是为了提高程序运行效率
      for (var yIdx = 0; yIdx <= yMax; yIdx += 10) {
        var xIdx = yIdx <= xMax ? yIdx : xMax;
        car3_lt2 = viewer.camera.pickEllipsoid(
          new Cesium$1__default.Cartesian2(xIdx, yIdx),
          ellipsoid
        );
        if (car3_lt2) break;
      }
      if (car3_lt2) {
        var carto_lt = ellipsoid.cartesianToCartographic(car3_lt2);
        extend.xmin = Cesium$1__default.Math.toDegrees(carto_lt.longitude);
        extend.ymax = Cesium$1__default.Math.toDegrees(carto_lt.latitude);
      }
    }

    // canvas 右下角
    var car3_rb = viewer.camera.pickEllipsoid(
      new Cesium$1__default.Cartesian2(canvas.width, canvas.height),
      ellipsoid
    );
    if (car3_rb) {
      // 在椭球体上
      var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
      extent.xmax = Cesium$1__default.Math.toDegrees(carto_rb.longitude);
      extent.ymin = Cesium$1__default.Math.toDegrees(carto_rb.latitude);
    } else {
      // 不在椭球体上
      var xMax = canvas.width / 2;
      var yMax = canvas.height / 2;
      var car3_rb2;
      // 这里每次10像素递减，一是10像素相差不大，二是为了提高程序运行效率
      for (var yIdx = canvas.height; yIdx >= yMax; yIdx -= 10) {
        var xIdx = yIdx >= xMax ? yIdx : xMax;
        car3_rb2 = view.camera.pickEllipsoid(
          new Cesium$1__default.Cartesian2(xIdx, yIdx),
          ellipsoid
        );
        if (car3_rb) break;
      }
      if (car3_rb2) {
        var carto_rb = ellipsoid.cartesianToCartographic(car3_rb2);
        extent.xmax = Cesium$1__default.Math.toDegrees(carto_rb.longitude);
        extent.ymin = Cesium$1__default.Math.toDegrees(carto_rb.latitude);
      }
    }

    if (isToWgs) {
      // 坐标转换为wgs
      var pt1 = viewer.mars.point2wgs({
        x: extent.xmin,
        y: extent.ymin,
      });
      extent.xmin = pt1.x;
      extent.ymin = pt1.y;
      var pt2 = viewer.mars.point2wgs({
        x: extent.xmax,
        y: extent.ymax,
      });
      extent.xmax = pt2.x;
      extent.ymax = pt2.y;
    }

    // 交换
    if (extent.xmax < extent.xmin) {
      var temp = extent.xmax;
      extent.xmax = extent.xmin;
      extent.xmin = temp;
    }

    if (extent.ymax < extent.ymin) {
      var temp = extent.ymax;
      extent.ymax = extent.ymin;
      extent.ymin = temp;
    }

    return extent;
  }

  /**
   * 提取相机视角范围参数
   * @param {*} viewer
   * @param {*} isToWgs
   */
  function getCameraView(viewer, isToWgs) {
    var camera = viewer.camera;
    var position = camera.positionCartographic;

    var bookmark = {};
    bookmark.y = this.formatNum(Cesium$1__default.Math.toDegrees(position.latitude), 6);
    bookmark.x = this.formatNum(Cesium$1__default.Math.toDegrees(position.longitude), 6);
    bookmark.z = this.formatNum(position.height, 2);
    bookmark.heading = this.formatNum(
      Cesium$1__default.Math.toDegrees(camera.heading || -90),
      1
    );
    bookmark.pitch = this.formatNum(Cesium$1__default.Math.toDegrees(camera.roll || 0), 1);

    if (isToWgs) {
      bookmark = viewer.mars.point2wgs(bookmark); // 坐标转换wgs
    }
    return bookmark;
  }

  var PointUtil = ({
    formatNum: formatNum$1,
    formatPosition: formatPosition,
    getMaxHeight: getMaxHeight,
    addPositionsHeight: addPositionsHeight,
    setPositionsHeight: setPositionsHeight,
    updateHeightForClampToGround: updateHeightForClampToGround,
    getCurrentMousePosition: getCurrentMousePosition,
    getCenter: getCenter,
    pickCenterPoint: pickCenterPoint,
    getExtent: getExtent,
    getCameraView: getCameraView
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-28 08:32:36
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 13:53:23
   */

  // 样式文件在map.css
  var message = {
    draw: {
      point: {
        start: "单击 完成绘制",
      },
      polyline: {
        // 线面
        start: "单击 开始绘制",
        cont: "单击增加点， 右击删除点",
        end: "单击增加点，右击删除点</br>双击完成绘制",
        end2: "单击完成绘制",
      },
    },
    edit: {
      start: "单击后 完成编辑",
      end: "释放后 完成修改",
    },
    dragger: {
      def: "拖动 修改位置", // 默认
      addMidPoint: "拖动 增加点",
      moveHeight: "拖动 修改高度",
      editRadius: "拖动 修改半径",
      editHeading: "拖动 修改方向",
      editScale: "拖动 修改缩放比例",
    },
    del: {
      def: "<br/>右击 删除该点",
      min: "无法删除，点数量不能少于",
    },
  };

  function Tooltip(frameDiv) {
    var div = document.createElement("DIV");
    div.className = "div-tooltip right";
    var arrow = document.createElement("DIV");
    arrow.className = "draw-tooltip-arrow";
    div.appendChild(arrow);
    var title = document.createElement("DIV");
    title.className = "draw-tooltip-inner";
    div.appendChild(title);

    this._div = div;
    this._title = title;
    // add to frame div and display coordinates
    frameDiv.appendChild(div);

    // 鼠标的移入
    $$1(".draw-tooltip").mouseover(() => {
      $$1(this).hide();
    });
  }

  Tooltip.prototype.setVisible = function (visible) {
    this._div.style.display = visible ? "block" : "none";
  };

  Tooltip.prototype.showAt = function (position, message) {
    if (position && message) {
      this.setVisible(true);
      this._title.innerHTML = message;
      this._div.style.top = position.y - this._div.clientHeight / 2 + "px";
      //left css时
      //this._div.style.left = (position.x - this._div.clientWidth - 30) + "px";

      //right css时
      this._div.style.left = position.x + 30 + "px";
    } else {
      this.setVisible(false);
    }
  };

  var Tooltip$1 = ({
    message: message,
    Tooltip: Tooltip
  });

  const matrix3Scratch = new Cesium$1__default.Matrix3(); //一些涉及矩阵计算的方法
  const matrix4Scratch = new Cesium$1__default.Matrix4();
  const cartesian3 = new Cesium$1__default.Cartesian3();
  const rotationScratch = new Cesium$1__default.Matrix3();

  // 根据模型的matrix矩阵求方位角
  //Cesium.Transforms.fixedFrameToHeadingPitchRoll
  function getHeadingPitchRollByMatrix(position, matrix) {
    // 计算当前模型中心处的变换矩阵
    let m1 = Cesium$1__default.Transforms.eastNorthUpToFixedFrame(
      position,
      Cesium$1__default.Ellipsoid.WGS84,
      new _Cesium2.default.Matrix4()
    );
    // 矩阵相除
    let m3 = Cesium$1__default.Matrix4.multiply(
      Cesium$1__default.Matrix4.inverse(m1, new Cesium$1__default.Matrix4()),
      matrix,
      new Cesium$1__default.Matrix4()
    );
    // 得到旋转矩阵
    let mat3 = Cesium$1__default.Matrix4.getRotation(m3, new Cesium$1__default.Matrix3());
    // 计算四元数
    let q = Cesium$1__default.Quaternion.fromRotationMatrix(mat3);
    // 计算旋转角(弧度)
    let hpr = Cesium$1__default.HeadingPitchRoll.fromQuaternion(q);

    // 得到角度
    //let heading = Cesium.Math.toDegrees(hpr.heading);
    //let pitch = Cesium.Math.toDegrees(hpr.pitch);
    //let roll = Cesium.Math.toDegrees(hpr.roll);
    //console.log('heading : ' + heading, 'pitch : ' + pitch, 'roll : ' + roll);

    return hpr;
  }

  // 根据模型的orientation求方位角
  function getHeadingPitchRollByOrientation(position, orientation) {
    let matrix = Cesium$1__default.Matrix4.fromRotationTranslation(
      Cesium$1__default.Matrix3.fromQuaternion(orientation, matrix3Scratch),
      position,
      matrix4Scratch
    );
    let hpr = getHeadingPitchRollByMatrix(position, matrix);
    return hpr;
  }

  //求localStart点到localEnd点的方向
  function getHeadingPitchRollForLine(localStart, localEnd, ellipsoid) {
    ellipsoid = ellipsoid || Cesium$1__default.Ellipsoid.WGS84;

    let velocity = Cesium$1__default.Cartesian3.normalize(
      Cesium$1__default.Cartesian3.subtract(localEnd, localStart, cartesian3),
      cartesian3
    );
    //TODO rotationMatrixFromPositionVelocity方法不存在
    Cesium$1__default.Transforms.rotationMatrixFromPositionVelocity(
      localStart,
      velocity,
      ellipsoid,
      rotationScratch
    );
    let modelMatrix = Cesium$1__default.Matrix4.fromRotationTranslation(
      rotationScratch,
      localStart,
      matrix4Scratch
    );

    Cesium$1__default.Matrix4.multiplyTransformation(
      modelMatrix,
      Cesium$1__default.Axis.Z_UP_TO_X_UP,
      modelMatrix
    );

    let hpr = getHeadingPitchRollByMatrix(localStart, modelMatrix);
    return hpr;
  }

  //获取点point1绕点center的地面法向量旋转顺时针angle角度后新坐标
  function getRotateCenterPoint(center, point1, angle) {
    // 计算center的地面法向量
    let chicB = Cesium$1__default.Cartographic.fromCartesian(center);
    chicB.height = 0;
    let dB = Cesium$1__default.Cartographic.toCartesian(chicB);
    let normaB = Cesium$1__default.Cartesian3.normalize(
      Cesium$1__default.Cartesian3.subtract(dB, center, new _Cesium2.default.Cartesian3()),
      new Cesium$1__default.Cartesian3()
    );

    // 构造基于center的法向量旋转90度的矩阵
    let Q = Cesium$1__default.Quaternion.fromAxisAngle(normaB, Cesium$1__default.Math.toRadians(angle));
    let m3 = Cesium$1__default.Matrix3.fromQuaternion(Q);
    let m4 = Cesium$1__default.Matrix4.fromRotationTranslation(m3);

    // 计算point1点相对center点的坐标A1
    let A1 = Cesium$1__default.Cartesian3.subtract(point1, center, new Cesium$1__default.Cartesian3());

    //对A1应用旋转矩阵
    let p = Cesium$1__default.Matrix4.multiplyByPoint(m4, A1, new Cesium$1__default.Cartesian3());
    // 新点的坐标
    let pointNew = Cesium$1__default.Cartesian3.add(p, center, new Cesium$1__default.Cartesian3());

    return pointNew;
  }

  //获取点的offest平移矩阵后点
  function getPositionTranslation(position, offest, degree, type) {
    degree = degree || 0;
    type = type || "z";

    let rotate = Cesium$1__default.Math.toRadians(-degree); //转成弧度
    type = "UNIT_" + type.toUpperCase();
    let quaternion = Cesium$1__default.Quaternion.fromAxisAngle(
      Cesium$1__default.Cartesian3[type],
      rotate
    ); //quaternion为围绕这个z轴旋转d度的四元数
    let rotateMatrix3 = Cesium$1__default.Matrix3.fromQuaternion(quaternion); //rotateMatrix3为根据四元数求得的旋转矩阵
    let pointCartesian3 = new Cesium$1__default.Cartesian3(offest.x, offest.y, offest.z); //point的局部坐标
    let rotateTranslationMatrix4 = Cesium$1__default.Matrix4.fromRotationTranslation(
      rotateMatrix3,
      Cesium$1__default.Cartesian3.ZERO
    ); //rotateTranslationMatrix4为旋转加平移的4x4变换矩阵，这里平移为(0,0,0)，故填个Cesium.Cartesian3.ZERO
    Cesium$1__default.Matrix4.multiplyByTranslation(
      rotateTranslationMatrix4,
      pointCartesian3,
      rotateTranslationMatrix4
    ); //rotateTranslationMatrix4 = rotateTranslationMatrix4  X  pointCartesian3
    let originPositionCartesian3 = Cesium$1__default.Ellipsoid.WGS84.cartographicToCartesian(
      Cesium$1__default.Cartographic.fromCartesian(position)
    ); //得到局部坐标原点的全局坐标
    let originPositionTransform = Cesium$1__default.Transforms.eastNorthUpToFixedFrame(
      originPositionCartesian3
    ); //m1为局部坐标的z轴垂直于地表，局部坐标的y轴指向正北的4x4变换矩阵
    Cesium$1__default.Matrix4.multiplyTransformation(
      originPositionTransform,
      rotateTranslationMatrix4,
      rotateTranslationMatrix4
    ); //rotateTranslationMatrix4 = rotateTranslationMatrix4 X originPositionTransform
    let pointCartesian = new Cesium$1__default.Cartesian3();
    Cesium$1__default.Matrix4.getTranslation(rotateTranslationMatrix4, pointCartesian); //根据最终变换矩阵m得到p2
    return pointCartesian;
  }

  var Matrix = ({
    getHeadingPitchRollByOrientation: getHeadingPitchRollByOrientation,
    getHeadingPitchRollForLine: getHeadingPitchRollForLine,
    getRotateCenterPoint: getRotateCenterPoint,
    getPositionTranslation: getPositionTranslation
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-09 10:46:09
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:30:39
   */

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-14 13:21:11
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 10:47:44
   */
  // 事件类型
  const DrawEventType = {
    DRAW_START: "draw-start", // 开始绘制
    DRAW_ADD_POINT: "draw-add-point", // 绘制的过程中增加了点
    DRAW_MOVE_POINT: "draw-move-point", // 绘制中删除了last点
    DRAW_MOUSE_MOVE: "draw-mouse-move", // 绘制过程中鼠标移动了点
    DRAW_CREATED: "draw-created", // 创建完成
  };

  const EditEventType = {
    EDIT_START: "edit-start", // 开始编辑
    EDIT_MOVE_POINT: "edit-move-point", // 编辑修改了点
    EDIT_REMOVE_POINT: "edit-remove-point", // 编辑删除了点
    EDIT_STOP: "edit-stop", // 停止编辑
  };

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-09 10:41:28
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-09 10:41:46
   */

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 10:35:38
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:01:21
   */

  var Draw$$1 = leaflet.Evented.extend({
    dataSource: null,
    primitives: null,
    drawCtrl: null,
    initialize: function () {
      console.log("draw initialize");
      this.currEditFeature = null; // 当前编辑的要素
      this._hasEdit = null;

      this.viewer = viewer;
      this.options = options || {};
      this.dataSource = new Cesium.CustomDataSource(); // 用于entity
      this.viewer.dataSources.add(this.dataSource);

      this.primitives = new Cesium.PrimitiveCollection(); // 用于primitive
      this.viewer.scene.primitives.add(this.primitives);
      if (Cesium.defaultValue(this.options.removeScreenSpaceEvent, true)) {
        this.viewer.screenSpaceEventHandler.removeInputAction(
          Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
        );
        this.viewer.screenSpaceEventHandler.removeInputAction(
          Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
      }

      this.tooltip = new Tooltip$1(this.viewer.container); // 鼠标提示信息
      this.hasEdit(Cesium.defaultValue(this.options.hasEdit, true)); // 是否可编辑

      // 编辑工具初始化
      var _opts = {
        viewer: this.viewer,
        dataSource: this.dataSource,
        primitives: this.primitives,
        tooltip: this.tooltip,
      };

      // entity
      this.drawCtrl = {
        point: new DrawPoint(_opts),
        billboard: new DrawBillboard(_opts),
        label: new DrawLabel(_opts),
        model: new DrawModel(_opts),
        polyline: new DrawPolyline(_opts),
        curve: new DrawCurve(_opts),
        polylineVolume: new DrawPolylineVolume(_opts),
        corridor: new DrawCorridor(_opts),
        polygon: new DrawPolygon(_opts),
        rectangle: new DrawRectangle(_opts),
        ellipse: new DrawCircle(_opts),
        circle: new DrawCircle(_opts),
        ellipsoid: new DrawEllipsoid(_opts),
        wall: new DrawWall(_opts),
        pModel: new DrawPModel(_opts),
      };

      var that = this;
      for (var type in this.drawCtrl) {
        this.drawCtrl[type]._fire = function (type, data, propagate) {
          that.fire(type, data, propagate);
        };
      }
      // 创建完成后激活编辑
      this.on(
        DrawEventType.DRAW_CREATED,
        (e) => {
          this.startEditing(e.entity);
        },
        this
      );
    },
    // ============ 绘制相关 ================
    startDraw: function (attribute) {
      // 参数是字符串id或uri时
      if (typeof attribute === "string") {
        attribute = {
          type: attribute,
        };
      } else {
        if (attribute == null || attribute.type == null) {
          console.error("需要传入指定绘制的type类型！");
          return;
        }
      }

      var type = attribute.type;
      if (this.drawCtrl[type] == null) {
        console.error("不能进行type为【" + type + "】的绘制，无该类型！");
        return;
      }

      var drawOkCallback;
      if (attribute.success) {
        drawOkCallback = attribute.success;
        delete attribute.success;
      }

      //赋默认值
      attribute = addGeoJsonDefVal(attribute);

      this.stopDraw();
      var entity = this.drawCtrl[type].activate(attribute, drawOkCalback);
      return entity;
    },
    stopDraw: function () {
      this.stopEditing();
      for (var type in this.drawCtrl) {
        this.drawCtrl[type].disable(true);
      }
    },

    clearDraw: function () {
      // 删除所有
      this.stopDraw();
      this.dataSource.entities.removeAll();
      this.primitives.removeAll();
    },
    // ====编辑相关===
    currEditFeature: null, // 当前编辑的要素
    getCurrentEntity: function () {
      return this.currEditFeature;
    },
    _hasEdit: null,
    hasEdit: function (val) {
      if (this._hasEdit !== null && this._hasEdit === val) {
        return;
      }
      this._hasEdit = val;
      if (val) {
        this.bindSelectEvent();
      } else {
        this.stopEditing();
        this.destroySelectEvent();
      }
    },
    // 绑定鼠标选中事件
    bindSelectEvent: function () {
      var _this = this;

      // 选取对象
      var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      handler.setInputAction((event) => {
        var pickedObject = _this.viewer.scene.pick(event.position);
        if (Cesium.defined(pickedObject)) {
          var entity =
            pickedObject.id ||
            pickedObject.primitive.id ||
            pickedObject.primitive;
          if (entity) {
            if (_this.currEditFeature && _this.currEditFeature === entity) {
              return; // 重复单击了调出
            }
            if (!Cesium.defaultValue(entity.inProgress, false)) {
              _this.startEditing(entity);
              return;
            }
          }
        }
        _this.stopEditing();
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 编辑提示事件
      handler.setInputAction((event) => {
        if (!_this._hasEdit) return;
        _this.tooltip.setVisible(false);
        var pickedObject = _this.viewer.scene.pick(event.endPosition);
        if (Cesium.defined(pickedObject)) {
          var entity =
            pickedObject.id ||
            pickedObject.primitive.id ||
            pickedObject.primitive;
          if (
            entity &&
            entity.editing &&
            !Cesium.defaultValue(entity.inProgress, false)
          ) {
            var tooltip = _this.tooltip;
            setTimeout(() => {
              // Edit中的MOUSE_MOVE会关闭提示，延迟执行。
              tooltip.showAt(event.endPosition, message.edit.start);
            }, 100);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      this.selectHandler = handler;
    },
    destroySelectEvent: function () {
      this.selectHandler && this.selectHandler.destroy();
      this.selectHandler = undefined;
    },
    startEditing: function (entity) {
      this.stopEditing();
      if (entity == null || !this._hasEdit) return;

      if (entity.editing && entity.editing.activate) {
        entity.editing.activate();
      }
      this.currEditFeature = entity;
    },
    stopEditing: function () {
      if (
        this.currEditFeature &&
        this.currEditFeature.editing &&
        this.currEditFeature.editing.disable
      ) {
        this.currEditFeature.editing.disable();
      }
      this.currEditFeature = null;
    },
    //修改了属性
    updateAttribute: function (attribute, entity) {
      if (entity == null) entity = this.currEditFeature;
      if (entity == null || attribute == null) return;

      attribute.style = attribute.style || {};
      attribute.attr = attribute.attr || {};

      //更新属性
      var type = entity.attribute.type;
      this.drawCtrl[type].style2Entity(attribute.style, entity);
      entity.attribute = attribute;

      //如果在编辑状态，更新绑定的拖拽点
      if (entity.editing) {
        if (entity.editing.updateAttrForEditing)
          entity.editing.updateAttrForEditing();

        if (entity.editing.updateDraggers) entity.editing.updateDraggers();
      }

      //名称 绑定到tooltip
      if (this.options.nameTooltip) {
        var that = this;
        if (entity.attribute.attr && entity.attribute.attr.name) {
          entity.tooltip = {
            html: entity.attribute.attr.name,
            check: function check() {
              return !that._hasEdit;
            },
          };
        } else {
          entity.tooltip = null;
        }
      }
      return entity;
    },
    //修改坐标、高程
    setPositions: function (positions, entity) {
      if (entity == null) entity = this.currEditFeature;
      if (entity == null || positions == null) return;

      //如果在编辑状态，更新绑定的拖拽点
      if (entity.editing) {
        entity.editing.setPositions(positions);
        entity.editing.updateDraggers();
      }
      return entity;
    },
    //==========删除相关==========

    //删除单个
    deleteEntity: function (entity) {
      if (entity == null) entity = this.currEditFeature;
      if (entity == null) return;

      if (entity.editing) {
        entity.editing.disable();
      }
      if (this.dataSource.entities.contains(entity))
        this.dataSource.entities.remove(entity);

      if (this.primitives.contains(entity)) this.primitives.remove(entity);
    },
    //删除所有
    deleteAll: function () {
      this.clearDraw();
    },
    //==========转换GeoJSON==========
    //转换当前所有为geojson
    toGeoJSON: function (entity) {
      this.stopDraw();

      if (entity == null) {
        //全部数据
        var arrEntity = this.getEntities();
        if (arrEntity.length == 0) return null;

        var features = [];
        for (var i = 0, len = arrEntity.length; i < len; i++) {
          var entity = arrEntity[i];
          if (entity.attribute == null || entity.attribute.type == null) continue;

          var type = entity.attribute.type;
          var geojson = this.drawCtrl[type].toGeoJSON(entity);
          if (geojson == null) continue;
          geojson = removeGeoJsonDefVal(geojson);

          features.push(geojson);
        }
        if (features.length > 0)
          return {
            type: "FeatureCollection",
            features: features,
          };
        else return null;
      } else {
        var type = entity.attribute.type;
        var geojson = this.drawCtrl[type].toGeoJSON(entity);
        geojson = removeGeoJsonDefVal(geojson);
        return geojson;
      }
    },
    //加载goejson数据
    jsonToEntity: function (json, isClear, isFly) {
      var jsonObjs = json;
      try {
        if (util.isString(json)) jsonObjs = JSON.parse(json);
      } catch (e) {
        util.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
        return;
      }

      if (isClear) {
        this.clearDraw();
      }
      var arrThis = [];
      var jsonFeatures = jsonObjs.features;

      for (var i = 0, len = jsonFeatures.length; i < len; i++) {
        var feature = jsonFeatures[i];

        if (!feature.properties || !feature.properties.type) {
          //非本身保存的外部其他geojson数据
          feature.properties = feature.properties || {};
          switch (feature.geometry.type) {
            case "MultiPolygon":
            case "Polygon":
              feature.properties.type = "polygon";
              break;
            case "MultiLineString":
            case "LineString":
              feature.properties.type = "polyline";
              break;
            case "MultiPoint":
            case "Point":
              feature.properties.type = "point";
              break;
          }
        }

        var type = feature.properties.type;
        if (this.drawCtrl[type] == null) {
          console.log("数据无法识别或者数据的[" + type + "]类型参数有误");
          continue;
        }
        feature.properties.style = feature.properties.style || {};

        //赋默认值
        feature.properties = addGeoJsonDefVal(feature.properties);

        var entity = this.drawCtrl[type].jsonToEntity(feature);

        //名称 绑定到tooltip
        if (this.options.nameTooltip) {
          if (entity.attribute.attr && entity.attribute.attr.name) {
            var that = this;
            entity.tooltip = {
              html: entity.attribute.attr.name,
              check: function () {
                return !that._hasEdit;
              },
            };
          } else {
            entity.tooltip = null;
          }
        }

        arrThis.push(entity);
      }

      if (isFly) this.viewer.flyTo(arrThis);

      return arrThis;
    },

    //属性转entity
    attributeToEntity: function (attribute, positions) {
      return this.drawCtrl[attribute.type].attributeToEntity(
        attribute,
        positions
      );
    },
    //绑定外部entity到标绘
    bindExtraEntity: function (entity, attribute) {
      var entity = this.drawCtrl[attribute.type].attributeToEntity(
        entity,
        attribute
      );
      this.dataSource.entities.add(entity);
    },
    //==========对外接口==========
    _visible: true,
    setVisible: function (visible) {
      this._visible = visible;
      if (visible) {
        if (!this.viewer.dataSources.contains(this.dataSource))
          this.viewer.dataSources.add(this.dataSource);

        if (!this.viewer.scene.primitives.contains(this.primitives))
          this.viewer.scene.primitives.add(this.primitives);
      } else {
        this.stopDraw();
        if (this.viewer.dataSources.contains(this.dataSource))
          this.viewer.dataSources.remove(this.dataSource, false);

        if (this.viewer.scene.primitives.contains(this.dataSource))
          this.viewer.scene.primitives.remove(this.primitives);
      }
    },
    //是否存在绘制
    hasDraw: function () {
      return this.getEntities().length > 0;
    },
    //获取所有绘制的实体对象列表
    getEntities: function () {
      this.stopDraw();

      var arr = this.dataSource.entities.values;
      arr = arr.concat(this.primitives._primitives);
      return arr;
    },
    getDataSource: function () {
      return this.dataSource;
    },
    getEntityById: function (id) {
      var arrEntity = this.getEntities();
      for (var i = 0, len = arrEntity.length; i < len; i++) {
        var entity = arrEntity[i];
        if (id == entity.attribute.attr.id) {
          return entity;
        }
      }
      return null;
    },
    //获取实体的经纬度值 坐标数组
    getCoordinates: function (entity) {
      var type = entity.attribute.type;
      var coordinate = this.drawCtrl[type].getCoordinates(entity);
      return coordinate;
    },
    //获取实体的坐标数组
    getPositions: function (entity) {
      var type = entity.attribute.type;
      var positions = this.drawCtrl[type].getPositions(entity);
      return positions;
    },

    destroy: function () {
      this.stopDraw();
      this.hasEdit(false);
      this.clearDraw();
      if (this.viewer.dataSources.contains(this.dataSource))
        this.viewer.dataSources.remove(this.dataSource, true);
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-14 13:01:47
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:00:57
   */

  var DrawBase = leaflet.Class.extend({
    type: null,
    dataSource: null,
    initialize: function (opts) {
      this.viewer = opts.viewer;
      this.dataSource = opts.dataSource;
      this.primitives = opts.primitives;

      if (!this.dataSource) {
        // 没有单独指定Cesium.CustomDataSource时
        this.dataSource = new Cesium$1__default.CustomDataSource();
        this.viewer.dataSources.add(this.dataSource);
      }

      this.tooltip = opts.tooltip || new Tooltip$1(this.viewer.container);
    },

    fire: function (type, data, propagate) {
      if (this._fire) this._fire(type, data, propagate);
    },

    formatNum: function (num, digits) {
      return formatNum(num, digits);
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

        this.fire(EventType.DrawCreated, {
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
        this.handler = new Cesium$1__default.ScreenSpaceEventHandler(
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
      var positions = getPositionByGeoJSON(geojson);
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

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 13:14:35
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 11:31:42
   */

  // 属性赋值到entity
  function style2Entity(style, entityAttr) {
    style = style || {};

    if (entityAttr == null) {
      //默认
      entityAttr = {
        scale: 1,
        horizontalOrigin: Cesium$1__default.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium$1__default.VerticalOrigin.BOTTOM,
      };
    }

    //Style赋值值Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          //直接赋值
          entityAttr[key] = value;
          break;
        case "scaleByDistance_near": //跳过扩展其他属性的参数
        case "scaleByDistance_nearValue":
        case "scaleByDistance_far":
        case "scaleByDistance_farValue":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
          break;
        case "opacity":
          //透明度
          entityAttr.color = new Cesium$1__default.Color.fromCssColorString(
            "#FFFFFF"
          ).withAlpha(Number(value || 1.0));
          break;
        case "rotation":
          //旋转角度
          entityAttr.rotation = Cesium$1__default.Math.toRadians(value);
          break;
        case "scaleByDistance":
          //是否按视距缩放
          if (value) {
            entityAttr.scaleByDistance = new Cesium$1__default.NearFarScalar(
              Number(style.scaleByDistance_near || 1000),
              Number(style.scaleByDistance_nearValue || 1.0),
              Number(style.scaleByDistance_far || 1000000),
              Number(style.scaleByDistance_farValue || 0.1)
            );
          } else {
            entityAttr.scaleByDistance = null;
          }
          break;
        case "distanceDisplayCondition":
          //是否按视距显示
          if (value) {
            entityAttr.distanceDisplayCondition = new Cesium$1__default.DistanceDisplayCondition(
              Number(style.distanceDisplayCondition_near || 0),
              Number(style.distanceDisplayCondition_far || 100000)
            );
          } else {
            entityAttr.distanceDisplayCondition = null;
          }
          break;

        case "heightReference":
          switch (value) {
            case "NONE":
              entityAttr.heightReference = Cesium$1__default.HeightReference.NONE;
              break;
            case "CLAMP_TO_GROUND":
              entityAttr.heightReference = Cesium$1__default.HeightReference.CLAMP_TO_GROUND;
              break;
            case "RELATIVE_TO_GROUND":
              entityAttr.heightReference =
                Cesium$1__default.HeightReference.RELATIVE_TO_GROUND;
              break;
            default:
              entityAttr.heightReference = value;
              break;
          }
          break;
      }
    }

    return entityAttr;
  }

  //获取entity的坐标
  function getPositions(entity) {
    return [entity.position.getValue()];
  }

  //获取entity的坐标（geojson规范的格式）
  function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = cartesians2lonlats(positions);
    return coordinates;
  }

  //entity转geojson
  function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
      type: "Feature",
      properties: entity.attribute || {},
      geometry: {
        type: "Point",
        coordinates: coordinates[0],
      },
    };
  }

  var Billboard = ({
    style2Entity: style2Entity,
    getPositions: getPositions,
    getCoordinates: getCoordinates,
    toGeoJSON: toGeoJSON
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-26 08:49:17
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:53:42
   */
  function style2Entity$1(style, entityAttr) {
    style = style || {};
    if (entityAttr == null) {
      // 默认值
      entityAttr = {
        fill: true,
      };
    }

    // 贴地时，剔除高度相关属性
    if (style.clampToGround) {
      if (style.hasOwnProperty("height")) {
        delete style.height;
      }
      if (style.hasOwnProperty("extrudeHeight")) {
        delete style.extrudedHeight;
      }
    }
    //Style赋值值Entity
    for (var key in style) {
      var value = style[key];

      switch (key) {
        default:
          //直接赋值
          entityAttr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
          break;
        case "outlineColor":
          //边框颜色
          entityAttr.outlineColor = new Cesium$1__default.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(style.outlineOpacity || style.opacity || 1.0);
          break;
        case "color":
          //填充颜色
          entityAttr.material = new Cesium$1__default.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(style.opacity || 1.0));
          break;
        case "rotation":
          //旋转角度
          entityAttr.rotation = Cesium$1__default.Math.toRadians(value);
          break;
        case "height":
          entityAttr.height = Number(value);
          if (style.extrudedHeight)
            entityAttr.extrudedHeight =
              Number(style.extrudedHeight) + Number(value);
          break;
        case "extrudedHeight":
          entityAttr.extrudedHeight =
            Number(entityAttr.height || style.height || 0) + Number(value);
          break;
        case "radius":
          //半径（圆）
          entityAttr.semiMinorAxis = Number(value);
          entityAttr.semiMajorAxis = Number(value);
          break;
      }
    }

    //如果未设置任何material，设置默认颜色
    if (entityAttr.material == null) {
      entityAttr.material = Cesium$1__default.Color.fromRandom({
        minimumGreen: 0.75,
        maximumBlue: 0.75,
        alpha: Number(style.opacity || 1.0),
      });
    }

    return entityAttr;
  }

  //获取entity的坐标
  function getPositions$1(entity) {
    return [entity.position.getValue()];
  }

  //获取entity的坐标（geojson规范的格式）
  function getCoordinates$1(entity) {
    var positions = this.getPositions(entity);
    var coordinates = cartesians2lonlats(positions);
    return coordinates;
  }

  //entity转geojson
  function toGeoJSON$1(entity) {
    var coordinates = this.getCoordinates(entity);
    return {
      type: "Feature",
      properties: entity.attribute || {},
      geometry: {
        type: "Point",
        coordinates: coordinates[0],
      },
    };
  }

  var Circle = ({
    style2Entity: style2Entity$1,
    getPositions: getPositions$1,
    getCoordinates: getCoordinates$1,
    toGeoJSON: toGeoJSON$1
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-26 15:09:41
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-03 13:25:10
   */
  class Corridor {}

  var Corridor$1 = ({
    'default': Corridor
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 14:49:52
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:54:00
   */

  function style2Entity$2(style, entityAttr) {
    style = style || {};
    if (entityAttr == null) {
      //默认值
      entityAttr = {
        fill: true,
      };
    }

    //Style赋值值Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          //直接赋值
          entityAttr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
        case "widthRadii":
        case "heightRadii":
          break;
        case "outlineColor":
          //边框颜色
          entityAttr.outlineColor = new Cesium$1__default.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(style.outlineOpacity || style.opacity || 1.0);
          break;
        case "color":
          //填充颜色
          entityAttr.material = new Cesium$1__default.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(style.opacity || 1.0));
          break;
        case "extentRadii":
          //球体长宽高半径
          var extentRadii = style.extentRadii || 100;
          var widthRadii = style.widthRadii || 100;
          var heightRadii = style.heightRadii || 100;
          entityAttr.radii = new Cesium$1__default.Cartesian3(
            extentRadii,
            widthRadii,
            heightRadii
          );
          break;
      }
    }

    //如果未设置任何material，设置默认颜色
    if (entityAttr.material == null) {
      entityAttr.material = Cesium$1__default.Color.fromRandom({
        minimumGreen: 0.75,
        maximumBlue: 0.75,
        alpha: Number(style.opacity || 1.0),
      });
    }

    return entityAttr;
  }

  // 获取entity的坐标
  function getPositions$2(entity) {
    return [entity.position.getValue()];
  }

  // 获取entity的坐标（geojso规范的格式）
  function getCoordinates$2(entity) {
    var positions = this.getPositions(entity);
    var coordinates = cartesians2lonlats(positions);
    return coordinates;
  }

  // entity转geojson
  function toGeoJson(entity) {
    var coordinates = this.getCoordinates(entity);
    return {
      type: "Feature",
      properties: entity.attribute || {},
      geometry: {
        type: "Point",
        coordinates: coordinates[0],
      },
    };
  }

  var Ellipsoid = ({
    style2Entity: style2Entity$2,
    getPositions: getPositions$2,
    getCoordinates: getCoordinates$2,
    toGeoJson: toGeoJson
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 11:25:42
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 13:04:35
   */
  // 属性赋值到entity
  function style2Entity$3(style, entityAttr) {
    style = style || {};
    if (entityAttr == null) {
      // 默认值
      entityAttr = {
        scale: 1.0,
        horizontalOrigin: Cesium$1__default.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium$1__default.VerticalOrigin.BOTTOM,
      };
    }

    //Style赋值值Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          //直接赋值
          entityAttr[key] = value;
          break;
        case "font_style": //跳过扩展其他属性的参数
        case "font_weight":
        case "font_size":
        case "font_family":
        case "scaleByDistance_near":
        case "scaleByDistance_nearValue":
        case "scaleByDistance_far":
        case "scaleByDistance_farValue":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
        case "background_opacity":
        case "pixelOffsetY":
          break;

        case "text":
          //文字内容
          entityAttr.text = value.replace(new RegExp("<br />", "gm"), "\n");
          break;
        case "color":
          //颜色
          entityAttr.fillColor = new Cesium$1__default.Color.fromCssColorString(
            value || "#ffffff"
          ).withAlpha(Number(style.opacity || 1.0));
          break;

        case "border":
          //是否衬色
          entityAttr.style = value
            ? Cesium$1__default.LabelStyle.FILL_AND_OUTLINE
            : Cesium$1__default.LabelStyle.FILL;
          break;
        case "border_color":
          //衬色
          entityAttr.outlineColor = new Cesium$1__default.Color.fromCssColorString(
            value || "#000000"
          ).withAlpha(Number(style.opacity || 1.0));
          break;
        case "border_width":
          entityAttr.outlineWidth = value;
          break;
        case "background":
          //是否背景色
          entityAttr.showBackground = value;
          break;
        case "background_color":
          //背景色
          entityAttr.backgroundColor = new Cesium$1__default.Color.fromCssColorString(
            value || "#000000"
          ).withAlpha(Number(style.background_opacity || style.opacity || 0.5));
          break;
        case "pixelOffset":
          //偏移量
          entityAttr.pixelOffset = new Cesium$1__default.Cartesian2(
            style.pixelOffset[0],
            style.pixelOffset[1]
          );
          break;
        case "hasPixelOffset":
          //是否存在偏移量
          if (!value) entityAttr.pixelOffset = new Cesium$1__default.Cartesian2(0, 0);
          break;
        case "pixelOffsetX":
          //偏移量
          entityAttr.pixelOffset = new Cesium$1__default.Cartesian2(
            value,
            style.pixelOffsetY
          );
          break;
        case "scaleByDistance":
          //是否按视距缩放
          if (value) {
            entityAttr.scaleByDistance = new Cesium$1__default.NearFarScalar(
              Number(style.scaleByDistance_near || 1000),
              Number(style.scaleByDistance_nearValue || 1.0),
              Number(style.scaleByDistance_far || 1000000),
              Number(style.scaleByDistance_farValue || 0.1)
            );
          } else {
            entityAttr.scaleByDistance = null;
          }
          break;
        case "distanceDisplayCondition":
          //是否按视距显示
          if (value) {
            entityAttr.distanceDisplayCondition = new Cesium$1__default.DistanceDisplayCondition(
              Number(style.distanceDisplayCondition_near || 0),
              Number(style.distanceDisplayCondition_far || 100000)
            );
          } else {
            entityAttr.distanceDisplayCondition = null;
          }
          break;

        case "heightReference":
          switch (value) {
            case "NONE":
              entityAttr.heightReference = Cesium$1__default.HeightReference.NONE;
              break;
            case "CLAMP_TO_GROUND":
              entityAttr.heightReference = Cesium$1__default.HeightReference.CLAMP_TO_GROUND;
              break;
            case "RELATIVE_TO_GROUND":
              entityAttr.heightReference =
                Cesium$1__default.HeightReference.RELATIVE_TO_GROUND;
              break;
            default:
              emptyImageUrl.heightReference = value;
              break;
          }
          break;
      }
    }

    //样式（倾斜、加粗等）
    var fontStyle =
      (style.font_style || "normal") +
      " small-caps " +
      (style.font_weight || "normal") +
      " " +
      (style.font_size || "25") +
      "px " +
      (style.font_family || "楷体");
    entityAttr.font = fontStyle;

    return entityAttr;
  }

  // 获取entity的坐标
  function getPositions$3(entity) {
    return [entity.position.getValue()];
  }

  // 获取entity的坐标（geojson规范的格式）
  function getCoordinates$3(entity) {
    var positions = this.getPositions(entity);
    var coordinates = cartesians2lonlats(positions);
    return coordinates;
  }

  // entity转geojson
  function toGeoJSON$2(entity) {
    var coordinates = this.getCoordinates(entity);
    return {
      type: "Feature",
      properties: entity.attribute || {},
      geometry: {
        type: "Point",
        coordinates: coordinates[0],
      },
    };
  }

  var Label$1 = ({
    style2Entity: style2Entity$3,
    getPositions: getPositions$3,
    getCoordinates: getCoordinates$3,
    toGeoJSON: toGeoJSON$2
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 10:36:42
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:54:11
   */

  function style2Entity$4(style, entityAttr) {
    style = style || {};

    if (entityAttr == null) {
      // 默认值
      entityAttr = {};
    }

    // style 赋值给Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          //  直接赋值
          entityAttr[key] = value;
          break;
        case "silhouette": // 跳过扩展其他属性的参数
        case "silhouetteColor":
        case "silhouetteAlpha":
        case "silhouetteSize":
        case "fill":
        case "color":
        case "opacity":
          break;
        case "modelUrl":
          entityAttr.uri = value;
          break;
        case "heightReference":
          switch (value) {
            case "NONE":
              entityAttr.heightReference = Cesium$1__default.HeightReference.NONE;
              break;
            case "CLAMP_TO_GROUND":
              entityAttr.heightReference = Cesium$1__default.HeightReference.CLAMP_TO_GROUND;
              break;
            case "RELATIVE_TO_GROUND":
              entityAttr.heightReference =
                Cesium$1__default.HeightReference.RELATIVE_TO_GROUND;
              break;
            default:
              entityAttr.heightReference = value;
              break;
          }
      }
    }

    // 轮廓
    if (style.silhouette) {
      entityAttr.silhouetteColor = new Cesium$1__default.Color.fromCssColorString(
        style.silhouetteColor || "#FFFFFF"
      ).withAlpha(Number(style.silhouetteAlpha || 1.0));
      entityAttr.silhouetteSize = Number(style.silhouetteSize || 1.0);
    } else {
      entityAttr.silhouetteSize = 0.0;
    }

    // 透明度、颜色
    var opacity = style.hasOwnProperty("opacity") ? Number(style.opacity) : 1;
    if (style.fill)
      entityAttr.color = new Cesium$1__default.Color.fromCssColorString(
        style.color || "#FFFFFF"
      ).withAlpha(opacity);
    else
      entityAttr.color = new Cesium$1__default.Color.fromCssColorString("#FFFFFF").withAlpha(
        opacity
      );

    return entityAttr;
  }

  // 获取entity的坐标
  function getPositions$4(entity) {
    var position = entity.position;
    if (position && position.getValue) position = position.getValue();
    return [position];
  }

  // 获取entity的坐标（geojson规范的格式）
  function getCoordinates$4(entity) {
    var positions = this.getPositions(entity);
    var coordinates = cartesians2lonlats(positions);
    return coordinates;
  }

  // entity 转geojson
  function toGeoJson$1(entity) {
    var coordinates = this.getCoordinates(entity);
    return {
      type: "Feature",
      properties: entity.attribute || {},
      geometry: {
        type: "Point",
        coordinates: coordinates[0],
      },
    };
  }

  var Model = ({
    style2Entity: style2Entity$4,
    getPositions: getPositions$4,
    getCoordinates: getCoordinates$4,
    toGeoJson: toGeoJson$1
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:42:11
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 13:06:43
   */
  //属性赋值到entity
  function style2Entity$5(style, entityAttr) {
    style = style || {};
    if (entityAttr == null) {
      //默认值
      entityAttr = {};
    }

    //Style赋值值Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          //直接赋值
          entityAttr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
        case "scaleByDistance_near":
        case "scaleByDistance_nearValue":
        case "scaleByDistance_far":
        case "scaleByDistance_farValue":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
          break;
        case "outlineColor":
          //边框颜色
          entityAttr.outlineColor = new Cesium$1__default.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(style.outlineOpacity || style.opacity || 1.0);
          break;
        case "color":
          //填充颜色
          entityAttr.color = new CesiumColor.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(style.opacity || 1.0));
          break;
        case "scaleByDistance":
          //是否按视距缩放
          if (value) {
            entityAttr.scaleByDistance = new Cesium$1__default.NearFarScalar(
              Number(style.scaleByDistance_near || 1000),
              Number(style.scaleByDistance_nearValue || 1.0),
              Number(style.scaleByDistance_far || 1000000),
              Number(style.scaleByDistance_farValue || 0.1)
            );
          } else {
            entityAttr.scaleByDistance = null;
          }
          break;
        case "distanceDisplayCondition":
          //是否按视距显示
          if (value) {
            entityAttr.distanceDisplayCondition = new Cesium2.DistanceDisplayCondition(
              Number(style.distanceDisplayCondition_near || 0),
              Number(style.distanceDisplayCondition_far || 100000)
            );
          } else {
            entityAttr.distanceDisplayCondition = null;
          }
          break;

        case "heightReference":
          switch (value) {
            case "NONE":
              entityAttr.heightReference = Cesium$1__default.HeightReference.NONE;
              break;
            case "CLAMP_TO_GROUND":
              entityAttr.heightReference = Cesium$1__default.HeightReference.CLAMP_TO_GROUND;
              break;
            case "RELATIVE_TO_GROUND":
              entityAttr.heightReference =
                Cesium$1__default.HeightReference.RELATIVE_TO_GROUND;
              break;
            default:
              entityAttr.heightReference = value;
              break;
          }
          break;
      }
    }

    //无边框时，需设置宽度为0
    if (!style.outline) entityAttr.outlineWidth = 0.0;

    return entityAttr;
  }

  //获取entity的坐标
  function getPositions$5(entity) {
    return [entity.position.getValue()];
  }

  //获取entity的坐标（geojson规范的格式）
  function getCoordinates$5(entity) {
    var positions = this.getPositions(entity);
    var coordinates = cartesians2lonlats(positions);
    return coordinates;
  }

  //entity转geojson
  function toGeoJSON$3(entity) {
    var coordinates = this.getCoordinates(entity);
    return {
      type: "Feature",
      properties: entity.attribute || {},
      geometry: {
        type: "Point",
        coordinates: coordinates[0],
      },
    };
  }

  var Point = ({
    style2Entity: style2Entity$5,
    getPositions: getPositions$5,
    getCoordinates: getCoordinates$5,
    toGeoJSON: toGeoJSON$3
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 13:23:55
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:54:21
   */

  function style2Entity$6(style, entityAttr) {
    style = style || {};
    if (entityAttr == null) {
      //默认值
      entityAttr = {
        fill: true,
        classificationType: Cesium$1__default.ClassificationType.BOTH,
      };
    }

    //Style赋值值Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          //直接赋值
          entityAttr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
          break;
        case "color":
          //填充颜色
          entityAttr.material = new Cesium$1__default.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(style.opacity || 1.0));
          break;
        case "outlineColor":
          //边框颜色
          entityAttr.outlineColor = new Cesium$1__default.Color.fromCssColorString(
            value || style.color || "#FFFF00"
          ).withAlpha(style.outlineOpacity || style.opacity || 1.0);
          break;
        case "extrudedHeight":
          //高度
          var maxHight = 0;
          if (entityAttr.hierarchy)
            maxHight = (0, _point.getMaxHeight)(
              entityAttr.hierarchy.getValue
                ? entityAttr.hierarchy.getValue()
                : entityAttr.hierarchy
            );
          entityAttr.extrudedHeight = Number(value) + maxHight;
          break;
        case "clampToGround":
          //贴地
          entityAttr.perPositionHeight = !value;
          break;
      }
    }

    //如果未设置任何material，默认设置随机颜色
    if (style.color == null) {
      entityAttr.material = Cesium$1__default.Color.fromRandom({
        minimumGreen: 0.75,
        maximumBlue: 0.75,
        alpha: Number(style.opacity || 1.0),
      });
    }

    return entityAttr;
  }

  //获取entity的坐标
  function getPositions$6(entity) {
    var arr = entity.polygon.hierarchy.getValue();
    if (arr.positions && isArray(arr.positions)) return arr.positions;
    return arr;
  }

  //获取entity的坐标（geojson规范的格式）
  function getCoordinates$6(entity) {
    var positions = getPositions$6(entity);
    var coordinates = cartesians2lonlats(positions);
    return coordinates;
  }

  //entity转geojson
  function toGeoJSON$4(entity) {
    var coordinates = getCoordinates$6(entity);

    if (coordinates.length > 0) coordinates.push(coordinates[0]);

    return {
      type: "Feature",
      properties: entity.attribute || {},
      geometry: {
        type: "Polygon",
        coordinates: [coordinates],
      },
    };
  }

  var Polygon$1 = ({
    style2Entity: style2Entity$6,
    getPositions: getPositions$6,
    getCoordinates: getCoordinates$6,
    toGeoJSON: toGeoJSON$4
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-14 13:34:00
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:54:28
   */
  function style2Entity$7(style, entityAttr) {
    style = style || {};
    if (entityAttr == null) {
      // 默认值
      entityAttr = {};
    }

    // style赋值给Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          // 直接赋值
          entityAttr[key] = value;
          break;
        case "lineType": // 跳过扩展其他属性的参数
        case "color":
        case "opacity":
        case "outline":
        case "outlineWidth":
        case "outlineColor":
        case "outlineOpacity":
          break;
      }
    }

    if (style.color || style.lineType) {
      var color = new Cesium$2.Color.fromCssColorString(
        style.color || "#FFFF00"
      ).withAlpha(Number(style.opacity || 1.0));
      var outlineColor = new Cesium$2.Color.fromCssColorString(
        style.outlineColor || "#FFFF00"
      ).withAlpha(Number(style.opacity || 1.0));
      switch (style.lineType) {
        default:
        case "solid":
          // 实线
          if (style.outline) {
            // 存在衬色时
            entityAttr.material = new Cesium$2.PolylineOutlineMaterialProperty({
              color: color,
              outlineWidth: Number(style.outlineWidth || 1.0),
              outlineColor: outlineColor,
            });
          } else {
            entityAttr.material = color;
          }
          break;
        case "dash":
          // 虚线
          if (style.outline) {
            // 存在衬色时
            entityAttr.material = new Cesium$2.PolylineDashMaterialProperty({
              dashLength: style.dashLength || style.outlineWidth || 16.0,
              color: color,
              gapColor: new Cesium$2.Color.fromCssColorString(
                style.outlineColor || "#FFFF00"
              ).withAlpha(Number(style.outlineOpacity || style.opacity || 1.0)),
            });
          } else {
            entityAttr.material = new Cesium$2.PolylineDashMaterialProperty({
              dashLength: style.dashLength || 16.0,
              color: color,
            });
          }
          break;
        case "glow":
          // 发光线
          entityAttr.material = new Cesium$2.PolylineGlowMaterialProperty({
            glowPower: style.glowPower || 0.1,
            color: color,
          });
          break;
        case "arrow":
          // 箭头线
          entityAttr.material = new Cesium$2.PolylineArrowMaterialProperty(color);
          break;
      }
    }
    return entityAttr;
  }

  /**
   * 获取entity的坐标
   * @param {*} entity
   */
  function getPositions$7(entity) {
    if (entity._positions_draw && entity._positions_draw.length > 0) {
      return entity._positions_draw; // 曲线等情形时，取绑定的数据
    }
  }

  /**
   * 获取entity的坐标（geojson规范的格式）
   * @param {*} entity
   */
  function getCoordinates$7(entity) {
    var positions = this.getPositions(entity);
  }

  // 折线转曲线
  function line2curve(_positions_draw) {
    if (!window.turf) {
      return _positions_draw;
    }
    var coordinates = _positions_draw.map((position) => {
      return cartesian2lonlat(position);
    });

    var defHeight = coordinates[coordinates.length - 1][2];

    var line = turf.lineString(coordinates);
    var curved = turf.bezierSpline(line);
    var _positions_show = lonlats2cartesians(
      curved.geometry.coordinates,
      defHeight
    );
    return _positions_show;
  }

  var Polyline = ({
    style2Entity: style2Entity$7,
    getPositions: getPositions$7,
    getCoordinates: getCoordinates$7,
    line2curve: line2curve
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 14:37:50
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 13:09:32
   */

  // 赋值到entity
  function style2Entity$8(style, entityAttr) {
    style = style || {};
    if (entityAttr == null) {
      //默认值
      entityAttr = {};
    }

    //Style赋值值Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
        case "radius":
        case "shape":
          break;
        case "outlineColor":
          //边框颜色
          entityAttr.outlineColor = new Cesium$1__default.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(style.outlineOpacity || style.opacity || 1.0);
          break;
        case "color":
          //填充颜色
          entityAttr.material = new Cesium$1__default.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(style.opacity || 1.0));
          break;
      }
    }

    //管道样式
    style.radius = style.radius || 10;
    switch (style.shape) {
      default:
      case "pipeline":
        entityAttr.shape = getCorridorShape1(style.radius); //（厚度固定为半径的1/3）
        break;
      case "circle":
        entityAttr.shape = getCorridorShape2(style.radius);
        break;
      case "star":
        entityAttr.shape = getCorridorShape3(style.radius);
        break;
    }

    return entityAttr;
  }
  //管道形状1【内空管道】 radius整个管道的外半径
  function getCorridorShape1(radius) {
    var hd = radius / 3;
    var startAngle = 0;
    var endAngle = 360;

    var pss = [];
    for (var i = startAngle; i <= endAngle; i++) {
      var radians = _Cesium2.default.Math.toRadians(i);
      pss.push(
        new _Cesium2.default.Cartesian2(
          radius * Math.cos(radians),
          radius * Math.sin(radians)
        )
      );
    }
    for (var i = endAngle; i >= startAngle; i--) {
      var radians = _Cesium2.default.Math.toRadians(i);
      pss.push(
        new _Cesium2.default.Cartesian2(
          (radius - hd) * Math.cos(radians),
          (radius - hd) * Math.sin(radians)
        )
      );
    }
    return pss;
  }

  //管道形状2【圆柱体】 radius整个管道的外半径
  function getCorridorShape2(radius) {
    var startAngle = 0;
    var endAngle = 360;

    var pss = [];
    for (var i = startAngle; i <= endAngle; i++) {
      var radians = Cesium$1__default.Math.toRadians(i);
      pss.push(
        new Cesium$1__default.Cartesian2(
          radius * Math.cos(radians),
          radius * Math.sin(radians)
        )
      );
    }
    return pss;
  }

  //管道形状3【星状】 radius整个管道的外半径 ,arms星角的个数（默认6个角）
  function getCorridorShape3(radius, arms) {
    var arms = arms || 6;
    var angle = Math.PI / arms;
    var length = 2 * arms;
    var pss = new Array(length);
    for (var i = 0; i < length; i++) {
      var r = i % 2 === 0 ? radius : radius / 3;
      pss[i] = new Cesium$1__default.Cartesian2(
        Math.cos(i * angle) * r,
        Math.sin(i * angle) * r
      );
    }
    return pss;
  }

  //获取entity的坐标
  function getPositions$8(entity) {
    if (entity._positions_draw && entity._positions_draw.length > 0)
      return entity._positions_draw; //取绑定的数据

    return entity.polylineVolume.positions.getValue();
  }

  //获取entity的坐标（geojson规范的格式）
  function getCoordinates$8(entity) {
    var positions = this.getPositions(entity);
    var coordinates = cartesians2lonlats(positions);
    return coordinates;
  }

  //entity转geojson
  function toGeoJSON$5(entity) {
    var coordinates = this.getCoordinates(entity);
    return {
      type: "Feature",
      properties: entity.attribute || {},
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };
  }

  var PolylineVolume = ({
    style2Entity: style2Entity$8,
    getCorridorShape1: getCorridorShape1,
    getCorridorShape2: getCorridorShape2,
    getCorridorShape3: getCorridorShape3,
    getPositions: getPositions$8,
    getCoordinates: getCoordinates$8,
    toGeoJSON: toGeoJSON$5
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 14:49:52
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:54:38
   */

  function style2Entity$9(style, entityAttr) {
    style = style || {};
    if (entityAttr == null) {
      // 默认值
      entityAttr = {
        fill: true,
      };
    }

    // 贴地时，剔除高度相关属性
    if (style.clampToGround) {
      if (style.hasOwnProperty("height")) delete style.height;
      if (style.hasOwnProperty("extrudeHeight")) delete style.extrudeHeight;
    }

    // style 赋值给entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          // 直接赋值
          entityAttr[key] = value;
          break;
        case "opacity": // 跳过扩展其他属性的参数
        case "outlineOpacity":
          break;
        case "outlineColor":
          // 边框颜色
          entityAttr.outlineColor = new Cesium$1__default.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(style.outlineOpacity || style.opacity || 1.0);
          break;
        case "height":
          entityAttr.height = Number(value);
          if (style.extrudeHeight)
            entityAttr.extrudeHeight =
              Number(style.extrudeHeight) + Number(value);
          break;
        case "color":
          // 填充颜色
          entityAttr.material = new Cesium$1__default.Color.fromCssColorString(
            value || "#FFFF00"
          ).alpha.withAlpha(Number(style.opacity || 1.0));
          break;
        case "image":
          // 填充图片
          entityAttr.material = new Cesium$1__default.ImageMaterialProperty({
            image: style.image,
            color: new Cesium$1__default.Color.fromCssColorString("#FFFFFF").withAlpha(
              Number(style.opacity || 1.0)
            ),
          });
          break;
        case "rotation":
          // 旋转角度
          entityAttr.rotation = Cesium$1__default.Math.toRadians(value);
          if (!style.stRotation)
            entityAttr.stRotation = Cesium$1__default.Math.toRadians(value);
          break;
        case "stRotation":
          entityAttr.stRotation = Cesium$1__default.Math.toRadians(value);
          break;
      }
    }

    // 如果未设置任何material,设置默认颜色
    if (entityAttr.material == null) {
      entityAttr.material = Cesium$1__default.Color.fromRandom({
        minimumGreen: 0.75,
        maximumBlue: 0.75,
        alpha: Number(style.opacity || 1.0),
      });
    }

    return entityAttr;
  }

  //获取entity的坐标
  function getPositions$9(entity) {
    if (entity._positions_draw && entity._positions_draw.length > 0)
      return entity._positions_draw;

    var re = entity.rectangle.coordinates.getValue(); // Rectangle
    var height = entity.rectangle.height ? entity.rectangle.height.getValue() : 0;

    var pt1 = Cesium$1__default.Cartesian3.fromRadians(re.west, re.south, height);
    var pt2 = Cesium$1__default.Cartesian3.fromRadians(re.east, re.north, height);
    return [pt1, pt2];
  }

  // 获取entity的坐标（geojson规范的格式）
  function getCoordinates$9(entity) {
    var positions = this.getPositions(entity);
    var coordinates = cartesians2lonlats(positions);
    return coordinates;
  }

  function toGeoJson$2(entity) {
    var coordinates = this.getCoordinates(entity);
    return {
      type: "Feature",
      properties: entity.attribute || {},
      geometry: {
        type: "MultiPoint",
        coordinates: coordinates,
      },
    };
  }

  var Rectangle$1 = ({
    style2Entity: style2Entity$9,
    getPositions: getPositions$9,
    getCoordinates: getCoordinates$9,
    toGeoJson: toGeoJson$2
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-24 10:02:53
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 13:12:49
   */
  //属性赋值到entity
  function style2Entity$a(style, entityAttr) {
    style = style || {};

    if (!entityAttr) {
      entityAttr = {
        fill: true,
      };
    }

    //Style赋值值Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          //直接赋值
          entityAttr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
          break;
        case "outlineColor":
          //边框颜色
          entityAttr.outlineColor = new Cesium$1__default.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(style.outlineOpacity || style.opacity || 1.0);
          break;
        case "color":
          //填充颜色
          entityAttr.material = new Cesium$1__default.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(style.opacity || 1.0));
          break;
      }
    }

    //如果未设置任何material，设置默认颜色
    if (entityAttr.material == null) {
      entityAttr.material = Cesium$1__default.Color.fromRandom({
        minimumGreen: 0.75,
        maximumBlue: 0.75,
        alpha: Number(style.opacity || 1.0),
      });
    }

    return entityAttr;
  }

  //获取entity的坐标
  function getPositions$a(entity) {
    return entity.wall.positions.getValue();
  }

  //获取entity的坐标（geojson规范的格式）
  function getCoordinates$a(entity) {
    var positions = this.getPositions(entity);
    var coordinates = cartesians2lonlats(positions);
    return coordinates;
  }

  //entity转geojson
  function toGeoJSON$6(entity) {
    var coordinates = this.getCoordinates(entity);
    return {
      type: "Feature",
      properties: entity.attribute || {},
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };
  }

  var Wall = ({
    style2Entity: style2Entity$a,
    getPositions: getPositions$a,
    getCoordinates: getCoordinates$a,
    toGeoJSON: toGeoJSON$6
  });

  /*
   * @Description: 覆盖物
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-09 10:42:20
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:03:26
   */

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:52:40
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:07:19
   */
  var EditBase = leaflet.Class.extend({
    _dataSource: null,
    _minPointNum: 1, // 至少需要点的个数 （值是draw中传入）
    _maxPointNum: 9999, // 最多允许点的个数 （值是draw中传入）
    initialize: function (entity, viewer, dataSource) {
      this.entity = entity;
      this.viewer = viewer;
      this.dataSource = dataSource;
      this.draggers = [];
    },

    fire: function (type, data, propagate) {
      if (this._fire) this._fire(type, data, propagate);
    },

    formatNum: function (num, digits) {
      return formatNum(num, digits);
    },

    // 激活绘制
    activate: function () {
      if (this._enabled) {
        return this;
      }

      this._enabled = true;
      this.entity.inProgress = true;
      this.changePositionsToCallback();
      this.bindDraggers();
      this.bindEvent();
      this.fire(EditEventType.EDIT_START, {
        edittype: this.entity.attribute.type,
        entity: this.entity,
      });

      return this;
    },

    // 释放绘制
    disable: function () {
      if (!this._enabled) {
        return this;
      }

      this._enabled = false;
      this.destroyEvent();
      this.destroyDraggers();
      this.finish();

      this.entity.inProgress = false;

      this.fire(EditEventType.EDIT_STOP, {
        EditStop: this.entity.attribute.type,
        entity: this.entity,
      });

      this.tooltip.setVisible(false);
      return this;
    },

    changePositionsToCallback: function () {},

    // 图形编辑结束后调用
    finish: function () {},

    // 拖拽点事件
    bindEvent: function () {
      var _this = this;
      var scratchBoundingSphere = new Cesium$1__default.BoundingSphere();
      var zOffset = new Cesium$1__default.Cartesian3();
      var draggerHandler = new Cesium$1__default.ScreenSpaceEventHandler(this.viewer.canvas);
      draggerHandler.dragger = null;

      // 选中后拖动
      draggerHandler.setInputAction((event) => {
        var pickObject = _this.viewer.scene.pick(event.position);
        if (Cesium$1__default.defined(pickObject)) {
          var entity =
            pickObject.id || pickObject.primitive.id || pickObject.primitive;
          if (entity && Cesium$1__default.defaultValue(entity.isDragger, false)) {
            _this.viewer.scene.screenSpaceCameraController.enableRotate = false;
            _this.viewer.scene.screenSpaceCameraController.enableTilt = false;
            _this.viewer.scene.screenSpaceCameraController.enableTranslate = false;
            _this.viewer.scene.screenSpaceCameraController.enableInput = false;

            draggerHandler.dragger = entity;
            if (draggerHandler.dragger.onDragStart) {
              var position = draggerHandler.dragger.position;
              if (position && position.getValue) position = position.getValue();
              draggerHandler.dragger.onDragStart(
                draggerHandler.dragger,
                position
              );
            }
          }
        }
      }, Cesium$1__default.ScreenSpaceEventType.LEFT_DOWN);

      draggerHandler.setInputAction((event) => {
        var dragger = draggerHandler.dragger;
        if (dragger) {
          switch (dragger._pointType) {
            case Dragger.PointType.MoveHeight:
              // 改变高度垂直拖动
              var dy = event.endPosition.y - event.startPosition.y;

              var position = dragger.position;
              if (position && position.getValue) position = position.getValue();

              var tangentPlane = new Cesium$1__default.EllipsoidTangentPlane(position);
              scratchBoundingSphere.center = position;
              scratchBoundingSphere.radius = 1;

              var metersPerPixel =
                _this.viewer.scene.frameState.camera.getPixelSize(
                  scratchBoundingSphere,
                  _this.viewer.scene.frameState.context.drawingBufferWidth,
                  _this.viewer.scene.frameState.context.drawingBufferHeight
                ) * 1.5;

              Cesium$1__default.Cartesian3.multiplyByScalar(
                tangentPlane.zAxis,
                -dy * metersPerPixel,
                zOffset
              );
              var newPosition = Cesium$1__default.Cartesian3.clone(position);
              Cesium$1__default.Cartesian3.add(position, zOffset, newPosition);

              dragger.position = newPosition;
              if (dragger.onDrag) {
                dragger.onDrag(dragger, newPosition, position);
              }
              _this.updateAttrForEditing();
              break;
            default:
              // 默认修改位置
              _this.tooltip.showAt(event.endPosition, message.edit.end);
              var point = getCurrentMousePosition(
                _this.viewer.scene,
                event.endPosition,
                _this.entity
              );

              if (point) {
                dragger.position = point;
                if (dragger.onDrag) {
                  dragger.onDrag(dragger, point);
                }

                _this.updateAttrForEditing();
              }

              break;
          }
        } else {
          _this.tooltip.setVisible(false);
          var pickedObject = _this.viewer.scene.pick(event.endPosition);
          if (Cesium$1__default.defined(pickedObject)) {
            var entity = pickedObject.id;
            if (
              entity &&
              Cesium$1__default.defaultValue(entity._isDragger, false) &&
              entity.draw_tooltip
            ) {
              var draw_tooltip = entity.draw_tooltip;
              // 可删除时，提示右击删除
              if (
                Dragger.PointType.Control == entity._pointType &&
                _this._positions_draw &&
                _this._positions_draw.length &&
                _this._positions_draw.length > _this._minPointNum
              ) {
                draw_tooltip += message.del.def;
              }

              _this.tooltip.showAt(event.endPosition, draw_tooltip);
            }
          }
        }
      }, Cesium$1__default.ScreenSpaceEventType.MOUSE_MOVE);

      dragger.setInputAction((event) => {
        var dragger = draggerHandler.dragger;
        if (dragger) {
          var position = dragger.position;
          if (position && position.getValue) {
            position = position.getValue();
          }
          if (dragger.onDragEnd) {
            dragger.onDragEnd(dragger, position);
          }

          _this.fire(EditEventType.EDIT_MOVE_POINT, {
            edittype: _this.entity.attribute.type,
            entity: _this.entity,
            position: position,
          });

          draggerHandler.dragger = null;

          _this.viewer.scene.screenSpaceCameraController.enableRotate = true;
          _this.viewer.scene.screenSpaceCameraController.enableTilt = true;
          _this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
          _this.viewer.scene.screenSpaceCameraController.enableInputs = true;
        }
      }, Cesium$1__default.ScreenSpaceEventType.LEFT_UP);

      // 右击删除
      draggerHandler.setInputAction((event) => {
        // 右击删除上一个点
        var pickObject = _this.viewer.scene.pick(event.position);
        if (Cesium$1__default.defined(pickObject)) {
          var entity = pickObject.id;
          if (
            entity &&
            Cesium$1__default.defaultValue(entity._isDragger, false) &&
            Dragger.PointType.Control == entity._pointType
          ) {
            var isDelOk = _this.deletePointForDragger(entity, event.position);

            if (isDelOk) {
              _this.fire(EditEventType.EDIT_REMOVE_POINT, {
                edittype: _this.entity.attribute.type,
                entity: _this.entity,
              });
            }
          }
        }
      }, Cesium$1__default.ScreenSpaceEventType.RIGHT_CLICK);

      this.draggerHandler = draggerHandler;
    },

    destroyEvent: function () {
      this.viewer.scene.screenSpaceCameraController.enableRotate = true;
      this.viewer.scene.screenSpaceCameraController.enableTile = true;
      this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
      this.viewer.scene.screenSpaceCameraController.enableInputs = true;

      if (this.draggerHandler) {
        this.draggerHandler.destroy();
        this.draggerHandler = null;
      }
    },

    bindDraggers: function () {},

    updateDraggers: function () {
      if (!this._enabled) {
        return this;
      }

      this.destroyDraggers();
      this.bindDraggers();
    },

    destroyDraggers: function () {
      for (var i = 0, len = this.draggers.length; i < len; i++) {
        this.dataSource.entities.remove(this.draggers[i]);
      }
      this.draggers = [];
    },

    deletePointForDragger: function (dragger, position) {
      if (this._positions_draw.length - 1 < this._minPointNum) {
        this.tooltip.showAt(
          message.del.min(position) + this._minPointNum
        );
        return false;
      }

      var index = dragger.index;
      if (index > 0 && index < this._positions_draw.length) {
        this._positions_draw.splice(index, 1);
        this.updateDraggers();
        return true;
      } else {
        return false;
      }
    },

    updateAttrForEditing: function () {},
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-26 08:32:51
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:49:48
   */
  var EditPolyline = EditBase.extend({
    // 坐标位置相关
    _positions_draw: [],
    getPosition: function () {
      return this._positions_draw;
    },
    setPositions: function (positions) {
      this._positions_draw = positions;
      this.updateAttrForEditing();
    },
    changePositionsToCallback: function () {
      this._positions_draw =
        this.entity._positions_draw || this.entity.polyline.positions.getValue();
    },
    isClampToGround: function () {
      return this.entity.attribute.style.clampToGround;
    },

    bindDraggers: function () {
      var that = this;

      var clampToGround = this.isClampToGround();

      var positions = this.getPosition();
      var hasMidPoint = positions.length < this._maxPointNum; //是否有新增点
      for (var i = 0, len = positions.length; i < len; i++) {
        var loc = positions[i];

        if (clampToGround) {
          //贴地时求贴模型和贴地的高度
          loc = point.updateHeightForClampToGround(loc);
          positions[i] = loc;
        }

        //各顶点
        var dragger = createDragger$$1(this.dataSource, {
          position: loc,
          //clampToGround: clampToGround,
          onDrag: function onDrag(dragger, position) {
            positions[dragger.index] = position;

            //============新增点拖拽点处理=============
            if (hasMidPoint) {
              if (dragger.index > 0) {
                //与前一个点之间的中点
                var midpoint = Cesium$1__default.Cartesian3.midpoint(
                  position,
                  positions[dragger.index - 1],
                  new Cesium$1__default.Cartesian3()
                );
                if (clampToGround) {
                  //贴地时求贴模型和贴地的高度
                  midpoint = point.updateHeightForClampToGround(midpoint);
                }
                that.draggers[dragger.index * 2 - 1].position = midpoint;
              }
              if (dragger.index < positions.length - 1) {
                //与后一个点之间的中点
                let midpoint = Cesium$1__default.Cartesian3.midpoint(
                  position,
                  positions[dragger.index + 1],
                  new Cesium$1__default.Cartesian3()
                );
                if (clampToGround) {
                  //贴地时求贴模型和贴地的高度
                  midpoint = point.updateHeightForClampToGround(midpoint);
                }
                that.draggers[dragger.index * 2 + 1].position = midpoint;
              }
            }
          },
        });
        dragger.index = i;
        this.draggers.push(dragger);

        //中间点，拖动后新增点
        if (hasMidPoint) {
          let nextIndex = i + 1;
          if (nextIndex < len) {
            let midpoint = Cesium$1__default.Cartesian3.midpoint(
              loc,
              positions[nextIndex],
              new Cesium$1__default.Cartesian3()
            );
            if (clampToGround) {
              //贴地时求贴模型和贴地的高度
              midpoint = point.updateHeightForClampToGround(midpoint);
            }
            let dragger = createDragger$$1(this.dataSource, {
              position: midpoint,
              type: PointType$$1.AddMidPoint,
              tooltip: message.dragger.addMidPoint,
              //clampToGround: clampToGround,
              onDragStart: function onDragStart(dragger, position) {
                positions.splice(dragger.index, 0, position); //插入点
              },
              onDrag: function onDrag(dragger, position) {
                positions[dragger.index] = position;
              },
              onDragEnd: function onDragEnd(dragger, position) {
                that.updateDraggers();
              },
            });
            dragger.index = nextIndex;
            this.draggers.push(dragger);
          }
        }
      }
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-25 18:02:18
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:07:35
   */
  var EditCircle = EditPolyline.extend({
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function () {
      this._positions_draw = this.entity._positions_draw;
      //this.entity.position = new Cesium.CallbackProperty(time => {
      //    return that.getShowPosition();
      //}, false);
    },
    //图形编辑结束后调用
    finish: function () {
      this.entity._positions_draw = this._positions_draw;
      //this.entity.position = this.getShowPosition();
    },
    isClampToGround: function () {
      return this.entity.attribute.style.clampToGround;
    },
    getPosition: function () {
      //加上高度
      if (this.entity.ellipse.height != undefined) {
        let newHeight = this.entity.ellipse.height.getValue();
        for (let i = 0, len = this._positions_draw.length; i < len; i++) {
          this._positions_draw[i] = setPositionsHeight(
            this._positions_draw[i],
            newHeight
          );
        }
      }
      return this._positions_draw;
    },
    bindDraggers: function () {
      var that = this;

      var clampToGround = this.isClampToGround();
      var positions = this.getPosition();

      var diff = new Cesium$1__default.Cartesian3();
      var newPos = new Cesium$1__default.Cartesian3();
      var style = this.entity.attribute.style;

      //中心点
      var position = positions[0];
      if (clampToGround) {
        //贴地时求贴模型和贴地的高度
        position = updateHeightForClampToGround(position);
        positions[0] = position;
      }

      var dragger = createDragger$$1(this.dataSource, {
        position: position,
        //clampToGround: clampToGround,
        onDrag: function (dragger, position) {
          Cesium$1__default.Cartesian3.subtract(position, positions[dragger.index], diff); //记录差值

          positions[dragger.index] = position;

          //============高度处理=============
          if (!style.clampToGround) {
            let height = that.formatNum(
              Cesium$1__default.Cartographic.fromCartesian(position).height,
              2
            );
            that.entity.ellipse.height = height;
            style.height = height;
          }

          //============半径同步处理=============
          Cesium$1__default.Cartesian3.add(
            dragger.majorDragger.position.getValue(),
            diff,
            newPos
          );
          dragger.majorDragger.position = newPos;

          if (dragger.minorDragger) {
            Cesium$1__default.Cartesian3.add(
              dragger.minorDragger.position.getValue(),
              diff,
              newPos
            );
            dragger.minorDragger.position = newPos;
          }

          //============高度调整拖拽点处理=============
          if (that.entity.attribute.style.extrudedHeight != undefined)
            that.updateDraggers();
        },
      });
      dragger.index = 0;
      this.draggers.push(dragger);

      //获取椭圆上的坐标点数组
      var cep = Cesium$1__default.EllipseGeometryLibrary.computeEllipsePositions(
        {
          center: position,
          semiMajorAxis: this.entity.ellipse.semiMajorAxis.getValue(), //长半轴
          semiMinorAxis: this.entity.ellipse.semiMinorAxis.getValue(), //短半轴
          rotation: Cesium$1__default.Math.toRadians(Number(style.rotation || 0)),
          granularity: 2.0,
        },
        true,
        false
      );

      //长半轴上的坐标点
      var majorPos = new Cesium$1__default.Cartesian3(
        cep.positions[0],
        cep.positions[1],
        cep.positions[2]
      );
      if (clampToGround) {
        //贴地时求贴模型和贴地的高度
        majorPos = updateHeightForClampToGround(majorPos);
      }
      positions[1] = majorPos;
      var majorDragger = createDragger$$1(this.dataSource, {
        position: majorPos,
        type: PointType$$1.EditAttr,
        tooltip: message.dragger.editRadius,
        //clampToGround: clampToGround,
        onDrag: function (dragger, position) {
          if (that.entity.ellipse.height != undefined) {
            let newHeight = that.entity.ellipse.height.getValue();
            position = setPositionsHeight(position, newHeight);
            dragger.position = position;
          }
          positions[dragger.index] = position;

          var radius = that.formatNum(
            Cesium$1__default.Cartesian3.distance(positions[0], position),
            2
          );
          that.entity.ellipse.semiMajorAxis = radius;

          if (style.radius) {
            //圆
            that.entity.ellipse.semiMinorAxis = radius;
            style.radius = radius;
          } else {
            style.semiMajorAxis = radius;
          }

          if (that.entity.attribute.style.extrudedHeight != undefined)
            that.updateDraggers();
        },
      });
      majorDragger.index = 1;
      dragger.majorDragger = majorDragger;
      this.draggers.push(majorDragger);

      //短半轴上的坐标点
      if (this._maxPointNum == 3) {
        //椭圆
        //短半轴上的坐标点
        var minorPos = new Cesium$1__default.Cartesian3(
          cep.positions[3],
          cep.positions[4],
          cep.positions[5]
        );
        if (clampToGround) {
          //贴地时求贴模型和贴地的高度
          minorPos = updateHeightForClampToGround(minorPos);
        }
        positions[2] = minorPos;
        var minorDragger = createDragger$$1(this.dataSource, {
          position: minorPos,
          type: PointType$$1.EditAttr,
          tooltip: message.dragger.editRadius,
          //clampToGround: clampToGround,
          onDrag: function (dragger, position) {
            if (that.entity.ellipse.height != undefined) {
              let newHeight = that.entity.ellipse.height.getValue();
              position = setPositionsHeight(position, newHeight);
              dragger.position = position;
            }
            positions[dragger.index] = position;

            var radius = that.formatNum(
              Cesium$1__default.Cartesian3.distance(positions[0], position),
              2
            );
            that.entity.ellipse.semiMinorAxis = radius;

            if (style.radius) {
              //圆
              that.entity.ellipse.semiMajorAxis = radius;
              style.radius = radius;
            } else {
              style.semiMinorAxis = radius;
            }

            if (that.entity.attribute.style.extrudedHeight != undefined)
              that.updateDraggers();
          },
        });
        minorDragger.index = 2;
        dragger.minorDragger = minorDragger;
        this.draggers.push(minorDragger);
      }

      //创建高度拖拽点
      if (this.entity.ellipse.extrudedHeight) {
        let extrudedHeight = this.entity.ellipse.extrudedHeight.getValue();

        //顶部 中心点
        let position = setPositionsHeight(positions[0], extrudedHeight);
        let draggerTop = createDragger$$1(this.dataSource, {
          position: position,
          onDrag: function (dragger, position) {
            position = setPositionsHeight(
              position,
              that.entity.ellipse.height
            );
            positions[0] = position;

            that.updateDraggers();
          },
        });
        this.draggers.push(draggerTop);

        let _pos =
          this._maxPointNum == 3 ? [positions[1], positions[2]] : [positions[1]];
        this.bindHeightDraggers(this.entity.ellipse, _pos);

        this.heightDraggers.push(draggerTop); //拖动高度时联动修改此点高
      }
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-26 15:09:56
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 10:27:29
   */
  var EditCorridor = EditPolyline.extend({
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function () {
      //var that = this;

      this._positions_draw =
        this.entity._positions_draw || this.entity.corridor.positions.getValue();
      //this.entity.corridor.positions = new Cesium.CallbackProperty(function (time) {
      //    return that.getPosition();
      //}, false);
    },
    //图形编辑结束后调用
    finish: function () {
      this.entity._positions_draw = this.getPosition();
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-26 10:01:43
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:02:26
   */
  var EditCurve = EditPolyline.extend({
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function () {

      this._positions_draw = this.entity._positions_draw;
      this._positions_show =
        this.entity._positions_show || this.entity.polyline.positions.getValue();

      //this.entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
      //    return that._positions_show;
      //}, false);
    },
    //坐标位置相关
    updateAttrForEditing: function () {
      if (this._positions_draw == null || this._positions_draw.length < 3) {
        this._positions_show = this._positions_draw;
        return;
      }

      this._positions_show = line2curve(this._positions_draw);
      this.entity._positions_show = this._positions_show;
    },
    //图形编辑结束后调用
    finish: function () {
      //this.entity.polyline.positions = this._positions_show;
      this.entity._positions_show = this._positions_show;
      this.entity._positions_draw = this._positions_draw;
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-26 11:00:14
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:48:35
   */
  var EditEllipsoid = EditBase.extend({
    _positions_draw: null,
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function () {
      this._positions_draw = this.entity.position.getValue();
    },
    //图形编辑结束后调用
    finish: function () {
      this._positions_draw = null;
    },
    //更新半径
    updateRadii: function (style) {
      var radii = new Cesium$1__default.Cartesian3(
        Number(style.extentRadii),
        Number(style.widthRadii),
        Number(style.heightRadii)
      );
      this.entity.ellipsoid.radii.setValue(radii);
    },
    bindDraggers: function () {
      var that = this;

      var style = this.entity.attribute.style;

      //位置中心点
      var position = this.entity.position.getValue();
      var dragger = createDragger$$1(this.dataSource, {
        position: addPositionsHeight(position, style.heightRadii),
        onDrag: function (dragger, position) {
          this._positions_draw = position;
          that.entity.position.setValue(position);

          that.updateDraggers();
        },
      });
      this.draggers.push(dragger);

      //获取椭圆上的坐标点数组
      var cep = Cesium$1__default.EllipseGeometryLibrary.computeEllipsePositions(
        {
          center: position,
          semiMajorAxis: Number(style.extentRadii), //长半轴
          semiMinorAxis: Number(style.widthRadii), //短半轴
          rotation: Cesium$1__default.Math.toRadians(Number(style.rotation || 0)),
          granularity: 2.0,
        },
        true,
        false
      );

      //长半轴上的坐标点
      var majorPos = new Cesium$1__default.Cartesian3(
        cep.positions[0],
        cep.positions[1],
        cep.positions[2]
      );
      var majorDragger = createDragger$$1(this.dataSource, {
        position: majorPos,
        type: PointType$$1.EditAttr,
        tooltip: message.dragger.editRadius,
        onDrag: function onDrag(dragger, position) {
          var newHeight = Cesium$1__default.Cartographic.fromCartesian(that._positions_draw)
            .height;
          position = setPositionsHeight(position, newHeight);
          dragger.position = position;

          var radius = that.formatNum(
            Cesium$1__default.Cartesian3.distance(that._positions_draw, position),
            2
          );
          style.extentRadii = radius; //短半轴

          that.updateRadii(style);
          that.updateDraggers();
        },
      });
      dragger.majorDragger = majorDragger;
      this.draggers.push(majorDragger);

      //短半轴上的坐标点
      var minorPos = new Cesium$1__default.Cartesian3(
        cep.positions[3],
        cep.positions[4],
        cep.positions[5]
      );
      var minorDragger = createDragger$$1(this.dataSource, {
        position: minorPos,
        type: PointType$$1.EditAttr,
        tooltip: message.dragger.editRadius,
        onDrag: function (dragger, position) {
          var newHeight = Cesium$1__default.Cartographic.fromCartesian(that._positions_draw)
            .height;
          position = setPositionsHeight(position, newHeight);
          dragger.position = position;

          var radius = that.formatNum(
            Cesium$1__default.Cartesian3.distance(that._positions_draw, position),
            2
          );
          style.widthRadii = radius; //长半轴

          that.updateRadii(style);
          that.updateDraggers();
        },
      });
      dragger.minorDragger = minorDragger;
      this.draggers.push(minorDragger);
    },
  });

  /*
   * @Description: 编辑点
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-25 15:34:07
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:49:17
   */
  var EditPoint = EditBase.extend({
    // 外部更新位置
    setPositions: function (position) {
      this.entity.position.setValue(position);
    },

    bindDraggers: function () {
      var that = this;
      this.entity.draw_tooltip = message.dragger.def;
      var dragger = createDragger$$1(this.dataSource, {
        dragger: this.entity,
        onDrag: function (dragger, newPosition) {
          that.entity.position.setValue(newPosition);
        },
      });
    },

    finish: function () {
      this.entity.draw_tooltip = null;
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-26 13:57:57
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:49:01
   */
  var EditPModel = EditBase.extend({
    setPositions: function (position) {
      this.entity.position = position;
      this.entity.modelMatrix = this.getModelMatrix();
    },
    getModelMatrix: function (position) {
      var cfg = this.entity.attribute.style;

      var hpRoll = new Cesium$1__default.HeadingPitchRoll(
        Cesium$1__default.Math.toRadians(cfg.heading || 0),
        Cesium$1__default.Math.toRadians(cfg.pitch || 0),
        Cesium$1__default.Math.toRadians(cfg.roll || 0)
      );
      var fixedFrameTransform = Cesium$1__default.Transforms.eastNorthUpToFixedFrame;

      var modelMatrix = Cesium$1__default.Transforms.headingPitchRollToFixedFrame(
        position || this.entity.position,
        hpRoll,
        this.viewer.scene.globe.ellipsoid,
        fixedFrameTransform
      );
      if (cfg.scale)
        Cesium$1__default.Matrix4.multiplyByUniformScale(
          modelMatrix,
          cfg.scale,
          modelMatrix
        );
      return modelMatrix;
    },
    bindDraggers: function () {
      if (!this.entity.ready) {
        let that = this;
        this.entity.readyPromise.then(function (model) {
          that.bindDraggers();
        });
        return;
      }

      var that = this;

      this.entity.draw_tooltip = message.dragger.def;

      var dragger = createDragger$$1(this.dataSource, {
        dragger: this.entity,
        onDrag: function onDrag(dragger, newPosition) {
          that.entity.position = newPosition;
          that.entity.modelMatrix = that.getModelMatrix(newPosition);

          that.updateDraggers();
        },
      });

      let style = this.entity.attribute.style;

      let position = this.entity.position;
      let height = Cesium$1__default.Cartographic.fromCartesian(position).height;
      let radius = this.entity.boundingSphere.radius;

      //辅助显示：创建角度调整底部圆
      this.entityAngle = this.dataSource.entities.add({
        name: "角度调整底部圆",
        position: new Cesium$1__default.CallbackProperty(function (time) {
          return that.entity.position;
        }, false),
        ellipse: style2Entity$1({
          fill: false,
          outline: true,
          outlineColor: "#ffff00",
          outlineOpacity: 0.8,
          radius: radius,
          height: height,
        }),
      });

      //创建角度调整 拖拽点
      let majorPos = this.getHeadingPosition();
      let majorDragger = createDragger$$1(this.dataSource, {
        position: majorPos,
        type: PointType$$1.EditAttr,
        tooltip: message.dragger.editHeading,
        onDrag: function onDrag(dragger, position) {
          let heading = that.getHeading(that.entity.position, position);
          style.heading = that.formatNum(heading, 1);
          //console.log(heading);

          that.entity.modelMatrix = that.getModelMatrix();
          dragger.position = that.getHeadingPosition();
        },
      });
      this.draggers.push(majorDragger);

      //辅助显示：外接包围盒子
      //this.entityBox = this.dataSource.entities.add({
      //    name: '外接包围盒子',
      //    position: new Cesium.CallbackProperty(time => {
      //        return that.entity.position;
      //    }, false),
      //    box: {
      //        dimensions: new Cesium.Cartesian3(radius, radius, radius),
      //        fill: false,
      //        outline: true,
      //        outlineColor: Cesium.Color.YELLOW
      //    }
      //});

      //缩放控制点
      var position_scale = addPositionsHeight(position, radius);
      var dragger = createDragger$$1(this.dataSource, {
        position: position_scale,
        type: PointType$$1.MoveHeight,
        tooltip: message.dragger.editScale,
        onDrag: function onDrag(dragger, positionNew) {
          let radiusNew = Cesium$1__default.Cartesian3.distance(positionNew, position);

          let radiusOld = dragger.radius / style.scale;
          let scaleNew = radiusNew / radiusOld;

          dragger.radius = radiusNew;
          style.scale = that.formatNum(scaleNew, 2);

          that.entity.modelMatrix = that.getModelMatrix();
          that.updateDraggers();
        },
      });
      dragger.radius = radius;
      this.draggers.push(dragger);

      //this.entityBox = this.dataSource.entities.add({
      //    name: '缩放控制点连接线',
      //    polyline: {
      //        positions: [
      //            position,
      //            position_scale
      //        ],
      //        width: 1,
      //        material: Cesium.Color.YELLOW
      //    }
      //});
    },
    destroyDraggers: function () {
      EditBase.prototype.destroyDraggers.call(this);
      if (this.entityAngle) {
        this.dataSource.entities.remove(this.entityAngle);
        delete this.entityAngle;
      }
      if (this.entityBox) {
        this.dataSource.entities.remove(this.entityBox);
        delete this.entityBox;
      }
    },
    finish: function () {
      this.entity.draw_tooltip = null;
    },
    getHeadingPosition: function () {
      //创建角度调整底部圆
      var position = this.entity.position;
      var radius = this.entity.boundingSphere.radius;
      var angle = -Number(this.entity.attribute.style.heading || 0);

      var rotpos = new Cesium$1__default.Cartesian3(radius, 0.0, 0.0);

      var mat = Cesium$1__default.Transforms.eastNorthUpToFixedFrame(position);
      var rotationX = Cesium$1__default.Matrix4.fromRotationTranslation(
        Cesium$1__default.Matrix3.fromRotationZ(Cesium$1__default.Math.toRadians(angle))
      );
      Cesium$1__default.Matrix4.multiply(mat, rotationX, mat);

      mat = Cesium$1__default.Matrix4.getRotation(mat, new Cesium$1__default.Matrix3());
      rotpos = Cesium$1__default.Matrix3.multiplyByVector(mat, rotpos, rotpos);
      rotpos = Cesium$1__default.Cartesian3.add(position, rotpos, rotpos);
      return rotpos;
    },
    getHeading: function (positionCenter, positionNew) {
      //获取该位置的默认矩阵
      var mat = Cesium$1__default.Transforms.eastNorthUpToFixedFrame(positionCenter);
      mat = Cesium$1__default.Matrix4.getRotation(mat, new Cesium$1__default.Matrix3());

      var xaxis = Cesium$1__default.Matrix3.getColumn(mat, 0, new Cesium$1__default.Cartesian3());
      var yaxis = Cesium$1__default.Matrix3.getColumn(mat, 1, new Cesium$1__default.Cartesian3());
      var zaxis = Cesium$1__default.Matrix3.getColumn(mat, 2, new Cesium$1__default.Cartesian3());

      //计算该位置 和  positionCenter 的 角度值
      var dir = Cesium$1__default.Cartesian3.subtract(
        positionNew,
        positionCenter,
        new Cesium$1__default.Cartesian3()
      );
      //z crosss (dirx cross z) 得到在 xy平面的向量
      dir = Cesium$1__default.Cartesian3.cross(dir, zaxis, dir);
      dir = Cesium$1__default.Cartesian3.cross(zaxis, dir, dir);
      dir = Cesium$1__default.Cartesian3.normalize(dir, dir);

      var heading = Cesium$1__default.Cartesian3.angleBetween(xaxis, dir);

      var ay = Cesium$1__default.Cartesian3.angleBetween(yaxis, dir);
      if (ay > Math.PI * 0.5) {
        heading = 2 * Math.PI - heading;
      }

      return -Cesium$1__default.Math.toDegrees(heading);
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-27 09:13:45
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:49:33
   */
  var EditPolygon = EditPolyline.extend({
    // 修改坐标会回调，提高显示的效率
    changePositionsToCallback: function () {
      this._positions_draw =
        this.entity._positions_draw || this.entity.polygon.hierarchy.getValue();
    },

    finish: function () {
      this.entity._positions_draw = this.getPosition();
    },

    isClampToGround: function () {
      return this.entity.attribute.style.hasOwnProperty("clampToGround")
        ? this.entity.attribute.style.clampToGround
        : !this.entity.attribute.style.perPositionHeight;
    },

    bindDraggers: function () {
      var that = this;
      var positions = this.getPosition();
      var hasMidPoint = positions.length < this._maxPointNum; // 是否有新增点
      var clampToGround = this.isClampToGround();
      for (var i = 0, len = positions.length; i < len; i++) {
        var loc = positions[i];
        if (clampToGround) {
          // 贴地时，求贴模型和贴地的高度
          loc = updateHeightForClampToGround(loc);
          positions[i] = loc;
        }

        // 各顶点
        var dragger = createDragger$$1(this.dataSource, {
          point: loc,
          onDrag: function (dragger, position) {
            positions[dragger.index] = position;

            // ============= 高度调整拖拽点处理 ===================
            if (that.heightDraggers && that.heightDraggers.length > 0) {
              var extrudedHeight = that.entity.polygon.extrudedHeight.getValue();
              that.heightDraggers[
                dragger.index
              ].position = setPositionsHeight(position, extrudedHeight);
            }

            // ======== 新增拖拽点处理 ==============
            if (hasMidPoint) {
              var draggerIdx;
              var nextPositionIdx;
              // 与前一个点之间的中 点
              if (dragger.index == 0) {
                draggerIdx = len * 2 - 1;
                nextPositionIdx = len - 1;
              } else {
                draggerIdx = dragger.index * 2 - 1;
                nextPositionIdx = dragger.index - 1;
              }

              var midPoint = Cesium$1__default.Cartesian3.midPoint(
                position,
                positions[nextPositionIdx],
                new Cesium$1__default.Cartesian3()
              );
              if (clampToGround) {
                // 贴地时，求贴模型和贴地的高度
                midPoint = updateHeightForClampToGround(midPoint);
              }
              that.draggers[draggerIdx].position = midPoint;

              // 与最后一个点之间的中点
              if ((dragger.index = len - 1)) {
                draggerIdx = dragger.index * 2 + 1;
                nextPositionIdx = 0;
              } else {
                draggerIdx = dragger.index * 2 + 1;
                nextPositionIdx = dragger.index + 1;
              }
              // TODO midpoint undefined
              var midPoint = Cesium$1__default.Cartesian3.midpoint(
                position,
                positions[nextPositionIdx],
                new Cesium$1__default.Cartesian3()
              );
              if (clampToGround) {
                // 贴地时，求贴模型和贴地的高度
                midPoint = updateHeightForClampToGround(midPoint);
              }
              that.draggers[draggerIdx].position = midPoint;
            }
          },
        });
        dragger.index = i;
        this.draggers.push(dragger);
        // 中间点，拖动后新增点
        if (hasMidPoint) {
          var nextIndex = (i + 1) % len;
          var midpoint = Cesium$1__default.Cartesian3.midpoint(
            loc,
            positions[nextIndex],
            new Cesium$1__default.Cartesian3()
          );

          if (clampToGround) {
            //贴地时求贴模型和贴地的高度
            midpoint = updateHeightForClampToGround(midpoint);
          }

          let draggerMid = createDragger$$1(this.dataSource, {
            position: midpoint,
            type: PointType$$1.AddMidPoint,
            tooltip: message.dragger.addMidPoint,
            //clampToGround: clampToGround,
            onDragStart: function (dragger, position) {
              positions.splice(dragger.index, 0, position); //插入点
            },
            onDrag: function (dragger, position) {
              positions[dragger.index] = position;
            },
            onDragEnd: function (dragger, position) {
              that.updateDraggers();
            },
          });
          draggerMid.index = nextIndex;
          this.draggers.push(draggerMid);
        }
      }
      //创建高程拖拽点
      if (this.entity.polygon.extrudedHeight)
        this.bindHeightDraggers(this.entity.polygon);
    },

    //高度调整拖拽点
    heightDraggers: null,
    bindHeightDraggers: function (polygon, positions) {
      var that = this;

      this.heightDraggers = [];

      positions = positions || this.getPosition();
      var extrudedHeight = polygon.extrudedHeight.getValue();

      for (var i = 0, len = positions.length; i < len; i++) {
        var loc = positions[i];
        loc = setPositionsHeight(loc, extrudedHeight);

        var dragger = createDragger(this.dataSource, {
          position: loc,
          type: PointType$$1.MoveHeight,
          tooltip: message.dragger.moveHeight,
          onDrag: function (dragger, position) {
            var thisHeight = Cesium$1__default.Cartographic.fromCartesian(position).height;
            polygon.extrudedHeight = thisHeight;

            var maxHeight = point.getMaxHeight(that.getPosition());
            that.entity.attribute.style.extrudedHeight = that.formatNum(
              thisHeight - maxHeight,
              2
            );

            that.updateHeightDraggers(thisHeight);
          },
        });

        this.draggers.push(dragger);
        this.heightDraggers.push(dragger);
      }
    },
    updateHeightDraggers: function (extrudedHeight) {
      for (var i = 0; i < this.heightDraggers.length; i++) {
        var heightDragger = this.heightDraggers[i];

        var position = setPositionsHeight(
          heightDragger.position.getValue(),
          extrudedHeight
        );
        heightDragger.position.setValue(position);
      }
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-26 14:59:16
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 10:36:57
   */

  var EditPolylineVolume = EditPolyline.extend({
    // 修改坐标会回调，提高显示的效率
    changePositionsToCallback: function () {
      var that = this;
      this._positions_draw = this.entity.polylineVolume.positions.getValue();
      this.entity.polylineVolume.positions = new Cesium$1__default.CallbackProperty(
        (time) => {
          return that.getPosition();
        },
        false
      );
    },

    // 图形编辑结束后调用
    finish: function () {
      this.entity.polylineVolume.positions = this.getPosition();
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-26 14:38:36
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:50:01
   */

  var EditRectangle = EditPolygon.extend({
    // 修改坐标会回调，提高显示的效率
    changePositionsToCallback: function () {
      this._positions_draw = this.entity._positions_draw;
    },

    // 图形编辑结束后调用
    finish: function () {
      this.entity._positions_draw = this._positions_draw;
    },

    isClampToGround: function () {
      return this.entity.attribute.style.clampToGround;
    },

    bindDraggers: function () {
      var that = this;
      var clampToGround = this.isClampToGround();
      var positions = this.getPosition();
      for (var i = 0, len = positions.length; i < len; i++) {
        var position = positions[i];
        if (this.entity.rectangle.height != undefined) {
          var newHeight = this.entity.rectangle.height.getValue();
          position = setPositionsHeight(position, newHeight);
        }
        if (clampToGround) {
          position = updateHeightForClampToGround(position);
        }

        // 各顶点
        var dragger = createDragger$$1(this.dataSource, {
          position: position,
          onDrag: function (dragger, position) {
            if (that.entity.rectangle.height != undefined) {
              var newHeight = that.entity.rectangle.height.getValue();
              position = setPositionsHeight(position, newHeight);
              dragger.position = position;
            }
            positions[dragger.index] = position;
            // ======== 高度调整拖拽点处理 =====================
            if (that.heightDraggers && that.heightDraggers.length > 0) {
              var extrudedHeight = that.entity.rectangle.extrudedHeight.getValue();
              that.heightDraggers[
                dragger.index
              ].position = setPositionsHeight(position, extrudedHeight);
            }
          },
        });
        dragger.index = i;
        this.draggers.push(dragger);
      }
      // 创建高程拖拽点
      if (this.entity.rectangle.extrudedHeight)
        this.bindHeightDraggers(this.entity.rectangle);
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-26 14:30:05
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:50:15
   */
  var EditWall = EditPolyline.extend({
    // 修改坐标会回调，提高显示的效率
    changePositionsToCallback: function () {
      var that = this;
      this._positions_draw = this.entity.wall.positions.getValue();
      this.entity.wall.positions = new Cesium$1__default.CallbackProperty((time) => {
        return that.getPosition();
      }, false);
      this.minimumHeights = this.entity.wall.minimumHeights.getValue();
      this.entity.wall.minimumHeights = new Cesium$1__default.CallbackProperty((time) => {
        return that.getMinimumHeights();
      }, false);
      this.maximumHeights = this.entity.wall.maximumHeights.getValue();
      this.entity.wall.maximumHeights = new Cesium$1__default.CallbackProperty((time) => {
        return that.getMaximumHeights();
      }, false);
    },
    maximumHeights: null,
    getMaximumHeights: function () {
      return this.maximumHeights;
    },
    minimumHeights: null,
    getMinimumHeights: function () {
      return this.minimumHeights;
    },

    // 坐标位置相关
    updateAttrForEditing: function () {
      var style = this.entity.attribute.style;
      var position = this.getPosition();
      var len = position.length;

      this.maximumHeights = new Array(len);
      this.minimumHeights = new Array(len);

      for (var i = 0; i < len; i++) {
        var height = Cesium$1__default.Cartographic.fromCartesian(position[i]).height;
        this.minimumHeights[i] = height;
        this.maximumHeights[i] = height + Number(style.extrudedHeight);
      }
    },

    // 图形编辑结束后调用
    finish: function () {
      this.entity.wall.positions = this.getPosition();
    },

    bindDraggers: function () {
      var that = this;
      var clampToGround = this.isClampToGround();
      var positions = this.getPosition();
      var style = this.entity.attribute.style;
      var hasMidPoint = positions.length < this._maxPointNum; // 判断是否有新增点

      for (var i = 0, len = positions.length; i < len; i++) {
        var loc = positions[i];
        // 各顶点
        var dragger = createDragger$$1(this.dataSource, {
          position: loc,
          clampToGround: clampToGround,
          onDrag: (dragger, position) => {
            positions[dragger.index] = position;
            // =============== 高度调整拖拽点处理 ========================
            if (that.heightDraggers && that.heightDraggers.length > 0) {
              that.heightDraggers[
                dragger.index
              ].position = addPositionsHeight(
                position,
                style.extrudedHeight
              );
            }

            // ========== 新增点拖拽点处理 ================
            if (hasMidPoint) {
              if (dragger.index > 0) {
                // 与前一个点之间的中点
                that.draggers[
                  dragger.index * 2 - 1
                ].position = Cesium$1__default.Cartesian3.midpoint(
                  position,
                  positions[dragger.index - 1],
                  new Cesium$1__default.Cartesian3()
                );
              }
              if (dragger.index < positions.length - 1) {
                // 与后一个点之间的中点
                that.draggers[
                  dragger.index * 2 + 1
                ].position = Cesium$1__default.Cartesian3.midpoint(
                  position,
                  positions[dragger.index + 1],
                  new Cesium$1__default.Cartesian3()
                );
              }
            }
          },
        });

        dragger.index = i;
        this.draggers.push(dragger);

        // 中间点，拖拽后新增点
        if (hasMidPoint) {
          var nextIndex = i + 1;
          if (nextIndex < len) {
            var midpoint = Cesium2.Cartesian3.midpoint(
              loc,
              positions[nextIndex],
              new Cesium$1__default.Cartesian3()
            );
            var draggerMid = createDragger$$1(this.dataSource, {
              position: midpoint,
              type: PointType$$1.AddMidPoint,
              tooltip: message.dragger.addMidPoint,
              clampToGround: clampToGround,
              onDragStart: (dragger, position) => {
                positions.splice(dragger.index, 0, position); //插入点
                that.updateAttrForEditing();
              },
              onDrag: (dragger, position) => {
                positions[dragger.index] = position;
              },
              onDragEnd: (dragger, position) => {
                that.updateDraggers();
              },
            });
            draggerMid.index = nextIndex;
            this.draggers.push(draggerMid);
          }
        }
      }

      // 创建高程拖拽点
      this.bindHeightDraggers();
    },
    heightDraggers: null,
    bindHeightDraggers: function () {
      var that = this;

      this.heightDraggers = [];

      var positions = this.getPosition();
      var style = this.entity.attribute.style;
      var extrudedHeight = Number(style.extrudedHeight);

      for (var i = 0, len = positions.length; i < len; i++) {
        var loc = addPositionsHeight(positions[i], extrudedHeight);

        var dragger = createDragger$$1(this.dataSource, {
          position: loc,
          type: PointType$$1.MoveHeight,
          tooltip: message.dragger.moveHeight,
          onDrag: (dragger, position) => {
            var thisHeight = Cesium$1__default.Cartographic.fromCartesian(position).height;
            style.extrudedHeight = that.formatNum(
              thisHeight - that.minimumHeights[dragger.index],
              2
            );

            for (var i = 0; i < positions.length; i++) {
              if (i == dragger.index) continue;
              that.heightDraggers[i].position = addPositionsHeight(
                positions[i],
                style.extrudedHeight
              );
            }
            that.updateAttrForEditing();
          },
        });
        dragger.index = i;

        this.draggers.push(dragger);
        this.heightDraggers.push(dragger);
      }
    },
  });

  /*
   * @Description: 编辑类
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-09 10:38:27
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:04:01
   */

  /*
   * @Description: 绘制点
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:31:39
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:46:11
   */
  var DrawPoint = DrawBase.extend({
    type: "point",
    // 根据attribute参数创建Entity
    createFeature: function (attribute) {
      this._positions_draw = null;
      var that = this;
      var addAttr = {
        position: new Cesium$1__default.CallbackProperty((time) => {
          return that.getDrawPosition();
        }, false),
        point: style2Entity$5(attribute.style),
        attribute: attribute,
      };

      this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
      return this.entity;
    },

    style2Entity: function (style, entity) {
      return style2Entity$5(style, entity.point);
    },
    // 绑定鼠标事件
    bindEvent: function () {
      var _this = this;
      this.getHandler().setInputAction((event) => {
        var point = getCurrentMousePosition(
          _this.viewer.scene,
          event.position,
          _this.entity
        );
        if (point) {
          _this._positions_draw = point;
          _this.disable();
        }
      }, Cesium$1__default.ScreenSpaceEventType.MOUSE_MOVE);
    },

    // 获取编辑对象类
    getEditClass: function (entity) {
      var _edit = EditPoint(entity, this.viewer, this.dataSource);
      return this._bindEdit(_edit);
    },

    // 获取属性处理类
    getAttrClass: function () {
      return attr;
    },

    finish: function () {
      this.entity.editing = this.getEditClass(this.entity); // 绑定编辑对象
      this.entity.position = this.getDrawPosition();
    },
  });

  /*
   * @Description: 绘制广告牌
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:31:39
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:44:17
   */

  var DrawBillboard = DrawPoint.extend({
    type: "billboard",
    //根据attribute参数创建Entity
    createFeature: function (attribute) {
      this._positions_draw = null;
      var that = this;
      var addAttr = {
        position: new Cesium$1__default.CallbackProperty((time) => {
          return that.getDrawPosition();
        }, false),
        billboard: style2Entity(attribute.style),
        attribute: attribute,
      };

      this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
      return this.entity;
    },

    style2Entity: function (style, entity) {
      return style2Entity(style, entity.billboard);
    },

    // 获取属性处理类
    getAttrClass: function () {
      return Billboard;
    },
  });

  const def_minPointNum = 2;
  const def_maxPointNum = 9999;

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:32:11
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:05:55
   */
  var DrawPolyline = DrawBase.extend({
    type: "polyline",
    // 坐标位置相关
    _minPointNum: def_minPointNum, // 至少需要点的个数
    _maxPointNum: def_maxPointNum, // 最多允许点的个数

    // 根据attribute参数Entity
    createFeature: function (attribute) {
      this._positions_draw = [];
      console.log("createFeature");
      if (attribute.config) {
        // 允许外部传入
        this._minPointNum = attribute.config.minPointNum || def_minPointNum;
        this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum;
      } else {
        this._minPointNum = def_minPointNum;
        this._maxPointNum = def_maxPointNum;
      }

      var that = this;
      var addAttr = {
        polyline: style2Entity$7(attribute.style),
        attribute: attribute,
      };

      addAttr.polyline.positions = new Cesium$1__default.CallbackProperty((time) => {
        return that.getDrawPosition();
      }, false);

      this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
      this.entity._positions_draw = this._positions_draw;
      return this.entity;
    },

    style2Entity: function (style, entity) {
      return style2Entity$7(style, entity.polyline);
    },

    // 绑定鼠标事件
    bindEvent: function () {
      var _this = this;
      var lastPointTemporary = false;
      this.getHandler().setInputAction((event) => {
        // 单击添加点
        console.log("单击添加点");
        var point = getCurrentMousePosition(
          _this.viewer.scene,
          event.position,
          _this.entity
        );

        if (point) {
          if (lastPointTemporary) {
            _this._positions_draw.pop();
          }

          lastPointTemporary = false;
          // 在绘制点基础自动增加高度
          if (
            _this.entity.attribute &&
            _this.entity.attribute.config &&
            _this.entity.attribute.config.addHeight
          ) {
            point = addPositionsHeight(
              point,
              _this.entity.attribute.config.addHeight
            );
          }
          // 获取模型高度
          if (
            _this.entity.attribute &&
            _this.entity.attribute.config &&
            _this.entity.attribute.config.terrain
          ) {
            point = updateHeightForClampToGround(point);
          }

          _this._positions_draw.push(point);
          _this.updateAttrForDrawing();

          _this.fire(DrawEventType.DRAW_ADD_POINT, {
            drawtype: _this.type,
            entity: _this.entity,
            position: point,
            positions: _this._positions_draw,
          });

          if (_this._positions_draw.length >= _this._maxPointNum) {
            // 点数满足最大数量，自动结束
            _this.disable();
          }
        }
      }, Cesium$1__default.ScreenSpaceEventType.LEFT_CLICK);

      this.getHandler().setInputAction((event) => {
        // 右击删除上一个点
        _this._positions_draw.pop(); // 删除最后标的一个点

        var point = getCurrentMousePosition(
          _this.viewer.scene,
          event.position,
          _this.entity
        );

        if (point) {
          if (lastPointTemporary) {
            _this._positions_draw.pop();
          }

          lastPointTemporary = true;

          _this.fire(DrawEventType.DRAW_MOVE_POINT, {
            drawtype: _this.type,
            entity: _this.entity,
            position: point,
            positions: _this._positions_draw,
          });

          _this._positions_draw.push(point);
          _this.updateAttrForDrawing();
        }
      }, Cesium$1__default.ScreenSpaceEventType.RIGHT_CLICK);

      this.getHandler().setInputAction((event) => {
        // 鼠标移动
        console.log("鼠标移动");
        if (_this._positions_draw.length <= 1) {
          _this.tooltip.showAt(
            event.endPosition,
            message.draw.polyline.start
          );
        } else if (_this._positions_draw.length < _this._minPointNum) {
          // 点数不满足最少数量
          _this.tooltip.showAt(
            event.endPosition,
            message.draw.polyline.cont
          );
        } else if (_this._positions_draw.length >= _this._maxPointNum) {
          // 点数满足最大数量
          _this.tooltip.showAt(
            event.endPosition,
            message.draw.polyline.end2
          );
        } else
          _this.tooltip.showAt(
            event.endPosition,
            message.draw.polyline.end
          );

        var point = getCurrentMousePosition(
          _this.viewer.scene,
          event.endPosition,
          _this.entity
        );
        if (point) {
          if (lastPointTemporary) {
            _this._positions_draw.pop();
          }
          lastPointTemporary = true;

          _this._positions_draw.push(point);
          _this.updateAttrForDrawing();
          _this.fire(DrawEventType.DRAW_MOUSE_MOVE, {
            drawtype: _this.type,
            entity: _this.entity,
            position: point,
            positions: _this._positions_draw,
          });
        }
      }, Cesium$1__default.ScreenSpaceEventType.MOUSE_MOVE);

      this.getHandler().setInputAction((event) => {
        // 双击结束标绘
        // 必要代码 消除双击带来的多余经纬度
        _this._positions_draw.pop();
        if (_this._positions_draw.length < _this._minPointNum) {
          return; // 点数不够
        }
        _this.updateAttrForDrawing();
        _this.disable();
      }, Cesium$1__default.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    },

    // 获取编辑对象
    getEditClass: function (entity) {
      var _edit = new EditPolyline(entity, this.viewer, this.dataSource);
      _edit._minPointNum = this._minPointNum;
      _edit._maxPointNum = this._maxPointNum;
      return this._bindEdit(_edit);
    },

    // 获取属性处理类
    getAttrClass: function () {
      return Polyline;
    },

    finish: function () {
      var entity = this.entity;
      entity.editing = this.getEditClass(entity); // 绑定编辑对象
      entity._positions_draw = this.getDrawPosition();
      entity.polyline.positions = new Cesium$1__default.CallbackProperty((time) => {
        return entity._positions_draw;
      }, false);
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:33:15
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:44:25
   */
  var DrawCircle = DrawPolyline.extend({
    type: "ellipse",
    // 坐标位置相关
    _minPointNum: 2, // 至少需要点的个数
    _maxPointNum: 2, // 最多允许点的个数

    getShowPosition: function () {
      if (this._positions_draw && this._positions_draw > 1) {
        return this._positions_draw[0];
      }
      return null;
    },

    // 根据attribute参数创建Entity
    createFeature: function (attribute) {
      this._positions_draw = [];
      if (attribute.type == "ellipse") {
        // 椭圆
        this._maxPointNum = 3;
      } else {
        // 圆
        this._maxPointNum = 2;
      }

      var that = this;
      var addAttr = {
        position: new Cesium$1__default.CallbackProperty((time) => {
          return that.getShowPosition();
        }, false),
        ellipse: style2Entity$1(attribute.style),
        attribute: attribute,
      };

      this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
      return this.entity;
    },

    style2Entity: function (style, entity) {
      return style2Entity$1(style, entity.ellipse);
    },

    updateAttrForDrawing: function (isLoad) {
      if (!this._positions_draw) {
        return;
      }

      if (isLoad) {
        this.addPositionsForRadius(this._positions_draw);
        return;
      }

      if (this._positions_draw.length < 2) {
        return;
      }

      var style = this.entity.attribute.style;

      // 高度处理
      if (!style.clampToGround) {
        var height = this.formatNum(
          Cesium$1__default.Cartographic.fromCartesian(this._positions_draw[0]).height,
          2
        );
        this.entity.ellipse.height = height;
        style.height = height;

        if (style.extrudeHeight) {
          var extrudedHeight = height + Number(style.extrudeHeight);
          this.entity.ellipse.extrudeHeight = extrudedHeight;
        }
      }

      // 半径处理
      var radius = this.formatNum(
        Cesium$1__default.Cartesian3.distance(
          this._positions_draw[0],
          this._positions_draw[1]
        ),
        2
      );

      this.entity.ellipse.semiMinorAxis = radius; // 短半轴

      if (this._maxPointNum == 3) {
        // 长半轴
        var semiMajorAxis;
        if (this._positions_draw.length == 3) {
          semiMajorAxis = this.formatNum(
            Cesium$1__default.Cartesian3.distance(
              this._positions_draw[0],
              this._positions_draw[2]
            ),
            2
          );
        } else {
          semiMajorAxis = radius;
        }

        this.entity.ellipse.semiMajorAxis = semiMajorAxis;

        style.semiMinorAxis = radius;
        style.semiMajorAxis = semiMajorAxis;
      } else {
        this.entity.ellipse.semiMajorAxis = radius;
        style.radius = radius;
      }
    },

    addPositionsForRadius: function (position) {
      this._positions_draw = [position];
      var style = this.entity.attribute.style;

      // 获取椭圆上的坐标点数组 TODO EllipseGeometryLibrary undefined
      var cep = Cesium$1__default.EllipseGeometryLibrary.computeEllipsePositions(
        {
          center: position,
          semiMajorAxis: this.entity.ellipse.semiMajorAxis.getValue(), // 长半轴
          semiMinorAxis: this.entity.ellipse.semiMinorAxis.getValue(), // 短半轴
          rotation: Cesium$1__default.Math.toRadians(Number(style.rotation || 0)),
          granularity: 2.0,
        },
        true,
        false
      );

      // 长半轴上的坐标点
      var majorPos = new Cesium$1__default.Cartesian3(
        cep.positions[0],
        cep.positions[1],
        cep.positions[2]
      );
      this._positions_draw.push(majorPos);

      if (_this._maxPointNum == 3) {
        // 椭圆
        // 短半轴上的坐标点
        var minorPos = new Cesium$1__default.Cartesian3(
          cep.positions[3],
          cep.positions[4],
          cep.positions[5]
        );
        this._positions_draw.push(majorPos);
      }
    },

    // 获取编辑对象
    getEditClass: function (entity) {
      var _edit = new EditCircle(entity, this.viewer, this.dataSource);
      _edit._minPointNum = this._minPointNum;
      _edit._maxPointNum = this._maxPointNum;
      return this._bindEdit(_edit);
    },

    // 获取属性处理类
    getAttrClass: function () {
      return Circle;
    },

    // 图形绘制结束后调用
    finish: function () {
      var entity = this.entity;
      entity.editing = this.getEditClass(entity); // 绑定编辑对象
      entity._positions_draw = this._positions_draw;
      entity.position = new Cesium$1__default.CallbackProperty((time) => {
        if (entity._positions_draw && entity._positions_draw.length > 0) {
          return entity._positions_draw[0];
        }
        return null;
      }, false);
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-26 15:05:33
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:44:37
   */
  const def_minPointNum$1 = 2;
  const def_maxPointNum$1 = 9999;

  var DrawCorridor = DrawPolyline.extend({
    type: "corridor",
    //坐标位置相关
    _minPointNum: def_minPointNum$1, //至少需要点的个数
    _maxPointNum: def_maxPointNum$1, //最多允许点的个数
    //根据attribute参数创建Entity
    createFeature: function (attribute) {
      this._positions_draw = [];

      if (attribute.config) {
        this._minPointNum = attribute.config.minPointNum || def_minPointNum$1;
        this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum$1;
      } else {
        this._minPointNum = def_minPointNum$1;
        this._maxPointNum = def_maxPointNum$1;
      }

      var that = this;
      var addAttr = {
        corridor: undefined(attribute.style),
        attribute: attribute,
      };
      addAttr.corridor.positions = new Cesium$1__default.CallbackProperty((time) => {
        return that.getDrawPosition();
      }, false);

      this.entity = this.dataSource.entities.add(addAttr); //创建要素对象
      this.entity._positions_draw = this._positions_draw;

      return this.entity;
    },
    style2Entity: function (style, entity) {
      return undefined(style, entity.corridor);
    },
    updateAttrForDrawing: function () {},
    //获取编辑对象
    getEditClass: function (entity) {
      let _edit = new EditCorridor(entity, this.viewer, this.dataSource);
      _edit._minPointNum = this._minPointNum;
      _edit._maxPointNum = this._maxPointNum;
      return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function () {
      return Corridor$1;
    },
    //图形绘制结束后调用
    finish: function () {
      let entity = this.entity;

      entity.editing = this.getEditClass(entity); //绑定编辑对象

      entity._positions_draw = this.getDrawPosition();
      entity.corridor.positions = new Cesium$1__default.CallbackProperty(function (time) {
        return entity._positions_draw;
      }, false);
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:32:21
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:44:44
   */
  var DrawCurve = DrawPolyline.extend({
    type: "curve",
    _positions_show: null,

    getDrawPosition: function () {
      return this._positions_show;
    },

    updateAttrForDrawing: function () {
      if (this._positions_draw == null || this._positions_draw.length < 3) {
        this._positions_show = this._positions_draw;
        return;
      }
      this._positions_show = line2curve(this._positions_draw);
    },

    // 获取编辑对象
    getEditClass: function (entity) {
      var _edit = new EditCurve(entity, this.viewer, this.dataSource);
      return this._bindEdit(_edit);
    },

    // 绘制结束后调用
    finish: function () {
      var entity = this.entity;
      entity.editing = this.getEditClass(entity); // 绑定编辑对象
      this.entity._positions_draw = this._positions_draw;
      this.entity._positions_show = this._positions_show;

      entity.polyine.positions = new Cesium.CallbackProperty((time) => {
        return entity._positions_show;
      }, false);
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:33:25
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:44:58
   */
  var DrawEllipsoid = DrawPolyline.extend({
    type: "ellipsoid",
    _minPointNum: 2, // 至少需要点的个数
    _maxPointNum: 3, // 最多允许点的个数

    getShowPosition: function () {
      if (this._positions_draw && this._positions_draw.length > 0) {
        return this._positions_draw[0];
      }
      return null;
    },

    createFeature: function (attribute) {
      this._positions_draw = [];
      var that = this;
      var addAttr = {
        position: new Cesium$1__default.CallbackProperty((time) => {
          return that.getShowPosition();
        }),
        ellipsoid: style2Entity$2(attribute.style),
        attribute: attribute,
      };
    },

    style2Entity: function (style, entity) {
      return style2Entity$2(style, entity.ellipsoid);
    },

    updateAttrForDrawing: function (isLoad) {
      if (!this._positions_draw) return;

      if (isLoad) {
        this.addPositionsForRadius(this._positions_draw);
        return;
      }

      if (this._positions_draw.length < 2) return;

      var style = this.entity.attribute.style;

      //半径处理
      var radius = this.formatNum(
        Cesium$1__default.Cartesian3.distance(
          this._positions_draw[0],
          this._positions_draw[1]
        ),
        2
      );
      style.extentRadii = radius; //短半轴
      style.heightRadii = radius;

      //长半轴
      var semiMajorAxis;
      if (this._positions_draw.length == 3) {
        semiMajorAxis = this.formatNum(
          Cesium$1__default.Cartesian3.distance(
            this._positions_draw[0],
            this._positions_draw[2]
          ),
          2
        );
      } else {
        semiMajorAxis = radius;
      }
      style.widthRadii = semiMajorAxis;

      this.updateRadii(style);
    },

    updateRadii: function (style) {
      this.entity.ellipsoid.radii.setValue(
        new Cesium$1__default.Cartesian3(
          style.extentRadii,
          style.widthRadii,
          style.heightRadii
        )
      );
    },

    addPositionsForRadius: function (position) {
      this._positions_draw = [position];

      var style = this.entity.attribute.style;

      //获取椭圆上的坐标点数组
      var cep = Cesium$1__default.EllipseGeometryLibrary.computeEllipsePositions(
        {
          center: position,
          semiMajorAxis: Number(style.extentRadii), //长半轴
          semiMinorAxis: Number(style.widthRadii), //短半轴
          rotation: Cesium$1__default.Math.toRadians(Number(style.rotation || 0)),
          granularity: 2.0,
        },
        true,
        false
      );

      //长半轴上的坐标点
      var majorPos = new Cesium$1__default.Cartesian3(
        cep.positions[0],
        cep.positions[1],
        cep.positions[2]
      );
      this._positions_draw.push(majorPos);

      //短半轴上的坐标点
      var minorPos = new Cesium$1__default.Cartesian3(
        cep.positions[3],
        cep.positions[4],
        cep.positions[5]
      );
      this._positions_draw.push(minorPos);
    },

    getEditClass: function (entity) {
      var _edit = new EditEllipsoid(entity, this.viewer, this.dataSource);
      _edit._minPointNum = this._minPointNum;
      _edit._maxPointNum = this._maxPointNum;
      return this._bindEdit(_edit);
    },

    // 获取属性处理类
    getAttrClass: function () {
      return Ellipsoid;
    },

    // 图形绘制结束后调用
    finish: function () {
      this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象
      this.entity._positions_draw = this._positions_draw;
      this.entity.position = this.getShowPosition();
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:31:48
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 09:43:19
   */

  var DrawLabel = DrawPoint.extend({
    type: "label",

    createFeature: function (attribute) {
      this._positions_draw = null;
      var that = this;
      var addAttr = {
        position: new Cesium$1__default.CallbackProperty((time) => {
          return that.getDrawPosition();
        }, false),
        label: style2Entity$3(attribute.style),
        attribute: attribute,
      };
      this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
      return this.entity;
    },

    style2Entity: function (style, entity) {
      return style2Entity$3(style, entity.label);
    },

    getAttrClass: function () {
      return Label$1;
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:32:03
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:45:15
   */
  var DrawModel = DrawPoint.extend({
    type: "model",

    // 根据attribute参数创建Entity
    createFeature: function (attribute) {
      this._positions_draw = null;
      var that = this;
      var addAttr = {
        position: new Cesium.CallbackProperty((time) => {
          return that.getDrawPosition();
        }, false),
        model: style2Entity$4(attribute.style),
        attribute: attribute,
      };
      this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
      return this.entity;
    },

    style2Entity: function (style, entity) {
      this.updateOrientation(style, entity);
      return style2Entity$4(style, entity.model);
    },

    updateAttrForDrawing: function () {
      this.updateOrientation(this.entity.attribute.style, this.entity);
    },

    updateOrientation: function (style, entity) {
      var position = entity.position.getValue();
      if (position == null) return;
      var heading = Cesium.Math.toRadians(Number(style.heading || 0.0));
      var pitch = Cesium.Math.toRadians(Number(style.pitch || 0.0));
      var roll = Cesium.Math.toRadians(Number(style.roll || 0.0));

      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );
    },

    getAttrClass: function () {
      return Model;
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:33:41
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:45:52
   */
  var DrawPModel = DrawBase.extend({
    type: "point",
    // 根据attribute参数创建Entity
    createFeature: function (attribute) {
      var _this = this;
      this._positions_draw = Cesium$1__default.Cartesian3.ZERO;
      var style = attribute.style;
      var modelPrimitive = this.primitives.add(
        Cesium$1__default.Model.fromGltf({
          url: style.modelUrl,
          modelMatrix: _this.getModelMatrix(style),
          minimumPixelSize: style.minimumPixelSize || 30,
        })
      );

      modelPrimitive.readyPromise.then((model) => {
        _this.style2Entity(style, _this.entity);
      });

      modelPrimitive.attribute = attribute;
      this.entity = modelPrimitive;
      return this.entity;
    },

    getModelMatrix: function (cfg, position) {
      var hpRoll = new Cesium$1__default.HeadingPitchRoll(
        Cesium$1__default.Math.toRadians(cfg.heading || 0),
        Cesium$1__default.Math.toRadians(cfg.pitch || 0),
        Cesium$1__default.Math.toRadians(cfg.roll || 0)
      );

      var fixedFrameTransform = Cesium$1__default.Transforms.eastNorthUpToFixedFrame;
      var modelMatrix = Cesium$1__default.Transforms.headingPitchRollToFixedFrame(
        position || this._positions_draw,
        hpRoll,
        this.viewer.scene.globe.ellipsoid,
        fixedFrameTransform
      );

      if (cfg.scale) {
        Cesium$1__default.Matrix4.multiplyByScale(modelMatrix, cfg.scale, modelMatrix);
      }
      return modelMatrix;
    },

    style2Entity: function (style, entity) {
      entity.modelMatrix = this.getModelMatrix(style, entity.position);
      return style2Entity$4(style, entity);
    },

    bindEvent: function () {
      var _this2 = this;
      this.getHandler().setInputAction((event) => {
        var point = getCurrentMousePosition(
          _this2.viewer.scene,
          event.endPosition,
          _this2.entity
        );
        if (point) {
          _this2._positions_draw = point;
          _this2.entity.modelMatrix = _this2.getModelMatrix(
            _this2.entity.attribute.style
          );
        }

        _this2.tooltip.showAt(
          event.endPosition,
          message.draw.point.start
        );
      }, Cesium$1__default.ScreenSpaceEventType.MOUSE_MOVE);

      this.getHandler().setInputAction((event) => {
        var point = getCurrentMousePosition(
          _this2.viewer.scene,
          event.position,
          _this2.entity
        );
        if (point) {
          _this2._positions_draw = point;
          _this2.disable();
        }
      }, Cesium$1__default.ScreenSpaceEventType.LEFT_CLICK);
    },

    getEditClass: function (entity) {
      var _edit = new EditPModel(entity, this.viewer, this.dataSource);
      return this._bindEdit(_edit);
    },

    getAttrClass: function () {
      return Model;
    },

    // 图形绘制结束后，更新属性
    finish: function () {
      this.entity.modelMatrix = this.getModelMatrix(this.entity.attribute.style);
      this.entity.editing = this.getEditClass(this.entity); // 绑定编辑对象
      this.entity.position = this.getDrawPosition();
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-27 08:31:47
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:46:23
   */

  const def_minPointNum$2 = 2;
  const def_maxPointNum$2 = 9999;

  var DrawPolygon = DrawPolyline.extend({
    type: "polygon",
    _minPointNum: def_minPointNum$2, // 至少需要点的个数
    _maxPointNum: def_maxPointNum$2, // 最多允许点的个数
    createFeature: function (attribute) {
      this._positions_draw = [];
      if (attribute.config) {
        this._minPointNum = attribute.config.minPointNum || def_minPointNum$2;
        this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum$2;
      } else {
        this._minPointNum = def_minPointNum$2;
        this._maxPointNum = def_maxPointNum$2;
      }

      var that = this;
      var addAttr = {
        polygon: style2Entity$6(attribute.style),
        attribute: attribute,
      };

      addAttr.polygon.hierarchy = new Cesium.CallbackProperty((time) => {
        return that.getDrawPosition();
      }, false);

      addAttr.polyline = {
        clampToGround: attribute.style.clampToGround,
        show: false,
      };

      this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
      this.bindOutline(this.entity); // 边线
      return this.entity;
    },

    style2Entity: function (style, entity) {
      return style2Entity$6(style, entity.polygon);
    },

    bindOutline: function (entity) {
      // 是否显示：绘制前两点时 或 边线宽度大于1时
      entity.polyline.show = new Cesium.CallbackProperty((time) => {
        var arr = entity.polygon.hierarchy.getValue();
        if (arr.length < 3) return true;

        return (
          entity.polygon.outline &&
          entity.polygon.outline.getValue() &&
          entity.polygon.outlineWidth &&
          entity.polygon.outlineWidth.getValue() > 1
        );
      }, false);

      entity.polygon.positions = new Cesium.CallbackProperty((time) => {
        if (!entity.polyline.show.getValue()) {
          return null;
        }
        var arr = entity.polygon.hierarchy.getValue();
        if (arr.length < 3) return arr;
        return arr.concat([arr[0]]);
      }, false);
      entity.polygon.width = new Cesium.CallbackProperty((time) => {
        var arr = entity.polygon.hierarchy.getValue();
        if (arr.length < 3) return 2;
        return entity.polygon.outlineWidth;
      }, false);
      entity.polyline.material = new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty((time) => {
          var arr = entity.polygon.hierarchy.getValue();
          if (arr.length < 3) return entity.polygon.material.color.getValue();
          return entity.polygon.outlineColor.getValue();
        }, false)
      );
    },

    updateAttrForDrawing: function () {
      var style = this.entity.attribute.style;
      if (style.extrudedHeight) {
        // 存在extrudedHeight高度设置时
        var maxHeight = getMaxHeight(this.getDrawPosition());
        this.entity.polygon.extrudedHeight =
          maxHeight + Number(style.extrudedHeight);
      }
    },

    getEditClass: function (entity) {
      var _edit = new EditPolygon(entity, this.viewer, this.dataSource);
      _edit._minPointNum = this._minPointNum;
      _edit._maxPointNum = this._maxPointNum;
      return this._bindEdit(_edit);
    },

    // 获取属性处理类
    getAttrClass: function () {
      return Polygon$1;
    },

    // 图形绘制结束后调用
    finish: function () {
      var entity = this.entity;
      entity.editing = this.getEditClass(entity); // 绑定编辑对象
      entity.polygon.hierarchy = new Cesium.CallbackProperty((time) => {
        return entity._positions_draw;
      }, false);
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:32:36
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:47:12
   */

  const def_minPointNum$3 = 2;
  const def_maxPointNum$3 = 9999;

  var DrawPolylineVolume = DrawPolyline.extend({
    type: "polylineVolume",
    // 坐标位置相关
    _minPointNum: def_minPointNum$3, // 至少需要点的个数
    _maxPointNum: def_maxPointNum$3, // 最多允许点的个数
    // 根据attribute参数创建Entity
    createFeature: function (attribute) {
      this._positions_draw = [];

      if (attribute.config) {
        this._minPointNum = attribute.config.minPointNum || def_minPointNum$3;
        this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum$3;
      } else {
        this._minPointNum = def_minPointNum$3;
        this._maxPointNum = def_maxPointNum$3;
      }

      var that = this;
      var addAttr = {
        polylineVolume: attr.style2Entity(attribute.style),
        attribute: attribute,
      };
      addAttr.polylineVolume.positions = new Cesium$1__default.CallbackProperty(function (
        time
      ) {
        return that.getDrawPosition();
      },
      false);

      this.entity = this.dataSource.entities.add(addAttr); //创建要素对象
      this.entity._positions_draw = this._positions_draw;

      return this.entity;
    },

    style2Entity: function (style, entity) {
      return style2Entity$8(style, entity.polylineVolume);
    },
    updateAttrForDrawing: function () {},
    //获取编辑对象
    getEditClass: function (entity) {
      let _edit = new EditPolylineVolume(entity, this.viewer, this.dataSource);
      _edit._minPointNum = this._minPointNum;
      _edit._maxPointNum = this._maxPointNum;
      return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function () {
      return PolylineVolume;
    },
    //图形绘制结束后调用
    finish: function () {
      this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象
      this.entity.polylineVolume.positions = this.getDrawPosition();
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:33:08
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 09:55:35
   */

  var DrawRectangle = DrawPolyline.extend({
    type: "polyline",
    // 坐标位置相关
    _minPointNum: 2, // 至少需要点的个数
    _maxPointNum: 2, // 最多允许点的个数
    getRectangle: function () {
      let positions = this.getDrawPosition();
      if (positions.length < 2) return null;
      return Cesium$1__default.Rectangle.fromCartesianArray(positions);
    },
    //根据attribute参数创建Entity
    createFeature: function (attribute) {
      this._positions_draw = [];

      let that = this;
      let addAttr = {
        rectangle: Rectangle.style2Entity(attribute.style),
        attribute: attribute,
      };
      addAttr.rectangle.coordinates = new Cesium$1__default.CallbackProperty(function (
        time
      ) {
        return that.getRectangle();
      },
      false);

      //线：边线宽度大于1时
      addAttr.polyline = {
        clampToGround: attribute.style.clampToGround,
        show: false,
      };

      this.entity = this.dataSource.entities.add(addAttr); //创建要素对象
      this.bindOutline(this.entity); //边线

      return this.entity;
    },
    style2Entity: function (style, entity) {
      return Rectangle.style2Entity(style, entity.rectangle);
    },
    bindOutline: function (entity) {
      //是否显示：边线宽度大于1时
      entity.polyline.show = new Cesium$1__default.CallbackProperty(function (time) {
        return (
          entity.rectangle.outline &&
          entity.rectangle.outline.getValue() &&
          entity.rectangle.outlineWidth &&
          entity.rectangle.outlineWidth.getValue() > 1
        );
      }, false);
      entity.polyline.positions = new Cesium$1__default.CallbackProperty(function (time) {
        if (!entity.polyline.show.getValue()) return null;

        var positions = entity._draw_positions;
        var height = entity.rectangle.height
          ? entity.rectangle.height.getValue()
          : 0;

        var re = Cesium$1__default.Rectangle.fromCartesianArray(positions);
        var pt1 = Cesium$1__default.Cartesian3.fromRadians(re.west, re.south, height);
        var pt2 = Cesium$1__default.Cartesian3.fromRadians(re.east, re.south, height);
        var pt3 = Cesium$1__default.Cartesian3.fromRadians(re.east, re.north, height);
        var pt4 = Cesium$1__default.Cartesian3.fromRadians(re.west, re.north, height);

        return [pt1, pt2, pt3, pt4, pt1];
      }, false);
      entity.polyline.width = new Cesium$1__default.CallbackProperty(function (time) {
        return entity.rectangle.outlineWidth;
      }, false);
      entity.polyline.material = new Cesium$1__default.ColorMaterialProperty(
        new Cesium$1__default.CallbackProperty(function (time) {
          return entity.rectangle.outlineColor.getValue();
        }, false)
      );
    },
    updateAttrForDrawing: function () {
      var style = this.entity.attribute.style;
      if (!style.clampToGround) {
        var maxHight = point.getMaxHeight(this.getDrawPosition());

        this.entity.rectangle.height = maxHight;
        style.height = maxHight;

        if (style.extrudedHeight)
          this.entity.rectangle.extrudedHeight =
            maxHight + Number(style.extrudedHeight);
      }
    },
    //获取编辑对象
    getEditClass: function (entity) {
      var _edit = new EditRectangle(entity, this.viewer, this.dataSource);
      _edit._minPointNum = this._minPointNum;
      _edit._maxPointNum = this._maxPointNum;
      return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function () {
      return Rectangle;
    },
    //图形绘制结束后调用
    finish: function () {
      let entity = this.entity;

      entity.editing = this.getEditClass(entity); //绑定编辑对象

      entity._positions_draw = this._positions_draw;
      //entity.rectangle.coordinates = this.getRectangle();
      entity.rectangle.coordinates = new Cesium$1__default.CallbackProperty(function (time) {
        if (entity._positions_draw.length < 2) return null;
        return Cesium$1__default.Rectangle.fromCartesianArray(entity._positions_draw);
      }, false);
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-19 08:33:33
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:47:29
   */

  const def_minPointNum$4 = 2;
  const def_maxPointNum$4 = 9999;

  var DrawWall = DrawPolyline.extend({
    type: "wall",
    // 坐标位置相关
    _minPointNum: def_minPointNum$4, //至少需要点的个数
    _maxPointNum: def_maxPointNum$4, //最多允许点的个数
    createFeature: function (attribute) {
      this._positions_draw = [];

      if (attribute.config) {
        this._minPointNum = attribute.config.minPointNum || def_minPointNum$4;
        this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum$4;
      } else {
        this._minPointNum = def_minPointNum$4;
        this._maxPointNum = def_maxPointNum$4;
      }

      this.maximumHeights = [];
      this.minimumHeights = [];

      var that = this;
      var addAttr = {
        wall: style2Entity$a(attribute.style),
        attribute: attribute,
      };
      addAttr.wall.positions = new Cesium$1__default.CallbackProperty(function (time) {
        return that.getDrawPosition();
      }, false);
      addAttr.wall.minimumHeights = new Cesium$1__default.CallbackProperty(function (time) {
        return that.getMinimumHeights();
      }, false);
      addAttr.wall.maximumHeights = new Cesium$1__default.CallbackProperty(function (time) {
        return that.getMaximumHeights();
      }, false);

      this.entity = this.dataSource.entities.add(addAttr); //创建要素对象
      return this.entity;
    },

    style2Entity: function (style, entity) {
      return style2Entity$a(style, entity.wall);
    },
    getMaximumHeights: function (entity) {
      return this.maximumHeights;
    },
    getMinimumHeights: function (entity) {
      return this.minimumHeights;
    },
    updateAttrForDrawing: function () {
      var style = this.entity.attribute.style;
      var position = this.getDrawPosition();
      var len = position.length;

      this.maximumHeights = new Array(len);
      this.minimumHeights = new Array(len);

      for (let i = 0; i < len; i++) {
        let height = Cesium$1__default.Cartographic.fromCartesian(position[i]).height;
        this.minimumHeights[i] = height;
        this.maximumHeights[i] = height + Number(style.extrudedHeight);
      }
    },
    //获取编辑对象
    getEditClass: function (entity) {
      let _edit = new EditWall(entity, this.viewer, this.dataSource);
      _edit._minPointNum = this._minPointNum;
      _edit._maxPointNum = this._maxPointNum;
      return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function () {
      return Wall;
    },
    //图形绘制结束后调用
    finish: function () {
      this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象
      this.entity.wall.positions = this.getDrawPosition();
      this.entity.wall.minimumHeights = this.getMinimumHeights();
      this.entity.wall.maximumHeights = this.getMaximumHeights();
    },
  });

  /*
   * @Description: 绘制类
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-09 10:36:27
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:57:58
   */

  /*
   * @Description: 图层封装基类
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 08:41:02
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:50:52
   */

  var BaseLayer = leaflet.Class.extend({
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
        this.viewer.mars.centerAt(this.config.extent || this.config.center, {
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

  /*
   * @Description: GeoJson格式数据图层
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 11:22:51
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:51:40
   */
  var GeoJsonLayer = BaseLayer.extend({
    dataSource: null,
    hasOpacity: true,
    _opacity: 0.9,
    // 默认symbol
    colorHash: {},
    // 添加
    add: function () {
      if (this.dataSource) {
        this.viewer.dataSources.add(this.dataSource);
      } else {
        this.queryData();
      }
    },

    // 移除
    remove: function () {
      this.viewer.dataSources.remove(this.dataSource);
    },

    // 定位至数据区域
    centerAt: function (duration) {
      if (this.config.extent || this.config.center) {
        this.viewer.mars.centerAt(this.config.extent || this.config.center, {
          duration: duration,
          isWgs84: true,
        });
      } else {
        if (this.dataSource == null) {
          return;
        }
        // this.viewer.zoomTo(this.dataSource.entities.values);
        this.viewer.flyTo(this.dataSource.entities.values, {
          duration: duration,
        });
      }
    },

    // 设置透明度
    setOpacity: function (value) {
      this._opacity = value;
      if (this.dataSource == null) return;
      let entities = this.dataSource.entities.values;
      for (let i = 0, len = entities.length; i < len; i++) {
        let entity = entities[i];
        if (
          entity.polygon &&
          entity.polygon.material &&
          entity.polygon.material.color
        ) {
          this._updateEntityAlpha(entity.polygon.material.color, this._opacity);
          if (entity.polygon.outlineColor) {
            this._updateEntityAlpha(entity.polygon.outlineColor, this._opacity);
          }
        }

        if (
          entity.polyline &&
          entity.polyline.material &&
          entity.polyline.material.color
        ) {
          this._updateEntityAlpha(entity.polyline.material.color, this._opacity);
        }

        if (entity.billboard) {
          entity.billboard.color = new Cesium$1__default.Color.fromCssColorString(
            "#FFFFFF"
          ).withAlpha(this._opacity);
        }

        if (entity.model) {
          entity.model.color = new Cesium$1__default.Color.fromCssColorString(
            "#FFFFFF"
          ).withAlpha(this._opacity);
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
    },

    _updateEntityAlpha: function (color, opacity) {
      let newColor = color.getValue().withAlpha(opacity);
      color.setValue(newColor);
    },

    queryData: function () {
      let that = this;
      let dataSource = Cesium$1__default.GeoJsonDataSource.load(this.config.url, {
        clampToGround: this.config.clampToGround,
      });
      dataSource
        .then((dataSource) => {
          that.showResult(dataSource);
        })
        .otherwise((error) => {
          that.showError("服务出错", error);
        });
    },

    showResult: function (dataSource) {
      let that = this;
      this.dataSource = this.dataSource;
      this.viewer.dataSources.add(this.dataSource);
      if (this.config.flyTo) {
        this.centerAt();
      }
      // ================= 设置样式 ================
      let entities = this.dataSource.entities.values;
      for (let i = 0, len = entities.length; i < len; i++) {
        let entity = entities[i];
        // 样式
        if (this.config.symbol) {
          if (this.config.symbol == "default") this.setDefSymbol(entity);
          else this.setConfigSymbol(entity, this.config.symbol);
        }
        // popup弹窗
        if (this.config.columns || this.config.popup) {
          entity.popup = {
            html: (entity) => {
              let attr = that.getEntityAttr(entity);
              if (isString(attr)) return attr;
              else
                return that.viewer.mars.popup.getPopupForConfig(
                  that.config,
                  attr
                );
            },
            anchor: that.config.popupAnchor || [0, 15],
          };
        }

        if (that.config.tooltip) {
          entity.tooltip = {
            html: (entity) => {
              let attr = that.getEntityAttr(entity);
              if (isString(attr)) return attr;
              else
                return that.viewer.mars.popup.getPopupForConfig(
                  {
                    popup: that.config.tooltip,
                  },
                  attr
                );
            },
            anchor: that.config.tooltipAnchor || [0, -15],
          };
        }

        if (that.config.click) {
          entity.click = that.config.click;
        }
      }
    },

    getEntityAttr: function (entity) {
      return entity.properties;
    },

    setDefSymbol: function (entity) {
      let attr = that.getEntityAttr(entity) || {};
      if (entity.polygon) {
        let name = attr.id || attr.OBJECTID || 0;
        let color = this.colorHash[name];
        if (!color) {
          color = Cesium$1__default.Color.fromRandom({
            minimumGreen: 0.75,
            maximumBlue: 0.75,
            alpha: this._opacity,
          });
          this.colorHash[name] = color;
        }

        entity.polygon.material = color;
        entity.polygon.outline = true;
        entity.polygon.outlineColor = Cesium$1__default.Color.WHITE;
      } else if (entity.polyline) {
        let name = attr.id || attr.OBJECTID || 0;
        let color = this.colorHash[name];
        if (!color) {
          color = Cesium$1__default.Color.fromRandom({
            minimumGreen: 0.75,
            maximumBlue: 0.75,
            alpha: this._opacity,
          });
          this.colorHash[name] = color;
        }
        entity.polyline.material = color;
        entity.polyline.width = 2;
      } else if (entity.billboard) {
        entity.billboard.scale = 0.5;
        entity.billboard.horizontalOrigin = Cesium$1__default.HorizontalOrigin.CENTER;
        entity.billboard.verticalOrigin = Cesium$1__default.VerticalOrigin.BOTTOM;
      }
    },

    setConfigSymbol: function (entity, symbol) {
      let attr = symbol.styleOptions;
      let styleOpt = symbol.styleOptions;
      if (symbol.styleField) {
        // 存在多个symbol，按styleField进行分类
        let styleFieldVal = attr[symbol.styleField];
        let styleOptField = symbol.styleFieldOptions[styleFieldVal];
        if (styleOptField != null) {
          styleOpt = clone(styleOpt);
          styleOpt = $$1.extend(styleOpt, styleOptField);
        }
      }
      styleOpt = styleOpt || {};

      this._opacity = styleOpt.opacity || 1; // 透明度
      if (entity.polyline) {
        style2Entity$7(styleOpt, entity.polyline);
      }
      if (entity.polygon) {
        style2Entity$6(styleOpt, entity.polygon);
        // 加上线宽
        if (styleOpt.outlineWidth && styleOpt.outlineWidth > 1) {
          entity.polygon.outline = false;
          let newOpt = {
            color: styleOpt.outlineColor,
            width: styleOpt.outlineWidth,
            opacity: styleOpt.outlineOpacity,
            lineType: "solid",
            clampToGround: true,
            outliine: false,
          };
          let polyline = style2Entity$7(newOpt);
          polyline.positions = entity.polygon.hierarchy._value.positions;
          this.dataSource._entityCollection.add({
            polyline: polyline,
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
        styleOpt.heightReference =
          styleOpt.heightReference || Cesium$1__default.HeightReference.RELATIVE_TO_GROUND;
        style2Entity$3(styleOpt, entity.label);
      }

      if (entity.billboard) {
        styleOpt.heightReference =
          styleOpt.heightReference || Cesium$1__default.HeightReference.RELATIVE_TO_GROUND;
        style2Entity(styleOpt, entity.billboard);
        // 加上文字标签
        if (styleOpt.label && styleOpt.label.field) {
          styleOpt.label.heightReference =
            styleOpt.label.heightReference ||
            Cesium$1__default.HeightReference.RELATIVE_TO_GROUND;
          entity.label = style2Entity$3(styleOpt.label);
          entity.label.text = attr[styleOpt.label.field] || "";
        }
      }

      entity.attribute = styleOpt;
    },
  });

  /*
   * @Descripttion:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-10 11:24:07
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:50:35
   */

  var ArcFeatureLayer = GeoJsonLayer.extend({
    queryData: function () {
      var that = this;
      var url = this.config.url;

      if (this.config.layers && this.config.layers.length > 0)
        url += "/" + this.config.layers[0];

      var query = leaflet.esri.query({
        url: url,
      });
      if (this.config.where) query.where(this.config.where);

      query.run(function (error, featureCollection, response) {
        if (error != null && error.code > 0) {
          alert(error.message, "服务访问出错");
          return;
        }

        if (
          featureCollection == undefined ||
          featureCollection == null ||
          featureCollection.features.length == 0
        ) {
          msg("未找到符合查询条件的要素！");
          return;
        } else {
          //剔除有问题数据
          var featuresOK = [];
          for (var i = 0; i < featureCollection.features.length; i++) {
            var feature = featureCollection.features[i];
            if (feature == null || feature.geometry == null) continue;
            if (
              feature.geometry.coordinates &&
              feature.geometry.coordinates.length == 0
            )
              continue;
            featuresOK.push(feature);
          }
          featureCollection.features = featuresOK;

          var dataSource = _Cesium2.default.GeoJsonDataSource.load(
            featureCollection,
            {
              clampToGround: true,
            }
          );
          dataSource
            .then(function (dataSource) {
              that.showResult(dataSource);
            })
            .otherwise(function (error) {
              that.showError("服务出错", error);
            });
        }
      });
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-21 13:59:42
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-10 10:29:05
   */
  var GroupLayer = BaseLayer.extend({
    create: function () {
      var arr = this.config._layers;
      for (var i = 0, len = arr.length; i < len; i++) {
        this.hasOpacity = arr[i].hasOpacity;
        this.hasZIndex = arr[i].hasZIndex;
      }
    },

    setVisible: function (val) {
      var arr = this.config._layers;
      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i].setVisible(val);
      }
    },

    // 添加
    add: function () {
      var arr = this.config._layers;
      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i].setVisible(true);
      }
    },

    // 移除
    remove: function () {
      var arr = this.config._layers;
      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i].setVisible(false);
      }
    },

    // 定位至数据区域
    centerAt: function (duration) {
      var arr = this.config._layers;
      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i].centerAt(duration);
      }
    },

    // 设置透明度
    setOpacity: function (value) {
      var arr = this.config._layers;
      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i].setOpacity(value);
      }
    },

    // 设置叠加顺序
    setZIndex: function (value) {
      var arr = this.config._layers;
      for (var i = 0; i < arr.length; i++) {
        arr[i].setZIndex(value);
      }
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-14 16:49:20
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 11:24:37
   */

  var GraticuleLayer = BaseLayer.extend({
    model: null,
    // 添加
    add: function () {
      if (this.model == null) {
        this.initData();
      }
      this.model.setVisible(true);
    },

    // 移除
    remove: function () {
      if (this.model == null) return;
      this.model.setVisible(false);
    },

    initData: function () {
      function GraticuleLayer(description, scene) {
        description = description || {};
        this._tilingScheme =
          description._tilingScheme || new Cesium$1__default.GeographicTilingScheme();
        this._color = description.color || new Cesium$1__default.Color(1.0, 1.0, 1.0, 0.4);
        this._tileWidth = description.tileWidth || 256;
        this._tileHeight = description.tileHeight || 256;
        this._ready = true;
        // default to decimal intervals.
        this._sexagesimal = description.sexagesimal || false;
        this._numLines = description.numLines || 50;

        this._scene = scene;
        this._lables = new Cesium$1__default.LabelCollection();
        scene.primitives.add(this._lables);
        this._polylines = new Cesium$1__default.PolylineCollection();
        scene.primitives.add(this._polylines);
        this._ellipsoid = scene.globe.ellipsoid;
        var canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        this._canvas = canvas;
        var that = this;
        scene.camera.moveEnd.addEventListener(() => {
          if (!that._show) return;
          that._polylines.removeAll();
          that._labels.removeAll();
          this._currentExtent = null;
          that._drawGrid(that._getExtentView());
        });
        scene.imageryLayers.addImageryProvider(this);
      }

      var definePropertyWorks = (function () {
        try {
          return "x" in Object.defineProperty({}, "x", {});
        } catch (e) {
          return false;
        }
      })();

      /**
       * Defines properties on an object, using Object.defineProperties if available,
       * otherwise returns the object unchanged.  This function should be used in
       * setup code to prevent errors from completely halting JavaScript execution
       * in legacy browsers.
       *
       * @private
       *
       * @exports defineProperties
       */
      var defineProperties = Object.defineProperties;
      if (!definePropertyWorks || !defineProperties) {
        defineProperties = function defineProperties(o) {
          return o;
        };
      }

      defineProperties(GraticuleLayer.prototype, {
        url: {
          get: function () {
            return undefined;
          },
        },
        proxy: {
          get: function () {
            return undefined;
          },
        },
        tileWidth: {
          get: function () {
            return this._tileWidth;
          },
        },
        tileHeight: {
          get: function () {
            return this._tileHeight;
          },
        },
        maximumLevel: {
          get: function () {
            return 18;
          },
        },
        minimumLevel: {
          get: function () {
            return 0;
          },
        },
        tilingScheme: {
          get: function () {
            return this._tilingScheme;
          },
        },
        rectangle: {
          get: function () {
            return this._tilingScheme.rectangle;
          },
        },
        tileDiscardPolicy: {
          get: function () {
            return undefined;
          },
        },
        errorEvent: {
          get: function () {
            return this._errorEvent;
          },
        },
        ready: {
          get: function () {
            return this._ready;
          },
        },
        credit: {
          get: function () {
            return this._credit;
          },
        },
        hasAlphaChannel: {
          get: function () {
            return true;
          },
        },
      });

      GraticuleLayer.prototype.makeLabel = function (lng, lat, text, top, color) {
        this._lables.add({
          position: this._ellipsoid.cartographicToCartesian(
            new Cesium$1__default.Cartographic(lng, lat, 10.0)
          ),
          text: text,
          font: "16px Helvetica",
          style: Cesium$1__default.LabelStyle.FILL_AND_OUTLINE,
          fillColor: Cesium$1__default.Color.AZURE,
          outlineColor: Cesium$1__default.Color.BLACK,
          outlineWidth: 2,
          pixelOffset: Cesium$1__default.Cartesian3.ZERO,
          horizontalOrigin: Cesium$1__default.HorizontalOrigin.LEFT,
          verticalOrigin: top
            ? Cesium$1__default.VerticalOrigin.BOTTOM
            : Cesium$1__default.VerticalOrigin.TOP,
          scale: 1.0,
        });
      };

      GraticuleLayer.prototype._drawGrid = function (extent) {
        if (this._currentExtent && this._currentExtent.equals(extent)) {
          return;
        }
        this._currentExtent = extent;
        this._polylines.removeAll();
        this._lables.removeAll();
        var maxPixel = this._canvasSize;

        var dLat = 0,
          dLng = 0,
          index;
        // get the nearest to the calculated value
        for (
          index = 0;
          index < mins.length && dLat < (extent.north - extent.south) / 10;
          index++
        ) {
          dLat = mins[index];
        }
        for (
          index = 0;
          index < mins.length && dLng < (extent.east - extent.west) / 10;
          index++
        ) {
          dLng = mins[index];
        }

        // round iteration limits to the computed grid interval
        var minLng =
          (extent.west < 0
            ? Math.ceil(extent.west / dLng)
            : Math.floor(extent.west / dLng)) * dLng;
        var minLat =
          (extent.south < 0
            ? Math.ceil(extent.south / dLat)
            : Math.floor(extent.south / dLat)) * dLat;
        var maxLng =
          (extent.east < 0
            ? Math.ceil(extent.east / dLat)
            : Math.floor(extent.east / dLat)) * dLat;
        var maxLat =
          (extent.north < 0
            ? Math.ceil(extent.north / dLng)
            : Math.floor(extent.north / dLng)) * dLng;

        // extend to make sure we cover for non refresh of tiles
        minLng = Math.max(minLng - 2 * dLng, -Math.PI);
        maxLng = Math.min(maxLng + 2 * dLng, Math.PI);
        minLat = Math.max(minLat - 2 * dLat, -Math.PI / 2);
        maxLat = Math.min(maxLat + 2 * dLng, Math.PI / 2);

        var ellipsoid = this._ellipsoid;
        var lat,
          lng,
          granularity = _Cesium2.default.Math.toRadians(1);

        // labels positions
        var latitudeText =
          minLat + Math.floor((maxLat - minLat) / dLat / 2) * dLat;
        for (lng = minLng; lng < maxLng; lng += dLng) {
          // draw meridian
          var path = [];
          for (lat = minLat; lat < maxLat; lat += granularity) {
            path.push(new Cesium$1__default.Cartographic(lng, lat));
          }
          path.push(new Cesium$1__default.Cartographic(lng, maxLat));
          this._polylines.add({
            positions: ellipsoid.cartographicArrayToCartesianArray(path),
            width: 1,
          });
          var degLng = Cesium$1__default.Math.toDegrees(lng);
          this.makeLabel(
            lng,
            latitudeText,
            this._sexagesimal
              ? this._decToSex(degLng)
              : degLng.toFixed(gridPrecision(dLng)),
            false
          );
        }

        // lats
        var longitudeText =
          minLng + Math.floor((maxLng - minLng) / dLng / 2) * dLng;
        for (lat = minLat; lat < maxLat; lat += dLat) {
          // draw parallels
          var path = [];
          for (lng = minLng; lng < maxLng; lng += granularity) {
            path.push(new Cesium$1__default.Cartographic(lng, lat));
          }
          path.push(new Cesium$1__default.Cartographic(maxLng, lat));
          this._polylines.add({
            positions: ellipsoid.cartographicArrayToCartesianArray(path),
            width: 1,
          });
          var degLat = Cesium$1__default.Math.toDegrees(lat);
          this.makeLabel(
            longitudeText,
            lat,
            this._sexagesimal
              ? this._decToSex(degLat)
              : degLat.toFixed(gridPrecision(dLat)),
            true
          );
        }
      };

      GraticuleLayer.prototype.requestImage = function (x, y, level) {
        if (this._show) {
          this._drawGrid(this._getExtentView());
        }

        return this._canvas;
      };

      GraticuleLayer.prototype.setVisible = function (visible) {
        this._show = visible;
        if (!visible) {
          this._polylines.removeAll();
          this._labels.removeAll();
        } else {
          this._currentExtent = null;
          this._drawGrid(this._getExtentView());
        }
      };

      GraticuleLayer.prototype.isVisible = function () {
        return this._show;
      };

      GraticuleLayer.prototype._decToSex = function (d) {
        var degs = Math.floor(d);
        var mins = ((Math.abs(d) - degs) * 60.0).toFixed(2);
        if (mins == "60.00") {
          degs += 1.0;
          mins = "0.00";
        }
        return [degs, ":", mins].join("");
      };

      GraticuleLayer.prototype._getExtentView = function () {
        var camera = this._scene.camera;
        var canvas = this._scene.canvas;
        var corners = [
          camera.pickEllipsoid(
            new _Cesium2.default.Cartesian2(0, 0),
            this._ellipsoid
          ),
          camera.pickEllipsoid(
            new Cesium$1__default.Cartesian2(canvas.width, 0),
            this._ellipsoid
          ),
          camera.pickEllipsoid(
            new Cesium$1__default.Cartesian2(0, canvas.height),
            this._ellipsoid
          ),
          camera.pickEllipsoid(
            new Cesium$1__default.Cartesian2(canvas.width, canvas.height),
            this._ellipsoid
          ),
        ];
        for (var index = 0; index < 4; index++) {
          if (corners[index] === undefined) {
            return Cesium$1__default.default.Rectangle.MAX_VALUE;
          }
        }
        return Cesium$1__default.default.Rectangle.fromCartographicArray(
          this._ellipsoid.cartesianArrayToCartographicArray(corners)
        );
      };

      function gridPrecision(dDeg) {
        if (dDeg < 0.01) return 2;
        if (dDeg < 0.1) return 1;
        if (dDeg < 1) return 0;
        return 0;
      }

      var mins = [
        Cesium$1__default.Math.toRadians(0.05),
        Cesium$1__default.Math.toRadians(0.1),
        Cesium$1__default.Math.toRadians(0.2),
        Cesium$1__default.Math.toRadians(0.5),
        Cesium$1__default.Math.toRadians(1.0),
        Cesium$1__default.Math.toRadians(2.0),
        Cesium$1__default.Math.toRadians(5.0),
        Cesium$1__default.Math.toRadians(10.0),
      ];

      this.model = new GraticuleLayer(
        {
          numLines: 10,
        },
        this.viewer.scene
      );
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-21 14:00:31
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:52:16
   */
  var POILayer = CustomFeatureGridLayer.extend({
    _keys: null,
    _key_index: 0,
    getKey: function () {
      if (!this._keys) {
        this._keys = this.config.key || [
          "c95467d0ed2a3755836e37dc27369f97",
          "4320dda936d909d73ab438b4e29cf2a2",
          "e64a96ed7e361cbdc0ebaeaf3818c564",
          "df3247b7df64434adecb876da94755d7",
          "d4375ec477cb0a473c448fb1f83be781",
          "13fdd7b2b90a9d326ae96867ebcc34ce",
          "c34502450ae556f42b21760faf6695a0",
          "57f8ebe12797a73fc5b87f5d4ef859b1",
        ];
        var thisidx = this._key_index++ % this._keys.length;
        return this._keys[thisidx];
      }
    },

    getDataForGrid: function (opts, callback) {
      var jwd1 = wgs2gcj([opts.rectangle.xmin, opts.rectangle.ymax]); // 加偏
      var jwd2 = wgs2gcj([opts.rectangle.xmax, opts.rectangle.ymin]); // 加偏
      var polygon = jwd1[0] + "," + jwd1[1] + "|" + jwd2[0] + "," + jwd2[1];

      var filter = this.config.filter || {};
      filter.output = "json";
      filter.key = this.getKey();
      filter.polygon = polygon;
      if (!filter.offset) filter.offset = 25;
      if (!filter.types) filter.types = "120000|130000|190000";
      $$1.ajax({
        url: "http://restapi.amap.com/v3/place/polygon",
        type: "get",
        dataType: "json",
        timeout: "5000",
        data: filter,
        success: function (data) {
          if (data.infocode !== "10000") {
            console.log("POI 请求失败(" + data.infocode + "):" + data.info);
            return;
          }

          var arrData = data.pois;
          callback(arrData);
        },
        error: function (data) {
          console.log("POI 请求出错(" + data.status + "):" + data.statusText);
        },
      });
    },

    // 根据数据创造entity
    createEntity: function (opts, attributes) {
      var inHtml =
        "<div>名称：" +
        attributes.name +
        "</div>" +
        "<div>地址：" +
        attributes.address +
        "</div>" +
        "<div>区域：" +
        attributes.pname +
        attributes.cityname +
        attributes.adname +
        "</div>" +
        "<div>类别：" +
        attributes.type +
        "</div>";

      var arrJwd = attributes.location.split(",");
      arrJwd = Transform.transformGcjToWGS(arrJwd); // 纠偏
      var lnglat = this.viewer.mars.point2map({
        x: arrJwd[0],
        y: arrJwd[1],
      });

      var entityOptions = {
        name: attributes.name,
        position: Cesium$1__default.Cartesian3.fromDegrees(
          lnglat.x,
          lnglat.y,
          this.config.height || 3
        ),
        popup: {
          html: inHtml,
          anchor: [0, -15],
        },
        properties: attributes,
      };

      var symbol = this.config.symbol;
      if (symbol) {
        var styleOpt = symbol.styleOptions;
        if (symbol.styleField) {
          //存在多个symbol，按styleField进行分类
          var styleFieldVal = attr[symbol.styleField];
          var styleOptField = symbol.styleFieldOptions[styleFieldVal];
          if (styleOptField != null) {
            styleOpt = $$1.extend({}, styleOpt);
            styleOpt = $$1.extend(styleOpt, styleOptField);
          }
        }
        styleOpt = styleOpt || {};

        if (styleOpt.image) {
          entityOptions.billboard = style2Entity(styleOpt);
          entityOptions.billboard.heightReference =
            Cesium$1__default.HeightReference.RELATIVE_TO_GROUND;
        } else {
          entityOptions.point = style2Entity$5(styleOpt);
        }

        //加上文字标签
        if (styleOpt.label) {
          entityOptions.label = Label.style2Entity(styleOpt.label);
          entityOptions.label.heightReference =
            Cesium$1__default.HeightReference.RELATIVE_TO_GROUND;
          entityOptions.label.text = attributes.name;
        }
      } else {
        //无配置时的默认值
        entityOptions.point = {
          color: new Cesium$1__default.Color.fromCssColorString("#3388ff"),
          pixelSize: 10,
          outlineColor: new Cesium$1__default.Color.fromCssColorString("#ffffff"),
          outlineWidth: 2,
          heightReference: Cesium$1__default.HeightReference.RELATIVE_TO_GROUND,
          scaleByDistance: new Cesium$1__default.NearFarScalar(1000, 1, 20000, 0.5),
        };
        entityOptions.label = {
          text: attributes.name,
          font: "normal small-caps normal 16px 楷体",
          style: Cesium$1__default.LabelStyle.FILL_AND_OUTLINE,
          fillColor: Cesium$1__default.Color.AZURE,
          outlineColor: Cesium$1__default.Color.BLACK,
          outlineWidth: 2,
          horizontalOrigin: Cesium$1__default.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium$1__default.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium$1__default.Cartesian2(0, -15), //偏移量
          heightReference: Cesium$1__default.HeightReference.RELATIVE_TO_GROUND, //是地形上方的高度
          scaleByDistance: new Cesium$1__default.NearFarScalar(1000, 1, 5000, 0.8),
          distanceDisplayCondition: new Cesium$1__default.DistanceDisplayCondition(
            0.0,
            5000
          ),
        };
      }

      var entity = this.dataSource.entities.add(entityOptions);
      return entity;
    },
  });

  /*
   * @Description: Gltf小模型图层
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 11:10:46
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 11:23:09
   */

  var GltfLayer = BaseLayer.extend({
    model: null,
    hasOpacity: true,
    // 添加
    add: function () {
      if (this.model) {
        this.viewer.entities.add(this.model);
      } else {
        this.initData();
      }
    },

    // 移除
    remove: function () {
      this.viewer.entities.remove(this.model);
    },

    // 定位到数据区域
    centerAt: function (duration) {
      if (this.model == null) return;
      if (this.config.extent || this.config.center) {
        this.viewer.mars.centerAt(this.config.extent || this.config.center, {
          duration: duration,
          isWgs84: true,
        });
      } else {
        var cfg = this.config.position;
        this.viewer.mars.centerAt(cfg, {
          duration: duration,
          isWgs84: true,
        });
      }
    },

    initData: function () {
      var cfg = this.config.position;
      cfg = this.viewer.mars.point2map(cfg); // 转换坐标系
      var position = Cesium$1__default.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);
      var heading = Cesium$1__default.Math.toRadians(cfg.heading || 0);
      var pitch = Cesium$1__default.Math.toRadians(cfg.pitch || 0);
      var roll = Cesium$1__default.Math.toRadians(cfg.roll || 0);
      var hpr = new Cesium$1__default.HeadingPitchRoll(heading, pitch, roll);
      var orientation = Cesium$1__default.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );

      var modelopts = {
        uri: this.config.url,
      };

      for (var key in this.config) {
        if (
          key == "url" ||
          key == "name" ||
          key == "position" ||
          key == "center" ||
          key == "tooltip" ||
          key == "popup"
        )
          continue;
        modelopts[key] = this.config[key];
      }

      this.model = this.viewer.entities.add({
        name: this.config.name,
        position: position,
        orientation: orientation,
        model: modelopts,
        _config: this.config,
        tooltip: this.config.tooltip,
        popup: this.config.popup,
      });
    },

    setOpacity: function (value) {
      if (this.model == null) return;
      this.model.model.color = new Cesium$1__default.Color.fromCssColorString(
        "#FFFFFF"
      ).withAlpha(value);
    },
  });

  const { Matrix4, Matrix3 } = require("cesium");

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 10:19:53
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 15:52:35
   */
  var Axis = {
    /**
     * Matrix used to convert from y-up to z-up
     *
     * @type {Matrix4}
     * @constant
     */
    Y_UP_TO_Z_UP: Matrix4.fromRotationTranslation(
      Matrix3.fromRotationX(CesiumMath.PI_OVER_TWO)
    ),

    /**
     * Matrix used to convert from z-up to y-up
     *
     * @type {Matrix4}
     * @constant
     */
    Z_UP_TO_Y_UP: Matrix4.fromRotationTranslation(
      Matrix3.fromRotationX(-CesiumMath.PI_OVER_TWO)
    ),

    /**
     * Matrix used to convert from x-up to z-up
     *
     * @type {Matrix4}
     * @constant
     */
    X_UP_TO_Z_UP: Matrix4.fromRotationTranslation(
      Matrix3.fromRotationY(-CesiumMath.PI_OVER_TWO)
    ),

    /**
     * Matrix used to convert from z-up to x-up
     *
     * @type {Matrix4}
     * @constant
     */
    Z_UP_TO_X_UP: Matrix4.fromRotationTranslation(
      Matrix3.fromRotationY(CesiumMath.PI_OVER_TWO)
    ),

    /**
     * Matrix used to convert from x-up to y-up
     *
     * @type {Matrix4}
     * @constant
     */
    X_UP_TO_Y_UP: Matrix4.fromRotationTranslation(
      Matrix3.fromRotationZ(CesiumMath.PI_OVER_TWO)
    ),

    /**
     * Matrix used to convert from y-up to x-up
     *
     * @type {Matrix4}
     * @constant
     */
    Y_UP_TO_X_UP: Matrix4.fromRotationTranslation(
      Matrix3.fromRotationZ(-CesiumMath.PI_OVER_TWO)
    ),
  };

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 09:04:46
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:11:05
   */

  var Tiles3dLayer = BaseLayer.extend({
    model: null,
    originalCenter: null,
    boundingSphere: null,
    // 添加
    add: function () {
      if (this.model) {
        this.viewer.scene.primitives.add(this.model);
      } else {
        this.initData();
      }
    },
    // 移除
    remove: function () {
      this.viewer.scene.primitives.remove(this.model);
      this.model = null;
    },

    // 定位到数据区域
    centerAt: function (duration) {
      if (this.config.extent || this.config.center) {
        this.viewer.mars.centerAt(this.config.extent || this.config.center, {
          duration: duration,
          isWgs84: true,
        });
      } else if (this.boundingSphere) {
        this.viewer.camera.flyToBoundingSphere(this.boundingSphere, {
          offset: new Cesium$1__default.HeadingPitchRange(0.0, -0.5, this.boundingSphere),
          duration: duration,
        });
      }
    },

    initData: function () {
      // 默认值
      this.config.maximumScreenSpaceError =
        this.config.maximumScreenSpaceError || 2; // 默认16
      this.config.maximumMemoryUsage = this.config.maximumMemoryUsage || 2048; // 提升内存到2GB， 默认512MB
      this.model = this.viewer.scene.primitives.add(
        new Cesium$1__default.Cesium3DTileset(this.config)
      );
      this.model._config = this.config;
      this.model.tooltip = this.config.tooltip;
      this.model.popup = this.config.popup;
      var that = this;
      this.model.readyPromise.then((tileset) => {
        if (that.hasOpacity && that._opacity != -1) {
          // 透明度
          that.setOpacity(that._opacity);
        }
        that.updateAxis(that.config.axis); // 变换轴

        // 记录模型原始的中心点
        var boundingSphere = tileset.boundingSphere;
        that.boundingSphere = boundingSphere;
        if (tileset._root && tileset._root.transform) {
          that.originMatrixInverse = Cesium$1__default.Matrix4.inverse(
            Cesium$1__default.Matrix4.fromArray(tileset._root.transform),
            new Cesium$1__default.Matrix4()
          );
          if (that.config.scale > 0 && that.config.scale != -1) {
            tileset._root.transform = Cesium$1__default.Matrix4.multiplyByUniformScale(
              tileset._root.transform,
              that.config.scale,
              tileset._root.transform
            );
          }
        }

        var position = boundingSphere.center; // 模型原始的中心店
        var cartographic = Cesium$1__default.Cartographic.fromCartesian(position);

        var height = Number(cartographic.height.toFixed(2));
        var longitude = Number(
          Cesium$1__default.Math.toDegrees(cartographic.longitude).toFixed(6)
        );
        var latitude = Number(
          Cesium$1__default.Math.toDegrees(cartographic.latitude).toFixed(6)
        );
        that.originalCenter = {
          x: longitude,
          y: latitude,
          z: height,
        };
        console.log(that.config.name || "") +
          " 模型原始位置：" +
          JSON.stringify(that.originalCenter);

        // 转换坐标系【如果是高德、谷歌、国测局坐标系转换坐标进行加偏，其他的原样返回】
        var rawCenter = that.viewer.mars.point2map(that.originalCenter);
        if (
          rawCenter.x != that.originalCenter.x ||
          rawCenter.y != that.originalCenter.y ||
          that.config.offset != null
        ) {
          that.config.offset = that.config.offset || {}; // 配置信息中指定的坐标信息或高度信息
          if (that.config.offset.x && that.config.offset.y) {
            that.config.offset = that.viewer.mars.point2map(that.config.offset); // 转换坐标系【如果是高德、谷歌、国测局坐标系转换坐标进行加偏，其他的原样返回】
          }
          var offsetopt = {
            x: that.config.offset.x || rawCenter.x,
            y: that.config.offset.y || rawCenter.y,
            z: that.config.offset.z || 0,
            heading: that.config.offset.heading,
          };

          if (that.config.offset.z == "-height") {
            offsetopt.z = -height + 5;
            that.updateMatrix(offsetopt);
          } else if (that.config.offset.z == "auto") {
            that.autoHeight(position, offsetopt);
          } else {
            that.updateMatrix(offsetopt);
          }
        }
        if (!that.viewer.isFlyAnimation() && that.config.flyTo) {
          that.centerAt(0);
        }
        if (that.config.callback) {
          that.config.callback(tileset);
        }
      });
    },

    /**
     * 变换轴，兼容旧版本数据z轴方向不对的情况
     * 如果可以修改模型json源文件，可以在json文件里面加了一行来修正： "gltfUpAxis": "Z",
     * @param {*} axis
     */
    updateAxis: function (axis) {
      if (axis == null) {
        return;
      }
      var rightAxis;
      switch (axis.toUpperCase()) {
        case "Y_UP_TO_Z_UP":
          rightAxis = Axis.Y_UP_TO_Z_UP;
          break;
        case "Z_UP_TO_Y_UP":
          rightAxis = Axis.Z_UP_TO_Y_UP;
          break;
        case "X_UP_TO_Z_UP":
          rightAxis = Axis.X_UP_TO_Z_UP;
          break;
        case "Z_UP_TO_X_UP":
          rightAxis = Axis.Z_UP_TO_X_UP;
          break;
        case "X_UP_TO_Y_UP":
          rightAxis = Axis.X_UP_TO_Y_UP;
          break;
        case "Y_UP_TO_X_UP":
          rightAxis = Axis.Y_UP_TO_X_UP;
          break;
      }

      if (rightAxis == null) {
        return;
      }

      this.model._root.transform = Cesium$1__default.Matrix4.multiplyTransformation(
        this.model._root.transform,
        rightAxis,
        this.model._root.transform
      );
    },

    // 变换原点坐标【x,y 不能多次修改】
    updateMatrix: function (offsetopt) {
      if (this.model == null) {
        return;
      }
      console.log(" 模型修改后位置: " + JSON.stringify(offsetopt));

      var isOK = false;
      if (
        offsetopt.heading != null &&
        this.model._root &&
        this.model._root.transform
      ) {
        // 有自带世界矩阵，进行旋转操作。
        var mat = Cesium$1__default.Matrix4.fromArray(this.model._root.transform);
        var pos = Cesium$1__default.Matrix4.fromArray(mat, new Cesium$1__default.Cartesian3());
        var wpos = Cesium$1__default.Cartographic.fromCartesian(pos);
        if (wpos) {
          var position = Cesium$1__default.Cartesian3.fromDegrees(
            offsetopt.x,
            offsetopt.y,
            offsetopt.z
          );
          var mat = Cesium$1__default.Transforms.eastNorthUpToFixedFrame(position);
          var rotationX = Cesium$1__default.Matrix4.fromRotationTranslation(
            Cesium$1__default.Matrix3.fromRotationZ(
              Cesium$1__default.Math.toRadians(offsetopt.heading || 0)
            )
          );
          Cesium$1__default.Matrix4.multiply(mat, rotationX, mat);
          if (this.config.scale > 0 && this.config.scale != 1) {
            Cesium$1__default.Matrix4.multiplyByUniformScale(mat, this.config.scale, mat);
            isOK = true;
          }
        }
        if (isOK) {
          var boundingSphere = this.model.boundingSphere;
          var cartographic = Cesium$1__default.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            0.0
          );
          var surface = Cesium$1__default.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            0.0
          );
          var offset = Cesium$1__default.Cartesian3.fromDegrees(
            offsetopt.x,
            offsetopt.y,
            offsetopt.z
          );
          var translation = Cesium$1__default.Cartesian3.subtract(
            offset,
            surface,
            new Cesium$1__default.Cartesian3()
          );
          this.model.modelMatrix = Cesium$1__default.Matrix4.fromTranslation(translation);
        }
      }
    },

    autoHeight: function (position, offsetopt) {
      var that = this;
      // 求地面海拔
      terrainPolyline({
        viewer: this.viewer,
        positions: [position, position],
        callback: (raisedPositions, noHeight) => {
          if (
            raisedPositions == null ||
            raisedPositions.length == 0 ||
            noHeight
          ) {
            return;
          }
          var point = formatPosition(raisedPositions[0]);
          var offsetZ = point.z - that.originalCenter.z + 1;
          offsetopt.z = offsetZ;
          that.updateMatrix(offsetopt);
        },
      });
    },
    hasOpacity: true,

    // 设置透明度
    setOpacity: function (value) {
      this._opacity = value;
      if (this.model) {
        this.model.style = new Cesium$1__default.Cesium3DTileStyle({
          color: "color() *vec4(1,1,1," + value + ")",
        });
      }
    },
  });

  /*
   * @Description: Kml格式数据图层
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-21 09:06:20
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 11:28:12
   */
  var KmlLayer = GeoJsonLayer.extend({
    queryData: function () {
      var that = this;
      var dataSource = Cesium$1__default.KmlDataSource.load(this.config.url, {
        camera: this.viewer.scene.camera,
        canvas: this.viewer.scene.canvas,
        clampToGround: this.config.clampToGround,
      });
      dataSource
        .then((dataSource) => {
          that.showResult(dataSource);
        })
        .otherwise((error) => {
          that.showError("服务出错", error);
        });
    },

    getEntityAttr: function (entity) {
      var attr = {
        name: entity._name,
      };
      var extendedData = entity._kml.extendedData;
      for (var key in extendedData) {
        attr[key] = extendedData[key].value;
      }
      return attr;
    },
  });

  /*
   * @Description: CZML格式数据图层
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 11:22:38
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-09 09:21:13
   */

  var CzmlLayer = GeoJsonLayer.extend({});

  var TerrainLayer = BaseLayer.extend({
    terrain: null,
    add: function () {
      if (!this.terrain) {
        this.terrain = getTerrainProvider(this.config);
      }
      this.viewer.terrainProvider = this.terrain;
    },

    remove: function () {
      this.viewer.terrainProvider = getEllipsoidTerrain();
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-25 10:20:12
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:51:32
   */
  var DrawLayer = BaseLayer.extend({
    hasOpacity: false,

    create: function () {
      this.drawControl = new Draw$$1(this.viewer, {
        hasEdit: false,
        nameTooltip: false,
      });
    },

    // 添加
    add: function () {
      if (this._isLoad) {
        this.drawControl.setVisible(true);
      } else {
        this._loadData();
      }
    },

    // 移除
    remove: function () {
      this.drawControl.setVisible(false);
    },

    // 定位至数据区域
    centerAt: function (duration) {
      var arr = this.drawControl.getEntities();
      this.viewer.flyTo(arr, {
        duration: duration,
      });
    },

    setOpacity: function (value) {},

    _loadData: function () {
      var that = this;
      $$1.ajax({
        type: "get",
        dataType: "json",
        url: "json",
        timeout: 10000,
        success: function (data) {
          that._isLoad = true;
          var arr = that.drawControl.jsonToEntity(data, true, that.config.flyTo);
          that._bindEntityConfig(arr);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log("json文件" + that.config.url + "加载失败！");
        },
      });
    },

    _bindEntityConfig: function (arrEntity) {
      var that = this;
      for (var i = 0, len = arrEntity.length; i < len; i++) {
        var entity = arrEntity[i];
        // popup弹窗
        if (this.config.columns || this.config.popup) {
          entity.popup = {
            html: function (entity) {
              var attr = entity.attribute.attr;
              attr.draw_type = entity.attribute.type;
              attr.draw_typename = entity.attribute.name;
              return that.viewer.mars.popup.getPopupConfig(that.config, attr);
            },
            anchor: this.config.popupAnchor || [0, -15],
          };
        }

        if (this.config.tooltip) {
          entity.tooltip = {
            html: function (entity) {
              var attr = entity.attribute.attr;
              attr.draw_type = entity.attribute.type;
              attr.draw_typename = entity.attribute.name;
              return that.viewer.mars.popup.getPopupConfig(
                {
                  popup: that.config.tooltip,
                },
                attr
              );
            },
            anchor: this.config.tooltipAnchor || [0, -15],
          };
        }

        if (this.config.click) {
          entity.click = this.config.click;
        }
      }
    },
  });

  /*
   * @Description: 百度地图
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-09 13:32:28
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-10 10:37:38
   */
  var height = 33746824;
  var width = 33554054;

  function BaiduImageryProvider(option) {
    var url;
    switch (option.layer) {
      case "vec":
      default:
        url =
          "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=" +
          (option.bigfont ? "ph" : "pl") +
          "&scaler=1&p=1";
        break;
      case "img_d":
        url =
          "http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46";
        break;
      case "img_z":
        url =
          "http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=" +
          (option.bigfont ? "sh" : "sl") +
          "&v=020";
        break;

      case "custom":
        //Custom 各种自定义样式
        //可选值：dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
        option.customid = option.customid || "midnight";
        url =
          "http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=" +
          option.customid;
        break;

      case "time":
        //实时路况
        var time = new Date().getTime();
        url =
          "http://its.map.baidu.com:8002/traffic/TrafficTileService?x={x}&y={y}&level={z}&time=" +
          time +
          "&label=web2D&v=017";
        break;
    }
    this._url = url;

    this._tileWidth = 256;
    this._tileHeight = 256;
    this._maximumLevel = 18;

    var rectangleSouthwestInMeters = new Cesium$1__default.Cartesian2(-width, -height);
    var rectangleNortheastInMeters = new Cesium$1__default.Cartesian2(width, height);
    this._tilingScheme = new Cesium$1__default.WebMercatorTilingScheme({
      rectangleSouthwestInMeters: rectangleSouthwestInMeters,
      rectangleNortheastInMeters: rectangleNortheastInMeters,
    });

    this._credit = undefined;
    this._rectangle = this._tilingScheme.rectangle;
    this._ready = true;
  }
  Cesium$1__default.defineProperties(BaiduImageryProvider.prototype, {
    url: {
      get: function get() {
        return this._url;
      },
    },

    token: {
      get: function get() {
        return this._token;
      },
    },

    proxy: {
      get: function get() {
        return this._proxy;
      },
    },

    tileWidth: {
      get: function get() {
        //>>includeStart('debug', pragmas.debug);
        if (!this._ready) {
          throw new Cesium$1.DeveloperError(
            "tileWidth must not be called before the imagery provider is ready."
          );
        }
        //>>includeEnd('debug');

        return this._tileWidth;
      },
    },

    tileHeight: {
      get: function get() {
        //>>includeStart('debug', pragmas.debug);
        if (!this._ready) {
          throw new Cesium$1.DeveloperError(
            "tileHeight must not be called before the imagery provider is ready."
          );
        }
        //>>includeEnd('debug');

        return this._tileHeight;
      },
    },

    maximumLevel: {
      get: function get() {
        //>>includeStart('debug', pragmas.debug);
        if (!this._ready) {
          throw new Cesium$1.DeveloperError(
            "maximumLevel must not be called before the imagery provider is ready."
          );
        }
        //>>includeEnd('debug');

        return this._maximumLevel;
      },
    },

    minimumLevel: {
      get: function get() {
        //>>includeStart('debug', pragmas.debug);
        if (!this._ready) {
          throw new Cesium$1.DeveloperError(
            "minimumLevel must not be called before the imagery provider is ready."
          );
        }
        //>>includeEnd('debug');

        return 0;
      },
    },

    tilingScheme: {
      get: function get() {
        //>>includeStart('debug', pragmas.debug);
        if (!this._ready) {
          throw new Cesium$1.DeveloperError(
            "tilingScheme must not be called before the imagery provider is ready."
          );
        }
        //>>includeEnd('debug');

        return this._tilingScheme;
      },
    },

    rectangle: {
      get: function get() {
        //>>includeStart('debug', pragmas.debug);
        if (!this._ready) {
          throw new Cesium$1.DeveloperError(
            "rectangle must not be called before the imagery provider is ready."
          );
        }
        //>>includeEnd('debug');

        return this._rectangle;
      },
    },

    tileDiscardPolicy: {
      get: function get() {
        //>>includeStart('debug', pragmas.debug);
        if (!this._ready) {
          throw new Cesium$1.DeveloperError(
            "tileDiscardPolicy must not be called before the imagery provider is ready."
          );
        }
        //>>includeEnd('debug');

        return this._tileDiscardPolicy;
      },
    },

    errorEvent: {
      get: function get() {
        return this._errorEvent;
      },
    },

    ready: {
      get: function get() {
        return this._ready;
      },
    },

    readyPromise: {
      get: function get() {
        return this._readyPromise.promise;
      },
    },

    credit: {
      get: function get() {
        return this._credit;
      },
    },

    usingPrecachedTiles: {
      get: function get() {
        return this._useTiles;
      },
    },

    hasAlphaChannel: {
      get: function get() {
        return true;
      },
    },

    layers: {
      get: function get() {
        return this._layers;
      },
    },
  });

  BaiduImageryProvider.prototype.getTileCredits = function (x, y, level) {
    return undefined;
  };

  BaiduImageryProvider.prototype.requestImage = function (x, y, level) {
    if (!this._ready) {
      throw new Cesium$1.DeveloperError(
        "requestImage must not be called before the imagery provider is ready."
      );
    }

    var tileW = this._tilingScheme.getNumberOfXTilesAtLevel(level);
    var tileH = this._tilingScheme.getNumberOfYTilesAtLevel(level);

    var url = this._url
      .replace("{x}", x - tileW / 2)
      .replace("{y}", tileH / 2 - y - 1)
      .replace("{z}", level)
      .replace("{s}", Math.floor(Math.random() * 10));

    return Cesium$1__default.ImageryProvider.loadImage(this, url);
  };

  /*
   * @Description: 百度影像
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-09 13:46:08
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-09 13:47:26
   */

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 14:23:35
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:09:15
   */
  // import _FeatureGridImageryProvider from "./FeatureGridImageryProvider.js";//暂时没有

  function getOneKey(arr) {
    var n = Math.floor(Math.random() * arr.length + 1) - 1;
    return arr[n];
  }

  //创建图层
  function createLayer(item, viewer, serverURL, layerToMap) {
    var layer;

    if (item.url) {
      if (serverURL) {
        item.url = item.url.replace("$serverURL$", serverURL);
      }
      item.url = item.url
        .replace("$hostname$", location.hostname)
        .replace("$host$", location.host);
    }

    switch (item.type) {
      //===============地图数组====================
      case "group":
        //示例：{ "name": "电子地图", "type": "group","layers": [    ]}
        if (item.layers && item.layers.length > 0) {
          var arrVec = [];
          for (var index = 0; index < item.layers.length; index++) {
            var temp = createLayer(
              item.layers[index],
              viewer,
              serverURL,
              layerToMap
            );
            if (temp == null) continue;
            arrVec.push(temp);
          }
          item._layers = arrVec;
          layer = new GroupLayer(item, viewer);
        }
        break;
      case "www_bing": //bing地图
      case "www_osm": //OSM开源地图
      case "www_google": //谷歌国内
      case "www_gaode": //高德
      case "www_baidu": //百度
      case "www_tdt": //天地图
      case "arcgis_cache":
      case "arcgis":
      case "arcgis_tile":
      case "arcgis_dynamic":
      case "wmts":
      case "tms":
      case "wms":
      case "xyz":
      case "tile":
      case "single":
      case "image":
      case "gee":
      case "custom_tilecoord": //瓦片信息
      case "custom_grid":
        //网格线
        //瓦片图层
        layer = new TileLayer(item, viewer);
        layer.isTile = true;
        break;
      case "www_poi":
        //在线poi数据
        layer = new POILayer(item, viewer);
        break;
      case "custom_featuregrid":
        //自定义矢量网格图层
        layer = new CustomFeatureGridLayer(item, viewer);
        break;
      case "custom_graticule":
        layer = new GraticuleLayer(item, viewer);
        break;

      case "3dtiles":
        layer = new Tiles3dLayer(item, viewer);
        break;
      case "gltf":
        layer = new GltfLayer(item, viewer);
        break;
      case "arcgis_feature":
        //分网格加载
        layer = new ArcFeatureLayer(item, viewer);
        break;
      case "arcgis_feature2":
        //一次加载，不分网格
        layer = new ArcFeatureLayer(item, viewer);
        break;
      case "geojson":
        layer = new GeoJsonLayer(item, viewer);
        break;
      case "geojson-draw":
        //基于框架内部draw绘制保存的geojson数据的加载
        layer = new DrawLayer(item, viewer);
        break;
      case "kml":
        layer = new KmlLayer(item, viewer);
        break;
      case "czml":
        layer = new CzmlLayer(item, viewer);
        break;
      case "terrain":
        layer = new TerrainLayer(item, viewer);
        break;

      default:
        break;
    }

    if (layerToMap) {
      var _temp = layerToMap(item, viewer, layer);
      if (_temp) layer = _temp;
    }

    if (layer == null) {
      if (item.type != "group")
        console.log("配置中的图层未处理：" + JSON.stringify(item));
    } else {
      //这句话，vue或部分架构中要注释，会造成内存溢出。
      item._layer = layer;
    }

    return layer;
  }

  //创建地图底图
  function createImageryProvider(item, serverURL) {
    if (item.url) {
      if (serverURL) {
        item.url = item.url.replace("$serverURL$", serverURL);
      }
      item.url = item.url
        .replace("$hostname$", location.hostname)
        .replace("$host$", location.host);
    }

    var opts = {};
    for (var key in item) {
      var value = item[key];
      if (value == null) continue;

      switch (key) {
        default:
          //直接赋值
          opts[key] = value;
          break;
        case "crs":
          if (value == "4326" || value.toUpperCase() == "EPSG4326")
            opts.tilingScheme = new Cesium$1__default.GeographicTilingScheme({
              numberOfLevelZeroTilesX: item.numberOfLevelZeroTilesX || 2,
              numberOfLevelZeroTilesY: item.numberOfLevelZeroTilesY || 1,
            });
          else
            opts.tilingScheme = new Cesium$1__default.WebMercatorTilingScheme({
              numberOfLevelZeroTilesX: item.numberOfLevelZeroTilesX || 1,
              numberOfLevelZeroTilesY: item.numberOfLevelZeroTilesY || 1,
            });
          break;
        case "proxy":
          opts.proxy = new Cesium$1__default.DefaultProxy(value);
          break;
        case "rectangle":
          opts.rectangle = Cesium$1__default.Rectangle.fromDegrees(
            value.xmin,
            value.ymin,
            value.xmax,
            value.ymax
          );
          break;
      }
    }

    if (opts.proxy) {
      opts.url = new Cesium$1__default.Resource({
        url: opts.url,
        proxy: opts.proxy,
      });
    }

    var layer;
    switch (opts.type_new || opts.type) {
      //===============地图底图====================
      case "single":
      case "image":
        layer = new Cesium$1__default.SingleTileImageryProvider(opts);
        break;
      case "xyz":
      case "tile":
        opts.customTags = {
          "z&1": function z1(imageryProvider, x, y, level) {
            return level + 1;
          },
        };
        layer = new Cesium$1__default.UrlTemplateImageryProvider(opts);
        break;
      case "wms":
        layer = new Cesium$1__default.WebMapServiceImageryProvider(opts);
        break;
      case "tms":
        if (!opts.url)
          opts.url = Cesium$1__default.buildModuleUrl("Assets/Textures/NaturalEarthII");
        layer = new Cesium$1__default.createTileMapServiceImageryProvider(opts);
        break;
      case "wmts":
        layer = new Cesium$1__default.WebMapTileServiceImageryProvider(opts);
        break;
      case "gee":
        //谷歌地球
        layer = new Cesium$1__default.GoogleEarthEnterpriseImageryProvider({
          metadata: new Cesium$1__default.GoogleEarthEnterpriseMetadata(opts),
        });
        break;
      case "arcgis":
      case "arcgis_tile":
      case "arcgis_dynamic":
        layer = new Cesium$1__default.ArcGisMapServerImageryProvider(opts);
        break;
      case "arcgis_cache":
        //layer = new _ArcTileImageryProvider(opts);
        if (!Cesium$1__default.UrlTemplateImageryProvider.prototype.padLeft0) {
          Cesium$1__default.UrlTemplateImageryProvider.prototype.padLeft0 = function (
            numStr,
            n
          ) {
            numStr = String(numStr);
            var len = numStr.length;
            while (len < n) {
              numStr = "0" + numStr;
              len++;
            }
            return numStr;
          };
        }
        opts.customTags = {
          //小写
          arc_x: function arc_x(imageryProvider, x, y, level) {
            return imageryProvider.padLeft0(x.toString(16), 8);
          },
          arc_y: function arc_y(imageryProvider, x, y, level) {
            return imageryProvider.padLeft0(y.toString(16), 8);
          },
          arc_z: function arc_z(imageryProvider, x, y, level) {
            return imageryProvider.padLeft0(level.toString(), 2);
          },
          //大写
          arc_X: function arc_X(imageryProvider, x, y, level) {
            return imageryProvider.padLeft0(x.toString(16), 8).toUpperCase();
          },
          arc_Y: function arc_Y(imageryProvider, x, y, level) {
            return imageryProvider.padLeft0(y.toString(16), 8).toUpperCase();
          },
          arc_Z: function arc_Z(imageryProvider, x, y, level) {
            return imageryProvider.padLeft0(level.toString(), 2).toUpperCase();
          },
        };
        layer = new Cesium$1__default.UrlTemplateImageryProvider(opts);
        break;

      //===============互联网常用地图====================

      case "www_tdt":
        //天地图
        var _layer;
        switch (opts.layer) {
          default:
          case "vec_d":
            _layer = "vec";
            break;
          case "vec_z":
            _layer = "cva";
            break;
          case "img_d":
            _layer = "img";
            break;
          case "img_z":
            _layer = "cia";
            break;
          case "ter_d":
            _layer = "ter";
            break;
          case "ter_z":
            _layer = "cta";
            break;
        }

        var _key;
        if (opts.key == null || opts.key.length == 0)
          _key = "87949882c75775b5069a0076357b7530";
        //默认
        else _key = getOneKey(opts.key);

        var maxLevel = 18;
        if (item.crs == "4326") {
          //wgs84
          var matrixIds = new Array(maxLevel);
          for (var z = 0; z <= maxLevel; z++) {
            matrixIds[z] = (z + 1).toString();
          }
          var _url =
            "http://t{s}.tianditu.gov.cn/" +
            _layer +
            "_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=" +
            _layer +
            "&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=" +
            _key;

          layer = new Cesium$1__default.WebMapTileServiceImageryProvider({
            url: opts.proxy
              ? new Cesium$1__default.Resource({
                  url: _url,
                  proxy: opts.proxy,
                })
              : _url,
            layer: _layer,
            style: "default",
            format: "tiles",
            tileMatrixSetID: "c",
            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
            tileMatrixLabels: matrixIds,
            tilingScheme: new Cesium$1__default.GeographicTilingScheme(), //WebMercatorTilingScheme、GeographicTilingScheme
            maximumLevel: maxLevel,
          });
        } else {
          //墨卡托
          var matrixIds = new Array(maxLevel);
          for (var z = 0; z <= maxLevel; z++) {
            matrixIds[z] = z.toString();
          }
          var _url =
            "http://t{s}.tianditu.gov.cn/" +
            _layer +
            "_w/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=" +
            _layer +
            "&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=" +
            _key;

          layer = new Cesium$1__default.WebMapTileServiceImageryProvider({
            url: opts.proxy
              ? new Cesium$1__default.Resource({
                  url: _url.replace("{s}", "0"),
                  proxy: opts.proxy,
                })
              : _url,
            layer: _layer,
            style: "default",
            format: "tiles",
            tileMatrixSetID: "w",
            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
            tileMatrixLabels: matrixIds,
            tilingScheme: new Cesium$1__default.WebMercatorTilingScheme(),
            maximumLevel: maxLevel,
          });
        }
        break;
      case "www_gaode":
        //高德
        var _url;
        switch (opts.layer) {
          case "vec":
          default:
            //style=7是立体的，style=8是灰色平面的
            _url =
              "http://" +
              (opts.bigfont ? "wprd" : "webrd") +
              "0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}";
            break;
          case "img_d":
            _url =
              "http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
            break;
          case "img_z":
            _url =
              "http://webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8";
            break;
          case "time":
            var time = new Date().getTime();
            _url =
              "http://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t=" +
              time;
            break;
        }

        layer = new Cesium$1__default.UrlTemplateImageryProvider({
          url: opts.proxy
            ? new Cesium$1__default.Resource({
                url: _url,
                proxy: opts.proxy,
              })
            : _url,
          subdomains: ["1", "2", "3", "4"],
          maximumLevel: 18,
        });
        break;
      case "www_baidu":
        //百度
        layer = new _BaiduImageryProvider.BaiduImageryProvider(opts);
        break;
      case "www_google":
        //谷歌国内
        var _url;

        if (item.crs == "4326" || item.crs == "wgs84") {
          //wgs84   无偏移
          switch (opts.layer) {
            default:
            case "img_d":
              _url = "http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}";
              break;
          }
        } else {
          //有偏移
          switch (opts.layer) {
            case "vec":
            default:
              _url =
                "http://mt{s}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile";
              break;
            case "img_d":
              _url =
                "http://mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali";
              break;
            case "img_z":
              _url =
                "http://mt{s}.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil";
              break;
            case "ter":
              _url =
                "http://mt{s}.google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galile";
              break;
          }
        }

        layer = new Cesium$1__default.UrlTemplateImageryProvider({
          url: opts.proxy
            ? new Cesium$1__default.Resource({
                url: _url,
                proxy: opts.proxy,
              })
            : _url,
          subdomains: ["1", "2", "3"],
          maximumLevel: 20,
        });
        break;

      case "www_osm":
        //OSM开源地图
        var _url = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        layer = new Cesium$1__default.UrlTemplateImageryProvider({
          url: opts.proxy
            ? new Cesium$1__default.Resource({
                url: _url,
                proxy: opts.proxy,
              })
            : _url,
          subdomains: "abc",
          maximumLevel: 18,
        });
        break;
      case "www_bing":
        //bing地图

        var _url = "https://dev.virtualearth.net";
        //无标记影像 Aerial,
        //有英文标记影像   AerialWithLabels,
        //矢量道路  Road
        //OrdnanceSurvey,
        //CollinsBart
        var style = opts.layer || Cesium$1__default.BingMapsStyle.Aerial;
        layer = new Cesium$1__default.BingMapsImageryProvider({
          url: opts.proxy
            ? new Cesium$1__default.Resource({
                url: _url,
                proxy: opts.proxy,
              })
            : _url,
          key:
            opts.key ||
            "AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc",
          mapStyle: style,
        });
        break;

      //===============内部定义的图层====================
      case "custom_grid":
        //网格线
        layer = new Cesium$1__default.GridImageryProvider();
        break;
      case "custom_tilecoord":
        //瓦片信息
        layer = new Cesium$1__default.TileCoordinatesImageryProvider();
        break;
      case "custom_featuregrid":
        //自定义矢量网格图层
        layer = new FeatureGridImageryProvider(opts);
        break;
      default:
        console.log("config配置图层未处理:" + item);
        break;
    }
    layer.config = opts;

    return layer;
  }

  var Layer = ({
    createLayer: createLayer,
    createImageryProvider: createImageryProvider
  });

  /*
   * @Description: 瓦片底图图层
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-15 14:22:35
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:12:15
   */

  var TileLayer = BaseLayer.extend({
    layer: null,

    // 添加
    add: function () {
      if (this.layer != null) {
        this.remove();
      }
      this.addEx();
      var imageryProvider = createImageryProvider(this.config);
      if (imageryProvider == null) {
        return;
      }

      var options = this.config;

      var imageryOpt = {
        show: true,
        alpha: this._opacity,
      };

      if (
        options.rectangle &&
        options.rectangle.xmin &&
        options.rectangle.xmax &&
        options.rectangle.ymin &&
        options.rectangle.ymax
      ) {
        var xmin = options.rectangle.xmin;
        var xmax = options.rectangle.xmax;
        var ymin = options.rectangle.ymin;
        var ymax = options.rectangle.ymax;
        var rectangle = Cesium$1__default.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
        this.rectangle = rectangle;
        imageryOpt.rectangle = rectangle;
      }
      if (options.brightness) imageryOpt.brightness = options.brightness;
      if (options.contrast) imageryOpt.contrast = options.contrast;
      if (options.hue) imageryOpt.hue = options.hue;
      if (options.saturation) imageryOpt.saturation = options.saturation;
      if (options.gamma) imageryOpt.gamma = options.gamma;
      if (options.maximumAnisotropy)
        imageryOpt.maximumAnisotropy = options.maximumAnisotropy;
      if (options.minimumTerrainLevel)
        imageryOpt.minimumTerrainLevel = options.minimumTerrainLevel;
      if (options.maximumTerrainLevel)
        imageryOpt.maximumTerrainLevel = options.maximumTerrainLevel;

      this.layer = new Cesium$1__default.ImageryLayer(imageryProvider, imageryOpt);
      this.layer.config = this.config;

      this.viewer.imageryLayers.add(this.layer);

      this.setZIndex(this.config.order);
    },

    addEx: function () {
      // 子类使用
    },
    // 移除
    remove: function () {
      if (this.layer == null) {
        return;
      }
      this.removeEx();
      this.viewer.imageryLayers.remove(this.layer, true);
      this.layer = null;
    },

    removeEx: function () {
      // 子类使用
    },

    // 定位至数据区域
    centerAt: function (duration) {
      if (this.layer == null) return;

      if (this.config.extent || this.config.center) {
        this.viewer.mars.centerAt(this.config.extent || this.config.center, {
          duration: duration,
          isWgs84: true,
        });
      } else if (this.rectangle) {
        this.viewer.camera.flyTo({
          destination: this.rectangle,
          duration: duration,
        });
      } else {
        var rectangle = this.layer.imageryProvider.rectangle; //arcgis图层等，读取配置信息
        if (
          rectangle &&
          rectangle != Cesium$1__default.Rectangle.MAX_VALUE &&
          rectangle.west > 0 &&
          rectangle.south > 0 &&
          rectangle.east > 0 &&
          rectangle.north > 0
        ) {
          this.viewer.camera.flyTo({
            destination: rectangle,
            duration: duration,
          });
        }
      }
    },
    // 设置透明度
    hasOpacity: true,
    _opacity: 1,

    setOpacity: function (value) {
      this._opacity = value;
      if (this.layer == null) return;
      this.layer.alpha = value;
    },
    // 设置叠加顺序
    setZIndex: function (order) {
      if (this.layer == null || order == null) return;

      //先移动到最顶层
      this.viewer.imageryLayers.raiseToTop(this.layer);
      var layers = this.viewer.imageryLayers._layers;
      for (var i = layers.length - 1; i >= 0; i--) {
        if (layers[i] == this.layer) continue;
        var _temp = layers[i].config;
        if (_temp && _temp.order) {
          if (order < _temp.order) {
            this.viewer.imageryLayers.lower(this.layer);
          }
        }
      }
    },
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-20 15:48:16
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-08 11:08:01
   */
  var FeatureGridLayer = TileLayer.extend({
    dataSource: null,
    hasOpacity: false,
    create: function () {
      this.dataSource = new Cesium$1__default.CustomDataSource(); // 用于entity
      this.primitives = new Cesium$1__default.PrimitiveCollection(); // 用于primitive
      var that = this;
      this.config.type_new = "custom_featuregrid";
      this.config.addImageryCache = function (opts) {
        return that._addImageryCache(opts);
      };
      this.config.removeImageryCache = function (opts) {
        return that._removeImageryCache(opts);
      };
      this.config.removeAllImageryCache = function (opts) {
        return that._removeAllImageryCache(opts);
      };
    },

    getLength: function () {
      return this.primitives.length + this.dataSource.entities.values.length;
    },

    addEx: function () {
      this.viewer.dataSources.add(this.dataSource);
      this.viewer.scene.primitives.add(this.primitives);
    },

    removeEx: function () {
      this.viewer.dataSources.remove(this.dataSource);
      this.viewer.scene.primitives.remove(this.primitives);
    },

    _addImageryCache: function (opts) {},

    _removeImageryCache: function (opts) {},

    _removeAllImageryCache: function (opts) {},
  });

  /*
   * @Description: 分块加载图层基类
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-20 16:54:59
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:51:05
   */
  var CustomFeatureGridLayer = FeatureGridLayer.extend({
    _cacheGrid: {}, // 网络缓存，存放矢量对象id集合
    _cacheFeature: {}, // 矢量对象缓存，存放矢量对象和其所对应的网格集合
    _addImageryCache: function (opts) {
      this._cacheGrid[opts.key] = {
        opts: opts,
        isLoading: true,
      };

      let that = this;
      this.getDataForGrid(opts, (arrData) => {
        if (that._visible) that._showData(opts, arrData);
      });
    },

    getDataForGrid: function (opts, callback) {
      // 子类可继承，callback为回调方法, callback参数传数据数组
      // 直接使用本类，传参方式
      if (this.config.getDataForGrid) {
        this.config.getDataForGrid(opts, callback);
      }
    },

    checkHasBreak: function (cacheKey) {
      if (!this._visible || !this._cacheGrid[cacheKey]) {
        return true;
      }
      return false;
    },

    _showData: function (opts, arrdata) {
      var cacheKey = opts.key;
      if (this.checkHasBreak[cacheKey]) {
        return; //异步请求结束时,如果已经卸载了网格就直接跳出。
      }

      var that = this;

      var arrIds = [];
      for (var i = 0, len = arrdata.length; i < len; i++) {
        var attributes = arrdata[i];
        var id = attributes[this.config.IdName || "id"];

        var layer = this._cacheFeature[id];
        if (layer) {
          //已存在
          layer.grid.push(cacheKey);
          this.updateEntity(layer.entity, attributes);
        } else {
          var entity = this.createEntity(opts, attributes, function (entity) {
            if (that.config.debuggerTileInfo) {
              //测试用
              entity._temp_id = id;
              entity.popup = function (entity) {
                return JSON.stringify(that._cacheFeature[entity._temp_id].grid);
              };
            }
            that._cacheFeature[id] = {
              grid: [cacheKey],
              entity: entity,
            };
          });
          if (entity != null) {
            if (that.config.debuggerTileInfo) {
              //测试用
              entity._temp_id = id;
              entity.popup = function (entity) {
                return JSON.stringify(that._cacheFeature[entity._temp_id].grid);
              };
            }
            that._cacheFeature[id] = {
              grid: [cacheKey],
              entity: entity,
            };
          }
        }
        arrIds.push(id);
      }

      this._cacheGrid[cacheKey] = this._cacheGrid[cacheKey] || {};
      this._cacheGrid[cacheKey].ids = arrIds;
      this._cacheGrid[cacheKey].isLoading = false;
    },

    createEntity: function (opts, attributes, callback) {
      //子类可以继承,根据数据创造entity

      //直接使用本类,传参方式
      if (this.config.createEntity) {
        return this.config.createEntity(opts, attributes, callback);
      }
      return null;
    },

    updateEntity: function (entity, attributes) {
      //子类可以继承,更新entity（动态数据时有用）
      //直接使用本类,传参方式
      if (this.config.updateEntity) {
        this.config.updateEntity(entity, attributes);
      }
    },

    removeEntity: function (entity) {
      //子类可以继承,移除entity
      //直接使用本类,传参方式
      if (this.config.removeEntity) {
        this.config.removeEntity(entity);
      } else {
        this.dataSource.entities.remove(entity);
      }
    },

    _removeImageryCache: function (opts) {
      var cacheKey = opts.key;
      var layers = this._cacheGrid[cacheKey];
      if (layers) {
        if (layers.ids) {
          for (var i = 0; i < layers.ids.length; i++) {
            var id = layers.ids[i];
            var layer = this._cacheFeature[id];
            if (layer) {
              layer.grid.remove(cacheKey);
              if (layer.grid.length == 0) {
                delete this._cacheFeature[id];
                this.removeEntity(layer.entity);
              }
            }
          }
        }
        delete this._cacheGrid[cacheKey];
      }
    },

    _removeAllImageryCache: function () {
      if (this.config.removeAllEntity) {
        this.config.removeAllEntity();
      } else {
        this.dataSource.entities.removeAll();
        this.primitives.removeAll();
      }

      this._cacheFeature = {};
      this._cacheGrid = {};
    },

    removeEx: function () {
      if (this.config.removeAllEntity) {
        this.config.removeAllEntity();
      } else {
        this.dataSource.entities.removeAll();
        this.primitives.removeAll();
      }

      this._cacheFeature = {};
      this._cacheGrid = {};

      this.viewer.dataSources.remove(this.dataSource);
      this.viewer.scene.primitives.remove(this.primitives);
    },

    // 重新加载数据
    reload: function () {
      var that = this;
      for (var i in this._cacheGrid) {
        var item = this._cacheGrid[i];
        if (item == null || item.opts == null || item.isLoading) continue;

        var opts = item.opts;
        this.getDataForGrid(opts, function (arrData) {
          that._showData(opts, arrData);
        });
      }
    },
    // 设置透明度
    hasOpacity: true,
    _opacity: 1,
    setOpacity: function (value) {
      this._opacity = value;

      for (var i in this._cacheFeature) {
        var entity = this._cacheFeature[i].entity;

        if (
          entity.polygon &&
          entity.polygon.material &&
          entity.polygon.material.color
        ) {
          this._updateEntityAlpha(entity.polygon.material.color, this._opacity);
          if (entity.polygon.outlineColor) {
            this._updateEntityAlpha(entity.polygon.outlineColor, this._opacity);
          }
        } else if (
          entity.polyline &&
          entity.polyline.material &&
          entity.polyline.material.color
        ) {
          this._updateEntityAlpha(entity.polyline.material.color, this._opacity);
        } else if (entity.billboard) {
          entity.billboard.color = new _Cesium2.default.Color.fromCssColorString(
            "#FFFFFF"
          ).withAlpha(this._opacity);

          if (entity.label) {
            if (entity.label.fillColor)
              this._updateEntityAlpha(entity.label.fillColor, this._opacity);
            if (entity.label.outlineColor)
              this._updateEntityAlpha(entity.label.outlineColor, this._opacity);
            if (entity.label.backgroundColor)
              this._updateEntityAlpha(
                entity.label.backgroundColor,
                this._opacity
              );
          }
        }
      }
    },
    _updateEntityAlpha: function (color, opacity) {
      var newColor = color.getValue().withAlpha(opacity);
      color.setValue(newColor);
    },
    colorHash: {},
    setDefSymbol: function (entity) {
      if (entity.polygon) {
        var name = entity.properties.OBJECTID;
        var color = this.colorHash[name];
        if (!color) {
          color = Cesium$1__default.Color.fromRandom({
            minimumGreen: 0.75,
            maximumBlue: 0.75,
            alpha: this._opacity,
          });
          this.colorHash[name] = color;
        }
        entity.polygon.material = color;
        entity.polygon.outline = true;
        entity.polygon.outlineColor = Cesium$1__default.Color.WHITE;
      } else if (entity.polyline) {
        var name = entity.properties.OBJECTID;
        var color = this.colorHash[name];
        if (!color) {
          color = Cesium$1__default.Color.fromRandom({
            minimumGreen: 0.75,
            maximumBlue: 0.75,
            alpha: this._opacity,
          });
          this.colorHash[name] = color;
        }
        entity.polyline.material = color;
        entity.polyline.width = 2;
      } else if (entity.billboard) {
        entity.billboard.scale = 0.5;
        entity.billboard.horizontalOrigin = Cesium$1__default.HorizontalOrigin.CENTER;
        entity.billboard.verticalOrigin = Cesium$1__default.VerticalOrigin.BOTTOM;
      }
    },

    // 外部配置的symbol
    setConfigSymbol: function (entity, symbol) {
      if (entity.polygon) {
        var name = entity.properties.OBJECTID;
        var color = this.colorHash[name];
        if (!color) {
          color = Cesium$1__default.Color.fromRandom({
            minimumGreen: 0.75,
            maximumBlue: 0.75,
            alpha: this._opacity,
          });
          this.colorHash[name] = color;
        }
        entity.polygon.material = color;
        entity.polygon.outline = true;
        entity.polygon.outlineColor = Cesium$1__default.Color.WHITE;
      } else if (entity.polyline) {
        var name = entity.properties.OBJECTID;
        var color = this.colorHash[name];
        if (!color) {
          color = Cesium$1__default.Color.fromRandom({
            minimumGreen: 0.75,
            maximumBlue: 0.75,
            alpha: this._opacity,
          });
          this.colorHash[name] = color;
        }
        entity.polyline.material = color;
        entity.polyline.width = 2;
      } else if (entity.billboard) {
        entity.billboard.scale = 0.5;
        entity.billboard.horizontalOrigin = Cesium$1__default.HorizontalOrigin.CENTER;
        entity.billboard.verticalOrigin = Cesium$1__default.VerticalOrigin.BOTTOM;
      }
    },
    //外部配置的symbol
    setConfigSymbol: function (entity, symbol) {
      var attr = entity.properties;
      var styleOpt = symbol.styleOptions;

      if (symbol.styleField) {
        //存在多个symbol,按styleField进行分类
        var styleFieldVal = attr[symbol.styleField];
        var styleOptField = symbol.styleFieldOptions[styleFieldVal];
        if (styleOptField != null) {
          styleOpt = clone(styleOpt);
          styleOpt = $$1.extend(styleOpt, styleOptField);
        }
      }
      styleOpt = styleOpt || {};

      this._opacity = styleOpt.opacity || 1; //透明度

      if (entity.polygon) {
        style2Entity$6(styleOpt, entity.polygon);
        //加上线宽
        if (styleOpt.outlineWidth && styleOpt.outlineWidth > 1) {
          entity.polygon.outline = false;

          var newopt = {
            color: styleOpt.outlineColor,
            width: styleOpt.outlineWidth,
            opacity: styleOpt.outlineOpacity,
            lineType: "solid",
            outline: false,
          };
          var polyline = style2Entity$7(newopt);
          polyline.positions = entity.polygon.hierarchy._value.positions;
          this.dataSource.entities.add({
            polyline: polyline,
          });
        }

        //是建筑物时
        if (this.config.buildings) {
          var floor = Number(attr[this.config.buildings.cloumn] || 1); //层数
          var height = Number(this.config.buildings.height || 5); //层高

          entity.polygon.extrudedHeight = floor * height;
        }
      } else if (entity.polyline) {
        style2Entity$7(styleOpt, entity.polyline);
      } else if (entity.billboard) {
        entity.billboard.heightReference =
          Cesium$1__default.HeightReference.RELATIVE_TO_GROUND;
        style2Entity(styleOpt, entity.billboard);

        //加上文字标签
        if (styleOpt.label && styleOpt.label.field) {
          styleOpt.label.heightReference =
            Cesium$1__default.HeightReference.RELATIVE_TO_GROUND;

          entity.label = style2Entity$3(styleOpt.label);
          entity.label.text = attr[styleOpt.label.field];
        }
      }
    },
  });

  /*
   * @Description: ArcGIS矢量服务分块加载图层
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-20 16:53:37
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-10 10:14:08
   */
  var ArcFeatureGridLayer = CustomFeatureGridLayer.extend({
    // 获取网格内的数据，callback为回调方法，参数传数据数组
    getDataForGrid: function (opts, callback) {
      let that = this;
      let url = this.config.url;
      if (this.config.layers && this.config.layers.length > 0) {
        url += "/" + this.config.layers[0];
      }

      let query = leaflet.esri.query({
        url: url,
      });

      // 网格
      let bounds = L.latLngBounds(
        L.latLng(opts.rectangle.ymin, opts.rectangle.xmin),
        L.latLng(opts.rectangle.ymax, opts.rectangle.xmax)
      );

      query.within(bounds);

      if (this.config.where) {
        query.where(this.config.where);
      }

      query.run((error, featureCollection, response) => {
        if (!that._visible || !that._cacheGrid[opts.key]) {
          return; // 异步请求结束时，如果已经卸载了网格，就直接退出
        }

        if (error != null && error.code > 0) {
          console.log("arcgis服务访问出错" + error.message);
          return;
        }

        if (featureCollection == undefined || featureCollection == null) {
          return; // 数据为空
        }

        if (featureCollection.type == "Feature") {
          featureCollection = {
            type: "FeatureCollection",
            features: [featureCollection],
          };

          callback(featureCollection.features);
        }
      });
    },

    // 根据数据创造entity
    createEntity: function (opts, item, callback) {
      let that = this;
      let dataSource = Cesium$1__default.GeoJsonDataSource.load(item, {
        clampToGround: true,
      });

      dataSource
        .then((dataSource) => {
          if (that.checkHasBreak[opts.key]) {
            return; // 异步请求结束时，如果已经卸载了网格就直接跳出。
          }

          if (dataSource.entities.values.length == 0) {
            return null;
          }

          let entity = dataSource.entities.values[0];
          entity._id = that.config.id + "_" + opts.key + "_" + entity.id;

          that._addEntity(entity, callback);
        })
        .otherwise((error) => {
          that.showError("服务出错", error);
        });

      return null;
    },

    _addEntity: function (entity, callback) {
      let that = this;
      // 样式
      let symbol = this.config.symbol;
      if (typeof symbol === "function") {
        symbol(entity, entity.properties); // 回调方法
      } else if (symbol == "default") {
        this.setDefSymbol(entity);
      } else {
        this.setConfigSymbol(entity, symbol);
      }

      // popup弹窗
      if (this.config.columns || this.config.popup) {
        entity.popup = {
          html: function (entity) {
            return that.viewer.mars.popup.getPopupForConfig(
              that.config,
              entity.properties
            );
          },
          anchor: this.config.popupAnchor || [0, -15],
        };
      }

      if (this.config.tooltip) {
        entity.tooltip = {
          html: function (entity) {
            return that.viewer.mars.popup.getPopupForConfig(
              {
                popup: that.config.tooltip,
              },
              entity.properties
            );
          },
          anchor: this.config.tooltipAnchor || [0, -15],
        };
      }

      this.dataSource.entities.add(entity);
      callback(entity);
    },
  });

  /*
   * @Description: 图层类
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-09 10:39:53
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:08:22
   */

  /*
   * @Description: widget模块公共处理类，勿轻易修改
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-20 10:36:52
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-10 10:38:45
   */
  var basePath = ""; //widgets目录统一前缀，如果widgets目录不在当前页面的同级目录，在其他处时可以传入basePath参数，参数值为：widgets目录相对于当前页面的路径
  var defoptions;
  var cacheVersion;
  var isdebuger;

  var thismap;
  var widgetsdata = [];

  //初始化插件
  function init(map, widgetcfg, _basePath) {
    thismap = map;
    widgetcfg = widgetcfg || {};
    basePath = _basePath || "";

    widgetsdata = [];
    defoptions = widgetcfg.defaultOptions || {
      windowOptions: {
        position: "rt",
        maxmin: false,
        resize: true,
      },
      autoDisable: true,
      disableOhter: true,
    };

    cacheVersion = widgetcfg.version;
    if (cacheVersion == "time") cacheVersion = new Date().getTime();

    //将自启动的加入
    var arrtemp = widgetcfg.widgetsAtStart;
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
        widgetsdata.push(item);
      }
    }

    //显示测试栏
    //为了方便测试，所有widget会在页面下侧生成一排按钮，每个按钮对应一个widget，单击后激活对应widget
    isdebuger = widgetcfg["debugger"];
    if (isdebuger) {
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
    arrtemp = widgetcfg.widgets;
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
            widgetsdata.push(childItem); //将配置的加入
          }
          inhtml += "</ul></div>";

          if (isdebuger && !item._nodebug) {
            $("#widget-testbar").append(inhtml);
          }
        } else {
          if (!item.hasOwnProperty("uri") || item.uri == "") {
            console.log("widget未配置uri：" + JSON.stringify(item));
            continue;
          }

          //显示测试栏
          if (isdebuger && !item._nodebug) {
            var inhtml =
              '<button type="button" class="btn btn-primary widget-btn" data-widget="' +
              item.uri +
              '"  > <i class="fa fa-globe"></i>' +
              item.name +
              " </button>";
            $("#widget-testbar").append(inhtml);
          }

          bindDefOptions(item);
          widgetsdata.push(item); //将配置的加入
        }
      }

      if (isdebuger) {
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

    for (var i = 0; i < widgetsdata.length; i++) {
      var item = widgetsdata[i];

      if (item.openAtStart || item.createAtStart) {
        _arrLoadWidget.push(item);
      }
    }

    $(window).resize(function () {
      for (var i = 0; i < widgetsdata.length; i++) {
        var item = widgetsdata[i];
        if (item._class) {
          item._class.indexResize(); //BaseWidget: indexResize
        }
      }
    });

    loadWidgetJs();
  }

  function getDefWindowOptions() {
    return clone$1(defoptions.windowOptions);
  }

  function clone$1(from, to) {
    if (
      from == null ||
      (typeof from === "undefined" ? "undefined" : _typeof(from)) != "object"
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
        typeof to[name] == "undefined" ? clone$1(from[name], null) : to[name];
    }

    return to;
  }

  function bindDefOptions(item) {
    //赋默认值至options（跳过已存在设置值）
    if (defoptions) {
      for (var aa in defoptions) {
        if (aa == "windowOptions") ; else if (!item.hasOwnProperty(aa)) {
          item[aa] = defoptions[aa];
        }
      }
    }

    //赋值内部使用属性
    item.path = getFilePath(basePath + item.uri);
    item.name = item.name || item.label; //兼容name和label命名
  }

  //激活指定模块
  function activate(item, noDisableOther) {
    if (thismap == null && item.viewer) {
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
    for (var i = 0; i < widgetsdata.length; i++) {
      var othitem = widgetsdata[i];
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
      widgetsdata.push(item);
    }

    if (isdebuger) console.log("开始激活widget：" + thisItem.uri);

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

  function getWidget(id) {
    for (var i = 0; i < widgetsdata.length; i++) {
      var item = widgetsdata[i];

      if (id == item.uri || id == item.id) {
        return item;
      }
    }
  }

  function getClass(id) {
    var item = getWidget(id);
    if (item) return item._class;
    else return null;
  }

  function isActivate(id) {
    var _class = getClass(id);
    if (_class == null) return false;
    return _class.isActivate;
  }

  function disable(id) {
    if (id == null) return;
    for (var i = 0; i < widgetsdata.length; i++) {
      var item = widgetsdata[i];

      if (item._class && (id == item.uri || id == item.id)) {
        item._class.disableBase();
        break;
      }
    }
  }

  //释放所有widget
  function disableAll(nodisable, group) {
    for (var i = 0; i < widgetsdata.length; i++) {
      var item = widgetsdata[i];

      if (group && item.group == group) ; else {
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
  function disableGroup(group, nodisable) {
    if (group == null) return;

    for (var i = 0; i < widgetsdata.length; i++) {
      var item = widgetsdata[i];
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

  function eachWidget(calback) {
    for (var i = 0; i < widgetsdata.length; i++) {
      var item = widgetsdata[i];
      calback(item);
    }
  }

  var _arrLoadWidget = [];
  var loadItem$1;
  var isloading;

  function loadWidgetJs() {
    if (_arrLoadWidget.length == 0) return;

    if (isloading) {
      setTimeout(loadWidgetJs, 500);
      return;
    }
    isloading = true;

    loadItem$1 = _arrLoadWidget[0];
    loadItem$1.isloading = true;
    var _uri = loadItem$1.uri;
    if (cacheVersion) {
      if (_uri.indexOf("?") == -1) _uri += "?time=" + cacheVersion;
      else _uri += "&time=" + cacheVersion;
    }

    if (window.NProgress) {
      NProgress.start();
    }

    if (isdebuger) console.log("开始加载js：" + basePath + _uri);

    _loader.Loader.async([basePath + _uri], function () {
      isloading = false;
      loadItem$1.isloading = false;
      if (isdebuger) console.log("完成js加载：" + basePath + _uri);

      if (window.NProgress) {
        NProgress.done(true);
      }

      _arrLoadWidget.shift();
      loadWidgetJs();
    });
  }

  function bindClass(_class) {
    if (loadItem$1 == null) {
      var _jspath = getThisJSPath();
      for (var i = 0; i < widgetsdata.length; i++) {
        var item = widgetsdata[i];
        if (_jspath.endsWith(item.uri)) {
          item.isloading = false;
          item._class = new _class(item, thismap);
          item._class.activateBase(); // BaseWidget: activateBase
          return item._class;
        }
      }
    } else {
      loadItem$1.isloading = false;
      loadItem$1._class = new _class(loadItem$1, thismap);
      loadItem$1._class.activateBase(); // BaseWidget: activateBase
      return loadItem$1._class;
    }
  }

  function getThisJSPath() {
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
  function getFilePath(file) {
    var pos = file.lastIndexOf("/");
    return file.substring(0, pos + 1);
  }

  function removeDebugeBar() {
    $("#widget-testbar").remove();
  }

  function getCacheVersion() {
    return cacheVersion;
  }

  function getBasePath() {
    return basePath;
  }

  var WidgetManager = ({
    init: init,
    getDefWindowOptions: getDefWindowOptions,
    clone: clone$1,
    bindDefOptions: bindDefOptions,
    activate: activate,
    'default': getWidget,
    getClass: getClass,
    isActivate: isActivate,
    disable: disable,
    disableAll: disableAll,
    disableGroup: disableGroup,
    eachWidget: eachWidget,
    bindClass: bindClass,
    getThisJSPath: getThisJSPath,
    getFilePath: getFilePath,
    removeDebugeBar: removeDebugeBar,
    getCacheVersion: getCacheVersion,
    getBasePath: getBasePath
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-20 10:18:10
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:17:36
   */

  var BaseWidget = leaflet.Class.extend({
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
            let _resource = this._getUrl(_resource);
            if (this._resource_cache.indexOf(_resource) != -1) continue; // 不加重复资源
            resources.push(_resource);
          }

          this._resource_cache = this._resource_cache.concat(resources); // 不加重复资源
          undefined(resources, () => {
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
      if (viewopt._layerIdx > 0) ;
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
      if (url.startWith("/") || url.startWith(".") || url.startWith("http")) {
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
        (0, _jquery2.default)(viewopt._dom).show({
          duration: 500,
        });
        this._startActivate(viewopt._dom);
      } else {
        var view_url = this._getUrl(viewopt.url);
        var that = this;
        that.getHtml(view_url, function (html) {
          viewopt._dom = (0, _jquery2.default)(html).appendTo(
            viewopt.parent || "body"
          );

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
          if (viewopts._layerOpening) ;
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

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-13 14:11:41
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-09 10:05:02
   */

  var viewer$1;
  var handler;

  function init$1(_viewer) {
    viewer$1 = _viewer;

    //添加弹出框
    var infoDiv =
      '<div id="tooltip-view" class="cesium-popup" style="display:none;">' +
      '     <div class="cesium-popup-content-wrapper  cesium-popup-background">' +
      '         <div id="tooltip-content" class="cesium-popup-content cesium-popup-color"></div>' +
      "     </div>" +
      '     <div class="cesium-popup-tip-container"><div class="cesium-popup-tip  cesium-popup-background"></div></div>' +
      "</div> ";
    $$1("#" + viewer$1._container.id).append(infoDiv);

    handler = new Cesium$1__default.ScreenSpaceEventHandler(viewer$1.scene.canvas);
    //鼠标移动事件
    handler.setInputAction(
      mouseMovingPicking,
      Cesium$1__default.ScreenSpaceEventType.MOUSE_MOVE
    );
  }

  var lastEntity;

  //鼠标移动事件
  function mouseMovingPicking(event) {
    $$1(".cesium-viewer").css("cursor", "");

    if (
      viewer$1.scene.screenSpaceCameraController.enableRotate === false ||
      viewer$1.scene.screenSpaceCameraController.enableTilt === false ||
      viewer$1.scene.screenSpaceCameraController.enableTranslate === false
    ) {
      close();
      return;
    }

    var position = event.endPosition;
    var pickedObject = viewer$1.scene.pick(position);
    if (pickedObject && Cesium$1__default.defined(pickedObject.id)) {
      //普通entity对象 && viewer.scene.pickPositionSupported
      var entity = pickedObject.id;

      if (entity.popup || entity.click || entity.cursorCSS) {
        $$1(".cesium-viewer").css("cursor", entity.cursorCSS || "pointer");
      }

      if (!entity.tooltip) {
        close();
        return;
      }

      if (entity.billboard || entity.label || entity.point) {
        if (lastEntity == entity) return;
        lastEntity = entity;
      }

      var cartesian = getCurrentMousePosition(viewer$1.scene, position);
      show(entity, cartesian, position);
    } else if (pickedObject && Cesium$1__default.defined(pickedObject.primitive)) {
      //primitive对象 && viewer.scene.pickPositionSupported
      var primitive = pickedObject.primitive;
      if (primitive.popup || primitive.click || primitive.cursorCSS) {
        $$1(".cesium-viewer").css("cursor", primitive.cursorCSS || "pointer");
      }

      if (!primitive.tooltip) {
        close();
        return;
      }

      var cartesian = getCurrentMousePosition(viewer$1.scene, position);
      show(primitive, cartesian, position);
    } else {
      close();
    }
  }

  function show(entity, cartesian, position) {
    if (entity == null || entity.tooltip == null) return;

    //计算显示位置
    if (position == null)
      position = Cesium$1__default.SceneTransforms.wgs84ToWindowCoordinates(
        viewer$1.scene,
        cartesian
      );
    if (position == null) {
      close();
      return;
    }

    var $view = $$1("#tooltip-view");

    //显示内容
    var inhtml;
    if (_typeof(entity.tooltip) === "object") {
      inhtml = entity.tooltip.html;
      if (entity.tooltip.check) {
        if (!entity.tooltip.check()) {
          close();
          return;
        }
      }
    } else {
      inhtml = entity.tooltip;
    }

    if (typeof inhtml === "function") {
      inhtml = inhtml(entity, cartesian); //回调方法
    }
    if (!inhtml) return;

    $$1("#tooltip-content").html(inhtml);
    $view.show();

    //定位位置
    var x = position.x - $view.width() / 2;
    var y = position.y - $view.height();

    var tooltip = entity.tooltip;
    if (
      tooltip &&
      (typeof tooltip === "undefined" ? "undefined" : _typeof(tooltip)) ===
        "object" &&
      tooltip.anchor
    ) {
      x += tooltip.anchor[0];
      y += tooltip.anchor[1];
    } else {
      y -= 15; //默认偏上10像素
    }
    $view.css("transform", "translate3d(" + x + "px," + y + "px, 0)");
  }

  function close() {
    $$1("#tooltip-content").empty();
    $$1("#tooltip-view").hide();
    lastEntity = null;
  }

  //function getTooltipByConfig(cfg, attr) {
  //    var _title =  cfg.popupNameField ? attr[cfg.popupNameField]:cfg.name;

  //    if (cfg.tooltip) {
  //        return getPopup(cfg.tooltip, attr,_title);
  //    }
  //    return false;
  //}

  function destroy() {
    close();
    handler.destroy();
  }

  var Tooltip$2 = ({
    init: init$1,
    show: show,
    close: close,
    destroy: destroy
  });

  /*
   * @Description: 该类不仅仅是popup处理，是所有一些有关单击事件的统一处理入口（从效率考虑）
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-20 14:24:48
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:14:20
   */

  function isOnly(value) {
  }

  function setEnable(value) {
    this._enable = value;
    if (!value) {
      this.close();
    }
  }

  function getEnable() {
    return this._enable;
  }

  function init$2() {
    // 添加弹出框
    var infoDiv = '<div id="popup-all-view"></div>';
    $$1("#" + viewer._container.id).append(infoDiv);
    this._handler = new Cesium$1__default.ScreenSpaceEventHandler(this._viewer.scene.canvas);
    // 单击事件
    this._handler.setInputAction(
      this.mousePickingClick,
      Cesium$1__default.ScreenSpaceEventType.LEFT_CLICK
    );
    // 移动时间
    this._viewer.scene.postRender.addEventListener(this._bind2Scene);
  }

  // popup 处理
  function show$1(entity, cartesian) {
    if (entity == null || entity.popup == null) return;
    var eleId =
      "popup_" +
      ((entity.id || "") + "").replace(new RegExp("[^0-9a-zA-Z_]", "gm"), "_");
    this.close(eleId);
    // 更新高度
    // if (this._viewer.scene.sampleHeightSupported) {
    //   cartesian = updateHeightForClampToGround(cartesian);
    // }
    this._objPopup[eleId] = {
      id: entity.id,
      popup: entity.popup,
      cartesian: cartesian,
    };

    // 显示内容
    var inHtml;
    if (typeof entity.popup === "object") {
      inHtml = entity.popup.html;
    } else {
      inHtml = entity.popup;
    }
    if (!inHtml) return;
    if (!inHtml) {
      return;
    }
    this._showHtml(inHtml, eleId, entity, cartesian);
  }

  function close$1(eleId) {
    if (!this._isOnly && eleId) {
      for (var i in this._objPopup) {
        if (eleId == this._objPopup[i].id || eleId == i) {
          $$1("#" + i).remove();
          delete this._objPopup[i];
          break;
        }
      }
    } else {
      $$1("#popup-all-view").empty();
      this._objPopup = {};
    }
  }

  function destroy$1() {
    this.close();
    this._handler.destroy();
    this._viewer.scene.postRender.removeEventListener(this._bind2Scene);
  }

  // 通用， 统一配置popup的方式
  function getPopupForConfig(cfg, attr) {
    var _title = cfg.popupNameField ? attr[cfg.popupNameField] : cfg.name;
    if (cfg.popup) {
      return this.getPopup(cfg.popup, attr, _title);
    } else if (cfg.columns) {
      return this.getPopup(cfg.columns, attr, _title);
    }
    return false;
  }

  // 格式化Popup或Tooltip格式化字符串
  function getPopup(cfg, attr, title) {
    if (!attr) return false;

    title = title || "";

    if (leaflet.Util.isArray(cfg)) {
      //数组
      var countsok = 0;
      var inhtml =
        '<div class="mars-popup-titile">' +
        title +
        '</div><div class="mars-popup-content" >';
      for (var i = 0; i < cfg.length; i++) {
        var thisfield = cfg[i];

        var col = thisfield.field;
        if (
          _typeof(attr[col]) === "object" &&
          attr[col].hasOwnProperty("getValue")
        )
          attr[col] = attr[col].getValue();
        if (typeof attr[col] === "function") continue;

        if (thisfield.type == "details") {
          //详情按钮
          var showval = _jquery2.default.trim(attr[col || "OBJECTID"]);
          if (
            showval == null ||
            showval == "" ||
            showval == "Null" ||
            showval == "Unknown"
          )
            continue;

          inhtml +=
            '<div style="text-align: center;padding: 10px 0;"><button type="button" onclick="' +
            thisfield.calback +
            "('" +
            showval +
            '\');" " class="btn btn-info  btn-sm">' +
            (thisfield.name || "查看详情") +
            "</button></div>";
          continue;
        }

        var showval = _jquery2.default.trim(attr[col]);
        if (
          showval == null ||
          showval == "" ||
          showval == "Null" ||
          showval == "Unknown" ||
          showval == "0" ||
          showval.length == 0
        )
          continue;

        if (thisfield.format) {
          //格式化
          try {
            showval = eval(thisfield.format + "(" + showval + ")");
          } catch (e) {
            console.log("getPopupByConfig error:" + thisfield.format);
          }
        }
        if (thisfield.unit) {
          showval += thisfield.unit;
        }

        inhtml +=
          "<div><label>" + thisfield.name + "</label>" + showval + "</div>";
        countsok++;
      }
      inhtml += "</div>";

      if (countsok == 0) return false;
      return inhtml;
    } else if (
      (typeof cfg === "undefined" ? "undefined" : _typeof(cfg)) === "object"
    ) {
      //对象,type区分逻辑
      switch (cfg.type) {
        case "iframe":
          var _url = _util.template(cfg.url, attr);

          var inhtml =
            '<iframe id="ifarm" src="' +
            _url +
            '"  style="width:' +
            (cfg.width || "300") +
            "px;height:" +
            (cfg.height || "300") +
            'px;overflow:hidden;margin:0;" scrolling="no" frameborder="0" ></iframe>';
          return inhtml;
          break;
        case "javascript":
          //回调方法
          return eval(cfg.calback + "(" + JSON.stringify(attr) + ")");
          break;
      }
    } else if (cfg == "all") {
      //全部显示
      var countsok = 0;
      var inhtml =
        '<div class="mars-popup-title">' +
        title +
        '</div><div class="mars-popup-content" >';
      for (var col in attr) {
        if (
          col == "Shape" ||
          col == "FID" ||
          col == "OBJECTID" ||
          col == "_definitionChanged" ||
          col == "_propertyNames"
        )
          continue; //不显示的字段

        if (col.substr(0, 1) == "_") {
          col = col.substring(1); //cesium 内部属性
        }

        if (typeof attr[col] === "object" && attr[col].hasOwnProperty("getValue"))
          attr[col] = attr[col].getValue();
        if (typeof attr[col] === "function") continue;

        var showval = $$1.trim(attr[col]);
        if (
          showval == null ||
          showval == "" ||
          showval == "Null" ||
          showval == "Unknown" ||
          showval == "0" ||
          showval.length == 0
        )
          continue; //不显示空值，更美观友好

        inhtml += "<div><label>" + col + "</label>" + showval + "</div>";
        countsok++;
      }
      inhtml += "</div>";

      if (countsok == 0) return false;
      return inhtml;
    } else {
      //格式化字符串
      return this.template(cfg, attr);
    }

    return false;
  }

  var Popup = ({
    isOnly: isOnly,
    setEnable: setEnable,
    getEnable: getEnable,
    init: init$2,
    show: show$1,
    close: close$1,
    destroy: destroy$1,
    getPopup: getPopup,
    getPopupForConfig: getPopupForConfig
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-03 09:43:45
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 09:13:35
   */

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-08-28 10:49:10
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:52:51
   */

  function initMap(id, config, options) {
    //============模块内部私有属性及方法============

    //类内部使用
    var viewer;
    var viewerDivId;
    var configData;
    var crs; //坐标系

    viewerDivId = id;
    configData = config;

    //如果options未设置时的默认参数
    var defOptions = {
      animation: false, //是否创建动画小器件，左下角仪表
      timeline: false, //是否显示时间线控件
      fullscreenButton: true, //右下角全屏按钮
      vrButton: false, //右下角vr虚拟现实按钮
      geocoder: false, //是否显示地名查找控件
      sceneModePicker: false, //是否显示投影方式控件
      homeButton: true, //回到默认视域按钮
      navigationHelpButton: true, //是否显示帮助信息控件
      navigationInstructionsInitiallyVisible: false, //在用户明确单击按钮之前是否自动显示

      infoBox: true, //是否显示点击要素之后显示的信息
      selectionIndicator: false, //选择模型是是否显示绿色框,
      shouldAnimate: true,
      showRenderLoopErrors: true, //是否显示错误弹窗信息

      baseLayerPicker: false, //地图底图
    };

    //config中可以配置map所有options
    for (var key in configData) {
      if (
        key === "crs" ||
        key === "controls" ||
        key === "minzoom" ||
        key === "maxzoom" ||
        key === "center" ||
        key === "style" ||
        key === "terrain" ||
        key === "baseMaps" ||
        key === "operationalLayers"
      )
        continue;
      defOptions[key] = configData[key];
    }

    //赋默认值（如果已存在设置值跳过）
    if (options == null) options = {};
    for (var i in defOptions) {
      if (!options.hasOwnProperty(i)) {
        options[i] = defOptions[i];
      }
    }

    //一些默认值的修改【by 木遥】
    Cesium$1__default.BingMapsApi.defaultKey =
      "AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc"; //，默认 key
    if (Cesium$1__default.Ion)
      Cesium$1__default.Ion.defaultAccessToken =
        configData.ionToken ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NjM5MjMxOS1lMWVkLTQyNDQtYTM4Yi0wZjA4ZDMxYTlmNDMiLCJpZCI6MTQ4MiwiaWF0IjoxNTI4Njc3NDQyfQ.vVoSexHMqQhKK5loNCv6gCA5d5_z3wE2M0l_rWnIP_w";
    Cesium$1__default.AnimationViewModel.defaultTicks = configData.animationTicks || [
      0.1,
      0.25,
      0.5,
      1.0,
      2.0,
      5.0,
      10.0,
      15.0,
      30.0,
      60.0,
      120.0,
      300.0,
      600.0,
      900.0,
      1800.0,
      3600.0,
    ];

    //坐标系
    configData.crs = configData.crs || "3857";
    crs = configData.crs;

    //自定义搜索栏Geocoder
    if (options.geocoder === true) {
      options.geocoder = new _GaodePOIGeocoder.GaodePOIGeocoder(
        options.geocoderConfig
      );
    }

    //地形
    if (configData.terrain && configData.terrain.visible) {
      options.terrainProvider = getTerrainProvider();
    }

    //地图底图图层预处理
    var hasRemoveImagery = false;
    if (options.baseLayerPicker) {
      //有baseLayerPicker插件时
      if (!options.imageryProviderViewModels)
        options.imageryProviderViewModels = getImageryProviderArr();
      if (!options.terrainProviderViewModels)
        options.terrainProviderViewModels = getTerrainProviderViewModelsArr();
    } else {
      //无baseLayerPicker插件时,按内部规则
      if (options.imageryProvider == null) {
        hasRemoveImagery = true;
        options.imageryProvider = Cesium$1__default.createTileMapServiceImageryProvider({
          url: Cesium$1__default.buildModuleUrl("Assets/Textures/NaturalEarthII"),
        });
      }
    }

    //地球初始化
    viewer = new Cesium$1__default.Viewer(id, options);
    viewer.cesiumWidget.creditContainer.style.display = "none"; //去cesium logo

    //====绑定方法到viewer上====
    viewer.mars = {
      popup: new Popup(viewer),
      tooltip: new Tooltip$2(viewer),
      keyboard: function keyboard(isBind) {
        if (isBind) bind(viewer);
        else unbind(viewer);
      },
      centerAt: centerAt,
      getConfig: getConfig,
      getLayer: getLayer,
      changeBaseMap: changeBaseMap,
      hasTerrain: hasTerrain,
      updateTerrainProvider: updateTerrainProvider,
      isFlyAnimation: isFlyAnimation,
      openFlyAnimation: openFlyAnimation,
      rotateAnimation: rotateAnimation,
      getCrs: getCrs,
      point2map: point2map,
      point2wgs: point2wgs,
      destroy: destroy$$1,

      //地图底图图层
    };
    if (hasRemoveImagery) {
      var imageryLayerCollection = viewer.imageryLayers;
      var length = imageryLayerCollection.length;
      for (var i = 0; i < length; i++) {
        var layer = imageryLayerCollection.get(0);
        imageryLayerCollection.remove(layer, true);
      }
    }

    //默认定位地点相关设置，默认home键和初始化镜头视角
    if (viewer.homeButton) {
      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
        function (commandInfo) {
          centerAt();
          commandInfo.cancel = true;
        }
      );
    }
    centerAt(null, {
      duration: 0,
    });

    var orderLayers = []; //计算order

    //没baseLayerPicker插件时才按内部规则处理。
    if (!options.baseLayerPicker) {
      var layersCfg = configData.baseMaps;
      if (layersCfg && layersCfg.length > 0) {
        for (var i = 0; i < layersCfg.length; i++) {
          var item = layersCfg[i];
          if (item.visible && item.crs) crs = item.crs;

          (0, _layer.createLayer)(
            item,
            viewer,
            config.serverURL,
            options.layerToMap
          );

          orderLayers.push(item);
          if (item.type == "group" && item.layers) {
            for (var idx = 0; idx < item.layers.length; idx++) {
              var childitem = item.layers[idx];
              orderLayers.push(childitem);
            }
          }
        }
      }
    }

    //可叠加图层
    var layersCfg = configData.operationalLayers;
    if (layersCfg && layersCfg.length > 0) {
      for (var i = 0; i < layersCfg.length; i++) {
        var item = layersCfg[i];
        (0, _layer.createLayer)(
          item,
          viewer,
          config.serverURL,
          options.layerToMap
        );

        orderLayers.push(item);
        if (item.type == "group" && item.layers) {
          for (var idx = 0; idx < item.layers.length; idx++) {
            var childitem = item.layers[idx];
            orderLayers.push(childitem);
          }
        }
      }
    }
    //计算 顺序字段,
    for (var i = 0; i < orderLayers.length; i++) {
      var item = orderLayers[i];

      //计算层次顺序
      var order = Number(item.order);
      if (isNaN(order)) order = i;
      item.order = order;

      //图层的处理
      if (item._layer != null) {
        item._layer.setZIndex(order);
      }
    }

    //切换场景
    var lastCameraView;
    viewer.scene.morphStart.addEventListener(function (event) {
      //切换场景前事件
      lastCameraView = point.getCameraView(viewer);
    });

    viewer.scene.morphComplete.addEventListener(function (event) {
      //切换场景后事件
      setTimeout(function () {
        centerAt(lastCameraView, {
          duration: 2,
        });
      }, 100);
    });

    //地图自定义控件 （兼容旧版controls参数）
    if (configData.navigation) {
      //导航工具栏
      addNavigationWidget(configData.navigation);
    }
    if (configData.location) {
      //鼠标提示
      addLocationWidget(configData.location);
    }

    if (options.geocoder) {
      options.geocoder.viewer = viewer;
    }

    //地球一些属性设置
    var scene = viewer.scene;
    scene.globe.baseColor = new Cesium$1__default.Color.fromCssColorString(
      configData.baseColor || "#546a53"
    ); //默认背景色
    if (configData.style) {
      //深度监测
      scene.globe.depthTestAgainstTerrain = configData.style.testTerrain;

      //光照渲染（阳光照射区域高亮）
      scene.globe.enableLighting = configData.style.lighting;

      //大气渲染
      scene.skyAtmosphere.show = configData.style.atmosphere;
      scene.globe.showGroundAtmosphere = configData.style.atmosphere;

      //雾化效果
      scene.fog.enabled = configData.style.fog;
    }

    //限制缩放级别
    scene.screenSpaceCameraController.maximumZoomDistance =
      configData.maxzoom || 20000000; //变焦时相机位置的最大值（以米为单位）
    scene.screenSpaceCameraController.minimumZoomDistance =
      configData.minzoom || 1; //变焦时相机位置的最小量级（以米为单位）。默认为1.0。

    //scene.screenSpaceCameraController.enableCollisionDetection = true;    //启用地形相机碰撞检测。
    //scene.screenSpaceCameraController.minimumCollisionTerrainHeight = 1;  //在测试与地形碰撞之前摄像机必须达到的最小高度。

    //解决Cesium显示画面模糊的问题 https://zhuanlan.zhihu.com/p/41794242
    viewer._cesiumWidget._supportsImageRenderingPixelated = Cesium$1__default.FeatureDetection.supportsImageRenderingPixelated();
    viewer._cesiumWidget._forceResize = true;
    if (Cesium$1__default.FeatureDetection.supportsImageRenderingPixelated()) {
      var _dpr = window.devicePixelRatio;
      // 适度降低分辨率
      while (_dpr >= 2.0) {
        _dpr /= 2.0;
      }
      viewer.resolutionScale = _dpr;
    }

    //解决限定相机进入地下 https://github.com/AnalyticalGraphicsInc/cesium/issues/5837
    viewer.camera.changed.addEventListener(function () {
      if (
        viewer.camera._suspendTerrainAdjustment &&
        viewer.scene.mode === Cesium$1__default.SceneMode.SCENE3D
      ) {
        viewer.camera._suspendTerrainAdjustment = false;
        viewer.camera._adjustHeightForTerrain();
      }
    });

    //鼠标滚轮缩放美化样式
    if (configData.mouseZoom && _util.isPCBroswer()) {
      $$1("#" + viewerDivId).append(
        '<div class="cesium-mousezoom"><div class="zoomimg"/></div>'
      );
      var handler = new Cesium$1__default.ScreenSpaceEventHandler(scene.canvas);
      handler.setInputAction(function (evnet) {
        $$1(".cesium-mousezoom").addClass("cesium-mousezoom-visible");
        setTimeout(function () {
          $$1(".cesium-mousezoom").removeClass("cesium-mousezoom-visible");
        }, 200);
      }, Cesium$1__default.ScreenSpaceEventType.WHEEL);
      handler.setInputAction(function (evnet) {
        $$1(".cesium-mousezoom").css({
          top: evnet.endPosition.y + "px",
          left: evnet.endPosition.x + "px",
        });
      }, Cesium$1__default.ScreenSpaceEventType.MOUSE_MOVE);
    }

    function destroy$$1() {
      viewer.mars.tooltip.destroy();
      viewer.mars.tooltip.destroy();
    }

    //获取指定图层 keyName默认为名称
    function getLayer(key, keyName) {
      if (keyName == null) keyName = "name";

      var layersCfg = configData.baseMaps;
      if (layersCfg && layersCfg.length > 0) {
        for (var i = 0; i < layersCfg.length; i++) {
          var item = layersCfg[i];
          if (item == null || item[keyName] != key) continue;
          return item._layer;
        }
      }

      layersCfg = configData.operationalLayers;
      if (layersCfg && layersCfg.length > 0) {
        for (var i = 0; i < layersCfg.length; i++) {
          var item = layersCfg[i];
          if (item == null || item[keyName] != key) continue;
          return item._layer;
        }
      }
      return null;
    }

    function getConfig() {
      return _util.clone(configData);
    }

    var stkTerrainProvider;

    function getTerrainProvider() {
      if (stkTerrainProvider == null) {
        var cfg = configData.terrain;
        if (cfg.url) {
          if (configData.serverURL) {
            cfg.url = cfg.url.replace("$serverURL$", configData.serverURL);
          }
          cfg.url = cfg.url
            .replace("$hostname$", location.hostname)
            .replace("$host$", location.host);
        }

        stkTerrainProvider = _util.getTerrainProvider(cfg);
      }
      return stkTerrainProvider;
    }

    function hasTerrain() {
      if (stkTerrainProvider == null) return false;
      return viewer.terrainProvider != _util.getEllipsoidTerrain();
    }

    function updateTerrainProvider(isStkTerrain) {
      if (isStkTerrain) {
        viewer.terrainProvider = getTerrainProvider();
      } else {
        viewer.terrainProvider = _util.getEllipsoidTerrain();
      }
    }

    function changeBaseMap(idorName) {
      var baseMaps = viewer.gisData.config.baseMaps;
      for (var i = 0; i < baseMaps.length; i++) {
        var item = baseMaps[i];
        if (item.type == "group" && item.layers == null) continue;
        if (item._layer == null) continue;

        if (idorName == item.name || idorName == item.id)
          item._layer.setVisible(true);
        else item._layer.setVisible(false);
      }
    }

    //获取自定义底图切换
    function getImageryProviderArr() {
      var providerViewModels = [];
      window._temp_createImageryProvider = _layer.createImageryProvider;

      var layersCfg = configData.baseMaps;
      if (layersCfg && layersCfg.length > 0) {
        for (var i = 0; i < layersCfg.length; i++) {
          var item = layersCfg[i];
          if (item.type == "group" && item.layers == null) continue;

          var funstr =
            "window._temp_baseMaps" +
            i +
            " = function () {\
                var item = " +
            JSON.stringify(item) +
            ';\
                if (item.type == "group") {\
                    var arrVec = [];\
                    for (var index = 0; index < item.layers.length; index++) {\
                        var temp = window._temp_createImageryProvider(item.layers[index]);\
                        if (temp == null) continue;\
                        arrVec.push(temp);\
                    }\
                    return arrVec;\
                }\
                else {\
                    return window._temp_createImageryProvider(item);\
                } \
            }';
          eval(funstr);

          var imgModel = new Cesium$1__default.ProviderViewModel({
            name: item.name || "未命名",
            tooltip: item.name || "未命名",
            iconUrl: item.icon || "",
            creationFunction: eval("window._temp_baseMaps" + i),
          });
          providerViewModels.push(imgModel);
        }
      }
      return providerViewModels;
    }

    function getTerrainProviderViewModelsArr() {
      return [
        new Cesium$1__default.ProviderViewModel({
          name: "无地形",
          iconUrl: Cesium$1__default.buildModuleUrl(
            "Widgets/Images/TerrainProviders/Ellipsoid.png"
          ),
          tooltip: "WGS84标准椭球，即 EPSG:4326",
          category: "",
          creationFunction: function creationFunction() {
            return new Cesium$1__default.EllipsoidTerrainProvider({
              ellipsoid: Cesium$1__default.Ellipsoid.WGS84,
            });
          },
        }),
        new Cesium$1__default.ProviderViewModel({
          name: "有地形",
          iconUrl: Cesium$1__default.buildModuleUrl(
            "Widgets/Images/TerrainProviders/CesiumWorldTerrain.png"
          ),
          tooltip: "提供的高分辨率全球地形",
          category: "",
          creationFunction: function creationFunction() {
            return getTerrainProvider();
          },
        }),
      ];
    }

    function centerAt(centeropt, options) {
      if (options == null) options = {};
      else if (_util.isNumber(options))
        options = {
          duration: options,
        }; //兼容旧版本

      if (centeropt == null) {
        //让镜头飞行（动画）到配置默认区域
        options.isWgs84 = true;
        centeropt = configData.extent || configData.center;
      }

      if (centeropt.xmin && centeropt.xmax && centeropt.ymin && centeropt.ymax) {
        //使用extent配置
        var xmin = centeropt.xmin;
        var xmax = centeropt.xmax;
        var ymin = centeropt.ymin;
        var ymax = centeropt.ymax;

        if (options.isWgs84) {
          //坐标转换为wgs
          var pt1 = point2map({
            x: xmin,
            y: ymin,
          });
          xmin = pt1.x;
          ymin = pt1.y;

          var pt2 = point2map({
            x: xmax,
            y: ymax,
          });
          xmax = pt2.x;
          ymax = pt2.y;
        }

        var rectangle = Cesium$1__default.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
        viewer.camera.flyTo({
          destination: rectangle,
          duration: options.duration,
          complete: options.complete,
        });
      } else {
        //使用xyz
        if (options.isWgs84) centeropt = point2map(centeropt);

        var height = options.minz || 2500;
        if (viewer.camera.positionCartographic.height < height)
          height = viewer.camera.positionCartographic.height;
        if (centeropt.z != null && centeropt.z != 0) height = centeropt.z;

        viewer.camera.flyTo({
          destination: Cesium$1__default.Cartesian3.fromDegrees(
            centeropt.x,
            centeropt.y,
            height
          ), //经度、纬度、高度
          orientation: {
            heading: Cesium$1__default.Math.toRadians(centeropt.heading || 0), //绕垂直于地心的轴旋转
            pitch: Cesium$1__default.Math.toRadians(centeropt.pitch || -90), //绕纬度线旋转
            roll: Cesium$1__default.Math.toRadians(centeropt.roll || 0), //绕经度线旋转
          },
          duration: options.duration,
          complete: options.complete,
        });
      }
    }

    //开场动画
    var _isFlyAnimation = false;

    function isFlyAnimation() {
      return _isFlyAnimation;
    }

    function openFlyAnimation(endfun, centeropt) {
      var view = centeropt || point.getCameraView(viewer); //默认为原始视角

      _isFlyAnimation = true;
      viewer.camera.setView({
        destination: Cesium$1__default.Cartesian3.fromDegrees(-85.16, 13.71, 23000000.0),
      });
      viewer.camera.flyTo({
        destination: Cesium$1__default.Cartesian3.fromDegrees(view.x, view.y, 23000000.0),
        duration: 2,
        easingFunction: Cesium$1__default.EasingFunction.LINEAR_NONE,
        complete: function complete() {
          var z = (view.z || 90000) * 1.2 + 8000;
          if (z > 23000000) z = 23000000;

          viewer.camera.flyTo({
            destination: Cesium$1__default.Cartesian3.fromDegrees(view.x, view.y, z),
            complete: function complete() {
              centerAt(view, {
                duration: 2,
                complete: function complete() {
                  _isFlyAnimation = false;
                  if (endfun) endfun();
                },
              });
            },
          });
        },
      });
    }
    //旋转地球
    function rotateAnimation(endfun, duration) {
      var first = point.getCameraView(viewer); //默认为原始视角
      var duration3 = duration / 3;

      //动画 1/3
      viewer.camera.flyTo({
        destination: Cesium$1__default.Cartesian3.fromDegrees(
          first.x + 120,
          first.y,
          first.z
        ),
        orientation: {
          heading: Cesium$1__default.Math.toRadians(first.heading),
          pitch: Cesium$1__default.Math.toRadians(first.pitch),
          roll: Cesium$1__default.Math.toRadians(first.roll),
        },
        duration: duration3,
        easingFunction: Cesium$1__default.EasingFunction.LINEAR_NONE,
        complete: function complete() {
          //动画 2/3
          viewer.camera.flyTo({
            destination: Cesium$1__default.Cartesian3.fromDegrees(
              first.x + 240,
              first.y,
              first.z
            ),
            orientation: {
              heading: Cesium$1__default.Math.toRadians(first.heading),
              pitch: Cesium$1__default.Math.toRadians(first.pitch),
              roll: Cesium$1__default.Math.toRadians(first.roll),
            },
            duration: duration3,
            easingFunction: Cesium$1__default.EasingFunction.LINEAR_NONE,
            complete: function complete() {
              //动画 3/3
              viewer.camera.flyTo({
                destination: Cesium$1__default.Cartesian3.fromDegrees(
                  first.x,
                  first.y,
                  first.z
                ),
                orientation: {
                  heading: Cesium$1__default.Math.toRadians(first.heading),
                  pitch: Cesium$1__default.Math.toRadians(first.pitch),
                  roll: Cesium$1__default.Math.toRadians(first.roll),
                },
                duration: duration3,
                easingFunction: Cesium$1__default.EasingFunction.LINEAR_NONE,
                complete: function complete() {
                  if (endfun) endfun();
                },
              });
              //动画3/3 end
            },
          });
          //动画2/3 end
        },
      });
      //动画1/3 end
    }

    //添加“鼠标经纬度提示”控件
    function addLocationWidget(item) {
      var inhtml =
        '<div id="location_mars_jwd"  class="location-bar animation-slide-bottom no-print" ></div>';
      $$1("#" + viewerDivId).prepend(inhtml);

      if (item.style) $$1("#location_mars_jwd").css(item.style);
      else {
        $$1("#location_mars_jwd").css({
          left: viewer.animation ? "170px" : "0",
          right: "0",
          bottom: viewer.timeline ? "25px" : "0",
        });
      }

      item.format =
        item.format ||
        "<div>视高：{height}米</div><div>俯仰角：{pitch}度</div><div>方向：{heading}度</div><div>海拔：{z}米</div><div>纬度:{y}</div><div>经度:{x}</div>";

      var locationData = {};

      function setXYZ2Data(cartesian) {
        var cartographic = Cesium$1__default.Cartographic.fromCartesian(cartesian);

        locationData.z = cartographic.height.toFixed(1);

        var jd = Cesium$1__default.Math.toDegrees(cartographic.longitude);
        var wd = Cesium$1__default.Math.toDegrees(cartographic.latitude);

        switch (item.crs) {
          default:
            //和地图一致的原坐标
            var fixedLen = item.hasOwnProperty("toFixed") ? item.toFixed : 6;
            locationData.x = jd.toFixed(fixedLen);
            locationData.y = wd.toFixed(fixedLen);
            break;
          case "degree":
            //度分秒形式
            locationData.x = _util.formatDegree(jd);
            locationData.y = _util.formatDegree(wd);
            break;
          case "project":
            //投影坐标
            var fixedLen = item.hasOwnProperty("toFixed") ? item.toFixed : 0;
            locationData.x = cartesian.x.toFixed(fixedLen);
            locationData.y = cartesian.y.toFixed(fixedLen);
            break;

          case "wgs":
            //标准wgs84格式坐标
            var fixedLen = item.hasOwnProperty("toFixed") ? item.toFixed : 6;
            var wgsPoint = point2wgs({
              x: jd,
              y: wd,
            }); //坐标转换为wgs
            locationData.x = wgsPoint.x.toFixed(fixedLen);
            locationData.y = wgsPoint.y.toFixed(fixedLen);
            break;
          case "wgs-degree":
            //标准wgs84格式坐标
            var wgsPoint = point2wgs({
              x: jd,
              y: wd,
            }); //坐标转换为wgs
            locationData.x = _util.formatDegree(wgsPoint.x);
            locationData.y = _util.formatDegree(wgsPoint.y);
            break;
        }
      }

      var handler = new Cesium$1__default.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (movement) {
        var cartesian = point.getCurrentMousePosition(
          viewer.scene,
          movement.endPosition
        );
        if (cartesian) {
          setXYZ2Data(cartesian);

          if (locationData.height == null) {
            locationData.height = viewer.camera.positionCartographic.height.toFixed(
              1
            );
            locationData.heading = Cesium$1__default.Math.toDegrees(
              viewer.camera.heading
            ).toFixed(0);
            locationData.pitch = Cesium$1__default.Math.toDegrees(
              viewer.camera.pitch
            ).toFixed(0);
          }

          var inhtml = _util.template(item.format, locationData);
          $$1("#location_mars_jwd").html(inhtml);
        }
      }, Cesium$1__default.ScreenSpaceEventType.MOUSE_MOVE);

      //相机移动结束事件
      viewer.scene.camera.changed.addEventListener(function (event) {
        locationData.height = viewer.camera.positionCartographic.height.toFixed(
          1
        );
        locationData.heading = Cesium$1__default.Math.toDegrees(
          viewer.camera.heading
        ).toFixed(0);
        locationData.pitch = Cesium$1__default.Math.toDegrees(viewer.camera.pitch).toFixed(
          0
        );

        if (locationData.x == null) {
          setXYZ2Data(viewer.camera.position);
        }

        var inhtml = _util.template(item.format, locationData);
        $$1("#location_mars_jwd").html(inhtml);
      });
    }

    //添加“导航”控件
    function addNavigationWidget(item) {
      if (!Cesium$1__default.viewerCesiumNavigationMixin) return;

      viewer.extend(Cesium$1__default.viewerCesiumNavigationMixin, {
        defaultResetView: Cesium$1__default.Rectangle.fromDegrees(110, 20, 120, 30),
        enableZoomControls: true,
      });

      if (viewer.animation) {
        $$1(".distance-legend").css({
          left: "150px",
          bottom: "25px",
          border: "none",
          background: "rgba(0, 0, 0, 0)",
          "z-index": "992",
        });
      } else {
        $$1(".distance-legend").css({
          left: "-10px",
          bottom: "-1px",
          border: "none",
          background: "rgba(0, 0, 0, 0)",
          "z-index": "992",
        });
      }
      if (item.legend) $$1(".distance-legend").css(item.legend);

      //$(".navigation-controls").css({
      //    "right": "5px",
      //    "bottom": "30px",
      //    "top": "auto"
      //});
      $$1(".navigation-controls").hide();

      if (item.compass) $$1(".compass").css(item.compass);
      else
        $$1(".compass").css({
          top: "10px",
          left: "10px",
        });
    }

    function getCrs() {
      return crs;
    }

    function point2map(point) {
      if (crs == "gcj") {
        var point_clone = _util.clone(point);

        var newpoint = _pointconvert2.default.wgs2gcj([
          point_clone.x,
          point_clone.y,
        ]);
        point_clone.x = newpoint[0];
        point_clone.y = newpoint[1];
        return point_clone;
      } else if (crs == "baidu") {
        var point_clone = _util.clone(point);

        var newpoint = _pointconvert2.default.wgs2bd([
          point_clone.x,
          point_clone.y,
        ]);
        point_clone.x = newpoint[0];
        point_clone.y = newpoint[1];
        return point_clone;
      } else {
        return point;
      }
    }

    function point2wgs(point) {
      if (crs == "gcj") {
        var point_clone = _util.clone(point);
        var newpoint = _pointconvert2.default.gcj2wgs([
          point_clone.x,
          point_clone.y,
        ]);
        point_clone.x = newpoint[0];
        point_clone.y = newpoint[1];
        return point_clone;
      } else if (crs == "baidu") {
        var point_clone = _util.clone(point);
        var newpoint = _pointconvert2.default.bd2gcj([
          point_clone.x,
          point_clone.y,
        ]);
        point_clone.x = newpoint[0];
        point_clone.y = newpoint[1];
        return point_clone;
      } else {
        return point;
      }
    }

    return viewer;
  }

  function createMap(opt) {
    if (opt.url) {
      $$1.ajax({
        type: "get",
        dataType: "json",
        url: opt.url,
        timeout: 0, //永不超时
        success: function (config) {
          //map初始化
          var configData = config.map3d;
          if (config.serverURL) configData.serverURL = config.serverURL;
          if (opt.serverURL) configData.serverURL = opt.serverURL;

          createMapByData(opt, configData, config);
        },
        error: function error(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Json文件" + opt.url + "加载失败！");
          _util.alert("Json文件" + opt.url + "加载失败！");
        },
      });
      return null;
    } else {
      if (opt.serverURL && opt.data) opt.data.serverURL = opt.serverURL;
      return createMapByData(opt, opt.data);
    }
  }

  function createMapByData(opt, configData, jsonData) {
    if (configData == null) {
      console.log("配置信息不能为空！");
      return;
    }

    //var token = {
    //    hostname: 'marsgis',
    //    start: '2018-11-25 00:00:00',
    //    end: '2018-12-25 00:00:00',
    //    msg: unescape('%u5F53%u524D%u7CFB%u7EDF%u8BB8%u53EF%u5DF2%u5230%u671F%uFF0C%u8BF7%u8054%u7CFB%u4F9B%u5E94%u5546%u201C%u706B%u661F%u79D1%u6280%u201D%uFF01'),
    //};
    //if (!_util.checkToken(token)) {
    //    return;
    //}

    var viewer = initMap(opt.id, configData, opt);

    //记录到全局变量，其他地方使用
    var gisData = {};
    gisData.config = configData;

    viewer.gisData = gisData;

    if (opt.success) opt.success(viewer, gisData, jsonData);

    return viewer;
  }

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-09 10:43:25
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-09 10:43:36
   */

  /*
   * @Descripttion:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-10 11:22:12
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-10 11:22:23
   */

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-01 09:25:31
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:53:26
   */

  const _labelAttr = {
    color: "#ffffff",
    font_family: "楷体",
    font_size: 23,
    border: true,
    border_color: "#000000",
    border_width: 3,
    background: true,
    background_color: "#000000",
    background_opacity: 0.5,
    scaleByDistance: true,
    scaleByDistance_far: 800000,
    scaleByDistance_near: 1000,
    scaleByDistance_nearValue: 1,
    pixelOffset: [0, -15],
  };

  var Measure = function (opts) {
    var that = this;
    var viewer = opts.viewer;
    var thisType = ""; // 当前正在绘制的类别
    if (opts.label) {
      for (var key in opts.label) {
        _labelAttr[key] = opts.label[key];
      }
    }
    var drawControl = new Draw$$1(that._viewer, {
      hasEdit: false,
    });

    drawControl.on(DrawEventType.DRAW_ADD_POINT, (e) => {
      var entity = e.entity;
      switch (thisType) {
        case "length":
        case "section":
          that.workLength.showAddPointLength(entity);
          break;
        case "area":
          that.workArea.showAddPointLength(entity);
          break;
        case "volume":
          that.workVolume.showAddPointLength(entity);
          break;
        case "height":
          that.workHeight.showAddPointLength(entity);
          break;
        case "super_height":
          that.workSuperHeight.showAddPointLength(entity);
          break;
        case "angle":
          that.workAngle.showAddPointLength(entity);
          break;
      }
    });

    drawControl.on(DrawEventType.DRAW_MOVE_POINT, (e) => {
      switch (that.thisType) {
        case "length":
        case "section":
          that.workLength.showRemoveLastPointLength(e);
          break;
        case "area":
          that.workArea.showRemoveLastPointLength(e);
          break;
        case "volume":
          that.workVolume.showRemoveLastPointLength(e);
          break;
        case "height":
          that.workHeight.showRemoveLastPointLength(e);
          break;
        case "super_height":
          that.workSuperHeight.showRemoveLastPointLength(e);
          break;
        case "angle":
          that.workAngle.showRemoveLastPointLength(e);
          break;
      }
    });

    drawControl.on(DrawEventType.DRAW_MOUSE_MOVE, (e) => {
      var entity = e.entity;
      switch (that.thisType) {
        case "length":
        case "section":
          that.workLength.showMoveDrawing(entity);
          break;
        case "area":
          that.workArea.showMoveDrawing(entity);
          break;
        case "volume":
          that.workVolume.showMoveDrawing(entity);
          break;
        case "height":
          that.workHeight.showMoveDrawing(entity);
          break;
        case "super_height":
          that.workSuperHeight.showMoveDrawing(entity);
          break;
        case "angle":
          that.workAngle.showMoveDrawing(entity);
          break;
      }
    });

    drawControl.on(DrawEventType.DRAW_CREATED, (e) => {
      var entity = e.entity;
      switch (thisType) {
        case "length":
        case "section":
          that.workLength.showDrawEnd(entity);
          break;
        case "area":
          that.workArea.showDrawEnd(entity);
          break;
        case "volume":
          that.workVolume.showDrawEnd(entity);
          break;
        case "height":
          that.workHeight.showDrawEnd(entity);
          break;
        case "super_height":
          that.workSuperHeight.showDrawEnd(entity);
          break;
        case "angle":
          that.workAngle.showDrawEnd(entity);
          break;
      }
    });

    var dataSource = drawControl.getDataSource();
  };

  var Measure$1 = ({
    Measure: Measure,
    'default': Measure
  });

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-02 13:23:06
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-09 10:49:31
   */

  function initMap$1(id, config, options) {
    //============模块内部私有属性及方法============

    //类内部使用
    var viewer;
    var viewerDivId;
    var configdata;
    var crs; //坐标系

    viewerDivId = id;
    configdata = config;

    //如果options未设置时的默认参数
    var defoptions = {
      animation: false, //是否创建动画小器件，左下角仪表
      timeline: false, //是否显示时间线控件
      fullscreenButton: true, //右下角全屏按钮
      vrButton: false, //右下角vr虚拟现实按钮
      geocoder: false, //是否显示地名查找控件
      sceneModePicker: false, //是否显示投影方式控件
      homeButton: true, //回到默认视域按钮
      navigationHelpButton: true, //是否显示帮助信息控件
      navigationInstructionsInitiallyVisible: false, //在用户明确单击按钮之前是否自动显示

      infoBox: true, //是否显示点击要素之后显示的信息
      selectionIndicator: false, //选择模型是是否显示绿色框,
      shouldAnimate: true,
      showRenderLoopErrors: true, //是否显示错误弹窗信息

      baseLayerPicker: false, //地图底图
    };

    //config中可以配置map所有options
    for (var key in configdata) {
      if (
        key === "crs" ||
        key === "controls" ||
        key === "minzoom" ||
        key === "maxzoom" ||
        key === "center" ||
        key === "style" ||
        key === "terrain" ||
        key === "basemaps" ||
        key === "operationallayers"
      )
        continue;
      defoptions[key] = configdata[key];
    }

    //赋默认值（如果已存在设置值跳过）
    if (options == null) options = {};
    for (var i in defoptions) {
      if (!options.hasOwnProperty(i)) {
        options[i] = defoptions[i];
      }
    }

    //一些默认值的修改【by 木遥】
    Cesium$1__default.BingMapsApi.defaultKey =
      "AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc"; //，默认 key
    if (Cesium$1__default.Ion)
      Cesium$1__default.Ion.defaultAccessToken =
        configdata.ionToken ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NjM5MjMxOS1lMWVkLTQyNDQtYTM4Yi0wZjA4ZDMxYTlmNDMiLCJpZCI6MTQ4MiwiaWF0IjoxNTI4Njc3NDQyfQ.vVoSexHMqQhKK5loNCv6gCA5d5_z3wE2M0l_rWnIP_w";
    Cesium$1__default.AnimationViewModel.defaultTicks = configdata.animationTicks || [
      0.1,
      0.25,
      0.5,
      1.0,
      2.0,
      5.0,
      10.0,
      15.0,
      30.0,
      60.0,
      120.0,
      300.0,
      600.0,
      900.0,
      1800.0,
      3600.0,
    ];

    //坐标系
    configdata.crs = configdata.crs || "3857";
    crs = configdata.crs;

    //自定义搜索栏Geocoder
    if (options.geocoder === true) {
      options.geocoder = new GaodePOIGeocoder(options.geocoderConfig);
    }

    //地形
    if (configdata.terrain && configdata.terrain.visible) {
      options.terrainProvider = getTerrainProvider$$1();
    }

    //地图底图图层预处理
    var hasremoveimagery = false;
    if (options.baseLayerPicker) {
      //有baseLayerPicker插件时
      if (!options.imageryProviderViewModels)
        options.imageryProviderViewModels = getImageryProviderArr();
      if (!options.terrainProviderViewModels)
        options.terrainProviderViewModels = getTerrainProviderViewModelsArr();
    } else {
      //无baseLayerPicker插件时,按内部规则
      if (options.imageryProvider == null) {
        hasremoveimagery = true;
        options.imageryProvider = Cesium$1__default.createTileMapServiceImageryProvider({
          url: Cesium$1__default.buildModuleUrl("Assets/Textures/NaturalEarthII"),
        });
      }
    }

    //地球初始化
    viewer = new Cesium$1__default.Viewer(id, options);
    viewer.cesiumWidget.creditContainer.style.display = "none"; //去cesium logo

    //====绑定方法到viewer上====
    viewer.mars = {
      popup: _popup,
      tooltip: _tooltip,
      keyboard: function (isbind) {
        if (isbind) FirstPerson.bind(viewer);
        else FirstPerson.unbind(viewer);
      },
      centerAt: centerAt,
      getConfig: getConfig,
      getLayer: getLayer,
      changeBasemap: changeBasemap,
      hasTerrain: hasTerrain,
      updateTerrainProvider: updateTerrainProvider,
      isFlyAnimation: isFlyAnimation,
      openFlyAnimation: openFlyAnimation,
      rotateAnimation: rotateAnimation,
      getCrs: getCrs,
      point2map: point2map,
      point2wgs: point2wgs,
      destroy: destroy,

      //地图底图图层
    };
    if (hasremoveimagery) {
      var imageryLayerCollection = viewer.imageryLayers;
      var length = imageryLayerCollection.length;
      for (var i = 0; i < length; i++) {
        var layer = imageryLayerCollection.get(0);
        imageryLayerCollection.remove(layer, true);
      }
    }

    //默认定位地点相关设置，默认home键和初始化镜头视角
    if (viewer.homeButton) {
      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
        function (commandInfo) {
          centerAt();
          commandInfo.cancel = true;
        }
      );
    }
    centerAt(null, {
      duration: 0,
    });

    var orderlayers = []; //计算order

    //没baseLayerPicker插件时才按内部规则处理。
    if (!options.baseLayerPicker) {
      var layersCfg = configdata.basemaps;
      if (layersCfg && layersCfg.length > 0) {
        for (var i = 0; i < layersCfg.length; i++) {
          var item = layersCfg[i];
          if (item.visible && item.crs) crs = item.crs;

          createLayer(item, viewer, config.serverURL, options.layerToMap);

          orderlayers.push(item);
          if (item.type == "group" && item.layers) {
            for (var idx = 0; idx < item.layers.length; idx++) {
              var childitem = item.layers[idx];
              orderlayers.push(childitem);
            }
          }
        }
      }
    }

    //可叠加图层
    var layersCfg = configdata.operationallayers;
    if (layersCfg && layersCfg.length > 0) {
      for (var i = 0; i < layersCfg.length; i++) {
        var item = layersCfg[i];
        createLayer(item, viewer, config.serverURL, options.layerToMap);

        orderlayers.push(item);
        if (item.type == "group" && item.layers) {
          for (var idx = 0; idx < item.layers.length; idx++) {
            var childitem = item.layers[idx];
            orderlayers.push(childitem);
          }
        }
      }
    }
    //计算 顺序字段,
    for (var i = 0; i < orderlayers.length; i++) {
      var item = orderlayers[i];

      //计算层次顺序
      var order = Number(item.order);
      if (isNaN(order)) order = i;
      item.order = order;

      //图层的处理
      if (item._layer != null) {
        item._layer.setZIndex(order);
      }
    }

    //切换场景
    var lastCameraView;
    viewer.scene.morphStart.addEventListener(function (event) {
      //切换场景前事件
      lastCameraView = point.getCameraView(viewer);
    });

    viewer.scene.morphComplete.addEventListener(function (event) {
      //切换场景后事件
      setTimeout(function () {
        centerAt(lastCameraView, {
          duration: 2,
        });
      }, 100);
    });

    //地图自定义控件 （兼容旧版controls参数）
    if (configdata.navigation) {
      //导航工具栏
      addNavigationWidget(configdata.navigation);
    }
    if (configdata.location) {
      //鼠标提示
      addLocationWidget(configdata.location);
    }

    if (options.geocoder) {
      options.geocoder.viewer = viewer;
    }

    //绑定popup
    _popup.init(viewer);

    //绑定tooltip
    _tooltip.init(viewer);

    //地球一些属性设置
    var scene = viewer.scene;
    scene.globe.baseColor = new Cesium$1__default.Color.fromCssColorString(
      configdata.baseColor || "#546a53"
    ); //默认背景色
    if (configdata.style) {
      //深度监测
      scene.globe.depthTestAgainstTerrain = configdata.style.testTerrain;

      //光照渲染（阳光照射区域高亮）
      scene.globe.enableLighting = configdata.style.lighting;

      //大气渲染
      scene.skyAtmosphere.show = configdata.style.atmosphere;
      scene.globe.showGroundAtmosphere = configdata.style.atmosphere;

      //雾化效果
      scene.fog.enabled = configdata.style.fog;
    }

    //限制缩放级别
    scene.screenSpaceCameraController.maximumZoomDistance =
      configdata.maxzoom || 20000000; //变焦时相机位置的最大值（以米为单位）
    scene.screenSpaceCameraController.minimumZoomDistance =
      configdata.minzoom || 1; //变焦时相机位置的最小量级（以米为单位）。默认为1.0。

    //scene.screenSpaceCameraController.enableCollisionDetection = true;    //启用地形相机碰撞检测。
    //scene.screenSpaceCameraController.minimumCollisionTerrainHeight = 1;  //在测试与地形碰撞之前摄像机必须达到的最小高度。

    //解决Cesium显示画面模糊的问题 https://zhuanlan.zhihu.com/p/41794242
    viewer._cesiumWidget._supportsImageRenderingPixelated = Cesium$1__default.FeatureDetection.supportsImageRenderingPixelated();
    viewer._cesiumWidget._forceResize = true;
    if (Cesium$1__default.FeatureDetection.supportsImageRenderingPixelated()) {
      var _dpr = window.devicePixelRatio;
      // 适度降低分辨率
      while (_dpr >= 2.0) {
        _dpr /= 2.0;
      }
      viewer.resolutionScale = _dpr;
    }

    //解决限定相机进入地下 https://github.com/AnalyticalGraphicsInc/cesium/issues/5837
    viewer.camera.changed.addEventListener(function () {
      if (
        viewer.camera._suspendTerrainAdjustment &&
        viewer.scene.mode === Cesium$1__default.SceneMode.SCENE3D
      ) {
        viewer.camera._suspendTerrainAdjustment = false;
        viewer.camera._adjustHeightForTerrain();
      }
    });

    //鼠标滚轮缩放美化样式
    if (configdata.mouseZoom && undefined()) {
      $("#" + viewerDivId).append(
        '<div class="cesium-mousezoom"><div class="zoomimg"/></div>'
      );
      var handler = new Cesium$1__default.ScreenSpaceEventHandler(scene.canvas);
      handler.setInputAction(function (evnet) {
        $(".cesium-mousezoom").addClass("cesium-mousezoom-visible");
        setTimeout(function () {
          $(".cesium-mousezoom").removeClass("cesium-mousezoom-visible");
        }, 200);
      }, Cesium$1__default.ScreenSpaceEventType.WHEEL);
      handler.setInputAction(function (evnet) {
        $(".cesium-mousezoom").css({
          top: evnet.endPosition.y + "px",
          left: evnet.endPosition.x + "px",
        });
      }, Cesium$1__default.ScreenSpaceEventType.MOUSE_MOVE);
    }

    function destroy() {
      _tooltip.destroy();
      _popup.destroy();
    }

    //获取指定图层 keyname默认为名称
    function getLayer(key, keyname) {
      if (keyname == null) keyname = "name";

      var layersCfg = configdata.basemaps;
      if (layersCfg && layersCfg.length > 0) {
        for (var i = 0; i < layersCfg.length; i++) {
          var item = layersCfg[i];
          if (item == null || item[keyname] != key) continue;
          return item._layer;
        }
      }

      layersCfg = configdata.operationallayers;
      if (layersCfg && layersCfg.length > 0) {
        for (var i = 0; i < layersCfg.length; i++) {
          var item = layersCfg[i];
          if (item == null || item[keyname] != key) continue;
          return item._layer;
        }
      }
      return null;
    }

    function getConfig() {
      return clone(configdata);
    }

    var stkTerrainProvider;

    function getTerrainProvider$$1() {
      if (stkTerrainProvider == null) {
        var cfg = configdata.terrain;
        if (cfg.url) {
          if (configdata.serverURL) {
            cfg.url = cfg.url.replace("$serverURL$", configdata.serverURL);
          }
          cfg.url = cfg.url
            .replace("$hostname$", location.hostname)
            .replace("$host$", location.host);
        }

        stkTerrainProvider = getTerrainProvider(cfg);
      }
      return stkTerrainProvider;
    }

    function hasTerrain() {
      if (stkTerrainProvider == null) return false;
      return viewer.terrainProvider != Utils.getEllipsoidTerrain();
    }

    function updateTerrainProvider(isStkTerrain) {
      if (isStkTerrain) {
        viewer.terrainProvider = getTerrainProvider$$1();
      } else {
        viewer.terrainProvider = getEllipsoidTerrain();
      }
    }

    function changeBasemap(idorname) {
      var basemaps = viewer.gisdata.config.basemaps;
      for (var i = 0; i < basemaps.length; i++) {
        var item = basemaps[i];
        if (item.type == "group" && item.layers == null) continue;
        if (item._layer == null) continue;

        if (idorname == item.name || idorname == item.id)
          item._layer.setVisible(true);
        else item._layer.setVisible(false);
      }
    }

    //获取自定义底图切换
    function getImageryProviderArr() {
      var providerViewModels = [];
      window._temp_createImageryProvider = createImageryProvider;

      var layersCfg = configdata.basemaps;
      if (layersCfg && layersCfg.length > 0) {
        for (var i = 0; i < layersCfg.length; i++) {
          var item = layersCfg[i];
          if (item.type == "group" && item.layers == null) continue;

          var funstr =
            "window._temp_basemaps" +
            i +
            " = function () {\
               var item = " +
            JSON.stringify(item) +
            ';\
               if (item.type == "group") {\
                   var arrVec = [];\
                   for (var index = 0; index < item.layers.length; index++) {\
                       var temp = window._temp_createImageryProvider(item.layers[index]);\
                       if (temp == null) continue;\
                       arrVec.push(temp);\
                   }\
                   return arrVec;\
               }\
               else {\
                   return window._temp_createImageryProvider(item);\
               } \
           }';
          eval(funstr);

          var imgModel = new Cesium$1__default.ProviderViewModel({
            name: item.name || "未命名",
            tooltip: item.name || "未命名",
            iconUrl: item.icon || "",
            creationFunction: eval("window._temp_basemaps" + i),
          });
          providerViewModels.push(imgModel);
        }
      }
      return providerViewModels;
    }

    function getTerrainProviderViewModelsArr() {
      return [
        new Cesium$1__default.ProviderViewModel({
          name: "无地形",
          iconUrl: Cesium$1__default.buildModuleUrl(
            "Widgets/Images/TerrainProviders/Ellipsoid.png"
          ),
          tooltip: "WGS84标准椭球，即 EPSG:4326",
          category: "",
          creationFunction: function creationFunction() {
            return new Cesium$1__default.EllipsoidTerrainProvider({
              ellipsoid: Cesium$1__default.Ellipsoid.WGS84,
            });
          },
        }),
        new Cesium$1__default.ProviderViewModel({
          name: "有地形",
          iconUrl: Cesium$1__default.buildModuleUrl(
            "Widgets/Images/TerrainProviders/CesiumWorldTerrain.png"
          ),
          tooltip: "提供的高分辨率全球地形",
          category: "",
          creationFunction: function creationFunction() {
            return getTerrainProvider$$1();
          },
        }),
      ];
    }

    function centerAt(centeropt, options) {
      if (options == null) options = {};
      else if (isNumber(options))
        options = {
          duration: options,
        }; //兼容旧版本

      if (centeropt == null) {
        //让镜头飞行（动画）到配置默认区域
        options.isWgs84 = true;
        centeropt = configdata.extent || configdata.center;
      }

      if (centeropt.xmin && centeropt.xmax && centeropt.ymin && centeropt.ymax) {
        //使用extent配置
        var xmin = centeropt.xmin;
        var xmax = centeropt.xmax;
        var ymin = centeropt.ymin;
        var ymax = centeropt.ymax;

        if (options.isWgs84) {
          //坐标转换为wgs
          var pt1 = point2map({
            x: xmin,
            y: ymin,
          });
          xmin = pt1.x;
          ymin = pt1.y;

          var pt2 = point2map({
            x: xmax,
            y: ymax,
          });
          xmax = pt2.x;
          ymax = pt2.y;
        }

        var rectangle = Cesium$1__default.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
        viewer.camera.flyTo({
          destination: rectangle,
          duration: options.duration,
          complete: options.complete,
        });
      } else {
        //使用xyz
        if (options.isWgs84) centeropt = point2map(centeropt);

        var height = options.minz || 2500;
        if (viewer.camera.positionCartographic.height < height)
          height = viewer.camera.positionCartographic.height;
        if (centeropt.z != null && centeropt.z != 0) height = centeropt.z;

        viewer.camera.flyTo({
          destination: Cesium$1__default.Cartesian3.fromDegrees(
            centeropt.x,
            centeropt.y,
            height
          ), //经度、纬度、高度
          orientation: {
            heading: Cesium$1__default.Math.toRadians(centeropt.heading || 0), //绕垂直于地心的轴旋转
            pitch: Cesium$1__default.Math.toRadians(centeropt.pitch || -90), //绕纬度线旋转
            roll: Cesium$1__default.Math.toRadians(centeropt.roll || 0), //绕经度线旋转
          },
          duration: options.duration,
          complete: options.complete,
        });
      }
    }

    //开场动画
    var _isFlyAnimation = false;

    function isFlyAnimation() {
      return _isFlyAnimation;
    }

    function openFlyAnimation(endfun, centeropt) {
      var view = centeropt || point.getCameraView(viewer); //默认为原始视角

      _isFlyAnimation = true;
      viewer.camera.setView({
        destination: Cesium$1__default.Cartesian3.fromDegrees(-85.16, 13.71, 23000000.0),
      });
      viewer.camera.flyTo({
        destination: Cesium$1__default.Cartesian3.fromDegrees(view.x, view.y, 23000000.0),
        duration: 2,
        easingFunction: Cesium$1__default.EasingFunction.LINEAR_NONE,
        complete: function complete() {
          var z = (view.z || 90000) * 1.2 + 8000;
          if (z > 23000000) z = 23000000;

          viewer.camera.flyTo({
            destination: Cesium$1__default.Cartesian3.fromDegrees(view.x, view.y, z),
            complete: function complete() {
              centerAt(view, {
                duration: 2,
                complete: function complete() {
                  _isFlyAnimation = false;
                  if (endfun) endfun();
                },
              });
            },
          });
        },
      });
    }
    //旋转地球
    function rotateAnimation(endfun, duration) {
      var first = point.getCameraView(viewer); //默认为原始视角
      var duration3 = duration / 3;

      //动画 1/3
      viewer.camera.flyTo({
        destination: Cesium$1__default.Cartesian3.fromDegrees(
          first.x + 120,
          first.y,
          first.z
        ),
        orientation: {
          heading: Cesium$1__default.Math.toRadians(first.heading),
          pitch: Cesium$1__default.Math.toRadians(first.pitch),
          roll: Cesium$1__default.Math.toRadians(first.roll),
        },
        duration: duration3,
        easingFunction: Cesium$1__default.EasingFunction.LINEAR_NONE,
        complete: function complete() {
          //动画 2/3
          viewer.camera.flyTo({
            destination: Cesium$1__default.Cartesian3.fromDegrees(
              first.x + 240,
              first.y,
              first.z
            ),
            orientation: {
              heading: Cesium$1__default.Math.toRadians(first.heading),
              pitch: Cesium$1__default.Math.toRadians(first.pitch),
              roll: Cesium$1__default.Math.toRadians(first.roll),
            },
            duration: duration3,
            easingFunction: Cesium$1__default.EasingFunction.LINEAR_NONE,
            complete: function complete() {
              //动画 3/3
              viewer.camera.flyTo({
                destination: Cesium$1__default.Cartesian3.fromDegrees(
                  first.x,
                  first.y,
                  first.z
                ),
                orientation: {
                  heading: Cesium$1__default.Math.toRadians(first.heading),
                  pitch: Cesium$1__default.Math.toRadians(first.pitch),
                  roll: Cesium$1__default.Math.toRadians(first.roll),
                },
                duration: duration3,
                easingFunction: Cesium$1__default.EasingFunction.LINEAR_NONE,
                complete: function complete() {
                  if (endfun) endfun();
                },
              });
              //动画3/3 end
            },
          });
          //动画2/3 end
        },
      });
      //动画1/3 end
    }

    //添加“鼠标经纬度提示”控件
    function addLocationWidget(item) {
      var inhtml =
        '<div id="location_mars_jwd"  class="location-bar animation-slide-bottom no-print" ></div>';
      (0, _jquery2.default)("#" + viewerDivId).prepend(inhtml);

      if (item.style) (0, _jquery2.default)("#location_mars_jwd").css(item.style);
      else {
        $("#location_mars_jwd").css({
          left: viewer.animation ? "170px" : "0",
          right: "0",
          bottom: viewer.timeline ? "25px" : "0",
        });
      }

      item.format =
        item.format ||
        "<div>视高：{height}米</div><div>俯仰角：{pitch}度</div><div>方向：{heading}度</div><div>海拔：{z}米</div><div>纬度:{y}</div><div>经度:{x}</div>";

      var locationData = {};

      function setXYZ2Data(cartesian) {
        var cartographic = Cesium$1__default.Cartographic.fromCartesian(cartesian);

        locationData.z = cartographic.height.toFixed(1);

        var jd = Cesium$1__default.Math.toDegrees(cartographic.longitude);
        var wd = Cesium$1__default.Math.toDegrees(cartographic.latitude);

        switch (item.crs) {
          default:
            //和地图一致的原坐标
            var fixedLen = item.hasOwnProperty("toFixed") ? item.toFixed : 6;
            locationData.x = jd.toFixed(fixedLen);
            locationData.y = wd.toFixed(fixedLen);
            break;
          case "degree":
            //度分秒形式
            locationData.x = formatDegree(jd);
            locationData.y = formatDegree(wd);
            break;
          case "project":
            //投影坐标
            var fixedLen = item.hasOwnProperty("toFixed") ? item.toFixed : 0;
            locationData.x = cartesian.x.toFixed(fixedLen);
            locationData.y = cartesian.y.toFixed(fixedLen);
            break;

          case "wgs":
            //标准wgs84格式坐标
            var fixedLen = item.hasOwnProperty("toFixed") ? item.toFixed : 6;
            var wgsPoint = point2wgs({
              x: jd,
              y: wd,
            }); //坐标转换为wgs
            locationData.x = wgsPoint.x.toFixed(fixedLen);
            locationData.y = wgsPoint.y.toFixed(fixedLen);
            break;
          case "wgs-degree":
            //标准wgs84格式坐标
            var wgsPoint = point2wgs({
              x: jd,
              y: wd,
            }); //坐标转换为wgs
            locationData.x = formatDegree(wgsPoint.x);
            locationData.y = formatDegree(wgsPoint.y);
            break;
        }
      }

      var handler = new Cesium$1__default.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (movement) {
        var cartesian = point.getCurrentMousePosition(
          viewer.scene,
          movement.endPosition
        );
        if (cartesian) {
          setXYZ2Data(cartesian);

          if (locationData.height == null) {
            locationData.height = viewer.camera.positionCartographic.height.toFixed(
              1
            );
            locationData.heading = Cesium$1__default.Math.toDegrees(
              viewer.camera.heading
            ).toFixed(0);
            locationData.pitch = Cesium$1__default.Math.toDegrees(
              viewer.camera.pitch
            ).toFixed(0);
          }

          var inhtml = template(item.format, locationData);
          $("#location_mars_jwd").html(inhtml);
        }
      }, Cesium$1__default.ScreenSpaceEventType.MOUSE_MOVE);

      //相机移动结束事件
      viewer.scene.camera.changed.addEventListener(function (event) {
        locationData.height = viewer.camera.positionCartographic.height.toFixed(
          1
        );
        locationData.heading = Cesium$1__default.Math.toDegrees(
          viewer.camera.heading
        ).toFixed(0);
        locationData.pitch = Cesium$1__default.Math.toDegrees(viewer.camera.pitch).toFixed(
          0
        );

        if (locationData.x == null) {
          setXYZ2Data(viewer.camera.position);
        }

        var inhtml = template(item.format, locationData);
        $("#location_mars_jwd").html(inhtml);
      });
    }

    //添加“导航”控件
    function addNavigationWidget(item) {
      if (!Cesium$1__default.viewerCesiumNavigationMixin) return;

      viewer.extend(Cesium$1__default.viewerCesiumNavigationMixin, {
        defaultResetView: Cesium$1__default.Rectangle.fromDegrees(110, 20, 120, 30),
        enableZoomControls: true,
      });

      if (viewer.animation) {
        $(".distance-legend").css({
          left: "150px",
          bottom: "25px",
          border: "none",
          background: "rgba(0, 0, 0, 0)",
          "z-index": "992",
        });
      } else {
        $(".distance-legend").css({
          left: "-10px",
          bottom: "-1px",
          border: "none",
          background: "rgba(0, 0, 0, 0)",
          "z-index": "992",
        });
      }
      if (item.legend) $(".distance-legend").css(item.legend);

      //$(".navigation-controls").css({
      //    "right": "5px",
      //    "bottom": "30px",
      //    "top": "auto"
      //});
      $(".navigation-controls").hide();

      if (item.compass) (0, _jquery2.default)(".compass").css(item.compass);
      else
        $(".compass").css({
          top: "10px",
          left: "10px",
        });
    }

    function getCrs() {
      return crs;
    }

    function point2map(point) {
      if (crs == "gcj") {
        var point_clone = clone(point);

        var newpoint = wgs2gcj([point_clone.x, point_clone.y]);
        point_clone.x = newpoint[0];
        point_clone.y = newpoint[1];
        return point_clone;
      } else if (crs == "baidu") {
        var point_clone = clone(point);

        var newpoint = wgs2bd([point_clone.x, point_clone.y]);
        point_clone.x = newpoint[0];
        point_clone.y = newpoint[1];
        return point_clone;
      } else {
        return point;
      }
    }

    function point2wgs(point) {
      if (crs == "gcj") {
        var point_clone = clone(point);
        var newpoint = gcj2wgs([point_clone.x, point_clone.y]);
        point_clone.x = newpoint[0];
        point_clone.y = newpoint[1];
        return point_clone;
      } else if (crs == "baidu") {
        var point_clone = clone(point);
        var newpoint = bd2gcj([point_clone.x, point_clone.y]);
        point_clone.x = newpoint[0];
        point_clone.y = newpoint[1];
        return point_clone;
      } else {
        return point;
      }
    }

    return viewer;
  }

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-09 10:44:18
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-09 10:44:29
   */

  /*
   * @Description:
   * @version:
   * @Author: 宁四凯
   * @Date: 2020-09-09 10:50:47
   * @LastEditors: 宁四凯
   * @LastEditTime: 2020-09-11 08:40:28
   */

  exports.FirstPerson = FirstPerson$1;
  exports.Draw = Draw$$1;
  exports.DrawBase = DrawBase;
  exports.DrawBillboard = DrawBillboard;
  exports.DrawCircle = DrawCircle;
  exports.DrawCorridor = DrawCorridor;
  exports.DrawCurve = DrawCurve;
  exports.DrawEllipsoid = DrawEllipsoid;
  exports.DrawLabel = DrawLabel;
  exports.DrawModel = DrawModel;
  exports.DrawPModel = DrawPModel;
  exports.DrawPoint = DrawPoint;
  exports.DrawPolyline = DrawPolyline;
  exports.DrawPolygon = DrawPolygon;
  exports.DrawPolylineVolume = DrawPolylineVolume;
  exports.DrawRectangle = DrawRectangle;
  exports.DrawWall = DrawWall;
  exports.EditBase = EditBase;
  exports.EditCircle = EditCircle;
  exports.EditCorridor = EditCorridor;
  exports.EditCurve = EditCurve;
  exports.EditEllipsoid = EditEllipsoid;
  exports.EditPoint = EditPoint;
  exports.EditPModel = EditPModel;
  exports.EditPolygon = EditPolygon;
  exports.EditPolyline = EditPolyline;
  exports.EditPolylineVolume = EditPolylineVolume;
  exports.EditRectangle = EditRectangle;
  exports.EditWall = EditWall;
  exports.DrawEventType = DrawEventType;
  exports.EditEventType = EditEventType;
  exports.BaseLayer = BaseLayer;
  exports.ArcFeatureGridLayer = ArcFeatureGridLayer;
  exports.CustomFeatureGridLayer = CustomFeatureGridLayer;
  exports.CzmlLayer = CzmlLayer;
  exports.DrawLayer = DrawLayer;
  exports.FeatureGridLayer = FeatureGridLayer;
  exports.GeoJsonLayer = GeoJsonLayer;
  exports.GltfLayer = GltfLayer;
  exports.GraticuleLayer = GraticuleLayer;
  exports.GroupLayer = GroupLayer;
  exports.KmlLayer = KmlLayer;
  exports.Layer = Layer;
  exports.POILayer = POILayer;
  exports.TerrainLayer = TerrainLayer;
  exports.Tiles3dLayer = Tiles3dLayer;
  exports.TileLayer = TileLayer;
  exports.createMap = createMap;
  exports.Measure = Measure$1;
  exports.Billboard = Billboard;
  exports.Circle = Circle;
  exports.Corridor = Corridor$1;
  exports.Ellipsoid = Ellipsoid;
  exports.Label = Label$1;
  exports.Model = Model;
  exports.Point = Point;
  exports.Polygon = Polygon$1;
  exports.Polyline = Polyline;
  exports.PolylineVolume = PolylineVolume;
  exports.Rectangle = Rectangle$1;
  exports.Wall = Wall;
  exports.BaiduImageryProvider = BaiduImageryProvider;
  exports.Dragger = Dragger$1;
  exports.GaodePOIGeocoder = GaodePOIGeocoder$1;
  exports.Loader = Loader$1;
  exports.PointUtil = PointUtil;
  exports.PointConvert = PointConvert;
  exports.Util = Util$1;
  exports.TooltipUtil = Tooltip$1;
  exports.Matrix = Matrix;
  exports.initMap = initMap$1;
  exports.BaseWidget = BaseWidget;
  exports.WidgetManager = WidgetManager;
  exports.Tooltip = Tooltip$2;
  exports.Popup = Popup;

})));
