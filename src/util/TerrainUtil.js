/**
 * @description 地形相关
 */
import * as Cesium from 'cesium'
const ellipsoid = new Cesium.EllipsoidTerrainProvider({
  ellipsoid: Cesium.Ellipsoid.WGS84
})
class TerrainUtil {
  /**
   * 是否无地形
   * @param viewer
   * @return {boolean}
   */
  static hasTerrain (viewer) {
    return !(viewer.terrainProvider === ellipsoid || viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider)
  }
  static getEllipsoidTerrain () {
    return ellipsoid
  }
}
export default TerrainUtil
