/*
 * @Description: 绕点飞行 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 11:37:57
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 11:52:14
 */

import Animation from "../Animation";
import Parse from "../../parse/Parse"
import Cesium from "cesium";
import Transform from "../../transform/Transform";
class AroundPoint extends Animation {
    constructor(viewer, position, options = {}) {
        super(viewer)
        this._position = Parse.parsePosition(position)
        this._options = options
        this._heading = viewer.camera.heading
        this._aroundAmount = 0.2
        this.type = "around_point"
    }

    set position(position) {
        this._position = Parse.parsePosition(position)
        return this
    }

    set arroundAmount(arroundAmount) {
        this._aroundAmount = arroundAmount
        return this 
    }

    /**
     * @private
     */
    _bindEvent() {
        this._viewer.clock.onTick.addEventListener(this._onAround, this)
    }

    /**
     * @private
     */
    _unbindEvent() {
        this._viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        this._viewer.clock.onTick.removeEventListener(this._aroundAmount, this)
    }

    _onAround(scene, time) {
        this._heading += Cesium.Math.toRadians(this._aroundAmount)
        if (this._heading >= Math.PI * 2 || this._heading <= -Math.PI *2) {
            this._heading = 0
        }
        this._viewer.camera.lookAt(
            Transform.transformWGS84ToCartesian(this._position),
            new Cesium.HeadingPitchRange(
                this._heading,
                Cesium.Math.toRadians(this._options.pitch || 0),
                this._options.range || 1000
            )
        )
    }

}

export default AroundPoint