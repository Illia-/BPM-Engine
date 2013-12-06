define(['services/appSecurity', 'couchDB'],
  function(appSecurity, db) {
    var userName = ko.observable(),
      password = ko.observable();

    var viewModel = {
      userName   : userName,
      password   : password,
      appSecurity: appSecurity,

      /**
       * Login the user using forms auth
       */
      login: function() {
        var credential = new appSecurity.Credential(this.userName(), this.password());

        appSecurity.user.name(this.userName());

        db.initialize(credential)
          .then(function() {
            appSecurity.isAuthenticated()
              .then(function(){
                console.log(appSecurity.user.role());
              });
          });
      },

      /**
       * Logout user
       */
      logout: function() {
        appSecurity.logout();
      }
    }
    return viewModel;

  });