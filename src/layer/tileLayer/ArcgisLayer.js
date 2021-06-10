import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class ArcgisLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.ARCGIS
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.ARCGIS, options)
  }
}
export default ArcgisLayer
