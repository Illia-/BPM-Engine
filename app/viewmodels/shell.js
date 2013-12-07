define(['plugins/router', 'services/appSecurity', 'viewmodels/login'],
  function(router, appSecurity, login) {

    var viewModel = kendo.observable({
      isVisible       : true,
      onSelect        : function(e) {
        var text = $(e.item).children(".k-link").text();
        kendoConsole.log("event :: select(" + text + ")");
      },
      router          : router,
      activate        : activate,
      appSecurity     : appSecurity,
      wrongPermissions: ko.observable(false),
      login: login
    });

    return viewModel;

    function activate() {
      // If the route has the authorize flag and the user is not logged in => navigate to login view
      router.guardRoute = function(instance, instruction) {

        if(instruction.config.authorize) {
          if(!appSecurity.user().name) {
            return "#login";
          }
          if(!appSecurity.isUserInRole(instruction.config.authorize)) {

            return "#login?redirectto=" + instruction.fragment;
          }
          return true
        }

        return true;
      }
      router.map([
        { route: '', moduleId: 'viewmodels/aboutProject', title: 'BPM engine'},
        { route: 'login', moduleId: 'viewmodels/login', title: 'Login', nav: false},
        //for user
        { route: 'user/info', moduleId: 'viewmodels/user/info', title: 'Main page', nav: 1, authorize: ["user"]},
        { route: 'user/createCard', moduleId: 'viewmodels/user/createCard', title: 'Create Card', nav: 2, authorize: ["user"]},
        //for admin
        { route: 'admin/panel', moduleId: 'admin/panel', title: 'Work space', nav: false},

        { route: 'start', moduleId: 'viewmodels/start', title: 'testStart', nav: false}
      ]).buildNavigationModel();

      //dynamically generating our navigation structure based on the router's navigationModel array
      return router.activate();
    }

  });
