/*
 * @Description: 夜视效果 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 11:00:46
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-18 11:05:18
 */
import { Cesium } from "../../namespace"
import State from "../../state/State"

class NightVisionEffect {
    constructor() {
        this._enable = false
        this._selected = []
        this.type = 'night'
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

    set selected(selected) {
        this._selected = selected
        this._delegate && (this._delegate.selected = selected)
        return this
    }

    get selected() {
        return this._selected
    }

    /**
     *
     * @private
     */
    _createPostProcessStage() {
        this._delegate = Cesium.PostProcessStageLibrary.createNightVisionStage()
        if (this._delegate) {
            this._viewer.scene.postProcessStages.add(this._delegate)
        }
    }

    /**
     *
     * @param viewer
     * @returns {NightVision}
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

export default NightVisionEffect
