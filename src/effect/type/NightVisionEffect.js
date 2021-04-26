import * as Cesium from 'cesium'
import State from '../../const/State'

class NightVisionEffect {
    constructor () {
        this._enable = false
        this._selected = []
        this.type = 'night'
        this._state = State.INITIALIZED
    }

    set enable (enable) {
        this._enable = enable
        if (enable && this._map && !this._delegate) {
            this._createPostProcessStage()
        }
        this._delegate && (this._delegate.enabled = enable)
        return this
    }

    get enable () {
        return this._enable
    }

    set selected (selected) {
        this._selected = selected
        this._delegate && (this._delegate.selected = selected)
        return this
    }

    get selected () {
        return this._selected
    }

    /**
     *
     * @private
     */
    _createPostProcessStage () {
        this._delegate = Cesium.PostProcessStageLibrary.createNightVisionStage()
        if (this._delegate) {
            this._map.scene.postProcessStages.add(this._delegate)
        }
    }

    /**
     *
     * @param map
     * @returns {NightVision}
     */
    addTo (map) {
        if (!map) {
            return this
        }
        this._map = map
        this._state = State.ADDED
        return this
    }
}

export default NightVisionEffect
