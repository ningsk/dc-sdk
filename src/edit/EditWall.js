import { EditPolyline } from "./EditPolyline";
import Cesium from "cesium";
import { Dragger, TooltipUtil as Tooltip, PointUtil } from "../utils/index";
/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-26 14:30:05
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-11 08:50:15
 */
export var EditWall = EditPolyline.extend({
  // 修改坐标会回调，提高显示的效率
  changePositionsToCallback: function () {
    var that = this;
    this._positions_draw = this.entity.wall.positions.getValue();
    this.entity.wall.positions = new Cesium.CallbackProperty((time) => {
      return that.getPosition();
    }, false);
    this.minimumHeights = this.entity.wall.minimumHeights.getValue();
    this.entity.wall.minimumHeights = new Cesium.CallbackProperty((time) => {
      return that.getMinimumHeights();
    }, false);
    this.maximumHeights = this.entity.wall.maximumHeights.getValue();
    this.entity.wall.maximumHeights = new Cesium.CallbackProperty((time) => {
      return that.getMaximumHeights();
    }, false);
  },
  maximumHeights: null,
  getMaximumHeights: function () {
    return this.maximumHeights;
  },
  minimumHeights: null,
  getMinimumHeights: function () {
    return this.minimumHeights;
  },

  // 坐标位置相关
  updateAttrForEditing: function () {
    var style = this.entity.attribute.style;
    var position = this.getPosition();
    var len = position.length;

    this.maximumHeights = new Array(len);
    this.minimumHeights = new Array(len);

    for (var i = 0; i < len; i++) {
      var height = Cesium.Cartographic.fromCartesian(position[i]).height;
      this.minimumHeights[i] = height;
      this.maximumHeights[i] = height + Number(style.extrudedHeight);
    }
  },

  // 图形编辑结束后调用
  finish: function () {
    this.entity.wall.positions = this.getPosition();
  },

  bindDraggers: function () {
    var that = this;
    var clampToGround = this.isClampToGround();
    var positions = this.getPosition();
    var style = this.entity.attribute.style;
    var hasMidPoint = positions.length < this._maxPointNum; // 判断是否有新增点

    for (var i = 0, len = positions.length; i < len; i++) {
      var loc = positions[i];
      // 各顶点
      var dragger = Dragger.createDragger(this.dataSource, {
        position: loc,
        clampToGround: clampToGround,
        onDrag: (dragger, position) => {
          positions[dragger.index] = position;
          // =============== 高度调整拖拽点处理 ========================
          if (that.heightDraggers && that.heightDraggers.length > 0) {
            that.heightDraggers[
              dragger.index
            ].position = PointUtil.addPositionsHeight(
              position,
              style.extrudedHeight
            );
          }

          // ========== 新增点拖拽点处理 ================
          if (hasMidPoint) {
            if (dragger.index > 0) {
              // 与前一个点之间的中点
              that.draggers[
                dragger.index * 2 - 1
              ].position = Cesium.Cartesian3.midpoint(
                position,
                positions[dragger.index - 1],
                new Cesium.Cartesian3()
              );
            }
            if (dragger.index < positions.length - 1) {
              // 与后一个点之间的中点
              that.draggers[
                dragger.index * 2 + 1
              ].position = Cesium.Cartesian3.midpoint(
                position,
                positions[dragger.index + 1],
                new Cesium.Cartesian3()
              );
            }
          }
        },
      });

      dragger.index = i;
      this.draggers.push(dragger);

      // 中间点，拖拽后新增点
      if (hasMidPoint) {
        var nextIndex = i + 1;
        if (nextIndex < len) {
          var midpoint = Cesium2.Cartesian3.midpoint(
            loc,
            positions[nextIndex],
            new Cesium.Cartesian3()
          );
          var draggerMid = Dragger.createDragger(this.dataSource, {
            position: midpoint,
            type: Dragger.PointType.AddMidPoint,
            tooltip: Tooltip.message.dragger.addMidPoint,
            clampToGround: clampToGround,
            onDragStart: (dragger, position) => {
              positions.splice(dragger.index, 0, position); //插入点
              that.updateAttrForEditing();
            },
            onDrag: (dragger, position) => {
              positions[dragger.index] = position;
            },
            onDragEnd: (dragger, position) => {
              that.updateDraggers();
            },
          });
          draggerMid.index = nextIndex;
          this.draggers.push(draggerMid);
        }
      }
    }

    // 创建高程拖拽点
    this.bindHeightDraggers();
  },
  heightDraggers: null,
  bindHeightDraggers: function () {
    var that = this;

    this.heightDraggers = [];

    var positions = this.getPosition();
    var style = this.entity.attribute.style;
    var extrudedHeight = Number(style.extrudedHeight);

    for (var i = 0, len = positions.length; i < len; i++) {
      var loc = PointUtil.addPositionsHeight(positions[i], extrudedHeight);

      var dragger = Dragger.createDragger(this.dataSource, {
        position: loc,
        type: Dragger.PointType.MoveHeight,
        tooltip: Tooltip.message.dragger.moveHeight,
        onDrag: (dragger, position) => {
          var thisHeight = Cesium.Cartographic.fromCartesian(position).height;
          style.extrudedHeight = that.formatNum(
            thisHeight - that.minimumHeights[dragger.index],
            2
          );

          for (var i = 0; i < positions.length; i++) {
            if (i == dragger.index) continue;
            that.heightDraggers[i].position = PointUtil.addPositionsHeight(
              positions[i],
              style.extrudedHeight
            );
          }
          that.updateAttrForEditing();
        },
      });
      dragger.index = i;

      this.draggers.push(dragger);
      this.heightDraggers.push(dragger);
    }
  },
});
