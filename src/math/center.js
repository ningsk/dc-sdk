import * as Cesium from 'cesium'
import Transform from '../transform/Transform'
import Position from '../position/Position'
export default function center (positions) {
  if (positions && Array.isArray(positions)) {
    const boundingSphere = Cesium.BoundingSphere.fromPoint(
      Transform.transformWGS84ArrayToCartesianArray(positions)
    )
    return Transform.transformCartesianToWGS84(boundingSphere.center)
  }
  return new Position()
}
