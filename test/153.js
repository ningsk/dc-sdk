/* 153 */
/***/ (function(module, exports) {

module.exports = "uniform mat4 myPorjection;\r\nattribute vec3 position;\r\nvarying vec2 depth;\r\nvoid main()\r\n{\r\nvec4 pos = vec4(position.xyz,1.0);\r\ndepth = pos.zw;\r\npos.z = 0.0;\r\ngl_Position = czm_projection*pos;\r\n}"

/***/ }),
