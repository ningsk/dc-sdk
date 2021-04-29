import * as Cesium from 'cesium'
import { LogUtil } from '@/dc'
/**
 * @description 3dtiles相关计算常用方法
 */
class TilesetUtil {
  /**
   * 获取
   * @param {Cesium.Cesium3DTileset} tileset
   * @param transform
   */
  static getCenter (tileset, transform) {
    let result = {}
    // 记录模型原始的中心点
    const boundingSphere = tileset.boundingSphere
    const position = boundingSphere.center
    const cartographic = Cesium.Cartographic.fromCartesian(position)
    const height = Number(cartographic.height.toFixed(2))
    const longitude = Number(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6))
    const latitude = Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6))
    result = {
      x: longitude,
      y: latitude,
      z: height
    }
    LogUtil.logInfo('模型内部原始位置' + JSON.stringify(result))
    // 如果tileset自带世界矩阵，那么计算放置的经纬度和heading
    if (transform) {
      const matrix = Cesium.Matrix4.fromArray(tileset._root.transform)
      const pos = Cesium.Matrix4.getTranslation(matrix, new Cesium.Cartesian3())
      const wPos = Cesium.Cartographic.fromCartesian(pos)
      if (Cesium.defined(wPos)) {
        result.x = Number(Cesium.Math.toDegrees(wPos.longitude).toFixed(6))
        result.y = Number(Cesium.Math.toDegrees(wPos.latitude).toFixed(6))
        result.z = Number(wPos.height.toFixed(2))

        // 取旋转矩阵
        const rotateMatrix = Cesium.Matrix4.getMatrix3(matrix, new Cesium.Matrix3())
        // 默认的旋转矩阵
        const defaultMatrix = Cesium.Matrix4.getMatrix3(Cesium.Transforms.eastNorthUpToFixedFrame(pos), new Cesium.Matrix3())
        // 计算rotateMatrix 的x轴，在defaultMatrix上 旋转
        const xAxis = Cesium.Matrix3.getColumn(defaultMatrix, 0, new Cesium.Cartesian3())
        const yAxis = Cesium.Matrix3.getColumn(defaultMatrix, 1, new Cesium.Cartesian3())
        const zAxis = Cesium.Matrix3.getColumn(defaultMatrix, 2, new Cesium.Cartesian3())

        let dir = Cesium.Matrix3.getColumn(rotateMatrix, 0, new Cesium.Cartesian3())

        dir = Cesium.Cartesian3.cross(dir, zAxis, dir)
        dir = Cesium.Cartesian3.cross(zAxis, dir, dir)
        dir = Cesium.Cartesian3.normalize(dir, dir)

        let heading = Cesium.Cartesian3.angleBetween(xAxis, dir)

        const ay = Cesium.Cartesian3.angleBetween(yAxis, dir)

        if (ay > Math.PI * 0.5) {
          heading = 2 * Math.PI - heading
        }
        result.rotation_x = 0
        result.rotation_y = 0
        result.rotation_z = Number(Cesium.Math.toDegrees(heading).toFixed(1))

        result.heading = result.rotation_z // 兼容v1老版本
        LogUtil.logInfo('模型内部世界矩阵:' + JSON.stringify(result))
      }
    }

    return result
  }

  /**
   * 获取坐标点处的3dtiles模型，用于计算贴地时进行判断（和视角有关系，不一定精确）
   * @param {Cesium.Scene} scene 三维地图场景对象，一般用map.scene 或viewer.scene
   * @param {Cesium.Cartesian3|Array<Cesium.Cartesian>} positions 坐标或坐标数组
   * @return {null|Cesium.Cesium3DTileset} 3dtiles模型
   */
  static pick3DTileset (scene, positions) {
    if (!positions) return null
    if (positions instanceof Cesium.Cartesian3) positions = [positions]
    for (let i = 0, len = positions.length; i < len; ++i) {
      const position = positions[i]
      const coordinates = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position)
      if (!Cesium.defined(coordinates)) continue
      const pickedObject = scene.pick(coordinates, 10, 10)
      if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.primitive) && pickedObject.primitive instanceof Cesium.Cesium3DTileset) {
        return pickedObject.primitive
      }
    }
    return null
  }
}
export default TilesetUtil
