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
          self.bpmTemplateEditor.viewWorkflow(self.workflowId);
        })
        .fail(function(res2) {
          system.log('viewWorkflow Main Thread: attached():');
          system.log(res2);
        })
    }

    function activate(workflowId) {
      self.bpmTemplateEditor = bpmTemplateEditor();
      self.workflowId = workflowId;
      return;
    }

  });
