class Sightline extends BaseClass {
  constructor(options, oldparam) {
    super()
    this.viewer = options.viewer;
    this.lines = [];
    this._visibleColor = Cesium.defaultValue(options.visibleColor, new Cesium.Color(0, 1, 0, 1)); //可视区域
    this._hiddenColor = Cesium.defaultValue(options.hiddenColor, new Cesium.Color(1, 0, 0, 1)); //不可视区域
    this._depthFailColor = Cesium.defaultValue(options.depthFailColor, new Cesium.Color(1, 0, 0, 0.1));

    if (options.originPoint && options.targetPoint) {
      this.add(options.originPoint, options.targetPoint);
    }
  }
  //========== 对外属性 ==========

  //可视区域颜色
  //========== 方法 ==========
  add(origin, target, addHeight) {
    if (addHeight) {
      origin = (0, _point.addPositionsHeight)(origin, addHeight); //加人的身高
    }

    var currDir = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(target, origin, new Cesium.Cartesian3()),
      new Cesium.Cartesian3());
    var currRay = new Cesium.Ray(origin, currDir);
    var pickRes = this.viewer.scene.drillPickFromRay(currRay, 2, this.lines);

    if (Cesium.defined(pickRes) && pickRes.length > 0 && Cesium.defined(pickRes[0]) && Cesium.defined(pickRes[0].position)) {
      var position = pickRes[0].position;

      var distance = Cesium.Cartesian3.distance(origin, target);
      var distanceFx = Cesium.Cartesian3.distance(origin, position);
      if (distanceFx < distance) {
        //存在正常分析结果
        var arrEentity = this._showPolyline(origin, target, position);

        var result = {
          block: true, //存在遮挡
          position: position,
          entity: arrEentity
        };
        this.fire(_MarsClass2.eventType.end, result);
        return result;
      }
    }

    var arrEentity = this._showPolyline(origin, target);
    var result = {
      block: false,
      entity: arrEentity
    };
    this.fire(_MarsClass2.eventType.end, result);
    return result;
  }
  _showPolyline(origin, target, position) {
    if (position) {
      //存在正常分析结果
      var entity1 = this.viewer.entities.add({
        polyline: {
          positions: [origin, position],
          width: 2,
          material: this._visibleColor,
          depthFailMaterial: this._depthFailColor
        }
      });
      this.lines.push(entity1);

      var entity2 = this.viewer.entities.add({
        polyline: {
          positions: [position, target],
          width: 2,
          material: this._hiddenColor,
          depthFailMaterial: this._depthFailColor
        }
      });
      this.lines.push(entity2);

      return [entity1, entity2];
    } else {
      //无正确分析结果时，直接返回
      var entity1 = this.viewer.entities.add({
        polyline: {
          positions: [origin, target],
          width: 2,
          material: this._visibleColor,
          depthFailMaterial: this._depthFailColor
        }
      });
      this.lines.push(entity1);

      return [entity1];
    }
  }
  clear() {
    for (var i = 0, len = this.lines.length; i < len; i++) {
      this.viewer.entities.remove(this.lines[i]);
    }
    this.lines = [];
  }
  destroy() {
    this.clear();
    super.destroy()
  }
  get visibleColor() {
    return this._visibleColor;
  }
  set visibleColor(val) {
    this._visibleColor = val;
  }
  //不可视区域颜色
  get hiddenColor() {
    return this._hiddenColor;
  }
  set hiddenColor(val) {
    this._hiddenColor = val;
  }
  //depthFailMaterial颜色，默认为不可视区域颜色
  get depthFailColor() {
    return this._depthFailColor;
  }
  set depthFailColor(val) {
    this._depthFailColor = val;
  }
}

//[静态属性]本类中支持的事件类型常量


Sightline.event = {
  end: EventType.end
};
export default Sightline
