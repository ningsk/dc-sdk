class BaseLayer extends BaseClass {
  //========== 构造方法 ==========
  constructor(viewer, options) {
    super()
    _this.viewer = viewer;
    _this.options = options; //配置的config信息

    _this.name = options.name;
    _this.hasZIndex = Cesium.defaultValue(options.hasZIndex, false);
    _this.hasOpacity = Cesium.defaultValue(options.hasOpacity, false);
    _this._opacity = Cesium.defaultValue(options.opacity, 1);
    if (options.hasOwnProperty("alpha")) _this._opacity = Number(options.alpha);

    //单体化时，不可调整透明度
    if (options.dth) {
      _this.hasOpacity = false;

      options.symbol = options.symbol || {};
      options.symbol.styleOptions = options.symbol.styleOptions || {};
      options.symbol.styleOptions.clampToGround = true;
    }

    _this.create();

    _this._visible = false;
    if (options.visible) {
      if (_this.options.visibleTimeout) {
        setTimeout(function() {
          _this.visible = true;
        }, _this.options.visibleTimeout);
      } else {
        _this.visible = true;
      }

      if (options.flyTo) {
        _this.centerAt(_this.options.flyToDuration || 0);
      }
    }
  }
  //========== 对外属性 ==========




  //========== 方法==========
  create() {
    if (this.options.onCreate) {
      this.options.onCreate(this.viewer);
      showError(title, error) {
        if (!error) error = '未知错误';

        if (this.viewer) this.viewer.cesiumWidget.showErrorPanel(title, undefined, error);

        marslog.warn('layer错误:' + title + error);
      }
    }
  }

  //添加

  add() {
    this._visible = true;
    this.options.visible = this._visible;

    if (this.options.onAdd) {
      this.options.onAdd(this.viewer);
    }
    this.fire(_MarsClass2.eventType.add);
  }
  //移除

  remove() {
    this._visible = false;
    this.options.visible = this._visible;

    if (this.options.onRemove) {
      this.options.onRemove(this.viewer);
    }
    this.fire(_MarsClass2.eventType.remove);
  }
  //定位至数据区域

  centerAt(duration) {
    if (this.options.extent || this.options.center) {
      this.viewer.mars.centerAt(this.options.extent || this.options.center, {
        duration: duration,
        isWgs84: true
      });
    } else if (this.options.onCenterAt) {
      this.options.onCenterAt(duration, this.viewer);
    }
  }
  //设置透明度

  setOpacity(value) {
    if (this.options.onSetOpacity) {
      this.options.onSetOpacity(value, this.viewer);
    }
  }
  //设置叠加顺序

  setZIndex(value) {
    if (this.options.onSetZIndex) {
      this.options.onSetZIndex(value, this.viewer);
    }
  }
  destroy() {
    this.visible = false;
  }

  get visible() {
    return this._visible;
  }
  set visible(val) {
    if (this._visible == val) return;

    this._visible = val;
    this.options.visible = val;

    if (val) {
      if (this.options.msg)(0, _util.msg)(this.options.msg);
      this.add();
    } else {
      this.remove();
    }
  }
  get opacity() {
    return this._opacity;
  }
  set opacity(val) {
    this.setOpacity(val);
  }
}
//[静态属性]本类中支持的事件类型常量

BaseLayer.event = {
  add: EventType.add,
  remove: EventType.remove,
  load: EventType.load,
  click: EventType.click,
  mouseOver: EventType.mouseOver,
  mouseOut: EventType.mouseOut
};
