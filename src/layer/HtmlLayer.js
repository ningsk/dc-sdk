import { DomUtil } from '../util/index'
import State from '../const/State'
import Transform from '../transform/Transform'
import Layer from './Layer'

class HtmlLayer extends Layer {
    constructor (id) {
        super(id)
        this._delegate = DomUtil.create('div', 'html-layer', undefined)
        this._delegate.setAttribute('id', this._id)
        this._renderRemoveCallback = undefined
        this.type = Layer.getLayerType('html')
        this._state = State.INITIALIZED
    }

    set show (show) {
        this._show = show
        this._delegate.style.visibility = this._show ? 'visible' : 'hidden'
    }

    get show () {
        return this._show
    }

    /**
   * add handler
   * @param map
   * @private
   */
    _onAdd (map) {
        this._map = map
        this._map.dcContainer.appendChild(this._delegate)
        const scene = this._map.scene
        this._renderRemoveCallback = scene.postRender.addEventListener(() => {
            const cameraPosition = this._map.camera.positionWC
            this.eachOverlay(item => {
                if (item && item.position) {
                    item.show = this.show
                    const position = Transform.transformWGS84ToCartesian(item.position)
                    const windowCoord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                        scene,
                        position
                    )
                    const distance = Cesium.Cartesian3.distance(position, cameraPosition)
                    item._updateStyle({ transform: windowCoord }, distance)
                }
            }, this)
        }, this)
        this._state = State.ADDED
    }

    _onRemove () {
        this._renderRemoveCallback && this._renderRemoveCallback()
        this._map.dcContainer.removeChild(this._delegate)
        this._state = State.REMOVED
    }

    /**
     * Clear all divIcons
     */
    clear () {
        while (this._delegate.hasChildNodes()) {
            this._delegate.removeChild(this._delegate.firstChild)
        }
        this._cache = {}
        this._state = State.CLEARED
        return this
    }
}

Layer.registerType('html')

export default HtmlLayer
