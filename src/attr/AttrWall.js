/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-24 10:02:53
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 10:16:50
 */
import * as Cesium from "cesium";
import { Util } from "../core/index";

//属性赋值到entity
export function style2Entity(style, entityAttr) {
  style = style || {};

  if (!entityAttr) {
    entityAttr = {
      fill: true,
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
      case "opacity": //跳过扩展其他属性的参数
      case "outlineOpacity":
        break;
      case "outlineColor":
        //边框颜色
        entityAttr.outlineColor = new Cesium.Color.fromCssColorString(
          value || "#FFFF00"
        ).withAlpha(style.outlineOpacity || style.opacity || 1.0);
        break;
      case "color":
        //填充颜色
        entityAttr.material = new Cesium.Color.fromCssColorString(
          value || "#FFFF00"
        ).withAlpha(Number(style.opacity || 1.0));
        break;
    }
  }

  //如果未设置任何material，设置默认颜色
  if (entityAttr.material == null) {
    entityAttr.material = Cesium.Color.fromRandom({
      minimumGreen: 0.75,
      maximumBlue: 0.75,
      alpha: Number(style.opacity || 1.0),
    });
  }

  return entityAttr;
}

//获取entity的坐标
export function getPositions(entity) {
  return entity.wall.positions.getValue();
}

//获取entity的坐标（geojson规范的格式）
export function getCoordinates(entity) {
  var positions = this.getPositions(entity);
  var coordinates = Util.cartesians2lonlats(positions);
  return coordinates;
}

//entity转geojson
export function toGeoJSON(entity) {
  var coordinates = this.getCoordinates(entity);
  return {
    type: "Feature",
    properties: entity.attribute || {},
    geometry: {
      type: "LineString",
      coordinates: coordinates,
    },
  };
}
