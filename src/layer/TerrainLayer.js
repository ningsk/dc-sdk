import { Util } from "../utils";

/*
 * @Description: Terrain地形图层
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-21 08:58:12
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-08 11:05:45
 */

import { BaseLayer } from "./BaseLayer";

export var TerrainLayer = BaseLayer.extend({
  terrain: null,
  add: function () {
    if (!this.terrain) {
      this.terrain = Util.getTerrainProvider(this.config);
    }
    this.viewer.terrainProvider = this.terrain;
  },

  remove: function () {
    this.viewer.terrainProvider = Util.getEllipsoidTerrain();
  },
});
