import * as turf from '@turf/turf'
import * as Cesium from 'cesium'
/**
 * 多个点或线面数据相关处理类
 */
class PolyUtil {
  /**
   * 缓冲分析，求指定点线面geoJSON对象按照width半径的缓冲面对象
   * @param {Object} geoJSON geoJSON
   * @param {Number} width 缓冲半径
   */
  static buffer (geoJSON, width) {
    try {
      width = Cesium.defaultValue(width, 1)
      geoJSON = turf.buffer(geoJSON, width, {
        unit: 'meters',
        steps: 64
      })
    } catch (e) {
      console.log('缓冲区分析失败')
      console.log(e)
    }
     return geoJSON
  }
}
export default PolyUtil
