/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-28 14:54:24
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 15:11:13
 */

import { Draw } from "../draw";
import { EventType } from "../event";



// 显示测量结果文本的字体
const labelAttr = {
  color: "#ffffff",
  font_family: "楷体",
  font_size: 23,
  border: true,
  border_color: "#000000",
  border_width: 3,
  background: true,
  background_color: "#000000",
  background_opacity: 0.5,
  scaleByDistance: true,
  scaleByDistance_far: 800000,
  scaleByDistance_farValue: 0.5,
  scaleByDistance_near: 1000,
  scaleByDistance_nearValue: 1,
  pixelOffset: [0, -15],
};

class Measure {


  const workLength = {
    options = null,
    arrLabels: [], // 各线段label
    totalLabel: null, // 总长label
    disTerrainScale: 1.2, // 贴地时的概略比例
    // 清除未完成的数据
    clearLastNoEnd: function() {
      if (this.totalLabel != null) {
        
      }
    }
  }

  constructor(opts) {
    var viewer = opts.viewer;
    if (opts.label) {
      for (var key in opts.label) {
        labelAttr[key] = opts.label[key];
      }
    }

    var thisType = ""; // 当前正在绘制的类别
    var drawControl = new Draw(viewer, {
      hasEdit: false,
    });

    // 事件监听
    this.drawControl.on(EventType.DrawAddPoint, (e) => {
      var entity = e.entity;
      switch(thisType) {
        case 
      }
    });
  }
}

export default Measure;
