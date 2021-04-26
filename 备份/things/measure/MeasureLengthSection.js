class MeasureLengthSection extends MeasureLength {

  //开始绘制
  _startDraw(options) {
    options.style.clampToGround = true;
    options.splitNum = Cesium.defaultValue(options.splitNum, 200);

    return _get(MeasureLengthSection.prototype.__proto__ || Object.getPrototypeOf(MeasureLengthSection.prototype),
      '_startDraw', this).call(this, options);
  }

  //绘制完成后

  showDrawEnd(entity) {
    _get(MeasureLengthSection.prototype.__proto__ || Object.getPrototypeOf(MeasureLengthSection.prototype),
      'showDrawEnd', this).call(this, entity);
    this.updateSectionForTerrain(entity);
  }

  //计算剖面

  updateSectionForTerrain(entity) {
    var _this2 = this;

    var positions = entity.polyline.positions.getValue(viewer.clock.currentTime);
    if (positions.length < 2) return;

    var arrLables = entity.arrEntityEx;
    var totalLable = entity._totalLable;
    var unit = totalLable && totalLable.attribute && totalLable.attribute.unit;

    this.target.fire(_MarsClass.eventType.start, {
      mtype: this.type
    });

    var all_distance = 0;
    var arrLen = [];
    var arrHB = [];
    var arrLX = [];
    var arrPoint = [];
    // var positionsNew = [];

    var that = this;
    (0, _polyline.computeStepSurfaceLine)({
      viewer: viewer,
      positions: positions,
      splitNum: that.options.splitNum,
      has3dtiles: that.options.has3dtiles,
      //计算每个分段后的回调方法
      endItem: function endItem(raisedPositions, noHeight, index) {
        var h1 = Cesium.Cartographic.fromCartesian(positions[index]).height;
        var h2 = Cesium.Cartographic.fromCartesian(positions[index + 1]).height;
        var hstep = (h2 - h1) / raisedPositions.length;

        var this_distance = 0;
        for (var i = 0; i < raisedPositions.length; i++) {
          //长度
          if (i != 0) {
            var templen = Cesium.Cartesian3.distance(raisedPositions[i], raisedPositions[i - 1]);
            all_distance += templen;
            this_distance += templen;
          }
          arrLen.push(Number(all_distance.toFixed(1)));

          //海拔高度
          var point = (0, _point.formatPosition)(raisedPositions[i]);
          arrHB.push(point.z);
          arrPoint.push(point);

          //路线高度
          var fxgd = Number((h1 + hstep * i).toFixed(1));
          arrLX.push(fxgd);
        }

        index++;
        var thisLabel = arrLables[index];
        if (thisLabel) {
          thisLabel.attribute.value = all_distance;
          thisLabel.attribute.valueFD = this_distance;
          thisLabel.showText(unit);
        } else if (index == positions.length - 1 && totalLable) {
          //最后一个 
          totalLable.attribute.value = all_distance;
          totalLable.attribute.valueFD = this_distance;
          totalLable.showText(unit);
        }
      },
      //计算全部完成的回调方法
      end: function end() {
        var distancestr = util.formatLength(all_distance, unit);

        _this2.target.fire(_MarsClass.eventType.end, {
          mtype: _this2.type,
          entity: entity,

          distancestr: distancestr,
          distance: all_distance,
          arrLen: arrLen,
          arrLX: arrLX,
          arrHB: arrHB,
          arrPoint: arrPoint
        });
      }
    });
  }

  get type() {
    return "section";
  }
}
export default MeasureLengthSection
