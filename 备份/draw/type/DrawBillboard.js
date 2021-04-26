class DrawBillboard extends DrawPoint {
  //========== 构造方法 ==========
  constructor(opts) {
    super(opts)
    this.type = 'billboard';
    //对应的属性控制静态类
    this.attrClass = attr;
  }

  //根据attribute参数创建Entity
  createFeature(attribute, dataSource) {
    dataSource = dataSource || this.dataSource;

    this._positions_draw = null;

    //绘制时，是否自动隐藏entity，可避免拾取坐标存在问题。
    var _drawShow = Cesium.defaultValue(attribute.drawShow, false);

    var that = this;
    var addattr = {
      show: _drawShow,
      _drawShow: _drawShow, //edit编辑时使用
      position: new Cesium.CallbackProperty(function(time) {
        return that.getDrawPosition();
      }, false),
      billboard: attr.style2Entity(attribute.style),
      attribute: attribute
    };

    if (attribute.style && attribute.style.label) {
      //同时加文字
      addattr.label = (0, _Attr2.style2Entity)(attribute.style.label);
    }

    this.entity = dataSource.entities.add(addattr); //创建要素对象
    this.updateAttrForDrawing();
    return this.entity;
  }

  style2Entity(style, entity) {
    var _this2 = this;

    if (this.updateFeatureEx) {
      //setTimeout是为了优化效率
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }
      this.updateTimer = setTimeout(function() {
        delete _this2.updateTimer;
        _this2.updateFeatureEx(style, entity);
      }, 300);
    }

    if (style && style.label) {
      //同时加文字
      (0, _Attr2.style2Entity)(style.label, entity.label);
    }
    return attr.style2Entity(style, entity.billboard);
  }
  updateAttrForDrawing() {
    var _this3 = this;

    var entity = this.entity;

    if (this.updateFeatureEx) {
      //setTimeout是为了优化效率
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }
      this.updateTimer = setTimeout(function() {
        delete _this3.updateTimer;
        if (!entity) return;
        _this3.updateFeatureEx(entity.attribute.style, entity);
      }, 300);
    }
  }


  //图形绘制结束,更新属性
  finish() {
    if (this.updateFeatureEx && this.updateTimer) {
      clearTimeout(this.updateTimer);
      delete this.updateTimer;
      this.updateFeatureEx(this.entity.attribute.style, this.entity);
    }
    this.entity.show = true;

    this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象
    this.entity.position = this.getDrawPosition();
  }
  //属性赋值到entity
  static style2Entity(style, entityGraphic) {
      style = style || {};
  
      if (entityGraphic == null) {
          //默认值
          entityGraphic = {
              scale: 1,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM
          };
      }
  
      //Style赋值值Entity
      for (var key in style) {
          var value = style[key];
          switch (key) {
              default:
                  //直接赋值
                  entityGraphic[key] = value;
                  break;
              case "scaleByDistance_near": //跳过扩展其他属性的参数
              case "scaleByDistance_nearValue":
              case "scaleByDistance_far":
              case "scaleByDistance_farValue":
              case "distanceDisplayCondition_far":
              case "distanceDisplayCondition_near":
                  break;
              case "opacity":
                  //透明度
                  entityGraphic.color = Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(Cesium.defaultValue(value, 1.0));
                  break;
              case "rotation":
                  //旋转角度
                  entityGraphic.rotation = Cesium.Math.toRadians(value);
                  break;
              case "pixelOffset":
                  //偏移量
                  if (Cesium.defined(value[0]) && Cesium.defined(value[1])) entityGraphic.pixelOffset = new Cesium.Cartesian2(value[0], value[1]);else entityGraphic.pixelOffset = value;
                  break;
              case "scaleByDistance":
                  //是否按视距缩放
                  if (value) {
                      entityGraphic.scaleByDistance = new Cesium.NearFarScalar(Number(Cesium.defaultValue(style.scaleByDistance_near, 1000)), Number(Cesium.defaultValue(style.scaleByDistance_nearValue, 1.0)), Number(Cesium.defaultValue(style.scaleByDistance_far, 1000000)), Number(Cesium.defaultValue(style.scaleByDistance_farValue, 0.1)));
                  } else {
                      entityGraphic.scaleByDistance = undefined;
                  }
                  break;
              case "distanceDisplayCondition":
                  //是否按视距显示
                  if (value) {
                      if (value instanceof Cesium.DistanceDisplayCondition) {
                          entityGraphic.distanceDisplayCondition = value;
                      } else {
                          entityGraphic.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(Number(Cesium.defaultValue(style.distanceDisplayCondition_near, 0)), Number(Cesium.defaultValue(style.distanceDisplayCondition_far, 100000)));
                      }
                  } else {
                      entityGraphic.distanceDisplayCondition = undefined;
                  }
                  break;
              case "clampToGround":
                  //贴地
                  if (value) entityGraphic.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;else entityGraphic.heightReference = Cesium.HeightReference.NONE;
                  break;
              case "heightReference":
                  switch (value) {
                      case "NONE":
                          entityGraphic.heightReference = Cesium.HeightReference.NONE;
                          break;
                      case "CLAMP_TO_GROUND":
                          entityGraphic.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
                          break;
                      case "RELATIVE_TO_GROUND":
                          entityGraphic.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
                          break;
                      default:
                          entityGraphic.heightReference = value;
                          break;
                  }
                  break;
              case "horizontalOrigin":
                  switch (value) {
                      case "CENTER":
                          entityGraphic.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
                          break;
                      case "LEFT":
                          entityGraphic.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
                          break;
                      case "RIGHT":
                          entityGraphic.horizontalOrigin = Cesium.HorizontalOrigin.RIGHT;
                          break;
                      default:
                          entityGraphic.horizontalOrigin = value;
                          break;
                  }
                  break;
              case "verticalOrigin":
                  switch (value) {
                      case "CENTER":
                          entityGraphic.verticalOrigin = Cesium.VerticalOrigin.CENTER;
                          break;
                      case "TOP":
                          entityGraphic.verticalOrigin = Cesium.VerticalOrigin.TOP;
                          break;
                      case "BOTTOM":
                          entityGraphic.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                          break;
                      default:
                          entityGraphic.verticalOrigin = value;
                          break;
                  }
                  break;
              case "visibleDepth":
                  if (value) entityGraphic.disableDepthTestDistance = 0;else entityGraphic.disableDepthTestDistance = Number.POSITIVE_INFINITY; //一直显示，不被地形等遮挡
  
                  break;
          }
      }
  
      return entityGraphic;
  }
  
  //获取entity的坐标
  static getPositions(entity) {
      return [(0, _point.getPositionValue)(entity.position)];
  }
  
  //获取entity的坐标（geojson规范的格式）
  static getCoordinates(entity) {
      var positions = getPositions(entity);
      var coordinates = pointconvert.cartesians2lonlats(positions);
      return coordinates;
  }
  
  //entity转geojson
  static toGeoJSON(entity) {
      var coordinates = getCoordinates(entity);
      return {
          type: "Feature",
          properties: entity.attribute || {},
          geometry: { type: "Point", coordinates: coordinates[0] }
      };
  }
}
