"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugLog = void 0;
var TRANSACTIONAL_CONSOLE_DEBUG = process.env.TRANSACTIONAL_CONSOLE_DEBUG;
var debugLog = function (message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (TRANSACTIONAL_CONSOLE_DEBUG) {
        console.log.apply(console, __spreadArray([message], optionalParams, false));
    }
};
exports.debugLog = debugLog;
//# sourceMappingURL=DebugLog.js.map