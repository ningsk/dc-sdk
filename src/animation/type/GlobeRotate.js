import * as Cesium from 'cesium'
import Animation from '../Animation'
class GlobeRotate extends Animation {
    constructor (viewer, options = {}) {
        super(viewer)
        this._options = options
        this.type = 'globe_rotate'
    }

    _icrf (scene, time) {
        if (scene.mode !== Cesium.SceneMode.SCENE3D) {
            return true
        }
        const icrfToFixed = Cesium.Transforms.computeFixedToIcrfMatrix(time)
        if (icrfToFixed) {
            const camera = this._map.camera
            const offset = Cesium.Cartesian3.clone(camera.position)
            const transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed)
            camera.lookAtTransform(transform, offset)
        }
    }

    _bindEvent () {
        this._map.clock.multiplier = this._options.speed || 12 * 1000
        this._map.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        this._map.scene.postUpdate.addEventListener(this._icrf, this)
    }

    _unbindEvent () {
        this._map.clock.multiplier = 1
        this._map.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        this._map.scene.postUpdate.removeListener(this._icrf, this)
    }
}

export default GlobeRotate
