/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.log = log;
exports.warn = warn;
exports.update = update;
var hasLog = exports.hasLog = true;

//输出普通信息(含调试)
function log(log) {
    if (!hasLog) return;

    console.log(log);
}

var hasWarn = exports.hasWarn = true;

//输出警示信息(含错误)
function warn(log) {
    if (!hasWarn) return;

    console.warn(log);
}

function update(val) {
    var val2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    exports.hasLog = hasLog = val;
    exports.hasWarn = hasWarn = val2;
}

/***/ }),
