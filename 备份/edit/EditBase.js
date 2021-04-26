class EditBase extends BaseClass {
  //========== 构造方法 ==========
  function EditBase(entity, viewer) {
    super()
    _this.entity = entity;
    _this.viewer = viewer;

    _this.draggers = [];
    _this._minPointNum = 1; //至少需要点的个数 (值是draw中传入)
    _this._maxPointNum = 9999; //最多允许点的个数 (值是draw中传入)
  }

  fire(type, data, propagate) {
    if (this._fire) this._fire(type, data, propagate);
  }
  formatNum(num, digits) {
    return (0, _point.formatNum)(num, digits);
  }
  setCursor(val) {
    this.viewer._container.style.cursor = val ? 'crosshair' : '';
  }
  //激活绘制

  activate() {
    if (this._enabled) {
      return this;
    }
    this._enabled = true;

    this.entity.inProgress = true;
    this.changePositionsToCallback();
    this.bindDraggers();
    this.bindEvent();

    this.fire(_MarsClass2.eventType.editStart, {
      edittype: this.entity.attribute.type,
      entity: this.entity
    });

    return this;
  }
  //释放绘制

  disable() {
    if (!this._enabled) {
      return this;
    }
    this._enabled = false;

    this.destroyEvent();
    this.destroyDraggers();
    this.finish();

    this.entity.inProgress = false;
    this.fire(_MarsClass2.eventType.editStop, {
      edittype: this.entity.attribute.type,
      entity: this.entity
    });
    this.tooltip.setVisible(false);

    return this;
  }
  changePositionsToCallback() {}
  //图形编辑结束后调用

  finish() {}
  //拖拽点 事件

  bindEvent() {
    var _this2 = this;

    var scratchBoundingSphere = new Cesium.BoundingSphere();
    var zOffset = new Cesium.Cartesian3();

    var draggerHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    draggerHandler.dragger = null;

    //选中后拖动
    draggerHandler.setInputAction(function(event) {
      var pickedObject = _this2.viewer.scene.pick(event.position);
      if (Cesium.defined(pickedObject)) {
        var entity = pickedObject.id || pickedObject.primitive.id || pickedObject.primitive;
        if (entity && Cesium.defaultValue(entity._isDragger, false)) {
          _this2.viewer.scene.screenSpaceCameraController.enableRotate = false;
          _this2.viewer.scene.screenSpaceCameraController.enableTilt = false;
          _this2.viewer.scene.screenSpaceCameraController.enableTranslate = false;
          _this2.viewer.scene.screenSpaceCameraController.enableInputs = false;

          if (_this2.viewer.mars && _this2.viewer.mars.popup) _this2.viewer.mars.popup.close(entity);

          draggerHandler.dragger = entity;
          draggerHandler.dragger.show = Cesium.defaultValue(entity._drawShow, false);

          _this2.setCursor(true);

          if (draggerHandler.dragger.onDragStart) {
            var position = (0, _point.getPositionValue)(draggerHandler.dragger.position);
            draggerHandler.dragger.onDragStart(draggerHandler.dragger, position);
          }

          _this2.fire(_MarsClass2.eventType.editMouseDown, {
            edittype: _this2.entity.attribute.type,
            entity: _this2.entity,
            position: event.position
          });
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    draggerHandler.setInputAction(function(event) {
      var dragger = draggerHandler.dragger;
      if (dragger) {
        switch (dragger._pointType) {
          case draggerCtl.PointType.MoveHeight:
            //改变高度垂直拖动
            var dy = event.endPosition.y - event.startPosition.y;

            var position = (0, _point.getPositionValue)(dragger.position, _this2.viewer.clock.currentTime);
            var tangentPlane = new Cesium.EllipsoidTangentPlane(position);

            scratchBoundingSphere.center = position;
            scratchBoundingSphere.radius = 1;

            var metersPerPixel = _this2.viewer.scene.frameState.camera.getPixelSize(scratchBoundingSphere,
              _this2.viewer.scene.frameState.context.drawingBufferWidth, _this2.viewer.scene.frameState.context
              .drawingBufferHeight) * 1.5;

            Cesium.Cartesian3.multiplyByScalar(tangentPlane.zAxis, -dy * metersPerPixel, zOffset);
            var newPosition = Cesium.Cartesian3.clone(position);
            Cesium.Cartesian3.add(position, zOffset, newPosition);

            dragger.position = newPosition;
            if (dragger.onDrag) {
              dragger.onDrag(dragger, newPosition, position);
            }
            _this2.updateAttrForEditing();
            break;
          default:
            //默认修改位置
            _this2.tooltip.showAt(event.endPosition, _Tooltip.message.edit.end);

            var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.endPosition, _this2.entity);

            if (point) {
              dragger.position = point;
              if (dragger.onDrag) {
                dragger.onDrag(dragger, point);
              }
              _this2.updateAttrForEditing();
            }
            break;
        }
        _this2.fire(_MarsClass2.eventType.editMouseMove, {
          edittype: _this2.entity.attribute.type,
          entity: _this2.entity,
          position: event.endPosition
        });
      } else {
        _this2.tooltip.setVisible(false);

        var pickedObject = _this2.viewer.scene.pick(event.endPosition);
        if (Cesium.defined(pickedObject)) {
          var entity = pickedObject.id;
          if (entity && Cesium.defaultValue(entity._isDragger, false) && entity.draw_tooltip) {
            var draw_tooltip = entity.draw_tooltip;

            //可删除时，提示右击删除
            if (draggerCtl.PointType.Control == entity._pointType && _this2._positions_draw && _this2._positions_draw
              .length && _this2._positions_draw.length > _this2._minPointNum) draw_tooltip += _Tooltip.message
              .del.def;

            if (_this2.viewer.mars.contextmenu && _this2.viewer.mars.contextmenu.show && _this2.viewer.mars.contextmenu
              .target == entity) {
              //删除右键菜单打开了不显示tooltip

            } else {
              _this2.tooltip.showAt(event.endPosition, draw_tooltip);
            }
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    draggerHandler.setInputAction(function(event) {
      var dragger = draggerHandler.dragger;
      if (dragger) {
        _this2.setCursor(false);
        dragger.show = true;

        var position = (0, _point.getPositionValue)(dragger.position, _this2.viewer.clock.currentTime);

        if (dragger.onDragEnd) {
          dragger.onDragEnd(dragger, position);
        }
        _this2.fire(_MarsClass2.eventType.editMovePoint, {
          edittype: _this2.entity.attribute.type,
          entity: _this2.entity,
          position: position
        });

        draggerHandler.dragger = null;

        _this2.viewer.scene.screenSpaceCameraController.enableRotate = true;
        _this2.viewer.scene.screenSpaceCameraController.enableTilt = true;
        _this2.viewer.scene.screenSpaceCameraController.enableTranslate = true;
        _this2.viewer.scene.screenSpaceCameraController.enableInputs = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    //右击删除一个点
    draggerHandler.setInputAction(function(event) {
      //右击删除上一个点
      var pickedObject = _this2.viewer.scene.pick(event.position);
      if (Cesium.defined(pickedObject)) {
        var entity = pickedObject.id;
        if (entity && Cesium.defaultValue(entity._isDragger, false) && draggerCtl.PointType.Control == entity
          ._pointType) {
          var isDelOk = _this2.deletePointForDragger(entity, event.position);

          if (isDelOk) _this2.fire(_MarsClass2.eventType.editRemovePoint, {
            edittype: _this2.entity.attribute.type,
            entity: _this2.entity
          });
        }
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    this.draggerHandler = draggerHandler;
  }
  destroyEvent() {
    this.viewer.scene.screenSpaceCameraController.enableRotate = true;
    this.viewer.scene.screenSpaceCameraController.enableTilt = true;
    this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
    this.viewer.scene.screenSpaceCameraController.enableInputs = true;

    this.setCursor(false);

    if (this.draggerHandler) {
      if (this.draggerHandler.dragger) this.draggerHandler.dragger.show = true;

      this.draggerHandler.destroy();
      this.draggerHandler = null;
    }
  }
  bindDraggers() {}
  updateDraggers() {
    if (!this._enabled) {
      return this;
    }

    this.destroyDraggers();
    this.bindDraggers();
  }
  destroyDraggers() {
    for (var i = 0, len = this.draggers.length; i < len; i++) {
      this.entityCollection.remove(this.draggers[i]);
    }
    this.draggers = [];
  }
  //删除点

  deletePointForDragger(dragger, position) {
    if (!this._positions_draw) return;
    if (this._positions_draw.length - 1 < this._minPointNum) {
      this.tooltip.showAt(position, _Tooltip.message.del.min + this._minPointNum);
      return false;
    }

    var index = dragger.index;
    if (index >= 0 && index < this._positions_draw.length) {
      this._positions_draw.splice(index, 1);
      this.updateDraggers();
      this.updateAttrForEditing();
      return true;
    } else {
      return false;
    }
  }
  updateAttrForEditing() {}


  get entityCollection() {
    return this.entity.entityCollection;
  }
}
export default EditBase
