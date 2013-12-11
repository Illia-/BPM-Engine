define(['services/bpmEngine', 'services/appSecurity'],
  function(engine, appSecurity) {
    var viewModel = {
      activate:activate,
      workflows:ko.observableArray([])
    }
    return viewModel;

    function activate(){
      engine.getWorkflowsByUser(appSecurity.user().name).then(function(data){
        for (var i = 0; i < data.length; i++) {
          var dtc = new Date(data[i].value.createDate);
          var dtu = new Date(data[i].value.updateDate);
          data[i].value.createDate = dtc.getDate()+'.'+dtc.getMonth()+'.'+dtc.getFullYear()+' '+dtc.getHours()+':'+dtc.getMinutes()+':'+dtc.getSeconds();
          data[i].value.updateDate = dtu.getDate()+'.'+dtu.getMonth()+'.'+dtu.getFullYear()+' '+dtu.getHours()+':'+dtu.getMinutes()+':'+dtu.getSeconds();
        }
        viewModel.workflows(data)
      });
    }
  });
