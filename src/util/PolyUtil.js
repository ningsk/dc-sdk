import * as Cesium from 'cesium'
import * as turf from '@turf/turf'
import { Transform, Util } from '@/dc'
import { PointUtil } from '@/dc/util/index'

class PolyUtil {
  /**
   * 计算平行线，offset正负决定方向（单位米）
   * @param {Array.<Cesium.Cartesian3>} positions 原始线的坐标数组
   * @param  {Number} offset 偏移的距离（单位：mi） 正负决定方向
   * @return {Array.<Cesium.Cartesian3>} 平行线坐标数组
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

  /**
   * 求坐标数组中心点
   * @param {Array.<Cesium.Cartesian3>} positions
   * @param {Number} height 指定中心点的高度值，默认为所有点的最高高度
   * @return {Cesium.Cartesian3} 中心点坐标
   */
  static centerOfMass (positions, height) {
    try {
      if (positions.length === 1) {
        return positions[0]
      } else if (positions.length === 2) {
        return Cesium.Cartesian3.midpoint(positions[0], positions[1], new Cesium.Cartesian3())
      }
      if (height == null) {
        height = PointUtil.getMaxHeight(positions)
      }
      const coordinates = Transform.transformCartesianToLonLats(positions)
      coordinates.push(coordinates[0])
      const center = turf.centerOfMass({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        }
      })
      let centerX = center.geometry.coordinates[0]
      let centerY = center.geometry.coordinates[1]
      // 所求的中心点在边界外时，求矩形中心点
      const extent = this.getRectangle(positions, true)
      if (centerX < extent.xmin || centerX > extent.xmax || centerY < extent.ymin || centerY > extent.ymax) {
        centerX = (extent.xmin + extent.xmax) / 2
        centerY = (extent.ymin + extent.ymax) / 2
      }
      return Cesium.Cartesian3.fromDegrees(centerX, centerY, height)
    } catch (e) {
      return positions[Math.floor(positions.length / 2)]
    }
  }

  /**
   * 格式化Rectangle对象 返回经纬度值
   * @param {Cesium.Rectangle} rectangle 矩形对象
   * @param {Number} [digits=6] 经纬度保留的小数位数
   */
  static formatRectangle (rectangle, digits = 6) {
    const west = Util.formatNum(Cesium.Math.toDegrees(rectangle.west), digits)
    const east = Util.formatNum(Cesium.Math.toDegrees(rectangle.east), digits)
    const north = Util.formatNum(Cesium.Math.toDegrees(rectangle.north), digits)
    const south = Util.formatNum(Cesium.Math.toDegrees(rectangle.south), digits)
    return {
      xmin: west,
      xmax: east,
      ymin: south,
      ymax: north
    }
  }

  /**
   * 获取坐标数组的矩形边界值
   * @param {Array.<Cesium.Cartesian3>} positions
   * @param {Boolean} [isFormat=false] 是否格式化
   * @return {Cesium.Rectangle|Object} isFormat的时候 返回格式化对象，否则返回Cesium.Rectangle对象
   */
  static getRectangle (positions, isFormat = false) {
    // 剔除null值的数据
    for (let i = positions.length - 1; i >= 0; i--) {
      if (!Cesium.defined(positions[i])) {
        positions.splice(i, 1)
      }
    }
    const rectangle = Cesium.Rectangle.fromCartesianArray(positions)
    if (isFormat) {
      return this.formatRectangle(rectangle)
    } else return rectangle
  }

  /**
   * 求坐标数组的矩形范围内按splitNum网格数插值的granularity值
   * @param {Array.<Cesium.Cartesian3>} positions 坐标数组
   * @param {Number} [splitNum=10] splitNum网格数
   * @return {number}
   */
  static getGranularity (positions, splitNum) {
    const rectangle = Cesium.Rectangle.fromCartesianArray(positions)
    let granularity = Math.max(rectangle.height, rectangle.width)
    granularity /= Cesium.defaultValue(splitNum, 10)
    return granularity
  }
  /**
   * 对路线按空间等比插值，高度：高度值按各点的高度等比计算，比如：用于航线的插值计算
   * @param {Array.<Cesium.Cartesian3>} positions 坐标数组
   * @param {Object} [options] 参数对象：
   * @param {Number} [options.splitNum] 插值数，等比分割的个数，默认不插值
   * @param {Number} [options.minDistance] 插值时的最小间隔（单位：米） 优先级高于splitNum
   * @return {Array.<Cesium.Cartesian3>} 插值后的坐标对象
   */
  static interLine (positions, options = {}) {
    if (!positions || positions.length < 2) return positions
    let granularity
    if (options.splitNum) {
      // splitNum分割的个数
      granularity = this.getGranularity(positions, options.splitNum)
      if (granularity <= 0) granularity = null
    }
    const arr = [positions[0]]
    for (let index = 1, length = positions.length; index < length; index++) {
      const startP = positions[index - 1]
      const endP = positions[index]
      const interPositions = Cesium.PolylinePipeline.generateArc({
        positions: [startP, endP],
        minDistance: options.minDistance,
        granularity: granularity
      })
      // 剖面的数据
      const h1 = Cesium.Cartographic.fromCartesian(startP).height
      const h2 = Cesium.Cartographic.fromCartesian(endP).height
      const hStep = (h2 - h1) / interPositions.length
      for (let i = 3, len = interPositions.length; i < len; i += 3) {
        let position = Cesium.Cartesian3.unpack(interPositions, i)
        const cartographic = Cesium.Cartographic.fromCartesian(position)
        const height = Number((h1 + hStep * i).toFixed(1))
        position = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height)
      }
    }
    return arr
  }

  /**
   * 路线进行平面等比插值，高度：指定的固定高度值或按贴地高度
   * @param {Object} [options] 参数对象：
   * @param {Cesium.Scene} [options.scene] 三维地图场景对象，一般用map.scene或viewer.scene
   * @param {Array.<Cesium.Cartesian3>} [options.positions] 坐标数组
   * @param {Number} [options.splitNum=100] 插值数，等比分割的个数
   * @param {Number} [options.minDistance] 插值最小间隔（单位：米） 优先级高于splitNum
   * @param {Number} [options.height=0] 坐标的高度
   * @param {Boolean} [options.surfaceHeight=true] 是否计算贴地高度
   */
  static interPolyline (options) {
    const positions = options.positions
    const scene = options.scene
    let granularity = this.getGranularity(positions, options.splitNum || 100)
    if (granularity <= 0) granularity = null
    const flatPositions = Cesium.PolylinePipeline.generateArc({
      positions: positions,
      height: options.height,
      minDistance: options.minDistance,
      granularity: granularity
    })
    const arr = []
    for (let i = 0; i < flatPositions.length; i += 3) {
      let position = Cesium.Cartesian3.unpack(flatPositions, i)
      if (scene && Cesium.defaultValue(options.surfaceHeight, true)) {
        const height = PointUtil.getSurfaceHeight(scene, position, options)
        const car = Cesium.Cartographic.fromCartesian(position)
        position = Cesium.Cartesian3.fromRadians(car.longitude, car.latitude, height)
      }
      arr.push(position)
    }
    return arr
  }

  /**
   * 计算两点间的曲线链路的点集（空中曲线）
   * @param {Cesium.Cartesian3} startPoint 开始节点
   * @param {Cesium.Cartesian3} endPoint 结束节点
   * @param {Number} angularityFactor 曲率
   * @param {Number} numOfSingleLine 点集数量
   * @return {Array.<Cesium.Cartesian3>} 曲线坐标数组
   */
  static getLinkedPointList (startPoint, endPoint, angularityFactor, numOfSingleLine) {
    const result = []
    const startPosition = Cesium.Cartographic.fromCartesian(startPoint)
    const endPosition = Cesium.Cartographic.fromCartesian(endPoint)
    const startLon = startPosition.longitude * 180 / Math.PI
    const startLat = startPosition.latitude * 180 / Math.PI
    const endLon = endPosition.longitude * 180 / Math.PI
    const endLat = endPosition.latitude * 180 / Math.PI
    const dist = Math.sqrt((startLon - endLon) * (startLon - endLon) + (startLat - endLat) * (startLat - endLat))
    const angularity = dist * angularityFactor
    const startVec = Cesium.Cartesian3.clone(startPoint)
    const endVec = Cesium.Cartesian3.clone(endPoint)
    const startLength = Cesium.Cartesian3.distance(startVec, Cesium.Cartesian3.ZERO)
    const endLength = Cesium.Cartesian3.distance(endVec, Cesium.Cartesian3.ZERO)
    Cesium.Cartesian3.normalize(startVec, startVec)
    Cesium.Cartesian3.normalize(endVec, endVec)
    if (Cesium.Cartesian3.distance(startVec, endVec) === 0) {
      return result
    }
    const omega = Cesium.Cartesian3.angleBetween(startVec, endVec)
    result.push(startPoint)
    for (let i = 1; i < numOfSingleLine - 1; i++) {
      const t = i / (numOfSingleLine - 1)
      const invT = 1 - t
      const startScalar = Math.sin(invT * omega) / Math.sin(omega)
      const endScalar = Math.sin(t * omega) / Math.sin(omega)
      const startScalarVec = Cesium.Cartesian3.multiplyByScalar(startVec, startScalar, new Cesium.Cartesian3())
      const endScalarVec = Cesium.Cartesian3.multiplyByScalar(endVec, endScalar, new Cesium.Cartesian3())
      let centerVec = Cesium.Cartesian3.add(startScalarVec, endScalarVec, new Cesium.Cartesian3())
      const ht = t * Math.PI
      const centerLength = startLength * invT + endLength * t + Math.sin(ht) * angularity
      centerVec = Cesium.Cartesian3.multiplyByScalar(centerVec, centerLength, centerVec)
      result.push(centerVec)
    }
    result.push(endPoint)
    return result
  }
  /**
   * 按两个坐标点分段分布计算，求路线的贴地坐标（插值）
   * @param {Object} [options] 参数对象：
   * @param {Cesium.Scene} [options.scene] 三维地图场景对象，一般用map.scene或viewer.scene
   * @param {Array.<Cesium.Cartesian3>} [options.positions] 坐标数组
   * @param {Number} [options.splitNum = 10] 插值数，等比分割的个数
   * @param {Number} [options.minDistance=0] 插值的最小间隔（单位：米） 优先级高于splitNum
   * @param {Boolean} [options.has3dtiles='auto'] 是否在3dtiles模型上分析（模型分析较慢，按需开启），默认开启内部根据点的位置自动判断（但可能不准）
   * @param {Array.<Object>} [options.objectToExclude] 贴模型分析啊hi和，排除的不进行模型计算的模型对象，可以是primitives，entities或3d tile features
   * @param {Number} [options.offset=0] 可以按需偏移高度（单位：米） 便于可视
   * @param {surfaceLineWork_callback} [options.callback] 异步计算高度完成后的回调方法
   */
  static computeStepSurfaceLine (options) {

  }
  /**
   * 异步分段分步计算贴地距离中，每计算完成两个点之间的距离后的回调方法
   * @callback computeStepSurfaceLine_end
   * @param {Array.<Array>} arrStepPoints 二维数组坐标集合，各分段2点之间的贴地点数组的集合
   */
  /**
   * 异步分段分步计算贴地距离中，每计算完成两个点之间距离后的回调方法
   * @callback computeStepSurfaceLine_endItem(raisePositions, noHeight, index)
   * @param {Array.<Cesium.Cartesian3>} 当前两个点之间的贴地坐标数组
   * @param {Boolean} noHeight 是否计算贴地高度失败，true时标识计算失败了
   * @param {Number} index 坐标数组的index顺序
   */
  /**
   * @callback interPolygon_callback
   * @param {Object} [options] 参数对象
   * @param {Number} [options.granularity] 面内按splitNum网格数插值的granularity值
   * @param {Number} [options.maxHeight] 面内最大高度
   * @param {Number} [options.minHeight] 面内最小高度
   * @param {Array.<Object>} [options.list] 三角网对象数组，每个对象包含三角形的3个顶点相关值
   */
  /**
   * 面内进行贴地或贴模型插值，返回三角网等计算结果的回调方法
   * @callback surfaceLineWork_callback
   * @param {Array.<Cesium.Cartesian3>} raisePositions 计算完成后得到的贴地数组
   * @param {Boolean} noHeight 是否计算贴地高度失败，true时候，标识计算失败了
   * @param {Array.<Cesium.Cartesian3>} positions 原始的坐标数组
   */
  /**
   * 面内进行贴地（或贴模型）时候，返回三角网等计算结果的回调方法
   * @callback VolumeResult
   * @param {Object} [options] 参数如下
   * @param {Number} [options.granularity] 面内按照splitNum网格数插值的granularity值
   * @param {Number} [options.maxHeight] 面内最大高度
   * @param {Number} [options.minHeight] 面内最小高度
   * @param {Array.<Object>} [options.list] 三角网对象数组，每个对象包含三角形的桑顶点（point1、point2、point3）相关量
   * @param {Number} [options.totalArea] 总面积（横截面/投影底面），执行updateVolumeByMinHeight 后赋值
   * @param {Number} [options.totalVolume] 总体积，执行updateVolumeByMinHeight后赋值
   * @param {Number} [options.digVolume] 挖方体积，执行updateVolume后赋值
   * @param {Number} [options.fillVolume] 填方体积，执行updateVolume后赋值
   */
}
export default PolyUtil
