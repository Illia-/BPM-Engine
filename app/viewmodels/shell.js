define(['plugins/router', 'services/appSecurity'],
  function(router, appSecurity) {

    var viewModel = kendo.observable({
      isVisible       : true,
      onSelect        : function(e) {
        var text = $(e.item).children(".k-link").text();
        kendoConsole.log("event :: select(" + text + ")");
      },
      router          : router,
      activate        : activate,
      appSecurity     : appSecurity,
      wrongPermissions: ko.observable(false)
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
        { route: 'login', moduleId: 'viewmodels/login', title: 'Login', nav: 1 },
        //for user
        { route: 'user/main', moduleId: 'viewmodels/user/main', title: 'Main page', nav: 2, authorize: ["user"]},
        //for admin
        { route: 'admin/panel', moduleId: 'admin/panel', title: 'Work space', nav: false, authorize: ["user"] },
        { route: 'start', moduleId: 'viewmodels/start', title: 'testStart', nav: 1 }
      ]).buildNavigationModel();

      //dynamically generating our navigation structure based on the router's navigationModel array
      return router.activate();
    }

  });
