class DrawCircle extends DrawPolyline {
  //========== 构造方法 ==========
  constructor(opts) {
    super(opts)
    this.type = 'ellipse';
    this.attrClass = attr; //对应的属性控制静态类
    this.editClass = _Edit.EditCircle; //获取编辑对象
    this._minPointNum = 2; //至少需要点的个数
    this._maxPointNum = 2; //最多允许点的个数
  }
  getShowPosition(time) {
    if (this._positions_draw && this._positions_draw.length > 0) return this._positions_draw[0];
    return null;
  }
  //根据attribute参数创建Entity
  createFeature(attribute, dataSource) {
    dataSource = dataSource || this.dataSource;
    this._positions_draw = [];

    if (attribute.type == "ellipse") //椭圆
      this._maxPointNum = 3;
    else //圆
      this._maxPointNum = 2;

    var that = this;
    var addattr = {
      position: new Cesium.CallbackProperty(function(time) {
        return that.getShowPosition(time);
      }, false),
      ellipse: attr.style2Entity(attribute.style),
      attribute: attribute
    };

    //线：边线宽度大于1时用polyline
    var lineStyle = _extends({
      "color": attribute.style.outlineColor,
      "width": attribute.style.outlineWidth,
      "opacity": attribute.style.outlineOpacity
    }, attribute.style.outlineStyle || {});
    addattr.polyline = (0, _Attr2.style2Entity)(lineStyle, {
      clampToGround: attribute.style.clampToGround,
      arcType: Cesium.ArcType.RHUMB,
      outline: false,
      show: false
    });

    this.entity = dataSource.entities.add(addattr); //创建要素对象
    this.bindOutline(this.entity, lineStyle); //边线
    return this.entity;
  }
  style2Entity(style, entity) {
    return attr.style2Entity(style, entity.ellipse);
  }
  bindOutline(entity, lineStyle) {
    var attribute = entity.attribute;

    //本身的outline需要隐藏
    entity.ellipse.outline = new Cesium.CallbackProperty(function(time) {
      return attribute.style.outline && attribute.style.outlineWidth == 1;
    }, false);

    //是否显示：边线宽度大于1时
    entity.polyline.show = new Cesium.CallbackProperty(function(time) {
      return attribute.style.outline && attribute.style.outlineWidth > 1;
    }, false);
    entity.polyline.positions = new Cesium.CallbackProperty(function(time) {
      if (!entity.polyline.show.getValue(time)) return null;

      return attr.getOutlinePositions(entity);
    }, false);
    entity.polyline.width = new Cesium.CallbackProperty(function(time) {
      return entity.ellipse.outlineWidth;
    }, false);

    //虚线等情况下不支持动态修改颜色,只有实线可以动态改颜色。
    if (!lineStyle.lineType || lineStyle.lineType == "solid") {
      entity.polyline.material = new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function(time) {
        return entity.ellipse.outlineColor.getValue(time);
      }, false));
    }
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

    //高度处理
    if (!style.clampToGround) {
      var height = this.formatNum(Cesium.Cartographic.fromCartesian(this._positions_draw[0]).height, 2);
      this.entity.ellipse.height = height;
      style.height = height;

      if (style.extrudedHeight && (0, _util.isNumber)(style.extrudedHeight)) {
        var extrudedHeight = height + Number(style.extrudedHeight);
        this.entity.ellipse.extrudedHeight = extrudedHeight;
      }
    }

    //半径处理
    var radius = this.formatNum(Cesium.Cartesian3.distance(this._positions_draw[0], this._positions_draw[1]), 2);
    this.entity.ellipse.semiMinorAxis = radius; //短半轴

    if (this._maxPointNum == 3) {
      //长半轴
      var semiMajorAxis;
      if (this._positions_draw.length == 3) {
        semiMajorAxis = this.formatNum(Cesium.Cartesian3.distance(this._positions_draw[0], this._positions_draw[2]),
          2);
      } else {
        semiMajorAxis = radius;
      }
      this.entity.ellipse.semiMajorAxis = semiMajorAxis;

      style.semiMinorAxis = radius;
      style.semiMajorAxis = semiMajorAxis;
    } else {
      this.entity.ellipse.semiMajorAxis = radius;

      style.radius = radius;
    }
  }
  addPositionsForRadius(position) {
    var style = this.entity.attribute.style;

    //获取圆（或椭圆）边线上的坐标点数组
    var outerPositions = (0, _polygon.getEllipseOuterPositions)({
      position: position,
      semiMajorAxis: this.entity.ellipse.semiMajorAxis.getValue(this.viewer.clock.currentTime), //长半轴
      semiMinorAxis: this.entity.ellipse.semiMinorAxis.getValue(this.viewer.clock.currentTime), //短半轴
      rotation: Cesium.Math.toRadians(Number(style.rotation || 0))
    });

    //长半轴上的坐标点
    var majorPos = outerPositions[1];
    this._positions_draw.push(majorPos);

    if (this._maxPointNum == 3) {
      //椭圆
      //短半轴上的坐标点
      var minorPos = outerPositions[0];
      this._positions_draw.push(minorPos);
    }
  }
  //图形绘制结束后调用
  finish() {
    var entity = this.entity;

    entity.editing = this.getEditClass(entity); //绑定编辑对象

    entity._positions_draw = this._positions_draw;
    //this.entity.position = this.getShowPosition();
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
        case "color":
        case "animation":
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
          entityattr.outlineColor = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(Cesium.defaultValue(
            style.outlineOpacity, Cesium.defaultValue(style.opacity, 1.0)));
          break;
        case "rotation":
          //旋转角度
          entityattr.rotation = Cesium.Math.toRadians(value);
          if (!style.stRotation) entityattr.stRotation = Cesium.Math.toRadians(value);
          break;
        case "stRotation":
          entityattr.stRotation = Cesium.Math.toRadians(value);
          break;
        case "height":
          entityattr.height = value;
          if (style.extrudedHeight && (0, _util.isNumber)(style.extrudedHeight)) entityattr.extrudedHeight = Number(
            style.extrudedHeight) + Number(value);
          break;
        case "extrudedHeight":
          if ((0, _util.isNumber)(value)) {
            entityattr.extrudedHeight = Number(entityattr.height || style.height || 0) + Number(value);
          } else {
            entityattr.extrudedHeight = value;
          }
          break;
        case "radius":
          //半径（圆）
          entityattr.semiMinorAxis = Number(value);
          entityattr.semiMajorAxis = Number(value);
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
  
  //获取entity对应的 边界 的坐标
  static getOutlinePositions(entity, noAdd, count) {
    var time = (0, _util.currentTime)();
  
    //获取圆（或椭圆）边线上的坐标点数组
    var outerPositions = (0, _polygon.getEllipseOuterPositions)({
      position: (0, _point.getPositionValue)(entity.position),
      semiMajorAxis: entity.ellipse.semiMajorAxis && entity.ellipse.semiMajorAxis.getValue(time), //长半轴
      semiMinorAxis: entity.ellipse.semiMinorAxis && entity.ellipse.semiMinorAxis.getValue(time), //短半轴
      rotation: entity.ellipse.rotation && entity.ellipse.rotation.getValue(time),
      count: Cesium.defaultValue(count, 90) //共返回360个点
    });
  
    if (!noAdd && outerPositions) outerPositions.push(outerPositions[0]);
  
    return outerPositions;
  }
  
  //获取entity对应的 边界 的坐标（geojson规范的格式）
  static getOutlineCoordinates(entity, noAdd, count) {
    var positions = getOutlinePositions(entity, noAdd, count);
    var coordinates = pointconvert.cartesians2lonlats(positions);
    return coordinates;
  }
}
export default DrawCircle
