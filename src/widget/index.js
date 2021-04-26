import ContextMenu from './type/ContextMenu'
import LocationBar from './type/LocationBar'
import MapSplit from './type/MapSplit'
import MapSwitch from './type/MapSwitch'
import Popup from './type/Popup'
import Tooltip from './type/Tooltip'
import HawkEyeMap from './type/HawkEyeMap'
import Compass from './type/Compass'
import DistanceLegend from './type/DistanceLegend'
import ZoomController from './type/ZoomController'
import LoadingMask from './type/LoadingMask'

export default function createWidgets () {
  return {
    popup: new Popup(),
    contextMenu: new ContextMenu(),
    tooltip: new Tooltip(),
    mapSwitch: new MapSwitch(),
    mapSplit: new MapSplit(),
    locationBar: new LocationBar(),
    hawkEyeMap: new HawkEyeMap(),
    compass: new Compass(),
    distanceLegend: new DistanceLegend(),
    zoomController: new ZoomController(),
    loadingMask: new LoadingMask()
  }
}
