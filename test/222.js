/* 222 */
/***/ (function(module, exports) {

module.exports = "varying vec3 v_positionEC;\nvarying vec3 v_normalEC;\nvarying vec2 v_st;\nvoid main()\n{\n    vec3 positionToEyeEC = -v_positionEC;\n    vec3 normalEC = normalize(v_normalEC);\n    #ifdef FACE_FORWARD\n        normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n    #endif\n    czm_materialInput materialInput;\n    materialInput.normalEC = normalEC;\n    materialInput.positionToEyeEC = positionToEyeEC;\n    materialInput.st = v_st;\n    czm_material material = czm_getMaterial(materialInput);\n    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n}"

/***/ }),