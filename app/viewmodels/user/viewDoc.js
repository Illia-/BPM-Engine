define(['services/bpmEngine', 'services/appSecurity', 'durandal/system', 'durandal/app', 'plugins/router', 'couchDB', 'helpers/date'],
  function(engine, appSecurity, system, app, router, db, date) {
    var selectedDoc = ko.observable(''),
      viewModel = {
        activate   : activate,
        tasks      : ko.observableArray([]),
        viewDoc   : viewDoc,
        docForShow: ko.computed(function() {
            if(selectedDoc()) {
              system.log('!!!! selectedDoc():');
              system.log(selectedDoc());
              return {number: selectedDoc().number,
                description : selectedDoc().text,
                createDate : date.formatDateTime(selectedDoc().createDate),
                updateDate : date.formatDateTime(selectedDoc().updateDate),
                attachments : parseAttachments(selectedDoc())};
            }
            return false;
          }
        ),
        file: ko.observable()
      };

    return viewModel;

    function activate(workflowId) {
      return viewDoc(workflowId);
    }

    function parseAttachments(doc) {
      var baseUrl = 'http://localhost:5984/bpm-engine',
        attachments = [];
      for(var item in doc._attachments) {
        attachments.push({name: item, url: baseUrl + '/' + doc._id + '/' + item});
      }
      return attachments;
    }

    function viewDoc(workflowId) {
      system.log(workflowId);
      engine.getWorkflow(workflowId).then(function(workflow) {
        system.log('Selected Workflow:');
        system.log(workflow);
        db.getDoc(workflow[0]['value'].cardId).then(function(doc) {
          selectedDoc(doc);
        });
      });
    }

  });