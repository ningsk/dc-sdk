import * as Cesium from 'cesium'
import State from '../../const/State'

class BrightnessEffect {
    constructor () {
        this._map = undefined
        this._delegate = undefined
        this._enable = false
        this._intensity = 1
        this._selected = []
        this.type = 'brightness'
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

    set intensity (intensity) {
        this._intensity = intensity
        this._delegate && (this._delegate.uniforms.brightness = intensity)
        return this
    }

    get intensity () {
        return this._intensity
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
        this._delegate = Cesium.PostProcessStageLibrary.createBrightnessStage()
        if (this._delegate) {
            this._delegate.uniforms.brightness = this._intensity
            this._map.scene.postProcessStages.add(this._delegate)
        }
    }

    /**
     *
     * @param viewer
     * @returns {Brightness}
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

export default BrightnessEffect
