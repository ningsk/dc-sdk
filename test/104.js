/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WFSLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _CustomFeatureGridLayer = __webpack_require__(42);

var _util = __webpack_require__(1);

var _zepto = __webpack_require__(8);

var _log = __webpack_require__(5);

var marslog = _interopRequireWildcard(_log);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WFSLayer = exports.WFSLayer = function (_CustomFeatureGridLay) {
    _inherits(WFSLayer, _CustomFeatureGridLay);

    function WFSLayer() {
        _classCallCheck(this, WFSLayer);

        return _possibleConstructorReturn(this, (WFSLayer.__proto__ || Object.getPrototypeOf(WFSLayer)).apply(this, arguments));
    }

    _createClass(WFSLayer, [{
        key: 'getDataForGrid',

        //获取网格内的数据，callback为回调方法，参数传数据数组 
        value: function getDataForGrid(opts, callback) {
            var that = this;

            //请求的wfs参数
            var parameters = {
                service: "WFS",
                request: "GetFeature",
                typeName: this.options.layer || this.options.typeName,
                version: "1.0.0",
                outputFormat: "application/json",
                bbox: opts.rectangle.xmin + "," + opts.rectangle.ymin + "," + opts.rectangle.xmax + "," + opts.rectangle.ymax
            };

            //其他可选参数
            if (Cesium.defined(this.options.parameters)) {
                for (var key in this.options.parameters) {
                    parameters[key] = this.options.parameters[key];
                }
            }

            _zepto.zepto.ajax({
                url: this.options.url,
                type: "get",
                data: parameters,
                success: function success(featureCollection) {
                    if (!that._visible || !that._cacheGrid[opts.key]) {
                        return; //异步请求结束时,如果已经卸载了网格就直接跳出。
                    }

                    if (featureCollection == undefined || featureCollection == null) {
                        return; //数据为空
                    }

                    if (featureCollection.type == "Feature") featureCollection = { "type": "FeatureCollection", "features": [featureCollection] };

                    callback(featureCollection.features);
                },
                error: function error(data) {
                    marslog.warn("请求出错(" + data.status + ")：" + data.statusText);
                }
            });
        }
        //根据数据创造entity

    }, {
        key: 'createEntity',
        value: function createEntity(opts, item, callback) {
            if (this.options.dth && this.options.dth.buffer > 0) {
                //是建筑物单体化时,缓冲扩大点范围
                item = (0, _util.buffer)(item, this.options.dth.buffer);
            }

            var that = this;
            var dataSource = Cesium.GeoJsonDataSource.load(item, this.options);
            dataSource.then(function (dataSource) {
                if (that.checkHasBreak[opts.key]) {
                    return; //异步请求结束时，如果已经卸载了网格就直接跳出。
                }

                if (dataSource.entities.values.length == 0) return null;
                var entity = dataSource.entities.values[0];
                entity.entityCollection.remove(entity); //从原有的集合中删除  

                entity._id = that.options.id + "_" + opts.key + "_" + entity.id;

                that._addEntity(entity, callback);
            }).otherwise(function (error) {
                that.showError("服务出错", error);
            });

            return null;
        }
        //更新entity，并添加到地图上

    }, {
        key: '_addEntity',
        value: function _addEntity(entity, callback) {
            // this.dataSource.entities.removeById(entity._id); 
            // if (this.dataSource.entities.contains(entity))return          
            if (this.dataSource.entities.getById(entity._id)) return;

            this.dataSource.entities.add(entity); //加入到当前图层集合图层中

            //根据config配置，更新entitys  
            this.config2Entity(entity);

            callback(entity);
        }
    }]);

    return WFSLayer;
}(_CustomFeatureGridLayer.CustomFeatureGridLayer);

/***/ }),
