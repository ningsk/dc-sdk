import * as Cesium from 'cesium'
import Event from '../Event'
import { LayerEventType } from '@/dc/event'
class LayerEvent extends Event {
  _registerEvent () {
    Object.keys(LayerEventType).forEach(key => {
      const type = LayerEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}
export default LayerEvent
