import * as Cesium from 'cesium'
import Transform from '../transform/Transform'
import Position from '../position/Position'
export default function heading (startPosition, endPosition) {
    let heading = 0
    if (startPosition instanceof Position) {
        startPosition = Transform.transformWGS84ToCartesian(startPosition)
    }
    if (endPosition instanceof Position) {
        endPosition = Transform.transformWGS84ToCartesian(endPosition)
    }
    const v = Cesium.Cartesian3.subtract(
        endPosition,
        startPosition,
        new Cesium.Cartesian3()
    )
    if (v) {
        Cesium.Cartesian3.normalize(v, v)
        const up = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(
            startPosition,
            new Cesium.Cartesian3()
        )
        const east = Cesium.Cartesian3.cross(
            Cesium.Cartesian3.UNIT_Z,
            up,
            new Cesium.Cartesian3()
        )
        const north = Cesium.Cartesian3.cross(up, east, new Cesium.Cartesian3())
        heading = Math.atan2(
            Cesium.Cartesian3.dot(v, east),
            Cesium.Cartesian3.dot(v, north)
        )
    }
    return heading
}
