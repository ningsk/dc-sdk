const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
  ''
)
class Util {
  static
  /**
   * 移除数组中指定对象
   * @param { Array }  arr 数组
   * @param val 需要移除
   * @return {boolean}
   */
  static removeArrayItem (arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        arr.splice(i, 1)
        return true
      }
    }
    return false
  }
  static download (fileName, blob) {
    const aLink = document.createElement('a')
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)
    document.body.appendChild(aLink)
    aLink.click()
    document.body.removeChild(aLink)
  }
  static base64Img2Blob (code) {
    const parts = code.split(';base64,')
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length

    const uInt8Array = new Uint8Array(rawLength)
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], {
      type: contentType
    })
  }
  static downloadBase64Image (name, base64) {
    const blob = this.base64Img2Blob(base64)
    this.download(name + '.png', blob)
  }
  static downloadFile (fileName, string) {
    const blob = new Blob([string])
    this.download(fileName, blob)
  }

  /**
   * 格式化经纬度 返回度分秒字符串
   * @param {Number}  value 京都或纬度值
   * @return {string} 度分秒字符串，如113°12′34″
   */
  static formatDegree (value) {
    value = Math.abs(value)
    const v1 = Math.floor(value) // 度
    const v2 = Math.floor((value - v1) * 60) // 分
    const v3 = Math.round(((value - v1) * 3600) % 60) // 秒
    return v1 + '° ' + v2 + "'  " + v3 + '"'
  }

  /**
   * 根据高度获取地图层级
   * @param {Number}  altitude 高度值
   * @return {number} 地图层级  通常是0-21
   */
  static heightToZoom (altitude) {
    const A = 40487.57
    const B = 0.00007096758
    const C = 91610.74
    const D = -40467.74
    return Math.round(D + (A - D) / (1 + Math.pow(altitude / C, B)))
  }
  /**
   * Generates uuid
   * @param prefix
   * @returns {string}
   */
  static uuid (prefix = 'D') {
    const uuid = []
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    let r
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = CHARS[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
    return prefix + '-' + uuid.join('')
  }

  /**

   * Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter.
   * @param dest
   * @param sources
   * @returns {*}
   */
  static merge (dest, ...sources) {
    let i, j, len, src
    for (j = 0, len = sources.length; j < len; j++) {
      src = sources[j]
      for (i in src) {
        dest[i] = src[i]
      }
    }
    return dest
  }

  /**
   * @function splitWords(str: String): String[]
   * Trims and splits the string on whitespace and returns the array of parts.
   * @param {*} str
   */
  static splitWords (str) {
    return this.trim(str).split(/\s+/)
  }

  /**
   * @function setOptions(obj: Object, options: Object): Object
   * Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`.
   * @param {*} obj
   * @param {*} options
   */
  static setOptions (obj, options) {
    if (!obj.hasOwnProperty('options')) {
      obj.options = obj.options ? Object.create(obj.options) : {}
    }
    for (const i in options) {
      obj.options[i] = options[i]
    }
    return obj.options
  }
  static falseFn () {
    return false
  }

  /**
   *  @function formatNum(num: Number, digits?: Number): Number
   *  Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
   * @param num
   * @param digits
   * @returns {number}
   */
  static formatNum (num, digits) {
    const pow = Math.pow(10, digits === undefined ? 6 : digits)
    return Math.round(num * pow) / pow
  }

  /**
   * @function trim(str: String): String
   * Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
   * @param {*} str
   */
  static trim (str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '')
  }
  /**
   * @function checkPosition(position: Object): Boolean
   * Check position for validity
   * @param {*} position
   */
  static checkPosition (position) {
    return (
      position &&
      position.hasOwnProperty('_lng') &&
      position.hasOwnProperty('_lat') &&
      position.hasOwnProperty('_alt')
    )
  }
}
export default Util
