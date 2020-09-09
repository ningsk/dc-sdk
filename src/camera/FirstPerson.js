/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-24 13:19:53
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-07 10:04:01
 */

import Cesium from "cesium";

var cameraFunc; //键盘漫游  第一人称漫游

export function bind(viewer) {
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

  var handler = new Cesium.ScreenSpaceEventHandler(canvas);

  handler.setInputAction(function (movement) {
    flags.looking = true;
    mousePosition = startMousePosition = _Cesium2.default.Cartesian3.clone(
      movement.position
    );
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

  handler.setInputAction(function (movement) {
    mousePosition = movement.endPosition;
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(function (position) {
    flags.looking = false;
  }, Cesium.ScreenSpaceEventType.LEFT_UP);

  handler.setInputAction(function (delta) {
    if (delta > 0) {
      speedRatio = speedRatio * 0.8;
    } else {
      speedRatio = speedRatio * 1.2;
    }
    console.log(delta);
  }, Cesium.ScreenSpaceEventType.WHEEL);

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
    var up = Cesium.Cartesian3.normalize(
      camera.position,
      new Cesium.Cartesian3()
    );

    // right = direction * up
    var right = Cesium.Cartesian3.cross(direction, up, new Cesium.Cartesian3());

    direction = Cesium.Cartesian3.cross(up, right, new Cesium.Cartesian3());

    direction = Cesium.Cartesian3.normalize(direction, direction);
    direction = Cesium.Cartesian3.multiplyByScalar(
      direction,
      distance,
      direction
    );

    camera.position = Cesium.Cartesian3.add(
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
      var up = Cesium.Cartesian3.normalize(
        camera.position,
        new Cesium.Cartesian3()
      );

      // right = direction * up
      var right = Cesium.Cartesian3.cross(
        direction,
        up,
        new Cesium.Cartesian3()
      );
      // up = right * direction
      up = Cesium.Cartesian3.cross(right, direction, new Cesium.Cartesian3());

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

export function unbind(viewer) {
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
