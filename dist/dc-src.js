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
  const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
      ''
  );

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
                  r = 0 | (Math.random() * 16);
                  uuid[i] = CHARS[i === 19 ? (r & 0x3) | 0x8 : r];
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
      static merge(dest, ...sources) {
          let i, j, len, src;
          for (j = 0, len = sources.length; j < len; j++) {
              src = sources[j];
              for (i in src) {
                  dest[i] = src[i];
              }
          }
          return dest
      }

      /**
       * @function splitWords(str: String): String[]
       * Trims and splits the string on whitespace and returns the array of parts.
       * @param {*} str
       */
      static splitWords(str) {
          return this.trim(str).split(/\s+/)
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
          return obj.options
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
          return Math.round(num * pow) / pow
      }

      /**
       * @function trim(str: String): String
       * Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
       * @param {*} str
       */
      static trim(str) {
          return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '')
      }

      /**
       *  Data URI string containing a base64-encoded empty GIF image.
       * Used as a hack to free memory from unused images on WebKit-powered
       * mobile devices (by setting image `src` to this string).
       * @returns {string}
       */
      static emptyImageUrl() {
          return (function () {
              return 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
          })()
      }

      /**
       * @function checkPosition(position: Object): Boolean
       * Check position for validity
       * @param {*} position
       */
      static checkPosition(position) {
          return (
              position &&
              position.hasOwnProperty('_lng') &&
              position.hasOwnProperty('_lat') &&
              position.hasOwnProperty('_alt')
          )
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
          return typeof id === 'string' ? document.getElementById(id) : id
      }

      /**
       * Returns the value for a certain style attribute on an element,
       * including computed values or values set through CSS.
       * @param el
       * @param style
       * @returns {null|*}
       */
      static getStyle(el, style) {
          let value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

          if ((!value || value === 'auto') && document.defaultView) {
              let css = document.defaultView.getComputedStyle(el, null);
              value = css ? css[style] : null;
          }
          return value === 'auto' ? null : value
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
          return el
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
              return el.classList.contains(name)
          }
          let className = this.getClass(el);
          return (
              className.length > 0 &&
              new RegExp('(^|\\s)' + name + '(\\s|$)').test(className)
          )
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
              this.setClass(
                  el,
                  Util$1.trim(
                      (' ' + this.getClass(el) + ' ').replace(' ' + name + ' ', ' ')
                  )
              );
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
          return el.className.baseVal === undefined
              ? el.className
              : el.className.baseVal
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
          return svg
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
          return withWrapper ? el : el.childNodes
      }

      /**
       * enter full screen
       * @param el
       */
      static enterFullscreen(el) {
          if (!el) {
              return
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
          return videoEl
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
          return Math.sqrt(
              Math.pow(pnt1[0] - pnt2[0], 2) + Math.pow(pnt1[1] - pnt2[1], 2)
          )
      }

      /**
       * @param points
       * @returns {number}
       */
      static wholeDistance(points) {
          let distance = 0;
          for (let i = 0; i < points.length - 1; i++)
              distance += this.distance(points[i], points[i + 1]);
          return distance
      }

      /**
       * @param points
       * @returns {number}
       */
      static getBaseLength(points) {
          return Math.pow(this.wholeDistance(points), 0.99)
      }

      /**
       * @param pnt1
       * @param pnt2
       * @returns {number[]}
       */
      static mid(pnt1, pnt2) {
          return [(pnt1[0] + pnt2[0]) / 2, (pnt1[1] + pnt2[1]) / 2]
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
          return this.getIntersectPoint(pntA, pntB, pntC, pntD)
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
              return [x, y]
          }
          if (pntC[1] === pntD[1]) {
              e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1]);
              x = e * (pntC[1] - pntA[1]) + pntA[0];
              y = pntC[1];
              return [x, y]
          }
          e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1]);
          f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1]);
          y = (e * pntA[1] - pntA[0] - f * pntC[1] + pntC[0]) / (e - f);
          x = e * y - e * pntA[1] + pntA[0];
          return [x, y]
      }

      /**
       * @param startPnt
       * @param endPnt
       * @returns {number}
       */
      static getAzimuth(startPnt, endPnt) {
          let azimuth;
          let angle = Math.asin(
              Math.abs(endPnt[1] - startPnt[1]) / this.distance(startPnt, endPnt)
          );
          if (endPnt[1] >= startPnt[1] && endPnt[0] >= startPnt[0])
              azimuth = angle + Math.PI;
          else if (endPnt[1] >= startPnt[1] && endPnt[0] < startPnt[0])
              azimuth = TWO_PI - angle;
          else if (endPnt[1] < startPnt[1] && endPnt[0] < startPnt[0]) azimuth = angle;
          else if (endPnt[1] < startPnt[1] && endPnt[0] >= startPnt[0])
              azimuth = Math.PI - angle;
          return azimuth
      }

      /**
       * @param pntA
       * @param pntB
       * @param pntC
       * @returns {number}
       */
      static getAngleOfThreePoints(pntA, pntB, pntC) {
          let angle = this.getAzimuth(pntB, pntA) - this.getAzimuth(pntB, pntC);
          return angle < 0 ? angle + TWO_PI : angle
      }

      /**
       * @param pnt1
       * @param pnt2
       * @param pnt3
       * @returns {boolean}
       */
      static isClockWise(pnt1, pnt2, pnt3) {
          return (
              (pnt3[1] - pnt1[1]) * (pnt2[0] - pnt1[0]) >
              (pnt2[1] - pnt1[1]) * (pnt3[0] - pnt1[0])
          )
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
          return [x, y]
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
          let x =
              tp3 * startPnt[0] +
              3 * tp2 * t * cPnt1[0] +
              3 * tp * t2 * cPnt2[0] +
              t3 * endPnt[0];
          let y =
              tp3 * startPnt[1] +
              3 * tp2 * t * cPnt1[1] +
              3 * tp * t2 * cPnt2[1] +
              t3 * endPnt[1];
          return [x, y]
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
          return [endPnt[0] + dx, endPnt[1] + dy]
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
              let angle = startAngle + (angleDiff * i) / FITTING_COUNT;
              x = center[0] + radius * Math.cos(angle);
              y = center[1] + radius * Math.sin(angle);
              pnts.push([x, y]);
          }
          return pnts
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
          return [bisectorNormalRight, bisectorNormalLeft]
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
          return [uX, uY]
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
                  let pnt = this.getCubicValue(
                      t / FITTING_COUNT,
                      pnt1,
                      normals[i * 2],
                      normals[i * 2 + 1],
                      pnt2
                  );
                  points.push(pnt);
              }
              points.push(pnt2);
          }
          return points
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
              let d1 = this.distance(pnt1, pnt2);
              // normal at midpoint
              let n = 2.0 / d1;
              let nX = -n * pY;
              let nY = n * pX;
              // upper triangle of symmetric transform matrix
              let a11 = nX * nX - nY * nY;
              let a12 = 2 * nX * nY;
              let a22 = nY * nY - nX * nX;
              let dX = normalRight[0] - mid[0];
              let dY = normalRight[1] - mid[1];
              // coordinates of reflected vector
              controlX = mid[0] + a11 * dX + a12 * dY;
              controlY = mid[1] + a12 * dX + a22 * dY;
          } else {
              controlX = pnt1[0] + t * (pnt2[0] - pnt1[0]);
              controlY = pnt1[1] + t * (pnt2[1] - pnt1[1]);
          }
          return [controlX, controlY]
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

              let d1 = this.distance(pnt2, pnt3);
              // normal at midpoint
              let n = 2.0 / d1;
              let nX = -n * pY;
              let nY = n * pX;

              // upper triangle of symmetric transform matrix
              let a11 = nX * nX - nY * nY;
              let a12 = 2 * nX * nY;
              let a22 = nY * nY - nX * nX;

              let dX = normalLeft[0] - mid[0];
              let dY = normalLeft[1] - mid[1];

              // coordinates of reflected vector
              controlX = mid[0] + a11 * dX + a12 * dY;
              controlY = mid[1] + a12 * dX + a22 * dY;
          } else {
              controlX = pnt3[0] + t * (pnt2[0] - pnt3[0]);
              controlY = pnt3[1] + t * (pnt2[1] - pnt3[1]);
          }
          return [controlX, controlY]
      }

      /**
       * @param points
       * @returns {[]|*}
       */
      static getBezierPoints(points) {
          if (points.length <= 2) return points
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
          return bezierPoints
      }

      /**
       *
       * @param n
       * @param index
       * @returns {number}
       */
      static getBinomialFactor(n, index) {
          return (
              this.getFactorial(n) /
              (this.getFactorial(index) * this.getFactorial(n - index))
          )
      }

      /**
       * @param n
       * @returns {number}
       */
      static getFactorial(n) {
          if (n <= 1) return 1
          if (n === 2) return 2
          if (n === 3) return 6
          if (n === 4) return 24
          if (n === 5) return 120
          let result = 1;
          for (let i = 1; i <= n; i++) result *= i;
          return result
      }

      /**
       * @param points
       * @returns {[]|*}
       */
      static getQBSplinePoints(points) {
          if (points.length <= 2) return points
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
          return bSplinePoints
      }

      /**
       * @param k
       * @param t
       * @returns {number}
       */
      static getQuadricBSplineFactor(k, t) {
          if (k === 0) return Math.pow(t - 1, 2) / 2
          if (k === 1) return (-2 * Math.pow(t, 2) + 2 * t + 1) / 2
          if (k === 2) return Math.pow(t, 2) / 2
          return 0
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

  const OverlayEventType = {
      ...BaseEventType,
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
      _registerEvent() { }

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
          return removeCallback
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
          return removed
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
          return this._on(type, callback, context)
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
          return this._off(type, callback, context)
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
          return this._cache[type] || undefined
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
          if (
              scene.mode === Cesium__default['default'].SceneMode.SCENE3D &&
              !(this._viewer.terrainProvider instanceof Cesium__default['default'].EllipsoidTerrainProvider)
          ) {
              let ray = scene.camera.getPickRay(position);
              surfaceCartesian = scene.globe.pick(ray, scene);
          } else {
              surfaceCartesian = scene.camera.pickEllipsoid(
                  position,
                  Cesium__default['default'].Ellipsoid.WGS84
              );
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
          }
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
          return drillInfos
      }

      /**
       * Return the Overlay id
       * @param target
       * @returns {any}
       * @private
       */
      _getOverlayId(target) {
          let overlayId = undefined;

          // for Entity
          if (target && target.id && target.id instanceof Cesium__default['default'].Entity) {
              overlayId = target.id.overlayId;
          }

          // for Cesium3DTileFeature
          if (target && target instanceof Cesium__default['default'].Cesium3DTileFeature) {
              overlayId = target.tileset.overlayId;
          }

          return overlayId
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
          let feature = undefined;

          // for Entity
          if (target && target.id && target.id instanceof Cesium__default['default'].Entity) {
              layer = this._viewer
                  .getLayers()
                  .filter(item => item.layerId === target.id.layerId)[0];
              if (layer && layer.getOverlay) {
                  overlay = layer.getOverlay(target.id.overlayId);
              }
          }

          // for Cesium3DTileFeature
          if (target && target instanceof Cesium__default['default'].Cesium3DTileFeature) {
              layer = this._viewer
                  .getLayers()
                  .filter(item => item.layerId === target.tileset.layerId)[0];
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

          return { layer: layer, overlay: overlay, feature: feature }
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
          let overlay = targetInfo.overlay;
          // get Overlay Event
          if (overlay && overlay.overlayEvent) {
              event = overlay.overlayEvent.getEvent(type);
          }

          // get Viewer Event
          if (!event || event.numberOfListeners === 0) {
              event = this._viewer.viewerEvent.getEvent(type);
          }
          event &&
              event.numberOfListeners > 0 &&
              event.raiseEvent({
                  ...targetInfo,
                  ...mouseInfo
              });

          // get Drill Pick Event
          if (overlay && overlay.allowDrillPicking) {
              let drillInfos = this._getDrillInfos(mouseInfo.windowPosition);
              drillInfos.forEach(drillInfo => {
                  let dillOverlay = drillInfo.overlay;
                  if (
                      dillOverlay.overlayId !== overlay.overlayId &&
                      dillOverlay.overlayEvent
                  ) {
                      event = dillOverlay.overlayEvent.getEvent(type);
                      event &&
                          event.numberOfListeners > 0 &&
                          event.raiseEvent({
                              ...drillInfo,
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
              return false
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
              return false
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
              return false
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
              return false
          }
          let mouseInfo = this._getMouseInfo(movement.endPosition);
          this._viewer.canvas.style.cursor = mouseInfo.target ? 'pointer' : 'default';
          this._raiseEvent(MouseEventType.MOUSE_MOVE, mouseInfo);

          // add event for overlay
          if (
              !this._selected ||
              this._getOverlayId(this._selected.target) !==
              this._getOverlayId(mouseInfo.target)
          ) {
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
          this._raiseEvent(MouseEventType.WHEEL, { movement });
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
                  removeCallback = this._camera.moveEnd.addEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.CAMERA_CHANGED:
                  removeCallback = this._camera.changed.addEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.PRE_UPDATE:
                  removeCallback = this._scene.preUpdate.addEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.POST_UPDATE:
                  removeCallback = this._scene.postUpdate.addEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.PRE_RENDER:
                  removeCallback = this._scene.preRender.addEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.POST_RENDER:
                  removeCallback = this._scene.postRender.addEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.MORPH_COMPLETE:
                  removeCallback = this._scene.morphComplete.addEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.CLOCK_TICK:
                  removeCallback = this._clock.onTick.addEventListener(
                      callback,
                      context || this
                  );
                  break
          }
          return removeCallback
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
                  removed = this._camera.moveEnd.removeEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.CAMERA_CHANGED:
                  removed = this._camera.changed.removeEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.PRE_UPDATE:
                  removed = this._scene.preUpdate.removeEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.POST_UPDATE:
                  removed = this._scene.postUpdate.removeEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.PRE_RENDER:
                  removed = this._scene.preRender.removeEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.POST_RENDER:
                  removed = this._scene.postRender.removeEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.MORPH_COMPLETE:
                  removed = this._scene.morphComplete.removeEventListener(
                      callback,
                      context || this
                  );
                  break
              case SceneEventType.CLOCK_TICK:
                  removed = this._clock.onTick.removeEventListener(
                      callback,
                      context || this
                  );
                  break
          }

          return removed
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
      INITIALIZED: 'initialized', // 初始化
      ADDED: 'added', // 已经添加到地图上
      REMOVED: 'removed', // 已经移除地图
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
          return this 
      }

      get enable() {
          return this._enable
      }

      set gradations(graditions) {
          this._gradations = graditions;
          this._delegate && (this._delegate.uniform.gradations = graditions);
          return this
      }

      get gradations() {
          return this._gradations
      }

      set selected(selected) {
          this._selected = selected;
          this._delegate && (this._delegate.selected = selected);
          return this
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
              return this
          }
          this._viewer = viewer;
          this._state = State$1.ADDED;
          return this
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
          return this
      }

      get enable() {
          return this._enable
      }

      set contrast(contrast) {
          this._contrast = contrast;
          this._delegate && (this._delegate.uniforms.contrast = contrast);
          return this
      }

      get contrast() {
          return this._contrast
      }

      set brightness(brightness) {
          this._brightness = brightness;
          this._delegate && (this._delegate.uniforms.brightness = brightness);
          return this
      }

      get brightness() {
          return this._brightness
      }

      set glowOnly(glowOnly) {
          this._glowOnly = glowOnly;
          this._delegate && (this._delegate.uniforms.glowOnly = glowOnly);
          return this
      }

      get glowOnly() {
          return this._glowOnly
      }

      set delta(delta) {
          this._delta = delta;
          this._delegate && (this._delegate.uniforms.delta = delta);
          return this
      }

      get delta() {
          return this._delta
      }

      set sigma(sigma) {
          this._sigma = sigma;
          this._delegate && (this._delegate.uniforms.sigma = sigma);
          return this
      }

      get sigma() {
          return this._sigma
      }

      set stepSize(stepSize) {
          this._stepSize = stepSize;
          this._delegate && (this._delegate.uniforms.stepSize = stepSize);
          return this
      }

      get stepSize() {
          return this._stepSize
      }

      set selected(selected) {
          this._selected = selected;
          this._delegate && (this._delegate.selected = selected);
          return this
      }

      get selected() {
          return this._selected
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
              return this
          }
          this._viewer = viewer;
          this._state = State$1.ADDED;
          return this
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
          return this
      }

      get enable() {
          return this._enable
      }

      set intensity(intensity) {
          this._intensity = intensity;
          this._delegate && (this._delegate.uniforms.brightness = intensity);
          return this
      }

      get intensity() {
          return this._intensity
      }

      set selected(selected) {
          this._selected = selected;
          this._delegate && (this._delegate.selected = selected);
          return this
      }

      get selected() {
          return this._selected
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
              return this
          }
          this._viewer = viewer;
          this._state = State.ADDED;
          return this
      }
  }

  var img$3 = "data:image/jpeg;base64,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";

  /*
   * @Description: 云效果 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 10:34:39
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 18:51:15
   */

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
              return this
          }
          this._enable = this._delegate.show = enable;
          if (this._enable) {
              this._viewer.scene.postUpdate.addEventListener(this._onRotate, this);
          } else {
              this._viewer.scene.postUpdate.removeEventListener(this._onRotate, this);
          }
          return this
      }

      get enable() {
          return this._enable
      }

      set rotateAmount(rotateAmount) {
          this._rotateAmount = rotateAmount;
          return this
      }

      get rotateAmount() {
          return this._rotateAmount
      }

      /**
       *
       * @param scene
       * @param time
       * @private
       */
      _onRotate(scene, time) {
          if (this._rotateAmount === 0) {
              return
          }
          this._heading += this._rotateAmount;
          if (this._heading >= 360 || this._heading <= -360) {
              this._heading = 0;
          }
          this._delegate.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
              new Cesium.Cartesian3(),
              new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(this._heading), 0, 0)
          );
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
                              image: img$3
                          },
                          components: {
                              alpha:
                                  'texture2D(image, fract(repeat * materialInput.st)).r * color.a',
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
              return this
          }
          this._viewer = viewer;
          this._createPrimitive();
          this._state = State$1.ADDED;
          return this
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
          if (
              enable &&
              this._viewer &&
              Cesium$1.PostProcessStageLibrary.isDepthOfFieldSupported(
                  this._viewer.scene
              ) &&
              !this._delegate
          ) {
              this._createPostProcessStage();
          }
          this._delegate && (this._delegate.enabled = enable);
          return this
      }

      get enable() {
          return this._enable
      }

      set focalDistance(focalDistance) {
          this._focalDistance = focalDistance;
          this._delegate && (this._delegate.uniforms.focalDistance = focalDistance);
          return this
      }

      get focalDistance() {
          return this._focalDistance
      }

      set delta(delta) {
          this._delta = delta;
          this._delegate && (this._delegate.uniforms.delta = delta);
          return this
      }

      get delta() {
          return this._delta
      }

      set sigma(sigma) {
          this._sigma = sigma;
          this._delegate && (this._delegate.uniforms.sigma = sigma);
          return this
      }

      get sigma() {
          return this._sigma
      }

      set stepSize(stepSize) {
          this._stepSize = stepSize;
          this._delegate && (this._delegate.uniforms.stepSize = stepSize);
          return this
      }

      get stepSize() {
          return this._stepSize
      }

      set selected(selected) {
          this._selected = selected;
          this._delegate && (this._delegate.selected = selected);
          return this
      }

      get selected() {
          return this._selected
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
              return this
          }
          this._viewer = viewer;
          this._state = State$1.ADDED;
          return this
      }
  }

  var FogShader = "#define GLSLIFY 1\nuniform sampler2D colorTexture;uniform sampler2D depthTexture;uniform vec4 fogByDistance;uniform vec4 fogColor;varying vec2 v_textureCoordinates;float getDistance(sampler2D depthTexture,vec2 texCoords){float depth=czm_unpackDepth(texture2D(depthTexture,texCoords));if(depth==0.0){return czm_infinity;}vec4 eyeCoordinate=czm_windowToEyeCoordinates(gl_FragCoord.xy,depth);return-eyeCoordinate.z/eyeCoordinate.w;}float interpolateByDistance(vec4 nearFarScalar,float distance){float startDistance=nearFarScalar.x;float startValue=nearFarScalar.y;float endDistance=nearFarScalar.z;float endValue=nearFarScalar.w;float t=clamp((distance-startDistance)/(endDistance-startDistance),0.0,1.0);return mix(startValue,endValue,t);}vec4 alphaBlend(vec4 sourceColor,vec4 destinationColor){return sourceColor*vec4(sourceColor.aaa,1.0)+destinationColor*(1.0-sourceColor.a);}void main(void){float distance=getDistance(depthTexture,v_textureCoordinates);vec4 sceneColor=texture2D(colorTexture,v_textureCoordinates);float blendAmount=interpolateByDistance(fogByDistance,distance);vec4 finalFogColor=vec4(fogColor.rgb,fogColor.a*blendAmount);gl_FragColor=alphaBlend(finalFogColor,sceneColor);}"; // eslint-disable-line

  /*
   * @Description: 雾天效果 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 10:47:13
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 18:49:43
   */

  class FogEffect {
      constructor() {
          this._id = Util$1.uuid();
          this._viewer = undefined;
          this._delegate = undefined;
          this._enable = false;
          this._fogByDistance = { near: 10, nearValue: 0, far: 2000, farValue: 1.0 };
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
          return this
      }

      get enable() {
          return this._enable
      }

      set fogByDistance(fogByDistance) {
          this._fogByDistance = fogByDistance;
          this._delegate &&
              (this._delegate.uniforms.fogByDistance = new Cesium$1.Cartesian4(
                  this._fogByDistance?.near || 10,
                  this._fogByDistance?.nearValue || 0.0,
                  this._fogByDistance?.far || 2000,
                  this._fogByDistance?.farValue || 1.0
              ));
          return this
      }

      get fogByDistance() {
          return this._fogByDistance
      }

      set color(color) {
          this._color = color;
          this._delegate && (this._delegate.uniforms.fogColor = color);
      }

      get color() {
          return this._color
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
                  fogByDistance: new Cesium$1.Cartesian4(
                      this._fogByDistance?.near || 10,
                      this._fogByDistance?.nearValue || 0.0,
                      this._fogByDistance?.far || 200,
                      this._fogByDistance?.farValue || 1.0
                  ),
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
              return this
          }
          this._viewer = viewer;
          this._state = State$1.ADDED;
          return this
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
          return this
      }

      get enable() {
          return this._enable
      }

      set selected(selected) {
          this._selected = selected;
          this._delegate && (this._delegate.selected = selected);
          return this
      }

      get selected() {
          return this._selected
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
              return this
          }
          this._viewer = viewer;
          this._state = State$1.ADDED;
          return this
      }
  }

  var RainShader = "#define GLSLIFY 1\nuniform sampler2D colorTexture;varying vec2 v_textureCoordinates;uniform float speed;float hash(float x){return fract(sin(x*23.3)*13.13);}void main(){float time=czm_frameNumber*speed/1000.0;vec2 resolution=czm_viewport.zw;vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);vec3 c=vec3(.1,.2,.3);float a=-.3;float si=sin(a),co=cos(a);uv*=mat2(co,-si,si,co);uv*=length(uv+vec2(0,4.9))*.3+1.;float v=1.-sin(hash(floor(uv.x*100.))*2.);float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*10.;c*=v*b;gl_FragColor=mix(texture2D(colorTexture,v_textureCoordinates),vec4(c,1),0.5);}"; // eslint-disable-line

  /*
   * @Description: 雨天效果 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 10:50:07
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 18:50:55
   */

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
          return this
      }

      get enable() {
          return this._enable
      }

      set speed(speed) {
          this._speed = speed;
          this._delegate && (this._delegate.uniforms.speed = speed);
          return this
      }

      get speed() {
          return this._speed
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
              return this
          }
          this._viewer = viewer;
          this._state = State$1.ADDED;
          return this
      }
  }

  var SnowShader = "#define GLSLIFY 1\nuniform sampler2D colorTexture;varying vec2 v_textureCoordinates;uniform float speed;float snow(vec2 uv,float scale){float time=czm_frameNumber*speed/1000.0;float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);k=smoothstep(0.,k,sin(f.x+f.y)*0.01);return k*w;}void main(){vec2 resolution=czm_viewport.zw;vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);vec3 finalColor=vec3(0);float c=0.0;c+=snow(uv,10.);c+=snow(uv,8.);c+=snow(uv,6.);c+=snow(uv,5.);finalColor=(vec3(c));gl_FragColor=mix(texture2D(colorTexture,v_textureCoordinates),vec4(finalColor,1),0.3);}"; // eslint-disable-line

  /*
   * @Description: 雪天天气
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 10:17:07
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 18:50:39
   */

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
          return this
      }

      get enable() {
          return this._enable
      }

      set speed(speed){
          this._speed = speed;
          this._delegate && (this._delegate.uniforms.speed = speed);
          return this
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
              return this
          }
          this._viewer = viewer;
          this._state = State$1.ADDED;
          return this
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
          return this._comps.blackAndWhiteEffect
      }

      get bloomEffect() {
          return this._comps.bloomEffect
      }

      get brightnessEffect() {
          return this._comps.brightnessEffect
      }

      get cloudEffect() {
          return this._comps.cloudEffect
      }

      get depthOfFieldEffect() {
          return this._comps.depthOfFieldEffect
      }

      get fogEffect() {
          return this._comps.fogEffect
      }

      get nightVisionEffect() {
          return this._comps.nightVisionEffect
      }

      get rainEffect() {
          return this._comps.rainEffect
      }

      get snowEffect() {
          return this._comps.snowEffect
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
  const BD_FACTOR = (3.14159265358979324 * 3000.0) / 180.0;
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
          return [gg_lng, gg_lat]
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
          let z =
              Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * BD_FACTOR);
          let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * BD_FACTOR);
          let bd_lng = z * Math.cos(theta) + 0.0065;
          let bd_lat = z * Math.sin(theta) + 0.006;
          return [bd_lng, bd_lat]
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
              return [lng, lat]
          } else {
              let d = this.delta(lng, lat);
              return [lng + d[0], lat + d[1]]
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
              return [lng, lat]
          } else {
              let d = this.delta(lng, lat);
              let mgLng = lng + d[0];
              let mgLat = lat + d[1];
              return [lng * 2 - mgLng, lat * 2 - mgLat]
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
          const radLat = (lat / 180) * PI;
          let magic = Math.sin(radLat);
          magic = 1 - EE * magic * magic;
          const sqrtMagic = Math.sqrt(magic);
          dLng = (dLng * 180) / ((RADIUS / sqrtMagic) * Math.cos(radLat) * PI);
          dLat = (dLat * 180) / (((RADIUS * (1 - EE)) / (magic * sqrtMagic)) * PI);
          return [dLng, dLat]
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
          let ret =
              300.0 +
              lng +
              2.0 * lat +
              0.1 * lng * lng +
              0.1 * lng * lat +
              0.1 * Math.sqrt(Math.abs(lng));
          ret +=
              ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
                  2.0) /
              3.0;
          ret +=
              ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
              3.0;
          ret +=
              ((150.0 * Math.sin((lng / 12.0) * PI) +
                  300.0 * Math.sin((lng / 30.0) * PI)) *
                  2.0) /
              3.0;
          return ret
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
          let ret =
              -100.0 +
              2.0 * lng +
              3.0 * lat +
              0.2 * lat * lat +
              0.1 * lng * lat +
              0.2 * Math.sqrt(Math.abs(lng));
          ret +=
              ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
                  2.0) /
              3.0;
          ret +=
              ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
              3.0;
          ret +=
              ((160.0 * Math.sin((lat / 12.0) * PI) +
                  320 * Math.sin((lat * PI) / 30.0)) *
                  2.0) /
              3.0;
          return ret
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
          return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55)
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
              result = CoordTransform.WGS84ToGCJ02(
                  Cesium$1.Math.toDegrees(cartographic.longitude),
                  Cesium$1.Math.toDegrees(cartographic.latitude)
              );
              result = projection.project(
                  new Cesium$1.Cartographic(
                      Cesium$1.Math.toRadians(result[0]),
                      Cesium$1.Math.toRadians(result[1])
                  )
              );
              return new Cesium$1.Cartesian2(result.x, result.y)
          };
          this._projection.unproject = function (cartesian, result) {
              let cartographic = projection.unproject(cartesian);
              result = CoordTransform.GCJ02ToWGS84(
                  Cesium$1.Math.toDegrees(cartographic.longitude),
                  Cesium$1.Math.toDegrees(cartographic.latitude)
              );
              return new Cesium$1.Cartographic(
                  Cesium$1.Math.toRadians(result[0]),
                  Cesium$1.Math.toRadians(result[1])
              )
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

  const IMG_URL$3 =
      'https://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';

  const ELEC_URL$2 =
      'https://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';

  const LOAD_MARK_URL =
      'https://webst{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';
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
  const MC2LL = [
      [
          1.410526172116255e-8,
          8.98305509648872e-6,
          -1.9939833816331,
          2.009824383106796e2,
          -1.872403703815547e2,
          91.6087516669843,
          -23.38765649603339,
          2.57121317296198,
          -0.03801003308653,
          1.73379812e7
      ],
      [
          -7.435856389565537e-9,
          8.983055097726239e-6,
          -0.78625201886289,
          96.32687599759846,
          -1.85204757529826,
          -59.36935905485877,
          47.40033549296737,
          -16.50741931063887,
          2.28786674699375,
          1.026014486e7
      ],
      [
          -3.030883460898826e-8,
          8.98305509983578e-6,
          0.30071316287616,
          59.74293618442277,
          7.357984074871,
          -25.38371002664745,
          13.45380521110908,
          -3.29883767235584,
          0.32710905363475,
          6.85681737e6
      ],
      [
          -1.981981304930552e-8,
          8.983055099779535e-6,
          0.03278182852591,
          40.31678527705744,
          0.65659298677277,
          -4.44255534477492,
          0.85341911805263,
          0.12923347998204,
          -0.04625736007561,
          4.48277706e6
      ],
      [
          3.09191371068437e-9,
          8.983055096812155e-6,
          0.00006995724062,
          23.10934304144901,
          -0.00023663490511,
          -0.6321817810242,
          -0.00663494467273,
          0.03430082397953,
          -0.00466043876332,
          2.5551644e6
      ],
      [
          2.890871144776878e-9,
          8.983055095805407e-6,
          -0.00000003068298,
          7.47137025468032,
          -0.00000353937994,
          -0.02145144861037,
          -0.00001234426596,
          0.00010322952773,
          -0.00000323890364,
          8.260885e5
      ]
  ];
  const LL2MC = [
      [
          -0.0015702102444,
          1.113207020616939e5,
          1.704480524535203e15,
          -1.033898737604234e16,
          2.611266785660388e16,
          -3.51496691766537e16,
          2.659570071840392e16,
          -1.072501245418824e16,
          1.800819912950474e15,
          82.5
      ],
      [
          8.277824516172526e-4,
          1.113207020463578e5,
          6.477955746671608e8,
          -4.082003173641316e9,
          1.077490566351142e10,
          -1.517187553151559e10,
          1.205306533862167e10,
          -5.124939663577472e9,
          9.133119359512032e8,
          67.5
      ],
      [
          0.00337398766765,
          1.113207020202162e5,
          4.481351045890365e6,
          -2.339375119931662e7,
          7.968221547186455e7,
          -1.159649932797253e8,
          9.723671115602145e7,
          -4.366194633752821e7,
          8.477230501135234e6,
          52.5
      ],
      [
          0.00220636496208,
          1.113207020209128e5,
          5.175186112841131e4,
          3.796837749470245e6,
          9.920137397791013e5,
          -1.22195221711287e6,
          1.340652697009075e6,
          -6.209436990984312e5,
          1.444169293806241e5,
          37.5
      ],
      [
          -3.441963504368392e-4,
          1.113207020576856e5,
          2.782353980772752e2,
          2.485758690035394e6,
          6.070750963243378e3,
          5.482118345352118e4,
          9.540606633304236e3,
          -2.71055326746645e3,
          1.405483844121726e3,
          22.5
      ],
      [
          -3.218135878613132e-4,
          1.113207020701615e5,
          0.00369383431289,
          8.237256402795718e5,
          0.46104986909093,
          2.351343141331292e3,
          1.58060784298199,
          8.77738589078284,
          0.37238884252424,
          7.45
      ]
  ];

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
              return 0
          }
          point1 = this.convertMC2LL(point1);
          if (!point1) {
              return 0
          }
          let x1 = this.toRadians(point1['lng']);
          let y1 = this.toRadians(point1['lat']);
          point2 = this.convertMC2LL(point2);
          if (!point2) {
              return 0
          }
          let x2 = this.toRadians(point2['lng']);
          let y2 = this.toRadians(point2['lat']);
          return this.getDistance(x1, x2, y1, y2)
      }

      /**
       * Calculate the distance between two points according to the latitude and longitude coordinates
       * @param point1
       * @param point2
       * @returns {number|*}
       */
      getDistanceByLL(point1, point2) {
          if (!point1 || !point2) {
              return 0
          }
          point1['lng'] = this.getLoop(point1['lng'], -180, 180);
          point1['lat'] = this.getRange(point1['lat'], -74, 74);
          point2['lng'] = this.getLoop(point2['lng'], -180, 180);
          point2['lat'] = this.getRange(point2['lat'], -74, 74);
          let x1 = this.toRadians(point1['lng']);
          let y1 = this.toRadians(point1['lat']);
          let x2 = this.toRadians(point2['lng']);
          let y2 = this.toRadians(point2['lat']);
          return this.getDistance(x1, x2, y1, y2)
      }

      /**
       * The plane cartesian coordinates are converted to latitude and longitude coordinates
       * @param point
       * @returns {Point|{lng: number, lat: number}}
       */
      convertMC2LL(point) {
          if (!point) {
              return { lng: 0, lat: 0 }
          }
          let lnglat = {};
          if (this.isWgs84) {
              lnglat.lng = (point.lng / 20037508.34) * 180;
              let mmy = (point.lat / 20037508.34) * 180;
              lnglat.lat =
                  (180 / Math.PI) *
                  (2 * Math.atan(Math.exp((mmy * Math.PI) / 180)) - Math.PI / 2);
              return {
                  lng: lnglat['lng'].toFixed(6),
                  lat: lnglat['lat'].toFixed(6)
              }
          }

          let temp = {
              lng: Math.abs(point['lng']),
              lat: Math.abs(point['lat'])
          };

          let factor = undefined;
          for (let i = 0; i < MC_BAND.length; i++) {
              if (temp['lat'] >= MC_BAND[i]) {
                  factor = MC2LL[i];
                  break
              }
          }
          lnglat = this.convertor(point, factor);
          return {
              lng: lnglat['lng'].toFixed(6),
              lat: lnglat['lat'].toFixed(6)
          }
      }

      /**
       * The latitude and longitude coordinates are converted to plane cartesian coordinates
       * @param point
       * @returns {{lng: number, lat: number}|*}
       */
      convertLL2MC(point) {
          if (!point) {
              return { lng: 0, lat: 0 }
          }
          if (
              point['lng'] > 180 ||
              point['lng'] < -180 ||
              point['lat'] > 90 ||
              point['lat'] < -90
          ) {
              return point
          }

          if (this.isWgs84) {
              let mercator = {};
              let earthRad = 6378137.0;
              mercator.lng = ((point.lng * Math.PI) / 180) * earthRad;
              let a = (point.lat * Math.PI) / 180;
              mercator.lat =
                  (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));

              return {
                  lng: parseFloat(mercator['lng'].toFixed(2)),
                  lat: parseFloat(mercator['lat'].toFixed(2))
              }
          }

          point['lng'] = this.getLoop(point['lng'], -180, 180);
          point['lat'] = this.getRange(point['lat'], -74, 74);
          let temp = { lng: point['lng'], lat: point['lat'] };
          let factor = undefined;
          for (let i = 0; i < LL_BAND.length; i++) {
              if (temp['lat'] >= LL_BAND[i]) {
                  factor = LL2MC[i];
                  break
              }
          }
          if (!factor) {
              for (let i = 0; i < LL_BAND.length; i++) {
                  if (temp['lat'] <= -LL_BAND[i]) {
                      factor = LL2MC[i];
                      break
                  }
              }
          }
          let mc = this.convertor(point, factor);
          return {
              lng: parseFloat(mc['lng'].toFixed(2)),
              lat: parseFloat(mc['lat'].toFixed(2))
          }
      }

      /**
       *
       * @param fromPoint
       * @param factor
       * @returns {{lng: *, lat: *}}
       */
      convertor(fromPoint, factor) {
          if (!fromPoint || !factor) {
              return { lng: 0, lat: 0 }
          }
          let x = factor[0] + factor[1] * Math.abs(fromPoint['lng']);
          let temp = Math.abs(fromPoint['lat']) / factor[9];
          let y =
              factor[2] +
              factor[3] * temp +
              factor[4] * temp * temp +
              factor[5] * temp * temp * temp +
              factor[6] * temp * temp * temp * temp +
              factor[7] * temp * temp * temp * temp * temp +
              factor[8] * temp * temp * temp * temp * temp * temp;
          x *= fromPoint['lng'] < 0 ? -1 : 1;
          y *= fromPoint['lat'] < 0 ? -1 : 1;
          return {
              lng: x,
              lat: y
          }
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
          return (
              EARTH_RADIUS *
              Math.acos(
                  Math.sin(y1) * Math.sin(y2) +
                  Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)
              )
          )
      }

      /**
       *
       * @param deg
       * @returns {number}
       */
      toRadians(deg) {
          return (Math.PI * deg) / 180
      }

      /**
       *
       * @param rad
       * @returns {number}
       */
      toDegrees(rad) {
          return (180 * rad) / Math.PI
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
          return v
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
          return v
      }

      /**
       *
       * @param point
       * @returns {{lng: number, lat: number}|*}
       */
      lngLatToMercator(point) {
          return this.convertLL2MC(point)
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
          }
      }

      /**
       * WebMercator transforms to latitude and longitude
       * @param point
       * @returns {Point|{lng: number, lat: number}}
       */
      mercatorToLngLat(point) {
          return this.convertMC2LL(point)
      }

      /**
       *
       * @param point
       * @returns {Point|{lng: number, lat: number}}
       */
      pointToLngLat(point) {
          let mercator = { lng: point.x, lat: point.y };
          return this.convertMC2LL(mercator)
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
              return { x: 0, y: 0 }
          }
          point = this.lngLatToMercator(point);
          let zoomUnits = this.getZoomUnits(zoom);
          let x = Math.round(
              (point['lng'] - mapCenter['lng']) / zoomUnits + mapSize.width / 2
          );
          let y = Math.round(
              (mapCenter['lat'] - point['lat']) / zoomUnits + mapSize.height / 2
          );
          return { x, y }
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
              return { lng: 0, lat: 0 }
          }
          let zoomUnits = this.getZoomUnits(zoom);
          let lng = mapCenter['lng'] + zoomUnits * (pixel.x - mapSize.width / 2);
          let lat = mapCenter['lat'] - zoomUnits * (pixel.y - mapSize.height / 2);
          let point = { lng, lat };
          return this.mercatorToLngLat(point)
      }

      /**
       *
       * @param zoom
       * @returns {number}
       */
      getZoomUnits(zoom) {
          return Math.pow(2, 18 - zoom)
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
              result = CoordTransform.WGS84ToGCJ02(
                  Cesium$1.Math.toDegrees(cartographic.longitude),
                  Cesium$1.Math.toDegrees(cartographic.latitude)
              );
              result = CoordTransform.GCJ02ToBD09(result[0], result[1]);
              result[0] = Math.min(result[0], 180);
              result[0] = Math.max(result[0], -180);
              result[1] = Math.min(result[1], 74.000022);
              result[1] = Math.max(result[1], -71.988531);
              result = projection.lngLatToPoint({
                  lng: result[0],
                  lat: result[1]
              });
              return new Cesium$1.Cartesian2(result.x, result.y)
          };
          this._projection.unproject = function (cartesian, result) {
              result = result || {};
              result = projection.mercatorToLngLat({
                  lng: cartesian.x,
                  lat: cartesian.y
              });
              result = CoordTransform.BD09ToGCJ02(result.lng, result.lat);
              result = CoordTransform.GCJ02ToWGS84(result[0], result[1]);
              return new Cesium$1.Cartographic(
                  Cesium$1.Math.toRadians(result[0]),
                  Cesium$1.Math.toRadians(result[1])
              )
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
              return new Cesium$1.Rectangle(west, south, east, north)
          }

          result.west = west;
          result.south = south;
          result.east = east;
          result.north = north;
          return result
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
              return undefined
          }
          const projection = this._projection;
          const webMercatorPosition = projection.project(position);
          if (!Cesium$1.defined(webMercatorPosition)) {
              return undefined
          }
          const tileWidth = this.resolutions[level];
          const xTileCoordinate = Math.floor(webMercatorPosition.x / tileWidth);
          const yTileCoordinate = -Math.floor(webMercatorPosition.y / tileWidth);
          if (!Cesium$1.defined(result)) {
              return new Cesium$1.Cartesian2(xTileCoordinate, yTileCoordinate)
          }
          result.x = xTileCoordinate;
          result.y = yTileCoordinate;
          return result
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

  const IMG_URL$2 =
      'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46';

  const VEC_URL =
      'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020';

  const CUSTOM_URL =
      'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid={style}';

  const TRAFFIC_URL =
      'http://its.map.baidu.com:8002/traffic/TrafficTileService?time={time}&label={labelStyle}&v=016&level={z}&x={x}&y={y}&scaler=2';

  class BaiduImageryProvider {
      constructor(options = {}) {
          this._url =
              options.style === 'img'
                  ? IMG_URL$2
                  : options.style === 'vec'
                      ? VEC_URL
                      : options.style === 'traffic'
                          ? TRAFFIC_URL
                          : CUSTOM_URL;
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
                  rectangleSouthwestInMeters: new Cesium$1.Cartesian2(
                      -20037726.37,
                      -12474104.17
                  ),
                  rectangleNortheastInMeters: new Cesium$1.Cartesian2(
                      20037726.37,
                      12474104.17
                  )
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
          return this._url
      }

      get token() {
          return this._token
      }

      get tileWidth() {
          if (!this.ready) {
              throw new Cesium$1.DeveloperError(
                  'tileWidth must not be called before the imagery provider is ready.'
              )
          }
          return this._tileWidth
      }

      get tileHeight() {
          if (!this.ready) {
              throw new Cesium$1.DeveloperError(
                  'tileHeight must not be called before the imagery provider is ready.'
              )
          }
          return this._tileHeight
      }

      get maximumLevel() {
          if (!this.ready) {
              throw new Cesium$1.DeveloperError(
                  'maximumLevel must not be called before the imagery provider is ready.'
              )
          }
          return this._maximumLevel
      }

      get minimumLevel() {
          if (!this.ready) {
              throw new Cesium$1.DeveloperError(
                  'minimumLevel must not be called before the imagery provider is ready.'
              )
          }
          return 0
      }

      get tilingScheme() {
          if (!this.ready) {
              throw new Cesium$1.DeveloperError(
                  'tilingScheme must not be called before the imagery provider is ready.'
              )
          }
          return this._tilingScheme
      }

      get rectangle() {
          if (!this.ready) {
              throw new Cesium$1.DeveloperError(
                  'rectangle must not be called before the imagery provider is ready.'
              )
          }
          return this._rectangle
      }

      get ready() {
          return !!this._url
      }

      get credit() {
          return this._credit
      }

      get hasAlphaChannel() {
          return true
      }

      getTileCredits(x, y, level) { }

      /**
       * Request Image
       * @param x
       * @param y
       * @param level
       * @returns {Promise<HTMLImageElement | HTMLCanvasElement>}
       */
      requestImage(x, y, level) {
          if (!this.ready) {
              throw new Cesium$1.DeveloperError(
                  'requestImage must not be called before the imagery provider is ready.'
              )
          }
          let xTiles = this._tilingScheme.getNumberOfXTilesAtLevel(level);
          let yTiles = this._tilingScheme.getNumberOfYTilesAtLevel(level);
          let url = this._url
              .replace('{z}', level)
              .replace('{s}', String(1))
              .replace('{style}', this._style)
              .replace('{labelStyle}', this._labelStyle)
              .replace('{time}', String(new Date().getTime()));

          if (this._crs === 'WGS84') {
              url = url.replace('{x}', String(x)).replace('{y}', String(-y));
          } else {
              url = url
                  .replace('{x}', String(x - xTiles / 2))
                  .replace('{y}', String(yTiles / 2 - y - 1));
          }
          return Cesium$1.ImageryProvider.loadImage(this, url)
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
  const ELEC_URL$1 =
      'http://mt{s}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile';

  const IMG_URL$1 =
      'http://mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali';

  const TER_URL =
      'http://mt{s}.google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galile';

  class GoogleImageryProvider extends Cesium$1.UrlTemplateImageryProvider {
      constructor(options = {}) {
          options['url'] =
              options.style === 'img'
                  ? IMG_URL$1
                  : options.style === 'ter'
                      ? TER_URL
                      : ELEC_URL$1;
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

  const MAP_URL =
      'https://t{s}.tianditu.gov.cn/DataServer?T={style}_w&x={x}&y={y}&l={z}&tk={key}';

  class TdtImageryProvider extends Cesium$1.UrlTemplateImageryProvider {
      constructor(options = {}) {
          super({
              url: MAP_URL.replace(/\{style\}/g, options.style || 'vec').replace(
                  /\{key\}/g,
                  options.key || ''
              ),
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

  const IMG_URL =
      'https://p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=400';

  const ELEC_URL =
      'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid={style}&scene=0&version=347';

  class TencentImageryProvider extends Cesium$1.UrlTemplateImageryProvider {
      constructor(options = {}) {
          let url = options.style === 'img' ? IMG_URL : ELEC_URL;
          options['url'] = url.replace('{style}', options.style || 1);
          options['subdomains'] = options.subdomains || ['1', '2', '3'];
          if (options.style === 'img') {
              options['customTags'] = {
                  sx: (imageryProvider, x, y, level) => {
                      return x >> 4
                  },
                  sy: (imageryProvider, x, y, level) => {
                      return ((1 << level) - y) >> 4
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
          return new AmapImageryProvider(options)
      }

      /**
       * Create baidu image layer
       * @param options
       * @returns {BaiduImageryProvider}
       */
      static createBaiduImageryLayer(options) {
          return new BaiduImageryProvider(options)
      }

      /**
       * Create google image layer
       * @param options
       * @returns {GoogleImageryProvider}
       */
      static createGoogleImageryLayer(options) {
          return new GoogleImageryProvider(options)
      }

      /**
       * Create tdt image layer
       * @param options
       * @returns {TdtImageryProvider}
       */
      static createTdtImageryLayer(options) {
          return new TdtImageryProvider(options)
      }

      /**
       * Create tencent image layer
       * @param options
       * @returns {TencentImageryProvider}
       */
      static createTencentImageryLayer(options) {
          return new TencentImageryProvider(options)
      }

      /**
       * Create arcgis image layer
       * @param options
       * @returns {module:cesium.ArcGisMapServerImageryProvider}
       */
      static createArcGisImageryLayer(options) {
          return new Cesium$1.ArcGisMapServerImageryProvider(options)
      }

      /**
       * Create single tile image layer
       * @param options
       * @returns {module:cesium.SingleTileImageryProvider}
       */
      static createSingleTileImageryLayer(options) {
          return new Cesium$1.SingleTileImageryProvider(options)
      }

      /**
       * Create WMS image layer
       * @param options
       * @returns {module:cesium.WebMapServiceImageryProvider}
       */
      static createWMSImageryLayer(options) {
          return new Cesium$1.WebMapServiceImageryProvider(options)
      }

      /**
       * Create WMTS image layer
       * @param options
       * @returns {module:cesium.WebMapTileServiceImageryProvider}
       */
      static createWMTSImageryLayer(options) {
          return new Cesium$1.WebMapTileServiceImageryProvider(options)
      }

      /**
       * Create xyz image layer
       * @param options
       * @returns {module:cesium.UrlTemplateImageryProvider}
       */
      static createXYZImageryLayer(options) {
          return new Cesium$1.UrlTemplateImageryProvider(options)
      }

      /**
       * Create coord image layer
       * @param options
       * @returns {module:cesium.TileCoordinatesImageryProvider}
       */
      static createCoordImageryLayer(options) {
          return new Cesium$1.TileCoordinatesImageryProvider(options)
      }

      /**
       * Create mapbox image layer
       * @param  options 
       * @returns {module: cesium.MapboxImageryProvider}
       */
      static createMapboxImageryLayer(options) {
          return new Cesium$1.MapboxImageryProvider(options)
      }


      /**
       * Create mapboxStyle image layer
       * @param  options 
       * @returns 
       */
      static createMapboxStyleImageryLayer(options) {
          return new Cesium$1.MapboxStyleImageryProvider(options)
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
                  break
              case ImageryType.BAIDU:
                  imageryLayer = this.createBaiduImageryLayer(options);
                  break
              case ImageryType.GOOGLE:
                  imageryLayer = this.createGoogleImageryLayer(options);
                  break
              case ImageryType.TDT:
                  imageryLayer = this.createTdtImageryLayer(options);
                  break
              case ImageryType.TENCENT:
                  imageryLayer = this.createTencentImageryLayer(options);
                  break
              case ImageryType.ARCGIS:
                  imageryLayer = this.createArcGisImageryLayer(options);
                  break
              case ImageryType.SINGLE_TILE:
                  imageryLayer = this.createSingleTileImageryLayer(options);
                  break
              case ImageryType.WMS:
                  imageryLayer = this.createWMSImageryLayer(options);
                  break
              case ImageryType.WMTS:
                  imageryLayer = this.createWMTSImageryLayer(options);
                  break
              case ImageryType.XYZ:
                  imageryLayer = this.createXYZImageryLayer(options);
                  break
              case ImageryType.COORD:
                  imageryLayer = this.createCoordImageryLayer(options);
                  break
              case ImageryType.MAPBOX:
                  imageryLayer = this.createMapboxImageryLayer(options);
                  break
              case ImageryType.MAPBOX_STYLE:
                  imageryLayer = this.createMapboxStyleImageryLayer(options);        
          }
          return imageryLayer
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
  let LayerType = {

  };

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
          return this._id
      }

      get id() {
          return this._bid
      }

      get delegate() {
          return this._delegate
      }

      set show(show) {
          this._show = show;
          this._delegate && (this._delegate.show = this._show);
      }

      get show() {
          return this._show
      }

      get layerEvent() {
          return this._layerEvent
      }

      set attr(attr) {
          this._attr = attr;
      }

      get attr() {
          return this._attr
      }

      get state() {
          return this._state
      }

      /**
       * The hook for added
       * @private
       */
      _addedHook() { }

      /**
       * The hook for removed
       * @private
       */
      _removedHook() { }

      /**
       * The layer added callback function
       * Subclasses need to be overridden
       * @param viewer
       * @private
       */
      _onAdd(viewer) {
          this._viewer = viewer;
          if (!this._delegate) {
              return
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
              return
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
          if (
              overlay &&
              overlay.overlayEvent &&
              !this._cache.hasOwnProperty(overlay.overlayId)
          ) {
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
          if (
              overlay &&
              overlay.overlayEvent &&
              this._cache.hasOwnProperty(overlay.overlayId)
          ) {
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
          return this
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
          return this
      }

      /**
       * Remove overlay
       * @param overlay
       * @returns {Layer}
       */
      removeOverlay(overlay) {
          this._removeOverlay(overlay);
          return this
      }

      /**
       * Returns the overlay by overlayId
       * @param overlayId
       * @returns {*|undefined}
       */
      getOverlay(overlayId) {
          return this._cache[overlayId] || undefined
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
          return overlay
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
          return result
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
          return this
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
          return result
      }

      /**
       * Clears all overlays
       * Subclasses need to be overridden
       */
      clear() { }

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
          return this
      }

      /**
       * sets the style, the style will apply to every overlay of the layer
       * Subclasses need to be overridden
       * @param style
       */
      setStyle(style) { }

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
          return LayerType[type.toLocaleUpperCase()] || undefined
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
          return this._id
      }

      set show(show) {
          this._show = show;
          Object.keys(this._cache).forEach(key => {
              this._cache[key].show = this._show;
          });
      }

      get show() {
          return this._show
      }

      get layerGroupEvent() {
          return this._layerGroupEvent
      }

      get state() {
          return this._state
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
          return this
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
          return this
      }

      /**
       * Returns a layer by id
       * @param id
       * @returns {*|undefined}
       */
      getLayer(id) {
          return this._cache[id] || undefined
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
          return result
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
          return this
      }

      /**
       *
       * @returns {LayerGroup}
       */
      remove() {
          this._viewer && this._viewer.removeLayerGroup(this);
          return this
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
          return this
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
          return this._lng
      }

      set lat(lat) {
          this._lat = +lat;
      }

      get lat() {
          return this._lat
      }

      set alt(alt) {
          this._alt = +alt;
      }

      get alt() {
          return this._alt
      }

      set heading(heading) {
          this._heading = +heading;
      }

      get heading() {
          return this._heading
      }

      set pitch(pitch) {
          this._pitch = +pitch;
      }

      get pitch() {
          return this._pitch
      }

      set roll(roll) {
          this._roll = +roll;
      }

      get roll() {
          return this._roll
      }

      serialize() {
          let position = new Position(
              this._lng,
              this._lat,
              this._alt,
              this._heading,
              this._pitch,
              this._roll
          );
          return JSON.stringify(position)
      }

      /**
       * Calculate the distance between two positions
       * @param target
       * @returns {number}
       */
      distance(target) {
          if (!target || !(target instanceof Position)) {
              return 0
          }
          return Cesium$1.Cartesian3.distance(
              Transform$1.transformWGS84ToCartesian(this),
              Transform$1.transformWGS84ToCartesian(target)
          )
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
          return position
      }

      /**
       *
       * @returns {*[]}
       */
      toArray() {
          return [this.lng, this.lat, this.alt, this.heading, this.pitch, this.roll]
      }

      /**
       *
       * @returns {string}
       */
      toString() {
          return `${this.lng},${this.lat},${this.alt},${this.heading},${this.pitch},${this.roll}`
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
          return position
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
          return position
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
          return position
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
          return position
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
          return position
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
              let cartographic = Cesium$1.Ellipsoid.WGS84.cartesianToCartographic(
                  cartesian
              );
              return new Position(
                  Cesium$1.Math.toDegrees(cartographic.longitude),
                  Cesium$1.Math.toDegrees(cartographic.latitude),
                  cartographic.height
              )
          }
          return new Position(0, 0)
      }

      /**
       * Transforms WGS84 To Cartesian
       * @param position
       * @returns {Cartesian3}
       */
      static transformWGS84ToCartesian(position) {
          return position
              ? Cesium$1.Cartesian3.fromDegrees(
                  position.lng,
                  position.lat,
                  position.alt,
                  Cesium$1.Ellipsoid.WGS84
              )
              : Cesium$1.Cartesian3.ZERO
      }

      /**
       * Transforms WGS84 To Cartographic
       * @param position
       * @returns {Cartographic}
       */
      static transformWGS84ToCartographic(position) {
          return position
              ? Cesium$1.Cartographic.fromDegrees(
                  position.lng,
                  position.lat,
                  position.alt
              )
              : Cesium$1.Cartographic.ZERO
      }

      /**
       * Transforms Cartesian Array To WGS84 Array
       * @param cartesianArr
       * @returns {*|*[]}
       */
      static transformCartesianArrayToWGS84Array(cartesianArr) {
          return cartesianArr
              ? cartesianArr.map(item => this.transformCartesianToWGS84(item))
              : []
      }

      /**
       * Transforms WGS84 Array To Cartesian Array
       * @param WGS84Arr
       * @returns {*|*[]}
       */
      static transformWGS84ArrayToCartesianArray(WGS84Arr) {
          return WGS84Arr
              ? WGS84Arr.map(item => this.transformWGS84ToCartesian(item))
              : []
      }

      /**
       * Transforms WGS84 To Mercator
       * @param position
       * @returns {Position}
       */
      static transformWGS84ToMercator(position) {
          let mp = WMP.project(
              Cesium$1.Cartographic.fromDegrees(position.lng, position.lat, position.alt)
          );
          return new Position(mp.x, mp.y, mp.z)
      }

      /**
       * Transforms Mercator To WGS84
       * @param position
       * @returns {Position}
       */
      static transformMercatorToWGS84(position) {
          let mp = WMP.unproject(
              new Cesium$1.Cartesian3(position.lng, position.lat, position.alt)
          );
          return new Position(
              Cesium$1.Math.toDegrees(mp.longitude),
              Cesium$1.Math.toDegrees(mp.latitude),
              mp.height
          )
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
          return this.transformCartesianToWGS84(cartesian)
      }

      /**
       * Transforms WGS84 To Window
       * @param position
       * @param viewer
       * @returns {Cartesian2}
       */
      static transformWGS84ToWindow(position, viewer) {
          let scene = viewer.scene;
          return Cesium$1.SceneTransforms.wgs84ToWindowCoordinates(
              scene,
              this.transformWGS84ToCartesian(position)
          )
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

  class Parse {
      /**
       * Parses all kinds of coordinates to position
       * @param position
       * @returns {Position}
       */
      static parsePosition(position) {
          let result = new Position();
          if (!position) {
              return result
          }
          if (typeof position === 'string') {
              result = Position.fromString(position);
          } else if (Array.isArray(position)) {
              result = Position.fromArray(position);
          } else if (
              !(Object(position) instanceof Position) &&
              Object(position).hasOwnProperty('lng') &&
              Object(position).hasOwnProperty('lat')
          ) {
              result = Position.fromObject(position);
          } else if (Object(position) instanceof Position) {
              result = position;
          }
          return result
      }

      /**
       * Parses all kinds of coordinates array to position array
       * @param positions
       * @returns {unknown[]}
       */
      static parsePositions(positions) {
          if (typeof positions === 'string') {
              if (positions.indexOf('#') >= 0) {
                  throw new Error('the positions invalid')
              }
              positions = positions.split(';');
          }
          return positions.map(item => {
              if (typeof item === 'string') {
                  return Position.fromString(item)
              } else if (Array.isArray(item)) {
                  return Position.fromArray(item)
              } else if (
                  !(Object(item) instanceof Position) &&
                  Object(item).hasOwnProperty('lng') &&
                  Object(item).hasOwnProperty('lat')
              ) {
                  return Position.fromObject(item)
              } else if (Object(item) instanceof Position) {
                  return item
              }
          })
      }

      /**
       * Parses point position to array
       * @param position
       * @returns {*[]}
       */
      static parsePointCoordToArray(position) {
          position = this.parsePosition(position);
          return [position.lng, position.lat]
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
          return result
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
          return [result]
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
          return this._id
      }

      set id(id) {
          this._bid = id;
          return this
      }

      get id() {
          return this._bid
      }

      set show(show) {
          this._show = show;
          this._delegate && (this._delegate.show = this._show);
          return this
      }

      get show() {
          return this._show
      }

      set attr(attr) {
          this._attr = attr;
          return this
      }

      get attr() {
          return this._attr
      }

      set allowDrillPicking(allowDrillPicking) {
          this._allowDrillPicking = allowDrillPicking;
          return this
      }

      get allowDrillPicking() {
          return this._allowDrillPicking
      }

      get overlayEvent() {
          return this._overlayEvent
      }

      get delegate() {
          return this._delegate
      }

      get state() {
          return this._state
      }

      set contextMenu(menus) {
          this._contextMenu = menus;
          return this
      }

      get contextMenu() {
          return this._contextMenu
      }

      /**
       * The hook for mount layer
       * Subclasses need to be overridden
       * @private
       */
      _mountedHook() { }

      /**
       * The hook for added
       * @returns {boolean}
       * @private
       */
      _addedHook() {
          if (!this._delegate) {
              return false
          }
          this._delegate.layerId = this._layer?.layerId;
          this._delegate.overlayId = this._id;
      }

      /**
       * The hook for removed
       * Subclasses need to be overridden
       * @private
       */
      _removedHook() { }

      /**
       * Add handler
       * @param layer
       * @private
       */
      _onAdd(layer) {
          if (!layer) {
              return
          }
          this._layer = layer;
          this._mountedHook && this._mountedHook();
          // for Entity
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
              return
          }
          // for Entity
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
          this._delegate &&
              (this._delegate.label = {
                  ...textStyle,
                  text: text
              });
          return this
      }

      /**
       * Sets style
       * @param style
       * @returns {Overlay}
       */
      setStyle(style) {
          return this
      }

      /**
       * Removes from layer
       * @returns {Overlay}
       */
      remove() {
          if (this._layer) {
              this._layer.removeOverlay(this);
          }
          return this
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
          return this
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
          return this
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
          return this
      }

      /**
       * Trigger subscription event
       * @param type
       * @param params
       * @returns {Overlay}
       */
      fire(type, params) {
          this._overlayEvent.fire(type, params);
          return this
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
          return OverlayType[type.toLocaleUpperCase()] || undefined
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
          this._delegate = new Cesium__default['default'].Entity({ billboard: {} });
          this._position = Parse.parsePosition(position);
          this._icon = icon;
          this._size = [32, 32];
          this.type = Overlay.getOverlayType('billboard');
          this._state = State$1.INITIALIZED;
      }

      set position(position) {
          this._position = Parse.parsePosition(position);
          this._delegate.position = Transform$1.transformWGS84ToCartesian(
              this._position
          );
          return this
      }

      get position() {
          return this._position
      }

      set icon(icon) {
          this._icon = icon;
          this._delegate.billboard.image = this._icon;
          return this
      }

      get icon() {
          return this._icon
      }

      set size(size) {
          if (!Array.isArray(size)) {
              throw new Error('Billboard: the size invalid')
          }
          this._size = size;
          this._delegate.billboard.width = this._size[0] || 32;
          this._delegate.billboard.height = this._size[1] || 32;
          return this
      }

      get size() {
          return this._size
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
              return this
          }
          delete style['image'] && delete style['width'] && delete style['height'];
          this._style = style;
          Util$1.merge(this._delegate.billboard, this._style);
          return this
      }

      /**
       * Parse from entity
       * @param entity
       * @returns {any}
       */
      static fromEntity(entity) {
          let billboard = undefined;
          let now = Cesium__default['default'].JulianDate.now();
          let position = Transform$1.transformCartesianToWGS84(
              entity.position.getValue(now)
          );
          if (entity.billboard) {
              billboard = new Billboard(position, entity.billboard.image.getValue(now));
              billboard.attr = {
                  ...entity?.properties?.getValue(now)
              };
          }
          return billboard
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
          this._position = Parse.parsePosition(position);
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
          this._position = Parse.parsePosition(position);
          this._delegate.position = Transform$1.transformWGS84ToCartesian(this._position);
          this._delegate.orientation = Cesium$1.Transforms.headingPitchRollQuaternion(
              Transform$1.transformWGS84ToCartesian(this._position),
              new Cesium$1.HeadingPitchRoll(
                  Cesium$1.Math.toRadians(this._position.heading),
                  Cesium$1.Math.toRadians(this._position.pitch),
                  Cesium$1.Math.toRadians(this._position.roll)
              )
          );
          return this
      }

      get position() {
          return this._position
      }

      set length(length) {
          this._length = length || 0;
          this._delegate.box.dimensions.x = +this._length;
          return this
      }

      get length() {
          return this._length
      }

      set width(width) {
          this._width = width || 0;
          this._delegate.box.dimensions.y = +this._width;
          return this
      }

      get width() {
          return this._width
      }

      set height(height) {
          this._height = height || 0;
          this._delegate.box.dimensions.z = + this._height;
          return this
      }

      get height() {
          return this._height
      }

      _mountedHook() {
          this._position = this._position;
      }

      setStyle(style) {
          if (Object.keys(style).length === 0) {
              return this
          }
          delete style['length'] && delete style['width'] && delete style['height'];
          this._style = style;
          Util.merge(this._delegate.box, this._style);
          return this
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
          this._delegate = new Cesium__default['default'].Entity({ polygon: {} });
          this._center = Parse.parsePosition(center);
          this._radius = +radius || 0;
          this._rotateAmount = 0;
          this._stRotation = 0;
          this.type = Overlay.getOverlayType('circle');
          this._state = State$1.INITIALIZED;
      }

      set center(center) {
          this._center = Parse.parsePosition(center);
          this._delegate.polygon.hierarchy = this._computeHierarchy();
          return this
      }

      get center() {
          return this._center
      }

      set radius(radius) {
          this._radius = +radius;
          this._delegate.polygon.hierarchy = this._computeHierarchy();
          return this
      }

      get radius() {
          return this._radius
      }

      set rotateAmount(amount) {
          this._rotateAmount = +amount;
          this._delegate.polygon.stRotation = new Cesium__default['default'].CallbackProperty(time => {
              this._stRotation += this._rotateAmount;
              if (this._stRotation >= 360 || this._stRotation <= -360) {
                  this._stRotation = 0;
              }
              return Cesium__default['default'].Math.toRadians(this._stRotation)
          });
          return this
      }

      get rotateAmount() {
          return this._rotateAmount
      }

      /**
       *
       * @private
       */
      _computeHierarchy() {
          let result = new Cesium__default['default'].PolygonHierarchy();
          let cep = Cesium__default['default'].EllipseGeometryLibrary.computeEllipsePositions(
              {
                  center: Transform$1.transformWGS84ToCartesian(this._center),
                  semiMajorAxis: this._radius,
                  semiMinorAxis: this._radius,
                  rotation: 0,
                  granularity: 0.005
              },
              false,
              true
          );
          let pnts = Cesium__default['default'].Cartesian3.unpackArray(cep.outerPositions);
          pnts.push(pnts[0]);
          result.positions = pnts;
          return result
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
              return this
          }
          delete style['positions'];
          this._style = style;
          Util$1.merge(this._delegate.polygon, this._style);
          return this
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
          this._positions = Parse.parsePositions(positions);
          this._delegate = new Cesium__default['default'].Entity({ corridor: {} });
          this.type = Overlay.getOverlayType('corridor');
          this._state = State$1.INITIALIZED;
      }

      set positions(positions) {
          this._positions = Parse.parsePositions(positions);
          this._delegate.corridor.positions = Transform.transformWGS84ArrayToCartesianArray(
              this._positions
          );
          return this
      }

      get positions() {
          return this._positions
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
          return this
      }

      /**
       * Sets Style
       * @param style
       * @returns {Corridor}
       */
      setStyle(style) {
          if (Object.keys(style).length === 0) {
              return this
          }
          delete style['positions'];
          this._style = style;
          Util.merge(this._delegate.corridor, this._style);
          return this
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
              let positions = Transform.transformCartesianArrayToWGS84Array(
                  entity.polyline.positions.getValue(now)
              );
              corridor = new Corridor(positions);
              corridor.attr = {
                  ...entity?.properties?.getValue(now)
              };
          }
          return corridor
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
          this._position = Parse.parsePosition(position);
          this._length = +length || 0;
          this._topRadius = +topRadius || 0;
          this._bottomRadius = +bottomRadius || 0;
          this._delegate = new Cesium__default['default'].Entity({ cylinder: {} });
          this.type = Overlay.getOverlayType('cylinder');
          this._state = State$1.INITIALIZED;
      }


      set position(position) {
          this._position = Parse.parsePosition(position);
          this._delegate.position = Transform.transformWGS84ToCartesian(
              this._position
          );
          this._delegate.orientation = Cesium__default['default'].Transforms.headingPitchRollQuaternion(
              Transform.transformWGS84ToCartesian(this._position),
              new Cesium__default['default'].HeadingPitchRoll(
                  Cesium__default['default'].Math.toRadians(this._position.heading),
                  Cesium__default['default'].Math.toRadians(this._position.pitch),
                  Cesium__default['default'].Math.toRadians(this._position.roll)
              )
          );
          return this
      }

      get position() {
          return this._position
      }

      set length(length) {
          this._length = +length || 0;
          this._delegate.cylinder.length = this._length;
          return this
      }

      get length() {
          return this._length
      }

      set topRadius(topRadius) {
          this._topRadius = +topRadius || 0;
          this._delegate.cylinder.topRadius = this._topRadius;
          return this
      }

      get topRadius() {
          return this._topRadius
      }

      set bottomRadius(bottomRadius) {
          this._bottomRadius = +bottomRadius || 0;
          this._delegate.cylinder.bottomRadius = this._bottomRadius;
          return this
      }

      get bottomRadius() {
          return this._bottomRadius
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
          return this
      }

      /**
       * Sets Style
       * @param style
       * @returns {Cylinder}
       */
      setStyle(style) {
          if (Object.keys(style).length === 0) {
              return this
          }

          delete style['length'] &&
              delete style['topRadius'] &&
              delete style['bottomRadius'];

          this._style = style;
          Util.merge(this._delegate.cylinder, this._style);
          return this
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
      return result
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
      }
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

      let mc = new Cesium$1.EllipsoidGeodesic(
          startPosition,
          endPosition
      ).interpolateUsingFraction(0.5);

      return new Position(
          Cesium$1.Math.toDegrees(mc.longitude),
          Cesium$1.Math.toDegrees(mc.latitude),
          mc.height
      )
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
          let boundingSphere = Cesium__default['default'].BoundingSphere.fromPoints(
              Transform$1.transformWGS84ArrayToCartesianArray(positions)
          );
          return Transform$1.transformCartesianToWGS84(boundingSphere.center)
      }

      return new Position()
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

      return distance.toFixed(3)
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
      let v = Cesium$1.Cartesian3.subtract(
          endPosition,
          startPosition,
          new Cesium$1.Cartesian3()
      );
      if (v) {
          Cesium$1.Cartesian3.normalize(v, v);
          let up = Cesium$1.Ellipsoid.WGS84.geodeticSurfaceNormal(
              startPosition,
              new Cesium$1.Cartesian3()
          );
          let east = Cesium$1.Cartesian3.cross(
              Cesium$1.Cartesian3.UNIT_Z,
              up,
              new Cesium$1.Cartesian3()
          );
          let north = Cesium$1.Cartesian3.cross(up, east, new Cesium$1.Cartesian3());
          heading = Math.atan2(
              Cesium$1.Cartesian3.dot(v, east),
              Cesium$1.Cartesian3.dot(v, north)
          );
      }
      return heading
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
      return value >= parseFloat(min) && value <= parseFloat(max)
  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 14:12:46
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-15 14:15:54
   */
  function parabola(
      startPosition,
      endPosition,
      height = 0,
      count = 50
  ) {
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
              let h =
                  height -
                  (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) /
                  Math.pow(L, 2);
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
              let h =
                  height -
                  (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) /
                  Math.pow(L, 2);
              let lng = startPosition.lng + delLng * i;
              let lat = startPosition.lat + dlt * i;
              result.push([lng, lat, h]);
          }
      }

      return result
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
      return curvePoints
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
          return null
      }
      let curveCoordinates = [];
      count = count || 40; // 曲线是由一些小的线段组成的，这个表示这个曲线所有到的折线的个数
      let B1 = function (x) {
          return 1 - 2 * x + x * x
      };
      let B2 = x => {
          return 2 * x - 2 * x * x
      };
      let B3 = x => {
          return x * x
      };

      let t, h, h2, lat3, lng3, t2;
      let inc = 0;
      let lat1 = parseFloat(obj1.lat);
      let lat2 = parseFloat(obj2.lat);
      let lng1 = parseFloat(obj1.lng);
      let lng2 = parseFloat(obj2.lng);

      // 计算曲线角度的方法
      if (lng2 > lng1) {
          if (lng2 - lng1 > 180) {
              if (lng1 < 0) {
                  lng1 = 180 + 180 + lng1;
                  lng2 = 180 + 180 + lng2;
              }
          }
      }
      // 此时纠正了 lng1 lng2

      t2 = 0;
      // 纬度相同
      if (lat2 === lat1) {
          t = 0;
          h = lng1 - lng2;
          // 经度相同
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
      return curveCoordinates
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
          this._position = Parse.parsePosition(position);
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
          return this
      }

      get show() {
          return this._show
      }

      set position(position) {
          this._position = Parse.parsePosition(position);
          return this
      }

      get position() {
          return this._position
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
          return this
      }

      get content() {
          return this._delegate.childNodes || []
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
              this.show =
                  this._show &&
                  isBetween(
                      distance,
                      distanceDisplayCondition.near,
                      distanceDisplayCondition.far
                  );
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
          return this
      }

      /**
       * Sets style
       * @param style
       * @returns {DivIcon}
       */
      setStyle(style) {
          if (!style || Object.keys(style).length === 0) {
              return this
          }
          this._style = style;
          this._style.className &&
              DomUtil.addClass(this._delegate, this._style.className);
          return this
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
          let position = Transform$1.transformCartesianToWGS84(
              entity.position.getValue(now)
          );
          divIcon = new DivIcon(position, content);
          if (entity.billboard) {
              divIcon.attr = {
                  ...entity?.properties?.getValue(now)
              };
          }
          return divIcon
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
          this._position = Parse.parsePosition(position);
          this._semiMajorAxis = +semiMajorAxis || 0;
          this._semiMinorAxis = +semiMinorAxis || 0;
          this._delegate = new Cesium__default['default'].Entity({ ellipse: {} });
          this.type = Overlay.getOverlayType('ellipse');
          this._state = State$1.INITIALIZED;
      }

      set position(position) {
          this._position = Parse.parsePosition(position);
          this._delegate.position = Transform$1.transformWGS84ToCartesian(
              this._position
          );
          this._delegate.orientation = Cesium__default['default'].Transforms.headingPitchRollQuaternion(
              Transform$1.transformWGS84ToCartesian(this._position),
              new Cesium__default['default'].HeadingPitchRoll(
                  Cesium__default['default'].Math.toRadians(this._position.heading),
                  Cesium__default['default'].Math.toRadians(this._position.pitch),
                  Cesium__default['default'].Math.toRadians(this._position.roll)
              )
          );
          return this
      }

      get position() {
          return this._position
      }

      set semiMajorAxis(semiMajorAxis) {
          this._semiMajorAxis = +semiMajorAxis || 0;
          this._delegate.ellipse.semiMajorAxis = this._semiMajorAxis;
          return this
      }

      get semiMajorAxis() {
          return this._semiMajorAxis
      }

      set semiMinorAxis(semiMinorAxis) {
          this._semiMinorAxis = +semiMinorAxis || 0;
          this._delegate.ellipse.semiMinorAxis = this._semiMinorAxis;
          return this
      }

      get semiMinorAxis() {
          return this._semiMinorAxis
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
              return this
          }
          delete style['semiMajorAxis'] && delete style['semiMinorAxis'];
          this._style = style;
          Util$1.merge(this._delegate.ellipse, this._style);
          return this
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
          this._position = Parse.parsePosition(position);
          this._radius = radius || { x: 10, y: 10, z: 10 };
          this._delegate = new Cesium__default['default'].Entity({ ellipsoid: {} });
          this.type = Overlay.getOverlayType('ellipsoid');
          this._state = State$1.INITIALIZED;
      }

      set position(position) {
          this._position = Parse.parsePosition(position);
          this._delegate.position = Transform$1.transformWGS84ToCartesian(
              this._position
          );
          this._delegate.orientation = Cesium__default['default'].Transforms.headingPitchRollQuaternion(
              Transform$1.transformWGS84ToCartesian(this._position),
              new Cesium__default['default'].HeadingPitchRoll(
                  Cesium__default['default'].Math.toRadians(this._position.heading),
                  Cesium__default['default'].Math.toRadians(this._position.pitch),
                  Cesium__default['default'].Math.toRadians(this._position.roll)
              )
          );
          return this
      }

      get position() {
          return this._position
      }

      set radius(radius) {
          this._radius = radius || { x: 10, y: 10, z: 10 };
          this._delegate.ellipsoid.radii = this._radius;
          return this
      }

      get radius() {
          return this._radius
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
              return this
          }
          delete style['radius'];
          this._style = style;
          Util$1.merge(this._delegate.ellipsoid, this._style);
          return this
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
          this._delegate = new Cesium__default['default'].Entity({ label: {} });
          this._position = Parse.parsePosition(position);
          this._text = text;
          this.type = Overlay.getOverlayType('label');
          this._state = State$1.INITIALIZED;
      }

      set position(position) {
          this._position = Parse.parsePosition(position);
          this._delegate.position = Transform$1.transformWGS84ToCartesian(
              this._position
          );
          return this
      }

      get position() {
          return this._position
      }

      set text(text) {
          this._text = text;
          this._delegate.label.text = this._text;
          return this
      }

      get text() {
          return this._text
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
          return this
      }

      /**
       * Sets Style
       * @param style
       * @returns {Label}
       */
      setStyle(style) {
          if (!style || Object.keys(style).length === 0) {
              return this
          }
          delete style['text'];
          this._style = style;
          Util$1.merge(this._delegate.label, this._style);
          return this
      }

      /**
       * Parse from entity
       * @param entity
       * @returns {any}
       */
      static fromEntity(entity) {
          let now = Cesium__default['default'].JulianDate.now();
          let position = Transform$1.transformCartesianToWGS84(
              entity.position.getValue(now)
          );
          let label = undefined;
          if (entity.billboard) {
              label = new Label(position, entity.name);
              label.attr = {
                  ...entity?.properties?.getValue(now)
              };
          }
          return label
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
          this._position = Parse.parsePosition(position);
          this._width = +width || 0;
          this._height = +height || 0;
          if (plane.normal && typeof plane.normal === 'string') {
              let n = String(plane.normal).toLocaleUpperCase();
              plane.normal =
                  n === 'X'
                      ? Cesium__default['default'].Cartesian3.UNIT_X
                      : n === 'Y'
                          ? Cesium__default['default'].Cartesian3.UNIT_Y
                          : Cesium__default['default'].Cartesian3.UNIT_Z;
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
          this._position = Parse.parsePosition(position);
          this._delegate.position = Transform$1.transformWGS84ToCartesian(
              this._position
          );
          this._delegate.orientation = Cesium__default['default'].Transforms.headingPitchRollQuaternion(
              Transform$1.transformWGS84ToCartesian(this._position),
              new Cesium__default['default'].HeadingPitchRoll(
                  Cesium__default['default'].Math.toRadians(this._position.heading),
                  Cesium__default['default'].Math.toRadians(this._position.pitch),
                  Cesium__default['default'].Math.toRadians(this._position.roll)
              )
          );
          return this
      }

      get position() {
          return this._position
      }

      set width(width) {
          this._width = +width || 0;
          this._delegate.plan.dimensions.x = this._width;
          return this
      }

      get width() {
          return this._width
      }

      set height(height) {
          this._height = +height || 0;
          this._delegate.plan.dimensions.y = this._height;
          return this
      }

      get height() {
          return this._height
      }

      set distance(distance) {
          this._distance = distance;
          this._delegate.plane.plane.distance = distance;
          return this
      }

      get distance() {
          return this._distance
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
          return this
      }

      /**
       * Sets Style
       * @param style
       * @returns {Plane}
       */
      setStyle(style) {
          if (Object.keys(style).length === 0) {
              return this
          }
          delete style['dimensions'] && delete ['plane'];
          this._style = style;
          Util$1.merge(this._delegate.plane, this._style);
          return this
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
      this._delegate = new Cesium$1.Entity({ point: {} });
      this._position = Parse.parsePosition(position);
      this.type = Overlay.getOverlayType('point');
      this._state = State$1.INITIALIZED;
    }

    set position(position) {
      this._position = Parse.parsePosition(position);
      this._delegate.position = Transform$1.transformWGS84ToCartesian(
        this._position
      );
      return this
    }

    get position() {
      return this._position
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
        return this
      }
      delete style['position'];
      this._style = style;
      Util$1.merge(this._delegate.point, DEF_STYLE, this._style);
      return this
    }

    /**
     * Parse from entity
     * @param entity
     * @returns {any}
     */
    static fromEntity(entity) {
      let point = undefined;
      let now = Cesium$1.JulianDate.now();
      let position = Transform$1.transformCartesianToWGS84(
        entity.position.getValue(now)
      );
      point = new Point(position);
      point.attr = {
        ...entity?.properties?.getValue(now)
      };
      return point
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
          this._delegate = new Cesium__default['default'].Entity({ polygon: {} });
          this._positions = Parse.parsePositions(positions);
          this._holes = [];
          this.type = Overlay.getOverlayType('polygon');
          this._state = State$1.INITIALIZED;
      }

      set positions(positions) {
          this._positions = Parse.parsePositions(positions);
          this._delegate.polygon.hierarchy = this._computeHierarchy();
          return this
      }

      get positions() {
          return this._positions
      }

      set holes(holes) {
          if (holes && holes.length) {
              this._holes = holes.map(item => Parse.parsePositions(item));
              this._delegate.polygon.hierarchy = this._computeHierarchy();
          }
          return this
      }

      get holes() {
          return this._holes
      }

      get center() {
          return center([...this._positions, this._positions[0]])
      }

      get area() {
          return area(this._positions)
      }

      /**
       *
       * @private
       */
      _computeHierarchy() {
          let result = new Cesium__default['default'].PolygonHierarchy();
          result.positions = Transform$1.transformWGS84ArrayToCartesianArray(
              this._positions
          );
          result.holes = this._holes.map(
              item =>
                  new Cesium__default['default'].PolygonHierarchy(
                      Transform$1.transformWGS84ArrayToCartesianArray(item)
                  )
          );
          return result
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
          return this
      }

      /**
       * Sets style
       * @param style
       * @returns {Polygon}
       */
      setStyle(style) {
          if (!style || Object.keys(style).length === 0) {
              return this
          }
          delete style['positions'];
          this._style = style;
          Util$1.merge(this._delegate.polygon, this._style);
          return this
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
              let positions = Transform$1.transformCartesianArrayToWGS84Array(
                  entity.polygon.hierarchy.getValue(now).positions
              );
              polygon = new Polygon(positions);
              polygon.attr = {
                  ...entity?.properties?.getValue(now)
              };
          }
          return polygon
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
          this._positions = Parse.parsePositions(positions);
          this._delegate = new Cesium__default['default'].Entity({ polyline: {} });
          this.type = Overlay.getOverlayType('polyline');
          this._state = State$1.INITIALIZED;
      }

      set positions(positions) {
          this._positions = Parse.parsePositions(positions);
          this._delegate.polyline.positions = Transform$1.transformWGS84ArrayToCartesianArray(
              this._positions
          );
          return this
      }

      get positions() {
          return this._positions
      }

      get center() {
          return center(this._positions)
      }

      get distance() {
          return distance(this._positions)
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
          return this
      }

      /**
       * Sets style
       * @param style
       * @returns {Polyline}
       */
      setStyle(style) {
          if (!style || Object.keys(style).length === 0) {
              return this
          }
          delete style['positions'];
          this._style = style;
          Util$1.merge(this._delegate.polyline, this._style);
          return this
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
              let positions = Transform$1.transformCartesianArrayToWGS84Array(
                  entity.polyline.positions.getValue(now)
              );
              polyline = new Polyline(positions);
              polyline.attr = {
                  ...entity?.properties?.getValue(now)
              };
          }
          return polyline
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
          this._positions = Parse.parsePositions(positions);
          this._shape = shape || [];
          this._delegate = new Cesium__default['default'].Entity({ polylineVolume: {} });
          this.type = Overlay.getOverlayType('polyline_volume');
          this._state = State$1.INITIALIZED;
      }

      set positions(positions) {
          this._positions = Parse.parsePositions(positions);
          this._delegate.polylineVolume.positions = Transform$1.transformWGS84ArrayToCartesianArray(
              this._positions
          );
          return this
      }

      get positions() {
          return this._positions
      }

      set shape(shape) {
          this._shape = shape || [];
          this._delegate.polylineVolume.shape = this._shape;
          return this
      }

      get shape() {
          return this._shape
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
          return this
      }

      /**
       * Sets style
       * @param style
       * @returns {PolylineVolume}
       */
      setStyle(style) {
          if (Object.keys(style).length === 0) {
              return this
          }
          delete style['positions'] && delete style['shape'];
          this._style = style;
          Util$1.merge(this._delegate.polylineVolume, this._style);
          return this
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
              let positions = Transform$1.transformCartesianArrayToWGS84Array(
                  entity.polyline.positions.getValue(now)
              );
              polylineVolume = new PolylineVolume(positions, shape);
              polylineVolume.attr = {
                  ...entity?.properties?.getValue(now)
              };
          }
          return polylineVolume
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
          this._positions = Parse.parsePositions(positions);
          this._delegate = new Cesium__default['default'].Entity({ rectangle: {} });
          this.type = Overlay.getOverlayType('rectangle');
          this._state = State$1.INITIALIZED;
      }

      set positions(positions) {
          this._positions = Parse.parsePositions(positions);
          this._delegate.rectangle.coordinates = Cesium__default['default'].Rectangle.fromCartesianArray(
              Transform$1.transformWGS84ArrayToCartesianArray(this._positions)
          );
          return this
      }

      get positions() {
          return this._positions
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
          return this
      }

      /**
       * Sets Style
       * @param style
       * @returns {Rectangle}
       */
      setStyle(style) {
          if (Object.keys(style).length === 0) {
              return this
          }
          delete style['positions'];
          this._style = style;
          Util$1.merge(this._delegate.rectangle, this._style);
          return this
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
          this._positions = Parse.parsePositions(positions);
          this._delegate = new Cesium__default['default'].Entity({ wall: {} });
          this.type = Overlay.getOverlayType('wall');
          this._state = State$1.INITIALIZED;
      }

      set positions(positions) {
          this._positions = Parse.parsePositions(positions);
          this._delegate.wall.positions = Transform$1.transformWGS84ArrayToCartesianArray(
              this._positions
          );
          return this
      }

      get positions() {
          return this._positions
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
          return this
      }

      /**
       * Sets Style
       * @param style
       * @returns {Wall}
       */
      setStyle(style) {
          if (Object.keys(style).length === 0) {
              return this
          }
          delete style['positions'];
          this._style = style;
          Util$1.merge(this._delegate.wall, this._style);
          return this
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
              let positions = Transform$1.transformCartesianArrayToWGS84Array(
                  entity.polyline.positions.getValue(now)
              );
              wall = new Wall(positions);
              wall.attr = {
                  ...entity?.properties?.getValue(now)
              };
          }
          return wall
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
          this._delegate = new Cesium__default['default'].Entity({ model: {} });
          this._position = Parse.parsePosition(position);
          this._modelUrl = modelUrl;
          this._rotateAmount = 0;
          this.type = Overlay.getOverlayType('model');
          this._state = State$1.INITIALIZED;
      }

      set position(position) {
          this._position = Parse.parsePosition(position);
          this._delegate.position = Transform$1.transformWGS84ToCartesian(
              this._position
          );
          if (this._rotateAmount === 0) {
              this._delegate.orientation = Cesium__default['default'].Transforms.headingPitchRollQuaternion(
                  Transform$1.transformWGS84ToCartesian(this._position),
                  new Cesium__default['default'].HeadingPitchRoll(
                      Cesium__default['default'].Math.toRadians(this._position.heading),
                      Cesium__default['default'].Math.toRadians(this._position.pitch),
                      Cesium__default['default'].Math.toRadians(this._position.roll)
                  )
              );
          }
          return this
      }

      get position() {
          return this._position
      }

      set modelUrl(modelUrl) {
          this._modelUrl = modelUrl;
          this._delegate.model.uri = this._modelUrl;
          return this
      }

      get modelUrl() {
          return this._modelUrl
      }

      set rotateAmount(amount) {
          this._rotateAmount = +amount;
          this._delegate.orientation = new Cesium__default['default'].CallbackProperty(time => {
              this._position.heading += this._rotateAmount;
              if (this._position.heading >= 360 || this._position.heading <= -360) {
                  this._position.heading = 0;
              }
              return Cesium__default['default'].Transforms.headingPitchRollQuaternion(
                  Transform$1.transformWGS84ToCartesian(this._position),
                  new Cesium__default['default'].HeadingPitchRoll(
                      Cesium__default['default'].Math.toRadians(this._position.heading),
                      Cesium__default['default'].Math.toRadians(this._position.pitch),
                      Cesium__default['default'].Math.toRadians(this._position.roll)
                  )
              )
          });
          return this
      }

      get rotateAmount() {
          return this._rotateAmount
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
              return this
          }
          delete style['uri'];
          this._style = style;
          Util$1.merge(this._delegate.model, this._style);
          return this
      }

      /**
       * Parse from entity
       * @param entity
       * @param modelUrl
       * @returns {Model}
       */
      static fromEntity(entity, modelUrl) {
          let now = Cesium__default['default'].JulianDate.now();
          let position = Transform$1.transformCartesianToWGS84(
              entity.position.getValue(now)
          );
          let model = new Model(position, modelUrl);
          model.attr = {
              ...entity.properties.getValue(now)
          };
          return model
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
          this._delegate = new Cesium__default['default'].Cesium3DTileset({
              ...options,
              url: url
          });
          this._tileVisibleCallback = undefined;
          this._properties = undefined;
          this._customShader = undefined;
          this.type = Overlay.getOverlayType('tileset');
          this._state = State$1.INITIALIZED;
      }

      get readyPromise() {
          return this._delegate.readyPromise
      }

      /**
       *
       * @private
       */
      _bindVisibleEvent() {
          this._tileVisibleCallback && this._tileVisibleCallback();
          this._tileVisibleCallback = this._delegate.tileVisible.addEventListener(
              this._updateTile,
              this
          );
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
              let model = feature.content._model;
              // sets properties
              if (this._properties && this._properties.length) {
                  this._properties.forEach(property => {
                      if (
                          feature.hasProperty(property['key']) &&
                          feature.getProperty(property['key']) === property['keyValue']
                      ) {
                          feature.setProperty(
                              property['propertyName'],
                              property['propertyValue']
                          );
                      }
                  });
              }
              // sets customShader
              if (
                  this._customShader &&
                  model &&
                  model._sourcePrograms &&
                  model._rendererResources
              ) {
                  Object.keys(model._sourcePrograms).forEach(key => {
                      let program = model._sourcePrograms[key];
                      model._rendererResources.sourceShaders[
                          program.fragmentShader
                      ] = this._customShader;
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
          position = Parse.parsePosition(position);
          this.readyPromise.then(tileset => {
              let modelMatrix = Cesium__default['default'].Transforms.eastNorthUpToFixedFrame(
                  Cesium__default['default'].Cartesian3.fromDegrees(position.lng, position.lat, position.alt)
              );
              let rotationX = Cesium__default['default'].Matrix4.fromRotationTranslation(
                  Cesium__default['default'].Matrix3.fromRotationZ(Cesium__default['default'].Math.toRadians(position.heading))
              );
              Cesium__default['default'].Matrix4.multiply(modelMatrix, rotationX, modelMatrix);
              tileset.root.transform = modelMatrix;
          });
          return this
      }

      /**
       *
       * @param {*} text
       * @param {*} textStyle
       */
      setLabel(text, textStyle) {
          return this
      }

      /**
       * Clamps To Ground
       * @returns {Tileset}
       */
      clampToGround() {
          this.readyPromise.then(tileset => {
              let center = Cesium__default['default'].Cartographic.fromCartesian(
                  tileset.boundingSphere.center
              );
              let surface = Cesium__default['default'].Cartesian3.fromRadians(
                  center.longitude,
                  center.latitude,
                  center.height
              );
              let offset = Cesium__default['default'].Cartesian3.fromRadians(
                  center.longitude,
                  center.latitude,
                  0
              );
              let translation = Cesium__default['default'].Cartesian3.subtract(
                  offset,
                  surface,
                  new Cesium__default['default'].Cartesian3()
              );
              tileset.modelMatrix = Cesium__default['default'].Matrix4.fromTranslation(translation);
          });
          return this
      }

      /**
       * Sets height
       * @param height
       * @param isAbsolute
       * @returns {Tileset}
       */
      setHeight(height, isAbsolute = false) {
          this.readyPromise.then(tileset => {
              let center = Cesium__default['default'].Cartographic.fromCartesian(
                  tileset.boundingSphere.center
              );
              let surface = Cesium__default['default'].Cartesian3.fromRadians(
                  center.longitude,
                  center.latitude,
                  center.height
              );
              let offset = Cesium__default['default'].Cartesian3.fromRadians(
                  center.longitude,
                  center.latitude,
                  isAbsolute ? height : center.height + height
              );
              let translation = Cesium__default['default'].Cartesian3.subtract(
                  offset,
                  surface,
                  new Cesium__default['default'].Cartesian3()
              );
              tileset.modelMatrix = Cesium__default['default'].Matrix4.fromTranslation(translation);
          });
          return this
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
          return this
      }

      /**
       * Sets feature property
       * @param properties
       * @returns {Tileset}
       */
      setProperties(properties) {
          this._properties = properties;
          this._bindVisibleEvent();
          return this
      }

      /**
       * Sets feature FS
       * @param customShader
       * @returns {Tileset}
       */
      setCustomShader(customShader) {
          this._customShader = customShader;
          this._bindVisibleEvent();
          return this
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
          return this
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
              throw new Error('GeoJsonLayer url invalid')
          }
          super(id);
          this._delegate = Cesium__default['default'].GeoJsonDataSource.load(url, options);
          this.type = Layer.getLayerType('geojson');
          this._state = State$1.INITIALIZED;
      }

      set show(show) {
          this._show = show;
          this._delegate &&
              this._delegate.then(dataSource => {
                  dataSource.show = this._show;
              });
      }

      get show() {
          return this._show
      }

      _createBillboard(entity) {
          if (entity.position && entity.billboard) {
              return Billboard.fromEntity(entity)
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
              return Polyline.fromEntity(entity)
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
              return Polygon.fromEntity(entity)
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
              return Model.fromEntity(entity, modelUrl)
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
              return this
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
          return layer
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
          return layer
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
          return this._show
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
                      let windowCoord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                          scene,
                          position
                      );
                      let distance = Cesium.Cartesian3.distance(position, cameraPosition);
                      item._updateStyle({ transform: windowCoord }, distance);
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
          while(this._delegate.hasChildNodes()) {
              this._delegate.removeChild(this._delegate.firstChild);
          }
          this._cache = {};
          this._state = State$1.CLEARED;
          return this
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
              return Label.fromEntity(entity)
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
          return this
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
          return this
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
              throw new Error('TopoJsonLayer锛歵he url invalid')
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
              throw new Error('KmlLayer: the url is empty')
          }
          super(id);
          this._delegate = Cesium__default['default'].KmlDataSource.load(url, options);
          this.type = Layer.getLayerType('kml');
          this._state = State$1.INITIALIZED;
      }

      set show(show) {
          this._show = show;
          this._delegate &&
              this._delegate.then(dataSource => {
                  dataSource.show = this._show;
              });
      }

      get show() {
          return this._show
      }

      eachOverlay(method, context) {
          if (this._delegate) {
              this._delegate.then(dataSource => {
                  let entities = dataSource.entities.values;
                  entities.forEach(item => {
                      method.call(context, item);
                  });
              });
              return this
          }
      }
  }

  Layer.registerType('kml');

  const DEF_OPT = {
    size: 18,
    pixelRange: 40,
    gradient: {
      0.0001: Cesium$1.Color.DEEPSKYBLUE,
      0.001: Cesium$1.Color.GREEN,
      0.01: Cesium$1.Color.ORANGE,
      0.1: Cesium$1.Color.RED
    },
    fontSize: 12,
    fontColor: Cesium$1.Color.BLACK,
    style: 'circle'
  };

  class ClusterLayer extends Layer {
    constructor(id, options = {}) {
      super(id);
      this._delegate = new Cesium$1.CustomDataSource(id);
      this._options = {
        ...DEF_OPT,
        ...options
      };
      this._delegate.clustering.enabled = true;
      this._delegate.clustering.clusterEvent.addEventListener(
        this._clusterEventHandler,
        this
      );
      this._delegate.clustering.pixelRange = this._options.pixelRange;
      this.type = Layer.getLayerType('cluster');
      this._state = State$1.INITIALIZED;
    }

    set enableCluster(enableCluster) {
      this._delegate.clustering.enabled = enableCluster;
      return this
    }

    /**
     *
     * @param color
     * @param numLength
     * @returns {*}
     * @private
     */
    _drawCircle(color, numLength) {
      let size = this._options.size * (numLength + 1);
      let key = color.toCssColorString() + '-' + size;
      if (!this._cache[key]) {
        let canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        let context2D = canvas.getContext('2d');
        context2D.save();
        context2D.scale(size / 24, size / 24); //Added to auto-generated code to scale up to desired size.
        context2D.fillStyle = color.withAlpha(0.2).toCssColorString(); //Modified from auto-generated code.
        context2D.beginPath();
        context2D.arc(12, 12, 9, 0, 2 * Math.PI);
        context2D.closePath();
        context2D.fill();
        context2D.beginPath();
        context2D.arc(12, 12, 6, 0, 2 * Math.PI);
        context2D.fillStyle = color.toCssColorString();
        context2D.fill();
        context2D.closePath();
        context2D.restore();
        this._cache[key] = canvas.toDataURL();
      }
      return this._cache[key]
    }

    /**
     *
     * @param color
     * @param numLength
     * @returns {*}
     * @private
     */
    _drawClustering(color, numLength) {
      let size = this._options.size * (numLength + 1);
      let key = color.toCssColorString() + '-' + size;
      let startAngle = -Math.PI / 12;
      let angle = Math.PI / 2;
      let intervalAngle = Math.PI / 6;
      if (!this._cache[key]) {
        let canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        let context2D = canvas.getContext('2d');
        context2D.save();
        context2D.scale(size / 24, size / 24); //Added to auto-generated code to scale up to desired size.
        context2D.beginPath();
        context2D.arc(12, 12, 6, 0, 2 * Math.PI);
        context2D.fillStyle = color.toCssColorString();
        context2D.fill();
        context2D.closePath();
        context2D.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          context2D.beginPath();
          context2D.arc(12, 12, 8, startAngle, startAngle + angle, false);
          context2D.strokeStyle = color.withAlpha(0.4).toCssColorString();
          context2D.stroke();
          context2D.arc(12, 12, 11, startAngle, startAngle + angle, false);
          context2D.strokeStyle = color.withAlpha(0.2).toCssColorString();
          context2D.stroke();
          context2D.closePath();
          startAngle = startAngle + angle + intervalAngle;
        }
        context2D.restore();
        this._cache[key] = canvas.toDataURL();
      }
      return this._cache[key]
    }

    /**
     *
     * @param {*} clusteredEntities
     * @param {*} cluster
     */
    _clusterEventHandler(clusteredEntities, cluster) {
      if (!this._delegate.clustering.enabled) {
        return
      }
      cluster.billboard.show = true;
      cluster.label.font = `bold ${this._options.fontSize}px sans-serif`;
      cluster.label.fillColor = this._options.fontColor;
      cluster.label.disableDepthTestDistance = Number.POSITIVE_INFINITY;
      if (this._delegate.entities.values.length) {
        let allCount = this._delegate.entities.values.length || 0;
        for (let key in this._options.gradient) {
          if (clusteredEntities.length >= allCount * key) {
            let numLength = String(clusteredEntities.length).length;
            if (this._options.style === 'circle') {
              cluster.billboard.image = this._drawCircle(
                this._options.gradient[key],
                numLength
              );
            } else {
              cluster.billboard.image = this._drawClustering(
                this._options.gradient[key],
                numLength
              );
            }
            cluster.label.show = true;
            if (numLength === 1) {
              cluster.label.pixelOffset = new Cesium$1.Cartesian2(-2, 3);
            } else {
              cluster.label.pixelOffset = new Cesium$1.Cartesian2(
                -5 * (numLength - 1),
                5
              );
            }
          } else if (clusteredEntities.length <= 1) {
            cluster.label.show = false;
          }
        }
      }
    }

    clear() {
      this._delegate.entities.removeAll();
      this._cache = {};
      this._state = State$1.CLEARED;
      return this
    }
  }

  Layer.registerType('cluster');

  var czm_cellular = "#define GLSLIFY 1\n/***@license*Cellular noise(\"Worley noise\")in 2D in GLSL.*Copyright(c)Stefan Gustavson 2011-04-19. All rights reserved.*This code is released under the conditions of the MIT license.*See LICENSE file for details.*/vec3 _czm_permute289(vec3 x){return mod((34.0*x+1.0)*x,289.0);}/***DOC_TBA**Implemented by Stefan Gustavson,and distributed under the MIT License.{@link http:**@name czm_cellular*@glslFunction**@see Stefan Gustavson's chapter,<i>Procedural Textures in GLSL</i>,in<a href=\"http:*/vec2 czm_cellular(vec2 P){\n#define K 0.142857142857\n#define Ko 0.428571428571\n#define jitter 1.0\nvec2 Pi=mod(floor(P),289.0);vec2 Pf=fract(P);vec3 oi=vec3(-1.0,0.0,1.0);vec3 of=vec3(-0.5,0.5,1.5);vec3 px=_czm_permute289(Pi.x+oi);vec3 p=_czm_permute289(px.x+Pi.y+oi);vec3 ox=fract(p*K)-Ko;vec3 oy=mod(floor(p*K),7.0)*K-Ko;vec3 dx=Pf.x+0.5+jitter*ox;vec3 dy=Pf.y-of+jitter*oy;vec3 d1=dx*dx+dy*dy;p=_czm_permute289(px.y+Pi.y+oi);ox=fract(p*K)-Ko;oy=mod(floor(p*K),7.0)*K-Ko;dx=Pf.x-0.5+jitter*ox;dy=Pf.y-of+jitter*oy;vec3 d2=dx*dx+dy*dy;p=_czm_permute289(px.z+Pi.y+oi);ox=fract(p*K)-Ko;oy=mod(floor(p*K),7.0)*K-Ko;dx=Pf.x-1.5+jitter*ox;dy=Pf.y-of+jitter*oy;vec3 d3=dx*dx+dy*dy;vec3 d1a=min(d1,d2);d2=max(d1,d2);d2=min(d2,d3);d1=min(d1a,d2);d2=max(d1a,d2);d1.xy=(d1.x<d1.y)? d1.xy : d1.yx;d1.xz=(d1.x<d1.z)? d1.xz : d1.zx;d1.yz=min(d1.yz,d2.yz);d1.y=min(d1.y,d1.z);d1.y=min(d1.y,d2.x);return sqrt(d1.xy);}"; // eslint-disable-line

  var czm_snoise = "#define GLSLIFY 1\n/***@license*Description : Array and textureless GLSL 2D/3D/4D simplex*noise functions.*Author : Ian McEwan,Ashima Arts.*Maintainer : ijm*Lastmod : 20110822(ijm)*License : Copyright(C)2011 Ashima Arts. All rights reserved.*Distributed under the MIT License. See LICENSE file.*https:*/vec4 _czm_mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}vec3 _czm_mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}vec2 _czm_mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}float _czm_mod289(float x){return x-floor(x*(1.0/289.0))*289.0;}vec4 _czm_permute(vec4 x){return _czm_mod289(((x*34.0)+1.0)*x);}vec3 _czm_permute(vec3 x){return _czm_mod289(((x*34.0)+1.0)*x);}float _czm_permute(float x){return _czm_mod289(((x*34.0)+1.0)*x);}vec4 _czm_taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}float _czm_taylorInvSqrt(float r){return 1.79284291400159-0.85373472095314*r;}vec4 _czm_grad4(float j,vec4 ip){const vec4 ones=vec4(1.0,1.0,1.0,-1.0);vec4 p,s;p.xyz=floor(fract(vec3(j)*ip.xyz)*7.0)*ip.z-1.0;p.w=1.5-dot(abs(p.xyz),ones.xyz);s=vec4(lessThan(p,vec4(0.0)));p.xyz=p.xyz+(s.xyz*2.0-1.0)*s.www;return p;}/***DOC_TBA**Implemented by Ian McEwan,Ashima Arts,and distributed under the MIT License.{@link https:**@name czm_snoise*@glslFunction**@see<a href=\"https:*@see Stefan Gustavson's paper<a href=\"http:*/float czm_snoise(vec2 v){const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1;i1=(x0.x>x0.y)? vec2(1.0,0.0): vec2(0.0,1.0);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=_czm_mod289(i);vec3 p=_czm_permute(_czm_permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);m=m*m;m=m*m;vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.0*dot(m,g);}float czm_snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=_czm_mod289(i);vec4 p=_czm_permute(_czm_permute(_czm_permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=_czm_taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}float czm_snoise(vec4 v){const vec4 C=vec4(0.138196601125011,0.276393202250021,0.414589803375032,-0.447213595499958);\n#define F4 0.309016994374947451\nvec4 i=floor(v+dot(v,vec4(F4)));vec4 x0=v-i+dot(i,C.xxxx);vec4 i0;vec3 isX=step(x0.yzw,x0.xxx);vec3 isYZ=step(x0.zww,x0.yyz);i0.x=isX.x+isX.y+isX.z;i0.yzw=1.0-isX;i0.y+=isYZ.x+isYZ.y;i0.zw+=1.0-isYZ.xy;i0.z+=isYZ.z;i0.w+=1.0-isYZ.z;vec4 i3=clamp(i0,0.0,1.0);vec4 i2=clamp(i0-1.0,0.0,1.0);vec4 i1=clamp(i0-2.0,0.0,1.0);vec4 x1=x0-i1+C.xxxx;vec4 x2=x0-i2+C.yyyy;vec4 x3=x0-i3+C.zzzz;vec4 x4=x0+C.wwww;i=_czm_mod289(i);float j0=_czm_permute(_czm_permute(_czm_permute(_czm_permute(i.w)+i.z)+i.y)+i.x);vec4 j1=_czm_permute(_czm_permute(_czm_permute(_czm_permute(i.w+vec4(i1.w,i2.w,i3.w,1.0))+i.z+vec4(i1.z,i2.z,i3.z,1.0))+i.y+vec4(i1.y,i2.y,i3.y,1.0))+i.x+vec4(i1.x,i2.x,i3.x,1.0));vec4 ip=vec4(1.0/294.0,1.0/49.0,1.0/7.0,0.0);vec4 p0=_czm_grad4(j0,ip);vec4 p1=_czm_grad4(j1.x,ip);vec4 p2=_czm_grad4(j1.y,ip);vec4 p3=_czm_grad4(j1.z,ip);vec4 p4=_czm_grad4(j1.w,ip);vec4 norm=_czm_taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;p4*=_czm_taylorInvSqrt(dot(p4,p4));vec3 m0=max(0.6-vec3(dot(x0,x0),dot(x1,x1),dot(x2,x2)),0.0);vec2 m1=max(0.6-vec2(dot(x3,x3),dot(x4,x4)),0.0);m0=m0*m0;m1=m1*m1;return 49.0*(dot(m0*m0,vec3(dot(p0,x0),dot(p1,x1),dot(p2,x2)))+dot(m1*m1,vec2(dot(p3,x3),dot(p4,x4))));}"; // eslint-disable-line

  var AsphaltMaterial = "#define GLSLIFY 1\nuniform vec4 asphaltColor;uniform float bumpSize;uniform float roughness;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec4 color=asphaltColor;vec2 st=materialInput.st;vec2 F=czm_cellular(st/bumpSize);color.rgb-=(F.x/F.y)*0.1;float noise=czm_snoise(st/bumpSize);noise=pow(noise,5.0)*roughness;color.rgb+=noise;material.diffuse=color.rgb;material.alpha=color.a;return material;}"; // eslint-disable-line

  var BrickMaterial = "#define GLSLIFY 1\nuniform vec4 lightColor;uniform vec4 darkColor;uniform float frequency;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 F=czm_cellular(materialInput.st*frequency);float t=1.0-F.x*F.x;vec4 color=mix(lightColor,darkColor,t);material.diffuse=color.rgb;material.alpha=color.a;return material;}"; // eslint-disable-line

  var CementMaterial = "#define GLSLIFY 1\nuniform vec4 cementColor;uniform float grainScale;uniform float roughness;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);float noise=czm_snoise(materialInput.st/grainScale);noise=pow(noise,5.0)*roughness;vec4 color=cementColor;color.rgb+=noise;material.diffuse=color.rgb;material.alpha=color.a;return material;}"; // eslint-disable-line

  var ErosionMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float time;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);float alpha=1.0;if(time!=1.0){float t=0.5+(0.5*czm_snoise(materialInput.str/(1.0/10.0)));if(t>time){alpha=0.0;}}material.diffuse=color.rgb;material.alpha=color.a*alpha;return material;}"; // eslint-disable-line

  var FacetMaterial = "#define GLSLIFY 1\nuniform vec4 lightColor;uniform vec4 darkColor;uniform float frequency;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 F=czm_cellular(materialInput.st*frequency);float t=0.1+(F.y-F.x);vec4 color=mix(lightColor,darkColor,t);material.diffuse=color.rgb;material.alpha=color.a;return material;}"; // eslint-disable-line

  var FresnelMaterial = "#define GLSLIFY 1\nczm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec3 normalWC=normalize(czm_inverseViewRotation*material.normal);vec3 positionWC=normalize(czm_inverseViewRotation*materialInput.positionToEyeEC);float cosAngIncidence=max(dot(normalWC,positionWC),0.0);material.diffuse=mix(reflection.diffuse,refraction.diffuse,cosAngIncidence);return material;}"; // eslint-disable-line

  var GrassMaterial = "#define GLSLIFY 1\nuniform vec4 grassColor;uniform vec4 dirtColor;uniform float patchiness;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st;float noise1=(czm_snoise(st*patchiness*1.0))*1.0;float noise2=(czm_snoise(st*patchiness*2.0))*0.5;float noise3=(czm_snoise(st*patchiness*4.0))*0.25;float noise=sin(noise1+noise2+noise3)*0.1;vec4 color=mix(grassColor,dirtColor,noise);float verticalNoise=czm_snoise(vec2(st.x*100.0,st.y*20.0))*0.02;float horizontalNoise=czm_snoise(vec2(st.x*20.0,st.y*100.0))*0.02;float stripeNoise=min(verticalNoise,horizontalNoise);color.rgb+=stripeNoise;material.diffuse=color.rgb;material.alpha=color.a;return material;}"; // eslint-disable-line

  var ReflectionMaterial = "#define GLSLIFY 1\nuniform samplerCube cubeMap;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec3 normalWC=normalize(czm_inverseViewRotation*material.normal);vec3 positionWC=normalize(czm_inverseViewRotation*materialInput.positionToEyeEC);vec3 reflectedWC=reflect(positionWC,normalWC);material.diffuse=textureCube(cubeMap,reflectedWC).channels;return material;}"; // eslint-disable-line

  var RefractionMaterial = "#define GLSLIFY 1\nuniform samplerCube cubeMap;uniform float indexOfRefractionRatio;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec3 normalWC=normalize(czm_inverseViewRotation*material.normal);vec3 positionWC=normalize(czm_inverseViewRotation*materialInput.positionToEyeEC);vec3 refractedWC=refract(positionWC,-normalWC,indexOfRefractionRatio);material.diffuse=textureCube(cubeMap,refractedWC).channels;return material;}"; // eslint-disable-line

  var TieDyeMaterial = "#define GLSLIFY 1\nuniform vec4 lightColor;uniform vec4 darkColor;uniform float frequency;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec3 scaled=materialInput.str*frequency;float t=abs(czm_snoise(scaled));vec4 color=mix(lightColor,darkColor,t);material.diffuse=color.rgb;material.alpha=color.a;return material;}"; // eslint-disable-line

  var WoodMaterial = "#define GLSLIFY 1\nuniform vec4 lightWoodColor;uniform vec4 darkWoodColor;uniform float ringFrequency;uniform vec2 noiseScale;uniform float grainFrequency;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st;vec2 noisevec;noisevec.x=czm_snoise(st*noiseScale.x);noisevec.y=czm_snoise(st*noiseScale.y);vec2 location=st+noisevec;float dist=sqrt(location.x*location.x+location.y*location.y);dist*=ringFrequency;float r=fract(dist+noisevec[0]+noisevec[1])*2.0;if(r>1.0)r=2.0-r;vec4 color=mix(lightWoodColor,darkWoodColor,r);r=abs(czm_snoise(vec2(st.x*grainFrequency,st.y*grainFrequency*0.02)))*0.2;color.rgb+=lightWoodColor.rgb*r;material.diffuse=color.rgb;material.alpha=color.a;return material;}"; // eslint-disable-line

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
          return material.uniforms.asphaltColor.alpha < 1.0
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
          source: BrickMaterial
      },
      translucent: function (material) {
          var uniforms = material.uniforms;
          return uniforms.lightColor.alpha < 1.0 || uniforms.darkColor.alpha < 0.0
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
          return uniforms.brickColor.alpha < 1.0 || uniforms.mortarColor.alpha < 1.0
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
          return material.uniforms.cementColor.alpha < 1.0
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
          return material.uniforms.color.alpha < 1.0
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
          return uniforms.lightColor.alpha < 1.0 || uniforms.darkColor.alpha < 0.0
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
          return uniforms.grassColor.alpha < 1.0 || uniforms.dirtColor.alpha < 1.0
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
          return uniforms.lightColor.alpha < 1.0 || uniforms.darkColor.alpha < 0.0
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
          return (
              uniforms.lightWoodColor.alpha < 1.0 || uniforms.darkWoodColor.alpha < 1.0
          )
      }
  });

  var CircleBlurMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st;vec2 center=vec2(0.5);float time=fract(czm_frameNumber*speed/1000.0);float r=0.5+sin(time)/3.0;float dis=distance(st,center);float a=0.0;if(dis<r){a=1.0-smoothstep(0.0,r,dis);}material.alpha=pow(a,10.0);material.diffuse=color.rgb*a*3.0;return material;}"; // eslint-disable-line

  var CircleDiffuseMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;vec3 circlePing(float r,float innerTail,float frontierBorder,float timeResetSeconds,float radarPingSpeed,float fadeDistance){float t=fract(czm_frameNumber*speed/1000.0);float time=mod(t,timeResetSeconds)*radarPingSpeed;float circle;circle+=smoothstep(time-innerTail,time,r)*smoothstep(time+frontierBorder,time,r);circle*=smoothstep(fadeDistance,0.0,r);return vec3(circle);}czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st*2.0-1.0;vec2 center=vec2(0.);float time=fract(czm_frameNumber*speed/1000.0);vec3 flagColor;float r=length(st-center)/4.;flagColor+=circlePing(r,0.25,0.025,4.0,0.3,1.0)*color.rgb;material.alpha=length(flagColor);material.diffuse=flagColor.rgb;return material;}"; // eslint-disable-line

  var CircleFadeMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);material.diffuse=1.5*color.rgb;vec2 st=materialInput.st;float dis=distance(st,vec2(0.5,0.5));float per=fract(czm_frameNumber*speed/1000.0);if(dis>per*0.5){material.alpha=color.a;}else{discard;}return material;}"; // eslint-disable-line

  var CirclePulseMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st*2.0-1.0;float time=fract(czm_frameNumber*speed/1000.0);float r=length(st)*1.2;float a=pow(r,2.0);float b=sin(r*0.8-1.6);float c=sin(r-0.010);float s=sin(a-time*2.0+b)*c;float d=abs(1.0/(s*10.8))-0.01;material.alpha=pow(d,10.0);material.diffuse=color.rgb*d;return material;}"; // eslint-disable-line

  var CircleScanMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;float circle(vec2 uv,float r,float blur){float d=length(uv)*2.0;float c=smoothstep(r+blur,r,d);return c;}czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st-.5;material.diffuse=color.rgb;material.emission=vec3(0);float t=fract(czm_frameNumber*speed/1000.0);float s=0.3;float radius1=smoothstep(.0,s,t)*0.5;float alpha1=circle(st,radius1,0.01)*circle(st,radius1,-0.01);float alpha2=circle(st,radius1,0.01-radius1)*circle(st,radius1,0.01);float radius2=0.5+smoothstep(s,1.0,t)*0.5;float alpha3=circle(st,radius1,radius2+0.01-radius1)*circle(st,radius1,-0.01);material.alpha=smoothstep(1.0,s,t)*(alpha1+alpha2*0.1+alpha3*0.1);material.alpha*=color.a;return material;}"; // eslint-disable-line

  var CircleSpiralMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;\n#define PI 3.14159265359\nvec2 rotate2D(vec2 _st,float _angle){_st=mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle))*_st;return _st;}czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st*2.0-1.0;st*=1.6;float time=czm_frameNumber*speed/1000.0;float r=length(st);float w=.3;st=rotate2D(st,(r*PI*6.-time*2.));float a=smoothstep(-w,.2,st.x)*smoothstep(w,.2,st.x);float b=abs(1./(sin(pow(r,2.)*2.-time*1.3)*6.))*.4;material.alpha=a*b;material.diffuse=color.rgb*a*b*3.0;return material;}"; // eslint-disable-line

  var CircleVaryMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st*2.0-1.0;float time=czm_frameNumber*speed/1000.0;float radius=length(st);float angle=atan(st.y/st.x);float radius1=sin(time*2.0)+sin(40.0*angle+time)*0.01;float radius2=cos(time*3.0);vec3 fragColor=0.2+0.5*cos(time+color.rgb+vec3(0,2,4));float inten1=1.0-sqrt(abs(radius1-radius));float inten2=1.0-sqrt(abs(radius2-radius));material.alpha=pow(inten1+inten2,5.0);material.diffuse=fragColor*(inten1+inten2);return material;}"; // eslint-disable-line

  var CircleWaveMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;uniform float count;uniform float gradient;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);material.diffuse=1.5*color.rgb;vec2 st=materialInput.st;float dis=distance(st,vec2(0.5,0.5));float per=fract(czm_frameNumber*speed/1000.0);if(count==1.0){if(dis>per*0.5){discard;}else{material.alpha=color.a*dis/per/2.0;}}else{vec3 str=materialInput.str;if(abs(str.z)>0.001){discard;}if(dis>0.5){discard;}else{float perDis=0.5/count;float disNum;float bl=0.0;for(int i=0;i<=999;i++){if(float(i)<=count){disNum=perDis*float(i)-dis+per/count;if(disNum>0.0){if(disNum<perDis){bl=1.0-disNum/perDis;}else if(disNum-perDis<perDis){bl=1.0-abs(1.0-disNum/perDis);}material.alpha=pow(bl,(1.0+10.0*(1.0-gradient)));}}}}}return material;}"; // eslint-disable-line

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
          return true
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
          return true
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
          return true
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
          return true
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
          return true
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
          return true
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
          return true
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
          return true
      }
  });

  var EllipsoidElectricMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;\n#define pi 3.1415926535\n#define PI2RAD 0.01745329252\n#define TWO_PI (2. * PI)\nfloat rands(float p){return fract(sin(p)*10000.0);}float noise(vec2 p){float time=fract(czm_frameNumber*speed/1000.0);float t=time/20000.0;if(t>1.0)t-=floor(t);return rands(p.x*14.+p.y*sin(t)*0.5);}vec2 sw(vec2 p){return vec2(floor(p.x),floor(p.y));}vec2 se(vec2 p){return vec2(ceil(p.x),floor(p.y));}vec2 nw(vec2 p){return vec2(floor(p.x),ceil(p.y));}vec2 ne(vec2 p){return vec2(ceil(p.x),ceil(p.y));}float smoothNoise(vec2 p){vec2 inter=smoothstep(0.0,1.0,fract(p));float s=mix(noise(sw(p)),noise(se(p)),inter.x);float n=mix(noise(nw(p)),noise(ne(p)),inter.x);return mix(s,n,inter.y);}float fbm(vec2 p){float z=2.0;float rz=0.0;vec2 bp=p;for(float i=1.0;i<6.0;i++){rz+=abs((smoothNoise(p)-0.5)*2.0)/z;z*=2.0;p*=2.0;}return rz;}czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st;vec2 st2=materialInput.st;float time=fract(czm_frameNumber*speed/1000.0);if(st.t<0.5){discard;}st*=4.;float rz=fbm(st);st/=exp(mod(time*2.0,pi));rz*=pow(15.,0.9);vec4 temp=vec4(0);temp=mix(color/rz,vec4(color.rgb,0.1),0.2);if(st2.s<0.05){temp=mix(vec4(color.rgb,0.1),temp,st2.s/0.05);}if(st2.s>0.95){temp=mix(temp,vec4(color.rgb,0.1),(st2.s-0.95)/0.05);}material.diffuse=temp.rgb;material.alpha=temp.a*2.0;return material;}"; // eslint-disable-line

  var EllipsoidTrailMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st;float time=fract(czm_frameNumber*speed/1000.0);float alpha=abs(smoothstep(0.5,1.,fract(-st.t-time)));alpha+=.1;material.alpha=alpha;material.diffuse=color.rgb;return material;}"; // eslint-disable-line

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:21:44
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 18:40:15
   */

  /**
   * EllipsoidElectric
   * @type {string}
   */
  Cesium$1.Material.EllipsoidElectricType = 'EllipsoidElectric';
  Cesium$1.Material._materialCache.addMaterial(
      Cesium$1.Material.EllipsoidElectricType,
      {
          fabric: {
              type: Cesium$1.Material.EllipsoidElectricType,
              uniforms: {
                  color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
                  speed: 1
              },
              source: EllipsoidElectricMaterial
          },
          translucent: function (material) {
              return true
          }
      }
  );

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
          return true
      }
  });

  var LineFlickerMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);float time=fract(czm_frameNumber*speed/1000.0);vec2 st=materialInput.st;float scalar=smoothstep(0.0,1.0,time);material.diffuse=color.rgb*scalar;material.alpha=color.a*scalar;return material;}"; // eslint-disable-line

  var LineFlowMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;uniform float percent;uniform float gradient;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st;float t=fract(czm_frameNumber*speed/1000.0);t*=(1.0+percent);float alpha=smoothstep(t-percent,t,st.s)*step(-t,-st.s);alpha+=gradient;material.diffuse=color.rgb;material.alpha=alpha;return material;}"; // eslint-disable-line

  var LineImageTrailMaterial = "#define GLSLIFY 1\nuniform sampler2D image;uniform float speed;uniform vec4 color;uniform vec2 repeat;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=repeat*materialInput.st;float time=fract(czm_frameNumber*speed/1000.0);vec4 colorImage=texture2D(image,vec2(fract(st.s-time),st.t));if(color.a==0.0){material.alpha=colorImage.a;material.diffuse=colorImage.rgb;}else{material.alpha=colorImage.a*color.a;material.diffuse=max(color.rgb*material.alpha*3.0,color.rgb);}return material;}"; // eslint-disable-line

  var LineLightingMaterial = "#define GLSLIFY 1\nuniform sampler2D image;uniform vec4 color;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st;vec4 colorImage=texture2D(image,st);vec3 fragColor=color.rgb;material.alpha=colorImage.a*color.a*3.;material.diffuse=max(fragColor.rgb+colorImage.rgb,fragColor.rgb);return material;}"; // eslint-disable-line

  var LineLightingTrailMaterial = "#define GLSLIFY 1\nuniform sampler2D image;uniform vec4 color;uniform float speed;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st;float time=fract(czm_frameNumber*speed/1000.0);vec4 colorImage=texture2D(image,st);vec3 fragColor=color.rgb;if(st.t>0.45&&st.t<0.55){fragColor=vec3(1.0);}if(color.a==0.0){material.alpha=colorImage.a*1.5*fract(st.s-time);material.diffuse=colorImage.rgb;}else{material.alpha=colorImage.a*color.a*1.5*smoothstep(.0,1.,fract(st.s-time));material.diffuse=max(fragColor.rgb*material.alpha,fragColor.rgb);}return material;}"; // eslint-disable-line

  var LineTrailMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st;float time=fract(czm_frameNumber*speed/1000.0);material.diffuse=color.rgb;material.alpha=color.a*fract(st.s-time);return material;}"; // eslint-disable-line

  /**
   * PolylineFlicker
   * @type {string}
   */
  Cesium$1.Material.PolylineFlickerType = 'PolylineFlicker';
  Cesium$1.Material._materialCache.addMaterial(
      Cesium$1.Material.PolylineFlickerType,
      {
          fabric: {
              type: Cesium$1.Material.PolylineFlickerType,
              uniforms: {
                  color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
                  speed: 1
              },
              source: LineFlickerMaterial
          },
          translucent: function (material) {
              return true
          }
      }
  );

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
          return true
      }
  });

  /**
   * PolylineImageTrail
   * @type {string}
   */
  Cesium$1.Material.PolylineImageTrailType = 'PolylineImageTrail';
  Cesium$1.Material._materialCache.addMaterial(
      Cesium$1.Material.PolylineImageTrailType,
      {
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
              return true
          }
      }
  );

  /**
   * PolylineLighting
   * @type {string}
   */
  Cesium$1.Material.PolylineLightingType = 'PolylineLighting';
  Cesium$1.Material._materialCache.addMaterial(
      Cesium$1.Material.PolylineLightingType,
      {
          fabric: {
              type: Cesium$1.Material.PolylineLightingType,
              uniforms: {
                  color: new Cesium$1.Color(1.0, 0.0, 0.0, 0.7),
                  image: Cesium$1.Material.DefaultImageId
              },
              source: LineLightingMaterial
          },
          translucent: function (material) {
              return true
          }
      }
  );

  /**
   * PolylineLightingTrail
   * @type {string}
   */
  Cesium$1.Material.PolylineLightingTrailType = 'PolylineLightingTrail';
  Cesium$1.Material._materialCache.addMaterial(
      Cesium$1.Material.PolylineLightingTrailType,
      {
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
              return true
          }
      }
  );

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
          return true
      }
  });

  var RadarLineMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st*2.0-1.0;float t=czm_frameNumber*10.0/1000.0;vec3 col=vec3(0.0);vec2 p=vec2(sin(t),cos(t));float d=length(st-dot(p,st)*p);if(dot(st,p)<0.){d=length(st);}col=.006/d*color.rgb;if(distance(st,vec2(0))>0.99){col=color.rgb;}material.alpha=pow(length(col),2.0);material.diffuse=col*3.0;return material;}"; // eslint-disable-line

  var RadarSweepMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;\n#define PI 3.14159265359\nczm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st;vec2 scrPt=st*2.0-1.0;float time=czm_frameNumber*speed/1000.0;vec3 col=vec3(0.0);mat2 rot;float theta=-time*1.0*PI-2.2;float cosTheta,sinTheta;cosTheta=cos(theta);sinTheta=sin(theta);rot[0][0]=cosTheta;rot[0][1]=-sinTheta;rot[1][0]=sinTheta;rot[1][1]=cosTheta;vec2 scrPtRot=rot*scrPt;float angle=1.0-(atan(scrPtRot.y,scrPtRot.x)/6.2831+0.5);float falloff=1.0-length(scrPtRot);float ringSpacing=0.23;if(mod(length(scrPtRot),ringSpacing)<0.015&&length(scrPtRot)/ringSpacing<5.0){col+=vec3(0,0.5,0);}col+=vec3(0,0.8,0)*step(mod(length(scrPtRot),ringSpacing),0.01)*step(length(scrPtRot),1.0);material.alpha=pow(length(col+vec3(.5)),5.0);material.diffuse=(0.5+pow(angle,2.0)*falloff)*color.rgb;return material;}"; // eslint-disable-line

  var RadarWaveMaterial = "#define GLSLIFY 1\nuniform vec4 color;uniform float speed;\n#define PI 3.14159265359\nfloat rand(vec2 co){return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);}czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st;vec2 pos=st-vec2(0.5);float time=czm_frameNumber*speed/1000.0;float r=length(pos);float t=atan(pos.y,pos.x)-time*2.5;float a=(atan(sin(t),cos(t))+PI)/(2.0*PI);float ta=0.5;float v=smoothstep(ta-0.05,ta+0.05,a)*smoothstep(ta+0.05,ta-0.05,a);vec3 flagColor=color.rgb*v;float blink=pow(sin(time*1.5)*0.5+0.5,0.8);flagColor=color.rgb*pow(a,8.0*(.2+blink))*(sin(r*500.0)*.5+.5);flagColor=flagColor*pow(r,0.4);material.alpha=length(flagColor)*1.3;material.diffuse=flagColor*3.0;return material;}"; // eslint-disable-line

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:21:44
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 18:59:55
   */

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
          return true
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
          return true
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
          return true
      }
  });

  var WallImageTrailMaterial = "#define GLSLIFY 1\nuniform sampler2D image;uniform vec4 color;uniform float speed;uniform vec2 repeat;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st*repeat;float time=fract(czm_frameNumber*speed/1000.0);vec4 colorImage=texture2D(image,vec2(fract(st.s-time),st.t));material.alpha=colorImage.a*color.a;material.diffuse=colorImage.rgb*color.rgb*3.0;return material;}"; // eslint-disable-line

  var WallLineTrailMaterial = "#define GLSLIFY 1\nuniform sampler2D image;uniform float speed;uniform vec4 color;uniform vec2 repeat;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);float perDis=1.0/repeat.y/3.0;vec2 st=materialInput.st*repeat;float time=fract(czm_frameNumber*speed/1000.0);vec4 colorImage=texture2D(image,vec2(st.s,fract(st.t-time)));material.alpha=colorImage.a*smoothstep(.2,1.,distance(st.t*perDis,1.+perDis));material.diffuse=max(color.rgb*material.alpha*1.5,color.rgb);material.emission=max(color.rgb*material.alpha*1.5,color.rgb);return material;}"; // eslint-disable-line

  var WallTrailMaterial = "#define GLSLIFY 1\nuniform sampler2D image;uniform float speed;uniform vec4 color;czm_material czm_getMaterial(czm_materialInput materialInput){czm_material material=czm_getDefaultMaterial(materialInput);vec2 st=materialInput.st;float time=fract(czm_frameNumber*speed/1000.0);vec4 colorImage=texture2D(image,vec2(fract(st.t-time),st.t));if(color.a==0.0){material.alpha=colorImage.a;material.diffuse=colorImage.rgb;}else{material.alpha=colorImage.a*color.a;material.diffuse=max(color.rgb*material.alpha*3.0,color.rgb);}return material;}"; // eslint-disable-line

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:21:44
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 18:46:33
   */

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
          return true
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
          return true
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
          return true
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
          return false
      }

      get definitionChanged() {
          return this._definitionChanged
      }

      getType(time) {
          return null
      }

      getValue(time, result) {
          result = Cesium$1.defaultValue(result, {});
          return result
      }

      equals(other) {
          return this === other
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
          return Cesium$1.Material.CircleBlurType
      }

      getValue(time, result) {
          result = Cesium$1.defaultValue(result, {});
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof CircleBlurMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.CircleDiffuseType
      }

      getValue(time, result) {
          result = Cesium$1.defaultValue(result, {});
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof CircleDiffuseMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.CircleFadeType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof CircleFadeMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.CirclePulseType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof CirclePulseMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.CircleScanType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof CircleScanMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.CircleSpiralType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof CircleSpiralMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.CircleVaryType
      }

      getValue(time, result) {
          result = Cesium$1.defaultValue(result, {});
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof CircleVaryMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return false
      }

      get definitionChanged() {
          return this._definitionChanged
      }

      getType(time) {
          return Cesium$1.Material.CircleWaveType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          result.count = this.count;
          result.gradient = this.gradient;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof CircleWaveMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.EllipsoidElectricType
      }

      getValue(time, result) {
          result = Cesium$1.defaultValue(result, {});
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof EllipsoidElectricMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.EllipsoidTrailType
      }

      getValue(time, result) {
          result = Cesium$1.defaultValue(result, {});
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof EllipsoidTrailMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.PolylineFlickerType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof PolylineFlickerMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.PolylineFlowType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          result.percent = this._percent;
          result.gradient = this._gradient;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof PolylineFlowMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed) &&
                  Cesium$1.Property.equals(this._percent, other._percent) &&
                  Cesium$1.Property.equals(this._gradient, other._gradient))
          )
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
          this.repeat = new Cesium$1.Cartesian2(
              options.repeat?.x || 1,
              options.repeat?.y || 1
          );
      }

      getType(time) {
          return Cesium$1.Material.PolylineImageTrailType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.image = Cesium$1.Property.getValueOrUndefined(this._image, time);
          result.repeat = Cesium$1.Property.getValueOrUndefined(this._repeat, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof PolylineImageTrailMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._image, other._image) &&
                  Cesium$1.Property.equals(this._repeat, other._repeat) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
      }
  }

  Object.defineProperties(PolylineImageTrailMaterialProperty.prototype, {
      color: Cesium$1.createPropertyDescriptor('color'),
      speed: Cesium$1.createPropertyDescriptor('speed'),
      image: Cesium$1.createPropertyDescriptor('image'),
      repeat: Cesium$1.createPropertyDescriptor('repeat')
  });

  var img$2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAACYCAYAAACS0lH9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAJ0GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgMTE2LjE2NDY1NSwgMjAyMS8wMS8yNi0xNTo0MToyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplODY0YmNmNy1lZGIyLWIyNDQtYWI0NC04OWZkNmMwOTQ4MDYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjIyOGMxMDUtODFmZS00MjAxLWIwOTEtZDkwMGI0NTI0NWMwIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IjcxNzA5OEJGODAwODNEREJGRDQyQzAzMzQ5NDlDRDFDIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IiIgdGlmZjpJbWFnZVdpZHRoPSI1MTIiIHRpZmY6SW1hZ2VMZW5ndGg9IjE1MiIgdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPSIyIiB0aWZmOlNhbXBsZXNQZXJQaXhlbD0iMyIgdGlmZjpYUmVzb2x1dGlvbj0iMS8xIiB0aWZmOllSZXNvbHV0aW9uPSIxLzEiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjEiIGV4aWY6RXhpZlZlcnNpb249IjAyMzEiIGV4aWY6Q29sb3JTcGFjZT0iNjU1MzUiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI1MTIiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxNTIiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTAyLTIzVDEwOjAyOjQxKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wMi0yM1QxMDowODo0NCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wMi0yM1QxMDowODo0NCswODowMCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmZmYTk5ZjhhLTdiZmQtNDcxNi04MTgwLWJmZTUyMmFmNGUzNSIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0yM1QxMDowODo0NCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9qcGVnIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvanBlZyB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYyMjhjMTA1LTgxZmUtNDIwMS1iMDkxLWQ5MDBiNDUyNDVjMCIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0yM1QxMDowODo0NCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmZmYTk5ZjhhLTdiZmQtNDcxNi04MTgwLWJmZTUyMmFmNGUzNSIgc3RSZWY6ZG9jdW1lbnRJRD0iNzE3MDk4QkY4MDA4M0REQkZENDJDMDMzNDk0OUNEMUMiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0iNzE3MDk4QkY4MDA4M0REQkZENDJDMDMzNDk0OUNEMUMiLz4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+NzE3MDk4QkY4MDA4M0REQkZENDJDMDMzNDk0OUNEMUM8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHRpZmY6Qml0c1BlclNhbXBsZT4gPHJkZjpTZXE+IDxyZGY6bGk+ODwvcmRmOmxpPiA8cmRmOmxpPjg8L3JkZjpsaT4gPHJkZjpsaT44PC9yZGY6bGk+IDwvcmRmOlNlcT4gPC90aWZmOkJpdHNQZXJTYW1wbGU+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+h9EbuwAAA01JREFUeJzt3TuOFVkQBNDoJhmEkDBgZv8L5GMgIcRvHg5ryDTiHKn98Co67q16T4/HYwIAVHm+DgAA7FMAAKCQAgAAhSbJ03UIAGCXBQAACikAAFDIEQAAFLIAAEAhBQAACikAAFBoogQAQB0PfwAopAAAQCGvAQJAIQsAABSyAABAIQsAABSyAABAIQUAAAo5AgCAQr4ECACFPPwBoJACAACFHAEAQCEPfwAoZAEAgEIe/gBQyAIAAIU8/AGgkAUAAAr5LQAAKOS/fwAoZAEAgELuAABAIQsAABRSAACgkAIAAIXcAQCAQhYAAChkAQCAQgoAABRSAACgkIc/ABSaJC+uQwAAu7wFAACFFAAAKDR//wCAIhYAACjkEiAAFLIAAEChSfLyOgQAsMuXAAGgkLcAAKCQAgAAhbwFAACFFAAAKOQIAAAKTZJ/rkMAALsUAAAo5AgAAAr5EiAAFFIAAKCQOwAAUEgBAIBCk+TVdQgAYNckeXMdAgDYNUneXocAAHZNkvfXIQCAXZPkv+sQAMCuSfLvdQgAYNckeXcdAgDY5RIgABSaJK+vQwAAu/wWAAAUmiRP1yEAgF2T5HEdAgDYNUl+XocAAHZNkm/XIQCAXZPky3UIAGDXJPl8HQIA2DVJPl6HAAB2TZIP1yEAgF2T5NN1CABgl0uAAFBokny9DgEA7Jok369DAAC7JsmP6xAAwC4FAAAK+S0AACikAABAoUny6zoEALDLHQAAKKQAAEAhRwAAUGiS/L4OAQDsUgAAoJAjAAAopAAAQKFJ8v91CABgly8BAkChSfK4DgEA7PIWAAAUsgAAQCFvAQBAIQsAABRSAACgkEuAAFDo+ToAALDPlwABoJACAACFFAAAKOQtAAAoZAEAgEIWAAAopAAAQCEFAAAKuQMAAIUsAABQyKeAAaCQBQAACrkDAACFHAEAQCELAAAUsgAAQCELAAAUsgAAQCELAAAUsgAAQCEFAAAKOQIAgEIWAAAo5LcAAKCQAgAAhRwBAEAhCwAAFLIAAEAhCwAAFLIAAEAhBQAACvkSIAAUsgAAQCEFAAAKKQAAUMhrgABQyAIAAIUUAAAo5AgAAApZAACgkAIAAIUUAAAo5A4AABT6A6gaPQ6/wRIfAAAAAElFTkSuQmCC";

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 11:56:05
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 18:32:35
   */

  class PolylineLightingMaterialProperty extends MaterialProperty {
      constructor(options = {}) {
          super(options);
          this._image = undefined;
          this._imageSubscription = undefined;
          this.image = img$2;
      }

      getType(time) {
          return Cesium$1.Material.PolylineLightingType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.image = Cesium$1.Property.getValueOrUndefined(this._image, time);
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof PolylineLightingMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._image, other._image))
          )
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
   * @LastEditTime: 2021-03-16 18:33:17
   */

  class PolylineLightingTrailMaterialProperty extends MaterialProperty {
      constructor(options = {}) {
          super(options);
          this._image = undefined;
          this._imageSubscription = undefined;
          this.image = img$2;
      }

      getType(time) {
          return Cesium$1.Material.PolylineLightingTrailType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.image = Cesium$1.Property.getValueOrUndefined(this._image, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof PolylineLightingTrailMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.PolylineTrailType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof PolylineTrailMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.RadarLineType
      }

      getValue(time, result) {
          result = Cesium$1.defaultValue(result, {});
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof RadarLineMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.RadarSweepType
      }

      getValue(time, result) {
          result = Cesium$1.defaultValue(result, {});
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof RadarSweepMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          return Cesium$1.Material.RadarWaveType
      }

      getValue(time, result) {
          result = Cesium$1.defaultValue(result, {});
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof RadarWaveMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          this.repeat = new Cesium$1.Cartesian2(
              options.repeat.x || 1,
              options.repeat.y || 1
          );
      }

      getType(time) {
          return Cesium$1.Material.WallImageTrailType
      }

      getValue(time, result) {
          result = Cesium$1.defaultValue(result, {});
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.image = Cesium$1.Property.getValueOrUndefined(this._image, time);
          result.repeat = Cesium$1.Property.getValueOrUndefined(this._repeat, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof WallImageTrailMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._image, other._image) &&
                  Cesium$1.Property.equals(this._repeat, other._repeat) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
      }
  }

  Object.defineProperties(WallImageTrailMaterialProperty.prototype, {
      image: Cesium$1.createPropertyDescriptor('image'),
      color: Cesium$1.createPropertyDescriptor('color'),
      speed: Cesium$1.createPropertyDescriptor('speed'),
      repeat: Cesium$1.createPropertyDescriptor('repeat')
  });

  var img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVwAAABACAYAAABWdc94AAAACXBIWXMAAAsTAAALEwEAmpwYAAAGx2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgMTE2LjE2NDY1NSwgMjAyMS8wMS8yNi0xNTo0MToyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTAyLTIzVDE3OjE0OjMyKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTAyLTI0VDE0OjIwOjE2KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wMi0yNFQxNDoyMDoxNiswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NzQzY2I0NC0zMzk3LTQ5OTAtYjg4OC0yNDFlNmExYmQyYWYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5YWYxZDY1MC1jNWRlLTVmNDgtYWYzNi1hZDE4ZWRkN2QzYTAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiMmZjZmU2Zi1hZWQwLTRjMWQtYjZmOS1lNjAwMjJiNmEwOGUiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIyZmNmZTZmLWFlZDAtNGMxZC1iNmY5LWU2MDAyMmI2YTA4ZSIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0yM1QxNzoxNDozMiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNjM2JjM2I5LTkwNDEtNDk1ZS04MTc5LTdkZjc3NDIwZDczOSIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0yM1QxNzoxNDozMiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjU3NDNjYjQ0LTMzOTctNDk5MC1iODg4LTI0MWU2YTFiZDJhZiIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0yNFQxNDoyMDoxNiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+eAiLkwAAAQZJREFUeJzt3LERwDAMxDAl5/1XdqYIXRiYQBULFf/svQeA/72nDwC4heACRAQXICK4ABHBBYgILkBEcAEiggsQEVyAiOACRAQXICK4ABHBBYgILkBkzYx9RoDAmpnn9BEAN/BSAIgILkBEcAEiggsQEVyAiOACRAQXICK4ABHBBYgILkBEcAEiggsQEVyAiOACRAQXIGKAHCBigBwg4qUAEBFcgIjgAkQEFyAiuAARwQWICC5ARHABIoILEBFcgIjgAkQEFyAiuAARwQWI2MMFiNjDBYh4KQBEBBcgIrgAEcEFiAguQERwASKCCxARXICI4AJEBBcgIrgAEcEFiAguQERwASIfRmAGiWTgoMYAAAAASUVORK5CYII=";

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:19:07
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 18:34:00
   */

  class WallLineTrailMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
      super(options);
      this._image = undefined;
      this._imageSubscription = undefined;
      this._repeat = undefined;
      this._repeatSubscription = undefined;
      this.image = img$1;
      this.repeat = new Cesium$1.Cartesian2(
        options.repeat?.x || 1,
        options.repeat?.y || 1
      );
    }

    getType(time) {
      return Cesium$1.Material.WallLineTrailType
    }

    getValue(time, result) {
      if (!result) {
        result = {};
      }
      result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
      result.image = Cesium$1.Property.getValueOrUndefined(this._image, time);
      result.repeat = Cesium$1.Property.getValueOrUndefined(this._repeat, time);
      result.speed = this._speed;
      return result
    }

    equals(other) {
      return (
        this === other ||
        (other instanceof WallLineTrailMaterialProperty &&
          Cesium$1.Property.equals(this._color, other._color) &&
          Cesium$1.Property.equals(this._speed, other._speed) &&
          Cesium$1.Property.equals(this._repeat, other._repeat))
      )
    }
  }

  Object.defineProperties(WallLineTrailMaterialProperty.prototype, {
    color: Cesium$1.createPropertyDescriptor('color'),
    image: Cesium$1.createPropertyDescriptor('image'),
    repeat: Cesium$1.createPropertyDescriptor('repeat'),
    speed: Cesium$1.createPropertyDescriptor('speed')
  });

  var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAOhlWElmTU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgExAAIAAAAkAAAAZgEyAAIAAAAUAAAAiodpAAQAAAABAAAAngAAAAAAAABIAAAAAQAAAEgAAAABQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkAMjAxODoxMDoyNiAxNTozMDozNAAABJAEAAIAAAAUAAAA1KABAAMAAAABAAEAAKACAAQAAAABAAAAQKADAAQAAAABAAAAQAAAAAAyMDE4OjEwOjI2IDE1OjI0OjI1ALUCxicAAAAJcEhZcwAACxMAAAsTAQCanBgAAAdgaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MjgyZGYxNWEtYzg5MC00ODUzLWJlZDQtOWEyZjQxMmY0NjljPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD54bXAuZGlkOjI4MmRmMTVhLWM4OTAtNDg1My1iZWQ0LTlhMmY0MTJmNDY5YzwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOjI4MmRmMTVhLWM4OTAtNDg1My1iZWQ0LTlhMmY0MTJmNDY5YzwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxOC0xMC0yNlQxNToyNDoyNSswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDoyODJkZjE1YS1jODkwLTQ4NTMtYmVkNC05YTJmNDEyZjQ2OWM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE4LTEwLTI2VDE1OjMwOjM0KzA4OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgog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";

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-12 12:19:41
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 18:34:28
   */

  class WallTrailMaterialProperty extends MaterialProperty {
      constructor(options = {}) {
          super(options);
          this._image = undefined;
          this._imageSubscription = undefined;
          this.image = img;
      }

      getType(time) {
          return Cesium$1.Material.WallTrailType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.color = Cesium$1.Property.getValueOrUndefined(this._color, time);
          result.image = Cesium$1.Property.getValueOrUndefined(this._image, time);
          result.speed = this._speed;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof WallTrailMaterialProperty &&
                  Cesium$1.Property.equals(this._color, other._color) &&
                  Cesium$1.Property.equals(this._speed, other._speed))
          )
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
          this.baseWaterColor =
              options.baseWaterColor || new Cesium$1.Color(0.2, 0.3, 0.6, 1.0);
          this._blendColor = undefined;
          this._blendColorSubscription = undefined;
          this.blendColor =
              options.blendColor || new Cesium$1.Color(0.0, 1.0, 0.699, 1.0);
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
          return false
      }

      get definitionChanged() {
          return this._definitionChanged
      }

      getType(time) {
          return Cesium$1.Material.WaterType
      }

      getValue(time, result) {
          if (!result) {
              result = {};
          }
          result.baseWaterColor = Cesium$1.Property.getValueOrUndefined(
              this._baseWaterColor,
              time
          );
          result.blendColor = Cesium$1.Property.getValueOrUndefined(
              this._blendColor,
              time
          );
          result.specularMap = Cesium$1.Property.getValueOrUndefined(
              this._specularMap,
              time
          );
          result.normalMap = Cesium$1.Property.getValueOrUndefined(
              this._normalMap,
              time
          );
          result.frequency = this.frequency;
          result.animationSpeed = this.animationSpeed;
          result.amplitude = this.amplitude;
          result.specularIntensity = this.specularIntensity;
          return result
      }

      equals(other) {
          return (
              this === other ||
              (other instanceof WaterMaterialProperty &&
                  Cesium$1.Property.equals(this._baseWaterColor, other._baseWaterColor))
          )
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
          this._viewer.delegate.cesiumWidget.screenSpaceEventHandler.removeInputAction(
              Cesium__default['default'].ScreenSpaceEventType.LEFT_DOUBLE_CLICK
          );
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
          this._viewer.delegate.resolutionScale =
              this._options?.resolutionScale || 1.0;
          return this
      }

      /**
       * sets canvas option
       * @returns {ViewerOption}
       * @private
       */
      _setCanvasOption() {
          this._options.tabIndex &&
              this._viewer.scene.canvas.setAttribute('tabIndex', this._options.tabIndex);
          return this
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

          return this
      }

      /**
       *
       * @returns {ViewerOption}
       * @private
       */
      _setSkyBoxOption() {
          if (!this._options.skyBox) {
              return this
          }
          let skyBox = this._viewer.scene.skyBox;
          let skyBoxOption = this._options.skyBox;
          skyBox.show = skyBoxOption.show ?? true;
          skyBox.offsetAngle = skyBoxOption.offsetAngle || 0;
          if (skyBoxOption.sources) {
              skyBox.sources = skyBoxOption?.sources;
          }
          return this
      }

      /**
       * Sets globe option
       * @returns {ViewerOption}
       * @private
       */
      _setGlobeOption() {
          if (!this._options.globe) {
              return this
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
              backFaceAlphaByDistance:
                  globeOption?.translucency?.backFaceAlphaByDistance,
              frontFaceAlpha: +globeOption?.translucency?.frontFaceAlpha || 1,
              frontFaceAlphaByDistance:
                  globeOption?.translucency?.frontFaceAlphaByDistance
          });

          return this
      }

      /**
       *
       * @returns {ViewerOption}
       * @private
       */
      _setCameraController() {
          if (!this._options?.cameraController) {
              return this
          }

          let sscc = this._viewer.scene.screenSpaceCameraController;
          let cameraController = this._options.cameraController;

          Util$1.merge(sscc, {
              enableInputs: cameraController?.enableInputs ?? true,
              enableRotate: cameraController?.enableRotate ?? true,
              enableTilt: cameraController?.enableTilt ?? true,
              enableTranslate: cameraController?.enableTranslate ?? true,
              enableZoom: cameraController?.enableZoom ?? true,
              enableCollisionDetection:
                  cameraController?.enableCollisionDetection ?? true,
              minimumZoomDistance: +cameraController?.minimumZoomDistance || 1.0,
              maximumZoomDistance: +cameraController?.maximumZoomDistance || 40489014.0
          });
          return this
      }

      /**
       * Sets options
       * @param options
       * @returns {ViewerOption}
       */
      setOptions(options) {
          if (Object.keys(options).length === 0) {
              return this
          }

          this._options = {
              ...this._options,
              ...options
          };

          this._setViewerOption()
              ._setCanvasOption()
              ._setSceneOption()
              ._setSkyBoxOption()
              ._setGlobeOption()
              ._setCameraController();
          return this
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
              handler.setInputAction(
                  movement => {
                      handler.setInputAction(movement => {
                          let enableTilt = true;
                          let isUp = movement.endPosition.y < movement.startPosition.y;
                          if (
                              isUp &&
                              this._viewer.camera.pitch > Cesium__default['default'].Math.toRadians(max)
                          ) {
                              enableTilt = false;
                          } else if (
                              !isUp &&
                              this._viewer.camera.pitch < Cesium__default['default'].Math.toRadians(min)
                          ) {
                              enableTilt = false;
                          } else {
                              enableTilt = true;
                          }
                          this._viewer.scene.screenSpaceCameraController.enableTilt = enableTilt;
                      }, Cesium__default['default'].ScreenSpaceEventType.MOUSE_MOVE);
                  },
                  this._mouseMode === MouseMode.LEFT_MIDDLE
                      ? Cesium__default['default'].ScreenSpaceEventType.MIDDLE_DOWN
                      : Cesium__default['default'].ScreenSpaceEventType.RIGHT_DOWN
              );
              handler.setInputAction(
                  movement => {
                      this._viewer.scene.screenSpaceCameraController.enableTilt = true;
                      handler.removeInputAction(Cesium__default['default'].ScreenSpaceEventType.MOUSE_MOVE);
                  },
                  this._mouseMode === MouseMode.LEFT_MIDDLE
                      ? Cesium__default['default'].ScreenSpaceEventType.MIDDLE_UP
                      : Cesium__default['default'].ScreenSpaceEventType.RIGHT_UP
              );
          }
      }

      /**
       *
       */
      limitCameraToGround() {
          this._viewer.camera.changed.addEventListener(frameState => {
              if (
                  this._viewer.camera._suspendTerrainAdjustment &&
                  this._viewer.scene.mode === Cesium__default['default'].SceneMode.SCENE3D
              ) {
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
      setBounds(west, south, east, north) { }

      /**
       *
       * @param mouseMode
       */
      changeMouseMode(mouseMode) {
          this._mouseMode = mouseMode || MouseMode.LEFT_MIDDLE;
          if (mouseMode === MouseMode.LEFT_MIDDLE) {
              this._viewer.scene.screenSpaceCameraController.tiltEventTypes = [
                  Cesium__default['default'].CameraEventType.MIDDLE_DRAG,
                  Cesium__default['default'].CameraEventType.PINCH,
                  {
                      eventType: Cesium__default['default'].CameraEventType.LEFT_DRAG,
                      modifier: Cesium__default['default'].KeyboardEventModifier.CTRL
                  },
                  {
                      eventType: Cesium__default['default'].CameraEventType.RIGHT_DRAG,
                      modifier: Cesium__default['default'].KeyboardEventModifier.CTRL
                  }
              ];
              this._viewer.scene.screenSpaceCameraController.zoomEventTypes = [
                  Cesium__default['default'].CameraEventType.RIGHT_DRAG,
                  Cesium__default['default'].CameraEventType.WHEEL,
                  Cesium__default['default'].CameraEventType.PINCH
              ];
          } else if (mouseMode === MouseMode.LEFT_RIGHT) {
              this._viewer.scene.screenSpaceCameraController.tiltEventTypes = [
                  Cesium__default['default'].CameraEventType.RIGHT_DRAG,
                  Cesium__default['default'].CameraEventType.PINCH,
                  {
                      eventType: Cesium__default['default'].CameraEventType.LEFT_DRAG,
                      modifier: Cesium__default['default'].KeyboardEventModifier.CTRL
                  },
                  {
                      eventType: Cesium__default['default'].CameraEventType.RIGHT_DRAG,
                      modifier: Cesium__default['default'].KeyboardEventModifier.CTRL
                  }
              ];
              this._viewer.scene.screenSpaceCameraController.zoomEventTypes = [
                  Cesium__default['default'].CameraEventType.WHEEL,
                  Cesium__default['default'].CameraEventType.PINCH
              ];
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
          return new Cesium$1.EllipsoidTerrainProvider(options)
      }

      /**
       * Create url terrain
       * @param options
       * @returns {module:cesium.CesiumTerrainProvider}
       */
      static createUrlTerrain(options) {
          return new Cesium$1.CesiumTerrainProvider(options)
      }

      /**
       * Create google terrain
       * @param options
       * @returns {module:cesium.GoogleEarthEnterpriseTerrainProvider}
       */
      static createGoogleTerrain(options) {
          return new Cesium$1.GoogleEarthEnterpriseTerrainProvider(options)
      }

      /**
       * Create arcgis terrain
       * @param options
       * @returns {module:cesium.ArcGISTiledElevationTerrainProvider}
       */
      static createArcgisTerrain(options) {
          return new Cesium$1.ArcGISTiledElevationTerrainProvider(options)
      }

      /**
       * Create vr terrain
       * @param options
       * @returns {module:cesium.VRTheWorldTerrainProvider}
       */
      static createVRTerrain(options) {
          return new Cesium$1.VRTheWorldTerrainProvider(options)
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
                  break
              case TerrainType.XYZ:
                  terrain = this.createUrlTerrain(options);
                  break
              case TerrainType.GOOGLE:
                  terrain = this.createGoogleTerrain(options);
                  break
              case TerrainType.ARCGIS:
                  terrain = this.createArcgisTerrain(options);
                  break
              case TerrainType.VR:
                  terrain = this.createVRTerrain(options);
                  break
          }
          return terrain
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
  class Things extends Event{

      /**
       * 
       * @param {Object} options
       */
      constructor(options) {
          super();
          this._id = options.id || Util$1.uuid(); // 对象的id标识
          this._enabled = options.enabled || true;  // 对象的启用状态
          this._viewer = undefined;
          this._state = undefined;
      }

      set enabled(enable) {
          this._enabled = enable;
      }

      

      get enabled() {
          return this._enabled
      }

      get id() {
          return this._id
      }


      get state() {
          return this._state
      }

      

      /**
       * The hook for added
       * @private
       */
      _addedHook() { }

      /**
       * The hook for removed
       * @private
       */
      _removedHook() { }

      addTo(viewer) {
          this._viewer = viewer;
          return this
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
          return this._alpha
      }

      set enabled(enabled) {
          this._enabled = enabled;
          this._viewer.scene.globe.depthTestAgainstTerrain = enabled;
          // 相机对地形的碰撞检测状态
          this._viewer.scene.screenSpaceCameraController.enableCollisionDetection = !enabled;
          this._viewer.scene.globe.translucency.enabled = enabled;
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
        return this
      }
      this._enable = enable;
      this._state = this._enable ? State$1.ENABLED : State$1.DISABLED;
      this._enableHook && this._enableHook();
      return this
    }

    get enable() {
      return this._enable
    }

    get state() {
      return this._state
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
        !this._wrapper.parentNode &&
          this._viewer.dcContainer.appendChild(this._wrapper);
        this._bindEvent();
      } else {
        this._unbindEvent();
        this._wrapper.parentNode &&
          this._viewer.dcContainer.removeChild(this._wrapper);
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
      return this
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
      return this
    }

    /**
     * hide widget
     */
    hide() {
      this._wrapper &&
        (this._wrapper.style.cssText = `
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
      return WidgetType[type.toLocaleUpperCase()] || undefined
    }
  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 13:55:23
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:18:22
   */
  const logo = `
data:image/png;base64,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
`;

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 13:55:23
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:17:44
   */
  const compass_outer = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="162px" height="162px" viewBox="0 0 162 162" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 43.2 (39069) - http://www.bohemiancoding.com/sketch -->
    <title>compass-outer</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd">
        <g id="compass-outer" fill-rule="nonzero">
            <path d="M80.8410544,161.682109 C36.1937731,161.682109 0,125.488336 0,80.8410544 C0,36.1937731 36.1937731,0 80.8410544,0 C125.488336,0 161.682109,36.1937731 161.682109,80.8410544 C161.682109,125.488336 125.488336,161.682109 80.8410544,161.682109 Z M81.1836011,134.620909 C110.696211,134.620909 134.620909,110.696211 134.620909,81.1836011 C134.620909,51.6709916 110.696211,27.7462941 81.1836011,27.7462941 C51.6709916,27.7462941 27.7462941,51.6709916 27.7462941,81.1836011 C27.7462941,110.696211 51.6709916,134.620909 81.1836011,134.620909 Z" id="Oval-108"></path>
            <circle id="Oval-74" fill="#FFFFFF" cx="129.493683" cy="127.952092" r="1.54159147"></circle>
            <circle id="Oval-74-Copy-3" fill="#FFFFFF" cx="129.493683" cy="35.4566038" r="1.54159147"></circle>
            <circle id="Oval-74-Copy-5" fill="#FFFFFF" cx="30.8318294" cy="127.952092" r="1.54159147"></circle>
            <circle id="Oval-74-Copy-4" fill="#FFFFFF" cx="30.8318294" cy="35.4566038" r="1.54159147"></circle>
            <polygon id="N" fill="#FFFFFF" points="84.9318072 23.1238721 84.9318072 13.1321362 82.5623385 13.1321362 82.5623385 19.2984646 77.951866 13.1321362 75.7108625 13.1321362 75.7108625 23.1238721 78.0946053 23.1238721 78.0946053 16.9718176 82.6908037 23.1238721"></polygon>
            <polygon id="Line" fill="#FFFFFF" points="143.368007 82.1093476 152.617555 82.1093476 152.617555 81.2993476 143.368007 81.2993476"></polygon>
            <polygon id="Line-Copy-8" fill="#FFFFFF" points="9.24954884 82.1093476 18.4990976 82.1093476 18.4990976 81.2993476 9.24954884 81.2993476"></polygon>
            <polygon id="Line" fill="#FFFFFF" points="81.2993476 143.368007 81.2993476 152.617555 82.1093476 152.617555 82.1093476 143.368007"></polygon>
        </g>
    </g>
</svg>
`;

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 13:55:23
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:17:37
   */
  const compass_inner = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="17px" height="17px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 43.2 (39069) - http://www.bohemiancoding.com/sketch -->
    <title>compass-inner</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd">
        <g id="compass-inner" fill-rule="nonzero">
            <path d="M8.5,16.5 C4.081722,16.5 0.5,12.918278 0.5,8.5 C0.5,4.081722 4.081722,0.5 8.5,0.5 C12.918278,0.5 16.5,4.081722 16.5,8.5 C16.5,12.918278 12.918278,16.5 8.5,16.5 Z M8.5,15.5 C12.3659932,15.5 15.5,12.3659932 15.5,8.5 C15.5,4.63400675 12.3659932,1.5 8.5,1.5 C4.63400675,1.5 1.5,4.63400675 1.5,8.5 C1.5,12.3659932 4.63400675,15.5 8.5,15.5 Z" id="Oval-96"></path>
            <path d="M9.92599835,7.09066832 C12.7122872,9.87695712 14.3709388,12.5452228 13.4497471,13.4664145 C12.5285555,14.3876061 9.86028979,12.7289545 7.074001,9.94266568 C4.2877122,7.15637688 2.62906055,4.48811119 3.55025221,3.56691953 C4.47144386,2.64572788 7.13970955,4.30437952 9.92599835,7.09066832 Z M9.21889157,7.7977751 C6.92836458,5.50724811 4.52075769,4.01062761 4.25735899,4.27402631 C3.99396029,4.53742501 5.49058078,6.9450319 7.78110778,9.2355589 C10.0716348,11.5260859 12.4792417,13.0227064 12.7426404,12.7593077 C13.0060391,12.495909 11.5094186,10.0883021 9.21889157,7.7977751 Z" id="Oval-96-Copy-2"></path>
            <path d="M9.92599835,9.94266568 C7.13970955,12.7289545 4.47144386,14.3876061 3.55025221,13.4664145 C2.62906055,12.5452228 4.2877122,9.87695712 7.074001,7.09066832 C9.86028979,4.30437952 12.5285555,2.64572788 13.4497471,3.56691953 C14.3709388,4.48811119 12.7122872,7.15637688 9.92599835,9.94266568 Z M9.21889157,9.2355589 C11.5094186,6.9450319 13.0060391,4.53742501 12.7426404,4.27402631 C12.4792417,4.01062761 10.0716348,5.50724811 7.78110778,7.7977751 C5.49058078,10.0883021 3.99396029,12.495909 4.25735899,12.7593077 C4.52075769,13.0227064 6.92836458,11.5260859 9.21889157,9.2355589 Z" id="Oval-96-Copy-3"></path>
            <path d="M15.1464466,1.1464466 L14.3453364,1.94755684 L13.9608692,2.33202401 L14.667976,3.03913077 L15.0524431,2.65466362 L15.8535534,1.8535534 L15.1464466,1.1464466 Z M2.29760014,13.995293 L1.85311902,14.4397742 L1.004311,15.2885822 L1.71141776,15.995689 L2.56022581,15.146881 L3.00470698,14.7023998 L2.29760014,13.995293 Z" id="Line"></path>
            <circle id="Oval-432" cx="16" cy="1" r="1"></circle>
            <circle id="Oval-432-Copy" cx="1" cy="16" r="1"></circle>
        </g>
    </g>
</svg>
`;

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 13:55:23
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:17:52
   */
  const compass_rotation_marker = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="53px" height="53px" viewBox="0 0 53 53" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    <!-- Generator: Sketch 3.4.3 (16044) - http://www.bohemiancoding.com/sketch -->
    <title>compass-rotation-marker</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="compass-rotation-marker">
            <path d="M52.4399986,26.2199993 C52.4399986,11.7390936 40.7009051,0 26.2199993,0 C11.7390936,0 0,11.7390936 0,26.2199993 C0,40.7009051 11.7390936,52.4399986 26.2199993,52.4399986 C40.7009051,52.4399986 52.4399986,40.7009051 52.4399986,26.2199993 Z" id="rotator" stroke-opacity="0.135841259" stroke="#E2A549" stroke-width="9" opacity="0.201434235"></path>
            <path d="M0,26.2199993 C0,11.7390936 11.7390936,0 26.2199993,0 L26.2199993,9 C16.7096563,9 9,16.7096563 9,26.2199993" id="Shape" opacity="0.634561567" fill="#4990E2"></path>
        </g>
    </g>
</svg>
`;

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 13:55:23
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:18:03
   */
  const decrease = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="50px" height="6px" viewBox="0 0 50 6" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    <!-- Generator: Sketch 3.4.3 (16044) - http://www.bohemiancoding.com/sketch -->
    <title>decrease</title>
    <path d="M46.6183575,0.657894737 L3.30112724,0.657894737 C1.44927539,0.657894737 0,1.66880618 0,2.96052632 C0,4.25224645 1.44927539,5.26315789 3.30112724,5.26315789 L46.6988728,5.26315789 C48.5507246,5.26315789 50,4.25224645 50,2.96052632 C49.9194847,1.66880618 48.4702093,0.657894737 46.6183575,0.657894737 L46.6183575,0.657894737 L46.6183575,0.657894737 Z" id="Shape"></path>
</svg>
`;

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 13:55:23
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:19:27
   */
  const increase = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="50px" height="50px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    <!-- Generator: Sketch 3.4.3 (16044) - http://www.bohemiancoding.com/sketch -->
    <title>increase</title>
    <path d="M0,25 C0,25.3514939 0.131810207,25.659051 0.373462207,25.900703 C0.615114207,26.142355 0.922671379,26.2741652 1.27416517,26.2741652 L23.7258348,26.2741652 L23.7258348,48.7258348 C23.7258348,49.0773286 23.857645,49.3848858 24.099297,49.6265378 C24.3189807,49.8462214 24.6485061,50 25,50 C25.7029877,50 26.2741652,49.4288225 26.2741652,48.7258348 L26.2741652,26.2741652 L48.7258348,26.2741652 C49.4288225,26.2741652 50,25.7029877 50,25 C50,24.2970123 49.4288225,23.7258348 48.7258348,23.7258348 L26.2741652,23.7258348 L26.2741652,1.27416517 C26.2741652,0.571177517 25.7029877,0 25,0 C24.2970123,0 23.7258348,0.571177517 23.7258348,1.27416517 L23.7258348,23.7258348 L1.27416517,23.7258348 C0.571177517,23.7258348 0,24.2970123 0,25 L0,25 L0,25 L0,25 Z" id="Shape"></path>
</svg>
`;

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 13:55:23
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:19:02
   */
  const refresh = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="50px" height="50px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    <!-- Generator: Sketch 3.4.3 (16044) - http://www.bohemiancoding.com/sketch -->
    <title>refresh</title>
    <path d="M48.2758621,0 C47.2844828,0 46.5086207,0.775193846 46.5086207,1.76571923 L46.5086207,12.2308355 C42.0689655,4.78036173 34.0086207,0 25,0 C11.2068965,0 0,11.1972438 0,25.0215332 C0,38.8458226 11.2068965,50 25,50 C38.7931035,50 50,38.8027562 50,25.0215332 C50,24.0310078 49.2241379,23.2558139 48.2327587,23.2558139 C47.2413793,23.2558139 46.4655172,24.0310078 46.4655172,25.0215332 C46.4655172,36.8647717 36.8103448,46.5116279 24.9568965,46.5116279 C13.1034483,46.5116279 3.49137933,36.8217054 3.49137933,24.9784668 C3.49137933,13.1352283 13.1465517,3.48837212 25,3.48837212 C33.4913793,3.48837212 41.0775862,8.44099913 44.5258621,16.0206718 L32.1551724,16.0206718 C31.1637931,16.0206718 30.3879311,16.7958657 30.3879311,17.7863911 C30.3879311,18.7769164 31.1637931,19.5521103 32.1551724,19.5521103 L48.2327587,19.5521103 C49.2241379,19.5521103 50,18.7769164 50,17.7863911 L50,1.72265288 C50,0.775193846 49.2241379,0 48.2758621,0 L48.2758621,0 L48.2758621,0 Z" id="Shape"></path>
</svg>
`;

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 13:55:23
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:18:50
   */
  const splitter = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="19px" height="28px" viewBox="0 0 19 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M0.6551724,2.3448276 L0.6551724,25.6551724 C0.6551724,26.6454761 1.4579722,27.4482759 2.4482759,27.4482759 C3.4385796,27.4482759 4.2413793,26.6454761 4.2413793,25.6551724 L4.2413793,2.3448276 C4.2413793,1.3545239 3.4385796,0.5517241 2.4482759,0.5517241 C1.4579722,0.5517241 0.6551724,1.3545239 0.6551724,2.3448276 L0.6551724,2.3448276 Z M7.6551724,2.3448276 L7.6551724,25.6551724 C7.6551724,26.6454761 8.4579722,27.4482759 9.4482759,27.4482759 C10.4385796,27.4482759 11.2413793,26.6454761 11.2413793,25.6551724 L11.2413793,2.3448276 C11.2413793,1.3545239 10.4385796,0.5517241 9.4482759,0.5517241 C8.4579722,0.5517241 7.6551724,1.3545239 7.6551724,2.3448276 L7.6551724,2.3448276 Z M14.6551724,2.3448276 L14.6551724,25.6551724 C14.6551724,26.6454761 15.4579722,27.4482759 16.4482759,27.4482759 C17.4385796,27.4482759 18.2413793,26.6454761 18.2413793,25.6551724 L18.2413793,2.3448276 C18.2413793,1.3545239 17.4385796,0.5517241 16.4482759,0.5517241 C15.4579722,0.5517241 14.6551724,1.3545239 14.6551724,2.3448276 L14.6551724,2.3448276 Z" id="splitter"></path>
</svg>
`;

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-15 13:55:23
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 14:18:12
   */

  const Icon = {
    logo,
    compass_outer,
    compass_inner,
    compass_rotation_marker,
    decrease,
    increase,
    refresh,
    splitter
  };

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-16 10:50:08
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:47:26
   */

  class Attribution extends Widget {
      constructor() {
          super();
          this._wrapper = DomUtil.create('div', 'dc-attribution');
          this._wrapper.style.cssText = `
      position: absolute;
      left: 2px;
      bottom: 2px;
      font-size: 14px;
      color: #a7a7a7;
      padding: 2px 5px;
      border-radius: 2px;
      user-select: none;
      display:flex;
    `;
          this._config = undefined;
          this.type = Widget.getWidgetType('attribution');
          this._state = State$1.INSTALLED;
      }

      _installHook() {
          let logo = DomUtil.create('img', '', this._wrapper);
          logo.src = Icon.logo;
          let a = DomUtil.create('a', '', this._wrapper);
          a.innerHTML = '数字视觉';
          a.href = 'javascript:void(0)';
          a.onclick = () => {
              window.open('https://www.dvgis.cn');
          };
          a.style.cssText = `color:#a7a7a7;font-size:14px`;
          this.enable = true;
      }
  }

  Widget.registerType('attribution');

  class ContextMenu extends Widget {
      constructor() {
          super();
          this._wrapper = DomUtil.create('div', 'dc-context-menu');
          this._ulEl = undefined;
          this._handler = undefined;
          this._overlay = undefined;
          this._position = undefined;
          this._wgs84Position = undefined;
          this._surfacePosition = undefined;
          this._wgs84SurfacePosition = undefined;
          this._windowPosition = undefined;
          this._config = {};
          this._defaultMenu = [
              {
                  label: '飞到默认位置',
                  callback: e => {
                      this._viewer.camera.flyHome(1.5);
                  },
                  context: this
              },
              {
                  label: '取消飞行',
                  callback: e => {
                      this._viewer.camera.cancelFlight();
                  },
                  context: this
              }
          ];
          this._overlayMenu = [];
          this.type = Widget.getWidgetType('contextmenu');
          this._state = State$1.INITIALIZED;
      }

      set DEFAULT_MENU(menus) {
          this._defaultMenu = menus;
          return this
      }

      set config(config) {
          this._config = config;
          config.customClass && this._setCustomClass();
          return this
      }

      /**
       *
       * @private
       */
      _installHook() {
          Object.defineProperty(this._viewer, 'contextMenu', {
              value: this,
              writable: false
          });
          this._handler = new Cesium$1.ScreenSpaceEventHandler(this._viewer.canvas);
      }

      /**
       *
       * @private
       */
      _bindEvent() {
          this._handler.setInputAction(movement => {
              this._onRightClick(movement);
          }, Cesium$1.ScreenSpaceEventType.RIGHT_CLICK);

          this._handler.setInputAction(movement => {
              this._onClick(movement);
          }, Cesium$1.ScreenSpaceEventType.LEFT_CLICK);
      }

      /**
       *
       * @private
       */
      _unbindEvent() {
          this._handler.removeInputAction(Cesium$1.ScreenSpaceEventType.RIGHT_CLICK);
          this._handler.removeInputAction(Cesium$1.ScreenSpaceEventType.LEFT_CLICK);
      }

      /**
       *
       * @private
       */
      _mountContent() {
          this._ulEl = DomUtil.create('ul', 'menu-list', this._wrapper);
          this._ready = true;
      }

      /**
       *
       * @private
       */
      _mountMenu() {
          while (this._ulEl.hasChildNodes()) {
              this._ulEl.removeChild(this._ulEl.firstChild);
          }
          // Add menu item
          if (this._overlayMenu && this._overlayMenu.length) {
              this._overlayMenu.forEach(item => {
                  this._addMenuItem(item.label, item.callback, item.context || this);
              });
          }

          if (this._defaultMenu && this._defaultMenu.length) {
              this._defaultMenu.forEach(item => {
                  this._addMenuItem(item.label, item.callback, item.context || this);
              });
          }
      }

      /**
       *
       * @param movement
       * @private
       */
      _onRightClick(movement) {
          if (!this._enable) {
              return
          }
          this._overlay = undefined;
          let scene = this._viewer.scene;
          this._windowPosition = movement.position;
          this._updateWindowCoord(movement.position);
          let target = scene.pick(movement.position);
          if (scene.pickPositionSupported) {
              this._position = scene.pickPosition(movement.position);
          }
          if (this._position) {
              let c = Cesium$1.Ellipsoid.WGS84.cartesianToCartographic(this._position);
              if (c) {
                  this._wgs84Position = {
                      lng: Cesium$1.Math.toDegrees(c.longitude),
                      lat: Cesium$1.Math.toDegrees(c.latitude),
                      alt: c.height
                  };
              }
          }
          if (scene.mode === Cesium$1.SceneMode.SCENE3D) {
              let ray = scene.camera.getPickRay(movement.position);
              this._surfacePosition = scene.globe.pick(ray, scene);
          } else {
              this._surfacePosition = scene.camera.pickEllipsoid(
                  movement.position,
                  Cesium$1.Ellipsoid.WGS84
              );
          }

          if (this._surfacePosition) {
              let c = Cesium$1.Ellipsoid.WGS84.cartesianToCartographic(
                  this._surfacePosition
              );
              if (c) {
                  this._wgs84SurfacePosition = {
                      lng: Cesium$1.Math.toDegrees(c.longitude),
                      lat: Cesium$1.Math.toDegrees(c.latitude),
                      alt: c.height
                  };
              }
          }
          // for Entity
          if (target && target.id && target.id instanceof Cesium$1.Entity) {
              let layer = this._viewer
                  .getLayers()
                  .filter(item => item.layerId === target.id.layerId)[0];
              if (layer && layer.getOverlay) {
                  this._overlay = layer.getOverlay(target.id.overlayId);
              }
          }
          // for Cesium3DTileFeature
          if (target && target instanceof Cesium$1.Cesium3DTileFeature) {
              let layer = this._viewer
                  .getLayers()
                  .filter(item => item.layerId === target.tileset.layerId)[0];
              if (layer && layer.getOverlay) {
                  this._overlay = layer.getOverlay(target.tileset.overlayId);
              }
          }
          this._overlayMenu = this._overlay?.contextMenu || [];
          this._mountMenu();
      }
      /**
       *
       * @param movement
       * @private
       */
      _onClick(movement) {
          this.hide();
      }

      /**
       *
       * @param windowCoord
       * @private
       */
      _updateWindowCoord(windowCoord) {
          this._wrapper.style.cssText = `
    visibility:visible;
    z-index:1;
    transform:translate3d(${Math.round(windowCoord.x)}px,${Math.round(
            windowCoord.y
        )}px, 0);
    `;
      }

      /**
       *
       * @private
       */
      _setCustomClass() {
          DomUtil.setClass(
              this._wrapper,
              `dc-context-menu ${this._config.customClass}`
          );
      }

      /**
       *
       * @param label
       * @param method
       * @param context
       * @returns {ContextMenu}
       * @private
       */
      _addMenuItem(label, method, context) {
          if (!label || !method) {
              return this
          }
          let menu = DomUtil.create('li', 'menu-item', null);
          let a = DomUtil.create('a', '', menu);
          a.innerHTML = label;
          a.href = 'javascript:void(0)';
          let self = this;
          if (method) {
              a.onclick = () => {
                  method.call(context, {
                      windowPosition: self._windowPosition,
                      position: self._position,
                      wgs84Position: self._wgs84Position,
                      surfacePosition: self._surfacePosition,
                      wgs84SurfacePosition: self._wgs84SurfacePosition,
                      overlay: self._overlay
                  });
                  self.hide();
              };
          }
          this._ulEl.appendChild(menu);
          return this
      }
  }

  Widget.registerType('contextmenu');

  class LocationBar extends Widget {
      constructor() {
          super();
          this._wrapper = DomUtil.create('div', 'dc-location-bar');
          this._mouseEl = undefined;
          this._cameraEl = undefined;
          this.type = Widget.getWidgetType('location_bar');
          this._state = State$1.INITIALIZED;
          this._lastUpdate = Cesium$1.getTimestamp();
      }

      /**
       *
       * @private
       */
      _installHook() {
          Object.defineProperty(this._viewer, 'locationBar', {
              value: this,
              writable: false
          });
      }

      /**
       *
       * @private
       */
      _bindEvent() {
          this._viewer.on(MouseEventType.MOUSE_MOVE, this._moveHandler, this);
          this._viewer.on(SceneEventType.CAMERA_CHANGED, this._cameraHandler, this);
      }

      /**
       *
       * @private
       */
      _unbindEvent() {
          this._viewer.off(MouseEventType.MOUSE_MOVE, this._moveHandler, this);
          this._viewer.off(SceneEventType.CAMERA_CHANGED, this._cameraHandler, this);
      }

      /**
       *
       * @private
       */
      _mountContent() {
          this._mouseEl = DomUtil.create('div', 'mouse-location', this._wrapper);
          this._cameraEl = DomUtil.create('div', 'camera-location', this._wrapper);
          this._ready = true;
      }

      /**
       *
       * @param e
       * @private
       */
      _moveHandler(e) {
          let now = Cesium$1.getTimestamp();
          if (now < this._lastUpdate + 300) {
              return
          }
          this._lastUpdate = now;
          let ellipsoid = Cesium$1.Ellipsoid.WGS84;
          let cartographic = e.surfacePosition
              ? ellipsoid.cartesianToCartographic(e.surfacePosition)
              : undefined;
          let lng = +Cesium$1.Math.toDegrees(cartographic?.longitude || 0);
          let lat = +Cesium$1.Math.toDegrees(cartographic?.latitude || 0);
          let alt = cartographic
              ? +this._viewer.scene.globe.getHeight(cartographic)
              : 0;
          this._mouseEl.innerHTML = `
      <span>经度：${lng.toFixed(8)}</span>
      <span>纬度：${lat.toFixed(8)}</span>
      <span>海拔：${alt.toFixed(2)} 米</span>`;
      }

      /**
       *
       * @private
       */
      _cameraHandler() {
          let now = Cesium$1.getTimestamp();
          if (now < this._lastUpdate + 300) {
              return
          }
          this._lastUpdate = now;
          let cameraPosition = this._viewer.cameraPosition;
          this._cameraEl.innerHTML = `
      <span>视角：${(+cameraPosition.pitch).toFixed(2)}</span>
      <span>视高：${(+cameraPosition.alt).toFixed(2)} 米</span>
    `;
      }
  }

  Widget.registerType('location_bar');

  class MapSplit extends Widget {
      constructor() {
          super();
          this._wrapper = DomUtil.create('div', 'dc-slider');
          this._baseLayer = undefined;
          this._moveActive = false;
          this.type = Widget.getWidgetType('map_split');
          this._state = State$1.INITIALIZED;
      }

      /**
       *
       * @private
       */
      _installHook() {
          Object.defineProperty(this._viewer, 'mapSplit', {
              value: this,
              writable: false
          });
      }

      /**
       *
       * @private
       */
      _bindEvent() {
          this._viewer.scene.imagerySplitPosition = 0.5;
          this._wrapper.style.left = '50%';
      }

      /**
       *
       * @private
       */
      _unbindEvent() {
          if (this._baseLayer) {
              this._viewer.scene.imagerySplitPosition =
                  this._baseLayer.splitDirection > 0 ? 1 : 0;
          } else {
              this._viewer.scene.imagerySplitPosition = 0;
          }
      }

      /**
       *
       * @private
       */
      _mountContent() {
          let splitter = DomUtil.parseDom(Icon.splitter, true, 'splitter');
          this._wrapper.appendChild(splitter);
          let handler = new Cesium$1.ScreenSpaceEventHandler(splitter);
          let self = this;
          handler.setInputAction(() => {
              self._moveActive = true;
          }, Cesium$1.ScreenSpaceEventType.LEFT_DOWN);
          handler.setInputAction(() => {
              self._moveActive = true;
          }, Cesium$1.ScreenSpaceEventType.PINCH_START);

          handler.setInputAction(movement => {
              self._moveHandler(movement);
          }, Cesium$1.ScreenSpaceEventType.MOUSE_MOVE);

          handler.setInputAction(movement => {
              self._moveHandler(movement);
          }, Cesium$1.ScreenSpaceEventType.PINCH_MOVE);

          handler.setInputAction(() => {
              self._moveActive = false;
          }, Cesium$1.ScreenSpaceEventType.LEFT_UP);
          handler.setInputAction(() => {
              self._moveActive = false;
          }, Cesium$1.ScreenSpaceEventType.PINCH_END);
          this._ready = true;
      }

      /**
       *
       * @param movement
       * @private
       */
      _moveHandler(movement) {
          if (!this._moveActive || !this._enable) {
              return
          }
          let relativeOffset = movement.endPosition.x;
          let splitPosition =
              (this._wrapper.offsetLeft + relativeOffset) /
              this._wrapper.parentElement.offsetWidth;
          this._wrapper.style.left = 100.0 * splitPosition + '%';
          this._viewer.scene.imagerySplitPosition = splitPosition;
      }

      /**
       *
       * @param baseLayer
       * @param splitDirection
       * @returns {MapSplit}
       */
      addBaseLayer(baseLayer, splitDirection = 1) {
          if (!this._viewer || !this._enable) {
              return this
          }
          if (baseLayer) {
              this._baseLayer && this._viewer.imageryLayers.remove(this._baseLayer);
              this._baseLayer = this._viewer.imageryLayers.addImageryProvider(baseLayer);
              this._baseLayer.splitDirection = splitDirection || 0;
              this._viewer.scene.imagerySplitPosition =
                  this._wrapper.offsetLeft / this._wrapper.parentElement.offsetWidth;
          }
          return this
      }
  }

  Widget.registerType('map_split');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-16 10:50:09
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:48:25
   */

  class MapSwitch extends Widget {
      constructor() {
          super();
          this._wrapper = DomUtil.create('div', 'dc-map-switch');
          this._config = undefined;
          this._cache = [];
          this.type = Widget.getWidgetType('map_switch');
          this._state = State$1.INITIALIZED;
      }

      /**
       * Override the superclass function
       * @private
       */
      _enableHook() {
          !this._wrapper.parentNode &&
              this._viewer &&
              this._viewer.dcContainer.appendChild(this._wrapper);
      }

      /**
       *
       * @private
       */
      _installHook() {
          Object.defineProperty(this._viewer, 'mapSwitch', {
              value: this,
              writable: false
          });
          this.enable = true;
          let self = this;
          this._wrapper.onmouseover = () => {
              let width = 80;
              if (self._cache.length > 0) {
                  width = self._cache.length * 85;
              }
              this._wrapper.style.width = `${width}px`;
          };
          this._wrapper.onmouseout = () => {
              self._wrapper.style.width = `80px`;
          };
      }

      _addItem(map) {
          let mapEl = DomUtil.create('div', 'map-item', this._wrapper);
          let index = this._cache.length ? this._cache.length - 1 : 0;
          index === 0 && DomUtil.addClass(mapEl, 'active');
          mapEl.setAttribute('data-index', String(index));
          mapEl.onclick = e => {
              let old = document.getElementsByClassName('map-item active');
              if (old && old.length) {
                  old[0].className = 'map-item';
              }
              if (this._viewer) {
                  e.target.className = 'map-item active';
                  this._viewer.changeBaseLayer(+e.target.getAttribute('data-index') || 0);
              }
          };
          if (map.iconUrl) {
              mapEl.style.cssText = `
       background:url(${map.iconUrl});
    `;
          }
          let span = DomUtil.create('span', '', mapEl);
          span.innerHTML = map.name || '地图';
      }

      /**
       * add map
       * @param map
       */
      addMap(map = {}) {
          if (this._enable) {
              this._cache.push(map);
              this._addItem(map);
              if (this._cache.length > 1) {
                  this._wrapper.style.visibility = 'visible';
              }
          }
      }
  }

  Widget.registerType('map_switch');

  class Popup extends Widget {
      constructor() {
          super();
          this._wrapper = DomUtil.create('div', 'dc-popup');
          this._config = { customClass: '' };
          this._position = undefined;
          this.type = Widget.getWidgetType('popup');
          this._state = State$1.INITIALIZED;
      }

      set config(config) {
          this._config = config;
          config.customClass && this._setCustomClass();
      }

      /**
       * binds event
       * @private
       */
      _bindEvent() {
          if (this._viewer && this._wrapper) {
              let self = this;
              let scene = this._viewer.scene;
              scene.postRender.addEventListener(() => {
                  if (
                      self._position &&
                      self._enable &&
                      self._updateWindowCoord &&
                      self._wrapper.style.visibility === 'visible'
                  ) {
                      let windowCoord = Cesium$1.SceneTransforms.wgs84ToWindowCoordinates(
                          scene,
                          self._position
                      );
                      windowCoord && self._updateWindowCoord(windowCoord);
                  }
              });
          }
      }

      /**
       *
       * @private
       */
      _mountContent() {
          this._wrapper.style.visibility = 'hidden';
      }

      /**
       *
       * @private
       */
      _installHook() {
          this.enable = true;
          this._bindEvent();
          Object.defineProperty(this._viewer, 'popup', {
              value: this,
              writable: false
          });
      }

      /**
       *
       * @param windowCoord
       * @private
       */
      _updateWindowCoord(windowCoord) {
          let x = windowCoord.x - this._wrapper.offsetWidth / 2;
          let y = windowCoord.y - this._wrapper.offsetHeight;
          if (this._config && this._config.position === 'left') {
              x = windowCoord.x - this._wrapper.offsetWidth;
          } else if (this._config && this._config.position === 'right') {
              x = windowCoord.x;
          }
          this._wrapper.style.cssText = `
    visibility:visible;
    z-index:1;
    transform:translate3d(${Math.round(x)}px,${Math.round(y)}px, 0);
    `;
      }

      /**
       *
       * @private
       */
      _setCustomClass() {
          DomUtil.setClass(this._wrapper, `dc-popup ${this._config.customClass}`);
      }

      /**
       * Setting  wrapper
       * @param wrapper
       * @returns {Widget}
       */
      setWrapper(wrapper) {
          if (wrapper && wrapper instanceof Element) {
              this._wrapper = wrapper;
              DomUtil.addClass(this._wrapper, 'dc-popup');
          }
          return this
      }

      /**
       *
       * Setting widget position
       * @param {*} position
       *
       */
      setPosition(position) {
          this._position = position;
          this._wrapper &&
              (this._wrapper.style.cssText = `
    visibility:visible;
    `);
          return this
      }

      /**
       *
       * @param {*} position
       * @param {*} content
       */
      showAt(position, content) {
          this.setPosition(position).setContent(content);
          return this
      }
  }

  Widget.registerType('popup');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-16 10:50:09
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 13:48:41
   */

  class Tooltip extends Widget {
    constructor() {
      super();
      this._wrapper = DomUtil.create('div', 'dc-tool-tip');
      this._ready = true;
      this.type = Widget.getWidgetType('tooltip');
      this._state = State$1.INITIALIZED;
    }

    /**
     *
     * @private
     */
    _installHook() {
      Object.defineProperty(this._viewer, 'tooltip', {
        value: this,
        writable: false
      });
    }

    /**
     *
     * @param {*} windowCoord
     *
     */
    _updateWindowCoord(windowCoord) {
      let x = windowCoord.x + 10;
      let y = windowCoord.y - this._wrapper.offsetHeight / 2;
      this._wrapper.style.cssText = `
    visibility:visible;
    z-index:1;
    transform:translate3d(${Math.round(x)}px,${Math.round(y)}px, 0);
    `;
    }

    /**
     *
     * @param {*} position
     * @param {*} content
     *
     */
    showAt(position, content) {
      if (!this._enable) {
        return this
      }

      position && this._updateWindowCoord(position);
      this.setContent(content);
      return this
    }
  }

  Widget.registerType('tooltip');

  const DEF_OPTS$1 = {
      animation: false,
      baseLayerPicker: false,
      imageryProvider: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      creditContainer: undefined
  };

  class HawkeyeMap extends Widget {
      constructor() {
          super();
          this._wrapper = DomUtil.create('div', 'dc-hawkeye-map', null);
          this._wrapper.setAttribute('id', Util$1.uuid());
          this._baseLayers = [];
          this._map = undefined;
          this.type = Widget.getWidgetType('hawkeye_map');
          this._state = State$1.INITIALIZED;
      }

      get baseLayers() {
          return this._baseLayers
      }

      /**
       *
       * @private
       */
      _mountContent() {
          let map = new Cesium$1.Viewer(this._wrapper, {
              ...DEF_OPTS$1,
              sceneMode: Cesium$1.SceneMode.SCENE2D
          });
          map.imageryLayers.removeAll();
          map.cesiumWidget.creditContainer.style.display = 'none';
          map.cesiumWidget.screenSpaceEventHandler.removeInputAction(
              Cesium$1.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
          );
          map.scene.backgroundColor = Cesium$1.Color.TRANSPARENT;
          Util$1.merge(map.scene.screenSpaceCameraController, {
              enableRotate: false,
              enableTranslate: false,
              enableZoom: false,
              enableTilt: false,
              enableLook: false,
              maximumZoomDistance: 40489014.0
          });
          this._map = map;

          this._ready = true;
      }

      /**
       *
       * @private
       */
      _bindEvent() {
          this._viewer.on(SceneEventType.CAMERA_CHANGED, this._syncMap, this);
      }

      /**
       *
       * @private
       */
      _unbindEvent() {
          this._viewer.off(SceneEventType.CAMERA_CHANGED, this._syncMap, this);
      }

      /**
       *
       * @private
       */
      _installHook() {
          Object.defineProperty(this._viewer, 'hawkeyeMap', {
              value: this,
              writable: false
          });
          this._viewer.camera.percentageChanged = 0.01;
      }

      /**
       *
       * @returns {boolean}
       * @private
       */
      _syncMap() {
          let viewCenter = new Cesium$1.Cartesian2(
              Math.floor(this._viewer.canvas.clientWidth / 2),
              Math.floor(this._viewer.canvas.clientHeight / 2)
          );
          let worldPosition = this._viewer.scene.camera.pickEllipsoid(viewCenter);
          if (!worldPosition) {
              return false
          }
          let distance = Cesium$1.Cartesian3.distance(
              worldPosition,
              this._viewer.scene.camera.positionWC
          );
          this._map.scene.camera.lookAt(
              worldPosition,
              new Cesium$1.Cartesian3(0.0, 0.0, distance)
          );
      }

      /**
       *
       * @param baseLayer
       * @returns {HawkeyeMap}
       */
      addBaseLayer(baseLayer) {
          if (!this._map || !this._enable) {
              return this
          }
          if (baseLayer) {
              if (this._baseLayers && this._baseLayers.length) {
                  this._map.imageryLayers.removeAll();
              }
              if (!Array.isArray(baseLayer)) {
                  baseLayer = [baseLayer];
              }
              baseLayer.forEach(item => {
                  this._baseLayers.push(this._map.imageryLayers.addImageryProvider(item));
              });
          }
          return this
      }
  }

  Widget.registerType('hawkeye_map');

  class Compass extends Widget {
      constructor() {
          super();
          this._wrapper = DomUtil.create('div', `dc-compass`);
          this._compassRectangle = undefined;
          this._outRing = undefined;
          this._gyro = undefined;
          this._rotation_marker = undefined;
          this._orbitCursorAngle = 0;
          this._orbitCursorOpacity = 0.0;
          this._orbitLastTimestamp = 0;
          this._orbitFrame = undefined;
          this._orbitIsLook = false;
          this._rotateInitialCursorAngle = undefined;
          this._rotateFrame = undefined;
          this._mouseMoveHandle = undefined;
          this._mouseUpHandle = undefined;
          this.type = Widget.getWidgetType('compass');
          this._state = State$1.INITIALIZED;
      }

      /**
       *
       * @private
       */
      _installHook() {
          Object.defineProperty(this._viewer, 'compass', {
              value: this,
              writable: false
          });
          this._wrapper.onmousedown = e => {
              this._handleMouseDown(e);
          };
          this._wrapper.ondblclick = e => {
              this._handleDoubleClick(e);
          };
      }

      /**
       *
       * @private
       */
      _bindEvent() {
          this._viewer.on(SceneEventType.POST_RENDER, this._postRenderHandler, this);
      }

      /**
       *
       * @private
       */
      _unbindEvent() {
          this._viewer.off(SceneEventType.POST_RENDER, this._postRenderHandler, this);
      }

      /**
       *
       * @private
       */
      _postRenderHandler() {
          let heading = this._viewer.camera.heading;
          this._outRing &&
              (this._outRing.style.cssText = `
      transform : rotate(-${heading}rad);
      -webkit-transform : rotate(-${heading}rad);
      `);
      }

      /**
       *
       * @private
       */
      _mountContent() {
          DomUtil.create('div', 'out-ring-bg', this._wrapper);
          this._outRing = DomUtil.parseDom(Icon.compass_outer, true, 'out-ring');
          this._wrapper.appendChild(this._outRing);
          this._gyro = DomUtil.parseDom(Icon.compass_inner, true, 'gyro');
          this._wrapper.appendChild(this._gyro);
          this._rotation_marker = DomUtil.parseDom(
              Icon.compass_rotation_marker,
              true,
              'rotation_marker'
          );
          this._wrapper.appendChild(this._rotation_marker);
          this._rotation_marker.style.visibility = 'hidden';
          this._ready = true;
      }

      _handleMouseDown(e) {
          let scene = this._viewer.scene;
          if (scene.mode === Cesium$1.SceneMode.MORPHING) {
              return true
          }
          this._compassRectangle = e.currentTarget.getBoundingClientRect();
          let maxDistance = this._compassRectangle.width / 2.0;
          let vector = this._getVector(e);
          let distanceFraction = Cesium$1.Cartesian2.magnitude(vector) / maxDistance;
          if (distanceFraction < 50 / 145) {
              this._orbit(vector);
          } else if (distanceFraction < 1.0) {
              this._rotate(vector);
          } else {
              return true
          }
      }

      _handleDoubleClick(event) {
          let scene = this._viewer.scene;
          let camera = scene.camera;
          let sscc = scene.screenSpaceCameraController;
          if (scene.mode === Cesium$1.SceneMode.MORPHING || !sscc.enableInputs) {
              return true
          }
          if (
              scene.mode === Cesium$1.SceneMode.COLUMBUS_VIEW &&
              !sscc.enableTranslate
          ) {
              return
          }
          if (
              scene.mode === Cesium$1.SceneMode.SCENE3D ||
              scene.mode === Cesium$1.SceneMode.COLUMBUS_VIEW
          ) {
              if (!sscc.enableLook) {
                  return
              }
              if (scene.mode === Cesium$1.SceneMode.SCENE3D) {
                  if (!sscc.enableRotate) {
                      return
                  }
              }
          }
          let center = this._getCameraFocus(true);
          if (!center) {
              return
          }
          let cameraPosition = scene.globe.ellipsoid.cartographicToCartesian(
              camera.positionCartographic
          );
          let surfaceNormal = scene.globe.ellipsoid.geodeticSurfaceNormal(center);
          let focusBoundingSphere = new Cesium$1.BoundingSphere(center, 0);
          camera.flyToBoundingSphere(focusBoundingSphere, {
              offset: new Cesium$1.HeadingPitchRange(
                  0,
                  Cesium$1.Math.PI_OVER_TWO -
                  Cesium$1.Cartesian3.angleBetween(surfaceNormal, camera.directionWC),
                  Cesium$1.Cartesian3.distance(cameraPosition, center)
              ),
              duration: 1.5
          });
      }

      _getCameraFocus(inWorldCoordinates) {
          let result = new Cesium$1.Cartesian3();
          let scene = this._viewer.scene;
          let camera = scene.camera;
          if (scene.mode === Cesium$1.SceneMode.MORPHING) {
              return undefined
          }
          if (this._viewer.delegate.trackedEntity) {
              result = this._viewer.delegate.trackedEntity.position.getValue(
                  this._viewer.clock.currentTime
              );
          } else {
              let rayScratch = new Cesium$1.Ray();
              rayScratch.origin = camera.positionWC;
              rayScratch.direction = camera.directionWC;
              result = scene.globe.pick(rayScratch, scene);
          }
          if (!result) {
              return undefined
          }
          if (
              scene.mode === Cesium$1.SceneMode.SCENE2D ||
              scene.mode === Cesium$1.SceneMode.COLUMBUS_VIEW
          ) {
              result = camera.worldToCameraCoordinatesPoint(result);
              let unprojectedScratch = new Cesium$1.Cartographic();
              if (inWorldCoordinates) {
                  result = scene.globe.ellipsoid.cartographicToCartesian(
                      scene.mapProjection.unproject(result, unprojectedScratch)
                  );
              }
          } else {
              if (!inWorldCoordinates) {
                  result = camera.worldToCameraCoordinatesPoint(result);
              }
          }
          return result
      }

      _orbit(vector) {
          let scene = this._viewer.scene;
          let sscc = scene.screenSpaceCameraController;
          let camera = scene.camera;
          if (scene.mode === Cesium$1.SceneMode.MORPHING || !sscc.enableInputs) {
              return
          }
          switch (scene.mode) {
              case Cesium$1.SceneMode.COLUMBUS_VIEW:
                  if (sscc.enableLook) {
                      break
                  }
                  if (!sscc.enableTranslate || !sscc.enableTilt) {
                      return
                  }
                  break
              case Cesium$1.SceneMode.SCENE3D:
                  if (sscc.enableLook) {
                      break
                  }
                  if (!sscc.enableTilt || !sscc.enableRotate) {
                      return
                  }
                  break
              case Cesium$1.SceneMode.SCENE2D:
                  if (!sscc.enableTranslate) {
                      return
                  }
                  break
          }

          this._mouseMoveHandle = e => {
              this._orbitMouseMoveFunction(e);
          };
          this._mouseUpHandle = () => {
              this._orbitMouseUpFunction();
          };

          document.removeEventListener('mousemove', this._mouseMoveHandle, false);
          document.removeEventListener('mouseup', this._mouseUpHandle, false);

          this._orbitLastTimestamp = Cesium$1.getTimestamp();

          if (this._viewer.delegate.trackedEntity) {
              this._orbitFrame = undefined;
              this._orbitIsLook = false;
          } else {
              let center = this._getCameraFocus(true);

              if (!center) {
                  this._orbitFrame = Cesium$1.Transforms.eastNorthUpToFixedFrame(
                      camera.positionWC,
                      scene.globe.ellipsoid
                  );
                  this._orbitIsLook = true;
              } else {
                  this._orbitFrame = Cesium$1.Transforms.eastNorthUpToFixedFrame(
                      center,
                      scene.globe.ellipsoid
                  );
                  this._orbitIsLook = false;
              }
          }

          this._rotation_marker.style.visibility = 'visible';
          this._gyro.className += ' gyro-active';
          document.addEventListener('mousemove', this._mouseMoveHandle, false);
          document.addEventListener('mouseup', this._mouseUpHandle, false);
          this._viewer.clock.onTick.addEventListener(this._orbitTickFunction, this);
          this._updateAngleAndOpacity(vector, this._compassRectangle.width);
      }

      _orbitTickFunction(e) {
          let scene = this._viewer.scene;
          let camera = this._viewer.camera;
          let timestamp = Cesium$1.getTimestamp();
          let deltaT = timestamp - this._orbitLastTimestamp;
          let rate = ((this._orbitCursorOpacity - 0.5) * 2.5) / 1000;
          let distance = deltaT * rate;
          let angle = this._orbitCursorAngle + Cesium$1.Math.PI_OVER_TWO;
          let x = Math.cos(angle) * distance;
          let y = Math.sin(angle) * distance;
          let oldTransform;

          if (this._orbitFrame) {
              oldTransform = Cesium$1.Matrix4.clone(camera.transform);
              camera.lookAtTransform(this._orbitFrame);
          }

          if (scene.mode === Cesium$1.SceneMode.SCENE2D) {
              camera.move(
                  new Cesium$1.Cartesian3(x, y, 0),
                  (Math.max(scene.canvas.clientWidth, scene.canvas.clientHeight) / 100) *
                  camera.positionCartographic.height *
                  distance
              );
          } else {
              if (this._orbitIsLook) {
                  camera.look(Cesium$1.Cartesian3.UNIT_Z, -x);
                  camera.look(camera.right, -y);
              } else {
                  camera.rotateLeft(x);
                  camera.rotateUp(y);
              }
          }
          if (this._orbitFrame && oldTransform) {
              camera.lookAtTransform(oldTransform);
          }
          this._orbitLastTimestamp = timestamp;
      }

      _updateAngleAndOpacity(vector, compassWidth) {
          let angle = Math.atan2(-vector.y, vector.x);
          this._orbitCursorAngle = Cesium$1.Math.zeroToTwoPi(
              angle - Cesium$1.Math.PI_OVER_TWO
          );
          let distance = Cesium$1.Cartesian2.magnitude(vector);
          let maxDistance = compassWidth / 2.0;
          let distanceFraction = Math.min(distance / maxDistance, 1.0);
          this._orbitCursorOpacity = 0.5 * distanceFraction * distanceFraction + 0.5;
          this._rotation_marker.style.cssText = `
      transform: rotate(-${this._orbitCursorAngle}rad);
      opacity: ${this._orbitCursorOpacity}`;
      }

      _orbitMouseMoveFunction(e) {
          this._updateAngleAndOpacity(
              this._getVector(e),
              this._compassRectangle.width
          );
      }

      _orbitMouseUpFunction() {
          document.removeEventListener('mousemove', this._mouseMoveHandle, false);
          document.removeEventListener('mouseup', this._mouseUpHandle, false);
          this._viewer.clock.onTick.removeEventListener(this._orbitTickFunction, this);
          this._mouseMoveHandle = undefined;
          this._mouseUpHandle = undefined;
          this._rotation_marker.style.visibility = 'hidden';
          this._gyro.className = this._gyro.className.replace(' gyro-active', '');
      }

      _rotate(vector) {
          let scene = this._viewer.scene;
          let camera = scene.camera;
          let sscc = scene.screenSpaceCameraController;
          if (
              scene.mode === Cesium$1.SceneMode.MORPHING ||
              scene.mode === Cesium$1.SceneMode.SCENE2D ||
              !sscc.enableInputs
          ) {
              return
          }
          if (
              !sscc.enableLook &&
              (scene.mode === Cesium$1.SceneMode.COLUMBUS_VIEW ||
                  (scene.mode === Cesium$1.SceneMode.SCENE3D && !sscc.enableRotate))
          ) {
              return
          }
          this._mouseMoveHandle = e => {
              this._rotateMouseMoveFunction(e);
          };
          this._mouseUpHandle = () => {
              this._rotateMouseUpFunction();
          };
          document.removeEventListener('mousemove', this._mouseMoveHandle, false);
          document.removeEventListener('mouseup', this._mouseUpHandle, false);
          this._rotateInitialCursorAngle = Math.atan2(-vector.y, vector.x);
          if (this._viewer.delegate.trackedEntity) {
              this._rotateFrame = undefined;
          } else {
              let center = this._getCameraFocus(true);
              if (
                  !center ||
                  (scene.mode === Cesium$1.SceneMode.COLUMBUS_VIEW &&
                      !sscc.enableLook &&
                      !sscc.enableTranslate)
              ) {
                  this._rotateFrame = Cesium$1.Transforms.eastNorthUpToFixedFrame(
                      camera.positionWC,
                      scene.globe.ellipsoid
                  );
              } else {
                  this._rotateFrame = Cesium$1.Transforms.eastNorthUpToFixedFrame(
                      center,
                      scene.globe.ellipsoid
                  );
              }
          }
          let oldTransform;
          if (this._rotateFrame) {
              oldTransform = Cesium$1.Matrix4.clone(camera.transform);
              camera.lookAtTransform(this._rotateFrame);
          }
          this._rotateInitialCameraAngle = -camera.heading;
          if (this._rotateFrame && oldTransform) {
              camera.lookAtTransform(oldTransform);
          }
          document.addEventListener('mousemove', this._mouseMoveHandle, false);
          document.addEventListener('mouseup', this._mouseUpHandle, false);
      }

      _rotateMouseMoveFunction(e) {
          let camera = this._viewer.camera;
          let vector = this._getVector(e);
          let angle = Math.atan2(-vector.y, vector.x);
          let angleDifference = angle - this._rotateInitialCursorAngle;
          let newCameraAngle = Cesium$1.Math.zeroToTwoPi(
              this._rotateInitialCameraAngle - angleDifference
          );
          let oldTransform;
          if (this._rotateFrame) {
              oldTransform = Cesium$1.Matrix4.clone(camera.transform);
              camera.lookAtTransform(this._rotateFrame);
          }
          let currentCameraAngle = -camera.heading;
          camera.rotateRight(newCameraAngle - currentCameraAngle);
          if (this._rotateFrame && oldTransform) {
              camera.lookAtTransform(oldTransform);
          }
      }

      _rotateMouseUpFunction() {
          document.removeEventListener('mousemove', this._mouseMoveHandle, false);
          document.removeEventListener('mouseup', this._mouseUpHandle, false);
          this._mouseMoveHandle = undefined;
          this._mouseUpHandle = undefined;
      }

      _getVector(e) {
          let compassRectangle = this._compassRectangle;
          let center = new Cesium$1.Cartesian2(
              (compassRectangle.right - compassRectangle.left) / 2.0,
              (compassRectangle.bottom - compassRectangle.top) / 2.0
          );
          let clickLocation = new Cesium$1.Cartesian2(
              e.clientX - compassRectangle.left,
              e.clientY - compassRectangle.top
          );
          let vector = new Cesium$1.Cartesian2();
          Cesium$1.Cartesian2.subtract(clickLocation, center, vector);
          return vector
      }
  }

  Widget.registerType('compass');

  const geodesic = new Cesium$1.EllipsoidGeodesic();

  const BASE = [1, 2, 3, 5];

  const DIS = [
    ...BASE,
    ...BASE.map(item => item * 10),
    ...BASE.map(item => item * 100),
    ...BASE.map(item => item * 1000),
    ...BASE.map(item => item * 10000),
    ...BASE.map(item => item * 100000),
    ...BASE.map(item => item * 1000000)
  ];

  class DistanceLegend extends Widget {
    constructor() {
      super();
      this._wrapper = DomUtil.create('div', 'dc-distance-legend');
      this._labelEl = undefined;
      this._scaleBarEl = undefined;
      this._lastUpdate = Cesium$1.getTimestamp();
      this.type = Widget.getWidgetType('distance_legend');
      this._state = State$1.INITIALIZED;
    }

    /**
     *
     * @private
     */
    _installHook() {
      Object.defineProperty(this._viewer, 'distanceLegend', {
        value: this,
        writable: false
      });
    }

    /**
     *
     * @private
     */
    _bindEvent() {
      this._viewer.on(SceneEventType.POST_RENDER, this._updateContent, this);
    }

    /**
     *
     * @private
     */
    _unbindEvent() {
      this._viewer.off(SceneEventType.POST_RENDER, this._updateContent, this);
    }

    /**
     *
     * @param scene
     * @param time
     * @returns
     * @private
     */
    _updateContent(scene, time) {
      let now = Cesium$1.getTimestamp();
      if (now < this._lastUpdate + 250) {
        return
      }
      if (!this._labelEl || !this._scaleBarEl) {
        return
      }
      this._lastUpdate = now;
      let width = scene.canvas.width;
      let height = scene.canvas.height;
      let left = scene.camera.getPickRay(
        new Cesium$1.Cartesian2((width / 2) | 0, height - 1)
      );
      let right = scene.camera.getPickRay(
        new Cesium$1.Cartesian2((1 + width / 2) | 0, height - 1)
      );
      let leftPosition = scene.globe.pick(left, scene);
      let rightPosition = scene.globe.pick(right, scene);
      if (!leftPosition || !rightPosition) {
        return
      }
      geodesic.setEndPoints(
        scene.globe.ellipsoid.cartesianToCartographic(leftPosition),
        scene.globe.ellipsoid.cartesianToCartographic(rightPosition)
      );
      let pixelDistance = geodesic.surfaceDistance;
      let maxBarWidth = 100;
      let distance = 0;
      for (let i = DIS.length - 1; i >= 0; --i) {
        if (DIS[i] / pixelDistance < maxBarWidth) {
          distance = DIS[i];
          break
        }
      }
      if (distance) {
        this._wrapper.style.visibility = 'visible';
        this._labelEl.innerHTML =
          distance >= 1000 ? `${distance / 1000} km` : `${distance} m`;
        let barWidth = (distance / pixelDistance) | 0;
        this._scaleBarEl.style.cssText = `width: ${barWidth}px; left: ${(125 -
        barWidth) /
        2}px;`;
      }
    }

    /**
     *
     * @private
     */
    _mountContent() {
      this._labelEl = DomUtil.create('div', 'label', this._wrapper);
      this._scaleBarEl = DomUtil.create('div', 'scale-bar', this._wrapper);
      this._wrapper.style.visibility = 'hidden';
      this._ready = true;
    }
  }

  Widget.registerType('distance_legend');

  class ZoomController extends Widget {
      constructor() {
          super();
          this._wrapper = DomUtil.create('div', 'dc-zoom-controller');
          this._zoomInEl = undefined;
          this._zoomOutEl = undefined;
          this._refreshEl = undefined;
          this.type = Widget.getWidgetType('zoom_controller');
          this._state = State$1.INITIALIZED;
      }

      /**
       *
       * @param scene
       * @returns {Cartesian3}
       * @private
       */
      _getCameraFocus(scene) {
          const ray = new Cesium$1.Ray(
              scene.camera.positionWC,
              scene.camera.directionWC
          );
          const intersections = Cesium$1.IntersectionTests.rayEllipsoid(
              ray,
              Cesium$1.Ellipsoid.WGS84
          );
          if (intersections) {
              return Cesium$1.Ray.getPoint(ray, intersections.start)
          }
          // Camera direction is not pointing at the globe, so use the ellipsoid horizon point as
          // the focal point.
          return Cesium$1.IntersectionTests.grazingAltitudeLocation(
              ray,
              Cesium$1.Ellipsoid.WGS84
          )
      }

      /**
       *
       * @param camera
       * @param focus
       * @param scalar
       * @returns {Cartesian3}
       * @private
       */
      _getCameraPosition(camera, focus, scalar) {
          const cartesian3Scratch = new Cesium$1.Cartesian3();
          let direction = Cesium$1.Cartesian3.subtract(
              focus,
              camera.position,
              cartesian3Scratch
          );
          let movementVector = Cesium$1.Cartesian3.multiplyByScalar(
              direction,
              scalar,
              cartesian3Scratch
          );
          return Cesium$1.Cartesian3.add(
              camera.position,
              movementVector,
              cartesian3Scratch
          )
      }

      /**
       *
       * @returns {boolean}
       * @private
       */
      _zoomIn() {
          let scene = this._viewer.scene;
          let camera = scene.camera;
          let sscc = scene.screenSpaceCameraController;
          if (
              scene.mode === Cesium$1.SceneMode.MORPHING ||
              !sscc.enableInputs ||
              scene.mode === Cesium$1.SceneMode.COLUMBUS_VIEW
          ) {
              return true
          } else if (scene.mode === Cesium$1.SceneMode.SCENE2D) {
              camera.zoomIn(camera.positionCartographic.height * 0.5);
          } else if (scene.mode === Cesium$1.SceneMode.SCENE3D) {
              let focus = this._getCameraFocus(scene);
              let cameraPosition = this._getCameraPosition(camera, focus, 1 / 2);
              camera.flyTo({
                  destination: cameraPosition,
                  orientation: {
                      heading: camera.heading,
                      pitch: camera.pitch,
                      roll: camera.roll
                  },
                  duration: 0.5,
                  convert: false
              });
          }
      }

      /**
       *
       * @private
       */
      _refresh() {
          this._viewer.camera.flyHome(1.5);
      }

      /**
       *
       * @returns {boolean}
       * @private
       */
      _zoomOut() {
          let scene = this._viewer.scene;
          let camera = scene.camera;
          let sscc = scene.screenSpaceCameraController;
          if (
              scene.mode === Cesium$1.SceneMode.MORPHING ||
              !sscc.enableInputs ||
              scene.mode === Cesium$1.SceneMode.COLUMBUS_VIEW
          ) {
              return true
          } else if (scene.mode === Cesium$1.SceneMode.SCENE2D) {
              camera.zoomOut(camera.positionCartographic.height);
          } else if (scene.mode === Cesium$1.SceneMode.SCENE3D) {
              let focus = this._getCameraFocus(scene);
              let cameraPosition = this._getCameraPosition(camera, focus, -1);
              camera.flyTo({
                  destination: cameraPosition,
                  orientation: {
                      heading: camera.heading,
                      pitch: camera.pitch,
                      roll: camera.roll
                  },
                  duration: 0.5,
                  convert: false
              });
          }
      }

      /**
       *
       * @private
       */
      _installHook() {
          Object.defineProperty(this._viewer, 'zoomController', {
              value: this,
              writable: false
          });
      }

      /**
       *
       * @private
       */
      _mountContent() {
          this._zoomInEl = DomUtil.parseDom(compass_inner.increase, true, 'zoom-in');
          this._refreshEl = DomUtil.parseDom(compass_inner.refresh, true, 'refresh');
          this._zoomOutEl = DomUtil.parseDom(compass_inner.decrease, true, 'zoom-out');
          this._wrapper.appendChild(this._zoomInEl);
          this._wrapper.appendChild(this._refreshEl);
          this._wrapper.appendChild(this._zoomOutEl);
          let self = this;
          this._zoomInEl.onclick = e => {
              self._zoomIn();
          };
          this._refreshEl.onclick = e => {
              self._refresh();
          };
          this._zoomOutEl.onclick = e => {
              self._zoomOut();
          };
          this._ready = true;
      }
  }

  Widget.registerType('zoom_controller');

  class LoadingMask extends Widget {
      constructor() {
          super();
          this._wrapper = DomUtil.create('div', 'dc-loading-mask');
          this.type = Widget.getWidgetType('loading_mask');
          this._state = State$1.INITIALIZED;
      }

      /**
       *
       * @private
       */
      _installHook() {
          Object.defineProperty(this._viewer, 'loadingMask', {
              value: this,
              writable: false
          });
      }

      /**
       *
       * @private
       */
      _mountContent() {
          let el = DomUtil.parseDom(
              `
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    `,
              true,
              'loading'
          );
          this._wrapper.appendChild(el);
          this._ready = true;
      }
  }

  Widget.registerType('loading_mask');

  /*
   * @Descripttion: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-16 10:50:09
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-16 10:53:22
   */

  function createWidgets() {
      return {
          attribution: new Attribution(),
          popup: new Popup(),
          contextMenu: new ContextMenu(),
          tooltip: new Tooltip(),
          mapSwitch: new MapSwitch(),
          mapSplit: new MapSplit(),
          locationBar: new LocationBar(),
          hawkeyeMap: new HawkeyeMap(),
          compass: new Compass(),
          distanceLegend: new DistanceLegend(),
          zoomController: new ZoomController(),
          loadingMask: new LoadingMask()
      }
  }

  /*
   * @Description: 
   * @version: 
   * @Author: sueRimn
   * @Date: 2021-03-16 10:31:03
   * @LastEditors: sueRimn
   * @LastEditTime: 2021-03-17 15:17:59
   */

  const DEF_OPTS = {
      animation: false, //Whether to create animated widgets, lower left corner of the meter
      baseLayerPicker: false, //Whether to display the layer selector
      imageryProvider: false, // Whether to display the default imagery
      fullscreenButton: false, //Whether to display the full-screen button
      geocoder: false, //To display the geocoder widget, query the button in the upper right corner
      homeButton: false, //Whether to display the Home button
      infoBox: false, //Whether to display the information box
      sceneModePicker: false, //Whether to display 3D/2D selector
      selectionIndicator: false, //Whether to display the selection indicator component
      timeline: false, //Whether to display the timeline
      navigationHelpButton: false, //Whether to display the help button in the upper right corner
      navigationInstructionsInitiallyVisible: false,
      creditContainer: undefined,
      shouldAnimate: true
  };

  class Viewer {
      constructor(id, options = {}) {
          if (!id || !document.getElementById(id)) {
              throw new Error('Viewer: the id is empty')
          }

          this._delegate = new Cesium$1.Viewer(id, {
              ...DEF_OPTS,
              ...options
          }); // Initialize the viewer

          // register events
          new MouseEvent(this);

          this._viewerEvent = new ViewerEvent(); // Register viewer events
          this._sceneEvent = new SceneEvent(this); // Register scene events
          this._viewerOptions = new ViewerOption(this);
          this._cameraOptions = new CameraOption(this);
          this._dcContainer = DomUtil.create(
              'div',
              'dc-container',
              document.getElementById(id)
          ); // Register the custom container

          this._baseLayerPicker = new Cesium$1.BaseLayerPickerViewModel({
              globe: this._delegate.scene.globe
          }); // Initialize the baseLayer picker

          this._layerGroupCache = {};
          this._layerCache = {};

          // Registers default widgets
          let widgets = createWidgets();
          Object.keys(widgets).forEach(key => {
              this.use(widgets[key]);
          });

      }

      get delegate() {
          return this._delegate
      }

      get dcContainer() {
          return this._dcContainer
      }

      get scene() {
          return this._delegate.scene
      }

      get camera() {
          return this._delegate.camera
      }

      get canvas() {
          return this._delegate.canvas
      }

      get dataSources() {
          return this._delegate.dataSources
      }

      get imageryLayers() {
          return this._delegate.imageryLayers
      }

      get terrainProvider() {
          return this._delegate.terrainProvider
      }

      get entities() {
          return this._delegate.entities
      }

      get postProcessStages() {
          return this._delegate.postProcessStages
      }

      get clock() {
          return this._delegate.clock
      }

      get viewerEvent() {
          return this._viewerEvent
      }

      get cameraPosition() {
          let position = Transform$1.transformMercatorToWGS84(this.camera.positionWC);
          if (position) {
              position.heading = Cesium$1.Math.toDegrees(this.camera.heading);
              position.pitch = Cesium$1.Math.toDegrees(this.camera.pitch);
              position.roll = Cesium$1.Math.toDegrees(this.camera.roll);
          }
          return position
      }

      _addLayerGroup(layerGroup) {
          if (
              layerGroup &&
              layerGroup.layerGroupEvent &&
              !Object(this._layerGroupCache).hasOwnProperty(layerGroup.id)
          ) {
              layerGroup.layerGroupEvent.fire(LayerGroupEventType.ADD, this);
              this._layerGroupCache[layerGroup.id] = layerGroup;
          }
      }

      _removeLayerGroup(layerGroup) {
          if (
              layerGroup &&
              layerGroup.layerGroupEvent &&
              Object(this._layerGroupCache).hasOwnProperty(layerGroup.id)
          ) {
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
          if (
              layer &&
              layer.layerEvent &&
              Object(this._layerCache[layer.type]).hasOwnProperty(layer.id)
          ) {
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
          return this
      }

      /**
       * Sets camera pitch range
       * @param min
       * @param max
       * @returns {Viewer}
       */
      setPitchRange(min = -90, max = -20) {
          this._cameraOption.setPitchRange(min, max);
          return this
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
          return this
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
          return this
      }

      /**
       * Changes Mouse Mode，0：Default，1: Change the tiltEventTypes to CameraEventType.RIGHT_DRAG
       * @param mouseMode
       * @returns {Viewer}
       */
      changeMouseMode(mouseMode) {
          this._cameraOption.changeMouseMode(mouseMode);
          return this
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
              return this
          }
          this._baseLayerPicker.imageryProviderViewModels.push(
              new Cesium$1.ProviderViewModel({
                  name: options.name || '地图',
                  creationFunction: () => {
                      return baseLayers
                  }
              })
          );
          if (!this._baseLayerPicker.selectedImagery) {
              this._baseLayerPicker.selectedImagery = this._baseLayerPicker.imageryProviderViewModels[0];
          }
          this.mapSwitch && this.mapSwitch.addMap(options);
          return this
      }

      /**
       * Changes the current globe display of the baseLayer
       * @param index
       * @returns {Viewer}
       */
      changeBaseLayer(index) {
          if (this._baseLayerPicker && index >= 0) {
              this._baseLayerPicker.selectedImagery = this._baseLayerPicker.imageryProviderViewModels[
                  index
              ];
          }
          return this
      }

      /**
       * Adds the terrain
       * @param terrain
       * @returns {Viewer}
       */
      addTerrain(terrain) {
          if (!terrain) {
              return this
          }
          this._baseLayerPicker.terrainProviderViewModels.push(
              new Cesium$1.ProviderViewModel({
                  name: '地形',
                  creationFunction: () => {
                      return terrain
                  }
              })
          );
          if (!this._baseLayerPicker.selectedTerrain) {
              this._baseLayerPicker.selectedTerrain = this._baseLayerPicker.terrainProviderViewModels[0];
          }
          return this
      }

      /**
       * Changes the current globe display of the terrain
       * @param index
       * @returns {Viewer}
       */
      changeTerrain(index) {
          if (this._baseLayerPicker && index >= 0) {
              this._baseLayerPicker.selectedTerrain = this._baseLayerPicker.terrainProviderViewModels[
                  index
              ];
          }
          return this
      }

      /**
       * Removes terrain
       * @returns {Viewer}
       */
      removeTerrain() {
          this._baseLayerPicker.terrainProviderViewModels = [];
          this._baseLayerPicker.selectedTerrain = undefined;
          this._delegate.terrainProvider = new Cesium$1.EllipsoidTerrainProvider();
          return this
      }

      /**
       *
       * @param layerGroup
       * @returns {Viewer}
       */
      addLayerGroup(layerGroup) {
          this._addLayerGroup(layerGroup);
          return this
      }

      /**
       *
       * @param layerGroup
       * @returns {Viewer}
       */
      removeLayerGroup(layerGroup) {
          this._removeLayerGroup(layerGroup);
          return this
      }

      /**
       * add a layer
       * @param layer
       * @returns {Viewer}
       */
      addLayer(layer) {
          this._addLayer(layer);
          return this
      }

      /**
       * Removes a layer
       * @param layer
       * @returns {Viewer}
       */
      removeLayer(layer) {
          this._removeLayer(layer);
          return this
      }

      /**
       * Checks to see if the layer is included
       * @param layer
       * @returns {boolean}
       */
      hasLayer(layer) {
          return (
              layer &&
              layer.layerEvent &&
              Object(this._layerCache[layer.type]).hasOwnProperty(layer.id)
          )
      }

      /**
       * Returns a layer by id
       * @param id
       * @returns {*|undefined}
       */
      getLayer(id) {
          let filters = this.getLayers().filter(item => item.id === id);
          return filters && filters.length ? filters[0] : undefined
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
          return result
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
          return this
      }

      /**
       * @param target
       * @param duration
       * @returns {Viewer}
       */
      flyTo(target, duration) {
          if (!target) {
              return this
          }
          this._delegate.flyTo(target.delegate || target, {
              duration
          });
          return this
      }

      /**
       * @param target
       * @returns {Viewer}
       */
      zoomTo(target) {
          if (!target) {
              return this
          }
          this._delegate.zoomTo(target.delegate || target);
          return this
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
          return this
      }

      /**
       * Camera zoom to a position
       * @param position
       * @param completeCallback
       * @returns {Viewer}
       */
      zoomToPosition(position, completeCallback) {
          this.flyToPosition(position, completeCallback, 0);
          return this
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
          return this
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
          return this
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
          return this
      }

      /**
       * Destroys the viewer.
       */
      destroy() {
          this._delegate.destroy();
          this._delegate = undefined;
          return this
      }

      /**
       * Export scene to image
       * @param name
       * @returns {Viewer}
       */
      exportScene(name) {
          let canvas = this.canvas;
          let image = canvas
              .toDataURL('image/png')
              .replace('image/png', 'image/octet-stream');
          let link = document.createElement('a');
          let blob = Util.dataURLtoBlob(image);
          let objUrl = URL.createObjectURL(blob);
          link.download = `${name || 'scene'}.png`;
          link.href = objUrl;
          link.click();
          return this
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
          return this
      }

  }

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
  exports.ClusterLayer = ClusterLayer;
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
  exports.Parse = Parse;
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
