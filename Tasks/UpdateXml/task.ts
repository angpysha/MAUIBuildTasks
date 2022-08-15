import tl = require('azure-pipelines-task-lib/task');
import trm = require('azure-pipelines-task-lib/toolrunner');
import fs = require('fs');
import { DOMParserImpl as dom } from 'xmldom-ts';
import * as xpath from 'xpath-ts';

/**
 * Find all filenames starting from `rootDirectory` that match a wildcard pattern.
 * @param solutionPattern A filename pattern to evaluate, possibly containing wildcards.
 */
 function expandSolutionWildcardPatterns(solutionPattern: string): string {
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
    } else {
        throw new Error (tl.loc('SolutionDoesNotExist', solutionPattern));
    }
}

function getCorrectPropertyGroup(elements: Array<any>, name: string) : any {
    for (var el of elements) {
            var innerElements = <Array<any>>el.elements;
            var contains = innerElements.some(x => x.name == name);

            if (contains)
            {
                return el;
            }
    }

    return null;
}

async function run() {
    let printFile = tl.getBoolInput("printFile");

    let filePath = tl.getInput("sourceFile");

    if (filePath === undefined) {
        throw new Error(`File path cannot be empty`);
    }
    
    let path = expandSolutionWildcardPatterns(filePath);
    if (printFile) 
    {
        console.log(`Path file ${path}`);
    }
    if (!fs.existsSync(path)) 
    {
        throw new Error(`The following path does not exists`);
    }

    let values = tl.getInput("values");

    if (values === undefined) {
        throw new Error(`Values cannnot be empty`);
    }


     var convert = require('xml-js');

     var xml = fs.readFileSync(path)



    var options = {ignoreComment: true, alwaysChildren: true};
    var result = convert.xml2js(xml, options);
    
    var items = <Array<any>>result.elements[0].elements;

    var propertyGroups = <Array<any>>items.filter(s => s.name == "PropertyGroup");
    var doc = new dom().parseFromString(xml.toString());
    let regex = new RegExp("\n");
    let valuesSplited = values.split(regex);

    console.log(valuesSplited[0])
    //const nodes = <any>xpath.select("//Project/PropertyGroup/ApplicationId", doc);
   // var group = getCorrectPropertyGroup(propertyGroups, )
    //nodes[0].textContent = "testappp";
    //console.log(nodes[0].textContent);
    var s = new XMLSerializer();

    let ssss = s.serializeToString(doc);

    tl.writeFile(filePath, ssss, "utf8");
  //  console.log(ssss);
}

run();