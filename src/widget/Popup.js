/*
 * @Description: 该类不仅仅是popup处理，是所有一些有关单击事件的统一处理入口（从效率考虑）
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-20 14:24:48
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 13:16:56
 */
import * as Cesium from "cesium";
import $ from "jquery";
import { PointUtil, Util } from "../core/index";

var _viewer;
var _handler;
var _objPopup = {};
var _isOnly = true;
var _enable = true;

function isOnly(value) {
  _isOnly = value;
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

function init() {
  // 添加弹出框
  var infoDiv = '<div id="popup-all-view"></div>';
  $("#" + viewer._container.id).append(infoDiv);
  this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
  // 单击事件
  this._handler.setInputAction(
    this.mousePickingClick,
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  );
  // 移动时间
  this._viewer.scene.postRender.addEventListener(this._bind2Scene);
}

// 鼠标点击事件
function mousePickingClick(event) {
  this.removeFeature();
  if (this._isOnly) {
    this.close();
  }
  if (!this._enable) {
    return;
  }
  var position = event.position;
  var pickedObject = this._viewer.scene.pick(position);
  // 普通entity对象 && viewer.scene.pickPositionSupported
  if (pickedObject && Cesium.defined(pickedObject.id)) {
    var entity = pickedObject.id;
    // popup
    if (Cesium.defined(entity.popup)) {
      var cartesian = PointUtil.getCurrentMousePosition(
        this._viewer.scene,
        position
      );
      //if (entity.billboard || entity.label || entity.point) {
      //    cartesian = pickedObject.primitive.position;
      //} else {
      //   cartesian = getCurrentMousePosition(viewer.scene, position);
      //}
      this.show(entity, cartesian);
    }

    // 加统一的click处理
    if (entity.click && typeof entity.click === "function") {
      entity.click(entity, position);
    }
    return;
  }
  this.pickImageryLayerFeatures(position);
}

// 单击瓦片时同时显示要素处理
var _lastShowFeature;

function removeFeature() {
  if (this._lastShowFeature == null) {
    return;
  }
  this._viewer.dataSources.remove(this._lastShowFeature);
  this._lastShowFeature = null;
}

// 瓦片图层上的矢量对象，动态获取
function pickImageryLayerFeatures(position) {
  var scene = this._viewer.scene;
  var pickRay = scene.camera.getPickRay(position);
  var imageryLayerFeaturePromise = scene.imageryLayers.pickImageryLayerFeatures(
    pickRay,
    scene
  );
  if (!Cesium.defined(imageryLayerFeaturePromise)) {
    return;
  }
  Cesium.when(
    imageryLayerFeaturePromise,
    (features) => {
      if (!Cesium.defined(features)) {
        features.length === 0;
      } else {
        return;
      }

      // 单击选中的要素对象
      var feature = features[0];
      if (feature.imageryLayer == null || feature.imageryLayer.config == null) {
        return;
      }
      var cfg = feature.imageryLayer.config;

      // 显示要素
      if (cfg.showClickFeature && feature.data) {
        this.showFeature(feature.data, cfg.pickFeatureStyle);
      }

      // 显示popup
      var result = this.getPopupForConfig(
        feature.imageryLayer.config,
        feature.properties
      );
      if (result) {
        var cartesian = PointUtil.getCurrentMousePosition(
          this._viewer.scene,
          position
        );
        this.show(
          {
            id: "imageryLayerFeaturePromise",
            popup: {
              html: result,
              popup: {
                html: result,
                anchor: feature.imageryLayer.config.popupAnchor || [0, -12],
              },
            },
          },
          cartesian
        );
      }

      // 加统一的click处理
      if (cfg.click && typeof cfg.click === "function") {
        cfg.click(feature.properties, position);
      }
    },
    () => {}
  );
}

function showFeature(item, options) {
  this.removeFeature();
  var feature;
  if (item.geometryType && item.geometryType.indexOf("esri") != -1) {
    // arcgis图层时
    if (JSON.stringify(item.geometry).length < 10000) {
      // 屏蔽大数据，页面卡顿
      feature = L.esri.Util.arcgisToGeoJSON(item.geometry);
    }
  } else if (item.geometry && item.geometry.type) {
    var geojson = L.geoJSON(item.geometry, {
      coordsToLatLng: (coords) => {
        if (coords[0] > 180 || coords[0] < -180) {
          // 需要判断处理数据里面的坐标为4326
          return L.CRS.EPSG3857.unproject(L.point(coords[0], coords[1]));
        }
        return L.latLng(coords[1], coords[0], coords[2]);
      },
    });
    feature = geojson.toGeoJSON();
  }

  if (feature == null) return;
  options = options || {};
  var dataSource = Cesium.GeoJsonDataSource.load(feature, {
    clampToGround: true,
    stroke: new Cesium.Color.fromCssColorString(options.stroke || "#ffff00"),
    strokeWidth: options.strokeWidth || 3,
    fill: new Cesium.Color.fromCssColorString(
      options.fill || "#ffff00"
    ).withAlpha(options.fillAlpha || 0.7),
  });
  dataSource
    .then((dataSource) => {
      this._viewer.dataSources.add(dataSource);
      this._lastShowFeature = dataSource;
    })
    .otherwise((error) => {
      console.log(error);
    });
}

// popup 处理
function show(entity, cartesian) {
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
  if (typeof inHtml === "function") {
    // TODO 回调方法
    // inhtml = inhtml(entity, cartesian, function(inhtml) {
    //   _showHtml(inhtml, eleId, entity, cartesian);
    // });
  }
  if (!inHtml) {
    return;
  }
  this._showHtml(inHtml, eleId, entity, cartesian);
}

function _showHtml(inHtml, eleId, entity, cartesian) {
  $("#popup-all-view").append(
    '<div id="' +
      eleId +
      '" class="cesium-popup">' +
      '            <a class="cesium-popup-close-button cesium-popup-color" href="javascript:viewer.card.popup.close(\'' +
      eleId +
      "')\">×</a>" +
      '            <div class="cesium-popup-content-wrapper cesium-popup-background">' +
      '                <div class="cesium-popup-content cesium-popup-color">' +
      inhtml +
      "</div>" +
      "            </div>" +
      '            <div class="cesium-popup-tip-container"><div class="cesium-popup-tip cesium-popup-background"></div></div>' +
      "        </div>"
  );

  // 计算显示位置
  var result = this.updateViewPoint(eleId, cartesian, entity.popup);
  if (!result) {
    this.close(eleId);
    return;
  }
}

function updateViewPoint(eleId, cartesian, popup) {
  var point = Cesium.SceneTransforms.wgs84ToDrawingBufferCoordinates(
    this._viewer.scene,
    cartesian
  );
  if (point == null) return false;
  // 判断是否在球的背面
  var scene = this._viewer.scene;
  var cartesianNew;
  if (scene.mode === Cesium.SceneMode.SCENE3D) {
    // 三维模式下
    var pickRay = scene.camera.getPickRay(point);
    cartesianNew = scene.globe.pick(pickRay, scene);
  } else {
    // 二维模式下
    cartesianNew = scene.camera.pickEllipsoid(point, scene.globe.ellipsoid);
  }
  if (cartesianNew) {
    var len = Cesium.Cartesian3.distance(cartesian, cartesianNew);
    if (len > 10000) return false;
  }

  // 判断是否在球的背面
  var $view = $("#" + eleId);
  var x = point.x - $view.width() / 2;
  var y = point.y - $view.height();

  if (
    popup &&
    (typeof popup === "undefined"
      ? "undefined"
      : typeof popup === "object" && popup.anchor)
  ) {
    x += popup.anchor[0];
    y += popup.anchor[1];
  }
  $view.css("transform", "translate3d(" + x + "px," + y + "px, 0)");
  return true;
}

function _bind2Scene() {
  for (var i in this._objPopup) {
    var item = this._objPopup[i];
    var result = this.updateViewPoint(i, item.cartesian, item.popup);
    if (!result) {
      this.close(i);
    }
  }
}

function close(eleId) {
  if (!this._isOnly && eleId) {
    for (var i in this._objPopup) {
      if (eleId == this._objPopup[i].id || eleId == i) {
        $("#" + i).remove();
        delete this._objPopup[i];
        break;
      }
    }
  } else {
    $("#popup-all-view").empty();
    this._objPopup = {};
  }
}

function destroy() {
  this.close();
  this._handler.destroy();
  this._viewer.scene.postRender.removeEventListener(this._bind2Scene);
}

function template(str, data) {
  for (var col in data) {
    var showVal = data[col];
    if (showVal == null || showVal == "Null" || showVal == "Unknown") {
      showVal = "";
    }
    if (col.substr(0, 1) == "_") {
      col = col.substring(1); // cesium 内部属性
    }
    str = str.replace(new RegExp("{" + col + "}", "gm"), showVal);
  }
  return str;
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

  if (Util.isArray(cfg)) {
    //数组
    var countsok = 0;
    var inhtml =
      '<div class="card-popup-titile">' +
      title +
      '</div><div class="card-popup-content" >';
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
        var showval = $.trim(attr[col || "OBJECTID"]);
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

      var showval = $.trim(attr[col]);
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
      '<div class="card-popup-title">' +
      title +
      '</div><div class="card-popup-content" >';
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

      var showval = $.trim(attr[col]);
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

// 模块对外公开的属性和方法
export {
  isOnly,
  setEnable,
  getEnable,
  init,
  show,
  close,
  destroy,
  getPopup,
  getPopupForConfig,
};
