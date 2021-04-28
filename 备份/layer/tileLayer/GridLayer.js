import BaseTileLayer from './BaseTileLayer.js'
import ImageryType from '../../imagery/ImageryType.js'
class GridLayer extends BaseTileLayer {
  constructor(options) {
      super(options)
      this._type = ImageryType.GRID
  }
  static createImageryLayer (options) {
    return this._createImageryLayer(ImageryType.GRID, options)
  }
}
export default GridLayer
