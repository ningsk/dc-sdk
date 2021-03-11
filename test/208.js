/* 208 */
/***/ (function(module, exports) {

module.exports = "#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform vec2 u_distanceDisplayCondition;\nuniform vec3 u_eyePos;\nvarying vec3 v_worldPos;\nuniform sampler2D billImg;\nvarying vec2 v_st;\nvoid main() {\n    float dis = distance(u_eyePos, v_worldPos);\n    if (dis < u_distanceDisplayCondition.x || dis > u_distanceDisplayCondition.y) {\n        discard;\n    } else {\n        gl_FragColor = texture2D(billImg,v_st);\n    }\n}"

/***/ }),
