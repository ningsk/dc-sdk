/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 12:21:44
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-12 12:24:23
 */
import * as Cesium from "cesium"

const WallImageTrailMaterial = require('../shader/wall/WallImageTrailMaterial.glsl')
const WallLineTrailMaterial = require('../shader/wall/WallLineTrailMaterial.glsl')
const WallTrailMaterial = require('../shader/wall/WallTrailMaterial.glsl')

/**
 * WallImageTrail
 * @type {string}
 */
Cesium.Material.WallImageTrailType = 'WallImageTrail'
Cesium.Material._materialCache.addMaterial(Cesium.Material.WallImageTrailType, {
    fabric: {
        type: Cesium.Material.WallImageTrailType,
        uniforms: {
            image: Cesium.Material.DefaultImageId,
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
            speed: 3.0,
            repeat: new Cesium.Cartesian2(1, 1)
        },
        source: WallImageTrailMaterial
    },
    translucent: function (material) {
        return true
    }
})

/**
 *  WallLineTrail
 * @type {string}
 */
Cesium.Material.WallLineTrailType = 'WallLineTrail'
Cesium.Material._materialCache.addMaterial(Cesium.Material.WallLineTrailType, {
    fabric: {
        type: Cesium.Material.WallLineTrailType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
            image: Cesium.Material.DefaultImageId,
            repeat: new Cesium.Cartesian2(1, 1),
            speed: 3.0
        },
        source: WallLineTrailMaterial
    },
    translucent: function (material) {
        return true
    }
})

/**
 * WallTrail
 * @type {string}
 */
Cesium.Material.WallTrailType = 'WallTrail'
Cesium.Material._materialCache.addMaterial(Cesium.Material.WallTrailType, {
    fabric: {
        type: Cesium.Material.WallTrailType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
            image: Cesium.Material.DefaultImageId,
            speed: 1
        },
        source: WallTrailMaterial
    },
    translucent: function (material) {
        return true
    }
})
