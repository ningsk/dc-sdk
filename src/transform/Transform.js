import * as Cesium from 'cesium'
import Position from '@/dc/position/Position'

const WMP = new Cesium.WebMercatorProjection()

class Transform {
  formatNum (num, digits) {
    return Number(num.toFixed(digits || 0))
  }
  /**
   * Transforms Cartesian To WGS84
   * @param cartesian
   * @returns {Position}
   */
  static transformCartesianToWGS84 (cartesian) {
    if (cartesian) {
      const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        cartesian
      )
      return new Position(
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude),
        cartographic.height
      )
    }
    return new Position(0, 0)
  }

  /**
   * 笛卡尔坐标空间坐标转经纬度坐标【用于转geojson】
   * @param cartesian
   * @return {null|number[]}
   */
  static transformCartesianToLonLat (cartesian) {
    if (cartesian) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      if (!cartographic) { return null }
      const x = this.formatNum(Cesium.Math.toDegrees(cartographic.longitude), 6)
      const y = this.formatNum(Cesium.Math.toDegrees(cartographic.latitude), 6)
      const z = this.formatNum(cartographic.height, 2)
      return [x, y, z]
    }
    return null
  }

  /**
   * 数组 Cesium笛卡尔空间坐标 转经纬度坐标数组
   * @param positions
   * @return {[]}
   */
  static transformCartesianToLonLats (positions) {
    const coordinates = []
    for (let i = 0, len = positions.length; i < len; i++) {
      const point = this.transformCartesianToLonLat(positions[i])
      if (point) {
        coordinates.push(point)
      }
    }
    return coordinates
  }
  /**
   * Transforms WGS84 To Cartesian
   * @param position
   * @returns {Cartesian3}
   */
  static transformWGS84ToCartesian (position) {
    return position
      ? Cesium.Cartesian3.fromDegrees(
          position.lng,
          position.lat,
          position.alt,
          Cesium.Ellipsoid.WGS84
        )
      : Cesium.Cartesian3.ZERO
  }

  /**
   * Transforms WGS84 To Cartographic
   * @param position
   * @returns {Cartographic}
   */
  static transformWGS84ToCartographic (position) {
    return position
      ? Cesium.Cartographic.fromDegrees(
          position.lng,
          position.lat,
          position.alt
        )
      : Cesium.Cartographic.ZERO
  }

  /**
   * Transforms Cartesian Array To WGS84 Array
   * @param cartesianArr
   * @returns {*|*[]}
   */
  static transformCartesianArrayToWGS84Array (cartesianArr) {
    return cartesianArr
      ? cartesianArr.map(item => this.transformCartesianToWGS84(item))
      : []
  }

  /**
   * Transforms WGS84 Array To Cartesian Array
   * @param WGS84Arr
   * @returns {*|*[]}
   */
  static transformWGS84ArrayToCartesianArray (WGS84Arr) {
    return WGS84Arr
      ? WGS84Arr.map(item => this.transformWGS84ToCartesian(item))
      : []
  }

  /**
   * Transforms WGS84 To Mercator
   * @param position
   * @returns {Position}
   */
  static transformWGS84ToMercator (position) {
    const mp = WMP.project(
      Cesium.Cartographic.fromDegrees(position.lng, position.lat, position.alt)
    )
    return new Position(mp.x, mp.y, mp.z)
  }

  /**
   * Transforms Mercator To WGS84
   * @param position
   * @returns {Position}
   */
  static transformMercatorToWGS84 (position) {
    const mp = WMP.unproject(
      new Cesium.Cartesian3(position.lng, position.lat, position.alt)
    )
    return new Position(
      Cesium.Math.toDegrees(mp.longitude),
      Cesium.Math.toDegrees(mp.latitude),
      mp.height
    )
  }

  /**
   * Transforms Window To WGS84
   * @param position
   * @param viewer
   * @returns {Position}
   */
  static transformWindowToWGS84 (position, viewer) {
    const scene = viewer.scene
    let cartesian
    if (scene.mode === Cesium.SceneMode.SCENE3D) {
      const ray = scene.camera.getPickRay(position)
      cartesian = scene.globe.pick(ray, scene)
    } else {
      cartesian = scene.camera.pickEllipsoid(position, Cesium.Ellipsoid.WGS84)
    }
    return this.transformCartesianToWGS84(cartesian)
  }
  /**
   * Transforms WGS84 To Window
   * @param position
   * @param viewer
   * @returns {Cartesian2}
   */
  static transformWGS84ToWindow (position, viewer) {
    const scene = viewer.scene
    return Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      scene,
      this.transformWGS84ToCartesian(position)
    )
  }
}

export default Transform
