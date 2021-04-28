import * as Cesium from 'cesium'
import BaseLayer from '../BaseLayer.js'
import Util from '../../util/Util.js'
import CRS from '../../const/CRS.js'
import ImageryLayerFactory from '../../imagery/ImageryFactory.js'
import EventType from '../../const/EventType.js'
import State from '../../const/State.js'
const DEF_OPTIONS = {
  alpha: 1.0, // 同 opacity
  nightAlpha: 1.0, // 当enableLighting为true的时候，在地球的夜晚区域的透明度，取值范围：0.0-1.0
  dayAlpha: 1.0, // 当enableLighting为true的时候，在地球白天区域的透明度，取值范围：0.0-1.0
  brightness: 1.0, // 亮度，取值范围：0.0-1.0
  contrast: 1.0, // 对比度： 1.0时，未修改图像颜色，小于1.0时会降低对比度，而大于1.0时会增加对比度
  hue: 1.0, // 色调 0.0时候未修改图像颜色
  saturation: 1.0, // 饱和度 1.0时候使用未修改的图像颜色，小于1.0的时候会降低饱和度，而大于1.0的时候会增加饱和度
  gamma: 1.0, // 伽马校正值 1.0使用未修改的颜色
}
/**
 * @property {type} prop_name
 */
class BaseTileLayer extends BaseLayer {
  constructor(options) {
      super(options)
      this._layer = undefined
      this._type = undefined
      this._isTile = true
  }
  _setOptionsHook () {
    this._alpha = this.options.alpha
    this._nightAlpha = this.options.nightAlpha
    this._birghtness = this.options.birghtness
    this._contrast = this.options.contrast
    this._hue =  this.options.hue
    this._saturation = this.options.saturation
    this._gamma = this.options.gamma
  }
  get type () {
    return this._type
  }
  get alpha () {
    return this._alpha
  }
  get nightAlpha () {
    return this._nightAlpha
  }
  get brightness () {
    return this._birghtness
  }
  get contrast () {
    return this._contrast
  }
  get hue () {
    return this._hue
  }
  get saturation () {
    return this._saturation
  }
  get gamma () {
    return this._gamma
  }
  get isTile () {
    return this._isTile
  }
  set opacity (opacity) {
    this._alpha = opacity
    this._layer.alpha = alpha
    return this
  }
  set alpha (alpha) {
    this._alpha = alpha
    if (this._layer) this._layer.alpha = alpha
    return this
  }
  set nightAlpha (nightAlpha) {
    this._nightAlpha = nightAlpha
    if (this._layer) this._layer.nightAlpha = this._nightAlpha
    return this
  }
  set contrast (contrast) {
    this._contrast = contrast
    if (this._layer) this._layer.contrast = this._contrast
    return this
  }
  set hue (hue) {
    this._hue = hue
    if (this._layer) this._layer.hue = this._hue
    return this
  }
  set saturation (saturation) {
    this._saturation = saturation
    if (this._layer) this._layer.saturation = this._saturation
    return this
  }
  set gamma (gamma) {
    this._gamma = gamma
    if (this._layer) this._layer.gamma = this._gamma
    return this
  }
  set type (type) {
    this._type = type
    return this
  }

  _createImageryLayer (type,options) {
   return ImageryLayerFactory.createImageryLayer(type, options)
  }
  _onAdd (map) {
    if (this._layer != undefined) { return }
    if (!Cesium.defined(imageProvider)) return
    let options = this.options
    let imageOptions = {
      show: true,
      alpha: this._opactity
    }
    if (Cesium.defined(options.rectangle) && Cesium.defined(options.rectangle.xmin) && Cesium.defined(options.rectangle.xmax) && Cesium.defined(options.rectangle.ymin) && Cesium.defined(options.retangle.ymax)) {
      let xmin = options.rectangle.xmin
      let xmax = options.rectangle.xmax
      let ymin = options.rectangle.ymin
      let ymax = options.retangle.ymax
      let rectangle = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax)
      this.rectangle = rectangle
      imageOptions.rectangle = rectangle
    }
    if (Cesium.defined(options.bbox) && options.bbox.length && options.bbox.length == 4) {
      let rectangle = Cesium.Rectangle.fromDegress(options.bbox[0], options.bbox[1], options.bbox[2], options.bbox[3])
      this.rectangle = rectangle
      imageOptions.rectangle = rectangle
    }
    imageOptions.brightness = this._birghtness
    imageOptions.contrast = this._contrast
    imageOptions.saturation = this._saturation
    imageOptions.gamma = this._gamma
    if (Cesium.defined(options.maximumAnisotropy)) {
      imageOptions.maximumAnisotropy = options.maximumAnisotropy
    }
    this._layer = this._createImageryLayer(this._type, imageOptions)
    let that = this
    this._layer..onLoadTileStart = (imagery) => {
      that.fire(EventType.loadTileStart, {
        imagery: imagery
      })
    }
    this._layer.onLoadTileEnd = (imagery) => {
      that.fire(EventType.loadTileEnd, {
        imagery: imagery
      })
    }
    this._layer.onLoadTileError = (imagery) => {
      that.fire(EventType.loadTileError, {
        imagery: imagery
      })
    }
    this._map.viewer.imageryLayers.add(this._layer)
    this._addedHook && this._addedHook()
    this._state = State.ADDED
  }
  _onRemove (map) {
    if (this._layer == undefined) return
    this._map.viewer.imageryLayers.remove(this._layer, true)
    this._layer = undefined
    this._removeHook && this._removeHook()
    this._state = State.REMOVED
  }
}
export default BaseTileLayer
