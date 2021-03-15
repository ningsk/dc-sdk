/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 14:31:11
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 14:31:30
 */
import State from '../state/State'
import { Label } from '../overlay'
import Layer from './Layer'

import Cesium from "cesium"

class LabelLayer extends Layer {
    constructor(id, url = '') {
        super(id)
        this._dataSource = Cesium.GeoJsonDataSource.load(url)
        this._delegate = new Cesium.CustomDataSource(id)
        this._initLabel()
        this.type = Layer.registerType('label')
        this._state = State.INITIALIZED
    }

    _createLabel(entity) {
        if (entity.position && entity.name) {
            return Label.fromEntity(entity)
        }
    }

    _initLabel() {
        this._dataSource.then(dataSource => {
            let entities = dataSource.entities.values
            entities.forEach(item => {
                let label = this._createLabel(item)
                this.addOverlay(label)
            })
        })
    }
}

Layer.registerType('label')

export default LabelLayer