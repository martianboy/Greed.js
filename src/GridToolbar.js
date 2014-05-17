define(['jquery',
        'underscore',
        './lib/EventEmitter'],
function($, _, EventEmitter) {

"use strict";

/****************************************************************************
 * View manager for Grid's THEAD section
 */
var GridToolbar = Object.create( EventEmitter );

GridToolbar.init = function( el ) {
    this.$el = $(el);

    this.$el.on('click', 'button', onButtonClick.bind(this));
};

function onButtonClick(e) {
	this.trigger('click.' + $(e.target).data('name'));
}

return GridToolbar;

});
