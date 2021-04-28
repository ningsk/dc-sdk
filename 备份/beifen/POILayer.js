class POILayer extends CustomFeatureGridLayer {
  //========== 构造方法 ========== 
  constructor(viewer, options) {
    super(viewer, options)
    this._key_index = 0;
    this._keys = _this.options.key || ["ae29a37307840c7ae4a785ac905927e0", //2020-6-18
      "888a52a74c55ca47abe6c55ab3661d11", "0bc2903efcb3b67ebf1452d2f664a238", "0df8f6f984adc49fca5b7b1108664da2",
      "72f75689dff38a781055e68843474751"
    ]
  }
  //========== 对外属性 ========== 

  getKey() {
    var thisidx = this._key_index++ % this._keys.length;
    return this._keys[thisidx];
  }

  //获取网格内的数据，callback为回调方法，参数传数据数组 

  getDataForGrid(opts, callback) {
    var jwd1 = pointconvert.wgs2gcj([opts.rectangle.xmin, opts.rectangle.ymax]); //加偏
    var jwd2 = pointconvert.wgs2gcj([opts.rectangle.xmax, opts.rectangle.ymin]); //加偏
    var polygon = jwd1[0] + "," + jwd1[1] + "|" + jwd2[0] + "," + jwd2[1];

    var filter = this.options.filter || {};
    filter.output = "json";
    filter.key = this.getKey();
    filter.polygon = polygon;
    if (!filter.offset) filter.offset = 25;
    if (!filter.types) filter.types = "120000|130000|190000";

    //查询POI服务
    var that = this;
    _zepto.zepto.ajax({
      url: 'https://restapi.amap.com/v3/place/polygon',
      type: "get",
      dataType: "jsonp",
      timeout: 5000,
      data: filter,
      success: function success(data) {
        if (data.infocode !== "10000") {
          marslog.log("POI 请求失败(" + data.infocode + ")：" + data.info);
          return;
        }
        var arrdata = data.pois;
        callback(arrdata);
      },
      error: function error(data) {
        marslog.log("POI 请求出错(" + data.status + ")：" + data.statusText);
      }
    });
  }
  //根据数据创造entity

  createEntity(opts, attributes) {
    var inthtml = "<div>名称：" + attributes.name + "</div>" + "<div>地址：" + attributes.address + "</div>" + "<div>区域：" +
      attributes.pname + attributes.cityname + attributes.adname + "</div>" + "<div>类别：" + attributes.type + "</div>";

    var arrjwd = attributes.location.split(",");
    arrjwd = pointconvert.gcj2wgs(arrjwd); //纠偏
    var lnglat = this.viewer.mars.point2map({
      x: arrjwd[0],
      y: arrjwd[1]
    });

    var entityOptions = {
      name: attributes.name,
      position: Cesium.Cartesian3.fromDegrees(lnglat.x, lnglat.y, this.options.height || 3),
      popup: {
        html: inthtml,
        anchor: [0, -15]
      },
      properties: attributes
    };

    var symbol = this.options.symbol;
    if (symbol) {
      var styleOpt = symbol.styleOptions;
      if (symbol.styleField) {
        //存在多个symbol，按styleField进行分类
        var styleFieldVal = attr[symbol.styleField];
        var styleOptField = symbol.styleFieldOptions[styleFieldVal];
        if (styleOptField != null) {
          // styleOpt = clone(styleOpt);
          styleOpt = _extends({}, styleOpt, styleOptField);
        }
      }
      styleOpt = styleOpt || {};

      if (styleOpt.image) {
        entityOptions.billboard = (0, _Attr2.style2Entity)(styleOpt);
        entityOptions.billboard.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
      } else {
        entityOptions.point = (0, _Attr.style2Entity)(styleOpt);
      }

      //加上文字标签 
      if (styleOpt.label) {
        entityOptions.label = (0, _Attr3.style2Entity)(styleOpt.label);
        entityOptions.label.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
        entityOptions.label.text = attributes.name;
      }
    } else {
      //无配置时的默认值
      entityOptions.point = {
        color: Cesium.Color.fromCssColorString("#3388ff"),
        pixelSize: 10,
        outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 20000, 0.5)
      };
      entityOptions.label = {
        text: attributes.name,
        font: 'normal small-caps normal 16px 楷体',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: Cesium.Color.AZURE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -15), //偏移量   
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, //是地形上方的高度 
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 5000, 0.8),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 5000)
      };
    }

    var entity = this.dataSource.entities.add(entityOptions);
    return entity;
  }
}
export default POILayer
