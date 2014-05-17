define(['jquery',
        'underscore',
        './lib/EventEmitter'],
function($, _, EventEmitter) {

"use strict";

/****************************************************************************
 * View manager for Grid's THEAD section
 */
var GridHeader = Object.create( EventEmitter );

var $headersContainer, filters = {}, trigger;

GridHeader.init = function( header ) {
    $headersContainer = (this.$el = $(header)).find('.column-headers');

    $headersContainer.on('click', 'li > a.header', onHeaderClick);
    $headersContainer.on('click', 'li > a.header-menu', onHeaderMenuClick);

    $headersContainer.on('keyup', 'li.filter > input', onFilterKeyup);
    $headersContainer.on('keypress', 'li.filter > input', onFilterKeypress);

    trigger = this.trigger.bind(this);
};

GridHeader.resetSortOrders = function(sort) {
    $headersContainer.children().each(function(index, header) {
        var $header = $(header);
        var field = $header.data('name');
        var order = sort[field];

        if (order == null)
            $header.removeClass('asc desc');
        else
            $header.addClass(order);
    });
};

function onHeaderClick(e) {
    var col, $target = $(e.target);

    if ($(e.target).parent().hasClass('column-headers'))
        col = $target;
    else
        col = $target.parents('.column-headers > li');

    var colName = col.data('name'),
        colOrder = col.data('column-sort-order') || 0;

    var orderMap = [null, 'asc', 'desc'];
    var colOrderClass = orderMap[(colOrder + 1) % 3];

    col.data('column-sort-order', (colOrder + 1) % 3);
    col.prop('class', colOrderClass);

    trigger('order', colName, colOrderClass);
}

function onHeaderMenuClick(e) {
    var $header = $(e.target).parent();

    // TODO: This is temporary. Fix it.
    if ($header.hasClass('filter'))
        hideFilter($header);
    else
        showFilter($header);
}

function onFilterKeyup(e) {
    var key = e.which || e.keyCode;

    switch(key) {
    case 27:
        hideFilter($(e.target).parent());
        break;
    }
}

function onFilterKeypress(e) {
    var key = e.which || e.keyCode;

    switch(key) {
    case 13:
        onEnterFilter($(e.target).parent());
        break;
    }
}

function onEnterFilter($header) {
    var $textbox = $header.children('input');
    var $headerTitle = $header.children('a.header');

    var fieldName = $header.data('name');
    var filter = $textbox.val();

    if (filter != filters[fieldName]) {
        if (_.isEmpty(filter)) {
            delete filters[fieldName];
            $headerTitle.children('span').remove();
        } else {
            filters[fieldName] = filter;
            $headerTitle.children('span').remove();
            $headerTitle.append($('<span>' + filter + '</span>'));
        }

        trigger('filter', filters);
    }

    hideFilter($header);
}

function showFilter($header) {
    $header.addClass('filter');
    $header.children('input').focus();
}
function hideFilter($header) {
    var $textbox = $header.children('input');
    var fieldName = $header.data('name');

    $textbox.val(filters[fieldName]);

    $header.removeClass('filter');
}

//     if (e.which == 13) {
//         var filters = {};
//         this.$filters.children('th').each(function(index, el) {
//             var $el = $(el).children('input');

//             if (!_.isEmpty($el.val()))
//                 filters[$el.data('name')] = $el.val();
//         });
//         this.trigger('filter', filters);

//         // Select text inside active filter box
//         $(e.target).select();

//         e.preventDefault();

//     }
// };

return GridHeader;
});
