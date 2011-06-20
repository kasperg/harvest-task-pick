/**
 * Harvest Task Pick jQuery extension.
 */
(function($){
  $.fn.harvestTaskPick = function() {
    var self = this;

    self.taskPicker;
    self.taskData = [];
    
    self.loadStylesheet = function () {
      //Load the stylesheet - but only once!
      var cssSrc = 'https://raw.github.com/kasperg/harvest-task-pick/master/harvest-task-pick.css';
      //var cssSrc = 'http://localhost/harvest-task-pick/harvest-task-pick.css';
      if (!$('link[src="' + cssSrc + '"]').size()) {
        var link = $('<link>').attr({
          type: 'text/css',
          rel:  'stylesheet',
          href: cssSrc
        });
        $('head').append(link);      
      }
    },
    
    self.collectTaskData = function() {
      //Collect task data
      self.find('#project_selector optgroup').each(function(i, e) {
        //Extract client information
        var client = $(e).attr('label');
        
        $(e).find('option').each(function(i, e) {
          //Extract project information
          var projectId = $(e).attr('value');
          //Get project name and short code (if available)
          var projectInfo = $(e).text().match(/^(.+?)(\s\[(.+)\])?$/);
          var project = projectInfo[1];
          var code = (projectInfo.length >= 4) ? projectInfo[3] : NULL;
          
          self.find('#project' + projectId + '_task_selector optgroup').each(function(i, e) {
            //Is the task billable?
            var billable = $(e).attr('label') == 'Billable';
            
            $(e).find('option').each(function(i, e) {
              //Extract task information
              var task = $(e).text();
              var taskId = $(e).attr('value');
              
              //Generate data for autocomplete
              self.taskData.push({client : client, project : project, projectId: projectId, code : code, task : task, taskId: taskId, billable: billable});
            });
          });
        });
      });
      
      //Generate the name for each task
      $(self.taskData).each(function(i, e) {
        if (!e.code) {
          e.name = e.client + ' ' + e.project + ' ' + e.task;
        } else {
          e.name = e.client + ' ' + e.project + ' [' + e.code + '] ' + e.task;          
        }
        e.name += ((e.billable) ? ' (+$)' : ' (-$)');
      });
    },
    
    self.renderTaskPicker = function() {
      //Create an input field for the task picker
      var input = $('<input/>').attr({
        type:     'text',
        tabIndex: self.find('.tasks_select:first').attr('tabIndex'),
      });
      
      self.find('.select_overflow:visible')
        .hide() //Hide existing controls
        .after($('<div class="harvest-task-pick"></div>')); //Create a wrapper for the picker
      
      //Insert the input field
      self.taskPicker = this.find('.harvest-task-pick').append(input).find('input');

      //Grab focus and add autocomplete using awesomecomplete
      self.taskPicker.focus().awesomecomplete({
        staticData: self.taskData,
        typingDelay: 0, //We use local data so get to work immediatly
        splitTerm: true,
        wordDelimiter: /[\s+]+/ig,
        ignoreCase: true,
        //Matching on name is enough when we use splitTerm. It contains all necessary data!
        dontMatch: ['client', 'project', 'projectId', 'code', 'task', 'taskId', 'billable'],
        resultLimit: 10,
        activateFirst: true,
        noResultsMessage: '<p>No tasks found!</p>',
        valueFunction: self.taskValue,
        renderFunction: self.renderTask,
        onComplete: function(dataItem) {
          self.selectTask(dataItem);
          //Jump to next form item after picker.
          //NB: Task Picker has same tabIndex as original project picker. Original task picker
          //has tabIndex+1 so increment by 2.
          self.find('*[tabIndex="'+(parseInt(self.taskPicker.attr('tabIndex'))+2)+'"]:visible:first').focus();
        },
      });
    },
    
    self.taskValue = function(dataItem) {
      return dataItem['name'];
    },
    
    self.renderTask = function(dataItem, topMatch, originalData) {
      return '<p class="title">' + dataItem['name'] + '</p>';
    },
    
    self.selectTask = function(dataItem) {
      //Unset any previously selected values
      self.find(':selected').removeAttr('selected');
      //Select project
      self.find('#project_selector option[value="' + dataItem.projectId + '"]')
        .attr('selected', 'selected')
        .parents('select').change(); //trigger change for good measure
      //Select task
      self.find('#project' + dataItem.projectId + '_task_selector option[value="' + dataItem.taskId + '"]').attr('selected', 'selected');
    },
    
    //Initialize Harvest Task Pick
    self.loadStylesheet();
    self.collectTaskData();
    self.renderTaskPicker();
  }
})(jQuery);