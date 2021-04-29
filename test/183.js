/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawEx = exports.FeatureEx = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _DivPoint = __webpack_require__(87);

var _Draw = __webpack_require__(24);

var _Draw2 = __webpack_require__(6);

var _Tooltip = __webpack_require__(7);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//div点
var drawtype = 'div-point';

//与entity的联动矢量对象

var FeatureEx = exports.FeatureEx = function () {
    function FeatureEx(options) {
        _classCallCheck(this, FeatureEx);

        var entity = options.entity;

        var divpoint = new _DivPoint.DivPoint(options.viewer, _extends({
            position: entity.position
        }, (0, _DivPoint.style2Entity)(options.style), {
            click: function click(e) {
                if (Cesium.defined(entity.hasDrawEdit) && !entity.hasDrawEdit()) return;

                divpoint.enable = false;

                options.activate(entity);
                entity.draw_tooltip = _Tooltip.message.edit.end;
            }
        }));
        divpoint.enable = false;
        this.target = divpoint;
    }

    _createClass(FeatureEx, [{
        key: 'activate',
        value: function activate() {
            this.target.enable = false;
        }
    }, {
        key: 'updateStyle',
        value: function updateStyle(style) {
            var newStyle = (0, _DivPoint.style2Entity)(style);
            for (var key in newStyle) {
                if (key == "html") continue;
                this.target[key] = newStyle[key];
            }
        }
    }, {
        key: 'finish',
        value: function finish() {
            this.target.enable = true;
            // this.target.tooltip = '单击后 激活编辑' //message.edit.start
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.target.destroy();
        }
    }, {
        key: 'position',
        get: function get() {
            return this.target.position;
        },
        set: function set(val) {
            this.target.position = val;
        }
    }]);

    return FeatureEx;
}();

var DrawEx = exports.DrawEx = function (_DrawPoint) {
    _inherits(DrawEx, _DrawPoint);

    function DrawEx() {
        _classCallCheck(this, DrawEx);

        return _possibleConstructorReturn(this, (DrawEx.__proto__ || Object.getPrototypeOf(DrawEx)).apply(this, arguments));
    }

    _createClass(DrawEx, [{
        key: 'createFeatureEx',
        value: function createFeatureEx(style, entity) {
            var that = this;
            if (entity.featureEx) {
                entity.featureEx.activate();
            } else {
                entity.point.show = false;
                entity.featureEx = new FeatureEx({
                    viewer: this.viewer,
                    entity: entity,
                    style: style,
                    activate: function activate(entity) {
                        that.activate(entity);
                    }
                });
            }
        }
    }]);

    return DrawEx;
}(_Draw.DrawPoint);

//注册到Draw中


(0, _Draw2.register)(drawtype, DrawEx);

/***/ }),
