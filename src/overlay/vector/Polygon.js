import * as Cesium from 'cesium'
import Overlay from '@/dc/overlay/Overlay'
import { OverlayType } from '@/dc/overlay'
import State from '@/dc/const/State'
import Parse from '@/dc/parse/Parse'
import { Transform } from '@/dc/transform'
import { Util } from '@/dc/util'
import { area, center } from '@/dc/math'
class Polygon extends Overlay {
    constructor (positions) {
        super()
        this._delegate = new Cesium.Entity({ polygon: {} })
        this._positions = Parse.parsePositions(positions)
        this._holes = []
        this.type = OverlayType.POLYGON
        this._state = State.INITIALIZED
    }

    set positions (positions) {
        this._positions = Parse.parsePositions(positions)
        this._delegate.polygon.hierarchy = this._computeHierarchy()
        return this
    }

    get positions () {
        return this._positions
    }

    set holes (holes) {
        if (holes && holes.length) {
            this._holes = holes.map(item => Parse.parsePositions(item))
            this._delegate.polygon.hierarchy = this._computeHierarchy()
        }
        return this
    }

    get holes () {
        return this._holes
    }

    get center () {
        return center([...this._positions, this._positions[0]])
    }

    get area () {
        return area(this._positions)
    }

    /**
     *
     * @private
     */
    _computeHierarchy () {
        const result = new Cesium.PolygonHierarchy()
        result.positions = Transform.transformWGS84ArrayToCartesianArray(
            this._positions
        )
        result.holes = this._holes.map(
            item =>
                new Cesium.PolygonHierarchy(
                    Transform.transformWGS84ArrayToCartesianArray(item)
                )
        )
        return result
    }

    _mountedHook () {
        /**
         *  initialize the Overlay parameter
         */
        this.positions = this._positions
    }

    /**
     * Sets text
     * @param text
     * @param textStyle
     * @returns {Polygon}
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
     * @returns {Polygon}
     */
    setStyle (style) {
        if (!style || Object.keys(style).length === 0) {
            return this
        }
        delete style['positions']
        this._style = style
        Util.merge(this._delegate.polygon, this._style)
        return this
    }

    /**
     * Parse from entity
     * @param entity
     * @returns {any}
     */
    static fromEntity (entity) {
        let polygon
        const now = Cesium.JulianDate.now()
        if (entity.polygon) {
            const positions = Transform.transformCartesianArrayToWGS84Array(
                entity.polygon.hierarchy.getValue(now).positions
            )
            polygon = new Polygon(positions)
            polygon.attr = {
                ...entity.properties.getValue(now)
            }
        }
        return polygon
    }
}
export default Polygon
