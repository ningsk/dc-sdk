/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 13:23:55
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 08:38:26
 */
import * as Cesium from "cesium";
import { Util } from "../core/index";

export function style2Entity(style, entityAttr) {
  style = style || {};
  if (entityAttr == null) {
    //默认值
    entityAttr = {
      fill: true,
      classificationType: Cesium.ClassificationType.BOTH,
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
      case "color":
        //填充颜色
        entityAttr.material = new Cesium.Color.fromCssColorString(
          value || "#FFFF00"
        ).withAlpha(Number(style.opacity || 1.0));
        break;
      case "outlineColor":
        //边框颜色
        entityAttr.outlineColor = new Cesium.Color.fromCssColorString(
          value || style.color || "#FFFF00"
        ).withAlpha(style.outlineOpacity || style.opacity || 1.0);
        break;
      case "extrudedHeight":
        //高度
        var maxHight = 0;
        if (entityAttr.hierarchy)
          maxHight = (0, _point.getMaxHeight)(
            entityAttr.hierarchy.getValue
              ? entityAttr.hierarchy.getValue()
              : entityAttr.hierarchy
          );
        entityAttr.extrudedHeight = Number(value) + maxHight;
        break;
      case "clampToGround":
        //贴地
        entityAttr.perPositionHeight = !value;
        break;
    }
  }

  //如果未设置任何material，默认设置随机颜色
  if (style.color == null) {
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
  var arr = entity.polygon.hierarchy.getValue();
  if (arr.positions && Util.isArray(arr.positions)) return arr.positions;
  return arr;
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

  if (coordinates.length > 0) coordinates.push(coordinates[0]);

  return {
    type: "Feature",
    properties: entity.attribute || {},
    geometry: {
      type: "Polygon",
      coordinates: [coordinates],
    },
  };
}
