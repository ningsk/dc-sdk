/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaiduImageryProvider = undefined;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function BaiduImageryProvider(option) {
    var url = option.url;
    if (Cesium.defined(option.layer)) {
        switch (option.layer) {
            case "vec":
                url = 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'ph' : 'pl') + '&scaler=1&p=1';
                break;
            case "img_d":
                url = 'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46';
                break;
            case "img_z":
                url = 'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'sh' : 'sl') + '&v=020';
                break;

            case "custom":
                //Custom 各种自定义样式
                //可选值：dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
                option.customid = option.customid || 'midnight';
                url = 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=' + option.customid;
                break;

            case "time":
                //实时路况
                var time = new Date().getTime();
                url = 'http://its.map.baidu.com:8002/traffic/TrafficTileService?x={x}&y={y}&level={z}&time=' + time + '&label=web2D&v=017';
                break;
        }
    }
    this._url = url;

    this._tileWidth = 256;
    this._tileHeight = 256;
    this._maximumLevel = 18;

    this._tilingScheme = new Cesium.WebMercatorTilingScheme({
        rectangleSouthwestInMeters: new Cesium.Cartesian2(-33554054, -33746824),
        rectangleNortheastInMeters: new Cesium.Cartesian2(33554054, 33746824)
    });

    this._credit = undefined;
    this._rectangle = this._tilingScheme.rectangle;
    this._ready = true;
} //百度地图

Object.defineProperties(BaiduImageryProvider.prototype, {
    url: {
        get: function get() {
            return this._url;
        }
    },

    token: {
        get: function get() {
            return this._token;
        }
    },

    proxy: {
        get: function get() {
            return this._proxy;
        }
    },

    tileWidth: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('tileWidth must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._tileWidth;
        }
    },

    tileHeight: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('tileHeight must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._tileHeight;
        }
    },

    maximumLevel: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('maximumLevel must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._maximumLevel;
        }
    },

    minimumLevel: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('minimumLevel must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return 0;
        }
    },

    tilingScheme: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('tilingScheme must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._tilingScheme;
        }
    },

    rectangle: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('rectangle must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._rectangle;
        }
    },

    tileDiscardPolicy: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._tileDiscardPolicy;
        }
    },

    errorEvent: {
        get: function get() {
            return this._errorEvent;
        }
    },

    ready: {
        get: function get() {
            return this._ready;
        }
    },

    readyPromise: {
        get: function get() {
            return this._readyPromise.promise;
        }
    },

    credit: {
        get: function get() {
            return this._credit;
        }
    },

    usingPrecachedTiles: {
        get: function get() {
            return this._useTiles;
        }
    },

    hasAlphaChannel: {
        get: function get() {
            return true;
        }
    },

    layers: {
        get: function get() {
            return this._layers;
        }
    }
});

BaiduImageryProvider.prototype.getTileCredits = function (x, y, level) {
    return undefined;
};

BaiduImageryProvider.prototype.requestImage = function (x, y, level) {
    if (!this._ready) {
        throw new DeveloperError('requestImage must not be called before the imagery provider is ready.');
    }

    var xTiles = this._tilingScheme.getNumberOfXTilesAtLevel(level);
    var yTiles = this._tilingScheme.getNumberOfYTilesAtLevel(level);

    var url = this._url.replace('{x}', x - xTiles / 2).replace('{y}', yTiles / 2 - y - 1).replace('{z}', level).replace('{s}', "0");

    return Cesium.ImageryProvider.loadImage(this, url);
};

exports.BaiduImageryProvider = BaiduImageryProvider;

/***/ }),
