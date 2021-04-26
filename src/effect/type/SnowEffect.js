import * as Cesium from 'cesium'
import State from '../../const/State'
import Util from '../../util/Util'

import SnowShader from '../../material/shader/effect/SnowShader.glsl'

class SnowEffect {
    constructor () {
        this._id = Util.uuid()
        this._map = undefined
        this._delegate = undefined
        this._enable = false
        this._speed = 10.0
        this.type = 'snow'
        this.state = State.INITIALIZED
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

    /**
     * @private
     */
    _createPostProcessStage () {
        this._delegate = new Cesium.PostProcessStage({
            name: this._id,
            fragmentShader: SnowShader,
            uniforms: {
                speed: this._speed
            }
        })
        this._map.scene.postProcessStage.add(this._delegate)
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

export default SnowEffect
