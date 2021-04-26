class MeasureAngle extends MeasureBase {
  constructor(opts, target) {
    super(opts, target)
    this.totalLable = null; //角度label
    this.exLine = null; //辅助线
  }
  //清除未完成的数据
  clearLastNoEnd() {
    if (this.totalLable != null) this.dataSource.entities.remove(this.totalLable);
    this.totalLable = null;

    if (this.exLine != null) this.dataSource.entities.remove(this.exLine);
    this.exLine = null;
  }
  //开始绘制

  _startDraw(options) {
    var entityattr = (0, _Attr.style2Entity)(this.labelStyle, {
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
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
        "lineType": "arrow",
        "color": "#ebe967",
        "width": 9,
        "clampToGround": true,
        "depthFail": true,
        "depthFailColor": "#ebe967"
      }, options.style)
    });
  }
  //绘制增加一个点后，显示该分段的长度

  showAddPointLength(entity) {
    this.showMoveDrawing(entity); //兼容手机端
  }
  //绘制中删除了最后一个点

  showRemoveLastPointLength(e) {
    if (this.exLine) {
      this.dataSource.entities.remove(this.exLine);
      this.exLine = null;
    }
    if (this.totalLable) this.totalLable.label.show = false;
  }
  //绘制过程移动中，动态显示长度信息

  showMoveDrawing(entity) {
    var positions = this.drawControl.getPositions(entity);
    if (positions.length < 2) {
      this.totalLable.label.show = false;
      return;
    }

    //求长度
    var len = Cesium.Cartesian3.distance(positions[0], positions[1]);

    //求方位角
    var bearing = measureUtil.getAngle(positions[0], positions[1]);;

    //求参考点
    var new_position = (0, _matrix.getRotateCenterPoint)(positions[0], positions[1], -bearing);
    this.updateExLine([positions[0], new_position]); //参考线

    //显示文本
    this.totalLable.attribute.value = bearing;
    this.totalLable.attribute.valueLen = len;
    this.totalLable.showText = function(unit) {
      var lenstr = util.formatLength(this.attribute.valueLen, unit);
      this.label.text = "角度:" + this.attribute.value + "°\n距离:" + lenstr;
      return lenstr;
    };
    var lenstr = this.totalLable.showText(this.options.unit);

    this.totalLable.position = positions[1];
    this.totalLable.label.show = true;

    this.target.fire(_MarsClass.eventType.change, {
      mtype: this.type,
      value: bearing,
      label: lenstr,
      length: len
    });
  }
  updateExLine(positions) {
    if (this.exLine) {
      this.exLine._positions = positions;
    } else {
      var entityattr = (0, _Attr2.style2Entity)(this.options.styleEx, {
        positions: new Cesium.CallbackProperty(function(time) {
          return exLine._positions;
        }, false),
        width: 3,
        clampToGround: true,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.RED
        })
      });

      var exLine = this.dataSource.entities.add({
        polyline: entityattr
      });
      exLine._positions = positions;
      this.exLine = exLine;
    }
  }
  //绘制完成后

  showDrawEnd(entity) {
    entity._totalLable = this.totalLable;
    this.totalLable = null;

    entity._exLine = this.exLine;
    this.exLine = null;

    this.target.fire(_MarsClass.eventType.end, {
      mtype: this.type,
      entity: entity,
      value: entity._totalLable.attribute.value
    });
  }
  get type() {
    return "angle";
  }
}
export default MeasureAngle
