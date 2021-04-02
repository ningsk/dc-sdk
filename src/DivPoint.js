/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-28 09:44:27
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 10:33:46
 */
import * as Cesium from "cesium";
import { Class } from "./core/Class";
import $ from "jquery";
export var DivPoint = Class.extend({
  position: null,
  anchor: null,
  initialize: function (viewer, opts) {
    this.viewer = viewer;
    this.position = opts.position;
    this.anchor = opts.anchor;

    // 添加html
    this.$view = $(opts.html);
    this.$view.css({
      position: "absolute",
      left: "0",
      top: "0",
    });
    this.$view.appendTo("#" + viewer._container.id);

    // 移动事件
    viewer.scene.postRender.addEventListener(this.updateViewPoint, this);
  },
  backAngle: Cesium.Math.toRadians(75),
  updateViewPoint: function () {
    if (!this._visible) {
      return;
    }
    var scene = this.viewer.scene;
    var point = Cesium.SceneTransforms.wgs84ToDrawingBufferCoordinates(
      scene,
      this.position
    );
    if (point == null) {
      return;
    }
    // 判断是否在球的背面
    var h1 = Cesium.Cartesian3.distance(scene.camera.position, this.position);
    var h2 =
      scene.camera.positionCartographic.height +
      this.viewer.scene.globe.ellipsoid.maximumRadius;
    var angle = Cesium.Cartesian3.angleBetween(
      scene.camera.position,
      this.position
    );
    if (h1 > h2 || angle > this.backAngle) {
      this.$view.hide();
      return;
    } else {
      this.$view.show();
    }

    // 判断是否在球的背面
    var x = point.x;
    var y = point.y - this.$view.height();
    if (this.anchor) {
      x += this.anchor[0];
      y += this.anchor[1];
    } else {
      x -= this.$view.width() / 2; // 默认为div下侧中心点
    }

    this.$view.css("transform", "translate3d(" + x + "px," + y + "px, 0)");
  },
  _visible: true,
  setVisible: function (val) {
    this._visible = val;
    if (val) this.$view.show();
    else this.$view.hide();
  },
  destroy: function () {
    this.viewer.scene.postRender.removeEventListener(
      this.updateViewPoint,
      this
    );
    this.$view.remove();
    this.$view = null;
    this.position = null;
    this.anchor = null;
    this.viewer = null;
  },
});
