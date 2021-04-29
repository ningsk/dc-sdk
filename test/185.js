/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawEx = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _Draw = __webpack_require__(45);

var _Draw2 = __webpack_require__(6);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//字体点（转图片）
var drawtype = 'font-point';

var DrawEx = exports.DrawEx = function (_DrawBillboard) {
    _inherits(DrawEx, _DrawBillboard);

    function DrawEx() {
        _classCallCheck(this, DrawEx);

        return _possibleConstructorReturn(this, (DrawEx.__proto__ || Object.getPrototypeOf(DrawEx)).apply(this, arguments));
    }

    _createClass(DrawEx, [{
        key: 'updateFeatureEx',

        //更新图标，子类用
        value: function updateFeatureEx(style, entity) {
            var that = this;

            var size = Cesium.defaultValue(style.iconSize, 50);

            var div = document.createElement("div"); //创建一个div
            div.setAttribute('style', 'padding: 10px;text-align:center;max-width:' + (size + 10) + 'px;max-height:' + (size + 10) + 'px;');
            var jd = document.createElement("i");
            jd.setAttribute("class", Cesium.defaultValue(style.iconClass, "fa fa-automobile"));
            jd.setAttribute('style', 'font-size:' + size + 'px;color:' + style.color + ';');
            div.appendChild(jd);
            document.body.appendChild(div);

            this._islosdImg = true;
            if (window.domtoimage) {
                //lib/dom2img/dom-to-image.js
                domtoimage.toPng(div).then(function (dataUrl) {
                    entity.billboard.image = "" + dataUrl;

                    document.body.removeChild(div);
                    that._islosdImg = false;
                }).catch(function (error) {
                    marslog.warn('未知原因，导出失败!', error);

                    document.body.removeChild(div);
                    that._islosdImg = false;
                });
            } else if (window.html2canvas) {
                //lib/dom2img/html2canvas.js
                html2canvas(div, {
                    backgroundColor: null,
                    allowTaint: true
                }).then(function (canvas) {
                    entity.billboard.image = "" + canvas.toDataURL("image/png");

                    document.body.removeChild(div);
                    that._islosdImg = false;
                }).catch(function (error) {
                    marslog.warn('未知原因，导出失败!', error);

                    document.body.removeChild(div);
                    that._islosdImg = false;
                });
            }
        }
    }]);

    return DrawEx;
}(_Draw.DrawBillboard);

//注册到Draw中


(0, _Draw2.register)(drawtype, DrawEx);

/***/ }),
