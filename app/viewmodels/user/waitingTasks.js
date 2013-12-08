define(['services/bpmEngine','services/appSecurity'],
  function(engine, appSecurity) {
    var viewModel = {
      activate        : activate,
      tasks: ko.observableArray([])
    };

    return viewModel;

    function activate(){
      return engine.getWaitingTasksByUser(appSecurity.user().name).then(function(data){
        console.log('--ТАСКИ--');
        viewModel.tasks = data;
        console.log(data);
      })
    }

  });