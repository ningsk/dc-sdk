import GeoJsonLayer from './GeoJsonLayer'
import { State } from '@/dc'
class TopoJsonLayer extends GeoJsonLayer {
    constructor (id, url, options = {}) {
        if (!url) {
            throw new Error('TopoJsonLayer锛歵he url invalid')
        }
        super(id, url, options)
        this.type = GeoJsonLayer.getLayerType('topojson')
        this._state = State.INITIALIZED
    }
}

GeoJsonLayer.registerType('topojson')

export default TopoJsonLayer
