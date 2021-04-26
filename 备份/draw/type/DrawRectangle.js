class DrawRectangle extends DrawPolyline {
  //========== 构造方法 ========== 
  constructor(opts) {
    super(opts)
    this.type = 'rectangle';
    this.attrClass = attr; //对应的属性控制静态类 
    this.editClass = _Edit.EditRectangle; //获取编辑对象
    this._minPointNum = 2; //至少需要点的个数 
    this._maxPointNum = 2; //最多允许点的个数 
  }

  getRectangle() {
    var positions = this.getDrawPosition();
    if (positions.length < 2) return null;
    return Cesium.Rectangle.fromCartesianArray(positions);
  }
  //根据attribute参数创建Entity

  createFeature(attribute, dataSource) {
    dataSource = dataSource || this.dataSource;
    this._positions_draw = [];

    var that = this;
    var addattr = {
      rectangle: attr.style2Entity(attribute.style),
      attribute: attribute
    };
    addattr.rectangle.coordinates = new Cesium.CallbackProperty(function(time) {
      return that.getRectangle();
    }, false);

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
    this.entity._positions_draw = this._positions_draw;
    this.bindOutline(this.entity, lineStyle); //边线

    return this.entity;
  }
  style2Entity(style, entity) {
    return attr.style2Entity(style, entity.rectangle);
  }
  bindOutline(entity, lineStyle) {
    var attribute = entity.attribute;

    //本身的outline需要隐藏
    entity.rectangle.outline = new Cesium.CallbackProperty(function(time) {
      return attribute.style.outline && attribute.style.outlineWidth == 1;
    }, false);

    //是否显示：边线宽度大于1时
    entity.polyline.show = new Cesium.CallbackProperty(function(time) {
      return attribute.style.outline && attribute.style.outlineWidth > 1;
    }, false);
    entity.polyline.positions = new Cesium.CallbackProperty(function(time) {
      if (!entity.polyline.show.getValue(time)) return null;
      if (!entity._positions_draw) return null;

      return attr.getOutlinePositions(entity);
    }, false);
    entity.polyline.width = new Cesium.CallbackProperty(function(time) {
      return entity.rectangle.outlineWidth;
    }, false);
    //虚线等情况下不支持动态修改颜色,只有实线可以动态改颜色。
    if (!lineStyle.lineType || lineStyle.lineType == "solid") {
      entity.polyline.material = new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function(time) {
        return entity.rectangle.outlineColor.getValue(time);
      }, false));
    }
  }
  updateAttrForDrawing() {
    var style = this.entity.attribute.style;
    if (!style.clampToGround) {
      var maxHight = (0, _point.getMaxHeight)(this.getDrawPosition());
      if (maxHight != 0) {
        this.entity.rectangle.height = maxHight;
        style.height = maxHight;

        if (style.extrudedHeight && (0, _util.isNumber)(style.extrudedHeight)) this.entity.rectangle.extrudedHeight =
          maxHight + Number(style.extrudedHeight);
      }
    }
  }
  //图形绘制结束后调用

  finish() {
    var entity = this.entity;

    entity.editing = this.getEditClass(entity); //绑定编辑对象   

    entity._positions_draw = this._positions_draw;
    //entity.rectangle.coordinates = this.getRectangle(); 
    entity.rectangle.coordinates = new Cesium.CallbackProperty(function(time) {
      if (entity._positions_draw.length < 2) return null;
      return Cesium.Rectangle.fromCartesianArray(entity._positions_draw);
    }, false);
  }
  class AttrRectangle {
    //属性赋值到entity
    static style2Entity(style, entityattr) {
      style = style || {};
  
      if (entityattr == null) {
        //默认值
        entityattr = {};
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
            entityattr.outlineColor = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity ||
              style.opacity || 1.0);
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
          case "color":
            //填充颜色
            entityattr.material = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity ||
              1.0));
            break;
          case "image":
            //填充图片
            entityattr.material = new Cesium.ImageMaterialProperty({
              image: style.image,
              color: Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(Number(style.opacity || 1.0))
            });
            break;
          case "rotation":
            //旋转角度
            entityattr.rotation = Cesium.Math.toRadians(value);
            if (!style.stRotation) entityattr.stRotation = Cesium.Math.toRadians(value);
            break;
          case "stRotation":
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
      if (!entity.rectangle) return null;
  
      // if (entity._positions_draw && entity._positions_draw.length > 0)
      //     return entity._positions_draw;
  
      var time = (0, _util.currentTime)();
      var re = entity.rectangle.coordinates.getValue(time); //Rectangle
      var height = entity.rectangle.height ? entity.rectangle.height.getValue(time) : 0;
  
      var ptMin = Cesium.Cartesian3.fromRadians(re.west, re.south, height); //西、南
      var ptMax = Cesium.Cartesian3.fromRadians(re.east, re.north, height); //东、北
      return [ptMin, ptMax];
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
          type: "MultiPoint",
          coordinates: coordinates
        }
      };
    }
  
    //获取entity对应的 边界 的坐标
    static getOutlinePositions(entity, noAdd) {
      if (!entity.rectangle) return null;
  
      var time = (0, _util.currentTime)();
      var re = entity.rectangle.coordinates.getValue(time); //Rectangle
      if (!re) return null;
  
      var rotation = entity.rectangle.rotation.getValue(time) || 0; //Rectangle
      var height = entity.rectangle.height ? entity.rectangle.height.getValue(time) : 0;
  
      var arr = (0, _polygon.getRectangleOuterPositions)({
        rectangle: re,
        rotation: rotation,
        height: height
      });
  
      if (!noAdd) arr.push(arr[0]);
      return arr;
    }
  
    //获取entity对应的 边界 的坐标（geojson规范的格式）
    static getOutlineCoordinates(entity, noAdd) {
      var positions = getOutlinePositions(entity, noAdd);
      var coordinates = pointconvert.cartesians2lonlats(positions);
      return coordinates;
    }
  }
  export default AttrRectangle
}
export default DrawRectangle
