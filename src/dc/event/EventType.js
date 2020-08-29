/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-14 13:21:11
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 16:09:38
 */
// 事件类型

const BaseEventType = {
  ADD: "add",
  REMOVE: "remove",
};

const MouseEventType = {
  CLICK: Cesium.ScreenSpaceEventType.LEFT_CLICK, // (场景、覆盖物)鼠标点击事件
  RIGHT_CLICK: Cesium.ScreenSpaceEventType.RIGHT_CLICK,// (场景、覆盖物)鼠标右击事件
  DB_CLICK: Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,// (场景、覆盖物)鼠标双击事件
  MOUSE_MOVE: Cesium.ScreenSpaceEventType.MOUSE_MOVE,// (场景、覆盖物)鼠标移动事件
  WHEEL: Cesium.ScreenSpaceEventType.WHEEL,// (场景、覆盖物)鼠标滚轮事件
  MOUSE_OVER: 'mouseover',// (场景、覆盖物)鼠标移入事件
  MOUSE_OUT: 'mouseout',// (场景、覆盖物)鼠标移除事件
  DRAG_START: 'dragStart',
  DRAG_END: 'dragEnd',
  EDIT_START: 'editStart',
  EDIT_END: 'editEnd'
}

const ViewerEventType = {
  ADD_LAYER: 'addLayer',
  REMOVE_LAYER: 'removeLayer',
  ADD_EFFECT: 'addEffect',
  REMOVE_EFFECT: 'removeEffect',
  CLICK: Cesium.ScreenSpaceEventType.LEFT_CLICK,
  RIGHT_CLICK: Cesium.ScreenSpaceEventType.RIGHT_CLICK,
  DB_CLICK: Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  MOUSE_MOVE: Cesium.ScreenSpaceEventType.MOUSE_MOVE,
  WHEEL: Cesium.ScreenSpaceEventType.WHEEL
}

const SceneEventType = {
  CAMERA_MOVE_END: 'cameraMoveEnd',// 相机移动完成
  CAMERA_CHANGED: 'cameraChanged',// 相机位置完成
  PRE_RENDER: 'preRender',// 场景渲染前
  POST_RENDER: 'postRender',// 场景渲染后
  MORPH_COMPLETE: 'morphComplete',// 场景模式变化完成
  CLOCK_TICK: 'clockTick'// 时钟跳动
}

const LayerEventType {
  ...BaseEventType,
  CLEAR: 'clear'
}


const DrawEventType = {
  DRAW_START: "draw-start", // 开始绘制
  DRAW_ADD_POINT: "draw-add-point", // 绘制的过程中增加了点
  DRAW_MOVE_POINT: "draw-move-point", // 绘制中删除了last点
  DRAW_MOUSE_MOVE: "draw-mouse-move", // 绘制过程中鼠标移动了点
  DRAW_CREATED: "draw-created", // 创建完成

}

const EditEventType = {
  EDIT_START: "edit-start", // 开始编辑
  EDIT_MOVE_POINT: "edit-move-point", // 编辑修改了点
  EDIT_REMOVE_POINT: "edit-remove-point", // 编辑删除了点
  EDIT_STOP: "edit-stop", // 停止编辑
}


export { 
  MouseEventType,
  ViewerEventType,
  SceneEventType,
  LayerEventType,
  DrawEventType,
  EditEventType
 };
