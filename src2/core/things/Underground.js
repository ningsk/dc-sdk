/*
 * @Description: 地下模式
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-11 17:23:31
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-11 17:54:17
 */
import Things from './Things'

class Underground extends Things {

    constructor(options) {
        super(options)
        this._alpha = options.alpha || 0.5
    }

    set alpha(alpha) {
        this._alpha = alpha
        this._viewer.scene.globe.translucency.frontFaceAlphaByDistance.nearValue = alpha;
        this._viewer.scene.globe.translucency.frontFaceAlphaByDistance.farValue = alpha;
    }

    get alpha() {
        return this._alpha
    }

    set enabled(enabled) {
        this._enabled = enabled
        this._viewer.scene.globe.depthTestAgainstTerrain = enabled
        // 相机对地形的碰撞检测状态
        this._viewer.scene.screenSpaceCameraController.enableCollisionDetection = !enabled
        this._viewer.scene.globe.translucency.enabled = enabled
    }


}
