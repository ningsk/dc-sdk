import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class TencentLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.TENCENT
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.TENCENT, options)
  }
}
export default TencentLayer
