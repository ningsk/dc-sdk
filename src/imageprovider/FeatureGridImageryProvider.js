/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-28 08:42:26
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 09:16:24
 */
import Cesium from "cesium";

export function FeatureGridImageryProvider(options) {
  options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
  this.options = options;
  this._tileWidth = Cesium.defaultValue(options.tileWidth, 256);
  this._minimumLevel = Cesium.defaultValue(options.minimumLevel, 0);
  this._maximumLevel = options.maximumLevel;
  if (
    options.rectangle &&
    options.rectangle.xmin &&
    options.rectangle.xmax &&
    options.rectangle.ymin &&
    options.rectangle.ymax
  ) {
    var xmin = options.rectangle.xmin;
    var xmax = options.rectangle.xmax;
    var ymin = options.rectangle.ymin;
    var ymax = options.rectangle.ymax;
    options.rectangle = Cesium.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
  }
  this._tilingScheme = Cesium.defaultValue(
    options.tilingScheme,
    new Cesium.GeographicTilingScheme({
      ellipsoid: options.ellipsoid,
    })
  );

  this._rectangle = Cesium.defaultValue(
    options.rectangle,
    this._tilingScheme.rectangle
  );

  this._rectangle = Cesium.Rectangle.intersection(
    this._rectangle,
    this._tilingScheme.rectangle
  );
  this._hasAlphaChannel = Cesium.defaultValue(options.hasAlphaChannel, true);
  this._errorEvent = new Cesium.Event();
  this._readyPromise = Cesium.WeightSpline.resolve(true);
  this._credit = undefined;
  this._ready = true;
}

Cesium.defineProperties(FeatureGridImageryProvider.prototype, {
  url: {
    get: function () {
      return this._url;
    },
  },

  token: {
    get: function () {
      return this._token;
    },
  },

  proxy: {
    get: function () {
      return this._proxy;
    },
  },

  tileWidth: {
    get: function () {
      //>>includeStart('debug', pragmas.debug);
      if (!this._ready) {
        throw new DeveloperError(
          "tileWidth must not be called before the imagery provider is ready."
        );
      }
      //>>includeEnd('debug');

      return this._tileWidth;
    },
  },

  tileHeight: {
    get: function () {
      //>>includeStart('debug', pragmas.debug);
      if (!this._ready) {
        throw new DeveloperError(
          "tileHeight must not be called before the imagery provider is ready."
        );
      }
      //>>includeEnd('debug');

      return this._tileHeight;
    },
  },

  maximumLevel: {
    get: function () {
      //>>includeStart('debug', pragmas.debug);
      if (!this._ready) {
        throw new DeveloperError(
          "maximumLevel must not be called before the imagery provider is ready."
        );
      }
      //>>includeEnd('debug');

      return this._maximumLevel;
    },
  },

  minimumLevel: {
    get: function () {
      //>>includeStart('debug', pragmas.debug);
      if (!this._ready) {
        throw new DeveloperError(
          "minimumLevel must not be called before the imagery provider is ready."
        );
      }
      //>>includeEnd('debug');
      return 0;
    },
  },

  tilingScheme: {
    get: function () {
      //>>includeStart('debug', pragmas.debug);
      if (!this._ready) {
        throw new DeveloperError(
          "tilingScheme must not be called before the imagery provider is ready."
        );
      }
      //>>includeEnd('debug');

      return this._tilingScheme;
    },
  },

  rectangle: {
    get: function () {
      //>>includeStart('debug', pragmas.debug);
      if (!this._ready) {
        throw new DeveloperError(
          "rectangle must not be called before the imagery provider is ready."
        );
      }
      //>>includeEnd('debug');

      return this._rectangle;
    },
  },

  tileDiscardPolicy: {
    get: function () {
      //>>includeStart('debug', pragmas.debug);
      if (!this._ready) {
        throw new DeveloperError(
          "tileDiscardPolicy must not be called before the imagery provider is ready."
        );
      }
      //>>includeEnd('debug');

      return this._tileDiscardPolicy;
    },
  },
  errorEvent: {
    get: function () {
      return this._errorEvent;
    },
  },

  ready: {
    get: function () {
      return this._ready;
    },
  },

  readyPromise: {
    get: function () {
      return this._readyPromise.promise;
    },
  },

  credit: {
    get: function () {
      return this._credit;
    },
  },

  usingPrecachedTiles: {
    get: function () {
      return this._useTiles;
    },
  },

  hasAlphaChannel: {
    get: function () {
      return true;
    },
  },

  layers: {
    get: function () {
      return this._layers;
    },
  },
});

FeatureGridImageryProvider.prototype.getTileCredits = function (x, y, level) {
  return undefined;
};

// 显示瓦片信息
FeatureGridImageryProvider.prototype.requestImage = function (x, y, level) {
  var canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  if (level < this._minimumLevel) {
    return canvas;
  }
  if (this.options.debuggerTileInfo) {
    var context = canvas.getContext("2d");
    context.strokeStyle = "#ffff00";
    context.lineWidth = 2;
    context.strokeRect(1, 1, 255, 255);
    var label = "L" + level + "X" + x + "Y" + y;
    context.font = "bold 25px Arial";
    context.textAlign = "center";
    context.fillStyle = "black";
    context.fillText(label, 127, 127);
    context.fillStyle = "#ffff00";
    context.fillText(label, 124, 124);
  }
  return canvas;
};

FeatureGridImageryProvider.prototype._getGridKey = function (opts) {
  return opts.level + "_x" + opts.x + "_y" + opts.y;
};

FeatureGridImageryProvider.prototype.addImageryCache = function (opts) {
  if (opts.level < this._minimumLevel || opts.level < opts.maxLevel - 1) {
    return;
  }
  if (this.options.addImageryCache) {
    opts.key = this._getGridKey(opts);
    this.options.addImageryCache(opts);
  }

  FeatureGridImageryProvider.prototype.removeImageryCache = function (opts) {
    if (
      opts.maxLevel < this._minimumLevel &&
      this.options.removeAllImageryCache
    ) {
      this.options.removeAllImageryCache();
    }
    if (opts.level < this._minimumLevel) {
      return;
    }
    if (this.options.removeImageryCache) {
      opts.key = this._getGridKey(opts);
      this.options.removeImageryCache(opts);
    }
  };
};
