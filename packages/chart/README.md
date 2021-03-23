# DC-SDK

<p>
<img src="https://img.shields.io/github/workflow/status/ningsk/dc-sdk/publish"/>
<img src="https://img.shields.io/badge/license-Apache%202-blue"/>
<img src="https://img.shields.io/npm/v/@ningsk/dc-sdk?color=orange&logo=npm" />
<img src="https://img.shields.io/npm/dt/@ningsk/dc-sdk?logo=npm"/>
</p>

**_`DC-SDK`_** is based on the open source project **_`Cesium`_** for the second development of two three-dimensional **_`WebGis`_** application framework , the framework optimizes the use of **_`Cesium`_** and adds some additional features , designed for developers to quickly build **_`WebGis`_** application.

## Home

> http://dc.ningsk.cn

```warning
Tips：This SDK is JS+GIS framework package. Developers need to have some front-end technology and GIS related technology
```

## Installation

`NPM / YARN` **_`(Recommend)`_**

Installing with NPM or YARN is recommended and it works seamlessly with webpack.

```node
yarn add @ningsk/dc-sdk
-------------------------
npm install @ningsk/dc-sdk
```

```js
import DC from '@ningsk/dc-sdk/dist/dc.base.min'
import DcCore from '@ningsk/dc-sdk/dist/dc.core.min'
import DcChart from '@ningsk/dc-sdk/dist/dc.chart.min'
import DcMapv from '@ningsk/dc-sdk/dist/dc.mapv.min'
import '@ningsk/dc-sdk/dist/dc.core.min.css'
```

`NPM / YARN` **_`(On-demand)`_**

```node
yarn add @ningsk/dc-base
yarn add @ningsk/dc-core
yarn add @ningsk/dc-chart
yarn add @ningsk/dc-mapv
-------------------------
npm install @ningsk/dc-base
npm install @ningsk/dc-core
npm install @ningsk/dc-chart
npm install @ningsk/dc-mapv
```

```js
import DC from '@ningsk/dc-base'
import DcCore from '@ningsk/dc-core'
import DcChart from '@ningsk/dc-chart'
import DcMapv from '@ningsk/dc-mapv'
import '@ningsk/dc-core/dist/dc.core.min.css'
```

`CDN`

[Resources 下载链接](https://github.com/ningsk/dc-sdk/tree/master/dist)

```html
<script src="https://cdn.jsdelivr.net/npm/@ningsk/dc-sdk/dist/dc.base.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@ningsk/dc-sdk/dist/dc.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@ningsk/dc-sdk/dist/dc.chart.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@ningsk/dc-sdk/dist/dc.mapv.min.js"></script>
<link
  href="https://cdn.jsdelivr.net/npm/@ningsk/dc-sdk/dist/dc.core.min.css"
  rel="stylesheet"
  type="text/css"
/>
```

```
Please put the resources in the project root directory libs/dc-sdk, if you put it in other directory, the framework will not run properly.
```

## Configuration

> The configuration is mainly used in the `NPM / YARN` way

Since the DC framework sets `CESIUM_BASE_URL` to `JSON.stringify('. /libs/dc-sdk/resources/')`, you need to copy `Cesium` static resource files: `Assets`, `Workers`, `ThirdParty` to the `libs/dc-sdk/resources` directory of the project to ensure that the 3D scene can be rendered properly.

`Webpack`

[Project Template](https://github.com/cavencj/dc-vue-app)

```js
// webpack.config.js
const path = require('path')
const CopywebpackPlugin = require('copy-webpack-plugin')
const ningskDist = './node_modules/@ningsk'

module.exports = {
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(ningskDist, 'dc-sdk/dist/resources'),
        to: 'libs/dc-sdk/resources',
      },
    ]),
  ],
}
```

`Vue2.x`

[Project Template](https://github.com/ningsk/dc-vue)

```js
// vue.config.js
const path = require('path')
const CopywebpackPlugin = require('copy-webpack-plugin')
const ningskDist = './node_modules/@ningsk'
module.exports = {
  chainWebpack: (config) => {
    config.plugin('copy').use(CopywebpackPlugin, [
      [
        {
          from: path.join(ningskDist, 'dc-sdk/dist/resources'),
          to: 'libs/dc-sdk/resources',
        },
      ],
    ])
  },
}
```

`Vue3.x`

[Project Template](https://github.com/ningsk/dc-vue-next)

```js
// vue.config.js
const path = require('path')
const CopywebpackPlugin = require('copy-webpack-plugin')
const ningskDist = './node_modules/@ningsk'
module.exports = {
  chainWebpack: (config) => {
    config.plugin('copy').use(CopywebpackPlugin, [
      {
        patterns: [
          {
            from: path.join(ningskDist, 'dc-sdk/dist/resources'),
            to: path.join(__dirname, 'dist', 'libs/dc-sdk/resources'),
          },
        ],
      },
    ])
  },
}
```


## Start

```js
global.DC = DC
DC.use(DcCore) // node
DC.ready(() => {
  let viewer = new DC.Viewer(divId) // divId is the Id attribute value of a div node. If it is not passed in, the 3D scene cannot be initialized
})
```

## Documentation

[DC Sdk Api](https://resource.ningsk.cn/dc-docs/v2.x)

[Cesium Api](https://cesium.com/docs/cesiumjs-ref-doc/)

## Demo

|  ![picture](http://dc.ningsk.cn/examples/images/baselayer/baidu.png?v=1) | ![picture](http://dc.ningsk.cn/examples/images/baselayer/tdt.png?v=1) | ![picture](http://dc.ningsk.cn/examples/images/baselayer/arcgis.png?v=2) | ![picture](http://dc.ningsk.cn/examples/images/mini-scene/china.gif) |
|  :-----------------------------------------------------------: | :-----------------------------------------------------------: | :------------------------------------------------------------------: | :--------------------------------------------------------------: |
|  ![picture](http://dc.ningsk.cn/examples/images/mini-scene/dfmz.gif) | ![picture](http://dc.ningsk.cn/examples/images/mini-scene/factory.gif?v=1) | ![picture](http://dc.ningsk.cn/examples/images/layer/cluster_circle.gif) | ![picture](http://dc.ningsk.cn/examples/images/model/shp_custom_shader.gif) |
|  ![picture](http://dc.ningsk.cn/examples/images/overlay/polyline_image_trail.gif) | ![picture](http://dc.ningsk.cn/examples/images/overlay/wall_trail.gif?v=1) | ![picture](http://dc.ningsk.cn/examples/images/overlay/water.gif?v=2)  |  ![picture](http://dc.ningsk.cn/examples/images/overlay/plot-overlay.png)   |

[More>>](http://dc.ningsk.cn/#/examples)

## Ecosystem

|  Module | Status | Description | 
|  :------ | :------: | :------ |
|  [dc-chart](https://github.com/ningsk/dc-chart) | <img src="https://img.shields.io/npm/v/@ningsk/dc-chart?logo=npm" /> | dc chart module for adding ECharts functionality in 3d scenes | 
|  [dc-mapv](https://github.com/ningsk/dc-mapv) | <img src="https://img.shields.io/npm/v/@ningsk/dc-mapv?logo=npm" /> | dc big-data module for adding MAPV functions in 3d scenes |  
|  [dc-ui](https://github.com/ningsk/dc-ui) | <img src="https://img.shields.io/npm/v/@ningsk/dc-ui?logo=npm" /> | dc components for Vue2.x | 
|  dc-ui-next | <img src="https://img.shields.io/npm/v/@ningsk/dc-ui-next?logo=npm" /> | dc components for Vue3.x |

## Copyright

```warning
1. The framework is a basic platform, completely open source, which can be modified and reconstructed by any individual or institution without our authorization.
2. We are not responsible for any problems arising from the modification of the framework by individuals and organizations.
3. Some industrial plug-ins and tools will be added in the later stage, and the code will be open source appropriately.
4. The package released by us may be used permanently and free of charge by any person or organization subject to:
  1) complete package reference;
  2) reserve this copyright information in the console output
We reserve the right of final interpretation of this copyright information.
```

## Support

> if dc-sdk can bring benefits to you, please support it ~

<p>
<a href="https://www.paypal.com/paypalme/cavencj" target="_blank">
<img src="https://www.paypalobjects.com/images/shared/paypal-logo-129x32.svg" style="margin-top:10px" />
</a>
</p>

## Thanks
