/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 10:36:42
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 08:38:16
 */

import Cesium from "cesium";
import { Util } from "../core/index";

export function style2Entity(style, entityAttr) {
  style = style || {};

  if (entityAttr == null) {
    // 默认值
    entityAttr = {};
  }

  // style 赋值给Entity
  for (var key in style) {
    var value = style[key];
    switch (key) {
      default:
        //  直接赋值
        entityAttr[key] = value;
        break;
      case "silhouette": // 跳过扩展其他属性的参数
      case "silhouetteColor":
      case "silhouetteAlpha":
      case "silhouetteSize":
      case "fill":
      case "color":
      case "opacity":
        break;
      case "modelUrl":
        entityAttr.uri = value;
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
    }
  }

  // 轮廓
  if (style.silhouette) {
    entityAttr.silhouetteColor = new Cesium.Color.fromCssColorString(
      style.silhouetteColor || "#FFFFFF"
    ).withAlpha(Number(style.silhouetteAlpha || 1.0));
    entityAttr.silhouetteSize = Number(style.silhouetteSize || 1.0);
  } else {
    entityAttr.silhouetteSize = 0.0;
  }

  // 透明度、颜色
  var opacity = style.hasOwnProperty("opacity") ? Number(style.opacity) : 1;
  if (style.fill)
    entityAttr.color = new Cesium.Color.fromCssColorString(
      style.color || "#FFFFFF"
    ).withAlpha(opacity);
  else
    entityAttr.color = new Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(
      opacity
    );

  return entityAttr;
}

// 获取entity的坐标
export function getPositions(entity) {
  var position = entity.position;
  if (position && position.getValue) position = position.getValue();
  return [position];
}

// 获取entity的坐标（geojson规范的格式）
export function getCoordinates(entity) {
  var positions = this.getPositions(entity);
  var coordinates = Util.cartesians2lonlats(positions);
  return coordinates;
}

// entity 转geojson
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
