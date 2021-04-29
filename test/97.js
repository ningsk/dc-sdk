/* 97 */
/***/ (function(module, exports) {

module.exports = "czm_material czm_getMaterial(czm_materialInput materialInput)\r\n{\r\n    czm_material material = czm_getDefaultMaterial(materialInput);\r\n    material.diffuse = 1.5 * color.rgb;\r\n    vec2 st = materialInput.st;\r\n    vec3 str = materialInput.str;\r\n    float dis = distance(st, vec2(0.5, 0.5));\r\n    float per = fract(time);\r\n    if(abs(str.z)>0.001){\r\n        discard;\r\n    }\r\n    if(dis >0.5){\r\n        discard;\r\n    }else {\r\n        float perDis = 0.5/count;\r\n        float disNum;\r\n        float bl = .0;\r\n        for(int i=0;i<=999;i++){\r\n            if(float(i)<=count){\r\n                disNum = perDis*float(i) - dis + per/count;\r\n                if(disNum>0.0){\r\n                    if(disNum<perDis){\r\n                        bl = 1.0-disNum/perDis;\r\n                    }\r\n                    else if(disNum-perDis<perDis){\r\n                        bl = 1.0 - abs(1.0-disNum/perDis);\r\n                    }\r\n                    material.alpha = pow(bl,gradient);\r\n                }\r\n            }\r\n        }\r\n    }\r\n    return material;\r\n}"

/***/ }),
