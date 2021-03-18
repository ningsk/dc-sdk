/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 14:12:46
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 14:13:57
 */
import Transform from '../transform/Transform'
import Position from '../position/Position'

import Cesium from "cesium"

export default function center(positions) {
    if (positions && Array.isArray(positions)) {
        let boundingSphere = Cesium.BoundingSphere.fromPoints(
            Transform.transformWGS84ArrayToCartesianArray(positions)
        )
        return Transform.transformCartesianToWGS84(boundingSphere.center)
    }

    return new Position()
}
