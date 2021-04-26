import * as Cesium from 'cesium'
import State from '../../const/State'
import Util from '../../util/Util'

import IMG from '../../images/cloud.jpg'

class CloudEffect {
    constructor () {
        this._id = Util.uuid()
        this._map = undefined
        this._delegate = undefined
        this._rotateAmount = 0
        this._enable = false
        this.type = 'cloud'
        this._heading = 0
        this._state = State.INITIALIZED
    }

    set enable (enable) {
        if (!this._map.scene.mode === Cesium.SceneMode.SCENE3D) {
            return this
        }
        this._enable = this._delegate.show = enable
        if (this._enable) {
            this._map.scene.postUpdate.addEventListener(this._onRotate, this)
        } else {
            this._map.scene.postUpdate.removeEventListener(this._onRotate, this)
        }
        return this
    }

    get enable () {
        return this._enable
    }

    set rotateAmount (rotateAmount) {
        this._rotateAmount = rotateAmount
        return this
    }

    get rotateAmount () {
        return this._rotateAmount
    }

    /**
     *
     * @param scene
     * @param time
     * @private
     */
    _onRotate (scene, time) {
        if (this._rotateAmount === 0) {
            return
        }
        this._heading += this._rotateAmount
        if (this._heading >= 360 || this._heading <= -360) {
            this._heading = 0
        }
        this._delegate.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
            new Cesium.Cartesian3(),
            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(this._heading), 0, 0)
        )
    }

    /**
     *
     * @private
     */
    _createPrimitive () {
        this._delegate = new Cesium.Primitive({
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: 'Image',
                        uniforms: {
                            color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
                            image: IMG
                        },
                        components: {
                            alpha:
                                'texture2D(image, fract(repeat * materialInput.st)).r * color.a',
                            diffuse: 'vec3(1.0)'
                        },
                        translucent: true,
                        aboveGround: true
                    }
                })
            })
        })
        this._delegate.geometryInstances = new Cesium.GeometryInstance({
            geometry: new Cesium.EllipsoidGeometry({
                vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
                radii: this._map.scene.globe.ellipsoid.radii
            }),
            id: this._id
        })
        this._delegate.show = this._enable
        this._map.scene.primitives.add(this._delegate)
    }

    /**
     *
     * @param map
     * @returns {Cloud}
     */
    addTo (map) {
        if (!map) {
            return this
        }
        this._map = map
        this._createPrimitive()
        this._state = State.ADDED
        return this
    }
}

export default CloudEffect
