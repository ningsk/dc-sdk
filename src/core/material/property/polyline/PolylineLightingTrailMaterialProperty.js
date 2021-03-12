/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 11:56:49
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-12 11:57:13
 */
import MaterialProperty from '../../MaterialProperty'

import * as Cesium from "cesium"

const IMG = require('../../../images/lighting.png')

class PolylineLightingTrailMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
        super(options)
        this._image = undefined
        this._imageSubscription = undefined
        this.image = IMG
    }

    getType(time) {
        return Cesium.Material.PolylineLightingTrailType
    }

    getValue(time, result) {
        if (!result) {
            result = {}
        }
        result.color = Cesium.Property.getValueOrUndefined(this._color, time)
        result.image = Cesium.Property.getValueOrUndefined(this._image, time)
        result.speed = this._speed
        return result
    }

    equals(other) {
        return (
            this === other ||
            (other instanceof PolylineLightingTrailMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._speed, other._speed))
        )
    }
}

Object.defineProperties(PolylineLightingTrailMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed'),
    image: Cesium.createPropertyDescriptor('image')
})

export default PolylineLightingTrailMaterialProperty