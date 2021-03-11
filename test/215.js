/* 215 */
/***/ (function(module, exports) {

module.exports = "czm_material czm_getMaterial(czm_materialInput materialInput){\n    czm_material material = czm_getDefaultMaterial(materialInput);\n    vec4 tColor = u_color;\n    vec2 st = materialInput.st;\n    vec2 center = st - vec2(0.5,0.5);\n    float length = length(center)/0.5;\n    float time = 1. - abs(czm_frameNumber / 360. - 0.5);\n\n    float param = 1. - step(length, 0.6);//大于0.6模糊，rate = 0.6\n    float scale = param * length;// 0.6< length 返回0，反之返回1.\n    float alpha = param * (1.0 - abs(scale - 0.8) / 0.2);// 0.8 < length 返回0，反之返回1.\n\n    float param1 = step(length, 0.7);//小于0.5模糊\n    float scale1 = param1 * length;// 0.6< length 返回0，反之返回1.\n    alpha += param1 * (1.0 - abs(scale1 - 0.35) / 0.35);// 0.8 < length 返回0，反之返回1.\n\n    material.diffuse = u_color.rgb * vec3(u_color.a);\n    material.alpha = pow(alpha, 4.0);\n    return material;\n}"

/***/ }),