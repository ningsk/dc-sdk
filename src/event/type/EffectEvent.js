import * as Cesium from 'cesium'
import Event from '../Event.js'
import { EffectEventType } from '../EventType.js'
class EffectEvent extends Event {
  _registerEvent () {
    Object.keys(EffectEventType).forEach(key => {
      const type = EffectEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}
export default EffectEvent
