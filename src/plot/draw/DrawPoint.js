import * as Cesium from 'cesium'
import Draw from '@/dc/plot/draw/Draw'
import { Point } from '@/dc/overlay'
import { Transform } from '@/dc/transform'
import { PlotEventType } from '@/dc/event'
const DEF_STYLE = {
  pixelSize: 10,
  outlineColor: Cesium.Color.BLUE,
  outlineWidth: 5
}
class DrawPoint extends Draw {
  constructor (style) {
    super()
    this._position = Cesium.Cartesian3.ZERO
    this._style = {
      ...DEF_STYLE,
      ...style
    }
  }
  _mountedEntity () {
    this._delegate = new Cesium.Entity({
      position: new Cesium.CallbackProperty(() => {
        return this._position
      }, false),
      point: {
        ...this._style
      }
    })
    // 设置不拾取自身
    this._map.mouseEvent.noPickEntity = this._delegate
    this._layer.add(this._delegate)
  }
  _onClickHandler (e) {
    this._position = e.position
    this.unbindEvent()
    const point = new Point(Transform.transformCartesianToWGS84(this._position))
    point.setStyle(this._style)
    this._plotEvent.fire(PlotEventType.DRAW_ADD_POINT, {
      drawType: 'point',
      entity: point,
      position: this._position
    })
  }
  _onMouseMoveHandler (e) {
    this._tooltip.showAt(e.windowPosition, '单击选择点位')
    this._position = e.position
  }
}
export default DrawPoint
