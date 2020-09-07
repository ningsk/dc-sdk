import DrawPolyline from "./DrawPolyline";
import Cesium from "cesium";
import { Circle } from "../attr";
import { EditCircle } from "../edit";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-19 08:33:15
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-07 10:08:09
 */
class DrawCircle extends DrawPolyline {
  constructor(opts) {
    super(opts);
    this.type = "ellipse";
    // 坐标位置相关
    this._minPointNum = 2; // 至少需要点的个数
    this._maxPointNum = 2; // 最多允许点的个数
  }

  getShowPosition() {
    if (this._positions_draw && this._positions_draw > 1) {
      return this._positions_draw[0];
    }
    return null;
  }

  // 根据attribute参数创建Entity
  createFeature(attribute) {
    this._positions_draw = [];
    if (attribute.type == "ellipse") {
      // 椭圆
      this._maxPointNum = 3;
    } else {
      // 圆
      this._maxPointNum = 2;
    }

    var that = this;
    var addAttr = {
      position: new Cesium.CallbackProperty((time) => {
        return that.getShowPosition();
      }, false),
      ellipse: Circle.style2Entity(attribute.style),
      attribute: attribute,
    };

    this.entity = this.dataSource.entities.add(addAttr); // 创建要素对象
    return this.entity;
  }

  style2Entity(style, entity) {
    return Circle.style2Entity(style, entity.ellipse);
  }

  updateAttrForDrawing(isLoad) {
    if (!this._positions_draw) {
      return;
    }

    if (isLoad) {
      this.addPositionsForRadius(this._positions_draw);
      return;
    }

    if (this._positions_draw.length < 2) {
      return;
    }

    var style = this.entity.attribute.style;

    // 高度处理
    if (!style.clampToGround) {
      var height = this.formatNum(
        Cesium.Cartographic.fromCartesian(this._positions_draw[0]).height,
        2
      );
      this.entity.ellipse.height = height;
      style.height = height;

      if (style.extrudeHeight) {
        var extrudedHeight = height + Number(style.extrudeHeight);
        this.entity.ellipse.extrudeHeight = extrudedHeight;
      }
    }

    // 半径处理
    var radius = this.formatNum(
      Cesium.Cartesian3.distance(
        this._positions_draw[0],
        this._positions_draw[1]
      ),
      2
    );

    this.entity.ellipse.semiMinorAxis = radius; // 短半轴

    if (this._maxPointNum == 3) {
      // 长半轴
      var semiMajorAxis;
      if (this._positions_draw.length == 3) {
        semiMajorAxis = this.formatNum(
          Cesium.Cartesian3.distance(
            this._positions_draw[0],
            this._positions_draw[2]
          ),
          2
        );
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
    this._positions_draw = [position];
    var style = this.entity.attribute.style;

    // 获取椭圆上的坐标点数组 TODO EllipseGeometryLibrary undefined
    var cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions(
      {
        center: position,
        semiMajorAxis: this.entity.ellipse.semiMajorAxis.getValue(), // 长半轴
        semiMinorAxis: this.entity.ellipse.semiMinorAxis.getValue(), // 短半轴
        rotation: Cesium.Math.toRadians(Number(style.rotation || 0)),
        granularity: 2.0,
      },
      true,
      false
    );

    // 长半轴上的坐标点
    var majorPos = new Cesium.Cartesian3(
      cep.positions[0],
      cep.positions[1],
      cep.positions[2]
    );
    this._positions_draw.push(majorPos);

    if (_this._maxPointNum == 3) {
      // 椭圆
      // 短半轴上的坐标点
      var minorPos = new Cesium.Cartesian3(
        cep.positions[3],
        cep.positions[4],
        cep.positions[5]
      );
      this._positions_draw.push(majorPos);
    }
  }

  // 获取编辑对象
  getEditClass(entity) {
    var _edit = new EditCircle(entity, this.viewer, this.dataSource);
    _edit._minPointNum = this._minPointNum;
    _edit._maxPointNum = this._maxPointNum;
    return this._bindEdit(_edit);
  }

  // 获取属性处理类
  getAttrClass() {
    return Circle;
  }

  // 图形绘制结束后调用
  finish() {
    var entity = this.entity;
    entity.editing = this.getEditClass(entity); // 绑定编辑对象
    entity._positions_draw = this._positions_draw;
    entity.position = new Cesium.CallbackProperty((time) => {
      if (entity._positions_draw && entity._positions_draw.length > 0) {
        return entity._positions_draw[0];
      }
      return null;
    }, false);
  }
}

export default DrawCircle;
