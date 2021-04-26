import { Util } from '../util/index'
import State from '../const/State'
import { LayerGroupEventType, LayerGroupEvent } from '../event/index'
import Layer from './Layer'

class LayerGroup {
    constructor (id) {
        this._id = id || Util.uuid()
        this._cache = {}
        this._show = true
        this._map = undefined
        this._layerGroupEvent = new LayerGroupEvent()
        this._layerGroupEvent.on(LayerGroupEventType.ADD, this._onAdd, this)
        this._layerGroupEvent.on(LayerGroupEventType.REMOVE, this._onRemove, this)
        this.type = Layer.getLayerType('layer_group')
        this._state = State.INITIALIZED
    }

    get id () {
        return this._id
    }

    set show (show) {
        this._show = show
        Object.keys(this._cache).forEach(key => {
            this._cache[key].show = this._show
        })
    }

    get show () {
        return this._show
    }

    get layerGroupEvent () {
        return this._layerGroupEvent
    }

    get state () {
        return this._state
    }

    /**
     *
     * @param map
     * @private
     */
    _onAdd (map) {
        this._map = map
        Object.keys(this._cache).forEach(key => {
            this._map.addLayer(this._cache[key])
        })
        this._state = State.ADDED
    }

    /**
     *
     * @private
     */
    _onRemove () {
        Object.keys(this._cache).forEach(key => {
            this._map && this._map.removeLayer(this._cache[key])
        })
        this._cache = {}
        this._state = State.REMOVED
    }

    /**
     * Adds a layer
     * @param layer
     * @returns {LayerGroup}
     */
    addLayer (layer) {
        if (!Object(this._cache).hasOwnProperty(layer.id)) {
            this._cache[layer.id] = layer
            this._map && this._map.addLayer(layer)
        }
        return this
    }

    /**
     * Removes a layer
     * @param layer
     * @returns {LayerGroup}
     */
    removeLayer (layer) {
        if (Object(this._cache).hasOwnProperty(layer.id)) {
            this._map && this._map.removeLayer(layer)
            delete this._cache[layer.id]
        }
        return this
    }

    /**
     * Returns a layer by id
     * @param id
     * @returns {*|undefined}
     */
    getLayer (id) {
        return this._cache[id] || undefined
    }

    /**
     * Returns all layers
     * @returns {[]}
     */
    getLayers () {
        const result = []
        Object.keys(this._cache).forEach(key => {
            result.push(this._cache[key])
        })
        return result
    }

    /**
     * Adds to the viewer
     * @param viewer
     * @returns {LayerGroup}
     */
    addTo (viewer) {
        if (viewer && viewer.addLayerGroup) {
            viewer.addLayerGroup(this)
        }
        return this
    }

    /**
     *
     * @returns {LayerGroup}
     */
    remove () {
        this._map && this._map.removeLayerGroup(this)
        return this
    }
}

Layer.registerType('layer_group')

export default LayerGroup
