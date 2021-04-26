import * as Cesium from 'cesium'
import { OverlayType } from '@/dc/overlay'
import Parse from '@/dc/parse/Parse'
import State from '@/dc/const/State'
import { Transform } from '@/dc/transform'
import { PlotUtil } from '@/dc/util'
import AttackArrow from '@/dc/overlay/plot/AttackArrow'

class TailedAttackArrow extends AttackArrow {
    constructor (positions) {
        super(positions)
        this._delegate = new Cesium.Entity({ polygon: {} })
        this.headHeightFactor = 0.18
        this.headWidthFactor = 0.3
        this.neckHeightFactor = 0.85
        this.neckWidthFactor = 0.15
        this.tailWidthFactor = 0.1
        this.headTailFactor = 0.8
        this.swallowTailFactor = 1
        this.type = OverlayType.TRAILED_ATTACK_ARROW
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
        let tailLeft = pnts[0]
        let tailRight = pnts[1]
        if (PlotUtil.isClockWise(pnts[0], pnts[1], pnts[2])) {
            tailLeft = pnts[1]
            tailRight = pnts[0]
        }
        const midTail = PlotUtil.mid(tailLeft, tailRight)
        const bonePnts = [midTail].concat(pnts.slice(2))
        const headPnts = this._getArrowHeadPoints(bonePnts, tailLeft, tailRight)
        const neckLeft = headPnts[0]
        const neckRight = headPnts[4]
        const tailWidth = PlotUtil.distance(tailLeft, tailRight)
        const allLen = PlotUtil.getBaseLength(bonePnts)
        const len = allLen * this.tailWidthFactor * this.swallowTailFactor
        const swallowTailPnt = PlotUtil.getThirdPoint(
            bonePnts[1],
            bonePnts[0],
            0,
            len,
            true
        )
        const factor = tailWidth / allLen
        const bodyPnts = this._getArrowBodyPoints(
            bonePnts,
            neckLeft,
            neckRight,
            factor
        )
        const count = bodyPnts.length
        let leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2))
        leftPnts.push(neckLeft)
        let rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count))
        rightPnts.push(neckRight)
        leftPnts = PlotUtil.getQBSplinePoints(leftPnts)
        rightPnts = PlotUtil.getQBSplinePoints(rightPnts)
        return new Cesium.PolygonHierarchy(
            Transform.transformWGS84ArrayToCartesianArray(
                Parse.parsePositions(
                    leftPnts.concat(headPnts, rightPnts.reverse(), [
                        swallowTailPnt,
                        leftPnts[0]
                    ])
                )
            )
        )
    }
}
export default TailedAttackArrow
