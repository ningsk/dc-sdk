import * as Cesium from 'cesium'
import Overlay from '@/dc/overlay/Overlay'
import { OverlayType } from '@/dc/overlay'
import State from '@/dc/const/State'
import Parse from '@/dc/parse/Parse'
import { Transform } from '@/dc/transform'
import { Util } from '@/dc/util'
import { center, distance } from '@/dc/math'
class Polyline extends Overlay {
    constructor (positions) {
        super()
        this._positions = Parse.parsePositions(positions)
        this._delegate = new Cesium.Entity({ polyline: {} })
        this.type = OverlayType.POLYLINE
        this._state = State.INITIALIZED
    }

    set positions (positions) {
        this._positions = Parse.parsePositions(positions)
        this._delegate.polyline.positions = Transform.transformWGS84ArrayToCartesianArray(
            this._positions
        )
        return this
    }

    get positions () {
        return this._positions
    }

    get center () {
        return center(this._positions)
    }

    get distance () {
        return distance(this._positions)
    }

    _mountedHook () {
        /**
         *  initialize the Overlay parameter
         */
        this.positions = this._positions
    }

    /**
     * Sets Text
     * @param text
     * @param textStyle
     * @returns {Polyline}
     */
    setLabel (text, textStyle) {
        this._delegate.position = Transform.transformWGS84ToCartesian(this.center)
        this._delegate.label = {
            text: text,
            ...textStyle
        }
        return this
    }

    /**
     * Sets style
     * @param style
     * @returns {Polyline}
     */
    setStyle (style) {
        if (!style || Object.keys(style).length === 0) {
            return this
        }
        delete style['positions']
        this._style = style
        Util.merge(this._delegate.polyline, this._style)
        return this
    }

    /**
     * Parse from entity
     * @param entity
     * @returns {Polyline}
     */
    static fromEntity (entity) {
        let polyline
        const now = Cesium.JulianDate.now()
        if (entity.polyline) {
            const positions = Transform.transformCartesianArrayToWGS84Array(
                entity.polyline.positions.getValue(now)
            )
            polyline = new Polyline(positions)
            polyline.attr = {
                ...entity.properties.getValue(now)
            }
        }
        return polyline
    }
}
export default Polyline
