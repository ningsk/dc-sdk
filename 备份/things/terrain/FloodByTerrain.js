//淹没分析(平面)类
class FloodByEntity extends BaseClass {
  //========== 构造方法 ==========
  constructor(options) {
    super()
    this.viewer = options.viewer;
    return _this;
  }

  //========== 对外属性 ==========
  //高度

  //========== 方法 ==========


  //开发分析
  start(entity, options) {
    var _this2 = this;

    this.stop();

    this.entity = entity;
    this.options = options;

    //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
    if (this.options.onChange) {
      this.off(_MarsClass2.eventType.change);
      this.on(_MarsClass2.eventType.change, function(e) {
        _this2.options.onChange(e.height);
      });
    }
    if (this.options.onStop) {
      this.off(_MarsClass2.eventType.end);
      this.on(_MarsClass2.eventType.end, this.options.onStop);
    }
    //兼容v2.2之前旧版本处理,非升级用户可删除上面代码

    this.extrudedHeight = options.height;
    this.entity.polygon.extrudedHeight = new Cesium.CallbackProperty(function(time) {
      return _this2.extrudedHeight;
    }, false);

    this.fire(_MarsClass2.eventType.start);

    //修改高度值
    var positions = polygonAttr.getPositions(this.entity);
    var _has3dtiles = Cesium.defaultValue(options.has3dtiles, Cesium.defined((0, _tileset.pick3DTileset)(this.viewer.scene,
      positions))); //是否在3ditiles上面
    if (!_has3dtiles) {
      this._last_depthTestAgainstTerrain = this.viewer.scene.globe.depthTestAgainstTerrain;
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
    }

    positions = (0, _point.setPositionsHeight)(positions, options.height);
    this.entity.polygon.hierarchy = new Cesium.PolygonHierarchy(positions);

    this.timeIdx = setInterval(function() {
      if (_this2.extrudedHeight >= _this2.options.maxHeight) {
        _this2.stop();
        return;
      }
      var newHeight = _this2.extrudedHeight + _this2.options.speed;
      if (newHeight > _this2.options.maxHeight) {
        _this2.extrudedHeight = _this2.options.maxHeight;
      } else {
        _this2.extrudedHeight = newHeight;
      }

      _this2.fire(_MarsClass2.eventType.change, {
        height: _this2.extrudedHeight
      });
    }, 100);
  }
  //停止分析

  stop() {
    clearInterval(this.timeIdx);
    this.fire(_MarsClass2.eventType.end);
  }

  //清除分析

  clear() {
    this.stop();
    if (this._last_depthTestAgainstTerrain !== null) this.viewer.scene.globe.depthTestAgainstTerrain = this._last_depthTestAgainstTerrain;
    this.entity = null;
  }

  //更新高度

  updateHeight(height) {
    this.extrudedHeight = height;

    this.fire(_MarsClass2.eventType.change, {
      height: this.extrudedHeight
    });
  }
  destroy() {
    this.clear();
    super.destroy()
  }
  get height() {
      return this.extrudedHeight;
    },
    set height(val) {
      this.extrudedHeight = val;
    }
}
//[静态属性]本类中支持的事件类型常量


FloodByEntity.event = {
start: EventType.start,
change: EventType.change,
end: EventType.end
}
export default FloodByEntity
