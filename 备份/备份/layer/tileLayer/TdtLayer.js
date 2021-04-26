import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class TdtLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.TDT
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.TDT, options)
  }
}
export default TdtLayer
