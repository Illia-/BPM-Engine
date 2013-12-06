define(['services/bpmEngine'],
  function(engine) {

    //var engine = bpmEngine();
    console.log(engine);
    engine.initialize('http://localhost:5984', 'user1', 'qwerty', 'workflow').then(function(res1) {
      console.log('Main thread: Engine initialized:');
      console.log(res1);
      var template = {
        title : 'Template 1',
        type  : 'template',
        vars  : [
          {
            name: 'doc_number',
            val : '123/0/1-13'
          },
          {
            name: 'result',
            val : '0'
          }
        ],
        blocks: [
          {
            id       : 'block1',
            type     : 'start',
            x        : 400,
            y        : 10,
            linesFrom: [
              {
                id: 'line1'
              }
            ],
            linesTo  : [
            ]
          },
          {
            id       : 'block2',
            type     : 'end',
            x        : 400,
            y        : 500,
            linesFrom: [
            ],
            linesTo  : [
              {
                id: 'line6'
              },
              {
                id: 'line7'
              }
            ]
          },
          {
            id       : 'block3',
            type     : 'function',
            x        : 400,
            y        : 200,
            func     : 'testFunc',
            linesFrom: [
              {
                id: 'line3'
              }
            ],
            linesTo  : [
              {
                id: 'line1'
              }
            ]
          },
          {
            id       : 'block4',
            type     : 'condition',
            x        : 400,
            y        : 300,
            variable : 'result',
            val      : '0',
            linesFrom: [
              {
                id  : 'line4',
                type: 'true'
              },
              {
                id  : 'line5',
                type: 'false'
              }
            ],
            linesTo  : [
              {
                id: 'line3'
              }
            ]
          },
          {
            id       : 'block5',
            type     : 'task',
            x        : 200,
            y        : 400,
            users    : ['user3'],
            linesFrom: [
              {
                id: 'line7'
              }
            ],
            linesTo  : [
              {
                id: 'line5'
              }
            ]
          },
          {
            id       : 'block6',
            type     : 'task',
            x        : 600,
            y        : 400,
            users    : ['user1', 'user2'],
            linesFrom: [
              {
                id: 'line6'
              }
            ],
            linesTo  : [
              {
                id: 'line4'
              }
            ]
          }
        ]
      };

      engine.addTemplate(template).then(function(res3) {
        console.log('Main thread: Added template:');
        console.log(res3);
        engine.runWorkflow(res3.id, 456).then(function(res4) {
          console.log('Main thread: Runned Workflow:');
          console.log(res4);
          engine.processingWorkflow(res4.id).then(function(res5) {
            console.log('Main thread: Processed Workflow step1:');
            console.log(res5);
            engine.processingWorkflow(res5.id).then(function(res6) {
              console.log('Main thread: Processed Workflow step2:');
              console.log(res6);
              engine.processingWorkflow(res6.id).then(function(res7) {
                console.log('Main thread: Processed Workflow step3:');
                console.log(res7);
                engine.processingWorkflow(res7.id).then(function(res8) {
                  console.log('Main thread: Processed Workflow step4:');
                  console.log(res8);
                });
              });
            });
          });
        });
      });
    });

    return {};

  });