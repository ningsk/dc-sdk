/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-03-12 12:17:45
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-12 12:18:07
 */
import MaterialProperty from '../../MaterialProperty'

import * as Cesium from 'cesium'

class RadarWaveMaterialProperty extends MaterialProperty {
    constructor (options = {}) {
        super(options)
    }

    getType (time) {
        return Cesium.Material.RadarWaveType
    }

    getValue (time, result) {
        result = Cesium.defaultValue(result, {})
        result.color = Cesium.Property.getValueOrUndefined(this._color, time)
        result.speed = this._speed
        return result
    }

    equals (other) {
        return (
            this === other ||
            (other instanceof RadarWaveMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._speed, other._speed))
        )
    }
}

Object.defineProperties(RadarWaveMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed')
})

export default RadarWaveMaterialProperty
