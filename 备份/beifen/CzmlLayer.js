class CzmlLayer extends GeoJsonLayer {
  queryData() {
    var that = this;
    var config = (0, _util.getProxyUrl)(this.options);
    var dataSource = Cesium.CzmlDataSource.load(config.url, config);
    dataSource.then(function(dataSource) {
      that.showResult(dataSource);
    }).otherwise(function(error) {
      that.showError("服务出错", error);
    });
  }
  getEntityAttr(entity) {
    if (entity.description && entity.description.getValue) return entity.description.getValue(this.viewer.clock.currentTime);
  }
}
export default CzmlLayer
