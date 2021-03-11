import Event from "../event/Event";
import Util from "../util/Util";

/*
 * @Description: Things对象（如特效、分析、管理类）的基类
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-11 17:09:55
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-11 17:50:09
 */
class Things extends Event{

    /**
     * 
     * @param {Object} options
     */
    constructor(options) {
        super()
        this._id = options.id || Util.uuid() // 对象的id标识
        this._enabled = options.enabled || true  // 对象的启用状态
        this._viewer = undefined
        this._state = undefined
    }

    set enabled(enable) {
        this._enabled = enable
    }

    

    get enabled() {
        return this._enabled
    }

    get id() {
        return this._id
    }


    get state() {
        return this._state
    }

    

    /**
     * The hook for added
     * @private
     */
    _addedHook() { }

    /**
     * The hook for removed
     * @private
     */
    _removedHook() { }

    addTo(viewer) {
        this._viewer = viewer
        return this
    }

}

export default Things