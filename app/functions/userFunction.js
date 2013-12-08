define([],
  function(){

    return{
      testFunc: testFunc
    };

    function testFunc(engine, db, workflow) {
    	var deferred = Q.defer();
    	var cardId = workflow.cardId;
    	db.getDoc(cardId).then(function(doc) {
    		var result = doc.result;
    		engine.setVariable(workflow._id, 'result', result).then(function(res) {
    			deferred.resolve(res);
    		});
    	});
    	return deferred.promise;
    }
  });
