import ThingEvent from '../event/type/ThingEvent'
import Util from '../util/Util.js'
import State from '../const/State.js'
import { ThingEventType } from '@/dc'
class Thing {
  constructor (id) {
      this._id = Util.uuid()
      this._bid = id || Util.uuid()
      this._map = undefined
      this._thingEvent = new ThingEvent()
      this._thingEvent.on(ThingEventType.ADD, this._onAdd, this)
      this._thingEvent.off(ThingEventType.REMOVE, this._onRemove, this)
      this._state = undefined
      this._enabled = false
  }
  get thingId () {
    return this._id
  }
  get id () {
    return this._bid
  }
  get delegate () {
    return this._delegate
  }
  get state () {
    return this._state
  }
  get isAdded () {
    return this._state === State.ADDED
  }
  get enabled () {
    return this._enabled
  }
  set enabled (enabled) {
    if (this._enabled === enabled) {
      return this
    }
    this._enabled = enabled
    this._state = this._enabled ? State.ENABLED : State.DISABLED
    this._enabledHook && this._enabledHook()
    return this
  }
  _enabledHook () {}
  _addedHook () {}
  _mountedHook () {}
  _removeHook () {}
  _onAdd (map) {
    this._map = map
    // TODO 相关处理
    this._addedHook && this._addedHook()
    this._state = State.ADDED
  }
  _onRemove () {
    // TODO 相关处理
    this._removeHook && this._removeHook()
    this._state = State.REMOVED
  }
  addTo (map) {
    if (map && map.addThing) {
      map.addThing(this)
    }
  }
  remove () {
    if (this._map && this._map.removeThing) {
      this._map.removeThing(this)
    }
  }
}
export default Thing
