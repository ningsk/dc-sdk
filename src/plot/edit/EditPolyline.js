import Edit from '@/dc/plot/edit/Edit'
import * as Cesium from 'cesium'

class EditPolyline extends Edit {
  constructor (overlay) {
    super()
    this._overlay = overlay
    this._positions = []
  }
  _mountEntity () {
    this._delegate = new Cesium.Entity()
    this._delegate.merge(this._overlay.delegate)
    this._overlay.show = false
    this._delegate.polyline.positions = new Cesium.CallbackProperty(() => {
      if (this._positions.length > 1) {
        return this._positions
      } else {
        return null
      }
    }, false)
    this._layer.add(this._delegate)
  }
  _mountAnchor () {
    const positions = [].concat(
      this._overlay.delegate.polyline.positions.getValue(
        Cesium.JulianDate.now()
      )
    )
    for (let i = 0; i < positions.length - 1; i++) {
      const mid = this.computeMidPosition(positions[i], positions[i + 1])
      this._positions.push(positions[i])
      this._positions.push(mid)
    }
    this._positions.push(positions[positions.length - 1])
    this._positions.forEach((item, index) => {
      this.createAnchor(item, index, index % 2 !== 0)
    })
  }
}
export default EditPolyline
