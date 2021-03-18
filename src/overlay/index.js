/*
 * @Description: 覆盖物
 * @version:
 * @Author: sueRimn
 * @Date: 2021-03-11 11:18:45
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-18 09:58:24
 */

import {
    Billboard,
    Box,
    Circle,
    Corridor,
    Cylinder,
    DivIcon,
    Ellipse,
    Ellipsoid,
    Label,
    Plane,
    Point,
    Polygon,
    Polyline,
    PolylineVolume,
    Rectangle,
    Wall
} from './entity/index'

import OverlayType from './OverlayType'
import Overlay from './Ovelay'

import Model from './model/Model'
import Tileset from './model/Tileset'

export {
    Billboard,
    Box,
    Circle,
    Corridor,
    Cylinder,
    DivIcon,
    Ellipse,
    Ellipsoid,
    Label,
    Plane,
    Point,
    Polygon,
    Polyline,
    PolylineVolume,
    Rectangle,
    Wall,
    Model,
    Tileset
}

export {
    OverlayType,
    Overlay
}


/**
 * custom
 */
export { default as CustomBillboard } from './custom/CustomBillboard'
export { default as CustomLabel } from './custom/CustomLabel'


/**
 * primitive
 */
export { default as ElecEllipsoidPrimitive } from './primitive/ElecEllipsoidPrimitive'
export { default as FlowLinePrimitive } from './primitive/FlowLinePrimitive'
export { default as ScanCirclePrimitive } from './primitive/ScanCirclePrimitive'
export { default as TrailLinePrimitive } from './primitive/TrailLinePrimitive'
export { default as VideoPrimitive } from './primitive/VideoPrimitive'
export { default as WaterPrimitive } from './primitive/WaterPrimitive'