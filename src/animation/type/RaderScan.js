import Cesium from "cesium";
import Parse from "../../parse/Parse";
import Transform from "../../transform/Transform";
import Animation from "../Animation";
import { Util } from "../../util"

const RaderScanShader = require('../../material/shader/radar/RadarScanShader.glsl')

/*
 * @Description: 雷达 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 13:17:34
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 13:32:53
 */
class RaderScan extends Animation {
    constructor(viewer, position, radius, options = {}) {
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
    _mountContent() {
        let center = Transform.transformWGS84ToCartesian(this._position)
        let up = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(
            center,
            new Cesium.Cartesian3()
        )
        let time = new Date().getTime()
        let self = this
        this._delegate = new Cesium.PostProcessStage({
            name: Util.uuid(),
            fragmentShader: RaderScanShader,
            uniforms: {
                centerWC: function() {
                    return center
                },
                planeNormalWC: function() {
                    return up
                },
                lineNormalWC: function() {
                    let rotateQ = new Cesium.Quaternion()
                    let rotateM = new Cesium.Matrix3()
                    let east = Cesium.Cartesian3.cross(
                        Cesium.Cartesian3.UNIT_Z,
                        up,
                        new Cesium.Cartesian3()
                    )
                    let now = new Date().getTime()
                    let angle = Cesium.Math.PI * 2 * ((now - time) / 1e4) * self._speed
                    Cesium.Quaternion.fromAxisAngle(up, angle, rotateQ)
                    Cesium.Matrix3.fromQuaternion(rotateQ, rotateM)
                    Cesium.Matrix3.multiplyByVector(rotateM, east, east)
                    Cesium.Cartesian3.normalize(east, east)
                    return east
                },
                radius: function() {
                    self._radius
                },
                color: function() {
                    return self._color
                }
            }
        })
    }

    start() {
        !this._delegate && this._mountContent()
        this._delegate && this._viewer.scene.postProcessStages.add(this._delegate)
        return this
    }


    stop() {
        this._delegate && this._viewer.scene.postProcessStages.remove(this._delegate)
        this._delegate = undefined
        return this
    }

}

export default RaderScan
