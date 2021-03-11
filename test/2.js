/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.aroundPoint = exports.windingPoint = undefined;
exports.formatNum = formatNum;
exports.formatPosition = formatPosition;
exports.getPositionValue = getPositionValue;
exports.formatRectangle = formatRectangle;
exports.getRectangle = getRectangle;
exports.getMaxHeight = getMaxHeight;
exports.addPositionsHeight = addPositionsHeight;
exports.setPositionsHeight = setPositionsHeight;
exports.getSurfaceHeight = getSurfaceHeight;
exports.getSurface3DTilesHeight = getSurface3DTilesHeight;
exports.getSurfaceTerrainHeight = getSurfaceTerrainHeight;
exports.setPositionSurfaceHeight = setPositionSurfaceHeight;
exports.getCurrentMousePosition = getCurrentMousePosition;
exports.getCenter = getCenter;
exports.pickCenterPoint = pickCenterPoint;
exports.getExtent = getExtent;
exports.getCameraView = getCameraView;
exports.centerOfMass = centerOfMass;
exports.isInPoly = isInPoly;
exports.getPositionByGeoJSON = getPositionByGeoJSON;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _index = __webpack_require__(20);

var drawAttr = _interopRequireWildcard(_index);

var _Attr = __webpack_require__(21);

var polygonAttr = _interopRequireWildcard(_Attr);

var _tileset = __webpack_require__(27);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

var _util = __webpack_require__(1);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

var _layer = __webpack_require__(23);

var _turf = __webpack_require__(33);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//格式化 数字 小数位数
function formatNum(num, digits) {
    return Number(Number(num).toFixed(digits || 0));
}

//格式化坐标点为可显示的可理解格式（如：经度x:123.345345、纬度y:31.324324、高度z:123.1）。
function formatPosition(position) {
    if (!position) return null;
    var carto = Cesium.Cartographic.fromCartesian(position);
    var result = {};
    result.y = formatNum(Cesium.Math.toDegrees(carto.latitude), 6);
    result.x = formatNum(Cesium.Math.toDegrees(carto.longitude), 6);
    result.z = formatNum(carto.height, 2);
    return result;
}

//获取position的最终value值，因为cesium经常属性或绑定一层，通过该方法可以内部去判断是否有getValue或_value进行取最终value值。
function getPositionValue(position, time) {
    if (!position) return position;

    var _position;
    if (position instanceof Cesium.Cartesian3) {
        _position = position;
    } else if (position._value && position._value instanceof Cesium.Cartesian3) {
        _position = position._value;
    } else if (typeof position.getValue == 'function') {
        _position = position.getValue(time || (0, _util.currentTime)());
    }

    return _position;
}

//格式化Rectangle
function formatRectangle(rectangle) {
    var west = formatNum(Cesium.Math.toDegrees(rectangle.west), 6);
    var east = formatNum(Cesium.Math.toDegrees(rectangle.east), 6);
    var north = formatNum(Cesium.Math.toDegrees(rectangle.north), 6);
    var south = formatNum(Cesium.Math.toDegrees(rectangle.south), 6);

    return {
        xmin: west,
        xmax: east,
        ymin: south,
        ymax: north
    };
}

//获取坐标的边界
function getRectangle(positions, isFormat) {
    //剔除null值的数据
    for (var i = positions.length - 1; i >= 0; i--) {
        if (!Cesium.defined(positions[i])) {
            positions.splice(i, 1);
        }
    }

    var rectangle = Cesium.Rectangle.fromCartesianArray(positions);
    if (isFormat) return formatRectangle(rectangle);else return rectangle;
}

/**
 * 获取坐标数组中最高高程值
 * @param {Array} positions Array<Cartesian3> 笛卡尔坐标数组
 * @param {Number} defaultVal 默认高程值
 */
function getMaxHeight(positions, defaultVal) {
    if (defaultVal == null) defaultVal = 0;

    var maxHeight = defaultVal;
    if (positions == null || positions.length == 0) return maxHeight;

    for (var i = 0; i < positions.length; i++) {
        var tempCarto = Cesium.Cartographic.fromCartesian(positions[i]);
        if (tempCarto.height > maxHeight) {
            maxHeight = tempCarto.height;
        }
    }
    return formatNum(maxHeight, 2);
}

/**
 * 在坐标基础海拔上增加指定的海拔高度值
 * @param {Array} positions Cartesian3类型的数组
 * @param {Number} height 高度值
 * @return {Array} Cartesian3类型的数组
 */
function addPositionsHeight(positions, addHeight) {
    addHeight = Number(addHeight) || 0;

    if (isNaN(addHeight) || addHeight == 0) return positions;

    if (positions instanceof Array) {
        var arr = [];
        for (var i = 0, len = positions.length; i < len; i++) {
            var car = Cesium.Cartographic.fromCartesian(positions[i]);
            var point = Cesium.Cartesian3.fromRadians(car.longitude, car.latitude, car.height + addHeight);
            arr.push(point);
        }
        return arr;
    } else {
        var car = Cesium.Cartographic.fromCartesian(positions);
        return Cesium.Cartesian3.fromRadians(car.longitude, car.latitude, car.height + addHeight);
    }
}

/**
 * 设置坐标中海拔高度为指定的高度值
 * @param {Array} positions Cartesian3类型的数组
 * @param {Number} height 高度值
 * @return {Array} Cartesian3类型的数组
 */
function setPositionsHeight(positions, height) {
    height = Number(height) || 0;

    if (positions instanceof Array) {
        var arr = [];
        for (var i = 0, len = positions.length; i < len; i++) {
            var car = Cesium.Cartographic.fromCartesian(positions[i]);
            var point = Cesium.Cartesian3.fromRadians(car.longitude, car.latitude, height);
            arr.push(point);
        }
        return arr;
    } else {
        var car = Cesium.Cartographic.fromCartesian(positions);
        return Cesium.Cartesian3.fromRadians(car.longitude, car.latitude, height);
    }
}

/**
 * 获取坐标的贴地(或贴模型)高度
 * opts支持:  是否在has3dtiles:true , 是否异步 asyn:true  异步回调方法callback
 */
function getSurfaceHeight(scene, position, opts) {
    if (!position) return position;
    if (scene instanceof Cesium.Viewer) //兼容传入viewer
        scene = scene.scene;
    opts = opts || {};

    //是否在3ditiles上面
    var _has3dtiles = Cesium.defaultValue(opts.has3dtiles, Cesium.defined((0, _tileset.pick3DTileset)(scene, position)));
    if (_has3dtiles) {
        //求贴模型的高度
        return getSurface3DTilesHeight(scene, position, opts);
    } else {
        //求贴地形高度
        return getSurfaceTerrainHeight(scene, position, opts);
    }
}

/**
 * 获取坐标的 贴模型高度
 * opts支持:   是否异步 asyn:true  异步回调方法callback返回“新高度”和“原始的Cartographic坐标”
 */
function getSurface3DTilesHeight(scene, position, opts) {
    opts = opts || {};

    //原始的Cartographic坐标
    opts.cartesian = opts.cartesian || Cesium.Cartographic.fromCartesian(position);
    var carto = opts.cartesian;
    var callback = opts.callback || opts.calback; //兼容不同参数名

    //是否异步求精确高度 
    if (opts.asyn) {
        scene.clampToHeightMostDetailed([position], opts.objectsToExclude, 0.2).then(function (clampedPositions) {
            var clampedPt = clampedPositions[0];
            if (Cesium.defined(clampedPt)) {
                var cartiles = Cesium.Cartographic.fromCartesian(clampedPt);
                var heightTiles = cartiles.height;
                if (Cesium.defined(heightTiles) && heightTiles > -1000) {
                    if (callback) callback(heightTiles, cartiles);
                    return;
                }
            }
            //说明没在模型上，继续求地形上的高度
            getSurfaceTerrainHeight(scene, position, opts);
        });
    } else {
        //取贴模型高度
        var heightTiles = scene.sampleHeight(carto, opts.objectsToExclude, 0.2);
        if (Cesium.defined(heightTiles) && heightTiles > -1000) {
            if (callback) callback(heightTiles, carto);
            return heightTiles;
        }
    }

    return 0; //表示取值失败
}

/**
 * 获取坐标的 贴地高度
 * opts支持:   是否异步 asyn:true  异步回调方法callback
 */
function getSurfaceTerrainHeight(scene, position, opts) {
    opts = opts || {};

    //原始的Cartographic坐标
    var carto = opts.cartesian || Cesium.Cartographic.fromCartesian(position);
    var callback = opts.callback || opts.calback; //兼容不同参数名

    var _hasTerrain = (0, _layer.hasTerrain)(scene); //是否有地形
    if (!_hasTerrain) {
        //不存在地形，直接返回
        if (callback) callback(carto.height, carto);
        return carto.height;
    }

    //是否异步求精确高度 
    if (opts.asyn) {
        Cesium.when(Cesium.sampleTerrainMostDetailed(scene.terrainProvider, [carto]), function (samples) {
            var clampedCart = samples[0];
            var heightTerrain;
            if (Cesium.defined(clampedCart) && Cesium.defined(clampedCart.height)) {
                heightTerrain = clampedCart.height;
            } else {
                heightTerrain = scene.globe.getHeight(carto);
            }
            if (callback) callback(heightTerrain, carto);
        });
    } else {
        var heightTerrain = scene.globe.getHeight(carto);
        if (Cesium.defined(heightTerrain) && heightTerrain > -1000) {
            if (callback) callback(heightTerrain, carto);
            return heightTerrain;
        }
    }
    return 0; //表示取值失败
}

/**
 * 设置坐标中海拔高度为贴地或贴模型的高度 
 * opts支持:  是否在has3dtiles:true , 是否异步 asyn:true  异步回调方法callback
 */
function setPositionSurfaceHeight(scene, position, opts) {
    if (!position) return position;

    opts = opts || {};
    var carto = Cesium.Cartographic.fromCartesian(position);

    var height = getSurfaceHeight(scene, position, opts);
    if (height != 0 || Cesium.defined(opts.maxHeight) && height <= opts.maxHeight) {
        if (opts.relativeHeight) height += carto.height; //Cesium.HeightReference.RELATIVE_TO_GROUND时
        var positionNew = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, height);
        return positionNew;
    }
    return position;
}

function hasPickedModel(pickedObject, noPickEntity) {
    if (Cesium.defined(pickedObject.id)) {
        //entity 
        var entity = pickedObject.id;
        if (entity._noMousePosition) return entity; //排除标识不拾取的对象
        if (noPickEntity && entity == noPickEntity) return entity;
    }

    if (Cesium.defined(pickedObject.primitive)) {
        //primitive
        var primitive = pickedObject.primitive;
        if (primitive._noMousePosition) return primitive; //排除标识不拾取的对象
        if (noPickEntity && primitive == noPickEntity) return primitive;
    }

    return null;
}

/**
 * 获取鼠标当前的屏幕坐标位置的三维Cesium坐标
 * @param {Cesium.Scene} scene 
 * @param {Cesium.Cartesian2} position 二维屏幕坐标位置
 * @param {Cesium.Entity} noPickEntity 排除的对象（主要用于绘制中，排除对自己本身的拾取）
 */
function getCurrentMousePosition(scene, position, noPickEntity) {
    var cartesian;

    //在模型上提取坐标   
    var pickedObject;
    try {
        pickedObject = scene.pick(position, 5, 5);
    } catch (e) {
        marslog.log("scene.pick 拾取位置时异常");
        marslog.log(e);
    }

    if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
        //pickPositionSupported :判断是否支持深度拾取,不支持时无法进行鼠标交互绘制

        var pcEntity = hasPickedModel(pickedObject, noPickEntity);
        if (pcEntity) {
            if (pcEntity.show) {
                pcEntity.show = false; //先隐藏被排除的noPickEntity对象
                cartesian = getCurrentMousePosition(scene, position, noPickEntity);
                pcEntity.show = true; //还原被排除的noPickEntity对象
                if (cartesian) {
                    return cartesian;
                } else {
                    marslog.log("拾取到被排除的noPickEntity模型");
                }
            }
        } else {
            cartesian = scene.pickPosition(position);
            if (Cesium.defined(cartesian)) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                if (cartographic.height >= 0) return cartesian;

                //不是entity时，支持3dtiles地下
                if (!Cesium.defined(pickedObject.id) && cartographic.height >= -500) return cartesian;
                //marslog.log("scene.pickPosition 拾取模型时 高度值异常：" + cartographic.height);
            } else {
                    //marslog.log("scene.pickPosition 拾取模型 返回为空");
                }
        }
    } else {}
        //marslog.log("scene.pick 拾取位置 返回为空");


        //超图s3m数据拾取
    if (Cesium.defined(Cesium.S3MTilesLayer)) {
        cartesian = scene.pickPosition(position);
        if (Cesium.defined(cartesian)) {
            return cartesian;
        }
    }

    //onlyPickModelPosition是在 ViewerEx 中定义的对外属性
    //通过 viewer.mars.onlyPickModelPosition 进行修改
    if (scene.onlyPickModelPosition) return cartesian; //只取模型上的时候，不继续读取了


    //测试scene.pickPosition和globe.pick的适用场景 https://zhuanlan.zhihu.com/p/44767866
    //1. globe.pick的结果相对稳定准确，不论地形深度检测开启与否，不论加载的是默认地形还是别的地形数据；
    //2. scene.pickPosition只有在开启地形深度检测，且不使用默认地形时是准确的。
    //注意点： 1. globe.pick只能求交地形； 2. scene.pickPosition不仅可以求交地形，还可以求交除地形以外其他所有写深度的物体。

    //提取鼠标点的地理坐标 
    if (scene.mode === Cesium.SceneMode.SCENE3D) {
        //三维模式下
        var pickRay = scene.camera.getPickRay(position);
        cartesian = scene.globe.pick(pickRay, scene);
    } else {
        //二维模式下
        cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid);
    }

    if (Cesium.defined(cartesian) && scene.camera.positionCartographic.height < 10000) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        // marslog.log(cartographic.height);
        if (cartographic.height < -5000) return null; //屏蔽无效值
    }

    return cartesian;
}

//提取屏幕中心点坐标
function getCenter(viewer, isToWgs) {
    var bestTarget = pickCenterPoint(viewer.scene);
    if (!Cesium.defined(bestTarget)) {
        bestTarget = setPositionSurfaceHeight(viewer, viewer.scene.camera.positionWC);
    }

    var result = formatPosition(bestTarget);
    if (isToWgs) result = viewer.mars.point2wgs(result); //坐标转换为wgs

    // 获取地球中心点世界位置  与  摄像机的世界位置  之间的距离
    // var distance = Cesium.Cartesian3.distance(bestTarget, viewer.scene.camera.positionWC);
    // result.cameraZ = distance;

    return result;
}

//取屏幕中心点坐标
function pickCenterPoint(scene) {
    var canvas = scene.canvas;
    var center = new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight / 2);

    var ray = scene.camera.getPickRay(center);
    var target = scene.globe.pick(ray, scene);
    if (!target) target = scene.camera.pickEllipsoid(center);
    return target;
}

//提取地球视域边界
function getExtent(target, opts) {
    opts = opts || {};

    // 范围对象
    var extent = {
        xmin: 0,
        xmax: 0,
        ymin: 0,
        ymax: 0
    };

    if (target instanceof Cesium.Viewer) {
        // var rectangle = viewer.camera.computeViewRectangle(); //不支持二维模式
        // if (rectangle == null) return null; 
        // var extent = formatRectangle(rectangle);  // 范围对象

        //默认值：中国区域
        extent = {
            xmin: 70,
            xmax: 140,
            ymin: 0,
            ymax: 55,
            height: 0
        };

        // 得到当前三维场景
        var viewer = target;
        var scene = viewer.scene;

        // 得到当前三维场景的椭球体
        var ellipsoid = scene.globe.ellipsoid;
        var canvas = scene.canvas;

        // canvas左上角
        var car3_lt = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);
        if (car3_lt) {
            // 在椭球体上
            var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
            extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
            extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
            extent.height = Math.max(extent.height, carto_lt.height);
        } else {
            // 不在椭球体上 
            var xMax = canvas.width / 2;
            var yMax = canvas.height / 2;

            var car3_lt2;
            // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
            for (var yIdx = 0; yIdx <= yMax; yIdx += 10) {
                var xIdx = yIdx <= xMax ? yIdx : xMax;
                car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(xIdx, yIdx), ellipsoid);
                if (car3_lt2) break;
            }
            if (car3_lt2) {
                var carto_lt = ellipsoid.cartesianToCartographic(car3_lt2);
                extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
                extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
                extent.height = Math.max(extent.height, carto_lt.height);
            }
        }

        // canvas右下角
        var car3_rb = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid);
        if (car3_rb) {
            // 在椭球体上
            var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
            extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
            extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
            extent.height = Math.max(extent.height, carto_rb.height);
        } else {
            // 不在椭球体上
            var xMax = canvas.width / 2;
            var yMax = canvas.height / 2;

            var car3_rb2;
            // 这里每次10像素递减，一是10像素相差不大，二是为了提高程序运行效率
            for (var yIdx = canvas.height; yIdx >= yMax; yIdx -= 10) {
                var xIdx = yIdx >= xMax ? yIdx : xMax;
                car3_rb2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(xIdx, yIdx), ellipsoid);
                if (car3_rb2) break;
            }
            if (car3_rb2) {
                var carto_rb = ellipsoid.cartesianToCartographic(car3_rb2);
                extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
                extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
                extent.height = Math.max(extent.height, carto_rb.height);
            }
        }

        if (opts.isToWgs) {
            //坐标转换为wgs
            var pt1 = viewer.mars.point2wgs({
                x: extent.xmin,
                y: extent.ymin
            });
            extent.xmin = pt1.x;
            extent.ymin = pt1.y;

            var pt2 = viewer.mars.point2wgs({
                x: extent.xmax,
                y: extent.ymax
            });
            extent.xmax = pt2.x;
            extent.ymax = pt2.y;
        }
    } else if (target instanceof Cesium.Entity) {
        //传入Entity对象 
        var positions = drawAttr.getPositions(target);
        extent = getRectangle(positions, true);
        extent.height = getMaxHeight(positions);
    } else if ((0, _util.isArray)(target)) {
        //传入Entity对象数组
        var positions = [];
        for (var i = 0, len = target.length; i < len; i++) {
            var pts = drawAttr.getPositions(target[i]);
            positions = positions.concat(pts);
        }
        extent = getRectangle(positions, true);
        extent.height = getMaxHeight(positions);
    }

    //交换
    if (extent.xmax < extent.xmin) {
        var temp = extent.xmax;
        extent.xmax = extent.xmin;
        extent.xmin = temp;
    }
    if (extent.ymax < extent.ymin) {
        var temp = extent.ymax;
        extent.ymax = extent.ymin;
        extent.ymin = temp;
    }

    //缩放
    if (opts.scale) {
        var old_xmin = extent.xmin;
        var old_xmax = extent.xmax;
        var old_ymin = extent.ymin;
        var old_ymax = extent.ymax;

        //限定最大倍数
        if (opts.scale > 3) opts.scale = 3;
        if (opts.scale < -3) opts.scale = -3;

        var stepx = (extent.xmax - extent.xmin) * opts.scale;
        extent.xmin -= stepx;
        extent.xmax += stepx;
        var stepy = (extent.ymax - extent.ymin) * opts.scale;
        extent.ymin -= stepy;
        extent.ymax += stepy;

        //如果超出地球范围，还原放大的值
        if (extent.xmin < -180 || extent.xmax > 180 || extent.ymin < -90 || extent.ymax > 90) {
            extent.xmin = old_xmin;
            extent.xmax = old_xmax;
            extent.ymin = old_ymin;
            extent.ymax = old_ymax;
        }
    }

    //截取长度
    if (opts.formatNum) {
        extent.xmin = formatNum(extent.xmin, 6);
        extent.xmax = formatNum(extent.xmax, 6);
        extent.ymin = formatNum(extent.ymin, 6);
        extent.ymax = formatNum(extent.ymax, 6);
    }

    return extent;
}

//提取相机视角范围参数 
function getCameraView(viewer, isToWgs) {
    var camera = viewer.camera;
    var position = camera.positionCartographic;

    var bookmark = {};
    bookmark.y = formatNum(Cesium.Math.toDegrees(position.latitude), 6);
    bookmark.x = formatNum(Cesium.Math.toDegrees(position.longitude), 6);
    bookmark.z = formatNum(position.height, 2);
    bookmark.heading = formatNum(Cesium.Math.toDegrees(camera.heading || 0) % 360, 1);
    bookmark.pitch = formatNum(Cesium.Math.toDegrees(camera.pitch || 0) % 360, 1);
    bookmark.roll = formatNum(Cesium.Math.toDegrees(camera.roll || 0) % 360, 1);

    if (isToWgs) bookmark = viewer.mars.point2wgs(bookmark); //坐标转换为wgs

    return bookmark;
}

//Turf求面的中心点 
function centerOfMass(positions, height) {
    try {
        if (positions.length == 1) {
            return positions[0];
        } else if (positions.length == 2) {
            return Cesium.Cartesian3.midpoint(positions[0], positions[1], new Cesium.Cartesian3());
        }

        if (height == null) {
            height = getMaxHeight(positions);
        }

        var coordinates = pointconvert.cartesians2lonlats(positions);
        coordinates.push(coordinates[0]);

        var center = (0, _turf.centerOfMass)({
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [coordinates]
            }
        });
        var centerX = center.geometry.coordinates[0];
        var centerY = center.geometry.coordinates[1];

        //所求的中心点在边界外时，求矩形中心点
        var extent = getRectangle(positions, true);
        if (centerX < extent.xmin || centerX > extent.xmax || centerY < extent.ymin || centerY > extent.ymax) {
            centerX = (extent.xmin + extent.xmax) / 2;
            centerY = (extent.ymin + extent.ymax) / 2;
        }

        var ptcenter = Cesium.Cartesian3.fromDegrees(centerX, centerY, height);
        return ptcenter;
    } catch (e) {
        return positions[Math.floor(positions.length / 2)];
    }
}

//点 是否在 entity（面、圆、多边形）内
function isInPoly(position, entity) {
    if (!entity || !position) return false;

    if (entity.rectangle) {
        var rectangle = entity.rectangle.coordinates.getValue((0, _util.currentTime)());

        var isInRectangle = Cesium.Rectangle.contains(rectangle, Cesium.Cartographic.fromCartesian(position));
        return isInRectangle;
    } else if (entity.ellipse) {
        var center = getPositionValue(entity.position);
        center = setPositionsHeight(center, 0);
        var radiu = entity.ellipse.semiMajorAxis.getValue((0, _util.currentTime)());

        var len = Cesium.Cartesian3.distance(center, position);
        return len <= radiu; //小于半径的说明在圆内
    } else if (entity.polygon) {
        var pt = {
            type: "Feature",
            geometry: { type: "Point", coordinates: pointconvert.cartesian2lonlat(position) }
        };
        var poly = polygonAttr.toGeoJSON(entity);
        var isInArea = (0, _turf.booleanPointInPolygon)(pt, poly); //turf插件计算的 
        return isInArea;
    } else if (entity.type && entity.type == "Feature") {
        //entity为geojson 
        var pt = {
            type: "Feature",
            geometry: { type: "Point", coordinates: pointconvert.cartesian2lonlat(position) }
        };
        var isInArea = (0, _turf.booleanPointInPolygon)(pt, entity); //turf插件计算的 
        return isInArea;
    }
    return false;
}

//geojson转entity
function getPositionByGeoJSON(geojson, defHeight) {
    var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
        coords = geometry ? geometry.coordinates : null;

    if (!coords && !geometry) {
        return null;
    }

    switch (geometry.type) {
        case 'Point':
            return pointconvert.lonlat2cartesian(coords, defHeight);
        case 'MultiPoint':
        case 'LineString':
            return pointconvert.lonlats2cartesians(coords, defHeight);

        case 'MultiLineString':
        case 'Polygon':
            return pointconvert.lonlats2cartesians(coords[0], defHeight);
        case 'MultiPolygon':
            return pointconvert.lonlats2cartesians(coords[0][0], defHeight);
        default:
            throw new Error('Invalid GeoJSON object.');
    }
}

//绕点 环绕飞行
var windingPoint = exports.windingPoint = {
    isStart: false,
    viewer: null,
    start: function start(viewer, point) {
        this.viewer = viewer;
        if (point && point instanceof Cesium.Cartesian3) {
            this.position = point;
        } else {
            if (!point) point = getCenter(viewer);
            this.position = Cesium.Cartesian3.fromDegrees(point.x, point.y, point.z);
        }

        this.distance = point.distance || Cesium.Cartesian3.distance(this.position, viewer.camera.positionWC); // 给定相机距离点多少距离飞行 
        this.angle = 360 / (point.time || 60); //time：给定飞行一周所需时间(单位 秒)

        this.time = viewer.clock.currentTime.clone();
        this.heading = viewer.camera.heading; // 相机的当前heading
        this.pitch = viewer.camera.pitch;

        this.viewer.clock.shouldAnimate = true;
        this.viewer.clock.onTick.addEventListener(this.clock_onTickHandler, this);
        this.isStart = true;
    },
    clock_onTickHandler: function clock_onTickHandler(e) {
        var delTime = Cesium.JulianDate.secondsDifference(this.viewer.clock.currentTime, this.time); // 当前已经过去的时间，单位 秒
        var heading = Cesium.Math.toRadians(delTime * this.angle) + this.heading;

        this.viewer.scene.camera.setView({
            destination: this.position, // 点的坐标
            orientation: {
                heading: heading,
                pitch: this.pitch
            }
        });
        this.viewer.scene.camera.moveBackward(this.distance);
    },
    stop: function stop() {
        if (!this.isStart) return;

        if (this.viewer) this.viewer.clock.onTick.removeEventListener(this.clock_onTickHandler, this);
        this.isStart = false;
    }
};

//固定点 向四周旋转
var aroundPoint = exports.aroundPoint = {
    isStart: false,
    viewer: null,
    start: function start(viewer, point) {
        this.viewer = viewer;
        if (point && point instanceof Cesium.Cartesian3) {
            this.position = point;
        } else {
            if (!point) point = getCenter(viewer);
            this.position = Cesium.Cartesian3.fromDegrees(point.x, point.y, point.z);
        }

        this.angle = 360 / (point.time || 60); //time：给定飞行一周所需时间(单位 秒)

        this.time = viewer.clock.currentTime.clone();
        this.heading = viewer.camera.heading; // 相机的当前heading
        this.pitch = viewer.camera.pitch;

        this.viewer.clock.shouldAnimate = true;
        this.viewer.clock.onTick.addEventListener(this.clock_onTickHandler, this);
        this.isStart = true;
    },
    clock_onTickHandler: function clock_onTickHandler(e) {
        // 当前已经过去的时间，单位s
        var delTime = Cesium.JulianDate.secondsDifference(this.viewer.clock.currentTime, this.time);
        var heading = Cesium.Math.toRadians(delTime * this.angle) + this.heading;
        this.viewer.scene.camera.setView({
            orientation: {
                heading: heading,
                pitch: this.pitch
            }
        });
    },
    stop: function stop() {
        if (!this.isStart) return;

        if (this.viewer) this.viewer.clock.onTick.removeEventListener(this.clock_onTickHandler, this);
        this.isStart = false;
    }
};

/***/ }),
