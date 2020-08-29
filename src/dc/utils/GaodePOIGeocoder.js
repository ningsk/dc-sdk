import Util from "./Util";
import { PointConvert } from "../point";
/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-20 14:08:08
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 10:01:37
 */
class GaodePOIGeocoder {
  
  constructor(options) {
    options = options || {};
    this.citycode = options.citycode || '';
    //内置高德地图服务key，建议后期修改为自己申请的
		this.gaodekey = options.key || ["f2fedb9b08ae13d22f1692cd472d345e", "81825d9f2bafbb14f235d2779be90c0f",
			"b185732970a4487de104fa71ef575f29", "2e6ca4aeb6867fb637a5bee8333e5d3a", "027187040fa924e56048468aaa77b62c"
		];
  }

  getOneKey() {
    let arr = this.gaodekey;
    let n = Math.floor(Math.random() * arr.length + 1) - 1;
    return arr[n];
  }

  geocode(query, geocodeType) {
    let that = this;
    let key = this.getOneKey();
    let resource = new Cesium.Resource({
      url: 'http://restapi.amap.com/v3/place/text',
      queryParameters: {
        key: key,
        city: this.citycode,
        keywords: query
      }
    });

    return resource.fetchJson().then((results) => {
      if (results.status == 0) {
        Util.msg("请求失败(" + results.infocode + "):" + results.info);
        return;
      }

      if (results.pois.length === 0) {
        Util.msg("未查询到“" + query + "”相关数据！");
        return;
      }

      let height = 3000;
      if (that.viewer.camera.positionCartographic.height < height) {
        height = that.viewer.camera.positionCartographic.height;
      }

      return results.pois.map((resultObject) => {
        let arrjwd = resultObject.location.split(",");
        arrjwd = PointConvert.gcj2wgs(arrjwd); // 纠偏
        let lnglat = that.viewer.mars.point2map({
          x: arrjwd[0],
          y: arrjwd[1]
        });

        return {
          displayName: resultObject.name,
          destination: Cesium.Cartesian3.fromDegrees(lnglat.x, lnglat.y, height);
        }

      });

    });

  }

}

export default GaodePOIGeocoder;