import Widget from '@/dc/widget/Widget'
import { DomUtil } from '@/dc/util'
import State from '@/dc/const/State'
import { SceneEventType } from '@/dc/event'
import Icons from '@/dc/icons'
import * as Cesium from 'cesium'

class Compass extends Widget {
  constructor () {
    super()
    this._wrapper = DomUtil.create('div', `dc-compass`)
    this._compassRectangle = undefined
    this._outRing = undefined
    this._gyro = undefined
    this._rotation_marker = undefined
    this._orbitCursorAngle = 0
    this._orbitCursorOpacity = 0.0
    this._orbitLastTimestamp = 0
    this._orbitFrame = undefined
    this._orbitIsLook = false
    this._rotateInitialCursorAngle = undefined
    this._rotateFrame = undefined
    this._mouseMoveHandle = undefined
    this._mouseUpHandle = undefined
    this.type = Widget.getWidgetType('compass')
    this._state = State.INITIALIZED
  }

  /**
   *
   * @private
   */
  _installHook () {
    Object.defineProperty(this._map, 'compass', {
      value: this,
      writable: false
    })
    this._wrapper.onmousedown = e => {
      this._handleMouseDown(e)
    }
    this._wrapper.ondblclick = e => {
      this._handleDoubleClick(e)
    }
  }

  /**
   *
   * @private
   */
  _bindEvent () {
    this._map.on(SceneEventType.POST_RENDER, this._postRenderHandler, this)
  }

  /**
   *
   * @private
   */
  _unbindEvent () {
    this._map.off(SceneEventType.POST_RENDER, this._postRenderHandler, this)
  }

  /**
   *
   * @private
   */
  _postRenderHandler () {
    const heading = this._map.camera.heading
    this._outRing &&
      (this._outRing.style.cssText = `
      transform : rotate(-${heading}rad);
      -webkit-transform : rotate(-${heading}rad);
      `)
  }

  /**
   *
   * @private
   */
  _mountContent () {
    DomUtil.create('div', 'out-ring-bg', this._wrapper)
    this._outRing = DomUtil.parseDom(Icons.compass_outer, true, 'out-ring')
    this._wrapper.appendChild(this._outRing)
    this._gyro = DomUtil.parseDom(Icons.compass_inner, true, 'gyro')
    this._wrapper.appendChild(this._gyro)
    this._rotation_marker = DomUtil.parseDom(
      Icons.compass_rotation_marker,
      true,
      'rotation_marker'
    )
    this._wrapper.appendChild(this._rotation_marker)
    this._rotation_marker.style.visibility = 'hidden'
    this._ready = true
  }

  _handleMouseDown (e) {
    const scene = this._map.scene
    if (scene.mode === Cesium.SceneMode.MORPHING) {
      return true
    }
    this._compassRectangle = e.currentTarget.getBoundingClientRect()
    const maxDistance = this._compassRectangle.width / 2.0
    const vector = this._getVector(e)
    const distanceFraction = Cesium.Cartesian2.magnitude(vector) / maxDistance
    if (distanceFraction < 50 / 145) {
      this._orbit(vector)
    } else if (distanceFraction < 1.0) {
      this._rotate(vector)
    } else {
      return true
    }
  }

  _handleDoubleClick (event) {
    const scene = this._map.scene
    const camera = scene.camera
    const sscc = scene.screenSpaceCameraController
    if (scene.mode === Cesium.SceneMode.MORPHING || !sscc.enableInputs) {
      return true
    }
    if (
      scene.mode === Cesium.SceneMode.COLUMBUS_VIEW &&
      !sscc.enableTranslate
    ) {
      return
    }
    if (
      scene.mode === Cesium.SceneMode.SCENE3D ||
      scene.mode === Cesium.SceneMode.COLUMBUS_VIEW
    ) {
      if (!sscc.enableLook) {
        return
      }
      if (scene.mode === Cesium.SceneMode.SCENE3D) {
        if (!sscc.enableRotate) {
          return
        }
      }
    }
    const center = this._getCameraFocus(true)
    if (!center) {
      return
    }
    const cameraPosition = scene.globe.ellipsoid.cartographicToCartesian(
      camera.positionCartographic
    )
    const surfaceNormal = scene.globe.ellipsoid.geodeticSurfaceNormal(center)
    const focusBoundingSphere = new Cesium.BoundingSphere(center, 0)
    camera.flyToBoundingSphere(focusBoundingSphere, {
      offset: new Cesium.HeadingPitchRange(
        0,
        Cesium.Math.PI_OVER_TWO -
          Cesium.Cartesian3.angleBetween(surfaceNormal, camera.directionWC),
        Cesium.Cartesian3.distance(cameraPosition, center)
      ),
      duration: 1.5
    })
  }

  _getCameraFocus (inWorldCoordinates) {
    let result = new Cesium.Cartesian3()
    const scene = this._map.scene
    const camera = scene.camera
    if (scene.mode === Cesium.SceneMode.MORPHING) {
      return undefined
    }
    if (this._map.delegate.trackedEntity) {
      result = this._map.delegate.trackedEntity.position.getValue(
        this._map.clock.currentTime
      )
    } else {
      const rayScratch = new Cesium.Ray()
      rayScratch.origin = camera.positionWC
      rayScratch.direction = camera.directionWC
      result = scene.globe.pick(rayScratch, scene)
    }
    if (!result) {
      return undefined
    }
    if (
      scene.mode === Cesium.SceneMode.SCENE2D ||
      scene.mode === Cesium.SceneMode.COLUMBUS_VIEW
    ) {
      result = camera.worldToCameraCoordinatesPoint(result)
      const unprojectedScratch = new Cesium.Cartographic()
      if (inWorldCoordinates) {
        result = scene.globe.ellipsoid.cartographicToCartesian(
          scene.mapProjection.unproject(result, unprojectedScratch)
        )
      }
    } else {
      if (!inWorldCoordinates) {
        result = camera.worldToCameraCoordinatesPoint(result)
      }
    }
    return result
  }

  _orbit (vector) {
    const scene = this._map.scene
    const sscc = scene.screenSpaceCameraController
    const camera = scene.camera
    if (scene.mode === Cesium.SceneMode.MORPHING || !sscc.enableInputs) {
      return
    }
    switch (scene.mode) {
      case Cesium.SceneMode.COLUMBUS_VIEW:
        if (sscc.enableLook) {
          break
        }
        if (!sscc.enableTranslate || !sscc.enableTilt) {
          return
        }
        break
      case Cesium.SceneMode.SCENE3D:
        if (sscc.enableLook) {
          break
        }
        if (!sscc.enableTilt || !sscc.enableRotate) {
          return
        }
        break
      case Cesium.SceneMode.SCENE2D:
        if (!sscc.enableTranslate) {
          return
        }
        break
    }

    this._mouseMoveHandle = e => {
      this._orbitMouseMoveFunction(e)
    }
    this._mouseUpHandle = () => {
      this._orbitMouseUpFunction()
    }

    document.removeEventListener('mousemove', this._mouseMoveHandle, false)
    document.removeEventListener('mouseup', this._mouseUpHandle, false)

    this._orbitLastTimestamp = Cesium.getTimestamp()

    if (this._map.delegate.trackedEntity) {
      this._orbitFrame = undefined
      this._orbitIsLook = false
    } else {
      const center = this._getCameraFocus(true)

      if (!center) {
        this._orbitFrame = Cesium.Transforms.eastNorthUpToFixedFrame(
          camera.positionWC,
          scene.globe.ellipsoid
        )
        this._orbitIsLook = true
      } else {
        this._orbitFrame = Cesium.Transforms.eastNorthUpToFixedFrame(
          center,
          scene.globe.ellipsoid
        )
        this._orbitIsLook = false
      }
    }

    this._rotation_marker.style.visibility = 'visible'
    this._gyro.className += ' gyro-active'
    document.addEventListener('mousemove', this._mouseMoveHandle, false)
    document.addEventListener('mouseup', this._mouseUpHandle, false)
    this._map.clock.onTick.addEventListener(this._orbitTickFunction, this)
    this._updateAngleAndOpacity(vector, this._compassRectangle.width)
  }

  _orbitTickFunction (e) {
    const scene = this._map.scene
    const camera = this._map.camera
    const timestamp = Cesium.getTimestamp()
    const deltaT = timestamp - this._orbitLastTimestamp
    const rate = ((this._orbitCursorOpacity - 0.5) * 2.5) / 1000
    const distance = deltaT * rate
    const angle = this._orbitCursorAngle + Cesium.Math.PI_OVER_TWO
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    let oldTransform

    if (this._orbitFrame) {
      oldTransform = Cesium.Matrix4.clone(camera.transform)
      camera.lookAtTransform(this._orbitFrame)
    }

    if (scene.mode === Cesium.SceneMode.SCENE2D) {
      camera.move(
        new Cesium.Cartesian3(x, y, 0),
        (Math.max(scene.canvas.clientWidth, scene.canvas.clientHeight) / 100) *
          camera.positionCartographic.height *
          distance
      )
    } else {
      if (this._orbitIsLook) {
        camera.look(Cesium.Cartesian3.UNIT_Z, -x)
        camera.look(camera.right, -y)
      } else {
        camera.rotateLeft(x)
        camera.rotateUp(y)
      }
    }
    if (this._orbitFrame && oldTransform) {
      camera.lookAtTransform(oldTransform)
    }
    this._orbitLastTimestamp = timestamp
  }

  _updateAngleAndOpacity (vector, compassWidth) {
    const angle = Math.atan2(-vector.y, vector.x)
    this._orbitCursorAngle = Cesium.Math.zeroToTwoPi(
      angle - Cesium.Math.PI_OVER_TWO
    )
    const distance = Cesium.Cartesian2.magnitude(vector)
    const maxDistance = compassWidth / 2.0
    const distanceFraction = Math.min(distance / maxDistance, 1.0)
    this._orbitCursorOpacity = 0.5 * distanceFraction * distanceFraction + 0.5
    this._rotation_marker.style.cssText = `
      transform: rotate(-${this._orbitCursorAngle}rad);
      opacity: ${this._orbitCursorOpacity}`
  }

  _orbitMouseMoveFunction (e) {
    this._updateAngleAndOpacity(
      this._getVector(e),
      this._compassRectangle.width
    )
  }

  _orbitMouseUpFunction () {
    document.removeEventListener('mousemove', this._mouseMoveHandle, false)
    document.removeEventListener('mouseup', this._mouseUpHandle, false)
    this._map.clock.onTick.removeEventListener(this._orbitTickFunction, this)
    this._mouseMoveHandle = undefined
    this._mouseUpHandle = undefined
    this._rotation_marker.style.visibility = 'hidden'
    this._gyro.className = this._gyro.className.replace(' gyro-active', '')
  }

  _rotate (vector) {
    const scene = this._map.scene
    const camera = scene.camera
    const sscc = scene.screenSpaceCameraController
    if (
      scene.mode === Cesium.SceneMode.MORPHING ||
      scene.mode === Cesium.SceneMode.SCENE2D ||
      !sscc.enableInputs
    ) {
      return
    }
    if (
      !sscc.enableLook &&
      (scene.mode === Cesium.SceneMode.COLUMBUS_VIEW ||
        (scene.mode === Cesium.SceneMode.SCENE3D && !sscc.enableRotate))
    ) {
      return
    }
    this._mouseMoveHandle = e => {
      this._rotateMouseMoveFunction(e)
    }
    this._mouseUpHandle = () => {
      this._rotateMouseUpFunction()
    }
    document.removeEventListener('mousemove', this._mouseMoveHandle, false)
    document.removeEventListener('mouseup', this._mouseUpHandle, false)
    this._rotateInitialCursorAngle = Math.atan2(-vector.y, vector.x)
    if (this._map.delegate.trackedEntity) {
      this._rotateFrame = undefined
    } else {
      const center = this._getCameraFocus(true)
      if (
        !center ||
        (scene.mode === Cesium.SceneMode.COLUMBUS_VIEW &&
          !sscc.enableLook &&
          !sscc.enableTranslate)
      ) {
        this._rotateFrame = Cesium.Transforms.eastNorthUpToFixedFrame(
          camera.positionWC,
          scene.globe.ellipsoid
        )
      } else {
        this._rotateFrame = Cesium.Transforms.eastNorthUpToFixedFrame(
          center,
          scene.globe.ellipsoid
        )
      }
    }
    let oldTransform
    if (this._rotateFrame) {
      oldTransform = Cesium.Matrix4.clone(camera.transform)
      camera.lookAtTransform(this._rotateFrame)
    }
    this._rotateInitialCameraAngle = -camera.heading
    if (this._rotateFrame && oldTransform) {
      camera.lookAtTransform(oldTransform)
    }
    document.addEventListener('mousemove', this._mouseMoveHandle, false)
    document.addEventListener('mouseup', this._mouseUpHandle, false)
  }

  _rotateMouseMoveFunction (e) {
    const camera = this._map.camera
    const vector = this._getVector(e)
    const angle = Math.atan2(-vector.y, vector.x)
    const angleDifference = angle - this._rotateInitialCursorAngle
    const newCameraAngle = Cesium.Math.zeroToTwoPi(
      this._rotateInitialCameraAngle - angleDifference
    )
    let oldTransform
    if (this._rotateFrame) {
      oldTransform = Cesium.Matrix4.clone(camera.transform)
      camera.lookAtTransform(this._rotateFrame)
    }
    const currentCameraAngle = -camera.heading
    camera.rotateRight(newCameraAngle - currentCameraAngle)
    if (this._rotateFrame && oldTransform) {
      camera.lookAtTransform(oldTransform)
    }
  }

  _rotateMouseUpFunction () {
    document.removeEventListener('mousemove', this._mouseMoveHandle, false)
    document.removeEventListener('mouseup', this._mouseUpHandle, false)
    this._mouseMoveHandle = undefined
    this._mouseUpHandle = undefined
  }

  _getVector (e) {
    const compassRectangle = this._compassRectangle
    const center = new Cesium.Cartesian2(
      (compassRectangle.right - compassRectangle.left) / 2.0,
      (compassRectangle.bottom - compassRectangle.top) / 2.0
    )
    const clickLocation = new Cesium.Cartesian2(
      e.clientX - compassRectangle.left,
      e.clientY - compassRectangle.top
    )
    const vector = new Cesium.Cartesian2()
    Cesium.Cartesian2.subtract(clickLocation, center, vector)
    return vector
  }
}

Widget.registerType('compass')

export default Compass
