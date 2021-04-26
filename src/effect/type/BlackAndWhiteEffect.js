import * as Cesium from 'cesium'
import State from '../../const/State'

class BlackAndWhiteEffect {
    constructor () {
        this._map = undefined
        this._delegate = undefined
        this._enable = false
        this._gradations = 1
        this._selected = []
        this.type = 'black_and_white'
        this._state = State.INITIALIZED
    }

    set enable (enable) {
        this._enable = enable
        if (enable && this._map && !this._delegate) this._createPostProcessStage()
        this._delegate && (this._delegate.enabled = enable)
        return this
    }

    get enable () {
        return this._enable
    }

    set gradations (graditions) {
        this._gradations = graditions
        this._delegate && (this._delegate.uniform.gradations = graditions)
        return this
    }

    get gradations () {
        return this._gradations
    }

    set selected (selected) {
        this._selected = selected
        this._delegate && (this._delegate.selected = selected)
        return this
    }

    /**
     * @private
     */
    _createPostProcessStage () {
        this._delegate = Cesium.PostProcessStageLibrary.createBlackAndWhiteStage()
        if (this._delegate) {
            this._delegate.uniforms.gradations = this._gradations
            this._map.scene.postProcessStages.add(this._delegate)
        }
    }

    addTo (map) {
        if (!map) {
            return this
        }
        this._map = map
        this._state = State.ADDED
        return this
    }
}

export default BlackAndWhiteEffect
