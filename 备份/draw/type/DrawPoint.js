class DrawPoint extends DrawBase {
  constructor(opts) {
    super(opts)
    this.type = 'point'
    this.attrClass = attr //对应的属性控制静态类
    this.editClass = EditPoint; //获取编辑对象
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
      point: attr.style2Entity(attribute.style),
      attribute: attribute
    };

    if (attribute.style && attribute.style.label) {
      //同时加文字
      addattr.label = (0, _Attr2.style2Entity)(attribute.style.label);
    }

    this.entity = dataSource.entities.add(addattr); //创建要素对象
    //子类使用
    if (this.createFeatureEx) this.createFeatureEx(attribute.style, this.entity);
    return this.entity;
  }
  //重新激活绘制
  reCreateFeature(entity) {
    this.entity = entity;
    this._positions_draw = entity.position;
    return this.entity;
  }
  style2Entity(style, entity) {
    if (style && style.label) {
      //同时加文字
      (0, _Attr2.style2Entity)(style.label, entity.label);
    }
    if (entity.featureEx) {
      entity.featureEx.updateStyle(style);
    }
    return attr.style2Entity(style, entity.point);
  }
  //绑定鼠标事件

  bindEvent() {
    var _this2 = this;

    this.getHandler().setInputAction(function(event) {
      var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.endPosition, _this2.entity);
      if (point) {
        _this2._positions_draw = point;
        if (_this2.entity.featureEx) {
          _this2.entity.featureEx.position = point;
        }
      }
      _this2.tooltip.showAt(event.endPosition, _this2.entity.draw_tooltip || _Tooltip.message.draw.point.start);

      _this2.fire(_MarsClass.eventType.drawMouseMove, {
        drawtype: _this2.type,
        entity: _this2.entity,
        position: point
      });
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.getHandler().setInputAction(function(event) {
      var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.position, _this2.entity);
      if (point) {
        _this2._positions_draw = point;
      }

      if (_this2._positions_draw) _this2.disable();
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  //获取外部entity的坐标到_positions_draw

  setDrawPositionByEntity(entity) {
    var positions = this.getPositions(entity);
    this._positions_draw = positions[0];
  }
  //图形绘制结束,更新属性

  finish() {
    this.entity.show = true;

    this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象
    this.entity.position = this.getDrawPosition();
    if (this.entity.featureEx) {
      this.entity.featureEx.position = this.getDrawPosition();
      this.entity.featureEx.finish();
    }
  }
  //属性赋值到entity
  static style2Entity(style = {}, entityGraphic = {}) {
      //Style赋值值Entity
      for (var key in style) {
          var value = style[key];
          switch (key) {
              default:
                  //直接赋值
                  entityGraphic[key] = value;
                  break;
              case "opacity": //跳过扩展其他属性的参数
              case "outlineOpacity":
              case "scaleByDistance_near":
              case "scaleByDistance_nearValue":
              case "scaleByDistance_far":
              case "scaleByDistance_farValue":
              case "distanceDisplayCondition_far":
              case "distanceDisplayCondition_near":
                  break;
              case "outlineColor":
                  //边框颜色
                  entityGraphic.outlineColor = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity || style.opacity || 1.0);
                  break;
              case "color":
                  //填充颜色
                  entityGraphic.color = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity || 1.0));
                  break;
  
              case "pixelOffset":
                  //偏移量
                  if (Cesium.defined(value[0]) && Cesium.defined(value[1])) entityGraphic.pixelOffset = new Cesium.Cartesian2(value[0], value[1]);else entityGraphic.pixelOffset = value;
                  break;
              case "scaleByDistance":
                  //是否按视距缩放
                  if (value) {
                      entityGraphic.scaleByDistance = new Cesium.NearFarScalar(Number(style.scaleByDistance_near || 1000), Number(style.scaleByDistance_nearValue || 1.0), Number(style.scaleByDistance_far || 1000000), Number(style.scaleByDistance_farValue || 0.1));
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
  
              case "visibleDepth":
                  if (value) entityGraphic.disableDepthTestDistance = 0;else entityGraphic.disableDepthTestDistance = Number.POSITIVE_INFINITY; //一直显示，不被地形等遮挡
  
                  break;
          }
      }
  
      //无边框时，需设置宽度为0
      if (!style.outline) entityGraphic.outlineWidth = 0.0;
  
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
export default DrawPoint
