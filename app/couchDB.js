define([], function() {

  var db, server;

  return {
    initialize: initialize,
    createDoc : createDoc,
    updateDoc : updateDoc,
    deleteDoc : deleteDoc,
    copyDoc   : copyDoc,
    getDoc    : getDoc,
    getDocs   : getDocs,
    logout: logout
  };

  function initialize(credential) {
    var deferred = Q.defer();
    Couch.init(function() {
      server = new Couch.Server('http://localhost:5984', null, null);
      db = new Couch.Database(server, 'bpm-engine');
      auth(credential.userName, credential.password).then(function(result) {
        deferred.resolve(result);
      });
    });
    return deferred.promise;
  }

  function auth(user, pass) {
    var deferred = Q.defer();
    if(XMLHttpRequest) {
      var request = new XMLHttpRequest();
      if(request.withCredentials !== undefined) {
        request.open('POST', 'http://localhost:5984/_session', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.withCredentials = true;
        request.onreadystatechange = function() {
          if(request.readyState != 4) {
            return;
          }
          if(request.status == 200) {
            deferred.resolve(request.responseText);
          }
          else {
            deferred.reject(request.statusText);
          }
        };
        request.send('name=' + user + '&password=' + pass);
      }
    }
    return deferred.promise;
  }

  function logout() {
    var deferred = Q.defer();
    if(XMLHttpRequest) {
      var request = new XMLHttpRequest();
      if(request.withCredentials !== undefined) {
        request.open('DELETE', 'http://localhost:5984/_session', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.withCredentials = true;
        request.onreadystatechange = function() {
          if(request.readyState != 4) {
            return;
          }
          if(request.status == 200) {
            deferred.resolve(request.responseText);
          }
          else {
            deferred.reject(request.statusText);
          }
        };
        request.send();
      }
    }
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
