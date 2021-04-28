class GraticuleLayer extends BaseLayer {


  //添加
  add() {
    if (this.layer == null) {
      this.initData();
    }
    this.layer.setVisible(true);
    _get(GraticuleLayer.prototype.__proto__ || Object.getPrototypeOf(GraticuleLayer.prototype), 'add', this).call(
      this);
  }
  //移除

  remove() {
    if (this.layer == null) return;

    this.layer.setVisible(false);
    _get(GraticuleLayer.prototype.__proto__ || Object.getPrototypeOf(GraticuleLayer.prototype), 'remove', this).call(
      this);
  }
  initData() {
    this.layer = new _GraticuleProvider.GraticuleProvider({
      scene: this.viewer.scene,
      numLines: 10
    });
    this.fire(_MarsClass.eventType.load, {
      layer: this.layer
    });
  }

  get layer() {
    return this.layer;
  }
}
export default GraticuleLayer
