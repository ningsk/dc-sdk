/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(92);

__webpack_require__(93);

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _version = __webpack_require__(47);

var ver = _interopRequireWildcard(_version);

var _ViewerEx = __webpack_require__(48);

var _MarsClass = __webpack_require__(3);

var _widgetManager = __webpack_require__(72);

var widget = _interopRequireWildcard(_widgetManager);

var _BaseWidget = __webpack_require__(133);

var _map = __webpack_require__(135);

var _layer = __webpack_require__(23);

var layer = _interopRequireWildcard(_layer);

var _FloodByEntity = __webpack_require__(137);

var _FloodByTerrain = __webpack_require__(138);

var _Measure = __webpack_require__(139);

var _MeasureAngle = __webpack_require__(74);

var _MeasureArea = __webpack_require__(36);

var _MeasureAreaSurface = __webpack_require__(76);

var _MeasureHeight = __webpack_require__(77);

var _MeasureHeightTriangle = __webpack_require__(78);

var _MeasureLength = __webpack_require__(37);

var _MeasureLengthSection = __webpack_require__(79);

var _MeasureLengthSurface = __webpack_require__(80);

var _MeasurePoint = __webpack_require__(81);

var _MeasureVolume = __webpack_require__(82);

var _Skyline = __webpack_require__(140);

var _TerrainClip = __webpack_require__(142);

var _TerrainClipPlan = __webpack_require__(143);

var _Underground = __webpack_require__(144);

var _ViewShed3D = __webpack_require__(145);

var _Sightline = __webpack_require__(147);

var _ContourLine = __webpack_require__(148);

var _Slope = __webpack_require__(75);

var _MixedOcclusion = __webpack_require__(149);

var _TilesEditor = __webpack_require__(151);

var _TilesClipPlan = __webpack_require__(86);

var _TilesClip = __webpack_require__(152);

var _TilesFlat = __webpack_require__(155);

var _TilesFlood = __webpack_require__(156);

var _GltfClipPlan = __webpack_require__(157);

var _FlyLine = __webpack_require__(158);

var _KeyboardRoam = __webpack_require__(70);

var _FirstPersonRoam = __webpack_require__(159);

var _Draw = __webpack_require__(6);

var _index = __webpack_require__(20);

var Attr = _interopRequireWildcard(_index);

var _Tooltip = __webpack_require__(7);

var _Dragger = __webpack_require__(14);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Edit = __webpack_require__(28);

var _Edit2 = __webpack_require__(65);

var _Edit3 = __webpack_require__(62);

var _Edit4 = __webpack_require__(60);

var _Edit5 = __webpack_require__(66);

var _Edit6 = __webpack_require__(59);

var _Edit7 = __webpack_require__(29);

var _Edit8 = __webpack_require__(11);

var _Edit9 = __webpack_require__(25);

var _Edit10 = __webpack_require__(61);

var _Edit11 = __webpack_require__(64);

var _Edit12 = __webpack_require__(67);

var _Edit13 = __webpack_require__(69);

var _Edit14 = __webpack_require__(68);

var _PlotUtil = __webpack_require__(9);

__webpack_require__(160);

__webpack_require__(162);

__webpack_require__(164);

__webpack_require__(166);

__webpack_require__(168);

__webpack_require__(170);

__webpack_require__(172);

__webpack_require__(174);

__webpack_require__(176);

__webpack_require__(178);

__webpack_require__(180);

__webpack_require__(181);

__webpack_require__(182);

__webpack_require__(183);

__webpack_require__(184);

__webpack_require__(185);

var _DrawP = __webpack_require__(186);

var _EditP = __webpack_require__(89);

var _CircleFadeMaterial = __webpack_require__(189);

var _CircleWaveMaterial = __webpack_require__(50);

var _CircleScanMaterial = __webpack_require__(191);

var _GroundLineFlowMaterial = __webpack_require__(193);

var _LineFlowMaterial = __webpack_require__(39);

var _TextMaterial = __webpack_require__(195);

var _RectangularSensorPrimitive = __webpack_require__(90);

var _RectangularSensorGraphics = __webpack_require__(85);

var _RectangularSensorVisualizer = __webpack_require__(201);

var _DivPoint = __webpack_require__(87);

var _DynamicRiver = __webpack_require__(202);

var _water = __webpack_require__(55);

var water = _interopRequireWildcard(_water);

var _ParticleSystemEx = __webpack_require__(206);

var _FlatBillboard = __webpack_require__(207);

var _FlatImage = __webpack_require__(210);

var _ConeGlow = __webpack_require__(212);

var _DiffuseWallGlow = __webpack_require__(217);

var _ScrollWallGlow = __webpack_require__(220);

var _FogEffect = __webpack_require__(223);

var _InvertedScene = __webpack_require__(225);

var _SnowCover = __webpack_require__(227);

var _Rain = __webpack_require__(229);

var _Rain2 = _interopRequireDefault(_Rain);

var _Snow = __webpack_require__(230);

var _Snow2 = _interopRequireDefault(_Snow);

var _ZoomNavigation = __webpack_require__(231);

var _matrix = __webpack_require__(17);

var matrix = _interopRequireWildcard(_matrix);

var _model = __webpack_require__(232);

var model = _interopRequireWildcard(_model);

var _point = __webpack_require__(2);

var point = _interopRequireWildcard(_point);

var _polygon = __webpack_require__(13);

var polygon = _interopRequireWildcard(_polygon);

var _polyline = __webpack_require__(22);

var polyline = _interopRequireWildcard(_polyline);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

var _util = __webpack_require__(1);

var util = _interopRequireWildcard(_util);

var _config2Entity = __webpack_require__(32);

var _defaultContextMenu = __webpack_require__(71);

var _measure = __webpack_require__(30);

var measure = _interopRequireWildcard(_measure);

var _tileset = __webpack_require__(27);

var tileset = _interopRequireWildcard(_tileset);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

var _Video3D = __webpack_require__(233);

var _Video2D = __webpack_require__(235);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.Cesium = Cesium; //方便vue等技术栈直接使用


//===========框架基本信息=========  


exports.name = "dc ( MarsGIS for Cesium )三维地球框架";
exports.website = "http://cesium.marsgis.cn";
exports.author = "欧科科技 木遥";
exports.version = ver.version;
exports.update = ver.update;

//=============Cesium原生对象做的外挂扩展=====================

exports.ViewerEx = _ViewerEx.ViewerEx;

//=============基础类=====================

exports.MarsClass = _MarsClass.MarsClass;
exports.event = _MarsClass.eventType;

//=============widget=====================

exports.widget = widget;

exports.widget.BaseWidget = _BaseWidget.BaseWidget;

//=============三维框架类=====================

exports.createMap = _map.createMap;

exports.layer = layer;

//=====================分析相关=====================
exports.analysi = {};

//淹没分析（polygon矢量面抬高）

exports.analysi.FloodByEntity = _FloodByEntity.FloodByEntity;

//淹没分析 （基于terrain地形）

exports.analysi.FloodByTerrain = _FloodByTerrain.FloodByTerrain;

//量算（长度、面积、角度等）

exports.analysi.Measure = _Measure.Measure;

exports.analysi.MeasureAngle = _MeasureAngle.MeasureAngle;

exports.analysi.MeasureArea = _MeasureArea.MeasureArea;

exports.analysi.MeasureAreaSurface = _MeasureAreaSurface.MeasureAreaSurface;

exports.analysi.MeasureHeight = _MeasureHeight.MeasureHeight;

exports.analysi.MeasureHeightTriangle = _MeasureHeightTriangle.MeasureHeightTriangle;

exports.analysi.MeasureLength = _MeasureLength.MeasureLength;

exports.analysi.MeasureLengthSection = _MeasureLengthSection.MeasureLengthSection;

exports.analysi.MeasureLengthSurface = _MeasureLengthSurface.MeasureLengthSurface;

exports.analysi.MeasurePoint = _MeasurePoint.MeasurePoint;

exports.analysi.MeasureVolume = _MeasureVolume.MeasureVolume; //方量分析


//天际线 描边

exports.analysi.Skyline = _Skyline.Skyline;

//地形开挖 类 (基于地形)

exports.analysi.TerrainClip = _TerrainClip.TerrainClip;

//地形开挖 类（平面 Plan原生）

exports.analysi.TerrainClipPlan = _TerrainClipPlan.TerrainClipPlan;

//地下模式

exports.analysi.Underground = _Underground.Underground;

//可视域分析 

exports.analysi.ViewShed3D = _ViewShed3D.ViewShed3D;

//通视分析

exports.analysi.Sightline = _Sightline.Sightline;

//等高线

exports.analysi.ContourLine = _ContourLine.ContourLine;

//坡度坡向

exports.analysi.Slope = _Slope.Slope;

//=====================3dtiles模型 分析相关  =====================
exports.tiles = {};

//混合遮挡

exports.tiles.MixedOcclusion = _MixedOcclusion.MixedOcclusion;

//模型编辑（移动、旋转等）

exports.tiles.TilesEditor = _TilesEditor.TilesEditor;

//模型裁剪（平面 Plan原生）

exports.tiles.TilesClipPlan = _TilesClipPlan.TilesClipPlan;

//模型 裁剪（单个、对数据有要求）

exports.tiles.TilesClip = _TilesClip.TilesClip;

//模型 压平分析 （单个、对数据有要求）

exports.tiles.TilesFlat = _TilesFlat.TilesFlat;

//模型 淹没分析（单个、对数据有要求）

exports.tiles.TilesFlood = _TilesFlood.TilesFlood;

//gltf模型 裁剪

exports.GltfClipPlan = _GltfClipPlan.GltfClipPlan;

//=====================相机 视角 相关=====================

exports.FlyLine = _FlyLine.FlyLine;

exports.KeyboardType = _KeyboardRoam.KeyboardType;

exports.FirstPersonRoam = _FirstPersonRoam.FirstPersonRoam;

//=====================Draw标绘=====================

exports.Draw = _Draw.Draw;

exports.draw = {};
exports.draw.register = _Draw.register;

exports.draw.attr = Attr;

exports.draw.tooltip = _Tooltip.message;

exports.draw.dragger = draggerCtl;

exports.DrawEdit = {};

exports.DrawEdit.Base = _Edit.EditBase;

exports.DrawEdit.Circle = _Edit2.EditCircle;

exports.DrawEdit.Corridor = _Edit3.EditCorridor;

exports.DrawEdit.Curve = _Edit4.EditCurve;

exports.DrawEdit.Ellipsoid = _Edit5.EditEllipsoid;

exports.DrawEdit.Point = _Edit6.EditPoint;

exports.DrawEdit.Polygon = _Edit7.EditPolygon;

exports.DrawEdit.PolygonEx = _Edit8.EditPolygonEx;

exports.DrawEdit.Polyline = _Edit9.EditPolyline;

exports.DrawEdit.PolylineVolume = _Edit10.EditPolylineVolume;

exports.DrawEdit.Rectangle = _Edit11.EditRectangle;

exports.DrawEdit.Wall = _Edit12.EditWall;

exports.DrawEdit.Box = _Edit13.EditBox;

exports.DrawEdit.Plane = _Edit14.EditPlane;

//Draw标绘 扩展部分，下面也可以单独插件的方式另外打包

exports.draw.plotUtil = _PlotUtil.plotUtil;

//绘制primitive类型

exports.DrawP = _DrawP.DrawP;
exports.draw.registerP = _DrawP.registerP;

exports.DrawEdit.PModel = _EditP.EditPModel;

//=====================扩展的矢量对象=====================
//扩展的材质

exports.CircleFadeMaterial = _CircleFadeMaterial.CircleFadeMaterial;

exports.CircleWaveMaterial = _CircleWaveMaterial.CircleWaveMaterial;

exports.CircleScanMaterial = _CircleScanMaterial.CircleScanMaterial;

//贴地线

exports.GroundLineFlowMaterial = _GroundLineFlowMaterial.GroundLineFlowMaterial;

//动态线、墙

exports.LineFlowMaterial = _LineFlowMaterial.LineFlowMaterial;

//文本材质

exports.TextMaterial = _TextMaterial.TextMaterial;

//相控阵雷达

exports.RectangularSensorPrimitive = _RectangularSensorPrimitive.RectangularSensorPrimitive;
exports.RectangularSensorGraphics = _RectangularSensorGraphics.RectangularSensorGraphics;
exports.RectangularSensorVisualizer = _RectangularSensorVisualizer.RectangularSensorVisualizer;

//div点

exports.DivPoint = _DivPoint.DivPoint;

//动态河流、公路

exports.DynamicRiver = _DynamicRiver.DynamicRiver;

//水域 相关效果

exports.water = water;

//粒子效果封装

exports.ParticleSystemEx = _ParticleSystemEx.ParticleSystemEx;

//平放的图标

exports.FlatBillboard = _FlatBillboard.FlatBillboard;

//平放的图片（随地图缩放）

exports.FlatImage = _FlatImage.FlatImage;

//光柱椎体

exports.ConeGlow = _ConeGlow.ConeGlow;

//立体面(或圆)散射围墙效果

exports.DiffuseWallGlow = _DiffuseWallGlow.DiffuseWallGlow;

//走马灯围墙效果

exports.ScrollWallGlow = _ScrollWallGlow.ScrollWallGlow;

//=====================场景特效=====================
exports.scene = {};

//雾特效

exports.scene.FogEffect = _FogEffect.FogEffect;

//场景倒影

exports.scene.InvertedScene = _InvertedScene.InvertedScene;

//雾覆盖 效果

exports.scene.SnowCover = _SnowCover.SnowCover;

//=====================Shader特效=====================
exports.shader = {};
//雨雪 着色器

exports.shader.rain = _Rain2.default;

exports.shader.snow = _Snow2.default;

//===================== tool =====================

exports.ZoomNavigation = _ZoomNavigation.ZoomNavigation;

//===================== util =====================

exports.matrix = matrix;

exports.model = model;

exports.point = point;

exports.polygon = polygon;

exports.polyline = polyline;

exports.pointconvert = pointconvert;

exports.util = util;

exports.util.config2Entity = _config2Entity.config2Entity;

exports.util.getDefaultContextMenu = _defaultContextMenu.getDefaultContextMenu;

exports.measure = measure;

exports.tileset = tileset;

exports.log = marslog;

//=====================视频融合 相关  =====================
exports.video = {};

//视频融合（投射3D，贴物体表面）

exports.video.Video3D = _Video3D.Video3D;

//视频融合（投射2D平面） 

exports.video.Video2D = _Video2D.Video2D;



//===========兼容v2.2之前旧版本处理,非升级用户可删除下面代码 ============= 
exports.analysi.TerrainExcavate = _TerrainClip.TerrainClip; //1.9.0
exports.analysi.TerrainFlood = _FloodByTerrain.FloodByTerrain; //1.9.0
exports.analysi.VideoShed3D = _Video3D.Video3D; //1.9.0
exports.VideoShed3D = _Video3D.Video3D; //1.9.0

exports.util.terrainPolyline = polyline.computeSurfaceLine; //1.9.1
exports.point.formatPositon = point.formatPosition; //1.9.1  单词错误改正

exports.util.hasTerrain = layer.hasTerrain; //1.9.3
exports.util.getEllipsoidTerrain = layer.getEllipsoidTerrain; //1.9.3
exports.util.getTerrainProvider = layer.getTerrainProvider; //1.9.3

//移动了方法
exports.point.computePolygonHeightRange = polygon.getHeightRange; //2.0.2
exports.point.updateHeightForClampToGround = point.setPositionSurfaceHeight; //2.0.2 
exports.point.terrainPolyline = polyline.computeSurfaceLine; //2.0.2 
exports.util.getLinkedPointList = polyline.getLinkedPointList; //2.0.2 

exports.util.getLength = exports.measure.getLength; //2.1.0 
exports.util.getArea = exports.measure.getArea; //2.1.0 
exports.util.getAreaOfTriangle = exports.measure.getAreaOfTriangle; //2.1.0 
exports.util.getAngle = exports.measure.getAngle; //2.1.0 

exports.scene.RainFS = _Rain2.default; //2.2.0 
exports.scene.SnowFS = _Snow2.default; //2.2.0 
exports.draw.util = Attr; //2.2.0 
exports.draw.event = {
  DrawStart: _MarsClass.eventType.drawStart,
  DrawAddPoint: _MarsClass.eventType.drawAddPoint,
  DrawRemovePoint: _MarsClass.eventType.drawRemovePoint,
  DrawMouseMove: _MarsClass.eventType.drawMouseMove,
  DrawCreated: _MarsClass.eventType.drawCreated,
  EditStart: _MarsClass.eventType.editStart,
  EditMouseMoveStart: _MarsClass.eventType.editMouseDown,
  EditMouseMove: _MarsClass.eventType.editMouseMove,
  EditMovePoint: _MarsClass.eventType.editMovePoint,
  EditRemovePoint: _MarsClass.eventType.editRemovePoint,
  EditStop: _MarsClass.eventType.editStop,
  Delete: _MarsClass.eventType.delete,
  LoadEnd: _MarsClass.eventType.load
}; //2.2.0 
exports.analysi.HeightCounterByTerrain = _ContourLine.ContourLine; //2.2.0

/***/ }),
