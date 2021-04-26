class MeasurePoint extends MeasureBase {
  //========== 构造方法 ==========
  constructor(opts, target) {
    super(opts, target)
    this.totalLable = null; //角度label
  }



  //清除未完成的数据
  clearLastNoEnd() {
    viewer.mars.popup.close();
  }
  //开始绘制

  _startDraw(options) {
    return this.drawControl.startDraw({
      type: "point",
      style: _extends({
        "visibleDepth": false
      }, options.style)
    });
  }
  //绘制完成后

  showDrawEnd(entity) {
    var position = this.drawControl.getPositions(entity)[0];

    var point = (0, _point.formatPosition)(position);
    var x2 = util.formatDegree(point.x);
    var y2 = util.formatDegree(point.y);

    var html =
      '<div class="mars-popup-titile">\u5750\u6807\u6D4B\u91CF</div>\n                    <div class="mars-popup-content">\n                        <div><label>\u7ECF\u5EA6</label>' +
      point.x + '&nbsp;&nbsp;' + x2 + '</div>\n                        <div><label>\u7EAC\u5EA6</label>' +
      point.y + '&nbsp;&nbsp;&nbsp;&nbsp;' + y2 +
      '</div>\n                        <div><label>\u6D77\u62D4</label>' + point.z +
      '\u7C73</div>\n                    </div>';

    entity.popup = {
      html: html,
      anchor: [0, -15]
    };
    viewer.mars.popup.show(entity);

    this.target.fire(_MarsClass.eventType.end, {
      mtype: this.type,
      entity: entity,
      position: position,
      point: point
    });
  }

  get type() {
    return "point";
  }
}
export default MeasurePoint
