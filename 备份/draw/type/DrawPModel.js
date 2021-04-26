class DrawPModel extends DrawPBase {
  //========== 构造方法 ========== 
  constructor(opts) {
    super(opts)
    this.type = 'point';
    this.attrClass = attr; //对应的属性控制静态类 
    this.editClass = _EditP.EditPModel; //获取编辑对象 
    return _this;
  }

  //根据attribute参数创建Entity

  createFeature(attribute) {
    var _this2 = this;

    this._positions_draw = Cesium.Cartesian3.ZERO;

    //绘制时，是否自动隐藏模型，可避免拾取坐标存在问题。
    var _drawShow = Cesium.defaultValue(attribute.drawShow, false);

    var style = attribute.style;

    var modelPrimitive = this.primitives.add(Cesium.Model.fromGltf({
      url: style.modelUrl,
      modelMatrix: this.getModelMatrix(style),
      minimumPixelSize: Cesium.defaultValue(style.minimumPixelSize, 0.0),
      scale: Cesium.defaultValue(style.scale, 1.0),
      show: _drawShow
    }));
    modelPrimitive.loadOk = false;
    modelPrimitive.readyPromise.then(function(model) {
      model.loadOk = true;

      //播放动画
      // model.activeAnimations.addAll({
      //     loop : Cesium.ModelAnimationLoop.REPEAT, 
      // }); 

      _this2.style2Entity(style, model);
      _this2.fire(_MarsClass.eventType.load, {
        drawtype: _this2.type,
        entity: model,
        model: model
      });
    });
    modelPrimitive.attribute = attribute;
    modelPrimitive._drawShow = _drawShow;
    this.entity = modelPrimitive;

    return this.entity;
  }
  getModelMatrix(cfg, position) {
    var hpRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(cfg.heading || 0), Cesium.Math.toRadians(cfg.pitch ||
      0), Cesium.Math.toRadians(cfg.roll || 0));
    var fixedFrameTransform = Cesium.Transforms.eastNorthUpToFixedFrame;

    var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position || this._positions_draw, hpRoll,
      this.viewer.scene.globe.ellipsoid, fixedFrameTransform);
    // Cesium.Matrix4.multiplyByUniformScale(modelMatrix, Cesium.defaultValue(cfg.scale, 1), modelMatrix);
    return modelMatrix;
  }
  style2Entity(style, entity) {
    entity.modelMatrix = this.getModelMatrix(style, entity.position);
    return attr.style2Entity(style, entity);
  }
  //绑定鼠标事件

  bindEvent() {
    var _this3 = this;

    this.getHandler().setInputAction(function(event) {
      var point = (0, _point.getCurrentMousePosition)(_this3.viewer.scene, event.endPosition, _this3.entity);
      if (point) {
        _this3._positions_draw = point;
        _this3.entity.modelMatrix = _this3.getModelMatrix(_this3.entity.attribute.style);
      }
      _this3.tooltip.showAt(event.endPosition, _Tooltip.message.draw.point.start);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.getHandler().setInputAction(function(event) {
      var point = (0, _point.getCurrentMousePosition)(_this3.viewer.scene, event.position, _this3.entity);
      if (point) {
        _this3._positions_draw = point;
        _this3.disable();
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  //图形绘制结束,更新属性

  finish() {
    this.entity.modelMatrix = this.getModelMatrix(this.entity.attribute.style);
    this.entity.show = true;
    this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象     
    this.entity.position = this.getDrawPosition();
  }
}
