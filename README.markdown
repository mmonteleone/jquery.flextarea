jQuery.flextarea
================
smart HTML5-aware auto-resizing textarea  
[http://github.com/mmonteleone/jquery.flextarea][0]  

What is it
----------

jQuery.flextarea is a simple jQuery plugin which intelligently resizes a textarea to the text within it in realtime.  It does this while respecting any custom styling or proportional fonts of the textarea.  It also allows for setting min and max heights in either pixel or row count, settable as optional parameters to the plugin or as HTML5 data-* attributes.  This is achieved by internally creating hidden divs with the same styling/sizing as the textareas and measuring the textarea's content within the resizing "measure div" for purposes of determining what height should be applied back to the target textarea.

Features
--------

* Automatically resizes textareas based on typing, pasting, changing
* Intelligently resizes based on measuring the textarea's contents within an equally-styled hidden div, not simply counting rows.  This allows for any combination of proportional fonts and custom styling of the textarea
* Allows setting min and max resize bounds either in pixel height or row count, in which the row count is first converted to pixel heigh by internally calculating how much vertical space the rows would take given the current styling
* Supports HTML5 attributes as an alternative way to configure resize bounds on specific textareas
* Exposes a simple event model for detecting when textareas have been resized
* When used with jQuery 1.4, fully supports live event delegation internally

Examples
--------

Pretty simple, really.

*Given:*

    <!-- any old textareas... -->
    <textarea></textarea>
    
    <!-- HTML5 attributes are also supported -->
    <textarea data-minrows="2" data-maxrows="10"></textarea>

*Then:*

    // auto-resizing all text areas
    $('textarea').flextarea();
    
    // auto-resizing all textareas with bounds in pixels
    $('textarea').flextarea({maxHeight: 400, minHeight: 20});

    // auto-resizing all textareas with bounds in rows 
    // the rows are first measured for how tall they would be given the 
    // textarea's style
    $('textarea').flextarea({maxRows: 5, minRows: 2});

    // equivalent to $('textarea').flextarea();
    $.flextarea();

Requirements, installation, and notes
-------------------------------------

jQuery.flextarea requires:

* [jQuery][3] 1.3.2 or greater

You can download the [zipped release][8] containing a minified build with examples and documentation or the development master with unit tests by cloning `git://github.com/mmonteleone/jquery.flextarea.git`.

jQuery.flextarea requires [jquery][3] 1.3.2 or greater and can be installed thusly 

    <script type="text/javascript" src="jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="jquery.flextarea.min.js"></script>

jQuery.flextarea includes a full unit test suite, and has been verified to work against Firefox 3.5, Safari 4, Internet Explorer 6,7,8, Chrome, and Opera 9 and 10.  Please feel free to test its suite against other browsers.

jQuery 1.4 Bonus
----------------

Flextarea works great with jQuery 1.3, but it's even better with 1.4.  When used with jQuery 1.4, jQuery.flextarea automatically assumes monitoring textareas via `.live()` instead of `.bind()`, allowing for client code to add more textareas after a jQuery.flextarea activation that will still be resized by flextarea.

This behavior is only available with jQuery 1.4 and can be overridden by specifying the 'live' boolean option.

Complete API
------------

### Activation

Within the `document.ready` event, call

    $('textarea').flextarea(options);

where options is an optional object literal of options.  This registers the matched controls to raise the new events.

    $('textarea').confine({minRows: 2, maxRows: 7});
    
If textareas have HTML5-valid data-minrows, data-maxrows, data-minheight, or data-maxheight attributes, can simply call:

    // assuming...
    <textarea data-maxrows="7" data-minrows="2"></textarea>
    <textarea data-maxheight="50"></textarea>
    
    $('textarea').flextarea();

As a shortcut,    

    $.flextarea(options);  

is an alias for `$('textarea').flextarea(options);`  

Once a textarea has been registered with flextarea, it can also be manually asked to resize itself to its current content even without events being raised on it by calling flextareaResize on it.

    preActivatedTextAreaSelection.flextareaResize();

### Options

* **minHeight**: min height in pixels that a textarea will never shrink below. If textareas provide their own minheight via the `data-minheight` attribute, they will override this value.
  * *default*: *0*
* **maxHeight**: max height in pixels that a textarea will grow shrink beyond without switching to scrolling. If textareas provide their own maxheight via the `data-maxheight` attribute, they will override this value.
  * *default*: *99999*
* **minRows**: min height in rows that a textarea will never shrink below.  first converts the rows to pixel height by measuring them against an equally-styled div.  This takes precedence over minHeight, if provided. If textareas provide their own minrows via the `data-minrows` attribute, they will override this value.
  * *default*: null
* **maxRows**: max height in rows that a textarea will never grow beyond.  first converts the rows to pixel height by measuring them against an equally-styled div.  This takes precedence over maxHeight, if provided. If textareas provide their own maxrows via the `data-maxrows` attribute, they will override this value.
  * *default*: null
* **selector**: default selector when using the `$.flextarea()` shortcut activation
  * *default*: `'textarea'`
* **live**: whether to monitor matched text areas via `live` instead of `bind`, allowing for live binding of `maxlength` by calling code and for resizing of matching textareas added to the DOM after activation.
  * *default*: `true` when using jQuery 1.4 or greater.  `false` otherwise.  Passing `true` without jQuery 1.4 or greater throws an exception.
* **shareMeasure**: for efficiency, if a page contains many equally sized and styled textareas, they can all share the same measure div.
  * *default*: `false`

### Events

* **resize**:  raised on matching textarea after it has been resized, either bigger or smaller.
* **grow**: raised on matching textarea after its height has grown
* **shrink**: raised on matching textarea after its height has reduced

How to Contribute
-----------------

Development Requirements (for building and test running):

* Ruby + Rake, PackR, rubyzip gems: for building and minifying
* Java: if you want to test using the included [JsTestDriver][6] setup

Clone the source at `git://github.com/mmonteleone/jquery.confine.git` and have at it.

The following build tasks are available:

    rake build     # builds package and minifies
    rake test      # runs jQuery.confine specs against QUnit testrunner in default browser
    rake server    # downloads, starts JsTestDriver server, binds common browsers
    rake testdrive # runs jQuery.confine specs against running JsTestDriver server
    rake release   # builds a releasable zip package

&lt;shameless&gt;Incidentally jQuery.confine's unit tests use QUnit along with one some of my other projects, [Pavlov][4], a behavioral QUnit extension and [Delorean][9], an accurate JavaScript time passage fake. &lt;/shameless&gt;


Changelog
---------

* 0.9.0 - Initial Release

License
-------

The MIT License

Copyright (c) 2009 Michael Monteleone, http://michaelmonteleone.net

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[0]: http://github.com/mmonteleone/jquery.flextarea "jQuery.flextarea"
[1]: http://michaelmonteleone.net "Michael Monteleone"
[3]: http://jquery.com "jQuery"
[4]: http://github.com/mmonteleone/pavlov "Pavlov"
[6]: http://code.google.com/p/js-test-driver/ "JsTestDriver"
[7]: http://github.com/mmonteleone/jquery.flextarea/raw/master/jquery.flextarea.js "raw flextarea script"
[8]: http://cloud.github.com/downloads/mmonteleone/jquery.flextarea/jquery.flextarea.zip "jQuery.flextarea Release"
