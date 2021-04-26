class DrawPolygon extends DrawPolyline {
  //========== 构造方法 ========== 
  constructor(opts) {
    super(opts)
    this.type = 'polygon';
    this.attrClass = attr; //对应的属性控制静态类 
    this.editClass = _Edit.EditPolygon; //获取编辑对象
    this._minPointNum = 3; //至少需要点的个数 
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
      polygon: attr.style2Entity(attribute.style),
      attribute: attribute
    };

    addattr.polygon.hierarchy = new Cesium.CallbackProperty(function(time) {
      var positions = that.getDrawPosition();
      return new Cesium.PolygonHierarchy(positions);
    }, false);

    //线：边线宽度大于1时用polyline 
    var lineStyle = _extends({
      "color": attribute.style.outlineColor,
      "width": attribute.style.outlineWidth,
      "opacity": attribute.style.outlineOpacity
    }, attribute.style.outlineStyle || {});
    addattr.polyline = (0, _Attr2.style2Entity)(lineStyle, {
      clampToGround: attribute.style.clampToGround,
      // arcType: Cesium.ArcType.RHUMB,
      outline: false,
      show: false
    });

    this.entity = dataSource.entities.add(addattr); //创建要素对象

    this.bindOutline(this.entity, lineStyle); //边线


    return this.entity;
  }
  style2Entity(style, entity) {
    return attr.style2Entity(style, entity.polygon);
  }
  bindOutline(entity, lineStyle) {
    var attribute = entity.attribute;

    //本身的outline需要隐藏
    entity.polygon.outline = new Cesium.CallbackProperty(function(time) {
      return attribute.style.outline && attribute.style.outlineWidth == 1;
    }, false);

    //是否显示：绘制时前2点时 或 边线宽度大于1时
    entity.polyline.show = new Cesium.CallbackProperty(function(time) {
      var arr = attr.getPositions(entity, true);
      if (arr && arr.length < 3) return true;

      return attribute.style.outline && attribute.style.outlineWidth > 1;
    }, false);

    entity.polyline.positions = new Cesium.CallbackProperty(function(time) {
      if (!entity.polyline.show.getValue(time)) return null;

      var arr = attr.getPositions(entity, true);
      if (arr && arr.length < 3) return arr;

      return arr.concat([arr[0]]);
    }, false);
    entity.polyline.width = new Cesium.CallbackProperty(function(time) {
      var arr = attr.getPositions(entity, true);
      if (arr && arr.length < 3) return 2;

      return entity.polygon.outlineWidth;
    }, false);

    //虚线等情况下不支持动态修改颜色,只有实线可以动态改颜色。
    if (!lineStyle.lineType || lineStyle.lineType == "solid") {
      entity.polyline.material = new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function(time) {
        var arr = attr.getPositions(entity, true);
        if (arr && arr.length < 3) {
          if (entity.polygon.material.color) return entity.polygon.material.color.getValue(time);
          else return Cesium.Color.YELLOW;
        }
        return entity.polygon.outlineColor.getValue(time);
      }, false));
    }
  }
  updateAttrForDrawing() {

    var style = this.entity.attribute.style;
    if (style.extrudedHeight && (0, _util.isNumber)(style.extrudedHeight)) {
      //存在extrudedHeight高度设置时
      var maxHight = (0, _point.getMaxHeight)(this.getDrawPosition());
      this.entity.polygon.extrudedHeight = maxHight + Number(style.extrudedHeight);
    }
  }
  //图形绘制结束后调用

  finish() {
    var entity = this.entity;

    entity.editing = this.getEditClass(entity); //绑定编辑对象   

    entity._positions_draw = this.getDrawPosition();
    entity.polygon.hierarchy = new Cesium.CallbackProperty(function(time) {
      var positions = entity._positions_draw;
      return new Cesium.PolygonHierarchy(positions);
    }, false);
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
        case "color": //跳过扩展其他属性的参数
        case "opacity":
        case "outlineOpacity":
  
        case "grid_lineCount":
        case "grid_lineThickness":
        case "grid_cellAlpha":
        case "checkerboard_repeat":
        case "checkerboard_oddcolor":
        case "stripe_oddcolor":
        case "stripe_repeat":
        case "animationDuration":
        case "animationImage":
        case "animationRepeatX":
        case "animationRepeatY":
        case "animationAxisY":
        case "animationGradient":
        case "animationCount":
        case "randomColor":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
          break;
        case "outline":
          //边线
          if (entityattr[key] instanceof Cesium.CallbackProperty) {
            //回调时不覆盖
          } else {
            entityattr[key] = value;
          }
          break;
        case "outlineColor":
          //边框颜色
          entityattr.outlineColor = Cesium.Color.fromCssColorString(value || style.color || "#FFFF00").withAlpha(
            Cesium.defaultValue(style.outlineOpacity, Cesium.defaultValue(style.opacity, 1.0)));
          break;
        case "extrudedHeight":
          //高度
          if ((0, _util.isNumber)(value)) {
            var maxHight = 0;
            if (entityattr.hierarchy) {
              var positions = getPositions({
                polygon: entityattr
              });
              maxHight = (0, _point.getMaxHeight)(positions);
            }
            entityattr.extrudedHeight = Number(value) + maxHight;
          } else {
            entityattr.extrudedHeight = value;
          }
          break;
        case "clampToGround":
          //贴地
          entityattr.perPositionHeight = !value;
          break;
  
        case "hasShadows":
          //阴影
          if (value) entityattr.shadows = Cesium.ShadowMode.ENABLED; //对象投射并接收阴影。
          else entityattr.shadows = Cesium.ShadowMode.DISABLED; //该对象不会投射或接收阴影
          break;
        case "stRotation":
          //材质旋转角度
          entityattr.stRotation = Cesium.Math.toRadians(value);
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
      }
    }
  
    //设置填充材质
    globe.setFillMaterial(entityattr, style);
  
    return entityattr;
  }
  
  //获取entity的坐标
  static getPositions(entity, isShowPositions) {
    if (!isShowPositions && entity._positions_draw && entity._positions_draw.length > 0) return entity._positions_draw; //箭头标绘等情形时，取绑定的数据
  
    var arr = entity.polygon.hierarchy.getValue((0, _util.currentTime)());
    var positions = getHierarchyVal(arr);
    return positions;
  }
  
  static getHierarchyVal(arr) {
    if (arr && arr instanceof Cesium.PolygonHierarchy) {
      if (arr.holes.length > 0) {
        return getHierarchyVal(arr.holes[arr.holes.length - 1]); //PolygonHierarchy
      }
      return arr.positions;
    }
    return arr;
  }
  
  //获取entity的坐标（geojson规范的格式）
  static getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = pointconvert.cartesians2lonlats(positions);
    return coordinates;
  }
  
  //entity转geojson
  static toGeoJSON(entity, noAdd) {
    var coordinates = getCoordinates(entity);
  
    if (!noAdd && coordinates.length > 0) coordinates.push(coordinates[0]);
  
    return {
      type: "Feature",
      properties: entity.attribute || {},
      geometry: {
        type: "Polygon",
        coordinates: [coordinates]
      }
    };
  }
}
export default DrawPolygon