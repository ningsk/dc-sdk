//坡度坡向 类
class Slope extends BaseClass {
  constructor(options, oldparam) {
    super()
    this.options = options;
    this.viewer = options.viewer;
    //箭头的显示长度（米）
    this.options.arrow = _this.options.arrow || {};
    this.options.arrow.show = Cesium.defaultValue(_this.options.arrow.show, true);
    this.options.arrow.scale = Cesium.defaultValue(_this.options.arrow.scale, 0.3); //箭头长度的比例
    this.options.arrow.width = Cesium.defaultValue(_this.options.arrow.width, 15); //箭头宽度
    this.options.arrow.color = Cesium.defaultValue(_this.options.arrow.color, Cesium.Color.YELLOW);
    this.arrowLength = Cesium.defaultValue(_this.options.arrow.length, 40);

    //point点
    this.options.point = _this.options.point || {};
    this.options.point.show = Cesium.defaultValue(_this.options.point.show, true);
    this.options.point.pixelSize = Cesium.defaultValue(_this.options.point.pixelSize, 9);
    this.options.point.color = Cesium.defaultValue(_this.options.point.color, Cesium.Color.RED.withAlpha(0.5));

    this.arrowPrimitives = [];
    this.pointInterPrimitives = new Cesium.PointPrimitiveCollection();
    this.viewer.scene.primitives.add(_this.pointInterPrimitives);

    if (options.positions && options.positions.length > 0) {
      this.add(options.positions, options);
    }
    return _this;
  }

  // 计算  传入Cartesian3 数组 ，贴地坐标


  add(arr, options) {
    if (!arr || arr.length < 1) return;

    options = options || this.options;

    var splitNum = Cesium.defaultValue(options.splitNum, 8);
    if (arr.length > 2 && splitNum > 1) {
      //传入面边界时
      var resultInter = (0, _polygon.interPolygon)({
        scene: this.viewer.scene,
        positions: arr,
        has3dtiles: false,
        onlyPoint: true, //true时只返回点，不返回三角网
        splitNum: Cesium.defaultValue(options.splitNum, 8) //splitNum插值分割的个数
      });
      this.arrowLength = Cesium.Math.chordLength(resultInter.granularity, this.viewer.scene.globe.ellipsoid.maximumRadius) *
        this.options.arrow.scale;

      arr = [];
      for (var k = 0; k < resultInter.list.length; k++) {
        arr.push(resultInter.list[k].pointDM);
      }
    }

    this.stateAll = arr.length;
    this.stateOkIndex = 0;
    this.instances = [];
    this.arrData = [];

    for (var i = 0; i < this.stateAll; i++) {
      this._fxOnePoint(arr[i], options);
    }
  }

  //分析单个点的对应坡度

  _fxOnePoint(position, options) {
    if (!position) return;

    //返回该点的周边2米圆上的8个点
    var arcPoint = (0, _polygon.getEllipseOuterPositions)({
      position: position,
      radius: Cesium.defaultValue(options.radius, 2), //半径
      count: Cesium.defaultValue(options.count, 4) //共返回8(count*4)个点
    });
    arcPoint.push(position);

    var ellipsoid = this.viewer.scene.globe.ellipsoid;

    // 求出点的详细高度
    var that = this;
    (0, _polyline.computeSurfacePoints)({
      scene: this.viewer.scene,
      positions: arcPoint,
      has3dtiles: options.has3dtiles,
      callback: function callback(raisedPositions, noHeight) {
        if (noHeight) {
          marslog.log("未获取到高度值，贴地高度计算存在误差");
        }

        var cartographicArray = ellipsoid.cartesianArrayToCartographicArray(raisedPositions);

        // 中心点
        var center = cartographicArray.pop();

        // 其余圆上点
        var maxIndex = 0;
        var maxHeight = cartographicArray[0].height;
        var minIndex = 0;
        var minHeight = cartographicArray[0].height;
        for (var i = 1; i < cartographicArray.length - 1; i++) {
          var item = cartographicArray[i];
          if (item.height > maxHeight) {
            maxHeight = item.height;
            maxIndex = i;
          }
          if (item.height < minHeight) {
            minHeight = item.height;
            minIndex = i;
          }
        }

        var maxPoint = cartographicArray[maxIndex]; //周边最高点
        var minPoint = cartographicArray[minIndex]; //周边最低点

        var slopeVal1 = that.getSlope(center, maxPoint);
        var slopeVal2 = that.getSlope(center, minPoint);

        if (slopeVal1 > slopeVal2) {
          that._fxOnePointOk(position, center, maxPoint, slopeVal1);
        } else {
          that._fxOnePointOk(position, center, minPoint, slopeVal2);
        }
      }
    });
  }

  //分析单个点的对应坡度完成后添加显示的箭头等

  _fxOnePointOk(position, center, maxPoint, slopeVal) {
    var _this2 = this;

    var centerCar = Cesium.Cartographic.toCartesian(center);
    var maxPointCar = Cesium.Cartographic.toCartesian(maxPoint);
    maxPointCar = (0, _matrix.getOnLinePointByLen)(centerCar, maxPointCar, this.arrowLength);

    // 计算圆上的最高点和中心点的高度 判断箭头方向
    var arrArrowPt;
    if (center.height > maxPoint.height) {
      //中心点高于四周情况下
      arrArrowPt = [centerCar, maxPointCar];
    } else {
      //边缘指向中心
      arrArrowPt = [maxPointCar, centerCar];
    }

    //求方位角
    var slopeAngle = (0, _util.getAngle)(arrArrowPt[0], arrArrowPt[1]);

    var slopeValDou = Math.atan(slopeVal) * 180 / Math.PI;
    slopeValDou = Number(slopeValDou.toFixed(2));

    // 度数法 【 α(坡度)=arc tan (高程差/水平距离)】 eg: 45°
    var text1 = slopeValDou + "°";
    // 百分比法 【 坡度 = (高程差/水平距离)x100%】 eg:30%
    var text2 = (slopeVal * 100).toFixed(2) + "%";

    var itemData = {
      position: position, //坐标位置
      slope: slopeValDou, //度数法值【 α(坡度)=arc tan (高程差/水平距离)】
      slopeStr1: text1, //度数法值字符串
      slopeStr2: text2, //百分比法值字符串【 坡度 = (高程差/水平距离)x100%】
      direction: slopeAngle //坡向值（0-360度）
    };
    this.arrData.push(itemData);

    this.fire(_MarsClass2.eventType.endItem, {
      data: itemData,
      index: this.stateOkIndex
    });

    // 构建箭头
    if (this.options.arrow.show) {
      var gs = new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineGeometry(_extends({
          positions: arrArrowPt
        }, this.options.arrow)),
        vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
        id: "polylinedashinstance"
      });
      this.instances.push(gs);
    }

    // 添加点 显示坡度
    if (this.options.point.show) {
      var primitive = this.pointInterPrimitives.add(_extends({
        position: centerCar
      }, this.options.point));

      primitive.properties = itemData;
      primitive.click = function(event, position) {
        _this2.fire(_MarsClass2.eventType.click, {
          data: event.properties,
          position: position
        });
        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        if (_this2.options.click) _this2.options.click(event, position);
      };
      primitive.tooltip = Cesium.defaultValue(this.options.tooltip, '\u5761\u5EA6: ' + text1 + '  (' + text2 +
        ')<br />\u5761\u5411: ' + slopeAngle + '\xB0'); // 显示结果
      primitive.popup = this.options.popup;
    }

    // 全部计算完成
    this.stateOkIndex++;
    if (this.stateOkIndex >= this.stateAll) {
      if (this.options.arrow.show && this.instances.length > 0) {
        var arrowPrimitive = this.viewer.scene.primitives.add(new Cesium.Primitive({
          geometryInstances: this.instances,
          appearance: new Cesium.PolylineMaterialAppearance({
            material: Cesium.Material.fromType('PolylineArrow', {
              color: this.options.arrow.color
            })
          })
        }));
        this.arrowPrimitives.push(arrowPrimitive);
        this.instances = [];
      }

      this.fire(_MarsClass2.eventType.end, {
        data: this.arrData
      });
    }
  }

  // 两点之间的坡度

  getSlope(c1, c2) {
    if (!c1 || !c2) return;
    var differH = Math.abs(c1.height - c2.height); //高度差
    var differV = Cesium.Cartesian3.distance(Cesium.Cartographic.toCartesian(c1), Cesium.Cartesian3.fromRadians(c2.longitude,
      c2.latitude, c1.height)); // 水平距离
    var value = differH / differV;
    return value;
  }

  // 清除

  clear() {
    if (this.pointInterPrimitives) this.pointInterPrimitives.removeAll();

    for (var i = 0, len = this.arrowPrimitives.length; i < len; i++) {
      this.viewer.scene.primitives.remove(this.arrowPrimitives[i]);
    }
    this.arrowPrimitives = [];
    this.instances = [];
    this.arrData = [];
    this.stateAll = 0;
    this.stateOkIndex = 0;
  }

  //销毁

  destroy() {
    this.clear();
  }
}
export default Slope
