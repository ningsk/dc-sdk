const { Matrix4, Matrix3 } = require("cesium");

/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-15 10:19:53
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-15 10:21:03
 */
const Axis = {
    /**
         * Matrix used to convert from y-up to z-up
         *
         * @type {Matrix4}
         * @constant
         */
        Y_UP_TO_Z_UP : Matrix4.fromRotationTranslation(Matrix3.fromRotationX(CesiumMath.PI_OVER_TWO)),

        /**
         * Matrix used to convert from z-up to y-up
         *
         * @type {Matrix4}
         * @constant
         */
        Z_UP_TO_Y_UP : Matrix4.fromRotationTranslation(Matrix3.fromRotationX(-CesiumMath.PI_OVER_TWO)),

        /**
         * Matrix used to convert from x-up to z-up
         *
         * @type {Matrix4}
         * @constant
         */
        X_UP_TO_Z_UP : Matrix4.fromRotationTranslation(Matrix3.fromRotationY(-CesiumMath.PI_OVER_TWO)),

        /**
         * Matrix used to convert from z-up to x-up
         *
         * @type {Matrix4}
         * @constant
         */
        Z_UP_TO_X_UP : Matrix4.fromRotationTranslation(Matrix3.fromRotationY(CesiumMath.PI_OVER_TWO)),

        /**
         * Matrix used to convert from x-up to y-up
         *
         * @type {Matrix4}
         * @constant
         */
        X_UP_TO_Y_UP : Matrix4.fromRotationTranslation(Matrix3.fromRotationZ(CesiumMath.PI_OVER_TWO)),

        /**
         * Matrix used to convert from y-up to x-up
         *
         * @type {Matrix4}
         * @constant
         */
        Y_UP_TO_X_UP : Matrix4.fromRotationTranslation(Matrix3.fromRotationZ(-CesiumMath.PI_OVER_TWO)),
}

export default Axis;