"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.wrapInTransaction = void 0;
var cls_hooked_1 = require("cls-hooked");
var common_1 = require("./common");
var hook_1 = require("./hook");
var Propagation_1 = require("./Propagation");
var TransactionalError_1 = require("./TransactionalError");
function wrapInTransaction(fn, options) {
    function wrapped() {
        var _this = this;
        var _a;
        var newArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newArgs[_i] = arguments[_i];
        }
        var context = (0, cls_hooked_1.getNamespace)(common_1.NAMESPACE_NAME);
        if (!context) {
            throw new Error('No CLS namespace defined in your app ... please call initializeTransactionalContext() before application start.');
        }
        var tempConnectionName = options && options.connectionName ? options.connectionName : 'default';
        if (typeof tempConnectionName !== 'string') {
            tempConnectionName = tempConnectionName() || 'default';
        }
        var dataSource = this === null || this === void 0 ? void 0 : this['__data_source_key__'];
        var connectionName = tempConnectionName;
        var methodNameStr = String(options === null || options === void 0 ? void 0 : options.name);
        var propagation = options && options.propagation ? options.propagation : Propagation_1.Propagation.REQUIRED;
        var isolationLevel = options && options.isolationLevel;
        var isCurrentTransactionActive = (_a = dataSource.manager.queryRunner) === null || _a === void 0 ? void 0 : _a.isTransactionActive;
        var operationId = String(new Date().getTime());
        var logger = dataSource.logger;
        var log = function (message) {
            return logger.log('log', "Transactional@".concat(operationId, "|").concat(connectionName, "|").concat(methodNameStr, "|").concat(isolationLevel, "|").concat(propagation, " - ").concat(message));
        };
        log("Before starting: isCurrentTransactionActive = ".concat(isCurrentTransactionActive));
        var runOriginal = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2, fn.apply(this, __spreadArray([], newArgs, true))];
        }); }); };
        var runWithNewHook = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2, (0, hook_1.runInNewHookContext)(context, runOriginal)];
        }); }); };
        var runWithNewTransaction = function () { return __awaiter(_this, void 0, void 0, function () {
            var transactionCallback;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transactionCallback = function (entityManager) { return __awaiter(_this, void 0, void 0, function () {
                            var result, e_1;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        log("runWithNewTransaction - set entityManager in context: isCurrentTransactionActive: ".concat((_a = entityManager === null || entityManager === void 0 ? void 0 : entityManager.queryRunner) === null || _a === void 0 ? void 0 : _a.isTransactionActive));
                                        (0, common_1.setEntityManagerForConnection)(connectionName, context, entityManager);
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 3, 4, 5]);
                                        return [4, fn.apply(this, __spreadArray([], newArgs, true))];
                                    case 2:
                                        result = _b.sent();
                                        log("runWithNewTransaction - Success");
                                        return [2, result];
                                    case 3:
                                        e_1 = _b.sent();
                                        log("runWithNewTransaction - ERROR|".concat(e_1));
                                        throw e_1;
                                    case 4:
                                        log("runWithNewTransaction - reset entityManager in context");
                                        (0, common_1.setEntityManagerForConnection)(connectionName, context, null);
                                        return [7];
                                    case 5: return [2];
                                }
                            });
                        }); };
                        if (!isolationLevel) return [3, 2];
                        return [4, (0, hook_1.runInNewHookContext)(context, function () {
                                return dataSource.manager.transaction(isolationLevel, transactionCallback);
                            })];
                    case 1: return [2, _a.sent()];
                    case 2: return [4, (0, hook_1.runInNewHookContext)(context, function () {
                            return dataSource.manager.transaction(transactionCallback);
                        })];
                    case 3: return [2, _a.sent()];
                }
            });
        }); };
        return context.runAndReturn(function () { return __awaiter(_this, void 0, void 0, function () {
            var currentTransaction, _a, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        currentTransaction = (0, common_1.getEntityManagerForConnection)(connectionName, context);
                        _a = propagation;
                        switch (_a) {
                            case Propagation_1.Propagation.MANDATORY: return [3, 1];
                            case Propagation_1.Propagation.NESTED: return [3, 2];
                            case Propagation_1.Propagation.NEVER: return [3, 3];
                            case Propagation_1.Propagation.NOT_SUPPORTED: return [3, 4];
                            case Propagation_1.Propagation.REQUIRED: return [3, 7];
                            case Propagation_1.Propagation.REQUIRES_NEW: return [3, 8];
                            case Propagation_1.Propagation.SUPPORTS: return [3, 9];
                        }
                        return [3, 10];
                    case 1:
                        if (!currentTransaction) {
                            throw new TransactionalError_1.TransactionalError("No existing transaction found for transaction marked with propagation 'MANDATORY'");
                        }
                        return [2, runOriginal()];
                    case 2: return [2, runWithNewTransaction()];
                    case 3:
                        if (currentTransaction) {
                            throw new TransactionalError_1.TransactionalError("Found an existing transaction, transaction marked with propagation 'NEVER'");
                        }
                        return [2, runWithNewHook()];
                    case 4:
                        if (!currentTransaction) return [3, 6];
                        (0, common_1.setEntityManagerForConnection)(connectionName, context, null);
                        return [4, runWithNewHook()];
                    case 5:
                        result = _b.sent();
                        (0, common_1.setEntityManagerForConnection)(connectionName, context, currentTransaction);
                        return [2, result];
                    case 6: return [2, runOriginal()];
                    case 7:
                        if (currentTransaction) {
                            return [2, runOriginal()];
                        }
                        return [2, runWithNewTransaction()];
                    case 8: return [2, runWithNewTransaction()];
                    case 9:
                        if (currentTransaction) {
                            return [2, runOriginal()];
                        }
                        else {
                            return [2, runWithNewHook()];
                        }
                        _b.label = 10;
                    case 10: return [2];
                }
            });
        }); });
    }
    return wrapped;
}
exports.wrapInTransaction = wrapInTransaction;
//# sourceMappingURL=wrapInTransaction.js.map