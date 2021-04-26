//贴地线
class MeasureLengthSurface extends MeasureLength {
  '_startDraw',

  //开始绘制
  value: function _startDraw(options) {
    options.style.clampToGround = true;

    return _get(MeasureLengthSurface.prototype.__proto__ || Object.getPrototypeOf(MeasureLengthSurface.prototype),
      '_startDraw', this).call(this, options);
  }

  //绘制完成后

  showDrawEnd(entity) {
    _get(MeasureLengthSurface.prototype.__proto__ || Object.getPrototypeOf(MeasureLengthSurface.prototype),
      'showDrawEnd', this).call(this, entity);
    this.updateLengthForTerrain(entity);
  }

  //计算贴地线

  updateLengthForTerrain(entity) {
    var that = this;
    var positions = entity.polyline.positions.getValue(viewer.clock.currentTime);
    var arrLables = entity.arrEntityEx;
    var totalLable = entity._totalLable;
    var unit = totalLable && totalLable.attribute && totalLable.attribute.unit;

    this.target.fire(_MarsClass.eventType.start, {
      mtype: this.type
    });

    //求贴地线长度
    measureUtil.getClampLength(positions, {
      scene: viewer.scene,
      splitNum: that.options.splitNum,
      has3dtiles: that.options.has3dtiles,
      disTerrainScale: that.disTerrainScale, //求高度失败，概略估算值
      //计算每个分段后的回调方法
      endItem: function endItem(result) {
        var index = result.index;
        var all_distance = result.all_distance;
        var distance = result.distance;

        index++;
        var thisLabel = arrLables[index];
        if (thisLabel) {
          thisLabel.attribute.value = all_distance;
          thisLabel.attribute.valueFD = distance;
          thisLabel.showText(unit);
        } else if (index == positions.length - 1 && totalLable) {
          //最后一个
          totalLable.attribute.value = all_distance;
          totalLable.attribute.valueFD = distance;
          totalLable.showText(unit);
        }
      },
      //计算全部完成的回调方法
      callback: function callback(all_distance) {
        var distancestr = util.formatLength(all_distance, unit);

        that.target.fire(_MarsClass.eventType.change, {
          mtype: that.type,
          value: all_distance,
          label: distancestr
        });
        that.target.fire(_MarsClass.eventType.end, {
          mtype: that.type,
          entity: entity,
          value: all_distance
        });
      }
    });
  }

  get type() {
    return "lengthSurface";
  }
}
export default MeasureLengthSurface
