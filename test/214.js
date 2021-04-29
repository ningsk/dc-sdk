/* 214 */
/***/ (function(module, exports) {

module.exports = "uniform vec4 u_color;\nczm_material czm_getMaterial(czm_materialInput materialInput){\n    czm_material material = czm_getDefaultMaterial(materialInput);\n    vec2 st = materialInput.st;\n    float powerRatio = 1./(fract(czm_frameNumber / 30.0) +  1.) ;\n    float alpha = pow(1. - st.t,powerRatio);\n    vec4 color = vec4(u_color.rgb, alpha*u_color.a);\n    material.diffuse = color.rgb;\n    material.alpha = color.a;\n    return material;\n}"

/***/ }),