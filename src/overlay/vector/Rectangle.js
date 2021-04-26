import * as Cesium from 'cesium'
import Overlay from '@/dc/overlay/Overlay'
import { OverlayType } from '@/dc/overlay'
import State from '@/dc/const/State'
import Parse from '@/dc/parse/Parse'
import { Transform } from '@/dc/transform'
import { Util } from '@/dc/util'
class Rectangle extends Overlay {
    constructor (positions) {
        super()
        this._positions = Parse.parsePositions(positions)
        this._delegate = new Cesium.Entity({ rectangle: {} })
        this.type = OverlayType.RECTANGLE
        this._state = State.INITIALIZED
    }

    set positions (positions) {
        this._positions = Parse.parsePositions(positions)
        this._delegate.rectangle.coordinates = Cesium.Rectangle.fromCartesianArray(
            Transform.transformWGS84ArrayToCartesianArray(this._positions)
        )
        return this
    }

    get positions () {
        return this._positions
    }

    _mountedHook () {
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
    setLabel (text, textStyle) {
        return this
    }

    /**
     * Sets Style
     * @param style
     * @returns {Rectangle}
     */
    setStyle (style) {
        if (Object.keys(style).length === 0) {
            return this
        }
        delete style['positions']
        this._style = style
        Util.merge(this._delegate.rectangle, this._style)
        return this
    }
}
export default Rectangle
