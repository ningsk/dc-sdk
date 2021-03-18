/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-11 12:50:33
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-18 11:06:57
 */

import {Cesium } from "../namespace"

import Event from './Event'
import { LayerEventType} from './EventType'

class LayerEvent extends Event {

    constructor() {
        super()
    }

    _registerEvent() {
        Object.keys(LayerEventType).forEach(key => {
            let type = LayerEventType[key]
            this._cache[type] = new Cesium.Event()
        })
    }

}

export default LayerEvent
