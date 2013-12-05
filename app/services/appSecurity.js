/**
 * Authentication module for the entire application
 */
define(['dataContext'],
  function(dataContext) {

    var self = this;

    /**
     * Helper class for building credentials
     */
    var credential = function(userName, password) {
        this.userName = userName;
        this.password = password;
      },

      /** user data */
        user = ko.observable({IsAuthenticated: false, UserName: '', Role: ''});

    return {
      credential: credential,
      user      : user,

      /**
       * Check if an user is in a role
       */
      isUserInRole: function(roles) {
        var userInRole = false;
        $.each(roles, function(key, value) {
          if(self.user().Role == value) {
            userInRole = true;
          }
        });
        return userInRole;
      },

      /**
       * Sign in a user
       * @return {promise}
       */
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

      /**
       * Sign out an user
       * @method
       * @return {promise}
       */
      logout: function() {
        user({IsAuthenticated: false, UserName: '', Role: ''});
      }
    };
  });