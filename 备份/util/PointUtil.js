import LogUtil from './LogUtil'
import * as Cesium from "cesium"
const matrix3Scratch = new Cesium.Matrix3(); //一些涉及矩阵计算的方法
const matrix4Scratch = new Cesium.Matrix4();
const cartesian3 = new Cesium.Cartesian3();
const rotationScratch = new Cesium.Matrix3();

class PointUtil {
    static addPositionsHeight(positions = [], addHeight) {
        addHeight = Number(addHeight) || 0
        if (isNaN(addHeight) || addHeight == 0) {
            return positions
        }
        let arr = []
        positions.forEach(item => {
            let car = Cesium.Cartographic.fromCartesian(item)
            let point = Cesium.Cartesian3.fromRadians(car.longitude, car.latitude, car.height + addHeight)
            arr.push(point)
        })

        return arr
    }

    /**
     * 获取鼠标当前的屏幕坐标位置的三维Cesium坐标
     * @param {Cesium.Scene} scene
     * @param {Cesium.Cartesian2} position 二维屏幕坐标位置
     * @param {Cesium.Entity} noPickEntity 排除的对象（主要用于绘制中，排除对自身的拾取）
     */
    static getCurrentMousePosition(scene, position, noPickEntity) {
        let cartesian
        // 在模型上提取坐标
        let pickedObject

        try {
            pickedObject = scene.pick(position, 5, 5)
        } catch (e) {
            Log.logError("scene pick 拾取位置时异常")
            Log.logError(e)
        }

        if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
            // pickPositionSupported:判断是否支持深度拾取，不支持时无法进行鼠标交互
            let pcEntity = this.hasPickedModel()
            if (pcEntity) {
                if (pcEntity.show) {
                    pcEntity.show = false // 先隐藏被排除的noPickEntity对象
                    cartesian = this.getCurrentMousePosition(scene, position, noPickEntity)
                    pcEntity.show = true // 还原被排除的noPickEntity对象
                    if (cartesian) {
                        return cartesian
                    } else {
                        return Log.logInfo("拾取到被排除的noPickEntity模型")
                    }
                }
            } else {
                cartesian = scene.pickPosition(position)
                if (Cesium.defined(cartesian)) {
                    let cartographic = Cesium.Cartographic.fromCartesian(cartesian)
                    if (cartographic.height >= 0) return cartesian

                    // 不是entity时候，支持3dtiles地下
                    if (!Cesium.defined(pickedObject.id) && cartographic.height >= -500) return cartesian
                    Log.logError("scene.pickPosition 拾取模型时 高度值异常" + cartographic.height )
                } else {
                    Log.logInfo("scene.pickPosition 拾取模型 返回为空")
                }
            }
        } else {
            Log.logInfo("scene.pickPosition 拾取模型 返回为空")
        }

        // 超图s3m数据拾取
        if (Cesium.defined(Cesium.S3MTilesLayer)) {
            cartesian = scene.pickPosition(position)
            if (Cesium.defined(cartesian)) {
                return cartesian
            }
        }

        // OnlyPickModelPosition时ViewerEx定义的对外属性
        if (scene.onlyPickModelPosition) return cartesian // 只拾取模型的时候，不继续读取了

        //测试scene.pickPosition和globe.pick的适用场景 https://zhuanlan.zhihu.com/p/44767866
        //1. globe.pick的结果相对稳定准确，不论地形深度检测开启与否，不论加载的是默认地形还是别的地形数据；
        //2. scene.pickPosition只有在开启地形深度检测，且不使用默认地形时是准确的。
        //注意点： 1. globe.pick只能求交地形； 2. scene.pickPosition不仅可以求交地形，还可以求交除地形以外其他所有写深度的物体。
        if (scene.mode === Cesium.SceneMode.SCENE3D) {
            // 三维模式下
            let pickRay = scene.camera.getPickRay(position)
            cartesian = scene.globe.pick(pickRay, scene)
        } else {
            // 二维模式下
            cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid)
        }

        if (Cesium.defined(cartesian) && scene.camera.positionCartographic.height < 10000) {
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian)
            if (cartographic.height < -5000) return null // 屏蔽无效值
        }

        return cartesian

    }


    /**
     * 根据matrix转换矩阵求HeadingPitchRollByMatrix
     * @param {Cesium.Matrix4} matrix 转换矩阵
     * @param {Cesium.Ellipsoid} ellipsoid 变换中使用固定坐标系的椭球
     * @param {Cesium.Transforms.LocalFrameToFixedFrame} fixedFrameTransform  参考系
     * @returns {Cesium.HeadingPitchRoll} result 可以先实例化返回的Heading Pitch Roll角度对象
     */
    static getHeadingPitchRollByMatrix(matrix, ellipsoid = Cesium.Ellipsoid.WGS84, fixedFrameTransform = Cesium.Transforms.eastNorthUpToFixedFrame) {
        // 计算当前模型中心处的变换矩阵
        let m1 = fixedFrameTransform(
            position,
            ellipsoid,
            new Cesium.Matrix4()
        )

        // 矩阵相除
        let m3 = Cesium.Matrix4.multiply(
            Cesium.Matrix4.inverse(m1, new Cesium.Matrix4()),
            matrix,
            new Cesium.Matrix4()
        )

        // 得到旋转矩阵
        let mat3 = Cesium.Matrix3.getRotation(m3, new Cesium.Matrix3())
        // 计算四元数
        let q = Cesium.Quaternion.fromRotationMatrix(mat3)
        // 计算旋转角（弧度）
        let hpr = Cesium.HeadingPitchRoll.fromQuaternion(q)
        // 得到角度
        //let heading = Cesium.Math.toDegrees(hpr.heading);
        //let pitch = Cesium.Math.toDegrees(hpr.pitch);
        //let roll = Cesium.Math.toDegrees(hpr.roll);
        return hpr
    }

    /**
     * 根据position位置和orientation四元叔实例求 HeadingPitchRoll方向
     * @param {Cesium.Cartesian3} position 位置坐标
     * @param {Cesium.Quaternion} orientation 四元数实例
     * @param {*} ellipsoid
     * @param {*} fixedFrameTransform
     */
    static getHeadingPitchRollByOrientation(position, orientation, ellipsoid = Cesium.Ellipsoid.WGS84, fixedFrameTransform = Cesium.Transforms.eastNorthUpToFixedFrame) {
        let matrix = Cesium.Matrix4.fromRotationTranslation(
            Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
            position,
            matrix4Scratch
        )
        let hpr = this.getHeadingPitchRollByMatrix(position, matrix)
        return hpr
    }

    /**
     * 获取坐标数组中 最高高程值
     * @param {*} positions
     * @param {*} defaultValue
     */
    static getMaxHeight(positions, defaultValue) {
        if (defaultValue == null)  defaultValue = 0
        let maxHeight = defaultValue
        if (positions == null || positions.length == 0) return maxHeight
        for (let i = 0; i < positions.length; i++) {
            let tempCarto = Cesium.Cartographic.fromCartesian(positions[i])
            if (tempCarto.height > maxHeight) {
                maxHeight = tempCarto.height
            }
        }
        return formatNum(maxHeight, 2)
    }




    formatNum(num, digits) {
        return Number(num.toFixed(digits || 0))
    }

    /**
     *
     * @private
     * @param {*} pickedObject
     * @param {*} noPickEntity
     */
    hasPickedModel(pickedObject, noPickEntity) {
        if (Cesium.defined(pickedObject.id)) {
            // entity
            let entity = pickedObject.id
            if (entity._noMousePosition) return entity // 排除标识不拾取的对象
            if (noPickEntity && entity === noPickEntity) return entity
        }

        if (Cesium.defined(pickedObject.primitive)) {
            // primitive
            let primitive = pickedObject.primitive
            if (primitive._noMousePosition) return primitive // 排除标识不拾取的对象
            if (noPickEntity && primitive === noPickEntity) return primitive
        }

        return null

    }


    getCenter(viewer, isToWgs) {
        let bestTarget = this.pickCenterPoint(viewer.scene)
    }


    /**
     * 设置坐标中海拔高度为贴地或贴模型的高度
     * @param {*} scene
     * @param {*} position
     * @param {*} options
     */
    setPositionSurfaceHeight(scene, position, options) {

    }

    /**
     * 获取屏幕中心点坐标
     * @param {*} scene
     */
    pickCenterPoint(scene) {
        let canvas = scene.canvas
        let center = new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight / 2)
        let ray = scene.camera.getPickRay(center)
        let target = scene.globe.pick(ray, scene)
        if (!target) target = scene.camera.pickEllipsoid(center)
        return target
    }


}

export default PointUtil
