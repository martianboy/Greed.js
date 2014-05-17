#!/usr/bin/env node

var copy = require('dryice').copy;

var HOME_DIR = __dirname;
var TARGET_DIR = HOME_DIR + '/src';
var BUILD_DIR = HOME_DIR + '/build';

var DEPENDENCIES = ['jquery', 'underscore'];

/******************************************************************************
 * Borrowed from https://github.com/ajaxorg/ace/blob/efea2a755b1f4073fc2fcffa0179362ab40a83c3/Makefile.dryice.js
 *****************************************************************************/
var CommonJsProject = copy.createCommonJsProject({roots:[]}).constructor;
CommonJsProject.prototype.getCurrentModules = function() {
    function isDep(child, parent) {
        if (!modules[parent])
            return false;
        var deps = modules[parent].deps;
        if (deps[child]) return true;
        return Object.keys(deps).some(function(x) {
            return isDep(child, x)
        });
    }
    var depMap = {}, modules = this.currentModules;
    return Object.keys(this.currentModules).map(function(moduleName) {
        module = modules[moduleName];
        module.id = moduleName;
        module.isSpecial = false; //!/define\(\'[^']*',/.test(module.source);
        return module;
    }).sort(function(a, b) {
        if (a.isSpecial) return -1;
        if (b.isSpecial) return 1;
        if (isDep(a.id, b.id)) return -1;
        if (isDep(b.id, a.id)) return 1;
        return Object.keys(a.deps).length - Object.keys(b.deps).length || a.id.localeCompare(b.id)
    });
};

function removeModuleDefines(input, source) {
    if (!source) {
        console.log('- Source without filename passed to removeModuleDefines().' +
            ' Skipping addition of named wrapper.');
        return input;
    }

    if (typeof input !== 'string') {
        input = input.toString();
    }

    var module = source.isLocation ? source.path : source;
    module = module.replace(/\.js$/, '').split('/');
    module = module[module.length - 1];

    var varModuleRegexp = new RegExp("return " + module + ";\\s*\\}\\);\\s*$", 'm');

    if (varModuleRegexp.test(input)) {
        input = input.replace(/define\(\[[^\]]+\]\s*,\s*function\([^\)]*\)\s*\{/,
                                "var " + module + " = (function() {");
        return input.replace(varModuleRegexp, 'return ' + module + ';\n})();\n\n');
    } else {
        input = input.replace(/define\(\[[^\]]+\]\s*,\s*function\([^\)]*\)\s*\{/, '');
        return input.replace(/\}\)\s*;\s*$/m, '');
    }
};
removeModuleDefines.onRead = true;

function wrapGreed(input) {
    return "(function (context, definition) {\n" +
           "\tif (typeof define === 'function' && define.amd)\n" +
           "\t\tdefine([" + DEPENDENCIES.map(function(dep) { return "'" + dep + "'"; }).join(', ') + "], definition);\n" +
           "\telse\n" +
           "\t\tdefinition(context.jQuery, context._);\n" +
           "})(this, function ($, _) {\n" +
           input + '\n});';
}

function removeUseStrict(text) {
    return text.replace(/\s*['"]use strict['"];\s*/g, "\n");
}

function buildGrid() {
    var irerpGrid = copy.createDataObject();
    var irerpGridProject = copy.createCommonJsProject({
        roots: [TARGET_DIR],
        ignores: ['jquery', 'underscore', 'q']
    });
    // copy({
    //     source: TARGET_DIR + '/IRERP/lib/mini_require.js',
    //     dest: irerpGrid
    // });
    copy({
        source: {
            project: irerpGridProject,
            require: 'Greed'
        },
        filter: [removeModuleDefines],
        dest: irerpGrid
    });
    copy({
        source: irerpGrid,
        filter: [removeUseStrict, wrapGreed],
        dest: BUILD_DIR + '/Greed.js'
    });

    // var modules = irerpGridProject.getCurrentModules()
    // .map(function(m) {
    //     var p, r = {};
    //     var deps = Object.keys(m.deps);

    //     DEPENDENCIES.forEach(function(dep) {
    //         if ((p = deps.indexOf(dep)) > -1)
    //             deps.splice(p, 1);
    //     })
    //     r[m.path.replace('/\.js$/', '')] = deps;
    //     return r;
    // });
    // var modules = {};
    // irerpGridProject.getCurrentModules().forEach(function(m) {
    //     modules[m.path.replace('/\.js$/', '')] = Object.keys(m.deps);
    // });

    // console.log();
    // modules.forEach(function(m) { console.log(m) });
    // console.log();
}

function main(args) {
    buildGrid();
}

if (!module.parent)
    main(process.argv);
