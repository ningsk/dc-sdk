import * as Cesium from 'cesium'
import Transform from '../transform/Transform'

export default function distance (positions) {
    let distance = 0
    if (positions && Array.isArray(positions)) {
        for (let i = 0; i < positions.length - 1; i++) {
            const c1 = Transform.transformWGS84ToCartographic(positions[i])
            const c2 = Transform.transformWGS84ToCartographic(positions[i + 1])
            const geodesic = new Cesium.EllipsoidGeodesic()
            geodesic.setEndPoints(c1, c2)
            let s = geodesic.surfaceDistance
            s = Math.sqrt(Math.pow(s, 2) + Math.pow(c2.height - c1.height, 2))
            distance += s
        }
    }

    return distance.toFixed(3)
}
