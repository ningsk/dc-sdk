/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-28 09:45:03
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 10:17:20
 */

import * as Cesium from "cesium";

//定义一些常量
const x_PI = (3.14159265358979324 * 3000.0) / 180.0;
const PI = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function out_of_china(lng, lat) {
  return (
    lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
  );
}

function transformlat(lng, lat) {
  var ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
      2.0) /
    3.0;
  return ret;
}

function transformlng(lng, lat) {
  var ret =
    300.0 +
    lng +
    2.0 * lat +
    0.1 * lng * lng +
    0.1 * lng * lat +
    0.1 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((150.0 * Math.sin((lng / 12.0) * PI) +
      300.0 * Math.sin((lng / 30.0) * PI)) *
      2.0) /
    3.0;
  return ret;
}

/**
 * 百度坐标系 (BD-09) 与 国测局坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
export function bd2gcj(arrdata) {
  var bd_lon = Number(arrdata[0]);
  var bd_lat = Number(arrdata[1]);

  var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
  var x = bd_lon - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);

  gg_lng = Number(gg_lng.toFixed(6));
  gg_lat = Number(gg_lat.toFixed(6));
  return [gg_lng, gg_lat];
}

/**
 * 国测局坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function gcj2bd(arrdata) {
  var lng = Number(arrdata[0]);
  var lat = Number(arrdata[1]);

  var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;

  bd_lng = Number(bd_lng.toFixed(6));
  bd_lat = Number(bd_lat.toFixed(6));
  return [bd_lng, bd_lat];
}

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function wgs2gcj(arrdata) {
  var lng = Number(arrdata[0]);
  var lat = Number(arrdata[1]);

  if (out_of_china(lng, lat)) {
    return [lng, lat];
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = (lat / 180.0) * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;

    mglng = Number(mglng.toFixed(6));
    mglat = Number(mglat.toFixed(6));
    return [mglng, mglat];
  }
}

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function gcj2wgs(arrdata) {
  var lng = Number(arrdata[0]);
  var lat = Number(arrdata[1]);

  if (out_of_china(lng, lat)) {
    return [lng, lat];
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = (lat / 180.0) * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);

    var mglat = lat + dlat;
    var mglng = lng + dlng;

    var jd = lng * 2 - mglng;
    var wd = lat * 2 - mglat;

    jd = Number(jd.toFixed(6));
    wd = Number(wd.toFixed(6));
    return [jd, wd];
  }
}

//百度经纬度坐标 转 标准WGS84坐标
export function bd2wgs(arrdata) {
  return gcj2wgs(bd2gcj(arrdata));
}

//标准WGS84坐标  转 百度经纬度坐标
export function wgs2bd(arrdata) {
  return gcj2bd(wgs2gcj(arrdata));
}

//经纬度转Web墨卡托
export function jwd2mct(arrdata) {
  var lng = Number(arrdata[0]);
  var lat = Number(arrdata[1]);

  var x = (lng * 20037508.34) / 180;
  var y = Math.log(Math.tan(((90 + lat) * PI) / 360)) / (PI / 180);
  y = (y * 20037508.34) / 180;

  x = Number(x.toFixed(2));
  y = Number(y.toFixed(2));
  return [x, y];
}

//Web墨卡托转经纬度
export function mct2jwd(arrdata) {
  var lng = Number(arrdata[0]);
  var lat = Number(arrdata[1]);

  var x = (lng / 20037508.34) * 180;
  var y = (lat / 20037508.34) * 180;
  y = (180 / PI) * (2 * Math.atan(Math.exp((y * PI) / 180)) - PI / 2);

  x = Number(x.toFixed(6));
  y = Number(y.toFixed(6));
  return [x, y];
}
