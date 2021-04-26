import * as Cesium from 'cesium'
import { Overlay, OverlayType } from '@/dc/overlay'
import Parse from '@/dc/parse/Parse'
import State from '@/dc/const/State'
import { Transform } from '@/dc/transform'
import { Util, PlotUtil } from '@/dc/util'
const HALF_PI = Math.PI / 2

class FineArrow extends Overlay {
    constructor (positions) {
        super()
        this._positions = Parse.parsePositions(positions)
        this._delegate = new Cesium.Entity({ polygon: {} })
        this.tailWidthFactor = 0.15
        this.neckWidthFactor = 0.2
        this.headWidthFactor = 0.25
        this.headAngle = Math.PI / 8.5
        this.neckAngle = Math.PI / 13
        this.type = OverlayType.FINE_ARROW
        this._state = State.INITIALIZED
    }

    set positions (positions) {
        this._positions = Parse.parsePositions(positions)
        this._delegate.polygon.hierarchy = this._getHierarchy()
        return this
    }

    get positions () {
        return this._positions
    }

    _getHierarchy () {
        const pnts = Parse.parsePolygonCoordToArray(this._positions)[0]
        const pnt1 = pnts[0]
        const pnt2 = pnts[1]
        const len = PlotUtil.getBaseLength(pnts)
        const tailWidth = len * this.tailWidthFactor
        const neckWidth = len * this.neckWidthFactor
        const headWidth = len * this.headWidthFactor
        const tailLeft = PlotUtil.getThirdPoint(pnt2, pnt1, HALF_PI, tailWidth, true)
        const tailRight = PlotUtil.getThirdPoint(
            pnt2,
            pnt1,
            HALF_PI,
            tailWidth,
            false
        )
        const headLeft = PlotUtil.getThirdPoint(
            pnt1,
            pnt2,
            this.headAngle,
            headWidth,
            false
        )
        const headRight = PlotUtil.getThirdPoint(
            pnt1,
            pnt2,
            this.headAngle,
            headWidth,
            true
        )
        const neckLeft = PlotUtil.getThirdPoint(
            pnt1,
            pnt2,
            this.neckAngle,
            neckWidth,
            false
        )
        const neckRight = PlotUtil.getThirdPoint(
            pnt1,
            pnt2,
            this.neckAngle,
            neckWidth,
            true
        )
        return new Cesium.PolygonHierarchy(
            Transform.transformWGS84ArrayToCartesianArray(
                Parse.parsePositions([
                    tailLeft,
                    neckLeft,
                    headLeft,
                    pnt2,
                    headRight,
                    neckRight,
                    tailRight
                ])
            )
        )
    }

    _mountedHook () {
        /**
         *  set the location
         */
        this.positions = this._positions
    }

    /**
     *
     * @param text
     * @param textStyle
     * @returns {FineArrow}
     */
    setLabel (text, textStyle) {
        return this
    }

    /**
     * Sets Style
     * @param style
     * @returns {FineArrow}
     */
    setStyle (style) {
        if (Object.keys(style).length === 0) {
            return this
        }
        delete style['positions']
        this._style = style
        Util.merge(this._delegate.polygon, this._style)
        return this
    }
}
export default FineArrow
