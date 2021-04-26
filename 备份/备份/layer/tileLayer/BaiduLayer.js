import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class BaiduLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.BAIDU
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.BAIDU, options)
  }
}
export default BaiduLayer
