import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class WmsLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.WMS
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.WMS, options)
  }
}
export default BaiduLayer
