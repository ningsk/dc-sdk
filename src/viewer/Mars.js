import { Tooltip } from "../utils/Tooltip";
import Cesium from "cesium";
import { createLayer, createImageryProvider } from "../layer/Layer";
import { gcj2bd, wgs2gcj, wgs2bd, bd2gcj } from "../utils/PointConvert";

import Util from "../utils/Util";

//版权信息
var copyright = false;

export function initMap(id, config, options) {
  //============模块内部私有属性及方法============

  //类内部使用
  var viewer;
  var viewerDivId;
  var configdata;
  var crs; //坐标系

  viewerDivId = id;
  configdata = config;

  //如果options未设置时的默认参数
  var defoptions = {
    animation: false, //是否创建动画小器件，左下角仪表
    timeline: false, //是否显示时间线控件
    fullscreenButton: true, //右下角全屏按钮
    vrButton: false, //右下角vr虚拟现实按钮
    geocoder: false, //是否显示地名查找控件
    sceneModePicker: false, //是否显示投影方式控件
    homeButton: true, //回到默认视域按钮
    navigationHelpButton: true, //是否显示帮助信息控件
    navigationInstructionsInitiallyVisible: false, //在用户明确单击按钮之前是否自动显示

    infoBox: true, //是否显示点击要素之后显示的信息
    selectionIndicator: false, //选择模型是是否显示绿色框,
    shouldAnimate: true,
    showRenderLoopErrors: true, //是否显示错误弹窗信息

    baseLayerPicker: false, //地图底图
  };

  //config中可以配置map所有options
  for (var key in configdata) {
    if (
      key === "crs" ||
      key === "controls" ||
      key === "minzoom" ||
      key === "maxzoom" ||
      key === "center" ||
      key === "style" ||
      key === "terrain" ||
      key === "basemaps" ||
      key === "operationallayers"
    )
      continue;
    defoptions[key] = configdata[key];
  }

  //赋默认值（如果已存在设置值跳过）
  if (options == null) options = {};
  for (var i in defoptions) {
    if (!options.hasOwnProperty(i)) {
      options[i] = defoptions[i];
    }
  }

  //一些默认值的修改【by 木遥】
  Cesium.BingMapsApi.defaultKey =
    "AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc"; //，默认 key
  if (Cesium.Ion)
    Cesium.Ion.defaultAccessToken =
      configdata.ionToken ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NjM5MjMxOS1lMWVkLTQyNDQtYTM4Yi0wZjA4ZDMxYTlmNDMiLCJpZCI6MTQ4MiwiaWF0IjoxNTI4Njc3NDQyfQ.vVoSexHMqQhKK5loNCv6gCA5d5_z3wE2M0l_rWnIP_w";
  Cesium.AnimationViewModel.defaultTicks = configdata.animationTicks || [
    0.1,
    0.25,
    0.5,
    1.0,
    2.0,
    5.0,
    10.0,
    15.0,
    30.0,
    60.0,
    120.0,
    300.0,
    600.0,
    900.0,
    1800.0,
    3600.0,
  ];

  //坐标系
  configdata.crs = configdata.crs || "3857";
  crs = configdata.crs;

  //自定义搜索栏Geocoder
  if (options.geocoder === true) {
    options.geocoder = new GaodePOIGeocoder(options.geocoderConfig);
  }

  //地形
  if (configdata.terrain && configdata.terrain.visible) {
    options.terrainProvider = getTerrainProvider();
  }

  //地图底图图层预处理
  var hasremoveimagery = false;
  if (options.baseLayerPicker) {
    //有baseLayerPicker插件时
    if (!options.imageryProviderViewModels)
      options.imageryProviderViewModels = getImageryProviderArr();
    if (!options.terrainProviderViewModels)
      options.terrainProviderViewModels = getTerrainProviderViewModelsArr();
  } else {
    //无baseLayerPicker插件时,按内部规则
    if (options.imageryProvider == null) {
      hasremoveimagery = true;
      options.imageryProvider = Cesium.createTileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
      });
    }
  }

  //地球初始化
  viewer = new Cesium.Viewer(id, options);
  viewer.cesiumWidget.creditContainer.style.display = "none"; //去cesium logo

  //====绑定方法到viewer上====
  viewer.mars = {
    popup: _popup,
    tooltip: _tooltip,
    keyboard: function (isbind) {
      if (isbind) FirstPerson.bind(viewer);
      else FirstPerson.unbind(viewer);
    },
    centerAt: centerAt,
    getConfig: getConfig,
    getLayer: getLayer,
    changeBasemap: changeBasemap,
    hasTerrain: hasTerrain,
    updateTerrainProvider: updateTerrainProvider,
    isFlyAnimation: isFlyAnimation,
    openFlyAnimation: openFlyAnimation,
    rotateAnimation: rotateAnimation,
    getCrs: getCrs,
    point2map: point2map,
    point2wgs: point2wgs,
    destroy: destroy,

    //地图底图图层
  };
  if (hasremoveimagery) {
    var imageryLayerCollection = viewer.imageryLayers;
    var length = imageryLayerCollection.length;
    for (var i = 0; i < length; i++) {
      var layer = imageryLayerCollection.get(0);
      imageryLayerCollection.remove(layer, true);
    }
  }

  //默认定位地点相关设置，默认home键和初始化镜头视角
  if (viewer.homeButton) {
    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
      function (commandInfo) {
        centerAt();
        commandInfo.cancel = true;
      }
    );
  }
  centerAt(null, {
    duration: 0,
  });

  var orderlayers = []; //计算order

  //没baseLayerPicker插件时才按内部规则处理。
  if (!options.baseLayerPicker) {
    var layersCfg = configdata.basemaps;
    if (layersCfg && layersCfg.length > 0) {
      for (var i = 0; i < layersCfg.length; i++) {
        var item = layersCfg[i];
        if (item.visible && item.crs) crs = item.crs;

        createLayer(item, viewer, config.serverURL, options.layerToMap);

        orderlayers.push(item);
        if (item.type == "group" && item.layers) {
          for (var idx = 0; idx < item.layers.length; idx++) {
            var childitem = item.layers[idx];
            orderlayers.push(childitem);
          }
        }
      }
    }
  }

  //可叠加图层
  var layersCfg = configdata.operationallayers;
  if (layersCfg && layersCfg.length > 0) {
    for (var i = 0; i < layersCfg.length; i++) {
      var item = layersCfg[i];
      createLayer(item, viewer, config.serverURL, options.layerToMap);

      orderlayers.push(item);
      if (item.type == "group" && item.layers) {
        for (var idx = 0; idx < item.layers.length; idx++) {
          var childitem = item.layers[idx];
          orderlayers.push(childitem);
        }
      }
    }
  }
  //计算 顺序字段,
  for (var i = 0; i < orderlayers.length; i++) {
    var item = orderlayers[i];

    //计算层次顺序
    var order = Number(item.order);
    if (isNaN(order)) order = i;
    item.order = order;

    //图层的处理
    if (item._layer != null) {
      item._layer.setZIndex(order);
    }
  }

  //切换场景
  var lastCameraView;
  viewer.scene.morphStart.addEventListener(function (event) {
    //切换场景前事件
    lastCameraView = point.getCameraView(viewer);
  });

  viewer.scene.morphComplete.addEventListener(function (event) {
    //切换场景后事件
    setTimeout(function () {
      centerAt(lastCameraView, {
        duration: 2,
      });
    }, 100);
  });

  //地图自定义控件 （兼容旧版controls参数）
  if (configdata.navigation) {
    //导航工具栏
    addNavigationWidget(configdata.navigation);
  }
  if (configdata.location) {
    //鼠标提示
    addLocationWidget(configdata.location);
  }

  if (options.geocoder) {
    options.geocoder.viewer = viewer;
  }

  //绑定popup
  _popup.init(viewer);

  //绑定tooltip
  _tooltip.init(viewer);

  //地球一些属性设置
  var scene = viewer.scene;
  scene.globe.baseColor = new Cesium.Color.fromCssColorString(
    configdata.baseColor || "#546a53"
  ); //默认背景色
  if (configdata.style) {
    //深度监测
    scene.globe.depthTestAgainstTerrain = configdata.style.testTerrain;

    //光照渲染（阳光照射区域高亮）
    scene.globe.enableLighting = configdata.style.lighting;

    //大气渲染
    scene.skyAtmosphere.show = configdata.style.atmosphere;
    scene.globe.showGroundAtmosphere = configdata.style.atmosphere;

    //雾化效果
    scene.fog.enabled = configdata.style.fog;
  }

  //限制缩放级别
  scene.screenSpaceCameraController.maximumZoomDistance =
    configdata.maxzoom || 20000000; //变焦时相机位置的最大值（以米为单位）
  scene.screenSpaceCameraController.minimumZoomDistance =
    configdata.minzoom || 1; //变焦时相机位置的最小量级（以米为单位）。默认为1.0。

  //scene.screenSpaceCameraController.enableCollisionDetection = true;    //启用地形相机碰撞检测。
  //scene.screenSpaceCameraController.minimumCollisionTerrainHeight = 1;  //在测试与地形碰撞之前摄像机必须达到的最小高度。

  //解决Cesium显示画面模糊的问题 https://zhuanlan.zhihu.com/p/41794242
  viewer._cesiumWidget._supportsImageRenderingPixelated = Cesium.FeatureDetection.supportsImageRenderingPixelated();
  viewer._cesiumWidget._forceResize = true;
  if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
    var _dpr = window.devicePixelRatio;
    // 适度降低分辨率
    while (_dpr >= 2.0) {
      _dpr /= 2.0;
    }
    viewer.resolutionScale = _dpr;
  }

  //解决限定相机进入地下 https://github.com/AnalyticalGraphicsInc/cesium/issues/5837
  viewer.camera.changed.addEventListener(function () {
    if (
      viewer.camera._suspendTerrainAdjustment &&
      viewer.scene.mode === Cesium.SceneMode.SCENE3D
    ) {
      viewer.camera._suspendTerrainAdjustment = false;
      viewer.camera._adjustHeightForTerrain();
    }
  });

  //版权图片
  if (copyright) {
    var viewportQuad = new Cesium.ViewportQuad();
    viewportQuad.rectangle = new Cesium.BoundingRectangle(10, 5, 103, 24);
    viewer.scene.primitives.add(viewportQuad);
    viewportQuad.material = new Cesium.Material({
      fabric: {
        type: "Image",
        uniforms: {
          color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGcAAAAYCAYAAADnNePtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF42lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2NzBCMzhDNkMyQjdFNzExOEQ3MUQ1NDIzMjRERTZDQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozQ0ZEMzEyOEJEREIxMUU3ODBCOTg1QTM3NDY2NEVEMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmZDk2M2I4ZC01MDdlLTVjNDUtOTg4OS02MmY0NTg2NDhjNGEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0xMC0yNVQyMDowNzozMyswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMTAtMjVUMjA6MjY6MjMrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMTAtMjVUMjA6MjY6MjMrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozM0I4MEQ3RkM3QjdFNzExOTE4NkRGNjMwMjlEOTE4MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NzBCMzhDNkMyQjdFNzExOEQ3MUQ1NDIzMjRERTZDQyIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmZDk2M2I4ZC01MDdlLTVjNDUtOTg4OS02MmY0NTg2NDhjNGEiIHN0RXZ0OndoZW49IjIwMTgtMTAtMjVUMjA6MjY6MjMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+fps6oAAACQpJREFUaIHtmnuw1VUVxz+Xx+WChTwERXm/EuWpIIkJDYSMgImNFmBTwYB4MRIYsVQkHiZgylgJWmShSC/y0YgCCgr4oEiEgJwUkAgQeRuI6AX59sdavzn77Pv7nXtv0zTNxJrZ89t7rbXXfq/9XfucIklUgroAA4BLgHZAEdAGqAvsBdYBTwFPAscrY/AMVUxFFSxOfeBxYHCK7CBwDGiILRLACWAc8Oh/sI//t1StgGwssIvyC/McdoIaAa2Bs4EmwJ1AbeDnwBP/Rl+KsRP5v041gOr/lZYkpaXHlE4zA50Wkr7o34TXWNIq130ow3ZWmiFpi6SHJX1TUq1K1jtH0uOS7pPUQ1IrSZ8LUntJ50m6XdJ6SV+thO1iSbMlLZXUMJINk3RA0jJJ0yXVSanfRtK3JPWUdFYkayXpO26na6F+pDF/mrEwt7n8S5IWStrk/COSSqMBr3FZnyoszp1BWztSBpWV6kja5fV2yzbQNP/OlHSPpHslvR/YvyPDVlMf5/ZA96lI54ZAtklStRQ7Vwc6hyR1C2RXBLJXCo0tZoxXOi0KdJrIdpUk7Zd0VYrhTi5/rlDjURodtDe+CvVQbjJXFtB5IbDfJeDXljRC0mJJRwOdA7KTvFY2oUmdHoHO9zPaaivpuOu8FMm6BfVnO6+jpIGxnRqBh6sG3Jji+fYCs4PyPuAqz08FXkipsxlYAwwEGgP7K+Fhw76UBfkLgA+Bf1bCxnnADcBJoJbzTgFyGcCnwAdRW/8AfuT9nub8rwPLPT8GeAR4E/it1ykm++455G3U8bbHAiuBt4GzAr2j/n0CQ8TzgUnJWMMJ6ewpps3AnqD8FaCr57dndA5gK9AbAwtpi1MEdAT+jqG+04GsJMgvA1oCE73zhagMeA9bnMTGyUCWRp9iEwe5BQTYDfTCNuevgHswINQYOAKcm2JrENAdeJ8c2OrraR/wG+CcSL8Ztg7vAtcAG4CHIbc4NwPDsd0QUy3yF/GzQb4Lud0VU0v/fpIhF4b8ZgHzvJxQG//2xhYQ4GfAFOALwM4Mm4eA1zJkhzP4PYBWwHqgvfM+Bq4DbsEWrC3wGHAT8Gvnp9E7QANsvhLk+RIwHkO2S7AFTjzUauCOoH4RwWlMJr010DSjwerkXATYTk9oFHbcj5JPHYB+2A7bnWF3MLZr+mCL0yCQtfNv/4C3FVhA+cWui0F4gIuAGdhJLcNcWnVsgjtl9KO2yw4ALZxXgrnSwZhrngLMAW7DFnNShq2tngAmYKdrF+Z9Njv/VKCfzFt17AQrlCdHrz75JyKkBzCfnNDLwBueb+flDoG8F/A7z8/3QcZ0ObYTAXr6t0Ugb4DdNUO8vB24GrgXcxkh1ccm+GMs+J2K+frBbnOf92MzFjjfh7mqhNYAd/s4Tgb8Iuw0zQCaAxuB0pSxZFFyAnpid80K72uzQGcQ5gUWkr85jRwZLFE29U5BI30jneOS1jm6OeW8nbK4J65bTdLmoO4G56/18hZJr0v6k5dXSaqXgYrwNg57e1923sTA/txAd6LS0SWSasggvCSdlFQmg8EdvI4k7ZHFKCe8PD2y0VSGOhd6fUk6LQtPxsjQ62IZlJ8czcMRWXxUDkovUzqVyWBe2mAGyOBmGr0WNxSllYFuPxk8/8jL8yX9wvMTCthI0jVR29+TNCko3y+pmSz2OOa8eFKRQdmE3pOFD5K00fsoGSwOY5hHJF0sqbrbuDVlLhYEbUyQHYSk/Gyg96SkumGfErf2N8w3xlSTHGyOaTl2Ud6CXZJ/wJ5uhmD3SIjk4meiIcD1QDcMKQ0ld2+s8rqnqdwbXV//7scg7wpyFztAPe9nTeBW4CHSQcq1Qb4Ic4PHsEt+pdvpSz6kHwZswS59MBcJsA1zoTGtw9xzVwxS93H+AQxu59/dvkqlkl71FVwj6YNgRU9Jul45l1SV4BCZS2pfQF6i3PE+4Lz+Xv59BbYvkLmgPTKXkvBHBv0f4bwWkoZk2LlI5poPBvUukz3BTHAbwySNkjQv0PmL7BVierDrR8mC0D+7zrKgnSJJ+2TPSHMDO1PS+pVk+kh61BWXBoYT2hENviqpo09ilnxc0M5dzmsl6RPn/aRA3edl/n+yLIK/XHZHzAls/lDShcrdYStk90toZ5WPO3ya6SdbtBEyl9dd5n6HBTrTMvpVQ9I7rrMqkj2ofHo6a3yJu1mNxRH4kXuQ/LigJfAD8uOdiqgehsreJTvGaIYFdwCvYGgMYAfwoue/jSGptlHdK7DguDEG7/thAV4T8pFnfSyOWQCMBhaTc6Fgbua0f8PfotoBbwG/BJ7HEOpeH09FdAqDxgTfhJZE5bQXFqNotZb6ao6TNFblaaOkwQV2cpJ6S3pL9hJcQ1LrFJ1Gkt5wu5tkr8uhfEDU9gnZBTpcdgEXe0prf0xQrzSS1ZSdgKTcVtK5yl3YCY3MsB0CgrsjWWefn+HKobXwba2HDAHG9LbsFX+qDAnnnZyEZvn3x9gp6Uv+s0cX4FnsEpyA7d7OwGXA17B3qfXYSUx23JWU322tgbXApcAitxNfoMu9HwmVYLFLRwxglGFxSU3sZaOE3JNNvaBeeIo+A7yOPfHMdN42LBZK2kgo7bUktn1+JNvrfVzk/YKc17gHAwQfYuDjrqBeewxYDSQ8vSk7ozRY0V6Smssuviw6ncKbJ+l82R3SLLI/Snaf7JT9/FDRKZzvNo9KujTg9/N+PeM7uFQGZUfLLtuNstM7T9JN3u4cSVsl7XWb10ZthXfVzRn9CWOoRRk6f3T5R5JelMHkzZK+Eel1Ug5On1DkYbImZIByyGW6zAUN8gktRG/KLs7Gssvy4shuU0mz3FZFixKm2yXdGPHOli1QF+9fsez5v45ycQeeT/glAb+RorhC0lBJq2UuPev3pOsk/VXSA5JaZui0lwXETWUI8fMVjK+7ym+Ugv8haI65sM7AZAwQdMIu+R7Ys8SrfvyHYrHDM9hTzjbgu+Q/k5yhKlJFf/AAGIkhocPA09jEF3tqCNyPPTi+DFyIIZ/+pAe1Z6gKVJnFAXu6vwR7ku+AwcMN2MPdlcBcDCIexP6Bk/XbyRmqAv0L6oKRuwwQEIsAAAAASUVORK5CYII=",
        },
      },
    });
  }

  //鼠标滚轮缩放美化样式
  if (configdata.mouseZoom && Util.isPCBroswer()) {
    $("#" + viewerDivId).append(
      '<div class="cesium-mousezoom"><div class="zoomimg"/></div>'
    );
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function (evnet) {
      $(".cesium-mousezoom").addClass("cesium-mousezoom-visible");
      setTimeout(function () {
        $(".cesium-mousezoom").removeClass("cesium-mousezoom-visible");
      }, 200);
    }, Cesium.ScreenSpaceEventType.WHEEL);
    handler.setInputAction(function (evnet) {
      $(".cesium-mousezoom").css({
        top: evnet.endPosition.y + "px",
        left: evnet.endPosition.x + "px",
      });
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  function destroy() {
    _tooltip.destroy();
    _popup.destroy();
  }

  //获取指定图层 keyname默认为名称
  function getLayer(key, keyname) {
    if (keyname == null) keyname = "name";

    var layersCfg = configdata.basemaps;
    if (layersCfg && layersCfg.length > 0) {
      for (var i = 0; i < layersCfg.length; i++) {
        var item = layersCfg[i];
        if (item == null || item[keyname] != key) continue;
        return item._layer;
      }
    }

    layersCfg = configdata.operationallayers;
    if (layersCfg && layersCfg.length > 0) {
      for (var i = 0; i < layersCfg.length; i++) {
        var item = layersCfg[i];
        if (item == null || item[keyname] != key) continue;
        return item._layer;
      }
    }
    return null;
  }

  function getConfig() {
    return Util.clone(configdata);
  }

  var stkTerrainProvider;

  function getTerrainProvider() {
    if (stkTerrainProvider == null) {
      var cfg = configdata.terrain;
      if (cfg.url) {
        if (configdata.serverURL) {
          cfg.url = cfg.url.replace("$serverURL$", configdata.serverURL);
        }
        cfg.url = cfg.url
          .replace("$hostname$", location.hostname)
          .replace("$host$", location.host);
      }

      stkTerrainProvider = Util.getTerrainProvider(cfg);
    }
    return stkTerrainProvider;
  }

  function hasTerrain() {
    if (stkTerrainProvider == null) return false;
    return viewer.terrainProvider != Utils.getEllipsoidTerrain();
  }

  function updateTerrainProvider(isStkTerrain) {
    if (isStkTerrain) {
      viewer.terrainProvider = getTerrainProvider();
    } else {
      viewer.terrainProvider = Util.getEllipsoidTerrain();
    }
  }

  function changeBasemap(idorname) {
    var basemaps = viewer.gisdata.config.basemaps;
    for (var i = 0; i < basemaps.length; i++) {
      var item = basemaps[i];
      if (item.type == "group" && item.layers == null) continue;
      if (item._layer == null) continue;

      if (idorname == item.name || idorname == item.id)
        item._layer.setVisible(true);
      else item._layer.setVisible(false);
    }
  }

  //获取自定义底图切换
  function getImageryProviderArr() {
    var providerViewModels = [];
    window._temp_createImageryProvider = createImageryProvider;

    var layersCfg = configdata.basemaps;
    if (layersCfg && layersCfg.length > 0) {
      for (var i = 0; i < layersCfg.length; i++) {
        var item = layersCfg[i];
        if (item.type == "group" && item.layers == null) continue;

        var funstr =
          "window._temp_basemaps" +
          i +
          " = function () {\
               var item = " +
          JSON.stringify(item) +
          ';\
               if (item.type == "group") {\
                   var arrVec = [];\
                   for (var index = 0; index < item.layers.length; index++) {\
                       var temp = window._temp_createImageryProvider(item.layers[index]);\
                       if (temp == null) continue;\
                       arrVec.push(temp);\
                   }\
                   return arrVec;\
               }\
               else {\
                   return window._temp_createImageryProvider(item);\
               } \
           }';
        eval(funstr);

        var imgModel = new Cesium.ProviderViewModel({
          name: item.name || "未命名",
          tooltip: item.name || "未命名",
          iconUrl: item.icon || "",
          creationFunction: eval("window._temp_basemaps" + i),
        });
        providerViewModels.push(imgModel);
      }
    }
    return providerViewModels;
  }

  function getTerrainProviderViewModelsArr() {
    return [
      new Cesium.ProviderViewModel({
        name: "无地形",
        iconUrl: Cesium.buildModuleUrl(
          "Widgets/Images/TerrainProviders/Ellipsoid.png"
        ),
        tooltip: "WGS84标准椭球，即 EPSG:4326",
        category: "",
        creationFunction: function creationFunction() {
          return new Cesium.EllipsoidTerrainProvider({
            ellipsoid: Cesium.Ellipsoid.WGS84,
          });
        },
      }),
      new Cesium.ProviderViewModel({
        name: "有地形",
        iconUrl: Cesium.buildModuleUrl(
          "Widgets/Images/TerrainProviders/CesiumWorldTerrain.png"
        ),
        tooltip: "提供的高分辨率全球地形",
        category: "",
        creationFunction: function creationFunction() {
          return getTerrainProvider();
        },
      }),
    ];
  }

  function centerAt(centeropt, options) {
    if (options == null) options = {};
    else if (Util.isNumber(options))
      options = {
        duration: options,
      }; //兼容旧版本

    if (centeropt == null) {
      //让镜头飞行（动画）到配置默认区域
      options.isWgs84 = true;
      centeropt = configdata.extent || configdata.center;
    }

    if (centeropt.xmin && centeropt.xmax && centeropt.ymin && centeropt.ymax) {
      //使用extent配置
      var xmin = centeropt.xmin;
      var xmax = centeropt.xmax;
      var ymin = centeropt.ymin;
      var ymax = centeropt.ymax;

      if (options.isWgs84) {
        //坐标转换为wgs
        var pt1 = point2map({
          x: xmin,
          y: ymin,
        });
        xmin = pt1.x;
        ymin = pt1.y;

        var pt2 = point2map({
          x: xmax,
          y: ymax,
        });
        xmax = pt2.x;
        ymax = pt2.y;
      }

      var rectangle = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
      viewer.camera.flyTo({
        destination: rectangle,
        duration: options.duration,
        complete: options.complete,
      });
    } else {
      //使用xyz
      if (options.isWgs84) centeropt = point2map(centeropt);

      var height = options.minz || 2500;
      if (viewer.camera.positionCartographic.height < height)
        height = viewer.camera.positionCartographic.height;
      if (centeropt.z != null && centeropt.z != 0) height = centeropt.z;

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          centeropt.x,
          centeropt.y,
          height
        ), //经度、纬度、高度
        orientation: {
          heading: Cesium.Math.toRadians(centeropt.heading || 0), //绕垂直于地心的轴旋转
          pitch: Cesium.Math.toRadians(centeropt.pitch || -90), //绕纬度线旋转
          roll: Cesium.Math.toRadians(centeropt.roll || 0), //绕经度线旋转
        },
        duration: options.duration,
        complete: options.complete,
      });
    }
  }

  //开场动画
  var _isFlyAnimation = false;

  function isFlyAnimation() {
    return _isFlyAnimation;
  }

  function openFlyAnimation(endfun, centeropt) {
    var view = centeropt || point.getCameraView(viewer); //默认为原始视角

    _isFlyAnimation = true;
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-85.16, 13.71, 23000000.0),
    });
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(view.x, view.y, 23000000.0),
      duration: 2,
      easingFunction: Cesium.EasingFunction.LINEAR_NONE,
      complete: function complete() {
        var z = (view.z || 90000) * 1.2 + 8000;
        if (z > 23000000) z = 23000000;

        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(view.x, view.y, z),
          complete: function complete() {
            centerAt(view, {
              duration: 2,
              complete: function complete() {
                _isFlyAnimation = false;
                if (endfun) endfun();
              },
            });
          },
        });
      },
    });
  }
  //旋转地球
  function rotateAnimation(endfun, duration) {
    var first = point.getCameraView(viewer); //默认为原始视角
    var duration3 = duration / 3;

    //动画 1/3
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        first.x + 120,
        first.y,
        first.z
      ),
      orientation: {
        heading: Cesium.Math.toRadians(first.heading),
        pitch: Cesium.Math.toRadians(first.pitch),
        roll: Cesium.Math.toRadians(first.roll),
      },
      duration: duration3,
      easingFunction: Cesium.EasingFunction.LINEAR_NONE,
      complete: function complete() {
        //动画 2/3
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            first.x + 240,
            first.y,
            first.z
          ),
          orientation: {
            heading: Cesium.Math.toRadians(first.heading),
            pitch: Cesium.Math.toRadians(first.pitch),
            roll: Cesium.Math.toRadians(first.roll),
          },
          duration: duration3,
          easingFunction: Cesium.EasingFunction.LINEAR_NONE,
          complete: function complete() {
            //动画 3/3
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                first.x,
                first.y,
                first.z
              ),
              orientation: {
                heading: Cesium.Math.toRadians(first.heading),
                pitch: Cesium.Math.toRadians(first.pitch),
                roll: Cesium.Math.toRadians(first.roll),
              },
              duration: duration3,
              easingFunction: Cesium.EasingFunction.LINEAR_NONE,
              complete: function complete() {
                if (endfun) endfun();
              },
            });
            //动画3/3 end
          },
        });
        //动画2/3 end
      },
    });
    //动画1/3 end
  }

  //添加“鼠标经纬度提示”控件
  function addLocationWidget(item) {
    var inhtml =
      '<div id="location_mars_jwd"  class="location-bar animation-slide-bottom no-print" ></div>';
    (0, _jquery2.default)("#" + viewerDivId).prepend(inhtml);

    if (item.style) (0, _jquery2.default)("#location_mars_jwd").css(item.style);
    else {
      $("#location_mars_jwd").css({
        left: viewer.animation ? "170px" : "0",
        right: "0",
        bottom: viewer.timeline ? "25px" : "0",
      });
    }

    item.format =
      item.format ||
      "<div>视高：{height}米</div><div>俯仰角：{pitch}度</div><div>方向：{heading}度</div><div>海拔：{z}米</div><div>纬度:{y}</div><div>经度:{x}</div>";

    var locationData = {};

    function setXYZ2Data(cartesian) {
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian);

      locationData.z = cartographic.height.toFixed(1);

      var jd = Cesium.Math.toDegrees(cartographic.longitude);
      var wd = Cesium.Math.toDegrees(cartographic.latitude);

      switch (item.crs) {
        default:
          //和地图一致的原坐标
          var fixedLen = item.hasOwnProperty("toFixed") ? item.toFixed : 6;
          locationData.x = jd.toFixed(fixedLen);
          locationData.y = wd.toFixed(fixedLen);
          break;
        case "degree":
          //度分秒形式
          locationData.x = Util.formatDegree(jd);
          locationData.y = Util.formatDegree(wd);
          break;
        case "project":
          //投影坐标
          var fixedLen = item.hasOwnProperty("toFixed") ? item.toFixed : 0;
          locationData.x = cartesian.x.toFixed(fixedLen);
          locationData.y = cartesian.y.toFixed(fixedLen);
          break;

        case "wgs":
          //标准wgs84格式坐标
          var fixedLen = item.hasOwnProperty("toFixed") ? item.toFixed : 6;
          var wgsPoint = point2wgs({
            x: jd,
            y: wd,
          }); //坐标转换为wgs
          locationData.x = wgsPoint.x.toFixed(fixedLen);
          locationData.y = wgsPoint.y.toFixed(fixedLen);
          break;
        case "wgs-degree":
          //标准wgs84格式坐标
          var wgsPoint = point2wgs({
            x: jd,
            y: wd,
          }); //坐标转换为wgs
          locationData.x = Util.formatDegree(wgsPoint.x);
          locationData.y = Util.formatDegree(wgsPoint.y);
          break;
      }
    }

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movement) {
      var cartesian = point.getCurrentMousePosition(
        viewer.scene,
        movement.endPosition
      );
      if (cartesian) {
        setXYZ2Data(cartesian);

        if (locationData.height == null) {
          locationData.height = viewer.camera.positionCartographic.height.toFixed(
            1
          );
          locationData.heading = Cesium.Math.toDegrees(
            viewer.camera.heading
          ).toFixed(0);
          locationData.pitch = Cesium.Math.toDegrees(
            viewer.camera.pitch
          ).toFixed(0);
        }

        var inhtml = Util.template(item.format, locationData);
        $("#location_mars_jwd").html(inhtml);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //相机移动结束事件
    viewer.scene.camera.changed.addEventListener(function (event) {
      locationData.height = viewer.camera.positionCartographic.height.toFixed(
        1
      );
      locationData.heading = Cesium.Math.toDegrees(
        viewer.camera.heading
      ).toFixed(0);
      locationData.pitch = Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(
        0
      );

      if (locationData.x == null) {
        setXYZ2Data(viewer.camera.position);
      }

      var inhtml = Util.template(item.format, locationData);
      $("#location_mars_jwd").html(inhtml);
    });
  }

  //添加“导航”控件
  function addNavigationWidget(item) {
    if (!Cesium.viewerCesiumNavigationMixin) return;

    viewer.extend(Cesium.viewerCesiumNavigationMixin, {
      defaultResetView: Cesium.Rectangle.fromDegrees(110, 20, 120, 30),
      enableZoomControls: true,
    });

    if (viewer.animation) {
      $(".distance-legend").css({
        left: "150px",
        bottom: "25px",
        border: "none",
        background: "rgba(0, 0, 0, 0)",
        "z-index": "992",
      });
    } else {
      $(".distance-legend").css({
        left: "-10px",
        bottom: "-1px",
        border: "none",
        background: "rgba(0, 0, 0, 0)",
        "z-index": "992",
      });
    }
    if (item.legend) $(".distance-legend").css(item.legend);

    //$(".navigation-controls").css({
    //    "right": "5px",
    //    "bottom": "30px",
    //    "top": "auto"
    //});
    $(".navigation-controls").hide();

    if (item.compass) (0, _jquery2.default)(".compass").css(item.compass);
    else
      $(".compass").css({
        top: "10px",
        left: "10px",
      });
  }

  function getCrs() {
    return crs;
  }

  function point2map(point) {
    if (crs == "gcj") {
      var point_clone = Util.clone(point);

      var newpoint = wgs2gcj([point_clone.x, point_clone.y]);
      point_clone.x = newpoint[0];
      point_clone.y = newpoint[1];
      return point_clone;
    } else if (crs == "baidu") {
      var point_clone = Util.clone(point);

      var newpoint = wgs2bd([point_clone.x, point_clone.y]);
      point_clone.x = newpoint[0];
      point_clone.y = newpoint[1];
      return point_clone;
    } else {
      return point;
    }
  }

  function point2wgs(point) {
    if (crs == "gcj") {
      var point_clone = Util.clone(point);
      var newpoint = gcj2wgs([point_clone.x, point_clone.y]);
      point_clone.x = newpoint[0];
      point_clone.y = newpoint[1];
      return point_clone;
    } else if (crs == "baidu") {
      var point_clone = Util.clone(point);
      var newpoint = bd2gcj([point_clone.x, point_clone.y]);
      point_clone.x = newpoint[0];
      point_clone.y = newpoint[1];
      return point_clone;
    } else {
      return point;
    }
  }

  return viewer;
}

function createMap(opt) {
  if (opt.url) {
    $.ajax({
      type: "get",
      dataType: "json",
      url: opt.url,
      timeout: 0, //永不超时
      success: function (config) {
        //map初始化
        var configdata = config.map3d;
        if (config.serverURL) configdata.serverURL = config.serverURL;
        if (opt.serverURL) configdata.serverURL = opt.serverURL;

        createMapByData(opt, configdata, config);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("Json文件" + opt.url + "加载失败！");
        Uti.alert("Json文件" + opt.url + "加载失败！");
      },
    });
    return null;
  } else {
    if (opt.serverURL && opt.data) opt.data.serverURL = opt.serverURL;
    return createMapByData(opt, opt.data);
  }
}

function createMapByData(opt, configdata, jsondata) {
  if (configdata == null) {
    console.log("配置信息不能为空！");
    return;
  }

  if (copyright) {
    try {
      eval(
        (function (p, a, c, k, e, r) {
          e = function e(c) {
            return c.toString(a);
          };
          if (!"".replace(/^/, String)) {
            while (c--) {
              r[e(c)] = k[c] || e(c);
            }
            k = [
              function (e) {
                return r[e];
              },
            ];
            e = function e() {
              return "\\w+";
            };
            c = 1;
          }
          while (c--) {
            if (k[c])
              p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
          }
          return p;
        })(
          '1(g(){2.3("\\4\\5\\6\\7\\8\\9\\a\\b d e\\f\\0\\h\\i %c \\j\\k\\l\\m\\n://o.p.q","r:s")},t);',
          30,
          30,
          "u67b6|setTimeout|console|log|u5f53|u524d|u4e09|u7ef4|u5730|u56fe|u4f7f|u7528MarsGIS||for|Cesium|u6846|function|u5b9e|u73b0|u5b98|u65b9|u7f51|u7ad9|uff1ahttp|cesium|marsgis|cn|color|red|6E4".split(
            "|"
          ),
          0,
          {}
        )
      );
    } catch (e) {}
  }

  //var token = {
  //    hostname: 'marsgis',
  //    start: '2018-11-25 00:00:00',
  //    end: '2018-12-25 00:00:00',
  //    msg: unescape('%u5F53%u524D%u7CFB%u7EDF%u8BB8%u53EF%u5DF2%u5230%u671F%uFF0C%u8BF7%u8054%u7CFB%u4F9B%u5E94%u5546%u201C%u706B%u661F%u79D1%u6280%u201D%uFF01'),
  //};
  //if (!_util.checkToken(token)) {
  //    return;
  //}

  var viewer = initMap(opt.id, configdata, opt);

  //记录到全局变量，其他地方使用
  var gisdata = {};
  gisdata.config = configdata;

  viewer.gisdata = gisdata;

  if (opt.success) opt.success(viewer, gisdata, jsondata);

  return viewer;
}
