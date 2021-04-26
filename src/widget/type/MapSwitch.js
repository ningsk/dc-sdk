import Widget from '@/dc/widget/Widget'
import { DomUtil } from '@/dc/util'
import { State } from '@/dc'

class MapSwitch extends Widget {
  constructor () {
    super()
    this._wrapper = DomUtil.create('div', 'dc-map-switch')
    this._config = undefined
    this._cache = []
    this.type = Widget.getWidgetType('map_switch')
    this._state = State.INITIALIZED
  }

  /**
   * Override the superclass function
   * @private
   */
  _enableHook () {
    !this._wrapper.parentNode &&
      this._map &&
      this._map.dcContainer.appendChild(this._wrapper)
  }

  /**
   *
   * @private
   */
  _installHook () {
    Object.defineProperty(this._map, 'mapSwitch', {
      value: this,
      writable: false
    })
    this.enable = true
    const self = this
    this._wrapper.onmouseover = () => {
      let width = 80
      if (self._cache.length > 0) {
        width = self._cache.length * 85
      }
      this._wrapper.style.width = `${width}px`
    }
    this._wrapper.onmouseout = () => {
      self._wrapper.style.width = `80px`
    }
  }

  _addItem (map) {
    const mapEl = DomUtil.create('div', 'map-item', this._wrapper)
    const index = this._cache.length ? this._cache.length - 1 : 0
    index === 0 && DomUtil.addClass(mapEl, 'active')
    mapEl.setAttribute('data-index', String(index))
    mapEl.onclick = e => {
      const old = document.getElementsByClassName('map-item active')
      if (old && old.length) {
        old[0].className = 'map-item'
      }
      if (this._map) {
        e.target.className = 'map-item active'
        this._map.changeBaseLayer(+e.target.getAttribute('data-index') || 0)
      }
    }
    if (map.iconUrl) {
      mapEl.style.cssText = `
       background:url(${map.iconUrl});
    `
    }
    const span = DomUtil.create('span', '', mapEl)
    span.innerHTML = map.name || '地图'
  }

  /**
   * add map
   * @param map
   */
  addMap (map = {}) {
    if (this._enable) {
      this._cache.push(map)
      this._addItem(map)
      if (this._cache.length > 1) {
        this._wrapper.style.visibility = 'visible'
      }
    }
  }
}
export default MapSwitch
