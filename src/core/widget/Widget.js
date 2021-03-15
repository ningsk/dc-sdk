/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 13:56:41
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 14:06:42
 */

import State from "../state/State"
import WidgetType from "./WidgetType"

class Widget {
    constructor() {
        this._viewer = undefined
        this._enable = false
        this._wrapper = undefined
        this._ready = false
        this.type = undefined
    }

    set enable(enable) {
        if (this._enable === enable) {
            return this
        }
        this._enable = enable
        this._state = this._enable ? State.ENABLED : State.DISABLED
        this._enableHook && this._enableHook()
        return this
    }

    get enable() {
        return this._enable
    }

    get state() {
        return this._state
    }

    /**
     * @private
     */
    _mountedContent() { }

    _bindEvent() { }

    _unbindEvent() { }

    _enableHook() {
        !this._ready && this._mountedContent()
        if (this._enable) {
            !this._wrapper.parentNode && this._viewer.dcContainer.appendChild(this._wrapper)
            this._bindEvent()
        } else {
            this._unbindEvent()
            this._wrapper.parentNode && this._viewer.dcContainer.removeChild(this._wrapper)
        }
    }

    _updateWindowCoord(windowCoord) { }

    _installHook() { }

    install(viewer) {
        this._viewer = viewer
        this._installHook && this._installHook()
        this._state = State.INSTALLED
    }

    setWrapper(wrapper) {
        return this
    }


    setContent(content) {
        if (content && typeof content === 'string') {
            this._wrapper.innerHTML = content
        } else if (content && content instanceof Element) {
            while (this._wrapper.hasChildNodes()) {
                this._wrapper.removeChild(this._wrapper.firstChild)
            }
            this._wrapper.appendChild(content)
        }
        return this
    }

    /**
   * hide widget
   */
    hide() {
        this._wrapper &&
            (this._wrapper.style.cssText = `
    visibility:hidden;
    `)
    }

    /**
     * Registers type
     * @param type
     */
    static registerType(type) {
        if (type) {
            WidgetType[type.toLocaleUpperCase()] = type.toLocaleLowerCase()
        }
    }

    /**
     *
     * @param type
     */
    static getWidgetType(type) {
        return WidgetType[type.toLocaleUpperCase()] || undefined
    }

}

export default Widget