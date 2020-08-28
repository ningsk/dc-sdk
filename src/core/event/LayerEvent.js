/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-28 15:51:02
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 16:18:29
 */
import Cesium from "cesium";
import Event from "./Event";
import { LayerEventType } from "./EventType";

class LayerEvent extends Event {
  constructor() {
    super();
  }

  _registerEvent() {
    Object.keys(LayerEventType).forEach((key) => {
      let type = LayerEventType[key];
      this._cache[type] = new Cesium.Event();
    });
  }
}
