import { DomUtil, tooltip } from "leaflet";
import Point from "../point/Point";
import { destroyObject } from "cesium";

/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-13 14:11:41
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-18 17:05:40
 */
class Tooltip {
  constructor(_viewer) {
    this.viewer = _viewer;
    let infoDiv = '<div id="tooltip-view" class="cesium-popup" style="display:none;">' +
    '     <div class="cesium-popup-content-wrapper  cesium-popup-background">' +
    '         <div id="tooltip-content" class="cesium-popup-content cesium-popup-color"></div>' + '     </div>' +
    '     <div class="cesium-popup-tip-container"><div class="cesium-popup-tip  cesium-popup-background"></div></div>' +
    '</div> ';
    DomUtil.get(this.viewer._container.id).appendChild(infoDiv);
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    // 鼠标移动事件
    this.handler.setInputAction(this.mouseMovingPicking, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.lastEntity = null;
  }

  // 鼠标移动事件
  mouseMovingPicking(event) {
    document.getElementsByClassName('cesium-viewer')[0].style.cursor = "";
    if (this.viewer.scene.screenSpaceCameraController.enableRotate === false || this.viewer.scene.screenSpaceCameraController.enableTilt ===
        false || this.viewer.scene.screenSpaceCameraController.enableTranslate === false) {
      this.close();
      return;
    }
    let position = event.endPosition;
    let pickedObject = this.viewer.scene.pick(position);
    if (pickedObject && Cesium.defined(pickedObject.id)) {
      // 普通entity对象 && viewer.scene.pickPositionSupported
      let entity = pickedObject.id;
      if (entity.popup || entity.click || entity.cursorCSS) {
        document.getElementsByClassName('cesium-viewer')[0].style.cursor = entity.cursorCSS || 'pointer';
      }
      if (!entity.tooltip) {
        this.close();
        return;
      }

      if (entity.billboard || entity.label || entity.point) {
        if (this.lastEntity == entity) {
          return;
        }
        this.lastEntity = entity;
      }

      let cartesian = Point.getCurrentMousePosition(this.viewer.scene, position);
      this.show(entity, cartesian, position);
    } else if (pickedObject && Point.getCurrentMousePosition(this.viewer.scene, position)) {
      // primitive对象 && viewer.scene.pickPositionSupported
      let primitive = pickedObject.primitive;
      if (primitive.popup || primitive.click || primitive.cursorCSS) {
        document.getElementsByClassName("cesium-viewer")[0].style.cursor = primitive.cursorCSS || 'pointer';
      }

      if (!primitive.tooltip) {
        this.close();
        return;
      }

      let cartesian = Point.getCurrentMousePosition(this.viewer.scene, position);
      this.show(primitive, cartesian, position);
    } else {
      this.close();
    }
  }

  show(entity, cartesian, position) {
    if (entity == null || entity.tooltip == null) {
      return;
    }
    // 计算显示位置
    if (position == null) {
      position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, cartesian);
    }
    if (position == null) {
      this.close();
      return;
    }

    let $view = DomUtil.get('#tooltip-view');

    // 显示内容
    let inHtml;

    if (typeof entity.tooltip === 'object') {
      inHtml = entity.tooltip.html;
      if (entity.tooltip.check) {
        if (entity.tooltip.check) {
          if (!entity.tooltip.check()) {
            this.close();
            return;
          }
        }
      } else {
        inHtml = entity.tooltip;
      }

      //TODO 

    }


  }

  close() {
    this.lastEntity = null;
  }

  destroy() {
    this.close();
    this.handler.destroy();
    
  }

}

export default Tooltip;