// ==UserScript==
// @name            Harvest Task Pick
// @namespace       http://reload.dk/
// @description     Select harvest tasks using autocomplete instead of drop downs
// @version         0.1
// @include         https://*.harvestapp.com/*
// ==/UserScript==

function loadScript(src, callback) {
  var script = document.createElement("script");
  script.setAttribute("src", src);
  if (callback !== undefined) {
    script.addEventListener('load', function() {
      var script = document.createElement("script");
      script.textContent = "(" + callback.toString() + ")();";
      document.body.appendChild(script);
    }, false);
  }
  document.body.appendChild(script);
}

function main() {
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
}

//Load the libraries we need into page scope. Inspired by
//http://erikvold.com/blog/index.cfm/2010/6/14/using-jquery-with-a-user-script
loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js', main);
loadScript('https://github.com/kasperg/awesomecomplete/raw/master/jquery.awesomecomplete.js');
loadScript('https://github.com/kasperg/harvest-task-pick/raw/master/harvest-task-pick.lib.js');