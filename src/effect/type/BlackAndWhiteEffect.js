/*
 * @Description: 黑白效果
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 09:19:30
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-18 10:57:59
 */

import { Cesium } from '../../namespace'
import State from '../../state/State'

class BlackAndWhiteEffect {
    constructor() {
        this._viewer = undefined
        this._delegate = undefined
        this._enable = false
        this._gradations = 1
        this._selected = []
        this.type = "black_and_white"
        this._state = State.INITIALIZED
    }

    set enable(enable) {
        this._enable = enable
        if (enable && this._viewer && !this._delegate) this._createPostProcessStage()
        this._delegate && (this._delegate.enabled = enable)
        return this
    }

    get enable() {
        return this._enable
    }

    set gradations(graditions) {
        this._gradations = graditions
        this._delegate && (this._delegate.uniform.gradations = graditions)
        return this
    }

    get gradations() {
        return this._gradations
    }

    set selected(selected) {
        this._selected = selected
        this._delegate && (this._delegate.selected = selected)
        return this
    }

    /**
     * @private
     */
    _createPostProcessStage() {
        this._delegate = Cesium.PostProcessStageLibrary.createBlackAndWhiteStage()
        if (this._delegate) {
            this._delegate.uniforms.gradations = this._gradations
            this._viewer.scene.postProcessStages.add(this._delegate)
        }
    }

    addTo(viewer) {
        if (!viewer) {
            return this
        }
        this._viewer = viewer
        this._state = State.ADDED
        return this
    }


}

export default BlackAndWhiteEffect
