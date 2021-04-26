class Animation {
    constructor (map) {
        this._map = map
        this._options = {}
    }

    _bindEvent () {}

    _unbindEvent () {}

    start () {
        if (this._options.duration) {
            const timer = setTimeout(() => {
                this._unbindEvent()
                this._options.callback && this._options.callback.call(this._options.context || this)
                clearTimeout(timer)
            }, Number(this._options.duration) * 1e3)
        }
        this._bindEvent()
        return this
    }

    stop () {
        this._unbindEvent()
        return this
    }
}

export default Animation
