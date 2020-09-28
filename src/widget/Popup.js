/*
 * @Description: 该类不仅仅是popup处理，是所有一些有关单击事件的统一处理入口（从效率考虑）
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-20 14:24:48
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 13:46:58
 */

import Cesium from "cesium";
import $ from "jquery";
import { PointUtil, Util } from "../core/index";
import EsriUtil from "esri-leaflet/src/Util";

var _viewer;
var _handler;
var _objPopup = {};
var _isOnly = true;
var _enable = true;
