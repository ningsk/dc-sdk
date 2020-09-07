import { Util } from "../utils";

/*
 * @Description: Terrain地形图层
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-21 08:58:12
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-07 09:46:13
 */

import BaseLayer from "./BaseLayer";

class TerrainLayer extends BaseLayer {
  constructor(cfg, viewer) {
    super(cfg, viewer);
    this.terrain = null;
  }

  add() {
    if (!this.terrain) {
      this.terrain = Util.getTerrainProvider(this.config);
    }
    this.viewer.terrainProvider = this.terrain;
  }

  remove() {
    this.viewer.terrainProvider = Util.getEllipsoidTerrain();
  }
}

export default TerrainLayer;
