import * as Cesium from 'cesium'
import { Overlay, OverlayType } from '@/dc/overlay'
import Parse from '@/dc/parse/Parse'
import State from '@/dc/const/State'
import { Transform } from '@/dc/transform'
import { Util, PlotUtil } from '@/dc/util'

const HALF_PI = Math.PI / 2

class DoubleArrow extends Overlay {
    constructor (positions) {
        super()
        this._positions = Parse.parsePositions(positions)
        this._delegate = new Cesium.Entity({ polygon: {} })
        this.headHeightFactor = 0.25
        this.headWidthFactor = 0.3
        this.neckHeightFactor = 0.85
        this.neckWidthFactor = 0.15
        this.type = OverlayType.DOUBLE_ARROW
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

    _getArrowPoints (pnt1, pnt2, pnt3, clockWise) {
        const midPnt = PlotUtil.mid(pnt1, pnt2)
        const len = PlotUtil.distance(midPnt, pnt3)
        let midPnt1 = PlotUtil.getThirdPoint(pnt3, midPnt, 0, len * 0.3, true)
        let midPnt2 = PlotUtil.getThirdPoint(pnt3, midPnt, 0, len * 0.5, true)
        midPnt1 = PlotUtil.getThirdPoint(
            midPnt,
            midPnt1,
            HALF_PI,
            len / 5,
            clockWise
        )
        midPnt2 = PlotUtil.getThirdPoint(
            midPnt,
            midPnt2,
            HALF_PI,
            len / 4,
            clockWise
        )
        const points = [midPnt, midPnt1, midPnt2, pnt3]
        // 计算箭头部分
        const arrowPnts = this._getArrowHeadPoints(points)
        const neckLeftPoint = arrowPnts[0]
        const neckRightPoint = arrowPnts[4]
        // 计算箭身部分
        const tailWidthFactor =
            PlotUtil.distance(pnt1, pnt2) / PlotUtil.getBaseLength(points) / 2
        const bodyPnts = this._getArrowBodyPoints(
            points,
            neckLeftPoint,
            neckRightPoint,
            tailWidthFactor
        )
        const n = bodyPnts.length
        let lPoints = bodyPnts.slice(0, n / 2)
        let rPoints = bodyPnts.slice(n / 2, n)
        lPoints.push(neckLeftPoint)
        rPoints.push(neckRightPoint)
        lPoints = lPoints.reverse()
        lPoints.push(pnt2)
        rPoints = rPoints.reverse()
        rPoints.push(pnt1)
        return lPoints.reverse().concat(arrowPnts, rPoints)
    }

    _getArrowHeadPoints (points) {
        const len = PlotUtil.getBaseLength(points)
        const headHeight = len * this.headHeightFactor
        const headPnt = points[points.length - 1]
        const headWidth = headHeight * this.headWidthFactor
        const neckWidth = headHeight * this.neckWidthFactor
        const neckHeight = headHeight * this.neckHeightFactor
        const headEndPnt = PlotUtil.getThirdPoint(
            points[points.length - 2],
            headPnt,
            0,
            headHeight,
            true
        )
        const neckEndPnt = PlotUtil.getThirdPoint(
            points[points.length - 2],
            headPnt,
            0,
            neckHeight,
            true
        )
        const headLeft = PlotUtil.getThirdPoint(
            headPnt,
            headEndPnt,
            HALF_PI,
            headWidth,
            false
        )
        const headRight = PlotUtil.getThirdPoint(
            headPnt,
            headEndPnt,
            HALF_PI,
            headWidth,
            true
        )
        const neckLeft = PlotUtil.getThirdPoint(
            headPnt,
            neckEndPnt,
            HALF_PI,
            neckWidth,
            false
        )
        const neckRight = PlotUtil.getThirdPoint(
            headPnt,
            neckEndPnt,
            HALF_PI,
            neckWidth,
            true
        )
        return [neckLeft, headLeft, headPnt, headRight, neckRight]
    }

    _getArrowBodyPoints (points, neckLeft, neckRight, tailWidthFactor) {
        const allLen = PlotUtil.wholeDistance(points)
        const len = PlotUtil.getBaseLength(points)
        const tailWidth = len * tailWidthFactor
        const neckWidth = PlotUtil.distance(neckLeft, neckRight)
        const widthDif = (tailWidth - neckWidth) / 2
        let tempLen = 0
        const leftBodyPnts = []
        const rightBodyPnts = []
        for (let i = 1; i < points.length - 1; i++) {
            const angle =
                PlotUtil.getAngleOfThreePoints(
                    points[i - 1],
                    points[i],
                    points[i + 1]
                ) / 2
            tempLen += PlotUtil.distance(points[i - 1], points[i])
            const w = (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle)
            const left = PlotUtil.getThirdPoint(
                points[i - 1],
                points[i],
                Math.PI - angle,
                w,
                true
            )
            const right = PlotUtil.getThirdPoint(
                points[i - 1],
                points[i],
                angle,
                w,
                false
            )
            leftBodyPnts.push(left)
            rightBodyPnts.push(right)
        }
        return leftBodyPnts.concat(rightBodyPnts)
    }

    _getTempPoint4 (linePnt1, linePnt2, point) {
        const midPnt = PlotUtil.mid(linePnt1, linePnt2)
        const len = PlotUtil.distance(midPnt, point)
        const angle = PlotUtil.getAngleOfThreePoints(linePnt1, midPnt, point)
        let symPnt, distance1, distance2, mid
        if (angle < HALF_PI) {
            distance1 = len * Math.sin(angle)
            distance2 = len * Math.cos(angle)
            mid = PlotUtil.getThirdPoint(linePnt1, midPnt, HALF_PI, distance1, false)
            symPnt = PlotUtil.getThirdPoint(midPnt, mid, HALF_PI, distance2, true)
        } else if (angle >= HALF_PI && angle < Math.PI) {
            distance1 = len * Math.sin(Math.PI - angle)
            distance2 = len * Math.cos(Math.PI - angle)
            mid = PlotUtil.getThirdPoint(linePnt1, midPnt, HALF_PI, distance1, false)
            symPnt = PlotUtil.getThirdPoint(midPnt, mid, HALF_PI, distance2, false)
        } else if (angle >= Math.PI && angle < Math.PI * 1.5) {
            distance1 = len * Math.sin(angle - Math.PI)
            distance2 = len * Math.cos(angle - Math.PI)
            mid = PlotUtil.getThirdPoint(linePnt1, midPnt, HALF_PI, distance1, true)
            symPnt = PlotUtil.getThirdPoint(midPnt, mid, HALF_PI, distance2, true)
        } else {
            distance1 = len * Math.sin(Math.PI * 2 - angle)
            distance2 = len * Math.cos(Math.PI * 2 - angle)
            mid = PlotUtil.getThirdPoint(linePnt1, midPnt, HALF_PI, distance1, true)
            symPnt = PlotUtil.getThirdPoint(midPnt, mid, HALF_PI, distance2, false)
        }
        return symPnt
    }

    _getHierarchy () {
        const count = this._positions.length
        let tempPoint4
        let connPoint
        const pnts = Parse.parsePolygonCoordToArray(this._positions)[0]
        const pnt1 = pnts[0]
        const pnt2 = pnts[1]
        const pnt3 = pnts[2]
        if (count === 3) tempPoint4 = this._getTempPoint4(pnt1, pnt2, pnt3)
        else tempPoint4 = pnts[3]
        if (count === 3 || count === 4) connPoint = PlotUtil.mid(pnt1, pnt2)
        else connPoint = pnts[4]
        let leftArrowPnts, rightArrowPnts
        if (PlotUtil.isClockWise(pnt1, pnt2, pnt3)) {
            leftArrowPnts = this._getArrowPoints(pnt1, connPoint, tempPoint4, false)
            rightArrowPnts = this._getArrowPoints(connPoint, pnt2, pnt3, true)
        } else {
            leftArrowPnts = this._getArrowPoints(pnt2, connPoint, pnt3, false)
            rightArrowPnts = this._getArrowPoints(connPoint, pnt1, tempPoint4, true)
        }
        const m = leftArrowPnts.length
        const t = (m - 5) / 2
        const llBodyPnts = leftArrowPnts.slice(0, t)
        const lArrowPnts = leftArrowPnts.slice(t, t + 5)
        let lrBodyPnts = leftArrowPnts.slice(t + 5, m)
        let rlBodyPnts = rightArrowPnts.slice(0, t)
        const rArrowPnts = rightArrowPnts.slice(t, t + 5)
        const rrBodyPnts = rightArrowPnts.slice(t + 5, m)
        rlBodyPnts = PlotUtil.getBezierPoints(rlBodyPnts)
        const bodyPnts = PlotUtil.getBezierPoints(
            rrBodyPnts.concat(llBodyPnts.slice(1))
        )
        lrBodyPnts = PlotUtil.getBezierPoints(lrBodyPnts)
        return new Cesium.PolygonHierarchy(
            Transform.transformWGS84ArrayToCartesianArray(
                Parse.parsePositions(
                    rlBodyPnts.concat(rArrowPnts, bodyPnts, lArrowPnts, lrBodyPnts)
                )
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
     * @returns {DoubleArrow}
     */
    setLabel (text, textStyle) {
        return this
    }

    /**
     * Sets Style
     * @param style
     * @returns {DoubleArrow}
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
export default DoubleArrow
