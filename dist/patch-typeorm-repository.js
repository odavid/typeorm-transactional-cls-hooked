"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchTypeORMTreeRepositoryWithBaseTreeRepository = exports.patchTypeORMRepositoryWithBaseRepository = exports.patchRepositoryManager = void 0;
var typeorm_1 = require("typeorm");
var common_1 = require("./common");
var DebugLog_1 = require("./DebugLog");
var patchRepositoryManager = function (repositoryType) {
    var _a;
    (0, DebugLog_1.debugLog)("Transactional@patchRepositoryManager repositoryType: ".concat((_a = repositoryType === null || repositoryType === void 0 ? void 0 : repositoryType.constructor) === null || _a === void 0 ? void 0 : _a.name));
    Object.defineProperty(repositoryType, 'manager', {
        get: function () {
            return (0, common_1.getEntityManagerOrTransactionManager)(this._connectionName, this._manager);
        },
        set: function (manager) {
            var _a;
            this._manager = manager;
            this._connectionName = (_a = manager === null || manager === void 0 ? void 0 : manager.connection) === null || _a === void 0 ? void 0 : _a.name;
        },
    });
};
exports.patchRepositoryManager = patchRepositoryManager;
var patchTypeORMRepositoryWithBaseRepository = function () {
    (0, exports.patchRepositoryManager)(typeorm_1.Repository.prototype);
    Object.defineProperty(typeorm_1.MongoRepository.prototype, 'manager', {
        configurable: true,
        writable: true,
    });
};
exports.patchTypeORMRepositoryWithBaseRepository = patchTypeORMRepositoryWithBaseRepository;
var patchTypeORMTreeRepositoryWithBaseTreeRepository = function () {
    (0, exports.patchRepositoryManager)(typeorm_1.TreeRepository.prototype);
};
exports.patchTypeORMTreeRepositoryWithBaseTreeRepository = patchTypeORMTreeRepositoryWithBaseTreeRepository;
//# sourceMappingURL=patch-typeorm-repository.js.map