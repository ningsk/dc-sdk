/* 197 */
/***/ (function(module, exports) {

module.exports = "attribute vec4 position;\r\nattribute vec3 normal;\r\n\r\nvarying vec3 v_position;\r\nvarying vec3 v_positionWC;\r\nvarying vec3 v_positionEC;\r\nvarying vec3 v_normalEC;\r\n\r\nvoid main()\r\n{\r\n    gl_Position = czm_modelViewProjection * position;\r\n    v_position = vec3(position);\r\n    v_positionWC = (czm_model * position).xyz;\r\n    v_positionEC = (czm_modelView * position).xyz;\r\n    v_normalEC = czm_normal * normal;\r\n}"

/***/ }),
