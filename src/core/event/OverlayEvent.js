/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 14:43:27
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-16 14:16:15
 */
import { OverlayEventType } from './EventType'
import Event from './Event'

import * as Cesium from "cesium"

class OverlayEvent extends Event {
    constructor() {
        super()
    }

    /**
     * Register event for overlay
     * @private
     */
    _registerEvent() {
        Object.keys(OverlayEventType).forEach(key => {
            let type = OverlayEventType[key]
            this._cache[type] = new Cesium.Event()
        })
    }
}

export default OverlayEvent