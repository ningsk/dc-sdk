import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class XyzLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.XYZ
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.XYZ, options)
  }
}
export default BaiduLayer
