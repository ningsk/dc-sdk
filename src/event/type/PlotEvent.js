import * as Cesium from 'cesium'
import Event from '../Event'
import { PlotEventType } from '@/dc/event'
class PlotEvent extends Event {
  _registerEvent () {
    Object.keys(PlotEventType).forEach(key => {
      const type = PlotEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}
export default PlotEvent
