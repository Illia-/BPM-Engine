define(['services/bpmEngine', 'services/appSecurity', 'durandal/system'],
  function(engine, appSecurity, system) {
    var selectedTask = ko.observable(''),
      viewModel = {
        activate   : activate,
        tasks      : ko.observableArray([]),
        showTask   : showTask,
        taskForShow: ko.computed(function() {
            if(selectedTask()) {
              return {number: selectedTask().doc.number,
                description : selectedTask().doc.text,
                attachments : parseAttachments(selectedTask().doc)};
            }
            return false;
          }
        ),
        saveCard   : saveCard
      };

    return viewModel;

    function activate() {
      return engine.getWaitingTasksByUser(appSecurity.user().name).then(function(data) {
        system.log('--ТАСКИ--');
        viewModel.tasks = data;
        system.log(data);
      })
    }

    function saveCard() {

    }

    function parseAttachments(doc) {
      var baseUrl = 'http://localhost:5984/bpm-engine',
        attachments = [];
      for(var item in doc._attachments) {
        attachments.push({name: item, url: baseUrl + '/' + doc._id + '/' + item});
      }
      return attachments;
    }

    function showTask(task) {
      system.log(task);
      selectedTask(task);
    }

  });