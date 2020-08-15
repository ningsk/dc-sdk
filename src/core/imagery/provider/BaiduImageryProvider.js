import ImageryType from "../ImageryType";
import Cesium from "cesium";

const TEMP_MAP_URL =
  'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid={style}'

class BaiduImageryProvider {
  constructor(options = {}) {
    this._url = TEMP_MAP_URL
    // 图像图块的像素宽度
    this._tileWidth = 256
    // 图像图块的像素高度
    this._tileHeight = 256
    // 图像提供支持的最大详细程度，如果没有限制，则为未定义。
    this._maximumLevel = 18
    // 引用WebMercatorProjection(EPSG:3857)的集合图形平铺方案。这是Google Maps,
    // Microsoft Bing Maps 和大多数ESRI ArcGis Online 使用的切片方案。
    // WebMercatorProjection 是Google Maps，Bing Maps和大多数ArcGIS Online使用的
    // 地图投影，这个投影使用的是WGS84表示的经度和纬度，并使用球形（而不是椭圆形）方程
    // 一点补充：
    // Web Mercator 支持的最大纬度（北和南）投影。技术上讲，墨卡托投影已定义适用于高达（但并不包括）90度
    // 的任何纬度，但是这是有道理的尽快将其切断，因为它随着纬度的增加呈指数增长。此特定临界值背后的逻辑是Goole Maps，
    // bing maps 和esri是它进行投影广场。即，矩形在x和y方向上相等。
    this._tilingScheme = new Cesium.WebMercatorTilingScheme({
      // 矩形所覆盖的矩形的西南角 平铺方案，以米为单位。如果未指定此参数，则整个经度方向上覆盖地球，在纬度方向上覆盖相等的距离，形成正方形投影
      rectangleSouthwestInMeters: new Cesium.Cartesian2(-33554054, -33746824),
      // 矩形所覆盖的矩形的东北角 平铺方案，以米为单位。如果未指定此参数，则整个在经度方向上覆盖地球，在纬度方向上覆盖相等的距离，形成正方形投影
      rectangleNortheastInMeters: new Cesium.Cartesian2(33554054, 33746824)
    })
    this._rectangle = this._tilingScheme.rectangle
    this._credit = undefined
    this._style = options.style || 'normal'
  }

  get url() {
    return this._url
  }

  get token() {
    return this._token
  }

  get tileWidth() {
    if (!this.ready) {
      throw new Cesium.DeveloperError(
        'tileWidth must not be called before the imagery provider is ready.'
      )
    }
    return this._tileWidth
  }

  get tileHeight() {
    if (!this.ready) {
      throw new Cesium.DeveloperError(
        'tileHeight must not be called before the imagery provider is ready.'
      )
    }
    return this._tileHeight
  }

  get maximumLevel() {
    if (!this.ready) {
      throw new Cesium.DeveloperError(
        'maximumLevel must not be called before the imagery provider is ready.'
      )
    }
    return this._maximumLevel
  }

  get minimumLevel() {
    if (!this.ready) {
      throw new Cesium.DeveloperError(
        'minimumLevel must not be called before the imagery provider is ready.'
      )
    }
    return 0
  }

  get tilingScheme() {
    if (!this.ready) {
      throw new Cesium.DeveloperError(
        'tilingScheme must not be called before the imagery provider is ready.'
      )
    }
    return this._tilingScheme
  }

  get rectangle() {
    if (!this.ready) {
      throw new Cesium.DeveloperError(
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

  getTileCredits(x, y, level) {}

  requestImage(x, y, level) {
    if (!this.ready) {
      throw new Cesium.DeveloperError(
        'requestImage must not be called before the imagery provider is ready.'
      )
    }
    let xTiles = this._tilingScheme.getNumberOfXTilesAtLevel(level)
    let yTiles = this._tilingScheme.getNumberOfYTilesAtLevel(level)
    let url = this._url
      .replace('{x}', x - xTiles / 2)
      .replace('{y}', yTiles / 2 - y - 1)
      .replace('{z}', level)
      .replace('{s}', 1)
      .replace('{style}', this._style)
    return Cesium.ImageryProvider.loadImage(this, url)
  }
}


export default BaiduImageryProvider