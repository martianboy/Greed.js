define(['jquery',
        './lib/EventEmitter'],
function($, EventEmitter) {

"use strict";

/****************************************************************************
 * View manager for Grid's main table body section
 */

var $tableContainer, $bodyContainer, $rowsContainer, $activeRow, trigger;

var GridTable = Object.create( EventEmitter, {
    width: {
        get: function() { return $rowsContainer.width(); }
    },
    height: {
        get: function() { return $rowsContainer.height(); }
    },
    itemsInViewport: {
        get: itemsInViewport
    }
});

GridTable.init = function(tbody, totalPages) {
    $rowsContainer = this.el = $(tbody);
    $rowsContainer.prop('tabindex', '0');

    $tableContainer = $rowsContainer.parents('.table-container');
    $bodyContainer = $rowsContainer.parents('.body-container');

    $activeRow = null;

    $rowsContainer.on('mousedown', 'tr', rowMouseDown);
    $rowsContainer.keydown(keydown);
    $rowsContainer.keypress(keypress);
    $rowsContainer.keyup(keyup);

    $rowsContainer.on('mouseenter', 'tr', rowMouseEnter);

    trigger = this.trigger.bind(this);
};

GridTable.setContents = function(html) {
    $rowsContainer.html(html);
    $activeRow = null;
};

function itemsInViewport() {
    var rowHeight = $rowsContainer.children().first().height();
    var containerHeight = $bodyContainer.height();

    return Math.floor(containerHeight / rowHeight);
}

function rowMouseEnter(e) {
    trigger('rowHover', $(e.target).parent());
}

function rowMouseDown(e) {
    activateRow($(e.target).parents('tr'));
}

function keydown(e) {
    var key = (e.which || e.keyCode);

    switch(key) {
    case 33:
    case 34:
    case 35:
    case 36:
    case 38:
    case 40:
        keyboardNav(key);
        e.preventDefault();

        break;
    case 37:
    case 39:
        keyboardScroll(key);
        break;
    }
};

function keypress(e) {
    var key = e.which || e.keyCode;

    // console.log(key);
}
function keyup(e) {
    var key = e.which || e.keyCode;

    // console.log(key);
}

function keyboardScroll(key) {
    var scrollPosition = $tableContainer.scrollLeft(),
        scrollWidth = $tableContainer.get(0).scrollWidth;

    switch(key){
    case 37:
        if (scrollPosition > 0)
            $tableContainer.scrollLeft(scrollPosition - 20);
        break;
    case 39:
        if (scrollPosition < scrollWidth)
            $tableContainer.scrollLeft(scrollPosition + 20);
        break;
    }
}

function keyboardNav(key) {
    var $row, $rows = $rowsContainer.children();
    if ($rows.length == 0) return;

    var index = $rows.index($activeRow);

    if ($activeRow)
        switch(key) {
        case 33:
            $row = $($rows.get(Math.max(0, index - itemsInViewport())));
            break;
        case 34:
            $row = $($rows.get(Math.min(index + itemsInViewport(), $rows.length - 1)));
            break;
        case 35:
            $row = $rows.last();
            break;
        case 36:
            $row = $rows.first();
            break;
        case 37:
            break;
        case 38:
            $row = $activeRow.prev();
            break;
        case 39:
            //.scrollLeft()
        case 40:
            $row = $activeRow.next();
            break;
        }
    else
        switch(key) {
        case 33:
        case 35:
        case 38:
            $row = $rows.last();
            break;
        case 34:
        case 36:
        case 40:
            $row = $rows.first();
            break;
        }

    activateRow($row);
}

function scrollIntoView($row) {
    var container = $bodyContainer.get(0),
        row = $row.get(0);

    var docViewTop = container.scrollTop;
    var docViewBottom = docViewTop + container.offsetHeight;

    var elemTop = row.offsetTop;
    var elemBottom = elemTop + row.offsetHeight;

    if (elemTop < docViewTop)
        row.scrollIntoView(true);
    else if (elemBottom > docViewBottom)
        row.scrollIntoView(false);
}

function activateRow($row) {
    if ($row.length == 0) return;

    if ($activeRow)
        if ($activeRow.get(0) == $row.get(0))
            return;
        else
            $activeRow.removeClass('active');

    trigger('rowSelected', $row);

    $activeRow = $row;
    $activeRow.addClass('active');

    scrollIntoView($row);
}

return GridTable;
});
