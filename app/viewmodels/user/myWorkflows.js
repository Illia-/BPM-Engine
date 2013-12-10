define(['services/bpmEngine', 'services/appSecurity'],
  function(engine, appSecurity) {
    var viewModel = {
      activate:activate,
      workflows:ko.observableArray([])
    }
    return viewModel;

    function activate(){
      engine.getWorkflowsByUser(appSecurity.user().name).then(function(data){
        viewModel.workflows(data)
      });
    }
  });