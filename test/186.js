/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawP = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.registerP = registerP;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _MarsClass2 = __webpack_require__(3);

var _util = __webpack_require__(1);

var util = _interopRequireWildcard(_util);

var _point = __webpack_require__(2);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

var _Tooltip = __webpack_require__(7);

var _index = __webpack_require__(20);

var attr = _interopRequireWildcard(_index);

var _DrawP = __webpack_require__(88);

var _DrawP2 = __webpack_require__(187);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//类库外部扩展的类
var exDraw = {};
function registerP(type, layerClass) {
    exDraw[type] = layerClass;
}

//绘制primitive类型

var DrawP = exports.DrawP = function (_MarsClass) {
    _inherits(DrawP, _MarsClass);

    //========== 构造方法 ========== 
    function DrawP(viewer, options) {
        _classCallCheck(this, DrawP);

        var _this = _possibleConstructorReturn(this, (DrawP.__proto__ || Object.getPrototypeOf(DrawP)).call(this));

        _this.viewer = viewer;
        _this.options = options || {};

        _this.dataSource = new Cesium.CustomDataSource(); //用于编辑辅助点
        _this.viewer.dataSources.add(_this.dataSource);

        _this.primitives = new Cesium.PrimitiveCollection(); //用于primitive
        _this.viewer.scene.primitives.add(_this.primitives);

        if (Cesium.defaultValue(_this.options.removeScreenSpaceEvent, true)) {
            _this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            _this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }

        _this.tooltip = new _Tooltip.Tooltip(_this.viewer.container); //鼠标提示信息

        _this.hasEdit(Cesium.defaultValue(_this.options.hasEdit, true)); //是否可编辑


        //编辑工具初始化
        var _opts = {
            viewer: _this.viewer,
            dataSource: _this.dataSource,
            primitives: _this.primitives,
            tooltip: _this.tooltip
        };

        //primitive
        _this.drawCtrl = {};
        _this.drawCtrl['model'] = new _DrawP2.DrawPModel(_opts);

        //外部图层
        for (var key in exDraw) {
            _this.drawCtrl[key] = new exDraw[key](_opts);
        }

        //绑定事件抛出方法
        var that = _this;
        for (var type in _this.drawCtrl) {
            _this.drawCtrl[type]._fire = function (type, data, propagate) {
                that.fire(type, data, propagate);
            };
        }

        _this.isContinued = Cesium.defaultValue(_this.options.isContinued, false);
        _this.isAutoEditing = Cesium.defaultValue(_this.options.isAutoEditing, true);
        _this.on(_MarsClass2.eventType.drawCreated, function (e) {
            var _this2 = this;

            setTimeout(function () {
                if (_this2.isContinued) {
                    //连续标绘时
                    _this2.stopDraw();
                    _this2.startDraw(_this2._last_attribute, _this2._last_drawOkCallback);
                } else if (_this2.isAutoEditing) {
                    //创建完成后激活编辑 
                    _this2.startEditing(e.entity);
                }
            }, 50);
        }, _this);
        return _this;
    }
    //========== 对外属性 ==========  


    _createClass(DrawP, [{
        key: 'startDraw',


        //==========分组相关==========
        // addGroup


        //==========绘制相关==========
        value: function startDraw(attribute, drawOkCallback) {
            //参数是字符串id或uri时
            if (typeof attribute === 'string') {
                attribute = { type: attribute };
            } else {
                if (attribute == null || attribute.type == null) {
                    marslog.warn('需要传入指定绘制的type类型！');
                    return;
                }
            }

            var type = attribute.type;
            if (this.drawCtrl[type] == null) {
                marslog.warn('不能进行type为【' + type + '】的绘制，无该类型！');
                return;
            }

            if (!drawOkCallback && attribute.success) {
                drawOkCallback = attribute.success;
                delete attribute.success;
            }
            this._last_drawOkCallback = drawOkCallback;
            this._last_attribute = attribute;

            //赋默认值  
            attribute = attr.addGeoJsonDefVal(attribute);

            this.stopDraw();
            var entity = this.drawCtrl[type].activate(attribute, drawOkCallback);
            this.bindDeleteContextmenu(entity);
            return entity;
        }
        //对已经绘制完成的entity，重新激活开始编辑[目前仅支持polyline、polygon]

    }, {
        key: 'restartDraw',
        value: function restartDraw(entity, drawOkCallback) {
            var attribute = entity.attribute;
            var type = attribute.type;
            if (this.drawCtrl[type] == null) {
                marslog.warn('不能进行type为【' + type + '】的绘制，无该类型！');
                return;
            }

            if (!drawOkCallback && attribute.success) {
                drawOkCallback = attribute.success;
                delete attribute.success;
            }
            this._last_drawOkCallback = drawOkCallback;
            this._last_attribute = attribute;

            this.stopDraw();
            var entity = this.drawCtrl[type].activate(entity, drawOkCallback);
            return entity;
        }
        //是否还在绘制中

    }, {
        key: 'hasDrawing',
        value: function hasDrawing() {
            for (var type in this.drawCtrl) {
                if (this.drawCtrl[type]._enabled) return true;
            }
            return false;
        }
        //外部控制，完成绘制，比如手机端无法双击结束

    }, {
        key: 'endDraw',
        value: function endDraw() {
            for (var type in this.drawCtrl) {
                if (this.drawCtrl[type].endDraw) this.drawCtrl[type].endDraw();
            }
            return this;
        }
    }, {
        key: 'stopDraw',
        value: function stopDraw() {
            this.stopEditing();
            for (var type in this.drawCtrl) {
                this.drawCtrl[type].disable(true);
            }
            return this;
        }
    }, {
        key: 'clearDraw',
        value: function clearDraw() {
            //删除所有
            this.stopDraw();

            var arrEntity = this.getEntitys();
            for (var i = 0, len = arrEntity.length; i < len; i++) {
                var entity = arrEntity[i];
                if (entity.editing) {
                    entity.editing.destroy();
                    delete entity.editing;
                }
            }
            this.dataSource.entities.removeAll();
            this.primitives.removeAll();

            return this;
        }
    }, {
        key: 'closeTooltip',
        value: function closeTooltip() {
            if (!this.tooltip) return;

            this.tooltip.setVisible(false);
            if (this.tiptimeTik) {
                clearTimeout(this.tiptimeTik);
                delete this.tiptimeTik;
            }
        }
        //==========编辑相关==========
        // currEditFeature: null,      //当前编辑的要素  

    }, {
        key: 'getCurrentEntity',
        value: function getCurrentEntity() {
            return this.currEditFeature;
        }
        // _hasEdit: null,

    }, {
        key: 'hasEdit',
        value: function hasEdit(val) {
            if (this._hasEdit !== null && this._hasEdit === val) return;

            this._hasEdit = val;
            if (val) {
                this.bindSelectEvent();
            } else {
                this.stopEditing();
                this.destroySelectEvent();
            }
        }
        //绑定鼠标选中事件

    }, {
        key: 'bindSelectEvent',
        value: function bindSelectEvent() {
            var _this3 = this;

            //选取对象
            var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
            handler.setInputAction(function (event) {
                var pickedObject = _this3.viewer.scene.pick(event.position, 5, 5);
                if (Cesium.defined(pickedObject)) {
                    var entity = pickedObject.id || pickedObject.primitive.id || pickedObject.primitive;

                    if (_this3.hasDrawing()) return; //还在绘制中时，跳出
                    if (_this3.currEditFeature && _this3.currEditFeature === entity) return; //重复单击了跳出
                    if (!Cesium.defaultValue(entity.hasEdit, true)) return; //如果设置了不可编辑跳出

                    if (entity && _this3.isMyEntity(entity)) {
                        if (!Cesium.defaultValue(entity.inProgress, false)) {
                            _this3.startEditing(entity);
                            _this3.closeTooltip();
                            if (entity.draw_tooltip) {
                                _this3.tooltip.showAt(event.position, entity.draw_tooltip);
                            }
                            return;
                        }
                    }
                }
                _this3.stopEditing();
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            //编辑提示事件
            handler.setInputAction(function (event) {
                if (!_this3._hasEdit) return;

                //还在绘制中时，跳出
                if (_this3.hasDrawing()) return;

                //正在拖拽其他的entity时，跳出
                if (!_this3.viewer.scene.screenSpaceCameraController.enableInputs) return;

                _this3.closeTooltip();

                var pickedObject = _this3.viewer.scene.pick(event.endPosition, 5, 5);
                if (Cesium.defined(pickedObject)) {
                    var entity = pickedObject.id || pickedObject.primitive.id || pickedObject.primitive;
                    if (entity && entity.editing && !Cesium.defaultValue(entity.inProgress, false) && _this3.isMyEntity(entity)) {
                        var tooltip = _this3.tooltip;

                        //删除右键菜单打开了不显示tooltip
                        if (_this3.viewer.mars.contextmenu && _this3.viewer.mars.contextmenu.show && _this3.viewer.mars.contextmenu.target == entity) return;

                        _this3.tiptimeTik = setTimeout(function () {
                            //edit中的MOUSE_MOVE会关闭提示，延迟执行。
                            tooltip.showAt(event.endPosition, _Tooltip.message.edit.start);
                        }, 100);
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            this.selectHandler = handler;
        }
    }, {
        key: 'destroySelectEvent',
        value: function destroySelectEvent() {
            this.selectHandler && this.selectHandler.destroy();
            this.selectHandler = undefined;
        }
    }, {
        key: 'startEditing',
        value: function startEditing(entity) {
            this.stopEditing();
            if (entity == null || !this._hasEdit) return;

            if (entity.editing && entity.editing.activate) {
                entity.editing.activate();
            }
            this.currEditFeature = entity;
        }
    }, {
        key: 'stopEditing',
        value: function stopEditing() {
            this.closeTooltip();
            if (this.currEditFeature && this.currEditFeature.editing && this.currEditFeature.editing.disable) {
                this.currEditFeature.editing.disable();
            }
            this.currEditFeature = null;
        }
        //修改了属性

    }, {
        key: 'updateAttribute',
        value: function updateAttribute(attribute, entity) {
            if (entity == null) entity = this.currEditFeature;
            if (entity == null || attribute == null) return;

            attribute.style = attribute.style || {};
            attribute.attr = attribute.attr || {};

            //更新属性
            var type = entity.attribute.type;
            this.drawCtrl[type].style2Entity(attribute.style, entity);
            entity.attribute = attribute;

            //如果在编辑状态，更新绑定的拖拽点
            if (entity.editing) {
                if (entity.editing.updateAttrForEditing) entity.editing.updateAttrForEditing();

                if (entity.editing.updateDraggers) entity.editing.updateDraggers();
            }

            //名称 绑定到tooltip 
            if (this.options.nameTooltip) {
                var that = this;
                if (entity.attribute.attr && entity.attribute.attr.name) {
                    entity.tooltip = {
                        html: entity.attribute.attr.name,
                        visible: function visible() {
                            return !that._hasEdit;
                        }
                    };
                } else {
                    entity.tooltip = null;
                }
            }
            return entity;
        }
    }, {
        key: 'updateStyle',
        value: function updateStyle(style, entity) {
            if (entity == null) entity = this.currEditFeature;
            if (entity == null) return;

            var type = entity.attribute.type;

            var oldstyle = entity.attribute.style || {};
            for (var key in style) {
                oldstyle[key] = style[key];
            }
            this.drawCtrl[type].style2Entity(oldstyle, entity);
        }

        //修改坐标、高程

    }, {
        key: 'setPositions',
        value: function setPositions(positions, entity) {
            if (entity == null) entity = this.currEditFeature;
            if (entity == null || positions == null) return;

            //如果在编辑状态，更新绑定的拖拽点
            if (entity.editing) {
                entity.editing.setPositions(positions);
                entity.editing.updateDraggers();
            }
            return entity;
        }
        //==========删除相关========== 
        //右键菜单

    }, {
        key: 'bindDeleteContextmenu',
        value: function bindDeleteContextmenu(entity) {
            var that = this;
            entity.contextmenuItems = entity.contextmenuItems || [];
            entity.contextmenuItems.push({
                text: '删除对象',
                iconCls: 'fa fa-trash-o',
                visible: function visible(e) {
                    that.closeTooltip();

                    var entity = e.target;
                    if (entity.inProgress && !entity.editing) return false;

                    if (Cesium.defined(that.options.hasDel)) return that._hasEdit && that.options.hasDel(e);else return that._hasEdit;
                },
                callback: function callback(e) {
                    var entity = e.target;

                    if (entity.editing && entity.editing.disable) {
                        entity.editing.disable();
                    }
                    that.deleteEntity(entity);
                }
            });
        }
        //删除单个

    }, {
        key: 'deleteEntity',
        value: function deleteEntity(entity) {
            if (entity == null) entity = this.currEditFeature;
            if (entity == null) return;

            if (entity.editing) {
                entity.editing.destroy();
                delete entity.editing;
            }

            if (this.primitives.contains(entity)) this.primitives.remove(entity);

            this.fire(_MarsClass2.eventType.delete, { entity: entity });
        }
    }, {
        key: 'remove',
        value: function remove(entity) {
            //兼容不同习惯命名
            return this.deleteEntity(entity);
        }
        //是否为当前编辑器编辑的标号

    }, {
        key: 'isMyEntity',
        value: function isMyEntity(entity) {
            if (this.primitives.contains(entity)) return true;
            return false;
        }
        //删除所有

    }, {
        key: 'deleteAll',
        value: function deleteAll() {
            //兼容不同习惯命名
            this.clearDraw();
        }
    }, {
        key: 'removeAll',
        value: function removeAll() {
            //兼容不同习惯命名
            this.clearDraw();
        }
        //==========转换GeoJSON==========
        //转换当前所有为geojson

    }, {
        key: 'toGeoJSON',
        value: function toGeoJSON(entity) {
            this.stopDraw();

            if (entity == null) {
                //全部数据 
                var arrEntity = this.getEntitys();
                if (arrEntity.length == 0) return null;

                var features = [];
                for (var i = 0, len = arrEntity.length; i < len; i++) {
                    var entity = arrEntity[i];
                    if (entity.attribute == null || entity.attribute.type == null) continue;

                    var type = entity.attribute.type;
                    var geojson = this.drawCtrl[type].toGeoJSON(entity);
                    if (geojson == null) continue;
                    geojson = attr.removeGeoJsonDefVal(geojson);

                    features.push(geojson);
                }
                if (features.length > 0) return { type: "FeatureCollection", features: features };else return null;
            } else {
                var type = entity.attribute.type;
                var geojson = this.drawCtrl[type].toGeoJSON(entity);
                geojson = attr.removeGeoJsonDefVal(geojson);
                return geojson;
            }
        }
        //加载goejson数据

    }, {
        key: 'jsonToEntity',
        value: function jsonToEntity(json, isClear, isFly) {
            //兼容旧版本方法名
            return this.loadJson(json, {
                clear: isClear,
                flyTo: isFly
            });
        }
    }, {
        key: 'loadJson',
        value: function loadJson(json, opts) {
            opts = opts || {};

            var jsonObjs = json;
            try {
                if (util.isString(json)) jsonObjs = JSON.parse(json);
            } catch (e) {
                util.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
                return;
            }

            if (opts.clear) {
                this.clearDraw();
            }

            var arrthis = [];
            var jsonFeatures = jsonObjs.features ? jsonObjs.features : [jsonObjs];

            for (var i = 0, len = jsonFeatures.length; i < len; i++) {
                var feature = jsonFeatures[i];

                if (!feature.properties || !feature.properties.type) {
                    //非本身保存的外部其他geojson数据
                    feature.properties = feature.properties || {};
                    switch (feature.geometry.type) {
                        case "MultiPolygon":
                        case "Polygon":
                            feature.properties.type = "polygon";
                            break;
                        case "MultiLineString":
                        case "LineString":
                            feature.properties.type = "polyline";
                            break;
                        case "MultiPoint":
                        case "Point":
                            feature.properties.type = "point";
                            break;
                    }
                }
                feature.properties.style = opts.style || feature.properties.style || {};
                feature.properties.attr = feature.properties.attr || {};

                if (opts.onEachFeature) //添加到地图前 回调方法
                    opts.onEachFeature(feature, feature.properties.type, i);

                var type = feature.properties.type;
                if (this.drawCtrl[type] == null) {
                    marslog.warn('数据无法识别或者数据的[' + type + ']类型参数有误');
                    continue;
                }

                var entity = this.getEntityById(feature.properties.attr.id);
                if (entity) {
                    this.updateStyle(feature.properties.style, entity);

                    var positions = (0, _point.getPositionByGeoJSON)(feature);
                    if (positions) this.setPositions(positions, entity);
                } else {
                    entity = this.addFeature(type, feature);
                }

                if (opts.onEachEntity) //添加到地图后回调方法
                    opts.onEachEntity(feature, entity, i);

                arrthis.push(entity);
            }

            if (opts.flyTo) {
                this.viewer.mars.flyTo(arrthis);
            }

            return arrthis;
        }

        //外部添加billboard点数据

    }, {
        key: 'addBillboard',
        value: function addBillboard(point, style) {
            if (point instanceof Cesium.Cartesian3) {
                point = pointconvert.cartesian2lonlat(point);
            }
            var type = 'billboard';

            var feature = {
                type: "Feature",
                properties: { style: style },
                geometry: { type: "Point", coordinates: point }
            };

            var entity = this.addFeature(type, feature);
            return entity;
        }
        //外部添加billboard点数据

    }, {
        key: 'addPoint',
        value: function addPoint(point, style) {
            if (point instanceof Cesium.Cartesian3) {
                point = pointconvert.cartesian2lonlat(point);
            }

            var type = 'point';

            var feature = {
                type: "Feature",
                properties: { style: style },
                geometry: { type: "Point", coordinates: point }
            };

            var entity = this.addFeature(type, feature);
            return entity;
        }
        //外部添加线数据

    }, {
        key: 'addPolyline',
        value: function addPolyline(coordinates, style) {
            var type = 'polyline';

            var feature = {
                type: "Feature",
                properties: { style: style },
                geometry: {
                    type: "LineString",
                    coordinates: coordinates
                }
            };

            var entity = this.addFeature(type, feature);
            return entity;
        }
        //外部添加面数据

    }, {
        key: 'addPolygon',
        value: function addPolygon(coordinates, style) {
            var type = 'polygon';

            var feature = {
                type: "Feature",
                properties: { style: style },
                geometry: {
                    type: "Polygon",
                    coordinates: [coordinates]
                }
            };

            var entity = this.addFeature(type, feature);
            return entity;
        }
        //外部添加数据（内部使用的）

    }, {
        key: 'addFeature',
        value: function addFeature(type, feature) {
            feature.properties.type = type;
            feature.properties.style = feature.properties.style || {};

            //赋默认值  
            feature.properties = attr.addGeoJsonDefVal(feature.properties);

            var entity = this.drawCtrl[type].jsonToEntity(feature);
            this.bindDeleteContextmenu(entity);

            //名称 绑定到tooltip
            if (this.options.nameTooltip) {
                if (entity.attribute.attr && entity.attribute.attr.name) {
                    var that = this;
                    entity.tooltip = {
                        html: entity.attribute.attr.name,
                        visible: function visible() {
                            return !that._hasEdit;
                        }
                    };
                } else {
                    entity.tooltip = null;
                }
            }

            return entity;
        }
        //属性转entity

    }, {
        key: 'attributeToEntity',
        value: function attributeToEntity(attribute, positions) {
            var entity = this.drawCtrl[attribute.type].attributeToEntity(attribute, positions);
            this.bindDeleteContextmenu(entity);

            //名称 绑定到tooltip
            if (this.options.nameTooltip) {
                if (entity.attribute.attr && entity.attribute.attr.name) {
                    var that = this;
                    entity.tooltip = {
                        html: entity.attribute.attr.name,
                        visible: function visible() {
                            return !that._hasEdit;
                        }
                    };
                } else {
                    entity.tooltip = null;
                }
            }
            return entity;
        }

        // //绑定外部非Draw产生的entity到标绘
        // bindExtraEntity(entity, attribute) {
        //     attribute = attribute || {};
        //     attribute.type = attribute.type || attr.getTypeName(entity);
        //     attribute.style = attribute.style || {};
        //     // attribute = attr.addGeoJsonDefVal(attribute);

        //     var entity = this.drawCtrl[attribute.type].bindExtraEntity(entity, attribute);
        //     this.bindDeleteContextmenu(entity);

        //     entity.entityCollection.remove(entity);//从原有的集合中删除 
        //     this.dataSource.entities.add(entity);//加入到draw集合图层中
        // }
        //==========对外接口========== 

    }, {
        key: 'setVisible',
        value: function setVisible(visible) {
            this._visible = visible;
            if (!visible) {
                this.stopDraw();
            }

            this.dataSource.show = visible;
            this.primitives.show = visible;
        }
        //是否存在绘制

    }, {
        key: 'hasDraw',
        value: function hasDraw() {
            return this.getEntitys().length > 0;
        }
        //获取所有绘制的实体对象列表

    }, {
        key: 'getEntitys',
        value: function getEntitys(noStop) {
            if (!noStop) this.stopDraw();

            var arr = this.primitives._primitives;
            return arr;
        }
        // getDataSource() {
        //     return this.dataSource;
        // }

    }, {
        key: 'getEntityById',
        value: function getEntityById(id) {
            if (!id) return null;

            var arrEntity = this.getEntitys();
            for (var i = 0, len = arrEntity.length; i < len; i++) {
                var entity = arrEntity[i];
                if (id == entity.attribute.attr.id) {
                    return entity;
                }
            }
            return null;
        }
        //获取实体的经纬度值 坐标数组

    }, {
        key: 'getCoordinates',
        value: function getCoordinates(entity) {
            var type = entity.attribute.type;
            var coor = this.drawCtrl[type].getCoordinates(entity);
            return coor;
        }
        //获取实体的坐标数组

    }, {
        key: 'getPositions',
        value: function getPositions(entity) {
            var type = entity.attribute.type;
            var positions = this.drawCtrl[type].getPositions(entity);
            return positions;
        }
    }, {
        key: 'flyTo',
        value: function flyTo(entity, opts) {
            this.viewer.mars.flyTo(entity, opts);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.stopDraw();
            this.hasEdit(false);

            for (var type in this.drawCtrl) {
                this.drawCtrl[type].destroy();
            }
            delete this.drawCtrl;
            this.clearDraw();

            if (this.viewer.dataSources.contains(this.dataSource)) {
                this.viewer.dataSources.remove(this.dataSource, true);
            }
            delete this.dataSource;

            if (this.viewer.scene.primitives.contains(this.primitives)) {
                this.viewer.scene.primitives.remove(this.primitives);
            }
            delete this.primitives;

            this.tooltip.destroy();
            _get(DrawP.prototype.__proto__ || Object.getPrototypeOf(DrawP.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'visible',
        get: function get() {
            return this.getVisible();
        },
        set: function set(val) {
            this.setVisible(val);
        }
    }, {
        key: 'edit',
        get: function get() {
            return this._hasEdit;
        },
        set: function set(val) {
            this.hasEdit(val);
        }

        //是否还在绘制中

    }, {
        key: 'drawing',
        get: function get() {
            return this.hasDrawing();
        }
    }, {
        key: 'entitys',
        get: function get() {
            return this.getEntitys();
        }
    }]);

    return DrawP;
}(_MarsClass2.MarsClass);

//绑定到draw，方便外部使用


DrawP.Base = _DrawP.DrawPBase;
DrawP.Model = _DrawP2.DrawPModel;

/***/ }),
