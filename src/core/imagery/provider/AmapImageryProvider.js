/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 14:12:15
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-15 14:13:04
 */
import ImageryType from "../ImageryType";
import Cesium from "cesium";

const IMG_URL =
  "https://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";

const ELEC_URL =
  "http://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}";

class AmapImageryProvider extends Cesium.UrlTemplateImageryProvider {
  constructor(options = {}) {
    options["url"] = options.style === "img" ? IMG_URL : ELEC_URL;
    if (!options.subdomains || !options.subdomains.length) {
      options["subdomains"] = ["01", "02", "03", "04"];
    }
    super(options);
  }
}

export default AmapImageryProvider;
