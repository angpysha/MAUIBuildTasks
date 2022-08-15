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
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const fs = require("fs");
/**
 * Find all filenames starting from `rootDirectory` that match a wildcard pattern.
 * @param solutionPattern A filename pattern to evaluate, possibly containing wildcards.
 */
function expandSolutionWildcardPatterns(solutionPattern) {
    let defDir = tl.getVariable("Build.SourcesDirectory");
    if (defDir === undefined) {
        throw new Error("Build.SourcesDirectory undefined");
    }
    const matchedSolutionFiles = tl.findMatch(defDir, solutionPattern, { followSymbolicLinks: false, followSpecifiedSymbolicLink: false, allowBrokenSymbolicLinks: false });
    tl.debug(`Found ${matchedSolutionFiles ? matchedSolutionFiles.length : 0} solution files matching the pattern.`);
    if (matchedSolutionFiles && matchedSolutionFiles.length > 0) {
        const result = matchedSolutionFiles[0];
        if (matchedSolutionFiles.length > 1) {
            tl.warning(tl.loc('MultipleSolutionsFound', result));
        }
        return result;
    }
    else {
        throw new Error(tl.loc('SolutionDoesNotExist', solutionPattern));
    }
}
function getAttributes(content) {
    var reg = /\[\s?Activity.*\]/gm;
    var matches = content.match(reg);
    if (matches !== null && matches !== undefined) {
        var first = matches[0];
        if (first !== undefined) {
            return first;
        }
    }
    return null;
}
function replaceString(attrString, replaceString) {
    var labelIndex = attrString === null || attrString === void 0 ? void 0 : attrString.indexOf("Label");
    // console.log(labelIndex);
    var number = -1;
    for (let i = labelIndex; i < attrString.length; i++) {
        let ch = attrString[i];
        if (ch == ',') {
            number = i;
            break;
        }
    }
    // console.log(number);
    var labelStr = attrString.substring(labelIndex, number);
    // console.log(labelStr);
    var indexes = [];
    for (let i = 0; i < labelStr.length; i++) {
        if (labelStr[i] == '"') {
            indexes.push(i);
        }
    }
    // console.log(indexes);
    var oldLabel = labelStr.substring(indexes[0], indexes[1] + 1);
    //console.log(oldLabel);
    let newLabel = `"${replaceString}"`;
    let newLabelStr = labelStr.replace(oldLabel, newLabel);
    //  console.log(newLabelStr);
    var newAttrString = attrString.replace(labelStr, newLabelStr);
    //   console.log(newAttrString);
    return newAttrString;
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let printFile = tl.getBoolInput("printFile");
            let filePath = tl.getInput("sourceFile");
            if (filePath === undefined) {
                throw new Error(`File path cannot be empty`);
            }
            let path = expandSolutionWildcardPatterns(filePath);
            if (printFile) {
                console.log(`Path file ${path}`);
            }
            if (!fs.existsSync(path)) {
                throw new Error(`The following path does not exists`);
            }
            let activityName = tl.getInput("activityName");
            if (activityName === undefined) {
                throw new Error('Activity name cannot be empty');
            }
            var fileContent = fs.readFileSync(path, "utf8");
            if (printFile) {
                console.log(`Original file content: \n${fileContent}`);
            }
            let strr = getAttributes(fileContent);
            if (strr === null) {
            }
            if (printFile) {
                console.log(`Activity attribute: ${strr}`);
            }
            var newAttribute = replaceString(strr, activityName);
            var fileContentNew = fileContent.replace(strr, newAttribute);
            if (printFile) {
                console.log(fileContentNew);
            }
            tl.writeFile(path, fileContentNew, "utf8");
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
//# sourceMappingURL=task.js.map