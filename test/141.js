/* 141 */
/***/ (function(module, exports) {

module.exports = "#extension GL_OES_standard_derivatives : enable\r\nuniform sampler2D colorTexture;\r\nuniform sampler2D depthTexture;\r\nuniform float lineWidth;\r\nuniform float height;\r\nuniform bvec3 strokeType;\r\nuniform vec3 tjxColor;\r\nuniform vec3 bjColor;\r\nuniform vec3 cameraPos;\r\nuniform float mbDis;\r\nvarying vec2 v_textureCoordinates;\r\nvec4 toEye(in vec2 uv, in float depth){\r\n    vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\r\n    vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\r\n    posInCamera =posInCamera / posInCamera.w;\r\n    return posInCamera;\r\n}\r\nfloat getDepth(in vec4 depth){\r\n    float z_window = czm_unpackDepth(depth);\r\n    z_window = czm_reverseLogDepth(z_window);\r\n    float n_range = czm_depthRange.near;\r\n    float f_range = czm_depthRange.far;\r\n    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\r\n}\r\nbool isTJX(vec2 uv,float lw){\r\n    vec2 pixelSize = lw / czm_viewport.zw;\r\n    float dx0 = -pixelSize.x;\r\n    float dy0 = -pixelSize.y;\r\n    float dx1 = pixelSize.x;\r\n    float dy1 = pixelSize.y;\r\n\r\n    vec2 currUV = uv + vec2(dx0, dy0);\r\n    vec4 currDepth = texture2D(depthTexture, currUV);\r\n    float depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(0.0, dy0);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(dx1, dy0);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(dx0, 0.0);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(dx1, 0.0);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(dx0, dy1);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(0.0, dy1);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    currUV = uv + vec2(dx1, dy1);\r\n    currDepth = texture2D(depthTexture, currUV);\r\n    depth = getDepth(currDepth);\r\n    if(depth>=1.0)return true;\r\n\r\n    return false;\r\n}\r\nvoid main(){\r\n\r\n\r\n    vec4 color = texture2D(colorTexture, v_textureCoordinates);\r\n    if(height>14102.0){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n    vec4 currD = texture2D(depthTexture, v_textureCoordinates);\r\n    if(currD.r>=1.0){\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n    float depth = getDepth(currD);\r\n    vec4 positionEC = toEye(v_textureCoordinates, depth);\r\n    vec3 dx = dFdx(positionEC.xyz);\r\n    vec3 dy = dFdy(positionEC.xyz);\r\n    vec3 normal = normalize(cross(dx,dy));\r\n\r\n    if(strokeType.y||strokeType.z){\r\n        vec4 wp = czm_inverseView * positionEC;\r\n        if(distance(wp.xyz,cameraPos)>mbDis){\r\n            gl_FragColor = color;\r\n        }else{\r\n            float dotNum = abs(dot(normal,normalize(positionEC.xyz)));\r\n            if(dotNum<0.05){\r\n                gl_FragColor = vec4(bjColor,1.0);\r\n                return;\r\n            }\r\n        }\r\n    }\r\n    if(strokeType.x||strokeType.z){\r\n        bool tjx = isTJX(v_textureCoordinates,lineWidth);\r\n        if(tjx){\r\n            gl_FragColor = vec4(tjxColor,1.0);\r\n            return;\r\n        }\r\n    }\r\n    gl_FragColor = color;\r\n}"

/***/ }),