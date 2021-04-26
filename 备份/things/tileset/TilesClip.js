// 模型裁剪 类
class TilesClip extends TileBase {
  //========== 构造方法 ==========
  constructor(options) {
    super(options)
    this._clipOutSide = Cesium.defaultValue(options.clipOutSide, false);
    if (this.drawCommand) {
      this.activeEdit();
    }
  }

  //========== 对外属性 ==========

  activeEdit() {
    this.tileset.marsEditor.fbo = this.fbo;
    this.tileset.marsEditor.polygonBounds = this.polygonBounds;
    this.tileset.marsEditor.IsYaPing[0] = true;
    this.tileset.marsEditor.IsYaPing[2] = true;
    this.tileset.marsEditor.editVar[0] = this.clipOutSide;
    this.addToScene();
  }
  get clipOutSide() {
      return this._clipOutSide;
    },
    set clipOutSide(val) {
      this._clipOutSide = Boolean(val);
      this.tileset.marsEditor.editVar[0] = this.clipOutSide;
    }
}
export default TilesClip
