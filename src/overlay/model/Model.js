import * as Cesium from 'cesium'
import { Overlay, OverlayType } from '@/dc/overlay'
import Parse from '@/dc/parse/Parse'
import State from '@/dc/const/State'
import { Transform } from '@/dc/transform'
import { Util } from '@/dc/util'

class Model extends Overlay {
    constructor (position, modelUrl) {
        super()
        this._delegate = new Cesium.Entity({ model: {} })
        this._position = Parse.parsePosition(position)
        this._modelUrl = modelUrl
        this._rotateAmount = 0
        this.type = OverlayType.MODEL
        this._state = State.INITIALIZED
    }

    set position (position) {
        this._position = Parse.parsePosition(position)
        this._delegate.position = Transform.transformWGS84ToCartesian(
            this._position
        )
        if (this._rotateAmount === 0) {
            this._delegate.orientation = Cesium.Transforms.headingPitchRollQuaternion(
                Transform.transformWGS84ToCartesian(this._position),
                new Cesium.HeadingPitchRoll(
                    Cesium.Math.toRadians(this._position.heading),
                    Cesium.Math.toRadians(this._position.pitch),
                    Cesium.Math.toRadians(this._position.roll)
                )
            )
        }
        return this
    }

    get position () {
        return this._position
    }

    set modelUrl (modelUrl) {
        this._modelUrl = modelUrl
        this._delegate.model.uri = this._modelUrl
        return this
    }

    get modelUrl () {
        return this._modelUrl
    }

    set rotateAmount (amount) {
        this._rotateAmount = +amount
        this._delegate.orientation = new Cesium.CallbackProperty(time => {
            this._position.heading += this._rotateAmount
            if (this._position.heading >= 360 || this._position.heading <= -360) {
                this._position.heading = 0
            }
            return Cesium.Transforms.headingPitchRollQuaternion(
                Transform.transformWGS84ToCartesian(this._position),
                new Cesium.HeadingPitchRoll(
                    Cesium.Math.toRadians(this._position.heading),
                    Cesium.Math.toRadians(this._position.pitch),
                    Cesium.Math.toRadians(this._position.roll)
                )
            )
        })
        return this
    }

    get rotateAmount () {
        return this._rotateAmount
    }

    _mountedHook () {
        /**
         * set the location
         */
        this.position = this._position
        /**
         *  initialize the Overlay parameter
         */
        this.modelUrl = this._modelUrl
    }

    /**
     * Sets style
     * @param style
     * @returns {Model}
     */
    setStyle (style) {
        if (!style || Object.keys(style).length === 0) {
            return this
        }
        delete style['uri']
        this._style = style
        Util.merge(this._delegate.model, this._style)
        return this
    }

    /**
     * Parse from entity
     * @param entity
     * @param modelUrl
     * @returns {Model}
     */
    static fromEntity (entity, modelUrl) {
        const now = Cesium.JulianDate.now()
        const position = Transform.transformCartesianToWGS84(
            entity.position.getValue(now)
        )
        const model = new Model(position, modelUrl)
        model.attr = {
            ...entity.properties.getValue(now)
        }
        return model
    }
}

export default Model
