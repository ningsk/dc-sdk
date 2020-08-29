/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-21 13:59:42
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 09:39:38
 */
const { default: BaseLayer } = require("./BaseLayer");

class GroupLayer extends BaseLayer {
  constructor(cfg, viewer) {
    super(cfg, viewer);
  }
  create() {
    var arr = this.config._layers;
    for (var i = 0, len = arr.length; i < len; i++) {
      this.hasOpacity = arr[i].hasOpacity;
      this.hasZIndex = arr[i].hasZIndex;
    }
  }

  setVisible(val) {
    var arr = this.config._layers;
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i].setVisible(val);
    }
  }

  // 添加
  add() {
    var arr = this.config._layers;
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i].setVisible(true);
    }
  }

  // 移除
  remove() {
    var arr = this.config._layers;
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i].setVisible(false);
    }
  }

  // 定位至数据区域
  centerAt(duration) {
    var arr = this.config._layers;
    for (var i = 0， len = arr.length; i < len; i++) {
      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i].centerAt(duration);
      }
    }
  }

  // 设置透明度
  setOpacity(value) {
    var arr = this.config._layers;
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i].setOpacity(value);
    }
  }

  // 设置叠加顺序
  setZIndex(value) {
    var arr = this.config._layers;
    for (var i = 0; i < arr.length; i++) {
      arr[i].setZIndex(value);
    }
  }

}


export default GroupLayer;