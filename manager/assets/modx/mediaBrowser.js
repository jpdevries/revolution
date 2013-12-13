// MODX 
// A boilerplate for jumpstarting jQuery plugins development
// version 1.1, May 14th, 2011
// by Stefan Gabos

// remember to change every instance of "mediaBrowser" to the name of your plugin!
(function($) {

    // here we go!
    $.mediaBrowser = function(element, options) { 

        // plugin's default options
        // this is private property and is  accessible only from inside the plugin
        var defaults = {
			'data':{},
			'parent':'.browser-panel',
			'gridBtn':'.options .icon-th-large',
			'listBtn':'.options .icon-list',
			'uploadBtn':'.options .icon-upload',
			'expandBtn':'.options .resize',
			'uploadCancelBtn':'.cancel-upload',
			'listClass':'table-view',
			'gridClass':'grid-view',
			'dragOpen':'drag-open',
			'uploadingClass':'mx-uploading',
			'rowChunk':'<tr><td><img class="file-element" src=""></td><td> <span class="filename" data-sortkey="filename"></span> </td> <td> <span class="file-size" data-sortkey="filesize" data-filesize=""></span> </td> <td> <span class="dimensions" data-sortkey="dimensions"></span> </td> <td> <span class="last-modified" data-sortkey="editedon" data-format="date" data-date-time=""></span> </td> </tr>',
            'sortClick':'.icon-sort',
            'dateFormat':'dd/MM/yyyy HH:mm:ss',
	        // if your plugin is event-driven, you may provide callback capabilities
	        // for its events. execute these functions before or after events of your 
	        // plugin, so that users may customize those particular events without 
	        // changing the plugin's code
	        onUpdate: function() {}
		}

        // to avoid confusions, use "plugin" to reference the 
        // current instance of the object
        var plugin = this;

        // this will hold the merged default, and user-provided options
        // plugin's properties will be available through this object like:
        // plugin.settings.propertyName from inside the plugin or
        // element.data('mediaBrowser').settings.propertyName from outside the plugin, 
        // where "element" is the element the plugin is attached to;
        plugin.settings = {}

        var $element = $(element), // reference to the jQuery version of DOM element
             element = element;    // reference to the actual DOM element

        var sortField,
            sortDir;

        // the "constructor" method that gets called when the object is created
        plugin.init = function() {

            // the plugin's final properties are the merged default and 
            // user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);

            // code goes here
            assignListeners();
			plugin.settings.onUpdate($element);
        }

        // public methods
        // these methods can be called like:
        // plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
        // element.data('mediaBrowser').publicMethod(arg1, arg2, ... argn) from outside 
        // the plugin, where "element" is the element the plugin is attached to;

        // feed it JSON, updates the view
        // 
        plugin.update = function(_json) {
            redraw(_json.results); 

            assignListeners();
            plugin.settings.onUpdate($element);
		} 

        plugin.sortBy = function(_field, _dir) {
            // save settings globally note: these need to go in a cookie too
            sortField = _field;
            sortDir = _dir;

            var _a = [];
            var _th = $element.find('thead');
            // for each row (file)
            $element.find('tbody tr').each(function(){
                var _t = $(this);
                var _o = {};
                var _tds = _t.children('td');
                var _ths = _th.children('tr').children();
                // for each column
                _tds.children('span').each(function(){
                    // pump data by key
                    _o[$(this).data('sortkey')] = $(this).html();
                    // what column are we on? (remember span 0 is the image or file thumbnail and essentially ignored, starts at 1)
                    var _colIndex = _tds.index($(this).parent());
                    var _iconsort = _ths.eq(_colIndex).find(plugin.settings.sortClick); // the sort button
                    var _format = _iconsort.data('format') || ''; // check if this column has an explicit format such as date
                    switch(_format.toLowerCase()) {
                        case 'date':
                        // set the time
                        _o[$(this).data('sortkey')] = $(this).data('date-time');
                        break; 

                        case 'filesize':
                        _o[$(this).data('sortkey')] = $(this).data('filesize');
                        break;
                    }
                });
                _o.src = _t.children('td').children('.file-element').attr('src');  // set the file source

                console.log(_o);

                // add the row (file)
                _a.push(_o);
            });

            // set sort field to time if the column to be sorted on is of date format
            //if(_th.find(plugin.settings.sortClick + '[data-sortkey="' + _field + '"]').data('format') == 'date') _field = 'time';


            // sort the items
            sort(_a,sortField,sortDir);
            // update view, assign listeners
            redraw(_a);
            assignListeners();
            plugin.settings.onUpdate($element);
        }

        // private methods
        // these methods can be called only from inside the plugin like:
        // methodName(arg1, arg2, ... argn)

        // a private method. for demonstration purposes only - remove it!
        var assignListeners = function() {
            $(plugin.settings.gridBtn).unbind('click').click(function(e){
                console.log(plugin.settings.parent);
                $(plugin.settings.parent).removeClass(plugin.settings.listClass).addClass(plugin.settings.gridClass);
            });

            $(plugin.settings.listBtn).unbind('click').click(function(e){
                $(plugin.settings.parent).removeClass(plugin.settings.gridClass).addClass(plugin.settings.listClass);
            });

            $(plugin.settings.expandBtn).unbind('click').click(function(e){
                $(plugin.settings.parent).toggleClass(plugin.settings.dragOpen);
            });

            $(plugin.settings.uploadCancelBtn).children('.icon-remove').click(function(e){
                $('.' + plugin.settings.uploadingClass).removeClass('mx-uploading');
            });

            $element.find(plugin.settings.sortClick).unbind('click').click(function(){
                var _t = $(this);
                console.log(_t.data('sort-dir'));
                _t.data('sort-dir',(_t.data('sort-dir') == 'DESC') ? 'ASC' : 'DESC');
                console.log(_t.data('sort-dir'));
                plugin.sortBy(_t.data('sortkey'),_t.data('sort-dir'));
            });

            //assignRowListeners();
        }
        
        var assignRowListeners = function() {
            // visually select files
            $element.find('tbody tr').click(function(e){
                e.preventDefault(); 
                $(this).siblings().removeClass('selected');
                $(this).addClass('selected');
            });
        }

        var redraw = function(_a) {
            // sort the items
            sort(_a,sortField,sortDir);

            var _c = $element.children('tbody').clone().empty();

            var _l = _a.length;
            for(var i = 0; i < _l; i++) {
                var _h = $(plugin.settings.rowChunk);
                var _di = _a[i];
				_di.editedon = Number(_di.editedon);
                _h.find('.filename').html(_di.filename);
                _h.find('.file-size').html(formatFilesize(_di.filesize)).attr('data-filesize',_di.filesize);
                _h.find('.dimensions').html(_di.dimensions);
				console.log(_di.editedon);
                _h.find('.last-modified').html(new Date(_di.editedon).toLocaleString()).attr('data-date-time',_di.editedon);
                _h.find('img').attr('src',_di.src);
                _c.append(_h);
            }
            $element.children('tbody').replaceWith(_c);
        }

        var formatFilesize = function(size) {
            size = parseInt(size);
            size = Math.max(1024,size);
            var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var i = 0;
            while(size >= 1024) {
                size /= 1024;
                ++i;
            }
            return size.toFixed(1) + ' ' + units[i];
        }

        var sort = function sort(_a,_field,_dir) {
            _a.sort(compare);
            function compare(a,b) {
                if(a[_field] < b[_field]) return (_dir == 'DESC') ? 1 : -1;
                else if(a[_field] > b[_field]) return (_dir == 'DESC') ? -1 : 1;
                return 0;
            }
        }

        // fire up the plugin!
        // call the "constructor" method
        plugin.init();
    }

    // add the plugin to the jQuery.fn object
    $.fn.mediaBrowser = function(options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data('mediaBrowser')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.mediaBrowser(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('mediaBrowser').publicMethod(arg1, arg2, ... argn) or
                // element.data('mediaBrowser').settings.propertyName
                $(this).data('mediaBrowser', plugin);

            }

        });

    }

})(jQuery);