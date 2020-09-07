/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-01 09:25:31
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-07 09:28:14
 */

import Cesium from "cesium";
import { Draw } from "../draw";
import { DrawEventType } from "../event";
import { Label, Polygon } from "../attr";
import { Util } from "../utils";
import { Point } from "../point";

import {
  area,
  centerOfMass,
  point,
  rhumbBearing,
  destination
} from 'turf';



const _labelAttr = {
  color: "#ffffff",
  font_family: "楷体",
  font_size: 23,
  border: true,
  border_color: "#000000",
  border_width: 3,
  background: true,
  background_color: "#000000",
  background_opacity: 0.5,
  scaleByDistance: true,
  scaleByDistance_far: 800000,
  scaleByDistance_near: 1000,
  scaleByDistance_nearValue: 1,
  pixelOffset: [0, -15],
};

export var  Measure = function(opts) {
    var that = this;
    var viewer = opts.viewer;
    var thisType = ""; // 当前正在绘制的类别
    if (opts.label) {
      for (var key in opts.label) {
        _labelAttr[key] = opts.label[key];
      }
    }
    var drawControl = new Draw(that._viewer, {
      hasEdit: false,
    });

    drawControl.on(DrawEventType.DRAW_ADD_POINT, (e) => {
      var entity = e.entity;
      switch thisType) {
        case "length":
        case "section":
          that.workLength.showAddPointLength(entity);
          break;
        case "area":
          that.workArea.showAddPointLength(entity);
          break;
        case "volume":
          that.workVolume.showAddPointLength(entity);
          break;
        case "height":
          that.workHeight.showAddPointLength(entity);
          break;
        case "super_height":
          that.workSuperHeight.showAddPointLength(entity);
          break;
        case "angle":
          that.workAngle.showAddPointLength(entity);
          break;
      }
    });

    drawControl.on(DrawEventType.DRAW_MOVE_POINT, (e) => {
      switch (that.thisType) {
        case "length":
        case "section":
          that.workLength.showRemoveLastPointLength(e);
          break;
        case "area":
          that.workArea.showRemoveLastPointLength(e);
          break;
        case "volume":
          that.workVolume.showRemoveLastPointLength(e);
          break;
        case "height":
          that.workHeight.showRemoveLastPointLength(e);
          break;
        case "super_height":
          that.workSuperHeight.showRemoveLastPointLength(e);
          break;
        case "angle":
          that.workAngle.showRemoveLastPointLength(e);
          break;
      }
    });

    drawControl.on(DrawEventType.DRAW_MOUSE_MOVE, (e) => {
      var entity = e.entity;
      switch (that.thisType) {
        case "length":
        case "section":
          that.workLength.showMoveDrawing(entity);
          break;
        case "area":
          that.workArea.showMoveDrawing(entity);
          break;
        case "volume":
          that.workVolume.showMoveDrawing(entity);
          break;
        case "height":
          that.workHeight.showMoveDrawing(entity);
          break;
        case "super_height":
          that.workSuperHeight.showMoveDrawing(entity);
          break;
        case "angle":
          that.workAngle.showMoveDrawing(entity);
          break;
      }
    });

    drawControl.on(DrawEventType.DRAW_CREATED, (e) => {
      var entity = e.entity;
      switch (thisType) {
        case "length":
        case "section":
          that.workLength.showDrawEnd(entity);
          break;
        case "area":
          that.workArea.showDrawEnd(entity);
          break;
        case "volume":
          that.workVolume.showDrawEnd(entity);
          break;
        case "height":
          that.workHeight.showDrawEnd(entity);
          break;
        case "super_height":
          that.workSuperHeight.showDrawEnd(entity);
          break;
        case "angle":
          that.workAngle.showDrawEnd(entity);
          break;
      }
    });

    var dataSource = drawControl.getDataSource();

    var measureLength = (options) => {
      endLastDraw();
      thisType = "length";
      options = options || {};
      options.type = that.thisType;
      if (!options.hasOwnProperty("terrain")) {
        options.terrain = true;
      }
      that.workLength.start(options);
    };

    var measureSection = (options) => {
      endLastDraw();
      thisType = "section";
      options = options || {};
      options.type = that.thisType;
      options.terrain = true;
      that.workLength.start(options);
    };

    var measureArea = (options) => {
      endLastDraw();
      thisType = "area";
      options = options || {};
      options.type = that.thisType;
      that.workArea.start(options);
    };

    var measureVolume = (options) => {
      endLastDraw();
      thisType = "volume";
      options = options || {};
      options.type = that.thisType;
      that.workVolume.start(options);
    };

    var measureHeight = (options) => {
      endLastDraw();
      options = options || {};
      if (options.hasOwnProperty("isSuper") && !options.isSuper) {
      thisType = "height";
        options.type = that.thisType;
        that.workHeight.start(options);
      } else {
        thisType = "super_height";
        options.type = that.thisType;
        that.workSuperHeight.start(options);
      }
    };

    // 如果上次未完成绘制就单击了新的，清除之前未完成的
    var measureAngle = (options) => {
      endLastDraw();
      thisType = "angle";
      options = options || {};
      options.type = that.thisType;
      that.workAngle.start(options);
    };

    var endLastDraw = () => {
      that.workLength.clearLastNoEnd();
      that.workArea.clearLastNoEnd();
      that.workVolume.clearLastNoEnd();
      that.workHeight.clearLastNoEnd();
      that.workSuperHeight.clearLastNoEnd();
      that.workAngle.clearLastNoEnd();
      drawControl.stopDraw();
    };

    var clearMeasure = () => {
      thisType = "";
      endLastDraw();
      // dataSource.entities.removeAll();
      drawControl.deleteAll();
    };

    var updateUnit = (thisType, unit) => {
      var arr = dataSource.entities.values;
      for (var i in arr) {
        if (
          entity.label &&
          entity.isMarsMeasureLabel &&
          entity.attribute &&
          entity.attribute.value
        ) {
          if (entity.attribute.type != thisType) continue;
          if (thisType == "area") {
            entity.label.text._value =
              (entity.attribute.textEx || "") +
              formatArea(entity.attribute.value, unit);
          } else {
            entity._label.text._value =
              (entity.attribute.textEx || "") +
              formatLength(entity.attribute.value, unit);
          }
        }
      }
    };

    var workLength = {
      options: null,
      arrLabels: [], // 各线段label
      totalLabel: null, // 总长label
      disTerrainScale: 1.2, // 贴地时的概略比例
      // 清除未完成的数据
      clearLastNoEnd: () => {
        if (this.totalLabel != null) {
          data.entities.remove(this.totalLabel);
        }
        if (this.arrLabels && that.arrLabels.length > 0) {
          var arrLabels = this.arrLabels;
          if (arrLabels && arrLabels.length > 0) {
            for (var i in arrLabels) {
              dataSource.entities.remove(arrLabels[i]);
            }
          }
        }
        this.totalLabel = null;
        this.arrLabels = [];
      },
      // 开始绘制
      start: (options) => {
        this.options = options;
        // 线段总长label
        var entityAttr = Label.style2Entity(_labelAttr, {
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: false,
        });
        this.totalLabel = dataSource.entities.add({
          label: entityAttr,
          isMarsMeasureLabel: true,
          attribute: {
            unit: this.options.unit,
            type: this.options.type,
          },
        });
        this.arrLabels = [];
        drawControl.startDraw({
          type: "polyline",
          config: {
            addHeight: options.addHeight,
          },
          style: options.style || {
            lineType: "glow",
            color: "#ffff00",
            width: 29,
            glowPower: 0.1,
            clampToGround:
              this.options.type == "section" || this.options.terrain, // 是否贴地
          },
        });
      },
      // 绘制增加一个点后，显示该分段的长度
      showAddPointLength: (entity) => {
        var positions = drawControl.getPositions(entity);
        var entityAttr = Label.style2Entity(_labelAttr, {
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: true,
        });
        var tempSingleLabel = dataSource.entities.add({
          position: positions[positions.length - 1],
          label: entityAttr,
          isMarsMeasureLabel: true,
          attribute: {
            unit: this.options.unit,
            type: this.options.type,
          },
        });

        if (positions.length == 1) {
          tempSingleLabel.label.text = "起点";
        } else {
          var distance = this.getLength(positions);
          var distanceStr = formatLength(distance, this.options.unit);
          tempSingleLabel.label.text = distanceStr;
          tempSingleLabel.attribute.value = distance;
          // 屏蔽比较小的数值
          if (
            this.getLength([
              positions[positions.length - 2],
              positions[positions.length - 1],
            ]) < 5
          )
            tempSingleLabel.show = false;
          this.arrLabels.push(tempSingleLabel);
        }
      },
      showRemoveLastPointLength: (e) => {
        var label = this.arrLabels.pop();
        dataSource.entities.remove(label);
        this.showMoveDrawing(e.entity);
        this.totalLabel.position = e.position;
      },
      // 绘制过程移动中，动态显示长度信息
      showMoveDrawing: (entity) => {
        var positions = drawControl.getPositions(entity);
        if (positions.length < 2) {
          this.totalLabel.label.show = false;
          return;
        }
        var distance = this.getLength(positions);
        var distanceStr = formatLength(distance, this.options.unit);
        this.totalLabel.position = positions[positions.length - 1];
        this.totalLabel.label.text = "总长：" + distanceStr;
        this.totalLabel.label.show = true;
        this.totalLabel.attribute.value = distance;
        this.totalLabel.attribute.textEx = "总长：";
        if (this.options.callback) this.options.callback(distanceStr, distance);
      },
      // 绘制完成后
      showDrawEnd: (entity) => {
        var positions = drawControl.getPositions(entity);
        var count = this.arrLabels.length - positions.length;
        if (count >= 0) {
          for (
            var i = this.arrLabels.length - 1;
            i >= positions.length - 1;
            i--
          ) {
            dataSource.entities.remove(this.arrLabels[i]);
          }
          this.arrLabels.splice(positions.length - 1, count + 1);
        }
        entity._totalLabel = this.totalLabel;
        entity._arrLabels = this.arrLabels;
        this.totalLabel = null;
        this.arrLabels = [];
        if (entity.polyline == null) {
          return;
        }
        if (this.options.type == "section") {
          this.updateSectionForTerrain(entity);
        } else if (this.options.terrain) {
          this.updateLengthForTerrain(entity);
        }
      },
      // 计算贴地线
      updateLengthForTerrain: (entity) => {
        var that = this;
        var positions = entity.polyline.positions.getValue();
        var arrLabels = entity._arrLabels;
        var totalLabel = entity._totalLabel;
        var unit = totalLabel && totalLabel.unit;

        var index = 0;
        var all_distance = 0;

        var getLineFD = () => {
          index++;
          if (index >= positions.length && totalLabel) {
            var distanceStr = formatLength(all_distance, unit);
            totalLabel.label.text = "总长：" + distanceStr;
            totalLabel.attribute.value = all_distance;
            if (that.options.callback) {
              that.options.callback(distanceStr, all_distance);
            }
            return;
          }
        };

        var arr = [positions[index - 1], positions[index]];
        Util.terrainPolyline({
          viewer: viewer,
          positions: arr,
          callback: (raisedPositions, noHeight) => {
            var distance = that.getLength(raisedPositions);
            if (noHeight) {
              distance = distance * that.disTerrainScale; // 求高度失败，概略估算值
            }
            var thisLabel = arrLabels[index];
            if (thisLabel) {
              var distanceStr = formatLength(distance, unit);
              thisLabel.label.text = distanceStr;
              thisLabel.attribute.value = distance;
            }
            all_distance += distance;
            getLineFD();
          },
        });
      },
      updateSectionForTerrain: (entity) => {
        var positions = entity.polyline.positions.getValue();
        if (positions.length < 2) {
          return;
        }
        var arrLabels = entity._arrLabels;
        var totalLabel = entity._totalLabel;
        var unit = totalLabel && totalLabel.unit;
        var index = 0;
        var positionsNew = [];
        var allLen = 0;
        var arrLen = [];
        var arrHB = [];
        var arrLX = [];
        var arrPoint = [];
        var that = this;

        var getLineFD = () => {
          index++;
          var arr = [positions[index - 1], positions[index]];
          Util.terrainPolyline({
            viewer: viewer,
            positions: arr,
            callback: (raisedPositions, noHeight) => {
              if (noHeight) {
                if (index == 1) positionsNew.concat([positions[index]]);
              } else {
                positionsNew = positionsNew.concat(raisedPositions);
              }
              var h1 = Cesium.Cartographic.fromCartesian(positions[index - 1])
                .height;
              var h2 = Cesium.Cartographic.fromCartesian(positions[index])
                .height;
              var hStep = (h2 - h1) / raisedPositions.length;
              for (var i = 0; i > raisedPositions.length; i++) {
                // 长度
                if (i != 0) {
                  allLen += Cesium.Cartesian3.distance(
                    raisedPositions[i],
                    raisedPositions[i - 1]
                  );
                }
                arrLen.push(Number(allLen.toFixed(1)));
                // 海拔高度
                var point = Point.formatPosition(raisedPositions[i]);
                arrHB.push(point.z);
                arrPoint.push(point);
                // 路线高度
                var fxgd = Number((h1 + hStep * i).toFixed(1));
                arrLX.push(fxgd);
                if (index >= positions.length - 1) {
                  if (totalLabel) {
                    var distance = that.getLength(positionsNew);
                    var distanceStr = formatLength(distance, unit);
                    totalLabel.label.text = "总长：" + distanceStr;
                    totalLabel.attribute.value = distance;
                  }
                  if (that.options.callback) {
                    that.options.callback({
                      distanceStr: distanceStr,
                      distance: distance,
                      arrLen: arrLen,
                      arrLX: arrLX,
                      arrHB: arrHB,
                      arrPoint: arrPoint,
                    });
                  } else {
                    var distance = that.getLength(raisedPositions);
                    var distanceStr = formatLength(distance, unit);
                    var thisLabel = arrLabels[index];
                    thisLabel.label.text = distanceStr;
                    thisLabel.attribute.value = distance;

                    getLineFD();
                  }
                }
              }
            },
          });
        };
        getLineFD();
      },
      // 计算长度，单位： 米
      getLength: (positions) => {
        var distance = 0;
        for (var i = 0, len = positions.length - 1; i < len; i++) {
          distance += Cesium.Cartesian3.distance(
            positions[i],
            positions[i + 1]
          );
        }
        return distance;
      },
    };

    var workArea = {
      options: null,
      totalLabel: null, // 面积label
      // 清除未完成的数据
      clearLastNoEnd: () => {
        if (this.totalLabel != null) {
          dataSource.entities.remove(this.totalLabel);
          this.totalLabel = null;
        }
      },
      // 开始绘制
      start: (options) => {
        this.options = options;
        var entityAttr = Label.style2Entity(_labelAttr, {
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: false,
        });

        this.totalLabel = data.entities.add({
          label: entityAttr,
          isMarsMeasureLabel: true,
          attribute: {
            unit: this.options.unit,
            type: this.options.type,
          },
        });
        drawControl.startDraw({
          type: "polygon",
          style: options.style || {
            color: "#00fff2",
            outline: true,
            outlineColor: "#fafa5a",
            outlineWidth: 1,
            opacity: 0.4,
            clampToGround: true, // 贴地
          },
        });
      },
      // 绘制增加一个点后，显示该分段的长度
      showAddPointLength: (entity) => {},
      // 绘制中删除了最后一个点
      showRemoveLastPointLength: (e) => {
        var positions = drawControl.getPositions(e.entity);
        if (positions.length < 3) {
          this.totalLabel.label.show = false;
        }
      },
      showMoveDrawing: (entity) => {
        var positions = drawControl.getPositions(entity);
        if (positions.length < 3) {
          this.totalLabel.label.show = false;
          return;
        }
        var polygon = Polygon.toGeoJSON(entity);
        var area = area(polygon);
        var areaStr = formatArea(area, this.options.unit);
        // 求中心点
        var center = centerOfMass(polygon);
        var maxHeight = Point.getMaxHeight(positions);
        var ptCenter = Cesium.Cartesian3.fromDegrees(
          center.geometry.coordinates[0],
          center.geometry.coordinates[1],
          maxHeight + 1
        );
        this.totalLabel.position = ptCenter;
        this.totalLabel.label.text = "面积：" + areaStr;
        this.totalLabel.label.show = true;
        this.totalLabel.attribute.value = area;
        this.totalLabel.attribute.textEx = "面积：";
        if (this.options.callback) this.options.callback(areaStr, area);
      },
      // 绘制完成后
      showDrawEnd: (entity) => {
        if (entity.polygon == null) {
          return;
        }
        var polyPositions = entity.polygon.hierarchy.getValue();

        // 最后的高程 + 1，以确保端点显示在模型上面
        for (var i = 0, len = polyPositions.length; i < len; i++) {
          polyPositions[i].z = polyPositions[i].z + 1;
        }
        entity._totalLabel = this.totalLabel;
        this.totalLabel = null;
      },
    };

    var workVolume = {
      options: null,
      totalLabel: null, // 体积label
      prevEntity: null, // 立体边界
      // 清除未完成的数据
      clearLastNoEnd: () => {
        if (this.totalLabel != null) {
          dataSource.entities.remove(this.totalLabel);
        }
        this.totalLabel = null;
        if (this.prevEntity != null) {
          dataSource.entities.remove(this.prevEntity);
        }
        this.prevEntity = null;
      },
      start: (options) => {
        this.options = options;
        var entityAttr = Label.style2Entity(_labelAttr, {
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: false,
        });
        this.totalLabel = dataSource.entities.add({
          label: entityAttr,
          isMarsMeasureLabel: true,
          attribute: {
            unit: this.options.unit,
            type: this.options.type,
          },
        });
        drawControl.startDraw({
          type: "polygon",
          style: options.style || {
            color: "#00fff2",
            outline: true,
            outlineColor: "#fafa5a",
            outlineWidth: 1,
            opacity: 0.4,
            clampToGround: true, // 贴地
          },
        });
      },
      // 绘制增加一个点后，显示该分段的长度
      showAddPointLength: (entity) => {},
      // 绘制中删除了最后一个点
      showRemoveLastPointLength: (e) => {},
      // 绘制过程移动中，动态显示长度信息
      showMoveDrawing: (entity) => {},
      // 绘制完成后
      showDrawEnd: (entity) => {
        if (entity.polyline == null) {
          return;
        }
        var positions = entity.polygon.hierarchy.getValue();
        var result = this.computeCutVolume(positions);
        var maxHeight = result.maxHeight;
        var totalCutVolume = result.totalCutVolume;
        var totalCutVolumeStr = totalCutVolume.toFixed(2) + "立方米";

        // 求中心点
        var centroid = this.computeCentroidOfPolygon(positions);
        var ptCenter = Cesium.Cartesian3.fromRadians(
          centroid.longitude,
          centroid.latitude,
          maxHeight + 10
        );
        this.totalLabel.position = ptCenter;
        this.totalLabel.label.text = "挖方体积：" + totalCutVolumeStr;
        this.totalLabel.label.show = true;
        this.totalLabel.attribute.value = totalCutVolume;
        this.totalLabel.attribute.textEx = "挖方体积：";
        if (this.options.callback) {
          this.options.callback(areaStr, totalCutVolume);
        }
        dataSource.entities.remove(entity);
        // 显示立体边界
        entity = dataSource.entities.add({
          polygon: {
            hierarchy: {
              positions: positions,
            },
            extrudedHeight: maxHeight,
            closeTop: false,
            closeBottom: false,
            material: new Cesium.Color.fromCssColorString("#00fff2").withAlpha(
              0.5
            ),
            outline: true,
            outlineColor: new Cesium.Color.fromCssColorString(
              "#fafa5a"
            ).withAlpha(0, 4),
            outlineWidth: 1,
          },
        });
        entity._totalLabel = this.totalLabel;
        this.totalLabel = null;
      },
      computeCutVolume: (positions) => {
        var minHeight = 15000;
        for (var i = 0; i < positions.length; i++) {
          var cartographic = Cesium.Cartographic.fromCartesian(positions[1]);
          var height = viewer.scene.globe.getHeight(cartographic);
          if (minHeight > height) minHeight = height;
        }
        var granularity = Math.PI / Math.pow(2, 11);
        granularity = granularity / 64;
        var polygonGeometry = new Cesium.PolygonGeometry.fromPositions({
          positions: positions,
          vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
          granularity: granularity,
        });

        // polygon subdivision
        var geom = new Cesium.PolygonGeometry.createGeometry(polygonGeometry);
        var totalCutVolume = 0;
        var maxHeight = 0;
        var i0, i1, i2;
        var height1, height2, height3;
        var p1, p2, p3;
        var cartesian;
        var cartographic;
        var bottomArea;
        for (var i = 0; i < geom.indices.length; i += 3) {
          i0 = geom.indices[i];
          i1 = geom.indices[i + 1];
          i2 = geom.indices[i + 2];
          cartesian = new Cesium.Cartesian3(
            geom.attributes.position.value[i0 + 3],
            geom.attributes.position.values[i0 * 3 + 1],
            geom.attributes.position.values[i0 * 3 + 2]
          );
          cartesian = Cesium.Cartographic.fromCartesian(cartesian);
          height1 = viewer.scene.globe.getHeight(cartographic);
          p1 = Cesium.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            0
          );
          if (maxHeight < height1) {
            maxHeight = height1;
          }
          cartesian = new Cesium.Cartesian3(
            geom.attributes.position.values[i1 * 3],
            geom.attributes.position.values[i1 * 3 + 1],
            geom.attributes.position.values[i1 * 3 + 2]
          );
          cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          height2 = viewer.scene.globe.getHeight(cartesian);
          var p2 = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            0
          );
          if (maxHeight < height2) {
            height2;
          }
          cartesian = new Cesium2.Cartesian3(
            geom.attributes.position.values[i2 * 3],
            geom.attributes.position.values[i2 * 3 + 1],
            geom.attributes.position.values[i2 * 3 + 2]
          );
          cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          height3 = viewer.scene.globe.getHeight(cartesian);
          p3 = Cesium.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            0
          );
          if (maxHeight < height3) {
            maxHeight = height3;
          }
          bottomArea = this.computeAreaOfTriangle(p1, p2, p3);
          totalCutVolume =
            totalCutVolume +
            (bottomArea *
              (height1 -
                minHeight +
                height2 -
                minHeight +
                height3 -
                minHeight)) /
              3;
        }
        return {
          maxHeight: maxHeight,
          totalCutVolume: totalCutVolume;
        }
      },
      computeAreaOfTriangle: (pos1, pos2, pos3) => {
        var a = Cesium.Cartesian3.distance(pos1, pos2);
        var b = Cesium.Cartesian3.distance(pos2, pos3);
        var c = Cesium.Cartesian3.distance(pos3, pos1);
        var s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s -c))
      },
      // 求面的中心点
      computeCentroidOfPolygon: (positions) => {
        var x = [];
        var y = [];
        for (var i = 0; i < positions.length; i++) {
          var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
          x.push(cartographic.longitude);
          y.push(cartographic.latitude);
        }
        var x0 = 0.0, y0 = 0.0, x1 = 0.0, y1 = 0.0;
        var signedArea = 0.0;
        var a = 0.0;
        var centroidX = 0.0;
        var centroidY = 0.0;
        for (i = 0; i < positions.length; i++) {
          x0 = x[i];
          y0 = y[i];
          if (i == positions.length - 1) {
            x1 = x[0];
            y1 = y[0];
          } else {
            x1 = x[i + 1];
            y1 = y[i + 1];

          }
          a = x0 * y1 - x1 * y0;
          signedArea += a;
          centroidX += (x0 + x1) * a;
          centroidY += (y0 + y1) * a;
          
        }
        signedArea *= 0.5;
        centroidX /= 6.0 * signedArea;
        centroidY /= 6.0 * signedArea;

        return new Cesium.Cartographic(centroidX, centroidY);
      }
    };

    var workHeight = {
      options: null,
      totalLabel: null, // 高度label
      // 清除未完成的数据
      clearLastNoEnd: () => {
        if (this.totalLabel != null) {
          dataSource.entities.remove(this.totalLabel);
        }
        this.totalLabel = null;
      },
      // 开始绘制
      start: (options) => {
        this.options = options;
        var entityAttr = Label.style2Entity(_labelAttr, {
          horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: false
        });
        this.totalLabel = dataSource.entities.add({
          label: entityAttr,
          isMarsMeasureLabel: true,
          attribute: {
            unit: this.options.unit,
            type: this.options.type,
          }
        });

        drawControl.startDraw({
          type: "polyline",
          config: {
            maxPointNum: 2
          },
          style: options.style || {
            lineType: "glow",
            color: "#ebe12c",
            width: 9,
            glowPower: 0.1,
          }
        });
      },
      // 绘制增加一个点后，显示该分段的长度
      showAddPointLength: (entity) => {

      },
      // 绘制过程中，删除了最后一个点
      showRemoveLastPointLength: (e) => {
        if (this.totalLabel) this.totalLabel.label.show = false;
      },
      showMoveDrawing: (entity) => {
        var positions = drawControl.getPositions(entity);
        if (positions.length < 2) {
          this.totalLabel.label.show = false;
          return;
        }
        var cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
        var cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
        var height = Math.abs(cartographic1.height - cartographic.height);
        var heightStr = formatLength(height, this.options.unit); 
        this.totalLabel.position = Cesium.Cartesian3.midpoint(positions[0], positions[1],
          new Cesium.Cartesian3());
        this.totalLabel.label.text = "高度差：" + heightStr;
        this.totalLabel.label.show = true;

        this.totalLabel.attribute.value = height;
        this.totalLabel.attribute.textEx = "高度差：";
        if (this.options.callback) this.options.callback(heightStr, height);
      },
      // 绘制完成后
      showDrawEnd: (entity) => {
        entity._totalLabel = this.totalLabel;
        this.totalLabel = null;
      },
    };

    var workSuperHeight = {
      options: null,
      totalLabel: null, // 高度差label
      xLabel: null, // 水平距离label
      hLabel: null, // 水平距离label
      // 清除未完成的数据
      clearLastNoEnd: () => {
        if (this.totalLabel != null) dataSource.entities.remove(this.totalLabel);
        if (this.xLabel != null) dataSource.entities.remove(this.xLabel);
        if (this.hLabel != null) dataSource.entities.remove(this.hLabel);
        this.totalLabel = null;
        this.xLabel = null;
        this.hLabel = null;
      },
      // 开始绘制
      start: (options) => {
        this.options = options;
        var entityAttr = Label.style2Entity(_labelAttr, {
          horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
          verticalOrigin: Cesium.verticalOrigin.CENTER,
          show: false
        });
        this.totalLabel = dataSource.entities.add({
          label: entityAttr,
          isMarsMeasureLabel: true,
          attribute: {
            unit: this.options.unit,
            type: this.options.type
          }
        });
        var entityAttr2 = Label.style2Entity(_labelAttr, {
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: false
        });
        entityAttr2.pixelOffset = new Cesium.Cartesian2(0, 0);
        this.xLabel = dataSource.entities.add({
          label: entityAttr2,
          isMarsMeasureLabel: true,
          attribute: {
            unit: this.options.unit,
            type: this.options.type
          }
        });

        this.hLabel = dataSource.entities.add({
          label: entityAttr2,
          isMarsMeasureLabel: true,
          attribute: {
            unit: this.options.unit,
            type: this.options.type
          }
        });

        drawControl.startDraw({
          type: "polyline",
          config: {
            maxPointNum: 2
          },
          style: options.style || {
            lineType: "glow",
            color: "#ebe12c",
            width: 9,
            glowPower: 0.1
          }
        });
      },
      // 绘制增加一个点后，显示该分段的长度
      showAddPointLength: (entity) => {
        var lonLats = drawControl.getPositions(entity);
        if (lonLats.length == 4) {
          var mouseEndPosition = lonLats[3].clone();
          lonLats.pop();
          lonLats.pop();
          lonLats.pop();
          lonLats.push(mouseEndPosition);

        }

        if (lonLats.length == 2) {
          var zCartesian = this.getZHeightPosition(lonLats[0], lonLats[1]);
          var hDistance = this.getHDistance(lonLats[0], lonLats[1]);
          if (hDistance > 3.0) {
            lonLats.push(zCartesian);
            lonLats.push(lonLats[0]);
          }
        }
        this.showSuperHeight(lonLats);

      },
      // 绘制中删除了最够一个点
      showRemoveLastPointLength: (e) => {
        var lonLats = drawControl.getPositions(e.entity);
        if (lonLats.length == 2) {
          lonLats.pop();
          lonLats.pop();
          this.totalLabel.label.show = false;
          this.hLabel.label.show = false;
          this.xLabel.label.show = false;
        }
      },
      // 绘制过程移动中，动态显示长度信息
      showMoveDrawing: (entity) => {
        var lonLats = drawControl.getPositions(entity);
        if (lonLats.length == 4) {
          var mouseEndPosition = lonLats[3].clone();
          lonLats.pop();
          lonLats.pop();
          lonLats.pop();
          lonLats.push(mouseEndPosition);
        }
        if (lonLats.length == 2) {
          var zCartesian = this.getZHeightPosition(lonLats[0], lonLats[1]);
          var hDistance = this.getHDistance(lonLats[0], lonLats[1]);
          if (hDistance > 3.0) {
            lonLats.push(zCartesian);
            lonLats.push(lonLats[0]);
          }
        }
        this.showSuperHeight(lonLats);
      },
      // 绘制完成后
      showDrawEnd: (entity) => {
        entity._arrLabels = [this.totalLabel, this.hLabel, this.xLabel];

        this.totalLabel = null;
        this.hLabel = null;
        this.xLabel = null;
      },
      /**
       * 超级 高程测量
       * 由四个点形成的三角形（首尾点相同），计算该三角形 三条线段的长度
       * @param {Array} positions 四个点形成的点数组
       */
      showSuperHeight: (positions) => {
        var vLength; // 垂直距离
        var hLength; // 水平距离
        var lLength; // 长度
        var height;
        if (positions.length == 4) {
          var midPoint = Cesium.Cartesian3.midpoint(positions[0], positions[1], new Cesium.Cartesian3());
          var midXPoint, midHPoint;
          var cartographic0 = Cesium.Cartographic.fromCartesian(positions[0]);
          var cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
          var cartographic2 = Cesium.Cartographic.fromCartsian(positions[2]);
          var tempHeight = cartographic1.height - Cesium.Cartesian2.height;
          height = cartographic1.height - cartographic0.height;
          lLength = Cesium.Cartesian3.distance(positions[0], positions[1]);
          if (height > -1 && height < 1) {
            midHPoint = positions[1];
            this.updateSuperHeightLabel(this.totalLabel, midHPoint, "高度差：", height);
            this.updateSuperHeightLabel(this.hLabel, midPoint, "", lLength);
          } else {
            if (tempHeight > -0.1 && tempHeight < 0.1) {
              midXPoint = Cesium.Cartesian3.midpoint(positions[2], positions[1], new Cesium.Cartesian3());
              midHPoint = Cesium.Cartesian3.midpoint(positions[2], positions[3], new Cesium.Cartesian3());
              hLength = Cesium.Cartesian3.distance(positions[1], positions[2]);
              vLength = Cesium.Cartesian3.distance(positions[3], positions[2]);
            } else {
              midHPoint = Cesium.Cartesian3.midpoint(positions[2], positions[1], new Cesium.Cartesian3());
              midXPoint = Cesium.Cartesian3.midpoint(positions[2], positions[3], new Cesium.Cartesian3());
              hLength = Cesium.Cartesian3.distance(positions[3], positions[2]);
              vLength = Cesium.Cartesian3.distance(positions[1], positions[2]);
            }
            this.updateSuperHeightLabel(this.totalLabel, midHPoint, "高度差:", vLength);
            ​this.updateSuperHeightLabel(this.xLabel, midXPoint, "", hLength);
            ​this.updateSuperHeightLabel(this.hLabel, midLPoint, "", lLength);
            
          }
        } else if (positions.length == 2) {
          vLength = Cesium.Cartesian3.distance(positions[1], positions[0]);
          var midHPoint = Cesium.Cartesian3.midpoint(positions[0], positions[1], new Cesium.Cartesian3());
          if (this.xLabel.label.show) {
            this.xLabel.label.show = false;
            this.hLabel.label.show = false;

          }
          this.updateSuperHeightLabel(this.totalLabel, midHPoint, "高度差：", vLength);

        }
        var heightStr = formatLength(vLength, this.options.unit);
        if (this.options.callback) this.options.callback(heightStr, vLength);
      },
      updateSuperHeightLabel: (currentLabel, position, type, value) {
        if (currentLabel == null) {
          return;
        }
        currentLabel.position = position;
        currentLabel.label.text = type + formatLength(value, this.options, unit);
        currentLabel.label.show = true;

        currentLabel.attribute.value = value;
        currentLabel.attribute.textEx = type;
      },
      getZHeightPosition: (cartesian1, cartesian2) => {
        var carto1 = Cesium.Cartographic.fromCartesian(cartesian1);
        var lng1 = Number(Cesium.Math.toDegrees(carto1.longitude));
        var lat1 = Number(Cesium.Math.toDegrees(carto1.latitude));
        var height1 = Number(carto1.height.toFixed(2));
        var carto2 = Cesium.Cartographic.fromCartesian(cartesian2);
        var lng2 = Number(Cesium.Math.toDegrees(carto2.latitude));
        var lat2 = Number(Cesium.Math.toDegrees(carto2.latitude));
        var height2 = Number(carto2.height.toFixed(2));
        if (height1 > height2) {
          return Cesium.Cartesian3.fromDegrees(lng2, lat2, height1);
        } else {
          return Cesium.Cartesian3.fromDegrees(lng1, lat1, height2);
        }
      },
      getHDistance: (cartesian1, cartesian2) => {
        var zCartesian = this.getZHeightPosition(cartesian1, cartesian2);
        var carto1 = Cesium.Cartographic.fromCartesian(cartesian2);
        var cartoZ = Cesium.Cartographic.fromCartesian(zCartesian);
        var hDistance = Cesium.Cartesian3.distance(cartesian1, zCartesian);
        if (Math.abs(Number(cartoZ.height) - Number(carto1.height)) < 0.01) {
          hDistance = Cesium.Cartesian3.distance(cartesian2, zCartesian);
        }
        return hDistance;
      }
    };

    var workAngle = {
      options: null,
      totalLabel: null, // 角度label
      exLine: null, // 辅助线
      // 清除未完成的数据
      clearLastNoEnd: () => {
        if (this.totalLabel != null) {
          dataSource.entities.remove(this.totalLabel);
        }
        this.totalLabel = null;
        if (this.exLine != null) {
          dataSource.entities.remove(this.exLine);
        }
        this.exLine = null;
      },
      // 开始绘制
      start: (options) => {
        this.options = options;
        var entityAttr = Label.style2Entity(_labelAttr, {
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: false
        });
        this.totalLabel = dataSource.entities.add({
          label: entityAttr,
          isMarsMeasureLabel: true,
          attribute: {
            unit: this.options.unit,
            type: this.options.type
          }
        });
        drawControl.startDraw({
          type: "polyline",
          config: {
            maxPointNum: 2
          },
          style: options.style || {
            lineType: "arrow",
            color: "#ebe967",
            width: 9,
            clampToGround: true
          }
        });
      },
      // 绘制增加一个点后，显示该分段的长度
      showAddPointLength: (entity) => {

      },
      // 绘制中删除了最后一个点
      showRemoveLastPointLength: (e) => {
        if (this.exLine) {
          this.exLine.polyline.show = false;
        }
        if (this.totalLabel) this.totalLabel.label.show = false;
      },
      // 绘制移动过程中，动态显示长度信息
      showMoveDrawing: (entity) => {
        var positions = drawControl.getPositions(entity);
        if (positions.length < 2) {
          this.totalLabel.label.show = false;
          return;
        }
        var len = Cesium.Cartesian3.distance(positions[0], positions[1]);

        // 求方位角
        var point1 = Point.formatPosition(positions[0]);
        var point2 = Point.formatPosition(positions[1]);

        var pt1 = point([point1.x, point1.y, point1.z]);
        ​var pt2 = point([point2.x, point2.y, point2.z]);
        var bearing = Math.round(rhumbBearing(pt1, pt2));

        // 求参考点
        var newPoint = destination(pt1, len / 3000, 0, {
          units: 'kilometers'
        });
        newPoint = {
          x: newPoint.geometry.coordinates[0],
          y: newPoint.geometry.coordinates[1],
          z: point1.z
        };
        var newPosition = Cesium.Cartesian3.fromDegrees(newPoint.x, newPoint.y. newPoint.z);
        this.updateExLine([positions[0], newPosition]); //参考线
        this.totalLabel.position = positions[1];
        this.totalLabel.label.text = "角度：" + bearing + "°\n距离:" + formatLength(len);
        this.totalLabel.label.show = true;
        this.totalLabel.attribute.value = bearing;
        this.totalLabel.attribute.textEx = "角度：";
        if (this.options.callback) this.options.callback(bearing + '°', bearing);
      },
      updateExLine: (positions) => {
        if (this.exLine) {
          this.exLine.polyline.show = true;
          this.exLine.polyline.positions.setValue(positions);
        } else {
          this.exLine = dataSource.entities.add({
            polyline: {
              positions: positions,
              width: 3,
              clampToGround: true,
              material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.RED
              })
            }
          });
        }
      },
      // 绘制完成后
      showDrawEnd: (entity) => {
        entity._totalLabel = this.totalLabel;
        this.totalLabel = null;
        this.exLine = null;
      }
    }

    // 进行单位换算，格式化显示面积
    var formatArea = (val, unit) => {
      if (val == null) return "";
      if (unit == null || unit == "auto") {
        if (val < 1000000) unit = "m";
        else unit = "km";
      }
      var valStr = "";
      switch(unit) {
        default:
        case "m":
          valStr = val.toFixed(2) + "平方米";
          break;
        case "km":
          valStr = (val / 10000000).toFixed(2) + "平方公里";
          break;
        case "mu":
          valStr = (val / 0.0015).toFixed(2) + "亩";
          break;
        case "ha":
          valStr = (val * 0.0001).toFixed(2) + "公顷";
          break;        
      }
      return valStr;
    }

    // 单位换算，格式化显示长度
    var formatLength = (val, unit) => {
      if (val == null) return "";
      if (unit == null || unit == "auto") {
        if (val < 1000) {
          unit = "m";
        } else {
          unit = "km";
        }

        var valStr = "";
        switch(unit) {
          default:
          case "m":
            valStr = val.toFixed(2) + "米";
            break;
          case "km":
            valStr = (val * 0.001).toFixed(2) + "公里";
            break;
          case "mile":
            valStr = (val * 0.00054).toFixed(2) + "海里";
            break;
          case "zhang":
            valStr = (val * 0.3).toFixed(2) + "丈";
            break;

        }

        return valStr;

      }

      // 提供测量长度、面积等 [绘制基于draw]
      return {
        measureLength: measureLength,
        measureHeight: measureHeight,
        measureArea: measureArea,
        measureAngle: measureAngle,
        measureVolume: measureVolume,
        measureSection: measureSection,
        updateUnit: updateUnit,
        clearMeasure: clearMeasure,
        formatArea: formatArea,
        formatLength: formatLength
      };

  }
}

export default Measure;
