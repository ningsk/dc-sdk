/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 14:43:27
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-12 14:44:50
 */
import { GraphicEventType } from './EventType'
import Event from './Event'

const { Cesium } = DC.Namespace

class GraphicEvent extends Event {
  constructor() {
    super()
  }

  /**
   * Register event for overlay
   * @private
   */
  _registerEvent() {
    Object.keys(GraphicEventType).forEach(key => {
      let type = GraphicEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}

export default GraphicEvent