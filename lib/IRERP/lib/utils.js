//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

define(function(require, exports, module) {
"use strict";

// Is a given variable an object?
exports.isObject = function(obj) {
    return obj === Object(obj);
};

// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].forEach(function(name) {
    exports['is' + name] = function(obj) {
    	return Object.prototype.toString.call(obj) == '[object ' + name + ']';
    };
});

exports.isEmpty = function(obj) {
    if (obj == null) return true;
    if (Array.isArray(obj) || exports.isString(obj)) return obj.length === 0;
    for (var key in obj) if (exports.has(obj, key)) return false;
    return true;
};

exports.pluck = function(array, key) {
	return array.map(function(item) { return item[key]; });
};

exports.each = function(obj, iterator, context) {
	var keys = Object.keys(obj);
	for (var i = 0, length = keys.length; i < length; i++) {
		iterator.call(context, obj[keys[i]], keys[i], obj);
	}
};

exports.map = function(obj, iterator, context) {
	var result = [];
    if (obj == null) return results;

	exports.each(obj, function(value, index, list) {
		results.push(iterator.call(context, value, index, list));
	});

	return result;
};

exports.has = function(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
};

exports.indexBy = function(array, key) {
	var result = {};
	array.forEach(function(item) {
		result[item[key]] = item;
		delete item[key];
	});

	return result;
};

var idCounter = 0;
exports.uniqueId = function(prefix) {
	var id = ++idCounter + '';
	return prefix ? prefix + id : id;
};

});
