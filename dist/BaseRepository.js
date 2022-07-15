"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
var typeorm_1 = require("typeorm");
var patch_typeorm_repository_1 = require("./patch-typeorm-repository");
var BaseRepository = (function (_super) {
    __extends(BaseRepository, _super);
    function BaseRepository() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BaseRepository;
}(typeorm_1.Repository));
exports.BaseRepository = BaseRepository;
(0, patch_typeorm_repository_1.patchRepositoryManager)(BaseRepository.prototype);
//# sourceMappingURL=BaseRepository.js.map