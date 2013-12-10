define(['functions/userFunction', 'couchDB'],
  function(userFunction, db) {

    var engine = {
      // initialize             : initialize,
      getTemplates           : getTemplates,
      addTemplate            : addTemplate,
      getTemplate            : getTemplate,
      runWorkflow            : runWorkflow,
      processingWorkflow     : processingWorkflow,
      orchestrate            : orchestrate,
      completeTask           : completeTask,
      setVariable            : setVariable,
      getWorkflowBlocks      : getWorkflowBlocks,
      getBlockById           : getBlockById,
      getTasksByUser         : getTasksByUser,
      getCompletedTasksByUser: getCompletedTasksByUser,
      getWaitingTasksByUser  : getWaitingTasksByUser,
      deleteWorkflows        : deleteWorkflows,
      deleteBlocks           : deleteBlocks,
      deleteTemplates        : deleteTemplates,
      deleteVariables        : deleteVariables,
      getWorkflowsByUser     : getWorkflowsByUser
    };

    return engine;
    /*
     function initialize(url, user, pass, dbname) {
     var deferred = Q.defer();
     db.initialize(url, user, pass, dbname).then(function() {
     deferred.resolve({ok: true});
     });
     return deferred.promise;
     }
     */
    function getTasksByUser(username) {
      var deferred = Q.defer();
      db.getDocs('_design/tasks_by_user/_view/all?key="' + username + '"').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getWorkflowsByUser(username) {
      var deferred = Q.defer();
      db.getDocs('_design/workflows_by_user/_view/all?key="' + username + '"').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getCompletedTasksByUser(username) {
      var deferred = Q.defer();
      db.getDocs('_design/completed_tasks_by_user/_view/all?key="' + username + '"').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getWaitingTasksByUser(username) {
      var deferred = Q.defer();
      db.getDocs('_design/waiting_tasks_by_user/_view/all?key="' + username + '"').then(function(result) {
        Q.allSettled(function() {
            var promises = [];
            for(var i = 0; i < result.length; i++) {
              if(result[i]['value'].cardId) {
                promises.push(db.getDoc(result[i]['value'].cardId));
              }
            }
            return promises;
          }()).then(function(results) {
            var docs = [];
            for(var i = 0; i < results.length; i++) {
              docs[results[i]['value']._id] = results[i]['value'];
            }
            for(var i = 0; i < result.length; i++) {
              if(result[i]['value'].cardId) {
                if(docs[result[i]['value'].cardId]) {
                  result[i].doc = docs[result[i]['value'].cardId];
                }
              }
            }
            deferred.resolve(result);
          });
      });
      return deferred.promise;
    }

    function getTemplates() {
      var deferred = Q.defer();
      db.getDocs('_design/templates/_view/all').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function addTemplate(template) {
      var deferred = Q.defer();
      db.createDoc(template).then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getTemplate(id) {
      var deferred = Q.defer();
      db.getDocs('_design/templates/_view/all?key="' + id + '"').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getWorkflows() {
      var deferred = Q.defer();
      db.getDocs('_design/workflows/_view/all').then(function(result) {
        console.log(' --getWorkflows-- ');
        console.log(result);
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getWorkflow(id) {
      var deferred = Q.defer();
      db.getDocs('_design/workflows/_view/all?key="' + id + '"').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function createWorkflow(workflow) {
      var deferred = Q.defer();
      db.createDoc(workflow).then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function updateWorkflow(workflowId, upd) {
      var deferred = Q.defer();
      db.updateDoc(workflowId, upd).then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getWorkflowBlocks(workflowId) {
      var deferred = Q.defer();
      db.getDocs('_design/workflow_blocks/_view/all?key="' + workflowId + '"').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getBlocks(blocks) {
      var deferred = Q.defer();
      if(typeof(blocks) !== 'undefined') {
        var url = '_design/blocks/_view/all?keys=' + JSON.stringify(blocks);
      }
      else {
        var url = '_design/blocks/_view/all';
      }
      db.getDocs(url).then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getBlock(id) {
      var deferred = Q.defer();
      db.getDocs('_design/blocks/_view/all?key="' + id + '"').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getBlockById(workflowId, id) {
      var deferred = Q.defer();
      db.getDocs('_design/block_by_id/_view/all?key=["' + id + '","' + workflowId + '"]').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function createBlock(block) {
      var deferred = Q.defer();
      db.createDoc(block).then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function updateBlock(id, block) {
      var deferred = Q.defer();
      db.updateDoc(id, block).then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getVariable(id) {
      var deferred = Q.defer();
      db.getDocs('_design/variables/_view/all?key="' + id + '"').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function createVariable(variable) {
      var deferred = Q.defer();
      db.createDoc(variable).then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getVariableByName(workflowId, name) {
      var deferred = Q.defer();
      db.getDocs('_design/variable_by_name/_view/all?key=["' + name + '","' + workflowId + '"]').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function getVariables() {
      var deferred = Q.defer();
      db.getDocs('_design/variables/_view/all').then(function(result) {
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    function setVariableByName(workflowId, name, upd) {
      var deferred = Q.defer();
      getVariableByName(workflowId, name).then(function(res1) {
        var varId = res1[0].id;
        db.updateDoc(varId, upd).then(function(res2) {
          deferred.resolve(res2);
        });
      });
      return deferred.promise;
    }

    function setVariable(workflowId, name, val) {
      var deferred = Q.defer();
      getVariableByName(workflowId, name).then(function(res1) {
        var varId = res1[0].id;
        var upd = res1[0]['value'];
        upd.val = val;
        db.updateDoc(varId, upd).then(function(res2) {
          deferred.resolve(res2);
        });
      });
      return deferred.promise;
    }

    function runWorkflow(templateId, cardId, user) {
      var deferred = Q.defer();
      getTemplate(templateId).then(function(res1) {

        console.log('runWorkflow: Selected template:');
        console.log(res1);

        var variables = res1[0]['value'].vars;
        var currentBlock;
        var blocks = res1[0]['value'].blocks;
        for(var i = 0; i < blocks.length; i++) {
          currentBlock = blocks[i];
          if(currentBlock.type == 'start') {
            break;
          }
        }

        var workflow = {
          templateId   : templateId,
          type         : 'workflow',
          cardId       : cardId,
          initiator    : user,
          status       : 'runned',
          currentBlocks: []
        };
        createWorkflow(workflow).then(function(res2) {
          console.log('runWorkflow: Created Workflow:');
          console.log(res2);
          getWorkflow(res2.id).then(function(res3) {
            console.log('runWorkflow: Selected Workflow:');
            console.log(res3);
            var workflowId = res2.id;
            var workflowRev = res2.rev;
            workflow = res3[0]['value'];

            Q.allSettled(function() {

                var promises = [];
                for(var i = 0; i < variables.length; i++) { // Создаём документы типа "Variable"
                  var variable = {
                    workflowId: workflow._id,
                    type      : 'variable',
                    name      : variables[i].name,
                    val       : variables[i].val
                  };
                  promises.push(createVariable(variable));
                }
                return promises;

              }()).then(function(results) {
                console.log('runWorkflow: Created all Variables:');
                console.log(results);

                var block = {
                  workflowId: workflow._id,
                  id        : currentBlock.id,
                  type      : 'block',
                  blockType : currentBlock.type,
                  linesFrom : currentBlock.linesFrom,
                  linesTo   : currentBlock.linesTo,
                  status    : 'commited'
                };
                createBlock(block).then(function(res4) {
                  console.log('runWorkflow: Created start block:');
                  console.log(res4);
                  workflow.currentBlocks = [res4.id];
                  updateWorkflow(workflow._id, workflow).then(function(res5) {
                    console.log('runWorkflow: Updated Workflow:');
                    console.log(res5);
                    deferred.resolve(res5);
                  });
                });
              });
          });
        });

      });
      return deferred.promise;
    }

    function processingWorkflow(workflowId) {
      var deferred = Q.defer();
      getWorkflow(workflowId).then(function(res1) {
        console.log('processingWorkflow: Selected Workflow:');
        console.log(res1);
        var workflow = res1[0]['value'];
        var workflowRev = workflow['_rev']
        var status = workflow.status;

        if(status != 'completed') {

          getBlocks(workflow.currentBlocks).then(function(res2) { // Вынимаем документы типа "block", соответствующие текущим блокам данного сценария
            console.log('processingWorkflow: Selected current blocks:');
            console.log(res2);
            var currentBlocks = res2;
            var linesFrom = [];

            for(var i = 0; i < currentBlocks.length; i++) {
              if(currentBlocks[i]['value'].status == 'commited') { // Учитываем только выполненные блоки
                for(var j = 0; j < currentBlocks[i]['value'].linesFrom.length; j++) {
                  linesFrom.push(currentBlocks[i]['value'].linesFrom[j].id);
                }
              }
            }

            console.log('processingWorkflow: Found lines from current blocks:');
            console.log(linesFrom);

            if(linesFrom.length > 0) { // Если хотя бы один из текущих блоков выполнен и потому есть исходящие линии (стрелки)
              getTemplate(workflow.templateId).then(function(res3) { // Получаем объект "template", чтобы получить коллекцию всех блоков шаблона
                console.log('processingWorkflow: Selected Template:');
                console.log(res3);
                var template = res3[0]['value'];
                var nextBlocks = [];

                for(var i = 0; i < template.blocks.length; i++) { // Начинаем перебирать блоки шаблона и ищем следующие блоки согласно сценария

                  var block = template.blocks[i];
                  for(var j = 0; j < block.linesTo.length; j++) {
                    if(linesFrom.indexOf(block.linesTo[j].id) != -1) {
                      nextBlocks.push(block);
                    }
                  }

                }

                console.log('processingWorkflow: Found next blocks in Template:');
                console.log(nextBlocks);

                Q.allSettled(function() {

                    var promises = [];
                    for(var i = 0; i < nextBlocks.length; i++) { // Для следующих блоков шаблона создаём документы типа "Блок"
                      var block_ = nextBlocks[i];
                      switch(block_.type) {
                        case 'task': // Блок "Задание"
                          var block = {
                            workflowId: workflow._id,
                            id        : block_.id,
                            type      : 'block',
                            blockType : 'task',
                            title     : block_.title,
                            cardId    : workflow.cardId,
                            linesFrom : block_.linesFrom,
                            linesTo   : block_.linesTo,
                            users     : block_.users,
                            status    : 'waiting'
                          };
                          promises.push(createBlock(block));
                          break;
                        case 'end': // Блок "Конец" - означает завершение сценария
                          promises.push(function() {
                            var deferred = Q.defer();
                            var block = {
                              workflowId: workflow._id,
                              id        : block_.id,
                              type      : 'block',
                              blockType : 'end',
                              title     : block_.title,
                              cardId    : workflow.cardId,
                              linesFrom : block_.linesFrom,
                              linesTo   : block_.linesTo,
                              users     : block_.users,
                              status    : 'commited'
                            };
                            createBlock(block).then(function(res4) {
                              workflow.status = 'completed';
                              updateWorkflow(workflow._id, workflow).then(function(res5) {
                                console.log('processingWorkflow: Updated Workflow:');
                                console.log(res5);
                                workflowRev = res5.rev;
                                status = 'completed';
                                deferred.resolve(res4);
                              });
                            });
                            return deferred.promise;
                          }());
                          break;
                        case 'function': // Блок "Функция"
                          promises.push(function() {
                            var deferred = Q.defer();
                            var func = block_.func;
                            if(typeof userFunction[func] == 'function') {
                              userFunction[func](engine, db, workflow).then(function(res6) {
                                var block = {
                                  workflowId: workflow._id,
                                  id        : block_.id,
                                  type      : 'block',
                                  blockType : 'function',
                                  title     : block_.title,
                                  cardId    : workflow.cardId,
                                  linesFrom : block_.linesFrom,
                                  linesTo   : block_.linesTo,
                                  status    : 'commited'
                                };
                                createBlock(block).then(function(res7) {
                                  deferred.resolve(res7);
                                });
                              });
                            }
                            return deferred.promise;
                          }());
                          break;
                        case 'condition': // Блок "Условие"
                          promises.push(function() {
                            var deferred = Q.defer();
                            linesFrom = block_.linesFrom;
                            var variable = block_.variable;
                            var value = block_.val;
                            getVariableByName(workflow._id, variable).then(function(res8) {
                              console.log('processingWorkflow: Selected Variable:');
                              console.log(res8);
                              variable = res8[0]['value'];
                              if(variable.val == value) {
                                for(var i = 0; i < linesFrom.length; i++) {
                                  if(linesFrom[i].type == 'false') {
                                    linesFrom.splice(i, 1);
                                  }
                                }
                              }
                              else {
                                for(var i = 0; i < linesFrom.length; i++) {
                                  if(linesFrom[i].type == 'true') {
                                    linesFrom.splice(i, 1);
                                  }
                                }
                              }
                              var block = {
                                workflowId: workflow._id,
                                id        : block_.id,
                                type      : 'block',
                                blockType : 'condition',
                                title     : block_.title,
                                cardId    : workflow.cardId,
                                linesFrom : linesFrom,
                                linesTo   : block_.linesTo,
                                status    : 'commited'
                              };
                              createBlock(block).then(function(res9) {
                                deferred.resolve(res9);
                              });
                            });
                            return deferred.promise;
                          }());
                          break;
                      }
                    }
                    return promises;

                  }()).then(function(results) {
                    console.log('processingWorkflow: Created all next blocks:');
                    console.log(results);
                    var currentNewBlocks = [];
                    for(var i = 0; i < results.length; i++) {
                      currentNewBlocks.push(results[i]['value']['id']);
                    }
                    workflow._rev = workflowRev;
                    workflow.status = status;
                    workflow.currentBlocks = currentNewBlocks; // Прописываем id новых текущих блоков для данного сценария
                    updateWorkflow(workflow._id, workflow).then(function(res10) {
                      console.log('processingWorkflow: Updated Workflow:');
                      console.log(res10);
                      deferred.resolve(res10);
                    });
                  });

              });
            }
            else {
              deferred.resolve({id: workflow._id, reason: 'Nothing to do.'}); // Нет ни одного завершённого блока, чтобы продолжить выполнение сценария
            }
          });

        }
        else {
          deferred.resolve({id: workflow._id, reason: 'Nothing to do.'}); // Сценарий уже полностью отработан, поэтому нечего тут делать
        }
      });
      return deferred.promise;
    }

    function orchestrate() {
      var deferred = Q.defer();
      getWorkflows().then(function(result) {
        Q.allSettled(function() {
            var promises = [];
            for(var i = 0; i < result.length; i++) {
              promises.push(processingWorkflow(result[i].id));
            }
            return promises;
          }()).then(function(results) {
            deferred.resolve(results);
          });
      });
      return deferred.promise;
    }

    /**
     * @param id -
     * @returns {promise}
     */
    function completeTask(id) {
      var deferred = Q.defer();
      getBlock(id).then(function(res1) {
        console.log('completeTask: Selected task:');
        console.log(res1);
        var task = res1[0]['value'];
        task.status = 'commited';
        updateBlock(id, task).then(function(res2) {
          console.log('completeTask: Updated block:');
          console.log(res2);
          deferred.resolve(res2);
        });
      });
      return deferred.promise;
    }

    function deleteWorkflows() {
      var deferred = Q.defer();
      getWorkflows().then(function(result) {
        Q.allSettled(function() {
            var promises = [];
            for(var i = 0; i < result.length; i++) {
              promises.push(db.deleteDoc(result[i].id, { rev: result[i]['value']._rev }));
            }
            return promises;
          }()).then(function(results) {
            deferred.resolve(results);
          });
      });
      return deferred.promise;
    }

    function deleteBlocks() {
      var deferred = Q.defer();
      getBlocks(undefined).then(function(result) {
        Q.allSettled(function() {
            var promises = [];
            for(var i = 0; i < result.length; i++) {
              promises.push(db.deleteDoc(result[i].id, { rev: result[i]['value']._rev }));
            }
            return promises;
          }()).then(function(results) {
            deferred.resolve(results);
          });
      });
      return deferred.promise;
    }

    function deleteTemplates() {
      var deferred = Q.defer();
      getTemplates().then(function(result) {
        Q.allSettled(function() {
            var promises = [];
            for(var i = 0; i < result.length; i++) {
              promises.push(db.deleteDoc(result[i].id, { rev: result[i]['value']._rev }));
            }
            return promises;
          }()).then(function(results) {
            deferred.resolve(results);
          });
      });
      return deferred.promise;
    }

    function deleteVariables() {
      var deferred = Q.defer();
      getVariables().then(function(result) {
        Q.allSettled(function() {
            var promises = [];
            for(var i = 0; i < result.length; i++) {
              promises.push(db.deleteDoc(result[i].id, { rev: result[i]['value']._rev }));
            }
            return promises;
          }()).then(function(results) {
            deferred.resolve(results);
          });
      });
      return deferred.promise;
    }

  });
