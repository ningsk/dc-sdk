import * as Cesium from "cesium"
import Overlay from "../Ovelay";
import Parse from "../../parse/Parse";
import State from "../../state/State";
import Transform from "../../transform/Transform";

/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 14:51:00
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 15:01:57
 */
class Box extends Overlay {
    constructor(position, length, width, height) {
        super()
        this._position = Parse.parsePosition(position)
        this._length = length
        this._width = width
        this._height = height
        this._delegate = new Cesium.Entity({
            box: {
                dimensions: {
                    x: +this._length,
                    y: +this._width,
                    z: +this._height
                }
            }
        })
        this.type = Overlay.getOverlayType('box')
        this._state = State.INSTALLED
    }

    set position(position) {
        this._position = Parse.parsePosition(position)
        this._delegate.position = Transform.transformWGS84ToCartesian(this._position)
        this._delegate.orientation = Cesium.Transforms.headingPitchRollQuaternion(
            Transform.transformWGS84ToCartesian(this._position),
            new Cesium.HeadingPitchRoll(
                Cesium.Math.toRadians(this._position.heading),
                Cesium.Math.toRadians(this._position.pitch),
                Cesium.Math.toRadians(this._position.roll)
            )
        )
        return this
    }

    get position() {
        return this._position
    }

    set length(length) {
        this._length = length || 0
        this._delegate.box.dimensions.x = +this._length
        return this
    }

    get length() {
        return this._length
    }

    set width(width) {
        this._width = width || 0
        this._delegate.box.dimensions.y = +this._width
        return this
    }

    get width() {
        return this._width
    }

    set height(height) {
        this._height = height || 0
        this._delegate.box.dimensions.z = + this._height
        return this
    }

    get height() {
        return this._height
    }

    _mountedHook() {
        this._position = this._position
    }

    setStyle(style) {
        if (Object.keys(style).length === 0) {
            return this
        }
        delete style['length'] && delete style['width'] && delete style['height']
        this._style = style
        Util.merge(this._delegate.box, this._style)
        return this
    }

}

Overlay.registerType('box')

export default Box
