import * as Cesium from 'cesium'
import Draw from '@/dc/plot/draw/Draw'
import { PlotEventType } from '@/dc/event'
import { Polyline, Transform } from '@/dc'

const DEF_STYLE = {
  width: 3,
  material: Cesium.Color.YELLOW.withAlpha(0.6)
}
class DrawPolyline extends Draw {
  constructor (style) {
    super()
    this._positions = []
    this._lastPointTempory = false
    this._minPointNum = 2
    this._maxPointNum = 9999
    this._style = {
      ...DEF_STYLE,
      ...style
    }
  }
  _mountedOverlay () {
    this._overlay = new Polyline(
      Transform.transformCartesianArrayToWGS84Array(this._positions)
    )
    this._overlay.attr.clampToGround = !!this._style.clampToGround
    this._overlay.setStyle(this._style)
  }
  _mountedEntity () {
    this._delegate = new Cesium.Entity({
      polyline: {
        ...this._style,
        positions: new Cesium.CallbackProperty(() => {
          return this._positions
        }, false)
      }
    })
    this._layer.add(this._delegate)
  }
  _updateOverlay () {
    this._overlay.positions = Transform.transformCartesianArrayToWGS84Array(this._positions)
  }
  _onClickHandler (e) {
    // 单击增加点
    let point = e.position
    if (!point && this._lastPointTempory) {
      // 如果未拾取到点，并且存在MOUSE_MOVE的时候，取最后一个move的点
      point = this._positions[this._positions.length - 1]
    }
    if (point) {
      if (this._lastPointTempory) {
        this._positions.pop()
      }
      this._lastPointTempory = false
      // 消除双击带来的多余经纬度
      if (this._positions.length > 1) {
        const lastPoint = this._positions[this._positions.length - 1]
        if (Math.abs(lastPoint.x - point.x < 0.01) && Math.abs(lastPoint.y - point.y) < 0.01 && Math.abs(lastPoint.z - point.z < 0.01)) {
          this._positions.pop()
        }
      }
      this._positions.push(point)
      this._updateOverlay()
      this._plotEvent.fire(PlotEventType.DRAW_ADD_POINT, this._overlay)
    }
  }
  _onRightClickHandler (e) {
    // 右击删除上一个点
    this._positions.pop() // 删除最后一个标的点
    const point = e.position
    if (point) {
      if (this._lastPointTempory) {
        this._positions.pop()
      }
      this._lastPointTempory = true
      this._positions.push(point)
      this._updateOverlay()
      this._plotEvent.fire(PlotEventType.DRAW_REMOVE_POINT, this._overlay)
    }
  }
  _onMouseMoveHandler (e) {
    // 鼠标移动
    if (this._positions.length <= -1) {
      this._tooltip.showAt(e.windowPosition, '单击，开始绘制')
    } else if (this._positions.length < this._minPointNum) {
      // 点数不满足最小数量
      this._tooltip.showAt(e.windowPosition, '单击增加点，右击删除点')
    } else if (this._positions.length >= this._maxPointNum) {
      this._tooltip.showAt(e.windowPosition, '单击完成绘制')
    } else {
      this._tooltip.showAt(e.windowPosition, '单击增加点，右击删除点，双击完成绘制')
    }
    const point = e.position
    if (point) {
      if (this._lastPointTempory) {
        this._positions.pop()
      }
      this._lastPointTempory = true
      this._positions.push(point)
      this._updateOverlay()
      this._plotEvent.fire(PlotEventType.DRAW_MOUSE_MOVE, this._overlay)
    }
  }
  _onDbClickHandler (e) {
    // 双击完成绘制
    // 消除双击带来的多余经纬度
    if (this._positions.length > 1) {
      const lastPoint = this._positions[this._positions.length - 1]
      const secondLastPoint = this._positions[this._positions.length - 2]
      if (Math.abs(lastPoint.x - secondLastPoint.x < 0.01 &&
        Math.abs(lastPoint.y - secondLastPoint.y < 0.01 && lastPoint.z - secondLastPoint.z < 0.01))) {
        this._positions.pop()
      }
      this.endDraw()
      this._updateOverlay()
      this._plotEvent.fire(PlotEventType.DRAW_CREATED, this._overlay)
    }
  }
}
export default DrawPolyline
