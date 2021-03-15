/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 10:16:58
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 11:28:59
 */
import Cesium from "cesium";
import Parse from "../../parse/Parse";
import State from "../../state/State";
import Transform from "../../transform/Transform";
import { Util } from "../../util";
import BaseGraphic from "../BaseGraphic";


const DEF_STYLE = {
    pixelSize: 8,
    outlineColor: Cesium.Color.BLUE,
    outlineWidth: 2
}

class PointEntity extends BaseGraphic {
    constructor(position) {
        super()
        this._delegate = new Cesium.Entity({ point: {} })
        this._position = Parse.parsePosition(position)
        this.type = BaseGraphic.getGraphicType('point')
        this._state = State.INITIALIZED
    }

    set position(position) {
        this._position = Parse.parsePosition(position)
        this._delegate.position = Transform.transformWGS84ToCartesian(
            this._position
        )
        return this
    }

    get position() {
        return this._position
    }

    _mountedHook() {
        this.position = this._position
        Util.merge(this._delegate.point, DEF_STYLE, this._style)
    }

    setStyle(style) {
        if (!style || Object.keys(style).length === 0) {
            return this
        }
        delete style['position']
        this._style = style
        Util.merge(this._delegate.point, DEF_STYLE, this._style)
        return this
    }

    /**
  * Parse from entity
  * @param entity
  * @returns {any}
  */
    static fromEntity(entity) {
        let point = undefined
        let now = Cesium.JulianDate.now()
        let position = Transform.transformCartesianToWGS84(
            entity.position.getValue(now)
        )
        point = new Point(position)
        point.attr = {
            ...entity?.properties?.getValue(now)
        }
        return point
    }




}

BaseGraphic.registerType('point')

export default PointEntity
