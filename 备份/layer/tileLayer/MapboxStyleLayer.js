import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class MapboxStyleLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.MAPBOX_STYLE
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.MAPBOX_STYLE, options)
  }
}
export default MapboxStyleLayer
