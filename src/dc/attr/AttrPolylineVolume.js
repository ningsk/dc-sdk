/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 14:37:50
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-29 09:45:33
 */

import Cesium from "cesium";
import { Util } from "../utils";

class AttrPolylineVolume {
  // 赋值到entity
  static style2Entity(style, entityAttr) {
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
          entityattr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
        case "radius":
        case "shape":
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

    //管道样式
    style.radius = style.radius || 10;
    switch (style.shape) {
      default:
      case "pipeline":
        entityAttr.shape = getCorridorShape1(style.radius); //（厚度固定为半径的1/3）
        break;
      case "circle":
        entityAttr.shape = getCorridorShape2(style.radius);
        break;
      case "star":
        entityAttr.shape = getCorridorShape3(style.radius);
        break;
    }

    return entityAttr;
  }
  //管道形状1【内空管道】 radius整个管道的外半径
  static getCorridorShape1(radius) {
    var hd = radius / 3;
    var startAngle = 0;
    var endAngle = 360;

    var pss = [];
    for (var i = startAngle; i <= endAngle; i++) {
      var radians = _Cesium2.default.Math.toRadians(i);
      pss.push(
        new _Cesium2.default.Cartesian2(
          radius * Math.cos(radians),
          radius * Math.sin(radians)
        )
      );
    }
    for (var i = endAngle; i >= startAngle; i--) {
      var radians = _Cesium2.default.Math.toRadians(i);
      pss.push(
        new _Cesium2.default.Cartesian2(
          (radius - hd) * Math.cos(radians),
          (radius - hd) * Math.sin(radians)
        )
      );
    }
    return pss;
  }

  //管道形状2【圆柱体】 radius整个管道的外半径
  static getCorridorShape2(radius) {
    var startAngle = 0;
    var endAngle = 360;

    var pss = [];
    for (var i = startAngle; i <= endAngle; i++) {
      var radians = Cesium.Math.toRadians(i);
      pss.push(
        new Cesium.Cartesian2(
          radius * Math.cos(radians),
          radius * Math.sin(radians)
        )
      );
    }
    return pss;
  }

  //管道形状3【星状】 radius整个管道的外半径 ,arms星角的个数（默认6个角）
  static getCorridorShape3(radius, arms) {
    var arms = arms || 6;
    var angle = Math.PI / arms;
    var length = 2 * arms;
    var pss = new Array(length);
    for (var i = 0; i < length; i++) {
      var r = i % 2 === 0 ? radius : radius / 3;
      pss[i] = new Cesium.Cartesian2(
        Math.cos(i * angle) * r,
        Math.sin(i * angle) * r
      );
    }
    return pss;
  }

  //获取entity的坐标
  static getPositions(entity) {
    if (entity._positions_draw && entity._positions_draw.length > 0)
      return entity._positions_draw; //取绑定的数据

    return entity.polylineVolume.positions.getValue();
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
        type: "LineString",
        coordinates: coordinates,
      },
    };
  }
}

export default AttrPolylineVolume;
