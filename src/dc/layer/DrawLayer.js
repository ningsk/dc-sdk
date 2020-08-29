import BaseLayer from "./BaseLayer";
import Draw from "../draw/Draw";
import $ from 'jquery'; 

/*
 * @Description: 
 * @version: 
 * @Author: 宁四凯
 * @Date: 2020-08-25 10:20:12
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-25 11:05:05
 */
class DrawLayer extends BaseLayer{
  constructor(cfg, viewer) {
    super(cfg, viewer);
    this.hasOpacity = false;
  }

  create() {
    this.drawControl = new Draw(this.viewer, {
      hasEdit: false,
      nameTooltip: false
    });
  }

  // 添加
  add() {
    if (this._isLoad) {
      this.drawControl.setVisible(true);
    } else {
      this._loadData();
    }
  }

  // 移除
  remove() {
    this.drawControl.setVisible(false);
  }

  // 定位至数据区域
  centerAt(duration) {
    var arr = this.drawControl.getEntities();
    this.viewer.flyTo(arr, {
      duration: duration
    });
  }

  setOpacity(value) {

  }

  _loadData() {
    var that = this;
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: 'json',
      timeout: 10000,
      success: function(data) {
        that._isLoad = true;
        var arr = that.drawControl.jsonToEntity(data, true, that.config.flyTo);
        that._bindEntityConfig(arr);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log('json文件' + that.config.url + "加载失败！");
      }
    });
  }

  _bindEntityConfig(arrEntity) {
    var that = this;
    for (var i = 0, len = arrEntity.length; i < len; i++) {
      var entity = arrEntity[i];
      // popup弹窗
      if (this.config.columns || this.config.popup) {
        entity.popup = {
          html: function(entity) {
            var attr = entity.attribute.attr;
            attr.draw_type = entity.attribute.type;
            attr.draw_typename = entity.attribute.name;
            return that.viewer.mars.popup.getPopupConfig(that.config, attr);
          },
          anchor: this.config.popupAnchor || [0, -15]
        };
      }

      if (this.config.tooltip) {
        entity.tooltip = {
          html: function(entity) {
            var attr = entity.attribute.attr;
            attr.draw_type = entity.attribute.type;
            attr.draw_typename = entity.attribute.name;
            return that.viewer.mars.popup.getPopupConfig({
              popup: that.config.tooltip
            }, attr);
          },
          anchor: this.config.tooltipAnchor || [0, -15]
        };
      }

      if (this.config.click) {
        entity.click = this.config.click;
      }

    }
  }


}

export default DrawLayer;