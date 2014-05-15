/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * Define a module along with a payload
 * @param module a name for the payload
 * @param payload a function to call with (require, exports, module) params
 */

(function() {

var NAMESPACE = "";

var global = (function() {
    return this;
})();


if (!NAMESPACE && typeof requirejs !== "undefined")
    return;


var _define = function(module, deps, payload) {
    if (typeof module !== 'string') {
        if (_define.original)
            _define.original.apply(window, arguments);
        else {
            console.error('dropping module because define wasn\'t a string.');
            console.trace();
        }
        return;
    }

    if (arguments.length == 2)
        payload = deps;

    if (!_define.modules) {
        _define.modules = {};
        _define.payloads = {};
    }

    _define.payloads[module] = payload;
    _define.modules[module] = null;
};

/**
 * Get at functionality define()ed using the function above
 */
var _require = function(parentId, module, callback) {
    if (Object.prototype.toString.call(module) === "[object Array]") {
        var params = [];
        for (var i = 0, l = module.length; i < l; ++i) {
            var dep = lookup(parentId, module[i]);
            if (!dep && _require.original)
                return _require.original.apply(window, arguments);
            params.push(dep);
        }
        if (callback) {
            callback.apply(null, params);
        }
    }
    else if (typeof module === 'string') {
        var payload = lookup(parentId, module);
        if (!payload && _require.original)
            return _require.original.apply(window, arguments);

        if (callback) {
            callback();
        }

        return payload;
    }
    else {
        if (_require.original)
            return _require.original.apply(window, arguments);
    }
};

var normalizeModule = function(parentId, moduleName) {
    // normalize plugin requires
    if (moduleName.indexOf("!") !== -1) {
        var chunks = moduleName.split("!");
        return normalizeModule(parentId, chunks[0]) + "!" + normalizeModule(parentId, chunks[1]);
    }
    // normalize relative requires
    if (moduleName.charAt(0) == ".") {
        var base = parentId.split("/").slice(0, -1).join("/");
        moduleName = base + "/" + moduleName;

        while(moduleName.indexOf(".") !== -1 && previous != moduleName) {
            var previous = moduleName;
            moduleName = moduleName.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
        }
    }

    return moduleName;
};

/**
 * Internal function to lookup moduleNames and resolve them by calling the
 * definition function if needed.
 */
var lookup = function(parentId, moduleName) {

    moduleName = normalizeModule(parentId, moduleName);

    var module = _define.modules[moduleName];
    if (!module) {
        module = _define.payloads[moduleName];
        if (typeof module === 'function') {
            var exports = {};
            var mod = {
                id: moduleName,
                uri: '',
                exports: exports,
                packaged: true
            };

            var req = function(module, callback) {
                return _require(moduleName, module, callback);
            };

            var returnValue = module(req, exports, mod);
            exports = returnValue || mod.exports;
            _define.modules[moduleName] = exports;
            delete _define.payloads[moduleName];
        }
        module = _define.modules[moduleName] = exports || module;
    }
    return module;
};

function exportIRERPGrid(ns) {
    var require = function(module, callback) {
        return _require("", module, callback);
    };

    var root = global;
    if (ns) {
        if (!global[ns])
            global[ns] = {};
        root = global[ns];
    }

    if (!root.define || !root.define.packaged) {
        _define.original = root.define;
        root.define = _define;
        root.define.packaged = true;
    }

    if (!root.require || !root.require.packaged) {
        _require.original = root.require;
        root.require = require;
        root.require.packaged = true;
    }
}

exportIRERPGrid(NAMESPACE);

})();
﻿define('IRERP/IRERPGrid', ['require', 'exports', 'module' , 'IRERP/lib/shims', 'IRERP/Grid'], function(require, exports, module) {

/*********************************************************
 * GridCacheManager -                   * currently stub *
 *********************************************************/
var GridCacheManager = {};

/*********************************************************
 * GridColumn -                         * currently stub *
 *********************************************************/
var GridColumn = {
    name: 'columnName',
    display: 'Column Name',
    order: null,    /* 'asc' or 'desc' or null */
    filter: null,   /* a string or an object */
    valueMap: function( value ) { return value; },
    cssMap: function( value ) { return null }
};

var $ = require('./lib/shims').$;
var Grid = require('./Grid');

$.fn.extend({
    IRERPGrid: function(options) {
        this.grid = Object.create( Grid );
        this.grid.init(this, options);

        return this.grid;
    }
});

});
(function(root) {
	define('IRERP/lib/shims', ['require', 'exports', 'module' , 'jquery'], function(require, exports, module) {
		if (define.amd) {
			exports.$ = require('jquery');
		} else {
			exports.$ = (root.jQuery || root.Zepto || root.ender || root.$);
		}
	});
})(this);
define('IRERP/Grid', ['require', 'exports', 'module' , 'IRERP/lib/shims', 'IRERP/lib/utils', 'IRERP/GridHeader', 'IRERP/GridPager', 'IRERP/GridTable', 'IRERP/GridToolbar', 'IRERP/lib/backbone-events'], function(require, exports, module) {

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
});//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

define('IRERP/lib/utils', ['require', 'exports', 'module' ], function(require, exports, module) {
"use strict";

// Is a given variable an object?
exports.isObject = function(obj) {
    return obj === Object(obj);
};

// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].forEach(function(name) {
    exports['is' + name] = function(obj) {
    	return Object.prototype.toString.call(obj) == '[object ' + name + ']';
    };
});

exports.isEmpty = function(obj) {
    if (obj == null) return true;
    if (Array.isArray(obj) || exports.isString(obj)) return obj.length === 0;
    for (var key in obj) if (exports.has(obj, key)) return false;
    return true;
};

exports.pluck = function(array, key) {
	return array.map(function(item) { return item[key]; });
};

exports.each = function(obj, iterator, context) {
	var keys = Object.keys(obj);
	for (var i = 0, length = keys.length; i < length; i++) {
		iterator.call(context, obj[keys[i]], keys[i], obj);
	}
};

exports.map = function(obj, iterator, context) {
	var result = [];
    if (obj == null) return results;

	exports.each(obj, function(value, index, list) {
		results.push(iterator.call(context, value, index, list));
	});

	return result;
};

exports.has = function(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
};

exports.indexBy = function(array, key) {
	var result = {};
	array.forEach(function(item) {
		result[item[key]] = item;
		delete item[key];
	});

	return result;
};

var idCounter = 0;
exports.uniqueId = function(prefix) {
	var id = ++idCounter + '';
	return prefix ? prefix + id : id;
};

});
define('IRERP/GridHeader', ['require', 'exports', 'module' , 'IRERP/lib/shims', 'IRERP/lib/utils', 'IRERP/lib/backbone-events'], function(require, exports, module) {

var $ = require('./lib/shims').$;
var _ = require('./lib/utils');

var EventEmitter = require('./lib/backbone-events');

"use strict";

/****************************************************************************
 * View manager for Grid's THEAD section
 */
var GridHeader = Object.create( EventEmitter );

var $headersContainer, filters, trigger;

GridHeader.init = function( header ) {
    $headersContainer = (this.$el = $(header)).find('.column-headers');

    $headersContainer.on('click', 'li > a.header', onHeaderClick);
    $headersContainer.on('click', 'li > a.header-menu', onHeaderMenuClick);

    $headersContainer.on('keyup', 'li.filter > input', onFilterKeyup);
    $headersContainer.on('keypress', 'li.filter > input', onFilterKeypress);

    filters = {};
    trigger = this.trigger.bind(this);
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

        hideFilter($header);
    }
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
define('IRERP/lib/backbone-events', ['require', 'exports', 'module' , 'IRERP/lib/utils'], function(require, exports, module) {
"use strict";

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  var _ = require('./utils');

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : Object.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  return Events;
});
define('IRERP/GridPager', ['require', 'exports', 'module' , 'IRERP/lib/shims', 'IRERP/lib/backbone-events'], function(require, exports, module) {

var $ = require('./lib/shims').$;

var EventEmitter = require('./lib/backbone-events');

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
define('IRERP/GridTable', ['require', 'exports', 'module' , 'IRERP/lib/shims', 'IRERP/lib/backbone-events'], function(require, exports, module) {

var $ = require('./lib/shims').$;

var EventEmitter = require('./lib/backbone-events');

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
define('IRERP/GridToolbar', ['require', 'exports', 'module' , 'IRERP/lib/shims', 'IRERP/lib/utils', 'IRERP/lib/backbone-events'], function(require, exports, module) {

var $ = require('./lib/shims').$;
var _ = require('./lib/utils');

var EventEmitter = require('./lib/backbone-events');

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