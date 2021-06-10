/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-03-12 12:19:41
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-16 18:34:28
 */
import MaterialProperty from '../../MaterialProperty'

import * as Cesium from 'cesium'

import IMG from '../../../images/fence.png'

class WallTrailMaterialProperty extends MaterialProperty {
    constructor (options = {}) {
        super(options)
        this._image = undefined
        this._imageSubscription = undefined
        this.image = IMG
    }

    getType (time) {
        return Cesium.Material.WallTrailType
    }

    getValue (time, result) {
        if (!result) {
            result = {}
        }
        result.color = Cesium.Property.getValueOrUndefined(this._color, time)
        result.image = Cesium.Property.getValueOrUndefined(this._image, time)
        result.speed = this._speed
        return result
    }

    equals (other) {
        return (
            this === other ||
            (other instanceof WallTrailMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._speed, other._speed))
        )
    }
}

Object.defineProperties(WallTrailMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed'),
    image: Cesium.createPropertyDescriptor('image')
})

export default WallTrailMaterialProperty
