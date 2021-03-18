/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 09:37:35
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-16 13:41:55
 */

import { DomUtil } from '../util/index'
import State from "../state/State";
import Transform from "../transform/Transform";
import Layer from "./Layer";

class HtmlLayer extends Layer {
    constructor(id) {
        super(id)
        this._delegate = DomUtil.create('div', 'html-layer', undefined)
        this._delegate.setAttribute('id', this._id)
        this._renderRemoveCallback = undefined
        this.type = Layer.getLayerType('html')
        this._state = State.INITIALIZED
    }

    set show(show) {
        this._show = show
        this._delegate.style.visibility = this._show ? 'visible' : 'hidden'
    }

    get show() {
        return this._show
    }

    /**
   * add handler
   * @param viewer
   * @private
   */
    _onAdd(viewer) {
        this._viewer = viewer
        this._viewer.dcContainer.appendChild(this._delegate)
        let scene = this._viewer.scene
        this._renderRemoveCallback = scene.postRender.addEventListener(() => {
            let cameraPosition = this._viewer.camera.positionWC
            this.eachOverlay(item => {
                if (item && item.position) {
                    item.show = this.show
                    let position = Transform.transformWGS84ToCartesian(item.position)
                    let windowCoord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                        scene,
                        position
                    )
                    let distance = Cesium.Cartesian3.distance(position, cameraPosition)
                    item._updateStyle({ transform: windowCoord }, distance)
                }
            }, this)
        }, this)
        this._state = State.ADDED
    }

    _onRemove() {
        this._renderRemoveCallback && this._renderRemoveCallback()
        this._viewer.dcContainer.removeChild(this._delegate)
        this._state = State.REMOVED
    }

    /**
     * Clear all divIcons
     */
    clear() {
        while(this._delegate.hasChildNodes()) {
            this._delegate.removeChild(this._delegate.firstChild)
        }
        this._cache = {}
        this._state = State.CLEARED
        return this
    }


}

Layer.registerType('html')

export default HtmlLayer
