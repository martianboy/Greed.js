#!/usr/bin/env node

var copy = require('dryice').copy;

var HOME_DIR = __dirname;
var TARGET_DIR = HOME_DIR + '/lib';
var BUILD_DIR = HOME_DIR + '/build';

function main(args) {
    buildGrid();
}

function buildGrid() {
    var irerpGrid = copy.createDataObject();
    var irerpGridProject = copy.createCommonJsProject({
        roots: [TARGET_DIR],
        ignores: ['jquery', 'underscore', 'q']
    });
    copy({
        source: TARGET_DIR + '/IRERP/lib/mini_require.js',
        dest: irerpGrid
    });
    copy({
        source: [{
            project: irerpGridProject,
            require: [ 'IRERP/IRERPGrid' ]
        }],
        filter: [copy.filter.moduleDefines],
        dest: irerpGrid
    });
    copy({
        source: irerpGrid,
        filter: [copy.filter.moduleDefines],
        dest: BUILD_DIR + '/Grid.js'
    });
}

if (!module.parent)
    main(process.argv);
