import * as Cesium from 'cesium'
import State from '../../const/State'
import Util from '../../util/Util'
import RainShader from '../../material/shader/weather/RainShader.glsl'

class RainEffect {
    constructor () {
        this._id = Util.uuid()
        this._map = undefined
        this._delegate = undefined
        this._enable = false
        this._speed = 10.0
        this.type = 'rain'
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

    set speed (speed) {
        this._speed = speed
        this._delegate && (this._delegate.uniforms.speed = speed)
        return this
    }

    get speed () {
        return this._speed
    }

    /**
     *
     * @private
     */
    _createPostProcessStage () {
        this._delegate = new Cesium.PostProcessStage({
            name: this._id,
            fragmentShader: RainShader,
            uniforms: {
                speed: this._speed
            }
        })
        this._map.scene.postProcessStages.add(this._delegate)
    }

    /**
     *
     * @param viewer
     * @returns {Rain}
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

export default RainEffect
