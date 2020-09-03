import EditPolyline from "./EditPolyline";
import { Polyline } from "../attr";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-26 10:01:43
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-26 16:42:37
 */
class EditCurve extends EditPolyline {
	constructor(entity, viewer, dataSource) {
    super(entity, viewer, dataSource);
  }
  //修改坐标会回调，提高显示的效率
	changePositionsToCallback() {
		var that = this;
	
		this._positions_draw = this.entity._positions_draw;
		this._positions_show = this.entity._positions_show || this.entity.polyline.positions.getValue();
	
		//this.entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
		//    return that._positions_show;
		//}, false);
	},
	//坐标位置相关  
	updateAttrForEditing() {
		if (this._positions_draw == null || this._positions_draw.length < 3) {
			this._positions_show = this._positions_draw;
			return;
		}
	
		this._positions_show = Polyline.line2curve(this._positions_draw);
		this.entity._positions_show = this._positions_show;
	},
	//图形编辑结束后调用
	finish() {
		//this.entity.polyline.positions = this._positions_show;
		this.entity._positions_show = this._positions_show;
		this.entity._positions_draw = this._positions_draw;
	}
	
}

export default EditCurve;
