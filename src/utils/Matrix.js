import Cesium from "cesium";

const matrix3Scratch = new Cesium.Matrix3(); //一些涉及矩阵计算的方法
const matrix4Scratch = new Cesium.Matrix4();
const cartesian3 = new Cesium.Cartesian3();
const rotationScratch = new Cesium.Matrix3();

// 根据模型的matrix矩阵求方位角
//Cesium.Transforms.fixedFrameToHeadingPitchRoll
function getHeadingPitchRollByMatrix(position, matrix) {
  // 计算当前模型中心处的变换矩阵
  let m1 = Cesium.Transforms.eastNorthUpToFixedFrame(
    position,
    Cesium.Ellipsoid.WGS84,
    new _Cesium2.default.Matrix4()
  );
  // 矩阵相除
  let m3 = Cesium.Matrix4.multiply(
    Cesium.Matrix4.inverse(m1, new Cesium.Matrix4()),
    matrix,
    new Cesium.Matrix4()
  );
  // 得到旋转矩阵
  let mat3 = Cesium.Matrix4.getRotation(m3, new Cesium.Matrix3());
  // 计算四元数
  let q = Cesium.Quaternion.fromRotationMatrix(mat3);
  // 计算旋转角(弧度)
  let hpr = Cesium.HeadingPitchRoll.fromQuaternion(q);

  // 得到角度
  //let heading = Cesium.Math.toDegrees(hpr.heading);
  //let pitch = Cesium.Math.toDegrees(hpr.pitch);
  //let roll = Cesium.Math.toDegrees(hpr.roll);
  //console.log('heading : ' + heading, 'pitch : ' + pitch, 'roll : ' + roll);

  return hpr;
}

// 根据模型的orientation求方位角
export function getHeadingPitchRollByOrientation(position, orientation) {
  let matrix = Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
    position,
    matrix4Scratch
  );
  let hpr = getHeadingPitchRollByMatrix(position, matrix);
  return hpr;
}

//求localStart点到localEnd点的方向
export function getHeadingPitchRollForLine(localStart, localEnd, ellipsoid) {
  ellipsoid = ellipsoid || Cesium.Ellipsoid.WGS84;

  let velocity = Cesium.Cartesian3.normalize(
    Cesium.Cartesian3.subtract(localEnd, localStart, cartesian3),
    cartesian3
  );
  //TODO rotationMatrixFromPositionVelocity方法不存在
  Cesium.Transforms.rotationMatrixFromPositionVelocity(
    localStart,
    velocity,
    ellipsoid,
    rotationScratch
  );
  let modelMatrix = Cesium.Matrix4.fromRotationTranslation(
    rotationScratch,
    localStart,
    matrix4Scratch
  );

  Cesium.Matrix4.multiplyTransformation(
    modelMatrix,
    Cesium.Axis.Z_UP_TO_X_UP,
    modelMatrix
  );

  let hpr = getHeadingPitchRollByMatrix(localStart, modelMatrix);
  return hpr;
}

//获取点point1绕点center的地面法向量旋转顺时针angle角度后新坐标
export function getRotateCenterPoint(center, point1, angle) {
  // 计算center的地面法向量
  let chicB = Cesium.Cartographic.fromCartesian(center);
  chicB.height = 0;
  let dB = Cesium.Cartographic.toCartesian(chicB);
  let normaB = Cesium.Cartesian3.normalize(
    Cesium.Cartesian3.subtract(dB, center, new _Cesium2.default.Cartesian3()),
    new Cesium.Cartesian3()
  );

  // 构造基于center的法向量旋转90度的矩阵
  let Q = Cesium.Quaternion.fromAxisAngle(normaB, Cesium.Math.toRadians(angle));
  let m3 = Cesium.Matrix3.fromQuaternion(Q);
  let m4 = Cesium.Matrix4.fromRotationTranslation(m3);

  // 计算point1点相对center点的坐标A1
  let A1 = Cesium.Cartesian3.subtract(point1, center, new Cesium.Cartesian3());

  //对A1应用旋转矩阵
  let p = Cesium.Matrix4.multiplyByPoint(m4, A1, new Cesium.Cartesian3());
  // 新点的坐标
  let pointNew = Cesium.Cartesian3.add(p, center, new Cesium.Cartesian3());

  return pointNew;
}

//获取点的offest平移矩阵后点
export function getPositionTranslation(position, offest, degree, type) {
  degree = degree || 0;
  type = type || "z";

  let rotate = Cesium.Math.toRadians(-degree); //转成弧度
  type = "UNIT_" + type.toUpperCase();
  let quaternion = Cesium.Quaternion.fromAxisAngle(
    Cesium.Cartesian3[type],
    rotate
  ); //quaternion为围绕这个z轴旋转d度的四元数
  let rotateMatrix3 = Cesium.Matrix3.fromQuaternion(quaternion); //rotateMatrix3为根据四元数求得的旋转矩阵
  let pointCartesian3 = new Cesium.Cartesian3(offest.x, offest.y, offest.z); //point的局部坐标
  let rotateTranslationMatrix4 = Cesium.Matrix4.fromRotationTranslation(
    rotateMatrix3,
    Cesium.Cartesian3.ZERO
  ); //rotateTranslationMatrix4为旋转加平移的4x4变换矩阵，这里平移为(0,0,0)，故填个Cesium.Cartesian3.ZERO
  Cesium.Matrix4.multiplyByTranslation(
    rotateTranslationMatrix4,
    pointCartesian3,
    rotateTranslationMatrix4
  ); //rotateTranslationMatrix4 = rotateTranslationMatrix4  X  pointCartesian3
  let originPositionCartesian3 = Cesium.Ellipsoid.WGS84.cartographicToCartesian(
    Cesium.Cartographic.fromCartesian(position)
  ); //得到局部坐标原点的全局坐标
  let originPositionTransform = Cesium.Transforms.eastNorthUpToFixedFrame(
    originPositionCartesian3
  ); //m1为局部坐标的z轴垂直于地表，局部坐标的y轴指向正北的4x4变换矩阵
  Cesium.Matrix4.multiplyTransformation(
    originPositionTransform,
    rotateTranslationMatrix4,
    rotateTranslationMatrix4
  ); //rotateTranslationMatrix4 = rotateTranslationMatrix4 X originPositionTransform
  let pointCartesian = new Cesium.Cartesian3();
  Cesium.Matrix4.getTranslation(rotateTranslationMatrix4, pointCartesian); //根据最终变换矩阵m得到p2
  return pointCartesian;
}
