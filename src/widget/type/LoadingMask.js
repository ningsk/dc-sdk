import Widget from '@/dc/widget/Widget'
import { DomUtil } from '@/dc/util'
import State from '@/dc/const/State'

class LoadingMask extends Widget {
  constructor () {
    super()
    this._wrapper = DomUtil.create('div', 'dc-loading-mask')
    this.type = Widget.getWidgetType('loading_mask')
    this._state = State.INITIALIZED
  }

  /**
   *
   * @private
   */
  _installHook () {
    Object.defineProperty(this._map, 'loadingMask', {
      value: this,
      writable: false
    })
  }

  /**
   *
   * @private
   */
  _mountContent () {
    const el = DomUtil.parseDom(
      `
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    `,
      true,
      'loading'
    )
    this._wrapper.appendChild(el)
    this._ready = true
  }
}
export default LoadingMask
