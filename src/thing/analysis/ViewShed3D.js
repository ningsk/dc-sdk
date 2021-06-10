/*
 * @Author: your name
 * @Date: 2021-06-10 10:40:20
 * @LastEditTime: 2021-06-10 11:37:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dc-sdk/src/thing/analysis/ViewShed3D.js
 */
import * as Cesium from 'cesium'
import Thing from '../Thing'
class ViewShed3D extends Thing {
    constructor(options = {}) {
        super(options)
        this._cameraPosition = options.cameraPosition
        this._viewPosition = options.viewPosition
        this._horizontalAngle = Cesium.defaultValue(options.horizontalAngle, 120)
        this._verticalAngle = Cesium.defaultValue(options.verticalAngle, 90)
        this._visibleAreaColor = Cesium.defaultValue(options.visibleAreaColor, new Cesium.Color(0, 1, 0))
        this._hiddenAreaColor = Cesium.defaultValue(options.options.hiddenAreaColor, new Cesium.Color(1, 0, 0))
        this._alpha = Cesium.defaultValue(options.alpha, 0.5)
        this._distance = Cesium.defaultValue(options.distance, 100)
        this._maximumDistance = Cesium.defaultValue(options.maximumDistance, 5000.0)
        this._offsetHeight = Cesium.defaultValue(options.offsetHeight, 1.5)
        this._debugFrustum = Cesium.defaultValue(options.showFrustum, true)
    }

    get horizontalAngle() {
        return this._horizontalAngle
    }
    set horizontalAngle(val) {
        this._horizontalAngle = val
        this.resetRadar()
    }
    get verticalAngle() {
        return this._verticalAngle
    }
    set verticalAngle(val) {
        this._verticalAngle = val
        this.resetRadar()
    }
    get distance() {
        return this._distance
    }
    set distance(val) {
        this._distance = val
        this.resetRadar()
    }
    get visibleAreaColor() {
        return this._visibleAreaColor
    }
    set visibleAreaColor(val) {
        this._visibleAreaColor = val
    }
    get visibleAreaColor() {
        return this._visibleAreaColor
    }
    set visibleAreaColor(val) {
        this._visibleAreaColor = val
    }
    get hiddenAreaColor() {
        return this._hiddenAreaColor
    }
    set hiddenAreaColor(val) {
        this._hiddenAreaColor = val
    }

    _addedHook () {
        this.map.terrainShadows = Cesium.ShadowMode.ENABLED
        this._defaultColorTexture = new Cesium.Texture({
            context: this.map.scene.text,
            source: {
                width: 1,
                height: 1,
                arrayBufferView: new Uint8Array([0, 0, 0, 0])
            },
            flipY: false
        })
    }
    _addToScene() {
        this.frustumQuaternion = this.getFrustumQuaternion(this._cameraPosition, this._viewPosition)
        this._createShadowMap(this._cameraPosition, this._viewPosition)
        this._addPostProcess()
        if (!this.radar) {
            this.addRadar(this._cameraPosition, this.frustumQuaternion)
        }
        this.map.scene.primitives.add(this)
        //TODO
    }
    _createShadowMap(cPos, viewPosition, fq) {
        const cameraPos = cPos
        const lookAtPos = viewPosition
        const scene = this.map.scene
        const camera1 = new Cesium.Camera(scene)
        camera1.position = cameraPos
        camera1.direction = Cesium.Cartesian3.subtract(lookAtPos, cameraPos, new Cesium.Cartesian3(0, 0, 0))
        camera1.up = Cesium.Cartesian3.normalize(cameraPos, new Cesium.Cartesian2(0, 0, 0))
        const far = Number(Cesium.Cartesian3.distance(lookAtPos, cameraPos).toFixed(1))
        this._distance = far
        camera1.frustum = new Cesium.PerspectiveFrustum({
            fov: Cesium.Math.toRadians(120),
            aspectRatio: scene.canvas.clientWidth / scene.canvas.clientHeight,
            near: 0.1,
            far: 5000
        })
        const isSpotLight = true
        this.viewShadowMap = new Cesium.ShadowMap({
            lightCamera: camera1,
            enable: false,
            isPointLight: !isSpotLight,
            isSpotLight: !isSpotLight,
            cascadesEnabled: false,
            context: scene.context,
            pointLightRadius: far,
            maximumDistance: this._maximumDistance
        })
    }
    getFrustumQuaternion(pos, viewPosition) {
        // 获取相机四元数，用来调整视锥体摆放
        let direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(viewPosition, pos, new Cesium.Cartesian3()))
        let up = Cesium.Cartesian3.normalize(pos, new Cesium.Cartesian3())
        const camera = new Cesium.Camera(this.map.scene)
        camera.position = pos
        camera.direction = direction
        camera.up = up
        direction = camera.directionWC
        up = camera.upWC
        let right = camera.rightWC
        const scratchRight = new Cesium.Cartesian3()
        const scratchRotation = new Cesium.Matrix3()
        const scratchOrientation = new Cesium.Quaternion()
        right = Cesium.Cartesian3.negate(right, scratchRight)
        const rotation = scratchRotation
        Cesium.Matrix3.setColumn(rotation, 0, right, rotation)
        Cesium.Matrix3.setColumn(rotation, 1, up, rotation)
        Cesium.Matrix3.setColumn(rotation, 2, direction, rotation)
        // 计算视锥姿态
        const orientation = Cesium.Quaternion.fromRotationMatrix(rotation, scratchOrientation)
        return orientation
    }
    _addPostProcess() {
        const that = this
        const bias = that.viewShadowMap._isPointLight ? that.viewShadowMap._pointBias : that.viewShadowMap._primitiveBias
        this.postProcess = new Cesium.PostProcessStage({
            uniforms: {
                czzj: function() {
                    return that._verticalAngle
                },
                dis: function() {
                    return that._distance
                }
            }
        })
        this.show && this.map.scene.PostProcessStages.add(this.postProcess)
    }
    getSceneDepthTexture() {
        const scene = this.map.scene
        const environmentState = scene._environmentState
        const view = scene._view
        const useGlobeDepthFramebuffer = environmentState.useGlobeDepthFramebuffer
        const globeFramebuffer = useGlobeDepthFramebuffer ? view.globeDepth.framebuffer : undefined
        const sceneFramebuffer = view.sceneFramebuffer.getFramebuffer()
        const depthTexture = Cesium.defaultValue(globeFramebuffer, sceneFramebuffer).depthStencilTexture
        return depthTexture
    }
    addRadar(cPos, frustumQuaternion) {
        const position = cPos
        const that = this
        //TODO
        this.radar = this.map.entities.add({
            position: position,
            orientation: frustumQuaternion,
            show: this._debugFrustum && this.show
        })
    }
    resetRadar () {
        this.removeRadar()
        this.addRadar(this._cameraPosition, this.frustumQuaternion)
    }
    removeRadar() {
        if (this.radar) {
            this.map.entities.remove(this.radar)
            delete this.radar
        }
    }
    update(fragState) {
        this.viewShadowMap && fragState.ShadowMaps.push(this.viewShadowMap)
    }
}