import { MouseEventType } from '@/dc'
import * as Cesium from 'cesium'
class Edit {
  constructor () {
    this._map = undefined
    this._anchors = []
    this._overlay = undefined
    this._delegate = undefined
    this._pickedAnchor = undefined
    this._isMoving = false
    this._clampToGround = true
    this._tooltip = undefined
    this._anchorLayer = undefined
    this._layer = undefined
    this._plotEvent = undefined
    this._options = {}
  }
  _mountEntity () {}
  _mountAnchor () {}
  _onClickHandler (e) {}
  _onMouseMoveHandler (e) {}
  _onRightClickHandler (e) {}
  _onDbClickHandler (e) {}
  bindEvent () {
    this._map.on(MouseEventType.CLICK, this._onClickHandler, this)
    this._map.on(MouseEventType.MOUSE_MOVE, this._onMouseMoveHandler, this)
    this._map.on(MouseEventType.RIGHT_CLICK, this._onRightClickHandler, this)
    this._map.on(MouseEventType.DB_CLICK, this._onDbClickHandler, this)
  }
  unbindEvent () {
    this._map.off(MouseEventType.CLICK, this._onClickHandler, this)
    this._map.off(MouseEventType.MOUSE_MOVE, this._onMouseMoveHandler, this)
    this._map.off(MouseEventType.RIGHT_CLICK, this._onRightClickHandler, this)
    this._map.off(MouseEventType.DB_CLICK, this._onRightClickHandler, this)
  }
  createAnchor (position, index, isMid = false, isCenter = false) {
    const image = isMid
      ? this._options.icon_midAnchor
      : isCenter
        ? this._options.icon_center
        : this._options.icon_anchor
    const anchor = this._anchorLayer.add({
      position: position,
      billboard: {
        image: image,
        width: 12,
        height: 12,
        eyeOffset: new Cesium.ConstantProperty(
          new Cesium.Cartesian3(0, 0, -500)
        ),
        heightReference:
          this._map.scene.mode === Cesium.SceneMode.SCENE3D &&
          this._clampToGround
            ? Cesium.HeightReference.CLAMP_TO_GROUND
            : Cesium.HeightReference.NONE
      },
      properties: {
        isMid: isMid,
        index: index
      }
    })
    this._anchors.push(anchor)
  }
  computeMidPosition (p1, p2) {
    const c1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(p1)
    const c2 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(p2)
    const cm = new Cesium.EllipsoidGeodesic(c1, c2).interpolateUsingFraction(0.5)
    return Cesium.Ellipsoid.WGS84.cartographicToCartesian(cm)
  }
  startEdit (plot) {
    this._map = plot.map
    this._tooltip = plot.map.tooltip
    this._layer = plot.overlayLayer
    this._anchorLayer = plot.anchorLayer
    this._plotEvent = plot.plotEvent
    this._options = plot.options
    this._clampToGround = plot.options.clampToGround ?? true
    this._mountEntity()
    this._mountAnchor()
    this.bindEvent()
  }
}
export default Edit
