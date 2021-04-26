import * as Cesium from 'cesium'
import Event from '../Event.js'
import { OverlayEventType } from '@/dc/event'
class OverlayEvent extends Event {
  _registerEvent () {
    Object.keys(OverlayEventType).forEach(key => {
      const type = OverlayEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}
export default OverlayEvent
