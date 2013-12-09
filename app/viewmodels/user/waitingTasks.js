define(['services/bpmEngine', 'services/appSecurity', 'durandal/system', 'couchDB'],
  function(engine, appSecurity, system, db) {
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
        saveCard   : saveCard,
        file: ko.observable(),
        selectedResult: ko.observable()
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
      var file = viewModel.file().files[0];
      if(viewModel.selectedResult() !== 'null'){
        selectedTask().doc.result = viewModel.selectedResult() == "true";
        if(typeof file !== 'undefined'){
          delete selectedTask().doc._attachments;
        }
        db.updateDoc(selectedTask().doc._id, selectedTask().doc).then(function(doc){
          console.log(doc);
          if(typeof file !== 'undefined'){
            db.uploadFile(doc, file).then(function(doc){
              engine.orchestrate();
            });
          }
          else{
            engine.orchestrate();
          }
        });

      }
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