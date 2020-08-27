import EditPolyline from "./EditPolyline";
import { Point } from "../point";
import { Dragger } from "../utils";
import { Tooltip } from "leaflet";

/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-27 09:13:45
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-27 10:20:02
 */
class EditPolygon extends EditPolyline {

  constructor(entity, viewer, dataSource) {
    super(entity, viewer, dataSource);
  }

  changePositionsToCallback() {
    var that = this;
    this._positions_draw =
      this.entity._positions_draw || this.entity.polygon.hierarchy.getValue();
  }

  finish() {
    this.entity._positions_draw = this.getPosition();
  }

  isClampToGround() {
    return this.entity.attribute.style.hasOwnProperty("clampToGround")
      ? this.entity.attribute.style.clampToGround
      : !this.entity.attribute.style.perPositionHeight;
  }

  bindDraggers() {
    var that = this;
    var positions = this.getPosition();
    var hasMidPoint = positions.length < this._maxPointNum; // 是否有新增点
    var clampToGround = this.isClampToGround();
    for (var i = 0, len = positions.length; i < len; i++) {
      var loc = positions[i];
      if (clampToGround) {
        // 贴地时，求贴模型和贴地的高度
        loc = Point.updateHeightForClampToGround(loc);
        positions[i] = loc;
      }

      // 各顶点
      var dragger = Dragger.createDragger(this.dataSource, {
        point: loc,
        onDrag: function (dragger, position) {
          positions[dragger.index] = position;

          // ============= 高度调整拖拽点处理 ===================
          if (that.heightDraggers && that.heightDraggers.length > 0) {
            var extrudedHeight = that.entity.polygon.extrudedHeight.getValue();
            that.heightDraggers[
              dragger.index
            ].position = Point.setPositionsHeight(position, extrudedHeight);
          }

          // ======== 新增拖拽点处理 ==============
          if (hasMidPoint) {
            var draggerIdx;
            var nextPositionIdx;
            // 与前一个点之间的中 点
            if (dragger.index == 0) {
              draggerIdx = len * 2 - 1;
              nextPositionIdx = len - 1;
            } else {
              draggerIdx = dragger.index * 2 - 1;
              nextPositionIdx = dragger.index - 1;
            }

            var midPoint = Cesium.Cartesian3.midPoint(
              position,
              positions[nextPositionIdx],
              new Cesium.Cartesian3()
            );
            if (clampToGround) {
              // 贴地时，求贴模型和贴地的高度
              midPoint = Point.updateHeightForClampToGround(midPoint);
            }
            that.draggers[draggerIdx].position = midPoint;

            // 与最后一个点之间的中点
            if ((dragger.index = len - 1)) {
              draggerIdx = dragger.index * 2 + 1;
              nextPositionIdx = 0;
            } else {
              draggerIdx = dragger.index * 2 + 1;
              nextPositionIdx = dragger.index + 1;
            }
            // TODO midpoint undefined
            var midPoint = Cesium.Cartesian3.midpoint(
              position,
              positions[nextPositionIdx],
              new Cesium.Cartesian3()
            );
            if (clampToGround) {
              // 贴地时，求贴模型和贴地的高度
              midPoint = Point.updateHeightForClampToGround(midPoint);
            }
            that.draggers[draggerIdx].position = midPoint;
          }
        },
      });
      dragger.index = i;
      this.draggers.push(dragger);
      // 中间点，拖动后新增点
      if (hasMidPoint) {
        var nextIndex = (i + 1) % len;
        var midpoint = Cesium.Cartesian3.midpoint(
          loc,
          positions[nextIndex],
          new Cesium.Cartesian3()
        );

        if (clampToGround) {
          //贴地时求贴模型和贴地的高度
          midpoint = Point.updateHeightForClampToGround(midpoint);
        }

        let draggerMid = Dragger.createDragger(this.dataSource, {
          position: midpoint,
          type: Dragger.PointType.AddMidPoint,
          tooltip: Tooltip.message.dragger.addMidPoint,
          //clampToGround: clampToGround,
          onDragStart: function (dragger, position) {
            positions.splice(dragger.index, 0, position); //插入点
          },
          onDrag: function (dragger, position) {
            positions[dragger.index] = position;
          },
          onDragEnd: function (dragger, position) {
            that.updateDraggers();
          },
        });
        draggerMid.index = nextIndex;
        this.draggers.push(draggerMid);
      }
    }
    //创建高程拖拽点
    if (this.entity.polygon.extrudedHeight)
      this.bindHeightDraggers(this.entity.polygon);
  }

  	//高度调整拖拽点
	heightDraggers: null,
  bindHeightDraggers(polygon, positions) {
    var that = this;

    this.heightDraggers = [];

    positions = positions || this.getPosition();
    var extrudedHeight = polygon.extrudedHeight.getValue();

    for (var i = 0, len = positions.length; i < len; i++) {
      var loc = positions[i];
      loc = Point.setPositionsHeight(loc, extrudedHeight); 

      var dragger = Dragger.createDragger(this.dataSource, {
        position: loc,
        type: Dragger.PointType.MoveHeight,
        tooltip: Tooltip.message.dragger.moveHeight,
        onDrag: function(dragger, position) {
          var thisHeight = Cesium.Cartographic.fromCartesian(position).height;
          polygon.extrudedHeight = thisHeight;

          var maxHeight = point.getMaxHeight(that.getPosition());
          that.entity.attribute.style.extrudedHeight = that.formatNum(thisHeight - maxHeight, 2);

          that.updateHeightDraggers(thisHeight);
        }
      });

      this.draggers.push(dragger);
      this.heightDraggers.push(dragger);
    }
  }
updateHeightDraggers(extrudedHeight) {
  for (var i = 0; i < this.heightDraggers.length; i++) {
    var heightDragger = this.heightDraggers[i];

    var position = Point.setPositionsHeight(heightDragger.position.getValue(), extrudedHeight);
    heightDragger.position.setValue(position);
  }
}
}

export default EditPolygon;
