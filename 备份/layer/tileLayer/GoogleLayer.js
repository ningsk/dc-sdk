import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class GoogleLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.GOOGLE
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.GOOGLE, options)
  }
}
export default GoogleLayer
