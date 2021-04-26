exports.defConfigStyle = exports.box = exports.plane = exports.corridor = exports.ellipsoid = exports.rectangle = exports.cylinder = exports.ellipse = exports.circle = exports.polygon = exports.wall = exports.polylineVolume = exports.polyline = exports.model = exports.point = exports.label = exports.billboard = undefined;
exports.getTypeName = getTypeName;
exports.getCoordinates = getCoordinates;
exports.getPositions = getPositions;
exports.getCenterPosition = getCenterPosition;
exports.toGeoJSON = toGeoJSON;
exports.style2Entity = style2Entity;
exports.removeGeoJsonDefVal = removeGeoJsonDefVal;
exports.addGeoJsonDefVal = addGeoJsonDefVal;
exports.getDefStyle = getDefStyle;
exports.billboard = billboard;
exports.label = label;
exports.point = point;
exports.model = model;
exports.polyline = polyline;
exports.polylineVolume = polylineVolume;
exports.wall = wall;
exports.polygon = polygon;
exports.circle = circle;
exports.ellipse = ellipse;
exports.cylinder = cylinder;
exports.rectangle = rectangle;
exports.ellipsoid = ellipsoid;
exports.corridor = corridor;
exports.plane = plane;
exports.box = box;
function getTypeName(entity) {
    if (entity.polygon) return "polygon";
    if (entity.rectangle) return "rectangle";

    if (entity.polyline) return "polyline";
    if (entity.polylineVolume) return "polylineVolume";
    if (entity.corridor) return "corridor";
    if (entity.wall) return "wall";

    if (entity.ellipse) return "circle";
    if (entity.ellipsoid) return "ellipsoid";
    if (entity.cylinder) return "cylinder";
    if (entity.plane) return "plane";
    if (entity.box) return "box";

    if (entity.billboard) return "billboard";
    if (entity.point) return "point";
    if (entity.model) return "model";
    if (entity.label) return "label";

    return "";
}

function defNullFun(entity) {
    return null;
}

function getAttrClass(entity) {
    if (entity.polygon) return polygon;
    if (entity.rectangle) return rectangle;

    if (entity.polyline) return polyline;
    if (entity.polylineVolume) return polylineVolume;
    if (entity.corridor) return corridor;
    if (entity.wall) return wall;

    if (entity.ellipse) return circle;
    if (entity.cylinder) return cylinder;
    if (entity.ellipsoid) return ellipsoid;
    if (entity.plane) return plane;
    if (entity.box) return box;

    if (entity.point) return point;
    if (entity.billboard) return billboard;
    if (entity.model) return model;
    if (entity.label) return label;

    return {
        getCoordinates: defNullFun,
        getPositions: defNullFun,
        toGeoJSON: defNullFun,
        style2Entity: defNullFun
    };
}

function getCoordinates(entity) {
    return getAttrClass(entity).getCoordinates(entity);
}

function getPositions(entity) {
    return getAttrClass(entity).getPositions(entity);
}

function getCenterPosition(entity) {
    var position;
    if (entity.position) {
        //存在position属性时，直接取
        position = (0, _point.getPositionValue)(entity.position);
        if (position) return position;
    }

    var pots = getPositions(entity);
    if (!pots || pots.length == 0) return null;
    if (pots.length == 1) return pots[0];

    if (entity.polygon) position = (0, _point.centerOfMass)(pots);else position = pots[Math.floor(pots.length / 2)];
    return position;
}

function toGeoJSON(entity) {
    return getAttrClass(entity).toGeoJSON(entity);
}

function style2Entity(style, entity) {
    return getAttrClass(entity).style2Entity(style, entity);
}

//从plot的 标号默认值F12打印 拷贝，方便读取 
var defConfigStyle = exports.defConfigStyle = { "label": { "text": "文字", "color": "#ffffff", "opacity": 1, "font_family": "楷体", "font_size": 30, "border": true, "border_color": "#000000", "border_width": 3, "background": false, "background_color": "#000000", "background_opacity": 0.5, "font_weight": "normal", "font_style": "normal", "scaleByDistance": false, "scaleByDistance_far": 1000000, "scaleByDistance_farValue": 0.1, "scaleByDistance_near": 1000, "scaleByDistance_nearValue": 1, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "clampToGround": false, "visibleDepth": true }, "point": { "pixelSize": 10, "color": "#3388ff", "opacity": 1, "outline": true, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "outlineWidth": 2, "scaleByDistance": false, "scaleByDistance_far": 1000000, "scaleByDistance_farValue": 0.1, "scaleByDistance_near": 1000, "scaleByDistance_nearValue": 1, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 10000, "distanceDisplayCondition_near": 0, "clampToGround": false, "visibleDepth": true }, "billboard": { "opacity": 1, "scale": 1, "rotation": 0, "horizontalOrigin": "CENTER", "verticalOrigin": "BOTTOM", "scaleByDistance": false, "scaleByDistance_far": 1000000, "scaleByDistance_farValue": 0.1, "scaleByDistance_near": 1000, "scaleByDistance_nearValue": 1, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 10000, "distanceDisplayCondition_near": 0, "clampToGround": false, "visibleDepth": true }, "font-point": { "iconClass": "fa fa-automobile", "iconSize": 50, "color": "#00ffff", "opacity": 1, "horizontalOrigin": "CENTER", "verticalOrigin": "CENTER", "rotation": 0, "scaleByDistance": false, "scaleByDistance_far": 1000000, "scaleByDistance_farValue": 0.1, "scaleByDistance_near": 1000, "scaleByDistance_nearValue": 1, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 10000, "distanceDisplayCondition_near": 0, "clampToGround": false, "visibleDepth": true }, "model": { "scale": 1, "heading": 0, "pitch": 0, "roll": 0, "fill": false, "color": "#3388ff", "opacity": 1, "silhouette": false, "silhouetteColor": "#ffffff", "silhouetteSize": 2, "silhouetteAlpha": 0.8, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "clampToGround": false }, "polyline": { "lineType": "solid", "animationDuration": 1000, "animationImage": "img/textures/lineClr.png", "color": "#3388ff", "width": 4, "clampToGround": false, "outline": false, "outlineColor": "#ffffff", "outlineWidth": 2, "depthFail": false, "depthFailColor": "#ff0000", "depthFailOpacity": 0.2, "opacity": 1, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "zIndex": 0 }, "polylineVolume": { "color": "#00FF00", "radius": 10, "shape": "pipeline", "outline": false, "outlineColor": "#ffffff", "opacity": 1, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0 }, "wall": { "extrudedHeight": 50, "fill": true, "fillType": "color", "animationDuration": 1000, "animationImage": "img/textures/fence.png", "animationRepeatX": 1, "animationAxisY": false, "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#00FF00", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0 }, "corridor": { "height": 0, "width": 100, "cornerType": "ROUNDED", "fillType": "color", "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "color": "#3388ff", "opacity": 0.6, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "clampToGround": false, "zIndex": 0 }, "extrudedCorridor": { "height": 0, "extrudedHeight": 50, "width": 100, "cornerType": "ROUNDED", "fillType": "color", "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "color": "#00FF00", "opacity": 0.6, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "clampToGround": false, "zIndex": 0 }, "polygon": { "fill": true, "fillType": "color", "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#3388ff", "opacity": 0.6, "stRotation": 0, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "clampToGround": false, "zIndex": 0 }, "polygon_clampToGround": { "fillType": "color", "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#ffff00", "opacity": 0.6, "stRotation": 0, "clampToGround": true, "zIndex": 0 }, "extrudedPolygon": { "extrudedHeight": 100, "fillType": "color", "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#00FF00", "opacity": 0.6, "stRotation": 0, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "perPositionHeight": true, "zIndex": 0 }, "rectangle": { "height": 0, "fill": true, "fillType": "color", "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#3388ff", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "rotation": 0, "stRotation": 0, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "clampToGround": false, "zIndex": 0 }, "rectangleImg": { "opacity": 1, "rotation": 0, "clampToGround": true, "zIndex": 0 }, "extrudedRectangle": { "extrudedHeight": 100, "height": 0, "fill": true, "fillType": "color", "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#00FF00", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "rotation": 0, "stRotation": 0, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "zIndex": 0 }, "circle": { "height": 0, "fill": true, "fillType": "color", "animationDuration": 1000, "animationCount": 1, "animationGradient": 0.1, "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#3388ff", "opacity": 0.6, "stRotation": 0, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "rotation": 0, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "clampToGround": false, "zIndex": 0 }, "circle_clampToGround": { "fillType": "color", "animationDuration": 1000, "animationCount": 1, "animationGradient": 0.1, "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#ffff00", "opacity": 0.6, "stRotation": 0, "rotation": 0, "clampToGround": true, "zIndex": 0 }, "extrudedCircle": { "extrudedHeight": 100, "height": 0, "fill": true, "fillType": "color", "animationDuration": 1000, "animationCount": 1, "animationGradient": 0.1, "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#00FF00", "opacity": 0.6, "stRotation": 0, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "rotation": 0, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "zIndex": 0 }, "ellipse": { "semiMinorAxis": 100, "semiMajorAxis": 100, "height": 0, "fill": true, "fillType": "color", "animationDuration": 1000, "animationCount": 1, "animationGradient": 0.1, "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#3388ff", "opacity": 0.6, "stRotation": 0, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "rotation": 0, "clampToGround": false, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "zIndex": 0 }, "ellipse_clampToGround": { "semiMinorAxis": 100, "semiMajorAxis": 100, "fillType": "color", "animationDuration": 1000, "animationCount": 1, "animationGradient": 0.1, "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#ffff00", "opacity": 0.6, "stRotation": 0, "rotation": 0, "clampToGround": true, "zIndex": 0 }, "extrudedEllipse": { "semiMinorAxis": 100, "semiMajorAxis": 100, "extrudedHeight": 100, "height": 0, "fill": true, "fillType": "color", "animationDuration": 1000, "animationCount": 1, "animationGradient": 0.1, "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#00FF00", "opacity": 0.6, "stRotation": 0, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "rotation": 0, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "zIndex": 0 }, "cylinder": { "topRadius": 0, "bottomRadius": 100, "length": 100, "fill": true, "fillType": "color", "animationDuration": 1000, "animationCount": 1, "animationGradient": 0.1, "color": "#00FF00", "opacity": 0.6, "outline": false, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0 }, "ellipsoid": { "extentRadii": 100, "widthRadii": 100, "heightRadii": 100, "fill": true, "fillType": "color", "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#00FF00", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6 }, "plane": { "dimensionsX": 100, "dimensionsY": 100, "plane_normal": "z", "plane_distance": 0, "fill": true, "fillType": "color", "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#00FF00", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0 }, "box": { "dimensionsX": 100, "dimensionsY": 100, "dimensionsZ": 100, "fill": true, "fillType": "color", "grid_lineCount": 8, "grid_lineThickness": 2, "grid_cellAlpha": 0.1, "stripe_oddcolor": "#ffffff", "stripe_repeat": 6, "checkerboard_oddcolor": "#ffffff", "checkerboard_repeat": 4, "color": "#00FF00", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 100000, "distanceDisplayCondition_near": 0, "clampToGround": false } };
defConfigStyle.imagepoint = defConfigStyle.billboard; //兼容历史命名
defConfigStyle.ellipse = defConfigStyle.circle;

// delete defConfigStyle.circle.radius


//剔除与默认值相同的值
function removeGeoJsonDefVal(geojson) {
    if (!geojson.properties || !geojson.properties.type) return geojson;

    var type = geojson.properties.edittype || geojson.properties.type;
    var defStyle = defConfigStyle[type];
    if (!defStyle) return geojson;

    var newgeojson = (0, _util.clone)(geojson);
    if (geojson.properties.style) {
        var newstyle = {};
        for (var i in geojson.properties.style) {
            var val = geojson.properties.style[i];
            if (!Cesium.defined(val)) continue;

            var valDef = defStyle[i];
            if (valDef === val) continue;
            newstyle[i] = val;
        }
        newgeojson.properties.style = newstyle;
    }

    return newgeojson;
}

function addGeoJsonDefVal(properties) {
    //赋默认值 
    var defStyle = defConfigStyle[properties.edittype || properties.type];
    if (defStyle) {
        properties.style = properties.style || {};
        for (var key in defStyle) {
            var val = properties.style[key];
            if (Cesium.defined(val)) continue;

            properties.style[key] = defStyle[key];
        }
    }
    return properties;
}

//获取默认的样式
function getDefStyle(type, style) {
    style = style || {};
    //赋默认值 
    var defStyle = defConfigStyle[type];
    if (defStyle) {
        for (var key in defStyle) {
            var val = style[key];
            if (val != null) continue;

            style[key] = defStyle[key];
        }
    }
    return (0, _util.clone)(style);
}

/***/ }),
