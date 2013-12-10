define(['services/bpmTemplateEditor', 'services/bpmEngine', 'durandal/system'],
  function(bpmTemplateEditor, engine, system) {

    var viewModel = {activate: activate,
      templates              : ko.observableArray([])
    };
    return viewModel;

    function activate() {
      return engine.getTemplates().then(function(value) {
        viewModel.templates(value);
      });
    }

  });