define(['services/bpmEngine', 'couchDB'],
  function(engine, db) {
    var viewModel = {
      createCard      : createCard,
      documentNumber  : ko.observable(),
      text            : ko.observable(),
      templates       : ko.observableArray([]),
      selectedTemplate: ko.observable(),
      activate        : activate,
      file            : ko.observable()
    };

    return viewModel;

    function createCard() {
      var file = viewModel.file().files[0];
      var card = {"number": viewModel.documentNumber(),
        "text"           : viewModel.text(),
        "templates"      : viewModel.selectedTemplate().value._id
      }
      db.createDoc(card).then(function(doc){
        console.log(doc);
        db.uploadFile(doc, file).then(function(uploadedData){
          console.log('------- Ураааа ------');
          console.log(uploadedData)
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