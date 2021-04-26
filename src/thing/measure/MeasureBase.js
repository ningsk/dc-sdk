import Thing from '@/dc/thing/Thing'
import { StyleUtil, Util } from '@/dc'
const defaultLabelStyle = StyleUtil.getDefaultStyle('label', {
  'color': '#ffffff',
  'font_size': 20,
  'border': true,
  'border_color': '#000000',
  'border_width': 3,
  'background': true,
  'background_color': '#000000',
  'background_opacity': 0.5,
  'scaleByDistance': true,
  'scaleByDistance_far': 800000,
  'scaleByDistance_farValue': 0.5,
  'scaleByDistance_near': 1000,
  'scaleByDistance_nearValue': 1,
  'pixelOffset': [0, -15],
  'visibleDepth': false // 一直显示，不被地形等遮挡
})
class MeasureBase extends Thing {
  constructor (options) {
    super()
    this._map = undefined
    this._style = Util.merge(defaultLabelStyle, options.style)
  }
  bindEvent () {}
  unbindEvent () {}
  startDraw (options) {}
  endDraw () {}
  clear () {}
}
export default MeasureBase
