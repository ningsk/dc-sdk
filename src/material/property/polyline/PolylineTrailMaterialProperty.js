/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 11:57:25
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-12 11:57:47
 */
import MaterialProperty from '../../MaterialProperty'

import * as Cesium from "cesium"

class PolylineTrailMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
        super(options)
    }

    getType(time) {
        return Cesium.Material.PolylineTrailType
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
            (other instanceof PolylineTrailMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._speed, other._speed))
        )
    }
}

Object.defineProperties(PolylineTrailMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed')
})

export default PolylineTrailMaterialProperty