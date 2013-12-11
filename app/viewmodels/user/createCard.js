define(['services/bpmEngine', 'couchDB', 'services/appSecurity','durandal/app', 'plugins/router'],
  function(engine, db, appSecurity, app, router) {
    var viewModel = {
      activate        : activate,
      createCard      : createCard,
      documentNumber  : ko.observable(''),
      text            : ko.observable(''),
      templates       : ko.observableArray([]),
      selectedWorkflow: ko.observable(),
      file            : ko.observable({})
    },
      _dummyObservable = ko.observable();

    viewModel.changeFileInput = function(){
      _dummyObservable.notifySubscribers();
    };
    viewModel.canSave = ko.computed(function(){
      _dummyObservable();
      var file = viewModel.file().files,
        access = viewModel.text() != '';
      access = access && viewModel.documentNumber() != '';
      access = access && (typeof file !== 'undefined') && file.length > 0;
      access = access && (typeof viewModel.selectedWorkflow() != 'undefined');

      return access;
    });

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
              viewModel.documentNumber('');
              viewModel.text('');
              app.showMessage('Сценарий запущен!').then(function(){
                router.navigate('user/myWorkflows');
              });

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