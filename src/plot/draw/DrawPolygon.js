import * as Cesium from 'cesium'
import DrawPolyline from '@/dc/plot/draw/DrawPolyline'
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
