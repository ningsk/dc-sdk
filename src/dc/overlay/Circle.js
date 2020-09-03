import { Util } from "../utils";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-26 08:49:17
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-26 09:04:22
 */
class Circle {
  static style2Entity(style, entityAttr) {
    style = style || {};
    if (entityAttr == null) {
      // 默认值
      entityAttr = {
        fill: true,
      };
    }

    // 贴地时，剔除高度相关属性
    if (style.clampToGround) {
      if (style.hasOwnProperty("height")) {
        delete style.height;
      }
      if (style.hasOwnProperty("extrudeHeight")) {
        delete style.extrudedHeight;
      }
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
        case "rotation":
          //旋转角度
          entityAttr.rotation = Cesium.Math.toRadians(value);
          break;
        case "height":
          entityAttr.height = Number(value);
          if (style.extrudedHeight)
            entityAttr.extrudedHeight =
              Number(style.extrudedHeight) + Number(value);
          break;
        case "extrudedHeight":
          entityAttr.extrudedHeight =
            Number(entityAttr.height || style.height || 0) + Number(value);
          break;
        case "radius":
          //半径（圆）
          entityAttr.semiMinorAxis = Number(value);
          entityAttr.semiMajorAxis = Number(value);
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
  static getPositions(entity) {
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
        coordinates: coordinates[0],
      },
    };
  }
}

export default Circle;
