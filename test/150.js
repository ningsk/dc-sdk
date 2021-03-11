/* 150 */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D colorTexture;\nuniform sampler2D mergeTexture; \nuniform float alpha;\nvarying vec2 v_textureCoordinates;\nvoid main(){\n    vec4 color = texture2D(colorTexture, v_textureCoordinates);\n    vec4 mergeColor =  texture2D(mergeTexture, v_textureCoordinates);\n    if(length(mergeColor.rgb)>0.01){\n        gl_FragColor = mix(color,mergeColor,alpha);\n    }else{\n        gl_FragColor = color;\n    }\n} "

/***/ }),
