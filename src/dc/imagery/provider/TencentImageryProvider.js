/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-15 14:15:48
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-15 14:16:18
 */
import ImageryType from '../ImageryType'

import Cesium from 'cesium';

const ELEC_URL =
  'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid={style}&scene=0&version=347'

class TencentImageryProvider extends Cesium.UrlTemplateImageryProvider {
  constructor(options = {}) {
    options['url'] = ELEC_URL.replace('{style}', options.style || 1)
    if (!options.subdomains || !options.subdomains.length) {
      options['subdomains'] = ['0', '1', '2']
    }
    super(options)
  }
}

export default TencentImageryProvider