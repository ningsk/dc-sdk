
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getLength = getLength;
exports.getClampLength = getClampLength;
exports.getArea = getArea;
exports.getAreaOfTriangle = getAreaOfTriangle;
exports.getClampArea = getClampArea;
exports.getAngle = getAngle;
exports.getSlope = getSlope;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _pointconvert = __webpack_require__(4);

var _polygon = __webpack_require__(13);

var _Slope = __webpack_require__(75);

var _turf = __webpack_require__(33);

var _polyline = __webpack_require__(22);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//计算空间距离，单位：米
function getLength(positions) {
    if (!Cesium.defined(positions) || positions.length < 2) return 0;

    var distance = 0;
    for (var i = 1, len = positions.length; i < len; i++) {
        distance += Cesium.Cartesian3.distance(positions[i - 1], positions[i]);
    }
    return distance;
}

//计算计算地表贴地距离，单位：米
function getClampLength(positions, options) {
    var all_distance = 0;
    var arrDistance = [];

    (0, _polyline.computeStepSurfaceLine)({
        scene: options.scene,
        positions: positions,
        splitNum: options.splitNum,
        has3dtiles: options.has3dtiles,
        //计算每个分段后的回调方法
        endItem: function endItem(raisedPositions, noHeight, index) {
            var distance = getLength(raisedPositions);
            if (noHeight && options.disTerrainScale) {
                distance = distance * options.disTerrainScale; //求高度失败，概略估算值
            }
            all_distance += distance;

            arrDistance.push(distance);

            if (options.endItem) options.endItem({
                index: index,
                positions: raisedPositions,
                distance: distance,
                arrDistance: arrDistance,
                all_distance: all_distance
            });
        },
        //计算全部完成的回调方法
        end: function end() {
            var callback = options.callback || options.calback; //兼容不同参数名 
            if (callback) callback(all_distance, arrDistance);
        }
    });
}

//计算地表投影平面面积，单位：平方米
function getArea(positions, noAdd) {
    var coordinates = (0, _pointconvert.cartesians2lonlats)(positions);

    if (!noAdd && coordinates.length > 0) coordinates.push(coordinates[0]);

    //API: http://turfjs.org/docs/#area
    var area = (0, _turf.area)({
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [coordinates]
        }
    });
    return area;
}

//计算三角形空间面积
function getAreaOfTriangle(pos1, pos2, pos3) {
    var a = Cesium.Cartesian3.distance(pos1, pos2);
    var b = Cesium.Cartesian3.distance(pos2, pos3);
    var c = Cesium.Cartesian3.distance(pos3, pos1);
    var S = (a + b + c) / 2;
    return Math.sqrt(S * (S - a) * (S - b) * (S - c));
}

//计算贴地面积 
function getClampArea(positions, options) {
    function _restultArea(resultInter) {
        var area = 0; //总面积(贴地三角面) 
        for (var i = 0, len = resultInter.list.length; i < len; i++) {
            var item = resultInter.list[i];
            var pt1 = item.point1;
            var pt2 = item.point2;
            var pt3 = item.point3;

            //求面积 
            area += getAreaOfTriangle(pt1.pointDM, pt2.pointDM, pt3.pointDM);
        }
        return area;
    }
    var _callback = options.callback || options.calback; //兼容不同参数名
    var resultInter = (0, _polygon.interPolygon)({
        positions: positions,
        scene: options.scene,
        splitNum: options.splitNum,
        has3dtiles: options.has3dtiles,
        asyn: options.asyn,
        callback: function callback(resultInter) {
            var area = _restultArea(resultInter);
            if (_callback) _callback(area, resultInter);
        }
    });

    if (options.asyn) return null;else {
        var area = _restultArea(resultInter);
        if (_callback) _callback(area, resultInter);
        return area;
    }
}

//求地表方位角，返回：0-360度
function getAngle(firstPoint, endPoints) {
    var carto1 = Cesium.Cartographic.fromCartesian(firstPoint);
    var carto2 = Cesium.Cartographic.fromCartesian(endPoints);
    if (!carto1 || !carto2) return 0;

    var pt1 = {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [Cesium.Math.toDegrees(carto1.longitude), Cesium.Math.toDegrees(carto1.latitude), carto1.height]
        }
    };
    var pt2 = {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [Cesium.Math.toDegrees(carto2.longitude), Cesium.Math.toDegrees(carto2.latitude), carto2.height]
        }
        //API: http://turfjs.org/docs/#rhumbBearing
    };var bearing = Math.round((0, _turf.rhumbBearing)(pt1, pt2));
    return bearing;
}

//求多个点的  坡度坡向
function getSlope(options) {
    var slope = new _Slope.Slope({
        viewer: options.viewer,
        positions: options.positions,
        splitNum: 1,
        radius: options.radius, //缓冲半径（影响坡度坡向的精度）
        count: options.count, //缓冲的数量（影响坡度坡向的精度）会求周边(count*4)个点
        has3dtiles: options.has3dtiles,
        point: Cesium.defaultValue(options.point, { show: false }),
        arrow: Cesium.defaultValue(options.arrow, { show: false })
    });
    if (options.endItem) {
        slope.on(_MarsClass.eventType.endItem, options.endItem);
    }
    slope.on(_MarsClass.eventType.end, function (e) {
        if (options.callback) options.callback(e);
        slope.destroy();
    });
    return slope;
}

/***/ }),
