import Cesium from "cesium";
import Animation from "../Animation";

/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 11:55:17
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 13:16:30
 */
class GlobeRotate extends Animation {

    constructor(viewer, options = {}) {
        super(viewer)
        this._options = options
        this.type = 'globe_rotate'
    }

    _icrf(scene, time) {
        if (scene.mode !== Cesium.SceneMode.SCENE3D) {
            return true
        }
        let icrfToFixed = Cesium.Transforms.computeFixedToIcrfMatrix(time)
        if (icrfToFixed) {
            let camera = this._viewer.camera
            let offset = Cesium.Cartesian3.clone(camera.position)
            let transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed)
            camera.lookAtTransform(transform, offset)
        }
    }

    _bindEvent() {
        this._viewer.clock.multiplier = this._options.speed || 12 * 1000
        this._viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        this._viewer.scene.postUpdate.addEventListener(this._icrf, this)
    }

    _unbindEvent() {
        this._viewer.clock.multiplier = 1
        this._viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        this._viewer.scene.postUpdate.removeListener(this._icrf, this)
    }

}

export default GlobeRotate