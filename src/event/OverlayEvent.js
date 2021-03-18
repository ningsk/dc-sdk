/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 14:43:27
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-18 11:08:08
*/

import { Cesium } from "../namespace"

import { OverlayEventType } from './EventType'
import Event from './Event'

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