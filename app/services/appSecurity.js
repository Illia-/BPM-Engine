/**
 * Authentication module for the entire application
 */
define([],
  function() {

    var self = {},
      baseUrl = 'http://localhost:5984';
      //baseUrl = 'http://5fee09f9.ngrok.com';

    /**
     * Helper class for building credentials
     */
    self.Credential = function(userName, password) {
      this.userName = userName;
      this.password = password;
    };

    /** user data */
    self.user = ko.observable({name: null, roles: []});

    /**
     * Check if an user is in a role
     */
    self.isUserInRole = function(roles) {
      var self = this,
        isUserInRole = false;
      $.each(roles, function(key, value) {
        if(self.user().roles.indexOf(value) != -1) {
          isUserInRole = true;
        }
      });
      return isUserInRole;
    };
    self._session = function(type, data) {
      var deferred = Q.defer();
      if(XMLHttpRequest) {
        var request = new XMLHttpRequest();
        if(request.withCredentials !== undefined) {
          request.open(type, baseUrl + '/_session', true);
          request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          request.withCredentials = true;
          request.onreadystatechange = function() {
            if(request.readyState != 4) {
              return;
            }
            if(request.status == 200) {
              deferred.resolve(JSON.parse(request.responseText));
            }
            else {
              deferred.reject(request.statusText);
            }
          };
          request.send(data);
        }
      }
      return deferred.promise;
    }

    self.isAuthenticated = function() {
      return self._session("GET", '');
    };
    /**
     * Sign out an user
     * @return {promise}
     */
    self.logout = function() {
      return self._session("DELETE", '');
    }

    self.login = function(credential) {
      console.log('appSecurity login');
      return self._session("POST", 'name=' + credential.userName + '&password=' + credential.password);
    }

    return {
      Credential     : self.Credential,
      user           : self.user,
      isAuthenticated: self.isAuthenticated,
      logout         : self.logout,
      login          : self.login,
      isUserInRole   : self.isUserInRole
    };

  })
;