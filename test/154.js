/* 154 */
/***/ (function(module, exports) {

module.exports = "#ifdef GL_FRAGMENT_PRECISION_HIGH\r\n    precision highp float;\r\n#else\r\n    precision mediump float;\r\n#endif\r\n\r\n#define OES_texture_float_linear\r\n\r\nvarying vec2 depth;\r\n\r\nvec4 packDepth(float depth)\r\n{\r\n    vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * depth;\r\n    enc = fract(enc);\r\n    enc -= enc.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);\r\n    return enc;\r\n}\r\n\r\nvoid main()\r\n{\r\n    float fDepth = (depth.x / 5000.0)/2.0 + 0.5;\r\n    gl_FragColor = packDepth(fDepth);\r\n}"

/***/ }),
