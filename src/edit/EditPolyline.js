import { EditBase } from "./EditBase";
import * as Cesium from "cesium";
import { Tooltip } from "../core/Tooltip";
import { Dragger } from "../dom/index";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-26 08:32:51
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-29 10:18:56
 */
export var EditPolyline = EditBase.extend({
  // 坐标位置相关
  _positions_draw: [],
  getPosition: function () {
    return this._positions_draw;
  },
  setPositions: function (positions) {
    this._positions_draw = positions;
    this.updateAttrForEditing();
  },
  changePositionsToCallback: function () {
    var that = this;
    this._positions_draw =
      this.entity._positions_draw || this.entity.polyline.positions.getValue();
  },
  isClampToGround: function () {
    return this.entity.attribute.style.clampToGround;
  },

  bindDraggers: function () {
    var that = this;

    var clampToGround = this.isClampToGround();

    var positions = this.getPosition();
    var hasMidPoint = positions.length < this._maxPointNum; //是否有新增点
    for (var i = 0, len = positions.length; i < len; i++) {
      var loc = positions[i];

      if (clampToGround) {
        //贴地时求贴模型和贴地的高度
        loc = point.updateHeightForClampToGround(loc);
        positions[i] = loc;
      }

      //各顶点
      var dragger = Dragger.createDragger(this.dataSource, {
        position: loc,
        //clampToGround: clampToGround,
        onDrag: function onDrag(dragger, position) {
          positions[dragger.index] = position;

          //============新增点拖拽点处理=============
          if (hasMidPoint) {
            if (dragger.index > 0) {
              //与前一个点之间的中点
              var midpoint = Cesium.Cartesian3.midpoint(
                position,
                positions[dragger.index - 1],
                new Cesium.Cartesian3()
              );
              if (clampToGround) {
                //贴地时求贴模型和贴地的高度
                midpoint = point.updateHeightForClampToGround(midpoint);
              }
              that.draggers[dragger.index * 2 - 1].position = midpoint;
            }
            if (dragger.index < positions.length - 1) {
              //与后一个点之间的中点
              let midpoint = Cesium.Cartesian3.midpoint(
                position,
                positions[dragger.index + 1],
                new Cesium.Cartesian3()
              );
              if (clampToGround) {
                //贴地时求贴模型和贴地的高度
                midpoint = point.updateHeightForClampToGround(midpoint);
              }
              that.draggers[dragger.index * 2 + 1].position = midpoint;
            }
          }
        },
      });
      dragger.index = i;
      this.draggers.push(dragger);

      //中间点，拖动后新增点
      if (hasMidPoint) {
        let nextIndex = i + 1;
        if (nextIndex < len) {
          let midpoint = Cesium.Cartesian3.midpoint(
            loc,
            positions[nextIndex],
            new Cesium.Cartesian3()
          );
          if (clampToGround) {
            //贴地时求贴模型和贴地的高度
            midpoint = point.updateHeightForClampToGround(midpoint);
          }
          let dragger = Dragger.createDragger(this.dataSource, {
            position: midpoint,
            type: Dragger.PointType.AddMidPoint,
            tooltip: Tooltip.message.dragger.addMidPoint,
            //clampToGround: clampToGround,
            onDragStart: function onDragStart(dragger, position) {
              positions.splice(dragger.index, 0, position); //插入点
            },
            onDrag: function onDrag(dragger, position) {
              positions[dragger.index] = position;
            },
            onDragEnd: function onDragEnd(dragger, position) {
              that.updateDraggers();
            },
          });
          dragger.index = nextIndex;
          this.draggers.push(dragger);
        }
      }
    }
  },
});
