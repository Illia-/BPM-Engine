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
