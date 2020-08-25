import { Util, Draggable } from "../utils";
import { EventType } from "../event";
import { CesiumWidget } from "cesium";

/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:52:40
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-25 16:18:57
 */
class EditBase {

  _dataSource = null;
  _minPointNum = 1; // 至少需要点的个数 （值是draw中传入）
  _maxPointNum = 9999; // 最多允许点的个数 （值是draw中传入）
  
  constructor(entity, viewer, dataSource) {
    this.entity = entity;
    this.viewer = viewer;
    this.dataSource = dataSource;
    this.draggers = [];
  }

  fire(type, data, propagate) {
    if (this._fire) this._fire(type, data, propagate);
  }

  formatNum(num, digits) {
    return Util.formatNum(num, digits);
  }

  // 激活绘制
  activate() {
    if (this._enabled) {
      return this;
    }

    this._enabled = true;
    this.entity.inProgress = true;
    this.changePositionsToCallback();
    this.bindDraggers();
    this.bindEvent();
    this.fire(EventType.EditStart, {
      edittype: this.entity.attribute.type,
      entity: this.entity
    });

    return this;
  }

  // 释放绘制
  disable() {
    if (!this._enabled) {
      return this;
    }

    this._enabled = false;
    this.destroyEvent();
    this.destroyDraggers();
    this.finish();

    this.entity.inProgress = false;

    this.fire(EventType.EditStop, {
      EditStop: this.entity.attribute.type,
      entity: this.entity
    });

    this.tooltip.setVisible(false);
    return this;

  }

  changePositionsToCallback() {}

  // 图形编辑结束后调用
  finish() {}

  // 拖拽点事件
  bind event() {
    var _this = this;

    var scratchBoundingSphere = new Cesium.BoundingSphere();
    var zOffset = new Cesium.Cartesian3();
    var draggerHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    draggerHandler.dragger = null;

    // 选中后拖动
    draggerHandler.setInputAction((event) => {
      var pickObject = _this.viewer.scene.pick(event.position);
      if (Cesium.defined(pickObject)) {
        var entity = pickObject.id || pickObject.primitive.id || pickObject.primitive;
        if (entity && Cesium.defaultValue(entity.)isDragger, false)) {
          _this.viewer.scene.screenSpaceCameraController.enableRotate = false;
          _this.viewer.scene.screenSpaceCameraController.enableTilt = false;
          _this.viewer.scene.screenSpaceCameraController.enableTranslate = false;
          _this.viewer.scene.screenSpaceCameraController.enableInput = false;

          draggerHandler.dragger = entity;
          if (draggerHandler.dragger.onDragStart) {
            var position = draggerHandler.dragger.position;
            if (position && position.getValue) position = position.getValue();
            draggerHandler.dragger.onDragStart(draggerHandler.dragger, position);
          }

        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    draggerHandler.setInputAction((event) => {
      var dragger = draggerHandler.dragger;
      if (dragger) {
        switch(dragger._pointType) {
          case Draggable
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  }


}

export default EditBase;