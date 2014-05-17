define(function(require, exports, module) {

var $ = require('./lib/shims').$;
var _ = require('./lib/utils');

var EventEmitter = require('./lib/EventEmitter');

"use strict";

/****************************************************************************
 * View manager for modal dialog boxes used in Grid.js
 */

var GridModal = function($el) {

};

GridModal.prototype = Object.create( EventEmitter );

GridModal.prototype.some_function = function() {

};

return GridModal;

});
