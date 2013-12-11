define(['services/bpmTemplateEditor', 'services/bpmEngine', 'durandal/system'],
  function(bpmTemplateEditor, engine, system) {

    var viewModel = {activate: activate,
        attached: attached
    },
      self = {};
    return viewModel;

    function attached() {
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
/*

       bpmTemplateEditor.initialize()
       .then(function(res1) {
       console.log('runTemplateEditor Main Thread: prepare():');
       console.log(res1);
       //te.newTemplate();

       //         bpmTemplateEditor.viewWorkflow('56d22f9892708dbbf6d4328830001a2d').then(function(res3) {
       //         console.log('runTemplateEditor Main Thread: viewWorkflow():');
       //         console.log(res3);
       //         });
       bpmTemplateEditor.editTemplate('b39a10d39242373069c6d891060097c0').then(function(res3) {
       console.log('runTemplateEditor Main Thread: editTemplate():');
       console.log(res3);
       });
       })
       .fail(function(res2) {
       console.log('runTemplateEditor Main Thread: prepare():');
       console.log(res2);
       })
       }
       */
/*
 bpmTemplateEditor.initialize()
 .then(function(res1) {
 console.log('runTemplateEditor Main Thread: prepare():');
 console.log(res1);
 //te.newTemplate();

 //         bpmTemplateEditor.viewWorkflow('56d22f9892708dbbf6d4328830001a2d').then(function(res3) {
 //         console.log('runTemplateEditor Main Thread: viewWorkflow():');
 //         console.log(res3);
 //         });
 bpmTemplateEditor.editTemplate('b39a10d39242373069c6d891060097c0').then(function(res3) {
 console.log('runTemplateEditor Main Thread: editTemplate():');
 console.log(res3);
 });
 })
 .fail(function(res2) {
 console.log('runTemplateEditor Main Thread: prepare():');
 console.log(res2);
 })

 */
