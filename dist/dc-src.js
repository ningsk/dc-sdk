(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cesium')) :
  typeof define === 'function' && define.amd ? define(['exports', 'cesium'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DC = {}, global.Cesium));
}(this, (function (exports, Cesium$1) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Cesium__default = /*#__PURE__*/_interopDefaultLegacy(Cesium$1);

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-11 11:53:02
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-11 11:53:43
   */
  const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  /**
   *  Some of the code borrows from leaflet
   * https://github.com/Leaflet/Leaflet/tree/master/src/core
   */

  class Util$1 {
    /**
     * Generates uuid
     * @param prefix
     * @returns {string}
     */
    static uuid(prefix = 'D') {
      let uuid = [];
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      let r;

      for (let i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = CHARS[i === 19 ? r & 0x3 | 0x8 : r];
        }
      }

      return prefix + '-' + uuid.join('');
    }
    /**
         * Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter.
     * @param dest
     * @param sources
     * @returns {*}
     */


    static merge(dest, ...sources) {
      let i, j, len, src;

      for (j = 0, len = sources.length; j < len; j++) {
        src = sources[j];

        for (i in src) {
          dest[i] = src[i];
        }
      }

      return dest;
    }
    /**
     * @function splitWords(str: String): String[]
     * Trims and splits the string on whitespace and returns the array of parts.
     * @param {*} str
     */


    static splitWords(str) {
      return this.trim(str).split(/\s+/);
    }
    /**
     * @function setOptions(obj: Object, options: Object): Object
     * Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`.
     * @param {*} obj
     * @param {*} options
     */


    static setOptions(obj, options) {
      if (!obj.hasOwnProperty('options')) {
        obj.options = obj.options ? Object.create(obj.options) : {};
      }

      for (let i in options) {
        obj.options[i] = options[i];
      }

      return obj.options;
    }
    /**
     *  @function formatNum(num: Number, digits?: Number): Number
     *  Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
     * @param num
     * @param digits
     * @returns {number}
     */


    static formatNum(num, digits) {
      let pow = Math.pow(10, digits === undefined ? 6 : digits);
      return Math.round(num * pow) / pow;
    }
    /**
     * @function trim(str: String): String
     * Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
     * @param {*} str
     */


    static trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }
    /**
     *  Data URI string containing a base64-encoded empty GIF image.
     * Used as a hack to free memory from unused images on WebKit-powered
     * mobile devices (by setting image `src` to this string).
     * @returns {string}
     */


    static emptyImageUrl() {
      return function () {
        return 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
      }();
    }
    /**
     * @function checkPosition(position: Object): Boolean
     * Check position for validity
     * @param {*} position
     */


    static checkPosition(position) {
      return position && position.hasOwnProperty('_lng') && position.hasOwnProperty('_lat') && position.hasOwnProperty('_alt');
    }

  }

  /**
   * Dom Utils
   * some code reference leaflet
   * https://github.com/Leaflet/Leaflet/tree/master/src/core
   */

  class DomUtil {
    /**
     * Returns an element given its DOM id, or returns the element itself
     *  if it was passed directly.
     * @param id
     * @returns {HTMLElement|*}
     */
    static get(id) {
      return typeof id === 'string' ? document.getElementById(id) : id;
    }
    /**
     * Returns the value for a certain style attribute on an element,
     * including computed values or values set through CSS.
     * @param el
     * @param style
     * @returns {null|*}
     */


    static getStyle(el, style) {
      let value = el.style[style] || el.currentStyle && el.currentStyle[style];

      if ((!value || value === 'auto') && document.defaultView) {
        let css = document.defaultView.getComputedStyle(el, null);
        value = css ? css[style] : null;
      }

      return value === 'auto' ? null : value;
    }
    /**
     * Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
     * @param tagName
     * @param className
     * @param container
     * @returns {HTMLElement}
     */


    static create(tagName, className, container = null) {
      let el = document.createElement(tagName);
      el.className = className || '';

      if (container) {
        container.appendChild(el);
      }

      return el;
    }
    /**
     * Removes `el` from its parent element
     * @param {*} el
     */


    static remove(el) {
      let parent = el.parentNode;

      if (parent) {
        parent.removeChild(el);
      }
    }
    /**
     * Removes all of `el`'s children elements from `el`
     * @param {*} el
     */


    static empty(el) {
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
    }
    /**
     * Returns `true` if the element's class attribute contains `name`.
     * @param {*} el
     * @param {*} name
     */


    static hasClass(el, name) {
      if (el.classList !== undefined) {
        return el.classList.contains(name);
      }

      let className = this.getClass(el);
      return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
    }
    /**
     * @function Adds `name` to the element's class attribute.
     * @param {*} el
     * @param {*} name
     */


    static addClass(el, name) {
      if (el.classList !== undefined) {
        let classes = Util$1.splitWords(name);

        for (let i = 0, len = classes.length; i < len; i++) {
          el.classList.add(classes[i]);
        }
      } else if (!this.hasClass(el, name)) {
        let className = this.getClass(el);
        this.setClass(el, (className ? className + ' ' : '') + name);
      }
    }
    /**
     * @function Removes `name` from the element's class attribute.
     * @param {*} el
     * @param {*} name
     */


    static removeClass(el, name) {
      if (el.classList !== undefined) {
        el.classList.remove(name);
      } else {
        this.setClass(el, Util$1.trim((' ' + this.getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
      }
    }
    /**
     * Sets the element's class.
     * @param {*} el
     * @param {*} name
     */


    static setClass(el, name) {
      if (el.className.baseVal === undefined) {
        el.className = name;
      } else {
        // in case of SVG element
        el.className.baseVal = name;
      }
    }
    /**
     * @function Returns the element's class.
     * @param {*} el
     */


    static getClass(el) {
      // Check if the element is an SVGElementInstance and use the correspondingElement instead
      // (Required for linked SVG elements in IE11.)
      if (el.correspondingElement) {
        el = el.correspondingElement;
      }

      return el.className.baseVal === undefined ? el.className : el.className.baseVal;
    }
    /**
     * Creates svg
     * @param width
     * @param height
     * @param path
     * @param container
     * @returns {SVGElement}
     */


    static createSvg(width, height, path, container) {
      let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg:svg');
      svg.setAttribute('class', 'svg-path');
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      let pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('d', path);
      svg.appendChild(pathEl);

      if (container) {
        container.appendChild(svg);
      }

      return svg;
    }
    /**
     * Parses string to Dom
     * @param domStr
     * @param withWrapper
     * @param className
     * @returns {HTMLDivElement|NodeListOf<ChildNode>}
     */


    static parseDom(domStr, withWrapper, className) {
      withWrapper = withWrapper ? true : false;
      let el = document.createElement('div');
      el.className = className || '';
      el.innerHTML = domStr;
      return withWrapper ? el : el.childNodes;
    }
    /**
     * enter full screen
     * @param el
     */


    static enterFullscreen(el) {
      if (!el) {
        return;
      }

      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    }
    /**
     * exit full screen
     */


    static exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    /**
     * Creates video
     * @param url
     * @param type
     * @param className
     * @param container
     * @returns {HTMLElement}
     */


    static createVideo(url, type, className, container = null) {
      let videoEl = this.create('video', className, container);
      let source = this.create('source', '', videoEl);
      source.setAttribute('src', url);
      source.setAttribute('type', `video/${type}`);
      return videoEl;
    }

  }

  /*
   * @Description: sdk内部统一调用console.*打印日志的控制类，在外部可以按需开启和关闭（默认开启）
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-11 11:56:23
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-11 12:47:43
   */
  let showError = true;
  let showInfo = true;
  let showWarn = true;

  class Log {
    static hasError(val) {
      showError = val;
    }

    static hasInfo(val) {
      showInfo = val;
    }

    static hasWarn(val) {
      showWarn = val;
    }

    static logError(sources) {
      if (showError) {
        console.error(sources);
      }
    }

    static logInfo(sources) {
      if (showInfo) {
        console.info(sources);
      }
    }

    static logWarn(sources) {
      if (showWarn) {
        console.warn(sources);
      }
    }

  }

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-16 11:35:22
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 11:35:25
   */
  const TWO_PI = Math.PI * 2;
  const FITTING_COUNT = 100;
  const ZERO_TOLERANCE = 0.0001;

  class PlotUtil {
    /**
     * @param pnt1
     * @param pnt2
     * @returns {number}
     */
    static distance(pnt1, pnt2) {
      return Math.sqrt(Math.pow(pnt1[0] - pnt2[0], 2) + Math.pow(pnt1[1] - pnt2[1], 2));
    }
    /**
     * @param points
     * @returns {number}
     */


    static wholeDistance(points) {
      let distance = 0;

      for (let i = 0; i < points.length - 1; i++) distance += this.distance(points[i], points[i + 1]);

      return distance;
    }
    /**
     * @param points
     * @returns {number}
     */


    static getBaseLength(points) {
      return Math.pow(this.wholeDistance(points), 0.99);
    }
    /**
     * @param pnt1
     * @param pnt2
     * @returns {number[]}
     */


    static mid(pnt1, pnt2) {
      return [(pnt1[0] + pnt2[0]) / 2, (pnt1[1] + pnt2[1]) / 2];
    }
    /**
     * @param pnt1
     * @param pnt2
     * @param pnt3
     * @returns {[*, *]|[*, *]|[*, number]}
     */


    static getCircleCenterOfThreePoints(pnt1, pnt2, pnt3) {
      let pntA = [(pnt1[0] + pnt2[0]) / 2, (pnt1[1] + pnt2[1]) / 2];
      let pntB = [pntA[0] - pnt1[1] + pnt2[1], pntA[1] + pnt1[0] - pnt2[0]];
      let pntC = [(pnt1[0] + pnt3[0]) / 2, (pnt1[1] + pnt3[1]) / 2];
      let pntD = [pntC[0] - pnt1[1] + pnt3[1], pntC[1] + pnt1[0] - pnt3[0]];
      return this.getIntersectPoint(pntA, pntB, pntC, pntD);
    }
    /**
     * @param pntA
     * @param pntB
     * @param pntC
     * @param pntD
     * @returns {(*|number)[]|*[]}
     */


    static getIntersectPoint(pntA, pntB, pntC, pntD) {
      let x, y, f, e;

      if (pntA[1] === pntB[1]) {
        f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1]);
        x = f * (pntA[1] - pntC[1]) + pntC[0];
        y = pntA[1];
        return [x, y];
      }

      if (pntC[1] === pntD[1]) {
        e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1]);
        x = e * (pntC[1] - pntA[1]) + pntA[0];
        y = pntC[1];
        return [x, y];
      }

      e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1]);
      f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1]);
      y = (e * pntA[1] - pntA[0] - f * pntC[1] + pntC[0]) / (e - f);
      x = e * y - e * pntA[1] + pntA[0];
      return [x, y];
    }
    /**
     * @param startPnt
     * @param endPnt
     * @returns {number}
     */


    static getAzimuth(startPnt, endPnt) {
      let azimuth;
      let angle = Math.asin(Math.abs(endPnt[1] - startPnt[1]) / this.distance(startPnt, endPnt));
      if (endPnt[1] >= startPnt[1] && endPnt[0] >= startPnt[0]) azimuth = angle + Math.PI;else if (endPnt[1] >= startPnt[1] && endPnt[0] < startPnt[0]) azimuth = TWO_PI - angle;else if (endPnt[1] < startPnt[1] && endPnt[0] < startPnt[0]) azimuth = angle;else if (endPnt[1] < startPnt[1] && endPnt[0] >= startPnt[0]) azimuth = Math.PI - angle;
      return azimuth;
    }
    /**
     * @param pntA
     * @param pntB
     * @param pntC
     * @returns {number}
     */


    static getAngleOfThreePoints(pntA, pntB, pntC) {
      let angle = this.getAzimuth(pntB, pntA) - this.getAzimuth(pntB, pntC);
      return angle < 0 ? angle + TWO_PI : angle;
    }
    /**
     * @param pnt1
     * @param pnt2
     * @param pnt3
     * @returns {boolean}
     */


    static isClockWise(pnt1, pnt2, pnt3) {
      return (pnt3[1] - pnt1[1]) * (pnt2[0] - pnt1[0]) > (pnt2[1] - pnt1[1]) * (pnt3[0] - pnt1[0]);
    }
    /**
     * @param t
     * @param startPnt
     * @param endPnt
     * @returns {*[]}
     */


    static getPointOnLine(t, startPnt, endPnt) {
      let x = startPnt[0] + t * (endPnt[0] - startPnt[0]);
      let y = startPnt[1] + t * (endPnt[1] - startPnt[1]);
      return [x, y];
    }
    /**
     * @param t
     * @param startPnt
     * @param cPnt1
     * @param cPnt2
     * @param endPnt
     * @returns {number[]}
     */


    static getCubicValue(t, startPnt, cPnt1, cPnt2, endPnt) {
      t = Math.max(Math.min(t, 1), 0);
      let tp = 1 - t;
      let t2 = t * t;
      let t3 = t2 * t;
      let tp2 = tp * tp;
      let tp3 = tp2 * tp;
      let x = tp3 * startPnt[0] + 3 * tp2 * t * cPnt1[0] + 3 * tp * t2 * cPnt2[0] + t3 * endPnt[0];
      let y = tp3 * startPnt[1] + 3 * tp2 * t * cPnt1[1] + 3 * tp * t2 * cPnt2[1] + t3 * endPnt[1];
      return [x, y];
    }
    /**
     * @param startPnt
     * @param endPnt
     * @param angle
     * @param distance
     * @param clockWise
     * @returns {*[]}
     */


    static getThirdPoint(startPnt, endPnt, angle, distance, clockWise) {
      let azimuth = this.getAzimuth(startPnt, endPnt);
      let alpha = clockWise ? azimuth + angle : azimuth - angle;
      let dx = distance * Math.cos(alpha);
      let dy = distance * Math.sin(alpha);
      return [endPnt[0] + dx, endPnt[1] + dy];
    }
    /**
     * @param center
     * @param radius
     * @param startAngle
     * @param endAngle
     * @returns {[]}
     */


    static getArcPoints(center, radius, startAngle, endAngle) {
      let x,
          y,
          pnts = [];
      let angleDiff = endAngle - startAngle;
      angleDiff = angleDiff < 0 ? angleDiff + TWO_PI : angleDiff;

      for (let i = 0; i <= FITTING_COUNT; i++) {
        let angle = startAngle + angleDiff * i / FITTING_COUNT;
        x = center[0] + radius * Math.cos(angle);
        y = center[1] + radius * Math.sin(angle);
        pnts.push([x, y]);
      }

      return pnts;
    }
    /**
     * @param t
     * @param pnt1
     * @param pnt2
     * @param pnt3
     * @returns {*[][]}
     */


    static getBisectorNormals(t, pnt1, pnt2, pnt3) {
      let normal = this.getNormal(pnt1, pnt2, pnt3);
      let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
      let uX = normal[0] / dist;
      let uY = normal[1] / dist;
      let d1 = this.distance(pnt1, pnt2);
      let d2 = this.distance(pnt2, pnt3);
      let dt, x, y, bisectorNormalLeft, bisectorNormalRight;

      if (dist > ZERO_TOLERANCE) {
        if (this.isClockWise(pnt1, pnt2, pnt3)) {
          dt = t * d1;
          x = pnt2[0] - dt * uY;
          y = pnt2[1] + dt * uX;
          bisectorNormalRight = [x, y];
          dt = t * d2;
          x = pnt2[0] + dt * uY;
          y = pnt2[1] - dt * uX;
          bisectorNormalLeft = [x, y];
        } else {
          dt = t * d1;
          x = pnt2[0] + dt * uY;
          y = pnt2[1] - dt * uX;
          bisectorNormalRight = [x, y];
          dt = t * d2;
          x = pnt2[0] - dt * uY;
          y = pnt2[1] + dt * uX;
          bisectorNormalLeft = [x, y];
        }
      } else {
        x = pnt2[0] + t * (pnt1[0] - pnt2[0]);
        y = pnt2[1] + t * (pnt1[1] - pnt2[1]);
        bisectorNormalRight = [x, y];
        x = pnt2[0] + t * (pnt3[0] - pnt2[0]);
        y = pnt2[1] + t * (pnt3[1] - pnt2[1]);
        bisectorNormalLeft = [x, y];
      }

      return [bisectorNormalRight, bisectorNormalLeft];
    }
    /**
     * @param pnt1
     * @param pnt2
     * @param pnt3
     * @returns {number[]}
     */


    static getNormal(pnt1, pnt2, pnt3) {
      let dX1 = pnt1[0] - pnt2[0];
      let dY1 = pnt1[1] - pnt2[1];
      let d1 = Math.sqrt(dX1 * dX1 + dY1 * dY1);
      dX1 /= d1;
      dY1 /= d1;
      let dX2 = pnt3[0] - pnt2[0];
      let dY2 = pnt3[1] - pnt2[1];
      let d2 = Math.sqrt(dX2 * dX2 + dY2 * dY2);
      dX2 /= d2;
      dY2 /= d2;
      let uX = dX1 + dX2;
      let uY = dY1 + dY2;
      return [uX, uY];
    }
    /**
     * @param t
     * @param controlPoints
     * @returns {[]}
     */


    static getCurvePoints(t, controlPoints) {
      let leftControl = this.getLeftMostControlPoint(t, controlPoints);
      let normals = [leftControl];
      let pnt1, pnt2, pnt3, normalPoints;

      for (let i = 0; i < controlPoints.length - 2; i++) {
        pnt1 = controlPoints[i];
        pnt2 = controlPoints[i + 1];
        pnt3 = controlPoints[i + 2];
        normalPoints = this.getBisectorNormals(t, pnt1, pnt2, pnt3);
        normals = normals.concat(normalPoints);
      }

      let rightControl = this.getRightMostControlPoint(t, controlPoints);
      normals.push(rightControl);
      let points = [];

      for (let i = 0; i < controlPoints.length - 1; i++) {
        pnt1 = controlPoints[i];
        pnt2 = controlPoints[i + 1];
        points.push(pnt1);

        for (let t = 0; t < FITTING_COUNT; t++) {
          let pnt = this.getCubicValue(t / FITTING_COUNT, pnt1, normals[i * 2], normals[i * 2 + 1], pnt2);
          points.push(pnt);
        }

        points.push(pnt2);
      }

      return points;
    }
    /**
     * @param t
     * @param controlPoints
     * @returns {number[]}
     */


    static getLeftMostControlPoint(t, controlPoints) {
      let pnt1 = controlPoints[0];
      let pnt2 = controlPoints[1];
      let pnt3 = controlPoints[2];
      let pnts = this.getBisectorNormals(0, pnt1, pnt2, pnt3);
      let normalRight = pnts[0];
      let normal = this.getNormal(pnt1, pnt2, pnt3);
      let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
      let controlX, controlY;

      if (dist > ZERO_TOLERANCE) {
        let mid = this.mid(pnt1, pnt2);
        let pX = pnt1[0] - mid[0];
        let pY = pnt1[1] - mid[1];
        let d1 = this.distance(pnt1, pnt2); // normal at midpoint

        let n = 2.0 / d1;
        let nX = -n * pY;
        let nY = n * pX; // upper triangle of symmetric transform matrix

        let a11 = nX * nX - nY * nY;
        let a12 = 2 * nX * nY;
        let a22 = nY * nY - nX * nX;
        let dX = normalRight[0] - mid[0];
        let dY = normalRight[1] - mid[1]; // coordinates of reflected vector

        controlX = mid[0] + a11 * dX + a12 * dY;
        controlY = mid[1] + a12 * dX + a22 * dY;
      } else {
        controlX = pnt1[0] + t * (pnt2[0] - pnt1[0]);
        controlY = pnt1[1] + t * (pnt2[1] - pnt1[1]);
      }

      return [controlX, controlY];
    }
    /**
     * @param t
     * @param controlPoints
     * @returns {number[]}
     */


    static getRightMostControlPoint(t, controlPoints) {
      let count = controlPoints.length;
      let pnt1 = controlPoints[count - 3];
      let pnt2 = controlPoints[count - 2];
      let pnt3 = controlPoints[count - 1];
      let pnts = this.getBisectorNormals(0, pnt1, pnt2, pnt3);
      let normalLeft = pnts[1];
      let normal = this.getNormal(pnt1, pnt2, pnt3);
      let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
      let controlX, controlY;

      if (dist > ZERO_TOLERANCE) {
        let mid = this.mid(pnt2, pnt3);
        let pX = pnt3[0] - mid[0];
        let pY = pnt3[1] - mid[1];
        let d1 = this.distance(pnt2, pnt3); // normal at midpoint

        let n = 2.0 / d1;
        let nX = -n * pY;
        let nY = n * pX; // upper triangle of symmetric transform matrix

        let a11 = nX * nX - nY * nY;
        let a12 = 2 * nX * nY;
        let a22 = nY * nY - nX * nX;
        let dX = normalLeft[0] - mid[0];
        let dY = normalLeft[1] - mid[1]; // coordinates of reflected vector

        controlX = mid[0] + a11 * dX + a12 * dY;
        controlY = mid[1] + a12 * dX + a22 * dY;
      } else {
        controlX = pnt3[0] + t * (pnt2[0] - pnt3[0]);
        controlY = pnt3[1] + t * (pnt2[1] - pnt3[1]);
      }

      return [controlX, controlY];
    }
    /**
     * @param points
     * @returns {[]|*}
     */


    static getBezierPoints(points) {
      if (points.length <= 2) return points;
      let bezierPoints = [];
      let n = points.length - 1;

      for (let t = 0; t <= 1; t += 0.01) {
        let x = 0;
        let y = 0;

        for (let index = 0; index <= n; index++) {
          let factor = this.getBinomialFactor(n, index);
          let a = Math.pow(t, index);
          let b = Math.pow(1 - t, n - index);
          x += factor * a * b * points[index][0];
          y += factor * a * b * points[index][1];
        }

        bezierPoints.push([x, y]);
      }

      bezierPoints.push(points[n]);
      return bezierPoints;
    }
    /**
     *
     * @param n
     * @param index
     * @returns {number}
     */


    static getBinomialFactor(n, index) {
      return this.getFactorial(n) / (this.getFactorial(index) * this.getFactorial(n - index));
    }
    /**
     * @param n
     * @returns {number}
     */


    static getFactorial(n) {
      if (n <= 1) return 1;
      if (n === 2) return 2;
      if (n === 3) return 6;
      if (n === 4) return 24;
      if (n === 5) return 120;
      let result = 1;

      for (let i = 1; i <= n; i++) result *= i;

      return result;
    }
    /**
     * @param points
     * @returns {[]|*}
     */


    static getQBSplinePoints(points) {
      if (points.length <= 2) return points;
      let n = 2;
      let bSplinePoints = [];
      let m = points.length - n - 1;
      bSplinePoints.push(points[0]);

      for (let i = 0; i <= m; i++) {
        for (let t = 0; t <= 1; t += 0.05) {
          let x = 0;
          let y = 0;

          for (let k = 0; k <= n; k++) {
            let factor = this.getQuadricBSplineFactor(k, t);
            x += factor * points[i + k][0];
            y += factor * points[i + k][1];
          }

          bSplinePoints.push([x, y]);
        }
      }

      bSplinePoints.push(points[points.length - 1]);
      return bSplinePoints;
    }
    /**
     * @param k
     * @param t
     * @returns {number}
     */


    static getQuadricBSplineFactor(k, t) {
      if (k === 0) return Math.pow(t - 1, 2) / 2;
      if (k === 1) return (-2 * Math.pow(t, 2) + 2 * t + 1) / 2;
      if (k === 2) return Math.pow(t, 2) / 2;
      return 0;
    }

  }

  /*
   * @Descriptton: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-11 11:10:19
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:24:33
   */
  const BaseEventType = {
    ADD: 'add',
    REMOVE: 'remove'
  };
  const MouseEventType = {
    CLICK: Cesium$1.ScreenSpaceEventType.LEFT_CLICK,
    RIGHT_CLICK: Cesium$1.ScreenSpaceEventType.RIGHT_CLICK,
    DB_CLICK: Cesium$1.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    MOUSE_MOVE: Cesium$1.ScreenSpaceEventType.MOUSE_MOVE,
    WHEEL: Cesium$1.ScreenSpaceEventType.WHEEL,
    MOUSE_OVER: 'mouseover',
    MOUSE_OUT: 'mouseout'
  };
  const ViewerEventType = {
    ADD_LAYER: 'addLayer',
    REMOVE_LAYER: 'removeLayer',
    ADD_EFFECT: 'addEffect',
    REMOVE_EFFECT: 'removeEffect',
    CLICK: Cesium$1.ScreenSpaceEventType.LEFT_CLICK,
    RIGHT_CLICK: Cesium$1.ScreenSpaceEventType.RIGHT_CLICK,
    DB_CLICK: Cesium$1.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    MOUSE_MOVE: Cesium$1.ScreenSpaceEventType.MOUSE_MOVE,
    WHEEL: Cesium$1.ScreenSpaceEventType.WHEEL
  };
  const SceneEventType = {
    CAMERA_MOVE_END: 'cameraMoveEnd',
    CAMERA_CHANGED: 'cameraChanged',
    PRE_UPDATE: 'preUpdate',
    POST_UPDATE: 'postUpdate',
    PRE_RENDER: 'preRender',
    POST_RENDER: 'postRender',
    MORPH_COMPLETE: 'morphComplete',
    CLOCK_TICK: 'clockTick'
  };
  const OverlayEventType = { ...BaseEventType,
    CLICK: Cesium$1.ScreenSpaceEventType.LEFT_CLICK,
    RIGHT_CLICK: Cesium$1.ScreenSpaceEventType.RIGHT_CLICK,
    DB_CLICK: Cesium$1.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    MOUSE_MOVE: Cesium$1.ScreenSpaceEventType.MOUSE_MOVE,
    MOUSE_OVER: 'mouseover',
    MOUSE_OUT: 'mouseout',
    POSITION_UPDATE: 'positionUpdate'
  };
  const LayerGroupEventType = BaseEventType;
  const LayerEventType = BaseEventType;

  /*
   * @Description: sdk中所有类的基类，都是继承该基类的
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-11 12:30:09
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-11 12:31:30
   */
  class Event {
    constructor() {
      this._cache = {};

      this._registerEvent();
    }
    /**
     * Event registration
     * Subclasses need to override
     * @private
     */


    _registerEvent() {}
    /**
     * @param type
     * @param callback
     * @param context
     * @returns {any}
     * @private
     */


    _on(type, callback, context) {
      let event = this.getEvent(type);
      let removeCallback = undefined;

      if (event && callback) {
        removeCallback = event.addEventListener(callback, context || this);
      }

      return removeCallback;
    }
    /**
     * @param type
     * @param callback
     * @param context
     * @returns {boolean}
     * @private
     */


    _off(type, callback, context) {
      let event = this.getEvent(type);
      let removed = false;

      if (event && callback) {
        removed = event.removeEventListener(callback, context || this);
      }

      return removed;
    }
    /**
     * @param type
     * @param params
     * @private
     */


    _fire(type, params) {
      let event = this.getEvent(type);

      if (event) {
        event.raiseEvent(params);
      }
    }
    /**
     * Subscribe event
     * @param type
     * @param callback
     * @param context
     * @returns remove callback function
     */


    on(type, callback, context) {
      return this._on(type, callback, context);
    }
    /**
     * Subscribe once event
     * @param type
     * @param callback
     * @param context
     */


    once(type, callback, context) {
      let removeCallback = this._on(type, callback, context);

      removeCallback && removeCallback();
    }
    /**
     * Unsubscribe event
     * @param type
     * @param callback
     * @param context
     * @returns Boolean
     */


    off(type, callback, context) {
      return this._off(type, callback, context);
    }
    /**
     * Trigger subscription event
     * @param type
     * @param params
     */


    fire(type, params) {
      this._fire(type, params);
    }
    /**
     * Returns events by type
     * @param type
     * @returns Event
     */


    getEvent(type) {
      return this._cache[type] || undefined;
    }

  }

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:26:01
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:30:05
   */
  /**
   * Mouse events in 3D scene, optimized Cesium event model
   */

  class MouseEvent extends Event {
    constructor(viewer) {
      super();
      this._viewer = viewer;
      this._selected = undefined;

      this._setInputAction();

      this.on(MouseEventType.CLICK, this._clickHandler, this);
      this.on(MouseEventType.DB_CLICK, this._dbClickHandler, this);
      this.on(MouseEventType.RIGHT_CLICK, this._rightClickHandler, this);
      this.on(MouseEventType.MOUSE_MOVE, this._mouseMoveHandler, this);
      this.on(MouseEventType.WHEEL, this._mouseWheelHandler, this);
    }
    /**
     * Register Cesium mouse events
     * @private
     */


    _setInputAction() {
      let handler = new Cesium__default['default'].ScreenSpaceEventHandler(this._viewer.canvas);
      Object.keys(Cesium__default['default'].ScreenSpaceEventType).forEach(key => {
        let type = Cesium__default['default'].ScreenSpaceEventType[key];
        this._cache[type] = new Cesium__default['default'].Event();
        handler.setInputAction(movement => {
          this._cache[type].raiseEvent(movement);
        }, type);
      });
    }
    /**
     *
     * Gets the mouse information for the mouse event
     * @param position
     * @private
     *
     */


    _getMouseInfo(position) {
      let scene = this._viewer.scene;
      let target = scene.pick(position);
      let cartesian = undefined;
      let surfaceCartesian = undefined;
      let wgs84Position = undefined;
      let wgs84SurfacePosition = undefined;

      if (scene.pickPositionSupported) {
        cartesian = scene.pickPosition(position);
      }

      if (cartesian) {
        let c = Cesium__default['default'].Ellipsoid.WGS84.cartesianToCartographic(cartesian);

        if (c) {
          wgs84Position = {
            lng: Cesium__default['default'].Math.toDegrees(c.longitude),
            lat: Cesium__default['default'].Math.toDegrees(c.latitude),
            alt: c.height
          };
        }
      }

      if (scene.mode === Cesium__default['default'].SceneMode.SCENE3D && !(this._viewer.terrainProvider instanceof Cesium__default['default'].EllipsoidTerrainProvider)) {
        let ray = scene.camera.getPickRay(position);
        surfaceCartesian = scene.globe.pick(ray, scene);
      } else {
        surfaceCartesian = scene.camera.pickEllipsoid(position, Cesium__default['default'].Ellipsoid.WGS84);
      }

      if (surfaceCartesian) {
        let c = Cesium__default['default'].Ellipsoid.WGS84.cartesianToCartographic(surfaceCartesian);

        if (c) {
          wgs84SurfacePosition = {
            lng: Cesium__default['default'].Math.toDegrees(c.longitude),
            lat: Cesium__default['default'].Math.toDegrees(c.latitude),
            alt: c.height
          };
        }
      }

      return {
        target: target,
        windowPosition: position,
        position: cartesian,
        wgs84Position: wgs84Position,
        surfacePosition: surfaceCartesian,
        wgs84SurfacePosition: wgs84SurfacePosition
      };
    }
    /**
     * Gets the drill pick overlays for the mouse event
     * @param position
     * @returns {[]}
     * @private
     */


    _getDrillInfos(position) {
      let drillInfos = [];
      let scene = this._viewer.scene;
      let targets = scene.drillPick(position);

      if (targets && targets.length) {
        targets.forEach(target => {
          drillInfos.push(this._getTargetInfo(target));
        });
      }

      return drillInfos;
    }
    /**
     * Return the Overlay id
     * @param target
     * @returns {any}
     * @private
     */


    _getOverlayId(target) {
      let overlayId = undefined; // for Entity

      if (target && target.id && target.id instanceof Cesium__default['default'].Entity) {
        overlayId = target.id.overlayId;
      } // for Cesium3DTileFeature


      if (target && target instanceof Cesium__default['default'].Cesium3DTileFeature) {
        overlayId = target.tileset.overlayId;
      }

      return overlayId;
    }
    /**
     * Returns the target information for the mouse event
     * @param target
     * @returns {{overlay: any, feature: any, layer: any}}
     * @private
     */


    _getTargetInfo(target) {
      let overlay = undefined;
      let layer = undefined;
      let feature = undefined; // for Entity

      if (target && target.id && target.id instanceof Cesium__default['default'].Entity) {
        layer = this._viewer.getLayers().filter(item => item.layerId === target.id.layerId)[0];

        if (layer && layer.getOverlay) {
          overlay = layer.getOverlay(target.id.overlayId);
        }
      } // for Cesium3DTileFeature


      if (target && target instanceof Cesium__default['default'].Cesium3DTileFeature) {
        layer = this._viewer.getLayers().filter(item => item.layerId === target.tileset.layerId)[0];
        feature = target;

        if (layer && layer.getOverlay) {
          overlay = layer.getOverlay(target.tileset.overlayId);

          if (feature && feature.getPropertyNames) {
            let propertyNames = feature.getPropertyNames();
            propertyNames.forEach(item => {
              overlay.attr[item] = feature.getProperty(item);
            });
          }
        }
      }

      return {
        layer: layer,
        overlay: overlay,
        feature: feature
      };
    }
    /**
     * Trigger subscription event
     * @param type
     * @param mouseInfo
     * @private
     */


    _raiseEvent(type, mouseInfo = {}) {
      let event = undefined;

      let targetInfo = this._getTargetInfo(mouseInfo.target);

      let overlay = targetInfo.overlay; // get Overlay Event

      if (overlay && overlay.overlayEvent) {
        event = overlay.overlayEvent.getEvent(type);
      } // get Viewer Event


      if (!event || event.numberOfListeners === 0) {
        event = this._viewer.viewerEvent.getEvent(type);
      }

      event && event.numberOfListeners > 0 && event.raiseEvent({ ...targetInfo,
        ...mouseInfo
      }); // get Drill Pick Event

      if (overlay && overlay.allowDrillPicking) {
        let drillInfos = this._getDrillInfos(mouseInfo.windowPosition);

        drillInfos.forEach(drillInfo => {
          let dillOverlay = drillInfo.overlay;

          if (dillOverlay.overlayId !== overlay.overlayId && dillOverlay.overlayEvent) {
            event = dillOverlay.overlayEvent.getEvent(type);
            event && event.numberOfListeners > 0 && event.raiseEvent({ ...drillInfo,
              ...mouseInfo
            });
          }
        });
      }
    }
    /**
     * Default click event handler
     * @param movement
     * @returns {boolean}
     * @private
     */


    _clickHandler(movement) {
      if (!movement || !movement.position) {
        return false;
      }

      let mouseInfo = this._getMouseInfo(movement.position);

      this._raiseEvent(MouseEventType.CLICK, mouseInfo);
    }
    /**
     * Default dbClick event handler
     * @param movement
     * @returns {boolean}
     * @private
     */


    _dbClickHandler(movement) {
      if (!movement || !movement.position) {
        return false;
      }

      let mouseInfo = this._getMouseInfo(movement.position);

      this._raiseEvent(MouseEventType.DB_CLICK, mouseInfo);
    }
    /**
     * Default rightClick event handler
     * @param movement
     * @returns {boolean}
     * @private
     */


    _rightClickHandler(movement) {
      if (!movement || !movement.position) {
        return false;
      }

      let mouseInfo = this._getMouseInfo(movement.position);

      this._raiseEvent(MouseEventType.RIGHT_CLICK, mouseInfo);
    }
    /**
     * Default mousemove event handler
     * @param movement
     * @returns {boolean}
     * @private
     */


    _mouseMoveHandler(movement) {
      if (!movement || !movement.endPosition) {
        return false;
      }

      let mouseInfo = this._getMouseInfo(movement.endPosition);

      this._viewer.canvas.style.cursor = mouseInfo.target ? 'pointer' : 'default';

      this._raiseEvent(MouseEventType.MOUSE_MOVE, mouseInfo); // add event for overlay


      if (!this._selected || this._getOverlayId(this._selected.target) !== this._getOverlayId(mouseInfo.target)) {
        this._raiseEvent(MouseEventType.MOUSE_OUT, this._selected);

        this._raiseEvent(MouseEventType.MOUSE_OVER, mouseInfo);

        this._selected = mouseInfo;
      }
    }
    /**
     * Default mouse wheel event handler
     * @param movement
     * @private
     */


    _mouseWheelHandler(movement) {
      this._raiseEvent(MouseEventType.WHEEL, {
        movement
      });
    }

  }

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:27:42
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:27:59
   */

  class ViewerEvent extends Event {
    constructor() {
      super();
    }
    /**
     * Register event for viewer
     * @private
     */


    _registerEvent() {
      Object.keys(ViewerEventType).forEach(key => {
        let type = ViewerEventType[key];
        this._cache[type] = new Cesium__default['default'].Event();
      });
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:27:17
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:27:26
   */

  class SceneEvent extends Event {
    constructor(viewer) {
      super();
      this._camera = viewer.camera;
      this._scene = viewer.scene;
      this._clock = viewer.clock;
    }
    /**
     * Subscribe event
     * @param type
     * @param callback
     * @param context
     * @returns {any}
     */


    on(type, callback, context) {
      let removeCallback = undefined;

      switch (type) {
        case SceneEventType.CAMERA_MOVE_END:
          removeCallback = this._camera.moveEnd.addEventListener(callback, context || this);
          break;

        case SceneEventType.CAMERA_CHANGED:
          removeCallback = this._camera.changed.addEventListener(callback, context || this);
          break;

        case SceneEventType.PRE_UPDATE:
          removeCallback = this._scene.preUpdate.addEventListener(callback, context || this);
          break;

        case SceneEventType.POST_UPDATE:
          removeCallback = this._scene.postUpdate.addEventListener(callback, context || this);
          break;

        case SceneEventType.PRE_RENDER:
          removeCallback = this._scene.preRender.addEventListener(callback, context || this);
          break;

        case SceneEventType.POST_RENDER:
          removeCallback = this._scene.postRender.addEventListener(callback, context || this);
          break;

        case SceneEventType.MORPH_COMPLETE:
          removeCallback = this._scene.morphComplete.addEventListener(callback, context || this);
          break;

        case SceneEventType.CLOCK_TICK:
          removeCallback = this._clock.onTick.addEventListener(callback, context || this);
          break;
      }

      return removeCallback;
    }
    /**
     * Unsubscribe event
     * @param type
     * @param callback
     * @param context
     * @returns {boolean}
     */


    off(type, callback, context) {
      let removed = false;

      switch (type) {
        case SceneEventType.CAMERA_MOVE_END:
          removed = this._camera.moveEnd.removeEventListener(callback, context || this);
          break;

        case SceneEventType.CAMERA_CHANGED:
          removed = this._camera.changed.removeEventListener(callback, context || this);
          break;

        case SceneEventType.PRE_UPDATE:
          removed = this._scene.preUpdate.removeEventListener(callback, context || this);
          break;

        case SceneEventType.POST_UPDATE:
          removed = this._scene.postUpdate.removeEventListener(callback, context || this);
          break;

        case SceneEventType.PRE_RENDER:
          removed = this._scene.preRender.removeEventListener(callback, context || this);
          break;

        case SceneEventType.POST_RENDER:
          removed = this._scene.postRender.removeEventListener(callback, context || this);
          break;

        case SceneEventType.MORPH_COMPLETE:
          removed = this._scene.morphComplete.removeEventListener(callback, context || this);
          break;

        case SceneEventType.CLOCK_TICK:
          removed = this._clock.onTick.removeEventListener(callback, context || this);
          break;
      }

      return removed;
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:25:01
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:25:14
   */

  class LayerGroupEvent extends Event {
    constructor() {
      super();
    }
    /**
     * Register event for layer group
     * @private
     */


    _registerEvent() {
      Object.keys(LayerGroupEventType).forEach(key => {
        let type = LayerGroupEventType[key];
        this._cache[type] = new Cesium__default['default'].Event();
      });
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-11 12:50:33
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-11 12:53:19
   */

  class LayerEvent extends Event {
    constructor() {
      super();
    }

    _registerEvent() {
      Object.keys(LayerEventType).forEach(key => {
        let type = LayerEventType[key];
        this._cache[type] = new Cesium$1.Event();
      });
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 14:43:27
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:16:15
   */

  class OverlayEvent extends Event {
    constructor() {
      super();
    }
    /**
     * Register event for overlay
     * @private
     */


    _registerEvent() {
      Object.keys(OverlayEventType).forEach(key => {
        let type = OverlayEventType[key];
        this._cache[type] = new Cesium$1.Event();
      });
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-11 11:40:59
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 15:46:50
   */
  const State$1 = {
    INITIALIZED: 'initialized',
    // 初始化
    ADDED: 'added',
    // 已经添加到地图上
    REMOVED: 'removed',
    // 已经移除地图
    CLEARED: 'cleared',
    INSTALLED: 'installed',
    ENABLED: 'enabled',
    DISABLED: 'disabled',
    PLAY: 'play',
    PAUSE: 'pause',
    RESTORE: 'restore'
  };

  /*
   * @Description: 黑白效果
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 09:19:30
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 10:54:28
   */

  class BlackAndWhiteEffect {
    constructor() {
      this._viewer = undefined;
      this._delegate = undefined;
      this._enable = false;
      this._gradations = 1;
      this._selected = [];
      this.type = "black_and_white";
      this._state = State$1.INITIALIZED;
    }

    set enable(enable) {
      this._enable = enable;
      if (enable && this._viewer && !this._delegate) this._createPostProcessStage();
      this._delegate && (this._delegate.enabled = enable);
      return this;
    }

    get enable() {
      return this._enable;
    }

    set gradations(graditions) {
      this._gradations = graditions;
      this._delegate && (this._delegate.uniform.gradations = graditions);
      return this;
    }

    get gradations() {
      return this._gradations;
    }

    set selected(selected) {
      this._selected = selected;
      this._delegate && (this._delegate.selected = selected);
      return this;
    }
    /**
     * @private
     */


    _createPostProcessStage() {
      this._delegate = Cesium$1.PostProcessStageLibrary.createBlackAndWhiteStage();

      if (this._delegate) {
        this._delegate.uniforms.gradations = this._gradations;

        this._viewer.scene.postProcessStages.add(this._delegate);
      }
    }

    addTo(viewer) {
      if (!viewer) {
        return this;
      }

      this._viewer = viewer;
      this._state = State$1.ADDED;
      return this;
    }

  }

  /*
   * @Description: 泛光效果
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 10:52:41
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:00:07
   */

  class BloomEffect {
    constructor() {
      this._viewer = undefined;
      this._enable = false;
      this._contrast = 128;
      this._brightness = -0.3;
      this._glowOnly = false;
      this._delta = 1;
      this._sigma = 3.8;
      this._stepSize = 5;
      this._selected = [];
      this.type = 'bloom';
      this._state = State$1.INITIALIZED;
    }

    set enable(enable) {
      this._enable = enable;

      if (enable && this._viewer && !this._delegate) {
        this._createPostProcessStage();
      }

      this._delegate && (this._delegate.enabled = enable);
      return this;
    }

    get enable() {
      return this._enable;
    }

    set contrast(contrast) {
      this._contrast = contrast;
      this._delegate && (this._delegate.uniforms.contrast = contrast);
      return this;
    }

    get contrast() {
      return this._contrast;
    }

    set brightness(brightness) {
      this._brightness = brightness;
      this._delegate && (this._delegate.uniforms.brightness = brightness);
      return this;
    }

    get brightness() {
      return this._brightness;
    }

    set glowOnly(glowOnly) {
      this._glowOnly = glowOnly;
      this._delegate && (this._delegate.uniforms.glowOnly = glowOnly);
      return this;
    }

    get glowOnly() {
      return this._glowOnly;
    }

    set delta(delta) {
      this._delta = delta;
      this._delegate && (this._delegate.uniforms.delta = delta);
      return this;
    }

    get delta() {
      return this._delta;
    }

    set sigma(sigma) {
      this._sigma = sigma;
      this._delegate && (this._delegate.uniforms.sigma = sigma);
      return this;
    }

    get sigma() {
      return this._sigma;
    }

    set stepSize(stepSize) {
      this._stepSize = stepSize;
      this._delegate && (this._delegate.uniforms.stepSize = stepSize);
      return this;
    }

    get stepSize() {
      return this._stepSize;
    }

    set selected(selected) {
      this._selected = selected;
      this._delegate && (this._delegate.selected = selected);
      return this;
    }

    get selected() {
      return this._selected;
    }
    /**
     *
     * @private
     */


    _createPostProcessStage() {
      this._delegate = this._viewer.scene.postProcessStages.bloom;
      this._delegate.uniforms.contrast = this._contrast;
      this._delegate.uniforms.brightness = this._brightness;
      this._delegate.uniforms.glowOnly = this._glowOnly;
      this._delegate.uniforms.delta = this._delta;
      this._delegate.uniforms.sigma = this._sigma;
      this._delegate.uniforms.stepSize = this._stepSize;
    }
    /**
     *
     * @param viewer
     * @returns {Bloom}
     */


    addTo(viewer) {
      if (!viewer) {
        return this;
      }

      this._viewer = viewer;
      this._state = State$1.ADDED;
      return this;
    }

  }

  /*
   * @Description: 亮光效果 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 10:56:35
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 10:59:24
   */

  class BrightnessEffect {
    constructor() {
      this._viewer = undefined;
      this._delegate = undefined;
      this._enable = false;
      this._intensity = 1;
      this._selected = [];
      this.type = 'brightness';
      this._state = State.INITIALIZED;
    }

    set enable(enable) {
      this._enable = enable;

      if (enable && this._viewer && !this._delegate) {
        this._createPostProcessStage();
      }

      this._delegate && (this._delegate.enabled = enable);
      return this;
    }

    get enable() {
      return this._enable;
    }

    set intensity(intensity) {
      this._intensity = intensity;
      this._delegate && (this._delegate.uniforms.brightness = intensity);
      return this;
    }

    get intensity() {
      return this._intensity;
    }

    set selected(selected) {
      this._selected = selected;
      this._delegate && (this._delegate.selected = selected);
      return this;
    }

    get selected() {
      return this._selected;
    }
    /**
     *
     * @private
     */


    _createPostProcessStage() {
      this._delegate = Cesium$1.PostProcessStageLibrary.createBrightnessStage();

      if (this._delegate) {
        this._delegate.uniforms.brightness = this._intensity;

        this._viewer.scene.postProcessStages.add(this._delegate);
      }
    }
    /**
     *
     * @param viewer
     * @returns {Brightness}
     */


    addTo(viewer) {
      if (!viewer) {
        return this;
      }

      this._viewer = viewer;
      this._state = State.ADDED;
      return this;
    }

  }

  /*
   * @Description: 云效果 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 10:34:39
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 10:52:27
   */

  const IMG$4 = require('../../images/cloud.jpg');

  class CloudEffect {
    constructor() {
      this._id = Util$1.uuid();
      this._viewer = undefined;
      this._delegate = undefined;
      this._rotateAmount = 0;
      this._enable = false;
      this.type = 'cloud';
      this._heading = 0;
      this._state = State$1.INITIALIZED;
    }

    set enable(enable) {
      if (!this._viewer.scene.mode === Cesium.SceneMode.SCENE3D) {
        return this;
      }

      this._enable = this._delegate.show = enable;

      if (this._enable) {
        this._viewer.scene.postUpdate.addEventListener(this._onRotate, this);
      } else {
        this._viewer.scene.postUpdate.removeEventListener(this._onRotate, this);
      }

      return this;
    }

    get enable() {
      return this._enable;
    }

    set rotateAmount(rotateAmount) {
      this._rotateAmount = rotateAmount;
      return this;
    }

    get rotateAmount() {
      return this._rotateAmount;
    }
    /**
     *
     * @param scene
     * @param time
     * @private
     */


    _onRotate(scene, time) {
      if (this._rotateAmount === 0) {
        return;
      }

      this._heading += this._rotateAmount;

      if (this._heading >= 360 || this._heading <= -360) {
        this._heading = 0;
      }

      this._delegate.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(new Cesium.Cartesian3(), new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(this._heading), 0, 0));
    }
    /**
     *
     * @private
     */


    _createPrimitive() {
      this._delegate = new Cesium.Primitive({
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          material: new Cesium.Material({
            fabric: {
              type: 'Image',
              uniforms: {
                color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
                image: IMG$4
              },
              components: {
                alpha: 'texture2D(image, fract(repeat * materialInput.st)).r * color.a',
                diffuse: 'vec3(1.0)'
              },
              translucent: true,
              aboveGround: true
            }
          })
        })
      });
      this._delegate.geometryInstances = new Cesium.GeometryInstance({
        geometry: new Cesium.EllipsoidGeometry({
          vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
          radii: this._viewer.scene.globe.ellipsoid.radii
        }),
        id: this._id
      });
      this._delegate.show = this._enable;

      this._viewer.scene.primitives.add(this._delegate);
    }
    /**
     *
     * @param viewer
     * @returns {Cloud}
     */


    addTo(viewer) {
      if (!viewer) {
        return this;
      }

      this._viewer = viewer;

      this._createPrimitive();

      this._state = State$1.ADDED;
      return this;
    }

  }

  /*
   * @Description: 景深效果 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:03:41
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:05:00
   */

  class DepthOfFieldEffect {
    constructor() {
      this._viewer = undefined;
      this._delegate = undefined;
      this._enable = false;
      this._focalDistance = 87;
      this._delta = 1;
      this._sigma = 3.8;
      this._stepSize = 2.5;
      this._selected = [];
      this.type = 'depth_of_field';
      this._state = State$1.INITIALIZED;
    }

    set enable(enable) {
      this._enable = enable;

      if (enable && this._viewer && Cesium$1.PostProcessStageLibrary.isDepthOfFieldSupported(this._viewer.scene) && !this._delegate) {
        this._createPostProcessStage();
      }

      this._delegate && (this._delegate.enabled = enable);
      return this;
    }

    get enable() {
      return this._enable;
    }

    set focalDistance(focalDistance) {
      this._focalDistance = focalDistance;
      this._delegate && (this._delegate.uniforms.focalDistance = focalDistance);
      return this;
    }

    get focalDistance() {
      return this._focalDistance;
    }

    set delta(delta) {
      this._delta = delta;
      this._delegate && (this._delegate.uniforms.delta = delta);
      return this;
    }

    get delta() {
      return this._delta;
    }

    set sigma(sigma) {
      this._sigma = sigma;
      this._delegate && (this._delegate.uniforms.sigma = sigma);
      return this;
    }

    get sigma() {
      return this._sigma;
    }

    set stepSize(stepSize) {
      this._stepSize = stepSize;
      this._delegate && (this._delegate.uniforms.stepSize = stepSize);
      return this;
    }

    get stepSize() {
      return this._stepSize;
    }

    set selected(selected) {
      this._selected = selected;
      this._delegate && (this._delegate.selected = selected);
      return this;
    }

    get selected() {
      return this._selected;
    }
    /**
     *
     * @private
     */


    _createPostProcessStage() {
      this._delegate = Cesium$1.PostProcessStageLibrary.createDepthOfFieldStage();

      if (this._delegate) {
        this._delegate.uniforms.focalDistance = this._focalDistance;
        this._delegate.uniforms.delta = this._delta;
        this._delegate.uniforms.sigma = this._sigma;
        this._delegate.uniforms.stepSize = this._stepSize;

        this._viewer.scene.postProcessStages.add(this._delegate);
      }
    }
    /**
     *
     * @param viewer
     * @returns {DepthOfField}
     */


    addTo(viewer) {
      if (!viewer) {
        return this;
      }

      this._viewer = viewer;
      this._state = State$1.ADDED;
      return this;
    }

  }

  /*
   * @Description: 雾天效果 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 10:47:13
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 10:49:22
   */

  const FogShader = require('../../material/shader/weather/FogShader.glsl');

  class FogEffect {
    constructor() {
      this._id = Util$1.uuid();
      this._viewer = undefined;
      this._delegate = undefined;
      this._enable = false;
      this._fogByDistance = {
        near: 10,
        nearValue: 0,
        far: 2000,
        farValue: 1.0
      };
      this._color = new Cesium$1.Color(0, 0, 0, 1);
      this.type = 'fog';
      this._state = State$1.INITIALIZED;
    }

    set enable(enable) {
      this._enable = enable;

      if (enable && this._viewer && !this._delegate) {
        this._createPostProcessStage();
      }

      this._delegate && (this._delegate.enabled = enable);
      return this;
    }

    get enable() {
      return this._enable;
    }

    set fogByDistance(fogByDistance) {
      this._fogByDistance = fogByDistance;
      this._delegate && (this._delegate.uniforms.fogByDistance = new Cesium$1.Cartesian4(this._fogByDistance?.near || 10, this._fogByDistance?.nearValue || 0.0, this._fogByDistance?.far || 2000, this._fogByDistance?.farValue || 1.0));
      return this;
    }

    get fogByDistance() {
      return this._fogByDistance;
    }

    set color(color) {
      this._color = color;
      this._delegate && (this._delegate.uniforms.fogColor = color);
    }

    get color() {
      return this._color;
    }
    /**
     *
     * @private
     */


    _createPostProcessStage() {
      this._delegate = new Cesium$1.PostProcessStage({
        name: this._id,
        fragmentShader: FogShader,
        uniforms: {
          fogByDistance: new Cesium$1.Cartesian4(this._fogByDistance?.near || 10, this._fogByDistance?.nearValue || 0.0, this._fogByDistance?.far || 200, this._fogByDistance?.farValue || 1.0),
          fogColor: this._color
        }
      });

      this._viewer.scene.postProcessStages.add(this._delegate);
    }
    /**
     *
     * @param viewer
     * @returns {Fog}
     */


    addTo(viewer) {
      if (!viewer) {
        return this;
      }

      this._viewer = viewer;
      this._state = State$1.ADDED;
      return this;
    }

  }

  /*
   * @Description: 夜视效果 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:00:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:02:25
   */

  class NightVisionEffect {
    constructor() {
      this._enable = false;
      this._selected = [];
      this.type = 'night';
      this._state = State$1.INITIALIZED;
    }

    set enable(enable) {
      this._enable = enable;

      if (enable && this._viewer && !this._delegate) {
        this._createPostProcessStage();
      }

      this._delegate && (this._delegate.enabled = enable);
      return this;
    }

    get enable() {
      return this._enable;
    }

    set selected(selected) {
      this._selected = selected;
      this._delegate && (this._delegate.selected = selected);
      return this;
    }

    get selected() {
      return this._selected;
    }
    /**
     *
     * @private
     */


    _createPostProcessStage() {
      this._delegate = Cesium$1.PostProcessStageLibrary.createNightVisionStage();

      if (this._delegate) {
        this._viewer.scene.postProcessStages.add(this._delegate);
      }
    }
    /**
     *
     * @param viewer
     * @returns {NightVision}
     */


    addTo(viewer) {
      if (!viewer) {
        return this;
      }

      this._viewer = viewer;
      this._state = State$1.ADDED;
      return this;
    }

  }

  /*
   * @Description: 雨天效果 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 10:50:07
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 10:50:58
   */

  const RainShader = require('../../material/shader/weather/RainShader.glsl');

  class RainEffect {
    constructor() {
      this._id = Util$1.uuid();
      this._viewer = undefined;
      this._delegate = undefined;
      this._enable = false;
      this._speed = 10.0;
      this.type = 'rain';
      this._state = State$1.INITIALIZED;
    }

    set enable(enable) {
      this._enable = enable;

      if (enable && this._viewer && !this._delegate) {
        this._createPostProcessStage();
      }

      this._delegate && (this._delegate.enabled = enable);
      return this;
    }

    get enable() {
      return this._enable;
    }

    set speed(speed) {
      this._speed = speed;
      this._delegate && (this._delegate.uniforms.speed = speed);
      return this;
    }

    get speed() {
      return this._speed;
    }
    /**
     *
     * @private
     */


    _createPostProcessStage() {
      this._delegate = new Cesium$1.PostProcessStage({
        name: this._id,
        fragmentShader: RainShader,
        uniforms: {
          speed: this._speed
        }
      });

      this._viewer.scene.postProcessStages.add(this._delegate);
    }
    /**
     *
     * @param viewer
     * @returns {Rain}
     */


    addTo(viewer) {
      if (!viewer) {
        return this;
      }

      this._viewer = viewer;
      this._state = State$1.ADDED;
      return this;
    }

  }

  /*
   * @Description: 雪天天气
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 10:17:07
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 10:47:55
   */

  const SnowShader = require("../../material/shader/effect/SnowShader.glsl");

  class SnowEffect {
    constructor() {
      this._id = Util$1.uuid();
      this._viewer = undefined;
      this._delegate = undefined;
      this._enable = false;
      this._speed = 10.0;
      this.type = "snow";
      this.state = State$1.INITIALIZED;
    }

    set enable(enable) {
      this._enable = enable;

      if (enable && this._viewer && !this._delegate) {
        this._createPostProcessStage();
      }

      this._delegate && (this._delegate.enabled = enable);
      return this;
    }

    get enable() {
      return this._enable;
    }

    set speed(speed) {
      this._speed = speed;
      this._delegate && (this._delegate.uniforms.speed = speed);
      return this;
    }
    /**
     * @private
     */


    _createPostProcessStage() {
      this._delegate = new Cesium$1.PostProcessStage({
        name: this._id,
        fragmentShader: SnowShader,
        uniforms: {
          speed: this._speed
        }
      });

      this._viewer.scene.postProcessStage.add(this._delegate);
    }

    addTo(viewer) {
      if (!viewer) {
        return this;
      }

      this._viewer = viewer;
      this._state = State$1.ADDED;
      return this;
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:05:29
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:16:01
   */

  class Effect {
    constructor() {
      this._comps = {
        blackAndWhiteEffect: new BlackAndWhiteEffect(),
        bloomEffect: new BloomEffect(),
        brightnessEffect: new BrightnessEffect(),
        cloudEffect: new CloudEffect(),
        depthOfFieldEffect: new DepthOfFieldEffect(),
        fogEffect: new FogEffect(),
        nightVisionEffect: new NightVisionEffect(),
        rainEffect: new RainEffect(),
        snowEffect: new SnowEffect()
      };
    }

    get blackAndWhiteEffect() {
      return this._comps.blackAndWhiteEffect;
    }

    get bloomEffect() {
      return this._comps.bloomEffect;
    }

    get brightnessEffect() {
      return this._comps.brightnessEffect;
    }

    get cloudEffect() {
      return this._comps.cloudEffect;
    }

    get depthOfFieldEffect() {
      return this._comps.depthOfFieldEffect;
    }

    get fogEffect() {
      return this._comps.fogEffect;
    }

    get nightVisionEffect() {
      return this._comps.nightVisionEffect;
    }

    get rainEffect() {
      return this._comps.rainEffect;
    }

    get snowEffect() {
      return this._comps.snowEffect;
    }

    install(viewer) {
      Object.keys(this._comps).forEach(key => {
        this._comps[key].addTo(viewer);
      });
      Object.defineProperties(viewer, 'effect', {
        value: this,
        writable: false
      });
    }

  }

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:02:03
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 09:57:11
   */
  let ImageryType = {
    ARCGIS: 'arcgis',
    SINGLE_TILE: "single_tile",
    WMS: "wms",
    WMTS: "wmts",
    XYZ: "xyz",
    COORD: "coord",
    MAPBOX: "mapbox",
    MAPBOX_STYLE: "mapboxStyle",
    SUPERMAP: "supermap"
  };

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:19:26
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 09:19:43
   */
  const BD_FACTOR = 3.14159265358979324 * 3000.0 / 180.0;
  const PI = 3.1415926535897932384626;
  const RADIUS = 6378245.0;
  const EE = 0.00669342162296594323;

  class CoordTransform {
    /**
     * BD-09 To GCJ-02
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static BD09ToGCJ02(lng, lat) {
      let x = +lng - 0.0065;
      let y = +lat - 0.006;
      let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * BD_FACTOR);
      let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * BD_FACTOR);
      let gg_lng = z * Math.cos(theta);
      let gg_lat = z * Math.sin(theta);
      return [gg_lng, gg_lat];
    }
    /**
     * GCJ-02 To BD-09
     * @param lng
     * @param lat
     * @returns {number[]}
     * @constructor
     */


    static GCJ02ToBD09(lng, lat) {
      lat = +lat;
      lng = +lng;
      let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * BD_FACTOR);
      let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * BD_FACTOR);
      let bd_lng = z * Math.cos(theta) + 0.0065;
      let bd_lat = z * Math.sin(theta) + 0.006;
      return [bd_lng, bd_lat];
    }
    /**
     * WGS-84 To GCJ-02
     * @param lng
     * @param lat
     * @returns {number[]}
     */


    static WGS84ToGCJ02(lng, lat) {
      lat = +lat;
      lng = +lng;

      if (this.out_of_china(lng, lat)) {
        return [lng, lat];
      } else {
        let d = this.delta(lng, lat);
        return [lng + d[0], lat + d[1]];
      }
    }
    /**
     * GCJ-02 To WGS-84
     * @param lng
     * @param lat
     * @returns {number[]}
     * @constructor
     */


    static GCJ02ToWGS84(lng, lat) {
      lat = +lat;
      lng = +lng;

      if (this.out_of_china(lng, lat)) {
        return [lng, lat];
      } else {
        let d = this.delta(lng, lat);
        let mgLng = lng + d[0];
        let mgLat = lat + d[1];
        return [lng * 2 - mgLng, lat * 2 - mgLat];
      }
    }
    /**
     *
     * @param lng
     * @param lat
     * @returns {number[]}
     */


    static delta(lng, lat) {
      let dLng = this.transformLng(lng - 105, lat - 35);
      let dLat = this.transformLat(lng - 105, lat - 35);
      const radLat = lat / 180 * PI;
      let magic = Math.sin(radLat);
      magic = 1 - EE * magic * magic;
      const sqrtMagic = Math.sqrt(magic);
      dLng = dLng * 180 / (RADIUS / sqrtMagic * Math.cos(radLat) * PI);
      dLat = dLat * 180 / (RADIUS * (1 - EE) / (magic * sqrtMagic) * PI);
      return [dLng, dLat];
    }
    /**
     *
     * @param lng
     * @param lat
     * @returns {number}
     */


    static transformLng(lng, lat) {
      lat = +lat;
      lng = +lng;
      let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
      ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
      ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
      ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
      return ret;
    }
    /**
     *
     * @param lng
     * @param lat
     * @returns {number}
     */


    static transformLat(lng, lat) {
      lat = +lat;
      lng = +lng;
      let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
      ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
      ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
      ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
      return ret;
    }
    /**
     *
     * @param lng
     * @param lat
     * @returns {boolean}
     */


    static out_of_china(lng, lat) {
      lat = +lat;
      lng = +lng;
      return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:15:55
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 09:16:23
   */

  class AmapMercatorTilingScheme extends Cesium$1.WebMercatorTilingScheme {
    constructor(options) {
      super(options);
      let projection = new Cesium$1.WebMercatorProjection();

      this._projection.project = function (cartographic, result) {
        result = CoordTransform.WGS84ToGCJ02(Cesium$1.Math.toDegrees(cartographic.longitude), Cesium$1.Math.toDegrees(cartographic.latitude));
        result = projection.project(new Cesium$1.Cartographic(Cesium$1.Math.toRadians(result[0]), Cesium$1.Math.toRadians(result[1])));
        return new Cesium$1.Cartesian2(result.x, result.y);
      };

      this._projection.unproject = function (cartesian, result) {
        let cartographic = projection.unproject(cartesian);
        result = CoordTransform.GCJ02ToWGS84(Cesium$1.Math.toDegrees(cartographic.longitude), Cesium$1.Math.toDegrees(cartographic.latitude));
        return new Cesium$1.Cartographic(Cesium$1.Math.toRadians(result[0]), Cesium$1.Math.toRadians(result[1]));
      };
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:15:01
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 09:15:28
   */
  const IMG_URL$3 = 'https://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
  const ELEC_URL$2 = 'https://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';
  const LOAD_MARK_URL = 'https://webst{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';

  class AmapImageryProvider extends Cesium$1.UrlTemplateImageryProvider {
    constructor(options = {}) {
      options['url'] = options.style === 'img' ? IMG_URL$3 : options.style === 'load' ? LOAD_MARK_URL : ELEC_URL$2;
      options['subdomains'] = options.subdomains || ['01', '02', '03', '04'];

      if (options.crs === 'WGS84') {
        options['tilingScheme'] = new AmapMercatorTilingScheme();
      }

      super(options);
    }

  }

  ImageryType.AMAP = 'amap';

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:05:18
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 09:05:53
   */
  const EARTH_RADIUS = 6370996.81;
  const MC_BAND = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0];
  const LL_BAND = [75, 60, 45, 30, 15, 0];
  const MC2LL = [[1.410526172116255e-8, 8.98305509648872e-6, -1.9939833816331, 2.009824383106796e2, -1.872403703815547e2, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 1.73379812e7], [-7.435856389565537e-9, 8.983055097726239e-6, -0.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 1.026014486e7], [-3.030883460898826e-8, 8.98305509983578e-6, 0.30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6.85681737e6], [-1.981981304930552e-8, 8.983055099779535e-6, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4.48277706e6], [3.09191371068437e-9, 8.983055096812155e-6, 0.00006995724062, 23.10934304144901, -0.00023663490511, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2.5551644e6], [2.890871144776878e-9, 8.983055095805407e-6, -0.00000003068298, 7.47137025468032, -0.00000353937994, -0.02145144861037, -0.00001234426596, 0.00010322952773, -0.00000323890364, 8.260885e5]];
  const LL2MC = [[-0.0015702102444, 1.113207020616939e5, 1.704480524535203e15, -1.033898737604234e16, 2.611266785660388e16, -3.51496691766537e16, 2.659570071840392e16, -1.072501245418824e16, 1.800819912950474e15, 82.5], [8.277824516172526e-4, 1.113207020463578e5, 6.477955746671608e8, -4.082003173641316e9, 1.077490566351142e10, -1.517187553151559e10, 1.205306533862167e10, -5.124939663577472e9, 9.133119359512032e8, 67.5], [0.00337398766765, 1.113207020202162e5, 4.481351045890365e6, -2.339375119931662e7, 7.968221547186455e7, -1.159649932797253e8, 9.723671115602145e7, -4.366194633752821e7, 8.477230501135234e6, 52.5], [0.00220636496208, 1.113207020209128e5, 5.175186112841131e4, 3.796837749470245e6, 9.920137397791013e5, -1.22195221711287e6, 1.340652697009075e6, -6.209436990984312e5, 1.444169293806241e5, 37.5], [-3.441963504368392e-4, 1.113207020576856e5, 2.782353980772752e2, 2.485758690035394e6, 6.070750963243378e3, 5.482118345352118e4, 9.540606633304236e3, -2.71055326746645e3, 1.405483844121726e3, 22.5], [-3.218135878613132e-4, 1.113207020701615e5, 0.00369383431289, 8.237256402795718e5, 0.46104986909093, 2.351343141331292e3, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]];

  class BaiduMercatorProjection {
    constructor() {
      this.isWgs84 = false;
    }
    /**
     *
     * @param point1
     * @param point2
     * @returns {number}
     */


    getDistanceByMC(point1, point2) {
      if (!point1 || !point2) {
        return 0;
      }

      point1 = this.convertMC2LL(point1);

      if (!point1) {
        return 0;
      }

      let x1 = this.toRadians(point1['lng']);
      let y1 = this.toRadians(point1['lat']);
      point2 = this.convertMC2LL(point2);

      if (!point2) {
        return 0;
      }

      let x2 = this.toRadians(point2['lng']);
      let y2 = this.toRadians(point2['lat']);
      return this.getDistance(x1, x2, y1, y2);
    }
    /**
     * Calculate the distance between two points according to the latitude and longitude coordinates
     * @param point1
     * @param point2
     * @returns {number|*}
     */


    getDistanceByLL(point1, point2) {
      if (!point1 || !point2) {
        return 0;
      }

      point1['lng'] = this.getLoop(point1['lng'], -180, 180);
      point1['lat'] = this.getRange(point1['lat'], -74, 74);
      point2['lng'] = this.getLoop(point2['lng'], -180, 180);
      point2['lat'] = this.getRange(point2['lat'], -74, 74);
      let x1 = this.toRadians(point1['lng']);
      let y1 = this.toRadians(point1['lat']);
      let x2 = this.toRadians(point2['lng']);
      let y2 = this.toRadians(point2['lat']);
      return this.getDistance(x1, x2, y1, y2);
    }
    /**
     * The plane cartesian coordinates are converted to latitude and longitude coordinates
     * @param point
     * @returns {Point|{lng: number, lat: number}}
     */


    convertMC2LL(point) {
      if (!point) {
        return {
          lng: 0,
          lat: 0
        };
      }

      let lnglat = {};

      if (this.isWgs84) {
        lnglat.lng = point.lng / 20037508.34 * 180;
        let mmy = point.lat / 20037508.34 * 180;
        lnglat.lat = 180 / Math.PI * (2 * Math.atan(Math.exp(mmy * Math.PI / 180)) - Math.PI / 2);
        return {
          lng: lnglat['lng'].toFixed(6),
          lat: lnglat['lat'].toFixed(6)
        };
      }

      let temp = {
        lng: Math.abs(point['lng']),
        lat: Math.abs(point['lat'])
      };
      let factor = undefined;

      for (let i = 0; i < MC_BAND.length; i++) {
        if (temp['lat'] >= MC_BAND[i]) {
          factor = MC2LL[i];
          break;
        }
      }

      lnglat = this.convertor(point, factor);
      return {
        lng: lnglat['lng'].toFixed(6),
        lat: lnglat['lat'].toFixed(6)
      };
    }
    /**
     * The latitude and longitude coordinates are converted to plane cartesian coordinates
     * @param point
     * @returns {{lng: number, lat: number}|*}
     */


    convertLL2MC(point) {
      if (!point) {
        return {
          lng: 0,
          lat: 0
        };
      }

      if (point['lng'] > 180 || point['lng'] < -180 || point['lat'] > 90 || point['lat'] < -90) {
        return point;
      }

      if (this.isWgs84) {
        let mercator = {};
        let earthRad = 6378137.0;
        mercator.lng = point.lng * Math.PI / 180 * earthRad;
        let a = point.lat * Math.PI / 180;
        mercator.lat = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
        return {
          lng: parseFloat(mercator['lng'].toFixed(2)),
          lat: parseFloat(mercator['lat'].toFixed(2))
        };
      }

      point['lng'] = this.getLoop(point['lng'], -180, 180);
      point['lat'] = this.getRange(point['lat'], -74, 74);
      let temp = {
        lng: point['lng'],
        lat: point['lat']
      };
      let factor = undefined;

      for (let i = 0; i < LL_BAND.length; i++) {
        if (temp['lat'] >= LL_BAND[i]) {
          factor = LL2MC[i];
          break;
        }
      }

      if (!factor) {
        for (let i = 0; i < LL_BAND.length; i++) {
          if (temp['lat'] <= -LL_BAND[i]) {
            factor = LL2MC[i];
            break;
          }
        }
      }

      let mc = this.convertor(point, factor);
      return {
        lng: parseFloat(mc['lng'].toFixed(2)),
        lat: parseFloat(mc['lat'].toFixed(2))
      };
    }
    /**
     *
     * @param fromPoint
     * @param factor
     * @returns {{lng: *, lat: *}}
     */


    convertor(fromPoint, factor) {
      if (!fromPoint || !factor) {
        return {
          lng: 0,
          lat: 0
        };
      }

      let x = factor[0] + factor[1] * Math.abs(fromPoint['lng']);
      let temp = Math.abs(fromPoint['lat']) / factor[9];
      let y = factor[2] + factor[3] * temp + factor[4] * temp * temp + factor[5] * temp * temp * temp + factor[6] * temp * temp * temp * temp + factor[7] * temp * temp * temp * temp * temp + factor[8] * temp * temp * temp * temp * temp * temp;
      x *= fromPoint['lng'] < 0 ? -1 : 1;
      y *= fromPoint['lat'] < 0 ? -1 : 1;
      return {
        lng: x,
        lat: y
      };
    }
    /**
     *
     * @param x1
     * @param x2
     * @param y1
     * @param y2
     * @returns {number}
     */


    getDistance(x1, x2, y1, y2) {
      return EARTH_RADIUS * Math.acos(Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1));
    }
    /**
     *
     * @param deg
     * @returns {number}
     */


    toRadians(deg) {
      return Math.PI * deg / 180;
    }
    /**
     *
     * @param rad
     * @returns {number}
     */


    toDegrees(rad) {
      return 180 * rad / Math.PI;
    }
    /**
     *
     * @param v
     * @param a
     * @param b
     * @returns {number}
     */


    getRange(v, a, b) {
      if (a != null) {
        v = Math.max(v, a);
      }

      if (b != null) {
        v = Math.min(v, b);
      }

      return v;
    }
    /**
     *
     * @param v
     * @param a
     * @param b
     * @returns {*}
     */


    getLoop(v, a, b) {
      while (v > b) {
        v -= b - a;
      }

      while (v < a) {
        v += b - a;
      }

      return v;
    }
    /**
     *
     * @param point
     * @returns {{lng: number, lat: number}|*}
     */


    lngLatToMercator(point) {
      return this.convertLL2MC(point);
    }
    /**
     *
     * @param point
     * @returns {{x: (number|*), y: (number|*)}}
     */


    lngLatToPoint(point) {
      let mercator = this.convertLL2MC(point);
      return {
        x: mercator['lng'],
        y: mercator['lat']
      };
    }
    /**
     * WebMercator transforms to latitude and longitude
     * @param point
     * @returns {Point|{lng: number, lat: number}}
     */


    mercatorToLngLat(point) {
      return this.convertMC2LL(point);
    }
    /**
     *
     * @param point
     * @returns {Point|{lng: number, lat: number}}
     */


    pointToLngLat(point) {
      let mercator = {
        lng: point.x,
        lat: point.y
      };
      return this.convertMC2LL(mercator);
    }
    /**
     * Latitude and longitude coordinates  transforms to  pixel coordinates
     * @param point
     * @param zoom
     * @param mapCenter
     * @param mapSize
     * @returns {{x: number, y: number}}
     */


    pointToPixel(point, zoom, mapCenter, mapSize) {
      if (!point) {
        return {
          x: 0,
          y: 0
        };
      }

      point = this.lngLatToMercator(point);
      let zoomUnits = this.getZoomUnits(zoom);
      let x = Math.round((point['lng'] - mapCenter['lng']) / zoomUnits + mapSize.width / 2);
      let y = Math.round((mapCenter['lat'] - point['lat']) / zoomUnits + mapSize.height / 2);
      return {
        x,
        y
      };
    }
    /**
     * Pixel coordinates transforms to latitude and longitude coordinates
     * @param pixel
     * @param zoom
     * @param mapCenter
     * @param mapSize
     * @returns {Point|{lng: number, lat: number}}
     */


    pixelToPoint(pixel, zoom, mapCenter, mapSize) {
      if (!pixel) {
        return {
          lng: 0,
          lat: 0
        };
      }

      let zoomUnits = this.getZoomUnits(zoom);
      let lng = mapCenter['lng'] + zoomUnits * (pixel.x - mapSize.width / 2);
      let lat = mapCenter['lat'] - zoomUnits * (pixel.y - mapSize.height / 2);
      let point = {
        lng,
        lat
      };
      return this.mercatorToLngLat(point);
    }
    /**
     *
     * @param zoom
     * @returns {number}
     */


    getZoomUnits(zoom) {
      return Math.pow(2, 18 - zoom);
    }

  }

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:16:54
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 09:17:22
   */

  class BaiduMercatorTilingScheme extends Cesium$1.WebMercatorTilingScheme {
    constructor(options) {
      super(options);
      let projection = new BaiduMercatorProjection();

      this._projection.project = function (cartographic, result) {
        result = result || {};
        result = CoordTransform.WGS84ToGCJ02(Cesium$1.Math.toDegrees(cartographic.longitude), Cesium$1.Math.toDegrees(cartographic.latitude));
        result = CoordTransform.GCJ02ToBD09(result[0], result[1]);
        result[0] = Math.min(result[0], 180);
        result[0] = Math.max(result[0], -180);
        result[1] = Math.min(result[1], 74.000022);
        result[1] = Math.max(result[1], -71.988531);
        result = projection.lngLatToPoint({
          lng: result[0],
          lat: result[1]
        });
        return new Cesium$1.Cartesian2(result.x, result.y);
      };

      this._projection.unproject = function (cartesian, result) {
        result = result || {};
        result = projection.mercatorToLngLat({
          lng: cartesian.x,
          lat: cartesian.y
        });
        result = CoordTransform.BD09ToGCJ02(result.lng, result.lat);
        result = CoordTransform.GCJ02ToWGS84(result[0], result[1]);
        return new Cesium$1.Cartographic(Cesium$1.Math.toRadians(result[0]), Cesium$1.Math.toRadians(result[1]));
      };

      this.resolutions = options.resolutions || [];
    }
    /**
     *
     * @param x
     * @param y
     * @param level
     * @param result
     * @returns {module:cesium.Rectangle|*}
     */


    tileXYToNativeRectangle(x, y, level, result) {
      const tileWidth = this.resolutions[level];
      const west = x * tileWidth;
      const east = (x + 1) * tileWidth;
      const north = ((y = -y) + 1) * tileWidth;
      const south = y * tileWidth;

      if (!Cesium$1.defined(result)) {
        return new Cesium$1.Rectangle(west, south, east, north);
      }

      result.west = west;
      result.south = south;
      result.east = east;
      result.north = north;
      return result;
    }
    /**
     *
     * @param position
     * @param level
     * @param result
     * @returns {undefined|*}
     */


    positionToTileXY(position, level, result) {
      const rectangle = this._rectangle;

      if (!Cesium$1.Rectangle.contains(rectangle, position)) {
        return undefined;
      }

      const projection = this._projection;
      const webMercatorPosition = projection.project(position);

      if (!Cesium$1.defined(webMercatorPosition)) {
        return undefined;
      }

      const tileWidth = this.resolutions[level];
      const xTileCoordinate = Math.floor(webMercatorPosition.x / tileWidth);
      const yTileCoordinate = -Math.floor(webMercatorPosition.y / tileWidth);

      if (!Cesium$1.defined(result)) {
        return new Cesium$1.Cartesian2(xTileCoordinate, yTileCoordinate);
      }

      result.x = xTileCoordinate;
      result.y = yTileCoordinate;
      return result;
    }

  }

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:14:14
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 09:14:40
   */
  const IMG_URL$2 = 'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46';
  const VEC_URL = 'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020';
  const CUSTOM_URL = 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid={style}';
  const TRAFFIC_URL = 'http://its.map.baidu.com:8002/traffic/TrafficTileService?time={time}&label={labelStyle}&v=016&level={z}&x={x}&y={y}&scaler=2';

  class BaiduImageryProvider {
    constructor(options = {}) {
      this._url = options.style === 'img' ? IMG_URL$2 : options.style === 'vec' ? VEC_URL : options.style === 'traffic' ? TRAFFIC_URL : CUSTOM_URL;
      this._labelStyle = options.labelStyle || 'web2D';
      this._tileWidth = 256;
      this._tileHeight = 256;
      this._maximumLevel = 18;
      this._crs = options.crs || 'BD09';

      if (options.crs === 'WGS84') {
        let resolutions = [];

        for (let i = 0; i < 19; i++) {
          resolutions[i] = 256 * Math.pow(2, 18 - i);
        }

        this._tilingScheme = new BaiduMercatorTilingScheme({
          resolutions,
          rectangleSouthwestInMeters: new Cesium$1.Cartesian2(-20037726.37, -12474104.17),
          rectangleNortheastInMeters: new Cesium$1.Cartesian2(20037726.37, 12474104.17)
        });
      } else {
        this._tilingScheme = new Cesium$1.WebMercatorTilingScheme({
          rectangleSouthwestInMeters: new Cesium$1.Cartesian2(-33554054, -33746824),
          rectangleNortheastInMeters: new Cesium$1.Cartesian2(33554054, 33746824)
        });
      }

      this._rectangle = this._tilingScheme.rectangle;
      this._credit = undefined;
      this._token = undefined;
      this._style = options.style || 'normal';
    }

    get url() {
      return this._url;
    }

    get token() {
      return this._token;
    }

    get tileWidth() {
      if (!this.ready) {
        throw new Cesium$1.DeveloperError('tileWidth must not be called before the imagery provider is ready.');
      }

      return this._tileWidth;
    }

    get tileHeight() {
      if (!this.ready) {
        throw new Cesium$1.DeveloperError('tileHeight must not be called before the imagery provider is ready.');
      }

      return this._tileHeight;
    }

    get maximumLevel() {
      if (!this.ready) {
        throw new Cesium$1.DeveloperError('maximumLevel must not be called before the imagery provider is ready.');
      }

      return this._maximumLevel;
    }

    get minimumLevel() {
      if (!this.ready) {
        throw new Cesium$1.DeveloperError('minimumLevel must not be called before the imagery provider is ready.');
      }

      return 0;
    }

    get tilingScheme() {
      if (!this.ready) {
        throw new Cesium$1.DeveloperError('tilingScheme must not be called before the imagery provider is ready.');
      }

      return this._tilingScheme;
    }

    get rectangle() {
      if (!this.ready) {
        throw new Cesium$1.DeveloperError('rectangle must not be called before the imagery provider is ready.');
      }

      return this._rectangle;
    }

    get ready() {
      return !!this._url;
    }

    get credit() {
      return this._credit;
    }

    get hasAlphaChannel() {
      return true;
    }

    getTileCredits(x, y, level) {}
    /**
     * Request Image
     * @param x
     * @param y
     * @param level
     * @returns {Promise<HTMLImageElement | HTMLCanvasElement>}
     */


    requestImage(x, y, level) {
      if (!this.ready) {
        throw new Cesium$1.DeveloperError('requestImage must not be called before the imagery provider is ready.');
      }

      let xTiles = this._tilingScheme.getNumberOfXTilesAtLevel(level);

      let yTiles = this._tilingScheme.getNumberOfYTilesAtLevel(level);

      let url = this._url.replace('{z}', level).replace('{s}', String(1)).replace('{style}', this._style).replace('{labelStyle}', this._labelStyle).replace('{time}', String(new Date().getTime()));

      if (this._crs === 'WGS84') {
        url = url.replace('{x}', String(x)).replace('{y}', String(-y));
      } else {
        url = url.replace('{x}', String(x - xTiles / 2)).replace('{y}', String(yTiles / 2 - y - 1));
      }

      return Cesium$1.ImageryProvider.loadImage(this, url);
    }

  }

  ImageryType.BAIDU = 'baidu';

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:12:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 09:13:56
   */

  const ELEC_URL$1 = 'http://mt{s}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile';
  const IMG_URL$1 = 'http://mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali';
  const TER_URL = 'http://mt{s}.google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galile';

  class GoogleImageryProvider extends Cesium$1.UrlTemplateImageryProvider {
    constructor(options = {}) {
      options['url'] = options.style === 'img' ? IMG_URL$1 : options.style === 'ter' ? TER_URL : ELEC_URL$1;
      options['subdomains'] = options.subdomains || ['1', '2', '3'];
      super(options);
    }

  }

  ImageryType.GOOGLE = 'google';

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:11:05
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 09:13:09
   */
  const MAP_URL = 'https://t{s}.tianditu.gov.cn/DataServer?T={style}_w&x={x}&y={y}&l={z}&tk={key}';

  class TdtImageryProvider extends Cesium$1.UrlTemplateImageryProvider {
    constructor(options = {}) {
      super({
        url: MAP_URL.replace(/\{style\}/g, options.style || 'vec').replace(/\{key\}/g, options.key || ''),
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        tilingScheme: new Cesium$1.WebMercatorTilingScheme(),
        maximumLevel: 18
      });
    }

  }

  ImageryType.TDT = 'tdt';

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:06:27
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 09:13:20
   */
  const IMG_URL = 'https://p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=400';
  const ELEC_URL = 'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid={style}&scene=0&version=347';

  class TencentImageryProvider extends Cesium$1.UrlTemplateImageryProvider {
    constructor(options = {}) {
      let url = options.style === 'img' ? IMG_URL : ELEC_URL;
      options['url'] = url.replace('{style}', options.style || 1);
      options['subdomains'] = options.subdomains || ['1', '2', '3'];

      if (options.style === 'img') {
        options['customTags'] = {
          sx: (imageryProvider, x, y, level) => {
            return x >> 4;
          },
          sy: (imageryProvider, x, y, level) => {
            return (1 << level) - y >> 4;
          }
        };
      }

      super(options);
    }

  }

  ImageryType.TENCENT = 'tencent';

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:01:51
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 10:03:15
   */

  class ImageryLayerFactory {
    /**
     * Create amap image layer
     * @param options
     * @returns {AmapImageryProvider}
     */
    static createAmapImageryLayer(options) {
      return new AmapImageryProvider(options);
    }
    /**
     * Create baidu image layer
     * @param options
     * @returns {BaiduImageryProvider}
     */


    static createBaiduImageryLayer(options) {
      return new BaiduImageryProvider(options);
    }
    /**
     * Create google image layer
     * @param options
     * @returns {GoogleImageryProvider}
     */


    static createGoogleImageryLayer(options) {
      return new GoogleImageryProvider(options);
    }
    /**
     * Create tdt image layer
     * @param options
     * @returns {TdtImageryProvider}
     */


    static createTdtImageryLayer(options) {
      return new TdtImageryProvider(options);
    }
    /**
     * Create tencent image layer
     * @param options
     * @returns {TencentImageryProvider}
     */


    static createTencentImageryLayer(options) {
      return new TencentImageryProvider(options);
    }
    /**
     * Create arcgis image layer
     * @param options
     * @returns {module:cesium.ArcGisMapServerImageryProvider}
     */


    static createArcGisImageryLayer(options) {
      return new Cesium$1.ArcGisMapServerImageryProvider(options);
    }
    /**
     * Create single tile image layer
     * @param options
     * @returns {module:cesium.SingleTileImageryProvider}
     */


    static createSingleTileImageryLayer(options) {
      return new Cesium$1.SingleTileImageryProvider(options);
    }
    /**
     * Create WMS image layer
     * @param options
     * @returns {module:cesium.WebMapServiceImageryProvider}
     */


    static createWMSImageryLayer(options) {
      return new Cesium$1.WebMapServiceImageryProvider(options);
    }
    /**
     * Create WMTS image layer
     * @param options
     * @returns {module:cesium.WebMapTileServiceImageryProvider}
     */


    static createWMTSImageryLayer(options) {
      return new Cesium$1.WebMapTileServiceImageryProvider(options);
    }
    /**
     * Create xyz image layer
     * @param options
     * @returns {module:cesium.UrlTemplateImageryProvider}
     */


    static createXYZImageryLayer(options) {
      return new Cesium$1.UrlTemplateImageryProvider(options);
    }
    /**
     * Create coord image layer
     * @param options
     * @returns {module:cesium.TileCoordinatesImageryProvider}
     */


    static createCoordImageryLayer(options) {
      return new Cesium$1.TileCoordinatesImageryProvider(options);
    }
    /**
     * Create mapbox image layer
     * @param  options 
     * @returns {module: cesium.MapboxImageryProvider}
     */


    static createMapboxImageryLayer(options) {
      return new Cesium$1.MapboxImageryProvider(options);
    }
    /**
     * Create mapboxStyle image layer
     * @param  options 
     * @returns 
     */


    static createMapboxStyleImageryLayer(options) {
      return new Cesium$1.MapboxStyleImageryProvider(options);
    }
    /**
     * Create Imagery Layer
     * @param type
     * @param options
     * @returns {any}
     */


    static createImageryLayer(type, options) {
      let imageryLayer = undefined;

      switch (type) {
        case ImageryType.AMAP:
          imageryLayer = this.createAmapImageryLayer(options);
          break;

        case ImageryType.BAIDU:
          imageryLayer = this.createBaiduImageryLayer(options);
          break;

        case ImageryType.GOOGLE:
          imageryLayer = this.createGoogleImageryLayer(options);
          break;

        case ImageryType.TDT:
          imageryLayer = this.createTdtImageryLayer(options);
          break;

        case ImageryType.TENCENT:
          imageryLayer = this.createTencentImageryLayer(options);
          break;

        case ImageryType.ARCGIS:
          imageryLayer = this.createArcGisImageryLayer(options);
          break;

        case ImageryType.SINGLE_TILE:
          imageryLayer = this.createSingleTileImageryLayer(options);
          break;

        case ImageryType.WMS:
          imageryLayer = this.createWMSImageryLayer(options);
          break;

        case ImageryType.WMTS:
          imageryLayer = this.createWMTSImageryLayer(options);
          break;

        case ImageryType.XYZ:
          imageryLayer = this.createXYZImageryLayer(options);
          break;

        case ImageryType.COORD:
          imageryLayer = this.createCoordImageryLayer(options);
          break;

        case ImageryType.MAPBOX:
          imageryLayer = this.createMapboxImageryLayer(options);
          break;

        case ImageryType.MAPBOX_STYLE:
          imageryLayer = this.createMapboxStyleImageryLayer(options);
      }

      return imageryLayer;
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:27:25
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 09:27:45
   */
  let LayerType = {};

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-11 12:32:06
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:40:26
   */

  class Layer {
    constructor(id) {
      this._id = Util$1.uuid();
      this._bid = id || Util$1.uuid();
      this._delegate = undefined;
      this._viewer = undefined;
      this._state = undefined;
      this._show = true;
      this._cache = {};
      this._attr = {};
      this._layerEvent = new LayerEvent();

      this._layerEvent.on(LayerEventType.ADD, this._onAdd, this);

      this._layerEvent.on(LayerEventType.REMOVE, this._onRemove, this);

      this._state = undefined;
      this.type = undefined;
    }

    get layerId() {
      return this._id;
    }

    get id() {
      return this._bid;
    }

    get delegate() {
      return this._delegate;
    }

    set show(show) {
      this._show = show;
      this._delegate && (this._delegate.show = this._show);
    }

    get show() {
      return this._show;
    }

    get layerEvent() {
      return this._layerEvent;
    }

    set attr(attr) {
      this._attr = attr;
    }

    get attr() {
      return this._attr;
    }

    get state() {
      return this._state;
    }
    /**
     * The hook for added
     * @private
     */


    _addedHook() {}
    /**
     * The hook for removed
     * @private
     */


    _removedHook() {}
    /**
     * The layer added callback function
     * Subclasses need to be overridden
     * @param viewer
     * @private
     */


    _onAdd(viewer) {
      this._viewer = viewer;

      if (!this._delegate) {
        return;
      }

      if (this._delegate instanceof Cesium__default['default'].PrimitiveCollection) {
        this._viewer.scene.primitives.add(this._delegate);
      } else {
        this._viewer.dataSources.add(this._delegate);
      }

      this._addedHook && this._addedHook();
      this._state = State$1.ADDED;
    }
    /**
     * The layer added callback function
     * Subclasses need to be overridden
     * @private
     */


    _onRemove() {
      if (!this._delegate) {
        return;
      }

      if (this._viewer) {
        this._cache = {};

        if (this._delegate instanceof Cesium__default['default'].PrimitiveCollection) {
          this._delegate.removeAll();

          this._viewer.scene.primitives.remove(this._delegate);
        } else if (this._delegate.then) {
          this._delegate.then(dataSource => {
            dataSource.entities.removeAll();
          });

          this._viewer.dataSources.remove(this._delegate);
        } else {
          this._delegate.entities && this._delegate.entities.removeAll();

          this._viewer.dataSources.remove(this._delegate);
        }

        this._removedHook && this._removedHook();
        this._state = State$1.REMOVED;
      }
    }
    /**
     * The layer add overlay
     * @param overlay
     * @private
     */


    _addOverlay(overlay) {
      if (overlay && overlay.overlayEvent && !this._cache.hasOwnProperty(overlay.overlayId)) {
        overlay.overlayEvent.fire(OverlayEventType.ADD, this);
        this._cache[overlay.overlayId] = overlay;

        if (this._state === State$1.CLEARED) {
          this._state = State$1.ADDED;
        }
      }
    }
    /**
     * The layer remove overlay
     * @param overlay
     * @private
     */


    _removeOverlay(overlay) {
      if (overlay && overlay.overlayEvent && this._cache.hasOwnProperty(overlay.overlayId)) {
        overlay.overlayEvent.fire(OverlayEventType.REMOVE, this);
        delete this._cache[overlay.overlayId];
      }
    }
    /**
     * Add overlay
     * @param overlay
     * @returns {Layer}
     */


    addOverlay(overlay) {
      this._addOverlay(overlay);

      return this;
    }
    /**
     * Add overlays
     * @param overlays
     * @returns {Layer}
     */


    addOverlays(overlays) {
      if (Array.isArray(overlays)) {
        overlays.forEach(item => {
          this._addOverlay(item);
        });
      }

      return this;
    }
    /**
     * Remove overlay
     * @param overlay
     * @returns {Layer}
     */


    removeOverlay(overlay) {
      this._removeOverlay(overlay);

      return this;
    }
    /**
     * Returns the overlay by overlayId
     * @param overlayId
     * @returns {*|undefined}
     */


    getOverlay(overlayId) {
      return this._cache[overlayId] || undefined;
    }
    /**
     * Returns the overlay by bid
     * @param id
     * @returns {any}
     */


    getOverlayById(id) {
      let overlay = undefined;
      Object.keys(this._cache).forEach(key => {
        if (this._cache[key].id === id) {
          overlay = this._cache[key];
        }
      });
      return overlay;
    }
    /**
     * Returns the overlays by attrName and AttrVal
     * @param attrName
     * @param attrVal
     * @returns {[]}
     */


    getOverlaysByAttr(attrName, attrVal) {
      let result = [];
      this.eachOverlay(item => {
        if (item.attr[attrName] === attrVal) {
          result.push(item);
        }
      }, this);
      return result;
    }
    /**
     * Iterate through each overlay and pass it as an argument to the callback function
     * @param method
     * @param context
     * @returns {Layer}
     */


    eachOverlay(method, context) {
      Object.keys(this._cache).forEach(key => {
        method && method.call(context || this, this._cache[key]);
      });
      return this;
    }
    /**
     * Returns all overlays
     * @returns {[]}
     */


    getOverlays() {
      let result = [];
      Object.keys(this._cache).forEach(key => {
        result.push(this._cache[key]);
      });
      return result;
    }
    /**
     * Clears all overlays
     * Subclasses need to be overridden
     */


    clear() {}
    /**
     * Removes from the viewer
     */


    remove() {
      if (this._viewer) {
        this._viewer.removeLayer(this);
      }
    }
    /**
     * Adds to the viewer
     * @param viewer
     * @returns {Layer}
     */


    addTo(viewer) {
      if (viewer && viewer.addLayer) {
        viewer.addLayer(this);
      }

      return this;
    }
    /**
     * sets the style, the style will apply to every overlay of the layer
     * Subclasses need to be overridden
     * @param style
     */


    setStyle(style) {}
    /**
     * Registers Type
     * @param type
     */


    static registerType(type) {
      if (type) {
        LayerType[type.toLocaleUpperCase()] = type.toLocaleLowerCase();
      }
    }
    /**
     * Returns type
     * @param type
     * @returns {*|undefined}
     */


    static getLayerType(type) {
      return LayerType[type.toLocaleUpperCase()] || undefined;
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:23:42
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:41:33
   */

  class LayerGroup {
    constructor(id) {
      this._id = id || Util$1.uuid();
      this._cache = {};
      this._show = true;
      this._viewer = undefined;
      this._layerGroupEvent = new LayerGroupEvent();

      this._layerGroupEvent.on(LayerGroupEventType.ADD, this._onAdd, this);

      this._layerGroupEvent.on(LayerGroupEventType.REMOVE, this._onRemove, this);

      this.type = Layer.getLayerType('layer_group');
      this._state = State$1.INITIALIZED;
    }

    get id() {
      return this._id;
    }

    set show(show) {
      this._show = show;
      Object.keys(this._cache).forEach(key => {
        this._cache[key].show = this._show;
      });
    }

    get show() {
      return this._show;
    }

    get layerGroupEvent() {
      return this._layerGroupEvent;
    }

    get state() {
      return this._state;
    }
    /**
     *
     * @param viewer
     * @private
     */


    _onAdd(viewer) {
      this._viewer = viewer;
      Object.keys(this._cache).forEach(key => {
        this._viewer.addLayer(this._cache[key]);
      });
      this._state = State$1.ADDED;
    }
    /**
     *
     * @private
     */


    _onRemove() {
      Object.keys(this._cache).forEach(key => {
        this._viewer && this._viewer.removeLayer(this._cache[key]);
      });
      this._cache = {};
      this._state = State$1.REMOVED;
    }
    /**
     * Adds a layer
     * @param layer
     * @returns {LayerGroup}
     */


    addLayer(layer) {
      if (!Object(this._cache).hasOwnProperty(layer.id)) {
        this._cache[layer.id] = layer;
        this._viewer && this._viewer.addLayer(layer);
      }

      return this;
    }
    /**
     * Removes a layer
     * @param layer
     * @returns {LayerGroup}
     */


    removeLayer(layer) {
      if (Object(this._cache).hasOwnProperty(layer.id)) {
        this._viewer && this._viewer.removeLayer(layer);
        delete this._cache[layer.id];
      }

      return this;
    }
    /**
     * Returns a layer by id
     * @param id
     * @returns {*|undefined}
     */


    getLayer(id) {
      return this._cache[id] || undefined;
    }
    /**
     * Returns all layers
     * @returns {[]}
     */


    getLayers() {
      let result = [];
      Object.keys(this._cache).forEach(key => {
        result.push(this._cache[key]);
      });
      return result;
    }
    /**
     * Adds to the viewer
     * @param viewer
     * @returns {LayerGroup}
     */


    addTo(viewer) {
      if (viewer && viewer.addLayerGroup) {
        viewer.addLayerGroup(this);
      }

      return this;
    }
    /**
     *
     * @returns {LayerGroup}
     */


    remove() {
      this._viewer && this._viewer.removeLayerGroup(this);
      return this;
    }

  }

  Layer.registerType('layer_group');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 10:05:59
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 10:09:03
   */

  class VectorLayer extends Layer {
    constructor(id) {
      super(id);
      this._delegate = new Cesium__default['default'].CustomDataSource(id);
      this.type = Layer.getLayerType('vector');
      this._state = State$1.INITIALIZED;
    }

    clear() {
      this._delegate.entities && this._delegate.entities.removeAll();
      this._cache = {};
      this._state = State$1.CLEARED;
      return this;
    }

  }

  Layer.registerType('vector');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 15:57:43
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 16:06:37
   */

  class Position {
    constructor(lng, lat, alt, heading, pitch, roll) {
      this._lng = lng || 0;
      this._lat = lat || 0;
      this._alt = alt || 0;
      this._heading = heading || 0;
      this._pitch = pitch || 0;
      this._roll = roll || 0;
    }

    set lng(lng) {
      this._lng = +lng;
    }

    get lng() {
      return this._lng;
    }

    set lat(lat) {
      this._lat = +lat;
    }

    get lat() {
      return this._lat;
    }

    set alt(alt) {
      this._alt = +alt;
    }

    get alt() {
      return this._alt;
    }

    set heading(heading) {
      this._heading = +heading;
    }

    get heading() {
      return this._heading;
    }

    set pitch(pitch) {
      this._pitch = +pitch;
    }

    get pitch() {
      return this._pitch;
    }

    set roll(roll) {
      this._roll = +roll;
    }

    get roll() {
      return this._roll;
    }

    serialize() {
      let position = new Position(this._lng, this._lat, this._alt, this._heading, this._pitch, this._roll);
      return JSON.stringify(position);
    }
    /**
     * Calculate the distance between two positions
     * @param target
     * @returns {number}
     */


    distance(target) {
      if (!target || !(target instanceof Position)) {
        return 0;
      }

      return Cesium$1.Cartesian3.distance(Transform$1.transformWGS84ToCartesian(this), Transform$1.transformWGS84ToCartesian(target));
    }
    /**
     *
     * @returns {Position}
     */


    copy() {
      let position = new Position();
      position.lng = this.lng || 0;
      position.lat = this.lat || 0;
      position.alt = this.alt || 0;
      position.heading = this.heading || 0;
      position.pitch = this.pitch || 0;
      position.roll = this.roll || 0;
      return position;
    }
    /**
     *
     * @returns {*[]}
     */


    toArray() {
      return [this.lng, this.lat, this.alt, this.heading, this.pitch, this.roll];
    }
    /**
     *
     * @returns {string}
     */


    toString() {
      return `${this.lng},${this.lat},${this.alt},${this.heading},${this.pitch},${this.roll}`;
    }
    /**
     *
     * @param arr
     * @returns {Position}
     */


    static fromArray(arr) {
      let position = new Position();

      if (Array.isArray(arr)) {
        position.lng = arr[0] || 0;
        position.lat = arr[1] || 0;
        position.alt = arr[2] || 0;
        position.heading = arr[3] || 0;
        position.pitch = arr[4] || 0;
        position.roll = arr[5] || 0;
      }

      return position;
    }
    /**
     *
     * @param str
     * @returns {Position}
     */


    static fromString(str) {
      let position = new Position();

      if (str && typeof str === 'string') {
        let arr = str.split(',');
        position = this.fromArray(arr);
      }

      return position;
    }
    /**
     * Deserialize
     * @param valStr
     * @returns {Position}
     */


    static deserialize(valStr) {
      let position = new Position();
      let obj = JSON.parse(valStr);

      if (obj) {
        position.lng = obj.lng || 0;
        position.lat = obj.lat || 0;
        position.alt = obj.alt || 0;
        position.heading = obj.heading || 0;
        position.pitch = obj.pitch || 0;
        position.roll = obj.roll || 0;
      }

      return position;
    }
    /**
     *  Returns position from coord String
     * @param str
     * @returns {Position}
     */


    static fromCoordString(str) {
      let position = new Position();

      if (str && typeof str === 'string') {
        position = this.fromCoordArray(str.split(','));
      }

      return position;
    }
    /**
     * Returns position from coord array
     * @param arr
     * @returns {Position}
     */


    static fromCoordArray(arr) {
      let position = new Position();

      if (Array.isArray(arr)) {
        position.lng = arr[0] || 0;
        position.lat = arr[1] || 0;
        position.alt = arr[2] || 0;
      }

      return position;
    }

  }

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-11 14:48:12
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 16:06:01
   */
  const WMP = new Cesium$1.WebMercatorProjection();

  class Transform$1 {
    /**
     * Transforms Cartesian To WGS84
     * @param cartesian
     * @returns {Position}
     */
    static transformCartesianToWGS84(cartesian) {
      if (cartesian) {
        let cartographic = Cesium$1.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
        return new Position(Cesium$1.Math.toDegrees(cartographic.longitude), Cesium$1.Math.toDegrees(cartographic.latitude), cartographic.height);
      }

      return new Position(0, 0);
    }
    /**
     * Transforms WGS84 To Cartesian
     * @param position
     * @returns {Cartesian3}
     */


    static transformWGS84ToCartesian(position) {
      return position ? Cesium$1.Cartesian3.fromDegrees(position.lng, position.lat, position.alt, Cesium$1.Ellipsoid.WGS84) : Cesium$1.Cartesian3.ZERO;
    }
    /**
     * Transforms WGS84 To Cartographic
     * @param position
     * @returns {Cartographic}
     */


    static transformWGS84ToCartographic(position) {
      return position ? Cesium$1.Cartographic.fromDegrees(position.lng, position.lat, position.alt) : Cesium$1.Cartographic.ZERO;
    }
    /**
     * Transforms Cartesian Array To WGS84 Array
     * @param cartesianArr
     * @returns {*|*[]}
     */


    static transformCartesianArrayToWGS84Array(cartesianArr) {
      return cartesianArr ? cartesianArr.map(item => this.transformCartesianToWGS84(item)) : [];
    }
    /**
     * Transforms WGS84 Array To Cartesian Array
     * @param WGS84Arr
     * @returns {*|*[]}
     */


    static transformWGS84ArrayToCartesianArray(WGS84Arr) {
      return WGS84Arr ? WGS84Arr.map(item => this.transformWGS84ToCartesian(item)) : [];
    }
    /**
     * Transforms WGS84 To Mercator
     * @param position
     * @returns {Position}
     */


    static transformWGS84ToMercator(position) {
      let mp = WMP.project(Cesium$1.Cartographic.fromDegrees(position.lng, position.lat, position.alt));
      return new Position(mp.x, mp.y, mp.z);
    }
    /**
     * Transforms Mercator To WGS84
     * @param position
     * @returns {Position}
     */


    static transformMercatorToWGS84(position) {
      let mp = WMP.unproject(new Cesium$1.Cartesian3(position.lng, position.lat, position.alt));
      return new Position(Cesium$1.Math.toDegrees(mp.longitude), Cesium$1.Math.toDegrees(mp.latitude), mp.height);
    }
    /**
     * Transforms Window To WGS84
     * @param position
     * @param viewer
     * @returns {Position}
     */


    static transformWindowToWGS84(position, viewer) {
      let scene = viewer.scene;
      let cartesian;

      if (scene.mode === Cesium$1.SceneMode.SCENE3D) {
        let ray = scene.camera.getPickRay(position);
        cartesian = scene.globe.pick(ray, scene);
      } else {
        cartesian = scene.camera.pickEllipsoid(position, Cesium$1.Ellipsoid.WGS84);
      }

      return this.transformCartesianToWGS84(cartesian);
    }
    /**
     * Transforms WGS84 To Window
     * @param position
     * @param viewer
     * @returns {Cartesian2}
     */


    static transformWGS84ToWindow(position, viewer) {
      let scene = viewer.scene;
      return Cesium$1.SceneTransforms.wgs84ToWindowCoordinates(scene, this.transformWGS84ToCartesian(position));
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 10:56:58
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 10:57:44
   */

  class Parse$1 {
    /**
     * Parses all kinds of coordinates to position
     * @param position
     * @returns {Position}
     */
    static parsePosition(position) {
      let result = new Position();

      if (!position) {
        return result;
      }

      if (typeof position === 'string') {
        result = Position.fromString(position);
      } else if (Array.isArray(position)) {
        result = Position.fromArray(position);
      } else if (!(Object(position) instanceof Position) && Object(position).hasOwnProperty('lng') && Object(position).hasOwnProperty('lat')) {
        result = Position.fromObject(position);
      } else if (Object(position) instanceof Position) {
        result = position;
      }

      return result;
    }
    /**
     * Parses all kinds of coordinates array to position array
     * @param positions
     * @returns {unknown[]}
     */


    static parsePositions(positions) {
      if (typeof positions === 'string') {
        if (positions.indexOf('#') >= 0) {
          throw new Error('the positions invalid');
        }

        positions = positions.split(';');
      }

      return positions.map(item => {
        if (typeof item === 'string') {
          return Position.fromString(item);
        } else if (Array.isArray(item)) {
          return Position.fromArray(item);
        } else if (!(Object(item) instanceof Position) && Object(item).hasOwnProperty('lng') && Object(item).hasOwnProperty('lat')) {
          return Position.fromObject(item);
        } else if (Object(item) instanceof Position) {
          return item;
        }
      });
    }
    /**
     * Parses point position to array
     * @param position
     * @returns {*[]}
     */


    static parsePointCoordToArray(position) {
      position = this.parsePosition(position);
      return [position.lng, position.lat];
    }
    /**
     * Parses polyline positions to array
     * @param positions
     * @returns {[]}
     */


    static parsePolylineCoordToArray(positions) {
      let result = [];
      positions = this.parsePositions(positions);
      positions.forEach(item => {
        result.push([item.lng, item.lat]);
      });
      return result;
    }
    /**
     * Parses polygon positions to array
     * @param positions
     * @returns {[][]}
     */


    static parsePolygonCoordToArray(positions) {
      let result = [];
      positions = this.parsePositions(positions);
      positions.forEach(item => {
        result.push([item.lng, item.lat]);
      });
      return [result];
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-11 13:12:30
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:08:58
   */
  let OverlayType = {};

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 10:14:22
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:44:38
   */

  class Overlay {
    constructor() {
      this._id = Util$1.uuid();
      this._bid = Util$1.uuid(); // Business id

      this._delegate = undefined;
      this._layer = undefined;
      this._state = undefined;
      this._show = true;
      this._style = {};
      this._attr = {};
      this._allowDrillPicking = false;
      this._contextMenu = [];
      this._overlayEvent = new OverlayEvent();
      this.type = undefined;
      this.on(OverlayEventType.ADD, this._onAdd, this);
      this.on(OverlayEventType.REMOVE, this._onRemove, this);
    }

    get overlayId() {
      return this._id;
    }

    set id(id) {
      this._bid = id;
      return this;
    }

    get id() {
      return this._bid;
    }

    set show(show) {
      this._show = show;
      this._delegate && (this._delegate.show = this._show);
      return this;
    }

    get show() {
      return this._show;
    }

    set attr(attr) {
      this._attr = attr;
      return this;
    }

    get attr() {
      return this._attr;
    }

    set allowDrillPicking(allowDrillPicking) {
      this._allowDrillPicking = allowDrillPicking;
      return this;
    }

    get allowDrillPicking() {
      return this._allowDrillPicking;
    }

    get overlayEvent() {
      return this._overlayEvent;
    }

    get delegate() {
      return this._delegate;
    }

    get state() {
      return this._state;
    }

    set contextMenu(menus) {
      this._contextMenu = menus;
      return this;
    }

    get contextMenu() {
      return this._contextMenu;
    }
    /**
     * The hook for mount layer
     * Subclasses need to be overridden
     * @private
     */


    _mountedHook() {}
    /**
     * The hook for added
     * @returns {boolean}
     * @private
     */


    _addedHook() {
      if (!this._delegate) {
        return false;
      }

      this._delegate.layerId = this._layer?.layerId;
      this._delegate.overlayId = this._id;
    }
    /**
     * The hook for removed
     * Subclasses need to be overridden
     * @private
     */


    _removedHook() {}
    /**
     * Add handler
     * @param layer
     * @private
     */


    _onAdd(layer) {
      if (!layer) {
        return;
      }

      this._layer = layer;
      this._mountedHook && this._mountedHook(); // for Entity

      if (this._layer?.delegate?.entities && this._delegate) {
        this._layer.delegate.entities.add(this._delegate);
      } else if (this._layer?.delegate?.add && this._delegate) {
        // for Primitive
        this._layer.delegate.add(this._delegate);
      }

      this._addedHook && this._addedHook();
      this._state = State$1.ADDED;
    }
    /**
     * Remove handler
     * @private
     */


    _onRemove() {
      if (!this._layer || !this._delegate) {
        return;
      } // for Entity


      if (this._layer?.delegate?.entities) {
        this._layer.delegate.entities.remove(this._delegate);
      } else if (this._layer?.delegate?.remove) {
        // for Primitive
        this._layer.delegate.remove(this._delegate);
      }

      this._removedHook && this._removedHook();
      this._state = State$1.REMOVED;
    }
    /**
     * Sets Text with Style
     * @param text
     * @param textStyle
     * @returns {Overlay}
     */


    setLabel(text, textStyle) {
      this._delegate && (this._delegate.label = { ...textStyle,
        text: text
      });
      return this;
    }
    /**
     * Sets style
     * @param style
     * @returns {Overlay}
     */


    setStyle(style) {
      return this;
    }
    /**
     * Removes from layer
     * @returns {Overlay}
     */


    remove() {
      if (this._layer) {
        this._layer.removeOverlay(this);
      }

      return this;
    }
    /**
     * adds to layer
     * @param layer
     * @returns {Overlay}
     */


    addTo(layer) {
      if (layer && layer.addOverlay) {
        layer.addOverlay(this);
      }

      return this;
    }
    /**
     * Subscribe event
     * @param type
     * @param callback
     * @param context
     * @returns {Overlay}
     */


    on(type, callback, context) {
      this._overlayEvent.on(type, callback, context || this);

      return this;
    }
    /**
     * Unsubscribe event
     * @param type
     * @param callback
     * @param context
     * @returns {Overlay}
     */


    off(type, callback, context) {
      this._overlayEvent.off(type, callback, context || this);

      return this;
    }
    /**
     * Trigger subscription event
     * @param type
     * @param params
     * @returns {Overlay}
     */


    fire(type, params) {
      this._overlayEvent.fire(type, params);

      return this;
    }
    /**
     *
     * @param type
     */


    static registerType(type) {
      if (type) {
        OverlayType[type.toLocaleUpperCase()] = type.toLocaleLowerCase();
      }
    }
    /**
     *
     * @param type
     * @returns {*|undefined}
     */


    static getOverlayType(type) {
      return OverlayType[type.toLocaleUpperCase()] || undefined;
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:18:37
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:53:38
   */

  class Billboard extends Overlay {
    constructor(position, icon) {
      super();
      this._delegate = new Cesium__default['default'].Entity({
        billboard: {}
      });
      this._position = Parse$1.parsePosition(position);
      this._icon = icon;
      this._size = [32, 32];
      this.type = Overlay.getOverlayType('billboard');
      this._state = State$1.INITIALIZED;
    }

    set position(position) {
      this._position = Parse$1.parsePosition(position);
      this._delegate.position = Transform$1.transformWGS84ToCartesian(this._position);
      return this;
    }

    get position() {
      return this._position;
    }

    set icon(icon) {
      this._icon = icon;
      this._delegate.billboard.image = this._icon;
      return this;
    }

    get icon() {
      return this._icon;
    }

    set size(size) {
      if (!Array.isArray(size)) {
        throw new Error('Billboard: the size invalid');
      }

      this._size = size;
      this._delegate.billboard.width = this._size[0] || 32;
      this._delegate.billboard.height = this._size[1] || 32;
      return this;
    }

    get size() {
      return this._size;
    }

    _mountedHook() {
      /**
       * set the location
       */
      this.position = this._position;
      /**
       *  initialize the Overlay parameter
       */

      this.icon = this._icon;
      this.size = this._size;
    }
    /**
     *
     * @param style
     * @returns {Billboard}
     */


    setStyle(style) {
      if (!style || Object.keys(style).length === 0) {
        return this;
      }

      delete style['image'] && delete style['width'] && delete style['height'];
      this._style = style;
      Util$1.merge(this._delegate.billboard, this._style);
      return this;
    }
    /**
     * Parse from entity
     * @param entity
     * @returns {any}
     */


    static fromEntity(entity) {
      let billboard = undefined;
      let now = Cesium__default['default'].JulianDate.now();
      let position = Transform$1.transformCartesianToWGS84(entity.position.getValue(now));

      if (entity.billboard) {
        billboard = new Billboard(position, entity.billboard.image.getValue(now));
        billboard.attr = { ...entity?.properties?.getValue(now)
        };
      }

      return billboard;
    }

  }

  Overlay.registerType('billboard');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:51:00
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 15:01:57
   */

  class Box extends Overlay {
    constructor(position, length, width, height) {
      super();
      this._position = Parse$1.parsePosition(position);
      this._length = length;
      this._width = width;
      this._height = height;
      this._delegate = new Cesium$1.Entity({
        box: {
          dimensions: {
            x: +this._length,
            y: +this._width,
            z: +this._height
          }
        }
      });
      this.type = Overlay.getOverlayType('box');
      this._state = State$1.INSTALLED;
    }

    set position(position) {
      this._position = Parse$1.parsePosition(position);
      this._delegate.position = Transform$1.transformWGS84ToCartesian(this._position);
      this._delegate.orientation = Cesium$1.Transforms.headingPitchRollQuaternion(Transform$1.transformWGS84ToCartesian(this._position), new Cesium$1.HeadingPitchRoll(Cesium$1.Math.toRadians(this._position.heading), Cesium$1.Math.toRadians(this._position.pitch), Cesium$1.Math.toRadians(this._position.roll)));
      return this;
    }

    get position() {
      return this._position;
    }

    set length(length) {
      this._length = length || 0;
      this._delegate.box.dimensions.x = +this._length;
      return this;
    }

    get length() {
      return this._length;
    }

    set width(width) {
      this._width = width || 0;
      this._delegate.box.dimensions.y = +this._width;
      return this;
    }

    get width() {
      return this._width;
    }

    set height(height) {
      this._height = height || 0;
      this._delegate.box.dimensions.z = +this._height;
      return this;
    }

    get height() {
      return this._height;
    }

    _mountedHook() {
      this._position = this._position;
    }

    setStyle(style) {
      if (Object.keys(style).length === 0) {
        return this;
      }

      delete style['length'] && delete style['width'] && delete style['height'];
      this._style = style;
      Util.merge(this._delegate.box, this._style);
      return this;
    }

  }

  Overlay.registerType('box');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:17:35
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:55:19
   */

  class Circle extends Overlay {
    constructor(center, radius) {
      super();
      this._delegate = new Cesium__default['default'].Entity({
        polygon: {}
      });
      this._center = Parse$1.parsePosition(center);
      this._radius = +radius || 0;
      this._rotateAmount = 0;
      this._stRotation = 0;
      this.type = Overlay.getOverlayType('circle');
      this._state = State$1.INITIALIZED;
    }

    set center(center) {
      this._center = Parse$1.parsePosition(center);
      this._delegate.polygon.hierarchy = this._computeHierarchy();
      return this;
    }

    get center() {
      return this._center;
    }

    set radius(radius) {
      this._radius = +radius;
      this._delegate.polygon.hierarchy = this._computeHierarchy();
      return this;
    }

    get radius() {
      return this._radius;
    }

    set rotateAmount(amount) {
      this._rotateAmount = +amount;
      this._delegate.polygon.stRotation = new Cesium__default['default'].CallbackProperty(time => {
        this._stRotation += this._rotateAmount;

        if (this._stRotation >= 360 || this._stRotation <= -360) {
          this._stRotation = 0;
        }

        return Cesium__default['default'].Math.toRadians(this._stRotation);
      });
      return this;
    }

    get rotateAmount() {
      return this._rotateAmount;
    }
    /**
     *
     * @private
     */


    _computeHierarchy() {
      let result = new Cesium__default['default'].PolygonHierarchy();
      let cep = Cesium__default['default'].EllipseGeometryLibrary.computeEllipsePositions({
        center: Transform$1.transformWGS84ToCartesian(this._center),
        semiMajorAxis: this._radius,
        semiMinorAxis: this._radius,
        rotation: 0,
        granularity: 0.005
      }, false, true);
      let pnts = Cesium__default['default'].Cartesian3.unpackArray(cep.outerPositions);
      pnts.push(pnts[0]);
      result.positions = pnts;
      return result;
    }

    _mountedHook() {
      /**
       * set the location
       */
      this.center = this._center;
    }
    /**
     *
     * @param style
     * @returns {Circle}
     */


    setStyle(style) {
      if (!style || Object.keys(style).length === 0) {
        return this;
      }

      delete style['positions'];
      this._style = style;
      Util$1.merge(this._delegate.polygon, this._style);
      return this;
    }

  }

  Overlay.registerType('circle');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 15:02:14
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 15:06:29
   */

  class Corridor extends Overlay {
    constructor(positions) {
      super();
      this._positions = Parse$1.parsePositions(positions);
      this._delegate = new Cesium__default['default'].Entity({
        corridor: {}
      });
      this.type = Overlay.getOverlayType('corridor');
      this._state = State$1.INITIALIZED;
    }

    set positions(positions) {
      this._positions = Parse$1.parsePositions(positions);
      this._delegate.corridor.positions = Transform.transformWGS84ArrayToCartesianArray(this._positions);
      return this;
    }

    get positions() {
      return this._positions;
    }

    _mountedHook() {
      /**
       *  set the location
       */
      this.positions = this._positions;
    }
    /**
     *
     * @param {*} text
     * @param {*} textStyle
     */


    setLabel(text, textStyle) {
      return this;
    }
    /**
     * Sets Style
     * @param style
     * @returns {Corridor}
     */


    setStyle(style) {
      if (Object.keys(style).length === 0) {
        return this;
      }

      delete style['positions'];
      this._style = style;
      Util.merge(this._delegate.corridor, this._style);
      return this;
    }
    /**
     * Parses from entity
     * @param entity
     * @returns {Corridor|any}
     */


    static fromEntity(entity) {
      let corridor = undefined;
      let now = Cesium__default['default'].JulianDate.now();

      if (entity.polyline) {
        let positions = Transform.transformCartesianArrayToWGS84Array(entity.polyline.positions.getValue(now));
        corridor = new Corridor(positions);
        corridor.attr = { ...entity?.properties?.getValue(now)
        };
      }

      return corridor;
    }

  }

  Overlay.registerType('corridor');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 15:06:44
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 15:09:43
   */

  class Cylinder extends Overlay {
    constructor(position, length, topRadius, bottomRadius) {
      super();
      this._position = Parse$1.parsePosition(position);
      this._length = +length || 0;
      this._topRadius = +topRadius || 0;
      this._bottomRadius = +bottomRadius || 0;
      this._delegate = new Cesium__default['default'].Entity({
        cylinder: {}
      });
      this.type = Overlay.getOverlayType('cylinder');
      this._state = State$1.INITIALIZED;
    }

    set position(position) {
      this._position = Parse$1.parsePosition(position);
      this._delegate.position = Transform.transformWGS84ToCartesian(this._position);
      this._delegate.orientation = Cesium__default['default'].Transforms.headingPitchRollQuaternion(Transform.transformWGS84ToCartesian(this._position), new Cesium__default['default'].HeadingPitchRoll(Cesium__default['default'].Math.toRadians(this._position.heading), Cesium__default['default'].Math.toRadians(this._position.pitch), Cesium__default['default'].Math.toRadians(this._position.roll)));
      return this;
    }

    get position() {
      return this._position;
    }

    set length(length) {
      this._length = +length || 0;
      this._delegate.cylinder.length = this._length;
      return this;
    }

    get length() {
      return this._length;
    }

    set topRadius(topRadius) {
      this._topRadius = +topRadius || 0;
      this._delegate.cylinder.topRadius = this._topRadius;
      return this;
    }

    get topRadius() {
      return this._topRadius;
    }

    set bottomRadius(bottomRadius) {
      this._bottomRadius = +bottomRadius || 0;
      this._delegate.cylinder.bottomRadius = this._bottomRadius;
      return this;
    }

    get bottomRadius() {
      return this._bottomRadius;
    }

    _mountedHook() {
      /**
       * set the location
       */
      this.position = this._position;
      /**
       *  initialize the Overlay parameter
       */

      this.length = this._length;
      this.topRadius = this._topRadius;
      this.bottomRadius = this._bottomRadius;
    }
    /**
     *
     * @param {*} text
     * @param {*} textStyle
     */


    setLabel(text, textStyle) {
      return this;
    }
    /**
     * Sets Style
     * @param style
     * @returns {Cylinder}
     */


    setStyle(style) {
      if (Object.keys(style).length === 0) {
        return this;
      }

      delete style['length'] && delete style['topRadius'] && delete style['bottomRadius'];
      this._style = style;
      Util.merge(this._delegate.cylinder, this._style);
      return this;
    }

  }

  Overlay.registerType('cylinder');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:12:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:13:11
   */
  function area(positions) {
    let result = 0;

    if (positions && Array.isArray(positions)) {
      let h = 0;
      let pos = positions.concat(positions[0]);

      for (let i = 1; i < pos.length; i++) {
        let oel = Transform$1.transformWGS84ToCartesian(pos[i - 1]);
        let el = Transform$1.transformWGS84ToCartesian(pos[i]);
        h += oel.x * el.y - el.x * oel.y;
      }

      result = Math.abs(h).toFixed(2);
    }

    return result;
  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:12:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:13:24
   */
  function bounds(positions = [], expand = 0) {
    let minLng = 180;
    let minLat = 90;
    let maxLng = -180;
    let maxLat = -90;
    positions.forEach(item => {
      minLng = Math.min(minLng, item.lng || item.x);
      minLat = Math.min(minLat, item.lat || item.y);
      maxLng = Math.max(maxLng, item.lng || item.x);
      maxLat = Math.max(maxLat, item.lat || item.y);
    });

    if (expand > 0) {
      let diffLng = Math.abs(maxLng - maxLng);
      let diffLat = Math.abs(maxLat - minLat);
      minLng -= diffLng * expand;
      minLat -= diffLat * expand;
      maxLng += diffLng * expand;
      maxLat += diffLat * expand;
    }

    return {
      west: minLng,
      south: minLat,
      east: maxLng,
      north: maxLat
    };
  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:12:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:16:56
   */
  function mid(startPosition, endPosition) {
    if (startPosition instanceof Position) {
      startPosition = Transform$1.transformWGS84ToCartographic(startPosition);
    }

    if (endPosition instanceof Position) {
      endPosition = Transform$1.transformWGS84ToCartographic(endPosition);
    }

    let mc = new Cesium$1.EllipsoidGeodesic(startPosition, endPosition).interpolateUsingFraction(0.5);
    return new Position(Cesium$1.Math.toDegrees(mc.longitude), Cesium$1.Math.toDegrees(mc.latitude), mc.height);
  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:12:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:13:57
   */
  function center(positions) {
    if (positions && Array.isArray(positions)) {
      let boundingSphere = Cesium__default['default'].BoundingSphere.fromPoints(Transform$1.transformWGS84ArrayToCartesianArray(positions));
      return Transform$1.transformCartesianToWGS84(boundingSphere.center);
    }

    return new Position();
  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:12:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:14:42
   */
  function distance(positions) {
    let distance = 0;

    if (positions && Array.isArray(positions)) {
      for (let i = 0; i < positions.length - 1; i++) {
        let c1 = Transform$1.transformWGS84ToCartographic(positions[i]);
        let c2 = Transform$1.transformWGS84ToCartographic(positions[i + 1]);
        let geodesic = new Cesium__default['default'].EllipsoidGeodesic();
        geodesic.setEndPoints(c1, c2);
        let s = geodesic.surfaceDistance;
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(c2.height - c1.height, 2));
        distance += s;
      }
    }

    return distance.toFixed(3);
  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:12:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:17:09
   */
  function heading(startPosition, endPosition) {
    let heading = 0;

    if (startPosition instanceof Position) {
      startPosition = Transform$1.transformWGS84ToCartesian(startPosition);
    }

    if (endPosition instanceof Position) {
      endPosition = Transform$1.transformWGS84ToCartesian(endPosition);
    }

    let v = Cesium$1.Cartesian3.subtract(endPosition, startPosition, new Cesium$1.Cartesian3());

    if (v) {
      Cesium$1.Cartesian3.normalize(v, v);
      let up = Cesium$1.Ellipsoid.WGS84.geodeticSurfaceNormal(startPosition, new Cesium$1.Cartesian3());
      let east = Cesium$1.Cartesian3.cross(Cesium$1.Cartesian3.UNIT_Z, up, new Cesium$1.Cartesian3());
      let north = Cesium$1.Cartesian3.cross(up, east, new Cesium$1.Cartesian3());
      heading = Math.atan2(Cesium$1.Cartesian3.dot(v, east), Cesium$1.Cartesian3.dot(v, north));
    }

    return heading;
  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:12:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:15:20
   */
  function isBetween(value, min, max) {
    value = parseFloat(value || 0.0);
    return value >= parseFloat(min) && value <= parseFloat(max);
  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:12:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:15:54
   */
  function parabola(startPosition, endPosition, height = 0, count = 50) {
    //方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
    let result = [];
    height = Math.max(+height, 100);
    count = Math.max(+count, 50);
    let diffLng = Math.abs(startPosition.lng - endPosition.lng);
    let diffLat = Math.abs(startPosition.lat - endPosition.lat);
    let L = Math.max(diffLng, diffLat);
    let dlt = L / count;

    if (diffLng > diffLat) {
      //base on lng
      let delLat = (endPosition.lat - startPosition.lat) / count;

      if (startPosition.lng - endPosition.lng > 0) {
        dlt = -dlt;
      }

      for (let i = 0; i < count; i++) {
        let h = height - Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height / Math.pow(L, 2);
        let lng = startPosition.lng + dlt * i;
        let lat = startPosition.lat + delLat * i;
        result.push([lng, lat, h]);
      }
    } else {
      //base on lat
      let delLng = (endPosition.lng - startPosition.lng) / count;

      if (startPosition.lat - endPosition.lat > 0) {
        dlt = -dlt;
      }

      for (let i = 0; i < count; i++) {
        let h = height - Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height / Math.pow(L, 2);
        let lng = startPosition.lng + delLng * i;
        let lat = startPosition.lat + dlt * i;
        result.push([lng, lat, h]);
      }
    }

    return result;
  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:12:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:14:20
   */

  /**
   * Some of the code borrows from MAPV
   * https://github.com/huiyan-fe/mapv/blob/3292c7c25dbbf29af3cf7b3acb48108d60b3eed8/src/utils/curve.js
   */
  function curve(points, options) {
    options = options || {};
    let curvePoints = [];

    for (let i = 0; i < points.length - 1; i++) {
      let p = getCurveByTwoPoints(points[i], points[i + 1], options.count);

      if (p && p.length > 0) {
        curvePoints = curvePoints.concat(p);
      }
    }

    return curvePoints;
  }
  /**
   * Get a curvilinear coordinate set of points based on two points
   * @param obj1
   * @param obj2
   * @param count
   * @returns {null|[]}
   */

  function getCurveByTwoPoints(obj1, obj2, count) {
    if (!obj1 || !obj2) {
      return null;
    }

    let curveCoordinates = [];
    count = count || 40; // 曲线是由一些小的线段组成的，这个表示这个曲线所有到的折线的个数

    let B1 = function (x) {
      return 1 - 2 * x + x * x;
    };

    let B2 = x => {
      return 2 * x - 2 * x * x;
    };

    let B3 = x => {
      return x * x;
    };

    let t, h, h2, lat3, lng3, t2;
    let inc = 0;
    let lat1 = parseFloat(obj1.lat);
    let lat2 = parseFloat(obj2.lat);
    let lng1 = parseFloat(obj1.lng);
    let lng2 = parseFloat(obj2.lng); // 计算曲线角度的方法

    if (lng2 > lng1) {
      if (lng2 - lng1 > 180) {
        if (lng1 < 0) {
          lng1 = 180 + 180 + lng1;
          lng2 = 180 + 180 + lng2;
        }
      }
    } // 此时纠正了 lng1 lng2


    t2 = 0; // 纬度相同

    if (lat2 === lat1) {
      t = 0;
      h = lng1 - lng2; // 经度相同
    } else if (lng2 === lng1) {
      t = Math.PI / 2;
      h = lat1 - lat2;
    } else {
      t = Math.atan((lat2 - lat1) / (lng2 - lng1));
      h = (lat2 - lat1) / Math.sin(t);
    }

    if (t2 === 0) {
      t2 = t + Math.PI / 5;
    }

    h2 = h / 2;
    lng3 = h2 * Math.cos(t2) + lng1;
    lat3 = h2 * Math.sin(t2) + lat1;

    for (let i = 0; i < count + 1; i++) {
      let x = lng1 * B1(inc) + lng3 * B2(inc) + lng2 * B3(inc);
      let y = lat1 * B1(inc) + lat3 * B2(inc) + lat2 * B3(inc);
      let lng1_src = obj1.lng;
      let lng2_src = obj2.lng;
      curveCoordinates.push([lng1_src < 0 && lng2_src > 0 ? x - 360 : x, y]);
      inc = inc + 1 / count;
    }

    return curveCoordinates;
  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:17:01
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:57:03
   */

  class DivIcon extends Overlay {
    constructor(position, content) {
      super();
      this._delegate = DomUtil.create('div', 'div-icon');
      this._position = Parse$1.parsePosition(position);

      this._delegate.setAttribute('id', this._id);

      Util$1.merge(this._delegate.style, {
        position: 'absolute',
        top: '0',
        left: '0'
      });
      this.content = content;
      this.type = Overlay.getOverlayType('div_icon');
      this._state = State$1.INITIALIZED;
    }

    set show(show) {
      this._show = show;
      this._delegate.style.visibility = this._show ? 'visible' : 'hidden';
      return this;
    }

    get show() {
      return this._show;
    }

    set position(position) {
      this._position = Parse$1.parsePosition(position);
      return this;
    }

    get position() {
      return this._position;
    }

    set content(content) {
      if (content && typeof content === 'string') {
        this._delegate.innerHTML = content;
      } else if (content && content instanceof Element) {
        while (this._delegate.hasChildNodes()) {
          this._delegate.removeChild(this._delegate.firstChild);
        }

        this._delegate.appendChild(content);
      }

      return this;
    }

    get content() {
      return this._delegate.childNodes || [];
    }
    /**
     * Updates style
     * @param style
     * @param distance
     * @private
     */


    _updateStyle(style, distance) {
      let translate3d = 'translate3d(0,0,0)';

      if (style.transform) {
        let x = style.transform.x - this._delegate.offsetWidth / 2;
        let y = style.transform.y - this._delegate.offsetHeight / 2;
        translate3d = `translate3d(${Math.round(x)}px,${Math.round(y)}px, 0)`;
      }

      let scale3d = 'scale3d(1,1,1)';
      let scaleByDistance = this._style.scaleByDistance;

      if (distance && scaleByDistance) {
        let nearValue = scaleByDistance.nearValue;
        let farValue = scaleByDistance.farValue;
        let f = distance / scaleByDistance.far;

        if (distance < scaleByDistance.near) {
          scale3d = `scale3d(${nearValue},${nearValue},1)`;
        } else if (distance > scaleByDistance.far) {
          scale3d = `scale3d(${farValue},${farValue},1)`;
        } else {
          let scale = farValue + f * (nearValue - farValue);
          scale3d = `scale3d(${scale},${scale},1)`;
        }
      }

      let distanceDisplayCondition = this._style.distanceDisplayCondition;

      if (distance && distanceDisplayCondition) {
        this.show = this._show && isBetween(distance, distanceDisplayCondition.near, distanceDisplayCondition.far);
      }

      this._delegate.style.transform = `${translate3d} ${scale3d}`;
    }
    /**
     *
     * @param layer
     * @returns {boolean}
     * @private
     */


    _onAdd(layer) {
      this._layer = layer;

      this._layer.delegate.appendChild(this._delegate);

      this._delegate.addEventListener('click', () => {
        this._overlayEvent.fire(MouseEventType.CLICK, {
          layer: layer,
          overlay: this,
          position: Transform$1.transformWGS84ToCartesian(this._position)
        });
      });

      this._state = State$1.ADDED;
    }
    /**
     *
     * @private
     */


    _onRemove() {
      if (this._layer) {
        this._layer.delegate.removeChild(this._delegate);

        this._state = State$1.REMOVED;
      }
    }
    /**
     * Sets text
     * @param text
     * @param textStyle
     * @returns {DivIcon}
     */


    setLabel(text, textStyle) {
      return this;
    }
    /**
     * Sets style
     * @param style
     * @returns {DivIcon}
     */


    setStyle(style) {
      if (!style || Object.keys(style).length === 0) {
        return this;
      }

      this._style = style;
      this._style.className && DomUtil.addClass(this._delegate, this._style.className);
      return this;
    }
    /**
     * Parse from entity
     * @param entity
     * @param content
     * @returns {DivIcon}
     */


    static fromEntity(entity, content) {
      let divIcon;
      let now = Cesium.JulianDate.now();
      let position = Transform$1.transformCartesianToWGS84(entity.position.getValue(now));
      divIcon = new DivIcon(position, content);

      if (entity.billboard) {
        divIcon.attr = { ...entity?.properties?.getValue(now)
        };
      }

      return divIcon;
    }

  }

  Overlay.registerType('div_icon');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 15:10:22
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 15:11:38
   */

  class Ellipse extends Overlay {
    constructor(position, semiMajorAxis, semiMinorAxis) {
      super();
      this._position = Parse$1.parsePosition(position);
      this._semiMajorAxis = +semiMajorAxis || 0;
      this._semiMinorAxis = +semiMinorAxis || 0;
      this._delegate = new Cesium__default['default'].Entity({
        ellipse: {}
      });
      this.type = Overlay.getOverlayType('ellipse');
      this._state = State$1.INITIALIZED;
    }

    set position(position) {
      this._position = Parse$1.parsePosition(position);
      this._delegate.position = Transform$1.transformWGS84ToCartesian(this._position);
      this._delegate.orientation = Cesium__default['default'].Transforms.headingPitchRollQuaternion(Transform$1.transformWGS84ToCartesian(this._position), new Cesium__default['default'].HeadingPitchRoll(Cesium__default['default'].Math.toRadians(this._position.heading), Cesium__default['default'].Math.toRadians(this._position.pitch), Cesium__default['default'].Math.toRadians(this._position.roll)));
      return this;
    }

    get position() {
      return this._position;
    }

    set semiMajorAxis(semiMajorAxis) {
      this._semiMajorAxis = +semiMajorAxis || 0;
      this._delegate.ellipse.semiMajorAxis = this._semiMajorAxis;
      return this;
    }

    get semiMajorAxis() {
      return this._semiMajorAxis;
    }

    set semiMinorAxis(semiMinorAxis) {
      this._semiMinorAxis = +semiMinorAxis || 0;
      this._delegate.ellipse.semiMinorAxis = this._semiMinorAxis;
      return this;
    }

    get semiMinorAxis() {
      return this._semiMinorAxis;
    }

    _mountedHook() {
      /**
       * set the location
       */
      this.position = this._position;
      /**
       *  initialize the Overlay parameter
       */

      this.semiMajorAxis = this._semiMajorAxis;
      this.semiMinorAxis = this._semiMinorAxis;
    }
    /**
     * Sets Style
     * @param style
     * @returns {Ellipse}
     */


    setStyle(style) {
      if (Object.keys(style).length === 0) {
        return this;
      }

      delete style['semiMajorAxis'] && delete style['semiMinorAxis'];
      this._style = style;
      Util$1.merge(this._delegate.ellipse, this._style);
      return this;
    }

  }

  Overlay.registerType('ellipse');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 15:11:59
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 15:12:27
   */

  class Ellipsoid extends Overlay {
    constructor(position, radius) {
      super();
      this._position = Parse$1.parsePosition(position);
      this._radius = radius || {
        x: 10,
        y: 10,
        z: 10
      };
      this._delegate = new Cesium__default['default'].Entity({
        ellipsoid: {}
      });
      this.type = Overlay.getOverlayType('ellipsoid');
      this._state = State$1.INITIALIZED;
    }

    set position(position) {
      this._position = Parse$1.parsePosition(position);
      this._delegate.position = Transform$1.transformWGS84ToCartesian(this._position);
      this._delegate.orientation = Cesium__default['default'].Transforms.headingPitchRollQuaternion(Transform$1.transformWGS84ToCartesian(this._position), new Cesium__default['default'].HeadingPitchRoll(Cesium__default['default'].Math.toRadians(this._position.heading), Cesium__default['default'].Math.toRadians(this._position.pitch), Cesium__default['default'].Math.toRadians(this._position.roll)));
      return this;
    }

    get position() {
      return this._position;
    }

    set radius(radius) {
      this._radius = radius || {
        x: 10,
        y: 10,
        z: 10
      };
      this._delegate.ellipsoid.radii = this._radius;
      return this;
    }

    get radius() {
      return this._radius;
    }

    _mountedHook() {
      /**
       * set the location
       */
      this.position = this._position;
      /**
       *  initialize the Overlay parameter
       */

      this.radius = this._radius;
    }
    /**
     * Sets Style
     * @param style
     * @returns {Ellipsoid}
     */


    setStyle(style) {
      if (Object.keys(style).length === 0) {
        return this;
      }

      delete style['radius'];
      this._style = style;
      Util$1.merge(this._delegate.ellipsoid, this._style);
      return this;
    }

  }

  Overlay.registerType('ellipsoid');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:10:15
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:57:37
   */

  class Label extends Overlay {
    constructor(position, text) {
      super();
      this._delegate = new Cesium__default['default'].Entity({
        label: {}
      });
      this._position = Parse$1.parsePosition(position);
      this._text = text;
      this.type = Overlay.getOverlayType('label');
      this._state = State$1.INITIALIZED;
    }

    set position(position) {
      this._position = Parse$1.parsePosition(position);
      this._delegate.position = Transform$1.transformWGS84ToCartesian(this._position);
      return this;
    }

    get position() {
      return this._position;
    }

    set text(text) {
      this._text = text;
      this._delegate.label.text = this._text;
      return this;
    }

    get text() {
      return this._text;
    }

    _mountedHook() {
      /**
       * set the location
       */
      this.position = this._position;
      /**
       *  initialize the Overlay parameter
       */

      this.text = this._text;
    }
    /**
     *
     * @param {*} text
     * @param {*} textStyle
     */


    setLabel(text, textStyle) {
      return this;
    }
    /**
     * Sets Style
     * @param style
     * @returns {Label}
     */


    setStyle(style) {
      if (!style || Object.keys(style).length === 0) {
        return this;
      }

      delete style['text'];
      this._style = style;
      Util$1.merge(this._delegate.label, this._style);
      return this;
    }
    /**
     * Parse from entity
     * @param entity
     * @returns {any}
     */


    static fromEntity(entity) {
      let now = Cesium__default['default'].JulianDate.now();
      let position = Transform$1.transformCartesianToWGS84(entity.position.getValue(now));
      let label = undefined;

      if (entity.billboard) {
        label = new Label(position, entity.name);
        label.attr = { ...entity?.properties?.getValue(now)
        };
      }

      return label;
    }

  }

  Overlay.registerType('label');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 15:12:40
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 15:13:16
   */

  class Plane extends Overlay {
    constructor(position, width, height, plane = {}) {
      super();
      this._position = Parse$1.parsePosition(position);
      this._width = +width || 0;
      this._height = +height || 0;

      if (plane.normal && typeof plane.normal === 'string') {
        let n = String(plane.normal).toLocaleUpperCase();
        plane.normal = n === 'X' ? Cesium__default['default'].Cartesian3.UNIT_X : n === 'Y' ? Cesium__default['default'].Cartesian3.UNIT_Y : Cesium__default['default'].Cartesian3.UNIT_Z;
      } else {
        plane.normal = Cesium__default['default'].Cartesian3.UNIT_Z;
      }

      this._normal = plane.normal;
      this._distance = plane.distance || 0;
      this._delegate = new Cesium__default['default'].Entity({
        plane: {
          dimensions: {
            x: this._width,
            y: this._height
          },
          plane: new Cesium__default['default'].Plane(this._normal, this._distance)
        }
      });
      this.type = Overlay.getOverlayType('plane');
      this._state = State$1.INITIALIZED;
    }

    set position(position) {
      this._position = Parse$1.parsePosition(position);
      this._delegate.position = Transform$1.transformWGS84ToCartesian(this._position);
      this._delegate.orientation = Cesium__default['default'].Transforms.headingPitchRollQuaternion(Transform$1.transformWGS84ToCartesian(this._position), new Cesium__default['default'].HeadingPitchRoll(Cesium__default['default'].Math.toRadians(this._position.heading), Cesium__default['default'].Math.toRadians(this._position.pitch), Cesium__default['default'].Math.toRadians(this._position.roll)));
      return this;
    }

    get position() {
      return this._position;
    }

    set width(width) {
      this._width = +width || 0;
      this._delegate.plan.dimensions.x = this._width;
      return this;
    }

    get width() {
      return this._width;
    }

    set height(height) {
      this._height = +height || 0;
      this._delegate.plan.dimensions.y = this._height;
      return this;
    }

    get height() {
      return this._height;
    }

    set distance(distance) {
      this._distance = distance;
      this._delegate.plane.plane.distance = distance;
      return this;
    }

    get distance() {
      return this._distance;
    }

    _mountedHook() {
      /**
       * set the location
       */
      this.position = this._position;
      /**
       *  initialize the Overlay parameter
       */

      this.distance = this._distance;
    }
    /**
     *
     * @param {*} text
     * @param {*} textStyle
     */


    setLabel(text, textStyle) {
      return this;
    }
    /**
     * Sets Style
     * @param style
     * @returns {Plane}
     */


    setStyle(style) {
      if (Object.keys(style).length === 0) {
        return this;
      }

      delete style['dimensions'] && delete ['plane'];
      this._style = style;
      Util$1.merge(this._delegate.plane, this._style);
      return this;
    }

  }

  Overlay.registerType('plane');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 10:16:58
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:58:07
   */
  const DEF_STYLE = {
    pixelSize: 8,
    outlineColor: Cesium$1.Color.BLUE,
    outlineWidth: 2
  };

  class Point extends Overlay {
    constructor(position) {
      super();
      this._delegate = new Cesium$1.Entity({
        point: {}
      });
      this._position = Parse$1.parsePosition(position);
      this.type = Overlay.getOverlayType('point');
      this._state = State$1.INITIALIZED;
    }

    set position(position) {
      this._position = Parse$1.parsePosition(position);
      this._delegate.position = Transform$1.transformWGS84ToCartesian(this._position);
      return this;
    }

    get position() {
      return this._position;
    }

    _mountedHook() {
      /**
       * set the location
       */
      this.position = this._position;
      /**
       *  initialize the Overlay parameter
       */

      Util$1.merge(this._delegate.point, DEF_STYLE, this._style);
    }
    /**
     * Set style
     * @param style
     * @returns {Point}
     */


    setStyle(style) {
      if (!style || Object.keys(style).length === 0) {
        return this;
      }

      delete style['position'];
      this._style = style;
      Util$1.merge(this._delegate.point, DEF_STYLE, this._style);
      return this;
    }
    /**
     * Parse from entity
     * @param entity
     * @returns {any}
     */


    static fromEntity(entity) {
      let point = undefined;
      let now = Cesium$1.JulianDate.now();
      let position = Transform$1.transformCartesianToWGS84(entity.position.getValue(now));
      point = new Point(position);
      point.attr = { ...entity?.properties?.getValue(now)
      };
      return point;
    }

  }

  Overlay.registerType('point');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:11:58
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:58:34
   */

  class Polygon extends Overlay {
    constructor(positions) {
      super();
      this._delegate = new Cesium__default['default'].Entity({
        polygon: {}
      });
      this._positions = Parse$1.parsePositions(positions);
      this._holes = [];
      this.type = Overlay.getOverlayType('polygon');
      this._state = State$1.INITIALIZED;
    }

    set positions(positions) {
      this._positions = Parse$1.parsePositions(positions);
      this._delegate.polygon.hierarchy = this._computeHierarchy();
      return this;
    }

    get positions() {
      return this._positions;
    }

    set holes(holes) {
      if (holes && holes.length) {
        this._holes = holes.map(item => Parse$1.parsePositions(item));
        this._delegate.polygon.hierarchy = this._computeHierarchy();
      }

      return this;
    }

    get holes() {
      return this._holes;
    }

    get center() {
      return center([...this._positions, this._positions[0]]);
    }

    get area() {
      return area(this._positions);
    }
    /**
     *
     * @private
     */


    _computeHierarchy() {
      let result = new Cesium__default['default'].PolygonHierarchy();
      result.positions = Transform$1.transformWGS84ArrayToCartesianArray(this._positions);
      result.holes = this._holes.map(item => new Cesium__default['default'].PolygonHierarchy(Transform$1.transformWGS84ArrayToCartesianArray(item)));
      return result;
    }

    _mountedHook() {
      /**
       *  initialize the Overlay parameter
       */
      this.positions = this._positions;
    }
    /**
     * Sets text
     * @param text
     * @param textStyle
     * @returns {Polygon}
     */


    setLabel(text, textStyle) {
      this._delegate.position = Transform$1.transformWGS84ToCartesian(this.center);
      this._delegate.label = {
        text: text,
        ...textStyle
      };
      return this;
    }
    /**
     * Sets style
     * @param style
     * @returns {Polygon}
     */


    setStyle(style) {
      if (!style || Object.keys(style).length === 0) {
        return this;
      }

      delete style['positions'];
      this._style = style;
      Util$1.merge(this._delegate.polygon, this._style);
      return this;
    }
    /**
     * Parse from entity
     * @param entity
     * @returns {any}
     */


    static fromEntity(entity) {
      let polygon = undefined;
      let now = Cesium__default['default'].JulianDate.now();

      if (entity.polygon) {
        let positions = Transform$1.transformCartesianArrayToWGS84Array(entity.polygon.hierarchy.getValue(now).positions);
        polygon = new Polygon(positions);
        polygon.attr = { ...entity?.properties?.getValue(now)
        };
      }

      return polygon;
    }

  }

  Overlay.registerType('polygon');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:11:20
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:58:57
   */

  class Polyline extends Overlay {
    constructor(positions) {
      super();
      this._positions = Parse$1.parsePositions(positions);
      this._delegate = new Cesium__default['default'].Entity({
        polyline: {}
      });
      this.type = Overlay.getOverlayType('polyline');
      this._state = State$1.INITIALIZED;
    }

    set positions(positions) {
      this._positions = Parse$1.parsePositions(positions);
      this._delegate.polyline.positions = Transform$1.transformWGS84ArrayToCartesianArray(this._positions);
      return this;
    }

    get positions() {
      return this._positions;
    }

    get center() {
      return center(this._positions);
    }

    get distance() {
      return distance(this._positions);
    }

    _mountedHook() {
      /**
       *  initialize the Overlay parameter
       */
      this.positions = this._positions;
    }
    /**
     * Sets Text
     * @param text
     * @param textStyle
     * @returns {Polyline}
     */


    setLabel(text, textStyle) {
      this._delegate.position = Transform$1.transformWGS84ToCartesian(this.center);
      this._delegate.label = {
        text: text,
        ...textStyle
      };
      return this;
    }
    /**
     * Sets style
     * @param style
     * @returns {Polyline}
     */


    setStyle(style) {
      if (!style || Object.keys(style).length === 0) {
        return this;
      }

      delete style['positions'];
      this._style = style;
      Util$1.merge(this._delegate.polyline, this._style);
      return this;
    }
    /**
     * Parse from entity
     * @param entity
     * @returns {Polyline}
     */


    static fromEntity(entity) {
      let polyline = undefined;
      let now = Cesium__default['default'].JulianDate.now();

      if (entity.polyline) {
        let positions = Transform$1.transformCartesianArrayToWGS84Array(entity.polyline.positions.getValue(now));
        polyline = new Polyline(positions);
        polyline.attr = { ...entity?.properties?.getValue(now)
        };
      }

      return polyline;
    }

  }

  Overlay.registerType('polyline');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 15:13:32
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 15:14:05
   */

  class PolylineVolume extends Overlay {
    constructor(positions, shape) {
      super();
      this._positions = Parse$1.parsePositions(positions);
      this._shape = shape || [];
      this._delegate = new Cesium__default['default'].Entity({
        polylineVolume: {}
      });
      this.type = Overlay.getOverlayType('polyline_volume');
      this._state = State$1.INITIALIZED;
    }

    set positions(positions) {
      this._positions = Parse$1.parsePositions(positions);
      this._delegate.polylineVolume.positions = Transform$1.transformWGS84ArrayToCartesianArray(this._positions);
      return this;
    }

    get positions() {
      return this._positions;
    }

    set shape(shape) {
      this._shape = shape || [];
      this._delegate.polylineVolume.shape = this._shape;
      return this;
    }

    get shape() {
      return this._shape;
    }

    _mountedHook() {
      /**
       * set the location
       */
      this.positions = this._positions;
      /**
       *  initialize the Overlay parameter
       */

      this.shape = this._shape;
    }
    /**
     * @param text
     * @param textStyle
     * @returns {PolylineVolume}
     */


    setLabel(text, textStyle) {
      return this;
    }
    /**
     * Sets style
     * @param style
     * @returns {PolylineVolume}
     */


    setStyle(style) {
      if (Object.keys(style).length === 0) {
        return this;
      }

      delete style['positions'] && delete style['shape'];
      this._style = style;
      Util$1.merge(this._delegate.polylineVolume, this._style);
      return this;
    }
    /**
     * Parses from entity
     * @param entity
     * @param shape
     * @returns {PolylineVolume|any}
     */


    static fromEntity(entity, shape) {
      let polylineVolume = undefined;
      let now = Cesium__default['default'].JulianDate.now();

      if (entity.polyline) {
        let positions = Transform$1.transformCartesianArrayToWGS84Array(entity.polyline.positions.getValue(now));
        polylineVolume = new PolylineVolume(positions, shape);
        polylineVolume.attr = { ...entity?.properties?.getValue(now)
        };
      }

      return polylineVolume;
    }

  }

  Overlay.registerType('polyline_volume');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 15:14:18
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 15:14:45
   */

  class Rectangle extends Overlay {
    constructor(positions) {
      super();
      this._positions = Parse$1.parsePositions(positions);
      this._delegate = new Cesium__default['default'].Entity({
        rectangle: {}
      });
      this.type = Overlay.getOverlayType('rectangle');
      this._state = State$1.INITIALIZED;
    }

    set positions(positions) {
      this._positions = Parse$1.parsePositions(positions);
      this._delegate.rectangle.coordinates = Cesium__default['default'].Rectangle.fromCartesianArray(Transform$1.transformWGS84ArrayToCartesianArray(this._positions));
      return this;
    }

    get positions() {
      return this._positions;
    }

    _mountedHook() {
      /**
       * set the location
       */
      this.positions = this._positions;
    }
    /**
     * @param text
     * @param textStyle
     * @returns {Rectangle}
     */


    setLabel(text, textStyle) {
      return this;
    }
    /**
     * Sets Style
     * @param style
     * @returns {Rectangle}
     */


    setStyle(style) {
      if (Object.keys(style).length === 0) {
        return this;
      }

      delete style['positions'];
      this._style = style;
      Util$1.merge(this._delegate.rectangle, this._style);
      return this;
    }

  }

  Overlay.registerType('rectangle');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 15:15:02
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 15:15:30
   */

  class Wall extends Overlay {
    constructor(positions) {
      super();
      this._positions = Parse$1.parsePositions(positions);
      this._delegate = new Cesium__default['default'].Entity({
        wall: {}
      });
      this.type = Overlay.getOverlayType('wall');
      this._state = State$1.INITIALIZED;
    }

    set positions(positions) {
      this._positions = Parse$1.parsePositions(positions);
      this._delegate.wall.positions = Transform$1.transformWGS84ArrayToCartesianArray(this._positions);
      return this;
    }

    get positions() {
      return this._positions;
    }

    _mountedHook() {
      /**
       * set the location
       */
      this.positions = this._positions;
    }
    /**
     *
     * @param text
     * @param textStyle
     * @returns {Wall}
     */


    setLabel(text, textStyle) {
      return this;
    }
    /**
     * Sets Style
     * @param style
     * @returns {Wall}
     */


    setStyle(style) {
      if (Object.keys(style).length === 0) {
        return this;
      }

      delete style['positions'];
      this._style = style;
      Util$1.merge(this._delegate.wall, this._style);
      return this;
    }
    /**
     * Parses from entity
     * @param entity
     * @returns {Wall|any}
     */


    static fromEntity(entity) {
      let wall = undefined;
      let now = Cesium__default['default'].JulianDate.now();

      if (entity.polyline) {
        let positions = Transform$1.transformCartesianArrayToWGS84Array(entity.polyline.positions.getValue(now));
        wall = new Wall(positions);
        wall.attr = { ...entity?.properties?.getValue(now)
        };
      }

      return wall;
    }

  }

  Overlay.registerType('wall');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:19:39
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:02:32
   */

  class Model extends Overlay {
    constructor(position, modelUrl) {
      super();
      this._delegate = new Cesium__default['default'].Entity({
        model: {}
      });
      this._position = Parse$1.parsePosition(position);
      this._modelUrl = modelUrl;
      this._rotateAmount = 0;
      this.type = Overlay.getOverlayType('model');
      this._state = State$1.INITIALIZED;
    }

    set position(position) {
      this._position = Parse$1.parsePosition(position);
      this._delegate.position = Transform$1.transformWGS84ToCartesian(this._position);

      if (this._rotateAmount === 0) {
        this._delegate.orientation = Cesium__default['default'].Transforms.headingPitchRollQuaternion(Transform$1.transformWGS84ToCartesian(this._position), new Cesium__default['default'].HeadingPitchRoll(Cesium__default['default'].Math.toRadians(this._position.heading), Cesium__default['default'].Math.toRadians(this._position.pitch), Cesium__default['default'].Math.toRadians(this._position.roll)));
      }

      return this;
    }

    get position() {
      return this._position;
    }

    set modelUrl(modelUrl) {
      this._modelUrl = modelUrl;
      this._delegate.model.uri = this._modelUrl;
      return this;
    }

    get modelUrl() {
      return this._modelUrl;
    }

    set rotateAmount(amount) {
      this._rotateAmount = +amount;
      this._delegate.orientation = new Cesium__default['default'].CallbackProperty(time => {
        this._position.heading += this._rotateAmount;

        if (this._position.heading >= 360 || this._position.heading <= -360) {
          this._position.heading = 0;
        }

        return Cesium__default['default'].Transforms.headingPitchRollQuaternion(Transform$1.transformWGS84ToCartesian(this._position), new Cesium__default['default'].HeadingPitchRoll(Cesium__default['default'].Math.toRadians(this._position.heading), Cesium__default['default'].Math.toRadians(this._position.pitch), Cesium__default['default'].Math.toRadians(this._position.roll)));
      });
      return this;
    }

    get rotateAmount() {
      return this._rotateAmount;
    }

    _mountedHook() {
      /**
       * set the location
       */
      this.position = this._position;
      /**
       *  initialize the Overlay parameter
       */

      this.modelUrl = this._modelUrl;
    }
    /**
     * Sets style
     * @param style
     * @returns {Model}
     */


    setStyle(style) {
      if (!style || Object.keys(style).length === 0) {
        return this;
      }

      delete style['uri'];
      this._style = style;
      Util$1.merge(this._delegate.model, this._style);
      return this;
    }
    /**
     * Parse from entity
     * @param entity
     * @param modelUrl
     * @returns {Model}
     */


    static fromEntity(entity, modelUrl) {
      let now = Cesium__default['default'].JulianDate.now();
      let position = Transform$1.transformCartesianToWGS84(entity.position.getValue(now));
      let model = new Model(position, modelUrl);
      model.attr = { ...entity.properties.getValue(now)
      };
      return model;
    }

  }

  Overlay.registerType('model');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:20:19
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:02:14
   */

  class Tileset extends Overlay {
    constructor(url, options = {}) {
      super();
      this._delegate = new Cesium__default['default'].Cesium3DTileset({ ...options,
        url: url
      });
      this._tileVisibleCallback = undefined;
      this._properties = undefined;
      this._customShader = undefined;
      this.type = Overlay.getOverlayType('tileset');
      this._state = State$1.INITIALIZED;
    }

    get readyPromise() {
      return this._delegate.readyPromise;
    }
    /**
     *
     * @private
     */


    _bindVisibleEvent() {
      this._tileVisibleCallback && this._tileVisibleCallback();
      this._tileVisibleCallback = this._delegate.tileVisible.addEventListener(this._updateTile, this);
    }
    /**
     * Updates tile
     * @param tile
     * @private
     */


    _updateTile(tile) {
      let content = tile.content;

      for (let i = 0; i < content.featuresLength; i++) {
        let feature = content.getFeature(i);
        let model = feature.content._model; // sets properties

        if (this._properties && this._properties.length) {
          this._properties.forEach(property => {
            if (feature.hasProperty(property['key']) && feature.getProperty(property['key']) === property['keyValue']) {
              feature.setProperty(property['propertyName'], property['propertyValue']);
            }
          });
        } // sets customShader


        if (this._customShader && model && model._sourcePrograms && model._rendererResources) {
          Object.keys(model._sourcePrograms).forEach(key => {
            let program = model._sourcePrograms[key];
            model._rendererResources.sourceShaders[program.fragmentShader] = this._customShader;
          });
          model._shouldRegenerateShaders = true;
        }
      }
    }
    /**
     * Sets position
     * @param position
     * @returns {Tileset}
     */


    setPosition(position) {
      position = Parse$1.parsePosition(position);
      this.readyPromise.then(tileset => {
        let modelMatrix = Cesium__default['default'].Transforms.eastNorthUpToFixedFrame(Cesium__default['default'].Cartesian3.fromDegrees(position.lng, position.lat, position.alt));
        let rotationX = Cesium__default['default'].Matrix4.fromRotationTranslation(Cesium__default['default'].Matrix3.fromRotationZ(Cesium__default['default'].Math.toRadians(position.heading)));
        Cesium__default['default'].Matrix4.multiply(modelMatrix, rotationX, modelMatrix);
        tileset.root.transform = modelMatrix;
      });
      return this;
    }
    /**
     *
     * @param {*} text
     * @param {*} textStyle
     */


    setLabel(text, textStyle) {
      return this;
    }
    /**
     * Clamps To Ground
     * @returns {Tileset}
     */


    clampToGround() {
      this.readyPromise.then(tileset => {
        let center = Cesium__default['default'].Cartographic.fromCartesian(tileset.boundingSphere.center);
        let surface = Cesium__default['default'].Cartesian3.fromRadians(center.longitude, center.latitude, center.height);
        let offset = Cesium__default['default'].Cartesian3.fromRadians(center.longitude, center.latitude, 0);
        let translation = Cesium__default['default'].Cartesian3.subtract(offset, surface, new Cesium__default['default'].Cartesian3());
        tileset.modelMatrix = Cesium__default['default'].Matrix4.fromTranslation(translation);
      });
      return this;
    }
    /**
     * Sets height
     * @param height
     * @param isAbsolute
     * @returns {Tileset}
     */


    setHeight(height, isAbsolute = false) {
      this.readyPromise.then(tileset => {
        let center = Cesium__default['default'].Cartographic.fromCartesian(tileset.boundingSphere.center);
        let surface = Cesium__default['default'].Cartesian3.fromRadians(center.longitude, center.latitude, center.height);
        let offset = Cesium__default['default'].Cartesian3.fromRadians(center.longitude, center.latitude, isAbsolute ? height : center.height + height);
        let translation = Cesium__default['default'].Cartesian3.subtract(offset, surface, new Cesium__default['default'].Cartesian3());
        tileset.modelMatrix = Cesium__default['default'].Matrix4.fromTranslation(translation);
      });
      return this;
    }
    /**
     * Sets scale
     * @param scale
     * @returns {Tileset}
     */


    setScale(scale) {
      this.readyPromise.then(tileset => {
        let modelMatrix = tileset.root.transform;

        if (scale > 0 && scale !== 1) {
          Cesium__default['default'].Matrix4.multiplyByUniformScale(modelMatrix, scale, modelMatrix);
        }

        tileset.root.transform = modelMatrix;
      });
      return this;
    }
    /**
     * Sets feature property
     * @param properties
     * @returns {Tileset}
     */


    setProperties(properties) {
      this._properties = properties;

      this._bindVisibleEvent();

      return this;
    }
    /**
     * Sets feature FS
     * @param customShader
     * @returns {Tileset}
     */


    setCustomShader(customShader) {
      this._customShader = customShader;

      this._bindVisibleEvent();

      return this;
    }
    /**
     * Sets style
     * @param style
     * @returns {Tileset}
     */


    setStyle(style) {
      if (style && style instanceof Cesium__default['default'].Cesium3DTileStyle) {
        this._style = style;
        this._delegate.style = this._style;
      }

      return this;
    }

  }

  Overlay.registerType('tileset');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:51:13
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:40:52
   */

  class GeoJsonLayer extends Layer {
    constructor(id, url, options = {}) {
      if (!url) {
        throw new Error('GeoJsonLayer url invalid');
      }

      super(id);
      this._delegate = Cesium__default['default'].GeoJsonDataSource.load(url, options);
      this.type = Layer.getLayerType('geojson');
      this._state = State$1.INITIALIZED;
    }

    set show(show) {
      this._show = show;
      this._delegate && this._delegate.then(dataSource => {
        dataSource.show = this._show;
      });
    }

    get show() {
      return this._show;
    }

    _createBillboard(entity) {
      if (entity.position && entity.billboard) {
        return Billboard.fromEntity(entity);
      }
    }
    /**
     * Returns polyline Entity
     * @param entity
     * @returns {any}
     * @private
     */


    _createPolyline(entity) {
      if (entity.polyline) {
        return Polyline.fromEntity(entity);
      }
    }
    /**
     * Returns polygon Entity
     * @param entity
     * @returns {any}
     * @private
     */


    _createPolygon(entity) {
      if (entity.polygon) {
        return Polygon.fromEntity(entity);
      }
    }
    /**
     * Returns model Entity
     * @param entity
     * @param modelUrl
     * @returns {Model}
     * @private
     */


    _createModel(entity, modelUrl) {
      if (entity) {
        return Model.fromEntity(entity, modelUrl);
      }
    }
    /**
     *
     * @param method
     * @param context
     * @returns {GeoJsonLayer}
     */


    eachOverlay(method, context) {
      if (this._delegate) {
        this._delegate.then(dataSource => {
          let entities = dataSource.entities.values;
          entities.forEach(item => {
            method.call(context, item);
          });
        });

        return this;
      }
    }
    /**
     * Converts to VectorLayer
     * @returns {VectorLayer}
     */


    toVectorLayer() {
      let layer = new VectorLayer(this.id);
      this.eachOverlay(item => {
        if (item.billboard) {
          layer.addOverlay(this._createBillboard(item));
        } else if (item.polyline) {
          layer.addOverlay(this._createPolyline(item));
        } else if (item.polygon) {
          layer.addOverlay(this._createPolygon(item));
        }
      }, this);
      return layer;
    }
    /**
     * Converts to VectorLayer
     * @param modelUrl
     * @returns {VectorLayer}
     */


    toModelLayer(modelUrl) {
      let layer = new VectorLayer(this.id);
      this.eachOverlay(item => {
        layer.addOverlay(this._createModel(item, modelUrl));
      }, this);
      return layer;
    }

  }

  Layer.registerType('geojson');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:37:35
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:41:55
   */

  class HtmlLayer extends Layer {
    constructor(id) {
      super(id);
      this._delegate = DomUtil.create('div', 'html-layer', undefined);

      this._delegate.setAttribute('id', this._id);

      this._renderRemoveCallback = undefined;
      this.type = Layer.getLayerType('html');
      this._state = State$1.INITIALIZED;
    }

    set show(show) {
      this._show = show;
      this._delegate.style.visibility = this._show ? 'visible' : 'hidden';
    }

    get show() {
      return this._show;
    }
    /**
    * add handler
    * @param viewer
    * @private
    */


    _onAdd(viewer) {
      this._viewer = viewer;

      this._viewer.dcContainer.appendChild(this._delegate);

      let scene = this._viewer.scene;
      this._renderRemoveCallback = scene.postRender.addEventListener(() => {
        let cameraPosition = this._viewer.camera.positionWC;
        this.eachOverlay(item => {
          if (item && item.position) {
            item.show = this.show;
            let position = Transform$1.transformWGS84ToCartesian(item.position);
            let windowCoord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position);
            let distance = Cesium.Cartesian3.distance(position, cameraPosition);

            item._updateStyle({
              transform: windowCoord
            }, distance);
          }
        }, this);
      }, this);
      this._state = State$1.ADDED;
    }

    _onRemove() {
      this._renderRemoveCallback && this._renderRemoveCallback();

      this._viewer.dcContainer.removeChild(this._delegate);

      this._state = State$1.REMOVED;
    }
    /**
     * Clear all divIcons
     */


    clear() {
      while (this._delegate.hasChildNodes()) {
        this._delegate.removeChild(this._delegate.firstChild);
      }

      this._cache = {};
      this._state = State$1.CLEARED;
      return this;
    }

  }

  Layer.registerType('html');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:31:11
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:42:14
   */

  class LabelLayer extends Layer {
    constructor(id, url = '') {
      super(id);
      this._dataSource = Cesium__default['default'].GeoJsonDataSource.load(url);
      this._delegate = new Cesium__default['default'].CustomDataSource(id);

      this._initLabel();

      this.type = Layer.registerType('label');
      this._state = State$1.INITIALIZED;
    }

    _createLabel(entity) {
      if (entity.position && entity.name) {
        return Label.fromEntity(entity);
      }
    }

    _initLabel() {
      this._dataSource.then(dataSource => {
        let entities = dataSource.entities.values;
        entities.forEach(item => {
          let label = this._createLabel(item);

          this.addOverlay(label);
        });
      });
    }

  }

  Layer.registerType('label');

  /*
   * @Description: 图元图层 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:30:08
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:07:38
   */

  class PrimitiveLayer extends Layer {
    constructor(id) {
      super(id);
      this._delegate = new Cesium__default['default'].PrimitiveCollection();
      this.type = Layer.getLayerType('primitive');
      this._state = State$1.INITIALIZED;
    }
    /**
     * Clear all primitives
     */


    clear() {
      this._delegate && this._delegate.removeAll();
      this._cache = {};
      this._state = State$1.CLEARED;
      return this;
    }

  }

  Layer.registerType('primitive');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:34:23
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 09:37:10
   */

  class TilesetLayer extends Layer {
    constructor(id) {
      super(id);
      this._delegate = new Cesium__default['default'].PrimitiveCollection();
      this.type = Layer.getLayerType('tileset');
      this._state = State$1.INITIALIZED;
    }

    clear() {
      this._delegate.removeAll();

      this._cache = {};
      this._state = State$1.CLEARED;
      return this;
    }

  }

  Layer.registerType('tileset');

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 10:09:33
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:42:50
   * 
   */

  class TopoJsonLayer extends GeoJsonLayer {
    constructor(id, url, options = {}) {
      if (!url) {
        throw new Error('TopoJsonLayer锛歵he url invalid');
      }

      super(id, url, options);
      this.type = GeoJsonLayer.getLayerType('topojson');
      this._state = State.INITIALIZED;
    }

  }

  GeoJsonLayer.registerType('topojson');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:30:35
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:30:47
   */

  class KmlLayer extends Layer {
    constructor(id, url, options = {}) {
      if (!url) {
        throw new Error('KmlLayer: the url is empty');
      }

      super(id);
      this._delegate = Cesium__default['default'].KmlDataSource.load(url, options);
      this.type = Layer.getLayerType('kml');
      this._state = State$1.INITIALIZED;
    }

    set show(show) {
      this._show = show;
      this._delegate && this._delegate.then(dataSource => {
        dataSource.show = this._show;
      });
    }

    get show() {
      return this._show;
    }

    eachOverlay(method, context) {
      if (this._delegate) {
        this._delegate.then(dataSource => {
          let entities = dataSource.entities.values;
          entities.forEach(item => {
            method.call(context, item);
          });
        });

        return this;
      }
    }

  }

  Layer.registerType('kml');

  const czm_cellular = require('../shader/thirdpart/cellular.glsl');

  const czm_snoise = require('../shader/thirdpart/snoise.glsl');

  const AsphaltMaterial = require('../shader/thirdpart/AsphaltMaterial.glsl');

  const BlobMaterial = require('../shader/thirdpart/BlobMaterial.glsl');

  const BrickMaterial = require('../shader/thirdpart/BlobMaterial.glsl');

  const CementMaterial = require('../shader/thirdpart/CementMaterial.glsl');

  const ErosionMaterial = require('../shader/thirdpart/ErosionMaterial.glsl');

  const FacetMaterial = require('../shader/thirdpart/FacetMaterial.glsl');

  const FresnelMaterial = require('../shader/thirdpart/FresnelMaterial.glsl');

  const GrassMaterial = require('../shader/thirdpart/GrassMaterial.glsl');

  const ReflectionMaterial = require('../shader/thirdpart/ReflectionMaterial.glsl');

  const RefractionMaterial = require('../shader/thirdpart/RefractionMaterial.glsl');

  const TieDyeMaterial = require('../shader/thirdpart/TieDyeMaterial.glsl');

  const WoodMaterial = require('../shader/thirdpart/WoodMaterial.glsl');

  Cesium$1.ShaderSource._czmBuiltinsAndUniforms.czm_cellular = czm_cellular;
  Cesium$1.ShaderSource._czmBuiltinsAndUniforms.czm_snoise = czm_snoise;
  /**
   * Asphalt
   * @type {string}
   */

  Cesium$1.Material.AsphaltType = 'Asphalt';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.AsphaltType, {
    fabric: {
      type: Cesium$1.Material.AsphaltType,
      uniforms: {
        asphaltColor: new Cesium$1.Color(0.15, 0.15, 0.15, 1.0),
        bumpSize: 0.02,
        roughness: 0.2
      },
      source: AsphaltMaterial
    },
    translucent: function (material) {
      return material.uniforms.asphaltColor.alpha < 1.0;
    }
  });
  /**
   * Blob
   * @type {string}
   */


  Cesium$1.Material.BlobType = 'Blob';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.BlobType, {
    fabric: {
      type: Cesium$1.Material.BlobType,
      uniforms: {
        lightColor: new Cesium$1.Color(1.0, 1.0, 1.0, 0.5),
        darkColor: new Cesium$1.Color(0.0, 0.0, 1.0, 0.5),
        frequency: 10.0
      },
      source: BlobMaterial
    },
    translucent: function (material) {
      var uniforms = material.uniforms;
      return uniforms.lightColor.alpha < 1.0 || uniforms.darkColor.alpha < 0.0;
    }
  });
  /**
   * Brick
   * @type {string}
   */


  Cesium$1.Material.BrickType = 'Brick';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.BrickType, {
    fabric: {
      type: Cesium$1.Material.BrickType,
      uniforms: {
        brickColor: new Cesium$1.Color(0.6, 0.3, 0.1, 1.0),
        mortarColor: new Cesium$1.Color(0.8, 0.8, 0.7, 1.0),
        brickSize: new Cesium$1.Cartesian2(0.3, 0.15),
        brickPct: new Cesium$1.Cartesian2(0.9, 0.85),
        brickRoughness: 0.2,
        mortarRoughness: 0.1
      },
      source: BrickMaterial
    },
    translucent: function (material) {
      var uniforms = material.uniforms;
      return uniforms.brickColor.alpha < 1.0 || uniforms.mortarColor.alpha < 1.0;
    }
  });
  /**
   * Cement
   * @type {string}
   */


  Cesium$1.Material.CementType = 'Cement';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.CementType, {
    fabric: {
      type: Cesium$1.Material.CementType,
      uniforms: {
        cementColor: new Cesium$1.Color(0.95, 0.95, 0.85, 1.0),
        grainScale: 0.01,
        roughness: 0.3
      },
      source: CementMaterial
    },
    translucent: function (material) {
      return material.uniforms.cementColor.alpha < 1.0;
    }
  });
  /**
   * Erosion
   * @type {string}
   */


  Cesium$1.Material.ErosionType = 'Erosion';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.ErosionType, {
    fabric: {
      type: Cesium$1.Material.ErosionType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.5),
        time: 1.0
      },
      source: ErosionMaterial
    },
    translucent: function (material) {
      return material.uniforms.color.alpha < 1.0;
    }
  });
  /**
   * Facet
   * @type {string}
   */


  Cesium$1.Material.FacetType = 'Facet';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.FacetType, {
    fabric: {
      type: Cesium$1.Material.FacetType,
      uniforms: {
        lightColor: new Cesium$1.Color(0.25, 0.25, 0.25, 0.75),
        darkColor: new Cesium$1.Color(0.75, 0.75, 0.75, 0.75),
        frequency: 10.0
      },
      source: FacetMaterial
    },
    translucent: function (material) {
      var uniforms = material.uniforms;
      return uniforms.lightColor.alpha < 1.0 || uniforms.darkColor.alpha < 0.0;
    }
  });
  /**
   * Fresnel
   * @type {string}
   */


  Cesium$1.Material.FresnelType = 'Fresnel';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.FresnelType, {
    fabric: {
      type: Cesium$1.Material.FresnelType,
      materials: {
        reflection: {
          type: Cesium$1.Material.ReflectionType
        },
        refraction: {
          type: Cesium$1.Material.RefractionType
        }
      },
      source: FresnelMaterial
    },
    translucent: false
  });
  /**
   * Grass
   * @type {string}
   */


  Cesium$1.Material.GrassType = 'Grass';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.GrassType, {
    fabric: {
      type: Cesium$1.Material.GrassType,
      uniforms: {
        grassColor: new Cesium$1.Color(0.25, 0.4, 0.1, 1.0),
        dirtColor: new Cesium$1.Color(0.1, 0.1, 0.1, 1.0),
        patchiness: 1.5
      },
      source: GrassMaterial
    },
    translucent: function (material) {
      var uniforms = material.uniforms;
      return uniforms.grassColor.alpha < 1.0 || uniforms.dirtColor.alpha < 1.0;
    }
  });
  /**
   * Reflection
   * @type {string}
   */


  Cesium$1.Material.ReflectionType = 'Reflection';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.ReflectionType, {
    fabric: {
      type: Cesium$1.Material.ReflectionType,
      uniforms: {
        cubeMap: Cesium$1.Material.DefaultCubeMapId,
        channels: 'rgb'
      },
      source: ReflectionMaterial
    },
    translucent: false
  });
  /**
   * Refraction
   * @type {string}
   */


  Cesium$1.Material.RefractionType = 'Refraction';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.RefractionType, {
    fabric: {
      type: Cesium$1.Material.RefractionType,
      uniforms: {
        cubeMap: Cesium$1.Material.DefaultCubeMapId,
        channels: 'rgb',
        indexOfRefractionRatio: 0.9
      },
      source: RefractionMaterial
    },
    translucent: false
  });
  /**
   * TieDye
   * @type {string}
   */


  Cesium$1.Material.TyeDyeType = 'TieDye';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.TyeDyeType, {
    fabric: {
      type: Cesium$1.Material.TyeDyeType,
      uniforms: {
        lightColor: new Cesium$1.Color(1.0, 1.0, 0.0, 0.75),
        darkColor: new Cesium$1.Color(1.0, 0.0, 0.0, 0.75),
        frequency: 5.0
      },
      source: TieDyeMaterial
    },
    translucent: function (material) {
      var uniforms = material.uniforms;
      return uniforms.lightColor.alpha < 1.0 || uniforms.darkColor.alpha < 0.0;
    }
  });
  /**
   * Wood
   * @type {string}
   */


  Cesium$1.Material.WoodType = 'Wood';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.WoodType, {
    fabric: {
      type: Cesium$1.Material.WoodType,
      uniforms: {
        lightWoodColor: new Cesium$1.Color(0.6, 0.3, 0.1, 1.0),
        darkWoodColor: new Cesium$1.Color(0.4, 0.2, 0.07, 1.0),
        ringFrequency: 3.0,
        noiseScale: new Cesium$1.Cartesian2(0.7, 0.5),
        grainFrequency: 27.0
      },
      source: WoodMaterial
    },
    translucent: function (material) {
      let uniforms = material.uniforms;
      return uniforms.lightWoodColor.alpha < 1.0 || uniforms.darkWoodColor.alpha < 1.0;
    }
  });

  const CircleBlurMaterial = require('../shader/circle/CircleBlurMaterial.glsl');

  const CircleDiffuseMaterial = require('../shader/circle/CircleDiffuseMaterial.glsl');

  const CircleFadeMaterial = require('../shader/circle/CircleFadeMaterial.glsl');

  const CirclePulseMaterial = require('../shader/circle/CirclePulseMaterial.glsl');

  const CircleScanMaterial = require('../shader/circle/CircleScanMaterial.glsl');

  const CircleSpiralMaterial = require('../shader/circle/CircleSpiralMaterial.glsl');

  const CircleVaryMaterial = require('../shader/circle/CircleVaryMaterial.glsl');

  const CircleWaveMaterial = require('../shader/circle/CircleWaveMaterial.glsl');
  /**
   * CircleBlur
   * @type {string}
   */


  Cesium$1.Material.CircleBlurType = 'CircleBlur';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.CircleBlurType, {
    fabric: {
      type: Cesium$1.Material.CircleBlurType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 3.0
      },
      source: CircleBlurMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * CircleDiffuse
   * @type {string}
   */


  Cesium$1.Material.CircleDiffuseType = 'CircleDiffuse';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.CircleDiffuseType, {
    fabric: {
      type: Cesium$1.Material.CircleDiffuseType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 3.0
      },
      source: CircleDiffuseMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * CircleFade
   * @type {string}
   */


  Cesium$1.Material.CircleFadeType = 'CircleFade';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.CircleFadeType, {
    fabric: {
      type: Cesium$1.Material.CircleFadeType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 3.0
      },
      source: CircleFadeMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * CirclePulse
   * @type {string}
   */


  Cesium$1.Material.CirclePulseType = 'CirclePulse';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.CirclePulseType, {
    fabric: {
      type: Cesium$1.Material.CirclePulseType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 12.0
      },
      source: CirclePulseMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * CircleScan
   * @type {string}
   */


  Cesium$1.Material.CircleScanType = 'CircleScan';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.CircleScanType, {
    fabric: {
      type: Cesium$1.Material.CircleScanType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 1
      },
      source: CircleScanMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * CircleSpiral
   * @type {string}
   */


  Cesium$1.Material.CircleSpiralType = 'CircleSpiral';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.CircleSpiralType, {
    fabric: {
      type: Cesium$1.Material.CircleSpiralType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 3.0
      },
      source: CircleSpiralMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * CircleVary
   * @type {string}
   */


  Cesium$1.Material.CircleVaryType = 'CircleVary';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.CircleVaryType, {
    fabric: {
      type: Cesium$1.Material.CircleVaryType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 3.0
      },
      source: CircleVaryMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * CircleWave
   * @type {string}
   */


  Cesium$1.Material.CircleWaveType = 'CircleWave';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.CircleWaveType, {
    fabric: {
      type: Cesium$1.Material.CircleWaveType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 3.0,
        count: 1,
        gradient: 0.1
      },
      source: CircleWaveMaterial
    },
    translucent: function (material) {
      return true;
    }
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:21:44
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 12:23:11
   */

  const EllipsoidElectricMaterial = require('../shader/ellipsoid/EllipsoidElectricMaterial.glsl');

  const EllipsoidTrailMaterial = require('../shader/ellipsoid/EllipsoidTrailMaterial.glsl');
  /**
   * EllipsoidElectric
   * @type {string}
   */


  Cesium$1.Material.EllipsoidElectricType = 'EllipsoidElectric';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.EllipsoidElectricType, {
    fabric: {
      type: Cesium$1.Material.EllipsoidElectricType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 1
      },
      source: EllipsoidElectricMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * EllipsoidTrail
   * @type {string}
   */


  Cesium$1.Material.EllipsoidTrailType = 'EllipsoidTrail';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.EllipsoidTrailType, {
    fabric: {
      type: Cesium$1.Material.EllipsoidTrailType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 3.0
      },
      source: EllipsoidTrailMaterial
    },
    translucent: function (material) {
      return true;
    }
  });

  const LineFlickerMaterial = require('../shader/polyline/PolylineFlickerMaterial.glsl');

  const LineFlowMaterial = require('../shader/polyline/PolylineFlowMaterial.glsl');

  const LineImageTrailMaterial = require('../shader/polyline/PolylineImageTrailMaterial.glsl');

  const LineLightingMaterial = require('../shader/polyline/PolylineLightingMaterial.glsl');

  const LineLightingTrailMaterial = require('../shader/polyline/PolylineLightingTrailMaterial.glsl');

  const LineTrailMaterial = require('../shader/polyline/PolylineTrailMaterial.glsl');
  /**
   * PolylineFlicker
   * @type {string}
   */


  Cesium$1.Material.PolylineFlickerType = 'PolylineFlicker';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.PolylineFlickerType, {
    fabric: {
      type: Cesium$1.Material.PolylineFlickerType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 1
      },
      source: LineFlickerMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * PolylineFlow
   * @type {string}
   */


  Cesium$1.Material.PolylineFlowType = 'PolylineFlow';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.PolylineFlowType, {
    fabric: {
      type: Cesium$1.Material.PolylineFlowType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 1,
        percent: 0.03,
        gradient: 0.1
      },
      source: LineFlowMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * PolylineImageTrail
   * @type {string}
   */


  Cesium$1.Material.PolylineImageTrailType = 'PolylineImageTrail';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.PolylineImageTrailType, {
    fabric: {
      type: Cesium$1.Material.PolylineImageTrailType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        image: Cesium$1.Material.DefaultImageId,
        speed: 1,
        repeat: new Cesium$1.Cartesian2(1, 1)
      },
      source: LineImageTrailMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * PolylineLighting
   * @type {string}
   */


  Cesium$1.Material.PolylineLightingType = 'PolylineLighting';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.PolylineLightingType, {
    fabric: {
      type: Cesium$1.Material.PolylineLightingType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        image: Cesium$1.Material.DefaultImageId
      },
      source: LineLightingMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * PolylineLightingTrail
   * @type {string}
   */


  Cesium$1.Material.PolylineLightingTrailType = 'PolylineLightingTrail';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.PolylineLightingTrailType, {
    fabric: {
      type: Cesium$1.Material.PolylineLightingTrailType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        image: Cesium$1.Material.DefaultImageId,
        speed: 3.0
      },
      source: LineLightingTrailMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * PolylineTrail
   * @type {string}
   */


  Cesium$1.Material.PolylineTrailType = 'PolylineTrail';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.PolylineTrailType, {
    fabric: {
      type: Cesium$1.Material.PolylineTrailType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        image: Cesium$1.Material.DefaultImageId,
        speed: 1,
        repeat: new Cesium$1.Cartesian2(1, 1)
      },
      source: LineTrailMaterial
    },
    translucent: function (material) {
      return true;
    }
  });

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:21:44
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 12:23:51
   */

  const RadarLineMaterial = require('../shader/radar/RadarLineMaterial.glsl');

  const RadarSweepMaterial = require('../shader/radar/RadarSweepMaterial.glsl');

  const RadarWaveMaterial = require('../shader/radar/RadarWaveMaterial.glsl');
  /**
   * RadarLine
   * @type {string}
   */


  Cesium$1.Material.RadarLineType = 'RadarLine';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.RadarLineType, {
    fabric: {
      type: Cesium$1.Material.RadarLineType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 3.0
      },
      source: RadarLineMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * RadarSweep
   * @type {string}
   */


  Cesium$1.Material.RadarSweepType = 'RadarSweep';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.RadarSweepType, {
    fabric: {
      type: Cesium$1.Material.RadarSweepType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 3.0
      },
      source: RadarSweepMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * RadarWave
   * @type {string}
   */


  Cesium$1.Material.RadarWaveType = 'RadarWave';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.RadarWaveType, {
    fabric: {
      type: Cesium$1.Material.RadarWaveType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 3.0
      },
      source: RadarWaveMaterial
    },
    translucent: function (material) {
      return true;
    }
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:21:44
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 12:24:23
   */

  const WallImageTrailMaterial = require('../shader/wall/WallImageTrailMaterial.glsl');

  const WallLineTrailMaterial = require('../shader/wall/WallLineTrailMaterial.glsl');

  const WallTrailMaterial = require('../shader/wall/WallTrailMaterial.glsl');
  /**
   * WallImageTrail
   * @type {string}
   */


  Cesium$1.Material.WallImageTrailType = 'WallImageTrail';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.WallImageTrailType, {
    fabric: {
      type: Cesium$1.Material.WallImageTrailType,
      uniforms: {
        image: Cesium$1.Material.DefaultImageId,
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        speed: 3.0,
        repeat: new Cesium$1.Cartesian2(1, 1)
      },
      source: WallImageTrailMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   *  WallLineTrail
   * @type {string}
   */


  Cesium$1.Material.WallLineTrailType = 'WallLineTrail';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.WallLineTrailType, {
    fabric: {
      type: Cesium$1.Material.WallLineTrailType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        image: Cesium$1.Material.DefaultImageId,
        repeat: new Cesium$1.Cartesian2(1, 1),
        speed: 3.0
      },
      source: WallLineTrailMaterial
    },
    translucent: function (material) {
      return true;
    }
  });
  /**
   * WallTrail
   * @type {string}
   */


  Cesium$1.Material.WallTrailType = 'WallTrail';

  Cesium$1.Material._materialCache.addMaterial(Cesium$1.Material.WallTrailType, {
    fabric: {
      type: Cesium$1.Material.WallTrailType,
      uniforms: {
        color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
        image: Cesium$1.Material.DefaultImageId,
        speed: 1
      },
      source: WallTrailMaterial
    },
    translucent: function (material) {
      return true;
    }
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:21:44
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 12:24:58
   */

  class MaterialProperty {
    constructor(options = {}) {
      this._definitionChanged = new Cesium$1.Event();
      this._color = undefined;
      this._colorSubscription = undefined;
      this._speed = undefined;
      this._speedSubscription = undefined;
      this.color = options.color || Cesium$1.Color.fromBytes(0, 255, 255, 255);
      this.speed = options.speed || 1;
    }

    get isConstant() {
      return false;
    }

    get definitionChanged() {
      return this._definitionChanged;
    }

    getType(time) {
      return null;
    }

    getValue(time, result) {
      result = Cesium$1.defaultValue(result, {});
      return result;
    }

    equals(other) {
      return this === other;
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:43:20
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:43:55
   */

  class CircleBlurMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.CircleBlurType;
    }

    getValue(time, result) {
      result = Cesium$1.defaultValue(result, {});
      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof CircleBlurMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(CircleBlurMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:44:12
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:44:39
   */

  class CircleDiffuseMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.CircleDiffuseType;
    }

    getValue(time, result) {
      result = Cesium$1.defaultValue(result, {});
      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof CircleDiffuseMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(CircleDiffuseMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:44:54
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:45:22
   */

  class CircleFadeMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.CircleFadeType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof CircleFadeMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(CircleFadeMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:45:47
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:46:15
   */

  class CirclePulseMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.CirclePulseType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof CirclePulseMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(CirclePulseMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:46:29
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:46:55
   */

  class CircleScanMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.CircleScanType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof CircleScanMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(CircleScanMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:47:13
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:47:35
   */

  class CircleSpiralMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.CircleSpiralType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof CircleSpiralMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(CircleSpiralMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:47:50
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:48:15
   */

  class CircleVaryMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.CircleVaryType;
    }

    getValue(time, result) {
      result = Cesium$1.defaultValue(result, {});
      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof CircleVaryMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(CircleVaryMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:48:30
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:48:56
   */

  class CircleWaveMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
      this.count = Math.max(options.count || 3, 1);
      this.gradient = Cesium$1.Math.clamp(options.gradient || 0.1, 0, 1);
    }

    get isConstant() {
      return false;
    }

    get definitionChanged() {
      return this._definitionChanged;
    }

    getType(time) {
      return Cesium$1.Material.CircleWaveType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      result.count = this.count;
      result.gradient = this.gradient;
      return result;
    }

    equals(other) {
      return this === other || other instanceof CircleWaveMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(CircleWaveMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:52:01
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:52:25
   */

  class EllipsoidElectricMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.EllipsoidElectricType;
    }

    getValue(time, result) {
      result = Cesium$1.defaultValue(result, {});
      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof EllipsoidElectricMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(EllipsoidElectricMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:52:37
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:53:13
   */

  class EllipsoidTrailMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.EllipsoidTrailType;
    }

    getValue(time, result) {
      result = Cesium$1.defaultValue(result, {});
      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof EllipsoidTrailMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(EllipsoidTrailMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:54:16
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:54:37
   */

  class PolylineFlickerMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.PolylineFlickerType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof PolylineFlickerMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(PolylineFlickerMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:54:48
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:55:09
   */

  class PolylineFlowMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
      this._percent = undefined;
      this._percentSubscription = undefined;
      this._gradient = undefined;
      this._gradientSubscription = undefined;
      this.percent = options.percent || 0.03;
      this.gradient = options.gradient || 0.1;
    }

    getType(time) {
      return Cesium$1.Material.PolylineFlowType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      result.percent = this._percent;
      result.gradient = this._gradient;
      return result;
    }

    equals(other) {
      return this === other || other instanceof PolylineFlowMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed) && Cesium$1.Property.equals(this._percent, other._percent) && Cesium$1.Property.equals(this._gradient, other._gradient);
    }

  }

  Object.defineProperties(PolylineFlowMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed'),
    percent: Cesium$1.createPropertyDescriptor('percent'),
    gradient: Cesium$1.createPropertyDescriptor('gradient')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:55:26
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:55:52
   */

  class PolylineImageTrailMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
      this._image = undefined;
      this._imageSubscription = undefined;
      this._repeat = undefined;
      this._repeatSubscription = undefined;
      this.image = options.image;
      this.repeat = new Cesium$1.Cartesian2(options.repeat?.x || 1, options.repeat?.y || 1);
    }

    getType(time) {
      return Cesium$1.Material.PolylineImageTrailType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.image = Cesium$1.Property.getValueOrUndefined(this._image, time);
      result.repeat = Cesium$1.Property.getValueOrUndefined(this._repeat, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof PolylineImageTrailMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._image, other._image) && Cesium$1.Property.equals(this._repeat, other._repeat) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(PolylineImageTrailMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed'),
    image: Cesium$1.createPropertyDescriptor('image'),
    repeat: Cesium$1.createPropertyDescriptor('repeat')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:56:05
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:56:34
   */

  const IMG$3 = require('../../../images/lighting.png');

  class PolylineLightingMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
      this._image = undefined;
      this._imageSubscription = undefined;
      this.image = IMG$3;
    }

    getType(time) {
      return Cesium$1.Material.PolylineLightingType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.image = Cesium$1.Property.getValueOrUndefined(this._image, time);
      return result;
    }

    equals(other) {
      return this === other || other instanceof PolylineLightingMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._image, other._image);
    }

  }

  Object.defineProperties(PolylineLightingMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    image: Cesium$1.createPropertyDescriptor('image')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:56:49
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:57:13
   */

  const IMG$2 = require('../../../images/lighting.png');

  class PolylineLightingTrailMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
      this._image = undefined;
      this._imageSubscription = undefined;
      this.image = IMG$2;
    }

    getType(time) {
      return Cesium$1.Material.PolylineLightingTrailType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.image = Cesium$1.Property.getValueOrUndefined(this._image, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof PolylineLightingTrailMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(PolylineLightingTrailMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed'),
    image: Cesium$1.createPropertyDescriptor('image')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:57:25
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 11:57:47
   */

  class PolylineTrailMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.PolylineTrailType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof PolylineTrailMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(PolylineTrailMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:16:24
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 12:16:52
   */

  class RadarLineMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.RadarLineType;
    }

    getValue(time, result) {
      result = Cesium$1.defaultValue(result, {});
      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof RadarLineMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(RadarLineMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:17:06
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 12:17:29
   */

  class RadarSweepMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.RadarSweepType;
    }

    getValue(time, result) {
      result = Cesium$1.defaultValue(result, {});
      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof RadarSweepMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(RadarSweepMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:17:45
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 12:18:07
   */

  class RadarWaveMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
    }

    getType(time) {
      return Cesium$1.Material.RadarWaveType;
    }

    getValue(time, result) {
      result = Cesium$1.defaultValue(result, {});
      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof RadarWaveMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(RadarWaveMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:18:31
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:31:37
   */

  class WallImageTrailMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
      this._image = undefined;
      this._imageSubscription = undefined;
      this._repeat = undefined;
      this._repeatSubscription = undefined;
      this.image = options.image;
      this.repeat = new Cesium$1.Cartesian2(options.repeat.x || 1, options.repeat.y || 1);
    }

    getType(time) {
      return Cesium$1.Material.WallImageTrailType;
    }

    getValue(time, result) {
      result = Cesium$1.defaultValue(result, {});
      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.image = Cesium$1.Property.getValueOrUndefined(this._image, time);
      result.repeat = Cesium$1.Property.getValueOrUndefined(this._repeat, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof WallImageTrailMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._image, other._image) && Cesium$1.Property.equals(this._repeat, other._repeat) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(WallImageTrailMaterialProperty.prototype, {
    image: Cesium$1.createPropertyDescriptor('image'),
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed'),
    repeat: Cesium$1.createPropertyDescriptor('repeat')
  });

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:19:07
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 12:19:27
   */

  const IMG$1 = require('../../../images/space_line.png');

  class WallLineTrailMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
      this._image = undefined;
      this._imageSubscription = undefined;
      this._repeat = undefined;
      this._repeatSubscription = undefined;
      this.image = IMG$1;
      this.repeat = new Cesium$1.Cartesian2(options.repeat?.x || 1, options.repeat?.y || 1);
    }

    getType(time) {
      return Cesium$1.Material.WallLineTrailType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.image = Cesium$1.Property.getValueOrUndefined(this._image, time);
      result.repeat = Cesium$1.Property.getValueOrUndefined(this._repeat, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof WallLineTrailMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed) && Cesium$1.Property.equals(this._repeat, other._repeat);
    }

  }

  Object.defineProperties(WallLineTrailMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    image: Cesium$1.createPropertyDescriptor('image'),
    repeat: Cesium$1.createPropertyDescriptor('repeat'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:19:41
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 12:20:03
   */

  const IMG = require('../../../images/fence.png');

  class WallTrailMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
      this._image = undefined;
      this._imageSubscription = undefined;
      this.image = IMG;
    }

    getType(time) {
      return Cesium$1.Material.WallTrailType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.image = Cesium$1.Property.getValueOrUndefined(this._image, time);
      result.speed = this._speed;
      return result;
    }

    equals(other) {
      return this === other || other instanceof WallTrailMaterialProperty && Cesium$1.Property.equals(this._color, other._color) && Cesium$1.Property.equals(this._speed, other._speed);
    }

  }

  Object.defineProperties(WallTrailMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    speed: Cesium$1.createPropertyDescriptor('speed'),
    image: Cesium$1.createPropertyDescriptor('image')
  });

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:20:25
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-12 12:20:48
   */

  class WaterMaterialProperty {
    constructor(options) {
      options = options || {};
      this._definitionChanged = new Cesium$1.Event();
      this._baseWaterColor = undefined;
      this._baseWaterColorSubscription = undefined;
      this.baseWaterColor = options.baseWaterColor || new Cesium$1.Color(0.2, 0.3, 0.6, 1.0);
      this._blendColor = undefined;
      this._blendColorSubscription = undefined;
      this.blendColor = options.blendColor || new Cesium$1.Color(0.0, 1.0, 0.699, 1.0);
      this._specularMap = undefined;
      this._specularMapSubscription = undefined;
      this.specularMap = options.specularMap || Cesium$1.Material.DefaultImageId;
      this._normalMap = undefined;
      this._normalMapSubscription = undefined;
      this.normalMap = options.normalMap || Cesium$1.Material.DefaultImageId;
      this.frequency = Cesium$1.defaultValue(options.frequency, 1000);
      this.animationSpeed = Cesium$1.defaultValue(options.animationSpeed, 0.01);
      this.amplitude = Cesium$1.defaultValue(options.amplitude, 10.0);
      this.specularIntensity = Cesium$1.defaultValue(options.specularIntensity, 0.5);
    }

    get isConstant() {
      return false;
    }

    get definitionChanged() {
      return this._definitionChanged;
    }

    getType(time) {
      return Cesium$1.Material.WaterType;
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }

      result.baseWaterColor = Cesium$1.Property.getValueOrUndefined(this._baseWaterColor, time);
      result.blendColor = Cesium$1.Property.getValueOrUndefined(this._blendColor, time);
      result.specularMap = Cesium$1.Property.getValueOrUndefined(this._specularMap, time);
      result.normalMap = Cesium$1.Property.getValueOrUndefined(this._normalMap, time);
      result.frequency = this.frequency;
      result.animationSpeed = this.animationSpeed;
      result.amplitude = this.amplitude;
      result.specularIntensity = this.specularIntensity;
      return result;
    }

    equals(other) {
      return this === other || other instanceof WaterMaterialProperty && Cesium$1.Property.equals(this._baseWaterColor, other._baseWaterColor);
    }

  }

  Object.defineProperties(WaterMaterialProperty.prototype, {
    baseWaterColor: Cesium$1.createPropertyDescriptor('baseWaterColor'),
    blendColor: Cesium$1.createPropertyDescriptor('blendColor'),
    specularMap: Cesium$1.createPropertyDescriptor('specularMap'),
    normalMap: Cesium$1.createPropertyDescriptor('normalMap')
  });

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:34:12
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:44:10
   */

  class ViewerOption {
    constructor(viewer) {
      this._viewer = viewer;
      this._options = {};

      this._init();
    }
    /**
     * Init viewer
     * @private
     */


    _init() {
      this._viewer.delegate.cesiumWidget.creditContainer.style.display = 'none';

      this._viewer.delegate.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium__default['default'].ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

      this._viewer.scene.screenSpaceCameraController.maximumZoomDistance = 40489014.0;
      this._viewer.scene.backgroundColor = Cesium__default['default'].Color.TRANSPARENT;

      this._viewer.delegate.imageryLayers.removeAll();
    }
    /**
     * Sets viewer option
     * @returns {ViewerOption}
     * @private
     */


    _setViewerOption() {
      this._viewer.delegate.shadows = this._options?.shadows ?? false;
      this._viewer.delegate.resolutionScale = this._options?.resolutionScale || 1.0;
      return this;
    }
    /**
     * sets canvas option
     * @returns {ViewerOption}
     * @private
     */


    _setCanvasOption() {
      this._options.tabIndex && this._viewer.scene.canvas.setAttribute('tabIndex', this._options.tabIndex);
      return this;
    }
    /**
     * Sets scene option
     * @returns {ViewerOption}
     * @private
     */


    _setSceneOption() {
      let scene = this._viewer.scene;
      scene.skyAtmosphere.show = this._options.showAtmosphere ?? true;
      scene.sun.show = this._options.showSun ?? true;
      scene.moon.show = this._options.showMoon ?? true;
      scene.postProcessStages.fxaa.enabled = this._options.enableFxaa ?? false;
      return this;
    }
    /**
     *
     * @returns {ViewerOption}
     * @private
     */


    _setSkyBoxOption() {
      if (!this._options.skyBox) {
        return this;
      }

      let skyBox = this._viewer.scene.skyBox;
      let skyBoxOption = this._options.skyBox;
      skyBox.show = skyBoxOption.show ?? true;
      skyBox.offsetAngle = skyBoxOption.offsetAngle || 0;

      if (skyBoxOption.sources) {
        skyBox.sources = skyBoxOption?.sources;
      }

      return this;
    }
    /**
     * Sets globe option
     * @returns {ViewerOption}
     * @private
     */


    _setGlobeOption() {
      if (!this._options.globe) {
        return this;
      }

      let globe = this._viewer.scene.globe;
      let globeOption = this._options.globe;
      Util$1.merge(globe, {
        show: globeOption?.show ?? true,
        showGroundAtmosphere: globeOption?.showGroundAtmosphere ?? true,
        enableLighting: globeOption?.enableLighting ?? false,
        depthTestAgainstTerrain: globeOption?.depthTestAgainstTerrain ?? false,
        tileCacheSize: +globeOption?.tileCacheSize || 100,
        preloadSiblings: globeOption?.enableLighting ?? false,
        baseColor: globeOption?.baseColor || new Cesium__default['default'].Color(0, 0, 0.5, 1)
      });
      Util$1.merge(globe.translucency, {
        enabled: globeOption?.translucency?.enabled ?? false,
        backFaceAlpha: +globeOption?.translucency?.backFaceAlpha || 1,
        backFaceAlphaByDistance: globeOption?.translucency?.backFaceAlphaByDistance,
        frontFaceAlpha: +globeOption?.translucency?.frontFaceAlpha || 1,
        frontFaceAlphaByDistance: globeOption?.translucency?.frontFaceAlphaByDistance
      });
      return this;
    }
    /**
     *
     * @returns {ViewerOption}
     * @private
     */


    _setCameraController() {
      if (!this._options?.cameraController) {
        return this;
      }

      let sscc = this._viewer.scene.screenSpaceCameraController;
      let cameraController = this._options.cameraController;
      Util$1.merge(sscc, {
        enableInputs: cameraController?.enableInputs ?? true,
        enableRotate: cameraController?.enableRotate ?? true,
        enableTilt: cameraController?.enableTilt ?? true,
        enableTranslate: cameraController?.enableTranslate ?? true,
        enableZoom: cameraController?.enableZoom ?? true,
        enableCollisionDetection: cameraController?.enableCollisionDetection ?? true,
        minimumZoomDistance: +cameraController?.minimumZoomDistance || 1.0,
        maximumZoomDistance: +cameraController?.maximumZoomDistance || 40489014.0
      });
      return this;
    }
    /**
     * Sets options
     * @param options
     * @returns {ViewerOption}
     */


    setOptions(options) {
      if (Object.keys(options).length === 0) {
        return this;
      }

      this._options = { ...this._options,
        ...options
      };

      this._setViewerOption()._setCanvasOption()._setSceneOption()._setSkyBoxOption()._setGlobeOption()._setCameraController();

      return this;
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:24:34
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 09:25:16
   */
  let MouseMode = {
    LEFT_MIDDLE: 0,
    LEFT_RIGHT: 1
  };

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 09:25:43
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:33:43
   */

  class CameraOption {
    constructor(viewer) {
      this._viewer = viewer;
      this._mouseMode = MouseMode.LEFT_MIDDLE;
    }
    /**
     * @param min
     * @param max
     */


    setPitchRange(min, max) {
      let handler = new Cesium__default['default'].ScreenSpaceEventHandler(this._viewer.scene.canvas);

      if (this._viewer.scene.mode === Cesium__default['default'].SceneMode.SCENE3D) {
        handler.setInputAction(movement => {
          handler.setInputAction(movement => {
            let enableTilt = true;
            let isUp = movement.endPosition.y < movement.startPosition.y;

            if (isUp && this._viewer.camera.pitch > Cesium__default['default'].Math.toRadians(max)) {
              enableTilt = false;
            } else if (!isUp && this._viewer.camera.pitch < Cesium__default['default'].Math.toRadians(min)) {
              enableTilt = false;
            } else {
              enableTilt = true;
            }

            this._viewer.scene.screenSpaceCameraController.enableTilt = enableTilt;
          }, Cesium__default['default'].ScreenSpaceEventType.MOUSE_MOVE);
        }, this._mouseMode === MouseMode.LEFT_MIDDLE ? Cesium__default['default'].ScreenSpaceEventType.MIDDLE_DOWN : Cesium__default['default'].ScreenSpaceEventType.RIGHT_DOWN);
        handler.setInputAction(movement => {
          this._viewer.scene.screenSpaceCameraController.enableTilt = true;
          handler.removeInputAction(Cesium__default['default'].ScreenSpaceEventType.MOUSE_MOVE);
        }, this._mouseMode === MouseMode.LEFT_MIDDLE ? Cesium__default['default'].ScreenSpaceEventType.MIDDLE_UP : Cesium__default['default'].ScreenSpaceEventType.RIGHT_UP);
      }
    }
    /**
     *
     */


    limitCameraToGround() {
      this._viewer.camera.changed.addEventListener(frameState => {
        if (this._viewer.camera._suspendTerrainAdjustment && this._viewer.scene.mode === Cesium__default['default'].SceneMode.SCENE3D) {
          this._viewer.camera._suspendTerrainAdjustment = false;

          this._viewer.camera._adjustOrthographicFrustum(true);
        }
      });
    }
    /**
     * @param west
     * @param south
     * @param east
     * @param north
     */


    setBounds(west, south, east, north) {}
    /**
     *
     * @param mouseMode
     */


    changeMouseMode(mouseMode) {
      this._mouseMode = mouseMode || MouseMode.LEFT_MIDDLE;

      if (mouseMode === MouseMode.LEFT_MIDDLE) {
        this._viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium__default['default'].CameraEventType.MIDDLE_DRAG, Cesium__default['default'].CameraEventType.PINCH, {
          eventType: Cesium__default['default'].CameraEventType.LEFT_DRAG,
          modifier: Cesium__default['default'].KeyboardEventModifier.CTRL
        }, {
          eventType: Cesium__default['default'].CameraEventType.RIGHT_DRAG,
          modifier: Cesium__default['default'].KeyboardEventModifier.CTRL
        }];
        this._viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium__default['default'].CameraEventType.RIGHT_DRAG, Cesium__default['default'].CameraEventType.WHEEL, Cesium__default['default'].CameraEventType.PINCH];
      } else if (mouseMode === MouseMode.LEFT_RIGHT) {
        this._viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium__default['default'].CameraEventType.RIGHT_DRAG, Cesium__default['default'].CameraEventType.PINCH, {
          eventType: Cesium__default['default'].CameraEventType.LEFT_DRAG,
          modifier: Cesium__default['default'].KeyboardEventModifier.CTRL
        }, {
          eventType: Cesium__default['default'].CameraEventType.RIGHT_DRAG,
          modifier: Cesium__default['default'].KeyboardEventModifier.CTRL
        }];
        this._viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium__default['default'].CameraEventType.WHEEL, Cesium__default['default'].CameraEventType.PINCH];
      }
    }

  }

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-16 11:26:05
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 11:26:17
   */
  let TerrainType = {
    NONE: 'none',
    XYZ: 'xyz',
    ARCGIS: 'arcgis',
    GOOGLE: 'google',
    VR: 'vr'
  };

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-16 11:25:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 11:26:50
   */

  class TerrainFactory {
    /**
     * Create ellipsoid terrain
     * @param options
     * @returns {module:cesium.EllipsoidTerrainProvider}
     */
    static createEllipsoidTerrain(options) {
      return new Cesium$1.EllipsoidTerrainProvider(options);
    }
    /**
     * Create url terrain
     * @param options
     * @returns {module:cesium.CesiumTerrainProvider}
     */


    static createUrlTerrain(options) {
      return new Cesium$1.CesiumTerrainProvider(options);
    }
    /**
     * Create google terrain
     * @param options
     * @returns {module:cesium.GoogleEarthEnterpriseTerrainProvider}
     */


    static createGoogleTerrain(options) {
      return new Cesium$1.GoogleEarthEnterpriseTerrainProvider(options);
    }
    /**
     * Create arcgis terrain
     * @param options
     * @returns {module:cesium.ArcGISTiledElevationTerrainProvider}
     */


    static createArcgisTerrain(options) {
      return new Cesium$1.ArcGISTiledElevationTerrainProvider(options);
    }
    /**
     * Create vr terrain
     * @param options
     * @returns {module:cesium.VRTheWorldTerrainProvider}
     */


    static createVRTerrain(options) {
      return new Cesium$1.VRTheWorldTerrainProvider(options);
    }
    /**
     * Create Terrain
     * @param type
     * @param options
     * @returns {any}
     */


    static createTerrain(type, options) {
      let terrain = undefined;

      switch (type) {
        case TerrainType.NONE:
          terrain = this.createEllipsoidTerrain(options);
          break;

        case TerrainType.XYZ:
          terrain = this.createUrlTerrain(options);
          break;

        case TerrainType.GOOGLE:
          terrain = this.createGoogleTerrain(options);
          break;

        case TerrainType.ARCGIS:
          terrain = this.createArcgisTerrain(options);
          break;

        case TerrainType.VR:
          terrain = this.createVRTerrain(options);
          break;
      }

      return terrain;
    }

  }

  /*
   * @Description: Things对象（如特效、分析、管理类）的基类
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-11 17:09:55
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-11 17:50:09
   */

  class Things extends Event {
    /**
     * 
     * @param {Object} options
     */
    constructor(options) {
      super();
      this._id = options.id || Util$1.uuid(); // 对象的id标识

      this._enabled = options.enabled || true; // 对象的启用状态

      this._viewer = undefined;
      this._state = undefined;
    }

    set enabled(enable) {
      this._enabled = enable;
    }

    get enabled() {
      return this._enabled;
    }

    get id() {
      return this._id;
    }

    get state() {
      return this._state;
    }
    /**
     * The hook for added
     * @private
     */


    _addedHook() {}
    /**
     * The hook for removed
     * @private
     */


    _removedHook() {}

    addTo(viewer) {
      this._viewer = viewer;
      return this;
    }

  }

  /*
   * @Description: 地下模式
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-11 17:23:31
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:08:21
   */

  class Underground extends Things {
    constructor(options) {
      super(options);
      this._alpha = options.alpha || 0.5;
    }

    set alpha(alpha) {
      this._alpha = alpha;
      this._viewer.scene.globe.translucency.frontFaceAlphaByDistance.nearValue = alpha;
      this._viewer.scene.globe.translucency.frontFaceAlphaByDistance.farValue = alpha;
    }

    get alpha() {
      return this._alpha;
    }

    set enabled(enabled) {
      this._enabled = enabled;
      this._viewer.scene.globe.depthTestAgainstTerrain = enabled; // 相机对地形的碰撞检测状态

      this._viewer.scene.screenSpaceCameraController.enableCollisionDetection = !enabled;
      this._viewer.scene.globe.translucency.enabled = enabled;
    }

  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-16 10:31:03
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:27:51
   */
  const DEF_OPTS = {
    animation: false,
    //Whether to create animated widgets, lower left corner of the meter
    baseLayerPicker: false,
    //Whether to display the layer selector
    imageryProvider: false,
    // Whether to display the default imagery
    fullscreenButton: false,
    //Whether to display the full-screen button
    geocoder: false,
    //To display the geocoder widget, query the button in the upper right corner
    homeButton: false,
    //Whether to display the Home button
    infoBox: false,
    //Whether to display the information box
    sceneModePicker: false,
    //Whether to display 3D/2D selector
    selectionIndicator: false,
    //Whether to display the selection indicator component
    timeline: false,
    //Whether to display the timeline
    navigationHelpButton: false,
    //Whether to display the help button in the upper right corner
    navigationInstructionsInitiallyVisible: false,
    creditContainer: undefined,
    shouldAnimate: true
  };

  class Viewer {
    constructor(id, options = {}) {
      if (!id || !document.getElementById(id)) {
        throw new Error('Viewer: the id is empty');
      }

      this._delegate = new Cesium$1.Viewer(id, { ...DEF_OPTS,
        ...options
      }); // Initialize the viewer
      // register events

      new MouseEvent();
      this._viewerEvent = new ViewerEvent(); // Register viewer events

      this._sceneEvent = new SceneEvent(this); // Register scene events

      this._viewerOptions = new ViewerOption(this);
      this._cameraOptions = new CameraOption(this);
      this._dcContainer = DomUtil.create('div', 'dc-container', document.getElementById(id)); // Register the custom container

      this._baseLayerPicker = new Cesium$1.BaseLayerPickerViewModel({
        globe: this._delegate.scene.globe
      }); // Initialize the baseLayer picker

      this._layerGroupCache = {};
      this._layerCache = {}; // Registers default widgets

      let widgets = createWidgets();
      Object.keys(widgets).forEach(key => {
        this.use(widgets[key]);
      });
    }

    get delegate() {
      return this._delegate;
    }

    get dcContainer() {
      return this._dcContainer;
    }

    get scene() {
      return this._delegate.scene;
    }

    get camera() {
      return this._delegate.camera;
    }

    get canvas() {
      return this._delegate.canvas;
    }

    get dataSources() {
      return this._delegate.dataSources;
    }

    get imageryLayers() {
      return this._delegate.imageryLayers;
    }

    get terrainProvider() {
      return this._delegate.terrainProvider;
    }

    get entities() {
      return this._delegate.entities;
    }

    get postProcessStages() {
      return this._delegate.postProcessStages;
    }

    get clock() {
      return this._delegate.clock;
    }

    get viewerEvent() {
      return this._viewerEvent;
    }

    get cameraPosition() {
      let position = Transform$1.transformMercatorToWGS84(this.camera.positionWC);

      if (position) {
        position.heading = Cesium$1.Math.toDegrees(this.camera.heading);
        position.pitch = Cesium$1.Math.toDegrees(this.camera.pitch);
        position.roll = Cesium$1.Math.toDegrees(this.camera.roll);
      }

      return position;
    }

    _addLayerGroup(layerGroup) {
      if (layerGroup && layerGroup.layerGroupEvent && !Object(this._layerGroupCache).hasOwnProperty(layerGroup.id)) {
        layerGroup.layerGroupEvent.fire(LayerGroupEventType.ADD, this);
        this._layerGroupCache[layerGroup.id] = layerGroup;
      }
    }

    _removeLayerGroup(layerGroup) {
      if (layerGroup && layerGroup.layerGroupEvent && Object(this._layerGroupCache).hasOwnProperty(layerGroup.id)) {
        layerGroup.layerGroupEvent.fire(LayerGroupEventType.REMOVE, this);
        delete this._layerGroupCache[layerGroup.id];
      }
    }
    /**
    * @param layer
    * @private
    */


    _addLayer(layer) {
      if (layer && layer.layerEvent) {
        !this._layerCache[layer.type] && (this._layerCache[layer.type] = {});

        if (!Object(this._layerCache[layer.type]).hasOwnProperty(layer.id)) {
          layer.layerEvent.fire(LayerEventType.ADD, this);
          this._layerCache[layer.type][layer.id] = layer;
        }
      }
    }
    /**
     * @param layer
     * @private
     */


    _removeLayer(layer) {
      if (layer && layer.layerEvent && Object(this._layerCache[layer.type]).hasOwnProperty(layer.id)) {
        layer.layerEvent.fire(LayerEventType.REMOVE, this);
        delete this._layerCache[layer.type][layer.id];
      }
    }
    /**
     * Sets viewer options
     * @param options
     * @returns {Viewer}
     */


    setOptions(options) {
      this._viewerOption.setOptions(options);

      return this;
    }
    /**
     * Sets camera pitch range
     * @param min
     * @param max
     * @returns {Viewer}
     */


    setPitchRange(min = -90, max = -20) {
      this._cameraOption.setPitchRange(min, max);

      return this;
    }
    /**
     * @param west
     * @param south
     * @param east
     * @param north
     * @returns {Viewer}
     */


    setBounds(west, south, east, north) {
      this._cameraOption.setBounds(west, south, east, north);

      return this;
    }
    /**
     * Changes Scene Mode，2：2D，2.5：2.5D，3：3D
     * @param sceneMode
     * @param duration
     * @returns {Viewer}
     */


    changeSceneMode(sceneMode, duration = 0) {
      if (sceneMode === 2) {
        this._delegate.scene.morphTo2D(duration);
      } else if (sceneMode === 3) {
        this._delegate.scene.morphTo3D(duration);
      } else if (sceneMode === 2.5) {
        this._delegate.scene.morphToColumbusView(duration);
      }

      return this;
    }
    /**
     * Changes Mouse Mode，0：Default，1: Change the tiltEventTypes to CameraEventType.RIGHT_DRAG
     * @param mouseMode
     * @returns {Viewer}
     */


    changeMouseMode(mouseMode) {
      this._cameraOption.changeMouseMode(mouseMode);

      return this;
    }
    /**
     * Adds the baseLayer .
     * The baseLayer can be a single or an array,
     * and when the baseLayer is an array, the baseLayer will be loaded together
     * @param baseLayers
     * @param options
     * @returns {Viewer}
     */


    addBaseLayer(baseLayers, options = {}) {
      if (!baseLayers) {
        return this;
      }

      this._baseLayerPicker.imageryProviderViewModels.push(new Cesium$1.ProviderViewModel({
        name: options.name || '地图',
        creationFunction: () => {
          return baseLayers;
        }
      }));

      if (!this._baseLayerPicker.selectedImagery) {
        this._baseLayerPicker.selectedImagery = this._baseLayerPicker.imageryProviderViewModels[0];
      }

      this.mapSwitch && this.mapSwitch.addMap(options);
      return this;
    }
    /**
     * Changes the current globe display of the baseLayer
     * @param index
     * @returns {Viewer}
     */


    changeBaseLayer(index) {
      if (this._baseLayerPicker && index >= 0) {
        this._baseLayerPicker.selectedImagery = this._baseLayerPicker.imageryProviderViewModels[index];
      }

      return this;
    }
    /**
     * Adds the terrain
     * @param terrain
     * @returns {Viewer}
     */


    addTerrain(terrain) {
      if (!terrain) {
        return this;
      }

      this._baseLayerPicker.terrainProviderViewModels.push(new Cesium$1.ProviderViewModel({
        name: '地形',
        creationFunction: () => {
          return terrain;
        }
      }));

      if (!this._baseLayerPicker.selectedTerrain) {
        this._baseLayerPicker.selectedTerrain = this._baseLayerPicker.terrainProviderViewModels[0];
      }

      return this;
    }
    /**
     * Changes the current globe display of the terrain
     * @param index
     * @returns {Viewer}
     */


    changeTerrain(index) {
      if (this._baseLayerPicker && index >= 0) {
        this._baseLayerPicker.selectedTerrain = this._baseLayerPicker.terrainProviderViewModels[index];
      }

      return this;
    }
    /**
     * Removes terrain
     * @returns {Viewer}
     */


    removeTerrain() {
      this._baseLayerPicker.terrainProviderViewModels = [];
      this._baseLayerPicker.selectedTerrain = undefined;
      this._delegate.terrainProvider = new Cesium$1.EllipsoidTerrainProvider();
      return this;
    }
    /**
     *
     * @param layerGroup
     * @returns {Viewer}
     */


    addLayerGroup(layerGroup) {
      this._addLayerGroup(layerGroup);

      return this;
    }
    /**
     *
     * @param layerGroup
     * @returns {Viewer}
     */


    removeLayerGroup(layerGroup) {
      this._removeLayerGroup(layerGroup);

      return this;
    }
    /**
     * add a layer
     * @param layer
     * @returns {Viewer}
     */


    addLayer(layer) {
      this._addLayer(layer);

      return this;
    }
    /**
     * Removes a layer
     * @param layer
     * @returns {Viewer}
     */


    removeLayer(layer) {
      this._removeLayer(layer);

      return this;
    }
    /**
     * Checks to see if the layer is included
     * @param layer
     * @returns {boolean}
     */


    hasLayer(layer) {
      return layer && layer.layerEvent && Object(this._layerCache[layer.type]).hasOwnProperty(layer.id);
    }
    /**
     * Returns a layer by id
     * @param id
     * @returns {*|undefined}
     */


    getLayer(id) {
      let filters = this.getLayers().filter(item => item.id === id);
      return filters && filters.length ? filters[0] : undefined;
    }
    /**
     * Returns all layers
     * @returns {[]}
     */


    getLayers() {
      let result = [];
      Object.keys(this._layerCache).forEach(type => {
        let cache = this._layerCache[type];
        Object.keys(cache).forEach(layerId => {
          result.push(cache[layerId]);
        });
      });
      return result;
    }
    /**
     * Iterate through each layer and pass it as an argument to the callback function
     * @param method
     * @param context
     * @returns {Viewer}
     */


    eachLayer(method, context) {
      Object.keys(this._layerCache).forEach(type => {
        let cache = this._layerCache[type];
        Object.keys(cache).forEach(layerId => {
          method.call(context, cache[layerId]);
        });
      });
      return this;
    }
    /**
     * @param target
     * @param duration
     * @returns {Viewer}
     */


    flyTo(target, duration) {
      if (!target) {
        return this;
      }

      this._delegate.flyTo(target.delegate || target, {
        duration
      });

      return this;
    }
    /**
     * @param target
     * @returns {Viewer}
     */


    zoomTo(target) {
      if (!target) {
        return this;
      }

      this._delegate.zoomTo(target.delegate || target);

      return this;
    }
    /**
     * Camera fly to a position
     * @param position
     * @param completeCallback
     * @param duration
     * @returns {Viewer}
     */


    flyToPosition(position, completeCallback, duration) {
      position = Parse.parsePosition(position);
      this.camera.flyTo({
        destination: Transform$1.transformWGS84ToCartesian(position),
        orientation: {
          heading: Cesium$1.Math.toRadians(position.heading),
          pitch: Cesium$1.Math.toRadians(position.pitch),
          roll: Cesium$1.Math.toRadians(position.roll)
        },
        complete: completeCallback,
        duration: duration
      });
      return this;
    }
    /**
     * Camera zoom to a position
     * @param position
     * @param completeCallback
     * @returns {Viewer}
     */


    zoomToPosition(position, completeCallback) {
      this.flyToPosition(position, completeCallback, 0);
      return this;
    }
    /**
     *
     * @param type
     * @param callback
     * @param context
     * @returns {Viewer}
     */


    on(type, callback, context) {
      this._viewerEvent.on(type, callback, context || this);

      this._sceneEvent.on(type, callback, context || this);

      return this;
    }
    /**
     *
     * @param type
     * @param callback
     * @param context
     * @returns {Viewer}
     */


    once(type, callback, context) {
      this._viewerEvent.once(type, callback, context || this);

      return this;
    }
    /**
     *
     * @param type
     * @param callback
     * @param context
     * @returns {Viewer}
     */


    off(type, callback, context) {
      this._viewerEvent.off(type, callback, context || this);

      this._sceneEvent.off(type, callback, context || this);

      return this;
    }
    /**
     * Destroys the viewer.
     */


    destroy() {
      this._delegate.destroy();

      this._delegate = undefined;
      return this;
    }
    /**
     * Export scene to image
     * @param name
     * @returns {Viewer}
     */


    exportScene(name) {
      let canvas = this.canvas;
      let image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      let link = document.createElement('a');
      let blob = Util.dataURLtoBlob(image);
      let objUrl = URL.createObjectURL(blob);
      link.download = `${name || 'scene'}.png`;
      link.href = objUrl;
      link.click();
      return this;
    }
    /**
     * Adds a plugin
     * @param plugin
     * @returns {Viewer}
     */


    use(plugin) {
      if (plugin && plugin.install) {
        plugin.install(this);
      }

      return this;
    }

  }

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 13:55:52
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 10:50:57
   */
  let WidgetType = {};

  class Widget {
    constructor() {
      this._viewer = undefined;
      this._enable = false;
      this._wrapper = undefined;
      this._ready = false;
      this.type = undefined;
    }

    set enable(enable) {
      if (this._enable === enable) {
        return this;
      }

      this._enable = enable;
      this._state = this._enable ? State$1.ENABLED : State$1.DISABLED;
      this._enableHook && this._enableHook();
      return this;
    }

    get enable() {
      return this._enable;
    }

    get state() {
      return this._state;
    }
    /**
     * mount content
     * @private
     */


    _mountContent() {}
    /**
     * binds event
     * @private
     */


    _bindEvent() {}
    /**
     * Unbinds event
     * @private
     */


    _unbindEvent() {}
    /**
     * When enable modifies the hook executed, the subclass copies it as required
     * @private
     */


    _enableHook() {
      !this._ready && this._mountContent();

      if (this._enable) {
        !this._wrapper.parentNode && this._viewer.dcContainer.appendChild(this._wrapper);

        this._bindEvent();
      } else {
        this._unbindEvent();

        this._wrapper.parentNode && this._viewer.dcContainer.removeChild(this._wrapper);
      }
    }
    /**
     * Updating the Widget location requires subclass overrides
     * @param windowCoord
     * @private
     */


    _updateWindowCoord(windowCoord) {}
    /**
     * Hook for installed
     * @private
     */


    _installHook() {}
    /**
     * Installs to viewer
     * @param viewer
     */


    install(viewer) {
      this._viewer = viewer;
      /**
       * do installHook
       */

      this._installHook && this._installHook();
      this._state = State$1.INSTALLED;
    }
    /**
     * Setting  wrapper
     * @param wrapper
     * @returns {Widget}
     */


    setWrapper(wrapper) {
      return this;
    }
    /**
     * Setting widget content
     * @param content
     * @returns {Widget}
     */


    setContent(content) {
      if (content && typeof content === 'string') {
        this._wrapper.innerHTML = content;
      } else if (content && content instanceof Element) {
        while (this._wrapper.hasChildNodes()) {
          this._wrapper.removeChild(this._wrapper.firstChild);
        }

        this._wrapper.appendChild(content);
      }

      return this;
    }
    /**
     * hide widget
     */


    hide() {
      this._wrapper && (this._wrapper.style.cssText = `
    visibility:hidden;
    `);
    }
    /**
     * Registers type
     * @param type
     */


    static registerType(type) {
      if (type) {
        WidgetType[type.toLocaleUpperCase()] = type.toLocaleLowerCase();
      }
    }
    /**
     *
     * @param type
     */


    static getWidgetType(type) {
      return WidgetType[type.toLocaleUpperCase()] || undefined;
    }

  }

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-16 10:50:08
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:47:26
   */

  Widget.registerType('attribution');

  Widget.registerType('contextmenu');

  Widget.registerType('location_bar');

  Widget.registerType('map_split');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-16 10:50:09
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:48:25
   */

  Widget.registerType('map_switch');

  Widget.registerType('popup');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-16 10:50:09
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:48:41
   */

  Widget.registerType('tooltip');

  Widget.registerType('hawkeye_map');

  Widget.registerType('compass');

  new Cesium$1.EllipsoidGeodesic();

  Widget.registerType('distance_legend');

  Widget.registerType('zoom_controller');

  Widget.registerType('loading_mask');

  exports.Billboard = Billboard;
  exports.Box = Box;
  exports.CameraOption = CameraOption;
  exports.Circle = Circle;
  exports.CircleBlurMaterialProperty = CircleBlurMaterialProperty;
  exports.CircleDiffuseMaterialProperty = CircleDiffuseMaterialProperty;
  exports.CircleFadeMaterialProperty = CircleFadeMaterialProperty;
  exports.CirclePulseMaterialProperty = CirclePulseMaterialProperty;
  exports.CircleScanMaterialProperty = CircleScanMaterialProperty;
  exports.CircleSpiralMaterialProperty = CircleSpiralMaterialProperty;
  exports.CircleVaryMaterialProperty = CircleVaryMaterialProperty;
  exports.CircleWaveMaterialProperty = CircleWaveMaterialProperty;
  exports.CoordTransform = CoordTransform;
  exports.Corridor = Corridor;
  exports.Cylinder = Cylinder;
  exports.DivIcon = DivIcon;
  exports.DomUtil = DomUtil;
  exports.Effect = Effect;
  exports.Ellipse = Ellipse;
  exports.Ellipsoid = Ellipsoid;
  exports.EllipsoidElectricMaterialProperty = EllipsoidElectricMaterialProperty;
  exports.EllipsoidTrailMaterialProperty = EllipsoidTrailMaterialProperty;
  exports.Event = Event;
  exports.GeoJsonLayer = GeoJsonLayer;
  exports.HtmlLayer = HtmlLayer;
  exports.ImageryLayerFactory = ImageryLayerFactory;
  exports.ImageryType = ImageryType;
  exports.KmlLayer = KmlLayer;
  exports.Label = Label;
  exports.LabelLayer = LabelLayer;
  exports.Layer = Layer;
  exports.LayerEvent = LayerEvent;
  exports.LayerEventType = LayerEventType;
  exports.LayerGroup = LayerGroup;
  exports.LayerGroupEvent = LayerGroupEvent;
  exports.LayerGroupEventType = LayerGroupEventType;
  exports.LayerType = LayerType;
  exports.LogUtil = Log;
  exports.Model = Model;
  exports.MouseEvent = MouseEvent;
  exports.MouseEventType = MouseEventType;
  exports.Overlay = Overlay;
  exports.OverlayEvent = OverlayEvent;
  exports.OverlayEventType = OverlayEventType;
  exports.OverlayType = OverlayType;
  exports.Parse = Parse$1;
  exports.Plane = Plane;
  exports.PlotUtil = PlotUtil;
  exports.Point = Point;
  exports.Polygon = Polygon;
  exports.Polyline = Polyline;
  exports.PolylineFlickerMaterialProperty = PolylineFlickerMaterialProperty;
  exports.PolylineFlowMaterialProperty = PolylineFlowMaterialProperty;
  exports.PolylineImageTrailMaterialProperty = PolylineImageTrailMaterialProperty;
  exports.PolylineLightingMaterialProperty = PolylineLightingMaterialProperty;
  exports.PolylineLightingTrailMaterialProperty = PolylineLightingTrailMaterialProperty;
  exports.PolylineTrailMaterialProperty = PolylineTrailMaterialProperty;
  exports.PolylineVolume = PolylineVolume;
  exports.Position = Position;
  exports.PrimitiveLayer = PrimitiveLayer;
  exports.RadarLineMaterialProperty = RadarLineMaterialProperty;
  exports.RadarSweepMaterialProperty = RadarSweepMaterialProperty;
  exports.RadarWaveMaterialProperty = RadarWaveMaterialProperty;
  exports.Rectangle = Rectangle;
  exports.SceneEvent = SceneEvent;
  exports.SceneEventType = SceneEventType;
  exports.State = State$1;
  exports.TerrainFactory = TerrainFactory;
  exports.TerrainType = TerrainType;
  exports.Things = Things;
  exports.Tileset = Tileset;
  exports.TilesetLayer = TilesetLayer;
  exports.TopoJsonLayer = TopoJsonLayer;
  exports.Transform = Transform$1;
  exports.Underground = Underground;
  exports.Util = Util$1;
  exports.VectorLayer = VectorLayer;
  exports.Viewer = Viewer;
  exports.ViewerEvent = ViewerEvent;
  exports.ViewerEventType = ViewerEventType;
  exports.ViewerOption = ViewerOption;
  exports.Wall = Wall;
  exports.WallImageTrailMaterialProperty = WallImageTrailMaterialProperty;
  exports.WallLineTrailMaterialProperty = WallLineTrailMaterialProperty;
  exports.WallTrailMaterialProperty = WallTrailMaterialProperty;
  exports.WaterMaterialProperty = WaterMaterialProperty;
  exports.area = area;
  exports.bounds = bounds;
  exports.center = center;
  exports.curve = curve;
  exports.distance = distance;
  exports.heading = heading;
  exports.isBetween = isBetween;
  exports.mid = mid;
  exports.parabola = parabola;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
