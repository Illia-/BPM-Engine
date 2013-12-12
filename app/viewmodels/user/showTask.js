define(['services/bpmEngine', 'services/appSecurity', 'durandal/system', 'durandal/app', 'plugins/router', 'couchDB', 'helpers/date'],
  function(engine, appSecurity, system, app, router, db, date) {
    var selectedTask = ko.observable(''),
      viewModel = {
        activate   : activate,
        tasks      : ko.observableArray([]),
        showTask   : showTask,
        taskForShow: ko.computed(function() {
            if(selectedTask()) {
              system.log('!!!! selectedTask().template:');
              system.log(selectedTask().template);
              return {number: selectedTask().doc.number,
                description : selectedTask().doc.text,
                template : selectedTask().template.title,
                task : selectedTask()[0].value.title,
                createDate : date.formatDateTime(selectedTask()[0].value.createDate),
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

    function activate(taskId) {
      return showTask(taskId);
    }

    function saveCard() {
      var file = viewModel.file().files[0];
      if(viewModel.selectedResult() !== 'null'){
        selectedTask().doc.result = (viewModel.selectedResult() == "true" ? 1: 0);
        if(typeof file !== 'undefined'){
          delete selectedTask().doc._attachments;
        }
        db.updateDoc(selectedTask().doc._id, selectedTask().doc).then(function(doc){
          console.log(doc);
          if(typeof file !== 'undefined'){
            db.uploadFile(doc, file).then(function(){
              engine.completeTask(selectedTask()[0].id).then(function(){
                  //viewModel.tasks.remove(selectedTask());
                  selectedTask('');
                  app.showMessage('Задание отработано.').then(function(){
                    router.navigate('user/waitingTasks');
                  });
              })
            });
          }
          else{
            system.log('!!!! selectedTask():');
            system.log(selectedTask());
            engine.completeTask(selectedTask()[0].id).then(function(){
                //viewModel.tasks.remove(selectedTask());
                selectedTask('');
                app.showMessage('Задание отработано.').then(function(){
                  router.navigate('user/waitingTasks');
                });
            })
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

    function showTask(taskId) {
      system.log(taskId);
      engine.getTask(taskId).then(function(task) {
        system.log('Выбранное задание:');
        system.log(task);
        selectedTask(task);
      });
    }

  });