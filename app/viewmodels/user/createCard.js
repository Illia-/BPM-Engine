define(['services/bpmEngine', 'couchDB', 'services/appSecurity'],
  function(engine, db, appSecurity) {
    var viewModel = {
      activate        : activate,
      createCard      : createCard,
      documentNumber  : ko.observable(),
      text            : ko.observable(),
      templates       : ko.observableArray([]),
      selectedWorkflow: ko.observable(),
      file            : ko.observable()
    };

    return viewModel;

    function createCard() {
      var file = viewModel.file().files[0];
      var card = {"type": "doc",
        "number"        : viewModel.documentNumber(),
        "text"          : viewModel.text(),
        "workflow"      : viewModel.selectedWorkflow().value._id,
        "result"        : null
      };
      db.createDoc(card).then(function(doc) {
        db.uploadFile(doc, file).then(function(uploadedData) {

          console.log('viewModel.selectedWorkflow().value._id');
          console.log(viewModel.selectedWorkflow().value._id);
          engine.runWorkflow(viewModel.selectedWorkflow().value._id, uploadedData.id, appSecurity.user().name)
            .then(function(data) {
              console.log('engine.runWorkflow result');
              console.log(data);
              engine.orchestrate();
            });
        });
      });
    };

    function activate() {
      return engine.getTemplates().then(function(value) {
        viewModel.templates(value);
      });
    }

  });