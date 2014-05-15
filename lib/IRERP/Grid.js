define(function(require, exports, module) {

var $ = require('./lib/shims').$,
    _ = require('./lib/utils');

var GridHeader = require('./GridHeader');
var GridPager = require('./GridPager');
var GridTable = require('./GridTable');
var GridToolbar = require('./GridToolbar');

var EventEmitter = require('./lib/backbone-events');

var Grid = Object.create( EventEmitter );

var $container, $tableContainer, $bodyContainer;
var toolbar, header, body, pager;

Grid.init = function(container, options) {
    options = this.options = normalizeOptions(options);

    $container = $(container);
    $tableContainer = $container.children('.table-container');
    $bodyContainer = $tableContainer.find('.body-container');

    mouseWheelSupport();

    this.name = $container.data('grid-name');
    this.columns = options.columns || {};

    toolbar = Object.create( GridToolbar );
    toolbar.init($container.children('[role=toolbar]'));
    toolbar.on('click.format', showFormatModal, this);

    header = Object.create( GridHeader );
    header.init($tableContainer.find('.header-container'));

    body = Object.create( GridTable );
    body.init($bodyContainer.find('table[role=grid] > tbody'));

    pager = Object.create( GridPager );
    pager.init($container.children('[role=navigation]'), options.totalPages);

    body.on('rowHover', customPager, this);

    if (options.dataSource) {
	    this.dataSource = options.dataSource;
	    this.dataSource.on('refresh', refreshGrid, this);

	    if (header) {
	        header.on('order', columnOrderChanged, this);
	        header.on('filter', this.filter, this);
	    }

	    if (pager)
	        pager.on('requestPage', this.requestPage, this);
	}
}

Grid.refresh = function() {
	return this.requestPage(0);
};

Grid.filter = function(filters) {
    this.dataSource.setFilter(filters);
    this.refresh();
}

Grid.requestPage = function(page) {
    showLoading();

    this.dataSource.getPage(page).fail(function(e) {
        setTimeout(function() {
            hideLoading();
        }, 2000);
        throw e;
    }).done(resetGridUI.bind(this, this.dataSource.state));
}

function normalizeOptions(options) {
    options = options || {};

    if (_.has(options, 'DataColumns')) {
        options.columns = _.indexBy(options.DataColumns, 'Name');
        delete options.DataColumns;
    }

    if (_.has(options, 'Columns')) {
        if (_.isEmpty(options.columns))
            options.columns = _.indexBy(options.Columns, 'Name');

        options.Columns.forEach(function(col) {
            options.columns[col.Name].visible = true;
        });

        delete options.Columns;
    }

    return options;
}

function mouseWheelSupport() {
    $tableContainer.mousewheel(function(e) {
        var scrollPosition = $tableContainer.scrollLeft();
        if ((scrollPosition > 0 && e.deltaX * e.deltaFactor < 0) ||
            (scrollPosition < $tableContainer.get(0).scrollWidth && e.deltaX * e.deltaFactor > 0)) {

            $tableContainer.scrollLeft(scrollPosition + e.deltaX * e.deltaFactor);
            e.preventDefault();
        }
    });

    $bodyContainer.mousewheel(function(e) {
        var scrollPosition = $bodyContainer.scrollTop();
        if ((scrollPosition > 0 && e.deltaY * e.deltaFactor > 0) ||
            (scrollPosition < $bodyContainer.get(0).scrollHeight && e.deltaY * e.deltaFactor < 0)) {

            $bodyContainer.scrollTop(scrollPosition - e.deltaY * e.deltaFactor);
            e.preventDefault();
        }
    });
}

function showLoading() {
    $container.addClass('loading');
}
function hideLoading() {
    $container.removeClass('loading');
}

function refreshGrid(itemsHTML, state) {
    hideLoading();

    pager.reset(state.totalPages, state.currentPage);
    body.setContents(itemsHTML);
}

function columnOrderChanged(columnName, order) {
    this.dataSource.sort(columnName, order);
    this.refresh();
}

function resetGridUI(state) {
    var sort = state.sort;

    header.$el.children().each(function(index, header) {
        var $header = $(header);
        var field = $header.data('name');
        var order = sort[field];

        if (order == null)
            $header.removeClass('asc desc');
        else
            $header.addClass(order);
    });
    // Refresh UI, based on the final DataSource state
}

function customPager($row) {
    if ($tableContainer.offset().top + $tableContainer.height() - $row.offset().top < 2 * $row.height() ||
        $row.next().length == 0)
        pager.$el.fadeIn(100);
    else
        pager.$el.fadeOut(100);
}

function showFormatModal() {
    //$('#myModal').modal('show');
}

return Grid;
});