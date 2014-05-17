define(['jquery',
        './lib/EventEmitter'],
function($, EventEmitter) {

"use strict";

/****************************************************************************
 * View manager for Grid's pager section
 */
var GridPager = Object.create( EventEmitter );
GridPager.init = function(pager, totalPages) {
    this.$el = $(pager);

    this.reset(totalPages || 0);

    this.$el.on('click', 'button[rel]', navButtonsClick.bind(this));
};
GridPager.reset = function(totalPages, currentPage) {
    this.totalPages = totalPages;
    this.currentPage = currentPage || 0;

    // TODO: Put UI stuff (e.g. disabling nav buttons when appropriate) here.
    this.$el.find('.current-page').text(this.currentPage + 1); // + ' / ' + this.totalPages);
};

function navButtonsClick(e) {
    var rel = $(e.target).attr('rel');
    var page = 0;

    switch (rel) {
        case 'first': page = 0; break;
        case 'prev': page = Math.max(0, this.currentPage - 1); break;
        case 'next': page = Math.min(this.currentPage + 1, this.totalPages); break;
        case 'last': page = this.totalPages - 1; break;
    }
    this.trigger('requestPage', page);
}

return GridPager;
});
