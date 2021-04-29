/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawWall = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(16);

var _Attr = __webpack_require__(53);

var attr = _interopRequireWildcard(_Attr);

var _Edit = __webpack_require__(67);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawWall = exports.DrawWall = function (_DrawPolyline) {
    _inherits(DrawWall, _DrawPolyline);

    //========== 构造方法 ========== 
    function DrawWall(opts) {
        _classCallCheck(this, DrawWall);

        var _this = _possibleConstructorReturn(this, (DrawWall.__proto__ || Object.getPrototypeOf(DrawWall)).call(this, opts));

        _this.type = 'wall';
        _this.attrClass = attr; //对应的属性控制静态类 
        _this.editClass = _Edit.EditWall; //获取编辑对象

        _this._minPointNum = 2; //至少需要点的个数 
        _this._maxPointNum = 9999; //最多允许点的个数 

        _this.maximumHeights = null;
        _this.minimumHeights = null;
        return _this;
    }

    //根据attribute参数创建Entity


    _createClass(DrawWall, [{
        key: 'createFeature',
        value: function createFeature(attribute, dataSource) {
            dataSource = dataSource || this.dataSource;
            this._positions_draw = [];

            if (!this._minPointNum_def) this._minPointNum_def = this._minPointNum;
            if (!this._maxPointNum_def) this._maxPointNum_def = this._maxPointNum;

            if (attribute.config) {
                //允许外部传入
                this._minPointNum = attribute.config.minPointNum || this._minPointNum_def;
                this._maxPointNum = attribute.config.maxPointNum || this._maxPointNum_def;
            } else {
                this._minPointNum = this._minPointNum_def;
                this._maxPointNum = this._maxPointNum_def;
            }

            this.maximumHeights = [];
            this.minimumHeights = [];

            var that = this;
            var addattr = {
                wall: attr.style2Entity(attribute.style),
                attribute: attribute
            };
            addattr.wall.positions = new Cesium.CallbackProperty(function (time) {
                return that.getDrawPosition();
            }, false);
            addattr.wall.minimumHeights = new Cesium.CallbackProperty(function (time) {
                return that.getMinimumHeights();
            }, false);
            addattr.wall.maximumHeights = new Cesium.CallbackProperty(function (time) {
                return that.getMaximumHeights();
            }, false);

            this.entity = dataSource.entities.add(addattr); //创建要素对象   
            return this.entity;
        }
    }, {
        key: 'style2Entity',
        value: function style2Entity(style, entity) {
            return attr.style2Entity(style, entity.wall);
        }
    }, {
        key: 'getMaximumHeights',
        value: function getMaximumHeights(entity) {
            return this.maximumHeights;
        }
    }, {
        key: 'getMinimumHeights',
        value: function getMinimumHeights(entity) {
            return this.minimumHeights;
        }
    }, {
        key: 'updateAttrForDrawing',
        value: function updateAttrForDrawing() {
            var style = this.entity.attribute.style;
            var position = this.getDrawPosition();
            var len = position.length;

            this.maximumHeights = new Array(len);
            this.minimumHeights = new Array(len);

            for (var i = 0; i < len; i++) {
                var height = Cesium.Cartographic.fromCartesian(position[i]).height;
                this.minimumHeights[i] = height;
                this.maximumHeights[i] = height + Number(style.extrudedHeight);
            }
        }
        //获取外部entity的坐标到_positions_draw

    }, {
        key: 'setDrawPositionByEntity',
        value: function setDrawPositionByEntity(entity) {
            var positions = this.getPositions(entity);
            this._positions_draw = positions;

            var time = this.viewer.clock.currentTime;
            this._minimumHeights = entity.wall.minimumHeights && entity.wall.minimumHeights.getValue(time);
            this._maximumHeights = entity.wall.maximumHeights && entity.wall.maximumHeights.getValue(time);
            if (!this._minimumHeights || this._minimumHeights.length == 0 || !this._maximumHeights || this._maximumHeights.length == 0) return;

            entity.attribute.style = entity.attribute.style || {};
            entity.attribute.style.extrudedHeight = this._maximumHeights[0] - this._minimumHeights[0];
        }
        //图形绘制结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            var entity = this.entity;

            entity.editing = this.getEditClass(entity); //绑定编辑对象  
            // this.entity.wall.positions = this.getDrawPosition();
            // this.entity.wall.minimumHeights = this.getMinimumHeights();
            // this.entity.wall.maximumHeights = this.getMaximumHeights(); 

            entity._positions_draw = this.getDrawPosition();
            entity.wall.positions = new Cesium.CallbackProperty(function (time) {
                return entity._positions_draw;
            }, false);

            entity._minimumHeights = this.getMinimumHeights();
            entity.wall.minimumHeights = new Cesium.CallbackProperty(function (time) {
                return entity._minimumHeights;
            }, false);

            entity._maximumHeights = this.getMaximumHeights();
            entity.wall.maximumHeights = new Cesium.CallbackProperty(function (time) {
                return entity._maximumHeights;
            }, false);
        }
    }]);

    return DrawWall;
}(_Draw.DrawPolyline);

/***/ }),
