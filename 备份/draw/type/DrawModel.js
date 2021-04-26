class DrawModel extends DrawPoint {
  //========== 构造方法 ==========
  constructor(opts) {
    super(opts)
    this.type = 'model';
    this.attrClass = attr; //对应的属性控制静态类
  }

  //根据attribute参数创建Entity
  createFeature(attribute, dataSource) {
    var _this2 = this;

    dataSource = dataSource || this.dataSource;
    this._positions_draw = null;

    //绘制时，是否自动隐藏模型，可避免拾取坐标存在问题。
    var _drawShow = Cesium.defaultValue(attribute.drawShow, false);

    var that = this;
    var addattr = {
      show: _drawShow,
      _drawShow: _drawShow, //edit编辑时使用
      position: new Cesium.CallbackProperty(function(time) {
        return that.getDrawPosition();
      }, false),
      model: attr.style2Entity(attribute.style),
      attribute: attribute
    };

    if (attribute.style && attribute.style.label) {
      //同时加文字
      addattr.label = (0, _Attr2.style2Entity)(attribute.style.label);
    }

    this.entity = dataSource.entities.add(addattr); //创建要素对象
    this.entity.loadOk = false;
    this.entity.readyPromise = function(entity, model) {
      entity.loadOk = true;
      _this2.fire(_MarsClass.eventType.load, {
        drawtype: _this2.type,
        entity: entity,
        model: model
      });
    };
    return this.entity;
  }
  style2Entity(style, entity) {
    this.updateOrientation(style, entity);
    if (style && style.label) {
      //同时加文字
      (0, _Attr2.style2Entity)(style.label, entity.label);
    }
    return attr.style2Entity(style, entity.model);
  }
  updateAttrForDrawing() {
    this.updateOrientation(this.entity.attribute.style, this.entity);
  }
  // 角度更新
  updateOrientation(style, entity) {
    var position = (0, _point.getPositionValue)(entity.position);
    if (position == null) return;

    var heading = Cesium.Math.toRadians(Number(style.heading || 0.0));
    var pitch = Cesium.Math.toRadians(Number(style.pitch || 0.0));
    var roll = Cesium.Math.toRadians(Number(style.roll || 0.0));

    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
  }
  //属性赋值到entity
  static style2Entity(style, entityattr) {
    style = style || {};

    if (entityattr == null) {
      //默认值
      entityattr = {};
    }

    //Style赋值值Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "silhouette": //跳过扩展其他属性的参数
        case "silhouetteColor":
        case "silhouetteAlpha":
        case "silhouetteSize":
        case "fill":
        case "color":
        case "opacity":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
          break;
        case "modelUrl":
          //模型uri
          entityattr.uri = value;
          break;

        case "clampToGround":
          //贴地
          if (value) entityattr.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
          else entityattr.heightReference = Cesium.HeightReference.NONE;
          break;
        case "heightReference":
          switch (value) {
            case "NONE":
              entityattr.heightReference = Cesium.HeightReference.NONE;
              break;
            case "CLAMP_TO_GROUND":
              entityattr.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
              break;
            case "RELATIVE_TO_GROUND":
              entityattr.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
              break;
            default:
              entityattr.heightReference = value;
              break;
          }
          break;

        case "distanceDisplayCondition":
          //是否按视距显示
          if (value) {
            if (value instanceof Cesium.DistanceDisplayCondition) {
              entityattr.distanceDisplayCondition = value;
            } else {
              entityattr.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(Number(Cesium.defaultValue(
                style.distanceDisplayCondition_near, 0)), Number(Cesium.defaultValue(style.distanceDisplayCondition_far,
                100000)));
            }
          } else {
            entityattr.distanceDisplayCondition = undefined;
          }
          break;

        case "hasShadows":
          //阴影
          if (value) entityattr.shadows = Cesium.ShadowMode.ENABLED; //对象投射并接收阴影。
          else entityattr.shadows = Cesium.ShadowMode.DISABLED; //该对象不会投射或接收阴影
          break;
      }
    }

    //轮廓
    if (style.silhouette) {
      entityattr.silhouetteColor = Cesium.Color.fromCssColorString(style.silhouetteColor || "#FFFFFF").withAlpha(
        Number(style.silhouetteAlpha || 1.0));
      entityattr.silhouetteSize = Number(style.silhouetteSize || 1.0);
    } else entityattr.silhouetteSize = 0.0;

    //透明度、颜色
    var opacity = Cesium.defaultValue(style.opacity, 1);
    if (style.fill) entityattr.color = Cesium.Color.fromCssColorString(style.color || "#FFFFFF").withAlpha(opacity);
    else entityattr.color = Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(opacity);

    return entityattr;
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
      geometry: {
        type: "Point",
        coordinates: coordinates[0]
      }
    };
  }
}
export default DrawModel
