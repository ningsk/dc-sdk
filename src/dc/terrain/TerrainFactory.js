/*
 * @Description: 地形工厂
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-29 08:43:12
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-29 08:49:50
 */

import Cesium from "cesium";

class TerrainFactory {
  /**
   * Create ellipsoid terrain
   * @param {*} options
   */
  static createEllipsoidTerrain(options) {
    return new Cesium.EllipsoidTerrainProvider(options);
  }

  /**
   * Create url terrain
   * @param {*} options
   */
  static createUrlTerrain(options) {
    return new Cesium.CesiumTerrainProvider(options);
  }

  /**
   * Create google terrain
   * @param {*} options
   */
  static createGoogleTerrain(options) {
    return new Cesium.GoogleEarthEnterpriseTerrainProvider(options);
  }

  /**
   * Create arcgis terrain
   * @param {*} options
   */
  static createArcgisTerrain(options) {
    return new Cesium.ArcGisImageServerTerrainProvider(options);
  }

  static createVRTerrain(options) {
    return new Cesium.VRTheWorldTerrainProvider(options);
  }
}
