import Thing from '@/dc/thing/Thing'

/**
 * @description 淹没分析
 */
class FloodByGraphic extends Thing {
  /**
   * @param {Object} [options] 参数对象：
   * @param {String|Number} [options.id=uuid()] 对象id的标识
   * @param {Boolean} [options.enabled=true] 对象的启用状态
   * @param {Array.<Cesium.Cartesian3>} [options.positions] 区域位置，坐标位置数组
   * @param [options.style] 淹没区域的样式
   * @param {Number} [options.speed] 淹没区域的样式
   * @param {Number} [options.minHeight] 淹没起始的海拔高度（单位：米）
   * @param {Number} [options.maxHeight] 淹没结束时候的海拔高度（单位：米）
   * @param {Boolean} [options.has3dtiles='auto'] 是否在3dtiles模型上分析（模型分析较慢，按需开启）,默认内部根据点的位置自动判断（但可能不准），未设置时根据坐标自动判断（判断可能不准确）
   */
  constructor (options) {
    super()
    this.setOptions(options)
  }
  setOptions (options) {
    this.options = options
  }
  get positions () {
    return this._positions
  }
  set positions (positions) {
    this._positions = positions
  }
  get height () {
    return this._extrudedHeight
  }
  set height (height) {
    this._extrudedHeight = height
  }
  _addedHook () {
  }

  /**
   * 开始播放淹没动画效果
   */
  start () {}

  /**
   * 清除分析
   */
  clear () {}

  /**
   * 重新开始播放淹没动画效果
   */
  restart () {}

  /**
   * 停止播放淹没动画效果
   */
  stop () {}
}
export default FloodByGraphic
