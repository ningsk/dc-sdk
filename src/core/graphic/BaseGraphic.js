/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 10:14:22
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 10:55:16
 */

import { GraphicEventType } from "../event/EventType";
import GraphicEvent from "../event/GraphicEvent";
import { Util } from "../util";
import State from "../state/State"
import GraphicType from "./GraphicType";


class BaseGraphic {
    constructor() {
        this._id = Util.uuid()
        this._bid = Util.uuid()
        this._delegate = undefined
        this._layer = undefined
        this._state = undefined
        this._show = true
        this._style = {}
        this._arr = {}
        this._allowDrillPicking = false
        this._contextMenu = []
        this._graphicEvent = new GraphicEvent()
        this.type = undefined
        this.on(GraphicEventType.ADD, this._onAdd, this)
        this.on(GraphicEventType.REMOVE, this._onRemove, this)
    }

    get graphicId() {
        return this._id
    }

    set id(id) {
        this._bid = id
        return this
    }

    get id() {
        return this._bid
    }

    set show(show) {
        this._show = show
        this._delegate && (this._delegate.show = this._show)
    }

    get show() {
        return this._show
    }

    set attr(attr) {
        this._attr = attr
        return this
    }

    get attr() {
        return this._attr
    }

    set allowDrillPicking(allowDrillPicking) {
        this._allowDrillPicking = allowDrillPicking
        return this
    }

    get graphicEvent() {
        return this._graphicEvent
    }

    get state() {
        return this._state
    }

    set contextMenu(menu) {
        this._contextMenu = menu
        return this
    }

    _mountedHook() {}

    _addedHook() {
        if (!this._delegate) {
            return false
        }
        this._delegate.layerId = this._layer?.layerId
        this._delegate.graphicId = this._id
    }

    _removeHook() {}

    _onAdd(layer) {
        if (!layer) {
            return 
        }
        this._layer = layer
        this._mountedHook && this._mountedHook()
        // for Entity
        if (this._layer?._delegate?.entities && this._delegate) {
            this._layer.delegate.entities.add(this._delegate)
        } else if (this._layer?.delegate?.add && this._delegate) {
            // for Primitive
            this._layer.delegate.add(this._delegate)
        }
        this._addedHook && this._addedHook()
        this._state = State.ADDED
    }

    /**
     * Remove handler
     * @returns 
     */
    _onRemove() {
        if (!this._layer || !this._delegate) return
        // for Entity
        if (this._layer?.delegate?.entities) {
            this._layer.delegate.entities.remove(this._delegate)
        } else if (this._layer?.delegate?.remove) {
            // for Primitive
            this._layer.delegate.remove(this._delegate)
        }
        this._removeHook && this._removeHook()
        this._state = State.REMOVED
    }

    setLabel(text, textStyle) {
        this._delegate && (this._delegate.label = {
            ...textStyle,
            text: text
        })
        return this
    }

    setStyle(style) {
        return this
    }

    /**
     * Removes from layer
     * @returns 
     */
    remove() {
        if (this._layer) {
            this._layer.removeGraphic(this)
        }
        return this
    }

    /**
     * adds to layer
     * @param {*} layer 
     * @returns 
     */
    addTo(layer) {
        if (layer && layer.addGraphic) {
            layer.addGraphic(this)
        }
        return this
    }

    /**
     * Subscribe event
     * @param {*} type 
     * @param {*} callback 
     * @param {*} context 
     */
    on(type, callback, context) {
        this._graphicEvent.on(type, callback, context || this)
        return this
    }

    /**
     * Unsubscribe event
     * @param {*} type 
     * @param {*} callback 
     * @param {*} context 
     */
    off(type, callback, context) {
        this._graphicEvent.off(type, callback, context || this)
        return this
    }

    /**
     * Trigger subscription event
     * @param {*} type 
     * @param {*} params 
     * @returns 
     */
    fire(type, params) {
        this._graphicEvent.fire(type, params)
        return this
    }

    static registerType(type) {
        if (type) {
            GraphicType[type.toLocaleUpperCase()] = type.toLocaleUpperCase()
        }
    }

    static getGraphicType(type) {
        return GraphicType[type.toLocaleUpperCase()] || undefined
    }

}

export default BaseGraphic