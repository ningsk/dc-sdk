import * as Cesium from 'cesium'
import Event from '../Event'
import { ViewerEventType } from '../EventType'
class ViewerEvent extends Event {
  _registerEvent () {
    Object.keys(ViewerEventType).forEach(key => {
      const type = ViewerEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}
export default ViewerEvent
