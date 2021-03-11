/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(10);

var _Edit = __webpack_require__(11);

var _Draw2 = __webpack_require__(6);

var _util = __webpack_require__(1);

var _matrix = __webpack_require__(17);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//等腰三角形(3个点) 
var drawtype = 'triangleDY';

var midPoint = new Cesium.Cartesian3();

function getPositions(positions) {
    //p1 p2 用于控制腰的高度 p3用于控制夹角
    var p1 = positions[0];
    var p2 = positions[1];
    var p3 = positions[2];

    var midpoint = Cesium.Cartesian3.midpoint(p1, p2, midPoint);

    var angle1 = (0, _util.getAngle)(midpoint, p2);
    var angle2 = (0, _util.getAngle)(midpoint, p3);
    var angle = angle1 - angle2 - 90;
    var newPoint2 = (0, _matrix.getRotateCenterPoint)(midpoint, p3, angle);

    return [p1, p2, newPoint2];
}

//编辑

var EditEx = function (_EditPolygonEx) {
    _inherits(EditEx, _EditPolygonEx);

    function EditEx() {
        _classCallCheck(this, EditEx);

        return _possibleConstructorReturn(this, (EditEx.__proto__ || Object.getPrototypeOf(EditEx)).apply(this, arguments));
    }

    _createClass(EditEx, [{
        key: 'getShowPositions',

        //根据标绘绘制的点，生成显示的边界点
        value: function getShowPositions(positions) {
            return getPositions(positions, attribute);
        }
    }]);

    return EditEx;
}(_Edit.EditPolygonEx);

//绘制 


var DrawEx = function (_DrawPolygonEx) {
    _inherits(DrawEx, _DrawPolygonEx);

    //========== 构造方法 ========== 
    function DrawEx(opts) {
        _classCallCheck(this, DrawEx);

        var _this2 = _possibleConstructorReturn(this, (DrawEx.__proto__ || Object.getPrototypeOf(DrawEx)).call(this, opts));

        _this2.type = drawtype;
        _this2.editClass = EditEx; //获取编辑对象

        _this2._minPointNum = 3; //至少需要点的个数 
        _this2._maxPointNum = 3; //最多允许点的个数 
        return _this2;
    }
    //根据标绘绘制的点，生成显示的边界点


    _createClass(DrawEx, [{
        key: 'getShowPositions',
        value: function getShowPositions(positions) {
            return getPositions(positions, attribute);
        }
    }]);

    return DrawEx;
}(_Draw.DrawPolygonEx);

//注册到Draw中


(0, _Draw2.register)(drawtype, DrawEx);

/***/ }),
