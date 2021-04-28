import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class WmtsLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.WMTS
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.WMTS, options)
  }
}
export default WmtsLayer
