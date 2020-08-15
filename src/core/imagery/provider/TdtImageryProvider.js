/*
 * @Descripttion: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-15 14:14:51
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-15 14:15:37
 */
import ImageryType from '../ImageryType'

import Cesium from 'cesium';

const MAP_URL =
  'http://t{s}.tianditu.gov.cn/{layer}_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer={layer}&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk={key}'

class TdtImageryProvider extends Cesium.WebMapTileServiceImageryProvider {
  constructor(options = {}) {
    super({
      url: MAP_URL.replace(/\{layer\}/g, options.style || 'vec').replace(
        /\{key\}/g,
        options.key || ''
      ),
      style: 'default',
      format: 'tiles',
      tileMatrixSetID: 'c',
      subdomains: [...Array(6).keys()].map(item => (item + 1).toString()),
      tileMatrixLabels: [...Array(18).keys()].map(item =>
        (item + 1).toString()
      ),
      tilingScheme: new Cesium.GeographicTilingScheme(),
      maximumLevel: 18
    })
  }
}

export default TdtImageryProvider