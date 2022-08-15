import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import tmrm = require('azure-pipelines-task-lib/mock-run');
import { TLSSocket } from 'tls';
import fs = require('fs');
import "../task";
// import { getAttributes } from '../task';


describe('Change Android activity label tests', function () {

    before( function() {

    });

    after(() => {

    });

    // it('should succeed with simple inputs', function(done: Mocha.Done) {
    //     // Add success test here
        
    // });

    // it('it should fail if tool returns 1', function(done: Mocha.Done) {
    //     // Add failure test here
    // });    

    it('Activity file and name correct', function(done: Mocha.Done) {
        let tp = path.join(__dirname, '../task.js');
        var tpp = path.join(__dirname, "success.js");
        var tj = path.join(__dirname, "..","task.json");
        var tl = new ttm.MockTestRunner(tpp,tj);
        tl.run();
        assert.equal(tl.stdout?.includes(`passed: true`), true);
        done();
    });
});