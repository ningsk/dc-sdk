import * as Cesium from 'cesium'
import Thing from '@/dc/thing/Thing'
class TerrainClipPlan extends Thing {
	/**
	 * @param {Object} [options] 参数
	 * @param {Cesium.Cartesian3} [options.points] 挖掘面点数组
	 * @param {String} [options.bottomMaterial] 底部材质图片
	 * @param {String} [options.wallMaterial] 井部材质图片
	 * @param {Number} [options.height] 挖掘深度
	 * @param {Number} [options.lerpInterval] 每两个点之间插值个数
	 */
  constructor (options) {
    super()
		this._points = options.points || []
		this._bottomMaterial = Cesium.defaultValue(options.bottomMaterial, '')
		this._wallMaterial = Cesium.defaultValue(options.wallMaterial, '')
		this._height = Cesium.defaultValue(options.height, 0)
		this._lerpInterval = Cesium.defaultValue(options.lerpInterval, 50)
		this._excavateMinHeight = 9999 // 最低挖掘海拔值
	}
	_addedHook () {
    this._clip()
  }
  _removeHook () {
    this.destroy()
  }

  _clip () {
		if (this._positions.length < 3 || this._lerpInterval < 0) return
		this.destroy()
		// 创建裁剪面
		this._clippingTerrain(this._points)
		// 获取最低点高度
		this._getMinPointHeight(this._points)
		// 创建井底部
		this._createBottomSurface(this._points)
		// 创建井壁
		this._createShaftWall(this._points)
	}
  /**
   * 裁剪地形
   * @param {Cesium.Cartesian3[]} points
   */

  _clippingTerrain (points) {
    // 判断点的顺序是顺时针还是逆时针
    const isRight = this._judgeDirection(points)
      const clippingPlanes = []
      const length = points.length

    for (let i = 0; i < length; ++i) {
      const nextIndex = (i + 1) % length

      const up = Cesium.Cartesian3.normalize(points[i], new Cesium.Cartesian3())
      let right = !isRight
        ? Cesium.Cartesian3.subtract(points[i], points[nextIndex], new Cesium.Cartesian3())
        : Cesium.Cartesian3.subtract(points[nextIndex], points[i], new Cesium.Cartesian3())
      right = Cesium.Cartesian3.normalize(right, right)

      let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3())
      normal = Cesium.Cartesian3.normalize(normal, normal)

      clippingPlanes.push(new Cesium.ClippingPlane(normal, 0))
    }

    // 创建地形裁剪
    this._map.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
      planes: clippingPlanes,
      edgeWidth: 1,
      edgeColor: Cesium.Color.WHITE,
      enabled: true
    })
  }

  /**
   * 获取最低点的高度
   */
  _getMinPointHeight (points) {
    points.forEach(point => {
      const Cartographic = Cesium.Cartographic.fromCartesian(point)
      if (Cartographic.height < this._excavateMinHeight) {
        this._excavateMinHeight = Cartographic.height
      }
    })

    // 找出最低点的高度
    this._targetHeight = this._excavateMinHeight - this._height
  }

  /**
   * 判断点的顺序是顺时针还是逆时针
   * @param {Cesium.Cartesian3[]} points
   */
  _judgeDirection (points) {
    const lonlat1 = Cesium.Cartographic.fromCartesian(points[0])
    const lonlat2 = Cesium.Cartographic.fromCartesian(points[1])
    const lonlat3 = Cesium.Cartographic.fromCartesian(points[2])
    const x1 = lonlat1.longitude
      const y1 = lonlat1.latitude
      const x2 = lonlat2.longitude
      const y2 = lonlat2.latitude
      const x3 = lonlat3.longitude
      const y3 = lonlat3.latitude
      const dirRes = (x2 - x1) * (y3 - y2) - (y2 - y1) * (x3 - x2)

    const isR = dirRes > 0
    return isR
  }

  // 创建井壁
  _createShaftWall (points) {
    const lerpInterval = this._lerpInterval
      const len = points.length
      const lerpPositions = []

    for (let i = 0; i < len; i++) {
      const nextIndex = (i + 1) % len
      const currRad = Cesium.Cartographic.fromCartesian(points[i])
      const nextRad = Cesium.Cartographic.fromCartesian(points[nextIndex])
      const position1 = [currRad.longitude, currRad.latitude]
      const position2 = [nextRad.longitude, nextRad.latitude]

      for (let j = 0; j < lerpInterval; j++) {
        const longitude = Cesium.Math.lerp(position1[0], position2[0], j / lerpInterval)
          const latitude = Cesium.Math.lerp(position1[1], position2[1], j / lerpInterval)
        lerpPositions.push(new Cesium.Cartographic(longitude, latitude))
      }
    }

    // 增加开始点构造闭合环
    lerpPositions.push(lerpPositions[0].clone())
    this._createWellWall(lerpPositions)
  }

  /**
   * 创建墙体
   * @param {Cesium.Cartesian3[]} lerpPositions
   */
  async _createWellWall (lerpPositions) {
    const wellPositions = []
      const maximumHeights = []
      const minimumHeights = []

    // 根据采样地形高度更新坐标
    await Cesium.sampleTerrainMostDetailed(this._map.terrainProvider, lerpPositions)

    lerpPositions.forEach(lerpPosition => {
      const { longitude, latitude, height } = lerpPosition

      wellPositions.push(Cesium.Cartesian3.fromRadians(longitude, latitude, height))
      maximumHeights.push(height)
      minimumHeights.push(this._targetHeight)
    })

    const material = new Cesium.ImageMaterialProperty({
      image: this._wallMaterial,
      repeat: new Cesium.Cartesian2(5, 5)
    })

    this._wallGraphic = new Cesium.Entity({
      wall: new Cesium.WallGraphics({
        positions: wellPositions,
        maximumHeights,
        minimumHeights,
        material
      })
    })
    this._map.entities.add(this._wallGraphic)
  }

  /**
   * 创建井底
   * @param {Cesium.Cartesian3[]} points
   */
  _createBottomSurface (points) {
    const material = new Cesium.ImageMaterialProperty({
      image: this._bottomMaterial,
      repeat: new Cesium.Cartesian2(5, 5)
    })

    this._bottomSurface = new Cesium.Entity({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(points),
        height: this._targetHeight,
        material
      }
    })

    this._map.entities.add(this._bottomSurface)
  }

  /**
   * 更新挖掘深度
   * @param {Number} depth
   */
  _updateExcavateDepth (depth) {
    if (this._bottomSurface) {
      this._map.scene.primitives.remove(this._bottomSurface)
    }
    if (this._wallGraphic) {
      this._map.scene.primitives.remove(this._wallGraphic)
    }
    this._height = depth
    this._getMinPointHeight(this._points)
    // 创建井底部
    this._createBottomSurface(this._points)
    // 创建井壁
    this._createShaftWall(this._points)
  }

  /**
   * 销毁挖掘体
   */
  destroy () {
    if (this._hasChangeHighDynamicRange) {
      this._map.scene.highDynamicRange = false
      this._hasChangeHighDynamicRange = false
    }

    if (this._map.scene.globe.clippingPlanes) {
      this._map.scene.globe.clippingPlanes.enabled = false
      this._map.scene.globe.clippingPlanes.removeAll()
    }

    if (this._bottomSurface) {
      this._map.entities.remove(this._bottomSurface)
      delete this._bottomSurface
    }

    if (this._wallGraphic) {
      this._map.entities.remove(this._wallGraphic)
      delete this._wallGraphic
    }
  }

  get height () {
    return this._height
  }

  set height (value) {
    this._height = value
    this._updateExcavateDepth(value)
  }
  set points (points) {
    this._points = points
    this._clip()
  }
  get points () {
    return this._points
  }
}
export default TerrainClipPlan
