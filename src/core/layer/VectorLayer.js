/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 10:05:59
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 10:09:03
 */

import Cesium from "cesium";
import State from "../state/State";
import Layer from "./Layer";

class VectorLayer extends Layer {
    constructor(id) {
        super(id)
        this._delegate = new Cesium.CustomDataSource(id)
        this.type = Layer.getLayerType('vector')
        this._state = State.INITIALIZED
    }

    clear() {
        this._delegate.entities && this._delegate.entities.removeAll()
        this._cache = {}
        this._state = State.CLEARED
        return this
    }

}

Layer.registerType('vector')

export default VectorLayer
