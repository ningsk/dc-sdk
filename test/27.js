/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCenter = getCenter;
exports.updateMatrix = updateMatrix;
exports.pick3DTileset = pick3DTileset;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//获取模型的中心点信息
//3dtiles相关计算常用方法
function getCenter(tileset, transform) {
    var result = {};

    //记录模型原始的中心点
    var boundingSphere = tileset.boundingSphere;
    var position = boundingSphere.center;
    var catographic = Cesium.Cartographic.fromCartesian(position);

    var height = Number(catographic.height.toFixed(2));
    var longitude = Number(Cesium.Math.toDegrees(catographic.longitude).toFixed(6));
    var latitude = Number(Cesium.Math.toDegrees(catographic.latitude).toFixed(6));
    result = { x: longitude, y: latitude, z: height };

    marslog.log("模型内部原始位置:" + JSON.stringify(result));

    //如果tileset自带世界矩阵矩阵，那么计算放置的经纬度和heading
    if (transform) {
        var matrix = Cesium.Matrix4.fromArray(tileset._root.transform);
        var pos = Cesium.Matrix4.getTranslation(matrix, new Cesium.Cartesian3());
        var wpos = Cesium.Cartographic.fromCartesian(pos);
        if (Cesium.defined(wpos)) {
            result.x = Number(Cesium.Math.toDegrees(wpos.longitude).toFixed(6));
            result.y = Number(Cesium.Math.toDegrees(wpos.latitude).toFixed(6));
            result.z = Number(wpos.height.toFixed(2));

            //取旋转矩阵
            var rotmat = Cesium.Matrix4.getMatrix3(matrix, new Cesium.Matrix3());
            //默认的旋转矩阵
            var defrotmat = Cesium.Matrix4.getMatrix3(Cesium.Transforms.eastNorthUpToFixedFrame(pos), new Cesium.Matrix3());

            //计算rotmat 的x轴，在defrotmat 上 旋转
            var xaxis = Cesium.Matrix3.getColumn(defrotmat, 0, new Cesium.Cartesian3());
            var yaxis = Cesium.Matrix3.getColumn(defrotmat, 1, new Cesium.Cartesian3());
            var zaxis = Cesium.Matrix3.getColumn(defrotmat, 2, new Cesium.Cartesian3());

            var dir = Cesium.Matrix3.getColumn(rotmat, 0, new Cesium.Cartesian3());

            dir = Cesium.Cartesian3.cross(dir, zaxis, dir);
            dir = Cesium.Cartesian3.cross(zaxis, dir, dir);
            dir = Cesium.Cartesian3.normalize(dir, dir);

            var heading = Cesium.Cartesian3.angleBetween(xaxis, dir);

            var ay = Cesium.Cartesian3.angleBetween(yaxis, dir);

            if (ay > Math.PI * 0.5) {
                heading = 2 * Math.PI - heading;
            }
            result.rotation_x = 0;
            result.rotation_y = 0;
            result.rotation_z = Number(Cesium.Math.toDegrees(heading).toFixed(1));

            result.heading = result.rotation_z; //兼容v1老版本

            marslog.log("模型内部世界矩阵:" + JSON.stringify(result));
        }
    }

    return result;
}

//变换轴，兼容旧版本数据z轴方向不对的情况
//如果可以修改模型json源文件，可以在json文件里面加了一行来修正："gltfUpAxis" : "Z", 
function updateAxis(matrix, axis) {
    if (axis == null) return matrix;

    var rightaxis;
    switch (axis.toUpperCase()) {
        case "Y_UP_TO_Z_UP":
            rightaxis = Cesium.Axis.Y_UP_TO_Z_UP;
            break;
        case "Z_UP_TO_Y_UP":
            rightaxis = Cesium.Axis.Z_UP_TO_Y_UP;
            break;
        case "X_UP_TO_Z_UP":
            rightaxis = Cesium.Axis.X_UP_TO_Z_UP;
            break;
        case "Z_UP_TO_X_UP":
            rightaxis = Cesium.Axis.Z_UP_TO_X_UP;
            break;
        case "X_UP_TO_Y_UP":
            rightaxis = Cesium.Axis.X_UP_TO_Y_UP;
            break;
        case "Y_UP_TO_X_UP":
            rightaxis = Cesium.Axis.Y_UP_TO_X_UP;
            break;
    }
    if (rightaxis == null) return matrix;

    return Cesium.Matrix4.multiplyTransformation(matrix, rightaxis, matrix);
}

//变换模型位置等
function updateMatrix(tileset, opts) {
    var matrix;

    //有自带世界矩阵矩阵 
    if (Cesium.defined(tileset._root) && Cesium.defined(tileset._root.transform) && opts.transform) {

        //平移
        var position = Cesium.Cartesian3.fromDegrees(opts.x, opts.y, opts.z);
        matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);

        //旋转 
        var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(opts.rotation_x || 0));
        var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(opts.rotation_y || 0));
        var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(opts.rotation_z || 0));
        var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);

        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(matrix, rotationX, matrix);
        Cesium.Matrix4.multiply(matrix, rotationY, matrix);
        Cesium.Matrix4.multiply(matrix, rotationZ, matrix);

        //缩放
        if (opts.scale > 0 && opts.scale != 1) //缩放比例
            Cesium.Matrix4.multiplyByUniformScale(matrix, opts.scale, matrix);

        //变换轴
        if (opts.axis) matrix = updateAxis(matrix, opts.axis);

        tileset._root.transform = matrix;
    } else {
        //普通,此种方式[x，y不能多次更改]
        var boundingSphere = tileset.boundingSphere;
        var catographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
        var surface = Cesium.Cartesian3.fromRadians(catographic.longitude, catographic.latitude, 0.0);
        var offset = Cesium.Cartesian3.fromDegrees(opts.x, opts.y, opts.z);

        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        matrix = Cesium.Matrix4.fromTranslation(translation);

        tileset.modelMatrix = matrix;
    }
    return matrix;
}

//获取坐标点处的3dtiles模型，用于计算贴地时进行判断（和视角有关系，不一定精确）
function pick3DTileset(scene, positions) {
    if (!positions) return null;

    if (scene instanceof Cesium.Viewer) //兼容scene传入viewer
        scene = scene.scene;

    //判断场景下是否有3dtiles模型 
    // var has3dtiles = false;
    // for (var i = 0, len = scene.primitives.length; i < len; ++i) {
    //     var p = scene.primitives.get(i);
    //     if (p instanceof Cesium.Cesium3DTileset) {
    //         has3dtiles = true;
    //         break;
    //     }
    // }
    // if (!has3dtiles) return null; //没有3dtiles模型时，直接return

    if (positions instanceof Cesium.Cartesian3) positions = [positions];

    for (var i = 0, len = positions.length; i < len; ++i) {
        var position = positions[i];
        var coorPX = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position);
        if (!Cesium.defined(coorPX)) continue;

        var pickedObject = scene.pick(coorPX, 10, 10);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.primitive) && pickedObject.primitive instanceof Cesium.Cesium3DTileset) {
            // Cesium.defined(pickedObject.primitive.isCesium3DTileset)
            return pickedObject.primitive;
        }
    }

    return null;
}

/***/ }),
