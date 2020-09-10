/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-26 14:38:36
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-10 10:10:25
 */
import Cesium from "cesium";
import { EditPolygon } from "./EditPolygon";
import { createDragger, PointUtil } from "../utils";

export var EditRectangle = EditPolygon.extend({
  // 修改坐标会回调，提高显示的效率
  changePositionsToCallback: function () {
    var that = this;
    this._positions_draw = this.entity._positions_draw;
  },

  // 图形编辑结束后调用
  finish: function () {
    this.entity._positions_draw = this._positions_draw;
  },

  isClampToGround: function () {
    return this.entity.attribute.style.clampToGround;
  },

  bindDraggers: function () {
    var that = this;
    var clampToGround = this.isClampToGround();
    var positions = this.getPosition();
    for (var i = 0, len = positions.length; i < len; i++) {
      var position = positions[i];
      if (this.entity.rectangle.height != undefined) {
        var newHeight = this.entity.rectangle.height.getValue();
        position = PointUtil.setPositionsHeight(position, newHeight);
      }
      if (clampToGround) {
        position = PointUtil.updateHeightForClampToGround(position);
      }

      // 各顶点
      var dragger = createDragger(this.dataSource, {
        position: position,
        onDrag: function (dragger, position) {
          if (that.entity.rectangle.height != undefined) {
            var newHeight = that.entity.rectangle.height.getValue();
            position = PointUtil.setPositionsHeight(position, newHeight);
            dragger.position = position;
          }
          positions[dragger.index] = position;
          // ======== 高度调整拖拽点处理 =====================
          if (that.heightDraggers && that.heightDraggers.length > 0) {
            var extrudedHeight = that.entity.rectangle.extrudedHeight.getValue();
            that.heightDraggers[
              dragger.index
            ].position = PointUtil.setPositionsHeight(position, extrudedHeight);
          }
        },
      });
      dragger.index = i;
      this.draggers.push(dragger);
    }
    // 创建高程拖拽点
    if (this.entity.rectangle.extrudedHeight)
      this.bindHeightDraggers(this.entity.rectangle);
  },
});
