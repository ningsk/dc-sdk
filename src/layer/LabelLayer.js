import * as Cesium from 'cesium'
import State from '../const/State'
import { Label } from '../overlay/index'
import Layer from './Layer'

class LabelLayer extends Layer {
    constructor (id, url = '') {
        super(id)
        this._dataSource = Cesium.GeoJsonDataSource.load(url)
        this._delegate = new Cesium.CustomDataSource(id)
        this._initLabel()
        this.type = Layer.registerType('label')
        this._state = State.INITIALIZED
    }

    _createLabel (entity) {
        if (entity.position && entity.name) {
            return Label.fromEntity(entity)
        }
    }

    _initLabel () {
        this._dataSource.then(dataSource => {
            const entities = dataSource.entities.values
            entities.forEach(item => {
                const label = this._createLabel(item)
                this.addOverlay(label)
            })
        })
    }
}

Layer.registerType('label')

export default LabelLayer
