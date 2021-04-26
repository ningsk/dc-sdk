//显示测量结果文本的字体
import * as Cesium from 'cesium'
import BaseClass from '../../event/Event'
import Util from '../../util/Util'

const defaultLabelStyle = (0, _index.getDefStyle)('label', {
  'color': '#ffffff',
  'font_size': 20,
  'border': true,
  'border_color': '#000000',
  'border_width': 3,
  'background': true,
  'background_color': '#000000',
  'background_opacity': 0.5,
  'scaleByDistance': true,
  'scaleByDistance_far': 800000,
  'scaleByDistance_farValue': 0.5,
  'scaleByDistance_near': 1000,
  'scaleByDistance_nearValue': 1,
  'pixelOffset': [0, -15],
  'visibleDepth': false //一直显示，不被地形等遮挡
})

class MeasureBase extends BaseClass {
  constructor(options, target) {
    super()
    this.viewer = options.viewer;
    this.config = options;
    this.target = target || this; //用于抛出的事件对象

    //文本样式
    if (Cesium.defined(options.label)) {
      this.labelStyle = Util.merge(options.label, defaultLabelStyle)
    } else {
      this.labelStyle = Util.merge({}, defaultLabelStyle)
    }

    //标绘对象
    this.drawControl = options.draw;
    if (!this.drawControl) {
      this.drawControl = new Draw(viewer, Util.merge({
        hasEdit: false
      }, options))
      this.hasDelDraw = true
    }
    this._bindEvent()
  }
  _bindEvent() {
    var _this2 = this;

    //事件监听
    this.drawControl.on(_Draw.Draw.event.drawAddPoint, function(e) {
      var entity = e.entity;
      if (entity.type != _this2.type) return;
      _this2.entity = entity;
      _this2.showAddPointLength(entity);

      _this2.target.fire(_Draw.Draw.event.drawAddPoint, e);
    });
    this.drawControl.on(_Draw.Draw.event.drawRemovePoint, function(e) {
      if (e.entity.type != _this2.type) return;
      _this2.showRemoveLastPointLength(e);
      _this2.target.fire(_Draw.Draw.event.drawRemovePoint, e);
    });
    this.drawControl.on(_Draw.Draw.event.drawMouseMove, function(e) {
      var entity = e.entity;
      if (entity.type != _this2.type) return;
      _this2.entity = entity;
      _this2.showMoveDrawing(entity);
      _this2.target.fire(_Draw.Draw.event.drawMouseMove, e);
    });

    this.drawControl.on(_Draw.Draw.event.drawCreated, function(e) {
      var entity = e.entity;
      if (entity.type != _this2.type) return;

      _this2.entity = entity;
      _this2.showDrawEnd(entity);
      _this2.bindDeleteContextmenu(entity);
      _this2.entity = null;
      _this2.target.fire(_Draw.Draw.event.drawCreated, e);
    });
    showAddPointLength(entity) {}
    showRemoveLastPointLength(e) {}
    showMoveDrawing(entity) {}
  }
  showDrawEnd(entity) {}
  startDraw(options) {
    var _this3 = this;

    this.options = options || {};
    this.options.style = this.options.style || {};

    //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
    if (this.options.calback) {
      this.target.off(_MarsClass2.eventType.change);
      this.target.on(_MarsClass2.eventType.change, function(e) {
        _this3.options.calback(e.value, e.label, e);
      });
    }
    if (this.options.onStart) {
      this.target.off(_MarsClass2.eventType.start);
      this.target.on(_MarsClass2.eventType.start, this.options.onStart);
    }
    if (this.options.onEnd) {
      this.target.off(_MarsClass2.eventType.end);
      this.target.on(_MarsClass2.eventType.end, this.options.onEnd);
    }
    //兼容v2.2之前旧版本处理,非升级用户可删除上面代码


    var entity = this._startDraw(this.options);
    entity.type = this.type;
  }
  _startDraw() {}

  //取消并停止绘制
  //如果上次未完成绘制就单击了新的，清除之前未完成的。

  stopDraw() {
    this.clearLastNoEnd();
    this.drawControl.stopDraw();
  }

  //外部控制，完成绘制，比如手机端无法双击结束

  endDraw() {
    if (this.entity) {
      this.showMoveDrawing(this.entity);
      this.entity = null;
    }
    this.drawControl.endDraw();
  }

  /*清除测量*/

  clear() {
    this.stopDraw();
    this.drawControl.deleteAll();

    this.target.fire(_MarsClass2.eventType.delete, {
      mtype: this.type
    });
  }


  //右键菜单
  bindDeleteContextmenu(entity) {
    var that = this;
    entity.contextmenuItems = entity.contextmenuItems || [];
    entity.contextmenuItems.push({
      text: '删除测量',
      iconCls: 'fa fa-trash-o',
      visible: function visible(e) {
        that.drawControl.closeTooltip();

        var entity = e.target;
        if (entity.inProgress && !entity.editing) return false;
        else return true;
      },
      callback: function callback(e) {
        var entity = e.target;

        if (Cesium.defined(entity._totalLable)) {
          that.dataSource.entities.remove(entity._totalLable);
          delete entity._totalLable;
        }
        if (Cesium.defined(entity.arrEntityEx) && entity.arrEntityEx.length > 0) {
          var arrLables = entity.arrEntityEx;
          if (arrLables && arrLables.length > 0) {
            for (var i = 0, len = arrLables.length; i < len; i++) {
              that.dataSource.entities.remove(arrLables[i]);
            }
          }
          delete entity.arrEntityEx;
        }
        if (entity._exLine) {
          that.dataSource.entities.remove(entity._exLine);
          delete entity._exLine;
        }

        that.drawControl.deleteEntity(entity);

        that.drawControl.closeTooltip();
        that.viewer.mars.popup.close();

        that.target.fire(_MarsClass2.eventType.delete, {
          mtype: that.type,
          entity: entity
        });
      }
    });
  }
  destroy() {
    this.clear();

    if (this.hasDelDraw) {
      this.drawControl.destroy();
      delete this.drawControl;
    }
    super.destroy()
  }

  get draw() {
    return this.drawControl;
  }
  get dataSource() {
    return this.drawControl.dataSource;
  }
}
//[静态属性]本类中支持的事件类型常量


MeasureBase.event = {
  start: _MarsClass2.eventType.start,
  change: _MarsClass2.eventType.change,
  end: _MarsClass2.eventType.end,
  delete: _MarsClass2.eventType.delete
};

export default MeasureBase
