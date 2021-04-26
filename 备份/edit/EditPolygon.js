class EditPolygon extends EditPolyline {
    //========== 构造方法 ========== 
    function EditPolygon(entity, viewer) {
        _classCallCheck(this, EditPolygon);

        //是否首尾相连闭合（线不闭合，面闭合），用于处理中间点
        var _this = _possibleConstructorReturn(this, (EditPolygon.__proto__ || Object.getPrototypeOf(EditPolygon)).call(this, entity, viewer));

        _this.hasClosure = true;
        return _this;
    }

    //取enity对象的对应矢量数据


    _createClass(EditPolygon, [{
        key: 'getGraphic',
        value: function getGraphic() {
            return this.entity.polygon;
        }
        //修改坐标会回调，提高显示的效率

    }, {
        key: 'changePositionsToCallback',
        value: function changePositionsToCallback() {
            this._positions_draw = this.entity._positions_draw || attr.getPositions(this.entity);
        }
    }, {
        key: 'isClampToGround',
        value: function isClampToGround() {
            return this.entity.attribute.style.hasOwnProperty('clampToGround') ? this.entity.attribute.style.clampToGround : !this.entity.attribute.style.perPositionHeight;
        }
    }, {
        key: 'updateAttrForEditing',
        value: function updateAttrForEditing() {
            var style = this.entity.attribute.style;
            if (style.extrudedHeight && (0, _util.isNumber)(style.extrudedHeight)) {
                //存在extrudedHeight高度设置时
                var maxHight = (0, _point.getMaxHeight)(this.getPosition());
                this.getGraphic().extrudedHeight = maxHight + Number(style.extrudedHeight);
            }
        }
        //图形编辑结束后调用

    }, {
        key: 'finish',
        value: function finish() {
            this.entity._positions_draw = this.getPosition();
        }
    }]);

    return EditPolygon;
}(_Edit.EditPolyline);

/***/ }),
