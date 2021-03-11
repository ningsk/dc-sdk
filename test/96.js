/* 96 */
/***/ (function(module, exports) {

module.exports = "//2个图片的叠加融合\r\nczm_material czm_getMaterial(czm_materialInput materialInput)\r\n{\r\n    czm_material material = czm_getDefaultMaterial(materialInput);\r\n    vec2 st = repeat * materialInput.st;\r\n    vec4 colorImage = texture2D(image, vec2(fract((axisY?st.t:st.s) - time), st.t));\r\n    if(color.a == 0.0)\r\n    {\r\n        material.alpha = colorImage.a;\r\n        material.diffuse = colorImage.rgb; \r\n    }\r\n    else\r\n    {\r\n        material.alpha = colorImage.a * color.a;\r\n        material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb); \r\n    }\r\n    vec4 colorBG = texture2D(image2,materialInput.st);\r\n    if(colorBG.a>0.5){\r\n        material.diffuse = bgColor.rgb;\r\n    }\r\n    return material;\r\n}"

/***/ }),
