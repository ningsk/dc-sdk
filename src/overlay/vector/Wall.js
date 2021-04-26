import * as Cesium from 'cesium'
import Overlay from '@/dc/overlay/Overlay'
import { OverlayType } from '@/dc/overlay'
import State from '@/dc/const/State'
import Parse from '@/dc/parse/Parse'
import { Transform } from '@/dc/transform'
import { Util } from '@/dc/util'
class Wall extends Overlay {
    constructor (positions) {
        super()
        this._positions = Parse.parsePositions(positions)
        this._delegate = new Cesium.Entity({ wall: {} })
        this.type = OverlayType.WALL
        this._state = State.INITIALIZED
    }

    set positions (positions) {
        this._positions = Parse.parsePositions(positions)
        this._delegate.wall.positions = Transform.transformWGS84ArrayToCartesianArray(
            this._positions
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
     *
     * @param text
     * @param textStyle
     * @returns {Wall}
     */
    setLabel (text, textStyle) {
        return this
    }

    /**
     * Sets Style
     * @param style
     * @returns {Wall}
     */
    setStyle (style) {
        if (Object.keys(style).length === 0) {
            return this
        }
        delete style['positions']
        this._style = style
        Util.merge(this._delegate.wall, this._style)
        return this
    }

    /**
     * Parses from entity
     * @param entity
     * @returns {Wall|any}
     */
    static fromEntity (entity) {
        let wall
        const now = Cesium.JulianDate.now()
        if (entity.polyline) {
            const positions = Transform.transformCartesianArrayToWGS84Array(
                entity.polyline.positions.getValue(now)
            )
            wall = new Wall(positions)
            wall.attr = {
                ...entity.properties.getValue(now)
            }
        }
        return wall
    }
}
export default Wall
