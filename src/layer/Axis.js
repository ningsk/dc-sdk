import * as Cesium from "cesium";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 10:19:53
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 13:09:02
 */
export var Axis = {
  /**
   * Matrix used to convert from y-up to z-up
   *
   * @type {Matrix4}
   * @constant
   */
  Y_UP_TO_Z_UP: Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromRotationX(Cesium.Math.PI_OVER_TWO)
  ),

  /**
   * Matrix used to convert from z-up to y-up
   *
   * @type {Matrix4}
   * @constant
   */
  Z_UP_TO_Y_UP: Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromRotationX(-Cesium.Math.PI_OVER_TWO)
  ),

  /**
   * Matrix used to convert from x-up to z-up
   *
   * @type {Matrix4}
   * @constant
   */
  X_UP_TO_Z_UP: Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromRotationY(-Cesium.Math.PI_OVER_TWO)
  ),

  /**
   * Matrix used to convert from z-up to x-up
   *
   * @type {Matrix4}
   * @constant
   */
  Z_UP_TO_X_UP: Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromRotationY(Cesium.Math.PI_OVER_TWO)
  ),

  /**
   * Matrix used to convert from x-up to y-up
   *
   * @type {Matrix4}
   * @constant
   */
  X_UP_TO_Y_UP: Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromRotationZ(Cesium.Math.PI_OVER_TWO)
  ),

  /**
   * Matrix used to convert from y-up to x-up
   *
   * @type {Matrix4}
   * @constant
   */
  Y_UP_TO_X_UP: Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromRotationZ(-Cesium.Math.PI_OVER_TWO)
  ),
};
