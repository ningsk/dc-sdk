/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TerrainLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _BaseLayer2 = __webpack_require__(15);

var _layer = __webpack_require__(23);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TerrainLayer = exports.TerrainLayer = function (_BaseLayer) {
    _inherits(TerrainLayer, _BaseLayer);

    function TerrainLayer() {
        _classCallCheck(this, TerrainLayer);

        return _possibleConstructorReturn(this, (TerrainLayer.__proto__ || Object.getPrototypeOf(TerrainLayer)).apply(this, arguments));
    }

    _createClass(TerrainLayer, [{
        key: 'add',

        //添加 
        value: function add() {
            if (!this.terrain) {
                this.terrain = (0, _layer.getTerrainProvider)(this.options.terrain || this.options);
                this.fire(_MarsClass.eventType.load, { terrain: this.terrain });
            }
            this.viewer.terrainProvider = this.terrain;
            _get(TerrainLayer.prototype.__proto__ || Object.getPrototypeOf(TerrainLayer.prototype), 'add', this).call(this);
        }
        //移除

    }, {
        key: 'remove',
        value: function remove() {
            this.viewer.terrainProvider = (0, _layer.getEllipsoidTerrain)();
            _get(TerrainLayer.prototype.__proto__ || Object.getPrototypeOf(TerrainLayer.prototype), 'remove', this).call(this);
        }
    }, {
        key: 'layer',
        get: function get() {
            return this.terrain;
        }
    }]);

    return TerrainLayer;
}(_BaseLayer2.BaseLayer);

/***/ }),