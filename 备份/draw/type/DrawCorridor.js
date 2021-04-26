class DrawCorridor extends DrawPolyline {
  _inherits(DrawCorridor, _DrawPolyline);

  //========== 构造方法 ========== 
  constructor(opts) {
    super(opts)
    this.type = 'corridor';
    this.attrClass = attr; //对应的属性控制静态类 
    this.editClass = _Edit.EditCorridor; //获取编辑对象
    this._minPointNum = 2; //至少需要点的个数 
    this._maxPointNum = 9999; //最多允许点的个数 
  }

  //根据attribute参数创建Entity
  createFeature(attribute, dataSource) {
    dataSource = dataSource || this.dataSource;
    this._positions_draw = [];

    if (!this._minPointNum_def) this._minPointNum_def = this._minPointNum;
    if (!this._maxPointNum_def) this._maxPointNum_def = this._maxPointNum;

    if (attribute.config) {
      //允许外部传入
      this._minPointNum = attribute.config.minPointNum || this._minPointNum_def;
      this._maxPointNum = attribute.config.maxPointNum || this._maxPointNum_def;
    } else {
      this._minPointNum = this._minPointNum_def;
      this._maxPointNum = this._maxPointNum_def;
    }

    var that = this;
    var addattr = {
      corridor: attr.style2Entity(attribute.style),
      attribute: attribute
    };
    addattr.corridor.positions = new Cesium.CallbackProperty(function(time) {
      return that.getDrawPosition();
    }, false);

    this.entity = dataSource.entities.add(addattr); //创建要素对象
    this.entity._positions_draw = this._positions_draw;

    return this.entity;
  }
  style2Entity(style, entity) {
    return attr.style2Entity(style, entity.corridor);
  }
  updateAttrForDrawing() {
    var style = this.entity.attribute.style;
    if (!style.clampToGround) {
      var maxHight = (0, _point.getMaxHeight)(this.getDrawPosition());
      if (maxHight != 0) {
        this.entity.corridor.height = maxHight;
        style.height = maxHight;

        if (style.extrudedHeight && (0, _util.isNumber)(style.extrudedHeight)) this.entity.corridor.extrudedHeight =
          maxHight + Number(style.extrudedHeight);
      }
    }
  }
  //图形绘制结束后调用
  finish() {
    var entity = this.entity;

    entity.editing = this.getEditClass(entity); //绑定编辑对象   

    entity._positions_draw = this.getDrawPosition();
    entity.corridor.positions = new Cesium.CallbackProperty(function(time) {
      return entity._positions_draw;
    }, false);
  }
  //属性赋值到entity
  static style2Entity(style, entityattr) {
    style = style || {};
  
    if (entityattr == null) {
      //默认值
      entityattr = {
        fill: true
      };
    }
  
    //贴地时，剔除高度相关属性
    if (style.clampToGround) {
      if (style.hasOwnProperty('height')) delete style.height;
      if (style.hasOwnProperty('extrudedHeight')) delete style.extrudedHeight;
    }
  
    //Style赋值值Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
          break;
        case "outlineColor":
          //边框颜色
          entityattr.outlineColor = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity ||
            style.opacity || 1.0);
          break;
        case "color":
          //填充颜色
          entityattr.material = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity ||
            1.0));
          break;
        case "cornerType":
          switch (value) {
            case "BEVELED":
              entityattr.cornerType = Cesium.CornerType.BEVELED;
              break;
            case "MITERED":
              entityattr.cornerType = Cesium.CornerType.MITERED;
              break;
            case "ROUNDED":
              entityattr.cornerType = Cesium.CornerType.ROUNDED;
              break;
            default:
              entityattr.cornerType = value;
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
                100000)) + 6378137);
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
  
    //设置填充材质
    globe.setFillMaterial(entityattr, style);
  
    return entityattr;
  }
  
  //获取entity的坐标
  static getPositions(entity) {
    return entity.corridor.positions.getValue((0, _util.currentTime)());
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
        type: "LineString",
        coordinates: coordinates
      }
    };
  }
}
export default DrawCorridor