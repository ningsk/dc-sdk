import * as Cesium from 'cesium'
class PointHelper {
  //属性赋值到entity
  static style2Entity(style = {}, entityGraphic = {}) {
      //Style赋值值Entity
      for (var key in style) {
          var value = style[key];
          switch (key) {
              default:
                  //直接赋值
                  entityGraphic[key] = value;
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
                  entityGraphic.outlineColor = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity || style.opacity || 1.0);
                  break;
              case "color":
                  //填充颜色
                  entityGraphic.color = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity || 1.0));
                  break;

              case "pixelOffset":
                  //偏移量
                  if (Cesium.defined(value[0]) && Cesium.defined(value[1])) entityGraphic.pixelOffset = new Cesium.Cartesian2(value[0], value[1]);else entityGraphic.pixelOffset = value;
                  break;
              case "scaleByDistance":
                  //是否按视距缩放
                  if (value) {
                      entityGraphic.scaleByDistance = new Cesium.NearFarScalar(Number(style.scaleByDistance_near || 1000), Number(style.scaleByDistance_nearValue || 1.0), Number(style.scaleByDistance_far || 1000000), Number(style.scaleByDistance_farValue || 0.1));
                  } else {
                      entityGraphic.scaleByDistance = undefined;
                  }
                  break;

              case "distanceDisplayCondition":
                  //是否按视距显示
                  if (value) {
                      if (value instanceof Cesium.DistanceDisplayCondition) {
                          entityGraphic.distanceDisplayCondition = value;
                      } else {
                          entityGraphic.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(Number(Cesium.defaultValue(style.distanceDisplayCondition_near, 0)), Number(Cesium.defaultValue(style.distanceDisplayCondition_far, 100000)));
                      }
                  } else {
                      entityGraphic.distanceDisplayCondition = undefined;
                  }
                  break;
              case "clampToGround":
                  //贴地
                  if (value) entityGraphic.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;else entityGraphic.heightReference = Cesium.HeightReference.NONE;
                  break;
              case "heightReference":
                  switch (value) {
                      case "NONE":
                          entityGraphic.heightReference = Cesium.HeightReference.NONE;
                          break;
                      case "CLAMP_TO_GROUND":
                          entityGraphic.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
                          break;
                      case "RELATIVE_TO_GROUND":
                          entityGraphic.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
                          break;
                      default:
                          entityGraphic.heightReference = value;
                          break;
                  }
                  break;

              case "visibleDepth":
                  if (value) entityGraphic.disableDepthTestDistance = 0;else entityGraphic.disableDepthTestDistance = Number.POSITIVE_INFINITY; //一直显示，不被地形等遮挡

                  break;
          }
      }

      //无边框时，需设置宽度为0
      if (!style.outline) entityGraphic.outlineWidth = 0.0;

      return entityGraphic;
  }

  //获取entity的坐标
  static getPositions(entity) {
      return [(0, _point.getPositionValue)(entity.position)];
  }

  //获取entity的坐标（geojson规范的格式）
  static getCoordinates(entity) {
      var positions = getPositions(entity);
      var coordinates = pointconvert.cartesians2lonlats(positions);
      return coordinates;
  }

  //entity转geojson
  static toGeoJSON(entity) {
      var coordinates = getCoordinates(entity);
      return {
          type: "Feature",
          properties: entity.attribute || {},
          geometry: { type: "Point", coordinates: coordinates[0] }
      };
  }
}
