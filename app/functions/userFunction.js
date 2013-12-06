define([],
  function(){

    return{
      testFunc: testFunc
    };

    function testFunc(engine, workflowId) {
      var deferred = Q.defer();
      console.log('testFunc: engine:');
      console.log(engine);
      engine.setVariable(workflowId, 'result', '1').then(function(result) {
        console.log('testFunc: OK');
        console.log(result);
        deferred.resolve(result);
      });
      return deferred.promise;
    }
  });
