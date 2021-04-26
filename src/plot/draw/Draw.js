import { MouseEventType } from '@/dc/event'
class Draw {
  constructor () {
    this._map = undefined
    this._delegate = undefined
    this._overlay = undefined
    this._tooltip = undefined
    this._layer = undefined
    this._floatingAnchor = undefined
    this._plotEvent = undefined
    this._options = {}
  }
  _mountedEntity () {}
  _mountedOverlay () {}
  bindEvent () {
    this._map.on(MouseEventType.CLICK, this._onClickHandler, this)
    this._map.on(MouseEventType.RIGHT_CLICK, this._onRightClickHandler, this)
    this._map.on(MouseEventType.DB_CLICK, this._onDbClickHandler, this)
    this._map.on(MouseEventType.MOUSE_MOVE, this._onMouseMoveHandler, this)
  }
  unbindEvent () {
    this._map.off(MouseEventType.CLICK, this._onClickHandler, this)
    this._map.off(MouseEventType.RIGHT_CLICK, this._onRightClickHandler, this)
    this._map.off(MouseEventType.DB_CLICK, this._onDbClickHandler, this)
    this._map.off(MouseEventType.MOUSE_MOVE, this._onMouseMoveHandler, this)
  }
  _onClickHandler (e) {}
  _onRightClickHandler (e) {}
  _onDbClickHandler (e) {}
  _onMouseMoveHandler (e) {}
  startDraw (plot) {
    this._map = plot.map
    this._tooltip = plot.map.tooltip
    this._layer = plot.overlayLayer
    this._anhorLayer = plot.anchorLayer
    this._plotEvent = plot.plotEvent
    this._options = plot.options
    this._mountedEntity && this._mountedEntity()
    this._mountedOverlay && this._mountedOverlay()
    this.bindEvent()
  }
  endDraw () {
    this.unbindEvent()
    this._layer.remove(this._delegate)
    this._delegate = undefined
    this._tooltip.enable = false
  }
}
export default Draw
