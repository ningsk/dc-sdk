/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 13:14:35
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 10:16:11
 */

import * as Cesium from "cesium";
import { Util } from "../core/index";

// 属性赋值到entity
export function style2Entity(style, entityAttr) {
  style = style || {};

  if (entityAttr == null) {
    //默认
    entityAttr = {
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    };
  }

  //Style赋值值Entity
  for (var key in style) {
    var value = style[key];
    switch (key) {
      default:
        //直接赋值
        entityAttr[key] = value;
        break;
      case "scaleByDistance_near": //跳过扩展其他属性的参数
      case "scaleByDistance_nearValue":
      case "scaleByDistance_far":
      case "scaleByDistance_farValue":
      case "distanceDisplayCondition_far":
      case "distanceDisplayCondition_near":
        break;
      case "opacity":
        //透明度
        entityAttr.color = new Cesium.Color.fromCssColorString(
          "#FFFFFF"
        ).withAlpha(Number(value || 1.0));
        break;
      case "rotation":
        //旋转角度
        entityAttr.rotation = Cesium.Math.toRadians(value);
        break;
      case "scaleByDistance":
        //是否按视距缩放
        if (value) {
          entityAttr.scaleByDistance = new Cesium.NearFarScalar(
            Number(style.scaleByDistance_near || 1000),
            Number(style.scaleByDistance_nearValue || 1.0),
            Number(style.scaleByDistance_far || 1000000),
            Number(style.scaleByDistance_farValue || 0.1)
          );
        } else {
          entityAttr.scaleByDistance = null;
        }
        break;
      case "distanceDisplayCondition":
        //是否按视距显示
        if (value) {
          entityAttr.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(
            Number(style.distanceDisplayCondition_near || 0),
            Number(style.distanceDisplayCondition_far || 100000)
          );
        } else {
          entityAttr.distanceDisplayCondition = null;
        }
        break;

      case "heightReference":
        switch (value) {
          case "NONE":
            entityAttr.heightReference = Cesium.HeightReference.NONE;
            break;
          case "CLAMP_TO_GROUND":
            entityAttr.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
            break;
          case "RELATIVE_TO_GROUND":
            entityAttr.heightReference =
              Cesium.HeightReference.RELATIVE_TO_GROUND;
            break;
          default:
            entityAttr.heightReference = value;
            break;
        }
        break;
    }
  }

  return entityAttr;
}

//获取entity的坐标
export function getPositions(entity) {
  return [entity.position.getValue()];
}

//获取entity的坐标（geojson规范的格式）
export function getCoordinates(entity) {
  var positions = getPositions(entity);
  var coordinates = Util.cartesians2lonlats(positions);
  return coordinates;
}

//entity转geojson
export function toGeoJSON(entity) {
  var coordinates = getCoordinates(entity);
  return {
    type: "Feature",
    properties: entity.attribute || {},
    geometry: {
      type: "Point",
      coordinates: coordinates[0],
    },
  };
}
