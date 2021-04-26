import Event from '../Event'
import { SceneEventType } from '@/dc/event'
class SceneEvent extends Event {
  constructor (viewer) {
    super()
    this._camera = viewer.camera
    this._scene = viewer.scene
    this._clock = viewer.clock
  }
  on (type, callback, context) {
    let removeCallback
    switch (type) {
      case SceneEventType.CAMERA_MOVE_START:
        removeCallback = this._camera.moveStart.addEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.CAMERA_MOVE_END:
        removeCallback = this._camera.moveEnd.addEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.CAMERA_CHANGED:
        removeCallback = this._camera.changed.addEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.PRE_UPDATE:
        removeCallback = this._scene.preUpdate.addEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.POST_UPDATE:
        removeCallback = this._scene.postUpdate.addEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.PRE_RENDER:
        removeCallback = this._scene.preRender.addEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.POST_RENDER:
        removeCallback = this._scene.postRender.addEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.CLOCK_TICK:
        removeCallback = this._clock.onTick.addEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.MORPH_START:
        removeCallback = this._scene.morphStart.addEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.MORPH_COMPLETE:
        removeCallback = this._scene.morphComplete.addEventListener(
          callback,
          context || this
        )
        break
      default:
        break
    }
    return removeCallback
  }
  off (type, callback, context) {
    let removeCallback
    switch (type) {
      case SceneEventType.CAMERA_MOVE_START:
        removeCallback = this._camera.moveStart.removeEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.CAMERA_MOVE_END:
        removeCallback = this._camera.moveEnd.removeEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.CAMERA_CHANGED:
        removeCallback = this._camera.changed.removeEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.PRE_UPDATE:
        removeCallback = this._scene.preUpdate.removeEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.POST_UPDATE:
        removeCallback = this._scene.postUpdate.removeEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.PRE_RENDER:
        removeCallback = this._scene.preRender.removeEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.POST_RENDER:
        removeCallback = this._scene.postRender.removeEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.CLOCK_TICK:
        removeCallback = this._clock.onTick.removeEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.MORPH_START:
        removeCallback = this._scene.morphStart.removeEventListener(
          callback,
          context || this
        )
        break
      case SceneEventType.MORPH_COMPLETE:
        removeCallback = this._scene.morphComplete.removeEventListener(
          callback,
          context || this
        )
        break
      default:
        break
    }
    return removeCallback
  }
}
export default SceneEvent
