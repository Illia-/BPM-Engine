define(['services/bpmEngine', 'services/appSecurity', 'durandal/system', 'couchDB', 'helpers/date'],
  function(engine, appSecurity, system, db, date) {
    var viewModel = {
        activate   : activate,
        tasks      : ko.observableArray([])
      };

    return viewModel;

    function activate() {
      return engine.getWaitingTasksByUser(appSecurity.user().name).then(function(data) {
        system.log('--ТАСКИ--');
        for (var i = 0; i < data.length; i++) {
          data[i].value.createDate = date.formatDateTime(data[i].value.createDate);
        }
        viewModel.tasks(data);
        system.log(data);
      })
    }

  });