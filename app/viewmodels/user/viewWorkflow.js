define(['services/bpmTemplateEditor', 'services/bpmEngine', 'durandal/system'],
  function(bpmTemplateEditor, engine, system) {

    var viewModel = {activate: activate,
        attached: attached
    },
      self = {};
    return viewModel;

    function attached() {
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
