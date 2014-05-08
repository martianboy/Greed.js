define(function(require, exports, module) {

var $ = require('./lib/shims').$,
    _ = require('./lib/utils');

var GridHeader = require('./GridHeader');
var GridPager = require('./GridPager');
var GridTable = require('./GridTable');

var Grid = {
    init: function(container, options) {
        this._normalizeOptions(options);

        this.$container = $(container);
        this.$tableContainer = this.$container.children('.table-container');
        this.$toolbar = this.$container.children('[role=toolbar]');

        this.name = this.$container.data('grid-name');
        this.columns = options.columns || {};

        // this.dataSource = Object.create( GridDataSource );
        // this.dataSource.init(this.name, options.uri);

        this.header = Object.create( GridHeader );
        this.header.init(this.$tableContainer.find('.header-container'));

        this.body = Object.create( GridTable );
        this.body.init(this.$tableContainer.find('table[role=grid] > tbody'));

        this.pager = Object.create( GridPager );
        this.pager.init(this.$container.children('[role=navigation]'), options.totalPages);

        this.body.on('rowHover', this._customPager, this);

        if (options.dataSource)
            this._initDataSource(options.dataSource);
    },

    _initDataSource: function(ds) {
        this.dataSource = ds;
        this.dataSource.on('refresh', this._refreshGrid, this);

        if (this.header) {
            this.header.on('order', this._columnOrderChanged, this);
            this.header.on('filter', this.filter, this);
        }

        if (this.pager) {
            this.pager.on('requestPage', this._requestPage, this);
        }
    },

    refresh: function() {
        this._requestPage(0);
    },

    filter: function(filters) {
        this.dataSource.setFilter(filters);
        this.refresh();
    },

    _normalizeOptions: function(options) {
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

        this.options = options;
    },

    _showLoading: function() {
        this.$container.addClass('loading');
    },
    _hideLoading: function() {
        this.$container.removeClass('loading');
    },

    _refreshGrid: function(itemsHTML, state) {
        this._hideLoading();

        this.pager.reset(state.totalPages, state.currentPage);
        this.body.setContents(itemsHTML);
    },

    _requestPage: function(page) {
        this._showLoading();

        this.dataSource.getPage(page).fail(function(e) {
            setTimeout(function() {
                this._hideLoading();
            }.bind(this), 2000);
        }.bind(this)).done(this._resetGridUI.bind(this));
    },

    _columnOrderChanged: function(columnName, order) {
        this.dataSource.sort(columnName, order);
        this.refresh();
    },

    _resetGridUI: function() {
        var sort = this.dataSource.state.sort;

        this.header.$headers.children().each(function(index, header) {
            var $header = $(header);
            var field = $header.data('name');
            var order = sort[field];

            if (order == null)
                $header.removeClass('asc desc');
            else
                $header.addClass(order);
        });
        // Refresh UI, based on the final DataSource state
    },

    _customPager: function($row) {
        if (this.$tableContainer.offset().top + this.$tableContainer.height() - $row.offset().top < 2 * $row.height())
            this.pager.$el.fadeIn(100);
        else
            this.pager.$el.fadeOut(100);
    }
};

return Grid;

});
