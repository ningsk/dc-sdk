class DrawLayer extends BaseLayer {
  create() {
    this.drawControl = new _Draw.Draw(this.viewer, {
      hasEdit: false,
      nameTooltip: false,
      removeScreenSpaceEvent: false
    });
  }
  //添加

  add() {
    if (this._isload) this.drawControl.setVisible(true);
    else this._loadData();
    _get(DrawLayer.prototype.__proto__ || Object.getPrototypeOf(DrawLayer.prototype), 'add', this).call(this);
  }
  //移除

  remove() {
    this.drawControl.setVisible(false);
    _get(DrawLayer.prototype.__proto__ || Object.getPrototypeOf(DrawLayer.prototype), 'remove', this).call(this);
  }
  //定位至数据区域

  centerAt(duration) {
    var arr = this.drawControl.getEntitys();
    this.viewer.mars.flyTo(arr, {
      duration: duration
    });
  }
  _loadData() {
    var that = this;
    _zepto.zepto.ajax({
      type: "get",
      dataType: "json",
      url: this.options.url,
      timeout: 10000,
      success: function success(data) {
        that._isload = true;
        var arr = that.drawControl.jsonToEntity(data, true, that.options.flyTo);
        that._bindEntityConfig(arr);

        that.fire(_MarsClass.eventType.load, {
          draw: that.drawControl,
          entities: arr
        });
      },
      error: function error(XMLHttpRequest, textStatus, errorThrown) {
        marslog.warn("json文件" + that.options.url + "加载失败！");
      }
    });
  }
  _bindEntityConfig(arrEntity) {
    var that = this;

    for (var i = 0, len = arrEntity.length; i < len; i++) {
      var entity = arrEntity[i];

      //popup弹窗
      if (this.options.columns || this.options.popup) {
        entity.popup = (0, _util.bindLayerPopup)(this.options.popup, function(entity) {
          var attr = entity.attribute.attr;
          attr.layer_name = that.options.name;
          attr.draw_type = entity.attribute.type;
          attr.draw_typename = entity.attribute.name;
          return (0, _util.getPopupForConfig)(that.options, attr);
        });
      }
      if (this.options.tooltip) {
        entity.tooltip = (0, _util.bindLayerPopup)(this.options.tooltip, function(entity) {
          var attr = entity.attribute.attr;
          attr.layer_name = that.options.name;
          attr.draw_type = entity.attribute.type;
          attr.draw_typename = entity.attribute.name;
          return (0, _util.getPopupForConfig)({
            popup: that.options.tooltip
          }, attr);
        });
      }
      entity.eventTarget = this;

      if (this.options.contextmenuItems) {
        entity.contextmenuItems = this.options.contextmenuItems;
      }
    }
  }

  //刷新事件

  refreshEvent() {
    var arrEntity = this.drawControl.getEntitys();
    for (var i = 0, len = arrEntity.length; i < len; i++) {
      var entity = arrEntity[i];

      entity.eventTarget = this;
      entity.contextmenuItems = this.options.contextmenuItems;
    }
    return true;
  }
  updateStyle(style) {
    var arrEntity = this.drawControl.getEntitys();
    for (var i = 0, len = arrEntity.length; i < len; i++) {
      var entity = arrEntity[i];
      this.drawControl.updateStyle(style, entity);
    }
    return arrEntity;
  }

  get layer() {
    if (this.drawControl) return this.drawControl.dataSource;
    else return null;
  }
}
export default DrawLayer
