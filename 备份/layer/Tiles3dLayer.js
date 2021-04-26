class Tiles3dLayer extends BaseLayer {
  //========== 构造方法 ========== 
  constructor(viewer, options) {
    super(viewer, options)
    this.hasOpacity = true;
  }

  add() {
    if (this.tileset) {
      if (!this.viewer.scene.primitives.contains(this.tileset)) this.viewer.scene.primitives.add(this.tileset);
    } else {
      this.initData();
    }
    _get(Tiles3dLayer.prototype.__proto__ || Object.getPrototypeOf(Tiles3dLayer.prototype), 'add', this).call(this);
  }
  //移除

  remove() {
    if (Cesium.defined(this.options.visibleDistanceMax)) this.viewer.scene.camera.changed.removeEventListener(this.updateVisibleDistance,
      this);

    //解除绑定的事件 
    if (this.tileset) {
      this.tileset.initialTilesLoaded.removeEventListener(this.onInitialTilesLoaded, this);
      this.tileset.allTilesLoaded.removeEventListener(this.onAllTilesLoaded, this);

      if (this.viewer.scene.primitives.contains(this.tileset)) this.viewer.scene.primitives.remove(this.tileset);

      delete this.tileset;
    }
    if (this.boundingSphere) delete this.boundingSphere;
    _get(Tiles3dLayer.prototype.__proto__ || Object.getPrototypeOf(Tiles3dLayer.prototype), 'remove', this).call(this);
  }
  //定位至数据区域

  centerAt(duration) {
    if (this.options.extent || this.options.center) {
      this.viewer.mars.centerAt(this.options.extent || this.options.center, {
        duration: duration,
        isWgs84: true
      });
    } else if (this.boundingSphere) {
      this.viewer.camera.flyToBoundingSphere(this.boundingSphere, {
        offset: new Cesium.HeadingPitchRange(0.0, -0.5, this.boundingSphere.radius * 2),
        duration: duration
      });
    }
  }
  initData() {
    var _this2 = this;

    this.tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset((0, _util.getProxyUrl)(this.options)));
    this.tileset.eventTarget = this;
    this.tileset._config = this.options;

    for (var key in this.options) {
      if (key == "url" || key == "type" || key == "style" || key == "classificationType") continue;
      try {
        this.tileset[key] = this.options[key];
      } catch (e) {}
    }
    if (this.options.style) {
      //设置style
      this.tileset.style = new Cesium.Cesium3DTileStyle(this.options.style);
    }

    //绑定一些事件 
    this.tileset.initialTilesLoaded.addEventListener(this.onInitialTilesLoaded, this);
    this.tileset.allTilesLoaded.addEventListener(this.onAllTilesLoaded, this);

    this.tileset.readyPromise.then(function(tileset) {
      _this2.fire(_MarsClass.eventType.loadBefore, {
        tileset: tileset
      });

      if (_this2.hasOpacity && _this2._opacity != 1) {
        //透明度
        _this2.setOpacity(_this2._opacity);
      }

      //记录模型原始的中心点
      var boundingSphere = tileset.boundingSphere;
      _this2.boundingSphere = boundingSphere;

      if (tileset._root && tileset._root.transform) {
        _this2.orginMatrixInverse = Cesium.Matrix4.inverse(Cesium.Matrix4.fromArray(tileset._root.transform), new Cesium
          .Matrix4());

        //缩放
        if (_this2.options.scale > 0 && _this2.options.scale != 1) {
          tileset._root.transform = Cesium.Matrix4.multiplyByUniformScale(tileset._root.transform, _this2.options
            .scale, tileset._root.transform);
        }
      }

      var position = boundingSphere.center; //模型原始的中心点
      _this2.positionCenter = position;
      var catographic = Cesium.Cartographic.fromCartesian(position);

      var height = Number(catographic.height.toFixed(2));
      var longitude = Number(Cesium.Math.toDegrees(catographic.longitude).toFixed(6));
      var latitude = Number(Cesium.Math.toDegrees(catographic.latitude).toFixed(6));
      _this2.originalCenter = {
        x: longitude,
        y: latitude,
        z: height
      };
      marslog.log((_this2.options.name || "") + " 模型原始位置:" + JSON.stringify(_this2.originalCenter));

      //转换坐标系【如果是高德谷歌国测局坐标系时转换坐标进行加偏，其它的原样返回】
      var rawCenter = _this2.viewer.mars.point2map(_this2.originalCenter);
      if (rawCenter.x != _this2.originalCenter.x || rawCenter.y != _this2.originalCenter.y || _this2.options.offset !=
        null) {

        _this2.options.offset = _this2.options.offset || {}; //配置信息中指定的坐标信息或高度信息
        _this2.options.rotation = _this2.options.rotation || {};

        if (_this2.options.offset.x && _this2.options.offset.y) {
          _this2.options.offset = _this2.viewer.mars.point2map(_this2.options.offset); //转换坐标系【如果是高德谷歌国测局坐标系时转换坐标进行加偏，其它的原样返回】
        }

        var offsetopt = {
          x: _this2.options.offset.x || rawCenter.x,
          y: _this2.options.offset.y || rawCenter.y,
          z: _this2.options.offset.z || 0,
          rotation_z: _this2.options.rotation.z || _this2.options.offset.heading,
          rotation_x: _this2.options.rotation.x,
          rotation_y: _this2.options.rotation.y,
          axis: _this2.options.axis,
          scale: _this2.options.scale,
          transform: _this2.options.offset.hasOwnProperty("transform") ? _this2.options.offset.transform : _this2
            .options.offset.heading != null || _this2.options.rotation.z != null
        };

        if (_this2.options.offset.z == "-height") {
          offsetopt.z = -height + 5;
          _this2.updateMatrix(offsetopt);
        } else if (_this2.options.offset.z == "auto") {
          _this2.autoHeight(position, offsetopt);
        } else {
          _this2.updateMatrix(offsetopt);
        }
      }

      if (_this2.options.flyTo) {
        if (_this2.viewer.mars.isFlyAnimation()) {
          _this2.viewer.mars.openFlyAnimationEndFun = function() {
            _this2.centerAt(0);
          };
        } else {
          _this2.centerAt(0);
        }
      }

      if (Cesium.defined(_this2.options.visibleDistanceMax)) _this2.bindVisibleDistance();

      _this2.fire(_MarsClass.eventType.load, {
        tileset: tileset
      });
    });
  }
  //刷新事件

  refreshEvent() {
    if (this.tileset == null) return false;

    this.tileset.eventTarget = this;
    this.tileset.contextmenuItems = this.options.contextmenuItems;
    return true;
  }
  //该回调只执行一次

  onInitialTilesLoaded(e) {
    this.fire(_MarsClass.eventType.initialTilesLoaded, {
      tile: e
    });
  }
  //该回调会执行多次，视角变化后重新加载一次完成后都会回调

  onAllTilesLoaded(e) {
    this.fire(_MarsClass.eventType.allTilesLoaded, {
      tile: e
    });
  }
  autoHeight(position, offsetopt) {
    var that = this;
    //求地面海拔
    (0, _point.getSurfaceTerrainHeight)(this.viewer.scene, position, {
      asyn: true, //是否异步求准确高度 
      callback: function callback(newHeight, cartOld) {
        if (newHeight == null) return;

        var offsetZ = newHeight - that.originalCenter.z + 1;
        offsetopt.z = offsetZ;

        that.updateMatrix(offsetopt);
      }
    });
  }
  //变换原点坐标

  updateMatrix(offsetopt) {
    if (this.tileset == null) return;

    marslog.log((this.options.name || "") + " 模型修改后位置:" + JSON.stringify(offsetopt));

    this.positionCenter = Cesium.Cartesian3.fromDegrees(offsetopt.x, offsetopt.y, offsetopt.z);

    (0, _tileset.updateMatrix)(this.tileset, offsetopt);
  }

  //设置透明度

  setOpacity(value) {
    this._opacity = value;

    if (this.options.onSetOpacity) {
      this.options.onSetOpacity(value); //外部自定义处理
    } else {
      if (this.tileset) {
        this.tileset.style = new Cesium.Cesium3DTileStyle({
          color: "color() *vec4(1,1,1," + value + ")"
        });
      }
    }
  }
  showClickFeature(value) {
    if (this.tileset) {
      this.tileset._config.showClickFeature = value;
    } else {
      this.options.showClickFeature = value;
    }
  }
  //绑定

  bindVisibleDistance() {
    this.viewer.scene.camera.changed.addEventListener(this.updateVisibleDistance, this);
  }
  updateVisibleDistance() {
    if (!this._visible) return;
    if (this.viewer.scene.mode !== Cesium.SceneMode.SCENE3D) return;
    if (!this.tileset || !this.boundingSphere || !this.positionCenter) return;

    var camera_distance = Cesium.Cartesian3.distance(this.positionCenter, this.viewer.camera.positionWC);
    if (camera_distance > this.options.visibleDistanceMax + 100000) {
      //在模型的外包围外
      this.tileset.show = false;
    } else {
      var target = (0, _point.pickCenterPoint)(this.viewer.scene); //取屏幕中心点坐标
      if (Cesium.defined(target)) {
        var camera_distance = Cesium.Cartesian3.distance(target, this.viewer.camera.positionWC);
        this.tileset.show = camera_distance < this.options.visibleDistanceMax;
      } else {
        this.tileset.show = true;
      }
    }
  }

  get layer() {
    return this.tileset;
  }
  get model() {
    return this.tileset;
  }
}
//[静态属性]本类中支持的事件类型常量


Tiles3dLayer.event = {
load: _MarsClass.eventType.load,
loadBefore: _MarsClass.eventType.loadBefore,
initialTilesLoaded: _MarsClass.eventType.initialTilesLoaded,
allTilesLoaded: _MarsClass.eventType.allTilesLoaded,
click: _MarsClass.eventType.click,
mouseOver: _MarsClass.eventType.mouseOver,
mouseOut: _MarsClass.eventType.mouseOut
};

export default Tiles3dLayer
