/* 204 */
/***/ (function(module, exports) {

module.exports = "attribute vec3 position3DHigh;\nattribute vec3 position3DLow;\nattribute vec2 st;\nattribute float batchId;\n\nvarying vec3 v_positionMC;\nvarying vec3 v_positionEC;\nvarying vec2 v_st;\n\nvoid main()\n{\n    vec4 p = czm_computePosition();\n\n    v_positionMC = position3DHigh + position3DLow;           // position in model coordinates\n    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;     // position in eye coordinates\n    v_st = st;\n\n    gl_Position = czm_modelViewProjectionRelativeToEye * p;\n}\n"

/***/ }),