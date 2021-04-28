import LogUtil from './LogUtil'
import * as Cesium from "cesium"
const matrix3Scratch = new Cesium.Matrix3(); //一些涉及矩阵计算的方法
const matrix4Scratch = new Cesium.Matrix4();
const cartesian3 = new Cesium.Cartesian3();
const rotationScratch = new Cesium.Matrix3();
var scratchWC = new Cesium.Cartesian3();
var scratchRay = new Cesium.Ray();
var scratchCartographic2 = new Cesium.Cartographic();
class PointUtil {
  static addPositionsHeight(positions = [], addHeight) {
    addHeight = Number(addHeight) || 0
    if (isNaN(addHeight) || addHeight == 0) {
      return positions
    }
    let arr = []
    positions.forEach(item => {
      let car = Cesium.Cartographic.fromCartesian(item)
      let point = Cesium.Cartesian3.fromRadians(car.longitude, car.latitude, car.height + addHeight)
      arr.push(point)
    })

    return arr
  }

  /**
   * 获取鼠标当前的屏幕坐标位置的三维Cesium坐标
   * @param {Cesium.Scene} scene
   * @param {Cesium.Cartesian2} position 二维屏幕坐标位置
   * @param {Cesium.Entity} noPickEntity 排除的对象（主要用于绘制中，排除对自身的拾取）
   */
  static getCurrentMousePosition(scene, position, noPickEntity) {
    let cartesian
    // 在模型上提取坐标
    let pickedObject

    try {
      pickedObject = scene.pick(position, 5, 5)
    } catch (e) {
      Log.logError("scene pick 拾取位置时异常")
      Log.logError(e)
    }

    if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
      // pickPositionSupported:判断是否支持深度拾取，不支持时无法进行鼠标交互
      let pcEntity = this.hasPickedModel()
      if (pcEntity) {
        if (pcEntity.show) {
          pcEntity.show = false // 先隐藏被排除的noPickEntity对象
          cartesian = this.getCurrentMousePosition(scene, position, noPickEntity)
          pcEntity.show = true // 还原被排除的noPickEntity对象
          if (cartesian) {
            return cartesian
          } else {
            return Log.logInfo("拾取到被排除的noPickEntity模型")
          }
        }
      } else {
        cartesian = scene.pickPosition(position)
        if (Cesium.defined(cartesian)) {
          let cartographic = Cesium.Cartographic.fromCartesian(cartesian)
          if (cartographic.height >= 0) return cartesian

          // 不是entity时候，支持3dtiles地下
          if (!Cesium.defined(pickedObject.id) && cartographic.height >= -500) return cartesian
          Log.logError("scene.pickPosition 拾取模型时 高度值异常" + cartographic.height)
        } else {
          Log.logInfo("scene.pickPosition 拾取模型 返回为空")
        }
      }
    } else {
      Log.logInfo("scene.pickPosition 拾取模型 返回为空")
    }

    // 超图s3m数据拾取
    if (Cesium.defined(Cesium.S3MTilesLayer)) {
      cartesian = scene.pickPosition(position)
      if (Cesium.defined(cartesian)) {
        return cartesian
      }
    }

    // OnlyPickModelPosition时ViewerEx定义的对外属性
    if (scene.onlyPickModelPosition) return cartesian // 只拾取模型的时候，不继续读取了

    //测试scene.pickPosition和globe.pick的适用场景 https://zhuanlan.zhihu.com/p/44767866
    //1. globe.pick的结果相对稳定准确，不论地形深度检测开启与否，不论加载的是默认地形还是别的地形数据；
    //2. scene.pickPosition只有在开启地形深度检测，且不使用默认地形时是准确的。
    //注意点： 1. globe.pick只能求交地形； 2. scene.pickPosition不仅可以求交地形，还可以求交除地形以外其他所有写深度的物体。
    if (scene.mode === Cesium.SceneMode.SCENE3D) {
      // 三维模式下
      let pickRay = scene.camera.getPickRay(position)
      cartesian = scene.globe.pick(pickRay, scene)
    } else {
      // 二维模式下
      cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid)
    }

    if (Cesium.defined(cartesian) && scene.camera.positionCartographic.height < 10000) {
      let cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      if (cartographic.height < -5000) return null // 屏蔽无效值
    }

    return cartesian

  }


  /**
   * 根据matrix转换矩阵求HeadingPitchRollByMatrix
   * @param {Cesium.Matrix4} matrix 转换矩阵
   * @param {Cesium.Ellipsoid} ellipsoid 变换中使用固定坐标系的椭球
   * @param {Cesium.Transforms.LocalFrameToFixedFrame} fixedFrameTransform  参考系
   * @returns {Cesium.HeadingPitchRoll} result 可以先实例化返回的Heading Pitch Roll角度对象
   */
  static getHeadingPitchRollByMatrix(matrix, ellipsoid = Cesium.Ellipsoid.WGS84, fixedFrameTransform = Cesium.Transforms
    .eastNorthUpToFixedFrame) {
    // 计算当前模型中心处的变换矩阵
    let m1 = fixedFrameTransform(
      position,
      ellipsoid,
      new Cesium.Matrix4()
    )

    // 矩阵相除
    let m3 = Cesium.Matrix4.multiply(
      Cesium.Matrix4.inverse(m1, new Cesium.Matrix4()),
      matrix,
      new Cesium.Matrix4()
    )

    // 得到旋转矩阵
    let mat3 = Cesium.Matrix3.getRotation(m3, new Cesium.Matrix3())
    // 计算四元数
    let q = Cesium.Quaternion.fromRotationMatrix(mat3)
    // 计算旋转角（弧度）
    let hpr = Cesium.HeadingPitchRoll.fromQuaternion(q)
    // 得到角度
    //let heading = Cesium.Math.toDegrees(hpr.heading);
    //let pitch = Cesium.Math.toDegrees(hpr.pitch);
    //let roll = Cesium.Math.toDegrees(hpr.roll);
    return hpr
  }

  /**
   * 根据position位置和orientation四元叔实例求 HeadingPitchRoll方向
   * @param {Cesium.Cartesian3} position 位置坐标
   * @param {Cesium.Quaternion} orientation 四元数实例
   * @param {*} ellipsoid
   * @param {*} fixedFrameTransform
   */
  static getHeadingPitchRollByOrientation(position, orientation, ellipsoid = Cesium.Ellipsoid.WGS84,
    fixedFrameTransform = Cesium.Transforms.eastNorthUpToFixedFrame) {
    let matrix = Cesium.Matrix4.fromRotationTranslation(
      Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
      position,
      matrix4Scratch
    )
    let hpr = this.getHeadingPitchRollByMatrix(position, matrix)
    return hpr
  }

  /**
   * 获取坐标数组中 最高高程值
   * @param {*} positions
   * @param {*} defaultValue
   */
  static getMaxHeight(positions, defaultValue) {
    if (defaultValue == null) defaultValue = 0
    let maxHeight = defaultValue
    if (positions == null || positions.length == 0) return maxHeight
    for (let i = 0; i < positions.length; i++) {
      let tempCarto = Cesium.Cartographic.fromCartesian(positions[i])
      if (tempCarto.height > maxHeight) {
        maxHeight = tempCarto.height
      }
    }
    return formatNum(maxHeight, 2)
  }

  formatNum(num, digits) {
    return Number(num.toFixed(digits || 0))
  }

  /**
   *
   * @private
   * @param {*} pickedObject
   * @param {*} noPickEntity
   */
  hasPickedModel(pickedObject, noPickEntity) {
    if (Cesium.defined(pickedObject.id)) {
      // entity
      let entity = pickedObject.id
      if (entity._noMousePosition) return entity // 排除标识不拾取的对象
      if (noPickEntity && entity === noPickEntity) return entity
    }

    if (Cesium.defined(pickedObject.primitive)) {
      // primitive
      let primitive = pickedObject.primitive
      if (primitive._noMousePosition) return primitive // 排除标识不拾取的对象
      if (noPickEntity && primitive === noPickEntity) return primitive
    }

    return null

  }


  getCenter(viewer, isToWgs) {
    let bestTarget = this.pickCenterPoint(viewer.scene)
  }


  /**
   * 设置坐标中海拔高度为贴地或贴模型的高度
   * @param {*} scene
   * @param {*} position
   * @param {*} options
   */
  setPositionSurfaceHeight(scene, position, options) {

  }

  /**
   * 获取屏幕中心点坐标
   * @param {*} scene
   */
  pickCenterPoint(scene) {
    let canvas = scene.canvas
    let center = new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight / 2)
    let ray = scene.camera.getPickRay(center)
    let target = scene.globe.pick(ray, scene)
    if (!target) target = scene.camera.pickEllipsoid(center)
    return target
  }
  // 根据模型的orientation求方位角
  static getHeadingPitchRollByOrientation(position, orientation, ellipsoid, fixedFrameTransform) {
    if (!Cesium.defined(orientation) || !Cesium.defined(position)) return new Cesium.HeadingPitchRoll();

    var matrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
      position, matrix4Scratch);
    var hpr = getHeadingPitchRollByMatrix(matrix, ellipsoid, fixedFrameTransform);
    return hpr;
  }

  // 根据模型的matrix矩阵求方位角
  static getHeadingPitchRollByMatrix(matrix, ellipsoid, fixedFrameTransform, result) {
    return Cesium.Transforms.fixedFrameToHeadingPitchRoll(matrix, ellipsoid, fixedFrameTransform, result);
  }

  // 根据模型的matrix矩阵求方位角
  static getHeadingPitchRollByMatrixOld(position, matrix, ellipsoid, fixedFrameTransform) {
    fixedFrameTransform = fixedFrameTransform || Cesium.Transforms.eastNorthUpToFixedFrame;

    // 计算当前模型中心处的变换矩阵
    var m1 = fixedFrameTransform(position, ellipsoid, new Cesium.Matrix4());
    // 矩阵相除
    var m3 = Cesium.Matrix4.multiply(Cesium.Matrix4.inverse(m1, new Cesium.Matrix4()), matrix, new Cesium.Matrix4());
    // 得到旋转矩阵
    var mat3 = Cesium.Matrix4.getMatrix3(m3, new Cesium.Matrix3());
    // 计算四元数
    var q = Cesium.Quaternion.fromRotationMatrix(mat3);
    // 计算旋转角(弧度)
    var hpr = Cesium.HeadingPitchRoll.fromQuaternion(q);
    return hpr;
  }


  //求localStart点到localEnd点的方向
  static getHeadingPitchRollForLine(localStart, localEnd, ellipsoid, fixedFrameTransform) {
    ellipsoid = ellipsoid || Cesium.Ellipsoid.WGS84;

    var velocity = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(localEnd, localStart, cartesian3),
      cartesian3);
    Cesium.Transforms.rotationMatrixFromPositionVelocity(localStart, velocity, ellipsoid, rotationScratch);
    var modelMatrix = Cesium.Matrix4.fromRotationTranslation(rotationScratch, localStart, matrix4Scratch2);

    Cesium.Matrix4.multiplyTransformation(modelMatrix, Cesium.Axis.Z_UP_TO_X_UP, modelMatrix);

    var hpr = getHeadingPitchRollByMatrix(modelMatrix, ellipsoid, fixedFrameTransform);
    return hpr;
  }

  //获取点point1绕点center的地面法向量旋转顺时针angle角度后新坐标
  static getRotateCenterPoint(center, point1, angle) {
    // 计算center的地面法向量
    var chicB = Cesium.Cartographic.fromCartesian(center);
    chicB.height = 0;
    var dB = Cesium.Cartographic.toCartesian(chicB);
    var normaB = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(dB, center, new Cesium.Cartesian3()), new Cesium
      .Cartesian3());

    // 构造基于center的法向量旋转90度的矩阵
    var Q = Cesium.Quaternion.fromAxisAngle(normaB, Cesium.Math.toRadians(angle));
    var m3 = Cesium.Matrix3.fromQuaternion(Q);
    var m4 = Cesium.Matrix4.fromRotationTranslation(m3);

    // 计算point1点相对center点的坐标A1
    var A1 = Cesium.Cartesian3.subtract(point1, center, new Cesium.Cartesian3());

    //对A1应用旋转矩阵
    var p = Cesium.Matrix4.multiplyByPoint(m4, A1, new Cesium.Cartesian3());
    // 新点的坐标
    var pointNew = Cesium.Cartesian3.add(p, center, new Cesium.Cartesian3());

    return pointNew;
  }

  //求p1指向p2方向线上，距离p1指定len长度的新的点 ，addBS：true时为距离p2
  static getOnLinePointByLen(p1, p2, len, addBS) {
    var mtx4 = Cesium.Transforms.eastNorthUpToFixedFrame(p1);
    var mtx4_inverser = Cesium.Matrix4.inverse(mtx4, new Cesium.Matrix4());
    p1 = Cesium.Matrix4.multiplyByPoint(mtx4_inverser, p1, new Cesium.Cartesian3());
    p2 = Cesium.Matrix4.multiplyByPoint(mtx4_inverser, p2, new Cesium.Cartesian3());

    var substrct = Cesium.Cartesian3.subtract(p2, p1, new Cesium.Cartesian3());

    var dis = Cesium.Cartesian3.distance(p1, p2);
    var scale = len / dis; //求比例
    if (addBS) scale += 1;

    var newP = Cesium.Cartesian3.multiplyByScalar(substrct, scale, new Cesium.Cartesian3());
    newP = Cesium.Matrix4.multiplyByPoint(mtx4, newP, new Cesium.Cartesian3());
    return newP;
  }

  //获取点的offest平移矩阵后点
  static getPositionTranslation(position, offest, degree, type, fixedFrameTransform) {
    fixedFrameTransform = fixedFrameTransform || Cesium.Transforms.eastNorthUpToFixedFrame;

    var rotate = Cesium.Math.toRadians(-Cesium.defaultValue(degree, 0)); //转成弧度

    type = (type || "z").toUpperCase();
    var _normal = Cesium.Cartesian3["UNIT_" + type];

    var quaternion = Cesium.Quaternion.fromAxisAngle(_normal, rotate); //quaternion为围绕这个z轴旋转d度的四元数
    var rotateMatrix3 = Cesium.Matrix3.fromQuaternion(quaternion); //rotateMatrix3为根据四元数求得的旋转矩阵

    var pointCartesian3 = new Cesium.Cartesian3(Cesium.defaultValue(offest.x, 0), Cesium.defaultValue(offest.y, 0),
      Cesium.defaultValue(offest.z, 0)); //point的局部坐标
    var rotateTranslationMatrix4 = Cesium.Matrix4.fromRotationTranslation(rotateMatrix3, Cesium.Cartesian3.ZERO); //rotateTranslationMatrix4为旋转加平移的4x4变换矩阵，这里平移为(0,0,0)，故填个Cesium.Cartesian3.ZERO
    Cesium.Matrix4.multiplyByTranslation(rotateTranslationMatrix4, pointCartesian3, rotateTranslationMatrix4); //rotateTranslationMatrix4 = rotateTranslationMatrix4  X  pointCartesian3
    var originPositionCartesian3 = Cesium.Ellipsoid.WGS84.cartographicToCartesian(Cesium.Cartographic.fromCartesian(
      position)); //得到局部坐标原点的全局坐标
    var originPositionTransform = fixedFrameTransform(originPositionCartesian3); //m1为局部坐标的z轴垂直于地表，局部坐标的y轴指向正北的4x4变换矩阵
    Cesium.Matrix4.multiplyTransformation(originPositionTransform, rotateTranslationMatrix4, rotateTranslationMatrix4); //rotateTranslationMatrix4 = rotateTranslationMatrix4 X originPositionTransform
    var pointCartesian = new Cesium.Cartesian3();
    Cesium.Matrix4.getTranslation(rotateTranslationMatrix4, pointCartesian); //根据最终变换矩阵m得到p2
    return pointCartesian;
  }

  //计算平行线，offset正负决定方向（单位米）
  static getOffsetLine(positions, offset) {
    var arrNew = [];
    for (var i = 1; i < positions.length; i++) {
      var point1 = positions[i - 1];
      var point2 = positions[i];

      var dir12 = Cesium.Cartesian3.subtract(point1, point2, new Cesium.Cartesian3());
      var dir21left = Cesium.Cartesian3.cross(point1, dir12, new Cesium.Cartesian3());

      var p1offset = computedOffsetData(point1, dir21left, offset * 1000);
      var p2offset = computedOffsetData(point2, dir21left, offset * 1000);

      if (i == 1) {
        arrNew.push(p1offset);
      }
      arrNew.push(p2offset);
    }
    return arrNew;
  }

  static computedOffsetData(ori, dir, wid) {
    var currRay = new Cesium.Ray(ori, dir);
    return Cesium.Ray.getPoint(currRay, wid, new Cesium.Cartesian3());
  }

  /**
   * 根据 距离方向 和 观察点 计算 目标点
   * @param {Object} viewPoint 观察点
   * @param {Object} direction 方向(正北方向为0)
   * @param {Object} radius 可视距离
   */
  static getPositionByDirectionAndLen(position, angle, radius) {
    var matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);

    //旋转
    var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(angle || 0));
    var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
    Cesium.Matrix4.multiply(matrix, rotationZ, matrix);

    var result = Cesium.Matrix4.multiplyByPoint(matrix, new Cesium.Cartesian3(0, radius, 0), new Cesium.Cartesian3());
    return result;
  }

  /**
   * 求某位置指定方向和距离的点
   * @param {Object} viewPoint 观察点
   * @param {Object} direction 方向
   * @param {Object} radius 可视距离
   */
  static getPositionByHprAndLen(position, hpr, radiusZ) {
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
    var matrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
      position, matrix4Scratch);
    var result = Cesium.Matrix4.multiplyByPoint(matrix, new Cesium.Cartesian3(0, 0, -radiusZ), new Cesium.Cartesian3());
    return result;
  }



  // var matrix3Scratch = new Cesium.Matrix3();
  // var matrix4Scratch = new Cesium.Matrix4();


  //求点按orientation方向射向地球与地球的交点
  static getRayEarthPosition(position, orientation, _reverse, ellipsoid) {
    if (orientation instanceof Cesium.HeadingPitchRoll) {
      orientation = Cesium.Transforms.headingPitchRollQuaternion(position, orientation);
    }

    var matrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
      position, matrix4Scratch);
    return getRayEarthPositionByMatrix(matrix, _reverse, ellipsoid);
  }

  //求矩阵射向地球与地球的交点
  static getRayEarthPositionByMatrix(_matrix, _reverse, ellipsoid) {
    Cesium.Matrix4.multiplyByPoint(_matrix, Cesium.Cartesian3.ZERO, scratchWC);
    scratchWC.clone(scratchRay.origin);

    var bottomCenter = new Cesium.Cartesian3(0, 0, _reverse ? -100 : 100);
    var groundPosition = extend2Earth(bottomCenter, _matrix, scratchRay, ellipsoid);
    return groundPosition;
  }

  //求地球交点
  static extend2Earth(positionLC, matrix, ray, ellipsoid) {
    ellipsoid = ellipsoid ? ellipsoid : Cesium.Ellipsoid.WGS84;

    Cesium.Matrix4.multiplyByPoint(matrix, positionLC, scratchWC);

    //取延长线与地球相交的点
    Cesium.Cartesian3.subtract(scratchWC, ray.origin, ray.direction);
    Cesium.Cartesian3.normalize(ray.direction, ray.direction);

    //Get the first intersection point of a ray and an ellipsoid.
    var intersection = Cesium.IntersectionTests.rayEllipsoid(ray, ellipsoid);
    var point = null;
    if (intersection) {
      point = Cesium.Ray.getPoint(ray, intersection.start);
    }
    if (point) {
      try {
        Cesium.Cartographic.fromCartesian(point, null, scratchCartographic2);
      } catch (e) {
        return null;
      }
    }
    return point;
  }

}

export default PointUtil
