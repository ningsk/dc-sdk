/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CustomPlaneGeometry = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CustomPlaneGeometry = exports.CustomPlaneGeometry = function () {
    function CustomPlaneGeometry(options) {
        _classCallCheck(this, CustomPlaneGeometry);

        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

        var vertexFormat = new Cesium.VertexFormat({
            'st': true,
            'position': true,
            'bitangent': false,
            'normal': false,
            'color': false,
            'tangent': false
        });
        this._pos_arr = Cesium.clone(options.pos_arr);
        this._vertexFormat = vertexFormat;
        var Rect = new Cesium.BoundingRectangle();
        this._SERectangle = Cesium.BoundingRectangle.fromPoints(this._pos_arr, Rect);
        this._workerName = 'createCustomPlaneGeometry';
    }

    /**
     * Computes the geometric representation of a plane, including its vertices, and a bounding sphere.
     *
     * @param {CustomPlaneGeometry} CustomPlaneGeometry A description of the plane.
     * @returns {Geometry|undefined} The computed vertices and indices.
     */


    _createClass(CustomPlaneGeometry, [{
        key: 'createGeometry',
        value: function createGeometry(geometry) {
            var vertexFormat = geometry._vertexFormat;
            var SERectangle = geometry._SERectangle;
            var pos_arr = geometry._pos_arr;
            var attributes = new Cesium.GeometryAttributes();
            var indices;
            var positions;
            var poslen = pos_arr.length;
            if (Cesium.defined(vertexFormat.position)) {
                // 4 corner points.  Duplicated 3 times each for each incident edge/face.
                positions = new Float64Array(poslen * 3);

                for (var i = 0; i < poslen; i++) {
                    positions[i % poslen * 3 + 0] = pos_arr[i].x;
                    positions[i % poslen * 3 + 1] = pos_arr[i].y;
                    positions[i % poslen * 3 + 2] = pos_arr[i].z;
                }

                attributes.position = new Cesium.GeometryAttribute({
                    componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                    componentsPerAttribute: 3,
                    values: positions
                });

                if (Cesium.defined(vertexFormat.st)) {
                    var texCoords = new Float32Array(poslen * 2);
                    var oX = SERectangle.x - SERectangle.width;
                    var oY = SERectangle.y - SERectangle.height;
                    var oX = SERectangle.x;
                    var oY = SERectangle.y;
                    for (var i = 0; i < poslen; i++) {
                        texCoords[i * 2 + 0] = Math.abs((positions[i * 3 + 0] - oX) / SERectangle.width);
                        texCoords[i * 2 + 1] = Math.abs((positions[i * 3 + 1] - oY) / SERectangle.height);
                    }
                    attributes.st = new Cesium.GeometryAttribute({
                        componentDatatype: Cesium.ComponentDatatype.FLOAT,
                        componentsPerAttribute: 2,
                        values: texCoords
                    });
                }

                indices = new Uint16Array((poslen - 2) * 3);

                for (var i = 1; i < poslen - 1; i++) {
                    indices[(i - 1) * 3 + 0] = 0;
                    indices[(i - 1) * 3 + 1] = i;
                    indices[(i - 1) * 3 + 2] = i + 1;
                }
            }

            return new Cesium.Geometry({
                attributes: attributes,
                indices: indices,
                primitiveType: Cesium.PrimitiveType.TRIANGLE_FAN,
                boundingSphere: new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, Math.sqrt(2.0))
            });
        }
    }]);

    return CustomPlaneGeometry;
}();

/***/ }),
