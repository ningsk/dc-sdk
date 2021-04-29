import * as Cesium from 'cesium'
import TilesetUtil from '@/dc/util/TilesetUtil'
import TerrainUtil from '@/dc/util/TerrainUtil'
import { LogUtil } from '@/dc'

const matrix3Scratch = new Cesium.Matrix3()
const matrix4Scratch = new Cesium.Matrix4()
const cartesian3 = new Cesium.Cartesian3()
const matrix4Scratch2 = new Cesium.Matrix4()
const rotationScratch = new Cesium.Matrix3()
const scratchWC = new Cesium.Cartesian3()
const scratchRay = new Cesium.Ray()
const scratchCartographic2 = new Cesium.Cartographic()
class PointUtil {
  /**
   * 对坐标（或数组坐标）增加指定的海拔高度
   * @param {Array<Cesium.Cartesian3>|Cesium.Cartesian3} positions
   * @param {Number} [addHeight=0] 增加的海拔高度
   * @return {Array<Cesium.Cartesian3>|Cesium.Cartesian3} 增加后的坐标数组
   */
  static addPositionsHeight (positions, addHeight) {
    addHeight = Number(addHeight) || 0
    if (isNaN(addHeight) || addHeight === 0) {
      return positions
    }
    if (positions instanceof Array) {
      const arr = []
      positions.forEach(item => {
        const cartesian = Cesium.Cartographic.fromCartesian(item)
        const point = Cesium.Cartesian3.fromRadians(cartesian.longitude, cartesian.latitude, cartesian.height + addHeight)
        arr.push(point)
      })
      return arr
    } else {
      const cartesian = Cesium.Cartographic.fromCartesian(positions)
      return Cesium.Cartesian3.fromRadians(cartesian.longitude, cartesian.latitude, cartesian.height + addHeight)
    }
  }

  /**
   * 设置坐标中海拔高度为指定的高度值
   * @param {Array<Cesium.Cartesian3>|Cesium.Cartesian3} positions
   * @param {Number} [height=0] 指定的海拔高度
   * @return {Array<Cesium.Cartesian3>|Cesium.Cartesian3} 指定高度后后的坐标数组
   */
  static setPositionsHeight (positions, height) {
    height = Number(height) || 0
    if (isNaN(height) || height === 0) {
      return positions
    }
    if (positions instanceof Array) {
      const arr = []
      positions.forEach(item => {
        const cartesian = Cesium.Cartographic.fromCartesian(item)
        const point = Cesium.Cartesian3.fromRadians(cartesian.longitude, cartesian.latitude, height)
        arr.push(point)
      })
      return arr
    } else {
      const cartesian = Cesium.Cartographic.fromCartesian(positions)
      return Cesium.Cartesian3.fromRadians(cartesian.longitude, cartesian.latitude, height)
    }
  }
  /**
   * 获取鼠标当前的屏幕坐标位置的三维Cesium坐标
   * @param {Cesium.Scene} scene
   * @param {Cesium.Cartesian2} position 二维屏幕坐标位置
   * @param {Cesium.Entity} noPickEntity 排除的对象（主要用于绘制中，排除对自身的拾取）
   */
  static getCurrentMousePosition (scene, position, noPickEntity) {
    let cartesian
    // 在模型上提取坐标
    let pickedObject

    try {
      pickedObject = scene.pick(position, 5, 5)
    } catch (e) {
      LogUtil.logWarn('scene pick 拾取位置时异常')
    }

    if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
      // pickPositionSupported:判断是否支持深度拾取，不支持时无法进行鼠标交互
      const pcEntity = this.hasPickedModel()
      if (pcEntity) {
        if (pcEntity.show) {
          pcEntity.show = false // 先隐藏被排除的noPickEntity对象
          cartesian = this.getCurrentMousePosition(scene, position, noPickEntity)
          pcEntity.show = true // 还原被排除的noPickEntity对象
          if (cartesian) {
            return cartesian
          } else {
            return LogUtil.logInfo('拾取到被排除的noPickEntity模型')
          }
        }
      } else {
        cartesian = scene.pickPosition(position)
        if (Cesium.defined(cartesian)) {
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
          if (cartographic.height >= 0) return cartesian

          // 不是entity时候，支持3dtiles地下
          if (!Cesium.defined(pickedObject.id) && cartographic.height >= -500) return cartesian
          LogUtil.logError('scene.pickPosition 拾取模型时 高度值异常' + cartographic.height)
        } else {
          LogUtil.logInfo('scene.pickPosition 拾取模型 返回为空')
        }
      }
    } else {
      LogUtil.logInfo('scene.pickPosition 拾取模型 返回为空')
    }
    // OnlyPickModelPosition时ViewerEx定义的对外属性
    if (scene.onlyPickModelPosition) return cartesian // 只拾取模型的时候，不继续读取了
    // 测试scene.pickPosition和globe.pick的适用场景 https://zhuanlan.zhihu.com/p/44767866
    // 1. globe.pick的结果相对稳定准确，不论地形深度检测开启与否，不论加载的是默认地形还是别的地形数据；
    // 2. scene.pickPosition只有在开启地形深度检测，且不使用默认地形时是准确的。
    // 注意点： 1. globe.pick只能求交地形； 2. scene.pickPosition不仅可以求交地形，还可以求交除地形以外其他所有写深度的物体。
    if (scene.mode === Cesium.SceneMode.SCENE3D) {
      // 三维模式下
      const pickRay = scene.camera.getPickRay(position)
      cartesian = scene.globe.pick(pickRay, scene)
    } else {
      // 二维模式下
      cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid)
    }

    if (Cesium.defined(cartesian) && scene.camera.positionCartographic.height < 10000) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      if (cartographic.height < -5000) return null // 屏蔽无效值
    }

    return cartesian
  }
  /**
   *
   * @private
   * @param {*} pickedObject
   * @param {*} noPickEntity
   */
  hasPickedModel (pickedObject, noPickEntity) {
    if (Cesium.defined(pickedObject.id)) {
      // entity
      const entity = pickedObject.id
      if (entity._noMousePosition) return entity // 排除标识不拾取的对象
      if (noPickEntity && entity === noPickEntity) return entity
    }
    if (Cesium.defined(pickedObject.primitive)) {
      // primitive
      const primitive = pickedObject.primitive
      if (primitive._noMousePosition) return primitive // 排除标识不拾取的对象
      if (noPickEntity && primitive === noPickEntity) return primitive
    }
    return null
  }
  /**
   * 根据matrix转换矩阵求HeadingPitchRollByMatrix
   * @param {Cesium.Matrix4} matrix 转换矩阵
   * @param {Cesium.Ellipsoid} ellipsoid 变换中使用固定坐标系的椭球
   * @param {Cesium.Transforms.LocalFrameToFixedFrame} [fixedFrameTransform=Cesium.Transforms
   .eastNorthUpToFixedFrame]  参考系
   * @returns {Cesium.HeadingPitchRoll} result 可以先实例化返回的Heading Pitch Roll角度对象
   */
  static getHeadingPitchRollByMatrix (matrix, ellipsoid = Cesium.Ellipsoid.WGS84, fixedFrameTransform = Cesium.Transforms
    .eastNorthUpToFixedFrame) {
    return Cesium.Transforms.fixedFrameToHeadingPitchRoll(matrix, ellipsoid, fixedFrameTransform)
  }
  /**
   * 根据position位置和orientation四元叔实例求 HeadingPitchRoll方向
   * @param {Cesium.Cartesian3} position 位置坐标
   * @param {Cesium.Quaternion} orientation 四元数实例
   * @param {*} ellipsoid
   * @param {Cesium.Transforms.LocalFrameToFixedFrame} [fixedFrameTransform=Cesium.Transforms
   .eastNorthUpToFixedFrame]  参考系
   * @returns {Cesium.HeadingPitchRoll} result 可以先实例化返回的Heading Pitch Roll角度对象
   */
  static getHeadingPitchRollByOrientation (position, orientation, ellipsoid = Cesium.Ellipsoid.WGS84,
                                          fixedFrameTransform = Cesium.Transforms.eastNorthUpToFixedFrame) {
    const matrix = Cesium.Matrix4.fromRotationTranslation(
      Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
      position,
      matrix4Scratch
    )
    return this.getHeadingPitchRollByMatrix(position, matrix)
  }

  /**
   * 求localStart点到localEnd点的方向
   * @param {Cesium.Cartesian3} localStart 起点坐标
   * @param {Cesium.Cartesian3} localEnd 终点坐标
   * @param {Cesium.Ellipsoid} [ellipsoid=Cesium.Ellipsoid] 变换中使用固定坐标系的椭球
   * @param {Cesium.Transforms.LocalFrameToFixedFrame} [fixedFrameTransform=Cesium.Transforms
   .eastNorthUpToFixedFrame]  参考系
   * @returns {Cesium.HeadingPitchRoll} result 可以先实例化返回的Heading Pitch Roll角度对象
   */
  static getHeadingPitchRollForLine (localStart, localEnd, ellipsoid, fixedFrameTransform = Cesium.Transforms
    .eastNorthUpToFixedFrame) {
    ellipsoid = ellipsoid || Cesium.Ellipsoid.WGS84
    const velocity = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(localEnd, localStart, cartesian3),
      cartesian3)
    Cesium.Transforms.rotationMatrixFromPositionVelocity(localStart, velocity, ellipsoid, rotationScratch)
    const modelMatrix = Cesium.Matrix4.fromRotationTranslation(rotationScratch, localStart, matrix4Scratch2)
    Cesium.Matrix4.multiplyTransformation(modelMatrix, Cesium.Axis.Z_UP_TO_X_UP, modelMatrix)
    return this.getHeadingPitchRollByMatrix(modelMatrix, ellipsoid, fixedFrameTransform)
  }
  /**
   * 获取坐标数组中 最高高程值
   * @param {Array<Cesium.Cartesian3>} positions 笛卡尔坐标数组
   * @param {Number} [defaultValue=0] 默认高程值
   */
  static getMaxHeight (positions, defaultValue = 0) {
    let maxHeight = defaultValue
    if (positions == null || positions.length === 0) return maxHeight
    for (let i = 0; i < positions.length; i++) {
      const cartography = Cesium.Cartographic.fromCartesian(positions[i])
      if (cartography.height > maxHeight) {
        maxHeight = cartography.height
      }
    }
    return this.formatNum(maxHeight, 2)
  }
  /**
   * 获取坐标数组中 最低高程值
   * @param {Array<Cesium.Cartesian3>} positions 笛卡尔坐标数组
   * @param {Number} [defaultValue=0] 默认高程值
   */
  static getMinHeight (positions, defaultValue = 0) {
    let minHeight = defaultValue
    if (positions == null || positions.length === 0) return minHeight
    for (let i = 0; i < positions.length; i++) {
      const cartography = Cesium.Cartographic.fromCartesian(positions[i])
      if (cartography.height < minHeight) {
        minHeight = cartography.height
      }
    }
    return this.formatNum(minHeight, 2)
  }

  /**
   * 求p1指向p2方向线上，距离p1指定len长度的新的点 ，addBS：true时为距离p2
   * @param {Cesium.Cartesian3} p1 起点坐标
   * @param {Cesium.Cartesian3} p2 终点坐标
   * @param  {Number} len 指定的距离 addBase为false的时候：len
   * @param {Boolean} addBS
   * @return {Cartesian3}
   */
  static getOnLinePointByLen (p1, p2, len, addBS) {
    const mtx4 = Cesium.Transforms.eastNorthUpToFixedFrame(p1)
    const mtx4Inverse = Cesium.Matrix4.inverse(mtx4, new Cesium.Matrix4())
    p1 = Cesium.Matrix4.multiplyByPoint(mtx4Inverse, p1, new Cesium.Cartesian3())
    p2 = Cesium.Matrix4.multiplyByPoint(mtx4Inverse, p2, new Cesium.Cartesian3())
    const subtract = Cesium.Cartesian3.subtract(p2, p1, new Cesium.Cartesian3())

    const dis = Cesium.Cartesian3.distance(p1, p2)
    let scale = len / dis // 求比例
    if (addBS) scale += 1
    let newP = Cesium.Cartesian3.multiplyByScalar(subtract, scale, new Cesium.Cartesian3())
    newP = Cesium.Matrix4.multiplyByPoint(mtx4, newP, new Cesium.Cartesian3())
    return newP
  }
  /**
   * 根据距离方向 和 观察点 计算 目标点
   * @param {Cesium.Cartesian3} position 观察点坐标
   * @param {Number} angle 方向(正北方向为0)
   * @param {Number} radius 半径距离
   */
  static getPositionByDirectionAndLen (position, angle, radius) {
    const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position)
    // 旋转
    const mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(angle || 0))
    const rotationZ = Cesium.Matrix4.fromRotationTranslation(mz)
    Cesium.Matrix4.multiply(matrix, rotationZ, matrix)
    return Cesium.Matrix4.multiplyByPoint(matrix, new Cesium.Cartesian3(0, radius, 0), new Cesium.Cartesian3())
  }
  /**
   * 求某位置指定方向和距离的点
   * @param {Cesium.Cartesian3} position 观察点
   * @param {Cesium.HeadingPitchRoll} hpr 方向
   * @param {Number} radiusZ 可视距离
   */
  static getPositionByHprAndLen (position, hpr, radiusZ) {
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr)
    const matrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
      position, matrix4Scratch)
    return Cesium.Matrix4.multiplyByPoint(matrix, new Cesium.Cartesian3(0, 0, -radiusZ), new Cesium.Cartesian3())
  }

  /**
   * 求观察点坐标和orientation方向，求观察点射向地球和地球的交点
   * @param {Cesium.Cartesian3} position 观察点坐标
   * @param {Cesium.HeadingPitchRoll|Cesium.Quaternion} orientation HeadingPitchRoll方向或四元数实例
   * @param {Boolean} reverse 是否翻转射线方向
   * @param {Cesium.Ellipsoid} [ellipsoid=Cesium.Ellipsoid.WGS84] 变换中使用固定坐标系的椭球
   * @return {Cesium.Cartesian3} 射线和地球的交点
   */
  static getRayEarthPosition (position, orientation, reverse, ellipsoid) {
    if (orientation instanceof Cesium.HeadingPitchRoll) {
      orientation = Cesium.Transforms.headingPitchRollQuaternion(position, orientation)
    }
    const matrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
      position, matrix4Scratch)
    return this.getRayEarthPositionByMatrix(matrix, reverse, ellipsoid)
  }

  /**
   * 按转换矩阵，求观察点射向地球和地球的交点
   * @param {Cesium.Matrix4}  matrix 转换矩阵
   * @param  {Boolean}  reverse 是否翻转射线方向
   * @param {Cesium.Ellipsoid} [ellipsoid=Cesium.Ellipsoid.WGS84] 变换中使用固定坐标系的椭球
   * @return {Cesium.Cartesian3} 射线和地球的交点
   */
  static getRayEarthPositionByMatrix (matrix, reverse, ellipsoid) {
    Cesium.Matrix4.multiplyByPoint(matrix, Cesium.Cartesian3.ZERO, scratchWC)
    scratchWC.clone(scratchRay.origin)
    const bottomCenter = new Cesium.Cartesian3(0, 0, reverse ? -100 : 100)
    return this.extend2Earth(bottomCenter, matrix, scratchRay, ellipsoid)
  }

  /**
   * 求地球交点
   * @param positionLC
   * @param matrix
   * @param ray
   * @param ellipsoid
   * @return {null}
   */
  static extend2Earth (positionLC, matrix, ray, ellipsoid = Cesium.Ellipsoid.WGS84) {
    Cesium.Matrix4.multiplyByPoint(matrix, positionLC, scratchWC)
    // 取延长线与地球相交的点
    Cesium.Cartesian3.subtract(scratchWC, ray.origin, ray.direction)
    Cesium.Cartesian3.normalize(ray.direction, ray.direction)
    // Get the first intersection point of a ray and an ellipsoid.
    const intersection = Cesium.IntersectionTests.rayEllipsoid(ray, ellipsoid)
    let point = null
    if (intersection) {
      point = Cesium.Ray.getPoint(ray, intersection.start)
    }
    if (point) {
      try {
        Cesium.Cartographic.fromCartesian(point, null, scratchCartographic2)
      } catch (e) {
        return null
      }
    }
    return point
  }
  /**
   * 获得点point1绕点center的地面法向量顺时针旋转angle角度后的新坐标
   * @param {Cesium.Cartesian3}  center 中心点坐标
   * @param {Cesium.Cartesian3}  point1 点坐标
   * @param {Number} angle 旋转角度，顺时针方向0-360°
   * @return {Cesium.Cartesian3} 计算得到的新坐标
   */
  static getRotateCenterPoint (center, point1, angle) {
    // 计算center的地面法向量
    const chicB = Cesium.Cartographic.fromCartesian(center)
    chicB.height = 0
    const dB = Cesium.Cartographic.toCartesian(chicB)
    const normaB = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(dB, center, new Cesium.Cartesian3()), new Cesium
      .Cartesian3())
    // 构造基于center的法向量旋转90度的矩阵
    const Q = Cesium.Quaternion.fromAxisAngle(normaB, Cesium.Math.toRadians(angle))
    const m3 = Cesium.Matrix3.fromQuaternion(Q)
    const m4 = Cesium.Matrix4.fromRotationTranslation(m3)
    // 计算point1点相对center点的坐标A1
    const A1 = Cesium.Cartesian3.subtract(point1, center, new Cesium.Cartesian3())
    // 对A1应用旋转矩阵
    const p = Cesium.Matrix4.multiplyByPoint(m4, A1, new Cesium.Cartesian3())
    // 新点的坐标
    return Cesium.Cartesian3.add(p, center, new Cesium.Cartesian3())
  }

  /**
   * 获取坐标贴贴地（或贴模型）高度
   * @param {Cesium.Scene} scene 三维地图场景对象，一般用map.scene 或viewer.scene
   * @param {Cesium.Cartesian3} position 坐标
   * @param {Object} [options] 参数对象：
   * @param {Boolean} [options.asyn] 是否进行异步精确计算
   * @param {Boolean} [options.has3dtitles='auto'] 事故覅有在3dtiles模型上分析（模型分析较慢，按需开启）,默认内部根据点的位置自动判断（但可能不准）
   * @param {getSurfaceHeight_callback} [options.callback] 异步计算高度完成后回调方法
   * @param {Array<Object>} [options.objectsToExclude] 排除的不进行贴模型结算的模型对象可以是：primitives，entities或3D Tiles features
   * @return {Number|void} 仅仅在async:false时候返回高度值
   */
  static getSurfaceHeight (scene, position, options) {
    if (!position) return
    options = options || {}
    // 是否在3dtiles上面
    const _has3dTiles = Cesium.defaultValue(options.has3dtitles, Cesium.defined(TilesetUtil.pick3DTileset(scene, position)))
    if (_has3dTiles) {
      // 求贴模型的高度
      return this.getSurface3DTilesetHeight(scene, position, options)
    } else {
      // 求贴地形高度
      return this.getSurfaceTerrainHeight(scene, position, options)
    }
  }

  /**
   * 获取坐标贴模型高度
   * @param {Cesium.Scene} scene 三维地图场景对象，一般用map.scene 或viewer.scene
   * @param {Cesium.Cartesian3} position 坐标
   * @param {Object} [options] 参数对象：
   * @param {Boolean} [options.asyn] 是否进行异步精确计算
   * @param {Boolean} [options.has3dtitles='auto'] 事故覅有在3dtiles模型上分析（模型分析较慢，按需开启）,默认内部根据点的位置自动判断（但可能不准）
   * @param {getSurfaceHeight_callback} [options.callback] 异步计算高度完成后回调方法
   * @param {Array<Object>} [options.objectsToExclude] 排除的不进行贴模型结算的模型对象可以是：primitives，entities或3D Tiles features
   * @return {Number|void} 仅仅在async:false时候返回高度值
   */
  static getSurface3DTilesetHeight (scene, position, options) {
    options = options || {}
    // 原始的Cartographic坐标
    const cartographic = Cesium.Cartographic.fromCartesian(position)
    // 是否异步求精准高度
    if (options.asyn) {
      scene.clampToHeightMostDetailed([position], options.objectsToExclude, 0.2).then(clampedPositions => {
        const clampedPt = clampedPositions[0]
        if (Cesium.defined(clampedPt)) {
          const cartographicTiles = Cesium.Cartographic.fromCartesian(clampedPt)
          const heightTiles = cartographicTiles.height
          if (Cesium.defined(heightTiles) && heightTiles > -1000) {
            options.callback && options.callback(heightTiles, cartographicTiles)
            return
          }
        }
        // 说明没在模型上，继续求地形上的高度
        this.getSurfaceTerrainHeight(scene, position, options)
      })
    } else {
      // 求贴模型的高度
      const heightTiles = scene.sampleHeight(cartographic, options.objectsToExclude, 0.2)
      if (Cesium.defined(heightTiles) && heightTiles > -1000) {
        options.callback && options.callback(heightTiles, cartographic)
      }
    }
    return 0 // 求值失败
  }
  /**
   * 获取坐标贴地形高度
   * @param {Cesium.Scene} scene 三维地图场景对象，一般用map.scene 或viewer.scene
   * @param {Cesium.Cartesian3} position 坐标
   * @param {Object} [options] 参数对象：
   * @param {Boolean} [options.asyn] 是否进行异步精确计算
   * @param {Boolean} [options.has3dtitles='auto'] 事故覅有在3dtiles模型上分析（模型分析较慢，按需开启）,默认内部根据点的位置自动判断（但可能不准）
   * @param {getSurfaceHeight_callback} [options.callback] 异步计算高度完成后回调方法
   * @param {Array<Object>} [options.objectsToExclude] 排除的不进行贴模型结算的模型对象可以是：primitives，entities或3D Tiles features
   * @return {Number|void} 仅仅在async:false时候返回高度值
   */
  static getSurfaceTerrainHeight (scene, position, options) {
    options = options || {}
    // 原始的Cartographic坐标
    const cartographic = Cesium.Cartographic.fromCartesian(position)
    const hasTerrain = TerrainUtil.hasTerrain(scene)
    // 如果不存在地形
    if (!hasTerrain) {
      // 直接返回
      options.callback && options.callback(cartographic.height, cartographic)
      return cartographic.height
    }
    // 是否异步求精准高度
    if (options.asyn) {
      Cesium.when(Cesium.sampleTerrainMostDetailed(scene.terrainProvider), [cartographic], (samples) => {
        const clampedCartographic = samples[0]
        let heightTerrain
        if (Cesium.defined(clampedCartographic) && Cesium.defined(clampedCartographic.height)) {
          heightTerrain = clampedCartographic.height
        } else {
          heightTerrain = scene.globe.getHeight(cartographic)
        }
        options.callback && options.callback(heightTerrain, cartographic)
      })
    } else {
      const heightTerrain = scene.globe.getHeight(cartographic)
      if (Cesium.defined(heightTerrain) && heightTerrain > -1000) {
        options.callback && options.callback(heightTerrain, cartographic)
        return heightTerrain
      }
    }
    return 0 // 表示取值失败
  }
  formatNum (num, digits) {
    return Number(num.toFixed(digits || 0))
  }

  /**
   * 异步计算贴地（或贴模型）高度完成后的回调方法
   * @callback getSurfaceHeight_callback
   * @param {Number|Null} newHeight 计算完成的贴地（或贴模型的高度值）
   * @param {Cesium.Cartographic} 原始点坐标对应的Cartographic经纬度值（弧度制）
   */
}
export default PointUtil
