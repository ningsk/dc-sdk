import * as Cesium from 'cesium'
import { LayerGroupEventType } from '@/dc/event'
import Event from '../Event'

class LayerGroupEvent extends Event {
  /**
   * Register event for layer group
   * @private
   */
  _registerEvent () {
    Object.keys(LayerGroupEventType).forEach(key => {
      const type = LayerGroupEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}

export default LayerGroupEvent
