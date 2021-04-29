/* 221 */
/***/ (function(module, exports) {

module.exports = "attribute vec3 position3DHigh;\nattribute vec3 position3DLow;\nattribute vec3 normal;\nattribute vec2 st;\nattribute float batchId;\nvarying vec2 v_st;\nvarying vec3 v_normalEC;\nvarying vec3 v_positionEC;\nvoid main()\n{\n    vec4 p = czm_translateRelativeToEye(position3DHigh,position3DLow);\n    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;\n    v_normalEC = czm_normal * normal;\n    v_st=st;\n    gl_Position = czm_modelViewProjectionRelativeToEye * p;\n}"

/***/ }),
