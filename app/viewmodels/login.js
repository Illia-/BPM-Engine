define(['services/appSecurity','plugins/router'],
  function(appSecurity, router) {

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

        appSecurity.login(credential)
          .then(function(loginData) {
            appSecurity.user(loginData);
            userName('');
            password('');
          })
      },

      /**
       * Logout user
       */
      logout: function() {
        appSecurity.logout()
          .then(function() {
            appSecurity.user({name: null, roles: []});
            router.navigate('#');
          });
      }
    }
    return viewModel;

  });