/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 11:47:13
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-12 11:47:35
 */
import MaterialProperty from '../../MaterialProperty'

import * as Cesium from "cesium"

class CircleSpiralMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
        super(options)
    }

    getType(time) {
        return Cesium.Material.CircleSpiralType
    }

    getValue(time, result) {
        if (!result) {
            result = {}
        }
        result.color = Cesium.Property.getValueOrUndefined(this._color, time)
        result.speed = this._speed
        return result
    }

    equals(other) {
        return (
            this === other ||
            (other instanceof CircleSpiralMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._speed, other._speed))
        )
    }
}

Object.defineProperties(CircleSpiralMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed')
})

export default CircleSpiralMaterialProperty