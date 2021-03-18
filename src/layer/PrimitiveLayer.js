/*
 * @Description: 图元图层 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 09:30:08
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-18 11:15:09
 */

import { Cesium } from "../namespace"
import State from '../state/State'
import Layer from './Layer'

class PrimitiveLayer extends Layer {
    constructor(id) {
        super(id)
        this._delegate = new Cesium.PrimitiveCollection()
        this.type = Layer.getLayerType('primitive')
        this._state = State.INITIALIZED
    }

    /**
     * Clear all primitives
     */
    clear() {
        this._delegate && this._delegate.removeAll()
        this._cache = {}
        this._state = State.CLEARED
        return this
    }

}

Layer.registerType('primitive')

export default PrimitiveLayer