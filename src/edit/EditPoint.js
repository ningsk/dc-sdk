import { EditBase } from "./EditBase";
import { Tooltip } from "../core/Tooltip";
import * as Dragger from "../dom/Dragger";

/*
 * @Description: 编辑点
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-25 15:34:07
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 13:13:20
 */
export var EditPoint = EditBase.extend({
  // 外部更新位置
  setPositions: function (position) {
    this.entity.position.setValue(position);
  },

  bindDraggers: function () {
    var that = this;
    this.entity.draw_tooltip = Tooltip.message.dragger.def;
    var dragger = Dragger.createDragger(this.dataSource, {
      dragger: this.entity,
      onDrag: function (dragger, newPosition) {
        that.entity.position.setValue(newPosition);
      },
    });
  },

  finish: function () {
    this.entity.draw_tooltip = null;
  },
});
