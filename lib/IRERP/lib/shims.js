(function(root) {
	define(function(require, exports, module) {
		if (define.amd) {
			exports.$ = require('jquery');
		} else {
			exports.$ = (root.jQuery || root.Zepto || root.ender || root.$);
		}
	});
})(this);
