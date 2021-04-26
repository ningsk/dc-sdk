class GltfLayer extends BaseLayer {
  //========== 构造方法 ==========
  constructor(viewer, options) {
    super(viewer, options)
    this.hasOpacity = true;
  }

  //添加
  add() {
    if (this.entity) {
      this.viewer.entities.add(this.entity);
    } else {
      this.initData();
    }
    _get(GltfLayer.prototype.__proto__ || Object.getPrototypeOf(GltfLayer.prototype), 'add', this).call(this);
  }
  //移除

  remove() {
    this.viewer.entities.remove(this.entity);
    _get(GltfLayer.prototype.__proto__ || Object.getPrototypeOf(GltfLayer.prototype), 'remove', this).call(this);
  }
  //定位至数据区域

  centerAt(duration) {
    if (this.entity == null) return;

    if (this.options.extent || this.options.center) {
      this.viewer.mars.centerAt(this.options.extent || this.options.center, {
        duration: duration,
        isWgs84: true
      });
    } else {
      var cfg = this.options.position;
      this.viewer.mars.centerPoint(cfg, {
        duration: duration,
        isWgs84: true
      });
    }
  }
  initData() {
    var _this2 = this;

    //位置信息
    var cfg = this.options.position;
    cfg = this.viewer.mars.point2map(cfg); //转换坐标系
    var position = Cesium.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);

    //样式信息
    var style = this.options.style || {};
    if (Cesium.defined(this._opacity) && this._opacity != 1) style.opacity = this._opacity;

    //方向
    var heading = Cesium.Math.toRadians(style.heading || cfg.heading || 0);
    var pitch = Cesium.Math.toRadians(style.pitch || cfg.pitch || 0);
    var roll = Cesium.Math.toRadians(style.roll || cfg.roll || 0);
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var converter = this.options.converter || Cesium.Transforms.eastNorthUpToFixedFrame;
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr, this.viewer.scene.globe.ellipsoid,
      converter);

    var modelattr = (0, _Attr.style2Entity)(style);
    modelattr.uri = this.options.url;

    this.entity = this.viewer.entities.add({
      name: this.options.name,
      position: position,
      orientation: orientation,
      model: modelattr,
      //dc扩展的属性
      _config: this.options,
      eventTarget: this
    });

    //readyPromise为修改cesium内部源码来实现的回调
    this.entity.readyPromise = function(entity, model) {
      _this2.fire(_MarsClass.eventType.load, {
        entity: entity,
        model: model
      });
    };

    var config = this.options;
    if (this.options.popup) {
      this.entity.popup = {
        html: function html(entity) {
          var attr = entity.properties || entity.data || {};

          if ((0, _util.isString)(attr)) return attr;
          else return (0, _util.getPopupForConfig)(config, attr);
        },
        anchor: config.popupAnchor || [0, -15]
      };
    }
    if (this.options.tooltip) {
      this.entity.tooltip = {
        html: function html(entity) {
          var attr = entity.properties || entity.data || {};

          if ((0, _util.isString)(attr)) return attr;
          else return (0, _util.getPopupForConfig)({
            popup: config.tooltip
          }, attr);
        },
        anchor: config.tooltipAnchor || [0, -15]
      };
    }

    this.fire(_MarsClass.eventType.loadBefore, {
      entity: this.entity
    });
  }
  //设置透明度

  setOpacity(value) {
    if (this.entity == null) return;
    this.entity.model.color = Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(value);
  }
  get layer() {
    return this.entity;
  }

  get model() {
    return this.entity;
  }
}
//[静态属性]本类中支持的事件类型常量


GltfLayer.event = {
  load: EventType.load,
  loadBefore: EventType.loadBefore,
  click: EventType.click,
  mouseOver: EventType.mouseOver,
  mouseOut: EventType.mouseOut
}
export default GltfLayer
