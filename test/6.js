/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Draw = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.register = register;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _zepto = __webpack_require__(8);

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

var _Draw = __webpack_require__(44);

var _Draw2 = __webpack_require__(24);

var _Draw3 = __webpack_require__(45);

var _Draw4 = __webpack_require__(115);

var _Draw5 = __webpack_require__(116);

var _Draw6 = __webpack_require__(16);

var _Draw7 = __webpack_require__(117);

var _Draw8 = __webpack_require__(118);

var _Draw9 = __webpack_require__(119);

var _Draw10 = __webpack_require__(63);

var _Draw11 = __webpack_require__(10);

var _Draw12 = __webpack_require__(120);

var _Draw13 = __webpack_require__(121);

var _Draw14 = __webpack_require__(122);

var _Draw15 = __webpack_require__(124);

var _Draw16 = __webpack_require__(125);

var _Draw17 = __webpack_require__(126);

var _Draw18 = __webpack_require__(127);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//类库外部扩展的类
var exDraw = {};
function register(type, layerClass) {
    exDraw[type] = layerClass;
}

//绘制entity类型

var Draw = exports.Draw = function (_MarsClass) {
    _inherits(Draw, _MarsClass);

    //========== 构造方法 ========== 
    function Draw(options, oldparam) {
        _classCallCheck(this, Draw);

        //兼容v2.2之前旧版本处理,非升级用户可删除下面代码
        var _this = _possibleConstructorReturn(this, (Draw.__proto__ || Object.getPrototypeOf(Draw)).call(this));

        if (oldparam) {
            oldparam.viewer = options;
            options = oldparam;
        }
        //兼容v2.2之前旧版本处理,非升级用户可删除上面代码


        _this.options = options;
        _this.viewer = options.viewer;
        _this.popup = options.popup;

        _this.options.groupName = Cesium.defaultValue(_this.options.groupName, '默认分组');

        _this.arrGroup = []; //分组
        _this.dataSource = Cesium.defaultValue(_this.options.dataSource, _this.addGroup(_this.options.groupName));

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
            tooltip: _this.tooltip
        };

        //entity
        _this.drawCtrl = {};
        _this.drawCtrl['point'] = new _Draw2.DrawPoint(_opts);
        _this.drawCtrl['billboard'] = new _Draw3.DrawBillboard(_opts);
        _this.drawCtrl['label'] = new _Draw4.DrawLabel(_opts);
        _this.drawCtrl['model'] = new _Draw5.DrawModel(_opts);

        _this.drawCtrl['polyline'] = new _Draw6.DrawPolyline(_opts);
        _this.drawCtrl['curve'] = new _Draw7.DrawCurve(_opts);
        _this.drawCtrl['polylineVolume'] = new _Draw8.DrawPolylineVolume(_opts);
        _this.drawCtrl['corridor'] = new _Draw9.DrawCorridor(_opts);

        _this.drawCtrl['polygon'] = new _Draw10.DrawPolygon(_opts);
        _this.drawCtrl['rectangle'] = new _Draw12.DrawRectangle(_opts);
        _this.drawCtrl['ellipse'] = new _Draw13.DrawCircle(_opts);
        _this.drawCtrl['circle'] = _this.drawCtrl['ellipse']; //圆
        _this.drawCtrl['cylinder'] = new _Draw14.DrawCylinder(_opts);
        _this.drawCtrl['ellipsoid'] = new _Draw15.DrawEllipsoid(_opts);
        _this.drawCtrl['wall'] = new _Draw16.DrawWall(_opts);
        _this.drawCtrl['box'] = new _Draw18.DrawBox(_opts);
        _this.drawCtrl['plane'] = new _Draw17.DrawPlane(_opts);

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
            _this.bindExtension(e.entity);

            setTimeout(function () {
                if (_this.isContinued) {
                    //连续标绘时
                    _this.stopDraw();
                    _this.startDraw(_this._last_attribute, _this._last_drawOkCallback);
                } else if (_this.isAutoEditing) {
                    //创建完成后激活编辑 
                    _this.startEditing(e.entity);
                }
            }, 50);
        }, _this);
        return _this;
    }
    //========== 对外属性 ==========  


    _createClass(Draw, [{
        key: 'addGroup',


        //==========分组相关==========
        //新增添加分组
        value: function addGroup(name, item) {
            var dataSource = new Cesium.CustomDataSource(name);
            dataSource.attribute = item; //携带数据，非必须
            this.viewer.dataSources.add(dataSource);

            this.arrGroup.push(dataSource);
            return dataSource;
        }
        //校验分组是否有同名的

    }, {
        key: 'checkGroupName',
        value: function checkGroupName(name, thisLayer) {
            for (var i = 0; i < this.arrGroup.length; i++) {
                var layer = this.arrGroup[i];
                if (thisLayer && layer == thisLayer) continue;

                if (layer.name == name) return true;
            }
            return false;
        }
        //根据name获取分组

    }, {
        key: 'getGroup',
        value: function getGroup(name) {
            for (var i = 0; i < this.arrGroup.length; i++) {
                var layer = this.arrGroup[i];
                if (layer.name == name) return layer;
            }
            return null;
        }
        //新增或获取已有分组

    }, {
        key: 'addOrGetGroup',
        value: function addOrGetGroup(name) {
            if (!name) return this.dataSource;
            var group = this.getGroup(name);
            if (group) {
                return group;
            } else {
                return this.addGroup(name);
            }
        }
        //删除分组后的对默认图层和激活图层的特殊处理

    }, {
        key: '_processForRemoveGroup',
        value: function _processForRemoveGroup() {
            if (this.arrGroup.length == 0) {
                this.dataSource = this.addGroup(this.options.groupName);
            } else if (this.dataSource == null) {
                //如果删除的是当前激活的图层，默认再次激活第1个图层
                this.dataSource = this.arrGroup[0];
            }
        }
        //根据name删除分组

    }, {
        key: 'removeGroup',
        value: function removeGroup(name) {
            var layer;
            if (name instanceof Cesium.CustomDataSource) layer = name;else layer = this.getGroup(name);

            if (layer) {
                if (this.dataSource == layer) {
                    this.dataSource = null;
                }
                this.removeByGroup(layer);
                this.viewer.dataSources.remove(layer, true);
                util.removeArrayItem(this.arrGroup, layer);

                this._processForRemoveGroup();
                return true;
            }
            return false;
        }
        //删除所有非空数组

    }, {
        key: 'removeNullGroup',
        value: function removeNullGroup() {
            for (var i = this.arrGroup.length - 1; i >= 0; i--) {
                var layer = this.arrGroup[i];
                if (layer.entities.values.length == 0) {
                    this.viewer.dataSources.remove(layer, true);
                    this.arrGroup.splice(i, 1);

                    if (this.dataSource == layer) {
                        this.dataSource = null;
                    }
                }
            }
            this._processForRemoveGroup();
        }
        //激活图层，新增的标绘是加到当前激活的图层中。

    }, {
        key: 'activateGroup',
        value: function activateGroup(name) {
            var layer;
            if (name instanceof Cesium.CustomDataSource) layer = name;else layer = this.getGroup(name);

            if (!layer) return false;

            this.dataSource = layer;
            return true;
        }

        //移动标号到新分组

    }, {
        key: 'moveEntityGroup',
        value: function moveEntityGroup(entity, group) {
            var dataSource;
            if (group instanceof Cesium.CustomDataSource) dataSource = group;else dataSource = this.getGroup(group);

            entity.entityCollection.remove(entity); //从原有的集合中删除 
            dataSource.entities.add(entity); //加入到draw集合图层中

            entity.attribute.group = dataSource.name; //记录分组信息
        }
    }, {
        key: 'getDataSource',
        value: function getDataSource() {
            return this.dataSource;
        }

        //==========绘制相关==========

    }, {
        key: 'startDraw',
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
            var _this2 = this;

            //选取对象
            var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
            handler.setInputAction(function (event) {
                var pickedObject = _this2.viewer.scene.pick(event.position, 5, 5);
                if (Cesium.defined(pickedObject)) {
                    var entity = pickedObject.id || pickedObject.primitive.id || pickedObject.primitive;

                    if (_this2.hasDrawing()) return; //还在绘制中时，跳出
                    if (_this2.currEditFeature && _this2.currEditFeature === entity) return; //重复单击了跳出
                    if (!Cesium.defaultValue(entity.hasEdit, true)) return; //如果设置了不可编辑跳出

                    if (entity && _this2.isMyEntity(entity)) {
                        if (!Cesium.defaultValue(entity.inProgress, false)) {
                            _this2.startEditing(entity);
                            _this2.closeTooltip();
                            if (entity.draw_tooltip) {
                                _this2.tooltip.showAt(event.position, entity.draw_tooltip);
                            }
                            return;
                        }
                    }
                }
                _this2.stopEditing();
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            //编辑提示事件
            handler.setInputAction(function (event) {
                if (!_this2._hasEdit) return;

                //还在绘制中时，跳出
                if (_this2.hasDrawing()) return;

                //正在拖拽其他的entity时，跳出
                if (!_this2.viewer.scene.screenSpaceCameraController.enableInputs) return;

                _this2.closeTooltip();

                var pickedObject = _this2.viewer.scene.pick(event.endPosition, 5, 5);
                if (Cesium.defined(pickedObject)) {
                    var entity = pickedObject.id || pickedObject.primitive.id || pickedObject.primitive;
                    if (entity && entity.editing && !Cesium.defaultValue(entity.inProgress, false) && _this2.isMyEntity(entity)) {
                        var tooltip = _this2.tooltip;

                        //删除右键菜单打开了不显示tooltip
                        if (_this2.viewer.mars.contextmenu && _this2.viewer.mars.contextmenu.show && _this2.viewer.mars.contextmenu.target == entity) return;

                        _this2.tiptimeTik = setTimeout(function () {
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

        //绑定扩展的右键、popup等处理

    }, {
        key: 'bindExtension',
        value: function bindExtension(entity) {
            var _this3 = this;

            var that = this;

            entity.hasDrawEdit = function () {
                return _this3.edit;
            };

            //右键菜单
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

            //名称 绑定到tooltip
            if (this.options.nameTooltip) {
                entity.tooltip = {
                    visible: function visible() {
                        return !that._hasEdit;
                    },
                    html: function html(entity) {
                        if (entity.attribute.attr && entity.attribute.attr.name) return entity.attribute.attr.name;else return null;
                    }
                };
            }

            if (this.popup) {
                var that = this;

                entity.popup = {
                    visible: function visible(entity) {
                        return that.popup.enable;
                    },
                    html: function html(entity) {
                        var html = util.getPopup([].concat(_toConsumableArray(that.popup.columns), [that.popup.edit ? { "field": "id", "name": "确定", "type": "button" } : null]), entity.attribute.attr, {
                            title: that.popup.title || "属性信息",
                            edit: that.popup.edit,
                            width: 200
                        });
                        return html;
                    },
                    onAdd: function onAdd(eleId, entity) {
                        //popup的DOM添加到页面的回调方法 
                        (0, _zepto.zepto)("#" + eleId + " .dc-popup-btn").click(function (e) {
                            (0, _zepto.zepto)("#" + eleId + " .dc-popup-edititem").each(function () {
                                var val = (0, _zepto.zepto)(this).val();
                                var key = (0, _zepto.zepto)(this).attr("data-type");
                                entity.attribute.attr[key] = val;
                            });
                            that.viewer.mars.popup.close();
                            if (that.popup.callback) that.popup.callback();
                        });
                    },
                    onRemove: function onRemove(eleId, entity) {//popup的DOM从页面移除的回调方法 

                    },
                    anchor: this.popup.enable.anchor || [0, -20]
                };
            }
        }
        //==========删除相关==========  
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
            if (entity.featureEx) {
                entity.featureEx.destroy();
                delete entity.featureEx;
            }

            if (entity.entityCollection.contains(entity)) entity.entityCollection.remove(entity);

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
            for (var i = 0; i < this.arrGroup.length; i++) {
                var layer = this.arrGroup[i];
                if (layer.entities.contains(entity)) return true;
            }
            return false;
        }
    }, {
        key: 'removeByGroup',
        value: function removeByGroup(layer) {
            var arrEntity = layer.entities.values;
            for (var i = 0, len = arrEntity.length; i < len; i++) {
                var entity = arrEntity[i];
                if (entity.editing) {
                    entity.editing.destroy();
                    delete entity.editing;
                }
                if (entity.featureEx) {
                    entity.featureEx.destroy();
                    delete entity.featureEx;
                }
            }
            layer.entities.removeAll();
        }
        //删除所有

    }, {
        key: 'deleteAll',
        value: function deleteAll() {
            //兼容不同习惯命名
            this.removeAll();
        }
    }, {
        key: 'clearDraw',
        value: function clearDraw() {
            //兼容不同习惯命名
            this.removeAll();
        }
    }, {
        key: 'removeAll',
        value: function removeAll() {
            this.stopDraw();

            for (var i = 0; i < this.arrGroup.length; i++) {
                this.removeByGroup(this.arrGroup[i]);
            }

            return this;
        }
        //==========转换GeoJSON==========
        //转换当前所有为geojson

    }, {
        key: 'toGeoJSON',
        value: function toGeoJSON(entity) {
            this.stopDraw();

            if (entity == null) {
                //全部数据   
                var features = [];
                var groupName = [];
                for (var k = 0; k < this.arrGroup.length; k++) {
                    var layer = this.arrGroup[k];
                    groupName.push(layer.name);
                    features = features.concat(this.getJsonByGroup(layer));
                }

                return {
                    type: "FeatureCollection",
                    group: groupName,
                    features: features
                };
            } else if (entity instanceof Cesium.CustomDataSource) {
                return {
                    type: "FeatureCollection",
                    features: this.getJsonByGroup(entity)
                };
            } else {
                var type = entity.attribute.type;
                var geojson = this.drawCtrl[type].toGeoJSON(entity);
                geojson = attr.removeGeoJsonDefVal(geojson);
                return geojson;
            }
        }
    }, {
        key: 'getJsonByGroup',
        value: function getJsonByGroup(layer) {
            var features = [];
            var arrEntity = layer.entities.values;
            for (var i = 0, len = arrEntity.length; i < len; i++) {
                var entity = arrEntity[i];
                if (entity.attribute == null || entity.attribute.type == null) continue;

                var type = entity.attribute.type;
                var geojson = this.drawCtrl[type].toGeoJSON(entity);
                if (geojson == null) continue;
                geojson = attr.removeGeoJsonDefVal(geojson);
                geojson.properties.group = layer.name; //记录分组信息

                features.push(geojson);
            }
            return features;
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

            //存在分组信息
            var groupName = jsonObjs.group;
            if (groupName) {
                for (var k = 0; k < groupName.length; k++) {
                    this.addOrGetGroup(groupName[k]);
                }
            }

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
        value: function addFeature(type, geojson) {
            geojson.properties.type = type;
            geojson.properties.style = geojson.properties.style || {};

            //赋默认值  
            geojson.properties = attr.addGeoJsonDefVal(geojson.properties);

            //或者分组
            var group = this.addOrGetGroup(geojson.properties.group);

            var entity = this.drawCtrl[type].jsonToEntity(geojson, group);
            this.bindExtension(entity);
            return entity;
        }
        //属性转entity

    }, {
        key: 'attributeToEntity',
        value: function attributeToEntity(attribute, positions) {
            var entity = this.drawCtrl[attribute.type].attributeToEntity(attribute, positions);
            this.bindExtension(entity);
            return entity;
        }
        //绑定外部非Draw产生的entity到标绘

    }, {
        key: 'bindExtraEntity',
        value: function bindExtraEntity(entity, attribute) {
            attribute = attribute || {};
            attribute.type = attribute.type || attr.getTypeName(entity);
            attribute.style = attribute.style || {};
            // attribute = attr.addGeoJsonDefVal(attribute);

            var entity = this.drawCtrl[attribute.type].bindExtraEntity(entity, attribute);
            this.bindExtension(entity);

            entity.entityCollection.remove(entity); //从原有的集合中删除 
            this.dataSource.entities.add(entity); //加入到draw集合图层中
        }
        //==========对外接口========== 

    }, {
        key: 'setVisible',
        value: function setVisible(visible) {
            this._visible = visible;
            if (!visible) {
                this.stopDraw();
            }

            for (var i = 0; i < this.arrGroup.length; i++) {
                var layer = this.arrGroup[i];
                layer.show = visible;
            }
        }
        //是否存在绘制

    }, {
        key: 'hasDraw',
        value: function hasDraw() {
            for (var i = 0; i < this.arrGroup.length; i++) {
                var layer = this.arrGroup[i];
                if (layer.entities.values.length > 0) return true;
            }
            return false;
        }
        //获取所有绘制的实体对象列表

    }, {
        key: 'getEntitys',
        value: function getEntitys(noStop) {
            if (!noStop) this.stopDraw();

            var arr = [];
            for (var i = 0; i < this.arrGroup.length; i++) {
                var layer = this.arrGroup[i];
                var arrEntity = layer.entities.values;
                for (var j = 0, len = arrEntity.length; j < len; j++) {
                    var entity = arrEntity[j];
                    entity.attribute.group = layer.name; //记录分组信息
                    arr.push(entity);
                }
            }
            return arr;
        }
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

            for (var i = 0; i < this.arrGroup.length; i++) {
                var layer = this.arrGroup[i];
                if (this.viewer.dataSources.contains(layer)) {
                    this.viewer.dataSources.remove(layer, true);
                }
            }
            if (this.tooltip) {
                this.tooltip.destroy();
                delete this.tooltip;
            }

            _get(Draw.prototype.__proto__ || Object.getPrototypeOf(Draw.prototype), 'destroy', this).call(this);
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

        //获取所有分组

    }, {
        key: 'dataSources',
        get: function get() {
            return this.arrGroup;
        }

        //当前激活的分组

    }, {
        key: 'dataSource',
        get: function get() {
            return this._dataSourceAct;
        },
        set: function set(layer) {
            if (this._dataSourceAct) {
                //上一次的取消激活状态
                delete this._dataSourceAct.isActivate;
            }

            this._dataSourceAct = layer;
            if (this._dataSourceAct) {
                //本次的标记为激活状态
                this._dataSourceAct.isActivate = true;
            }

            if (this.drawCtrl) {
                for (var type in this.drawCtrl) {
                    this.drawCtrl[type].dataSource = layer;
                }
            }
        }
    }]);

    return Draw;
}(_MarsClass2.MarsClass);
//[静态属性]本类中支持的事件类型常量


Draw.event = {
    drawStart: _MarsClass2.eventType.drawStart,
    drawAddPoint: _MarsClass2.eventType.drawAddPoint,
    drawRemovePoint: _MarsClass2.eventType.drawRemovePoint,
    drawMouseMove: _MarsClass2.eventType.drawMouseMove,
    drawCreated: _MarsClass2.eventType.drawCreated,
    editStart: _MarsClass2.eventType.editStart,
    editMouseDown: _MarsClass2.eventType.editMouseDown,
    editMouseMove: _MarsClass2.eventType.editMouseMove,
    editMovePoint: _MarsClass2.eventType.editMovePoint,
    editRemovePoint: _MarsClass2.eventType.editRemovePoint,
    editStop: _MarsClass2.eventType.editStop,
    delete: _MarsClass2.eventType.delete,
    load: _MarsClass2.eventType.load

    //绑定到draw，方便外部使用
};Draw.Base = _Draw.DrawBase;
Draw.Billboard = _Draw3.DrawBillboard;
Draw.Circle = _Draw13.DrawCircle;
Draw.Cylinder = _Draw14.DrawCylinder;
Draw.Corridor = _Draw9.DrawCorridor;
Draw.Curve = _Draw7.DrawCurve;
Draw.Ellipsoid = _Draw15.DrawEllipsoid;
Draw.Label = _Draw4.DrawLabel;
Draw.Model = _Draw5.DrawModel;
Draw.Point = _Draw2.DrawPoint;
Draw.Polygon = _Draw10.DrawPolygon;
Draw.Polyline = _Draw6.DrawPolyline;
Draw.PolylineVolume = _Draw8.DrawPolylineVolume;
Draw.Rectangle = _Draw12.DrawRectangle;
Draw.Wall = _Draw16.DrawWall;
Draw.PolygonEx = _Draw11.DrawPolygonEx;

/***/ }),
