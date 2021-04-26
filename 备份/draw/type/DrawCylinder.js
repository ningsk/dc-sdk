class DrawCylinder extends DrawPolyline {
  //========== 构造方法 ==========
  constructor(opts) {
    super(opts)
    this.type = 'cylinder';
    this.attrClass = attr; //对应的属性控制静态类
    this.editClass = EditCylinder; //获取编辑对象
    this._minPointNum = 2; //至少需要点的个数
    this._maxPointNum = 2; //最多允许点的个数
  }
  getShowPosition(time) {
    if (this._positions_draw && this._positions_draw.length > 1) return (0, _point.addPositionsHeight)(this._positions_draw[
      0], this.entity.cylinder.length.getValue(time) / 2);
    return null;
  }
  //根据attribute参数创建Entity
  createFeature(attribute, dataSource) {
    dataSource = dataSource || this.dataSource;
    this._positions_draw = [];

    var that = this;
    var addattr = {
      position: new Cesium.CallbackProperty(function(time) {
        return that.getShowPosition(time);
      }, false),
      cylinder: attr.style2Entity(attribute.style),
      attribute: attribute
    };

    this.entity = dataSource.entities.add(addattr); //创建要素对象
    return this.entity;
  }
  style2Entity(style, entity) {
    return attr.style2Entity(style, entity.cylinder);
  }
  updateAttrForDrawing(isLoad) {
    if (!this._positions_draw) return;

    if (isLoad) {
      if (this._positions_draw instanceof Cesium.Cartesian3) {
        this._positions_draw = [this._positions_draw];
      }
      this.addPositionsForRadius(this._positions_draw[0]);
      return;
    }

    if (this._positions_draw.length < 2) return;

    var style = this.entity.attribute.style;

    //半径处理
    var radius = this.formatNum(Cesium.Cartesian3.distance(this._positions_draw[0], this._positions_draw[1]), 2);
    this.entity.cylinder.bottomRadius = radius;

    style.topRadius = this.entity.cylinder.topRadius.getValue(this.viewer.clock.currentTime);
    style.bottomRadius = radius;
  }
  //图形绘制结束后调用
  finish() {
    var entity = this.entity;

    entity.editing = this.getEditClass(entity); //绑定编辑对象

    entity._positions_draw = this._positions_draw;
    //this.entity.position = this.getShowPosition();
    entity.position = new Cesium.CallbackProperty(function(time) {
      if (entity._positions_draw && entity._positions_draw.length > 0) return (0, _point.addPositionsHeight)(
        entity._positions_draw[0], entity.cylinder.length.getValue(time) / 2);
      return null;
    }, false);
  }
  //属性赋值到entity
  static style2Entity(style, entityattr) {
    style = style || {};
  
    if (entityattr == null) {
      //默认值
      entityattr = {
        fill: true,
        topRadius: 0
      };
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
        case "color":
        case "animation":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
          break;
        case "outlineColor":
          //边框颜色
          entityattr.outlineColor = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity ||
            style.opacity || 1.0);
          break;
        case "radius":
          //半径（圆）
          entityattr.topRadius = Number(value);
          entityattr.bottomRadius = Number(value);
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
    var positon = (0, _point.getPositionValue)(entity.position);
  
    if (entity._positions_draw && entity._positions_draw.length > 0) positon = entity._positions_draw[0];
  
    return [positon];
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
export default DrawCylinder
