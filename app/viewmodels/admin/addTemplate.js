define(['services/bpmTemplateEditor', 'services/bpmEngine', 'durandal/system', 'durandal/app', 'plugins/router'],
  function(bpmTemplateEditor, engine, system, app, router) {

    var viewModel = {activate: activate,
        compositionComplete: compositionComplete,
        saveTemplate: function(){
          self.bpmTemplateEditor.saveTemplate().then(function(){
            app.showMessage('Шаблон сохранен!').then(function(){
              router.navigate('templatesList');
            })
          });
        }
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
