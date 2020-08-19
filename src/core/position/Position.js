import Transform from '../transform/Transform'

 import Cesium from 'cesium';

 class Position {

  /**
   * 
   * @param {*} lng 经度
   * @param {*} lat 纬度
   * @param {*} alt 高度，单位：米，默认：0
   * @param {*} heading 偏航角度，可能其他框架叫做yaw，表示绕z轴旋转。默认：0
   * @param {*} pitch 俯仰角度，表示绕Y轴旋转。默认：0
   * @param {*} roll 翻转角度，表示绕x轴旋转。默认：0
   */
  constructor(lng, lat, alt, heading, pitch, roll) {
    this._lng = lng || 0
    this._lat = lat || 0
    this._alt = alt || 0
    this._heading = heading || 0
    this._pitch = pitch || 0
    this._roll = roll || 0
  }

  set lng(lng) {
    this._lng = +lng
  }

  get lng(lng) {
    return this._lng
  }

  set lat(lat) {
    this._lat = +lat
  }

  get lat() {
    return this._lat
  }

  set alt(alt) {
    this._alt = +alt
  }

  get alt() {
    return this._alt
  }

  set heading(heading) {
    this._heading = +heading
  }

  get heading() {
    return this._heading
  }

  set pitch(pitch) {
    this._pitch = +pitch
  }

  get pitch() {
    return this._pitch
  }

  set roll(roll) {
    this._roll = +roll
  }

  get roll() {
    return this._roll
  }
  /**
   * 序列化
   */
  serialize() {
    let position = new Position(
      this._lng,
      this._lat,
      this._alt,
      this._heading,
      this._pitch,
      this._roll
    )
    return JSON.stringify(position)
  }

  /**
   * 反序列化
   * @param {*}} valStr 
   */
  static deserialize(valStr) {
    let position = new Position()
    let obj = JSON.parse(valStr)
    if (obj) {
      position.lng = obj.lng || 0
      position.lat = obj.lat || 0
      position.alt = obj.alt || 0
      position.heading = obj.heading || 0
      position.pitch = obj.pitch || 0
      position.roll = obj.roll || 0
    }
    return position
  }


  distance(target) {
    if (!target || !(target instanceof Position)) {
      return 0
    }
    return Cesium.Cartesian3.distance(
      Transform.transformWGS84ToCartesian(this),
      Transform.transformWGS84ToCartesian(target)
    )
  }

  /**
   * 复制到一个新的位置
   * @param {*} src 
   */
  static copy(src) {
    let position = new Position()
    if (src) {
      position.lng = src.lng || 0,
      position.lat = src.lat || 0,
      position.alt = src.alt || 0,
      position.heading = src.heading || 0,
      position.pitch = src.pitch || 0,
      position.roll = src.roll || 0
    }
  }

  /**
   * 字符坐标串转换为坐标对象
   * @param {String} str
   */
  static fromCoordString(str) {
    let position = new Position()
    if (str && typeof str === 'string') {
      position = this.fromCoordArray(str.split(','))
    }
    return position
  }

  /**
   * 坐标数组转换为坐标对象
   * @param {*} arr 
   */
  static fromCoordArray(arr) {
    let position = new Position()
    if (Array.isArray(arr)) {
      position.lng = arr[0] || 0
      position.lat = arr[1] || 0
      position.alt = arr[2] || 0
    }
    return position
  }

 }

 export default Position