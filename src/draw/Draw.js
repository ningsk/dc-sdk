/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 10:35:38
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 13:17:56
 */

import { Tooltip, Util as DrawUtil } from "../core/index";

import {
  DrawPoint,
  DrawBillboard,
  DrawLabel,
  DrawModel,
  DrawPolyline,
  DrawCurve,
  DrawPolylineVolume,
  DrawCorridor,
  DrawRectangle,
  DrawEllipsoid,
  DrawWall,
  DrawPolygon,
  DrawCircle,
  DrawPModel,
} from "./index";

import { DrawEventType, EditEventType } from "../event/index";

export var Draw = L.Evented.extend({
  dataSource: null,
  primitives: null,
  drawCtrl: null,
  initialize: function () {
    console.log("draw initialize");
    this.currEditFeature = null; // 当前编辑的要素
    this._hasEdit = null;

    this.viewer = viewer;
    this.options = options || {};
    this.dataSource = new Cesium.CustomDataSource(); // 用于entity
    this.viewer.dataSources.add(this.dataSource);

    this.primitives = new Cesium.PrimitiveCollection(); // 用于primitive
    this.viewer.scene.primitives.add(this.primitives);
    if (Cesium.defaultValue(this.options.removeScreenSpaceEvent, true)) {
      this.viewer.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
      this.viewer.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      );
    }

    this.tooltip = new Tooltip(this.viewer.container); // 鼠标提示信息
    this.hasEdit(Cesium.defaultValue(this.options.hasEdit, true)); // 是否可编辑

    // 编辑工具初始化
    var _opts = {
      viewer: this.viewer,
      dataSource: this.dataSource,
      primitives: this.primitives,
      tooltip: this.tooltip,
    };

    // entity
    this.drawCtrl = {
      point: new DrawPoint(_opts),
      billboard: new DrawBillboard(_opts),
      label: new DrawLabel(_opts),
      model: new DrawModel(_opts),
      polyline: new DrawPolyline(_opts),
      curve: new DrawCurve(_opts),
      polylineVolume: new DrawPolylineVolume(_opts),
      corridor: new DrawCorridor(_opts),
      polygon: new DrawPolygon(_opts),
      rectangle: new DrawRectangle(_opts),
      ellipse: new DrawCircle(_opts),
      circle: new DrawCircle(_opts),
      ellipsoid: new DrawEllipsoid(_opts),
      wall: new DrawWall(_opts),
      pModel: new DrawPModel(_opts),
    };

    var that = this;
    for (var type in this.drawCtrl) {
      this.drawCtrl[type]._fire = function (type, data, propagate) {
        that.fire(type, data, propagate);
      };
    }
    // 创建完成后激活编辑
    this.on(
      DrawEventType.DRAW_CREATED,
      (e) => {
        this.startEditing(e.entity);
      },
      this
    );
  },
  // ============ 绘制相关 ================
  startDraw: function (attribute) {
    // 参数是字符串id或uri时
    if (typeof attribute === "string") {
      attribute = {
        type: attribute,
      };
    } else {
      if (attribute == null || attribute.type == null) {
        console.error("需要传入指定绘制的type类型！");
        return;
      }
    }

    var type = attribute.type;
    if (this.drawCtrl[type] == null) {
      console.error("不能进行type为【" + type + "】的绘制，无该类型！");
      return;
    }

    var drawOkCallback;
    if (attribute.success) {
      drawOkCallback = attribute.success;
      delete attribute.success;
    }

    //赋默认值
    attribute = DrawUtil.addGeoJsonDefVal(attribute);

    this.stopDraw();
    var entity = this.drawCtrl[type].activate(attribute, drawOkcallback);
    return entity;
  },
  stopDraw: function () {
    this.stopEditing();
    for (var type in this.drawCtrl) {
      this.drawCtrl[type].disable(true);
    }
  },

  clearDraw: function () {
    // 删除所有
    this.stopDraw();
    this.dataSource.entities.removeAll();
    this.primitives.removeAll();
  },
  // ====编辑相关===
  currEditFeature: null, // 当前编辑的要素
  getCurrentEntity: function () {
    return this.currEditFeature;
  },
  _hasEdit: null,
  hasEdit: function (val) {
    if (this._hasEdit !== null && this._hasEdit === val) {
      return;
    }
    this._hasEdit = val;
    if (val) {
      this.bindSelectEvent();
    } else {
      this.stopEditing();
      this.destroySelectEvent();
    }
  },
  // 绑定鼠标选中事件
  bindSelectEvent: function () {
    var _this = this;

    // 选取对象
    var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    handler.setInputAction((event) => {
      var pickedObject = _this.viewer.scene.pick(event.position);
      if (Cesium.defined(pickedObject)) {
        var entity =
          pickedObject.id ||
          pickedObject.primitive.id ||
          pickedObject.primitive;
        if (entity) {
          if (_this.currEditFeature && _this.currEditFeature === entity) {
            return; // 重复单击了调出
          }
          if (!Cesium.defaultValue(entity.inProgress, false)) {
            _this.startEditing(entity);
            return;
          }
        }
      }
      _this.stopEditing();
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 编辑提示事件
    handler.setInputAction((event) => {
      if (!_this._hasEdit) return;
      _this.tooltip.setVisible(false);
      var pickedObject = _this.viewer.scene.pick(event.endPosition);
      if (Cesium.defined(pickedObject)) {
        var entity =
          pickedObject.id ||
          pickedObject.primitive.id ||
          pickedObject.primitive;
        if (
          entity &&
          entity.editing &&
          !Cesium.defaultValue(entity.inProgress, false)
        ) {
          var tooltip = _this.tooltip;
          setTimeout(() => {
            // Edit中的MOUSE_MOVE会关闭提示，延迟执行。
            tooltip.showAt(event.endPosition, Tooltip.message.edit.start);
          }, 100);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.selectHandler = handler;
  },
  destroySelectEvent: function () {
    this.selectHandler && this.selectHandler.destroy();
    this.selectHandler = undefined;
  },
  startEditing: function (entity) {
    this.stopEditing();
    if (entity == null || !this._hasEdit) return;

    if (entity.editing && entity.editing.activate) {
      entity.editing.activate();
    }
    this.currEditFeature = entity;
  },
  stopEditing: function () {
    if (
      this.currEditFeature &&
      this.currEditFeature.editing &&
      this.currEditFeature.editing.disable
    ) {
      this.currEditFeature.editing.disable();
    }
    this.currEditFeature = null;
  },
  //修改了属性
  updateAttribute: function (attribute, entity) {
    if (entity == null) entity = this.currEditFeature;
    if (entity == null || attribute == null) return;

    attribute.style = attribute.style || {};
    attribute.attr = attribute.attr || {};

    //更新属性
    var type = entity.attribute.type;
    this.drawCtrl[type].style2Entity(attribute.style, entity);
    entity.attribute = attribute;

    //如果在编辑状态，更新绑定的拖拽点
    if (entity.editing) {
      if (entity.editing.updateAttrForEditing)
        entity.editing.updateAttrForEditing();

      if (entity.editing.updateDraggers) entity.editing.updateDraggers();
    }

    //名称 绑定到tooltip
    if (this.options.nameTooltip) {
      var that = this;
      if (entity.attribute.attr && entity.attribute.attr.name) {
        entity.tooltip = {
          html: entity.attribute.attr.name,
          check: function check() {
            return !that._hasEdit;
          },
        };
      } else {
        entity.tooltip = null;
      }
    }
    return entity;
  },
  //修改坐标、高程
  setPositions: function (positions, entity) {
    if (entity == null) entity = this.currEditFeature;
    if (entity == null || positions == null) return;

    //如果在编辑状态，更新绑定的拖拽点
    if (entity.editing) {
      entity.editing.setPositions(positions);
      entity.editing.updateDraggers();
    }
    return entity;
  },
  //==========删除相关==========

  //删除单个
  deleteEntity: function (entity) {
    if (entity == null) entity = this.currEditFeature;
    if (entity == null) return;

    if (entity.editing) {
      entity.editing.disable();
    }
    if (this.dataSource.entities.contains(entity))
      this.dataSource.entities.remove(entity);

    if (this.primitives.contains(entity)) this.primitives.remove(entity);
  },
  //删除所有
  deleteAll: function () {
    this.clearDraw();
  },
  //==========转换GeoJSON==========
  //转换当前所有为geojson
  toGeoJSON: function (entity) {
    this.stopDraw();

    if (entity == null) {
      //全部数据
      var arrEntity = this.getEntities();
      if (arrEntity.length == 0) return null;

      var features = [];
      for (var i = 0, len = arrEntity.length; i < len; i++) {
        var entity = arrEntity[i];
        if (entity.attribute == null || entity.attribute.type == null) continue;

        var type = entity.attribute.type;
        var geojson = this.drawCtrl[type].toGeoJSON(entity);
        if (geojson == null) continue;
        geojson = DrawUtil.removeGeoJsonDefVal(geojson);

        features.push(geojson);
      }
      if (features.length > 0)
        return {
          type: "FeatureCollection",
          features: features,
        };
      else return null;
    } else {
      var type = entity.attribute.type;
      var geojson = this.drawCtrl[type].toGeoJSON(entity);
      geojson = DrawUtil.removeGeoJsonDefVal(geojson);
      return geojson;
    }
  },
  //加载goejson数据
  jsonToEntity: function (json, isClear, isFly) {
    var jsonObjs = json;
    try {
      if (util.isString(json)) jsonObjs = JSON.parse(json);
    } catch (e) {
      util.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
      return;
    }

    if (isClear) {
      this.clearDraw();
    }
    var arrThis = [];
    var jsonFeatures = jsonObjs.features;

    for (var i = 0, len = jsonFeatures.length; i < len; i++) {
      var feature = jsonFeatures[i];

      if (!feature.properties || !feature.properties.type) {
        //非本身保存的外部其他geojson数据
        feature.properties = feature.properties || {};
        switch (feature.geometry.type) {
          case "MultiPolygon":
          case "Polygon":
            feature.properties.type = "polygon";
            break;
          case "MultiLineString":
          case "LineString":
            feature.properties.type = "polyline";
            break;
          case "MultiPoint":
          case "Point":
            feature.properties.type = "point";
            break;
        }
      }

      var type = feature.properties.type;
      if (this.drawCtrl[type] == null) {
        console.log("数据无法识别或者数据的[" + type + "]类型参数有误");
        continue;
      }
      feature.properties.style = feature.properties.style || {};

      //赋默认值
      feature.properties = DrawUtil.addGeoJsonDefVal(feature.properties);

      var entity = this.drawCtrl[type].jsonToEntity(feature);

      //名称 绑定到tooltip
      if (this.options.nameTooltip) {
        if (entity.attribute.attr && entity.attribute.attr.name) {
          var that = this;
          entity.tooltip = {
            html: entity.attribute.attr.name,
            check: function () {
              return !that._hasEdit;
            },
          };
        } else {
          entity.tooltip = null;
        }
      }

      arrThis.push(entity);
    }

    if (isFly) this.viewer.flyTo(arrThis);

    return arrThis;
  },

  //属性转entity
  attributeToEntity: function (attribute, positions) {
    return this.drawCtrl[attribute.type].attributeToEntity(
      attribute,
      positions
    );
  },
  //绑定外部entity到标绘
  bindExtraEntity: function (entity, attribute) {
    var entity = this.drawCtrl[attribute.type].attributeToEntity(
      entity,
      attribute
    );
    this.dataSource.entities.add(entity);
  },
  //==========对外接口==========
  _visible: true,
  setVisible: function (visible) {
    this._visible = visible;
    if (visible) {
      if (!this.viewer.dataSources.contains(this.dataSource))
        this.viewer.dataSources.add(this.dataSource);

      if (!this.viewer.scene.primitives.contains(this.primitives))
        this.viewer.scene.primitives.add(this.primitives);
    } else {
      this.stopDraw();
      if (this.viewer.dataSources.contains(this.dataSource))
        this.viewer.dataSources.remove(this.dataSource, false);

      if (this.viewer.scene.primitives.contains(this.dataSource))
        this.viewer.scene.primitives.remove(this.primitives);
    }
  },
  //是否存在绘制
  hasDraw: function () {
    return this.getEntities().length > 0;
  },
  //获取所有绘制的实体对象列表
  getEntities: function () {
    this.stopDraw();

    var arr = this.dataSource.entities.values;
    arr = arr.concat(this.primitives._primitives);
    return arr;
  },
  getDataSource: function () {
    return this.dataSource;
  },
  getEntityById: function (id) {
    var arrEntity = this.getEntities();
    for (var i = 0, len = arrEntity.length; i < len; i++) {
      var entity = arrEntity[i];
      if (id == entity.attribute.attr.id) {
        return entity;
      }
    }
    return null;
  },
  //获取实体的经纬度值 坐标数组
  getCoordinates: function (entity) {
    var type = entity.attribute.type;
    var coordinate = this.drawCtrl[type].getCoordinates(entity);
    return coordinate;
  },
  //获取实体的坐标数组
  getPositions: function (entity) {
    var type = entity.attribute.type;
    var positions = this.drawCtrl[type].getPositions(entity);
    return positions;
  },

  destroy: function () {
    this.stopDraw();
    this.hasEdit(false);
    this.clearDraw();
    if (this.viewer.dataSources.contains(this.dataSource))
      this.viewer.dataSources.remove(this.dataSource, true);
  },
});
