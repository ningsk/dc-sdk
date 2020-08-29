/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-28 16:20:36
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 16:36:36
 */
import Cesium from "cesium";
class ViewerOptions {
  constructor(viewer) {
    this._viewer = viewer
    this._options = {}
    this._init()
  }

  _init() {
    this._viewer.delegate.cesiumWidget._creditContainer.style.display = 'none'
    this._viewer.delegate.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )
    this._viewer.scene.screenSpaceCameraController.maximumZoomDistance = 40489014.0
    this._viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT
    this._viewer.scene.delegate.imageryLayers.removeAll()
  }

  _setViewerOption() {
    this._viewer.delegate.shadows = this._options.shadows ?? false
    this._viewer.delegate.resolutionScale = this._options.resolutionScale || 1.0
    return this
  }

  _setCanvasOption() {
    this._options.tabIndex &&
      this._viewer.scene.canvas.setAttribute('tabIndex', this._options.tabIndex)
    return this  
  }

  _setSceneOption() {
    let scene = this._viewer.scene
    scene.skyAtmosphere.show = this._options.showAtmosphere ?? true
    scene.sun.show = this._options.showSun ?? true
    scene.moon.show = this._options.showMoon ?? true
    scene.skyBox.show = this._options.showSkyBox ?? true
    scene.postProcessStages.fxaa.enabled = this._options.enableFxaa ?? false
    
    let cameraController = this._options.cameraController
    Util.merge(scene.screenSpaceCameraController, {
      enableRotate: cameraController?.enableRotate ?? true,
      enableTilt: cameraController?.enableTilt ?? true
      enableTranslate: cameraController?.enableTranslate ?? true,
      enableCollisionDetection:
        cameraController?.enableCollisionDetection ?? true,
      minimumZoomDistance: +cameraController?.minimumZoomDistance || 1.0,
      maximumZoomDistance: +cameraController?.maximumZoomDistance || 40489014.0
    })
    return this
  }

  _setGlobeOption() {
    let globe = this._viewer.scene.globe
    let globeOption = this._options.globe

    Util.merge(globe, {
      show: globeOption?.show ?? true,
      enableLighting: globeOption?.enableLighting ?? false,
      depthTestAgainstTerrain: globeOption?.undergroundMode ?? false,
      tileCacheSize: +globeOption?.tileCacheSize || 100,
      baseColor: globeOption?.baseColor || new Cesium.Color(0, 0, 0.5, 1)
    })

    Util.merge(globe.translucency, {
      enabled: globeOption?.translucency?.enabled ?? false,
      backFaceAlpha: +globeOption?.translucency?.backFaceAlpha || 1,
      backFaceAlphaByDistance: 
        globeOption?.translucency?.backFaceAlphaByDistance,
      frontFaceAlpha: +globeOption?.translucency?.fromFaceAlpha || 1,
      frontFaceAlphaByDistance:
        globeOption?.translucency?.frontFaceAlphaByDistance
    }) 

    return this
  }

  _setClockOption() {
    this._viewer.clock.shouldAnimate = this._options.shouldAnimate ?? true
    return this
  }

  setOptions(options) {
    if (Object.keys(options).length === 0) {
      return this
    }

    this._options = {
      ...this._options,
      ...options
    }

    this._setViewerOption()
      ._setCanvasOption()
      ._setSceneOption()
      ._setGlobeOption()
      ._setClockOption()

    return this
  }

}

export default ViewerOptions
