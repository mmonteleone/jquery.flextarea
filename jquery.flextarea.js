/**
 * jQuery.flextarea - smart HTML5-aware auto-resizing textarea 
 *
 * version 0.9.0
 *
 * http://michaelmonteleone.net/projects/flextarea
 * http://github.com/mmonteleone/jquery.flextarea
 *
 * Copyright (c) 2009 Michael Monteleone
 * Licensed under terms of the MIT License (README.markdown)
 */
(function($){
    /**
     * Helpers
     */
    var contextKey = '_flextarea_context',
        currentJqSupportsLive = Number($.fn.jquery.split('.').slice(0,2).join('.')) >= 1.4,
        minHeightAttr = 'data-minheight',
        maxHeightAttr = 'data-maxheight',
        minRowsAttr = 'data-minrows',
        maxRowsAttr = 'data-maxrows';
        
    $.fn.extend({
        /**
         * Main plugin code
         */
        flextarea: function(options) {
            var settings = $.extend({}, $.fn.flextarea.defaults, options || {}),
                selection = this,
                measureDivContainer,
                sharedMeasureDiv = null,
                binder = settings.live ? 'live' : 'bind',
                /**
                 * Builds an object of style information about a textarea
                 */
                captureTextStyles = function(textarea) {
                    var styles = {};
                    $.each(settings.styles, function(){
                        var styleName = String(this);
                        styles[styleName] = textarea.css(styleName);
                    });
                    return styles;
                },
                /**
                 * Constructs a div that matches a given textarea
                 * style for style.  Since divs can auto-resize based on their content
                 * This will be used to measure the height of how big a textarea should be
                 * given the same content and styling of a matched textarea
                 * @param {Element} textarea the text area to mirror
                 * @returns Div element
                 */
                constructMeasureDiv = function(textarea) {
                    measureDivContainer = measureDivContainer || 
                        $('<div class="flextarea-measurediv-container"></div>')
                            .css({ position: 'absolute', left: '-50000px', top: '-50000px' })
                            .appendTo($('body'));

                    return $('<div></div>')
                        .css($.extend({}, captureTextStyles(textarea), {
                                display: 'none',
                                width: textarea.css('width')
                            }))
                        .appendTo(measureDivContainer);
                },
                /**
                 * Given a pre-styled measure div and a number of rows, calculates 
                 * the height those given rows would take in pixels, vertically
                 * @param {Element} measureDiv div with same styling as its matched textarea
                 * @param {Number} rows number of rows to calculate
                 * @returns height in pixels that those rows would take vertically within the styled div
                 */
                rowsToHeight = function(measureDiv, rows) {
                    var blankRows = '';
                    for(var i = 1; i < rows; i++){
                        blankRows += '<br />&nbsp;';
                    }
                    measureDiv.html(blankRows);
                    return measureDiv.height();
                },
                /**
                 * calculates and attaches metadata about a textarea to it for future use
                 * when the textarea needs to be resized
                 * @param {Element} text text area to attach metadata to
                 */
                buildAndAttachContext = function(text) {
                    if(text.data(contextKey) === null || text.data(contextKey) === undefined) {
                        var context = $.extend({},settings);
                    
                        // for efficiency, if shareMeasure is true, only constructs one measure
                        // div for all textareas on a given page.  This is useful for scenarios
                        // where there are many equally styled textareas on a given page, and hence no need
                        // to build a mirror div for each.
                        if(settings.shareMeasure) {
                            sharedMeasureDiv = sharedMeasureDiv || constructMeasureDiv(text, settings.styles);
                            context.measureDiv = sharedMeasureDiv;
                        } else {
                            context.measureDiv = constructMeasureDiv(text, settings.styles);
                        }
                        
                        // give preference to any explicitly-defined HTML5 data attributes 
                        // directly on the elements for defining the min/max heights/rows 
                        context.minRows = text.attr(minRowsAttr) || context.minRows;
                        context.minHeight = text.attr(minHeightAttr) || context.minHeight;
                        context.maxRows = text.attr(maxRowsAttr) || context.maxRows;
                        context.maxHeight = text.attr(maxHeightAttr) || context.maxHeight;
                        
                        context.minHeight = context.minRows !== null ? 
                            rowsToHeight(context.measureDiv, context.minRows) : 
                            context.minHeight;
                        context.maxHeight = context.maxRows !== null ? 
                            rowsToHeight(context.measureDiv, context.maxRows) : 
                            context.maxHeight;                        
                            
                        text.data(contextKey, context);
                    }
                };
             
            // throw exception if live set but no jq 1.4 or greater                
            if(!currentJqSupportsLive && settings.live) {
                throw("Use of the live option requires jQuery 1.4 or greater");
            }
            
            // the events which trigger a possible resize
            $.each('keydown change paste maxlength'.split(' '), function(){
                selection[binder](String(this), function(e){
                    // don't actually check for resizing until 1 ms after the event,
                    // as the value hasn't yet changed as of change and keydown.
                    settings.global.setTimeout(function(){
                        var text = $(e.target);
                        buildAndAttachContext(text);
                        text.flextareaResize();
                    }, 1);
                });
            });
                
            // textareas that already contain content should
            // also be processed upon initial activation
            return selection
                .each(function(){ buildAndAttachContext($(this)); })
                .flextareaResize();
        },
        
        /**
         * Performs the actual resizing of a textarea
         */
        flextareaResize: function() {
            return this.each(function(){
                var textarea = $(this),
                    text = textarea.val(),
                    context = textarea.data(contextKey);                
                    
                if(context !== null || context !== undefined) {
                    context.measureDiv.html(text.replace(/\n/g,'<br />')
                        .replace(/\s\s/g, ' &nbsp;') + context.padWord);

                    var newStyle = {overflow: 'hidden'},
                        currentHeight = textarea.height(),
                        newHeight = context.measureDiv.height();

                    if(newHeight < context.minHeight) {
                        newStyle.overflow = 'hidden';
                        newHeight = context.minHeight;
                    } else if (newHeight >= context.maxHeight) {
                        newStyle.overflow = 'auto';
                        newHeight = context.maxHeight;
                    }

                    if(newHeight != currentHeight) {
                        newStyle.height = newHeight + 'px';
                        textarea.css(newStyle);

                        textarea.trigger('resize');
                        if(newHeight > currentHeight) {
                            textarea.trigger('grow');
                        } else if(newHeight < currentHeight) {
                            textarea.trigger('shrink');
                        }
                    }
                }                    
            });    
        }
    });
    
    /**
     * Shortcut alias for
     * $('textarea').flextarea(options);
     *
     * @param {Object} options optional object literal of options
     */
    $.flextarea = function(options) {
        $($.fn.flextarea.defaults.selector).flextarea(options);
    };
    
    $.extend($.fn.flextarea, {
        version: '0.9.0',
        defaults: {
            // min height in pixels that a textarea will never shrink below
            minHeight: 0,
            // max height in pixels that a textarea will never grow beyond (though it will scroll beyond)
            maxHeight: 999999,
            // min rows that a textarea will never shrink below.  intelligently measures the 
            // vertical space these rows would take up in the case of proportional fonts
            // takes precedence over minHeight if minHeight is provided
            minRows: null,
            // max rows that a textarea will never grow beyond.  intelligently measures the 
            // vertical space these rows would take up in the case of proportional fonts
            // takes precedence over maxHeight if maxHeight is provided
            maxRows: null,
            // for efficiency, if a page contains many equally sized and styled textareas, they can
            // all share the same measure div.
            shareMeasure: false,
            // word whose length appended to actual text is assumed during typing for purposes 
            // resizing the textarea pre-emptively before the cursor actually gets to the end of the line
            padWord: ' MMMMMMMM',
            // defaults to live handling when in jq 1.4
            live: currentJqSupportsLive,
            // selector used by the shortcut $.flextarea() method instead of $(selector).flextarea()
            selector: 'textarea',
            global: window,
            // styles duplicated from target textarea to measure div
            styles: [
                'border-top-width','border-top-style','border-bottom-width',
                'border-bottom-style','border-right-width','border-right-width-value',
                'border-right-style','border-right-style-value','border-left-width',
                'border-left-width-value','border-left-style','border-left-style-value',
                'font-family','font-size','font-size-adjust','font-stretch',
                'font-style','font-variant','font-weight','padding-bottom',
                'padding-left','padding-right','padding-top','letter-spacing',
                'line-height','text-align','text-indent','word-spacing' ]
        }        
    });
    
})(jQuery);