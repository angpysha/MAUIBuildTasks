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
//import { DOMParserImpl as dom } from 'xmldom-ts';
//import * as xpath from 'xpath-ts';
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
function getCorrectPropertyGroup(elements, name) {
    for (var el of elements) {
        var innerElements = el.elements;
        var contains = innerElements.some(x => x.name == name);
        if (contains) {
            return el;
        }
    }
    return null;
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
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
        let values = tl.getInput("values");
        if (values === undefined) {
            throw new Error(`Values cannnot be empty`);
        }
        let regex = new RegExp("\n");
        let valuesSplited = values.split(regex);
        if (printFile) {
            console.log(`Values to update ${valuesSplited}`);
        }
        var xml = fs.readFileSync(path);
        if (printFile) {
            console.log(`Start patching. Original file\n${xml}`);
        }
        const { DOMParser } = require('xmldom');
        var convert = require('xml-js');
        var doc = convert.xml2js(xml, { compact: true, spaces: 4 });
        var xpath = require("xml2js-xpath");
        for (let pair of valuesSplited) {
            let itemValueArray = pair.split("=");
            if (itemValueArray.length > 0) {
                let key = itemValueArray[0];
                let value = itemValueArray[1];
                const nodes = xpath.find(doc, key);
                console.log(nodes[0]);
                if (nodes != undefined) {
                    nodes[0]["_text"] = value;
                }
            }
        }
        let newFileContent = convert.js2xml(doc, { compact: true, spaces: 4 });
        if (printFile) {
            console.log(`Start patching. Patched file\n${newFileContent}`);
        }
        tl.writeFile(path, newFileContent, "utf8");
    });
}
run();
