/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-23 19:35:55
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-23 19:41:19
 */
/**
 * @Author: Caven
 * @Date: 2020-02-11 21:08:01
 */

import State from '@dc-modules/state/State'
import Icons from '@dc-modules/icons'
import { DomUtil } from '@dc-modules/utils'
import Widget from '../Widget'

class Attribution extends Widget {
  constructor() {
    super()
    this._wrapper = DomUtil.create('div', 'dc-attribution')
    this._wrapper.style.cssText = `
      position: absolute;
      left: 2px;
      bottom: 2px;
      font-size: 14px;
      color: #a7a7a7;
      padding: 2px 5px;
      border-radius: 2px;
      user-select: none;
      display:flex;
    `
    this._config = undefined
    this.type = Widget.getWidgetType('attribution')
    this._state = State.INSTALLED
  }

  _installHook() { 
    this.enable = true
  }
}

Widget.registerType('attribution')

export default Attribution
