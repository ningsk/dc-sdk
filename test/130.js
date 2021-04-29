/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ContextMenu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _zepto = __webpack_require__(8);

var _point = __webpack_require__(2);

var point = _interopRequireWildcard(_point);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContextMenu = exports.ContextMenu = function () {
    //========== 构造方法 ========== 
    function ContextMenu(viewer, options) {
        var _this = this;

        _classCallCheck(this, ContextMenu);

        this.viewer = viewer;
        this.viewerid = viewer._container.id;

        this._enable = true;
        this.menuIndex = 0;
        this.objMenu = {};

        //添加弹出框 
        var infoDiv = '<div id="' + this.viewerid + '-dc-contextmenu" class="dc-contextmenu open" style="display:none;">\n                            <ul id="' + this.viewerid + '-dc-contextmenu-ul" class="dc-contextmenu-ul"> \n                            </ul>\n                        </div>';
        (0, _zepto.zepto)("#" + viewer._container.id).append(infoDiv);

        this._contextmenuDOM = (0, _zepto.zepto)('#' + this.viewerid + '-dc-contextmenu');
        this._contextmenuULDOM = (0, _zepto.zepto)('#' + this.viewerid + '-dc-contextmenu-ul');

        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (event) {
            _this.close();
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        handler.setInputAction(function (event) {
            _this.close();
        }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
        handler.setInputAction(function (event) {
            _this.close();
        }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
        handler.setInputAction(function (event) {
            _this.close();
        }, Cesium.ScreenSpaceEventType.PINCH_START);
        handler.setInputAction(function (event) {
            _this.close();
        }, Cesium.ScreenSpaceEventType.WHEEL);
        handler.setInputAction(function (event) {
            _this.close();
            if (!_this._enable) return;

            var position = event.position;

            var entity; //鼠标感知的对象，可能是entity或primitive
            var pickedObject = viewer.scene.pick(position, 5, 5);

            var contextmenuItems = viewer.mars.contextmenuItems;
            //普通entity对象 
            if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) && pickedObject.id instanceof Cesium.Entity) {
                entity = pickedObject.id;
                if (Cesium.defined(entity.contextmenuItems)) contextmenuItems = entity.contextmenuItems;
            }
            //primitive对象 
            else if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.primitive)) {
                    entity = pickedObject.primitive;
                    if (Cesium.defined(entity.contextmenuItems)) contextmenuItems = entity.contextmenuItems;
                }

            _this.showView(contextmenuItems, position, entity);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this.handler = handler;
    }

    //========== 对外属性 ==========  

    //是否禁用


    _createClass(ContextMenu, [{
        key: 'showView',


        //========== 方法 ========== 

        value: function showView(contextmenu, positionMouse, entity) {
            if (!contextmenu || contextmenu.length == 0) {
                this.close();
                return;
            };

            var cartesian = point.getCurrentMousePosition(this.viewer.scene, positionMouse);

            var inhtml = "";
            for (var i = 0, len = contextmenu.length; i < len; i++) {
                var item = contextmenu[i];
                var result = this.getItemHtml(item, {
                    positionMouse: positionMouse,
                    position: cartesian,
                    target: entity
                });
                if (result) inhtml += result;
            }

            if (inhtml == "") {
                this.close();
                return;
            };

            var that = this;
            this._contextmenuULDOM.html(inhtml);
            (0, _zepto.zepto)('#' + this.viewerid + '-dc-contextmenu-ul .contextmenu-item').click(function (e) {
                var index = Number((0, _zepto.zepto)(this).attr('data-index'));
                var item = that.objMenu[index];
                var callback = item.callback || item.calback; //兼容不同参数名
                if (callback) {
                    callback({
                        positionMouse: positionMouse,
                        position: cartesian,
                        data: item,
                        target: entity
                    });
                }
                that.close();
            });

            //鼠标滑过弹出二级菜单
            (0, _zepto.zepto)('#' + this.viewerid + '-dc-contextmenu-ul .contextmenu-item').mouseover(function (e) {
                (0, _zepto.zepto)('.dc-sub-menu').hide(); //所有的二级菜单隐藏

                var sub_menu = this.querySelector('.dc-sub-menu');
                if (sub_menu) {
                    sub_menu.style.display = 'block';
                }

                (0, _zepto.zepto)('#' + that.viewerid + '-dc-contextmenu-ul .active').removeClass('active');
                (0, _zepto.zepto)(this).addClass('active');
            });

            var top = positionMouse.y;
            var left = positionMouse.x;
            this._contextmenuDOM.css({ //不显示前，无法计算width和width
                "top": top,
                "left": left
            }).show();
            this._show = true;
            this._target = entity;

            var menuHeight = this._contextmenuDOM.height();
            var menuWidth = this._contextmenuDOM.width();

            (0, _zepto.zepto)('#' + this.viewerid + '-dc-contextmenu-ul .dc-sub-menu').css({
                left: menuWidth + 3 + "px"
            });

            //判断垂直方向 是否超过了 屏幕高度
            if (top + menuHeight > this.viewer.scene.canvas.clientHeight) {
                top -= menuHeight - 10;
                if (top <= 0) top = 0;
            } else {
                top += 10;
            }

            //判断水平方向 是否超过了屏幕宽度
            if (left + menuWidth > this.viewer.scene.canvas.clientWidth) {
                left -= menuWidth - 10;
                if (left <= 0) left = 0;
            } else {
                left += 10;
            }

            this._contextmenuDOM.css({
                "top": top,
                "left": left
            });
        }
    }, {
        key: 'getItemHtml',
        value: function getItemHtml(item, eventresult) {
            if (item.hasOwnProperty("visible")) {
                var visible = item.visible;
                try {
                    if (typeof visible === 'function') {
                        //回调方法 
                        eventresult.data = item;
                        visible = item.visible(eventresult);
                    }
                } catch (e) {
                    marslog.log(e);
                }

                if (!visible) return null;
            }

            var inhtml;
            if (item.text) {
                var childrenHtml = '';
                var childTip = '';
                if (item.children) {
                    childrenHtml = '<ul class="dc-contextmenu-ul dc-sub-menu">';
                    for (var j = 0, len2 = item.children.length; j < len2; j++) {
                        var childitem = item.children[j];
                        eventresult.data = childitem;
                        var result = this.getItemHtml(childitem, eventresult);
                        if (result) childrenHtml += result;
                    }
                    childrenHtml += '</ul>';
                    childTip = '&nbsp;&nbsp;<i class="fa fa-caret-right"></i>';
                }

                this.menuIndex++;
                this.objMenu[this.menuIndex] = item;

                inhtml = '<li class="contextmenu-item" data-index="' + this.menuIndex + '">\n                        <a href="javascript:void(0)"><i class="' + item.iconCls + '"></i>' + item.text + childTip + '</a>\n                        ' + childrenHtml + '\n                    </li>';
            } else inhtml = '<li class="line"></li>';
            return inhtml;
        }
    }, {
        key: 'close',
        value: function close() {
            if (!this._show) return;
            this._contextmenuDOM.hide();
            this._show = false;
            this._target = null;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.close();

            this.handler.destroy();
            this._contextmenuDOM.remove();

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
    }, {
        key: 'show',
        get: function get() {
            return this._show;
        }
    }, {
        key: 'target',
        get: function get() {
            return this._target;
        }
    }]);

    return ContextMenu;
}();

/***/ }),
