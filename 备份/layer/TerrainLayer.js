class TerrainLayer extends BaseLayer {
  //添加
  add() {
    if (!this.terrain) {
      this.terrain = (0, _layer.getTerrainProvider)(this.options.terrain || this.options);
      this.fire(_MarsClass.eventType.load, {
        terrain: this.terrain
      });
    }
    this.viewer.terrainProvider = this.terrain;
    super.add()
    _get(TerrainLayer.prototype.__proto__ || Object.getPrototypeOf(TerrainLayer.prototype), 'add', this).call(this);
  }
  //移除

  remove() {
    this.viewer.terrainProvider = (0, _layer.getEllipsoidTerrain)();
    super.remove()
  }

  get layer() {
    return this.terrain;
  }
}
export default TerrainLayer
