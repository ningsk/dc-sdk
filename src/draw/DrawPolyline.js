import { DrawBase } from "./DrawBase";
import { Polyline } from "../overlay/index";
import Cesium from "cesium";
import { PointUtil } from "../utils/index";
import { DrawEventType, EditEventType } from "../event/index";
import { TooltipUtil as Tooltip } from "../utils/index";
import { EditPolyline } from "../edit/index";

const def_minPointNum = 2;
const def_maxPointNum = 9999;

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:32:11
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-11 09:05:55
 */
export var DrawPolyline = DrawBase.extend({
  type: "polyline",
  // 坐标位置相关
  _minPointNum: def_minPointNum, // 至少需要点的个数
  _maxPointNum: def_maxPointNum, // 最多允许点的个数

  // 根据attribute参数Entity
  createFeature: function (attribute) {
    this._positions_draw = [];
    console.log("createFeature");
    if (attribute.config) {
      // 允许外部传入
      this._minPointNum = attribute.config.minPointNum || def_minPointNum;
      this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum;
    } else {
      this._minPointNum = def_minPointNum;
      this._maxPointNum = def_maxPointNum;
    }

    var that = this;
    var addAttr = {
      polyline: Polyline.style2Entity(attribute.style),
      attribute: attribute,
    };

    addAttr.polyline.positions = new Cesium.CallbackProperty((time) => {
      return that.getDrawPosition();
    }, false);

    this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
    this.entity._positions_draw = this._positions_draw;
    return this.entity;
  },

  style2Entity: function (style, entity) {
    return Polyline.style2Entity(style, entity.polyline);
  },

  // 绑定鼠标事件
  bindEvent: function () {
    var _this = this;
    var lastPointTemporary = false;
    this.getHandler().setInputAction((event) => {
      // 单击添加点
      console.log("单击添加点");
      var point = PointUtil.getCurrentMousePosition(
        _this.viewer.scene,
        event.position,
        _this.entity
      );

      if (point) {
        if (lastPointTemporary) {
          _this._positions_draw.pop();
        }

        lastPointTemporary = false;
        // 在绘制点基础自动增加高度
        if (
          _this.entity.attribute &&
          _this.entity.attribute.config &&
          _this.entity.attribute.config.addHeight
        ) {
          point = PointUtil.addPositionsHeight(
            point,
            _this.entity.attribute.config.addHeight
          );
        }
        // 获取模型高度
        if (
          _this.entity.attribute &&
          _this.entity.attribute.config &&
          _this.entity.attribute.config.terrain
        ) {
          point = PointUtil.updateHeightForClampToGround(point);
        }

        _this._positions_draw.push(point);
        _this.updateAttrForDrawing();

        _this.fire(DrawEventType.DRAW_ADD_POINT, {
          drawtype: _this.type,
          entity: _this.entity,
          position: point,
          positions: _this._positions_draw,
        });

        if (_this._positions_draw.length >= _this._maxPointNum) {
          // 点数满足最大数量，自动结束
          _this.disable();
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.getHandler().setInputAction((event) => {
      // 右击删除上一个点
      _this._positions_draw.pop(); // 删除最后标的一个点

      var point = PointUtil.getCurrentMousePosition(
        _this.viewer.scene,
        event.position,
        _this.entity
      );

      if (point) {
        if (lastPointTemporary) {
          _this._positions_draw.pop();
        }

        lastPointTemporary = true;

        _this.fire(DrawEventType.DRAW_MOVE_POINT, {
          drawtype: _this.type,
          entity: _this.entity,
          position: point,
          positions: _this._positions_draw,
        });

        _this._positions_draw.push(point);
        _this.updateAttrForDrawing();
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    this.getHandler().setInputAction((event) => {
      // 鼠标移动
      console.log("鼠标移动");
      if (_this._positions_draw.length <= 1) {
        _this.tooltip.showAt(
          event.endPosition,
          Tooltip.message.draw.polyline.start
        );
      } else if (_this._positions_draw.length < _this._minPointNum) {
        // 点数不满足最少数量
        _this.tooltip.showAt(
          event.endPosition,
          Tooltip.message.draw.polyline.cont
        );
      } else if (_this._positions_draw.length >= _this._maxPointNum) {
        // 点数满足最大数量
        _this.tooltip.showAt(
          event.endPosition,
          Tooltip.message.draw.polyline.end2
        );
      } else
        _this.tooltip.showAt(
          event.endPosition,
          Tooltip.message.draw.polyline.end
        );

      var point = PointUtil.getCurrentMousePosition(
        _this.viewer.scene,
        event.endPosition,
        _this.entity
      );
      if (point) {
        if (lastPointTemporary) {
          _this._positions_draw.pop();
        }
        lastPointTemporary = true;

        _this._positions_draw.push(point);
        _this.updateAttrForDrawing();
        _this.fire(DrawEventType.DRAW_MOUSE_MOVE, {
          drawtype: _this.type,
          entity: _this.entity,
          position: point,
          positions: _this._positions_draw,
        });
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.getHandler().setInputAction((event) => {
      // 双击结束标绘
      // 必要代码 消除双击带来的多余经纬度
      _this._positions_draw.pop();
      if (_this._positions_draw.length < _this._minPointNum) {
        return; // 点数不够
      }
      _this.updateAttrForDrawing();
      _this.disable();
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  },

  // 获取编辑对象
  getEditClass: function (entity) {
    var _edit = new EditPolyline(entity, this.viewer, this.dataSource);
    _edit._minPointNum = this._minPointNum;
    _edit._maxPointNum = this._maxPointNum;
    return this._bindEdit(_edit);
  },

  // 获取属性处理类
  getAttrClass: function () {
    return Polyline;
  },

  finish: function () {
    var entity = this.entity;
    entity.editing = this.getEditClass(entity); // 绑定编辑对象
    entity._positions_draw = this.getDrawPosition();
    entity.polyline.positions = new Cesium.CallbackProperty((time) => {
      return entity._positions_draw;
    }, false);
  },
});
