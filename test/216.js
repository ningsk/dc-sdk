
/* 216 */
/***/ (function(module, exports) {

module.exports = "czm_material czm_getMaterial(czm_materialInput materialInput){\n    czm_material material = czm_getDefaultMaterial(materialInput);\n    vec2 st = materialInput.st;\n    vec2 center = st - vec2(0.5,0.5);\n    float time = -czm_frameNumber * 3.1415926 / 180.;//扫描速度1度\n    float sin_t = sin(time);\n    float cos_t = cos(time);\n    vec2 center_rotate = vec2(center.s*cos_t-center.t*sin_t+0.5,center.s*sin_t+center.t*cos_t+0.5);\n    vec4 color = texture2D(image,center_rotate);\n    vec3 tColor = color.rgb * u_color.rgb;\n    tColor *= u_color.a;\n    material.diffuse = tColor;\n    float length = 2. - length(center)/0.5;\n    material.alpha = color.a * pow(length, 0.5);//color.r = 0 或1\n    return material;\n}"

/***/ }),