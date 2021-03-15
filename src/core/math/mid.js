/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 14:12:46
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 14:15:39
 */

import Position from '../position/Position'
import Transform from '../transform/Transform'
const { Cesium } = DC.Namespace

export default function mid(startPosition, endPosition) {
    if (startPosition instanceof Position) {
        startPosition = Transform.transformWGS84ToCartographic(startPosition)
    }

    if (endPosition instanceof Position) {
        endPosition = Transform.transformWGS84ToCartographic(endPosition)
    }

    let mc = new Cesium.EllipsoidGeodesic(
        startPosition,
        endPosition
    ).interpolateUsingFraction(0.5)

    return new Position(
        Cesium.Math.toDegrees(mc.longitude),
        Cesium.Math.toDegrees(mc.latitude),
        mc.height
    )
}
