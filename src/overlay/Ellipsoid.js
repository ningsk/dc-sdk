/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 14:49:52
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 08:37:46
 */

import Cesium from "cesium";
import { Util } from "../core/index";

export function style2Entity(style, entityAttr) {
  style = style || {};
  if (entityAttr == null) {
    //默认值
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
      case "widthRadii":
      case "heightRadii":
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
      case "extentRadii":
        //球体长宽高半径
        var extentRadii = style.extentRadii || 100;
        var widthRadii = style.widthRadii || 100;
        var heightRadii = style.heightRadii || 100;
        entityAttr.radii = new Cesium.Cartesian3(
          extentRadii,
          widthRadii,
          heightRadii
        );
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

// 获取entity的坐标
export function getPositions(entity) {
  return [entity.position.getValue()];
}

// 获取entity的坐标（geojso规范的格式）
export function getCoordinates(entity) {
  var positions = this.getPositions(entity);
  var coordinates = Util.cartesians2lonlats(positions);
  return coordinates;
}

// entity转geojson
export function toGeoJson(entity) {
  var coordinates = this.getCoordinates(entity);
  return {
    type: "Feature",
    properties: entity.attribute || {},
    geometry: {
      type: "Point",
      coordinates: coordinates[0],
    },
  };
}
