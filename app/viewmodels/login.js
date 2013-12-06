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

        db.initialize(credential)
          .then(function() {
            appSecurity.isAuthenticated()
              .then(function(){
                console.log(appSecurity.user.role());
              });
          });

        /*.then(function(data){
         console.log(data);
         appSecurity.user({IsAuthenticated: true, Username: data.value.login, Role: data.value.role});
         console.log(appSecurity.user());

         self.userName('');
         self.password('');
         }).fail(function(){
         console.log('aaaa error');
         });
         */
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