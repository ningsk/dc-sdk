/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-13 14:23:37
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-10 10:46:40
 */

import Cesium from "cesium";

/**
 * 格式化
 * @param {*} num 数字
 * @param {*} digits 小数位数
 */
export function formatNum(num, digits) {
  //  var pow = Math.pow(10, (digits === undefined ? 6 : digits));
  //  return Math.round(num * pow) / pow;
  return Number(num.toFixed(digits || 0));
}

/**
 * 格式化坐标点未可理解的格式（如：经度x：123.345345、纬度y：31.324343、高度：123.1）
 * @param {*} position
 */
export function formatPosition(position) {
  var carto = Cesium.Cartographic.fromCartesian(position);
  var result = {};
  result.y = this.formatNum(Cesium.Math.toDegrees(carto.latitude), 6);
  result.x = this.formatNum(Cesium.Math.toDegrees(carto.longitude), 6);
  result.z = this.formatNum(carto.height, 2);
  return result;
}

/**
 * 获取坐标数组中最高高程值
 * @param {Array} positions Array<Cartesian3> 笛卡尔空间坐标数组
 * @param {Number} defaultVal 默认高程值
 */
export function getMaxHeight(positions, defaultVal) {
  if (defaultVal == null) {
    defaultVal = 0;
  }
  var maxHeight = defaultVal;
  if (positions == null || positions.length == 0) {
    return maxHeight;
  }

  for (var i = 0; i < positions.length; i++) {
    var tempCarto = Cesium.Cartographic.fromCartesian(positions[i]);
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
export function addPositionsHeight(positions, addHeight) {
  addHeight = Number(addHeight) || 0;
  if (positions instanceof Array) {
    var arr = [];
    for (var i = 0, len = positions.length; i < len; i++) {
      var car = Cesium.Cartographic.fromCartesian(positions[i]);
      var point = Cesium.Cartesian3.fromRadians(
        car.longitude,
        car.latitude,
        car.height + addHeight
      );
      arr.push(point);
    }
    return arr;
  } else {
    var car = Cesium.Cartographic.fromCartesian(positions);
    return Cesium.Cartesian3.fromRadians(
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
export function setPositionsHeight(positions, height) {
  height = Number(height) || 0;
  if (positions instanceof Array) {
    var arr = [];
    for (var i = 0, len = positions.length; i < len; i++) {
      var car = Cesium.Cartographic.fromCartesian(positions[i]);
      var point = Cesium.Cartesian3.fromRadians(
        car.longitude,
        car.latitude,
        height
      );
      arr.push(point);
    }
    return arr;
  } else {
    var car = Cesium.Cartographic.fromCartesian(positions);
    return Cesium.Cartesian3.fromRadians(car.longitude, car.latitude, height);
  }
}

/**
 * 设置坐标中海拔高度为贴地或贴模型的高度（sampleHeight需要数据在视域范围内）
 * @param {*} viewer
 * @param {*} position
 */
export function updateHeightForClampToGround(viewer, position) {
  //TODO viewer?
  var carto = Cesium.Cartographic.fromCartesian(position);
  var _heightNew = viewer.scene.sampleHeight(carto);
  if (_heightNew != null && _heightNew > 0) {
    var positionNew = Cesium.Cartesian3.fromRadians(
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
export function getCurrentMousePosition(scene, position, noPickEntity) {
  var cartesian;
  // 模型上提取坐标
  var pickedObject = scene.pick(position);
  if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
    // pickPositionSupported: 判断是否支持深度拾取
    if (
      noPickEntity == null ||
      (noPickEntity &&
        pickedObject.id !== noPickEntity &&
        pickedObject.primitive !== noPickEntity)
    ) {
      var cartesian = scene.pickPosition(position);
      if (Cesium.defined(cartesian)) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var height = cartographic.height; // 模型高度
        if (height >= 0) {
          return cartesian;
        }
        // 不是entity时，支持3dtitles地下
        if (!Cesium.defined(pickedObject.id) && height >= -500) {
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
  if (scene.mode === Cesium.SceneMode.SCENE3D) {
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
export function getCenter(viewer, isToWgs) {
  var scene = viewer.scene;
  var target = pickCenterPoint(scene);
  var bestTarget = target;
  if (!target) {
    var globe = scene.globe;
    var carto = scene.camera.positionCartographic.clone();
    var height = globe.getHeight(carto);
    carto.height = height || 0;
    bestTarget = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
  }

  var result = this.formatPosition(bestTarget);
  if (isToWgs) {
    result = viewer.card.point2wgs(result); // 坐标转换为wgs
  }
  // 获取地球中心点世界位置与摄像机的世界位置之间的距离
  var distance = Cesium.Cartesian3.distance(
    bestTarget,
    viewer.scene.camera.positionWC
  );
  result.cameraZ = distance;
  return result;
}

export function pickCenterPoint(scene) {
  var canvas = scene.canvas;
  var center = new Cesium.Cartesian2(
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
export function getExtent(viewer, isToWgs) {
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
    new Cesium.Cartesian2(0, 0),
    ellipsoid
  );
  if (car3_lt) {
    // 在椭球体上
    var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
    extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
    extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
  } else {
    // 不在椭球体上
    var xMax = canvas.width / 2;
    var yMax = canvas.height / 2;
    var car3_lt2;
    // 这里每次10像素递加， 一是10像素相差不大，二是为了提高程序运行效率
    for (var yIdx = 0; yIdx <= yMax; yIdx += 10) {
      var xIdx = yIdx <= xMax ? yIdx : xMax;
      car3_lt2 = viewer.camera.pickEllipsoid(
        new Cesium.Cartesian2(xIdx, yIdx),
        ellipsoid
      );
      if (car3_lt2) break;
    }
    if (car3_lt2) {
      var carto_lt = ellipsoid.cartesianToCartographic(car3_lt2);
      extend.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
      extend.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
    }
  }

  // canvas 右下角
  var car3_rb = viewer.camera.pickEllipsoid(
    new Cesium.Cartesian2(canvas.width, canvas.height),
    ellipsoid
  );
  if (car3_rb) {
    // 在椭球体上
    var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
    extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
    extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
  } else {
    // 不在椭球体上
    var xMax = canvas.width / 2;
    var yMax = canvas.height / 2;
    var car3_rb2;
    // 这里每次10像素递减，一是10像素相差不大，二是为了提高程序运行效率
    for (var yIdx = canvas.height; yIdx >= yMax; yIdx -= 10) {
      var xIdx = yIdx >= xMax ? yIdx : xMax;
      car3_rb2 = view.camera.pickEllipsoid(
        new Cesium.Cartesian2(xIdx, yIdx),
        ellipsoid
      );
      if (car3_rb) break;
    }
    if (car3_rb2) {
      var carto_rb = ellipsoid.cartesianToCartographic(car3_rb2);
      extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
      extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
    }
  }

  if (isToWgs) {
    // 坐标转换为wgs
    var pt1 = viewer.card.point2wgs({
      x: extent.xmin,
      y: extent.ymin,
    });
    extent.xmin = pt1.x;
    extent.ymin = pt1.y;
    var pt2 = viewer.card.point2wgs({
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
export function getCameraView(viewer, isToWgs) {
  var camera = viewer.camera;
  var position = camera.positionCartographic;

  var bookmark = {};
  bookmark.y = this.formatNum(Cesium.Math.toDegrees(position.latitude), 6);
  bookmark.x = this.formatNum(Cesium.Math.toDegrees(position.longitude), 6);
  bookmark.z = this.formatNum(position.height, 2);
  bookmark.heading = this.formatNum(
    Cesium.Math.toDegrees(camera.heading || -90),
    1
  );
  bookmark.pitch = this.formatNum(Cesium.Math.toDegrees(camera.roll || 0), 1);

  if (isToWgs) {
    bookmark = viewer.card.point2wgs(bookmark); // 坐标转换wgs
  }
  return bookmark;
}
