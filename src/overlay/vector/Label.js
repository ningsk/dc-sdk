import * as Cesium from 'cesium'
import Overlay from '@/dc/overlay/Overlay'
import { OverlayType } from '@/dc/overlay'
import State from '@/dc/const/State'
import Parse from '@/dc/parse/Parse'
import { Transform } from '@/dc/transform'
import { Util } from '@/dc/util'
class Label extends Overlay {
    constructor (position, text) {
        super()
        this._delegate = new Cesium.Entity({ label: {} })
        this._position = Parse.parsePosition(position)
        this._text = text
        this.type = OverlayType.LABEL
        this._state = State.INITIALIZED
    }

    set position (position) {
        this._position = Parse.parsePosition(position)
        this._delegate.position = Transform.transformWGS84ToCartesian(
            this._position
        )
        return this
    }

    get position () {
        return this._position
    }

    set text (text) {
        this._text = text
        this._delegate.label.text = this._text
        return this
    }

    get text () {
        return this._text
    }

    _mountedHook () {
        /**
         * set the location
         */
        this.position = this._position

        /**
         *  initialize the Overlay parameter
         */
        this.text = this._text
    }

    /**
     *
     * @param {*} text
     * @param {*} textStyle
     */
    setLabel (text, textStyle) {
        return this
    }

    /**
     * Sets Style
     * @param style
     * @returns {Label}
     */
    setStyle (style) {
        if (!style || Object.keys(style).length === 0) {
            return this
        }
        delete style['text']
        this._style = style
        Util.merge(this._delegate.label, this._style)
        return this
    }

    /**
     * Parse from entity
     * @param entity
     * @returns {any}
     */
    static fromEntity (entity) {
        const now = Cesium.JulianDate.now()
        const position = Transform.transformCartesianToWGS84(
            entity.position.getValue(now)
        )
        let label
        if (entity.billboard) {
            label = new Label(position, entity.name)
            label.attr = {
                ...entity.properties.getValue(now)
            }
        }
        return label
    }
}
export default Label
