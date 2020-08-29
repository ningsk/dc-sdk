import EditBase from "./EditBase";
import { Dragger, Tooltip } from "../utils";

/*
 * @Description: 编辑点
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-25 15:34:07
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 09:06:06
 */
class EditPoint extends EditBase {
  constructor(entity, viewer, dataSource) {
    super(entity, viewer, dataSource);
  }

  // 外部更新位置
  setPositions(position) {
    this.entity.position.setValue(position);
  }

  bindDraggers() {
    var that = this;
    this.entity.draw_tooltip = Tooltip.message.dragger.def;
    var dragger = Dragger.createDragger(this.dataSource, {
      dragger: this.entity,
      onDrag: function (dragger, newPosition) {
        that.entity.position.setValue(newPosition);
      },
    });
  }

  finish() {
    this.entity.draw_tooltip = null;
  }
}

export default EditPoint;
