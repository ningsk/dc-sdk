//贴地线
class MeasureAreaSurface extends MeasureArea {

  //开始绘制
  _startDraw(options) {
    options.style.clampToGround = true;

    return _get(MeasureAreaSurface.prototype.__proto__ || Object.getPrototypeOf(MeasureAreaSurface.prototype),
      '_startDraw', this).call(this, options);
  }
  //绘制完成后
  showDrawEnd(entity) {
    // super.showDrawEnd(entity);
    if (entity.polygon == null) return;

    entity._totalLable = this.totalLable;
    this.totalLable = null;

    this.updateAreaForTerrain(entity);
  }

  //计算贴地面

  updateAreaForTerrain(entity) {
    var _this2 = this;

    var that = this;

    //更新lable等
    var totalLable = entity._totalLable;
    var unit = totalLable && totalLable.attribute && totalLable.attribute.unit;
    var thisCenter = (0, _point.getPositionValue)(totalLable.position);

    var positions = this.drawControl.getPositions(entity);

    this.target.fire(_MarsClass.eventType.start, {
      mtype: this.type
    });

    //贴地总面积
    measureUtil.getClampArea(positions, {
      scene: viewer.scene,
      splitNum: this.options.splitNum,
      has3dtiles: this.options.has3dtiles,
      asyn: true, //异步求准确的
      callback: function callback(area, resultInter) {
        // if (that.options.onInterEnd)
        //     that.options.onInterEnd(resultInter);

        totalLable.position = (0, _point.setPositionsHeight)(thisCenter, resultInter.maxHeight); //更新lable高度

        totalLable.attribute.value = area;
        var areastr = totalLable.showText(unit);

        _this2.target.fire(_MarsClass.eventType.change, {
          mtype: _this2.type,
          value: area,
          label: areastr
        });
        _this2.target.fire(_MarsClass.eventType.end, _extends({}, resultInter, {
          mtype: _this2.type,
          entity: entity,
          value: area
        }));
      }
    });
  }

  get type() {
    return "areaSurface";
  }
}
export default MeasureAreaSurface
