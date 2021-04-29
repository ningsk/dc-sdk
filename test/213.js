/* 213 */
/***/ (function(module, exports) {

module.exports = "uniform vec4 u_color;\nczm_material czm_getMaterial(czm_materialInput materialInput){\n    czm_material material = czm_getDefaultMaterial(materialInput);\n    vec2 st = materialInput.st;\n    float time = fract(czm_frameNumber / 90.) ;\n    vec2 new_st = fract(st-vec2(time,time));\n    vec4 color = texture2D(image,new_st);\n\n    vec3 diffuse = color.rgb;\n    float alpha = color.a;\n    diffuse *= u_color.rgb;\n    alpha *= u_color.a;\n    alpha *= u_color.a;\n    material.diffuse = diffuse;\n    material.alpha = alpha * pow(1. - st.t,u_color.a);\n    return material;\n}"

/***/ }),