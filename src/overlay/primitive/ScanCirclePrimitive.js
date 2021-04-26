import * as Cesium from 'cesium'
import { Overlay, OverlayType } from '@/dc/overlay'
import State from '@/dc/const/State'
import Parse from '@/dc/parse/Parse'
import { Transform } from '@/dc/transform'
class ScanCirclePrimitive extends Overlay {
    constructor (position, radius) {
        super()
        this._position = Parse.parsePosition(position)
        this._radius = radius
        this._delegate = new Cesium.GroundPrimitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: {}
            })
        })
        this.type = OverlayType.SCAN_CIRCLE_PRIMITIVE
        this._state = State.INITIALIZED
    }

    set position (position) {
        this._position = Parse.parsePosition(position)
        this._delegate.geometryInstances.geometry = new Cesium.EllipseGeometry({
            center: Transform.transformWGS84ToCartesian(this._position),
            semiMajorAxis: this._radius,
            semiMinorAxis: this._radius
        })
        return this
    }

    get position () {
        return this._position
    }

    set radius (radius) {
        this._radius = radius
        this._delegate.geometryInstances.geometry.semiMajorAxis = this._radius
        this._delegate.geometryInstances.geometry.semiMinorAxis = this._radius
        return this
    }

    get radius () {
        return this._radius
    }

    /**
     *
     * @private
     */
    _setAppearance () {
        if (!this._style) {
            return
        }
        this._delegate.appearance = new Cesium.MaterialAppearance({
            material: Cesium.Material.fromType('CircleScan', {
                color: this._style.color || Cesium.Color.WHITE,
                speed: this._style.speed || 10
            })
        })
    }

    _mountedHook () {
        /**
         *  set the position
         */
        this.position = this._position

        /**
         * set the appearance
         */
        !this._delegate.appearance && this._setAppearance()
    }

    /**
     * Sets Style
     * @param style
     * @returns {ScanCirclePrimitive}
     */
    setStyle (style = {}) {
        if (Object.keys(style).length === 0) {
            return this
        }
        this._style = style
        style.classificationType &&
            (this._delegate.classificationType = this._style.classificationType)
        this._setAppearance()
        return this
    }
}
export default ScanCirclePrimitive
