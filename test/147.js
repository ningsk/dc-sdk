/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Sightline = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

var _point = __webpack_require__(2);

var _polyline = __webpack_require__(22);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//通视分析 类
var Sightline = exports.Sightline = function (_MarsClass) {
    _inherits(Sightline, _MarsClass);

    function Sightline(options, oldparam) {
        _classCallCheck(this, Sightline);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (Sightline.__proto__ || Object.getPrototypeOf(Sightline)).call(this, options));

        if (oldparam) {
            oldparam.viewer = options;
            options = oldparam;
        }
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码


        _this.viewer = options.viewer;

        _this.lines = [];
        _this._visibleColor = Cesium.defaultValue(options.visibleColor, new Cesium.Color(0, 1, 0, 1)); //可视区域
        _this._hiddenColor = Cesium.defaultValue(options.hiddenColor, new Cesium.Color(1, 0, 0, 1)); //不可视区域
        _this._depthFailColor = Cesium.defaultValue(options.depthFailColor, new Cesium.Color(1, 0, 0, 0.1));

        if (options.originPoint && options.targetPoint) {
            _this.add(options.originPoint, options.targetPoint);
        }

        return _this;
    }
    //========== 对外属性 ========== 

    //可视区域颜色


    _createClass(Sightline, [{
        key: 'add',


        //========== 方法 ==========  
        value: function add(origin, target, addHeight) {
            if (addHeight) {
                origin = (0, _point.addPositionsHeight)(origin, addHeight); //加人的身高
            }

            var currDir = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(target, origin, new Cesium.Cartesian3()), new Cesium.Cartesian3());
            var currRay = new Cesium.Ray(origin, currDir);
            var pickRes = this.viewer.scene.drillPickFromRay(currRay, 2, this.lines);

            if (Cesium.defined(pickRes) && pickRes.length > 0 && Cesium.defined(pickRes[0]) && Cesium.defined(pickRes[0].position)) {
                var position = pickRes[0].position;

                var distance = Cesium.Cartesian3.distance(origin, target);
                var distanceFx = Cesium.Cartesian3.distance(origin, position);
                if (distanceFx < distance) {
                    //存在正常分析结果
                    var arrEentity = this._showPolyline(origin, target, position);

                    var result = {
                        block: true, //存在遮挡
                        position: position,
                        entity: arrEentity
                    };
                    this.fire(_MarsClass2.eventType.end, result);
                    return result;
                }
            }

            var arrEentity = this._showPolyline(origin, target);
            var result = {
                block: false,
                entity: arrEentity
            };
            this.fire(_MarsClass2.eventType.end, result);
            return result;
        }
    }, {
        key: '_showPolyline',
        value: function _showPolyline(origin, target, position) {
            if (position) {
                //存在正常分析结果
                var entity1 = this.viewer.entities.add({
                    polyline: {
                        positions: [origin, position],
                        width: 2,
                        material: this._visibleColor,
                        depthFailMaterial: this._depthFailColor
                    }
                });
                this.lines.push(entity1);

                var entity2 = this.viewer.entities.add({
                    polyline: {
                        positions: [position, target],
                        width: 2,
                        material: this._hiddenColor,
                        depthFailMaterial: this._depthFailColor
                    }
                });
                this.lines.push(entity2);

                return [entity1, entity2];
            } else {
                //无正确分析结果时，直接返回
                var entity1 = this.viewer.entities.add({
                    polyline: {
                        positions: [origin, target],
                        width: 2,
                        material: this._visibleColor,
                        depthFailMaterial: this._depthFailColor
                    }
                });
                this.lines.push(entity1);

                return [entity1];
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            for (var i = 0, len = this.lines.length; i < len; i++) {
                this.viewer.entities.remove(this.lines[i]);
            }
            this.lines = [];
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.clear();
            _get(Sightline.prototype.__proto__ || Object.getPrototypeOf(Sightline.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'visibleColor',
        get: function get() {
            return this._visibleColor;
        },
        set: function set(val) {
            this._visibleColor = val;
        }
        //不可视区域颜色

    }, {
        key: 'hiddenColor',
        get: function get() {
            return this._hiddenColor;
        },
        set: function set(val) {
            this._hiddenColor = val;
        }

        //depthFailMaterial颜色，默认为不可视区域颜色

    }, {
        key: 'depthFailColor',
        get: function get() {
            return this._depthFailColor;
        },
        set: function set(val) {
            this._depthFailColor = val;
        }
    }]);

    return Sightline;
}(_MarsClass2.MarsClass);

//[静态属性]本类中支持的事件类型常量


Sightline.event = {
    end: _MarsClass2.eventType.end
};

/***/ }),
