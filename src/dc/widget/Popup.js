/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-20 14:24:48
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-31 14:35:37
 */

import Cesium, { destroyObject } from "cesium";
import $ from "jquery";
import { Point } from "../point";
import EsriUtil, { _updateMapAttribution } from "esri-leaflet/src/Util";

class Popup {
  constructor(viewer) {
    this._viewer = viewer;
    this._handler = null;
    this._objPopup = {};
    this._isOnly = true;
    this._enable = true;
    // 单击瓦片时，同步显示要素处理
    this._lastShowFeature = null;
  }

  isOnly(value) {
    this._isOnly = value;
  }

  setEnable(value) {
    this._enable = value;
    if (!value) {
      this.close();
    }
  }

  getEnable() {
    return this._enable;
  }

  init() {
    // 添加弹出框
    var infoDiv = '<div id="popup-all-view"></div>';
    $("#" + viewer._container.id).append(infoDiv);
    this._handler = new Cesium.ScreenSpaceEventHandler(
      this._viewer.scene.canvas
    );
    // 单击事件
    this._handler.setInputAction(
      this.mousePickingClick,
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    // 移动时间
    this._viewer.scene.postRender.addEventListener(this._bind2Scene);
  }

  // 鼠标点击事件
  mousePickingClick(event) {
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
        var cartesian = Point.getCurrentMousePosition(
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

  removeFeature() {
    if (this._lastShowFeature == null) {
      return;
    }
    this._viewer.dataSources.remove(this._lastShowFeature);
    this._lastShowFeature = null;
  }

  // 瓦片图层上的矢量对象，动态获取
  pickImageryLayerFeatures(position) {
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
        if (
          feature.imageryLayer == null ||
          feature.imageryLayer.config == null
        ) {
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
          var cartesian = Point.getCurrentMousePosition(
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

  showFeature(item, options) {
    this.removeFeature();
    var feature;
    if (item.geometryType && item.geometryType.indexOf("esri") != -1) {
      // arcgis图层时
      if (JSON.stringify(item.geometry).length < 10000) {
        // 屏蔽大数据，页面卡顿
        feature = EsriUtil.arcgisToGeoJSON(item.geometry);
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
  show(entity, cartesian) {
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

  _showHtml(inHtml, eleId, entity, cartesian) {
    $("#popup-all-view").append(
      '<div id="' +
        eleId +
        '" class="cesium-popup">' +
        '            <a class="cesium-popup-close-button cesium-popup-color" href="javascript:viewer.mars.popup.close(\'' +
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

  updateViewPoint(eleId, cartesian, popup) {
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

  _bind2Scene() {
    for (var i in this._objPopup) {
      var item = this._objPopup[i];
      var result = this.updateViewPoint(i, item.cartesian, item.popup);
      if (!result) {
        this.close(i);
      }
    }
  }

  close(eleId) {
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

  destroy() {
    this.close();
    this._handler.destroy();
    this._viewer.scene.postRender.removeEventListener(this._bind2Scene);
  }

  template(str, data) {
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
  getPopupForConfig(cfg, attr) {
    var _title = cfg.popupNameField ? attr[cfg.popupNameField] : cfg.name;
    if (cfg.popup) {
      return this.getPopup(cfg.popup, attr, _title);
    } else if (cfg.columns) {
      return this.getPopup(cfg.columns, attr, _title);
    }
    return false;
  }

  // 格式化Popup或Tooltip格式化字符串
  getPopup(cfg, attr, title) {
    if (!attr) return false;
    title = title || "";
    if (L.Util.isArray(cfg)) {
      // 数组
      var countSok = 0;
      var inhtml =
        '<div class="mars-popup-title">' +
        title +
        '</div><div class="mars-popup-content" >';
    }
  }
}

export default Popup;
