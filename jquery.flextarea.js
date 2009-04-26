(function($){
    var contextKey = '_flextarea_context',
        minHeightAttr = 'data-minheight',
        maxHeightAttr = 'data-maxheight',
        minRowsAttr = 'data-minrows',
        maxRowsAttr = 'data-maxrows';
        
    $.fn.extend({
        flextarea: function(options) {
            var settings = $.extend({}, $.fn.flextarea.defaults, options || {}),
                selection = this,
                measureDivContainer,
                sharedMeasureDiv = null;

                captureTextStyles = function(textarea) {
                    var styles = {};
                    $.each(settings.styles, function(){
                        var styleName = String(this);
                        styles[styleName] = textarea.css(styleName);
                    });
                    return styles;
                },
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
                rowsToHeight = function(measureDiv, rows) {
                    var blankRows = '';
                    for(var i = 1; i < rows; i++){
                        blankRows += '<br />&nbsp;';
                    }
                    measureDiv.html(blankRows);
                    return measureDiv.height();
                },
                buildAndAttachContext = function(text) {
                    if(text.data(contextKey) === null || text.data(contextKey) === undefined) {
                        var context = $.extend({},settings);
                    
                        if(settings.shareMeasure) {
                            sharedMeasureDiv = sharedMeasureDiv || constructMeasureDiv(text, settings.styles);
                            context.measureDiv = sharedMeasureDiv;
                        } else {
                            context.measureDiv = constructMeasureDiv(text, settings.styles);
                        }
                        
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
             
            $.each('keydown change paste maxlength'.split(' '), function(){
                selection.bind(String(this), function(e){
                    settings.global.setTimeout(function(){
                        var text = $(e.target);
                        buildAndAttachContext(text);
                        text.flextareaResize();
                    }, 1);
                });
            });
                
            return selection
                .each(function(){ buildAndAttachContext($(this)); })
                .flextareaResize();
        },
        
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
    
    $.flextarea = function(options) {
        $($.fn.flextarea.defaults.selector).flextarea(options);
    };
    
    $.extend($.fn.flextarea, {
        version: '0.5.0',
        defaults: {
            minHeight: 0,
            maxHeight: 999999,
            minRows: null,
            maxRows: null,
            shareMeasure: false,
            padWord: ' MMMMMMMM',
            selector: 'textarea',
            global: window,
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