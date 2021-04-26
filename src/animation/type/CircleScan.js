import { Transform, Parse, Util } from '@/dc'
import CircleScanShader from '@/dc/material/shader/circle/CircleScanShader.glsl'
class CircleScan extends Animation {
    constructor (viewer, position, radius, options = {}) {
        super(viewer)
        this._delegate = undefined
        this._position = Parse.parsePosition(position)
        this._radius = radius || 100
        this._color = options.color || Cesium.Color.RED
        this._speed = options.speed || 2
        this.type = 'circle_scan'
    }

    /**
     *
     * @private
     */
    _mountContent () {
        const center = Transform.transformWGS84ToCartesian(this._position)
        const up = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(
            center,
            new Cesium.Cartesian3()
        )
        const self = this
        this._delegate = new Cesium.PostProcessStage({
            name: Util.uuid(),
            fragmentShader: CircleScanShader,
            uniforms: {
                centerWC: function () {
                    return center
                },
                normalWC: function () {
                    return up
                },
                radius: function () {
                    return self._radius
                },
                speed: function () {
                    return self._speed
                },
                color: function () {
                    return self._color
                }
            }
        })
    }

    /**
     *
     * @returns {CircleScan}
     */
    start () {
        !this._delegate && this._mountContent()
        this._delegate && this._map.scene.postProcessStages.add(this._delegate)
        return this
    }

    /**
     *
     * @returns {CircleScan}
     */
    stop () {
        this._delegate &&
            this._map.scene.postProcessStages.remove(this._delegate)
        this._delegate = undefined
        return this
    }
}

export default CircleScan
