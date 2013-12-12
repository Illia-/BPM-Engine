define(['services/bpmEngine', 'services/appSecurity', 'helpers/date'],
  function(engine, appSecurity, date) {
    var viewModel = {
      activate    : activate,
      workflows   : ko.observableArray([]),
      statusFilter: ko.observable(null)
    }

    viewModel.filteredWorkflows = ko.computed(function() {
      var result = ko.utils.arrayFilter(viewModel.workflows(), function(workflow) {
        console.log(viewModel.statusFilter())
        if(viewModel.statusFilter() != 'all') {
          return workflow.value.status == viewModel.statusFilter();
        }
        return true;
      });

      result.sort(function(a, b){
        if(a.value.createDate > b.value.createDate){
          return -1;
        }
        return 1;
      });

      return result;
    });

    return viewModel;

    function activate() {
      engine.getWorkflowsByUser(appSecurity.user().name).then(function(data) {
        for(var i = 0; i < data.length; i++) {
          data[i].value.createDateFormatted = date.formatDate(data[i].value.createDate);
          data[i].value.createTime = date.formatTime(data[i].value.createDate);
          data[i].value.updateDate = date.formatDateTime(data[i].value.updateDate);
        }
        viewModel.workflows(data)
      });
    }
  });
