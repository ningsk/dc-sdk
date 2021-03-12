/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 12:21:44
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-12 12:23:11
 */
import * as Cesium from "cesium"

const EllipsoidElectricMaterial = require('../shader/ellipsoid/EllipsoidElectricMaterial.glsl')
const EllipsoidTrailMaterial = require('../shader/ellipsoid/EllipsoidTrailMaterial.glsl')

/**
 * EllipsoidElectric
 * @type {string}
 */
Cesium.Material.EllipsoidElectricType = 'EllipsoidElectric'
Cesium.Material._materialCache.addMaterial(
    Cesium.Material.EllipsoidElectricType,
    {
        fabric: {
            type: Cesium.Material.EllipsoidElectricType,
            uniforms: {
                color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
                speed: 1
            },
            source: EllipsoidElectricMaterial
        },
        translucent: function (material) {
            return true
        }
    }
)

/**
 * EllipsoidTrail
 * @type {string}
 */
Cesium.Material.EllipsoidTrailType = 'EllipsoidTrail'
Cesium.Material._materialCache.addMaterial(Cesium.Material.EllipsoidTrailType, {
    fabric: {
        type: Cesium.Material.EllipsoidTrailType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
            speed: 3.0
        },
        source: EllipsoidTrailMaterial
    },
    translucent: function (material) {
        return true
    }
})
