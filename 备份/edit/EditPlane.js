class EditPlane extends EditBase {



  //外部更新位置
  setPositions(position) {
    if (util.isArray(position) && position.length == 1) {
      position = position[0];
    }
    this.entity._positions_draw = position;
  }
  //图形编辑结束后调用

  finish() {}
  updatePlane(style) {
    var dimensionsX = Cesium.defaultValue(style.dimensionsX, 100.0);
    var dimensionsY = Cesium.defaultValue(style.dimensionsY, 100.0);
    var dimensions = new Cesium.Cartesian2(dimensionsX, dimensionsY);
    this.entity.plane.dimensions.setValue(dimensions);
  }
  bindDraggers() {
    var _this2 = this;

    var style = this.entity.attribute.style;

    //位置中心点
    var positionZXD = this.entity._positions_draw;
    var dragger = draggerCtl.createDragger(this.entityCollection, {
      position: positionZXD,
      onDrag: function onDrag(dragger, position) {
        _this2.entity._positions_draw = position;
        _this2.updateDraggers();
      }
    });
    this.draggers.push(dragger);

    //平面的x长度调整
    var offest = {
      x: 0,
      y: 0,
      z: 0
    };
    switch (style.plane_normal) {
      case "x":
        offest.y = style.dimensionsX / 2;
        break;
      default:
        offest.x = style.dimensionsX / 2;
        break;
    }
    var position1 = (0, _matrix.getPositionTranslation)(positionZXD, offest);
    var dragger = draggerCtl.createDragger(this.entityCollection, {
      position: position1,
      type: draggerCtl.PointType.EditAttr,
      tooltip: _Tooltip.message.dragger.editRadius.replace('半径', '长度(X方向)'),
      onDrag: function onDrag(dragger, position) {
        var newHeight = Cesium.Cartographic.fromCartesian(positionZXD).height;
        position = (0, _point.setPositionsHeight)(position, newHeight);
        dragger.position = position;

        var radius = _this2.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
        style.dimensionsX = radius * 2;

        _this2.updatePlane(style);
        _this2.updateDraggers();
      }
    });
    this.draggers.push(dragger);

    //平面的y宽度调整
    if (style.plane_normal == "z") {
      var offest = {
        x: 0,
        y: style.dimensionsY / 2,
        z: 0
      };
      var position2 = (0, _matrix.getPositionTranslation)(positionZXD, offest);

      var dragger = draggerCtl.createDragger(this.entityCollection, {
        position: position2,
        type: draggerCtl.PointType.EditAttr,
        tooltip: _Tooltip.message.dragger.editRadius.replace('半径', '宽度(Y方向)'),
        onDrag: function onDrag(dragger, position) {
          var newHeight = Cesium.Cartographic.fromCartesian(positionZXD).height;
          position = (0, _point.setPositionsHeight)(position, newHeight);
          dragger.position = position;

          var radius = _this2.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
          style.dimensionsY = radius * 2;

          _this2.updatePlane(style);
          _this2.updateDraggers();
        }
      });
      this.draggers.push(dragger);
    } else {
      var offest = {
        x: 0,
        y: 0,
        z: 0
      };
      switch (style.plane_normal) {
        case "x":
        case "y":
          offest.z = style.dimensionsY / 2;
          break;
        default:
          offest.y = style.dimensionsY / 2;
          break;
      }
      //顶部的 高半径 编辑点
      var position2 = (0, _matrix.getPositionTranslation)(positionZXD, offest);

      var dragger = draggerCtl.createDragger(this.entityCollection, {
        position: position2,
        type: draggerCtl.PointType.MoveHeight,
        tooltip: _Tooltip.message.dragger.editRadius.replace('半径', '宽度(Y方向)'),
        onDrag: function onDrag(dragger, position) {
          var radius = _this2.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
          style.dimensionsY = radius * 2;

          _this2.updatePlane(style);
          _this2.updateDraggers();
        }
      });
      this.draggers.push(dragger);
    }
  }
}
export default EditPlane
