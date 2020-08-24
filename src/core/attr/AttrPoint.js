import { Util } from "../utils";
import Cesium from 'cesium';
/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:42:11
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-24 10:09:53
 */
class AttrPoint {
  //属性赋值到entity
  function style2Entity(style, entityAttr) {
    style = style || {};
    if (entityAttr == null) {
      //默认值
      entityAttr = {};
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
        case "scaleByDistance_near":
        case "scaleByDistance_nearValue":
        case "scaleByDistance_far":
        case "scaleByDistance_farValue":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
          break;
        case "outlineColor":
          //边框颜色
          entityAttr.outlineColor = new Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity ||
            style.opacity || 1.0);
          break;
        case "color":
          //填充颜色
          entityAttr.color = new CesiumColor.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity ||
            1.0));
          break;
        case "scaleByDistance":
          //是否按视距缩放
          if (value) {
            entityAttr.scaleByDistance = new Cesium.NearFarScalar(Number(style.scaleByDistance_near || 1000),
              Number(style.scaleByDistance_nearValue || 1.0), Number(style.scaleByDistance_far || 1000000), Number(style
                .scaleByDistance_farValue || 0.1));
          } else {
            entityAttr.scaleByDistance = null;
          }
          break;
        case "distanceDisplayCondition":
          //是否按视距显示
          if (value) {
            entityAttr.distanceDisplayCondition = new Cesium2.DistanceDisplayCondition(Number(style.distanceDisplayCondition_near ||
              0), Number(style.distanceDisplayCondition_far || 100000));
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
              entityAttr.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
              break;
            default:
              entityAttr.heightReference = value;
              break;
          }
          break;
      }
    }

    //无边框时，需设置宽度为0
    if (!style.outline) entityAttr.outlineWidth = 0.0;

    return entityAttr;
  }

  //获取entity的坐标
  function getPositions(entity) {
    return [entity.position.getValue()];
  }

  //获取entity的坐标（geojson规范的格式）
  static getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
  }

  //entity转geojson
  static toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);
    return {
      type: "Feature",
      properties: entity.attribute || {},
      geometry: {
        type: "Point",
        coordinates: coordinates[0]
      }
    };
  }
}

export default AttrPoint;