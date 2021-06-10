import { PlotEvent, PlotEventType } from '@/dc/event'
import * as Cesium from 'cesium'
import { OverlayType } from '@/dc/overlay'
import DrawPoint from '@/dc/plot/draw/DrawPoint'
import DrawPolyline from '@/dc/plot/draw/DrawPolyline'
import DrawPolygon from '@/dc/plot/draw/DrawPolygon'
import EditPolyline from '@/dc/plot/edit/EditPolyline'
const IMG_CIRCLE_RED = require('@/dc/images/circle_red.png')

const IMG_CIRCLE_BLUE = require('@/dc/images/circle_blue.png')

const IMG_CIRCLE_YELLOW = require('@/dc/images/circle_yellow.png')

const DEF_OPTS = {
  icon_center: IMG_CIRCLE_YELLOW,
  icon_anchor: IMG_CIRCLE_RED,
  icon_midAnchor: IMG_CIRCLE_BLUE,
  icon_size: [12, 12],
  clampToGround: true,
  canEdit: true
}
class Plot {
  constructor (map, options = {}) {
    this._map = map
    this._options = {
      ...DEF_OPTS,
      ...options
    }
    this._canEdit = this._options.canEdit
    this._plotEvent = new PlotEvent()
    this._plotEvent.on(PlotEventType.DRAW_CREATED, this._drawCreatedHandler, this)
    this._drawWorker = undefined
    this._editWorker = undefined
    this._overlayLayer = new Cesium.CustomDataSource('plot-overlay-layer')
    this._map.dataSources.add(this._overlayLayer)
    this._anchorLayer = new Cesium.CustomDataSource('plot-overlay-layer')
    this._map.dataSources.add(this._anchorLayer)
    this._state = undefined
  }
  get plotEvent () {
    return this._plotEvent
  }
  get options () {
    return this._options
  }
  get overlayLayer () {
    return this._overlayLayer.entities
  }
  get anchorLayer () {
    return this._anchorLayer.entities
  }
  get map () {
    return this._map
  }
  set editable (editable) {
    this._canEdit = editable
  }
  get editable () {
    return this._canEdit
  }
  _createDrawWorker (type, style) {
    switch (type) {
      case OverlayType.POINT:
        this._drawWorker = new DrawPoint(style)
        break
      case OverlayType.POLYLINE:
        this._drawWorker = new DrawPolyline(style)
        break
      case OverlayType.POLYGON:
        this._drawWorker = new DrawPolygon(style)
        break
      default:
        break
    }
  }
  _createEditWorker (overlay) {
    switch (overlay.type) {
      case OverlayType.POLYLINE:
        this._editWorker = new EditPolyline(overlay)
        break
      default:
        break
    }
  }
  draw (type, style) {
    this._state = 'draw'
    if (this._drawWorker) {
      this._drawWorker.unbindEvent()
      this._drawWorker = undefined
    }
    this._map.tooltip.enable = true
    this._createDrawWorker(type, style)
    this._drawWorker && this._drawWorker.startDraw(this)
  }
  edit (overlay) {
    this._state = 'edit'
    if (this._editWorker) {
      this._editWorker.unbindEvent()
      this._editWorker = undefined
    }
    this._map.tooltip.enable = true
    this._createEditWorker(overlay)
    this._editWorker && this._editWorker.startEdit(this)
  }
  on (type, callback, context) {
    this._plotEvent.on(type, callback, context || this)
  }
  off (type, callback, context) {
    this._plotEvent.off(type, callback, context || this)
  }
  fire (type, params) {
    this._plotEvent.fire(type, params)
  }
  _completeCallback (overlay) {
    this._drawWorker = undefined
    this._editWorker = undefined
    this._map.tooltip.enable = false
    this._overlayLayer.entities.removeAll()
    this._anchorLayer.entities.removeAll()
  }

  _drawCreatedHandler (overlay) {
    if (this._canEdit) {
      this.edit(overlay)
    }
  }
}
export default Plot
