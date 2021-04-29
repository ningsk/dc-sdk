/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GraticuleLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _BaseLayer2 = __webpack_require__(15);

var _GraticuleProvider = __webpack_require__(101);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GraticuleLayer = exports.GraticuleLayer = function (_BaseLayer) {
    _inherits(GraticuleLayer, _BaseLayer);

    function GraticuleLayer() {
        _classCallCheck(this, GraticuleLayer);

        return _possibleConstructorReturn(this, (GraticuleLayer.__proto__ || Object.getPrototypeOf(GraticuleLayer)).apply(this, arguments));
    }

    _createClass(GraticuleLayer, [{
        key: 'add',


        //添加 
        value: function add() {
            if (this.layer == null) {
                this.initData();
            }
            this.layer.setVisible(true);
            _get(GraticuleLayer.prototype.__proto__ || Object.getPrototypeOf(GraticuleLayer.prototype), 'add', this).call(this);
        }
        //移除

    }, {
        key: 'remove',
        value: function remove() {
            if (this.layer == null) return;

            this.layer.setVisible(false);
            _get(GraticuleLayer.prototype.__proto__ || Object.getPrototypeOf(GraticuleLayer.prototype), 'remove', this).call(this);
        }
    }, {
        key: 'initData',
        value: function initData() {
            this.layer = new _GraticuleProvider.GraticuleProvider({
                scene: this.viewer.scene,
                numLines: 10
            });
            this.fire(_MarsClass.eventType.load, { layer: this.layer });
        }
    }, {
        key: 'layer',
        get: function get() {
            return this.layer;
        }
    }]);

    return GraticuleLayer;
}(_BaseLayer2.BaseLayer);

/***/ }),
