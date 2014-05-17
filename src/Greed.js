define(['jquery', './Grid'], function($, Grid) {
$.fn.extend({
    greed: function(options) {
        var grid = Object.create( Grid );
        grid.init(this, options);

        grid.$el.data('greed', grid);
    }
});
});
