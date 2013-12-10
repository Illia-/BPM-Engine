define(['services/bpmTemplateEditor', 'services/bpmEngine', 'durandal/system'],
  function(bpmTemplateEditor, engine, system) {

    var viewModel = {
        attached: attached
      },
      self = {};
    return viewModel;

    function attached() {
      bpmTemplateEditor.initialize()
        .then(function() {
          bpmTemplateEditor.newTemplate();
        })
        .fail(function(res2) {
          system.log('runTemplateEditor Main Thread: prepare():');
          system.log(res2);
        })
    }

  });