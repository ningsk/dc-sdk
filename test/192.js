/* 192 */
/***/ (function(module, exports) {

module.exports = "czm_material czm_getMaterial(czm_materialInput materialInput)\r\n{\r\n    czm_material material = czm_getDefaultMaterial(materialInput);\r\n    vec2 st = materialInput.st;\r\n    vec4 imgC = texture2D(scanImg,st);\r\n    if(imgC.a>.0){\r\n        material.diffuse = color.rgb;\r\n    }\r\n    material.alpha = imgC.a;\r\n    return material;\r\n}"

/***/ }),
