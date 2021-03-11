/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MouseZoomStyle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _zepto = __webpack_require__(8);

var _point = __webpack_require__(2);

var point = _interopRequireWildcard(_point);

var _util2 = __webpack_require__(1);

var _util = _interopRequireWildcard(_util2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//鼠标旋转、放大时的美化图标
var MouseZoomStyle = exports.MouseZoomStyle = function () {
    //========== 构造方法 ========== 
    function MouseZoomStyle(viewer, options) {
        var _this = this;

        _classCallCheck(this, MouseZoomStyle);

        this.viewer = viewer;
        this.options = options || {};

        var containerid = viewer._container.id + '-dc-mousezoom';
        (0, _zepto.zepto)("#" + viewer._container.id).append('<div id="' + containerid + '" class="dc-mousezoom"><div class="zoomimg"/></div>');
        this._dom = (0, _zepto.zepto)('#' + containerid);

        this.enable = Cesium.defaultValue(this.options.enable, true);

        var timetik = -1;
        var that = this;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(function (evnet) {
            if (!_this._enable) return;
            _this._dom.addClass('dc-mousezoom-visible');
            clearTimeout(timetik);
            timetik = setTimeout(function () {
                that._dom.removeClass('dc-mousezoom-visible');
            }, 200);
        }, Cesium.ScreenSpaceEventType.WHEEL);

        handler.setInputAction(function (evnet) {
            if (!_this._enable) return;
            var position = point.getCurrentMousePosition(viewer.scene, evnet.position);
            if (!position) return;

            if (viewer.camera.positionCartographic.height > viewer.scene.screenSpaceCameraController.minimumCollisionTerrainHeight) return;

            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            clearTimeout(timetik);
            _this._dom.css({
                top: evnet.position.y + 'px',
                left: evnet.position.x + 'px'
            });
            _this._dom.addClass('dc-mousezoom-visible');
        }, options.rightDrag ? Cesium.ScreenSpaceEventType.RIGHT_DOWN : Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

        handler.setInputAction(function (evnet) {
            _this._dom.removeClass('dc-mousezoom-visible');
            handler.setInputAction(function (evnet) {
                that._dom.css({
                    top: evnet.endPosition.y + 'px',
                    left: evnet.endPosition.x + 'px'
                });
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }, options.rightDrag ? Cesium.ScreenSpaceEventType.RIGHT_UP : Cesium.ScreenSpaceEventType.MIDDLE_UP);

        this.handler = handler;
    }

    //========== 对外属性 ==========  

    //是否显示


    _createClass(MouseZoomStyle, [{
        key: 'destroy',


        //========== 方法 ==========  

        value: function destroy() {
            if (this.handler) {
                this.handler.destroy();
                delete this.handler;
            }
            this._dom.remove();

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
        set: function set(val) {
            this._enable = val;
            if (val) this._dom.show();else this._dom.hide();
        }
    }]);

    return MouseZoomStyle;
}();

/***/ }),
