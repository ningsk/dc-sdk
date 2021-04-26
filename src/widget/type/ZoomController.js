import Widget from '../Widget'
import { DomUtil } from '@/dc/util'
import State from '@/dc/const/State'
import * as Cesium from 'cesium'
import Icons from '@/dc/icons'

class ZoomController extends Widget {
  constructor () {
    super()
    this._wrapper = DomUtil.create('div', 'dc-zoom-controller')
    this._zoomInEl = undefined
    this._zoomOutEl = undefined
    this._refreshEl = undefined
    this.type = Widget.getWidgetType('zoom_controller')
    this._state = State.INITIALIZED
  }

  /**
   *
   * @param scene
   * @returns {Cartesian3}
   * @private
   */
  _getCameraFocus (scene) {
    const ray = new Cesium.Ray(
      scene.camera.positionWC,
      scene.camera.directionWC
    )
    const intersections = Cesium.IntersectionTests.rayEllipsoid(
      ray,
      Cesium.Ellipsoid.WGS84
    )
    if (intersections) {
      return Cesium.Ray.getPoint(ray, intersections.start)
    }
    // Camera direction is not pointing at the globe, so use the ellipsoid horizon point as
    // the focal point.
    return Cesium.IntersectionTests.grazingAltitudeLocation(
      ray,
      Cesium.Ellipsoid.WGS84
    )
  }

  /**
   *
   * @param camera
   * @param focus
   * @param scalar
   * @returns {Cartesian3}
   * @private
   */
  _getCameraPosition (camera, focus, scalar) {
    const cartesian3Scratch = new Cesium.Cartesian3()
    const direction = Cesium.Cartesian3.subtract(
      focus,
      camera.position,
      cartesian3Scratch
    )
    const movementVector = Cesium.Cartesian3.multiplyByScalar(
      direction,
      scalar,
      cartesian3Scratch
    )
    return Cesium.Cartesian3.add(
      camera.position,
      movementVector,
      cartesian3Scratch
    )
  }

  /**
   *
   * @returns {boolean}
   * @private
   */
  _zoomIn () {
    const scene = this._map.scene
    const camera = scene.camera
    const sscc = scene.screenSpaceCameraController
    if (
      scene.mode === Cesium.SceneMode.MORPHING ||
      !sscc.enableInputs ||
      scene.mode === Cesium.SceneMode.COLUMBUS_VIEW
    ) {
      return true
    } else if (scene.mode === Cesium.SceneMode.SCENE2D) {
      camera.zoomIn(camera.positionCartographic.height * 0.5)
    } else if (scene.mode === Cesium.SceneMode.SCENE3D) {
      const focus = this._getCameraFocus(scene)
      const cameraPosition = this._getCameraPosition(camera, focus, 1 / 2)
      camera.flyTo({
        destination: cameraPosition,
        orientation: {
          heading: camera.heading,
          pitch: camera.pitch,
          roll: camera.roll
        },
        duration: 0.5,
        convert: false
      })
    }
  }

  /**
   *
   * @private
   */
  _refresh () {
    this._map.camera.flyHome(1.5)
  }

  /**
   *
   * @returns {boolean}
   * @private
   */
  _zoomOut () {
    const scene = this._map.scene
    const camera = scene.camera
    const sscc = scene.screenSpaceCameraController
    if (
      scene.mode === Cesium.SceneMode.MORPHING ||
      !sscc.enableInputs ||
      scene.mode === Cesium.SceneMode.COLUMBUS_VIEW
    ) {
      return true
    } else if (scene.mode === Cesium.SceneMode.SCENE2D) {
      camera.zoomOut(camera.positionCartographic.height)
    } else if (scene.mode === Cesium.SceneMode.SCENE3D) {
      const focus = this._getCameraFocus(scene)
      const cameraPosition = this._getCameraPosition(camera, focus, -1)
      camera.flyTo({
        destination: cameraPosition,
        orientation: {
          heading: camera.heading,
          pitch: camera.pitch,
          roll: camera.roll
        },
        duration: 0.5,
        convert: false
      })
    }
  }

  /**
   *
   * @private
   */
  _installHook () {
    Object.defineProperty(this._map, 'zoomController', {
      value: this,
      writable: false
    })
  }

  /**
   *
   * @private
   */
  _mountContent () {
    this._zoomInEl = DomUtil.parseDom(Icons.increase, true, 'zoom-in')
    this._refreshEl = DomUtil.parseDom(Icons.refresh, true, 'refresh')
    this._zoomOutEl = DomUtil.parseDom(Icons.decrease, true, 'zoom-out')
    this._wrapper.appendChild(this._zoomInEl)
    this._wrapper.appendChild(this._refreshEl)
    this._wrapper.appendChild(this._zoomOutEl)
    const self = this
    this._zoomInEl.onclick = e => {
      self._zoomIn()
    }
    this._refreshEl.onclick = e => {
      self._refresh()
    }
    this._zoomOutEl.onclick = e => {
      self._zoomOut()
    }
    this._ready = true
  }
}
export default ZoomController
