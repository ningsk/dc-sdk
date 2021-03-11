/* 31 */
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

var _util = __webpack_require__(1);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

var _point = __webpack_require__(2);

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
            case "silhouette": //跳过扩展其他属性的参数
            case "silhouetteColor":
            case "silhouetteAlpha":
            case "silhouetteSize":
            case "fill":
            case "color":
            case "opacity":
            case "distanceDisplayCondition_far":
            case "distanceDisplayCondition_near":
                break;
            case "modelUrl":
                //模型uri
                entityattr.uri = value;
                break;

            case "clampToGround":
                //贴地
                if (value) entityattr.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;else entityattr.heightReference = Cesium.HeightReference.NONE;
                break;
            case "heightReference":
                switch (value) {
                    case "NONE":
                        entityattr.heightReference = Cesium.HeightReference.NONE;
                        break;
                    case "CLAMP_TO_GROUND":
                        entityattr.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
                        break;
                    case "RELATIVE_TO_GROUND":
                        entityattr.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
                        break;
                    default:
                        entityattr.heightReference = value;
                        break;
                }
                break;

            case "distanceDisplayCondition":
                //是否按视距显示
                if (value) {
                    if (value instanceof Cesium.DistanceDisplayCondition) {
                        entityattr.distanceDisplayCondition = value;
                    } else {
                        entityattr.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(Number(Cesium.defaultValue(style.distanceDisplayCondition_near, 0)), Number(Cesium.defaultValue(style.distanceDisplayCondition_far, 100000)));
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

    //轮廓
    if (style.silhouette) {
        entityattr.silhouetteColor = Cesium.Color.fromCssColorString(style.silhouetteColor || "#FFFFFF").withAlpha(Number(style.silhouetteAlpha || 1.0));
        entityattr.silhouetteSize = Number(style.silhouetteSize || 1.0);
    } else entityattr.silhouetteSize = 0.0;

    //透明度、颜色
    var opacity = Cesium.defaultValue(style.opacity, 1);
    if (style.fill) entityattr.color = Cesium.Color.fromCssColorString(style.color || "#FFFFFF").withAlpha(opacity);else entityattr.color = Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(opacity);

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

/***/ }),
