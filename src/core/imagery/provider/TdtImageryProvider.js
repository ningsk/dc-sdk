/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 09:11:05
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 09:13:09
 */
import * as Cesium from "cesium"
import ImageryType from "../ImageryType"

const MAP_URL =
    'https://t{s}.tianditu.gov.cn/DataServer?T={style}_w&x={x}&y={y}&l={z}&tk={key}'

class TdtImageryProvider extends Cesium.UrlTemplateImageryProvider {
    constructor(options = {}) {
        super({
            url: MAP_URL.replace(/\{style\}/g, options.style || 'vec').replace(
                /\{key\}/g,
                options.key || ''
            ),
            subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            maximumLevel: 18
        })
    }
}

ImageryType.TDT = 'tdt'

export default TdtImageryProvider