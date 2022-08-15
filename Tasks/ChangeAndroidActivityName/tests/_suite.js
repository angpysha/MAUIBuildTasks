"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const assert = __importStar(require("assert"));
const ttm = __importStar(require("azure-pipelines-task-lib/mock-test"));
require("../task");
// import { getAttributes } from '../task';
describe('Change Android activity label tests', function () {
    before(function () {
    });
    after(() => {
    });
    // it('should succeed with simple inputs', function(done: Mocha.Done) {
    //     // Add success test here
    // });
    // it('it should fail if tool returns 1', function(done: Mocha.Done) {
    //     // Add failure test here
    // });    
    it('Activity file and name correct', function (done) {
        var _a;
        let tp = path.join(__dirname, '../task.js');
        var tpp = path.join(__dirname, "success.js");
        var tj = path.join(__dirname, "..", "task.json");
        var tl = new ttm.MockTestRunner(tpp, tj);
        tl.run();
        assert.equal((_a = tl.stdout) === null || _a === void 0 ? void 0 : _a.includes(`passed: true`), true);
        done();
    });
});
//# sourceMappingURL=_suite.js.map