class DrawPolyline extends DrawBase {
  //========== 构造方法 ========== 
  constructor(opts) {
    super(opts)
    this.type = 'polyline';
    this.attrClass = attr; //对应的属性控制静态类 
    this.editClass = _Edit.EditPolyline; //获取编辑对象
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
      polyline: attr.style2Entity(attribute.style),
      attribute: attribute
    };
    addattr.polyline.positions = new Cesium.CallbackProperty(function(time) {
      return that.getDrawPosition();
    }, false);

    this.entity = dataSource.entities.add(addattr); //创建要素对象
    this.entity._positions_draw = this._positions_draw;
    return this.entity;
  }
  //重新激活绘制

  reCreateFeature(entity) {
    if (!this._minPointNum_def) this._minPointNum_def = this._minPointNum;
    if (!this._maxPointNum_def) this._maxPointNum_def = this._maxPointNum;

    var attribute = entity.attribute;
    if (attribute.config) {
      //允许外部传入
      this._minPointNum = attribute.config.minPointNum || this._minPointNum_def;
      this._maxPointNum = attribute.config.maxPointNum || this._maxPointNum_def;
    } else {
      this._minPointNum = this._minPointNum_def;
      this._maxPointNum = this._maxPointNum_def;
    }

    this.entity = entity;
    this._positions_draw = entity._positions_draw || entity.polyline.positions.getValue(this.viewer.clock.currentTime);;
    return this.entity;
  }
  style2Entity(style, entity) {
    return attr.style2Entity(style, entity.polyline);
  }
  //绑定鼠标事件

  bindEvent() {
    var _this2 = this;

    var lastPointTemporary = false;
    this.getHandler().setInputAction(function(event) {
      //单击添加点
      var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.position, _this2.entity);
      if (!point && lastPointTemporary) {
        //如果未拾取到点，并且存在MOUSE_MOVE时，取最后一个move的点
        point = _this2._positions_draw[_this2._positions_draw.length - 1];
      }

      if (point) {
        if (lastPointTemporary) {
          _this2._positions_draw.pop();
        }
        lastPointTemporary = false;

        //消除双击带来的多余经纬度 
        if (_this2._positions_draw.length > 1) {
          var mpt1 = _this2._positions_draw[_this2._positions_draw.length - 1];
          if (Math.abs(mpt1.x - point.x) < 0.01 && Math.abs(mpt1.y - point.y) < 0.01 && Math.abs(mpt1.z - point.z) <
            0.01) _this2._positions_draw.pop();
        }

        //在绘制点基础自动增加高度
        if (_this2.entity.attribute && _this2.entity.attribute.config && _this2.entity.attribute.config.addHeight)
          point = (0, _point.addPositionsHeight)(point, _this2.entity.attribute.config.addHeight);

        _this2._positions_draw.push(point);
        _this2.updateAttrForDrawing();

        _this2.fire(_MarsClass.eventType.drawAddPoint, {
          drawtype: _this2.type,
          entity: _this2.entity,
          position: point,
          positions: _this2._positions_draw
        });

        if (_this2._positions_draw.length >= _this2._maxPointNum) {
          //点数满足最大数量，自动结束
          _this2.disable();
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.getHandler().setInputAction(function(event) {
      //右击删除上一个点
      _this2._positions_draw.pop(); //删除最后标的一个点

      var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.position, _this2.entity);
      if (point) {
        if (lastPointTemporary) {
          _this2._positions_draw.pop();
        }
        lastPointTemporary = true;

        _this2.fire(_MarsClass.eventType.drawRemovePoint, {
          drawtype: _this2.type,
          entity: _this2.entity,
          position: point,
          positions: _this2._positions_draw
        });

        _this2._positions_draw.push(point);
        _this2.updateAttrForDrawing();
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    this.getHandler().setInputAction(function(event) {
      //鼠标移动

      if (_this2._positions_draw.length <= 1) _this2.tooltip.showAt(event.endPosition, _Tooltip.message.draw.polyline
        .start);
      else if (_this2._positions_draw.length < _this2._minPointNum) //点数不满足最少数量
        _this2.tooltip.showAt(event.endPosition, _Tooltip.message.draw.polyline.cont);
      else if (_this2._positions_draw.length >= _this2._maxPointNum) //点数满足最大数量
        _this2.tooltip.showAt(event.endPosition, _Tooltip.message.draw.polyline.end2);
      else _this2.tooltip.showAt(event.endPosition, _Tooltip.message.draw.polyline.end);

      var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.endPosition, _this2.entity);
      if (point) {
        if (lastPointTemporary) {
          _this2._positions_draw.pop();
        }
        lastPointTemporary = true;

        _this2._positions_draw.push(point);
        _this2.updateAttrForDrawing();

        _this2.fire(_MarsClass.eventType.drawMouseMove, {
          drawtype: _this2.type,
          entity: _this2.entity,
          position: point,
          positions: _this2._positions_draw
        });
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.getHandler().setInputAction(function(event) {
      //双击结束标绘 
      //消除双击带来的多余经纬度 
      if (_this2._positions_draw.length > 1) {
        var mpt1 = _this2._positions_draw[_this2._positions_draw.length - 1];
        var mpt2 = _this2._positions_draw[_this2._positions_draw.length - 2];
        if (Math.abs(mpt1.x - mpt2.x) < 0.01 && Math.abs(mpt1.y - mpt2.y) < 0.01 && Math.abs(mpt1.z - mpt2.z) <
          0.01) _this2._positions_draw.pop();
      }

      _this2.endDraw();
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }
  //外部控制，完成绘制，比如手机端无法双击结束

  endDraw() {
    if (!this._enabled) {
      return this;
    }

    if (this._positions_draw.length < this._minPointNum) return; //点数不够
    this.updateAttrForDrawing();
    this.disable();
  }
  updateAttrForDrawing(isLoad) {}
  //图形绘制结束后调用

  finish() {
    var entity = this.entity;

    entity.editing = this.getEditClass(entity); //绑定编辑对象   

    entity._positions_draw = this.getDrawPosition();
    // entity.polyline.positions = new Cesium.CallbackProperty((time)=> {
    //     return entity._positions_draw;
    // }, false);

    //显示depthFailMaterial时，不能使用CallbackProperty属性，否则depthFailMaterial不显示
    if (Cesium.defined(entity.polyline.depthFailMaterial)) {
      entity.polyline.positions = entity._positions_draw;
    } else {
      entity.polyline.positions = new Cesium.CallbackProperty(function(time) {
        return entity._positions_draw;
      }, false);
    }
  }
  //属性赋值到entity
  static style2Entity(style, entityattr) {
    style = style || {};
  
    if (entityattr == null) {
      //默认值
      entityattr = {};
    }
  
    if (style.clampToGround) {
      entityattr.arcType = Cesium.ArcType.GEODESIC;
    }
  
    //Style赋值值Entity
    for (var key in style) {
      var value = style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "lineType": //跳过扩展其他属性的参数
        case "color":
        case "opacity":
        case "outline":
        case "outlineWidth":
        case "outlineColor":
        case "outlineOpacity":
        case "flowDuration":
        case "flowImage":
        case "dashLength":
        case "glowPower":
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
        case "depthFailColor":
        case "depthFailOpacity":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
          break;
        case "depthFail":
          if (value) {
            entityattr.depthFailMaterial = Cesium.Color.fromCssColorString(style.depthFailColor || "#FFFF00").withAlpha(
              Number(Cesium.defaultValue(style.depthFailOpacity, Cesium.defaultValue(style.opacity, 0.9))));
            if (style.opacity == 1.0) style.opacity = 0.9; //不透明时，竟然不显示depthFailMaterial？！
          } else {
            entityattr.depthFailMaterial = undefined;
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
      }
    }
  
    if (style.color || style.lineType) {
      var color;
      if (style.color) {
        color = Cesium.Color.fromCssColorString(style.color).withAlpha(Number(Cesium.defaultValue(style.opacity, 1.0)));
      } else if (style.randomColor) {
        color = Cesium.Color.fromRandom({
          minimumRed: Cesium.defaultValue(style.minimumRed, 0.0),
          maximumRed: Cesium.defaultValue(style.maximumRed, 0.75),
          minimumGreen: Cesium.defaultValue(style.minimumGreen, 0.0),
          maximumGreen: Cesium.defaultValue(style.maximumGreen, 0.75),
          minimumBlue: Cesium.defaultValue(style.minimumBlue, 0.0),
          maximumBlue: Cesium.defaultValue(style.maximumBlue, 0.75),
          alpha: Cesium.defaultValue(style.opacity, 1.0)
        });
      } else {
        color = Cesium.Color.fromCssColorString("#FFFF00").withAlpha(Number(Cesium.defaultValue(style.opacity, 1.0)));
      }
  
      switch (style.lineType) {
        default:
        case "solid":
          //实线
          if (style.outline) {
            //存在衬色时
            entityattr.material = new Cesium.PolylineOutlineMaterialProperty({
              color: color,
              outlineWidth: Number(style.outlineWidth || 1.0),
              outlineColor: Cesium.Color.fromCssColorString(style.outlineColor || "#FFFF00").withAlpha(Number(
                style.outlineOpacity || style.opacity || 1.0))
            });
          } else {
            entityattr.material = color;
          }
          break;
        case "dash":
          //虚线
          if (style.outline) {
            //存在衬色时
            entityattr.material = new Cesium.PolylineDashMaterialProperty({
              dashLength: style.dashLength || style.outlineWidth || 16.0,
              color: color,
              gapColor: Cesium.Color.fromCssColorString(style.outlineColor || "#FFFF00").withAlpha(Number(style.outlineOpacity ||
                style.opacity || 1.0))
            });
          } else {
            entityattr.material = new Cesium.PolylineDashMaterialProperty({
              dashLength: style.dashLength || 16.0,
              color: color
            });
          }
  
          break;
        case "glow":
          //发光线
          entityattr.material = new Cesium.PolylineGlowMaterialProperty({
            glowPower: style.glowPower || 0.1,
            color: color
          });
          break;
        case "arrow":
          //箭头线
          entityattr.material = new Cesium.PolylineArrowMaterialProperty(color);
          break;
        case "animation":
          //流动线
          var repeatX = Cesium.defaultValue(style.animationRepeatX, 1);
          var repeatY = Cesium.defaultValue(style.animationRepeatY, 1);
          entityattr.material = new _LineFlowMaterial.LineFlowMaterial({ //动画线材质
            color: color,
            duration: style.animationDuration || 2000, //时长，控制速度
            url: style.animationImage, //图片
            repeat: new Cesium.Cartesian2(repeatX, repeatY)
          });
          break;
      }
    }
  
    //材质优先
    if (style.material) entityattr.material = style.material;
  
    return entityattr;
  }
  
  //获取entity的坐标
  static getPositions(entity, isShowPositions) {
    if (!isShowPositions && entity._positions_draw && entity._positions_draw.length > 0) return entity._positions_draw; //曲线等情形时，取绑定的数据
  
    return entity.polyline.positions.getValue((0, _util.currentTime)());
  }
  
  //获取entity的坐标（geojson规范的格式）
  static getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = pointconvert.cartesians2lonlats(positions);
    return coordinates;
  }
  
  //entity转geojson
  static toGeoJSON(entity, coordinates) {
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
  
  //折线转曲线[基于bezierSpline算法]
  static line2curve(_positions_draw, closure) {
    var coordinates = _positions_draw.map(function(position) {
      return pointconvert.cartesian2lonlat(position);
    });
    if (closure) //闭合曲线
      coordinates.push(coordinates[0]);
    var defHeight = coordinates[coordinates.length - 1][2];
  
    var curved = (0, _turf.bezierSpline)({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates
      }
    });
    var _positions_show = pointconvert.lonlats2cartesians(curved.geometry.coordinates, defHeight);
    return _positions_show;
  }
  
  //折线转曲线[基于自己的算法]
  static line2curve2(_positions_draw, closure) {
    var points = pointconvert.cartesians2mercators(_positions_draw);
    if (closure) //闭合曲线
      points.push(points[0]);
  
    var pointsNew = _PlotUtil.plotUtil.getBezierPoints(points);
    var _positions_show = pointconvert.mercators2cartesians(pointsNew);
    return _positions_show;
  }
}
export default DrawPolyline
