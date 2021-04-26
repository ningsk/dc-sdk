import * as Cesium from 'cesium'
import { Overlay, OverlayType } from '@/dc/overlay'
import Parse from '@/dc/parse/Parse'
import State from '@/dc/const/State'
import { Transform } from '@/dc/transform'
import { Util, PlotUtil } from '@/dc/util'

const HALF_PI = Math.PI / 2

class AttackArrow extends Overlay {
    constructor (positions) {
        super()
        this._positions = Parse.parsePositions(positions)
        this._delegate = new Cesium.Entity({ polygon: {} })
        this.headHeightFactor = 0.18
        this.headWidthFactor = 0.3
        this.neckHeightFactor = 0.85
        this.neckWidthFactor = 0.15
        this.headTailFactor = 0.8
        this.type = OverlayType.ATTACK_ARROW
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

    _getArrowHeadPoints (points, tailLeft, tailRight) {
        let len = PlotUtil.getBaseLength(points)
        let headHeight = len * this.headHeightFactor
        const headPnt = points[points.length - 1]
        len = PlotUtil.distance(headPnt, points[points.length - 2])
        const tailWidth = PlotUtil.distance(tailLeft, tailRight)
        if (headHeight > tailWidth * this.headTailFactor) {
            headHeight = tailWidth * this.headTailFactor
        }
        const headWidth = headHeight * this.headWidthFactor
        const neckWidth = headHeight * this.neckWidthFactor
        headHeight = headHeight > len ? len : headHeight
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
        // 计算箭头
        const headPnts = this._getArrowHeadPoints(bonePnts, tailLeft, tailRight)
        const neckLeft = headPnts[0]
        const neckRight = headPnts[4]
        const tailWidthFactor =
            PlotUtil.distance(tailLeft, tailRight) / PlotUtil.getBaseLength(bonePnts)
        // 计算箭身
        const bodyPnts = this._getArrowBodyPoints(
            bonePnts,
            neckLeft,
            neckRight,
            tailWidthFactor
        )
        // 整合
        const count = bodyPnts.length
        let leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2))
        leftPnts.push(neckLeft)
        let rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count))
        rightPnts.push(neckRight)
        leftPnts = PlotUtil.getQBSplinePoints(leftPnts)
        rightPnts = PlotUtil.getQBSplinePoints(rightPnts)
        return new Cesium.PolygonHierarchy(
            Transform.transformWGS84ArrayToCartesianArray(
                Parse.parsePositions(leftPnts.concat(headPnts, rightPnts.reverse()))
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
     * @returns {AttackArrow}
     */
    setLabel (text, textStyle) {
        return this
    }

    /**
     * Sets Style
     * @param style
     * @returns {AttackArrow}
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
export default AttackArrow
