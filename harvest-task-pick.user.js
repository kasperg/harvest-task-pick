// ==UserScript==
// @name            Harvest Task Pick
// @namespace       http://reload.dk/
// @description     Select harvest tasks using autocomplete instead of drop downs
// @version         0.3
// @include         https://*.harvestapp.com/*
// @match           https://*.harvestapp.com/*
// ==/UserScript==

HarvestTaskPick = function() {
  var self = this;
  
  self.scripts = [];
  
  self.loadScripts = function(callback) {
    src = self.scripts.shift();
    //Add the script to the document body
    var script = document.createElement("script");
    script.setAttribute('src', src);
    script.addEventListener('load', function() {
      if (self.scripts.length > 0) {
        self.loadScripts(callback);
      } else {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")();";
        document.body.appendChild(script);
      }
    }, false);
    document.body.appendChild(script);
  },
  
  self.loadStyles = function(styles) {
    var script = document.createElement("style");
    script.textContent = styles;
    document.body.appendChild(script);
  },
    
  self.init = function() {
    //Harvest uses Prototype so we need to avoid conflicts
    jQuery.noConflict();

    //Initialise Task Pick
    //NB: Task Pick currently only works when adding - not editing
    var selector = '.entries.daily .add_row_fields';
    jQuery(selector).harvestTaskPick();
    //Rerun Task Pick when clicking to add new entries
    jQuery('#add_day_entry_link').click(function() {
      jQuery(selector).harvestTaskPick(); 
    });
  },
  
  //Load the libraries we need into page scope. Inspired by
  //http://erikvold.com/blog/index.cfm/2010/6/14/using-jquery-with-a-user-script
  self.scripts.push('https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js');
  self.scripts.push('https://raw.github.com/kasperg/awesomecomplete/master/jquery.awesomecomplete.js');
  self.scripts.push('https://raw.github.com/kasperg/harvest-task-pick/master/jquery.harvest-task-pick.js', main);
  
  self.loadStyles(styles);
  
  self.loadScripts(self.init);
};

// Styles are injected here
var styles = "/**\
 * Sample stylesheet for L'Autocomplete\
 *  Clint Tseng — 2009-08-20\
 */\
\
/* Core styles */\
\
ul.autocomplete\
{\
    background-color: #fff;\
    border: 1px solid #777;\
    display: block;\
    list-style-type: none;\
    margin: 0;\
    min-height: 100px;\
    padding: 2px;\
    position: absolute;\
}\
\
ul.autocomplete li\
{\
    border-top: 1px solid #aaa;\
    cursor: pointer;\
    padding: 4px;\
}\
\
ul.autocomplete li:first-child\
{\
    border-top: none;\
}\
\
ul.autocomplete li.active\
{\
    background-color: #eef;\
}\
\
/* Default render function styles */\
\
ul.autocomplete li p\
{\
    margin: 1px 4px;\
}\
\
ul.autocomplete li p.title\
{\
    font-weight: bold;\
}\
\
ul.autocomplete li p.matchRow\
{\
    color: #666;\
}\
\
ul.autocomplete li span.matchedField\
{\
    color: #999;\
    font-style: italic;\
}\
\
ul.autocomplete span.match\
{\
    font-weight: bold;\
    text-decoration: underline;\
}\
              /* Harvest Tack Pick element styles */\
\
.harvest-task-pick input { height: 22px; padding: 10px 8px; font-size: 18px; font-weight: bold; }\
.harvest-task-pick ul.autocomplete { z-index: 1; }\
.harvest-task-pick ul.autocomplete li.active { background-color: #EEE; }\
.harvest-task-pick ul.autocomplete li p.title { padding: 0; color: #444; font-size: 11px; }";

HarvestTaskPick();