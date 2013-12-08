define([], function() {

  var db,
    baseUrl = 'http://localhost:5984',
    //baseUrl = 'http://5fee09f9.ngrok.com',
    dataBase = 'bpm-engine';

  return {
    initialize: initialize,
    createDoc : createDoc,
    updateDoc : updateDoc,
    deleteDoc : deleteDoc,
    copyDoc   : copyDoc,
    getDoc    : getDoc,
    getDocs   : getDocs,
    uploadFile: uploadFile

  };

  function initialize() {
    var deferred = Q.defer();
    Couch.init(function() {
      var server = new Couch.Server(baseUrl, null, null);
      db = new Couch.Database(server, dataBase);
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
        doc = response;
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


  function uploadFile(doc, file) {
    var deferred = Q.defer(),
      name = encodeURIComponent(file.name),
      type = file.type,
      fileReader = new FileReader(),
      request = new XMLHttpRequest();

    request.open('PUT', baseUrl + '/' + dataBase + '/' + encodeURIComponent(doc.id) + '/' + name + '?rev=' + doc.rev, true);
    request.setRequestHeader('Content-Type', type);
    request.withCredentials = true;

    fileReader.readAsArrayBuffer(file);
    fileReader.onload = function (readerEvent) {
      request.send(readerEvent.target.result);
    };
    request.onreadystatechange = function(response) {
      if (request.readyState == 4) {
        deferred.resolve(request.responseText);
      }
    };
    return deferred.promise;
  };
});





/*
window.onload = function() {
  var app = function() {
    var baseUrl = 'http://127.0.0.1:5984/playground/';
    var fileInput = document.forms['upload'].elements['file'];
    document.forms['upload'].onsubmit = function() {
      uploadFile('foo', fileInput.files[0]);
      return false;
    };

    var uploadFile = function(document, file) {
      var name = encodeURIComponent(file.name),
        type = file.type,
        fileReader = new FileReader(),
        getRequest = new XMLHttpRequest(),
        putRequest = new XMLHttpRequest();

      getRequest.open('GET',  baseUrl + encodeURIComponent(document),
        true);
      getRequest.send();

      getRequest.onreadystatechange = function(response) {
        if (getRequest.readyState == 4 && getRequest.status == 200) {
          var doc = JSON.parse(getRequest.responseText);
          putRequest.open('PUT', baseUrl +
            encodeURIComponent(document) + '/' +
            name + '?rev=' + doc._rev, true);
          putRequest.setRequestHeader('Content-Type', type);
          fileReader.readAsArrayBuffer(file);
          fileReader.onload = function (readerEvent) {
            putRequest.send(readerEvent.target.result);
          };
          putRequest.onreadystatechange = function(response) {
            if (putRequest.readyState == 4) {
              console.log(putRequest);
            }
          };
        }
      };
    };
  };
  app();
};
*/
