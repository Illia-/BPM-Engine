define([], function() {
  var self = {};
  self.initialize = function(callback) {
    Couch.init(function() {
      var server = new Couch.Server('http://localhost:5984', 'root', 'root');
      self.db = new Couch.Database(server, 'bpm-engine');
      callback();
    });
  };
  self.post = function(data, response) {
    self.db.post(data, response);
  };
  self.get = function(url, response) {
    self.db.get(url, response);
  };

  return {
    'initialize': self.initialize,
    'post'      : self.post,
    'get'       : self.get
  };
});