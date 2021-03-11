
/* 230 */
/***/ (function(module, exports) {

module.exports = "uniform sampler2D colorTexture; //输入的场景渲染照片\r\nvarying vec2 v_textureCoordinates;\r\n\r\nfloat snow(vec2 uv,float scale){\r\n    float time = czm_frameNumber / 60.0;\r\n    float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\r\n    uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\r\n    uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\r\n    p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\r\n    k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\r\n    return k*w;\r\n}\r\n\r\nvoid main(void){\r\n    vec2 resolution = czm_viewport.zw;\r\n    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\r\n    vec3 finalColor=vec3(0);\r\n    float c = 0.0;\r\n    // c+=snow(uv,30.)*.0;\r\n    // c+=snow(uv,20.)*.0;\r\n    // c+=snow(uv,15.)*.0;\r\n    c+=snow(uv,10.);\r\n    c+=snow(uv,8.);\r\n    c+=snow(uv,6.);\r\n    c+=snow(uv,5.);\r\n    finalColor=(vec3(c)); //屏幕上雪的颜色\r\n    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.5);  //将雪和三维场景融合\r\n\r\n}"

/***/ }),