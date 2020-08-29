import { win } from "leaflet/src/core/Browser";
import { Util } from "../utils";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-14 13:34:00
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-26 10:27:12
 */
class AttrPolyline {
  static style2Entity(style, entityAttr) {
    style = style || {};
    if (entityAttr == null) {
      // 默认值
      entityAttr = {};
    }

    // style赋值给Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          // 直接赋值
          entityAttr[key] = value;
          break;
        case "lineType": // 跳过扩展其他属性的参数
        case "color":
        case "opacity":
        case "outline":
        case "outlineWidth":
        case "outlineColor":
        case "outlineOpacity":
          break;
      }
    }

    if (style.color || style.lineType) {
      var color = new Cesium.Color.fromCssColorString(
        style.color || "#FFFF00"
      ).withAlpha(Number(style.opacity || 1.0));
      var outlineColor = new Cesium.Color.fromCssColorString(
        style.outlineColor || "#FFFF00"
      ).withAlpha(Number(style.opacity || 1.0));
      switch (style.lineType) {
        default:
        case "solid":
          // 实线
          if (style.outline) {
            // 存在衬色时
            entityAttr.material = new Cesium.PolylineOutlineMaterialProperty({
              color: color,
              outlineWidth: Number(style.outlineWidth || 1.0),
              outlineColor: outlineColor,
            });
          } else {
            entityAttr.material = color;
          }
          break;
        case "dash":
          // 虚线
          if (style.outline) {
            // 存在衬色时
            entityAttr.material = new Cesium.PolylineDashMaterialProperty({
              dashLength: style.dashLength || style.outlineWidth || 16.0,
              color: color,
              gapColor: new Cesium.Color.fromCssColorString(
                style.outlineColor || "#FFFF00"
              ).withAlpha(Number(style.outlineOpacity || style.opacity || 1.0)),
            });
          } else {
            entityAttr.material = new Cesium.PolylineDashMaterialProperty({
              dashLength: style.dashLength || 16.0,
              color: color,
            });
          }
          break;
        case "glow":
          // 发光线
          entityAttr.material = new Cesium.PolylineGlowMaterialProperty({
            glowPower: style.glowPower || 0.1,
            color: color,
          });
          break;
        case "arrow":
          // 箭头线
          entityAttr.material = new Cesium.PolylineArrowMaterialProperty(color);
          break;
      }
    }
    return entityAttr;
  }

  /**
   * 获取entity的坐标
   * @param {*} entity
   */
  static getPositions(entity) {
    if (entity._positions_draw && entity._positions_draw.length > 0) {
      return entity._positions_draw; // 曲线等情形时，取绑定的数据
    }
  }

  /**
   * 获取entity的坐标（geojson规范的格式）
   * @param {*} entity
   */
  static getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates;
  }

  // 折线转曲线
  static line2curve(_positions_draw) {
    if (!window.turf) {
      return _positions_draw;
    }
    var coordinates = _positions_draw.map((position) => {
      return Util.cartesian2lonlat(position);
    });

    var defHeight = coordinates[coordinates.length - 1][2];

    var line = turf.lineString(coordinates);
    var curved = turf.bezierSpline(line);
    var _positions_show = Util.lonlats2cartesians(
      curved.geometry.coordinates,
      defHeight
    );
    return _positions_show;
  }
}

export default AttrPolyline;
