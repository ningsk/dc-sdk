/*
 * @Description: Gltf小模型图层
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 11:10:46
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 17:19:47
 */

import { BaseLayer } from "./BaseLayer";
import * as Cesium from "cesium";
export var GltfLayer = BaseLayer.extend({
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
    var position = Cesium.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);
    var heading = Cesium.Math.toRadians(cfg.heading || 0);
    var pitch = Cesium.Math.toRadians(cfg.pitch || 0);
    var roll = Cesium.Math.toRadians(cfg.roll || 0);
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
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
    this.model.model.color = new Cesium.Color.fromCssColorString(
      "#FFFFFF"
    ).withAlpha(value);
  },
});
