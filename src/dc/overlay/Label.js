/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 11:25:42
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-07 10:20:43
 */
import Cesium from "cesium";
import { Util } from "../utils";
class Label {
  // 属性赋值到entity
  static style2Entity(style, entityAttr) {
    style = style || {};
    if (entityAttr == null) {
      // 默认值
      entityAttr = {
        scale: 1.0,
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
        case "font_style": //跳过扩展其他属性的参数
        case "font_weight":
        case "font_size":
        case "font_family":
        case "scaleByDistance_near":
        case "scaleByDistance_nearValue":
        case "scaleByDistance_far":
        case "scaleByDistance_farValue":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
        case "background_opacity":
        case "pixelOffsetY":
          break;

        case "text":
          //文字内容
          entityAttr.text = value.replace(new RegExp("<br />", "gm"), "\n");
          break;
        case "color":
          //颜色
          entityAttr.fillColor = new Cesium.Color.fromCssColorString(
            value || "#ffffff"
          ).withAlpha(Number(style.opacity || 1.0));
          break;

        case "border":
          //是否衬色
          entityAttr.style = value
            ? Cesium.LabelStyle.FILL_AND_OUTLINE
            : Cesium.LabelStyle.FILL;
          break;
        case "border_color":
          //衬色
          entityAttr.outlineColor = new Cesium.Color.fromCssColorString(
            value || "#000000"
          ).withAlpha(Number(style.opacity || 1.0));
          break;
        case "border_width":
          entityAttr.outlineWidth = value;
          break;
        case "background":
          //是否背景色
          entityAttr.showBackground = value;
          break;
        case "background_color":
          //背景色
          entityAttr.backgroundColor = new Cesium.Color.fromCssColorString(
            value || "#000000"
          ).withAlpha(Number(style.background_opacity || style.opacity || 0.5));
          break;
        case "pixelOffset":
          //偏移量
          entityAttr.pixelOffset = new Cesium.Cartesian2(
            style.pixelOffset[0],
            style.pixelOffset[1]
          );
          break;
        case "hasPixelOffset":
          //是否存在偏移量
          if (!value) entityAttr.pixelOffset = new Cesium.Cartesian2(0, 0);
          break;
        case "pixelOffsetX":
          //偏移量
          entityAttr.pixelOffset = new Cesium.Cartesian2(
            value,
            style.pixelOffsetY
          );
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
              entityAttr.heightReference =
                Cesium.HeightReference.CLAMP_TO_GROUND;
              break;
            case "RELATIVE_TO_GROUND":
              entityAttr.heightReference =
                Cesium.HeightReference.RELATIVE_TO_GROUND;
              break;
            default:
              emptyImageUrl.heightReference = value;
              break;
          }
          break;
      }
    }

    //样式（倾斜、加粗等）
    var fontStyle =
      (style.font_style || "normal") +
      " small-caps " +
      (style.font_weight || "normal") +
      " " +
      (style.font_size || "25") +
      "px " +
      (style.font_family || "楷体");
    entityAttr.font = fontStyle;

    return entityAttr;
  }

  // 获取entity的坐标
  static getPositions(entity) {
    return [entity.position.getValue()];
  }

  // 获取entity的坐标（geojson规范的格式）
  static getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
  }

  // entity转geojson
  static toGeoJSON(entity) {
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
}

export default Label;
