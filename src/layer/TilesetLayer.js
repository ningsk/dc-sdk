import * as Cesium from 'cesium'
import State from '../const/State'
import Layer from './Layer'

class TilesetLayer extends Layer {
    constructor (id) {
        super(id)
        this._delegate = new Cesium.PrimitiveCollection()
        this.type = Layer.getLayerType('tileset')
        this._state = State.INITIALIZED
    }

    clear () {
        this._delegate.removeAll()
        this._cache = {}
        this._state = State.CLEARED
        return this
    }
}

Layer.registerType('tileset')

export default TilesetLayer
