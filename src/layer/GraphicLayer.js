import * as Cesium from 'cesium'

class GraphicLayer {
  constructor () {
    this._dataSource = new Cesium.CustomDataSource()
    this._primitiveCollection = new Cesium.PrimitiveCollection()
  }
  get dataSource () {
    return this._dataSource
  }
  get primitiveCollection () {
    return this._primitiveCollection
  }
}
export default GraphicLayer
