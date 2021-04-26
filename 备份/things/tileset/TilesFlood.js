// 模型淹没 类
class TilesFlood extends TilesBase {
  //========== 构造方法 ========== 
  constructor(options) {
    super(options)
    this.floodColor = options.floodColor || [0.15, 0.7, 0.95, 0.5];
    this.floodSpeed = options.floodSpeed || 5.5; //淹没速度，米/秒（默认刷新频率为55Hz）
    this._floodAll = options.floodAll;
    this.maxFloodDepth = options.maxFloodDepth || 200;
    this.ableFlood = true;
    if (this.drawCommand || _this._floodAll) {
      this.activeEdit();
    }
  }

  bindSpeed() {
    var that = this;
    this.speedFun = function() {
      if (that.ableFlood) {
        that.tileset.marsEditor.floodVar[1] += that.floodSpeed / 55;
        if (that.tileset.marsEditor.floodVar[1] >= that.tileset.marsEditor.floodVar[2]) {
          that.tileset.marsEditor.floodVar[1] = that.tileset.marsEditor.floodVar[2];
        }
      }
    };
    this.viewer.clock.onTick.addEventListener(this.speedFun);
  }
  resetFlood() {
    this.tileset.marsEditor.floodVar[1] = this.tileset.marsEditor.floodVar[0];
  }
  activeEdit() {
    this.bindSpeed();
    this.tileset.marsEditor.fbo = this.fbo;
    this.tileset.marsEditor.polygonBounds = this.polygonBounds;
    this.tileset.marsEditor.IsYaPing[0] = true;
    this.tileset.marsEditor.IsYaPing[3] = true;
    this.tileset.marsEditor.floodVar = [this.minLocalPos.z, this.minLocalPos.z, this.minLocalPos.z + this.maxFloodDepth,
      200
    ];
    this.tileset.marsEditor.floodColor = this.floodColor;
    this.tileset.marsEditor.editVar[1] = this.floodAll || false;
    !this.floodAll && this.addToScene();
  }

  //销毁

  destroy() {
    this.viewer.clock.onTick.removeEventListener(this.speedFun);
    super.destroy()
  }
  get floodAll() {
    return this._floodAll;
  }
  set floodAll(val) {
    this._floodAll = Boolean(val);
    this.tileset.marsEditor.editVar[1] = this.floodAll;
  }
}
export default TilesFlood
