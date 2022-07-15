"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transactional = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("typeorm");
var wrapInTransaction_1 = require("./wrapInTransaction");
function Transactional(options) {
    return function (target, methodName, descriptor) {
        (0, common_1.Inject)(typeorm_1.DataSource)(target, '__data_source_key__');
        var originalMethod = descriptor.value;
        descriptor.value = (0, wrapInTransaction_1.wrapInTransaction)(originalMethod, __assign(__assign({}, options), { name: methodName }));
        Reflect.getMetadataKeys(originalMethod).forEach(function (previousMetadataKey) {
            var previousMetadata = Reflect.getMetadata(previousMetadataKey, originalMethod);
            Reflect.defineMetadata(previousMetadataKey, previousMetadata, descriptor.value);
        });
        Object.defineProperty(descriptor.value, 'name', { value: originalMethod.name, writable: false });
    };
}
exports.Transactional = Transactional;
//# sourceMappingURL=Transactional.js.map