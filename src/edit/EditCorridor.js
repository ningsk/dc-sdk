import { EditPolyline } from "./EditPolyline";
import * as Cesium from "cesium";
/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-26 15:09:56
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-08 10:27:29
 */
export var EditCorridor = EditPolyline.extend({
  //修改坐标会回调，提高显示的效率
  changePositionsToCallback: function () {
    //var that = this;

    this._positions_draw =
      this.entity._positions_draw || this.entity.corridor.positions.getValue();
    //this.entity.corridor.positions = new Cesium.CallbackProperty(function (time) {
    //    return that.getPosition();
    //}, false);
  },
  //图形编辑结束后调用
  finish: function () {
    this.entity._positions_draw = this.getPosition();
  },
});
