import { DrawPolyline } from "./DrawPolyline";
import { AttrPolygon } from "../attr/index";
import { PointUtil } from "../core/index";
import { EditPolygon } from "../edit/index";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-27 08:31:47
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 14:05:52
 */

const def_minPointNum = 2;
const def_maxPointNum = 9999;

export var DrawPolygon = DrawPolyline.extend({
  type: "polygon",
  _minPointNum: def_minPointNum, // 至少需要点的个数
  _maxPointNum: def_maxPointNum, // 最多允许点的个数
  createFeature: function (attribute) {
    this._positions_draw = [];
    if (attribute.config) {
      this._minPointNum = attribute.config.minPointNum || def_minPointNum;
      this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum;
    } else {
      this._minPointNum = def_minPointNum;
      this._maxPointNum = def_maxPointNum;
    }

    var that = this;
    var addAttr = {
      polygon: AttrPolygon.style2Entity(attribute.style),
      attribute: attribute,
    };

    addAttr.polygon.hierarchy = new Cesium.CallbackProperty((time) => {
      return that.getDrawPosition();
    }, false);

    addAttr.polyline = {
      clampToGround: attribute.style.clampToGround,
      show: false,
    };

    this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
    this.bindOutline(this.entity); // 边线
    return this.entity;
  },

  style2Entity: function (style, entity) {
    return AttrPolygon.style2Entity(style, entity.polygon);
  },

  bindOutline: function (entity) {
    // 是否显示：绘制前两点时 或 边线宽度大于1时
    entity.polyline.show = new Cesium.CallbackProperty((time) => {
      var arr = entity.polygon.hierarchy.getValue();
      if (arr.length < 3) return true;

      return (
        entity.polygon.outline &&
        entity.polygon.outline.getValue() &&
        entity.polygon.outlineWidth &&
        entity.polygon.outlineWidth.getValue() > 1
      );
    }, false);

    entity.polygon.positions = new Cesium.CallbackProperty((time) => {
      if (!entity.polyline.show.getValue()) {
        return null;
      }
      var arr = entity.polygon.hierarchy.getValue();
      if (arr.length < 3) return arr;
      return arr.concat([arr[0]]);
    }, false);
    entity.polygon.width = new Cesium.CallbackProperty((time) => {
      var arr = entity.polygon.hierarchy.getValue();
      if (arr.length < 3) return 2;
      return entity.polygon.outlineWidth;
    }, false);
    entity.polyline.material = new Cesium.ColorMaterialProperty(
      new Cesium.CallbackProperty((time) => {
        var arr = entity.polygon.hierarchy.getValue();
        if (arr.length < 3) return entity.polygon.material.color.getValue();
        return entity.polygon.outlineColor.getValue();
      }, false)
    );
  },

  updateAttrForDrawing: function () {
    var style = this.entity.attribute.style;
    if (style.extrudedHeight) {
      // 存在extrudedHeight高度设置时
      var maxHeight = PointUtil.getMaxHeight(this.getDrawPosition());
      this.entity.polygon.extrudedHeight =
        maxHeight + Number(style.extrudedHeight);
    }
  },

  getEditClass: function (entity) {
    var _edit = new EditPolygon(entity, this.viewer, this.dataSource);
    _edit._minPointNum = this._minPointNum;
    _edit._maxPointNum = this._maxPointNum;
    return this._bindEdit(_edit);
  },

  // 获取属性处理类
  getAttrClass: function () {
    return AttrPolygon;
  },

  // 图形绘制结束后调用
  finish: function () {
    var entity = this.entity;
    entity.editing = this.getEditClass(entity); // 绑定编辑对象
    entity.polygon.hierarchy = new Cesium.CallbackProperty((time) => {
      return entity._positions_draw;
    }, false);
  },
});
