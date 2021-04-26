class MeasureHeight extends MeasureBase {
  constructor(opts, target) {
    super(opts, target)
    this.totalLable = null; //高度label
    return _this;
  }


  //清除未完成的数据
  clearLastNoEnd() {
    if (this.totalLable != null) this.dataSource.entities.remove(this.totalLable);
    this.totalLable = null;
  }
  //开始绘制
  _startDraw(options) {
    var entityattr = (0, _Attr.style2Entity)(this.labelStyle, {
      horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      show: false
    });

    this.totalLable = this.dataSource.entities.add({
      label: entityattr,
      _noMousePosition: true,
      attribute: {
        unit: options.unit,
        type: options.type
      }
    });

    return this.drawControl.startDraw({
      type: "polyline",
      config: {
        maxPointNum: 2
      },
      style: _extends({
        "lineType": "glow",
        "color": "#ebe12c",
        "width": 9,
        "glowPower": 0.1,
        "depthFail": true,
        "depthFailColor": "#ebe12c"
      }, options.style)
    });
  }
  //绘制增加一个点后，显示该分段的长度

  showAddPointLength(entity) {
    this.showMoveDrawing(entity); //兼容手机端
  }
  //绘制中删除了最后一个点

  showRemoveLastPointLength(e) {
    if (this.totalLable) this.totalLable.label.show = false;
  }
  //绘制过程移动中，动态显示长度信息

  showMoveDrawing(entity) {
    var positions = this.drawControl.getPositions(entity);
    if (positions.length < 2) {
      this.totalLable.label.show = false;
      return;
    }

    var cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
    var cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
    var height = Math.abs(cartographic1.height - cartographic.height);

    //绑定值及text显示
    this.totalLable.attribute.value = height;
    this.totalLable.showText = function(unit) {
      var heightstr = util.formatLength(this.attribute.value, unit);
      this.label.text = "高度差:" + heightstr;
      return heightstr;
    };
    var heightstr = this.totalLable.showText(this.options.unit);

    //位置
    this.totalLable.position = Cesium.Cartesian3.midpoint(positions[0], positions[1], new Cesium.Cartesian3());
    this.totalLable.label.show = true;

    this.target.fire(_MarsClass.eventType.change, {
      mtype: this.type,
      value: height,
      label: heightstr
    });
  }
  //绘制完成后

  showDrawEnd(entity) {
    entity._totalLable = this.totalLable;
    this.totalLable = null;

    this.target.fire(_MarsClass.eventType.end, {
      mtype: this.type,
      entity: entity,
      value: entity._totalLable.attribute.value
    });
  }

  get type() {
    return "height";
  }
}
export default MeasureHeight
