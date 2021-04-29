/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _point = __webpack_require__(2);

var _util = __webpack_require__(1);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

var _globe = __webpack_require__(18);

var globe = _interopRequireWildcard(_globe);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};

    if (entityattr == null) {
        //默认值 
        entityattr = {};
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "color": //跳过扩展其他属性的参数
            case "opacity":
            case "outlineOpacity":

            case "grid_lineCount":
            case "grid_lineThickness":
            case "grid_cellAlpha":
            case "checkerboard_repeat":
            case "checkerboard_oddcolor":
            case "stripe_oddcolor":
            case "stripe_repeat":
            case "animationDuration":
            case "animationImage":
            case "animationRepeatX":
            case "animationRepeatY":
            case "animationAxisY":
            case "animationGradient":
            case "animationCount":
            case "randomColor":
            case "distanceDisplayCondition_far":
            case "distanceDisplayCondition_near":
                break;
            case "outline":
                //边线
                if (entityattr[key] instanceof Cesium.CallbackProperty) {
                    //回调时不覆盖
                } else {
                    entityattr[key] = value;
                }
                break;
            case "outlineColor":
                //边框颜色
                entityattr.outlineColor = Cesium.Color.fromCssColorString(value || style.color || "#FFFF00").withAlpha(Cesium.defaultValue(style.outlineOpacity, Cesium.defaultValue(style.opacity, 1.0)));
                break;
            case "extrudedHeight":
                //高度 
                if ((0, _util.isNumber)(value)) {
                    var maxHight = 0;
                    if (entityattr.hierarchy) {
                        var positions = getPositions({ polygon: entityattr });
                        maxHight = (0, _point.getMaxHeight)(positions);
                    }
                    entityattr.extrudedHeight = Number(value) + maxHight;
                } else {
                    entityattr.extrudedHeight = value;
                }
                break;
            case "clampToGround":
                //贴地
                entityattr.perPositionHeight = !value;
                break;

            case "hasShadows":
                //阴影
                if (value) entityattr.shadows = Cesium.ShadowMode.ENABLED; //对象投射并接收阴影。
                else entityattr.shadows = Cesium.ShadowMode.DISABLED; //该对象不会投射或接收阴影
                break;
            case "stRotation":
                //材质旋转角度 
                entityattr.stRotation = Cesium.Math.toRadians(value);
                break;
            case "distanceDisplayCondition":
                //是否按视距显示
                if (value) {
                    if (value instanceof Cesium.DistanceDisplayCondition) {
                        entityattr.distanceDisplayCondition = value;
                    } else {
                        entityattr.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(Number(Cesium.defaultValue(style.distanceDisplayCondition_near, 0)), Number(Cesium.defaultValue(style.distanceDisplayCondition_far, 100000)) + 6378137);
                    }
                } else {
                    entityattr.distanceDisplayCondition = undefined;
                }
                break;
        }
    }

    //设置填充材质
    globe.setFillMaterial(entityattr, style);

    return entityattr;
}

//获取entity的坐标
function getPositions(entity, isShowPositions) {
    if (!isShowPositions && entity._positions_draw && entity._positions_draw.length > 0) return entity._positions_draw; //箭头标绘等情形时，取绑定的数据

    var arr = entity.polygon.hierarchy.getValue((0, _util.currentTime)());
    var positions = getHierarchyVal(arr);
    return positions;
}

function getHierarchyVal(arr) {
    if (arr && arr instanceof Cesium.PolygonHierarchy) {
        if (arr.holes.length > 0) {
            return getHierarchyVal(arr.holes[arr.holes.length - 1]); //PolygonHierarchy
        }
        return arr.positions;
    }
    return arr;
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = pointconvert.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity, noAdd) {
    var coordinates = getCoordinates(entity);

    if (!noAdd && coordinates.length > 0) coordinates.push(coordinates[0]);

    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: {
            type: "Polygon",
            coordinates: [coordinates]
        }
    };
}

/***/ }),
