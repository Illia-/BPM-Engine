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
          engine.runWorkflow(viewModel.selectedWorkflow().value._id, JSON.parse(uploadedData).id, appSecurity.user().name)
            .then(function(data) {
              engine.orchestrate();
            });
        });
      });
    };

    function activate() {
      return engine.getTemplates().then(function(value) {
        console.log(value)
        viewModel.templates(value);
      });
    }

  });