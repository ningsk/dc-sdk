/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-13 14:11:41
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 08:40:52
 */
import * as Cesium from "cesium";
import { getCurrentMousePosition } from "../core/PointUtil";

import $ from "jquery";

var viewer;
var handler;

function init(_viewer) {
  viewer = _viewer;

  //添加弹出框
  var infoDiv =
    '<div id="tooltip-view" class="cesium-popup" style="display:none;">' +
    '     <div class="cesium-popup-content-wrapper  cesium-popup-background">' +
    '         <div id="tooltip-content" class="cesium-popup-content cesium-popup-color"></div>' +
    "     </div>" +
    '     <div class="cesium-popup-tip-container"><div class="cesium-popup-tip  cesium-popup-background"></div></div>' +
    "</div> ";
  $("#" + viewer._container.id).append(infoDiv);

  handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  //鼠标移动事件
  handler.setInputAction(
    mouseMovingPicking,
    Cesium.ScreenSpaceEventType.MOUSE_MOVE
  );
}

var lastEntity;

//鼠标移动事件
function mouseMovingPicking(event) {
  $(".cesium-viewer").css("cursor", "");

  if (
    viewer.scene.screenSpaceCameraController.enableRotate === false ||
    viewer.scene.screenSpaceCameraController.enableTilt === false ||
    viewer.scene.screenSpaceCameraController.enableTranslate === false
  ) {
    close();
    return;
  }

  var position = event.endPosition;
  var pickedObject = viewer.scene.pick(position);
  if (pickedObject && Cesium.defined(pickedObject.id)) {
    //普通entity对象 && viewer.scene.pickPositionSupported
    var entity = pickedObject.id;

    if (entity.popup || entity.click || entity.cursorCSS) {
      $(".cesium-viewer").css("cursor", entity.cursorCSS || "pointer");
    }

    if (!entity.tooltip) {
      close();
      return;
    }

    if (entity.billboard || entity.label || entity.point) {
      if (lastEntity == entity) return;
      lastEntity = entity;
    }

    var cartesian = getCurrentMousePosition(viewer.scene, position);
    show(entity, cartesian, position);
  } else if (pickedObject && Cesium.defined(pickedObject.primitive)) {
    //primitive对象 && viewer.scene.pickPositionSupported
    var primitive = pickedObject.primitive;
    if (primitive.popup || primitive.click || primitive.cursorCSS) {
      $(".cesium-viewer").css("cursor", primitive.cursorCSS || "pointer");
    }

    if (!primitive.tooltip) {
      close();
      return;
    }

    var cartesian = getCurrentMousePosition(viewer.scene, position);
    show(primitive, cartesian, position);
  } else {
    close();
  }
}

function show(entity, cartesian, position) {
  if (entity == null || entity.tooltip == null) return;

  //计算显示位置
  if (position == null)
    position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      viewer.scene,
      cartesian
    );
  if (position == null) {
    close();
    return;
  }

  var $view = $("#tooltip-view");

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

  $("#tooltip-content").html(inhtml);
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
  $("#tooltip-content").empty();
  $("#tooltip-view").hide();
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

// ================= 模块对外公开的属性和方法  ====================
export { init, show, close, destroy };
