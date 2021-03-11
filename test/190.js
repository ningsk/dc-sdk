/* 190 */
/***/ (function(module, exports) {

module.exports = "czm_material czm_getMaterial(czm_materialInput materialInput)\r\n{\r\n    czm_material material = czm_getDefaultMaterial(materialInput);\r\n    material.diffuse = 1.5 * color.rgb;\r\n    vec2 st = materialInput.st;\r\n    float dis = distance(st, vec2(0.5, 0.5));\r\n    float per = fract(time);\r\n    if(dis > per * 0.5){\r\n        //material.alpha = 0.0;\r\n        discard;\r\n    }else {\r\n        material.alpha = color.a  * dis / per / 2.0;\r\n    }\r\n    return material;\r\n}"

/***/ }),
