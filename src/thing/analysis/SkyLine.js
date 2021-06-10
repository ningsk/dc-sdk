import Thing from '@/dc/thing/Thing'
import * as Cesium from 'cesium'
import SkyLineShader from '@/dc/material/shader/effect/SkyLineShader.glsl'
class SkyLine extends Thing {
  /**
   * @param {Object} [options]
   * @param {Number} [options.width=2] 天际线宽度
   * @param {Cesium.Color} [options.color=new Cesium.Color(1, 0, 0)] 边际线颜色
   * @param {Cesium.Color} [options.backgroundColor=new Cesium.Color(0.0, 0.0, 1.0)] 物体描边颜色
   * @param {Cesium.Cartesian3} [options.strokeType= new Cesium.Cartesian3(true, false, false)] 天际线描边，全描边
   * @param {Number} [options.distance=500] 物体描边距离
   */
  constructor (options) {
    super()
    this._width = Cesium.defaultValue(options.width, 2)
    this._color = Cesium.defaultValue(options.color, new Cesium.Color(1.0, 0.0, 1.0))
    this._strokeType = Cesium.defaultValue(options.strokeType, new Cesium.Cartesian3(true, false, false))
    this._backgroundColor = Cesium.defaultValue(options.backgroundColor, new Cesium.Color(0.0, 0.0, 1.0))
    this._distance = Cesium.defaultValue(options.distance, 500)
  }
  set width (width) {
    this._width = width
  }
  get width () {
    return this._width
  }
  set color (color) {
    this._color = color
  }
  get color () {
    return this._color
  }
  set strokeType (strokeType) {
    this._strokeType = strokeType
  }
  get strokeType () {
    return this._strokeType
  }
  set backgroundColor (backgroundColor) {
    this._backgroundColor = backgroundColor
  }
  get backgroundColor () {
    return this._backgroundColor
  }
  set distance (distance) {
    this._distance = distance
  }
  get distance () {
    return this._distance
  }
  _addedHook () {
    const that = this
    this._postProcess = new Cesium.PostProcessStage({
      fragmentShader: SkyLineShader,
      uniforms: {
        height: function () {
          return that._map.camera.positionCartographic.height
        },
        lineWidth: function () {
          return that._width
        },
        strokeType: function () {
          return that._strokeType
        },
        lineColor: function () {
          return that._color
        },
        backgroundColor: function () {
          return that._backgroundColor
        },
        cameraPos: function () {
          return that._map.scene.camera.position
        },
        distance: function () {
          return that._distance
        }
      }
    })
    this._postProcess.enabled = this._enabled
    this._map.scene.postProcessStages.add(this._postProcess)
  }
  _enabledHook () {
    this._postProcess.enabled = this._enabled
  }
}
export default SkyLine
