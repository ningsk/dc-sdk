/*
 * @Descriptton: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-11 11:10:19
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-11 11:29:25
 */
import * as Cesium from "cesium";

const BaseEventType = {
    ADD: 'add',
    REMOVE: 'remove'
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
    CAMERA_MOVE_END: 'cameraMoveEnd',
    CAMERA_CHANGED: 'cameraChanged',
    PRE_UPDATE: 'preUpdate',
    POST_UPDATE: 'postUpdate',
    PRE_RENDER: 'preRender',
    POST_RENDER: 'postRender',
    MORPH_COMPLETE: 'morphComplete',
    CLOCK_TICK: 'clockTick'
}

const OverlayEventType = {
    ...BaseEventType,
    CLICK: Cesium.ScreenSpaceEventType.LEFT_CLICK,
    RIGHT_CLICK: Cesium.ScreenSpaceEventType.RIGHT_CLICK,
    DB_CLICK: Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    MOUSE_OVER: 'mouseover',
    MOUSE_OUT: 'mouseout'
}

const DrawEventType = {
    DRAW_ADD_POINT: "drawAddPoint",
    DRAW_CREATED: "drawCreated",
    DRAW_MOUSE_MOVE: "drawMouseMove",
    DRAW_REMOVE_POINT: "drawRemovePoint",
    DRAW_START: "drawStart"
}

const EditEventType = {
    EDIT_MOUSE_DOWN: "editMouseDown",
    EDIT_MOUSE_MOVE: "editMouseMove",
    EDIT_MOVE_POINT: "editMovePoint",
    EDIT_REMOVE_POINT: "editRemovePoint",
    EDIT_START: "editStart",
    EDIT_STOP: "editStop",
    EDIT_STYLE: "editStyle"
}

const LayerGroupEventType = BaseEventType

const LayerEventType = BaseEventType

export {
    MouseEventType,
    ViewerEventType,
    SceneEventType,
    LayerGroupEventType,
    LayerEventType,
    OverlayEventType,
    DrawEventType,
    EditEventType
}
