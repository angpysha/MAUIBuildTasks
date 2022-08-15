"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newTxt = void 0;
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
exports.newTxt = "";
let taskPath = path.join(__dirname, '..', 'task.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('sourceFile', './test.cs');
process.env["INPUT_PRINTFILE"] = "False";
process.env["BUILD_SOURCESDIRECTORY"] = __dirname;
tmr.setInput("activityName", "NewActivityName");
tmr.registerMockExport("expandSolutionWildcardPatterns", function (solutionPattern) {
    return "";
});
let testPath = path.join(__dirname, "test.cs");
tmr.registerMockExport("findMatch", function (defaultRoot, patterns, findOptions, matchOptions) {
    return [testPath];
});
tmr.registerMockExport("writeFile", function (path, content, options) {
    exports.newTxt = content;
});
tmr.run();
var success = exports.newTxt.includes(`Label = "NewActivityName"`);
console.log(`passed: ${success}`);
//# sourceMappingURL=success.js.map