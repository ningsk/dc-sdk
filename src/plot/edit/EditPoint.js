import Edit from '@/dc/plot/edit/Edit'
import * as Cesium from 'cesium'

class EditPoint extends Edit {
  constructor (overlay) {
    super()
    this._overlay = overlay
    this._position = undefined
  }
  _mountEntity () {
    this._delegate = new Cesium.Entity()
    this._delegate.merge(this._overlay.delegate)
    this._overlay.show = false
    this._position = this._delegate.position.getValue(Cesium.JulianDate.now())
    this._delegate.position = new Cesium.CallbackProperty(() => {
      return this._position
    })
    this._layer.add(this._delegate)
  }
}
export default EditPoint
