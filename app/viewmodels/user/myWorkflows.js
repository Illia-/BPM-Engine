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
          var createDate = data[i].value.createDate;
          data[i].value.createDate = date.formatDate(createDate);
          data[i].value.createTime = date.formatTime(createDate);
          data[i].value.updateDate = date.formatDateTime(data[i].value.updateDate);
        }
        viewModel.workflows(data)
      });
    }
  });
