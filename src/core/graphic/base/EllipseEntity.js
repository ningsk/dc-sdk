/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 13:54:05
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-12 15:51:45
 */
import * as Cesium from "cesium"
import Util from "../../util/Util";
import BaseEntity from "./BaseEntity";

// 支持Cesium.EllipseGraphics.ConstructorOptions中所有属性  Cesium原生的属性
const DEAFULT_STYLE = {
    semiMinorAxis: 100, // 短半轴半径
    semiMajorAxis: 50, // 长半轴半径
    height: 0, // 高程
    fill: true, // 是否填充
    fillType: "color", // 填充类型，可选项：color(纯色),animationCircle(动画), grid(网格),stripe(条纹), checkboard(棋盘)
    animationDuration: 1000, // 速度
    animationCount: 1, // 圈数
    animationGradient: 0.1, // 圈间系数
    grid_lineCount: 8, // 网格数量
    grid_lineThickness: 2, // 网格宽度
    grid_cellAlpha: 0.1, // 填充透明度
    stripe_oddcolor: '#ffffff',  //条纹衬色
    stripe_repeat: 6, // 条纹数量
    checkerboard_oddcolor: '#ffffff', // 棋盘衬色
    checkerboard_repeat: 4, // 棋盘格数
    color: '#3388ff', // 填充颜色
    opacity: 0.6, // 透明度
    stRotation: 0, // 填充方向
    outline: true, // 是否边框
    outlineColor: '#ffffff', // 边框颜色
    outlineOpacity: 0.6, // 边框透明度
    rotation: 0, // 旋转角度
    distanceDisplayCondition: false, // 是否按视距显示
    distanceDisplayCondition_farr: 100000, // 最大距离
    clampToGround: false, // 是否贴地
    zIndex: 0, // 层级顺序
    extrudedHeight: 100, // 拉伸高度（立体拉伸时传入）
}

class EllipseEntity extends BaseEntity {
    constructor(position, style = {}) {
        super()
        this._position = position
        this._style = Util.merge(DEAFULT_STYLE, style)
        this._minPointNum = 2 // 最少需要点的个数
        this._maxPointNum = 3 // 最大需要点的个数
        this._delegate = new Cesium.Entity({ ellipse: this._style })
    }

    set position(position) {
        this._position = position
        return this
    }

    set style(style) {
        if (Object.keys(style).length === 0) {
            return this
        }
        delete style['semiMajorAxis'] && delete style['semiMinorAxis']
        this._style = style
        Util.merge(this._delegate.ellipse, this._style)
        return this
    }

    get position() {
        return this._position
    }

}
