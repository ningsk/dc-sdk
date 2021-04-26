import * as Cesium from 'cesium'
import { MouseEventType } from '@/dc/event'
import Event from '../Event'
import { LogUtil } from '@/dc/util'
class MouseEvent extends Event {
  constructor (map) {
    super()
    this._map = map
    this._selected = undefined
    this._enabledMoveTarget = true
    this._noPickEntity = undefined
    this._setInputAction()
    this.on(MouseEventType.CLICK, this._clickHandler, this)
    this.on(MouseEventType.DB_CLICK, this._dbClickHandler, this)
    this.on(MouseEventType.RIGHT_CLICK, this._rightClickHandler, this)
    this.on(MouseEventType.MOUSE_MOVE, this._mouseMoveHandler, this)
    this.on(MouseEventType.WHEEL, this._mouseWheelHandler, this)
  }

  /**
   * 是否开启鼠标移动事件的拾取矢量数据
   * @param enabledMoveTarget
   */
  set enabledMoveTarget (enabledMoveTarget) {
    this._enabledMoveTarget = enabledMoveTarget
  }
  get enabledMoveTarget () {
    return this._enabledMoveTarget
  }
  set noPickEntity (noPickEntity) {
    this._noPickEntity = noPickEntity
  }
  /**
   * Register Cesium mouse events
   * @private
   */
  _setInputAction () {
    const handler = new Cesium.ScreenSpaceEventHandler(this._map.canvas)
    Object.keys(Cesium.ScreenSpaceEventType).forEach(key => {
      const type = Cesium.ScreenSpaceEventType[key]
      this._cache[type] = new Cesium.Event()
      handler.setInputAction(movement => {
        this._cache[type].raiseEvent(movement)
      }, type)
    })
  }

  /**
   *
   * Gets the mouse information for the mouse event
   * @param position
   * @private
   *
   */
  _getMouseInfo (position) {
    const scene = this._map.scene
    let cartesian
    // 在模型上提取坐标
    let pickedObject

    try {
      pickedObject = scene.pick(position, 5, 5)
    } catch (e) {
      LogUtil.logError('scene pick 拾取位置时异常')
      LogUtil.logError(e)
    }

    if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
      // pickPositionSupported:判断是否支持深度拾取，不支持时无法进行鼠标交互
      const pcEntity = this.hasPickedModel(pickedObject, this._noPickEntity)
      if (pcEntity) {
        if (pcEntity.show) {
          pcEntity.show = false // 先隐藏被排除的noPickEntity对象
          const mouseInfo = this._getMouseInfo(position)
          cartesian = mouseInfo ? mouseInfo.position : undefined
          pcEntity.show = true // 还原被排除的noPickEntity对象
          if (cartesian) {
            return cartesian
          } else {
            return LogUtil.logInfo('拾取到被排除的noPickEntity模型')
          }
        }
      } else {
        cartesian = scene.pickPosition(position)
        if (Cesium.defined(cartesian)) {
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
          if (cartographic.height >= 0) {
              return {
              target: pickedObject,
              windowPosition: position,
              position: cartesian
              }
          }
          // 不是entity时候，支持3dtiles地下
          if (!Cesium.defined(pickedObject.id) && cartographic.height >= -500) {
            return {
              target: pickedObject,
              windowPosition: position,
              position: cartesian
            }
          }
          LogUtil.logError('scene.pickPosition 拾取模型时 高度值异常' + cartographic.height)
        } else {
          LogUtil.logInfo('scene.pickPosition 拾取模型 返回为空')
        }
      }
    } else {
      LogUtil.logInfo('scene.pickPosition 拾取模型 返回为空')
    }
    if (scene.mode === Cesium.SceneMode.SCENE3D) {
      // 三维模式下
      const pickRay = scene.camera.getPickRay(position)
      cartesian = scene.globe.pick(pickRay, scene)
    } else {
      // 二维模式下
      cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid)
    }

    if (Cesium.defined(cartesian) && scene.camera.positionCartographic.height < 10000) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      if (cartographic.height < -5000) return null // 屏蔽无效值
    }

    return {
      target: pickedObject,
      windowPosition: position,
      position: cartesian
    }
  }
  hasPickedModel (pickedObject, noPickEntity) {
    if (Cesium.defined(pickedObject.id)) {
      // entity
      const entity = pickedObject.id
      if (entity._noMousePosition) return entity // 排除标识不拾取的对象
      if (noPickEntity && entity === noPickEntity) return entity
    }

    if (Cesium.defined(pickedObject.primitive)) {
      // primitive
      const primitive = pickedObject.primitive
      if (primitive._noMousePosition) return primitive // 排除标识不拾取的对象
      if (noPickEntity && primitive === noPickEntity) return primitive
    }

    return null
  }
  /**
   * Gets the drill pick overlays for the mouse event
   * @param position
   * @returns {[]}
   * @private
   */
  _getDrillInfos (position) {
    const drillInfos = []
    const scene = this._map.scene
    const targets = scene.drillPick(position)
    if (targets && targets.length) {
      targets.forEach(target => {
        drillInfos.push(this._getTargetInfo(target))
      })
    }
    return drillInfos
  }

  /**
   * Return the Overlay id
   * @param target
   * @returns {any}
   * @private
   */
  _getOverlayId (target) {
    let overlayId

    // for Entity
    if (target && target.id && target.id instanceof Cesium.Entity) {
      overlayId = target.id.overlayId
    }

    // for Cesium3DTileFeature
    if (target && target instanceof Cesium.Cesium3DTileFeature) {
      overlayId = target.tileset.overlayId
    }

    return overlayId
  }

  /**
   * Returns the target information for the mouse event
   * @param target
   * @returns {{overlay: any, feature: any, layer: any}}
   * @private
   */
  _getTargetInfo (target) {
    let overlay
    let layer
    let feature

    // for Entity
    if (target && target.id && target.id instanceof Cesium.Entity) {
      layer = this._map
        .getLayers()
        .filter(item => item.layerId === target.id.layerId)[0]
      if (layer && layer.getOverlay) {
        overlay = layer.getOverlay(target.id.overlayId)
      }
    }

    // for Cesium3DTileFeature
    if (target && target instanceof Cesium.Cesium3DTileFeature) {
      layer = this._map
        .getLayers()
        .filter(item => item.layerId === target.tileset.layerId)[0]
      feature = target
      if (layer && layer.getOverlay) {
        overlay = layer.getOverlay(target.tileset.overlayId)
        if (feature && feature.getPropertyNames) {
          const propertyNames = feature.getPropertyNames()
          propertyNames.forEach(item => {
            overlay.attr[item] = feature.getProperty(item)
          })
        }
      }
    }

    // for Cesium3DTileset
    if (
      target &&
      target?.primitive &&
      target?.primitive instanceof Cesium.Cesium3DTileset
    ) {
      layer = this._map
        .getLayers()
        .filter(item => item.layerId === target.primitive.layerId)[0]
      if (layer && layer.getOverlay) {
        overlay = layer.getOverlay(target.primitive.overlayId)
      }
    }

    return { layer: layer, overlay: overlay, feature: feature }
  }

  /**
   * Trigger subscription event
   * @param type
   * @param mouseInfo
   * @private
   */
  _raiseEvent (type, mouseInfo = {}) {
    let event
    const targetInfo = this._getTargetInfo(mouseInfo.target)
    const overlay = targetInfo?.overlay
    // get Overlay Event
    if (overlay && overlay.overlayEvent) {
      event = overlay.overlayEvent.getEvent(type)
    }

    // get Viewer Event
    if (!event || event.numberOfListeners === 0) {
      event = this._map.viewerEvent.getEvent(type)
    }
    event &&
    event.numberOfListeners > 0 &&
    event.raiseEvent({
      ...targetInfo,
      ...mouseInfo
    })

    // get Drill Pick Event
    if (overlay && overlay.allowDrillPicking) {
      const drillInfos = this._getDrillInfos(mouseInfo.windowPosition)
      drillInfos.forEach(drillInfo => {
        const dillOverlay = drillInfo?.overlay
        if (
          dillOverlay?.overlayId !== overlay.overlayId &&
          dillOverlay?.overlayEvent
        ) {
          event = dillOverlay.overlayEvent.getEvent(type)
          event &&
          event.numberOfListeners > 0 &&
          event.raiseEvent({
            ...drillInfo,
            ...mouseInfo
          })
        }
      })
    }
  }

  /**
   * Default click event handler
   * @param movement
   * @returns {boolean}
   * @private
   */
  _clickHandler (movement) {
    if (!movement || !movement.position) {
      return false
    }
    const mouseInfo = this._getMouseInfo(movement.position)
    this._raiseEvent(MouseEventType.CLICK, mouseInfo)
  }

  /**
   * Default dbClick event handler
   * @param movement
   * @returns {boolean}
   * @private
   */
  _dbClickHandler (movement) {
    if (!movement || !movement.position) {
      return false
    }
    const mouseInfo = this._getMouseInfo(movement.position)
    this._raiseEvent(MouseEventType.DB_CLICK, mouseInfo)
  }

  /**
   * Default rightClick event handler
   * @param movement
   * @returns {boolean}
   * @private
   */
  _rightClickHandler (movement) {
    if (!movement || !movement.position) {
      return false
    }
    const mouseInfo = this._getMouseInfo(movement.position)
    this._raiseEvent(MouseEventType.RIGHT_CLICK, mouseInfo)
  }

  /**
   * Default mousemove event handler
   * @param movement
   * @returns {boolean}
   * @private
   */
  _mouseMoveHandler (movement) {
    if (!movement || !movement.endPosition) {
      return false
    }
    const mouseInfo = this._getMouseInfo(movement.endPosition)
    this._map.canvas.style.cursor = mouseInfo.target ? 'pointer' : 'default'
    this._raiseEvent(MouseEventType.MOUSE_MOVE, mouseInfo)

    // add event for overlay
    if (
      !this._selected ||
      this._getOverlayId(this._selected.target) !==
      this._getOverlayId(mouseInfo.target)
    ) {
      this._raiseEvent(MouseEventType.MOUSE_OUT, this._selected)
      this._raiseEvent(MouseEventType.MOUSE_OVER, mouseInfo)
      this._selected = mouseInfo
    }
  }

  /**
   * Default mouse wheel event handler
   * @param movement
   * @private
   */
  _mouseWheelHandler (movement) {
    this._raiseEvent(MouseEventType.WHEEL, { movement })
  }
}

export default MouseEvent
