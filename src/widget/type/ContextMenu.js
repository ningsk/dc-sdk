import Widget from '@/dc/widget/Widget'
import { DomUtil } from '@/dc/util'
import State from '@/dc/const/State'
import * as Cesium from 'cesium'

class ContextMenu extends Widget {
  constructor () {
    super()
    this._wrapper = DomUtil.create('div', 'dc-context-menu')
    this._ulEl = undefined
    this._handler = undefined
    this._overlay = undefined
    this._position = undefined
    this._wgs84Position = undefined
    this._surfacePosition = undefined
    this._wgs84SurfacePosition = undefined
    this._windowPosition = undefined
    this._config = {}
    this._defaultMenu = [
      {
        label: '飞到默认位置',
        callback: e => {
          this._map.camera.flyHome(1.5)
        },
        context: this
      },
      {
        label: '取消飞行',
        callback: e => {
          this._map.camera.cancelFlight()
        },
        context: this
      }
    ]
    this._overlayMenu = []
    this.type = Widget.getWidgetType('contextmenu')
    this._state = State.INITIALIZED
  }

  set DEFAULT_MENU (menus) {
    this._defaultMenu = menus
    return this
  }

  set config (config) {
    this._config = config
    config.customClass && this._setCustomClass()
    return this
  }

  /**
   *
   * @private
   */
  _installHook () {
    Object.defineProperty(this._map, 'contextMenu', {
      value: this,
      writable: false
    })
    this._handler = new Cesium.ScreenSpaceEventHandler(this._map.canvas)
  }

  /**
   *
   * @private
   */
  _bindEvent () {
    this._handler.setInputAction(movement => {
      this._onRightClick(movement)
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    this._handler.setInputAction(movement => {
      this._onClick(movement)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  /**
   *
   * @private
   */
  _unbindEvent () {
    this._handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    this._handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  /**
   *
   * @private
   */
  _mountContent () {
    this._ulEl = DomUtil.create('ul', 'menu-list', this._wrapper)
    this._ready = true
  }

  /**
   *
   * @private
   */
  _mountMenu () {
    while (this._ulEl.hasChildNodes()) {
      this._ulEl.removeChild(this._ulEl.firstChild)
    }
    // Add menu item
    if (this._overlayMenu && this._overlayMenu.length) {
      this._overlayMenu.forEach(item => {
        this._addMenuItem(item.label, item.callback, item.context || this)
      })
    }

    if (this._defaultMenu && this._defaultMenu.length) {
      this._defaultMenu.forEach(item => {
        this._addMenuItem(item.label, item.callback, item.context || this)
      })
    }
  }

  /**
   *
   * @param movement
   * @private
   */
  _onRightClick (movement) {
    if (!this._enable) {
      return
    }
    this._overlay = undefined
    const scene = this._map.scene
    this._windowPosition = movement.position
    this._updateWindowCoord(movement.position)
    const target = scene.pick(movement.position)
    if (scene.pickPositionSupported) {
      this._position = scene.pickPosition(movement.position)
    }
    if (this._position) {
      const c = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this._position)
      if (c) {
        this._wgs84Position = {
          lng: Cesium.Math.toDegrees(c.longitude),
          lat: Cesium.Math.toDegrees(c.latitude),
          alt: c.height
        }
      }
    }
    if (scene.mode === Cesium.SceneMode.SCENE3D) {
      const ray = scene.camera.getPickRay(movement.position)
      this._surfacePosition = scene.globe.pick(ray, scene)
    } else {
      this._surfacePosition = scene.camera.pickEllipsoid(
        movement.position,
        Cesium.Ellipsoid.WGS84
      )
    }

    if (this._surfacePosition) {
      const c = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        this._surfacePosition
      )
      if (c) {
        this._wgs84SurfacePosition = {
          lng: Cesium.Math.toDegrees(c.longitude),
          lat: Cesium.Math.toDegrees(c.latitude),
          alt: c.height
        }
      }
    }
    // for Entity
    if (target && target.id && target.id instanceof Cesium.Entity) {
      const layer = this._map
        .getLayers()
        .filter(item => item.layerId === target.id.layerId)[0]
      if (layer && layer.getOverlay) {
        this._overlay = layer.getOverlay(target.id.overlayId)
      }
    }
    // for Cesium3DTileFeature
    if (target && target instanceof Cesium.Cesium3DTileFeature) {
      const layer = this._map
        .getLayers()
        .filter(item => item.layerId === target.tileset.layerId)[0]
      if (layer && layer.getOverlay) {
        this._overlay = layer.getOverlay(target.tileset.overlayId)
      }
    }
    this._overlayMenu = this._overlay?.contextMenu || []
    this._mountMenu()
  }
  /**
   *
   * @param movement
   * @private
   */
  _onClick (movement) {
    this.hide()
  }

  /**
   *
   * @param windowCoord
   * @private
   */
  _updateWindowCoord (windowCoord) {
    this._wrapper.style.cssText = `
    visibility:visible;
    z-index:1;
    transform:translate3d(${Math.round(windowCoord.x)}px,${Math.round(
      windowCoord.y
    )}px, 0);
    `
  }

  /**
   *
   * @private
   */
  _setCustomClass () {
    DomUtil.setClass(
      this._wrapper,
      `dc-context-menu ${this._config.customClass}`
    )
  }

  /**
   *
   * @param label
   * @param method
   * @param context
   * @returns {ContextMenu}
   * @private
   */
  _addMenuItem (label, method, context) {
    if (!label || !method) {
      return this
    }
    const menu = DomUtil.create('li', 'menu-item', null)
    const a = DomUtil.create('a', '', menu)
    a.innerHTML = label
    a.href = 'javascript:void(0)'
    const self = this
    if (method) {
      a.onclick = () => {
        method.call(context, {
          windowPosition: self._windowPosition,
          position: self._position,
          wgs84Position: self._wgs84Position,
          surfacePosition: self._surfacePosition,
          wgs84SurfacePosition: self._wgs84SurfacePosition,
          overlay: self._overlay
        })
        self.hide()
      }
    }
    this._ulEl.appendChild(menu)
    return this
  }
}

Widget.registerType('contextmenu')

export default ContextMenu
