import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import { assert } from 'console';
import path = require('path');

export var newTxt:string = "";

let taskPath = path.join(__dirname, '..', 'task.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('sourceFile', './test.cs');
process.env["INPUT_PRINTFILE"] = "False";
process.env["BUILD_SOURCESDIRECTORY"] = __dirname;
tmr.setInput("activityName", "NewActivityName");
tmr.registerMockExport("expandSolutionWildcardPatterns", function(solutionPattern: string) : string {
    return "";
})
let testPath = path.join(__dirname,"test.cs");
tmr.registerMockExport("findMatch", function(defaultRoot: string, patterns: string[] | string, findOptions?: any, matchOptions?: any) {
    return [testPath];
})
tmr.registerMockExport("writeFile", function(path: string, content: any, options: any) {
          
    newTxt = content
});

tmr.run();
var success = newTxt.includes(`Label = "NewActivityName"`);
console.log(`passed: ${success}`);