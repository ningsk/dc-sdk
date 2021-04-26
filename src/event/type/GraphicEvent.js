import * as Cesium from 'cesium'
import Event from '../Event.js'
import { GraphicEventType } from '@/dc/event'
class GraphicEvent extends Event {
  _registerEvent () {
    Object.keys(GraphicEventType).forEach(key => {
      const type = GraphicEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}
export default GraphicEvent
