//一些默认值的修改
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(89.5, 20.4, 110.4, 61.2); //更改默认视域

//Viewer扩展

class ViewerEx extends BaseClass {
  //========== 构造方法 ==========
  constructor(viewer, config) {
    super()
    _this.viewer = viewer;
    _this.viewer.mars = _this; //要记录下，内部用
    _this.config = Cesium.defaultValue(config, {});

    _this._isFlyAnimation = false;
    _this.crs = Cesium.defaultValue(_this.config.crs, '3857'); //坐标系


    //优化viewer默认参数相关的
    _this._optimization();
    //根据参数进行设置相关的
    _this._initForOpts();
    //绑定处理的事件
    _this._initEvent();
    //绑定添加相关控件
    _this._addControls();
    //处理图层
    _this._initLayers();
    return _this;
  }
  //========== 对外属性 ==========
  //标识只拾取模型上的点


  onClick(fun) {
    //兼容历史命名
    this.on(_MarsClass2.eventType.click, fun);
  }

  //键盘漫游

  //========== 方法 ==========

  //优化viewer默认参数相关的
  _optimization() {
    var that = this;
    var viewer = this.viewer;

    //二三维切换不用动画
    if (this.viewer.sceneModePicker) this.viewer.sceneModePicker.viewModel.duration = 0.0;

    //解决Cesium显示画面模糊的问题 https://zhuanlan.zhihu.com/p/41794242 【1.63已修复，1.66又出现了】
    this.viewer._cesiumWidget._supportsImageRenderingPixelated = Cesium.FeatureDetection.supportsImageRenderingPixelated();
    this.viewer._cesiumWidget._forceResize = true;
    if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
      var _dpr = window.devicePixelRatio;
      // 适度降低分辨率
      while (_dpr >= 2.0) {
        _dpr /= 2.0;
      }
      this.viewer.resolutionScale = _dpr;
    }
  }
  //根据参数进行设置相关的

  _initForOpts() {
    var that = this;
    this.viewer.cesiumWidget.creditContainer.style.display = "none"; //去cesium logo

    //默认定位地点相关设置，默认home键和初始化镜头视角
    if (this.viewer.homeButton) {
      this.viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo) {
        that.centerAtHome();
        commandInfo.cancel = true;
      });
    }
    this.centerAtHome({
      duration: 0
    });

    //地球一些属性设置
    var scene = this.viewer.scene;
    scene.globe.baseColor = Cesium.Color.fromCssColorString(this.config.baseColor || "#546a53"); //地表背景色

    if (this.config.backgroundColor) scene.backgroundColor = Cesium.Color.fromCssColorString(this.config.backgroundColor); //空间背景色


    if (this.config.style) {
      //深度监测
      scene.globe.depthTestAgainstTerrain = this.config.style.testTerrain;

      //光照渲染（阳光照射区域高亮）
      scene.globe.enableLighting = this.config.style.lighting;

      //大气渲染
      scene.skyAtmosphere.show = this.config.style.atmosphere;
      scene.globe.showGroundAtmosphere = this.config.style.atmosphere;

      //雾化效果
      scene.fog.enabled = this.config.style.fog;

      //设置无地球模式 （单模型是可以设置为false）
      scene.globe.show = Cesium.defaultValue(this.config.style.globe, true);
      scene.moon.show = Cesium.defaultValue(this.config.style.moon, scene.globe.show);
      scene.sun.show = Cesium.defaultValue(this.config.style.sun, scene.globe.show);
      scene.skyBox.show = Cesium.defaultValue(this.config.style.skyBox, scene.globe.show);
    }

    //限制缩放级别
    scene.screenSpaceCameraController.maximumZoomDistance = Cesium.defaultValue(this.config.maxzoom, 20000000); //变焦时相机位置的最大值（以米为单位）
    scene.screenSpaceCameraController.minimumZoomDistance = Cesium.defaultValue(this.config.minzoom, 1); //变焦时相机位置的最小量级（以米为单位）。默认为1.0。


    scene.screenSpaceCameraController._zoomFactor = 3; //鼠标滚轮放大的步长参数
    scene.screenSpaceCameraController.minimumCollisionTerrainHeight = 15000000; //低于此高度时绕鼠标键绕圈，大于时绕视图中心点绕圈。
  }
  //绑定添加相关控件

  _addControls() {
    var that = this;

    //绑定popup
    this._popup = new _Popup.Popup(this.viewer, {});

    //绑定tooltip
    this._tooltip = new _Tooltip.Tooltip(this.viewer, {});

    //绑定键盘漫游
    this._keyboardRoam = new _KeyboardRoam.KeyboardRoam({
      viewer: this.viewer
    });

    //绑定右键菜单
    if (this.config.contextmenu) {
      this._contextmenu = new _ContextMenu.ContextMenu(this.viewer);

      this.contextmenuItems = this.defaultContextmenuItems;
      this._contextmenu.resetDefault = function() {
        //右键菜单还原为默认的
        that.contextmenuItems = that.defaultContextmenuItems;
      };
    }

    //导航工具栏控件
    if (this.config.navigation) {
      this._addNavigationWidget(this.config.navigation);
    }

    //鼠标提示控件
    if (this.config.location) {
      this._location = new _Location.Location(this.viewer, this.config.location);
    }

    //鼠标滚轮缩放美化样式
    if (this.config.mouseZoom && _util.isPCBroswer()) {
      this._mouseZoomStyle = new _MouseZoomStyle.MouseZoomStyle(this.viewer, this.config.mouseZoom);
    }
  }
  //绑定处理的事件

  _initEvent() {
    var _this2 = this;

    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.handler.setInputAction(function(event) {
      //单击事件
      _this2.fire(_MarsClass2.eventType.click, event);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.setInputAction(function(event) {
      //鼠标移动事件
      _this2.fire(_MarsClass2.eventType.mouseMove, event);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  //没有id的图层，进行id赋值处理

  getNextId() {
    while (this.arrIdx.indexOf(this._tempIdx) != -1) {
      this._tempIdx++;
    }
    this.arrIdx.push(this._tempIdx);
    return this._tempIdx;
  }
  //添加内部封装的BaseLayer图层到OperationalLayer进行图层控制

  addOperationalLayer(item) {
    var layer;
    if (item instanceof _BaseLayer.BaseLayer) {
      layer = item;
      item = layer.config;
    } else {
      var _visible = item.visible;
      delete item.visible;

      layer = new _BaseLayer.BaseLayer(this.viewer, item);
      layer._visible = _visible;

      if (!item.type) //外部通过bindToLayerControl添加的
        item.type = "base";
    }

    if (!item.name) item.name = "未命名";
    if (!item.id) item.id = this.getNextId();
    else {
      if (this.layers[item.id]) {
        marslog.warn("id:" + item.id + "冲突，请取一个比较大的数字，或请通过 viewer.mars.getNextId() 获取");
        item.id = this.getNextId();
      }
    }
    if (!item.pid) item.pid = -1;

    item.hasLayer = true;

    this.config.operationallayers.push(item);
    this.arrOperationallayers.push(layer);
    this.layers[item.id] = layer;

    return layer;
  }
  removeOperationalLayer(id) {
    for (var i = 0; i < this.config.operationallayers.length; i++) {
      var item = this.config.operationallayers[i];
      if (item.id == id) {
        this.config.operationallayers.splice(i, 1);
        break;
      }
    }
    for (var i = 0; i < this.arrOperationallayers.length; i++) {
      var item = this.arrOperationallayers[i];
      if (item.config.id == id) {
        this.arrOperationallayers.splice(i, 1);
        break;
      }
    }

    delete this.layers[id];
  }
  //处理图层

  _initLayers() {
    this.config.basemaps = this.config.basemaps || [];
    this.config.operationallayers = this.config.operationallayers || [];

    var basemapsCfg = this.config.basemaps;
    var operationallayersCfg = this.config.operationallayers;

    var layersCfg = []; //计算order

    //记录所有id，方便计算nextid
    this._tempIdx = 1;
    this.arrIdx = [];
    for (var i = 0; i < basemapsCfg.length; i++) {
      var item = basemapsCfg[i];

      if (item.id) this.arrIdx.push(item.id);
    }
    for (var i = 0; i < operationallayersCfg.length; i++) {
      var item = operationallayersCfg[i];
      if (item.id) this.arrIdx.push(item.id);
    }

    var objLayers = {}; //图层对象
    var arrBasemaps = []; //底图数组
    var arrOperationallayers = []; //可叠加图层

    //底图处理
    if (!this.config.baseLayerPicker) {
      //不能取消，如果取消，使用baseLayerPicker时无法切换了
      if (basemapsCfg && basemapsCfg.length > 0) {
        for (var i = 0; i < basemapsCfg.length; i++) {
          var item = basemapsCfg[i];
          if (!item.name) item.name = "未命名";
          if (!item.id) item.id = this.getNextId();
          if (!item.pid) item.pid = -1;

          if (item.visible && item.crs) this.crs = item.crs;

          var layer = _layer.createLayer(this.viewer, item, this.config.serverURL);
          if (layer) {
            item.hasLayer = true;
            objLayers[item.id] = layer;
            arrBasemaps.push(layer);

            if (this.config.onAddLayer) {
              //加图层回调方法
              this.config.onAddLayer(item, layer);
            }
          }

          layersCfg.push(item);
          if (item.type == "group" && item.layers) {
            for (var idx = 0; idx < item.layers.length; idx++) {
              var childitem = item.layers[idx];
              childitem.pid = item.id;
              childitem.id = this.getNextId();
              layersCfg.push(childitem);
            }
          }
        }
      }
    }
    this.arrBasemaps = arrBasemaps;

    //可叠加图层
    if (operationallayersCfg && operationallayersCfg.length > 0) {
      for (var i = 0; i < operationallayersCfg.length; i++) {
        var item = operationallayersCfg[i];
        if (!item.name) item.name = "未命名";
        if (!item.id) item.id = this.getNextId();
        if (!item.pid) item.pid = -1;

        var layer = _layer.createLayer(this.viewer, item, this.config.serverURL);
        if (layer) {
          item.hasLayer = true;
          arrOperationallayers.push(layer);
          objLayers[item.id] = layer;

          if (this.config.onAddLayer) {
            //加图层回调方法
            this.config.onAddLayer(item, layer);
          }
        }

        layersCfg.push(item);
        if (item.type == "group" && item.layers) {
          for (var idx = 0; idx < item.layers.length; idx++) {
            var childitem = item.layers[idx];
            childitem.pid = item.id;
            childitem.id = this.getNextId();
            layersCfg.push(childitem);
          }
        }
      }
    }
    this.arrOperationallayers = arrOperationallayers;
    this.layers = objLayers;

    //计算 顺序字段,
    for (var i = 0; i < layersCfg.length; i++) {
      var item = layersCfg[i];

      //计算层次顺序
      var order = Number(item.order);
      if (isNaN(order)) order = i;
      item.order = order;

      //图层的处理
      if (objLayers[item.id] != null) {
        objLayers[item.id].setZIndex(order);
      }
    }
  }
  getConfig() {
    return _util.clone(this.config, ["_layer", "_layers", "_parent"]);
  }

  //point的方法兼容到viewer.mars直接用

  getCenter(isToWgs) {
    return point.getCenter(this.viewer, isToWgs);
  }
  getExtent(opts) {
    return point.getExtent(this.viewer, opts);
  }
  getCameraView(isToWgs) {
    return point.getCameraView(this.viewer, isToWgs);
  }
  getSurfaceHeight(position, opts) {
    return point.getSurfaceHeight(this.viewer.scene, position, opts);
  }

  //键盘漫游，兼容历史方法

  keyboard(isbind, opts) {
    if (isbind) this._keyboardRoam.bind(opts);
    else this._keyboardRoam.unbind();
  }
  keyboardAuto() {
    return this._keyboardRoam.enable = !this._keyboardRoam.enable;
  }

  //获取指定图层 keyname默认为名称

  getLayer(key, keyname) {
    if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
      //直接传入config的object对象时
      if (Cesium.defined(key.id)) return this.layers[key.id];
    } else {
      if (keyname == null) {
        if (_util.isNumber(key)) keyname = "id";
        else keyname = "name";
      }

      var layersCfg = this.arrBasemaps;
      if (layersCfg && layersCfg.length > 0) {
        for (var i = 0; i < layersCfg.length; i++) {
          var item = layersCfg[i];
          if (item == null || item.config[keyname] != key) continue;
          return item;
        }
      }

      layersCfg = this.arrOperationallayers;
      if (layersCfg && layersCfg.length > 0) {
        for (var i = 0; i < layersCfg.length; i++) {
          var item = layersCfg[i];
          if (item == null || item.config[keyname] != key) continue;
          return item;
        }
      }
    }

    return null;
  }
  //获取当前显示的底图

  getBasemap() {
    var layersCfg = this.arrBasemaps;
    if (layersCfg.length == 0) {
      if (this.viewer.baseLayerPicker) {
        return this.viewer.baseLayerPicker.viewModel.selectedImagery;
      }
      return;
    }

    for (var i = 0; i < layersCfg.length; i++) {
      var item = layersCfg[i];
      if (item.config.type == "group" && item.config.layers == null) continue;

      if (item._visible) {
        return item;
      }
    }
  }
  //根据config配置的id或name属性，更新显示指定的地图底图

  changeBasemap(idorname) {
    var layersCfg = this.arrBasemaps;
    if (layersCfg.length == 0) {
      if (this.viewer.baseLayerPicker) {
        var baseLayer = this.viewer.baseLayerPicker.viewModel;

        var sel;
        if (idorname) {
          var index;
          for (var i = 0; i < this.config.basemaps.length; i++) {
            var item = this.config.basemaps[i];
            if (item.type == "group" && item.layers == null) continue;

            if (idorname == item || idorname == item.name || idorname == item.id) {
              index = i;
              break;
            }
          }
          if (Cesium.defined(index)) {
            sel = baseLayer.imageryProviderViewModels[index];
          }
        }
        baseLayer.selectedImagery = sel;
      }
      return;
    }

    var basemap;
    for (var i = 0; i < layersCfg.length; i++) {
      var item = layersCfg[i];
      if (item.config.type == "group" && item.config.layers == null) continue;

      if (idorname == item || idorname == item.config.name || idorname == item.config.id) {
        item.setVisible(true);
        this.crs = item.config.crs; //坐标系

        basemap = item;
      } else {
        item.setVisible(false);
      }
    }
    return basemap;
  }
  //是否有地形数据

  hasTerrain() {
    if (this.terrainProvider == null) return false;
    return _layer.hasTerrain(this.viewer);
  }
  //更新地形，参数传入是否显示地形

  updateTerrainProvider(isStkTerrain) {
    if (isStkTerrain) {
      if (this.terrainProvider == null) {
        var cfg = this.config.terrain;
        if (cfg && cfg.url) {
          if (this.config.serverURL) {
            cfg.url = cfg.url.replace('$serverURL$', this.config.serverURL);
          }
          cfg.url = cfg.url.replace('$hostname$', location.hostname).replace('$host$', location.host);
        }
        this.terrainProvider = _layer.getTerrainProvider(cfg);
      }
      this.viewer.terrainProvider = this.terrainProvider;
    } else {
      this.viewer.terrainProvider = _layer.getEllipsoidTerrain();
    }
  }

  //获取当前地图坐标系，值为gcj时表示是国测局偏移坐标

  getCrs() {
    return this.crs;
  }
  //在不同坐标系情况下，转换“目标坐标值”至“地图坐标系”一致的坐标

  point2map(point) {
    switch (this.crs) {
      case "gcj":
        var point_clone = _util.clone(point);

        var newpoint = pointconvert.wgs2gcj([point_clone.x, point_clone.y]);
        point_clone.x = newpoint[0];
        point_clone.y = newpoint[1];
        return point_clone;
        break;
      case "bd":
      case "baidu":
        var point_clone = _util.clone(point);

        var newpoint = pointconvert.wgs2bd([point_clone.x, point_clone.y]);
        point_clone.x = newpoint[0];
        point_clone.y = newpoint[1];
        return point_clone;
        break;
      default:
        return point;
        break;
    }
  }
  //在不同坐标系情况下 ，获取地图上的坐标后，转为wgs标准坐标系坐标值

  point2wgs(point) {
    switch (this.crs) {
      case "gcj":
        var point_clone = _util.clone(point);
        var newpoint = pointconvert.gcj2wgs([point_clone.x, point_clone.y]);
        point_clone.x = newpoint[0];
        point_clone.y = newpoint[1];
        return point_clone;
        break;
      case "bd":
      case "baidu":
        var point_clone = _util.clone(point);
        var newpoint = pointconvert.bd2wgs([point_clone.x, point_clone.y]);
        point_clone.x = newpoint[0];
        point_clone.y = newpoint[1];
        return point_clone;
        break;
      default:
        return point;
        break;
    }
  }

  //定位到 多个区域  顺序播放

  centerAtArr(arr, enfun) {
    this.cancelCenterAt();

    this.arrCenterTemp = arr;
    this._isCenterAtArr = true;
    this._centerAtArrItem(0, enfun);
  }
  _centerAtArrItem(i, enfun) {
    var that = this;
    if (!this._isCenterAtArr || i < 0 || i >= this.arrCenterTemp.length) {
      this._isCenterAtArr = false;
      //marslog.log('centerAtArr视角切换全部结束');
      if (enfun) enfun();
      return;
    }
    var centeropt = this.arrCenterTemp[i];

    //marslog.log('centerAtArr开始视角切换，第' + i + '点');
    if (centeropt.onStart) centeropt.onStart();

    this.centerAt(centeropt, {
      duration: centeropt.duration,
      complete: function complete() {
        if (centeropt.onEnd) centeropt.onEnd();

        var stopTime = Cesium.defaultValue(centeropt.stop, 1);
        //marslog.log('centerAtArr第' + i + '点切换结束，将在此停留' + stopTime + '秒');

        setTimeout(function() {
          that._centerAtArrItem(++i, enfun);
        }, stopTime * 1000);
      },
      cancle: function cancle() {
        this._isCenterAtArr = false;
        if (enfun) enfun();
      }
    });
  }
  cancelCenterAt() {
    this._isCenterAtArr = false;
    this.viewer.camera.cancelFlight(); //取消飞行
  }
  centerAtHome(options) {
    this.centerAt(this.config.extent || this.config.center, options);
  }
  //地球定位至指定区域 ，options支持viewer.camera.flyTo所有参数

  centerAt(centeropt, options) {
    if (options == null) options = {};
    else if (_util.isNumber(options)) {
      options = { //兼容旧版本
        duration: options
      };
    }

    if (centeropt == null) {
      //让镜头飞行（动画）到配置默认区域
      options.isWgs84 = true;
      centeropt = this.config.extent || this.config.center;
    }
    if (centeropt == null) return;

    var optsClone = {};
    for (var key in options) {
      optsClone[key] = options[key];
    }

    if (centeropt.xmin && centeropt.xmax && centeropt.ymin && centeropt.ymax) {
      //使用extent配置，相机可视范围
      var xmin = centeropt.xmin;
      var xmax = centeropt.xmax;
      var ymin = centeropt.ymin;
      var ymax = centeropt.ymax;

      if (optsClone.isWgs84) {
        //坐标转换为wgs
        var pt1 = this.point2map({
          x: xmin,
          y: ymin
        });
        xmin = pt1.x;
        ymin = pt1.y;

        var pt2 = this.point2map({
          x: xmax,
          y: ymax
        });
        xmax = pt2.x;
        ymax = pt2.y;
      }

      //方法1：绑定范围 （存在区域在地形下的情况，极端示例在珠峰测试）
      // optsClone.destination = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);

      //方法2：(计算矩形边长+高度后定位)
      var centerx = (xmin + xmax) / 2;
      var centery = (ymin + ymax) / 2;
      //求矩形最大边的边长
      var recta = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
      var granularity = Math.max(recta.height, recta.width);
      var len = Cesium.Math.chordLength(granularity, this.viewer.scene.globe.ellipsoid.maximumRadius);
      //求高度
      var height = Cesium.defaultValue(centeropt.height, 0);
      if (height == 0) {
        height = point.getSurfaceHeight(this.viewer.scene, Cesium.Cartesian3.fromDegrees(centerx, centery));
      }

      optsClone.destination = Cesium.Cartesian3.fromDegrees(centerx, centery, len + height); //经度、纬度、高度
      optsClone.orientation = {
        heading: Cesium.Math.toRadians(Cesium.defaultValue(centeropt.heading, 0)), //绕垂直于地心的轴旋转
        pitch: Cesium.Math.toRadians(Cesium.defaultValue(centeropt.pitch, -90)), //绕纬度线旋转
        roll: Cesium.Math.toRadians(Cesium.defaultValue(centeropt.roll, 0)) //绕经度线旋转
      };
      //方法2   end

      this.viewer.camera.flyTo(optsClone);
    } else {
      //存在hpr，为相机定位的方式
      if (optsClone.isWgs84) centeropt = this.point2map(centeropt);

      var height = Cesium.defaultValue(optsClone.minz, 2500);
      if (this.viewer.camera.positionCartographic.height < height) height = this.viewer.camera.positionCartographic.height;
      if (centeropt.z != null && centeropt.z != 0) height = centeropt.z;

      optsClone.destination = Cesium.Cartesian3.fromDegrees(centeropt.x, centeropt.y, height); //经度、纬度、高度
      optsClone.orientation = {
        heading: Cesium.Math.toRadians(Cesium.defaultValue(centeropt.heading, 0)), //绕垂直于地心的轴旋转
        pitch: Cesium.Math.toRadians(Cesium.defaultValue(centeropt.pitch, -90)), //绕纬度线旋转
        roll: Cesium.Math.toRadians(Cesium.defaultValue(centeropt.roll, 0)) //绕经度线旋转
      };
      this.viewer.camera.flyTo(optsClone);
    }
  }
  //定位至目标点， options支持viewer.camera.flyToBoundingSphere所有参数

  centerPoint(centeropt, options) {

    if (options == null) options = {};

    var optsClone = {};
    for (var key in options) {
      optsClone[key] = options[key];
    }

    //目标点位置
    if (optsClone.isWgs84) centeropt = this.point2map(centeropt);

    var position;
    if (centeropt instanceof Cesium.Cartesian3) position = centeropt;
    else position = Cesium.Cartesian3.fromDegrees(centeropt.x, centeropt.y, Cesium.defaultValue(centeropt.z, 0)); //经度、纬度、高度
    var radius = Cesium.defaultValue(options.radius, 1000);

    optsClone.offset = {
      heading: Cesium.Math.toRadians(Cesium.defaultValue(options.heading, 0)),
      pitch: Cesium.Math.toRadians(Cesium.defaultValue(options.pitch, -90)),
      range: radius
    };
    //duration
    this.viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 0), optsClone);
  }

  //视角飞行定位到entiy处

  flyTo(entity, opts) {
    if (!entity) return;

    opts = opts || {};
    opts.scale = Cesium.defaultValue(opts.scale, 0.5);

    if (entity.entities && entity.entities instanceof Cesium.EntityCollection) {
      entity = entity.entities.values;
    }

    if (_util.isArray(entity)) {
      if (entity.length == 0) return;

      if (entity.length == 1) {
        this.flyTo(entity[0], opts);
      } else {
        //entity是数组
        var extent = point.getExtent(entity, opts);
        if (extent.xmin == extent.xmax || extent.ymin == extent.ymax) {
          //说明是单个的点数据（也有可能重合的多个点）
          this.flyTo(entity[0], opts);
        } else if (extent.xmax - extent.xmin > 200) {
          //跨了180度线时
          this.viewer.flyTo(entity[0], opts);
        } else {
          //是矩形区域时
          this.centerAt(extent, opts);
        }
      }
    } else if (entity instanceof Cesium.Entity) {
      //点状数据时
      if (entity.position) {
        var position = point.getPositionValue(entity.position);
        this.centerPoint(position, opts);
      }
      //圆数据时
      else if (entity.ellipse) {
        var radius1 = entity.ellipse.semiMajorAxis.getValue(_util.currentTime());
        var radius2 = entity.ellipse.semiMinorAxis.getValue(_util.currentTime());

        opts.radius = Math.max(radius1, radius2) * 3 * (1 + opts.scale);

        var position = point.getPositionValue(entity.position);
        this.centerPoint(position, opts);
      } else {
        var extent = point.getExtent(entity, opts);
        if (extent.xmin == extent.xmax || extent.ymin == extent.ymax) {
          //说明是单个的点数据（也有可能重合的多个点）
          var position = {
            x: extent.xmin,
            y: extent.ymin
          };
          this.centerPoint(position, opts);
        } else if (extent.xmax - extent.xmin > 200) {
          //跨了180度线时
          this.viewer.flyTo(entity, opts);
        } else {
          //是矩形区域时
          this.centerAt(extent, opts);
        }
      }
    } else {
      this.viewer.flyTo(entity, opts);
    }
  }

  //是否在调用了openFlyAnimation正在进行飞行动画

  isFlyAnimation() {
    return this._isFlyAnimation;
  }
  //开场动画，动画播放地球飞行定位指指定区域（默认为config.josn中配置的视域）

  openFlyAnimation(endfun, centeropt) {
    var that = this;
    var viewer = this.viewer;
    var view = centeropt || point.getCameraView(viewer); //默认为原始视角

    this._isFlyAnimation = true;
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-85.16, 13.71, 23000000.0)
    });
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(view.x, view.y, 23000000.0),
      duration: 2,
      easingFunction: Cesium.EasingFunction.LINEAR_NONE,
      complete: function complete() {
        var z = Cesium.defaultValue(view.z, 90000);
        if (z < 200000 && view.pitch != -90) {
          z = z * 1.2 + 8000;
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(view.x, view.y, z),
            complete: function complete() {
              that.centerAt(view, {
                duration: 2,
                complete: function complete() {
                  that._isFlyAnimation = false;
                  if (endfun) endfun();
                  if (that.openFlyAnimationEndFun) {
                    that.openFlyAnimationEndFun();
                    delete that.openFlyAnimationEndFun;
                  }
                }
              });
            }
          });
        } else {
          that.centerAt(view, {
            complete: function complete() {
              that._isFlyAnimation = false;
              if (endfun) endfun();
              if (that.openFlyAnimationEndFun) {
                that.openFlyAnimationEndFun();
                delete that.openFlyAnimationEndFun;
              }
            }
          });
        }
      }
    });
  }
  //旋转地球

  rotateAnimation(endfun, duration) {
    var viewer = this.viewer;

    var first = point.getCameraView(viewer); //默认为原始视角
    var duration3 = duration / 3;

    //动画 1/3
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(first.x + 120, first.y, first.z),
      orientation: {
        heading: Cesium.Math.toRadians(first.heading),
        pitch: Cesium.Math.toRadians(first.pitch),
        roll: Cesium.Math.toRadians(first.roll)
      },
      duration: duration3,
      easingFunction: Cesium.EasingFunction.LINEAR_NONE,
      complete: function complete() {

        //动画 2/3
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(first.x + 240, first.y, first.z),
          orientation: {
            heading: Cesium.Math.toRadians(first.heading),
            pitch: Cesium.Math.toRadians(first.pitch),
            roll: Cesium.Math.toRadians(first.roll)
          },
          duration: duration3,
          easingFunction: Cesium.EasingFunction.LINEAR_NONE,
          complete: function complete() {

            //动画 3/3
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(first.x, first.y, first.z),
              orientation: {
                heading: Cesium.Math.toRadians(first.heading),
                pitch: Cesium.Math.toRadians(first.pitch),
                roll: Cesium.Math.toRadians(first.roll)
              },
              duration: duration3,
              easingFunction: Cesium.EasingFunction.LINEAR_NONE,
              complete: function complete() {
                if (endfun) endfun();
              }
            });
            //动画3/3 end
          }
        });
        //动画2/3 end
      }
    });
    //动画1/3 end
  }

  //添加“导航”控件

  _addNavigationWidget(item) {
    if (Cesium.viewerCesiumNavigationMixin) {
      //兼容v1版本
      this.viewer.extend(Cesium.viewerCesiumNavigationMixin, {
        defaultResetView: Cesium.Rectangle.fromDegrees(110, 20, 120, 30),
        enableZoomControls: false
      });
    }

    if (Cesium.CesiumNavigation) {
      //当前版本
      var options = {};
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      options.defaultResetView = Cesium.Rectangle.fromDegrees(110, 20, 120, 30);
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass = true;
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls = false;
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend = true;
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing = true;

      Cesium.CesiumNavigation(this.viewer, options);
    }

    //比例尺
    (0, _zepto.zepto)(".distance-legend").css({
      "left": "-10px",
      "bottom": "-1px",
      "border": "none",
      "background": "rgba(0, 0, 0, 0)"
    });

    if (item.legend) {
      var css = item.legend;
      //插件的默认值：right: 25px; bottom: 30px;
      if (Cesium.defined(css.top) && css.top != "auto") {
        css.bottom = "auto";
      }
      if (Cesium.defined(css.left) && css.left != "auto") {
        css.right = "auto";
      }

      (0, _zepto.zepto)(".distance-legend").css(css);
    } else {
      (0, _zepto.zepto)(".distance-legend").remove();
    }

    //导航球
    if (item.compass) {
      var css = item.compass;
      //插件的默认值： top: 100px; right: 0;
      if (Cesium.defined(css.bottom) && css.bottom != "auto") {
        css.top = "auto";
      }
      if (Cesium.defined(css.left) && css.left != "auto") {
        css.right = "auto";
      }
      (0, _zepto.zepto)(".compass").css(css);
    } else {
      (0, _zepto.zepto)(".compass").remove();
    }

    //zepto(".navigation-controls").css({
    //    "right": "5px",
    //    "bottom": "30px",
    //    "top": "auto"
    //});
    (0, _zepto.zepto)(".navigation-controls").remove();
  }
  //导出场景图片，截图

  expImage(opts) {
    opts = opts || {};
    opts.download = Cesium.defaultValue(opts.download, true);
    opts.type = Cesium.defaultValue(opts.type, "image/jpeg");

    var width, height;
    var viewer = this.viewer;
    var callback = opts.callback || opts.calback;

    viewer.render();
    var imgdata = viewer.canvas.toDataURL(opts.type, opts.encoderOptions);

    if (Cesium.defined(opts.width) || Cesium.defined(opts.height)) {
      //指定了高或宽度后，图片压缩处理
      var image = new Image();
      image.onload = function() {
        //图片压缩处理

        if (Cesium.defined(opts.width)) {
          width = opts.width;
          height = opts.height || Math.round(width * viewer.canvas.height / viewer.canvas.width);
        } else {
          height = opts.height;
          width = Math.round(height * viewer.canvas.width / viewer.canvas.height);
        }

        var canvas, ctx;
        canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);
        var imgdataNew = canvas.toDataURL(opts.type, opts.encoderOptions);

        if (!opts.filename) {
          opts.filename = "场景出图_" + width + "x" + height;
        }
        if (opts.download) _util.downloadBase64Image(opts.filename, imgdataNew);
        if (callback) callback(imgdataNew, {
          width: width,
          height: height
        });
      };
      image.src = imgdata;
    } else {
      //高清原图
      height = viewer.canvas.height, width = viewer.canvas.width;

      if (!opts.filename) {
        opts.filename = "场景出图_" + width + "x" + height;
      }
      if (opts.download) _util.downloadBase64Image(opts.filename, imgdata);
      if (callback) callback(imgdata, {
        width: width,
        height: height
      });
    }
  }

  //销毁资源

  destroy() {
    this.handler.destroy();
    this._tooltip.destroy();
    this._popup.destroy();

    if (this._keyboardRoam) {
      this._keyboardRoam.destroy();
      this._keyboardRoam = null;
    }

    if (this._contextmenu) {
      this._contextmenu.destroy();
      this._contextmenu = null;
    }

    if (this._location) {
      this._location.destroy();
      this._location = null;
    }
    if (this._mouseZoomStyle) {
      this._mouseZoomStyle.destroy();
      this._mouseZoomStyle = null;
    }

    //删除所有绑定的数据
    for (var i in this) {
      delete this[i];
    }
  }
  get onlyPickModelPosition() {
    return this.viewer.scene.onlyPickModelPosition;
  }
  set onlyPickModelPosition(value) {
    this.viewer.scene.onlyPickModelPosition = value;
  }
  //单击事件(单个时，主要为了兼容历史版本或单次简单场景下使用)
  set click(value) {
    this.on(_MarsClass2.eventType.click, value);
  }
  get keyboardRoam() {
    return this._keyboardRoam;
  }
  get contextmenu() {
    return this._contextmenu;
  }
  get location() {
    return this._location;
  }
  get popup() {
    return this._popup;
  }
  get tooltip() {
    return this._tooltip;
  }
  //右键菜单
  get contextmenuItems() {
      return this._contextmenuItems;
    },
    set contextmenuItems(val) {
      this._contextmenuItems = val;
    }
  get defaultContextmenuItems() {
    return this.config.contextmenuItems || (0, _defaultContextMenu.getDefaultContextMenu)(this.viewer);
  }

  //默认绑定的draw控件
  get draw() {
    if (this._drawControl == null) {
      this._drawControl = new Draw(this.viewer, {
        hasEdit: false
      });
    }
    return this._drawControl;
  }

  //获取地图层级（概略）
  get level() {
    var height = this.viewer.camera.positionCartographic.height;
    if (height == this._prevCameraHeight) {
      return this._level;
    }
    this._level = _util.heightToZoom(height);
    this._prevCameraHeight = height;
    return this._level;
  }
}
//[静态属性]本类中支持的事件类型常量


ViewerEx.event = {
  click: _MarsClass2.eventType.click,
  clickMap: _MarsClass2.eventType.clickMap,
  mouseMove: _MarsClass2.eventType.mouseMove
}
export default ViewerEx
