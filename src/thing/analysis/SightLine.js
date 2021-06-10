/**
 * @description 通视分析
 */
import Thing from '@/dc/thing/Thing'
import * as Cesium from 'cesium'
import { PointUtil } from '@/dc/util'
import { ThingEventType } from '@/dc'

class SightLine extends Thing {
  /**
   * @param {Object} [options] 参数对象，包括如下
   * @param {String|Number} [options.id=uuid()] 对象id的标识
   * @param {Boolean} [options.enabled=true] 对象的启用状态
   * @param {Cesium.Color} [options.visibleColor=new Cesium.Color(0,1,0,1)] 可视区域颜色
   * @param {Cesium.Color} [options.hiddenColor=new Cesium.Color(1,0,0,1)] 不可视区域颜色
   * @param {Cesium.Color} [options.depthFailColor] 当线位于地形或被遮挡时的区域颜色
   */
  constructor (options) {
    super()
    this._visibleColor = Cesium.defaultValue(options.visibleColor, new Cesium.Color(0, 1, 0, 1))
    this._hiddenColor = Cesium.defaultValue(options.hiddenColor, new Cesium.Color(1, 0, 0, 1))
    this._depthFailColor = Cesium.defaultValue(options.depthFailColor, null)
    this._lines = []
  }
  set visibleColor (visibleColor) {
    this._visibleColor = visibleColor
  }
  get visibleColor () {
    return this._visibleColor
  }
  set hiddenColor (hiddenColor) {
    this._hiddenColor = hiddenColor
  }
  get hiddenColor () {
    return this._hiddenColor
  }
  set depthFailColor (depthFailColor) {
    this._depthFailColor = depthFailColor
  }
  get depthFailColor () {
    return this._depthFailColor
  }
  /**
   * 添加通视分析
   * @param {Cesium.Cartesian3} origin 起点（视点位置）
   * @param {Cesium.Cartesian3} target 终点（目标点位置）
   * @param {Object} [options] 参数如下
   * @param {Number} [options.offsetHeight=0] 在起点增加的高度值，比如加上人的身高
   */
  add (origin, target, options) {
    const offsetHeight = Cesium.defaultValue(options.offsetHeight, 0)
    if (offsetHeight !== 0) {
      origin = PointUtil.addPositionsHeight(origin, offsetHeight)
    }
    const currDir = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(target, origin, new Cesium.Cartesian3()),
      new Cesium.Cartesian3())
    const currRay = new Cesium.Ray(origin, currDir)
    const pickRes = this._map.scene.drillPickFromRay(currRay, 2, this._lines)
    if (Cesium.defined(pickRes) && pickRes.length > 0 && Cesium.defined(pickRes[0]) && Cesium.defined(pickRes[0].position)) {
      const position = pickRes[0].position
      const distance = Cesium.Cartesian3.distance(origin, target)
      const distanceFx = Cesium.Cartesian3.distance(origin, position)
      if (distanceFx < distance) {
        // 存在正常分析结果
        const arrEntity = this._showPolyline(origin, target, position)
        const result = {
          block: true, // 存在遮挡
          position: position,
          entity: arrEntity
        }
        this.fire(ThingEventType.END, result)
        return result
      }
    }
    const arrEntity = this._showPolyline(origin, target)
    const result = {
      block: false,
      entity: arrEntity
    }
    this.fire(ThingEventType.END, result)
    return result
  }
  _showPolyline (origin, target, position) {
    if (position) {
      // 存在正常分析结果
      const originToPositionEntity = this._map.entities.add({
        polyline: {
          positions: [origin, position],
          width: 2,
          material: this._visibleColor,
          depthFailMaterial: this._depthFailColor
        }
      })
      this._lines.push(originToPositionEntity)

      const positionToTargetEntity = this._map.entities.add({
        polyline: {
          positions: [position, target],
          width: 2,
          material: this._hiddenColor,
          depthFailMaterial: this._depthFailColor
        }
      })
      this.lines.push(positionToTargetEntity)
      return [originToPositionEntity, positionToTargetEntity]
    } else {
      // 无正确分析结果时，直接返回
      const originToTargetEntity = this._map.entities.add({
        polyline: {
          positions: [origin, target],
          width: 2,
          material: this._visibleColor,
          depthFailMaterial: this._depthFailColor
        }
      })
      this._lines.push(originToTargetEntity)
      return [originToTargetEntity]
    }
  }
  /**
   * 清除分析
   */
  clear () {
    for (let i = 0, len = this._lines.length; i < len; i++) {
      this._map.entities.remove(this._lines[i])
    }
    this._lines = []
  }
}
export default SightLine
