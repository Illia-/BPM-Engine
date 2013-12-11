define(['services/bpmEngine', 'services/appSecurity', 'helpers/date'],
  function(engine, appSecurity, date) {
    var viewModel = {
      activate:activate,
      workflows:ko.observableArray([])
    }
    return viewModel;

    function activate(){
      engine.getWorkflowsByUser(appSecurity.user().name).then(function(data){
        for (var i = 0; i < data.length; i++) {
          data[i].value.createDate = date.formatDate(data[i].value.createDate);
          data[i].value.updateDate = date.formatDate(data[i].value.createDate);
        }
        viewModel.workflows(data)
      });
    }
  });
