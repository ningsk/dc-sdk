/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-09 10:50:47
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 11:17:31
 */

import * as Map from "./Map";
import * as Layer from "./layer/Layer";
import { PointConvert, PointUtil as Point, Util, Matrix } from "./core/index";
import * as Measure from "./Measure";
import {
  EllipsoidFadeMaterialProperty,
  AnimationLineMaterialProperty,
} from "./material/index";

import { DivPoint } from "./DivPoint";

import * as Attr from "./overlay/index";

import * as EventType from "./event/index";

import * as Dragger from "./dom/Dragger";

import * as Widget from "./widget/WidgetManager";
import * as BaseWidget from "./widget/BaseWidget";

import { Draw } from "./draw/Draw";

// ================  模块对外公开的属性和方法  ======================
var name = "Cesium 三维地球框架";

// 需要new的类
var version = "0.0.1";
var author = "dc";
var website = "http://";

// map

var createMap = Map.createMap;
var layer = Layer;
var pointconvert = PointConvert;
var latlng = Point; // 兼容旧版本
var point = Point;
var util = Util;
var matrix = Matrix;

var draw = {
  util: Util,
  event: EventType,
  dragger: Dragger,
  attr: Attr,
};

// widget
var widget = widget;

widget.BaseWidget = BaseWidget;

export {
  name,
  version,
  author,
  website,
  createMap,
  layer,
  pointconvert,
  latlng,
  point,
  util,
  matrix,
  Measure,
  AnimationLineMaterialProperty,
  EllipsoidFadeMaterialProperty,
  DivPoint,
  Draw,
  draw,
  widget,
};
