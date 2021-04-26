//地下模式类
class Underground extends BaseClass {
  //========== 构造方法 ==========
  constructor(options, oldparam) {
    super()
    this.viewer = options.viewer
    this.depthTestOld = Cesium.clone(_this.viewer.scene.globe.depthTestAgainstTerrain)
    this.viewer.scene.globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(100.0, 0.0, 900.0, 1.0)
    this.viewer.scene.globe.translucency.backFaceAlpha = 0
    this.alpha = Cesium.defaultValue(options.alpha, 0.5)
    this.enable = Cesium.defaultValue(options.enable, false)
  }

  //========== 对外属性 ==========
  //显示和隐藏


  clear() {
    this.enable = false;
  }
  destroy() {
    this.clear();
    super.destroy()
  }
  get alpha() {
    return this._alpha;
  }
  set alpha(val) {
    this._alpha = Number(val);
    this.viewer.scene.globe.translucency.frontFaceAlphaByDistance.nearValue = this._alpha;
    this.viewer.scene.globe.translucency.frontFaceAlphaByDistance.farValue = this._alpha;
  }
  get enable() {
      return this.viewer.scene.globe.translucency.enabled;
    },
    set enable(value) {
      this.viewer.scene.globe.depthTestAgainstTerrain = value ? true : this.depthTestOld;
      this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = !value; //相机对地形的碰撞检测状态

      this.viewer.scene.globe.translucency.enabled = value;
    }
}
export default Underground
