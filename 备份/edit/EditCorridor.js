class EditCorridor extends EditPolyline {
  //取enity对象的对应矢量数据
  getGraphic() {
    return this.entity.corridor;
  }
  //继承父类，根据属性更新坐标

  updatePositionsHeightByAttr(position) {
    if (this.getGraphic().height != undefined) {
      var newHeight = this.getGraphic().height.getValue(this.viewer.clock.currentTime);
      position = (0, _point.setPositionsHeight)(position, newHeight);
    }
    return position;
  }
}
export default EditCorridor
