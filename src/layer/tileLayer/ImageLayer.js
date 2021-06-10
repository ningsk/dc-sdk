import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class ImageLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.SINGLE_TILE
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.SINGLE_TILE, options)
  }
}
export default ImageLayer
