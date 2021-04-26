import * as Cesium from 'cesium'
import { Overlay, OverlayType } from '@/dc/overlay'
import Parse from '@/dc/parse/Parse'
import State from '@/dc/const/State'
import { Transform } from '@/dc/transform'
import { Util, PlotUtil } from '@/dc/util'

const HALF_PI = Math.PI / 2

const FITTING_COUNT = 100

class GatheringPlace extends Overlay {
    constructor (positions) {
        super()
        this._positions = Parse.parsePositions(positions)
        this._delegate = new Cesium.Entity({ polygon: {} })
        this.t = 0.4
        this.type = OverlayType.GATHERING_PLACE
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
        let pnts = Parse.parsePolygonCoordToArray(this._positions)[0]
        if (this._positions.length === 2) {
            const mid = PlotUtil.mid(pnts[0], pnts[1])
            const d = PlotUtil.distance(pnts[0], mid) / 0.9
            const pnt = PlotUtil.getThirdPoint(pnts[0], mid, HALF_PI, d, true)
            pnts = [pnts[0], pnt, pnts[1]]
        }
        const mid = PlotUtil.mid(pnts[0], pnts[2])
        pnts.push(mid, pnts[0], pnts[1])
        let normals = []
        for (let i = 0; i < pnts.length - 2; i++) {
            const pnt1 = pnts[i]
            const pnt2 = pnts[i + 1]
            const pnt3 = pnts[i + 2]
            const normalPoints = PlotUtil.getBisectorNormals(this.t, pnt1, pnt2, pnt3)
            normals = normals.concat(normalPoints)
        }
        const count = normals.length
        normals = [normals[count - 1]].concat(normals.slice(0, count - 1))
        const pList = []
        for (let i = 0; i < pnts.length - 2; i++) {
            const pnt1 = pnts[i]
            const pnt2 = pnts[i + 1]
            pList.push(pnt1)
            for (let t = 0; t <= FITTING_COUNT; t++) {
                const pnt = PlotUtil.getCubicValue(
                    t / FITTING_COUNT,
                    pnt1,
                    normals[i * 2],
                    normals[i * 2 + 1],
                    pnt2
                )
                pList.push(pnt)
            }
            pList.push(pnt2)
        }
        return new Cesium.PolygonHierarchy(
            Transform.transformWGS84ArrayToCartesianArray(Parse.parsePositions(pList))
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
     * @returns {GatheringPlace}
     */
    setLabel (text, textStyle) {
        return this
    }

    /**
     * Sets Style
     * @param style
     * @returns {GatheringPlace}
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
export default GatheringPlace
