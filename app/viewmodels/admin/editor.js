define(['services/bpmTemplateEditor'],
  function(bpmTemplateEditor) {

    return {activate     : activate,
      compositionComplete: compositionComplete};

    function activate() {
      console.log('-33333333-')
    }

    function compositionComplete() {
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

  });
