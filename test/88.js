/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawPBase = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _point = __webpack_require__(2);

var _MarsClass2 = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawPBase = exports.DrawPBase = function (_MarsClass) {
    _inherits(DrawPBase, _MarsClass);

    //========== 构造方法 ========== 
    function DrawPBase(opts) {
        _classCallCheck(this, DrawPBase);

        var _this = _possibleConstructorReturn(this, (DrawPBase.__proto__ || Object.getPrototypeOf(DrawPBase)).call(this, opts));

        _this.viewer = opts.viewer;
        _this.primitives = opts.primitives;
        _this.dataSource = opts.dataSource; //编辑类中使用的dataSource

        _this.tooltip = opts.tooltip || new Tooltip(_this.viewer.container);

        _this._positions_draw = null; //坐标位置相关 
        _this.editClass = null; //编辑对象   
        _this.attrClass = null; //对应的属性控制静态类
        return _this;
    }

    _createClass(DrawPBase, [{
        key: 'fire',
        value: function fire(type, data, propagate) {
            if (this._fire) this._fire(type, data, propagate);
        }
    }, {
        key: 'formatNum',
        value: function formatNum(num, digits) {
            return (0, _point.formatNum)(num, digits);
        }
    }, {
        key: 'enableControl',
        value: function enableControl(value) {
            if (this.viewer.mars.popup) this.viewer.mars.popup.enable = value;
            if (this.viewer.mars.tooltip) this.viewer.mars.tooltip.enable = value;
        }
        //激活绘制

    }, {
        key: 'activate',
        value: function activate(attribute, drawOkCallback) {
            if (this._enabled) {
                return this;
            }
            this._enabled = true;
            this.drawOkCallback = drawOkCallback;

            if (attribute instanceof Cesium.Entity) {
                this.reCreateFeature(attribute);
            } else {
                this.createFeature(attribute);
            }

            this.entity.inProgress = true;

            this.setCursor(true);
            this.enableControl(false);
            this.bindEvent();

            this.fire(_MarsClass2.eventType.drawStart, { drawtype: this.type, entity: this.entity });

            return this.entity;
        }
        //释放绘制

    }, {
        key: 'disable',
        value: function disable(hasWB) {
            if (!this._enabled) {
                return this;
            }
            this._enabled = false;

            this.setCursor(false);
            this.enableControl(true);

            if (hasWB && this.entity.inProgress) {
                //外部释放时，尚未结束的标绘移除。       
                if (this.primitives.contains(this.entity)) this.primitives.remove(this.entity);

                this.destroyHandler();
                this.tooltip.setVisible(false);
            } else {
                var entity = this.entity;
                this.entity.inProgress = false;
                this.finish();

                this.destroyHandler();
                this.tooltip.setVisible(false);
                this._positions_draw = null;
                this.entity = null;

                if (this.drawOkCallback) {
                    this.drawOkCallback(entity);
                    delete this.drawOkCallback;
                }
                this.fire(_MarsClass2.eventType.drawCreated, { drawtype: this.type, entity: entity });
            }

            return this;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.disable();
            _get(DrawPBase.prototype.__proto__ || Object.getPrototypeOf(DrawPBase.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'createFeature',
        value: function createFeature(attribute) {}
    }, {
        key: 'reCreateFeature',
        value: function reCreateFeature(entity) {}
        //============= 事件相关 ============= 

    }, {
        key: 'getHandler',
        value: function getHandler() {
            if (!this.handler || this.handler.isDestroyed()) {
                this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
            }
            return this.handler;
        }
    }, {
        key: 'destroyHandler',
        value: function destroyHandler() {
            this.handler && this.handler.destroy();
            this.handler = undefined;
        }
    }, {
        key: 'setCursor',
        value: function setCursor(val) {
            this.viewer._container.style.cursor = val ? 'crosshair' : '';
        }
        //绑定鼠标事件

    }, {
        key: 'bindEvent',
        value: function bindEvent() {}
        //=============  ============= 
        //坐标位置相关 

    }, {
        key: 'getDrawPosition',
        value: function getDrawPosition() {
            return this._positions_draw;
        }
        //获取编辑对象   

    }, {
        key: 'getEditClass',
        value: function getEditClass(entity) {
            if (this.editClass == null) return null;

            var _edit = new this.editClass(entity, this.viewer, this.dataSource);
            if (this._minPointNum != null) _edit._minPointNum = this._minPointNum;
            if (this._maxPointNum != null) _edit._maxPointNum = this._maxPointNum;

            _edit._fire = this._fire;
            _edit.tooltip = this.tooltip;

            return _edit;
        }
        //更新坐标后调用下，更新相关属性，子类使用

    }, {
        key: 'updateAttrForDrawing',
        value: function updateAttrForDrawing(isLoad) {}
        //图形绘制结束后调用

    }, {
        key: 'finish',
        value: function finish() {}
        //通用方法

    }, {
        key: 'getCoordinates',
        value: function getCoordinates(entity) {
            return this.attrClass.getCoordinates(entity);
        }
    }, {
        key: 'getPositions',
        value: function getPositions(entity) {
            return this.attrClass.getPositions(entity);
        }
    }, {
        key: 'toGeoJSON',
        value: function toGeoJSON(entity) {
            return this.attrClass.toGeoJSON(entity);
        }
        //属性转entity

    }, {
        key: 'attributeToEntity',
        value: function attributeToEntity(attribute, positions) {
            var entity = this.createFeature(attribute);
            this._positions_draw = positions;
            this.updateAttrForDrawing(true);
            this.finish();
            return entity;
        }
        //geojson转entity

    }, {
        key: 'jsonToEntity',
        value: function jsonToEntity(geojson) {
            var attribute = geojson.properties;
            var positions = (0, _point.getPositionByGeoJSON)(geojson);
            return this.attributeToEntity(attribute, positions);
        }
    }, {
        key: 'setDrawPositionByEntity',
        value: function setDrawPositionByEntity(entity) {
            var positions = this.getPositions(entity);
            this._positions_draw = positions;
        }
        //绑定外部entity到标绘

    }, {
        key: 'bindExtraEntity',
        value: function bindExtraEntity(entity, attribute) {
            this.entity = entity;
            entity.attribute = attribute;

            if (attribute.style) this.style2Entity(attribute.style, entity);

            this.setDrawPositionByEntity(entity);

            this.updateAttrForDrawing(true);
            this.finish();
            return entity;
        }
    }]);

    return DrawPBase;
}(_MarsClass2.MarsClass);

/***/ }),
