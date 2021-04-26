//默认压平至所选取的最低点高度，由flatHeight变量控制压平高度的变化
// 模型压平 类
class TilesFlat extends TileBase {
  constructor(options) {
    super(options)
    this._b3dmOffset = options.b3dmOffset || new Cesium.Cartesian2();
    this._flatHeight = options.flatHeight || 0;

    if (this.drawCommand) {
      this.activeEdit();
    }
  }
  //偏移量
  activeEdit() {
    this.tileset.marsEditor.fbo = this.fbo;
    this.tileset.marsEditor.polygonBounds = this.polygonBounds;
    this.tileset.marsEditor.IsYaPing[0] = true;
    this.tileset.marsEditor.IsYaPing[1] = true;
    this.tileset.marsEditor.heightVar[0] = this.minLocalPos.z;
    this.tileset.marsEditor.heightVar[1] = this.flatHeight;
    this.addToScene();
  }

  get flatHeight() {
    return this._flatHeight;
  }
  set flatHeight(val) {
    this._flatHeight = Number(val);
    this.tileset.marsEditor.heightVar[1] = this._flatHeight;
  }
}
export default TilesFlat
