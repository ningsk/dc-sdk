import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class MapboxLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.MAPBOX
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.MAPBOX, options)
  }
}
export default MapboxLayer
