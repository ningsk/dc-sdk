/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-20 08:26:12
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-20 10:07:55
 */

import $ from 'jquery';
import Cesium from 'cesium';

class DivPoint {
  constructor(viewer, opts) {
    this.viewer = viewer;
    this.position = opts.position;
    this.anchor = opts.anchor;
    this.backAngle = Cesium.Math.toRadians(75); 
    this._visible = true;

    // 添加html
    this.$view = $(opts.html);
    this.$view.css({
      position: 'absolute',
      left: '0',
      top: '0'
    });
    this.$view.appendTo('#' + viewer._container.id);

    // 移动事件
    this.viewer.scene.postRender.addEventListener(this.updateViewPoint, this);
  
  }

  updateViewPoint() {
    if (!this._visible) {
      return;
    }

    let scene = this.viewer.scene;
    let point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, this.position);
    if (point == null) return;
    
    // 判断是否在球的背面
    let h1 = Cesium.Cartesian3.distance(scene.camera.position, this.position);
    let h2 = scene.camera.positionCartographic.height + this.viewer.scene.globe.ellipsoid.maximumRadius;

    let angle = Cesium.Cartesian3.angleBetween(scene.camera.position, this.position);
    if (h1 > h2 || angle > this.backAngle) {
      this.$view.hide();
      return;
    } else {
      this.$view.show();
    }

    // 判断是否在球的背面
    let x = point.x;
    let y = point.y - this.$view.height();
    if (this.anchor) {
      x += this.anchor[0];
      y += this.anchor[1];
    } else {
      x -= this.$view.width() / 2; // 默认为div下侧中心点；
    }

    this.$view.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');
  }

  setVisible(val) {
    this._visible = val;
    if (val) this.$view.show();
    else this.$view.hide();
  }

  destroy() {
    this.viewer.scene.postRender.removeEventListener(this.updateViewPoint, this);
    this.$view.remove();

    this.$view = null;
    this.position = null;
    this.anchor = null;
    this.viewer = null;
  }

}

export default DivPoint;