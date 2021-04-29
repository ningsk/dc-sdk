/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tooltip = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass = __webpack_require__(3);

var _zepto = __webpack_require__(8);

var _point = __webpack_require__(2);

var _util = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tooltip = exports.Tooltip = function () {
    //========== 构造方法 ========== 
    function Tooltip(viewer, options) {
        _classCallCheck(this, Tooltip);

        this.viewer = viewer;
        this.options = options || {};

        this._enable = true;
        this.viewerid = viewer._container.id;
        this.tooltipcontentid = this.viewerid + '-dc-tooltip-content';

        this.highlighted = {
            feature: undefined,
            originalColor: new Cesium.Color()
        };
        this.defaultHighlightedClr = Cesium.Color.fromCssColorString("#95e40c");

        //兼容历史接口
        this.getTooltipForConfig = _util.getTooltipForConfig;

        //添加弹出框  
        var infoDiv = '<div id="' + this.viewerid + '-dc-tooltip-view" class="dc-popup" style="display:none;">' + '     <div class="dc-popup-content-wrapper  dc-popup-background">' + '         <div id="' + this.tooltipcontentid + '" class="dc-popup-content dc-popup-color"></div>' + '     </div>' + '     <div class="dc-popup-tip-container"><div class="dc-popup-tip  dc-popup-background"></div></div>' + '</div> ';
        (0, _zepto.zepto)("#" + this.viewerid).append(infoDiv);

        this._tooltipDOM = (0, _zepto.zepto)('#' + this.viewerid + '-dc-tooltip-view');
        this._tooltipContentDOM = (0, _zepto.zepto)('#' + this.tooltipcontentid);

        //鼠标移动事件
        this.options.cacheTime = Cesium.defaultValue(this.options.cacheTime, 100);
        this.viewer.mars.on(_MarsClass.eventType.mouseMove, this.mouseMoveHandler, this);

        this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        this.handler.setInputAction(function (event) {//鼠标移动事件

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    //========== 对外属性 ==========  

    //是否禁用


    _createClass(Tooltip, [{
        key: 'mouseMoveHandler',


        //========== 方法 ========== 
        //鼠标移动事件，setTimeout是为了优化效率
        value: function mouseMoveHandler(event) {
            var _this = this;

            if (this.moveTimer) {
                clearTimeout(this.moveTimer);
                delete this.moveTimer;
            }
            this.moveTimer = setTimeout(function () {
                delete _this.moveTimer;
                _this.mouseMovingPicking(event);
            }, this.options.cacheTime);
        }
        //鼠标移动事件

    }, {
        key: 'mouseMovingPicking',
        value: function mouseMovingPicking(event) {
            var _this2 = this;

            if (!this._enable) return;

            (0, _zepto.zepto)('.cesium-viewer').css('cursor', '');

            if (this.viewer.scene.screenSpaceCameraController.enableRotate === false || this.viewer.scene.screenSpaceCameraController.enableTilt === false || this.viewer.scene.screenSpaceCameraController.enableTranslate === false) {
                this.close();
                return;
            }

            var position = event.endPosition;

            var entity; //鼠标感知的对象，可能是entity或primitive等 
            var pickedObject;
            try {
                pickedObject = this.viewer.scene.pick(position, 5, 5);
            } catch (e) {}

            //普通entity对象 && this.viewer.scene.pickPositionSupported
            if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) && pickedObject.id instanceof Cesium.Entity) {
                entity = pickedObject.id;
            }
            //单体化3dtiles数据的处理(如：BIM的构件，城市白膜建筑)
            else if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.tileset) && Cesium.defined(pickedObject.getProperty)) {
                    var cfg = pickedObject.tileset._config || pickedObject.tileset;
                    if (cfg) {
                        //取属性
                        var attr = {};
                        var names = pickedObject.getPropertyNames();
                        for (var i = 0; i < names.length; i++) {
                            var name = names[i];
                            if (!pickedObject.hasProperty(name)) continue;

                            var val = pickedObject.getProperty(name);
                            if (val == null) continue;
                            attr[name] = val;
                        }

                        entity = {
                            id: pickedObject._batchId,
                            tooltip: {
                                html: (0, _util.getTooltipForConfig)(cfg, attr),
                                anchor: cfg.popupAnchor || [0, -15]
                            },
                            attr: attr, //回调方法中用
                            feature: pickedObject //回调方法中用
                        };
                        if (!cfg.noMouseMove) {
                            if (cfg.mouseover) entity.mouseover = cfg.mouseover;
                            if (cfg.mouseout) entity.mouseout = cfg.mouseout;
                        }

                        //高亮显示单体对象 
                        if (cfg.showMoveFeature) {
                            this.showFeatureFor3dtiles(pickedObject, cfg.moveFeatureColor);
                        }
                    }
                }
                //primitive对象 
                else if (pickedObject && Cesium.defined(pickedObject.primitive)) {
                        entity = pickedObject.primitive;
                    }

            if (entity) {
                //存在鼠标感知的对象
                if (entity.popup || entity.click || entity.cursorCSS) {
                    (0, _zepto.zepto)('.cesium-viewer').css('cursor', entity.cursorCSS || 'pointer');
                }

                //加统一的 mouseover 鼠标移入处理
                if (!entity.noMouseMove) {
                    //排除标识了不处理其移入事件的对象 ，比如高亮对象本身
                    if (this.lastTime) {
                        clearTimeout(this.lastTime);
                        this.lastTime = null;
                    }
                    this.lastTime = setTimeout(function (e) {
                        _this2.lastTime = null;
                        _this2.activateMouseOver(entity, position);
                    }, 20);
                }

                //tooltip
                if (entity.tooltip) {
                    var cartesian = (0, _point.getCurrentMousePosition)(this.viewer.scene, position);
                    this.show(entity, cartesian, position);
                } else {
                    this.close();
                }
            } else {
                this.close();

                if (this.lastTime) {
                    clearTimeout(this.lastTime);
                    this.lastTime = null;
                }
                this.lastTime = setTimeout(function (e) {
                    _this2.lastTime = null;
                    _this2.activateMouseOut();
                }, 20);
            }
        }
    }, {
        key: 'show',
        value: function show(entity, cartesian, position) {
            if (entity == null || entity.tooltip == null) return;

            //计算显示位置 
            if (position == null) position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, cartesian);
            if (position == null) {
                this.close();
                return;
            }

            if (this._lastTooltipEntity !== entity) {
                //避免鼠标移动时重复构造DOM
                //显示内容
                var inhtml;
                var onAdd;
                if (_typeof(entity.tooltip) === 'object') {
                    inhtml = entity.tooltip.html;
                    onAdd = entity.tooltip.onAdd;
                    this.onRemove = entity.tooltip.onRemove;

                    if (typeof entity.tooltip.visible === 'function') {
                        if (!entity.tooltip.visible(entity)) {
                            this.close();
                            return;
                        }
                    }
                } else {
                    inhtml = entity.tooltip;
                }

                if (typeof inhtml === 'function') {
                    inhtml = inhtml(entity, cartesian); //回调方法
                }
                if (!inhtml) return;

                this._tooltipContentDOM.html(inhtml);
                this._tooltipDOM.show();

                //tooltip的DOM添加到页面的回调方法
                if (onAdd) onAdd(this.tooltipcontentid);
            }
            this._lastTooltipEntity = entity;

            //定位位置
            var x = position.x - this._tooltipDOM.width() / 2;
            var y = position.y - this._tooltipDOM.height();

            var tooltip = entity.tooltip;
            if (tooltip && (typeof tooltip === 'undefined' ? 'undefined' : _typeof(tooltip)) === 'object' && tooltip.anchor) {
                x += tooltip.anchor[0];
                y += tooltip.anchor[1];
            } else {
                y -= 15; //默认偏上10像素
            }
            this._tooltipDOM.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');
        }
    }, {
        key: 'close',
        value: function close() {
            if (this.moveTimer) {
                clearTimeout(this.moveTimer);
                delete this.moveTimer;
            }
            if (this.onRemove) {
                this.onRemove(this.tooltipcontentid);
                delete this.onRemove;
            }

            this._tooltipContentDOM.empty();
            this._tooltipDOM.hide();

            this.removeFeatureFor3dtiles();
            delete this._lastTooltipEntity;
        }
    }, {
        key: 'activateMouseOver',
        value: function activateMouseOver(entity, position) {
            if (this._lastMouseEntity === entity) return;

            this.activateMouseOut();

            //鼠标移入对象所关联的管理类(基于MarsClass)，进行mouseOver事件抛出。
            if (entity.eventTarget && entity.eventTarget.fire) {
                entity.eventTarget.fire(_MarsClass.eventType.mouseOver, {
                    sourceTarget: entity,
                    position: position
                });
            }
            if (entity.mouseover && typeof entity.mouseover === 'function') entity.mouseover(entity, position);

            this._lastMouseEntity = entity;
        }
    }, {
        key: 'activateMouseOut',
        value: function activateMouseOut() {
            if (this._lastMouseEntity == null) return;

            //鼠标移入对象所关联的管理类(基于MarsClass)，进行mouseOver事件抛出。
            if (this._lastMouseEntity.eventTarget && this._lastMouseEntity.eventTarget.fire) {
                this._lastMouseEntity.eventTarget.fire(_MarsClass.eventType.mouseOut, {
                    sourceTarget: this._lastMouseEntity
                });
            }
            if (this._lastMouseEntity.mouseout && typeof this._lastMouseEntity.mouseout === 'function') this._lastMouseEntity.mouseout(this._lastMouseEntity);
            this._lastMouseEntity = null;
        }

        //=====================高亮对象处理========================
        //鼠标移入3dtiles单体化，高亮显示构件处理

    }, {
        key: 'removeFeatureFor3dtiles',
        value: function removeFeatureFor3dtiles() {
            if (Cesium.defined(this.highlighted.feature)) {
                try {
                    this.highlighted.feature.color = this.highlighted.originalColor;
                } catch (ex) {}
                this.highlighted.feature = undefined;
            }
        }
    }, {
        key: 'showFeatureFor3dtiles',
        value: function showFeatureFor3dtiles(pickedFeature, color) {
            this.removeFeatureFor3dtiles();
            this.highlighted.feature = pickedFeature;

            Cesium.Color.clone(pickedFeature.color, this.highlighted.originalColor);
            if (color && typeof color === 'string') color = Cesium.Color.fromCssColorString(color);
            pickedFeature.color = color || this.defaultHighlightedClr;
        }

        //=================================================


    }, {
        key: 'destroy',
        value: function destroy() {
            this.close();
            this.viewer.mars.off(_MarsClass.eventType.mouseMove, this.mouseMoveHandler, this);
            this._tooltipDOM.remove();

            //删除所有绑定的数据
            for (var i in this) {
                delete this[i];
            }
        }
    }, {
        key: 'enable',
        get: function get() {
            return this._enable;
        },
        set: function set(value) {
            this._enable = value;
            if (!value) {
                this.close();
            }
        }
    }]);

    return Tooltip;
}();

/***/ }),
