import Thing from '@/dc/thing/Thing'

class ContourLine extends Thing {
  /**
   * @param {Object} [options] 参数如下：
   * @param {Boolean} [options.contourShow=true] 是否显示等高线
   * @param {Number} [options.spacing=100.0] 等高线间隔（单位：米）
   * @param {Number} [options.width=1.5] 等高线线宽（单位：像素）
   * @param {Cesium.Color} [options.color=Cesium.Color.RED] 等高线颜色
   * @param {String} [options.shadingType='none'] 地表渲染效果，可选值， 无none，坡度slope，坡向aspect
   * @param {Object} [options.colorScheme] 地表渲染配色方案
   * @param {Boolean} [options.showElseArea=true] 是否显示区域外的地图
   * @param {Array.<Cartesian3>} positions 坐标位置数组，只显示单个区域（单个区域场景时使用）
   */
  constructor (options, positions) {
    super()
  }
}
export default ContourLine
