import Widget from '@/dc/widget/Widget'
import { DomUtil } from '@/dc/util'
import State from '@/dc/const/State'
import * as Cesium from 'cesium'
import { MouseEventType, SceneEventType } from '@/dc/event'

class LocationBar extends Widget {
  constructor () {
    super()
    this._wrapper = DomUtil.create('div', 'dc-location-bar')
    this._mouseEl = undefined
    this._cameraEl = undefined
    this.type = Widget.getWidgetType('location_bar')
    this._state = State.INITIALIZED
    this._lastUpdate = Cesium.getTimestamp()
  }

  /**
   *
   * @private
   */
  _installHook () {
    Object.defineProperty(this._map, 'locationBar', {
      value: this,
      writable: false
    })
  }

  /**
   *
   * @private
   */
  _bindEvent () {
    this._map.on(MouseEventType.MOUSE_MOVE, this._moveHandler, this)
    this._map.on(SceneEventType.CAMERA_CHANGED, this._cameraHandler, this)
  }

  /**
   *
   * @private
   */
  _unbindEvent () {
    this._map.off(MouseEventType.MOUSE_MOVE, this._moveHandler, this)
    this._map.off(SceneEventType.CAMERA_CHANGED, this._cameraHandler, this)
  }

  /**
   *
   * @private
   */
  _mountContent () {
    this._mouseEl = DomUtil.create('div', 'mouse-location', this._wrapper)
    this._cameraEl = DomUtil.create('div', 'camera-location', this._wrapper)
    this._ready = true
  }

  /**
   *
   * @param e
   * @private
   */
  _moveHandler (e) {
    const now = Cesium.getTimestamp()
    if (now < this._lastUpdate + 300) {
      return
    }
    this._lastUpdate = now
    const ellipsoid = Cesium.Ellipsoid.WGS84
    const cartographic = e.surfacePosition
      ? ellipsoid.cartesianToCartographic(e.surfacePosition)
      : undefined
    const lng = +Cesium.Math.toDegrees(cartographic?.longitude || 0)
    const lat = +Cesium.Math.toDegrees(cartographic?.latitude || 0)
    const alt = cartographic
      ? +this._map.scene.globe.getHeight(cartographic)
      : 0
    this._mouseEl.innerHTML = `
      <span>经度：${lng.toFixed(8)}</span>
      <span>纬度：${lat.toFixed(8)}</span>
      <span>海拔：${alt.toFixed(2)} 米</span>`
  }

  /**
   *
   * @private
   */
  _cameraHandler () {
    const now = Cesium.getTimestamp()
    if (now < this._lastUpdate + 300) {
      return
    }
    this._lastUpdate = now
    const cameraPosition = this._map.cameraPosition
    this._cameraEl.innerHTML = `
      <span>视角：${(+cameraPosition.pitch).toFixed(2)}</span>
      <span>视高：${(+cameraPosition.alt).toFixed(2)} 米</span>
    `
  }
}
export default LocationBar
