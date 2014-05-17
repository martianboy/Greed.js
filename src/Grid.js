define(['jquery',
        'underscore',
        './lib/EventEmitter',
        './GridHeader',
        './GridPager',
        './GridTable',
        './GridToolbar'],
function($, _, EventEmitter, GridHeader, GridPager, GridTable, GridToolbar) {

var Grid = Object.create( EventTarget );

var $container, $tableContainer, $bodyContainer;
var toolbar, header, body, pager, ds;

Grid.init = function(container, options) {
    options = normalizeOptions(options);

    $container = this.$el = $(container);
    $tableContainer = $container.children('.table-container');
    $bodyContainer = $tableContainer.find('.body-container');

    mouseWheelSupport();

    toolbar = Object.create( GridToolbar );
    toolbar.init($container.children('[role=toolbar]'));
    toolbar.on('click.format', showFormatModal);

    header = Object.create( GridHeader );
    header.init($tableContainer.find('.header-container'));

    body = Object.create( GridTable );
    body.init($bodyContainer.find('table[role=grid] > tbody'));

    pager = Object.create( GridPager );
    pager.init($container.children('[role=navigation]'), options.totalPages);

    body.on('rowHover', customPager);

    if (options.dataSource) {
	    ds = options.dataSource;

	    if (header) {
	        header.on('order', onHeaderSort);
	        header.on('filter', onHeaderFilter);
	    }

	    if (pager)
	        pager.on('requestPage', onRequestPage);
	}
}
Grid.refresh = refresh;

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

function refresh() {
    showLoading();

    return ds.refresh()
        .then(resetGridUI)
        .fail(function(e) {
            setTimeout(function() {
                hideLoading();
            }, 2000);
            throw e;
        })
        .done();
}

function onHeaderSort(name, order) {
    ds.sortBy(name, order);
    refresh();
}

function onHeaderFilter(filters) {
    ds.filter = filters;
    refresh();
}

function onRequestPage(page) {
    ds.page = page;
    refresh();
}

// Refresh UI, based on the final DataSource state
function resetGridUI(result) {
    hideLoading();

    body.setContents(result.html);

    pager.reset(result.state.totalPages, result.state.currentPage);
    header.resetSortOrders(result.state.sort);
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
