/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-01 09:25:31
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-30 10:28:43
 */
import * as Cesium from "cesium";
import { Draw } from "./draw/Draw";
import { DrawEventType } from "./event/index";
import { style2Entity } from "./attr/AttrLabel";
import { Util, PointUtil } from "./core/index";

import { AttrLabel, AttrPolygon } from "./attr/index";

export var Measure = function Measure(opts) {
  var viewer = opts.viewer;

  //显示测量结果文本的字体
  var _labelAttr = {
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
    scaleByDistance_farValue: 0.5,
    scaleByDistance_near: 1000,
    scaleByDistance_nearValue: 1,
    pixelOffset: [0, -15],
  };
  if (opts.label) {
    for (var key in opts.label) {
      _labelAttr[key] = opts.label[key];
    }
  }

  var thisType = ""; //当前正在绘制的类别
  var drawControl = new Draw(viewer, {
    hasEdit: false,
  });

  //事件监听
  drawControl.on(DrawEventType.DRAW_ADD_POINT, function (e) {
    var entity = e.entity;
    switch (thisType) {
      case "length":
      case "section":
        workLength.showAddPointLength(entity);
        break;
      case "area":
        workArea.showAddPointLength(entity);
        break;
      case "volume":
        workVolume.showAddPointLength(entity);
        break;
      case "height":
        workHeight.showAddPointLength(entity);
        break;
      case "super_height":
        workSuperHeight.showAddPointLength(entity);
        break;
      case "angle":
        workAngle.showAddPointLength(entity);
        break;
    }
  });
  drawControl.on(DrawEventType.DRAW_MOVE_POINT, function (e) {
    switch (thisType) {
      case "length":
      case "section":
        workLength.showRemoveLastPointLength(e);
        break;
      case "area":
        workArea.showRemoveLastPointLength(e);
        break;
      case "volume":
        workVolume.showRemoveLastPointLength(e);
        break;
      case "height":
        workHeight.showRemoveLastPointLength(e);
        break;
      case "super_height":
        workSuperHeight.showRemoveLastPointLength(e);
        break;
      case "angle":
        workAngle.showRemoveLastPointLength(e);
        break;
    }
  });
  drawControl.on(DrawEventType.DRAW_MOUSE_MOVE, function (e) {
    var entity = e.entity;
    switch (thisType) {
      case "length":
      case "section":
        workLength.showMoveDrawing(entity);
        break;
      case "area":
        workArea.showMoveDrawing(entity);
        break;
      case "volume":
        workVolume.showMoveDrawing(entity);
        break;
      case "height":
        workHeight.showMoveDrawing(entity);
        break;
      case "super_height":
        workSuperHeight.showMoveDrawing(entity);
        break;
      case "angle":
        workAngle.showMoveDrawing(entity);
        break;
    }
  });

  drawControl.on(DrawEventType.DRAW_CREATED, function (e) {
    var entity = e.entity;
    switch (thisType) {
      case "length":
      case "section":
        workLength.showDrawEnd(entity);
        break;
      case "area":
        workArea.showDrawEnd(entity);
        break;
      case "volume":
        workVolume.showDrawEnd(entity);
        break;
      case "height":
        workHeight.showDrawEnd(entity);
        break;
      case "super_height":
        workSuperHeight.showDrawEnd(entity);
        break;
      case "angle":
        workAngle.showDrawEnd(entity);
        break;
    }
  });

  var dataSource = drawControl.getDataSource();

  /*长度测量*/
  function measureLength(options) {
    endLastDraw();

    thisType = "length";
    options = options || {};
    options.type = thisType;
    if (!options.hasOwnProperty("terrain")) options.terrain = true;

    workLength.start(options);
  }

  /*剖面分析*/
  function measureSection(options) {
    endLastDraw();

    thisType = "section";
    options = options || {};
    options.type = thisType;
    options.terrain = true;

    workLength.start(options);
  }

  /*面积测量*/
  function measureArea(options) {
    endLastDraw();

    thisType = "area";
    options = options || {};
    options.type = thisType;

    workArea.start(options);
  }

  /*体积测量*/
  function measureVolume(options) {
    endLastDraw();

    thisType = "volume";
    options = options || {};
    options.type = thisType;

    workVolume.start(options);
  }

  /*高度测量*/
  function measureHeight(options) {
    endLastDraw();

    options = options || {};

    if (options.hasOwnProperty("isSuper") && !options.isSuper) {
      thisType = "height";
      options.type = thisType;
      workHeight.start(options);
    } else {
      thisType = "super_height";
      options.type = thisType;
      workSuperHeight.start(options);
    }
  }

  /*角度测量*/
  function measureAngle(options) {
    endLastDraw();

    thisType = "angle";
    options = options || {};
    options.type = thisType;

    workAngle.start(options);
  }

  //如果上次未完成绘制就单击了新的，清除之前未完成的。
  function endLastDraw() {
    workLength.clearLastNoEnd();
    workArea.clearLastNoEnd();
    workVolume.clearLastNoEnd();
    workHeight.clearLastNoEnd();
    workSuperHeight.clearLastNoEnd();
    workAngle.clearLastNoEnd();

    drawControl.stopDraw();
  }

  /*清除测量*/
  function clearMeasure() {
    thisType = "";
    endLastDraw();

    //dataSource.entities.removeAll();
    drawControl.deleteAll();
  }

  /** 更新量测结果的单位  */
  function updateUnit(thisType, unit) {
    var arr = dataSource.entities.values;
    for (var i in arr) {
      var entity = arr[i];
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
  }

  var workLength = {
    options: null,
    arrLables: [], //各线段label
    totalLable: null, //总长label
    disTerrainScale: 1.2, //贴地时的概略比例
    //清除未完成的数据
    clearLastNoEnd: function () {
      if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
      if (this.arrLables && this.arrLables.length > 0) {
        var arrLables = this.arrLables;
        if (arrLables && arrLables.length > 0) {
          for (var i in arrLables) {
            dataSource.entities.remove(arrLables[i]);
          }
        }
      }
      this.totalLable = null;
      this.arrLables = [];
    },
    //开始绘制
    start: function (options) {
      this.options = options;

      //总长label
      var entityattr = AttrLabel.style2Entity(_labelAttr, {
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: false,
      });

      this.totalLable = dataSource.entities.add({
        label: entityattr,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });
      this.arrLables = [];

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
          clampToGround: this.options.type == "section" || this.options.terrain, //是否贴地
        },
      });
    },
    //绘制增加一个点后，显示该分段的长度
    showAddPointLength: function (entity) {
      var positions = drawControl.getPositions(entity);

      var entityattr = AttrLabel.style2Entity(_labelAttr, {
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: true,
      });

      var tempSingleLabel = dataSource.entities.add({
        position: positions[positions.length - 1],
        label: entityattr,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      if (positions.length == 1) {
        tempSingleLabel.label.text = "起点";
        //tempSingleLabel.attribute.value = 0;
      } else {
        var distance = this.getLength(positions);
        var distancestr = formatLength(distance, this.options.unit);

        tempSingleLabel.label.text = distancestr;
        tempSingleLabel.attribute.value = distance;

        //屏蔽比较小的数值
        if (
          this.getLength([
            positions[positions.length - 2],
            positions[positions.length - 1],
          ]) < 5
        )
          tempSingleLabel.show = false;
      }
      this.arrLables.push(tempSingleLabel);
    },
    showRemoveLastPointLength: function (e) {
      var label = this.arrLables.pop();
      dataSource.entities.remove(label);

      this.showMoveDrawing(e.entity);
      this.totalLable.position = e.position;
    },
    //绘制过程移动中，动态显示长度信息
    showMoveDrawing: function (entity) {
      var positions = drawControl.getPositions(entity);
      if (positions.length < 2) {
        this.totalLable.label.show = false;
        return;
      }

      var distance = this.getLength(positions);
      var distancestr = formatLength(distance, this.options.unit);

      this.totalLable.position = positions[positions.length - 1];
      this.totalLable.label.text = "总长:" + distancestr;
      this.totalLable.label.show = true;

      this.totalLable.attribute.value = distance;
      this.totalLable.attribute.textEx = "总长:";

      if (this.options.callback) this.options.callback(distancestr, distance);
    },
    //绘制完成后
    showDrawEnd: function (entity) {
      var positions = drawControl.getPositions(entity);
      var count = this.arrLables.length - positions.length;
      if (count >= 0) {
        for (
          var i = this.arrLables.length - 1;
          i >= positions.length - 1;
          i--
        ) {
          dataSource.entities.remove(this.arrLables[i]);
        }
        this.arrLables.splice(positions.length - 1, count + 1);
      }
      entity._totalLable = this.totalLable;
      entity._arrLables = this.arrLables;

      this.totalLable = null;
      this.arrLables = [];

      if (entity.polyline == null) return;

      if (this.options.type == "section") this.updateSectionForTerrain(entity);
      else if (this.options.terrain) this.updateLengthForTerrain(entity);
    },
    //计算贴地线
    updateLengthForTerrain: function (entity) {
      var that = this;
      var positions = entity.polyline.positions.getValue();
      var arrLables = entity._arrLables;
      var totalLable = entity._totalLable;
      var unit = totalLable && totalLable.unit;

      var index = 0;
      var all_distance = 0;

      function getLineFD() {
        index++;

        if (index >= positions.length && totalLable) {
          var distancestr = formatLength(all_distance, unit);

          totalLable.label.text = "总长:" + distancestr;
          totalLable.attribute.value = all_distance;

          if (that.options.callback)
            that.options.callback(distancestr, all_distance);
          return;
        }

        var arr = [positions[index - 1], positions[index]];
        Util.terrainPolyline({
          viewer: viewer,
          positions: arr,
          callback: function callback(raisedPositions, noHeight) {
            var distance = that.getLength(raisedPositions);
            if (noHeight) {
              distance = distance * that.disTerrainScale; //求高度失败，概略估算值
            }

            var thisLabel = arrLables[index];
            if (thisLabel) {
              var distancestr = formatLength(distance, unit);

              thisLabel.label.text = distancestr;
              thisLabel.attribute.value = distance;
            }

            all_distance += distance;
            getLineFD();
          },
        });
      }
      getLineFD();
    },

    //计算剖面
    updateSectionForTerrain: function (entity) {
      var positions = entity.polyline.positions.getValue();
      if (positions.length < 2) return;

      var arrLables = entity._arrLables;
      var totalLable = entity._totalLable;
      var unit = totalLable && totalLable.unit;

      var index = 0;
      var positionsNew = [];

      var alllen = 0;
      var arrLen = [];
      var arrHB = [];
      var arrLX = [];
      var arrPoint = [];

      var that = this;

      function getLineFD() {
        index++;

        var arr = [positions[index - 1], positions[index]];
        (0, _util.terrainPolyline)({
          viewer: viewer,
          positions: arr,
          callback: function (raisedPositions, noHeight) {
            if (noHeight) {
              if (index == 1) positionsNew = positionsNew.concat(arr);
              else positionsNew = positionsNew.concat([positions[index]]);
            } else {
              positionsNew = positionsNew.concat(raisedPositions);
            }

            var h1 = Cesium.Cartographic.fromCartesian(positions[index - 1])
              .height;
            var h2 = Cesium.Cartographic.fromCartesian(positions[index]).height;
            var hstep = (h2 - h1) / raisedPositions.length;

            for (var i = 0; i < raisedPositions.length; i++) {
              //长度
              if (i != 0) {
                alllen += Cesium.Cartesian3.distance(
                  raisedPositions[i],
                  raisedPositions[i - 1]
                );
              }
              arrLen.push(Number(alllen.toFixed(1)));

              //海拔高度
              var point = PointUtil.formatPosition(raisedPositions[i]);
              arrHB.push(point.z);
              arrPoint.push(point);

              //路线高度
              var fxgd = Number((h1 + hstep * i).toFixed(1));
              arrLX.push(fxgd);
            }

            if (index >= positions.length - 1) {
              if (totalLable) {
                var distance = that.getLength(positionsNew);
                var distancestr = formatLength(distance, unit);

                totalLable.label.text = "总长:" + distancestr;
                totalLable.attribute.value = distance;
              }
              if (that.options.callback)
                that.options.callback({
                  distancestr: distancestr,
                  distance: distance,
                  arrLen: arrLen,
                  arrLX: arrLX,
                  arrHB: arrHB,
                  arrPoint: arrPoint,
                });
            } else {
              var distance = that.getLength(raisedPositions);
              var distancestr = formatLength(distance, unit);

              var thisLabel = arrLables[index];
              thisLabel.label.text = distancestr;
              thisLabel.attribute.value = distance;

              getLineFD();
            }
          },
        });
      }
      getLineFD();
    },
    //计算长度，单位：米
    getLength: function (positions) {
      var distance = 0;
      for (var i = 0, len = positions.length - 1; i < len; i++) {
        distance += Cesium.Cartesian3.distance(positions[i], positions[i + 1]);
      }
      return distance;
    },
  };

  var workArea = {
    options: null,
    totalLable: null, //面积label
    //清除未完成的数据
    clearLastNoEnd: function () {
      if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
      this.totalLable = null;
    },
    //开始绘制
    start: function (options) {
      this.options = options;

      var entityattr = AttrLabel.style2Entity(_labelAttr, {
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: false,
      });

      this.totalLable = dataSource.entities.add({
        label: entityattr,
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
          clampToGround: true, //贴地
        },
      });
    },
    //绘制增加一个点后，显示该分段的长度
    showAddPointLength: function (entity) {},
    //绘制中删除了最后一个点
    showRemoveLastPointLength: function (e) {
      var positions = drawControl.getPositions(e.entity);
      if (positions.length < 3) {
        this.totalLable.label.show = false;
      }
    },
    //绘制过程移动中，动态显示长度信息
    showMoveDrawing: function (entity) {
      var positions = drawControl.getPositions(entity);
      if (positions.length < 3) {
        this.totalLable.label.show = false;
        return;
      }

      var polygon = AttrPolygon.toGeoJSON(entity);
      var area = turf.area(polygon);
      var areastr = formatArea(area, this.options.unit);

      //求中心点
      var center = turf.centerOfMass(polygon);
      var maxHeight = PointUtil.getMaxHeight(positions);
      var ptcenter = Cesium.Cartesian3.fromDegrees(
        center.geometry.coordinates[0],
        center.geometry.coordinates[1],
        maxHeight + 1
      );

      this.totalLable.position = ptcenter;
      this.totalLable.label.text = "面积:" + areastr;
      this.totalLable.label.show = true;

      this.totalLable.attribute.value = area;
      this.totalLable.attribute.textEx = "面积:";

      if (this.options.callback) this.options.callback(areastr, area);
    },
    //绘制完成后
    showDrawEnd: function (entity) {
      if (entity.polygon == null) return;

      var polyPositions = entity.polygon.hierarchy.getValue();

      //最后的高程加1，以确保端点显示在模型上面
      for (var i = 0, len = polyPositions.length; i < len; i++) {
        polyPositions[i].z = polyPositions[i].z + 1;
      }

      entity._totalLable = this.totalLable;
      this.totalLable = null;
    },
  };

  var workVolume = {
    options: null,
    totalLable: null, //体积label
    prevEntity: null, //立体边界
    //清除未完成的数据
    clearLastNoEnd: function () {
      if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
      this.totalLable = null;

      if (this.prevEntity != null) dataSource.entities.remove(this.prevEntity);
      this.prevEntity = null;
    },
    //开始绘制
    start: function (options) {
      this.options = options;

      var entityattr = AttrLabel.style2Entity(_labelAttr, {
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: false,
      });

      this.totalLable = dataSource.entities.add({
        label: entityattr,
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
          clampToGround: true, //贴地
        },
      });
    },
    //绘制增加一个点后，显示该分段的长度
    showAddPointLength: function (entity) {},
    //绘制中删除了最后一个点
    showRemoveLastPointLength: function (e) {},
    //绘制过程移动中，动态显示长度信息
    showMoveDrawing: function (entity) {},
    //绘制完成后
    showDrawEnd: function (entity) {
      if (entity.polygon == null) return;

      var positions = entity.polygon.hierarchy.getValue();
      var result = this.computeCutVolume(positions);

      var maxHeight = result.maxHeight;
      var totalCutVolume = result.totalCutVolume;

      var totalCutVolumestr = totalCutVolume.toFixed(2) + "立方米"; ///formatArea(totalCutVolume, this.options.unit);

      //求中心点
      var centroid = this.computeCentroidOfPolygon(positions);
      var ptcenter = Cesium.Cartesian3.fromRadians(
        centroid.longitude,
        centroid.latitude,
        maxHeight + 10
      );

      this.totalLable.position = ptcenter;
      this.totalLable.label.text = "挖方体积:" + totalCutVolumestr;
      this.totalLable.label.show = true;

      this.totalLable.attribute.value = totalCutVolume;
      this.totalLable.attribute.textEx = "挖方体积:";

      if (this.options.callback) this.options.callback(areastr, totalCutVolume);

      dataSource.entities.remove(entity);
      //显示立体边界
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
          ).withAlpha(0.4),
          outlineWidth: 1,
        },
      });

      entity._totalLable = this.totalLable;
      this.totalLable = null;
    },
    computeCutVolume: function (positions) {
      var minHeight = 15000;
      for (var i = 0; i < positions.length; i++) {
        var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
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
      //polygon subdivision
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
          geom.attributes.position.values[i0 * 3],
          geom.attributes.position.values[i0 * 3 + 1],
          geom.attributes.position.values[i0 * 3 + 2]
        );

        cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        height1 = viewer.scene.globe.getHeight(cartographic);
        p1 = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          0 /*height1 + 1000*/
        );

        if (maxHeight < height1) maxHeight = height1;

        cartesian = new Cesium.Cartesian3(
          geom.attributes.position.values[i1 * 3],
          geom.attributes.position.values[i1 * 3 + 1],
          geom.attributes.position.values[i1 * 3 + 2]
        );

        cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        height2 = viewer.scene.globe.getHeight(cartographic);

        var p2 = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          0 /*height2 + 1000*/
        );

        if (maxHeight < height2) maxHeight = height2;

        cartesian = new Cesium.Cartesian3(
          geom.attributes.position.values[i2 * 3],
          geom.attributes.position.values[i2 * 3 + 1],
          geom.attributes.position.values[i2 * 3 + 2]
        );

        cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        height3 = viewer.scene.globe.getHeight(cartographic);
        p3 = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          0 /*height3 + 1000*/
        );

        if (maxHeight < height3) maxHeight = height3;

        bottomArea = this.computeAreaOfTriangle(p1, p2, p3);
        totalCutVolume =
          totalCutVolume +
          (bottomArea *
            (height1 - minHeight + height2 - minHeight + height3 - minHeight)) /
            3;
      }

      return {
        maxHeight: maxHeight,
        totalCutVolume: totalCutVolume,
      };
    },
    computeAreaOfTriangle: function (pos1, pos2, pos3) {
      var a = Cesium.Cartesian3.distance(pos1, pos2);
      var b = Cesium.Cartesian3.distance(pos2, pos3);
      var c = Cesium.Cartesian3.distance(pos3, pos1);
      var S = (a + b + c) / 2;
      return Math.sqrt(S * (S - a) * (S - b) * (S - c));
    },
    //求面的中心点
    computeCentroidOfPolygon: function (positions) {
      var x = [];
      var y = [];

      for (var i = 0; i < positions.length; i++) {
        var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);

        x.push(cartographic.longitude);
        y.push(cartographic.latitude);
      }

      var x0 = 0.0,
        y0 = 0.0,
        x1 = 0.0,
        y1 = 0.0;
      var signedArea = 0.0;
      var a = 0.0;
      var centroidx = 0.0,
        centroidy = 0.0;

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
        centroidx += (x0 + x1) * a;
        centroidy += (y0 + y1) * a;
      }

      signedArea *= 0.5;
      centroidx /= 6.0 * signedArea;
      centroidy /= 6.0 * signedArea;

      return new Cesium.Cartographic(centroidx, centroidy);
    },
  };

  var workHeight = {
    options: null,
    totalLable: null, //高度label
    //清除未完成的数据
    clearLastNoEnd: function () {
      if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
      this.totalLable = null;
    },
    //开始绘制
    start: function (options) {
      this.options = options;

      var entityattr = AttrLabel.style2Entity(_labelAttr, {
        horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: false,
      });

      this.totalLable = dataSource.entities.add({
        label: entityattr,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      drawControl.startDraw({
        type: "polyline",
        config: {
          maxPointNum: 2,
        },
        style: options.style || {
          lineType: "glow",
          color: "#ebe12c",
          width: 9,
          glowPower: 0.1,
        },
      });
    },
    //绘制增加一个点后，显示该分段的长度
    showAddPointLength: function (entity) {},
    //绘制中删除了最后一个点
    showRemoveLastPointLength: function (e) {
      if (this.totalLable) this.totalLable.label.show = false;
    },
    //绘制过程移动中，动态显示长度信息
    showMoveDrawing: function (entity) {
      var positions = drawControl.getPositions(entity);
      if (positions.length < 2) {
        this.totalLable.label.show = false;
        return;
      }

      var cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
      var cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
      var height = Math.abs(cartographic1.height - cartographic.height);
      var heightstr = formatLength(height, this.options.unit);

      this.totalLable.position = Cesium.Cartesian3.midpoint(
        positions[0],
        positions[1],
        new Cesium.Cartesian3()
      );
      this.totalLable.label.text = "高度差:" + heightstr;
      this.totalLable.label.show = true;

      this.totalLable.attribute.value = height;
      this.totalLable.attribute.textEx = "高度差:";

      if (this.options.callback) this.options.callback(heightstr, height);
    },
    //绘制完成后
    showDrawEnd: function (entity) {
      entity._totalLable = this.totalLable;
      this.totalLable = null;
    },
  };

  var workSuperHeight = {
    options: null,
    totalLable: null, //高度差label
    xLable: null, //水平距离label
    hLable: null, //水平距离label
    //清除未完成的数据
    clearLastNoEnd: function () {
      if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
      if (this.xLable != null) dataSource.entities.remove(this.xLable);
      if (this.hLable != null) dataSource.entities.remove(this.hLable);

      this.totalLable = null;
      this.xLable = null;
      this.hLable = null;
    },
    //开始绘制
    start: function (options) {
      this.options = options;

      var entityattr = AttrLabel.style2Entity(_labelAttr, {
        horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        show: false,
      });
      this.totalLable = dataSource.entities.add({
        label: entityattr,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      var entityattr2 = AttrLabel.style2Entity(_labelAttr, {
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: false,
      });
      entityattr2.pixelOffset = new Cesium.Cartesian2(0, 0);
      this.xLable = dataSource.entities.add({
        label: entityattr2,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      this.hLable = dataSource.entities.add({
        label: entityattr2,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      drawControl.startDraw({
        type: "polyline",
        //minMaxPoints: { min: 2, max: 2, isSuper: true },
        config: {
          maxPointNum: 2,
        },
        style: options.style || {
          lineType: "glow",
          color: "#ebe12c",
          width: 9,
          glowPower: 0.1,
        },
      });
    },
    //绘制增加一个点后，显示该分段的长度
    showAddPointLength: function (entity) {
      var lonlats = drawControl.getPositions(entity);
      if (lonlats.length == 4) {
        var mouseEndPosition = lonlats[3].clone();
        lonlats.pop();
        lonlats.pop();
        lonlats.pop();
        lonlats.push(mouseEndPosition);
      }

      if (lonlats.length == 2) {
        var zCartesian = this.getZHeightPosition(lonlats[0], lonlats[1]);
        var hDistance = this.getHDistance(lonlats[0], lonlats[1]);
        if (hDistance > 3.0) {
          lonlats.push(zCartesian);
          lonlats.push(lonlats[0]);
        }
      }

      this.showSuperHeight(lonlats);
    },
    //绘制中删除了最后一个点
    showRemoveLastPointLength: function (e) {
      var lonlats = drawControl.getPositions(e.entity);
      if (lonlats.length == 2) {
        lonlats.pop();
        lonlats.pop();

        this.totalLable.label.show = false;
        this.hLable.label.show = false;
        this.xLable.label.show = false;
      }
    },
    //绘制过程移动中，动态显示长度信息
    showMoveDrawing: function (entity) {
      var lonlats = drawControl.getPositions(entity);
      if (lonlats.length == 4) {
        var mouseEndPosition = lonlats[3].clone();
        lonlats.pop();
        lonlats.pop();
        lonlats.pop();
        lonlats.push(mouseEndPosition);
      }

      if (lonlats.length == 2) {
        var zCartesian = this.getZHeightPosition(lonlats[0], lonlats[1]);
        var hDistance = this.getHDistance(lonlats[0], lonlats[1]);
        if (hDistance > 3.0) {
          lonlats.push(zCartesian);
          lonlats.push(lonlats[0]);
        }
      }
      this.showSuperHeight(lonlats);
    },
    //绘制完成后
    showDrawEnd: function (entity) {
      entity._arrLables = [this.totalLable, this.hLable, this.xLable];

      this.totalLable = null;
      this.hLable = null;
      this.xLable = null;
    },

    /**
     * 超级 高程测量
     * 由4个点形成的三角形（首尾点相同），计算该三角形三条线段的长度
     * @param {Array} positions 4个点形成的点数组
     */
    showSuperHeight: function (positions) {
      var vLength; //垂直距离
      var hLength; //水平距离
      var lLength; //长度
      var height;
      if (positions.length == 4) {
        var midLPoint = Cesium.Cartesian3.midpoint(
          positions[0],
          positions[1],
          new Cesium.Cartesian3()
        );
        var midXPoint, midHPoint;
        var cartographic0 = Cesium.Cartographic.fromCartesian(positions[0]);
        var cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
        var cartographic2 = Cesium.Cartographic.fromCartesian(positions[2]);
        var tempHeight = cartographic1.height - cartographic2.height;
        height = cartographic1.height - cartographic0.height;
        lLength = Cesium.Cartesian3.distance(positions[0], positions[1]);
        if (height > -1 && height < 1) {
          midHPoint = positions[1];
          this.updateSuperHeightLabel(
            this.totalLable,
            midHPoint,
            "高度差:",
            height
          );
          this.updateSuperHeightLabel(this.hLable, midLPoint, "", lLength);
        } else {
          if (tempHeight > -0.1 && tempHeight < 0.1) {
            midXPoint = Cesium.Cartesian3.midpoint(
              positions[2],
              positions[1],
              new Cesium.Cartesian3()
            );
            midHPoint = Cesium.Cartesian3.midpoint(
              positions[2],
              positions[3],
              new Cesium.Cartesian3()
            );
            hLength = Cesium.Cartesian3.distance(positions[1], positions[2]);
            vLength = Cesium.Cartesian3.distance(positions[3], positions[2]);
          } else {
            midHPoint = Cesium.Cartesian3.midpoint(
              positions[2],
              positions[1],
              new Cesium.Cartesian3()
            );
            midXPoint = Cesium.Cartesian3.midpoint(
              positions[2],
              positions[3],
              new Cesium.Cartesian3()
            );
            hLength = Cesium.Cartesian3.distance(positions[3], positions[2]);
            vLength = Cesium.Cartesian3.distance(positions[1], positions[2]);
          }
          this.updateSuperHeightLabel(
            this.totalLable,
            midHPoint,
            "高度差:",
            vLength
          );
          this.updateSuperHeightLabel(this.xLable, midXPoint, "", hLength);
          this.updateSuperHeightLabel(this.hLable, midLPoint, "", lLength);
        }
      } else if (positions.length == 2) {
        vLength = Cesium.Cartesian3.distance(positions[1], positions[0]);
        var midHPoint = Cesium.Cartesian3.midpoint(
          positions[0],
          positions[1],
          new Cesium.Cartesian3()
        );
        if (xLable.label.show) {
          xLable.label.show = false;
          hLable.label.show = false;
        }
        this.updateSuperHeightLabel(
          this.totalLable,
          midHPoint,
          "高度差:",
          vLength
        );
      }

      var heightstr = formatLength(vLength, this.options.unit);
      if (this.options.callback) this.options.callback(heightstr, vLength);
    },
    /**
     * 超级 高程测量 显示标签
     * @param {Cesium.Label} currentLabel 显示标签
     * @param {Cesium.Cartesian3} postion 坐标位置
     * @param {String} type 类型("高度差"，"水平距离"，"长度")
     * @param {Object} value 值
     */
    updateSuperHeightLabel: function (currentLabel, postion, type, value) {
      if (currentLabel == null) return;

      currentLabel.position = postion;
      currentLabel.label.text = type + formatLength(value, this.options.unit);
      currentLabel.label.show = true;

      currentLabel.attribute.value = value;
      currentLabel.attribute.textEx = type;
    },

    /**
     * 带有高度差的两点，判断其直角点
     */
    getZHeightPosition: function (cartesian1, cartesian2) {
      var carto1 = Cesium.Cartographic.fromCartesian(cartesian1);
      var lng1 = Number(Cesium.Math.toDegrees(carto1.longitude));
      var lat1 = Number(Cesium.Math.toDegrees(carto1.latitude));
      var height1 = Number(carto1.height.toFixed(2));

      var carto2 = Cesium.Cartographic.fromCartesian(cartesian2);
      var lng2 = Number(Cesium.Math.toDegrees(carto2.longitude));
      var lat2 = Number(Cesium.Math.toDegrees(carto2.latitude));
      var height2 = Number(carto2.height.toFixed(2));

      if (height1 > height2)
        return Cesium.Cartesian3.fromDegrees(lng2, lat2, height1);
      else return Cesium.Cartesian3.fromDegrees(lng1, lat1, height2);
    },

    /**
     * 带有高度差的两点，计算两点间的水平距离
     */
    getHDistance: function (cartesian1, cartesian2) {
      var zCartesian = this.getZHeightPosition(cartesian1, cartesian2);

      var carto1 = Cesium.Cartographic.fromCartesian(cartesian2);
      var cartoZ = Cesium.Cartographic.fromCartesian(zCartesian);

      var hDistance = Cesium.Cartesian3.distance(cartesian1, zCartesian);

      if (Math.abs(Number(cartoZ.height) - Number(carto1.height)) < 0.01) {
        hDistance = Cesium.Cartesian3.distance(cartesian2, zCartesian);
      }

      return hDistance;
    },
  };

  var workAngle = {
    options: null,
    totalLable: null, //角度label
    exLine: null, //辅助线
    //清除未完成的数据
    clearLastNoEnd: function () {
      if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
      this.totalLable = null;

      if (this.exLine != null) dataSource.entities.remove(this.exLine);
      this.exLine = null;
    },
    //开始绘制
    start: function (options) {
      this.options = options;

      var entityattr = AttrLabel.style2Entity(_labelAttr, {
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        show: false,
      });

      this.totalLable = dataSource.entities.add({
        label: entityattr,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      drawControl.startDraw({
        type: "polyline",
        config: {
          maxPointNum: 2,
        },
        style: options.style || {
          lineType: "arrow",
          color: "#ebe967",
          width: 9,
          clampToGround: true,
        },
      });
    },
    //绘制增加一个点后，显示该分段的长度
    showAddPointLength: function (entity) {},
    //绘制中删除了最后一个点
    showRemoveLastPointLength: function (e) {
      if (this.exLine) {
        this.exLine.polyline.show = false;
      }
      if (this.totalLable) this.totalLable.label.show = false;
    },
    //绘制过程移动中，动态显示长度信息
    showMoveDrawing: function (entity) {
      var positions = drawControl.getPositions(entity);
      if (positions.length < 2) {
        this.totalLable.label.show = false;
        return;
      }

      var len = Cesium.Cartesian3.distance(positions[0], positions[1]);

      //求方位角
      var point1 = PointUtil.formatPosition(positions[0]);
      var point2 = PointUtil.formatPosition(positions[1]);

      var pt1 = turf.point([point1.x, point1.y, point1.z]);
      var pt2 = turf.point([point2.x, point2.y, point2.z]);
      var bearing = Math.round(turf.rhumbBearing(pt1, pt2));

      //求参考点x
      var newpoint = turf.destination(pt1, len / 3000, 0, {
        units: "kilometers",
      }); //1/3
      newpoint = {
        x: newpoint.geometry.coordinates[0],
        y: newpoint.geometry.coordinates[1],
        z: point1.z,
      };
      var new_position = Cesium.Cartesian3.fromDegrees(
        newpoint.x,
        newpoint.y,
        newpoint.z
      );

      this.updateExLine([positions[0], new_position]); //参考线

      this.totalLable.position = positions[1];
      this.totalLable.label.text =
        "角度:" + bearing + "°\n距离:" + formatLength(len);
      this.totalLable.label.show = true;

      this.totalLable.attribute.value = bearing;
      this.totalLable.attribute.textEx = "角度:";

      if (this.options.callback) this.options.callback(bearing + "°", bearing);
    },
    updateExLine: function (positions) {
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
              color: Cesium.Color.RED,
            }),
          },
        });
      }
    },
    //绘制完成后
    showDrawEnd: function (entity) {
      entity._totalLable = this.totalLable;
      this.totalLable = null;
      this.exLine = null;
    },
  };

  /**  进行单位换算，格式化显示面积    */
  function formatArea(val, unit) {
    if (val == null) return "";

    if (unit == null || unit == "auto") {
      if (val < 1000000) unit = "m";
      else unit = "km";
    }

    var valstr = "";
    switch (unit) {
      default:
      case "m":
        valstr = val.toFixed(2) + "平方米";
        break;
      case "km":
        valstr = (val / 1000000).toFixed(2) + "平方公里";
        break;
      case "mu":
        valstr = (val * 0.0015).toFixed(2) + "亩";
        break;
      case "ha":
        valstr = (val * 0.0001).toFixed(2) + "公顷";
        break;
    }

    return valstr;
  }

  /**  单位换算，格式化显示长度     */
  function formatLength(val, unit) {
    if (val == null) return "";

    if (unit == null || unit == "auto") {
      if (val < 1000) unit = "m";
      else unit = "km";
    }

    var valstr = "";
    switch (unit) {
      default:
      case "m":
        valstr = val.toFixed(2) + "米";
        break;
      case "km":
        valstr = (val * 0.001).toFixed(2) + "公里";
        break;
      case "mile":
        valstr = (val * 0.00054).toFixed(2) + "海里";
        break;
      case "zhang":
        valstr = (val * 0.3).toFixed(2) + "丈";
        break;
    }
    return valstr;
  }

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
    formatLength: formatLength,
  };
}; //提供测量长度、面积等 [绘制基于draw]
