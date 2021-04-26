import * as Cesium from 'cesium'
import Event from '../Event.js'
import { ThingEventType } from '@/dc/event'
class ThingEvent extends Event {
  _registerEvent () {
    Object.keys(ThingEventType).forEach(key => {
      const type = ThingEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}
export default ThingEvent
