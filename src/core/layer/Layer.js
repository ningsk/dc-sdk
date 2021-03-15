/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-11 12:32:06
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 11:05:12
 */
import { GraphicEventType, LayerEventType } from "../event/EventType";
import LayerEvent from "../event/LayerEvent";
import State from '../state/State';
import Util from "../util/Util";

class Layer {
    constructor(id) {
        this._id = Util.uuid()
        this._bid = id || Util.uuid()
        this._delegate = undefined
        this._viewer = undefined
        this._state = undefined
        this._show = true
        this._cache = {}
        this._attr = {}
        this._layerEvent = new LayerEvent()
        this._layerEvent.on(LayerEventType.ADD, this._onAdd, this)
        this._layerEvent.on(LayerEventType.REMOVE, this._onRemove, this)
        this._state = undefined
        this.type = undefined
    }

    get layerId() {
        return this._id
    }

    get id() {
        return this._bid
    }

    get delegate() {
        return this._delegate
    }

    set show(show) {
        this._show = show
        this._delegate && (this._delegate.show = this._show)
    }

    get show() {
        return this._show
    }

    get layerEvent() {
        return this._layerEvent
    }

    set attr(attr) {
        this._attr = attr
    }

    get attr() {
        return this._attr
    }

    get state() {
        return this._state
    }

    /**
     * The hook for added
     * @private
     */
    _addedHook() { }

    /**
     * The hook for removed
     * @private
     */
    _removedHook() { }

    /**
     * The layer added callback function
     * Subclasses need to be overridden
     * @param viewer
     * @private
     */
    _onAdd(viewer) {
        this._viewer = viewer
        if (!this._delegate) {
            return
        }
        if (this._delegate instanceof Cesium.PrimitiveCollection) {
            this._viewer.scene.primitives.add(this._delegate)
        } else {
            this._viewer.dataSources.add(this._delegate)
        }
        this._addedHook && this._addedHook()
        this._state = State.ADDED
    }

    /**
     * The layer added callback function
     * Subclasses need to be overridden
     * @private
     */
    _onRemove() {
        if (!this._delegate) {
            return
        }
        if (this._viewer) {
            this._cache = {}
            if (this._delegate instanceof Cesium.PrimitiveCollection) {
                this._delegate.removeAll()
                this._viewer.scene.primitives.remove(this._delegate)
            } else if (this._delegate.then) {
                this._delegate.then(dataSource => {
                    dataSource.entities.removeAll()
                })
                this._viewer.dataSources.remove(this._delegate)
            } else {
                this._delegate.entities && this._delegate.entities.removeAll()
                this._viewer.dataSources.remove(this._delegate)
            }
            this._removedHook && this._removedHook()
            this._state = State.REMOVED
        }
    }

    /**
     * The layer add graphic
     * @param graphic
     * @private
     */
    _addGraphic(graphic) {
        if (
            graphic &&
            graphic.graphicEvent &&
            !this._cache.hasOwnProperty(graphic.graphicId)
        ) {
            graphic.graphicEvent.fire(GraphicEventType.ADD, this)
            this._cache[graphic.graphicId] = graphic
            if (this._state === State.CLEARED) {
                this._state = State.ADDED
            }
        }
    }

    /**
     * The layer remove graphic
     * @param graphic
     * @private
     */
    _removeGraphic(graphic) {
        if (
            graphic &&
            graphic.graphicEvent &&
            this._cache.hasOwnProperty(graphic.graphicId)
        ) {
            graphic.graphicEvent.fire(GraphicEventType.REMOVE, this)
            delete this._cache[graphic.graphicId]
        }
    }

    /**
     * Add graphic
     * @param graphic
     * @returns {Layer}
     */
    addGraphic(graphic) {
        this._addGraphic(graphic)
        return this
    }

    /**
     * Add graphics
     * @param graphics
     * @returns {Layer}
     */
    addGraphics(graphics) {
        if (Array.isArray(graphics)) {
            graphics.forEach(item => {
                this._addGraphic(item)
            })
        }
        return this
    }

    /**
     * Remove graphic
     * @param graphic
     * @returns {Layer}
     */
    removeGraphic(graphic) {
        this._removeGraphic(graphic)
        return this
    }

    /**
     * Returns the graphic by graphicId
     * @param graphicId
     * @returns {*|undefined}
     */
    getGraphic(graphicId) {
        return this._cache[graphicId] || undefined
    }

    /**
     * Returns the graphic by bid
     * @param id
     * @returns {any}
     */
    getGraphicById(id) {
        let graphic = undefined
        Object.keys(this._cache).forEach(key => {
            if (this._cache[key].id === id) {
                graphic = this._cache[key]
            }
        })
        return graphic
    }

    /**
     * Returns the graphic by attrName and AttrVal
     * @param attrName
     * @param attrVal
     * @returns {[]}
     */
    getGraphicByAttr(attrName, attrVal) {
        let result = []
        this.eachGraphic(item => {
            if (item.attr[attrName] === attrVal) {
                result.push(item)
            }
        }, this)
        return result
    }

    /**
     * Iterate through each graphic and pass it as an argument to the callback function
     * @param method
     * @param context
     * @returns {Layer}
     */
    eachGraphic(method, context) {
        Object.keys(this._cache).forEach(key => {
            method && method.call(context || this, this._cache[key])
        })
        return this
    }

    /**
     * Returns all graphics
     * @returns {[]}
     */
    getGraphics() {
        let result = []
        Object.keys(this._cache).forEach(key => {
            result.push(this._cache[key])
        })
        return result
    }

    /**
     * Clears all graphics
     * Subclasses need to be overridden
     */
    clear() { }

    /**
     * Removes from the viewer
     */
    remove() {
        if (this._viewer) {
            this._viewer.removeLayer(this)
        }
    }

    /**
     * Adds to the viewer
     * @param viewer
     * @returns {Layer}
     */
    addTo(viewer) {
        if (viewer && viewer.addLayer) {
            viewer.addLayer(this)
        }
        return this
    }

    /**
     * sets the style, the style will apply to every overlay of the layer
     * Subclasses need to be overridden
     * @param style
     */
    setStyle(style) { }

    /**
     * Registers Type
     * @param type
     */
    static registerType(type) {
        if (type) {
            LayerType[type.toLocaleUpperCase()] = type.toLocaleLowerCase()
        }
    }

    /**
     * Returns type
     * @param type
     * @returns {*|undefined}
     */
    static getLayerType(type) {
        return LayerType[type.toLocaleUpperCase()] || undefined
    }
}

export default Layer