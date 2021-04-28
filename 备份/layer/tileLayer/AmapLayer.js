import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class AmapLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.AMAP
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.AMAP, options)
  }
}
export default AmapLayer
