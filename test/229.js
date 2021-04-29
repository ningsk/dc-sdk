/* 229 */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D colorTexture;//输入的场景渲染照片\r\nvarying vec2 v_textureCoordinates;\r\n\r\nfloat hash(float x){\r\n    return fract(sin(x*133.3)*13.13);\r\n}\r\n\r\nvoid main(void){\r\n\r\n    float time = czm_frameNumber / 240.0;\r\n    vec2 resolution = czm_viewport.zw;\r\n\r\n    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\r\n    vec3 c=vec3(.6,.7,.8);\r\n\r\n    float a=-.4;\r\n    float si=sin(a),co=cos(a);\r\n    uv*=mat2(co,-si,si,co);\r\n    uv*=length(uv+vec2(0,4.9))*.3+1.;\r\n\r\n    float v=1.-sin(hash(floor(uv.x*100.))*2.);\r\n    float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\r\n    c*=v*b; //屏幕上雨的颜色\r\n\r\n    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5); //将雨和三维场景融合\r\n}"

/***/ }),