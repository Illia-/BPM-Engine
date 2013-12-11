define(['services/bpmTemplateEditor', 'services/bpmEngine', 'durandal/system'],
  function(bpmTemplateEditor, engine, system) {

    var viewModel = {activate: activate,
        compositionComplete: compositionComplete
    },
      self = {};
    return viewModel;

    function compositionComplete() {
      self.bpmTemplateEditor.initialize()
        .then(function() {
          self.bpmTemplateEditor.newTemplate();
        })
        .fail(function(res2) {
          system.log('runTemplateEditor Main Thread: prepare():');
          system.log(res2);
        })
    }

    function activate() {
      self.bpmTemplateEditor = bpmTemplateEditor();
      return;
    }

  });
