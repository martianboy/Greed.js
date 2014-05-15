require.config({
    baseUrl: 'js',
    shim: {
        'bootstrap': {
            deps: ['jquery']
        }
    }
});

require(['Grid'], function() {
    require(['jquery', 'GridFormatter', 'GridDataSource', 'bootstrap', 'jquery.mousewheel'], function($, GridFormatter, GridDataSource) {
        $.fn.textWidth = function(text, font) {
            if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
            $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
            return $.fn.textWidth.fakeEl.width();
        };
        require(['IRERP/IRERPGrid'], function() {
            $(function() {
                var $gridContainer = $('.grid-container');
                $gridContainer.IRERPGrid();

                var ds = Object.create( GridDataSource );
                ds.init($gridContainer.data('grid-name'), 'http://localhost:16890');

                var formatterModal = Object.create( GridFormatter );
                formatterModal.init('#myModal');
                formatterModal.on('submit', function() {
                    ds.setFormatter(formatterModal.items);
                });
            });
        });
    });
});
