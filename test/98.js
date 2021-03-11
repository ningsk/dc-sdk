/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GroupLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _BaseLayer2 = __webpack_require__(15);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GroupLayer = exports.GroupLayer = function (_BaseLayer) {
    _inherits(GroupLayer, _BaseLayer);

    function GroupLayer() {
        _classCallCheck(this, GroupLayer);

        return _possibleConstructorReturn(this, (GroupLayer.__proto__ || Object.getPrototypeOf(GroupLayer)).apply(this, arguments));
    }

    _createClass(GroupLayer, [{
        key: "create",
        value: function create() {
            this._layers = this.options._layers;
            var arr = this._layers;
            for (var i = 0, len = arr.length; i < len; i++) {
                this.hasOpacity = arr[i].hasOpacity;
                this.hasZIndex = arr[i].hasZIndex;
            }
        }
        //添加 

    }, {
        key: "add",
        value: function add() {
            this._visible = true;

            var arr = this._layers;
            for (var i = 0, len = arr.length; i < len; i++) {
                arr[i].visible = true;
            }
            _get(GroupLayer.prototype.__proto__ || Object.getPrototypeOf(GroupLayer.prototype), "add", this).call(this);
        }
        //移除

    }, {
        key: "remove",
        value: function remove() {
            this._visible = false;

            var arr = this._layers;
            for (var i = 0, len = arr.length; i < len; i++) {
                arr[i].visible = false;
            }
            _get(GroupLayer.prototype.__proto__ || Object.getPrototypeOf(GroupLayer.prototype), "remove", this).call(this);
        }
        //定位至数据区域

    }, {
        key: "centerAt",
        value: function centerAt(duration) {
            var arr = this._layers;
            for (var i = 0, len = arr.length; i < len; i++) {
                arr[i].centerAt(duration);
            }
        }
        //设置透明度

    }, {
        key: "setOpacity",
        value: function setOpacity(value) {
            var arr = this._layers;
            for (var i = 0, len = arr.length; i < len; i++) {
                if (!arr[i].hasOpacity) continue;
                arr[i].setOpacity(value);
            }
        }
    }]);

    return GroupLayer;
}(_BaseLayer2.BaseLayer);

/***/ }),
