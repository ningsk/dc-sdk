/**
 * 绕点飞行
 */
import * as Cesium from 'cesium'
import Animation from '../Animation'
import Parse from '../../parse/Parse'
import { Transform } from '@/dc/transform'
class AroundPoint extends Animation {
    constructor (viewer, position, options = {}) {
        super(viewer)
        this._position = Parse.parsePosition(position)
        this._options = options
        this._heading = viewer.camera.heading
        this._aroundAmount = 0.2
        this.type = 'around_point'
    }

    set position (position) {
        this._position = Parse.parsePosition(position)
        return this
    }

    set aroundAmount (aroundAmount) {
        this._aroundAmount = aroundAmount
        return this
    }

    /**
     * @private
     */
    _bindEvent () {
        this._map.clock.onTick.addEventListener(this._onAround, this)
    }

    /**
     * @private
     */
    _unbindEvent () {
        this._map.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        this._map.clock.onTick.removeEventListener(this._aroundAmount, this)
    }

    _onAround (scene, time) {
        this._heading += Cesium.Math.toRadians(this._aroundAmount)
        if (this._heading >= Math.PI * 2 || this._heading <= -Math.PI * 2) {
            this._heading = 0
        }
        this._map.camera.lookAt(
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
