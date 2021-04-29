
/* 205 */
/***/ (function(module, exports) {

module.exports = "czm_material czm_getMaterial(czm_materialInput materialInput) { \n    czm_material material = czm_getDefaultMaterial(materialInput); \n    vec2 st = materialInput.st;\n    if(move){\n        float r = sqrt((st.x-0.8)*(st.x-0.8) + (st.y-0.8)*(st.y-0.8));\n        float r2 = sqrt((st.x-0.2)*(st.x-0.2) + (st.y-0.2)*(st.y-0.2));\n        float z = cos(moveVar.x*r + czm_frameNumber/100.0*moveVar.y)/moveVar.z;\n        float z2 = cos(moveVar.x*r2 + czm_frameNumber/100.0*moveVar.y)/moveVar.z;\n        st += sqrt(z*z+z2*z2);\n        st.s += reflux * czm_frameNumber/1000.0 * speed;\n        st.s = mod(st.s,1.0);\n    }\n    if(flipY){\n        st = vec2(st.t,st.s);\n    }\n    vec4 colorImage = texture2D(image, st);\n    material.alpha = alpha;\n    material.diffuse = colorImage.rgb; \n    return material; \n}"
