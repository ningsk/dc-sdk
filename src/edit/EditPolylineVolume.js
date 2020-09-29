/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-26 14:59:16
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-08 10:36:57
 */
import { EditPolyline } from "./EditPolyline";
import * as Cesium from "cesium";
export var EditPolylineVolume = EditPolyline.extend({
  // 修改坐标会回调，提高显示的效率
  changePositionsToCallback: function () {
    var that = this;
    this._positions_draw = this.entity.polylineVolume.positions.getValue();
    this.entity.polylineVolume.positions = new Cesium.CallbackProperty(
      (time) => {
        return that.getPosition();
      },
      false
    );
  },

  // 图形编辑结束后调用
  finish: function () {
    this.entity.polylineVolume.positions = this.getPosition();
  },
});
