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
// @version         0.3
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
    var lastCheck = jQuery.cookie('harvest_task_pick_last_update_check');
    // We check for new versions on first run and subsequently each week
    if (!lastCheck ||
        (new Date().getTime() > (lastCheck + (60 * 60 * 24 * 7)))) {
      jQuery.cookie('harvest_task_pick_last_update_check', new Date().getTime());
      
      // Based on https://gist.github.com/874058
      var VERSION = "/* version */";
      var URL = "https://raw.github.com/kasperg/harvest-task-pick/master/harvest-task-pick.user.js";
      
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
          if (confirm("A new version of Harvest Task Pick is avaiable.\n\n" + 
                      "The most recent version is " + newVersion + ".\n" +
                      "Your current version is " + oldVersion + ".\n\n" +
                      "Do you want to download it from " + url + " now?")) {
          window.location.href = url;
        }
      });
    };
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
var styles = "/* styles(https://raw.github.com/kasperg/awesomecomplete/master/awesomecomplete.css) */\
              /* styles(https://raw.github.com/kasperg/harvest-task-pick/master/harvest-task-pick.css) */";

HarvestTaskPick();