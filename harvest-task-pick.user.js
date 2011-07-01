/**
 * Copyright (c) 2011 Kasper Garnæs
 *
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 * THE SOFTWARE.
 **/

// ==UserScript==
// @name            Harvest Task Pick
// @namespace       http://reload.dk/
// @description     Select harvest tasks using autocomplete instead of drop downs
// @version         0.3.11180.1323
// @include         https://*.harvestapp.com/*
// @match           https://*.harvestapp.com/*
// ==/UserScript==

HarvestTaskPick = function() {
  var self = this;
  
  self.scripts = [];
  
  self.loadScripts = function(callbacks) {
    src = self.scripts.shift();
    //Add the script to the document body
    var script = document.createElement("script");
    script.setAttribute('src', src);
    script.addEventListener('load', function() {
      if (self.scripts.length > 0) {
        self.loadScripts(callbacks);
      } else if (callbacks !== undefined) {
        for (var i= 0; i < callbacks.length; i++) {
          var script = document.createElement("script");
          script.textContent = "(" + callbacks[i].toString() + ")();";
          document.body.appendChild(script);
        }
      }
    }, false);
    document.body.appendChild(script);
  },
  
  self.loadStyles = function(styles) {
    var script = document.createElement("style");
    script.textContent = styles;
    document.body.appendChild(script);
  },
  
  self.updateCheck = function() {
    // Based on https://gist.github.com/874058
    var URL = "https://raw.github.com/kasperg/harvest-task-pick/master/jquery.harvest-task-pick.js";
    var VERSION = "0.3.11180.1323";
    
    if (window["selfUpdaterCallback:" + URL]) {
      window["selfUpdaterCallback:" + URL](VERSION);
      return;
    }
    
    function updateCheck(notifier) {
      window["selfUpdaterCallback:" + URL] = function (ver) {
        // Versions are string containing multiple .(periods) to split version elements.
        // Join these to enable comparison. This is usable but not perfect for minor
        // version number > 9.
        if (parseFloat(ver.replace(/\./g, '')) > parseFloat(VERSION.replace(/\./g, ''))) {
          notifier(ver, VERSION, URL);
        }
      }
      jQuery("<script />").attr("src", URL).appendTo("head");
    }

    updateCheck(function (newVersion, oldVersion, url) {
      // We notify for new versions on first run and subsequently each week
      // There doesn't seem to be a way of doing this before the external source is checked.
      // We can only throttle how often notifications are actually shown.
      var lastCheck = jQuery.cookie('harvest_task_pick_last_update_check');
      if (!lastCheck ||
          (new Date().getTime() > (lastCheck + (60 * 60 * 24 * 7)))) {
        if (confirm("A new version of Harvest Task Pick is avaiable.\n\n" + 
                    "The most recent version is " + newVersion + ".\n" +
                    "Your current version is " + oldVersion + ".\n\n" +
                    "Do you want to download it from " + url + " now?")) {
          window.location.href = url;
        }
      }
      // Set new notification time
      jQuery.cookie('harvest_task_pick_last_update_check', new Date().getTime());
    });
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
  self.scripts.push('https://raw.github.com/carhartl/jquery-cookie/master/jquery.cookie.js');
  self.scripts.push('https://raw.github.com/kasperg/awesomecomplete/master/jquery.awesomecomplete.js');
  self.scripts.push('https://raw.github.com/kasperg/harvest-task-pick/master/jquery.harvest-task-pick.js');
  self.loadScripts([self.init, self.updateCheck]);

  self.loadStyles(styles);
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
.harvest-task-pick input\
{\
  font-size: 18px;\
  font-weight: bold;\
  height: 22px;\
  padding: 10px 8px;  \
}\
\
.harvest-task-pick ul.autocomplete\
{\
  z-index: 1;\
}\
\
.harvest-task-pick ul.autocomplete li.active\
{\
    background-color: #EEE;\
}\
\
.harvest-task-pick ul.autocomplete li p.title\
{\
  padding: 0;\
  color: #444;\
  font-size: 11px;\
}\
\
/* Default awesomecomplete styles */\
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
}";

HarvestTaskPick();