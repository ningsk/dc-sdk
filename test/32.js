/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.config2Entity = config2Entity;
exports.style2Entity = style2Entity;
exports.createDthEntity = createDthEntity;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _util = __webpack_require__(1);

var _point = __webpack_require__(2);

var _Attr = __webpack_require__(34);

var _Attr2 = __webpack_require__(12);

var _Attr3 = __webpack_require__(31);

var _Attr4 = __webpack_require__(35);

var _Attr5 = __webpack_require__(19);

var _Attr6 = __webpack_require__(21);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var nullColor = new Cesium.Color(0.0, 0.0, 0.0, 0.01);

//根据config配置，更新entitys
function config2Entity(entities, config, lblAddFun) {
    for (var i = 0, len = entities.length; i < len; i++) {
        var entity = entities[i];

        //属性 
        if (typeof config.getAttrVal === 'function') {
            var attr = config.getAttrVal(entity);
            entity.properties = attr || {}; //重新绑定，后续使用
        }

        //样式  
        var symbol = config.symbol;
        if (symbol) {
            if (typeof symbol === 'function') {
                //完全自定义的回调方法，自行处理entity
                symbol(entity, entity.properties);
            } else {
                setConfigSymbol(entity, config, lblAddFun);
            }
        }

        //popup、鼠标事件等
        bindMourseEvnet(entity, config);
    }

    return entities;
}

//根据config配置，更新entitys
function style2Entity(entities, style, lblAddFun) {
    for (var i = 0, len = entities.length; i < len; i++) {
        var entity = entities[i];
        //样式  
        setConfigSymbol(entity, { symbol: { styleOptions: style }, lblAddFun: lblAddFun });
    }
    return entities;
}

//外部配置的symbol
function setConfigSymbol(entity, config, lblAddFun) {
    var attr = entity.properties;
    if (attr && attr.type && attr.attr) {
        //说明是内部标绘生产的geojson
        attr = attr.attr;
    }
    attr = (0, _util.getAttrVal)(attr);

    var symbol = config.symbol;
    var styleOpt = symbol.styleOptions;

    if (symbol.styleField) {
        //存在多个symbol，按styleField进行分类
        var styleFieldVal = attr[symbol.styleField];
        var styleOptField = symbol.styleFieldOptions[styleFieldVal];
        if (styleOptField != null) {
            styleOpt = (0, _util.clone)(styleOpt);
            styleOpt = _extends({}, styleOpt, styleOptField);
        }
    }

    //外部使用代码示例
    // var layerWork = viewer.mars.getLayer(301087, "id")
    // layerWork.config.symbol.callback = function (attr, entity, styleOpt) {
    //     var val = attr.floor;
    //     if (val < 10)
    //         return { color: "#ff0000" };
    //     else
    //         return { color: "#0000ff" };
    // }
    var callback = symbol.callback || symbol.calback; //兼容不同参数名
    if (typeof callback === 'function') {
        //只是动态返回symbol的自定义的回调方法，返回style
        styleOpt = (0, _util.clone)(styleOpt);
        var styleOptField = callback(attr, entity, styleOpt);
        if (!styleOptField) return;

        styleOpt = _extends({}, styleOpt, styleOptField);
    }
    styleOpt = styleOpt || {};

    //兼容v1历史的 label.field 定义方式
    if (styleOpt.label && styleOpt.label.field) styleOpt.label.text = "{" + styleOpt.label.field + "}";

    var entityCollection = entity.entityCollection; //entity原有的集合

    //添加文本的统一回调方法 ，默认为entity方式，可以外部处理。
    function defaultLblAdd(position, labelattr, attr) {
        if (labelattr.text == "") return null;

        if (Cesium.defined(labelattr.height)) {
            position = (0, _point.setPositionsHeight)(position, labelattr.height);
        }

        var lblEx = entityCollection.add({
            position: position,
            label: labelattr,
            properties: attr
        });
        return lblEx;
    }
    lblAddFun = lblAddFun || defaultLblAdd;

    if (entity.polyline) {
        (0, _Attr5.style2Entity)(styleOpt, entity.polyline);

        //线时，加上文字标签 
        if (styleOpt.label && styleOpt.label.text) {
            if (entity._labelEx) {
                (0, _Attr2.style2Entity)(styleOpt.label, entity._labelEx.label, attr);
            } else {
                //计算中心点
                var pots = (0, _Attr5.getPositions)(entity);
                var position = pots[Math.floor(pots.length / 2)];
                if (styleOpt.label.position) {
                    if (styleOpt.label.position == "center") {
                        position = (0, _point.centerOfMass)(pots, styleOpt.label.height);
                    } else if ((0, _util.isNumber)(styleOpt.label.position)) {
                        position = pots[styleOpt.label.position];
                    }
                }

                //文本属性 
                var labelattr = (0, _Attr2.style2Entity)(styleOpt.label, null, attr);
                labelattr.heightReference = Cesium.defaultValue(labelattr.heightReference, Cesium.HeightReference.CLAMP_TO_GROUND);

                var lblEx = lblAddFun(position, labelattr, attr);
                if (lblEx) bindMourseEvnet(lblEx, config);
                entity._labelEx = lblEx;
            }
        }
    }
    if (entity.polygon) {
        (0, _Attr6.style2Entity)(styleOpt, entity.polygon);
        //是建筑物时
        if (config.buildings) {
            var floor = Number(attr[config.buildings.cloumn] || 1); //层数

            var height = 3.5; //层高
            var heightCfg = config.buildings.height;
            if ((0, _util.isNumber)(heightCfg)) {
                height = heightCfg;
            } else if ((0, _util.isString)(heightCfg)) {
                height = attr[heightCfg] || height;
            }

            entity.polygon.extrudedHeight = floor * height;
        }
        //是建筑物单体化时
        if (config.dth) {
            entity.polygon.classificationType = Cesium.ClassificationType.BOTH;
            if (!Cesium.defined(styleOpt.color)) entity.polygon.material = nullColor;
            entity.polygon.perPositionHeight = false;
            entity.polygon.zIndex = 99;
        }

        //加上线宽
        if (styleOpt.outlineWidth && styleOpt.outlineWidth > 1) {
            entity.polygon.outline = false;
            var outlineStyle = _extends({}, styleOpt, {
                "outline": false,
                "color": styleOpt.outlineColor,
                "width": styleOpt.outlineWidth,
                "opacity": styleOpt.outlineOpacity
            }, styleOpt.outlineStyle || {});
            if (entity._outlineEx) {
                (0, _Attr5.style2Entity)(outlineStyle, entity._outlineEx.polyline);
            } else {
                var polyline = (0, _Attr5.style2Entity)(outlineStyle);
                polyline.positions = (0, _Attr6.getPositions)(entity);
                var lineEx = entityCollection.add({
                    polyline: polyline,
                    properties: attr
                });
                bindMourseEvnet(lineEx, config);
                entity._outlineEx = lineEx;
            }
        }

        //面时，加上文字标签 
        if (styleOpt.label && styleOpt.label.text) {
            if (entity._labelEx) {
                (0, _Attr2.style2Entity)(styleOpt.label, entity._labelEx.label, attr);
            } else {
                //计算中心点 
                var position = (0, _point.centerOfMass)((0, _Attr6.getPositions)(entity), styleOpt.label.height);

                //文本属性            
                var labelattr = (0, _Attr2.style2Entity)(styleOpt.label, null, attr);
                labelattr.heightReference = Cesium.defaultValue(labelattr.heightReference, Cesium.HeightReference.CLAMP_TO_GROUND);

                var lblEx = lblAddFun(position, labelattr, attr);
                if (lblEx) bindMourseEvnet(lblEx, config);
                entity._labelEx = lblEx;
            }
        }
    }

    //entity本身存在文字标签 
    if (entity.label) {
        styleOpt.label = styleOpt.label || styleOpt || {};

        if (!Cesium.defined(styleOpt.label.clampToGround) && !Cesium.defined(styleOpt.label.heightReference)) styleOpt.label.heightReference = Cesium.defaultValue(styleOpt.label.heightReference, Cesium.HeightReference.CLAMP_TO_GROUND);

        (0, _Attr2.style2Entity)(styleOpt.label, entity.label, attr);
    } else {
        //外部完全自定义的方式
        if (styleOpt.label && typeof styleOpt.label === 'function') {
            styleOpt.label(entity, attr, function (position, styleLbl) {
                //文本属性
                var labelattr = (0, _Attr2.style2Entity)(styleLbl, null, attr);
                labelattr.heightReference = Cesium.defaultValue(labelattr.heightReference, Cesium.HeightReference.CLAMP_TO_GROUND);

                var lblEx = lblAddFun(position, labelattr, attr);
                if (lblEx) bindMourseEvnet(lblEx, config);
            });
        }
    }

    //图标时
    if (entity.billboard) {
        if (!Cesium.defined(styleOpt.clampToGround) && !Cesium.defined(styleOpt.heightReference)) styleOpt.heightReference = Cesium.defaultValue(styleOpt.heightReference, Cesium.HeightReference.CLAMP_TO_GROUND);
        // 可采用格式化字符串
        styleOpt.image = (0, _util.template)(styleOpt.image, attr);

        (0, _Attr.style2Entity)(styleOpt, entity.billboard);

        //支持小模型
        if (styleOpt.model) {
            if (entity._modelEx) {
                (0, _Attr3.style2Entity)(styleOpt.model, entity._modelEx.model);
            } else {
                var modelattr = (0, _Attr3.style2Entity)(styleOpt.model);
                modelattr.heightReference = Cesium.defaultValue(modelattr.heightReference, Cesium.HeightReference.CLAMP_TO_GROUND);

                var modelEx = entityCollection.add({
                    position: entity.position,
                    model: modelattr,
                    properties: attr
                });
                bindMourseEvnet(lblEx, config);
                entity._modelEx = modelEx;
            }
        }

        //支持point
        if (styleOpt.point) {
            if (entity._pointEx) {
                (0, _Attr4.style2Entity)(styleOpt.point, entity._pointEx.point);
            } else {
                var modelattr = (0, _Attr4.style2Entity)(styleOpt.point);
                modelattr.heightReference = Cesium.defaultValue(modelattr.heightReference, Cesium.HeightReference.CLAMP_TO_GROUND);

                var pointEx = entityCollection.add({
                    position: entity.position,
                    point: modelattr,
                    properties: attr
                });
                bindMourseEvnet(lblEx, config);
                entity._pointEx = pointEx;
            }
        }

        //加上文字标签 (entity本身不存在label时)
        if (styleOpt.label && styleOpt.label.text && !entity.label) {
            if (entity._labelEx) {
                (0, _Attr2.style2Entity)(styleOpt.label, entity._labelEx.label, attr);
            } else {
                //计算中心点 
                var position = entity.position;

                //文本属性      
                var labelattr = (0, _Attr2.style2Entity)(styleOpt.label, null, attr);
                labelattr.heightReference = Cesium.defaultValue(labelattr.heightReference, Cesium.HeightReference.CLAMP_TO_GROUND);

                var lblEx = lblAddFun(position, labelattr, attr);
                if (lblEx) bindMourseEvnet(lblEx, config);
                entity._labelEx = lblEx;
            }
        }
    }

    //记录下样式配置
    entity.styleOpt = styleOpt;
}

//鼠标事件，popup tooltip
function bindMourseEvnet(entity, config) {
    //popup弹窗
    if (config.columns || config.popup) {
        entity.popup = (0, _util.bindLayerPopup)(config.popup, function (entity) {
            var attr = entity.properties || entity.attribute;
            if (attr && attr.type && attr.attr) {
                //说明是内部标绘生产的geojson
                attr = attr.attr;
            }
            if ((0, _util.isString)(attr)) return attr;else return (0, _util.getPopupForConfig)(config, attr);
        });
    }
    if (config.tooltip) {
        entity.tooltip = (0, _util.bindLayerPopup)(config.tooltip, function (entity) {
            var attr = entity.properties || entity.attribute;
            if (attr && attr.type && attr.attr) {
                //说明是内部标绘生产的geojson
                attr = attr.attr;
            }

            if ((0, _util.isString)(attr)) return attr;else return (0, _util.getPopupForConfig)({ popup: config.tooltip }, attr);
        });
    }

    if (config.eventTarget) {
        entity.eventTarget = config.eventTarget;
    } else {
        if (config.click) {
            entity.click = config.click;
        }
        if (config.mouseover) {
            entity.mouseover = config.mouseover;
        }
        if (config.mouseout) {
            entity.mouseout = config.mouseout;
        }
    }

    if (config.contextmenuItems) {
        entity.contextmenuItems = config.contextmenuItems;
    }
}

//单体化处理 
var nullColor = new Cesium.Color(0.0, 0.0, 0.0, 0.01);
var highlighted_hierarchy; //单体化坐标位置

var highlighColor; //高亮时颜色
var highlightedEntity; //单体化显示的面

function mouseover(entity) {
    //移入 
    highlighted_hierarchy = entity.polygon.hierarchy.getValue((0, _util.currentTime)());
    highlightedEntity.polygon.show = true;

    highlightedEntity.properties = entity.properties;
    highlightedEntity.tooltip = entity.tooltip ? entity.tooltip : null;
    highlightedEntity.popup = entity.popup ? entity.popup : null;
}

function mouseout() {
    //移出
    if (Cesium.defined(highlightedEntity)) {
        highlightedEntity.polygon.show = false;
    }
}

//创建单体化显示的面【每个对象只用一次】
function createDthEntity(dataSource, styleOpt) {
    styleOpt = styleOpt || {};

    if (!highlightedEntity) {
        //高亮时颜色
        highlighColor = Cesium.Color.fromCssColorString(Cesium.defaultValue(styleOpt.color, "#ffff00")).withAlpha(Cesium.defaultValue(styleOpt.opacity, 0.3)); //高亮时颜色

        //单体化显示的面
        highlightedEntity = dataSource.entities.add({
            name: "单体化高亮面",
            noMouseMove: true, //标识下，内部不监听其移入事件 
            polygon: {
                perPositionHeight: false,
                classificationType: Cesium.ClassificationType.BOTH,
                material: highlighColor,
                hierarchy: new Cesium.CallbackProperty(function (time) {
                    return highlighted_hierarchy;
                }, false),
                zIndex: 0
            }
        });
    }

    return {
        mouseover: mouseover,
        mouseout: mouseout
    };
}

/***/ }),
