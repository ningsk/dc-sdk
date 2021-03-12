/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MeasureVolume = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _point = __webpack_require__(2);

var _util = __webpack_require__(1);

var _polygon = __webpack_require__(13);

var _Attr = __webpack_require__(12);

var _Attr2 = __webpack_require__(21);

var _index = __webpack_require__(20);

var _MeasureArea2 = __webpack_require__(36);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//体积测量（方量）
var MeasureVolume = exports.MeasureVolume = function (_MeasureArea) {
    _inherits(MeasureVolume, _MeasureArea);

    function MeasureVolume(opts, target) {
        _classCallCheck(this, MeasureVolume);

        //高度文本样式
        var _this = _possibleConstructorReturn(this, (MeasureVolume.__proto__ || Object.getPrototypeOf(MeasureVolume)).call(this, opts, target));

        _this.labelHeightStyle = _extends({}, _this.labelStyle, {
            "font_size": 15,
            "background": false
        });
        if (Cesium.defined(opts.labelHeight)) {
            _this.labelHeightStyle = _extends({}, _this.labelHeightStyle, opts.labelHeight);
        }

        //面的样式
        _this.polygonStyle = (0, _index.getDefStyle)("polygon", {
            color: "#00fff2",
            opacity: 0.4
        });
        if (Cesium.defined(opts.polygon)) {
            _this.polygonStyle = _extends({}, _this.polygonStyle, opts.polygon);
        }

        //基准面的样式
        _this.polygonJzmStyle = (0, _index.getDefStyle)("polygon", {
            "color": "#00ff00",
            "opacity": 0.3
        });
        if (Cesium.defined(opts.polygonJzm)) {
            _this.polygonJzmStyle = _extends({}, _this.polygonJzmStyle, opts.polygonJzm);
        }

        _this.heightLabel = Cesium.defaultValue(opts.heightLabel, true);
        _this.offsetLabel = Cesium.defaultValue(opts.offsetLabel, false);

        _this._last_depthTestAgainstTerrain = _this.viewer.scene.globe.depthTestAgainstTerrain;
        _this._hasFX = false;
        return _this;
    }
    //========== 对外属性 ==========  


    _createClass(MeasureVolume, [{
        key: '_startDraw',


        //开始绘制
        value: function _startDraw(options) {
            this.clear();
            options.style = this.polygonStyle || options.style;
            return _get(MeasureVolume.prototype.__proto__ || Object.getPrototypeOf(MeasureVolume.prototype), '_startDraw', this).call(this, options);
        }
        //绘制完成后

    }, {
        key: 'showDrawEnd',
        value: function showDrawEnd(entity) {
            var _this2 = this;

            if (entity.polygon == null) return;

            this.totalLable.label.text = "正在计算体积…";

            var positions = this.drawControl.getPositions(entity);
            setTimeout(function () {
                _this2.calcVolume(positions, function () {
                    _this2.drawControl.deleteEntity(entity);
                });
            }, 500);
        }
        //外部使用，直接传positons方式

    }, {
        key: 'start',
        value: function start(positions, options) {
            this.options = options;
            this.calcVolume(positions);
        }
        //计算贴地面

    }, {
        key: 'calcVolume',
        value: function calcVolume(positions, _callback) {
            var _this3 = this;

            this.target.fire(_MarsClass.eventType.start, {
                mtype: this.type,
                positions: positions
            });

            this._hasFX = true;

            //计算体积
            var result = (0, _polygon.interPolygon)(_extends({
                positions: positions,
                scene: this.viewer.scene,
                asyn: true
            }, this.options, {
                callback: function callback(interPolygonObj) {
                    if (_callback) _callback();

                    if (!_this3._hasFX) return;
                    _this3.showVolume(positions, interPolygonObj);
                }
            }));

            if (result._has3dtiles) {
                this.viewer.scene.globe.depthTestAgainstTerrain = false;
            } else {
                this.viewer.scene.globe.depthTestAgainstTerrain = true;
            }
        }
    }, {
        key: 'showVolume',
        value: function showVolume(positions, interPolygonObj) {
            var _this4 = this;

            this.interPolygonObj = (0, _polygon.updateVolumeByMinHeight)(interPolygonObj);
            this._maxHeight = this.interPolygonObj.maxHeight;
            this._minHeight = this.interPolygonObj.minHeight;
            this._jzmHeight = this.interPolygonObj.minHeight;

            var fillV = (0, _polygon.updateVolume)(this.interPolygonObj, this.height);

            // 显示基准面   
            var entityattr = (0, _Attr2.style2Entity)(this.polygonJzmStyle, {
                hierarchy: new Cesium.PolygonHierarchy(positions),
                height: new Cesium.CallbackProperty(function (time, result) {
                    return _this4.height;
                }, false)
            });
            delete entityattr.perPositionHeight;
            this.dataSource.entities.add({
                polygon: entityattr
            });

            // 显示立体边界
            delete this.polygonStyle.clampToGround;
            var entityattr = (0, _Attr2.style2Entity)(this.polygonStyle, {
                hierarchy: new Cesium.PolygonHierarchy(positions),
                height: new Cesium.CallbackProperty(function (time, result) {
                    return _this4.minHeight;
                }, false),
                extrudedHeight: new Cesium.CallbackProperty(function (time, result) {
                    return _this4.maxHeight;
                }, false),
                closeTop: false,
                closeBottom: true
            });
            this.dataSource.entities.add({
                polygon: entityattr
            });

            //显示各点的贴地高度文本
            if (this.heightLabel) this.showPointHeightLabel(positions, this.interPolygonObj.minHeight);

            //显示计算结果文本  
            if (!this.totalLable) {
                var entityattr = (0, _Attr.style2Entity)(this.labelStyle, {
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    show: false
                });
                this.totalLable = this.dataSource.entities.add({
                    label: entityattr,
                    _noMousePosition: true,
                    attribute: {}
                });
            }
            this.totalLable.attribute.value = fillV;
            this.totalLable.showText = function (unit) {
                var fillV = this.attribute.value;
                var fillText = '';
                if (fillV.fillVolume > 0) {
                    fillText += '填方体积：' + formatNum(fillV.fillVolume) + "立方米\n";
                }
                if (fillV.digVolume > 0) {
                    fillText += "挖方体积：" + formatNum(fillV.digVolume) + "立方米\n";
                }
                fillText += '横切面积：' + (0, _util.formatArea)(fillV.totalArea);

                this.label.text = fillText;
                return fillText;
            };
            this.totalLable.showText();
            this.totalLable.position = (0, _point.centerOfMass)(positions, this.interPolygonObj.maxHeight); //求中心点 

            fillV.mtype = this.type;
            this.target.fire(_MarsClass.eventType.change, fillV);
            this.target.fire(_MarsClass.eventType.end, fillV);
        }

        //显示各点的贴地高度文本

    }, {
        key: 'showPointHeightLabel',
        value: function showPointHeightLabel(positions, minHeight) {
            var that = this;

            var arrLable = [];
            for (var i = 0; i < positions.length; i++) {
                var height = Math.max((0, _point.getSurfaceHeight)(this.viewer.scene, positions[i]), minHeight);

                var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
                var position = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);

                //各点的文本
                var entityattr = (0, _Attr.style2Entity)(this.labelHeightStyle, {
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                });
                var label = this.dataSource.entities.add({
                    position: position,
                    label: entityattr,
                    attribute: { value: height }
                });
                // label.attribute.value = height;
                label.showText = function (unit) {
                    var height = this.attribute.value;
                    var text = "海拔：" + height.toFixed(2) + "米";

                    if (that.offsetLabel) {
                        var offset = height - that.height;
                        if (offset > 0) text += "\n高度：" + offset.toFixed(2) + "米(面上)";else text += "\n高度：" + Math.abs(offset).toFixed(2) + "米(面下)";
                    }

                    this.label.text = text;
                    return text;
                };
                label.showText();
                arrLable.push(label);
            }
            this.arrLables = arrLable;
        }
    }, {
        key: 'selecteHeight',
        value: function selecteHeight(callback) {
            //拾取高度
            var that = this;
            this.drawControl.startDraw({
                type: "point",
                style: {
                    color: "#00fff2"
                },
                success: function success(entity) {
                    if (!entity.point) return;

                    var pos = entity._position._value;
                    var height = Cesium.Cartographic.fromCartesian(pos).height;
                    that.height = height;

                    that.drawControl.deleteEntity(entity);

                    if (callback) callback(height);
                }
            });
        }
    }, {
        key: 'clear',
        value: function clear() {
            delete this.interPolygonObj;
            delete this._maxHeight;
            delete this._minHeight;
            delete this._jzmHeight;

            delete this.totalLable;
            delete this.arrLables;

            _get(MeasureVolume.prototype.__proto__ || Object.getPrototypeOf(MeasureVolume.prototype), 'clear', this).call(this);
            this._hasFX = false;
        }
    }, {
        key: 'type',
        get: function get() {
            return "volume";
        }

        //面内的最高地表高度

    }, {
        key: 'polygonMaxHeight',
        get: function get() {
            if (this.interPolygonObj) return this.interPolygonObj.maxHeight;else return this.maxHeight;
        }

        //高度

    }, {
        key: 'height',
        get: function get() {
            return this._jzmHeight;
        },
        set: function set(val) {
            this._jzmHeight = val;
            if (val > this.maxHeight) this.maxHeight = val;
            if (val < this.minHeight) this.minHeight = val;

            if (!this._hasFX) return;

            var newFillV = (0, _polygon.updateVolume)(this.interPolygonObj, this.height);
            this.totalLable.attribute.value = newFillV;
            this.totalLable.showText();

            if (this.arrLables) {
                for (var i = 0; i < this.arrLables.length; i++) {
                    this.arrLables[i].showText();
                }
            }
            this.target.fire(_MarsClass.eventType.change, _extends({
                mtype: this.type
            }, newFillV));
        }
    }, {
        key: 'minHeight',
        get: function get() {
            return this._minHeight;
        },
        set: function set(val) {
            this._minHeight = val;

            if (!this._hasFX) return;

            if (this.interPolygonObj) {
                this.interPolygonObj.minHeight = val;
                this.interPolygonObj = (0, _polygon.updateVolumeByMinHeight)(this.interPolygonObj);
            }
            var newFillV = (0, _polygon.updateVolume)(this.interPolygonObj, this.height);
            this.totalLable.attribute.value = newFillV;
            this.totalLable.showText();

            this.target.fire(_MarsClass.eventType.change, _extends({
                mtype: this.type
            }, newFillV));
        }
    }, {
        key: 'maxHeight',
        get: function get() {
            return this._maxHeight;
        },
        set: function set(val) {
            this._maxHeight = val;
        }
    }]);

    return MeasureVolume;
}(_MeasureArea2.MeasureArea);

//格式化数值


function formatNum(num) {
    if (num > 10000) {
        return (num / 10000).toFixed(2) + "万";
    }
    return num.toFixed(2);
}

/***/ }),