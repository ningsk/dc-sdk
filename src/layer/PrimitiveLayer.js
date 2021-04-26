import * as Cesium from 'cesium'
import State from '../const/State'
import Layer from './Layer'

class PrimitiveLayer extends Layer {
    constructor (id) {
        super(id)
        this._delegate = new Cesium.PrimitiveCollection()
        this.type = Layer.getLayerType('primitive')
        this._state = State.INITIALIZED
    }

    /**
     * Clear all primitives
     */
    clear () {
        this._delegate && this._delegate.removeAll()
        this._cache = {}
        this._state = State.CLEARED
        return this
    }
}

Layer.registerType('primitive')

export default PrimitiveLayer
