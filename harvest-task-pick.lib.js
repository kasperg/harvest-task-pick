/**
 * Harvest Task Pick jQuery extension.
 */
(function($){
  $.fn.harvestTaskPick = function() {
    var self = this;
    self.taskData = [];
    
    this.loadStylesheet = function () {
      //Load the stylesheet - but only once!
      //TODO: Clean up
      var cssSrc = 'https://github.com/kasperg/harvest-task-pick/raw/master/harvest-task-pick.css';
      if (!$('link[src="' + cssSrc + '"]').size()) {
        var link = $("<link>");
        link.attr({
                type: 'text/css',
                rel: 'stylesheet',
                href: cssSrc
        });
        $("head").append(link);      
      }
    },
    
    this.collectTaskData = function() {
      //Collect task data
      this.find('#project_selector optgroup').each(function(i, e) {
        //Extract client information
        var client = $(e).attr('label');
        
        $(e).find('option').each(function(i, e) {
          //Extract project information
          var projectId = $(e).attr('value');
          //Get project name and short code (if available)
          var projectInfo = $(e).text().match(/^(.+?)(\s\[(.+)\])?$/);
          var project = projectInfo[1];
          var code = (projectInfo.length >= 4) ? projectInfo[3] : NULL;
          
          $(self).find('#project' + projectId + '_task_selector optgroup').each(function(i, e) {
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
      $(this.taskData).each(function(i, e) {
        if (!e.code) {
          e.name = e.client + ' ' + e.project + ' ' + e.task;
        } else {
          e.name = e.client + ' ' + e.project + ' [' + e.code + '] ' + e.task;          
        }
        e.name += ((e.billable) ? ' (+$)' : ' (-$)');
      });
    },
    
    this.renderTaskPicker = function() {
      //Create an input field for the task picker
      this.find('.select_overflow:visible')
        .hide() //Hide existing controls
        .after( '<div class="harvest-task-pick">'+
                  '<input type="text" tabIndex="'+this.find('.tasks_select:first').attr('tabIndex')+'"/>'+
                '</div>'); //TODO: Clean up

      //Grab focus and add autocomplete using awesomecomplete
      this.find('.harvest-task-pick input').focus().awesomecomplete({
        staticData: self.taskData,
        typingDelay: 0, //We use local data so get to work immediatly
        splitTerm: true,
        wordDelimiter: /[^\da-z]+/ig,
        ignoreCase: true,
        //Matching on name is enough when we use splitTerm. It contains all necessary data!
        dontMatch: ['client', 'project', 'projectId', 'code', 'task', 'taskId', 'billable'],
        resultLimit: 10,
        noResultsMessage: '<p>No tasks found!</p>',
        valueFunction: self.taskValue,
        renderFunction: self.renderTask,
        onComplete: self.selectTask,
      });
    },
    
    this.taskValue = function(dataItem) {
      return dataItem['name'];
    },
    
    this.renderTask = function(dataItem, topMatch, originalData) {
      return '<p class="title">' + dataItem['name'] + '</p>';
    },
    
    this.selectTask = function(dataItem) {
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
    this.loadStylesheet();
    this.collectTaskData();
    this.renderTaskPicker();
  }
})(jQuery);