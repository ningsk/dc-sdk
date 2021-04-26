class EditEllipsoid extends EditBase) {
  //外部更新位置
  setPositions(position) {
    this.entity._positions_draw[0] = position[0];
  }
  //图形编辑结束后调用
  finish() {}
  updateRadii(style) {
    var radii = new Cesium.Cartesian3(Number(style.extentRadii), Number(style.widthRadii), Number(style.heightRadii));
    this.entity.ellipsoid.radii.setValue(radii);
  }
  bindDraggers() {
    var that = this;

    var style = this.entity.attribute.style;

    //位置中心点
    var position = this.entity._positions_draw[0];
    var dragger = draggerCtl.createDragger(this.entityCollection, {
      position: position,
      onDrag: function onDrag(dragger, position) {
        that.entity._positions_draw[0] = position;

        that.updateDraggers();
      }
    });
    this.draggers.push(dragger);

    //顶部的 高半径 编辑点
    var position = (0, _point.getPositionValue)(this.entity.position, this.viewer.clock.currentTime);
    var dragger = draggerCtl.createDragger(this.entityCollection, {
      position: (0, _point.addPositionsHeight)(position, style.heightRadii),
      type: draggerCtl.PointType.MoveHeight,
      tooltip: _Tooltip.message.dragger.editRadius,
      onDrag: function onDrag(dragger, position) {
        var positionZXD = that.entity._positions_draw[0];
        var length = that.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
        style.heightRadii = length; //高半径

        that.updateRadii(style);
        that.updateDraggers();
      }
    });
    this.draggers.push(dragger);

    //获取圆（或椭圆）边线上的坐标点数组
    var outerPositions = (0, _polygon.getEllipseOuterPositions)({
      position: position,
      semiMajorAxis: Number(style.extentRadii),
      semiMinorAxis: Number(style.widthRadii),
      rotation: Cesium.Math.toRadians(Number(style.rotation || 0))
    });

    //长半轴上的坐标点
    var majorPos = outerPositions[0];
    var majorDragger = draggerCtl.createDragger(this.entityCollection, {
      position: majorPos,
      type: draggerCtl.PointType.EditAttr,
      tooltip: _Tooltip.message.dragger.editRadius,
      onDrag: function onDrag(dragger, position) {
        var positionZXD = that.entity._positions_draw[0];
        var newHeight = Cesium.Cartographic.fromCartesian(positionZXD).height;
        position = (0, _point.setPositionsHeight)(position, newHeight);
        dragger.position = position;

        var radius = that.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
        style.widthRadii = radius; //长半轴

        that.updateRadii(style);
        that.updateDraggers();
      }
    });
    dragger.majorDragger = majorDragger;
    this.draggers.push(majorDragger);

    //短半轴上的坐标点  
    var minorPos = outerPositions[1];
    var minorDragger = draggerCtl.createDragger(this.entityCollection, {
      position: minorPos,
      type: draggerCtl.PointType.EditAttr,
      tooltip: _Tooltip.message.dragger.editRadius,
      onDrag: function onDrag(dragger, position) {
        var positionZXD = that.entity._positions_draw[0];
        var newHeight = Cesium.Cartographic.fromCartesian(positionZXD).height;
        position = (0, _point.setPositionsHeight)(position, newHeight);
        dragger.position = position;

        var radius = that.formatNum(Cesium.Cartesian3.distance(positionZXD, position), 2);
        style.extentRadii = radius; //短半轴

        that.updateRadii(style);
        that.updateDraggers();
      }
    });
    dragger.minorDragger = minorDragger;
    this.draggers.push(minorDragger);
  }
}
export default EditEllipsoid
