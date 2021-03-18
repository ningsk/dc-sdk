/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 11:37:30
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 11:42:09
 */
class Animation {
    constructor(viewer) {
        this._viewer = viewer
        this._options = {}
    }

    _bindEvent() {}

    _unbindEvent() {}

    start() {
        if (this._options.duration) {
            let timer = setTimeout(()=> {
                this._unbindEvent()
                this._options.callback && this._options.callback.call(this._options.context || this)
                clearTimeout(timer)
            }, Number(this._options.duration) * 1e3)
        }
        this._bindEvent()
        return this
    }

    stop() {
        this._unbindEvent()
        return this
    }

}

export default Animation