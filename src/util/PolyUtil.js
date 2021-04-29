import * as Cesium from 'cesium'

class PolyUtil {
  /**
   * 计算平行线，offset正负决定方向（单位米）
   * @param {Array<Cesium.Cartesian3>} positions 原始线的坐标数组
   * @param  {Number} offset 偏移的距离（单位：mi） 正负决定方向
   * @return {Array<Cesium.Cartesian3>} 平行线坐标数组
   */
  static getOffsetLine (positions, offset) {
    const arrNew = []
    for (let i = 1; i < positions.length; i++) {
      const point1 = positions[i - 1]
      const point2 = positions[i]
      const dir12 = Cesium.Cartesian3.subtract(point1, point2, new Cesium.Cartesian3())
      const dir21left = Cesium.Cartesian3.cross(point1, dir12, new Cesium.Cartesian3())
      const p1offset = this.computedOffsetData(point1, dir21left, offset * 1000)
      const p2offset = this.computedOffsetData(point2, dir21left, offset * 1000)
      if (i === 1) {
        arrNew.push(p1offset)
      }
      arrNew.push(p2offset)
    }
    return arrNew
  }
  static computedOffsetData (ori, dir, wid) {
    const currRay = new Cesium.Ray(ori, dir)
    return Cesium.Ray.getPoint(currRay, wid, new Cesium.Cartesian3())
  }
}
export default PolyUtil
