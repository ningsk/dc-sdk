import Position from '../position/Position'

import Cesium from 'cesium';

// 定义一些常量
const WMP = new Cesium.WebMercatorProjection()
const x_PI = 3.14159265358979324 * 3000.0 / 180.0;
const PI = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;

class Transform {

  /**
   * 百度坐标系（BD-09） 与国测局坐标系（GCJ-02）的转换
   * 即 百度转谷歌、高德
   * @param {*[]} arrData 
   */
  static transformBdToGcj(arrData) {
		let bd_lon = Number(arrData[0]);
		let bd_lat = Number(arrData[1]);
		let x = bd_lon - 0.0065;
		let y = bd_lat - 0.006;
		let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
		let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
		let gg_lng = z * Math.cos(theta);
		let gg_lat = z * Math.sin(theta);
		gg_lng = Number(gg_lng.toFixed(6));
		gg_lat = Number(gg_lat.toFixed(6));
		return [gg_lng, gg_lat];
  }

  /**
   * 国测局坐标系（GCJ-02）与百度坐标系
   * 即谷歌、高德 转百度
   * @param {*[]} arrData 
   */
  static transformGcjToBd(arrData) {
    let lng = Number(arrData[0]);
    let lat = Number(arrData[1]);

    let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    let bd_lng = z * Math.cos(theta) + 0.0065;
    let bd_lat = z * Math.sin(theta) + 0.006;

    bd_lng = Number(bd_lng.toFixed(6));
    bd_lat = Number(bd_lat.toFixed(6));
    return [bd_lng, bd_lat];  
  }

  /**
   * WGS84转GCJ02
   * @param {*} arrData 
   */
  static transformWGSToGcj(arrData) {
    let lng = Number(arrData[0]);
    let lat = Number(arrData[1]);

    if (this.out_of_china(lng, lat)) {
      return [lng, lat];
    } else {
      let dLat = this.transformLat(lng - 105.0, lat - 35.0);
      let dLng = this.transformLng(lng - 105.0, lat - 35.0);
      let radLat = lat / 180.0 * PI;
      let magic = Math.sin(radLat);
      magic = 1 - ee * magic * magic;
      let sqrtMagic = Math.sqrt(magic);
      dLat = dLat * 180.0 / (a * (1 - ee) / (magic * sqrtMagic) * PI);
      dLng = dLng * 180.0 / (a / sqrtMagic * Math.cos(radLat) * PI);
      let mgLat = lat + dLat;
      let mgLng = lng + dLng;

      mgLng = Number(mgLng.toFixed(6));
      mgLat = Number(mgLat.toFixed(6));
      return [mgLng, mgLat];
    }
  }

  /**
   * GCJ02转 WGS84
   * @param {*} arrData 
   */
  static transformGcjToWGS(arrData) {
    let lng = Number(arrData[0]);
    let lat = Number(arrData[1]);

    if (this.out_of_china(lng, lat)) {
      return [lng, lat];
    } else {
      let dLat = this.transformLat(lng - 105.0, lat - 35.0);
      let dLng = this.transformLng(lng - 105.0, lat - 35.0);
      let radLat = lat / 180.0 * PI;
      let magic = Math.sin(radLat);
      magic = 1 - ee * magic * magic;
      var sqrtMagic = Math.sqrt(magic);
      dLat = dLat * 180.0 / (a * (1 - ee) / (magic * sqrtMagic) * PI);
      dLng = dLng * 180.0 / (a / sqrtMagic * Math.cos(radLat) * PI);

      let mgLat = lat + dLat;
      let mgLng = lng + dLng;

      let jd = lng * 2 - mgLng;
      let wd = lat * 2 - mgLat;

      jd = Number(jd.toFixed(6));
      wd = Number(wd.toFixed(6));
      return [jd, wd];
    }
  }

  static transformLat(lng, lat) {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret;
  };

  static transformLng(lng, lat) {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
  };

  /**
   * 百度经纬度坐标 转标准WGS84坐标
   * @param {*[]} arrData 
   */
  static transformBdToWGS(arrData) {
    return this.transformGcjToWGS(this.transformBdToGcj(arrData))
  }

  /**
   * 标准WGS84坐标转百度经纬度坐标
   */
  static transformWGSToBd(arrData) {
    return this.transformGcjToBd(this.transformWGSToGcj(arrData));
  }

  /**
   * 判断是否在国内，不在国内则不做偏移
   * @param {*} lng 
   * @param {*} lat 
   */
  static out_of_china(lng, lat) {
    return lng < 72.004 || lng > 137.8357 || lat < 0.8293 || lat > 55.8271 || false;
  }

  /**
   * 经纬度转墨卡托
   * @param {*[]} arrData 
   */
  static transformJwdToMercator(arrData) {
    let lng = Number(arrData[0]);
    let lat = Number(arrData[1]);
    let x = lng * 20037508.34 / 180;
    let y = Math.log(Math.tan((90 + lat) * PI / 360)) / (PI / 180);

    y = y * 20037508.34 / 180;

    x = Number(x.toFixed(2));
    y = Number(y.toFixed(2));
    return [x, y];
  }

  /**
   * Web墨卡托转经纬度
   * @param {*[]} arrData 
   */
  static transformMercatorToJwd(arrData) {
    let lng = Number(arrData[0]);
    let lat = Number(arrData[1]);

    let x = lng / 20037508.34 * 180;
    let y = lat / 30037508.34 * 180;
    y = 180 / PI * (2 * Math.atan(Math.exp(y * PI / 180)) - PI / 2);
    x = Number(x.toFixed(6));
    y = Number(y.toFixed(6));
    return [x, y];
  }

  /**
   *
   *卡迪尔坐标转84坐标
   * @param {*} cartesian
   *
   */
  static transformCartesianToWGS84(cartesian) {
    if (cartesian) {
      let ellipsoid = Cesium.Ellipsoid.WGS84
      let cartographic = ellipsoid.cartesianToCartographic(cartesian)
      return new Position(
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude),
        cartographic.height
      )
    }
    return new Position(0, 0)
  }

  /**
   *
   * 84坐标转卡迪尔坐标
   * @param {*} position
   *
   */
  static transformWGS84ToCartesian(position) {
    return position
      ? Cesium.Cartesian3.fromDegrees(
          position.lng,
          position.lat,
          position.alt,
          Cesium.Ellipsoid.WGS84
        )
      : Cesium.Cartesian3.ZERO
  }

  /**
   *
   * 84坐标转制图坐标
   * @param {*} position
   *
   */
  static transformWGS84ToCartographic(position) {
    return position
      ? Cesium.Cartographic.fromDegrees(
          position.lng,
          position.lat,
          position.alt
        )
      : Cesium.Cartographic.ZERO
  }

  /**
   *
   * 卡迪尔坐标数组转84坐标数组
   * @param {*} cartesianArr
   *
   */
  static transformCartesianArrayToWGS84Array(cartesianArr) {
    return cartesianArr
      ? cartesianArr.map(item => this.transformCartesianToWGS84(item))
      : []
  }

  /**
   *
   * 84坐标数组转卡迪尔坐标数组
   * @param {*} WGS84Arr
   *
   */
  static transformWGS84ArrayToCartesianArray(WGS84Arr) {
    return WGS84Arr
      ? WGS84Arr.map(item => this.transformWGS84ToCartesian(item))
      : []
  }

  /**
   *
   * 84转墨卡托
   * @param {*} position
   *
   */
  static transformWGS84ToMercator(position) {
    let mp = WMP.project(
      Cesium.Cartographic.fromDegrees(position.lng, position.lat, position.alt)
    )
    return new Position(mp.x, mp.y, mp.z)
  }

  /**
   * 墨卡托转84
   * @param {*} position
   *
   */
  static transformMercatorToWGS84(position) {
    let mp = WMP.unproject(
      new Cesium.Cartesian3(position.lng, position.lat, position.alt)
    )
    return new Position(
      Cesium.Math.toDegrees(mp.longitude),
      Cesium.Math.toDegrees(mp.latitude),
      mp.height
    )
  }

  /**
   * 屏幕坐标转84
   * @param {*} position
   * @param {*} viewer
   */
  static transformWindowToWGS84(position, viewer) {
    let scene = viewer.scene
    let cartesian = undefined
    if (scene.mode === Cesium.SceneMode.SCENE3D) {
      let ray = scene.camera.getPickRay(position)
      cartesian = scene.globe.pick(ray, scene)
    } else {
      cartesian = scene.camera.pickEllipsoid(position, Cesium.Ellipsoid.WGS84)
    }
    return this.transformCartesianToWGS84(cartesian)
  }

  /**
   * 84坐标转屏幕坐标
   * @param {*} position
   * @param {*} viewer
   */
  static transformWGS84ToWindow(position, viewer) {
    let scene = viewer.scene
    let cartesian = SceneTransforms.wgs84ToWindowCoordinates(
      scene,
      this.transformWGS84ToCartesian(position)
    )
    return cartesian
  }
}

export default Transform