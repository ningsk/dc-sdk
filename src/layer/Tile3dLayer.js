/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 09:04:46
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-08 11:02:12
 */
import { BaseLayer } from "./BaseLayer";
import Cesium from "cesium";
import Axis from "./Axis";
import { Util } from "../utils";
import { Point } from "../point";

export var Tile3dLayer = BaseLayer.extend({
  model: null,
  originalCenter: null,
  boundingSphere: null,
  // 添加
  add: function () {
    if (this.model) {
      this.viewer.scene.primitives.add(this.model);
    } else {
      this.initData();
    }
  },
  // 移除
remove: function() {
  this.viewer.scene.primitives.remove(this.model);
  this.model = null;
},

// 定位到数据区域
centerAt: function(duration) {
  if (this.config.extent || this.config.center) {
    this.viewer.mars.centerAt(this.config.extent || this.config.center, {
      duration: duration,
      isWgs84: true
    });
  } else if (this.boundingSphere){
    this.viewer.camera.flyToBoundingSphere(this.boundingSphere, {
      offset: new Cesium.HeadingPitchRange(0.0, -0.5, this.boundingSphere)
      duration: duration
    });
  }
},

initData: function() {
  // 默认值
  this.config.maximumScreenSpaceError = this.config.maximumScreenSpaceError || 2; // 默认16
  this.config.maximumMemoryUsage = this.config.maximumMemoryUsage || 2048; // 提升内存到2GB， 默认512MB
  this.model = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset(this.config));
  this.model._config = this.config;
  this.model.tooltip = this.config.tooltip;
  this.model.popup = this.config.popup;
  var that = this;
  this.model.readyPromise.then((tileset) => {
    if (that.hasOpacity && that._opacity != -1) {
      // 透明度
      that.setOpacity(that._opacity);
    }
    that.updateAxis(that.config.axis); // 变换轴

    // 记录模型原始的中心点
    var boundingSphere = tileset.boundingSphere;
    that.boundingSphere = boundingSphere;
    if (tileset._root && tileset._root.transform) {
      that.originMatrixInverse = Cesium.Matrix4.inverse(Cesium.Matrix4.fromArray(tileset._root.transform), new Cesium.Matrix4());
      if (that.config.scale > 0 && that.config.scale != -1) {
        tileset._root.transform = Cesium.Matrix4.multiplyByUniformScale(tileset._root.transform, that.config.scale, tileset._root.transform);
      }
    }

    var position = boundingSphere.center; // 模型原始的中心店
    var cartographic = Cesium.Cartographic.fromCartesian(position);

    var height = Number(cartographic.height.toFixed(2));
    var longitude = Number(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6));
    var latitude = Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6));
    that.originalCenter = {
      x: longitude,
      y: latitude,
      z: height
    }
    console.log(that.config.name || "") + " 模型原始位置：" + JSON.stringify(that.originalCenter);

    // 转换坐标系【如果是高德、谷歌、国测局坐标系转换坐标进行加偏，其他的原样返回】
    var rawCenter = that.viewer.mars.point2map(that.originalCenter);
    if (rawCenter.x != that.originalCenter.x || rawCenter.y != that.originalCenter.y || that.config.offset != null) {
      that.config.offset = that.config.offset || {}; // 配置信息中指定的坐标信息或高度信息
      if (that.config.offset.x && that.config.offset.y) {
        that.config.offset = that.viewer.mars.point2map(that.config.offset); // 转换坐标系【如果是高德、谷歌、国测局坐标系转换坐标进行加偏，其他的原样返回】
      }
      var offsetopt = {
        x: that.config.offset.x || rawCenter.x,
        y: that.config.offset.y || rawCenter.y,
        z: that.config.offset.z || 0,
        heading: that.config.offset.heading
      };

      if (that.config.offset.z == "-height") {
        offsetopt.z = -height + 5;
        that.updateMatrix(offsetopt);
      } else if (that.config.offset.z == "auto") {
        that.autoHeight(position, offsetopt);
      } else {
        that.updateMatrix(offsetopt);
      }
    }
    if (!that.viewer.isFlyAnimation() && that.config.flyTo) {
      that.centerAt(0);
    }
    if (that.config.callback) {
      that.config.callback(tileset);
    }
  });
},

/**
 * 变换轴，兼容旧版本数据z轴方向不对的情况
 * 如果可以修改模型json源文件，可以在json文件里面加了一行来修正： "gltfUpAxis": "Z",
 * @param {*} axis 
 */
updateAxis: function(axis) {
  if (axis == null) {
    return;
  }
  var rightAxis;
  switch (axis.toUpperCase()) {
    case "Y_UP_TO_Z_UP":
      rightAxis = Axis.Y_UP_TO_Z_UP;
      break;
    case "Z_UP_TO_Y_UP":
      rightAxis = Axis.Z_UP_TO_Y_UP;
      break;
    case "X_UP_TO_Z_UP":
      rightAxis = Axis.X_UP_TO_Z_UP;
      break;
    case "Z_UP_TO_X_UP":
      rightAxis = Axis.Z_UP_TO_X_UP;
      break;
    case "X_UP_TO_Y_UP":
      rightAxis = Axis.X_UP_TO_Y_UP;
      break;
    case "Y_UP_TO_X_UP":
      rightAxis = Axis.Y_UP_TO_X_UP;
      break;      
  }

  if (rightAxis == null) {
    return;
  }

  this.model._root.transform = Cesium.Matrix4.multiplyTransformation(this.model._root.transform,
    rightAxis, this.model._root.transform);

},

// 变换原点坐标【x,y 不能多次修改】
updateMatrix: function(offsetopt) {
  if (this.model == null) {
    return;
  }
  console.log(" 模型修改后位置: " + JSON.stringify(offsetopt));

  var isOK = false;
  if (offsetopt.heading != null && this.model._root && this.model._root.transform) {
    // 有自带世界矩阵，进行旋转操作。
    var mat = Cesium.Matrix4.fromArray(this.model._root.transform);
    var pos = Cesium.Matrix4.fromArray(mat, new Cesium.Cartesian3());
    var wpos = Cesium.Cartographic.fromCartesian(pos);
    if (wpos) {
      var position = Cesium.Cartesian3.fromDegrees(offsetopt.x, offsetopt.y, offsetopt.z);
      var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(
        Cesium.Math.toRadians(offsetopt.heading || 0);
      ));
      Cesium.Matrix4.multiply(mat, rotationX, mat);
      if (this.config.scale > 0 && this.config.scale != 1) {
        Cesium.Matrix4.multiplyByUniformScale(mat, this.config.scale, mat);
        isOK = true;
      }
    }
    if (isOK) {
      var boundingSphere = this.model.boundingSphere;
      var cartographic = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
      var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
      var offset = Cesium.Cartesian3.fromDegrees(offsetopt.x, offsetopt.y, offsetopt.z);
      var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
      this.model.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    }
  }
},

autoHeight: function(position, offsetopt) {
  var that = this;
  // 求地面海拔
  Util.terrainPolyline({
    viewer: this.viewer,
    positions: [position, position],
    callback: (raisedPositions, noHeight) => {
      if (raisedPositions == null || raisedPositions.length == 0 || noHeight) {
        return;
      }
      var point = Point.formatPosition(raisedPositions[0]);
      var offsetZ  = point.z - that.originalCenter.z + 1;
      offsetopt.z = offsetZ;
      that.updateMatrix(offsetopt);
    }
  });
},
hasOpacity: true,

// 设置透明度
setOpacity:function(value) {
  this._opacity = value;
  if (this.model) {
    this.model.style = new Cesium.Cesium3DTileStyle({
      color: "color() *vec4(1,1,1," + value + ")"
    });
  }
}
});
