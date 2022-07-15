"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapInTransaction = exports.runInTransaction = exports.Transactional = exports.IsolationLevel = exports.Propagation = exports.patchRepositoryManager = exports.patchTypeORMTreeRepositoryWithBaseTreeRepository = exports.patchTypeORMRepositoryWithBaseRepository = exports.runOnTransactionRollback = exports.runOnTransactionComplete = exports.runOnTransactionCommit = exports.NAMESPACE_NAME = exports.getEntityManagerOrTransactionManager = exports.initializeTransactionalContext = exports.BaseTreeRepository = exports.BaseRepository = void 0;
var BaseRepository_1 = require("./BaseRepository");
Object.defineProperty(exports, "BaseRepository", { enumerable: true, get: function () { return BaseRepository_1.BaseRepository; } });
var BaseTreeRepository_1 = require("./BaseTreeRepository");
Object.defineProperty(exports, "BaseTreeRepository", { enumerable: true, get: function () { return BaseTreeRepository_1.BaseTreeRepository; } });
var common_1 = require("./common");
Object.defineProperty(exports, "initializeTransactionalContext", { enumerable: true, get: function () { return common_1.initializeTransactionalContext; } });
Object.defineProperty(exports, "getEntityManagerOrTransactionManager", { enumerable: true, get: function () { return common_1.getEntityManagerOrTransactionManager; } });
Object.defineProperty(exports, "NAMESPACE_NAME", { enumerable: true, get: function () { return common_1.NAMESPACE_NAME; } });
var hook_1 = require("./hook");
Object.defineProperty(exports, "runOnTransactionCommit", { enumerable: true, get: function () { return hook_1.runOnTransactionCommit; } });
Object.defineProperty(exports, "runOnTransactionComplete", { enumerable: true, get: function () { return hook_1.runOnTransactionComplete; } });
Object.defineProperty(exports, "runOnTransactionRollback", { enumerable: true, get: function () { return hook_1.runOnTransactionRollback; } });
var patch_typeorm_repository_1 = require("./patch-typeorm-repository");
Object.defineProperty(exports, "patchTypeORMRepositoryWithBaseRepository", { enumerable: true, get: function () { return patch_typeorm_repository_1.patchTypeORMRepositoryWithBaseRepository; } });
Object.defineProperty(exports, "patchTypeORMTreeRepositoryWithBaseTreeRepository", { enumerable: true, get: function () { return patch_typeorm_repository_1.patchTypeORMTreeRepositoryWithBaseTreeRepository; } });
Object.defineProperty(exports, "patchRepositoryManager", { enumerable: true, get: function () { return patch_typeorm_repository_1.patchRepositoryManager; } });
var Propagation_1 = require("./Propagation");
Object.defineProperty(exports, "Propagation", { enumerable: true, get: function () { return Propagation_1.Propagation; } });
var IsolationLevel_1 = require("./IsolationLevel");
Object.defineProperty(exports, "IsolationLevel", { enumerable: true, get: function () { return IsolationLevel_1.IsolationLevel; } });
var Transactional_1 = require("./Transactional");
Object.defineProperty(exports, "Transactional", { enumerable: true, get: function () { return Transactional_1.Transactional; } });
var runInTransaction_1 = require("./runInTransaction");
Object.defineProperty(exports, "runInTransaction", { enumerable: true, get: function () { return runInTransaction_1.runInTransaction; } });
var wrapInTransaction_1 = require("./wrapInTransaction");
Object.defineProperty(exports, "wrapInTransaction", { enumerable: true, get: function () { return wrapInTransaction_1.wrapInTransaction; } });
__exportStar(require("./TransactionalError"), exports);
//# sourceMappingURL=index.js.map