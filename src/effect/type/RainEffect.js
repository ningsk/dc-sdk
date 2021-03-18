/*
 * @Description: 雨天效果 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 10:50:07
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-18 11:05:41
 */
import { Cesium } from "../../namespace"
import State from "../../state/State"
import Util from "../../util/Util"
import RainShader from '../../material/shader/weather/RainShader.glsl'

class RainEffect {
    constructor() {
        this._id = Util.uuid()
        this._viewer = undefined
        this._delegate = undefined
        this._enable = false
        this._speed = 10.0
        this.type = 'rain'
        this._state = State.INITIALIZED
    }

    set enable(enable) {
        this._enable = enable
        if (enable && this._viewer && !this._delegate) {
            this._createPostProcessStage()
        }
        this._delegate && (this._delegate.enabled = enable)
        return this
    }

    get enable() {
        return this._enable
    }

    set speed(speed) {
        this._speed = speed
        this._delegate && (this._delegate.uniforms.speed = speed)
        return this
    }

    get speed() {
        return this._speed
    }

    /**
     *
     * @private
     */
    _createPostProcessStage() {
        this._delegate = new Cesium.PostProcessStage({
            name: this._id,
            fragmentShader: RainShader,
            uniforms: {
                speed: this._speed
            }
        })
        this._viewer.scene.postProcessStages.add(this._delegate)
    }

    /**
     *
     * @param viewer
     * @returns {Rain}
     */
    addTo(viewer) {
        if (!viewer) {
            return this
        }
        this._viewer = viewer
        this._state = State.ADDED
        return this
    }
}

export default RainEffect