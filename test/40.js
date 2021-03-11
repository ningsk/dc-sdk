/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;
exports.getOutlinePositions = getOutlinePositions;
exports.getOutlineCoordinates = getOutlineCoordinates;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _util = __webpack_require__(1);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

var _point = __webpack_require__(2);

var _globe = __webpack_require__(18);

var globe = _interopRequireWildcard(_globe);

var _polygon = __webpack_require__(13);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};

    if (entityattr == null) {
        //默认值 
        entityattr = {
            fill: true
        };
    }
    //贴地时，剔除高度相关属性
    if (style.clampToGround) {
        if (style.hasOwnProperty('height')) delete style.height;
        if (style.hasOwnProperty('extrudedHeight')) delete style.extrudedHeight;
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];

        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "opacity": //跳过扩展其他属性的参数
            case "outlineOpacity":
            case "color":
            case "animation":
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
                entityattr.outlineColor = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(Cesium.defaultValue(style.outlineOpacity, Cesium.defaultValue(style.opacity, 1.0)));
                break;
            case "rotation":
                //旋转角度
                entityattr.rotation = Cesium.Math.toRadians(value);
                if (!style.stRotation) entityattr.stRotation = Cesium.Math.toRadians(value);
                break;
            case "stRotation":
                entityattr.stRotation = Cesium.Math.toRadians(value);
                break;
            case "height":
                entityattr.height = value;
                if (style.extrudedHeight && (0, _util.isNumber)(style.extrudedHeight)) entityattr.extrudedHeight = Number(style.extrudedHeight) + Number(value);
                break;
            case "extrudedHeight":
                if ((0, _util.isNumber)(value)) {
                    entityattr.extrudedHeight = Number(entityattr.height || style.height || 0) + Number(value);
                } else {
                    entityattr.extrudedHeight = value;
                }
                break;
            case "radius":
                //半径（圆）
                entityattr.semiMinorAxis = Number(value);
                entityattr.semiMajorAxis = Number(value);
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
            case "hasShadows":
                //阴影
                if (value) entityattr.shadows = Cesium.ShadowMode.ENABLED; //对象投射并接收阴影。
                else entityattr.shadows = Cesium.ShadowMode.DISABLED; //该对象不会投射或接收阴影
                break;
        }
    }

    //设置填充材质
    globe.setFillMaterial(entityattr, style);

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    return [(0, _point.getPositionValue)(entity.position)];
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = pointconvert.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: { type: "Point", coordinates: coordinates[0] }
    };
}

//获取entity对应的 边界 的坐标
function getOutlinePositions(entity, noAdd, count) {
    var time = (0, _util.currentTime)();

    //获取圆（或椭圆）边线上的坐标点数组
    var outerPositions = (0, _polygon.getEllipseOuterPositions)({
        position: (0, _point.getPositionValue)(entity.position),
        semiMajorAxis: entity.ellipse.semiMajorAxis && entity.ellipse.semiMajorAxis.getValue(time), //长半轴
        semiMinorAxis: entity.ellipse.semiMinorAxis && entity.ellipse.semiMinorAxis.getValue(time), //短半轴
        rotation: entity.ellipse.rotation && entity.ellipse.rotation.getValue(time),
        count: Cesium.defaultValue(count, 90) //共返回360个点
    });

    if (!noAdd && outerPositions) outerPositions.push(outerPositions[0]);

    return outerPositions;
}

//获取entity对应的 边界 的坐标（geojson规范的格式）
function getOutlineCoordinates(entity, noAdd, count) {
    var positions = getOutlinePositions(entity, noAdd, count);
    var coordinates = pointconvert.cartesians2lonlats(positions);
    return coordinates;
}

/***/ }),
