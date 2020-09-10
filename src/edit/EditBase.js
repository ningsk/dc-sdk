import { Util, PointUtil, Tooltip } from "../utils";
import { EventType } from "../event";
import Cesium from "cesium";
import { Class } from "leaflet";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:52:40
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-10 11:14:02
 */
export var EditBase = Class.extend({
  _dataSource: null,
  _minPointNum: 1, // 至少需要点的个数 （值是draw中传入）
  _maxPointNum: 9999, // 最多允许点的个数 （值是draw中传入）
  initialize: function (entity, viewer, dataSource) {
    this.entity = entity;
    this.viewer = viewer;
    this.dataSource = dataSource;
    this.draggers = [];
  },

  fire: function (type, data, propagate) {
    if (this._fire) this._fire(type, data, propagate);
  },

  formatNum: function (num, digits) {
    return Util.formatNum(num, digits);
  },

  // 激活绘制
  activate: function () {
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
      entity: this.entity,
    });

    return this;
  },

  // 释放绘制
  disable: function () {
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
      entity: this.entity,
    });

    this.tooltip.setVisible(false);
    return this;
  },

  changePositionsToCallback: function () {},

  // 图形编辑结束后调用
  finish: function () {},

  // 拖拽点事件
  bindEvent: function () {
    var _this = this;
    var scratchBoundingSphere = new Cesium.BoundingSphere();
    var zOffset = new Cesium.Cartesian3();
    var draggerHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    draggerHandler.dragger = null;

    // 选中后拖动
    draggerHandler.setInputAction((event) => {
      var pickObject = _this.viewer.scene.pick(event.position);
      if (Cesium.defined(pickObject)) {
        var entity =
          pickObject.id || pickObject.primitive.id || pickObject.primitive;
        if (entity && Cesium.defaultValue(entity.isDragger, false)) {
          _this.viewer.scene.screenSpaceCameraController.enableRotate = false;
          _this.viewer.scene.screenSpaceCameraController.enableTilt = false;
          _this.viewer.scene.screenSpaceCameraController.enableTranslate = false;
          _this.viewer.scene.screenSpaceCameraController.enableInput = false;

          draggerHandler.dragger = entity;
          if (draggerHandler.dragger.onDragStart) {
            var position = draggerHandler.dragger.position;
            if (position && position.getValue) position = position.getValue();
            draggerHandler.dragger.onDragStart(
              draggerHandler.dragger,
              position
            );
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    draggerHandler.setInputAction((event) => {
      var dragger = draggerHandler.dragger;
      if (dragger) {
        switch (dragger._pointType) {
          case Dragger.PointType.MoveHeight:
            // 改变高度垂直拖动
            var dy = event.endPosition.y - event.startPosition.y;

            var position = dragger.position;
            if (position && position.getValue) position = position.getValue();

            var tangentPlane = new Cesium.EllipsoidTangentPlane(position);
            scratchBoundingSphere.center = position;
            scratchBoundingSphere.radius = 1;

            var metersPerPixel =
              _this.viewer.scene.frameState.camera.getPixelSize(
                scratchBoundingSphere,
                _this.viewer.scene.frameState.context.drawingBufferWidth,
                _this.viewer.scene.frameState.context.drawingBufferHeight
              ) * 1.5;

            Cesium.Cartesian3.multiplyByScalar(
              tangentPlane.zAxis,
              -dy * metersPerPixel,
              zOffset
            );
            var newPosition = Cesium.Cartesian3.clone(position);
            Cesium.Cartesian3.add(position, zOffset, newPosition);

            dragger.position = newPosition;
            if (dragger.onDrag) {
              dragger.onDrag(dragger, newPosition, position);
            }
            _this.updateAttrForEditing();
            break;
          default:
            // 默认修改位置
            _this.tooltip.showAt(event.endPosition, Tooltip.message.edit.end);
            var point = PointUtil.getCurrentMousePosition(
              _this.viewer.scene,
              event.endPosition,
              _this.entity
            );

            if (point) {
              dragger.position = point;
              if (dragger.onDrag) {
                dragger.onDrag(dragger, point);
              }

              _this.updateAttrForEditing();
            }

            break;
        }
      } else {
        _this.tooltip.setVisible(false);
        var pickedObject = _this.viewer.scene.pick(event.endPosition);
        if (Cesium.defined(pickedObject)) {
          var entity = pickedObject.id;
          if (
            entity &&
            Cesium.defaultValue(entity._isDragger, false) &&
            entity.draw_tooltip
          ) {
            var draw_tooltip = entity.draw_tooltip;
            // 可删除时，提示右击删除
            if (
              Dragger.PointType.Control == entity._pointType &&
              _this._positions_draw &&
              _this._positions_draw.length &&
              _this._positions_draw.length > _this._minPointNum
            ) {
              draw_tooltip += Tooltip.message.del.def;
            }

            _this.tooltip.showAt(event.endPosition, draw_tooltip);
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    dragger.setInputAction((event) => {
      var dragger = draggerHandler.dragger;
      if (dragger) {
        var position = dragger.position;
        if (position && position.getValue) {
          position = position.getValue();
        }
        if (dragger.onDragEnd) {
          dragger.onDragEnd(dragger, position);
        }

        _this.fire(EventType.EditMovePoint, {
          edittype: _this.entity.attribute.type,
          entity: _this.entity,
          position: position,
        });

        draggerHandler.dragger = null;

        _this.viewer.scene.screenSpaceCameraController.enableRotate = true;
        _this.viewer.scene.screenSpaceCameraController.enableTilt = true;
        _this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
        _this.viewer.scene.screenSpaceCameraController.enableInputs = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    // 右击删除
    draggerHandler.setInputAction((event) => {
      // 右击删除上一个点
      var pickObject = _this.viewer.scene.pick(event.position);
      if (Cesium.defined(pickObject)) {
        var entity = pickObject.id;
        if (
          entity &&
          Cesium.defaultValue(entity._isDragger, false) &&
          Dragger.PointType.Control == entity._pointType
        ) {
          var isDelOk = _this.deletePointForDragger(entity, event.position);

          if (isDelOk) {
            _this.fire(EventType.EditRemovePoint, {
              edittype: _this.entity.attribute.type,
              entity: _this.entity,
            });
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    this.draggerHandler = draggerHandler;
  },

  destroyEvent: function () {
    this.viewer.scene.screenSpaceCameraController.enableRotate = true;
    this.viewer.scene.screenSpaceCameraController.enableTile = true;
    this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
    this.viewer.scene.screenSpaceCameraController.enableInputs = true;

    if (this.draggerHandler) {
      this.draggerHandler.destroy();
      this.draggerHandler = null;
    }
  },

  bindDraggers: function () {},

  updateDraggers: function () {
    if (!this._enabled) {
      return this;
    }

    this.destroyDraggers();
    this.bindDraggers();
  },

  destroyDraggers: function () {
    for (var i = 0, len = this.draggers.length; i < len; i++) {
      this.dataSource.entities.remove(this.draggers[i]);
    }
    this.draggers = [];
  },

  deletePointForDragger: function (dragger, position) {
    if (this._positions_draw.length - 1 < this._minPointNum) {
      this.tooltip.showAt(
        Tooltip.message.del.min(position) + this._minPointNum
      );
      return false;
    }

    var index = dragger.index;
    if (index > 0 && index < this._positions_draw.length) {
      this._positions_draw.splice(index, 1);
      this.updateDraggers();
      return true;
    } else {
      return false;
    }
  },

  updateAttrForEditing: function () {},
});
