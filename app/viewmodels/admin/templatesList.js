define(['services/bpmTemplateEditor', 'services/bpmEngine', 'durandal/system', 'helpers/date'],
  function(bpmTemplateEditor, engine, system, date) {

    var viewModel = {activate: activate,
      templates              : ko.observableArray([])
    };
    return viewModel;

    function activate() {
      return engine.getTemplates().then(function(value) {
        for (var i = 0; i < value.length; i++) {
          value[i].value.createDate = date.formatDateTime(value[i].value.createDate);
          if (value[i].value.updateDate) {
            value[i].value.updateDate = date.formatDateTime(value[i].value.updateDate);
          } else {
            value[i].value.updateDate = '';
          }
        }
        viewModel.templates(value);
      });
    }
  });