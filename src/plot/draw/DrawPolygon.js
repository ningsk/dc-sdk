import * as Cesium from 'cesium'
import DrawPolyline from '@/dc/plot/draw/DrawPolyline'
import { Polygon, Transform } from '@/dc'
const DEF_STYLE = {
  material: Cesium.Color.YELLOW.withAlpha(0.6),
  fill: true
}
class DrawPolygon extends DrawPolyline {
  constructor (style) {
    super()
    this._positions = []
    this._style = {
      ...DEF_STYLE,
      ...style
    }
  }
  _mountedOverlay () {
    this._overlay = new Polygon(
      Transform.transformCartesianArrayToWGS84Array(this._positions)
    )
    this._overlay.attr.clampToGround = !!this._style.clampToGround
    this._overlay.setStyle(this._style)
  }
  _mountedEntity () {
    this._delegate = new Cesium.Entity({
      polygon: {
        ...this._style,
        hierarchy: new Cesium.CallbackProperty(() => {
          if (this._positions.length > 2) {
            return new Cesium.PolygonHierarchy(this._positions)
          } else {
            return null
          }
        }, false)
      }
    })
    this._layer.add(this._delegate)
  }
}
export default DrawPolygon
