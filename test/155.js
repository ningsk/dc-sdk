/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TilesFlat = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _TilesBase2 = __webpack_require__(46);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//默认压平至所选取的最低点高度，由flatHeight变量控制压平高度的变化
// 模型压平 类
var TilesFlat = exports.TilesFlat = function (_TilesBase) {
    _inherits(TilesFlat, _TilesBase);

    //========== 构造方法 ========== 
    function TilesFlat(options) {
        _classCallCheck(this, TilesFlat);

        var _this = _possibleConstructorReturn(this, (TilesFlat.__proto__ || Object.getPrototypeOf(TilesFlat)).call(this, options));

        _this._b3dmOffset = options.b3dmOffset || new Cesium.Cartesian2();
        _this._flatHeight = options.flatHeight || 0;

        if (_this.drawCommand) {
            _this.activeEdit();
        }
        return _this;
    }

    //========== 对外属性 ==========  

    //偏移量


    _createClass(TilesFlat, [{
        key: "activeEdit",
        value: function activeEdit() {
            this.tileset.marsEditor.fbo = this.fbo;
            this.tileset.marsEditor.polygonBounds = this.polygonBounds;
            this.tileset.marsEditor.IsYaPing[0] = true;
            this.tileset.marsEditor.IsYaPing[1] = true;
            this.tileset.marsEditor.heightVar[0] = this.minLocalPos.z;
            this.tileset.marsEditor.heightVar[1] = this.flatHeight;
            this.addToScene();
        }
    }, {
        key: "flatHeight",
        get: function get() {
            return this._flatHeight;
        },
        set: function set(val) {
            this._flatHeight = Number(val);
            this.tileset.marsEditor.heightVar[1] = this._flatHeight;
        }
    }]);

    return TilesFlat;
}(_TilesBase2.TilesBase);

/***/ }),
