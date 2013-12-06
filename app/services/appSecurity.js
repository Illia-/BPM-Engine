/**
 * Authentication module for the entire application
 */
define(['dataContext'],
  function(dataContext) {

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
      dataContext.get("_security", function(data) {
        if(typeof data.admins !== "undefined") {
          var index = data.admins.names.indexOf(self.user.name());
          if(index != -1) {
            self.user.role(data.admins.roles[index]);
            deferred.resolve();
          }
          else {
            deferred.reject();
          }
        }
        else {
          deferred.reject();
        }
      });
      return deferred.promise;
    };
    /**
     * Sign in a user
     * @return {promise}
     */
    /*
     login: function(credential) {
     var deferred = Q.defer();
     dataContext.get('_design/auth/_view/login?startkey=["' + credential.userName + '","' + credential.password + '"]&endkey=["' + credential.userName + '","' + credential.password + '"]',
     function(resp) {
     if(typeof resp.rows[0] !== 'undefined') {
     deferred.resolve(resp.rows[0]);
     }
     else {
     deferred.reject();
     }
     });
     return deferred.promise;
     },
     */
    /**
     * Sign out an user
     * @method
     * @return {promise}
     */
    self.logout = function() {
      self.user({IsAuthenticated: false, UserName: '', Role: ''});
    }

    return {
      credential     : self.credential,
      user           : self.user,
      isAuthenticated: self.isAuthenticated

    };

  });