import * as Cesium from 'cesium'
import EventType from '../const/EventType.js'
import BaseClass from '../base/BaseClass.js'
import Util from '../util/Util.js'
import State from '../const/State.js'
const DEF_OPTIONS = {
  id: Util.uuid(),
  pid: -1,
  name: '未命名',
  show: true,
  opactity: 1,
  center: undefined,
  flyTo: true, // 加载完成后，是否自动飞行定位到数据所在的区域
  popup: undefined,
  tooltip: undefined,
  contextmenuItems: undefined
}
class BaseLayer extends BaseClass {
  constructor (options = {}) {
      super()
      this.setOptions(options)
      this._delegate = undefined
      this._map = undefined
      this._type = undefined
      this._state = State.INITIALIZED
      this.on(EventType.addLayer, this._onAdd, this)
      this.on(EventType.removeLayer, this._onRemove, this)
  }
  get id () {
    return this._id
  }
  get uuid () {
    return this._uuid
  }
  get isAdded () {
    return this._state === State.ADDED
  }
  get opactity () {
    return this._opacity
  }
  get state () {
    return this._state
  }
  get show () {
    return this._show
  }
  get type () {
    return this._type
  }
  setOptions (options) {
      this.options = Util.merge(DEF_OPTIONS, options)
      this._id = this.options.id
      this._show = this.options.show
      this._name = this.options.name
      this._center = this.options.center
      this._flyTo = this.options.flyTo
      this._popup = this.options.popup
      this._tooltip = this.options.tooltip
      this._contextmenuItems = this.options.contextmenuItems
      this._setOptionsHook()
  }
  /**
   * 创建options的钩子方法，每次setOptions的时候都会调用
   */
  _setOptionsHook () {}
  /**
   * 对象添加到地图上的创建钩子方法 每次add时候都会调用
   */
  _addedHook () {}
  /**
   * 对象添加到地图前创建的钩子方法，只会调用一次
   */
  _mountedHook () {}
  /**
   * 对象从地图上移除的创建钩子方法 每次 remove的时候都会调用
   */
  _removeHook () {}
  /**
   * 图层添加后 回调函数
   * @param {Object} map
   */
  _onAdd (map) {
    this._addedHook && this._addedHook()
    this._state = State.ADDED
  }
  /**
   * 图层移除后，回调函数
   */
  _onRemove () {
    this._removeHook && this._removeHook()
    this._state = State.REMOVED
  }

  /**
   * 添加到地图上的方法 同 map.addThing
   * @param {Object} map
   */
  addTo (map) {
    this._map = map
    if (map && map.addLayer) {
      map.addLayer(this)
    }
    return this
  }
  /**
   * 飞行定位到图层数据所在的视角
   * @param {Object} options
   */
  flyTo (options) {}
  /**
   * 入场动画结束后再执行flyTo 直接调用flyTo可能造成入场动画失败
   */
  flyToAnimationEnd () {}
  /**
   * 从地图中移除layer
   */
  remove () {}
  /**
   * 删除所有的矢量数据
   * 超类，需要被重写
   */
  clearGraphic () {}
}
export default BaseLayer
