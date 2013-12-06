define([], function() {

  var db, server;

  return {
    initialize     : initialize,
    createDoc      : createDoc,
    updateDoc      : updateDoc,
    deleteDoc      : deleteDoc,
    copyDoc        : copyDoc,
    getDoc         : getDoc,
    getDocs        : getDocs,
    getUserRoles   : getUserRoles,
    checkConnection: checkConnection
  };

  function initialize(credential) {
    var deferred = Q.defer();
    Couch.init(function() {
      server = new Couch.Server('http://localhost:5984', credential.userName, credential.password);
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

  function checkConnection(url) {
    var deferred = Q.defer();

    db.get(url, function(response) {
      if(!response.status) { // Если есть поле status в ответе, значит произошла какая-то ошибка
        deferred.resolve(response);
      }
      else {
        deferred.reject();
      }
    });

    return deferred.promise;
  }

  function getUserRoles(login) {
    var db_users = new Couch.Database(server, '_users'),
      deferred = Q.defer();
    db_users.get('_design/user_by_name/_view/all?key="' + login + '"', function(response) {
      if(!response.status) { // Если есть поле status в ответе, значит произошла какая-то ошибка
        var result = [];
        for(var i = 0; i < response.rows.length; i++) {
          var doc = response.rows[i];
          result.push(doc);
        }
        deferred.resolve(result[0]['value'].roles);
      }
      else {
        alert(response.status + ': ' + response.statusText);
        deferred.reject();
      }
    });
    return deferred.promise;
  }

});
