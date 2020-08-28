import { Tooltip } from "../utils";
import { Popup } from "leaflet";
import { throttleRequestByServer } from "cesium";

const DEF_OPTS = {
  animation: false, //Whether to create animated widgets, lower left corner of the meter
  baseLayerPicker: false, //Whether to display the layer selector
  fullscreenButton: false, //Whether to display the full-screen button
  geocoder: false, //To display the geocoder widget, query the button in the upper right corner
  homeButton: false, //Whether to display the Home button
  infoBox: false, //Whether to display the information box
  sceneModePicker: false, //Whether to display 3D/2D selector
  selectionIndicator: false, //Whether to display the selection indicator component
  timeline: false, //Whether to display the timeline
  navigationHelpButton: false, //Whether to display the help button in the upper right corner
  navigationInstructionsInitiallyVisible: false,
  creditContainer: undefined,
  shouldAnimate: true,
};
/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-28 13:41:59
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 14:45:04
 */
class Mars {
  constructor(id, config, options = {}) {
    this.viewerDivId = id;
    this.config = config;
    this.viewer = new Cesium.Viewer(id, {
      ...options,
      ...DEF_OPTS,
    });
    this.viewer.cesiumWidget.creditContainer.style.display = 'none'; // 去掉cesium logo
    this._tooltip = new Tooltip();
    this._popup = new Popup();
  }

  init() {
    // config中可以配置map所有options
    for (var key in this.config) {
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
      ) {
        continue;
      }
      DEF_OPTS[key] = this.config[key];
    }

    // 一些默认值的修改
    Cesium.BingMapsApi.defaultKey =
      "AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc"; //，默认 key
    if (Cesium.Ion) {
      Cesium.Ion.defaultAccessToken =
        this.config.ionToken ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NjM5MjMxOS1lMWVkLTQyNDQtYTM4Yi0wZjA4ZDMxYTlmNDMiLCJpZCI6MTQ4MiwiaWF0IjoxNTI4Njc3NDQyfQ.vVoSexHMqQhKK5loNCv6gCA5d5_z3wE2M0l_rWnIP_w";
    }
    Cesium.AnimationViewModel.defaultTicks = this.config.animationTicks || [
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

    // 坐标系
    this.config.crs = this.config.crs || "3857";
    this.crs = this.config.crs;

    // 地图底图图层预处理
    var hasRemoveImagery = false;
    if () {
      
    }
  }

  getTooltip() {
    return this._tooltip;
  }

  getPopup() {
    return this._popup;
  }

  destroy() {
    this._tooltip.destroy();
    this._popup.destroy();
  }
}
