/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 14:27:42
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 14:27:59
 */
import { ViewerEventType } from './EventType'
import Event from './Event'
import Cesium from "cesium"

class ViewerEvent extends Event {
    constructor() {
        super()
    }

    /**
     * Register event for viewer
     * @private
     */
    _registerEvent() {
        Object.keys(ViewerEventType).forEach(key => {
            let type = ViewerEventType[key]
            this._cache[type] = new Cesium.Event()
        })
    }
}

export default ViewerEvent
