class DrawEllipsoid extends DrawPolyline {
  //========== 构造方法 ==========
  constructor(opts) {
    super(opts)
    this.type = 'ellipsoid';
    this.attrClass = attr; //对应的属性控制静态类
    this.editClass = EditEllipsoid; //获取编辑对象
    this._minPointNum = 2; //至少需要点的个数
    this._maxPointNum = 3; //最多允许点的个数
  }
  getShowPosition(time) {
    if (this._positions_draw && this._positions_draw.length > 0) return this._positions_draw[0];
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
      ellipsoid: attr.style2Entity(attribute.style),
      attribute: attribute
    };

    this.entity = dataSource.entities.add(addattr); //创建要素对象
    return this.entity;
  }
  style2Entity(style, entity) {
    return attr.style2Entity(style, entity.ellipsoid);
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
    style.extentRadii = radius; //短半轴
    style.heightRadii = radius;

    //长半轴
    var semiMajorAxis;
    if (this._positions_draw.length == 3) {
      semiMajorAxis = this.formatNum(Cesium.Cartesian3.distance(this._positions_draw[0], this._positions_draw[2]), 2);
    } else {
      semiMajorAxis = radius;
    }
    style.widthRadii = semiMajorAxis;

    this.updateRadii(style);
  }


  updateRadii(style) {
    this.entity.ellipsoid.radii.setValue(new Cesium.Cartesian3(style.extentRadii, style.widthRadii, style.heightRadii));
  }

  addPositionsForRadius(position) {
    var style = this.entity.attribute.style;

    //获取圆（或椭圆）边线上的坐标点数组
    var outerPositions = (0, _polygon.getEllipseOuterPositions)({
      position: position,
      semiMajorAxis: Number(style.extentRadii), //长半轴
      semiMinorAxis: Number(style.widthRadii), //短半轴
      rotation: Cesium.Math.toRadians(Number(style.rotation || 0))
    });

    //长半轴上的坐标点
    this._positions_draw.push(outerPositions[0]);

    //短半轴上的坐标点
    this._positions_draw.push(outerPositions[1]);
  }
  //图形绘制结束后调用
  finish() {
    // this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象
    // this.entity._positions_draw = this._positions_draw;
    // this.entity.position = this.getShowPosition();

    var entity = this.entity;

    entity.editing = this.getEditClass(entity); //绑定编辑对象

    entity._positions_draw = this._positions_draw;
    entity.position = new Cesium.CallbackProperty(function(time) {
      if (entity._positions_draw && entity._positions_draw.length > 0) return entity._positions_draw[0];
      return null;
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
              case "widthRadii":
              case "heightRadii":
              case "distanceDisplayCondition_far":
              case "distanceDisplayCondition_near":
                  break;
              case "outlineColor":
                  //边框颜色
                  entityattr.outlineColor = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity || style.opacity || 1.0);
                  break;
              case "color":
                  //填充颜色
                  entityattr.material = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity || 1.0));
                  break;
              case "extentRadii":
                  //球体长宽高半径
                  var extentRadii = style.extentRadii || 100;
                  var widthRadii = style.widthRadii || 100;
                  var heightRadii = style.heightRadii || 100;
                  entityattr.radii = new Cesium.Cartesian3(extentRadii, widthRadii, heightRadii);
                  break;
  
              case "distanceDisplayCondition":
                  //是否按视距显示
                  if (value) {
                      if (value instanceof Cesium.DistanceDisplayCondition) {
                          entityattr.distanceDisplayCondition = value;
                      } else {
                          entityattr.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(Number(Cesium.defaultValue(style.distanceDisplayCondition_near, 0)), Number(Cesium.defaultValue(style.distanceDisplayCondition_far, 100000)));
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
  //椭球体
  function getPositions(entity) {
      return [(0, _point.getPositionValue)(entity.position)];
  }
  
  //获取entity的坐标（geojson规范的格式）
  function getCoordinates(entity) {
      var positions = getPositions(entity);
      var coordinates = pointconvert.cartesians2lonlats(positions);
      return coordinates;
  }
  
  //entity转geojson
  function toGeoJSON(entity) {
      var coordinates = getCoordinates(entity);
      return {
          type: "Feature",
          properties: entity.attribute || {},
          geometry: { type: "Point", coordinates: coordinates[0] }
      };
  }
}
export default DrawEllipsoid