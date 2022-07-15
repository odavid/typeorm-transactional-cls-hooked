"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInTransaction = void 0;
var wrapInTransaction_1 = require("./wrapInTransaction");
function runInTransaction(fn, options) {
    var wrapper = (0, wrapInTransaction_1.wrapInTransaction)(fn, options);
    return wrapper();
}
exports.runInTransaction = runInTransaction;
//# sourceMappingURL=runInTransaction.js.map