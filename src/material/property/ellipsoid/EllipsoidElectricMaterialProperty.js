/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 11:52:01
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-12 11:52:25
 */
import MaterialProperty from '../../MaterialProperty'

import * as Cesium from "cesium"

class EllipsoidElectricMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
        super(options)
    }

    getType(time) {
        return Cesium.Material.EllipsoidElectricType
    }

    getValue(time, result) {
        result = Cesium.defaultValue(result, {})
        result.color = Cesium.Property.getValueOrUndefined(this._color, time)
        result.speed = this._speed
        return result
    }

    equals(other) {
        return (
            this === other ||
            (other instanceof EllipsoidElectricMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._speed, other._speed))
        )
    }
}

Object.defineProperties(EllipsoidElectricMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed')
})

export default EllipsoidElectricMaterialProperty