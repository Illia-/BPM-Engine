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
        .then(function(res1) {
          system.log('editTemplate Main Thread: prepare():');
          system.log(res1);
          self.bpmTemplateEditor.editTemplate(self.templateId).then(function(res3) {
            system.log('editTemplate Main Thread: editTemplate():');
            system.log(res3);
          });
        })
        .fail(function(res2) {
          system.log('editTemplate Main Thread: prepare():');
          system.log(res2);
        })
    }

    function activate(templateId) {
      self.bpmTemplateEditor = bpmTemplateEditor();
      self.templateId = templateId;
      return;
    }

  });
