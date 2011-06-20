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
  self.scripts.push('https://raw.github.com/kasperg/harvest-task-pick/master/jquery.harvest-task-pick.js');
  self.loadScripts(self.init);

  self.loadStyles(styles);
};

// Styles are injected here
var styles = "/* styles(https://raw.github.com/kasperg/awesomecomplete/master/awesomecomplete.css) */\
              /* styles(https://raw.github.com/kasperg/harvest-task-pick/master/harvest-task-pick.css) */";

HarvestTaskPick();