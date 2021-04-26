//天际线 类
class Skyline extends BaseClass {
  constructor(options, oldparam) {
    super()
    this.viewer = options.viewer;
    this.tjxWidth = Cesium.defaultValue(options.tjxWidth, 2); //天际线宽度
    this.strokeType = Cesium.defaultValue(options.strokeType, new Cesium.Cartesian3(true, false, false)); //天际线，物体描边，全描边
    this.tjxColor = Cesium.defaultValue(options.tjxColor, new Cesium.Color(1.0, 0.0, 0.0)); //边际线颜色
    this.bjColor = Cesium.defaultValue(options.bjColor, new Cesium.Color(0.0, 0.0, 1.0)); //物体描边颜色
    this.mbDis = Cesium.defaultValue(options.mbDis, 500); //物体描边距离

    var that = _this;
    this.postProcess = new Cesium.PostProcessStage({
      fragmentShader: _Skyline2.default,
      uniforms: {
        height: function height() {
          return that.viewer.camera.positionCartographic.height;
        },
        lineWidth: function lineWidth() {
          return that.tjxWidth;
        },
        strokeType: function strokeType() {
          return that.strokeType;
        },
        tjxColor: function tjxColor() {
          return that.tjxColor;
        },
        bjColor: function bjColor() {
          return that.bjColor;
        },
        cameraPos: function cameraPos() {
          return that.viewer.scene.camera.position;
        },
        mbDis: function mbDis() {
          return that.mbDis;
        }
      }
    });
    this.postProcess.enabled = Cesium.defaultValue(options.enabled, true);
    this.viewer.scene.postProcessStages.add(_this.postProcess);
  }

  //显示和隐藏

  destroy() {
    this.viewer.scene.postProcessStages.remove(this.postProcess);
    this.postProcess.destroy();
    delete this.postProcess;
    super.destroy()
  }

  get enabled() {
    return this.postProcess.enabled;
  }
  set enabled(val) {
    this.postProcess.enabled = val;
  }
}
export default Skyline
