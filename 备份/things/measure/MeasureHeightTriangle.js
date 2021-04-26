class MeasureHeightTriangle extends MeasureBase {
  constructor(opts, target) {
    super(opts, target)
    this.totalLable = null; //高度差label
    this.xLable = null; //水平距离label
    this.hLable = null; //水平距离label
  }


  //清除未完成的数据
  clearLastNoEnd() {
    if (this.totalLable != null) this.dataSource.entities.remove(this.totalLable);
    if (this.xLable != null) this.dataSource.entities.remove(this.xLable);
    if (this.hLable != null) this.dataSource.entities.remove(this.hLable);

    this.totalLable = null;
    this.xLable = null;
    this.hLable = null;
  }
  //开始绘制

  _startDraw(options) {

    var entityattr = (0, _Attr.style2Entity)(this.labelStyle, {
      horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
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

    var entityattr2 = (0, _Attr.style2Entity)(this.labelStyle, {
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      show: false
    });
    entityattr2.pixelOffset = new Cesium.Cartesian2(0, 0);
    this.xLable = this.dataSource.entities.add({
      label: entityattr2,
      _noMousePosition: true,
      attribute: {
        unit: options.unit,
        type: options.type
      }
    });

    this.hLable = this.dataSource.entities.add({
      label: entityattr2,
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
    var lonlats = this.drawControl.getPositions(entity);
    if (lonlats.length == 4) {
      var mouseEndPosition = lonlats[3].clone();
      lonlats.pop();
      lonlats.pop();
      lonlats.pop();
      lonlats.push(mouseEndPosition);
    }

    if (lonlats.length == 2) {
      var zCartesian = this.getZHeightPosition(lonlats[0], lonlats[1]);
      var hDistance = this.getHDistance(lonlats[0], lonlats[1]);
      if (hDistance > 3.0) {
        lonlats.push(zCartesian);
        lonlats.push(lonlats[0]);
      }
    }

    this.showSuperHeight(lonlats);
  }
  //绘制中删除了最后一个点

  showRemoveLastPointLength(e) {
    var lonlats = this.drawControl.getPositions(e.entity);
    if (lonlats.length == 2) {
      lonlats.pop();
      lonlats.pop();

      this.totalLable.label.show = false;
      this.hLable.label.show = false;
      this.xLable.label.show = false;
    }
  }
  //绘制过程移动中，动态显示长度信息

  showMoveDrawing(entity) {
    var lonlats = this.drawControl.getPositions(entity);
    if (lonlats.length == 4) {
      var mouseEndPosition = lonlats[3].clone();
      lonlats.pop();
      lonlats.pop();
      lonlats.pop();
      lonlats.push(mouseEndPosition);
    }

    if (lonlats.length == 2) {
      var zCartesian = this.getZHeightPosition(lonlats[0], lonlats[1]);
      var hDistance = this.getHDistance(lonlats[0], lonlats[1]);
      if (hDistance > 3.0) {
        lonlats.push(zCartesian);
        lonlats.push(lonlats[0]);
      }
    }
    this.showSuperHeight(lonlats);
  }
  //绘制完成后

  showDrawEnd(entity) {
    var lonlats = this.drawControl.getPositions(entity);
    if (lonlats.length == 3) {
      //有时候，快速双击会少一个点
      lonlats.push(lonlats[0]);
    }

    entity.arrEntityEx = [this.totalLable, this.hLable, this.xLable];

    this.target.fire(_MarsClass.eventType.end, {
      mtype: this.type,
      entity: entity,
      value: this.totalLable.attribute.value
    });

    this.totalLable = null;
    this.hLable = null;
    this.xLable = null;
  }

  /**
   * 超级 高程测量
   * 由4个点形成的三角形（首尾点相同），计算该三角形三条线段的长度
   * @param {Array} positions 4个点形成的点数组
   */

  showSuperHeight(positions) {
    var vLength; //垂直距离
    var hLength; //水平距离
    var lLength; //长度
    var height;
    if (positions.length == 4) {
      var midLPoint = Cesium.Cartesian3.midpoint(positions[0], positions[1], new Cesium.Cartesian3());
      var midXPoint, midHPoint;
      var cartographic0 = Cesium.Cartographic.fromCartesian(positions[0]);
      var cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
      var cartographic2 = Cesium.Cartographic.fromCartesian(positions[2]);
      var tempHeight = cartographic1.height - cartographic2.height;
      height = cartographic1.height - cartographic0.height;
      lLength = Cesium.Cartesian3.distance(positions[0], positions[1]);
      if (height > -1 && height < 1) {
        midHPoint = positions[1];
        this.updateSuperHeightLabel(this.totalLable, midHPoint, "高度差:", height);
        this.updateSuperHeightLabel(this.hLable, midLPoint, "", lLength);
      } else {
        if (tempHeight > -0.1 && tempHeight < 0.1) {
          midXPoint = Cesium.Cartesian3.midpoint(positions[2], positions[1], new Cesium.Cartesian3());
          midHPoint = Cesium.Cartesian3.midpoint(positions[2], positions[3], new Cesium.Cartesian3());
          hLength = Cesium.Cartesian3.distance(positions[1], positions[2]);
          vLength = Cesium.Cartesian3.distance(positions[3], positions[2]);
        } else {
          midHPoint = Cesium.Cartesian3.midpoint(positions[2], positions[1], new Cesium.Cartesian3());
          midXPoint = Cesium.Cartesian3.midpoint(positions[2], positions[3], new Cesium.Cartesian3());
          hLength = Cesium.Cartesian3.distance(positions[3], positions[2]);
          vLength = Cesium.Cartesian3.distance(positions[1], positions[2]);
        }
        this.updateSuperHeightLabel(this.totalLable, midHPoint, "高度差:", vLength);
        this.updateSuperHeightLabel(this.xLable, midXPoint, "", hLength);
        this.updateSuperHeightLabel(this.hLable, midLPoint, "", lLength);
      }
    } else if (positions.length == 2) {
      vLength = Cesium.Cartesian3.distance(positions[1], positions[0]);
      var midHPoint = Cesium.Cartesian3.midpoint(positions[0], positions[1], new Cesium.Cartesian3());
      if (this.xLable.label.show) {
        this.xLable.label.show = false;
        this.hLable.label.show = false;
      }
      this.updateSuperHeightLabel(this.totalLable, midHPoint, "高度差:", vLength);
    }

    var heightstr = util.formatLength(vLength, this.options.unit);

    this.target.fire(_MarsClass.eventType.change, {
      mtype: this.type,
      value: vLength, //垂直距离 高度差
      label: heightstr,
      length: lLength, //空间长度
      hLength: hLength //水平距离
    });
  }
  /**
   * 超级 高程测量 显示标签
   * @param {Cesium.Label} currentLabel 显示标签
   * @param {Cesium.Cartesian3} postion 坐标位置
   * @param {String} type 类型("高度差"，"水平距离"，"长度")
   * @param {Object} value 值
   */

  updateSuperHeightLabel(currentLabel, postion, type, value) {
    if (currentLabel == null) return;

    currentLabel.position = postion;
    currentLabel.label.show = true;

    //绑定值及text显示
    currentLabel.attribute.value = value;
    currentLabel.attribute.textEx = type;
    currentLabel.showText = function(unit) {
      var heightstr = util.formatLength(this.attribute.value, unit);
      this.label.text = this.attribute.textEx + heightstr;
      return heightstr;
    };
    currentLabel.showText(this.options.unit);
  }

  /**
   * 带有高度差的两点，判断其直角点
   */

  getZHeightPosition(cartesian1, cartesian2) {
    var carto1 = Cesium.Cartographic.fromCartesian(cartesian1);
    var lng1 = Number(Cesium.Math.toDegrees(carto1.longitude));
    var lat1 = Number(Cesium.Math.toDegrees(carto1.latitude));
    var height1 = Number(carto1.height.toFixed(2));

    var carto2 = Cesium.Cartographic.fromCartesian(cartesian2);
    var lng2 = Number(Cesium.Math.toDegrees(carto2.longitude));
    var lat2 = Number(Cesium.Math.toDegrees(carto2.latitude));
    var height2 = Number(carto2.height.toFixed(2));

    if (height1 > height2) return Cesium.Cartesian3.fromDegrees(lng2, lat2, height1);
    else return Cesium.Cartesian3.fromDegrees(lng1, lat1, height2);
  }

  /**
   * 带有高度差的两点，计算两点间的水平距离
   */

  getHDistance(cartesian1, cartesian2) {
    var zCartesian = this.getZHeightPosition(cartesian1, cartesian2);

    var carto1 = Cesium.Cartographic.fromCartesian(cartesian2);
    var cartoZ = Cesium.Cartographic.fromCartesian(zCartesian);

    var hDistance = Cesium.Cartesian3.distance(cartesian1, zCartesian);

    if (Math.abs(Number(cartoZ.height) - Number(carto1.height)) < 0.01) {
      hDistance = Cesium.Cartesian3.distance(cartesian2, zCartesian);
    }

    return hDistance;
  }

  get type() {
    return "heightTriangle";
  }
}
export default MeasureHeightTriangle
