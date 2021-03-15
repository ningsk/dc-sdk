/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 15:14:18
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 15:14:45
 */
import Parse from "../../parse/Parse"
import State from "../../state/State"
import Overlay from "../Ovelay"
import Util from "../../util/Util"
import Transform from "../../transform/Transform"

import Cesium from "cesium"

class Rectangle extends Overlay {
    constructor(positions) {
        super()
        this._positions = Parse.parsePositions(positions)
        this._delegate = new Cesium.Entity({ rectangle: {} })
        this.type = Overlay.getOverlayType('rectangle')
        this._state = State.INITIALIZED
    }

    set positions(positions) {
        this._positions = Parse.parsePositions(positions)
        this._delegate.rectangle.coordinates = Cesium.Rectangle.fromCartesianArray(
            Transform.transformWGS84ArrayToCartesianArray(this._positions)
        )
        return this
    }

    get positions() {
        return this._positions
    }

    _mountedHook() {
        /**
         * set the location
         */
        this.positions = this._positions
    }

    /**
     * @param text
     * @param textStyle
     * @returns {Rectangle}
     */
    setLabel(text, textStyle) {
        return this
    }

    /**
     * Sets Style
     * @param style
     * @returns {Rectangle}
     */
    setStyle(style) {
        if (Object.keys(style).length === 0) {
            return this
        }
        delete style['positions']
        this._style = style
        Util.merge(this._delegate.rectangle, this._style)
        return this
    }
}

Overlay.registerType('rectangle')

export default Rectangle