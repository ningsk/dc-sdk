import Widget from '@/dc/widget/Widget'
import { DomUtil } from '@/dc/util'
import State from '@/dc/const/State'

class Tooltip extends Widget {
  constructor () {
    super()
    this._wrapper = DomUtil.create('div', 'dc-tool-tip')
    this._ready = true
    this.type = Widget.getWidgetType('tooltip')
    this._state = State.INITIALIZED
  }

  /**
   *
   * @private
   */
  _installHook () {
    Object.defineProperty(this._map, 'tooltip', {
      value: this,
      writable: false
    })
  }

  /**
   *
   * @param {*} windowCoord
   *
   */
  _updateWindowCoord (windowCoord) {
    const x = windowCoord.x + 10
    const y = windowCoord.y - this._wrapper.offsetHeight / 2
    this._wrapper.style.cssText = `
    visibility:visible;
    z-index:1;
    transform:translate3d(${Math.round(x)}px,${Math.round(y)}px, 0);
    `
  }

  /**
   *
   * @param {*} position
   * @param {*} content
   *
   */
  showAt (position, content) {
    if (!this._enable) {
      return this
    }

    position && this._updateWindowCoord(position)
    this.setContent(content)
    return this
  }
}
export default Tooltip
