define([], function(){

  var db;

  return {
    initialize: initialize,
    createDoc : createDoc,
    updateDoc : updateDoc,
    deleteDoc : deleteDoc,
    copyDoc   : copyDoc,
    getDoc    : getDoc,
    getDocs   : getDocs
  };

  function initialize(url, user, pass, dbname) {
    var deferred = Q.defer();
    Couch.init(function() {
      var server = new Couch.Server('http://localhost:5984', 'Eric', 'e1');
      db = new Couch.Database(server, 'bpm-engine');
      deferred.resolve();
    });
    return deferred.promise;
  }

  function createDoc(doc) {
    var deferred = Q.defer();
    doc.createDate = Date.now();
    db.post(doc, function(response) {
      if(!response.status) { // Если есть поле status в ответе, значит произошла какая-то ошибка
        deferred.resolve(response);
      }
      else {
        alert(response.status + ': ' + response.statusText);
        deferred.reject();
      }
    });
    return deferred.promise;
  }

  function updateDoc(id, upd) {
    var deferred = Q.defer();
    upd.updateDate = Date.now();
    db.put(id, upd, function(response) {
      if(!response.status) { // Если есть поле status в ответе, значит произошла какая-то ошибка
        deferred.resolve(response);
      }
      else {
        alert(response.status + ': ' + response.statusText);
        deferred.reject();
      }
    });

    return deferred.promise;
  }

  function deleteDoc(id, rev) {
    var deferred = Q.defer();
    db.destroy(id, rev, function(response) {
      if(!response.status) { // Если есть поле status в ответе, значит произошла какая-то ошибка
        deferred.resolve(response);
      }
      else {
        alert(response.status + ': ' + response.statusText);
        deferred.reject();
      }
    });

    return deferred.promise;
  }

  function copyDoc(sourceId, targetId, rev) {
    var deferred = Q.defer();
    db.copy(sourceId, targetId, rev, function(response) {
      if(!response.status) { // Если есть поле status в ответе, значит произошла какая-то ошибка
        deferred.resolve(response);
      }
      else {
        alert(response.status + ': ' + response.statusText);
        deferred.reject();
      }
    });

    return deferred.promise;
  }

  function getDoc(id) {
    var deferred = Q.defer();
    db.get(id, function(response) {
      if(!response.status) { // Если есть поле status в ответе, значит произошла какая-то ошибка
        doc = response.rows[0];
        deferred.resolve(doc);
      }
      else {
        alert(response.status + ': ' + response.statusText);
        deferred.reject();
      }
    });
    return deferred.promise;
  }

  function getDocs(url) {
    var deferred = Q.defer();
    db.get(url, function(response) {
      if(!response.status) { // Если есть поле status в ответе, значит произошла какая-то ошибка
        var result = [];
        for(var i = 0; i < response.rows.length; i++) {
          var doc = response.rows[i];
          result.push(doc);
        }
        deferred.resolve(result);
      }
      else {
        alert(response.status + ': ' + response.statusText);
        deferred.reject();
      }
    });
    return deferred.promise;
  }

});