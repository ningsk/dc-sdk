/* 211 */
/***/ (function(module, exports) {

module.exports = "czm_material czm_getMaterial(czm_materialInput materialInput){\n    float isRed=step(speed,materialInput.st.x);\n    vec3 red;\n    if(isRed==0.0){\n        red = vec3(1.0,0.0,0.1);\n    }\n    else{\n        red = vec3(1.0,1.0,1.0);\n    }\n    czm_material material = czm_getDefaultMaterial(materialInput);\n    material.diffuse = czm_gammaCorrect(texture2D(image, fract(materialInput.st)).rgb *red); \n    \n    material.alpha = texture2D(image, fract(materialInput.st)).a;\n    return material;\n} "

/***/ }),