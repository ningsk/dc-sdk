/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-18 09:43:11
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-18 09:43:31
 */
import Overlay from '../Ovelay'
import Parse from '../../parse/Parse'
import Transform from '../../transform/Transform'
import * as Cesium from "cesium"
import State from '../../state/State'

class VideoPrimitive extends Overlay {
    constructor(positions, video) {
        super()
        this._positions = Parse.parsePositions(positions)
        this._delegate = new Cesium.GroundPrimitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: {}
            })
        })
        this._video = video
        this.type = Overlay.getOverlayType('video_primitive')
        this._state = State.INITIALIZED
    }

    set positions(positions) {
        this._positions = Parse.parsePositions(positions)
        this._delegate.geometryInstances.geometry = Cesium.PolygonGeometry.fromPositions(
            {
                positions: Transform.transformWGS84ArrayToCartesianArray(
                    this._positions
                ),
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            }
        )
        return this
    }

    get positions() {
        return this._positions
    }

    set video(video) {
        this._video = video
        this._setAppearance()
        return this
    }

    get video() {
        return this._video
    }

    /**
     *
     * @private
     */
    _setAppearance() {
        this._delegate.appearance = new Cesium.EllipsoidSurfaceAppearance({
            material: Cesium.Material.fromType('Image', {
                image: this._video
            })
        })
    }

    _mountedHook() {
        /**
         *  set the positions
         */
        this.positions = this._positions
        this.video = this._video
    }
}

Overlay.registerType('video_primitive')

export default VideoPrimitive
