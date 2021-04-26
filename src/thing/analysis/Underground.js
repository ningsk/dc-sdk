import * as Cesium from 'cesium'
import Util from '../../util/Util.js'
import Thing from '../Thing.js'
const DEF_OPTIONS = {
  enabled: false, // 对象的启用状态
  alpha: 0.5, // 透明度
  color: Cesium.Color.BLACK // 当相机在地下或球体是半透明的时候，选然球体背面的颜色
}
class Underground extends Thing {
  constructor (options) {
      super()
      this._options = Util.merge(options, DEF_OPTIONS)
      this._enabled = this._options.enabled
      this._alpha = this._options.alpha
      this._color = this._options.color
      this._depthTestOld = undefined
      this._colorAlphaByDistance = new Cesium.NearFarScalar(100.0, 0.0, 900.0, 1.0)
  }
  get alpha () {
    return this._alpha
  }
  get color () {
    return this._color
  }
  /**
   * 获取color和globe颜色混合的远近距离
   */
  get colorAlphaByDistance () {
    return this._colorAlphaByDistance
  }
  set alpha (alpha) {
    this._alpha = alpha
    this._map.scene.globe.translucency.frontFaceAlphaByDistance.nearValue = this._alpha
    this._map.scene.globe.translucency.frontFaceAlphaByDistance.farValue = this._alpha
  }
  set colorAlphaByDistance (colorAlphaByDistance) {
    this._colorAlphaByDistance = colorAlphaByDistance
    if (this._map) {
      this._map.scene.globe.translucency.frontFaceAlphaByDistance = this._colorAlphaByDistance
    }
  }
  _enabledHook () {
    this._map.scene.globe.depthTestAgainstTerrain = this._enabled ? true : this._depthTestOld
    // 相机对地形的碰撞检测状态
    this._map.scene.screenSpaceCameraController.enableCollisionDetection = !this._enabled
    this._map.scene.globe.translucency.enabled = this._enabled
    this._map.scene.globe.translucency.frontFaceAlphaByDistance = this._colorAlphaByDistance
    this._map.scene.globe.translucency.backFaceAlpha = 0
  }
  _addedHook () {
    this._depthTestOld = Cesium.clone(this._map.scene.globe.depthTestAgainstTerrain)
  }
}
export default Underground
