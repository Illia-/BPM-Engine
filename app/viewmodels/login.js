define(['services/appSecurity'],
  function(appSecurity) {
    var userName = ko.observable(),
      password = ko.observable();

    var viewModel = {
      userName   : userName,
      password   : password,
      appSecurity: appSecurity,

      /**
       * Login the user using forms auth
       */
      login      : function() {
        var credential = new appSecurity.credential(this.username(), this.password()),
          self = this;
        appSecurity.login(credential).then(function(data){
          console.log(data);
          appSecurity.user({IsAuthenticated: true, Username: data.value.login, Role: data.value.role});
          console.log(appSecurity.user());

          self.username('');
          self.password('');
        }).fail(function(){
            console.log('aaaa error');
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