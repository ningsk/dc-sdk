import * as Cesium from 'cesium'
const BaseEventType = {
  ADD: 'add', // 添加了对象
  REMOVE: 'remove', // 移除了对象
  SHOW: 'show', // 显示对象
  HIDE: 'hide' // 隐藏对象
}
const ThingEventType = {
	...BaseEventType
}
const EffectEventType = {
  ...BaseEventType
}
const LayerEventType = {
  ...BaseEventType,
  // 3dtiles模型
  INITIAL_TILES_LOADED: 'initialTilesLoaded', // 3dtiles模型 模型瓦片初始化完成，开始加载瓦片
  ALL_TILES_LOADED: 'allTilesLoaded', // 3dtiles模型，当前批次模型加载完成，才回调会执行多次，视角变化后重新加载完成后都会回调
  // 瓦片底图
  LOAD_TILES_START: 'loadTileStart', // 栅格瓦片图层 开始加载瓦片
  LOAD_TILES_END: 'loadTileEnd', // 栅格瓦片图层 加载瓦片完成
  LOAD_TILE_ERROR: 'loadTileError' // 栅格瓦片图层 加载瓦片出错le
}

const MouseEventType = {
  CLICK: Cesium.ScreenSpaceEventType.LEFT_CLICK,
  RIGHT_CLICK: Cesium.ScreenSpaceEventType.RIGHT_CLICK,
  DB_CLICK: Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  MOUSE_MOVE: Cesium.ScreenSpaceEventType.MOUSE_MOVE,
  WHEEL: Cesium.ScreenSpaceEventType.WHEEL,
  MOUSE_OVER: 'mouseover',
  MOUSE_OUT: 'mouseout'
}
const SceneEventType = {
  CAMERA_MOVE_START: 'cameraMoveStart', // 相机启动移动前 场景事件
  CAMERA_MOVE_END: 'cameraMoveChange', // 相机移动完成后 场景事件
  CAMERA_CHANGED: 'cameraChanged', // 相机位置完成 场景事件
  PRE_UPDATE: 'preUpdate', // 场景更新前 场景事件
  POST_UPDATE: 'postUpdate', // 场景更新后 场景事件
  PRE_RENDER: 'preRender', // 场景渲染前 场景事件
  POST_RENDER: 'postRender', // 场景选然后 场景事件
  MORPH_START: 'morphStart', // 场景模式 2d/3d/哥伦比试图 变化前场景事件
  MORPH_COMPLETE: 'morphComplete', // 完成场景模式 变化 场景事件
  CLOCK_TICK: 'clockTick' // 时钟跳动  场景事件
}

const ViewerEventType = {
  ADD_LAYER: 'addLayer',
  REMOVE_LAYER: 'removeLayer',
  ADD_EFFECT: 'addEffect',
  REMOVE_EFFECT: 'removeEffect',
  ADD_THINGS: 'addThings',
  REMOVE_THINGS: 'removeThings',
  CLICK: Cesium.ScreenSpaceEventType.LEFT_CLICK,
  RIGHT_CLICK: Cesium.ScreenSpaceEventType.RIGHT_CLICK,
  DB_CLICK: Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  MOUSE_MOVE: Cesium.ScreenSpaceEventType.MOUSE_MOVE,
  WHEEL: Cesium.ScreenSpaceEventType.WHEEL
}

const DrawEventType = {
  DRAW_START: 'drawStart', // 开始绘制 标绘事件
  DRAW_MOUSE_MOVE: 'drawMouseMove', // 鼠标正在移动中
  DRAW_ADD_POINT: 'drawAddPoint', // 绘制过程中增加了点 绘制事件
  DRAW_REMOVE_POINT: 'drawRemovePoint', // 绘制过程中移除了点 绘制事件
  DRAW_CREATED: 'drawCreated' // 创建完成 标绘事
}

const EditEventType = {
  Edit_START: 'editStart', // 开始编辑 标绘事件
  EDIT_MOUSE_DOWN: 'editMouseDown', // 移动鼠标按下左键(LEFT_DOWN) 标绘事件
  EDIT_MOUSE_MOVE: 'editMouseMove', // 鼠标正在移动，正在编辑拖拽修改殿中(MOUSE_MOVE)
  EDIT_MOVE_POINT: 'editMovePoint', // 编辑修改了点(LEFT_UP) 标绘事件
  EDIT_REMOVE_POINT: 'editRemovePoint', // 编辑删除了点 标绘事件
  EDIT_STYLE: 'editStyle', // 图上编辑修改了相关style属性 标绘事件
  EDIT_STOP: 'editStop' // 停止编辑 标绘事件
}

const PlotEventType = {
  ...DrawEventType,
  ...EditEventType
}

const OverlayEventType = {
  ...BaseEventType
}
const GraphicEventType = {
  ...BaseEventType
}
const LayerGroupEventType = {
  ...BaseEventType
}
export {
  MouseEventType,
  SceneEventType,
  ViewerEventType,
  LayerEventType,
  ThingEventType,
  EffectEventType,
  OverlayEventType,
  GraphicEventType,
  PlotEventType,
  LayerGroupEventType
}
