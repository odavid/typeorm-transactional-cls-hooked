"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHookInContext = exports.getHookInContext = exports.setEntityManagerForConnection = exports.getEntityManagerForConnection = exports.getEntityManagerOrTransactionManager = exports.initializeTransactionalContext = exports.NAMESPACE_NAME = void 0;
var cls_hooked_1 = require("cls-hooked");
var typeorm_1 = require("typeorm");
var DebugLog_1 = require("./DebugLog");
exports.NAMESPACE_NAME = '__typeOrm___cls_hooked_tx_namespace';
var TYPE_ORM_KEY_PREFIX = '__typeOrm__transactionalEntityManager_';
var TYPE_ORM_HOOK_KEY = '__typeOrm__transactionalCommitHooks';
var initializeTransactionalContext = function () {
    (0, DebugLog_1.debugLog)("Transactional@initializeTransactionalContext");
    return (0, cls_hooked_1.getNamespace)(exports.NAMESPACE_NAME) || (0, cls_hooked_1.createNamespace)(exports.NAMESPACE_NAME);
};
exports.initializeTransactionalContext = initializeTransactionalContext;
var getEntityManagerOrTransactionManager = function (connectionName, entityManager) {
    var context = (0, cls_hooked_1.getNamespace)(exports.NAMESPACE_NAME);
    if (context && context.active) {
        return (0, exports.getEntityManagerForConnection)(connectionName, context) || entityManager;
    }
    return entityManager || (0, typeorm_1.getManager)(connectionName);
};
exports.getEntityManagerOrTransactionManager = getEntityManagerOrTransactionManager;
var getEntityManagerForConnection = function (connectionName, context) {
    return context.get("".concat(TYPE_ORM_KEY_PREFIX).concat(connectionName));
};
exports.getEntityManagerForConnection = getEntityManagerForConnection;
var setEntityManagerForConnection = function (connectionName, context, entityManager) { return context.set("".concat(TYPE_ORM_KEY_PREFIX).concat(connectionName), entityManager); };
exports.setEntityManagerForConnection = setEntityManagerForConnection;
var getHookInContext = function (context) {
    return context === null || context === void 0 ? void 0 : context.get(TYPE_ORM_HOOK_KEY);
};
exports.getHookInContext = getHookInContext;
var setHookInContext = function (context, emitter) {
    return context.set(TYPE_ORM_HOOK_KEY, emitter);
};
exports.setHookInContext = setHookInContext;
//# sourceMappingURL=common.js.map