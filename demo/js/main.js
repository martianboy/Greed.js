require.config({
    baseUrl: 'js',
    paths: {
        src: '/src'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        }
    }
});

require(['jquery', 'GridFormatter', 'Greed', 'bootstrap', 'jquery.mousewheel'], function($, GridFormatter) {
    $.fn.textWidth = function(text, font) {
        if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
        $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
        return $.fn.textWidth.fakeEl.width();
    };
    $(function() {
        var $gridContainer = $('.grid-container');
        $gridContainer.greed();

        var formatterModal = Object.create( GridFormatter );
        formatterModal.init('#myModal');
    });
});
