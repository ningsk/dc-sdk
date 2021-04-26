import * as Cesium from 'cesium'
import Position from '../position/Position'
import Transform from '../transform/Transform'

export default function mid (startPosition, endPosition) {
    if (startPosition instanceof Position) {
        startPosition = Transform.transformWGS84ToCartographic(startPosition)
    }

    if (endPosition instanceof Position) {
        endPosition = Transform.transformWGS84ToCartographic(endPosition)
    }

    const mc = new Cesium.EllipsoidGeodesic(
        startPosition,
        endPosition
    ).interpolateUsingFraction(0.5)

    return new Position(
        Cesium.Math.toDegrees(mc.longitude),
        Cesium.Math.toDegrees(mc.latitude),
        mc.height
    )
}
