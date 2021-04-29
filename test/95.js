/* 95 */
/***/ (function(module, exports) {

module.exports = "czm_material czm_getMaterial(czm_materialInput materialInput)\r\n{\r\n    czm_material material = czm_getDefaultMaterial(materialInput);\r\n    vec2 st = repeat * materialInput.st;\r\n    vec4 colorImage = texture2D(image, vec2(fract((axisY?st.t:st.s) - time), st.t));\r\n    if(color.a == 0.0)\r\n    {\r\n        material.alpha = colorImage.a;\r\n        material.diffuse = colorImage.rgb; \r\n    }\r\n    else\r\n    {\r\n        material.alpha = colorImage.a * color.a;\r\n        material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb); \r\n    }\r\n    return material;\r\n}"

/***/ }),
