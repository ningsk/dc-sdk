<!--
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-11 11:07:18
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-28 10:40:51
-->

# DC-SDK
基于 cesium 的三维 sdk  

## 安装

**YARN**

```
yarn add @ningsk/dc-sdk
```

## 设置

```
//webpack.config.js
const path = require('path')
const CopywebpackPlugin = require('copy-webpack-plugin')
const dcDist = "./node_modules/@ningsk/"
module.exports = {
  // other settings
  plugins:[
    new CopyWebpackPlugin([
      {  
        from: path.join(dcDist, 'dc-sdk/dist/resources'),
        to: 'libs/dc-sdk/resources' 
      }
    ])
  ]

```
