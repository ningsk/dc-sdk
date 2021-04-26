import * as Cesium from 'cesium'
import { Parse, Util, Transform } from '@/dc'

const RaderScanShader = require('../../material/shader/radar/RadarScanShader.glsl')
class RaderScan extends Animation {
    constructor (viewer, position, radius, options = {}) {
        super(viewer)
        this._position = Parse.parsePosition(position)
        this._radius = radius || 100
        this._color = options.color || Cesium.Color.BLUE
        this._speed = options.speed || 3
        this._delegate = undefined
        this.type = 'radar_scan'
    }

    /**
     * @private
     */
    _mountContent () {
        const center = Transform.transformWGS84ToCartesian(this._position)
        const up = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(
            center,
            new Cesium.Cartesian3()
        )
        const time = new Date().getTime()
        const self = this
        this._delegate = new Cesium.PostProcessStage({
            name: Util.uuid(),
            fragmentShader: RaderScanShader,
            uniforms: {
                centerWC: function () {
                    return center
                },
                planeNormalWC: function () {
                    return up
                },
                lineNormalWC: function () {
                    const rotateQ = new Cesium.Quaternion()
                    const rotateM = new Cesium.Matrix3()
                    const east = Cesium.Cartesian3.cross(
                        Cesium.Cartesian3.UNIT_Z,
                        up,
                        new Cesium.Cartesian3()
                    )
                    const now = new Date().getTime()
                    const angle = Cesium.Math.PI * 2 * ((now - time) / 1e4) * self._speed
                    Cesium.Quaternion.fromAxisAngle(up, angle, rotateQ)
                    Cesium.Matrix3.fromQuaternion(rotateQ, rotateM)
                    Cesium.Matrix3.multiplyByVector(rotateM, east, east)
                    Cesium.Cartesian3.normalize(east, east)
                    return east
                },
                radius: function () {
                  // eslint-disable-next-line no-unused-expressions
                    self._radius
                },
                color: function () {
                    return self._color
                }
            }
        })
    }

    start () {
        !this._delegate && this._mountContent()
        this._delegate && this._map.scene.postProcessStages.add(this._delegate)
        return this
    }

    stop () {
        this._delegate && this._map.scene.postProcessStages.remove(this._delegate)
        this._delegate = undefined
        return this
    }
}

export default RaderScan
