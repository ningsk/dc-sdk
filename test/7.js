/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.message = exports.Tooltip = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _zepto = __webpack_require__(8);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tooltip = exports.Tooltip = function () {
    //========== 构造方法 ========== 
    function Tooltip(frameDiv) {
        _classCallCheck(this, Tooltip);

        var div = document.createElement('DIV');
        div.className = "dc-draw-tooltip right";

        var arrow = document.createElement('DIV');
        arrow.className = "dc-draw-tooltip-arrow";
        div.appendChild(arrow);

        var title = document.createElement('DIV');
        title.className = "dc-draw-tooltip-inner";
        div.appendChild(title);

        this._div = div;
        this._title = title;

        // add to frame div and display coordinates
        frameDiv.appendChild(div);

        //鼠标的移入
        (0, _zepto.zepto)(".dc-draw-tooltip").mouseover(function () {
            (0, _zepto.zepto)(this).hide();
        });
    }

    _createClass(Tooltip, [{
        key: 'setVisible',
        value: function setVisible(visible) {
            this._div.style.display = visible ? 'block' : 'none';
        }
    }, {
        key: 'showAt',
        value: function showAt(position, message) {
            if (position && message) {
                this.setVisible(true);

                this._title.innerHTML = message;
                this._div.style.top = position.y - this._div.clientHeight / 2 + "px";

                //left css时
                //this._div.style.left = (position.x - this._div.clientWidth - 30) + "px"; 

                //right css时
                this._div.style.left = position.x + 30 + "px";
            } else {
                this.setVisible(false);
            }
        }
    }, {
        key: 'destroy',
        value: function destroy(visible) {
            this.setVisible(false);
            (0, _zepto.zepto)(this._div).remove();
        }
    }]);

    return Tooltip;
}();

//样式文件在map.css


var message = exports.message = {
    draw: {
        point: {
            start: '单击 完成绘制'
        },
        polyline: { //线面
            start: '单击 开始绘制',
            cont: '单击增加点，右击删除点',
            end: '单击增加点，右击删除点<br/>双击完成绘制',
            end2: '单击完成绘制'
        }
    },
    edit: {
        start: '单击后 激活编辑<br/>右击 单击菜单删除',
        end: '释放后 完成修改'
    },
    dragger: {
        def: '拖动该点后<br/>修改位置 ', //默认  
        moveAll: '拖动该点后<br/>整体平移',
        addMidPoint: '拖动该点后<br/>增加点',
        moveHeight: '拖动该点后<br/>修改高度',
        editRadius: '拖动该点后<br/>修改半径',
        editHeading: '拖动该点后<br/>修改方向',
        editScale: '拖动该点后<br/>修改缩放比例'
    },
    del: {
        def: '<br/>右击 删除该点',
        min: '无法删除，点数量不能少于'
    }
};

/***/ }),
