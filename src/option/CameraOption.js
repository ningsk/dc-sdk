import * as Cesium from 'cesium'
import MouseMode from '@/dc/option/MouseMode'

class CameraOption {
  constructor (map) {
    this._map = map
    this._mouseMode = 0
  }

  /**
   * @param min
   * @param max
   */
  setPitchRange (min, max) {
    const handler = new Cesium.ScreenSpaceEventHandler(this._map.scene.canvas)
    if (this._map.scene.mode === Cesium.SceneMode.SCENE3D) {
      handler.setInputAction(
        movement => {
          handler.setInputAction(movement => {
            let enableTilt = true
            const isUp = movement.endPosition.y < movement.startPosition.y
            if (
              isUp &&
              this._map.camera.pitch > Cesium.Math.toRadians(max)
            ) {
              enableTilt = false
            } else if (
              !isUp &&
              this._map.camera.pitch < Cesium.Math.toRadians(min)
            ) {
              enableTilt = false
            } else {
              enableTilt = true
            }
            this._map.scene.screenSpaceCameraController.enableTilt = enableTilt
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        },
        this._mouseMode === MouseMode.LEFT_MIDDLE
          ? Cesium.ScreenSpaceEventType.MIDDLE_DOWN
          : Cesium.ScreenSpaceEventType.RIGHT_DOWN
      )
      handler.setInputAction(
        movement => {
          this._map.scene.screenSpaceCameraController.enableTilt = true
          handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        },
        this._mouseMode === MouseMode.LEFT_MIDDLE
          ? Cesium.ScreenSpaceEventType.MIDDLE_UP
          : Cesium.ScreenSpaceEventType.RIGHT_UP
      )
    }
  }

  /**
   *
   */
  limitCameraToGround () {
    this._map.camera.changed.addEventListener(frameState => {
      if (
        this._map.camera._suspendTerrainAdjustment &&
        this._map.scene.mode === Cesium.SceneMode.SCENE3D
      ) {
        this._map.camera._suspendTerrainAdjustment = false
        this._map.camera._adjustOrthographicFrustum(true)
      }
    })
  }

  /**
   * @param west
   * @param south
   * @param east
   * @param north
   */
  setBounds (west, south, east, north) {}

  /**
   *
   * @param mouseMode
   */
  changeMouseMode (mouseMode) {
    this._mouseMode = mouseMode || MouseMode.LEFT_MIDDLE
    if (mouseMode === MouseMode.LEFT_MIDDLE) {
      this._map.scene.screenSpaceCameraController.tiltEventTypes = [
        Cesium.CameraEventType.MIDDLE_DRAG,
        Cesium.CameraEventType.PINCH,
        {
          eventType: Cesium.CameraEventType.LEFT_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL
        },
        {
          eventType: Cesium.CameraEventType.RIGHT_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL
        }
      ]
      this._map.scene.screenSpaceCameraController.zoomEventTypes = [
        Cesium.CameraEventType.RIGHT_DRAG,
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH
      ]
    } else if (mouseMode === MouseMode.LEFT_RIGHT) {
      this._map.scene.screenSpaceCameraController.tiltEventTypes = [
        Cesium.CameraEventType.RIGHT_DRAG,
        Cesium.CameraEventType.PINCH,
        {
          eventType: Cesium.CameraEventType.LEFT_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL
        },
        {
          eventType: Cesium.CameraEventType.RIGHT_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL
        }
      ]
      this._map.scene.screenSpaceCameraController.zoomEventTypes = [
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH
      ]
    }
  }
}

export default CameraOption
