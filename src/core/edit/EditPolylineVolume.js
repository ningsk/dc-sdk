/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-26 14:59:16
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 10:08:56
 */
import EditPolyline from "./EditPolyline";

class EditPolylineVolume extends EditPolyline {
  constructor(entity, viewer, dataSource) {
    super(entity, viewer, dataSource);
  }

  // 修改坐标会回调，提高显示的效率
  changePositionsToCallback() {
    var that = this;
    this._positions_draw = this.entity.polylineVolume.positions.getValue();
    this.entity.polylineVolume.positions = new Cesium.CallbackProperty(
      (time) => {
        return that.getPosition();
      },
      false
    );
  }

  // 图形编辑结束后调用
  finish() {
    this.entity.polylineVolume.positions = this.getPosition();
  }
}

export default EditPolylineVolume;
