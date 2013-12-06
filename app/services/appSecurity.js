/**
 * Authentication module for the entire application
 */
define(['couchDB'],
  function(db) {

    var self = {};

    /**
     * Helper class for building credentials
     */
    self.Credential = function(userName, password) {
      //self.user.name(userName);
      this.userName = userName;
      this.password = password;
    };

    /** user data */
    self.user = {name: ko.observable(''),
      role           : ko.observable('')};

    /**
     * Check if an user is in a role
     */
    self.isUserInRole = function(roles) {
      var self = this,
        isUserInRole = false;
      $.each(roles, function(key, value) {
        if(self.user().Roles.indexOf(value) != -1) {
          isUserInRole = true;
        }
      });
      return isUserInRole;
    };

    self.isAuthenticated = function() {
      var deferred = Q.defer();
      db.checkConnection('')
        .then(function() {
          db.getUserRoles(self.user.name())
            .then(function(roles) {
              self.user.role(roles[0]);
              deferred.resolve();
            })
        })
        .fail(function() {
          deferred.reject();
        });
      return deferred.promise;
    };
    /**
     * Sign out an user
     * @method
     * @return {promise}
     */
    self.logout = function() {
      self.user.name('');
      self.user.role('');
    }

    return {
      Credential     : self.Credential,
      user           : self.user,
      isAuthenticated: self.isAuthenticated,
      logout         : self.logout

    };

  });