/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TilesFlood = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _TilesBase2 = __webpack_require__(46);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 模型淹没 类
var TilesFlood = exports.TilesFlood = function (_TilesBase) {
    _inherits(TilesFlood, _TilesBase);

    //========== 构造方法 ========== 
    function TilesFlood(options) {
        _classCallCheck(this, TilesFlood);

        var _this = _possibleConstructorReturn(this, (TilesFlood.__proto__ || Object.getPrototypeOf(TilesFlood)).call(this, options));

        _this.floodColor = options.floodColor || [0.15, 0.7, 0.95, 0.5];
        _this.floodSpeed = options.floodSpeed || 5.5; //淹没速度，米/秒（默认刷新频率为55Hz）
        _this._floodAll = options.floodAll;
        _this.maxFloodDepth = options.maxFloodDepth || 200;
        _this.ableFlood = true;
        if (_this.drawCommand || _this._floodAll) {
            _this.activeEdit();
        }
        return _this;
    }

    //========== 对外属性 ==========  

    _createClass(TilesFlood, [{
        key: "bindSpeed",
        value: function bindSpeed() {
            var that = this;
            this.speedFun = function () {
                if (that.ableFlood) {
                    that.tileset.marsEditor.floodVar[1] += that.floodSpeed / 55;
                    if (that.tileset.marsEditor.floodVar[1] >= that.tileset.marsEditor.floodVar[2]) {
                        that.tileset.marsEditor.floodVar[1] = that.tileset.marsEditor.floodVar[2];
                    }
                }
            };
            this.viewer.clock.onTick.addEventListener(this.speedFun);
        }
    }, {
        key: "resetFlood",
        value: function resetFlood() {
            this.tileset.marsEditor.floodVar[1] = this.tileset.marsEditor.floodVar[0];
        }
    }, {
        key: "activeEdit",
        value: function activeEdit() {
            this.bindSpeed();
            this.tileset.marsEditor.fbo = this.fbo;
            this.tileset.marsEditor.polygonBounds = this.polygonBounds;
            this.tileset.marsEditor.IsYaPing[0] = true;
            this.tileset.marsEditor.IsYaPing[3] = true;
            this.tileset.marsEditor.floodVar = [this.minLocalPos.z, this.minLocalPos.z, this.minLocalPos.z + this.maxFloodDepth, 200];
            this.tileset.marsEditor.floodColor = this.floodColor;
            this.tileset.marsEditor.editVar[1] = this.floodAll || false;
            !this.floodAll && this.addToScene();
        }

        //销毁

    }, {
        key: "destroy",
        value: function destroy() {
            this.viewer.clock.onTick.removeEventListener(this.speedFun);
            _get(TilesFlood.prototype.__proto__ || Object.getPrototypeOf(TilesFlood.prototype), "destroy", this).call(this);
        }
    }, {
        key: "floodAll",
        get: function get() {
            return this._floodAll;
        },
        set: function set(val) {
            this._floodAll = Boolean(val);
            this.tileset.marsEditor.editVar[1] = this.floodAll;
        }
    }]);

    return TilesFlood;
}(_TilesBase2.TilesBase);

/***/ }),
