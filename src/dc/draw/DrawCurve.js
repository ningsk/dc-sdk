import DrawPolyline from "./DrawPolyline";
import { Polyline } from "../attr";
import { EditCurve } from "../edit";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:32:21
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-07 10:08:42
 */
class DrawCurve extends DrawPolyline {
  constructor(opts) {
    super(opts);
    this.type = "curve";
    this._positions_show = null;
  }

  getDrawPosition() {
    return this._positions_show;
  }

  updateAttrForDrawing() {
    if (this._positions_draw == null || this._positions_draw.length < 3) {
      this._positions_show = this._positions_draw;
      return;
    }
    this._positions_show = Polyline.line2curve(this._positions_draw);
  }

  // 获取编辑对象
  getEditClass(entity) {
    var _edit = new EditCurve(entity, this.viewer, this.dataSource);
    return this._bindEdit(_edit);
  }

  // 绘制结束后调用
  finish() {
    var entity = this.entity;
    entity.editing = this.getEditClass(entity); // 绑定编辑对象
    this.entity._positions_draw = this._positions_draw;
    this.entity._positions_show = this._positions_show;

    entity.polyine.positions = new Cesium.CallbackProperty((time) => {
      return entity._positions_show;
    }, false);
  }
}

export default DrawCurve;
